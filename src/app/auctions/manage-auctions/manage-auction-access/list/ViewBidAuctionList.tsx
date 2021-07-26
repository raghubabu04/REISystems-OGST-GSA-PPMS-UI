import React, { StrictMode, useContext, useEffect, useState } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { ManageAuctionAccessContext } from "../ManageAuctionAccessContext";
import IndeterminateCheckbox from "../../../../../ui-kit/components/common/datatable/IndeterminateCheckbox";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import { formattedDate } from "../Constants";
import { PageHelper, Paths } from "../../../../Router";
import { formatLotNumber } from "../../../../sales/management-pbs-doi/lot-details/property/common/constants/Utils";

interface ViewBidAuctionListProps {
  showCheckboxes: boolean;
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
  renderButtons?: any;
  renderActionButtons?: any;
  setSelectedRows?: any;
  sourceTab?: string;
  saleId: number;
  salesNumber: string;
}

const ViewBidAuctionList = (props: ViewBidAuctionListProps) => {
  const { saleId, salesNumber } = props;

  let salesAPIService = new SalesApiService();
  let auctionsApiService = new AuctionsApiService();
  const { viewBidsState, updateViewBidsState } = useContext(
    ManageAuctionAccessContext
  );
  const starDates: any[] = [];
  const endDates: any[] = [];
  const [loading, setLoading] = useState(false);
  const [apiRows, setApiRows] = useState([]);
  const [startDatesMap, setStartDatesMap] = useState([]);
  const [endDatesMap, setEndDatesMap] = useState([]);
  let hiddenColumns = ["id"];

  const columns: any[] = [
    {
      Header: "Auction Id",
      accessor: "id",
      filter: "search",
      width: "100",
    },
    {
      Header: "Lot Number",
      accessor: "lotNumber",
      filter: "search",
      width: "100",
    },
    {
      Header: "Lot Name",
      accessor: "lotName",
      filter: "search",
      width: "150",
    },
    {
      Header: "Sales Start Date",
      accessor: "auctionStartDate",
      filter: "search",
      width: "150",
    },
    {
      Header: "Sales Close Date",
      accessor: "auctionEndDate",
      filter: "search",
      width: "150",
    },
    {
      Header: "Status",
      accessor: "auctionStatus",
      filter: "search",
      width: "150",
    },
    {
      Header: "Number of Bidders",
      accessor: "numberOfBidders",
      filter: "search",
      width: "150",
    },
    {
      Header: "Reserve Price",
      accessor: "reservePrice",
      filter: "search",
      width: "150",
    },
    {
      Header: "Actions",
      width: "100",
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
                  } else if (column.id === "auctionStartDate") {
                    startDatesMap.forEach((startDate) => {
                      if (startDate.formattedDate === column["filterValue"]) {
                      }
                    });
                  } else if (column.id === "auctionEndDate") {
                    endDatesMap.forEach((endDate) => {
                      if (endDate.formattedDate === column["filterValue"]) {
                        console.log(
                          "filterValue Date Map ",
                          column["filterValue"]
                        );
                        console.log("End  Date Map ", endDate.originalDate);
                      }
                    });
                  } else {
                    filter["value"] = column["filterValue"];
                  }
                  filters.push(filter);
                  getLotAuctions(
                    saleId,
                    viewBidsState?.data?.salesDetails?.salesNumber,
                    filters
                  );
                });
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
                getLotAuctions(
                  saleId,
                  viewBidsState?.data?.salesDetails?.salesNumber,
                  filters
                );
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: (property) => {
        let salesInfo = property.row.values;
        return (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"View Bids"}
              size={"sm"}
              onPress={() => onClickAction(salesInfo, "viewBids")}
              id={"viewBids-" + salesInfo.salesNumber}
            />
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];
  const onClickAction = (salesInfo, action) => {
    const data = viewBidsState.data;
    data.selectedRowDetails = salesInfo;
    const other = viewBidsState.other;
    updateViewBidsState({
      data: data,
    });
    PageHelper.openPage(Paths.manageAuctionBidAccess + `/${salesInfo.id}`);
  };
  if (props.showCheckboxes)
    columns.unshift(
      // Let's make a column for selection
      {
        id: "selection",
        width: "50",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <div>
            <IndeterminateCheckbox
              id={"select-all-rows"}
              name={`select-all-rows`}
              {...getToggleAllPageRowsSelectedProps()}
            />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox
              id={`${row.id}-checkbox`}
              name={`${row.id}-checkbox`}
              disabled={row.values.status === "Void"}
              {...row.getToggleRowSelectedProps()}
            />
          </div>
        ),
      }
    );

  const handleChangeTable = (perPage, page) => {
    let state = viewBidsState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    viewBidsState.data.filteredRows = apiData.slice(startIndex, endIndex);
    viewBidsState.other.page.totalRows = apiRows.length;
    viewBidsState.other.page.totalPages = Math.ceil(totalPages);
    viewBidsState.other.page.currentPage = page;
    viewBidsState.other.page.perPage = perPage;
    updateViewBidsState(state);
  };

  const getLotAuctions = (
    saleId: number,
    salesNumber: string,
    filters: any
  ) => {
    /*    */
    let data = {
      params: {
        page: viewBidsState.other.page.currentPage,
        size: viewBidsState?.other?.page?.perPage,
      },
      saleId: saleId,
      saleNumber: viewBidsState?.data?.salesDetails?.salesNumber,
      specifiedFilterStage: "viewBids",
    };
    filters?.forEach((filter) => {
      if (filter.value) {
        data[filter.id] = filter.value;
      }
    });
    auctionsApiService
      .previewAuctions(data)
      .then((response: any) => {
        let startDateMap = { originalDate: "", formattedDate: "" };
        let endDateMap = { originalDate: "", formattedDate: "" };
        let filteredRows =
          response && response.data && response.data.auctionDTOList
            ? response.data.auctionDTOList
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.propertyCustodian =
            (row.custodianFirstName ? row.custodianFirstName + "," : "") +
            (row.custodianLastName ? row.custodianLastName : "");

          obj.lotNumber = formatLotNumber(row.lotNumber?.toString(), 3);
          obj.lotName = row.lotName;
          obj.lotId = row.lotId;
          obj.custodianId = row.custodianId;
          obj.icnCount = row.noOfItems;
          obj.auctionStartDate = formattedDate(row?.startDate);

          startDateMap.originalDate = row?.startDate;
          startDateMap.formattedDate = obj.auctionStartDate;
          starDates.push(startDateMap);
          endDateMap.originalDate = row?.startDate;
          endDateMap.formattedDate = obj.auctionStartDate;
          endDates.push(endDateMap);
          obj.auctionEndDate = formattedDate(row?.endDate);

          obj.auctionStatus = row.status;
          obj.reservePrice = row.reserveAmount;
          obj.id = row.auctionId;
          obj.numberOfBidders = row.numberOfBidders;
          return obj;
        });

        setApiRows(filteredRows);

        setStartDatesMap(starDates);
        setEndDatesMap(endDates);

        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        let state = viewBidsState;
        viewBidsState.data.filteredRows = filteredRows.slice(
          0,
          viewBidsState?.other?.page?.perPage
        );
        viewBidsState.other.loading = false;
        viewBidsState.other.page.totalRows = totalElements;
        viewBidsState.other.page.totalPages = totalPages;
        setLoading(false);
        updateViewBidsState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  const handleCloseModal = () => {
    let state = viewBidsState;
    state.other.showModal = false;
    updateViewBidsState(state);
  };

  const handleSaveModal = (userId) => {};
  useEffect(() => {
    setLoading(true);
    let filter = [{}];
    salesAPIService
      .getSaleDetails(saleId)
      .then((res) => {
        let salesDetails = res.data.salesNumberDetails;
        let state = viewBidsState;
        state.data.salesDetails = salesDetails;
        updateViewBidsState(state);
        console.log("Auction Data ");
        getLotAuctions(saleId, salesDetails.salesNumber, filter);
      })
      .catch((error) => {});
  }, [viewBidsState.other.page.currentPage, viewBidsState.other.page.perPage]);

  return (
    <StrictMode>
      <div className="ui-ppms usa-layout-docs__main  usa-prose usa-layout-docs">
        {props.renderButtons ? props.renderButtons() : ""}
        <DataTable
          data={viewBidsState?.data}
          columns={columns}
          page={viewBidsState?.other?.page}
          loading={loading}
          handleChangeTable={handleChangeTable}
          setSelectedRows={props.setSelectedRows}
          hiddenColumns={hiddenColumns}
        />
      </div>
    </StrictMode>
  );
};
const DataTable = ({
  data,
  columns,
  page,
  loading,
  handleChangeTable,
  setSelectedRows,
  hiddenColumns,
}) => {
  return (
    <>
      <PPMSDatatable
        title={""}
        data={React.useMemo(() => {
          return data?.filteredRows ? data.filteredRows : [];
        }, [data.filteredRows])}
        columns={columns}
        defaultSortField={"Lot"}
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
        hiddenColumns={hiddenColumns}
        currentPage={page?.currentPage - 1}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(saleAction.updateSaleInfo(saleId, saleNumber, saleAction, zone)),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewBidAuctionList);
