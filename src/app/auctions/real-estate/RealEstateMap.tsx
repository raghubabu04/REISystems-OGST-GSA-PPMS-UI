import React, { useEffect, useRef, useState } from "react";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import { FaMapMarkerAlt } from "react-icons/fa";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import { Map } from "@esri/react-arcgis";
import { MapLoader } from "../../../ui-kit/components/map/common/MapLoader";
import { PageHelper, Paths } from "../../Router";

interface MapProps {
  auctionURL: string;
}

const RealEstateMap = (props: MapProps) => {
  const { auctionURL } = props;
  const infoEl = useRef(null);
  const [view, updateView] = useState(null);
  const [cursor, updateCursor] = useState("default");
  const [layer, setLayer] = useState(null);
  const [layerView, setLayerView] = useState(null);
  const [toggleLabel, updateToggleLabel] = useState("Disable Clustering");
  const popupAction = {
    title: "More details",
    id: "more-details",
    className: "esri-icon-handle-horizontal popup-more",
  };
  const popupContent = {
    title: "Lot {lotNumber}",
    content: [
      {
        type: "media", // MediaContentElement
        mediaInfos: [
          {
            value: {
              sourceURL: "{preSignedURI}",
            },
          },
        ],
      },
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "salesNumber",
            label: "Sales Number",
            visible: true,
          },
          {
            fieldName: "lotName",
            label: "Lot Name",
            visible: true,
          },
          {
            fieldName: "startDate",
            label: "Starting Date",
            visible: true,
          },
          {
            fieldName: "endDate",
            label: "Closing Date",
            visible: true,
          },
        ],
      },
    ],
    actions: [popupAction],
  };
  const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px",
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [
      {
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')",
        },
        symbol: {
          type: "text",
          color: "#0050d8",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px",
          },
        },
        labelPlacement: "center-center",
      },
    ],
  };
  const uniqueValuesByStatus = {
    type: "unique-value",
    field: "status",
    uniqueValueInfos: [
      {
        value: "Active",
        symbol: {
          type: "simple-marker",
          color: "#04c585",
          outline: {
            color: "rgba(0,174,119,0.5)",
            width: 2,
          },
        },
        label: "Active", // displayed in the Legend widget
      },
      {
        value: "Preview",
        symbol: {
          type: "simple-marker",
          color: "#00bde3",
          outline: {
            color: "rgba(0, 139, 174, 0.5)",
            width: 2,
          },
        },
        label: "Preview", // displayed in the Legend widget
      },
      {
        value: "Last Call",
        symbol: {
          type: "simple-marker",
          color: "#e52207",
          outline: {
            color: "rgba(174,0,61,0.5)",
            width: 2,
          },
        },
        label: "Last Call", // displayed in the Legend widget
      },
      {
        value: "Closed",
        symbol: {
          type: "simple-marker",
          color: "#565c65",
          outline: {
            color: "rgba(0,10,10,0.5)",
            width: 2,
          },
        },
        label: "Closed", // displayed in the Legend widget
      },
    ],
    legendOptions: {
      title: "Status",
    },
  };
  useEffect(() => {
    MapLoader.load(["esri/layers/GeoJSONLayer"])
      .then(([GeoJSONLayer]) => {
        const layer = new GeoJSONLayer({
          title: "Real Estate Listings",
          url: auctionURL,
          copyright: "GSA PPMS",
          featureReduction: clusterConfig,
          outFields: ["*"],
          popupTemplate: popupContent,
          renderer: uniqueValuesByStatus,
        });
        setLayer(layer);
      })
      .catch((err) => console.error(err));

    return function cleanup() {
      //cleanup goes here
    };
  }, []);
  const handleMapLoad = (map, view) => {
    view.on("pointer-move", function (event) {
      view.hitTest(event, { exclude: view.graphics }).then(function (response) {
        if (response.results.length === 2) {
          updateCursor("pointer");
        } else {
          updateCursor("default");
        }
      });
    });
    view.popup.on("trigger-action", function (event) {
      if (event.action.id === "more-details") {
        PageHelper.openPage(
          `${Paths.previewAuctions}/${view.popup.selectedFeature.attributes.auctionId}`
        );
      }
    });
    updateView(view);
    map.layers.push(layer);
    MapLoader.load([
      "esri/widgets/Expand",
      "esri/widgets/Home",
      "esri/smartMapping/labels/clusters",
      "esri/smartMapping/popup/clusters",
    ])
      .then(([Expand, Home, clusterLabelCreator, clusterPopupCreator]) => {
        const expand = new Expand({
          view: view,
          content: infoEl.current,
          expandIconClass: "esri-icon-layer-list",
          expanded: false,
        });
        const home = new Home({
          view: view,
        });

        function isWithinScaleThreshold() {
          return view.scale > 50000;
        }
        async function generateClusterConfig(layer) {
          // generates default labelingInfo
          const {
            labelingInfo,
            clusterMinSize,
          } = await clusterLabelCreator
            .getLabelSchemes({ layer, view })
            .then((labelSchemes) => labelSchemes.primaryScheme);

          return {
            type: "cluster",
            labelingInfo,
            clusterMinSize,
          };
        }
        layer
          .when()
          .then(generateClusterConfig)
          .then((featureReduction) => {
            layer.featureReduction = featureReduction;
            view.whenLayerView(layer).then((layerView) => {
              setLayerView(layerView);
              view.popup.close();
            });

            view.watch("scale", (scale) => {
              if (toggleLabel === "Disable Clustering") {
                if (isWithinScaleThreshold()) {
                  updateToggleLabel("Disable Clustering");
                } else {
                  updateToggleLabel("Enable Clustering");
                }
                layer.featureReduction = isWithinScaleThreshold()
                  ? featureReduction
                  : null;
              }
            });
          })
          .catch((error) => {
            console.error(error);
          });
        view.ui.add(expand, "top-left");
        view.ui.add(home, "top-left");
      })
      .catch((err) => console.error(err));
  };
  const onFilter = (event) => {
    const newValue = event.target.value;
    const whereClause = newValue ? `status = '${newValue}'` : null;
    layerView.filter = {
      where: whereClause,
    };
    view.popup.close();
  };
  const handleFail = (error) => {
    console.error(error);
  };
  const onToggleCluster = () => {
    let fr = layer.featureReduction;
    layer.featureReduction = fr && fr.type === "cluster" ? null : clusterConfig;
    toggleLabel === "Enable Clustering"
      ? updateToggleLabel("Disable Clustering")
      : updateToggleLabel("Enable Clustering");
  };
  const ToggleCluster = () => (
    <div id="infoDiv" style={{ padding: "10px" }} className="esri-widget">
      <button id="cluster" className="esri-button" onClick={onToggleCluster}>
        {toggleLabel}
      </button>
      <div id="legendDiv" />
    </div>
  );

  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard className={"ppms-widget ppms-sub-widget"}>
          <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header real-estate-header">
            <i className="fas head-icon">
              {<FaMapMarkerAlt color={"#ffffff"} />}
            </i>{" "}
            {"Real Estate Auctions Map"}
          </PPMSCardHeader>
          <PPMSCardBody className={"card-height supporting-details"}>
            <>
              <Map
                style={{ height: 450, cursor: cursor }}
                className={"full-screen-map"}
                mapProperties={{ basemap: "streets-navigation-vector" }}
                viewProperties={{
                  center: [-98.35, 39.5],
                  zoom: 3,
                  popup: {
                    collapseEnabled: false,
                    dockEnabled: false,
                    dockOptions: {
                      buttonEnabled: false,
                      breakpoint: false,
                    },
                  },
                }}
                onLoad={handleMapLoad}
                onFail={handleFail}
              />
              <div
                id="infoDiv"
                className="esri-widget"
                ref={infoEl}
                style={{ padding: "15px", width: "max-content" }}
              >
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col-auto"}>
                    <strong>Filter by Auction Status:</strong>
                    <select
                      id="filter"
                      className="esri-select"
                      onChange={onFilter}
                    >
                      <option value="">All</option>
                      <option value="Active">Active</option>
                      <option value="LastCall">Last Call</option>
                      <option value="Preview">Preview</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div id={"legendDiv"} className={"grid-row grid-gap-4"}>
                <div className={"grid-col-auto"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-auto"}>
                      <span className="flex-auto">
                        <span className="legend-items bg-mint" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className={"grid-col-auto"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-auto"}>
                      <span className="flex-auto">
                        <span className="legend-items bg-accent-cool" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className={"grid-col-auto"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-auto"}>
                      <span className="flex-auto">
                        <span className="legend-items bg-red" />
                        Last Call
                      </span>
                    </div>
                  </div>
                </div>
                <div className={"grid-col-auto"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-auto"}>
                      <span className="flex-auto">
                        <span className="legend-items bg-base-dark" />
                        Closed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
};

export default RealEstateMap;
