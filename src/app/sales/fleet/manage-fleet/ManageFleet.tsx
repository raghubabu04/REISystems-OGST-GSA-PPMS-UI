import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { MdEdit } from "react-icons/md";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSCheckbox } from "../../../../ui-kit/components/common/form/PPMS-checkbox";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { ManageFleetDefaultState, ManageFleetState } from "./ManageFleetState";
import { zoneValues } from "./Constants";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { EditableCell } from "./manageFleet-editableCell";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { PageHelper, Paths } from "../../../Router";
import { formatEditableCellNumber } from "../constants/Constants";
import { UserUtils } from "../../../../utils/UserUtils";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { isEmpty } from "lodash";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { EditableDateCell } from "./editableDateCell";
import { SelectColumnFilter } from "../../../../ui-kit/components/common/datatable/Filters";
import { PPMSDropdown } from "../../../../ui-kit/components/common/form/PPMS-dropdown";
import { PPMSLabel } from "../../../../ui-kit/components/common/form/PPMS-label";

interface ManageFleetProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

let ids = [];
let notsubmittedVins = [];

function ManageFleetList(props: ManageFleetProps) {
  const [manageFleetList, setManageFleetListState] = useState<ManageFleetState>(
    ManageFleetDefaultState
  );
  const [sendAuctionSaveDisable, setsendAuctionSaveDisable] = useState<boolean>(
    false
  );
  const { addToast } = props.actions;

  const updateManageFleetList = (newState: any) => {
    setManageFleetListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  };

  const salesAPIService = new SalesApiService();
  const commonApiService = new CommonApiService();

  const yesOrNoOptions = [
    { value: "Yes", id: "Y", isSelected: false },
    { value: "No", id: "N", isSelected: false },
  ];

  useEffect(() => {
    let zoneData = {
      zoneIds: "12,13,14,15",
    };
    let zoneRegions = [];

    commonApiService
      .getRegionsForZones(zoneData)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.toString().split("-")[0].trim());
        });
        let state = manageFleetList;
        state.zone.selectedZone = state.zone.zoneList[0];
        state.zone.zoneRegions = zoneRegions;
        state.zone.isZoneEmpty = false;
        state.zone.isZonesPresent = true;
        state.zone.validationMessage = "";
        updateManageFleetList(state);
        let tabledata = {
          regionCodes: state.zone.zoneRegions ? state.zone.zoneRegions : null,
          params: {
            page: 1,
            size: manageFleetList.perPage,
          },
        };
        makeApiCall(tabledata);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function makeApiCall(data) {
    if (manageFleetList.zone.isZonesPresent) {
      salesAPIService
        .getFleetItems(data)
        .then((response: any) => {
          let filteredRows = [];
          for (let reportlist of response.data.fleetSalesDTOResultList) {
            let row = {
              salesId: reportlist.salesId,
              salesNumber: reportlist.salesNumber,
              saleStartDate: reportlist.saleStartDate
                ? moment(reportlist.saleStartDate).format("MM/DD/YYYY")
                : "",
              saleEndDate: reportlist.saleEndDate
                ? moment(reportlist.saleEndDate).format("MM/DD/YYYY")
                : "",
              lotId: reportlist.lotId,
              lotStatus: reportlist.lotStatus,
              fmslotItemId: reportlist.fmslotItemId,
              vin: reportlist.vin,
              year: reportlist.year,
              make: reportlist.make,
              model: reportlist.model,
              fsc: reportlist.fsc,
              startingBid: reportlist.startingBid
                ? formatEditableCellNumber(reportlist.startingBid)
                : "",
              reservePrice: reportlist.reservePrice
                ? formatEditableCellNumber(reportlist.reservePrice)
                : "",
              salvageScrap: reportlist.salvageScrap,
              featuredItem: reportlist.featuredItem,
              bid: reportlist.bid,
              submitted: reportlist.submitted,
            };
            filteredRows.push(row);
          }
          let totalElements =
            response && response.data && response.data.totalElements
              ? response.data.totalElements
              : 0;
          let totalPages =
            response && response.data && response.data.totalPages
              ? response.data.totalPages
              : 0;
          updateManageFleetList({
            filteredItems: filteredRows,
            totalRows: totalElements,
            totalPages: totalPages,
            loading: false,
          });
        })
        .catch((error) => {
          updateManageFleetList({ loading: false });
        });
    }
  }

  function getFleetList(filters: any) {
    updateManageFleetList({
      loading: true,
    });
    let salesNumber;
    let vin;
    let year;
    let make;
    let model;
    let fsc;
    let startingBid;
    let reservePrice;
    let salvageScrap;
    let featuredItem;

    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].id) {
        case "salesNumber":
          salesNumber = filters[i]["value"];
          break;
        case "vin":
          vin = filters[i]["value"];
          break;
        case "year":
          year = filters[i]["value"];
          break;
        case "make":
          make = filters[i]["value"];
          break;
        case "model":
          model = filters[i]["value"];
          break;
        case "fsc":
          fsc = filters[i]["value"];
          break;
        case "startingBid":
          startingBid = filters[i]["value"];
          break;
        case "reservePrice":
          reservePrice = filters[i]["value"];
          break;
        case "salvageScrap":
          salvageScrap = filters[i]["value"];
          break;
        case "featuredItem":
          featuredItem = filters[i]["value"];
          break;
      }
    }

    let data = {
      salesNumber: salesNumber ? salesNumber : "",
      vin: vin ? vin : "",
      year: year ? year : null,
      make: make ? make : "",
      model: model ? model : "",
      fsc: fsc ? fsc : "",
      startingBid: startingBid ? startingBid : null,
      reservePrice: reservePrice ? reservePrice : null,
      salvageScrap: salvageScrap ? salvageScrap : "",
      featuredItem: featuredItem ? featuredItem : "",
      regionCodes: manageFleetList.zone.zoneRegions
        ? manageFleetList.zone.zoneRegions
        : null,
      bid: manageFleetList.bid ? manageFleetList.bid : false,
      params: {
        page: 1,
        size: manageFleetList.perPage,
      },
    };
    if (manageFleetList.sort) {
      data.params["sort"] = manageFleetList.sort;
    }

    updateManageFleetList({
      salesNumberFilter: salesNumber,
      vinFilter: vin,
      yearFilter: year,
      makeFilter: make,
      modelFilter: model,
      fscFilter: fsc,
      startingBidFilter: startingBid,
      reservePriceFilter: reservePrice,
      salvageFilter: salvageScrap,
      featuredItemFilter: featuredItem,
      regionCodes: manageFleetList.zone.zoneRegions,
      bid: manageFleetList.bid,
    });
    makeApiCall(data);
  }

  function onPressUpdate() {
    let updatedItems = [];
    for (let item of manageFleetList.filteredItems) {
      let row = {
        salesNumber: item.salesNumber,
        salesId: item.salesId,
        lotId: item.lotId,
        fmslotItemId: item.fmslotItemId,
        startingBid: item.startingBid
          ? item.startingBid.replaceAll(",", "")
          : "",
        reservePrice: item.reservePrice
          ? item.reservePrice.replaceAll(",", "")
          : "",
        salvageScrap: item.salvageScrap,
        featuredItem: item.featuredItem,
      };
      if (!item.bid) {
        updatedItems.push(row);
      }
    }
    salesAPIService
      .updateFleetItems(updatedItems)
      .then((response: any) => {
        for (let item of response.data) {
          if (item.fleetSalesDTO.rejectedForFeaturedItem) {
            addToast({
              text: `Sale number: ${item.fleetSalesDTO.salesNumber} - Reached maximum limit, cannot add the item to the featured list.`,
              type: "error",
              heading: "Error",
            });
          }
        }
        let tabledata = {
          regionCodes: manageFleetList.zone.zoneRegions
            ? manageFleetList.zone.zoneRegions
            : null,
          params: {
            page: manageFleetList.currentPage,
            size: manageFleetList.perPage,
          },
        };
        addToast({
          text: "Data successfully saved",
          type: "success",
          heading: "Success",
        });
        makeApiCall(tabledata);
      })
      .catch((error) => {
        addToast({
          text: "Error saving data",
          type: "error",
          heading: "Error",
        });
        updateManageFleetList({ loading: false });
      });
  }

  function updateSalvageScrap(lotId: any) {
    let filteredItems = manageFleetList.filteredItems;
    filteredItems.forEach((row) => {
      if (row.lotId === lotId) {
        row.salvageScrap = !row.salvageScrap;
      }
    });
    updateManageFleetList({
      filteredItems: filteredItems,
    });
  }

  function updateFeaturedItem(lotId: any) {
    let filteredItems = manageFleetList.filteredItems;
    filteredItems.forEach((row) => {
      if (row.lotId === lotId) {
        row.featuredItem = !row.featuredItem;
      }
    });
    updateManageFleetList({
      filteredItems: filteredItems,
    });
  }

  function updateState(id: any, lotId: any, value: any) {
    let filteredItems = manageFleetList.filteredItems;
    filteredItems.forEach((row) => {
      if (row.lotId === lotId) {
        if (id === "reservePrice") {
          row.reservePrice = value;
        }
        if (id === "startingBid") {
          row.startingBid = value;
        }
      }
    });
    updateManageFleetList({
      filteredItems: filteredItems,
    });
  }

  const columns = [
    {
      id: "selection",
      width: "50",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <div>
          <PPMSCheckbox
            id={"select-all-rows"}
            name={`select-all-rows`}
            label={""}
            isInvalid={false}
            {...getToggleAllPageRowsSelectedProps()}
          />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => {
        return (
          <>
            {row.values.lotId && (
              <div>
                <PPMSCheckbox
                  id={`${row.values.lotId}-checkbox`}
                  name={`${row.values.lotId}-checkbox`}
                  label={""}
                  disabled={row.values.lotStatus !== "Lotted" ? true : false}
                  isInvalid={false}
                  {...row.getToggleRowSelectedProps()}
                />
              </div>
            )}
          </>
        );
      },
    },
    {
      Header: "",
      accessor: "salesNumber",
    },
    {
      Header: "Lot Id",
      accessor: "lotId",
      filter: "search",
    },
    {
      Header: "Lot Status",
      accessor: "lotStatus",
      filter: "search",
    },
    {
      Header: "Fms Lot Id",
      accessor: "fmslotItemId",
      filter: "search",
    },
    {
      Header: "VIN",
      accessor: "vin",
      filter: "search",
      Cell: (lotItems) => (
        <>
          <div className="padding-top-2">
            <span className="sale-data-table">{lotItems.row.values.vin}</span>
          </div>
        </>
      ),
      Aggregated: (data) => {
        return (
          <>
            <div className="padding-top-0">
              <PPMSLabel
                htmlFor={"sale-title"}
                className={"text-bold"}
                srOnly={false}
              >
                Sale Number
              </PPMSLabel>
              <span className={"sale-data-table"}>
                {data.row.subRows[0].original.salesNumber}
              </span>
            </div>
          </>
        );
      },
    },
    {
      Header: "Year",
      accessor: "year",
      filter: "search",
      Cell: (lotItems) => (
        <>
          <div className="padding-top-2">
            <span className="sale-data-table">{lotItems.row.values.year}</span>
          </div>
        </>
      ),
      Aggregated: (data) => {
        return <EditableDateCell data={data} updateData />;
      },
      width: 3200,
      minWidth: 3200,
    },
    {
      Header: "Make",
      accessor: "make",
      filter: "search",
      Cell: (lotItems) => (
        <>
          <div className="padding-top-2">
            <span className="sale-data-table">{lotItems.row.values.make}</span>
          </div>
        </>
      ),
      width: 2000,
      minWidth: 2000,
      Aggregated: (data) => {
        return (
          <PPMSInput
            id={`endDate-${data.row.subRows[0].original.salesNumber}`}
            value={data.row.subRows[0].original.saleEndDate}
            inputType={"text"}
            isRequired={true}
            label={"Sale End Date"}
            labelBold={true}
            isDisabled={true}
          />
        );
      },
    },
    {
      Header: "Model",
      accessor: "model",
      Cell: (lotItems) => (
        <>
          <div className="padding-top-2">
            <span className="sale-data-table">{lotItems.row.values.model}</span>
          </div>
        </>
      ),
      filter: "search",
      maxWidth: 50,
    },
    {
      Header: "FSC",
      accessor: "fsc",
      Cell: (lotItems) => (
        <>
          <div className="padding-top-2 sale-date-picker">
            <span className="sale-data-table">{lotItems.row.values.fsc}</span>
          </div>
        </>
      ),
      filter: "search",
    },
    {
      Header: "Starting Bid",
      accessor: "startingBid",
      Cell: EditableCell,
      filter: "search",
      width: 1000,
      minWidth: 1000,
    },
    {
      Header: "Reserve Price",
      accessor: "reservePrice",
      Cell: EditableCell,
      filter: "search",
      width: 1000,
      minWidth: 1000,
    },
    {
      Header: "Bid",
      accessor: "bid",
      filter: "search",
    },
    {
      Header: "Submitted",
      accessor: "submitted",
      filter: "search",
    },
    {
      Header: "Salvage/ Scrap",
      accessor: "salvageScrap",
      width: 10,
      maxWidth: 10,
      Cell: (event) => (
        <>
          {event.row.values.lotId && (
            <PPMSCheckbox
              name={`${event.row.values.lotId}-salvageScrapCheckbox`}
              value={event.row.values.salvageScrap}
              id={`${event.row.values.lotId}-salvageScrapCheckbox`}
              key={`${event.row.values.lotId}-salvageScrapCheckbox`}
              checked={event.row.values.salvageScrap ? true : false}
              disabled={event.row.values.bid}
              label={""}
              onChange={() => {
                updateSalvageScrap(event.row.values.lotId);
              }}
              isInvalid={false}
            />
          )}
        </>
      ),
      filter: "search",
    },
    {
      Header: "Featured Item",
      accessor: "featuredItem",
      Cell: (event) => (
        <>
          {event.row.values.lotId && (
            <PPMSCheckbox
              name={`${event.row.values.lotId}-featuredItemCheckbox`}
              value={event.row.values.salvageScrap}
              id={`${event.row.values.lotId}-featuredItemCheckbox`}
              key={`${event.row.values.lotId}-featuredItemCheckbox`}
              checked={event.row.values.featuredItem ? true : false}
              label={""}
              onChange={() => {
                updateFeaturedItem(event.row.values.lotId);
              }}
              isInvalid={false}
              disabled={
                event.row.values.bid ||
                !UserUtils.isUserFleetAdmin() ||
                !(
                  event.row.values.lotStatus === "Active" ||
                  event.row.values.lotStatus === "Preview"
                )
              }
            />
          )}
        </>
      ),
      filter: "search",
    },
    {
      Header: "Actions",
      id: "actions",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer" />
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  let filter = {};
                  filter["id"] = column.id;
                  filter["value"] = column["filterValue"];
                  filters.push(filter);
                });
                getFleetList(filters);
              }}
              label={"Search"}
            />
            <PPMSButton
              id={"clear-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  column.setFilter("");
                });
                getFleetList(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },

      Cell: (lot) => {
        let fleetListInfo = lot.row.values;
        return (
          <>
            {fleetListInfo.lotId && (
              <>
                <div className="padding-top-2">
                  <PPMSButton
                    variant={"secondary"}
                    label={"Edit"}
                    icon={<MdEdit />}
                    size={"sm"}
                    isDisabled={fleetListInfo.bid}
                    onPress={() =>
                      PageHelper.openPage(
                        Paths.editFleet + "/" + fleetListInfo.lotId
                      )
                    }
                    id={`edit-fleet-${fleetListInfo.lotId}`}
                  />
                </div>
              </>
            )}
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: false, // change to false
    },
  ];

  const renderUpdateButtons = () => {
    return (
      <div className="grid-row-col fleetUpdateButton">
        <PPMSButton id={"update"} onPress={onPressUpdate} label={"Update"} />
        <PPMSButton
          id={"send-to-gsa-auctions"}
          onPress={() => {
            if(!isEmpty(notsubmittedVins)){
              if(notsubmittedVins.length <= 3){
                addToast({
                  text: "The lots with vins " + notsubmittedVins.toString() + " have to be submitted before sent to Auction",
                  type: "warning",
                  heading: "Warning",
                });
              }
              else{
                addToast({
                  text: "The lots with vins " + notsubmittedVins.slice(0,3).toString() + " ... have to be submitted before sent to Auction",
                  type: "warning",
                  heading: "Warning",
                });
              }
            }
            if (!isEmpty(ids)) {
              manageFleetList.showSendtoGSAAuctionModal = true;
              updateManageFleetList(manageFleetList);
            }
          }}
          label={"Send to GSA Auctions"}
        />
      </div>
    );
  };

  const setSelectedRows = (selectedFlatRows: any[]) => {
    const selectedLotIds = selectedFlatRows
      .filter((item: any) => item.values.lotStatus === "Lotted" && item.values.submitted && item.values.lotId !== null)
      .map((item) => item.values.lotId);
    ids = selectedLotIds;
    console.log("selected lotids are " + ids);
    const notSubmitted = selectedFlatRows
      .filter((item: any) => !item.values.submitted && item.values.vin !== null)
      .map((item) => item.values.vin);
    notsubmittedVins = notSubmitted;
    console.log("not submitted vins are " + notsubmittedVins);
  };

  function handleSort(sortBy) {
    updateManageFleetList({
      loading: true,
    });
    if (sortBy) {
      if (sortBy.id === "salvageScrap") {
        sortBy.id = "isSalvageScrap";
      } else if (sortBy.id === "featuredItem") {
        sortBy.id = "isFeaturedItem";
      }
    }
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;

    updateManageFleetList({ sort: sort });
    //Preserve search results while sorting
    let data = {
      vin: manageFleetList.vin,
      year: manageFleetList.year,
      make: manageFleetList.make,
      model: manageFleetList.model,
      fsc: manageFleetList.fsc,
      startingBid: manageFleetList.startingBid,
      reservePrice: manageFleetList.reservePrice,
      salvageScrap: manageFleetList.salvageScrap,
      featuredItem: manageFleetList.featuredItem,
      regionCodes: manageFleetList.zone.zoneRegions,
      bid: manageFleetList.bid,
      params: {
        page: 1,
        size: manageFleetList.perPage,
        sort: sort,
      },
    };
    makeApiCall(data);
  }

  function sendToGSAAuction() {
    setsendAuctionSaveDisable(true);
    let state = manageFleetList;
    salesAPIService
      .sendToGSAAuction(ids)
      .then((response: any) => {
        state.showSendtoGSAAuctionModal = false;
        updateManageFleetList(state);
        addToast({
          text: "Records sent to GSA auction successfully",
          type: "success",
          heading: "Success",
        });
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
        setsendAuctionSaveDisable(false);
        let tabledata = {
          regionCodes: manageFleetList.zone.zoneRegions
            ? manageFleetList.zone.zoneRegions
            : null,
          params: {
            page: manageFleetList.currentPage,
            size: manageFleetList.perPage,
          },
        };
        makeApiCall(tabledata);
      })
      .catch((error) => {
        console.log(error);
        state.showSendtoGSAAuctionModal = false;
        setsendAuctionSaveDisable(false);
        updateManageFleetList(state);
        addToast({
          text: "Error sending fleet",
          type: "error",
          heading: "Error",
        });
      });
  }

  async function handleChange(perPage, page) {
    updateManageFleetList({
      loading: true,
    });

    let data = {
      vin: manageFleetList.vin,
      year: manageFleetList.year,
      make: manageFleetList.make,
      model: manageFleetList.model,
      fsc: manageFleetList.fsc,
      startingBid: manageFleetList.startingBid,
      reservePrice: manageFleetList.reservePrice,
      salvageScrap: manageFleetList.salvageScrap,
      featuredItem: manageFleetList.featuredItem,
      regionCodes: manageFleetList.zone.zoneRegions,
      bid: manageFleetList.bid,
      params: {
        page: page,
        size: perPage,
      },
    };

    if (manageFleetList.sort) {
      data.params["sort"] = manageFleetList.sort;
    }

    updateManageFleetList({
      currentPage: page,
      perPage: perPage,
    });
    makeApiCall(data);
  }

  function handleDataChange({ selectedIndex }) {
    let data = {};
    if (selectedIndex === 0) {
      data = {
        zoneIds: "12,13,14,15",
      };
    } else {
      data = {
        zoneIds: selectedIndex + 11,
      };
    }
    let zoneRegions = [];
    commonApiService
      .getRegionsForZones(data)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.toString().split("-")[0].trim());
        });
        let state = manageFleetList;
        state.zone.selectedZone = state.zone.zoneList[selectedIndex];
        state.zone.zoneRegions = zoneRegions;
        state.zone.isZoneEmpty = false;
        state.zone.validationMessage = "";
        updateManageFleetList(state);
        let tabledata = {
          regionCodes: manageFleetList.zone.zoneRegions
            ? manageFleetList.zone.zoneRegions
            : null,
          params: {
            page: 1,
            size: manageFleetList.perPage,
          },
        };
        makeApiCall(tabledata);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  return (
    <>
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Manage Fleet Sales"}
          columns={columns}
          showFilters={true}
          data={manageFleetList.filteredItems}
          defaultSortField={"salesNumber"}
          serverSort={true}
          currentPage={manageFleetList.currentPage - 1}
          handleSort={(sortBy) => handleSort(sortBy)}
          hiddenColumns={[
            "salesNumber",
            "lotId",
            "lotStatus",
            "fmslotItemId",
            "bid",
            "submitted",
          ]}
          updateData={(id, lotId, value) => {
            updateState(id, lotId, formatEditableCellNumber(value));
          }}
          setSelectedRows={setSelectedRows}
          loading={manageFleetList.loading}
          rowsPerPageOptions={manageFleetList.rowsPerPageOptions}
          totalRows={manageFleetList.totalRows}
          totalPages={manageFleetList.totalPages}
          rowsPerPage={manageFleetList.perPage}
          groupBy={["salesNumber"]}
          expandSubRows={true}
          isPaginationEnabled={true}
          onChange={handleChange}
          subHeaderComponent={
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                <div className={"grid-row grid-gap-2"}>
                  <div className={"grid-col-4"}>
                    <PPMSSelect
                      id={"select-zone"}
                      title={"select-zones"}
                      label={"Zone"}
                      identifierKey={"caps"}
                      identifierValue={"value"}
                      values={zoneValues}
                      isRequired={true}
                      isInvalid={manageFleetList.zone.isZoneEmpty}
                      validationMessage={manageFleetList.zone.validationMessage}
                      selectedValue={manageFleetList.zone.selectedZone}
                      onChange={(event) => handleDataChange(event.target)}
                    />
                  </div>
                  <div className={"grid-col-3"}>
                    <PPMSInput
                      isDisabled={true}
                      id={"regions"}
                      name={"regions"}
                      inputType={"text"}
                      label={"Regions"}
                      isRequired={true}
                      value={manageFleetList.zone.zoneRegions.toString()}
                      minLength={0}
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>
              {renderUpdateButtons()}
            </div>
          }
        />
        {renderUpdateButtons()}
      </div>
      <PPMSModal
        show={manageFleetList.showSendtoGSAAuctionModal}
        backdrop={"static"}
        body={"Do you want to send the fleet to GSA Auction?"}
        id={"sendToGSAModal"}
        handleClose={() => {
          manageFleetList.showSendtoGSAAuctionModal = false;
          updateManageFleetList(manageFleetList);
        }}
        centered={true}
        handleSaveType={"button"}
        handleSave={sendToGSAAuction}
        saveIsLoading={sendAuctionSaveDisable}
        title={"Send to GSA Auction"}
        label={"Yes"}
        labelCancel={"No"}
      />
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(ManageFleetList);
