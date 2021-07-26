import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import PPMSCheckbox from "../../../../ui-kit/components/common/form/PPMS-checkbox";
import {PPMSButton} from "../../../../ui-kit/components/common/PPMS-button";
import {PPMSSelect} from "../../../../ui-kit/components/common/select/PPMS-select";
import {PPMSInput} from "../../../../ui-kit/components/common/input/PPMS-input";
import {ManageAuctionListContext} from "./ManageAuctionListContext";
import {UserUtils} from "../../../../utils/UserUtils";
import {CommonApiService} from "../../../../api-kit/common/common-api.service";
import {SalesApiService} from "../../../../api-kit/sales/sales-api-service";
import {MdEdit} from "react-icons/md";
import {formatSaleNumber} from "../../../../ui-kit/utilities/FormatUtil";
import {Link} from "react-router-dom";
import {PageHelper, Paths} from "../../../Router";
import moment from "moment";

interface ManageAuctionList {
}

interface ManageAuctionList {
  isLoading: boolean;
}

const ManageAuctionList = (props) => {
  const [checkSelectedValue, setCheckSelectedValue] = useState(true);
  const [loading, setLoading] = useState(false);
  const [defaultZoneId, setdefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );
  let salesAPIService = new SalesApiService();
  const { manageAuctionListState, updateManageAuctionListState } = useContext(
    ManageAuctionListContext
  );
  let ids = [];
  const commonApiService = new CommonApiService();
  const [apiRows, setApiRows] = useState([]);

  function handleChange({ selectedIndex }) {
    let state = manageAuctionListState;
    if (selectedIndex === 0) {
      state.zone.zoneRegions = [];
      state.zone.isZoneEmpty = true;
      state.zone.validationMessage = "Please select a zone.";
    } else {
      state.zone.isAddAllDisabled = false;
      const zoneID = manageAuctionListState.zone.zoneList[selectedIndex - 1]
        ? manageAuctionListState.zone.zoneList[selectedIndex - 1].zoneId
        : "";
      setdefaultZoneId(zoneID);
      let zoneRegions = [];
      commonApiService
        .getZoneRegions(zoneID)
        .then((response: any) => {
          response?.data.forEach((region) => {
            zoneRegions.push(region.regionCode);
          });
          let state = manageAuctionListState;
          state.zone.selectedZone = zoneID;
          state.zone.zoneRegions = zoneRegions;
          state.zone.isZoneEmpty = false;
          state.zone.validationMessage = "";
          let filters = [];
          getManageAuctions(zoneID, filters);
          updateManageAuctionListState(state);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
  }

  let handleChangeTable = (perPage, page) => {
    let state = manageAuctionListState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    manageAuctionListState.data.filteredRows = apiData.slice(
      startIndex,
      endIndex
    );
    manageAuctionListState.other.page.totalRows = apiRows.length;
    manageAuctionListState.other.page.totalPages = Math.ceil(totalPages);
    manageAuctionListState.other.page.currentPage = page;
    manageAuctionListState.other.page.perPage = perPage;
    updateManageAuctionListState(state);
  };

  let getManageAuctions = (zoneId: number, filters: any) => {
    let params: any = {};
    params.page = manageAuctionListState.other.page.currentPage;
    params.size = manageAuctionListState?.other?.page?.perPage;
    params.zone = zoneId;
    filters?.forEach((filter) => {
      if (filter.value) {
        params[filter.id] = filter.value;
      }
    });
    salesAPIService
      .getSalesToManageAuction(params)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.sales
            ? response.data.sales
            : [];
        console.log("Filtered Rows before ",filteredRows);
        filteredRows = filteredRows.map((row) => {
          let rowDetails = row;
          const{salesTime} = row;
          let obj: any = {};
          obj.salesNumber = row.salesNumber;
          obj.sellingAgency = row.sellingAgency;
          obj.saleStartDate = (row.saleStartDate? row.saleStartDate: "")
          obj.salesTime = (row.salesTime? row.salesTime: "")
          obj.saleStatus = row.saleStatus;
          obj.saleDescription = row.saleDescription;
          obj.pointOfContact =
            (row.pointOfContact?.firstName
              ? row.pointOfContact.firstName
                ? row.pointOfContact.firstName
                : ""
              : "") +
            (row.pointOfContact?.lastName
              ? row.pointOfContact.lastName
                ? " " + row.pointOfContact.lastName
                : ""
              : "");
          obj.saleId = row.saleId;
          return obj;
        });
        console.log("Filtered Rows before 1",filteredRows);
        setApiRows(filteredRows);
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        let state = manageAuctionListState;
        manageAuctionListState.data.filteredRows = filteredRows.slice(
          0,
          manageAuctionListState?.other?.page?.perPage
        );
        manageAuctionListState.other.loading = false;
        manageAuctionListState.other.page.totalRows = totalElements;
        manageAuctionListState.other.page.totalPages = totalPages;
        setLoading(false);
        updateManageAuctionListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  const printDateAndTIme = (saleStartDateAndTime) => {
    return <div>
      <span className="action-list-date">
        {moment(saleStartDateAndTime.value).format("MM/DD/YYYY")}
      </span>
      <span className="action-list-slash">@</span>
       {formatTime(saleStartDateAndTime.cell.row.original.salesTime)}
    </div>
  }

  const formatTime = (salesTime) => {
    if (salesTime) {
      return <span className="action-list-time">
        {`${moment(salesTime, ["HH.mm"]).format("hh:mm a")} CT`}
      </span>
    } else {
      return ""
    }
  }

  const onClickAction = (salesInfo, action) => {
    PageHelper.openPage(
      Paths.manageAuctionAccess +
        `/${salesInfo.saleId}/${salesInfo.salesNumber}/?zoneId=${defaultZoneId}`
    );
  };
  useEffect(() => {
    setLoading(true);
    let filter = [{}];
    setLoading(true);
    const data = {
      params: {
        zoneIds: UserUtils.getUserZones().join(","),
      },
    };
    commonApiService
      .getZoneSalesControlList(data)
      .then((response: any) => {
        let state = manageAuctionListState;
        state.zone.zoneList = response?.data;
        updateManageAuctionListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    let zoneIdRegions = UserUtils.getDefaultZones();
    getManageAuctions(parseInt(defaultZoneId), filter);
    let zoneRegions = [];
    commonApiService
      .getZoneRegions(zoneIdRegions)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.regionCode);
        });
        let state = manageAuctionListState;
        state.zone.zoneRegions = zoneRegions;
        updateManageAuctionListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }, [
    manageAuctionListState?.other.page.currentPage,
    manageAuctionListState?.other.page.perPage,
  ]);

  const columns = [
    {
      Header: "Sale Number",
      accessor: "salesNumber",
      Cell: (data: any) => {
        const { roles } = props;
        console.log("Manage Auctions Page ", data);
        console.log("Manage Auctions Page 1", data.row);
        const saleSellingAgency = data.filteredRows.find((row) => row.original.saleId === data.row.values.saleId);
        return (
          <>
          {(data?.cell?.row?.original?.sellingAgency ==='PBS'  || data?.cell?.row?.original?.sellingAgency ==='DOI') ? (
              <Link
                to={`${Paths.salesTransactionPBSDOI}/${data?.cell?.row?.original?.saleId}?zoneId=${defaultZoneId}`}
                className={"sales-transaction-pbsdoi"}
                key="sales-transaction-pbsdoi-id"
              >
                {formatSaleNumber(data.value)}
              </Link>
            ) : (
              <Link
                to={`${Paths.salesTransaction}${data.data[data.row.id].saleId ? "/" + data.data[data.row.id].saleId : ""
                  }?zoneId=${defaultZoneId}`}
                className={"sales-transaction"}
                key="sales-transaction-id"
              >
                {formatSaleNumber(data.value)}
              </Link>
            )}
          </>
        );
      },
      filter: "search",
    },
    {
      Header: "Sale Start Date/Time",
      accessor: "saleStartDate",
      Cell: (data: any) => {
        const {value} = data;
        if(value){
          return printDateAndTIme(data)
        }else{
          return ""
        }
      },
      filter: "search",
    },
    {
      Header: "Point Of Contact",
      accessor: "pointOfContact",
      filter: "search",
    },
    {
      Header: "Sales Description",
      accessor: "saleDescription",
      filter: "search",
    },
    {
      Header: "Sales Status",
      accessor: "saleStatus",
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
                  if (column.id === "salesNumber") {
                    filter["value"] = column["filterValue"]?.replace(/-/g, "");
                  } else {
                    filter["value"] = column["filterValue"];
                  }
                  filters.push(filter);
                });
                getManageAuctions(parseInt(defaultZoneId), filters);
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
                getManageAuctions(parseInt(defaultZoneId), filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (property) => {
        let salesInfo = property.data[property.row.id];
        return (
          <>
            {(props.roles.isSMS ||
              props.roles.isSG ||
              props.roles.isCO ||
              props.roles.isSCO ||
              props.roles.isRAI ||
              props.roles.isSAI) && (
              <PPMSButton
                variant={"secondary"}
                label={"Edit"}
                size={"sm"}
                icon={<MdEdit />}
                onPress={() => onClickAction(salesInfo, "edit")}
                id={"edit-" + salesInfo.salesNumber}
              />
            )}
          </>
        );
      },
    },
  ];

  const checkSelectedValues = (selectedCheckboxRows) => {
    let numberOfApprovedLots = selectedCheckboxRows.filter(
      (row) => row.original.status === "Approved"
    ).length;
    if (
      selectedCheckboxRows.length != 0 &&
      selectedCheckboxRows.length === numberOfApprovedLots
    ) {
      setCheckSelectedValue(false);
    } else {
      setCheckSelectedValue(true);
    }
  };

  const setSelectedRows = (selectedFlatRows: any[]) => {
    checkSelectedValues(selectedFlatRows);
    const selectedRowIds = selectedFlatRows.map((item) => item.original.lotId);
    ids = selectedRowIds;
  };

  return (
    <div className="ui-ppms">
      <h1>Manage Auctions</h1>
      <div className={"grid-row grid-gap-2 filter-closer"}>
        <div className={"grid-col-4"}>
          <PPMSSelect
            id={"select-zone"}
            title={"select-zones"}
            placeholderValue={"Select Zone"}
            label={"Zone"}
            identifierKey={"zoneId"}
            identifierValue={"zoneName"}
            values={manageAuctionListState?.zone?.zoneList}
            isRequired={true}
            isInvalid={manageAuctionListState?.zone?.isZoneEmpty}
            validationMessage={manageAuctionListState?.zone?.validationMessage}
            selectedValue={defaultZoneId}
            onChange={(event) => handleChange(event.target)}
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
            value={manageAuctionListState?.zone.zoneRegions.toString()}
            minLength={0}
            maxLength={5}
          />
        </div>
      </div>
      <DataTable
        data={manageAuctionListState?.data}
        columns={columns}
        page={manageAuctionListState?.other?.page}
        loading={loading}
        handleChangeTable={handleChangeTable}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
};

const DataTable = ({
  data,
  columns,
  page,
  loading,
  handleChangeTable,
  setSelectedRows,
}) => {
  return (
    <>
      {" "}
      <PPMSDatatable
        title={""}
        data={React.useMemo(() => {
          return data?.filteredRows ? data.filteredRows : [];
        }, [data?.filteredRows])}
        columns={columns}
        defaultSortField={"SALE NUMBER"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={page?.rowsPerPageOptions}
        totalRows={page?.totalRows}
        totalPages={page?.totalPages}
        rowsPerPage={page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={loading}
        currentPage={page?.currentPage - 1}
        setSelectedRows={setSelectedRows}
        hiddenColumns={["id"]}
      />
    </>
  );
};
const mapDispatchToProps = () => {};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
export default connect(mapStateToProps, mapDispatchToProps)(ManageAuctionList);
