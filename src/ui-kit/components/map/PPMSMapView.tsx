import React, { useRef, useEffect, useState } from "react";
import PPMSCardGroup from "../common/card/PPMS-card-group";
import PPMSCard from "../common/card/PPMS-card";
import PPMSCardHeader from "../common/card/PPMS-card-header";
import { FaMapMarkerAlt } from "react-icons/fa";
import PPMSCardBody from "../common/card/PPMS-card-body";
import { isEmptyCheck } from "../validations/FieldValidations";
import { generateCoordinatesCall } from "../../../app/sales/management-pbs-doi/lot-details/property/common/constants/Utils";
import { MapLoader } from "./common/MapLoader";

interface MapLocation {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
}
interface MapViewProps {
  id: string;
  header: string;
  location: MapLocation;
}

// hooks allow us to create a map component as a function
function PPMSMapView(props: MapViewProps) {
  // create a ref to element to be used as the map's container
  const mapEl = useRef(null);

  const [latitude, setLatitude] = useState<number>(props?.location?.latitude);

  const [longtitude, setLongtitude] = useState<number>(
    props?.location?.longitude
  );

  const [location, setLocation] = useState<string>("");

  const getAddressElement = () => {
    const line4 = `${props.location?.city}, ${props.location?.state} ${props.location?.zipCode}`;
    return (
      <div>
        <div>
          <b>Address :</b>
        </div>
        <div>{props?.location?.addressLine1}</div>
        <div>{props?.location?.addressLine2}</div>
        <div>{props?.location?.addressLine3}</div>
        <div>{line4}</div>
      </div>
    );
  };

  const setCoordinates = async (): Promise<void> => {
    let addressLine1: string = !isEmptyCheck(
      props.location?.addressLine1?.trim()
    )
      ? `${props.location?.addressLine1?.trim()},`
      : "";
    let addressLine2: string = !isEmptyCheck(
      props.location?.addressLine2?.trim()
    )
      ? `${props.location?.addressLine2?.trim()},`
      : "";
    let addressLine3: string = !isEmptyCheck(
      props.location?.addressLine3?.trim()
    )
      ? `${props.location?.addressLine3?.trim()},`
      : "";
    let city: string = !isEmptyCheck(props.location?.city?.trim())
      ? `${props.location?.city?.trim()},`
      : "";
    let state: string = !isEmptyCheck(props.location?.state?.trim())
      ? `${props.location?.state?.trim()},`
      : "";
    let zipCode: string = !isEmptyCheck(props.location?.zipCode?.trim())
      ? `${props.location?.zipCode?.trim()}`
      : "";
    const location: string = `${addressLine1} ${addressLine2} ${addressLine3} ${city} ${state} ${zipCode}`;
    setLocation(location);
    setLatitude(props?.location?.latitude);
    setLongtitude(props?.location?.longitude);
  };

  const addGraphics = (Graphic, view) => {
    const point = {
      type: "point", // autocasts as new Point()
      longitude: longtitude,
      latitude: latitude,
    };

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };

    const popupTemplate = {
      title: "Property Location",
      content: `<div class='map_view_content'>${location}</div>`,
    };

    let pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
      popupTemplate: popupTemplate,
    });

    view.graphics.addMany([pointGraphic]);
  };

  useEffect(() => {
    setCoordinates();
  }, [props.location]);

  // use a side effect to create the map after react has rendered the DOM
  useEffect(
    () => {
      // define the view here so it can be referenced in the clean up function
      let view;
      MapLoader.load(["esri/views/MapView", "esri/Map", "esri/Graphic"], {
        css: true,
      }).then(async ([MapView, Map, Graphic]) => {
        view = await getMapView(MapView, Map, Graphic);
      });
      return () => {
        // clean up the map view
        if (!!view) {
          view.destroy();
          view = null;
        }
      };
    },
    // only re-load the map if the id has changed
    [latitude, longtitude]
  );

  const getMapView = async (MapView, Map, Graphic) => {
    // then we load a web map from an id
    const map = new Map({
      basemap: "streets-navigation-vector",
      // autocasts as new PortalItem()
      portalItem: {
        // get item id from the props
        id: props.id,
      },
    });

    // and we show that map in a container
    let view = new MapView({
      map: map,
      // use the ref as a container
      container: mapEl.current,
      center: [longtitude, latitude],
      zoom: 12,
      popup: {
        collapseEnabled: false,
        dockEnabled: false,
        dockOptions: {
          // Disables the dock button from the popup
          buttonEnabled: false,
          // Ignore the default sizes that trigger responsive docking
          breakpoint: false,
        },
      },
    });
    if (props.location) {
      const locationIsEmpty = !Object.values(props.location).some(
        (x) => x !== null && x !== ""
      );

      if (!locationIsEmpty) addGraphics(Graphic, view);
    }
    return view;
  };

  return (
    <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
      <PPMSCard className={"ppms-widget ppms-sub-widget"}>
        <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
          <i className="fas head-icon">{<FaMapMarkerAlt />}</i> {props.header}
        </PPMSCardHeader>
        <PPMSCardBody className={"card-height supporting-details"}>
          <>
            {getAddressElement()}
            <div style={{ height: 400 }} ref={mapEl} />
          </>
        </PPMSCardBody>
      </PPMSCard>
    </PPMSCardGroup>
  );
}

export default PPMSMapView;
