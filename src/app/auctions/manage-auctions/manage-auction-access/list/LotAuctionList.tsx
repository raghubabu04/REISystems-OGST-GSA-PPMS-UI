import React, { StrictMode, useContext, useEffect, useState } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { ManageAuctionAccessContext } from "../ManageAuctionAccessContext";
import { formatLotNumber } from "../../../../sales/management-pbs-doi/lot-details/property/common/constants/Utils";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import { formattedDate } from "../Constants";

interface LotAuctionProps {
  showCheckboxes: boolean;
  addToast: any;
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  saleNumber?: any;
  roles: any;
  renderButtons?: any;
  renderActionButtons?: any;
  handleToggleAllPageRows?: any;
  handleTogglePageRow?: any;
  sourceTab?: string;
  refresh?: boolean;
  checkboxColumn?: any;
}

const LotAuctionList = (props: LotAuctionProps) => {
  const { match, location } = props;
  let auctionsApiService = new AuctionsApiService();
  let salesApiService = new SalesApiService();
  const {
    manageAuctionAccessState,
    updateManageAuctionAccessState,
  } = useContext(ManageAuctionAccessContext);

  const [loading, setLoading] = useState(false);
  const [apiRows, setApiRows] = useState([]);

  const { addToast } = props.actions;
  let saleId = null;
  let saleNumber = null;
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }
  if (match.params.saleNumber) {
    saleNumber = match.params.saleNumber;
  }

  const columns: any[] = [
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
      accessor: "startDate",
      filter: "search",
      width: "150",
    },
    {
      Header: "Sales Close Date",
      accessor: "closeDate",
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
                  } else {
                    filter["value"] = column["filterValue"];
                  }
                  filters.push(filter);
                });
                getLotAuctions(saleId, filters);
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
                getLotAuctions(saleId, filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: ({ row }) => {
        return (
          <>{props.renderActionButtons ? props.renderActionButtons(row) : ""}</>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  if (props.checkboxColumn) columns.unshift(props.checkboxColumn);

  const handleChangeTable = (perPage, page) => {
    let state = manageAuctionAccessState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    manageAuctionAccessState.data.filteredRows = apiData.slice(
      startIndex,
      endIndex
    );
    manageAuctionAccessState.other.page.totalRows = apiRows.length;
    manageAuctionAccessState.other.page.totalPages = Math.ceil(totalPages);
    manageAuctionAccessState.other.page.currentPage = page;
    manageAuctionAccessState.other.page.perPage = perPage;
    updateManageAuctionAccessState(state);
  };

  const getLotAuctions = (saleId: number, filters: any) => {
    let data = {
      params: {
        page: manageAuctionAccessState.other.page.currentPage,
        size: manageAuctionAccessState?.other?.page?.perPage,
      },
      // saleNumber: manageAuctionAccessState?.data?.salesDetails?.salesNumber,
      saleNumber,
      saleId,
      specifiedFilterStage: "extendTerminate",
    };

    filters?.forEach((filter) => {
      if (filter.value) {
        data[filter.id] = filter.value;
      }
    });
    auctionsApiService
      .previewAuctions(data)
      .then((response: any) => {
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
          obj.salesNumber = row.salesNumber;
          obj.lotId = row.lotId;
          obj.custodianId = row.custodianId;
          obj.icnCount = row.noOfItems;
          obj.startDate = formattedDate(row?.startDate);
          obj.closeDate = formattedDate(row?.endDate);
          obj.auctionStatus = row.status;
          return obj;
        });
        setApiRows(filteredRows);
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        let state = manageAuctionAccessState;
        manageAuctionAccessState.data.filteredRows = filteredRows.slice(
          0,
          manageAuctionAccessState?.other?.page?.perPage
        );
        manageAuctionAccessState.other.loading = false;
        manageAuctionAccessState.other.page.totalRows = totalElements;
        manageAuctionAccessState.other.page.totalPages = totalPages;
        setLoading(false);
        updateManageAuctionAccessState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  useEffect(() => {
    setLoading(true);
    let filter = [{}];
    getLotAuctions(saleId, filter);
    salesApiService
      .getSaleDetails(saleId)
      .then((res) => {
        let salesDetails = res.data.salesNumberDetails;
        let state = manageAuctionAccessState;
        state.data.salesDetails = salesDetails;
        updateManageAuctionAccessState(state);
      })
      .catch((error) => {});
  }, [
    props.refresh,
    manageAuctionAccessState.other.page.currentPage,
    manageAuctionAccessState.other.page.perPage,
  ]);

  return (
    <StrictMode>
      <div className="ui-ppms usa-layout-docs__main  usa-prose usa-layout-docs">
        {props.renderButtons ? props.renderButtons() : ""}
        <DataTable
          data={manageAuctionAccessState?.data}
          columns={columns}
          page={manageAuctionAccessState?.other?.page}
          loading={loading}
          handleChangeTable={handleChangeTable}
          handleToggleAllPageRows={props.handleToggleAllPageRows}
          handleTogglePageRow={props.handleTogglePageRow}
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
  handleToggleAllPageRows,
  handleTogglePageRow,
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
        hiddenColumns={["id"]}
        currentPage={page?.currentPage - 1}
        handleToggleAllPageRows={handleToggleAllPageRows}
        handleTogglePageRow={handleTogglePageRow}
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

export default connect(mapStateToProps, mapDispatchToProps)(LotAuctionList);
