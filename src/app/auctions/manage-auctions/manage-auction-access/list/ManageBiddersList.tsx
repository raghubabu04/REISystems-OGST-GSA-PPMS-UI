import React, { StrictMode, useContext, useEffect, useState } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { ManageAuctionAccessContext } from "../ManageAuctionAccessContext";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import { PageHelper, Paths } from "../../../../Router";
import { formattedDate } from "../Constants";

interface listProps {
  showCheckboxes: boolean;
  addToast: any;
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
  renderButtons?: any;
  renderActionButtons?: any;
  handleToggleAllPageRows?: any;
  handleTogglePageRow?: any;
  sourceTab?: string;
  refresh?: boolean;
  checkboxColumn?: any;
}

const ManageAuctionAccessList = (props: listProps) => {
  const { match, location } = props;
  let auctionApiService = new AuctionsApiService();
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

  const onClickAction = (data) => {
    PageHelper.openPage(Paths.manageBidder + `/${data.auctionId}`);
  };
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
      Header: "Sale Start Date",
      accessor: "startDate",
      filter: "search",
      width: "150",
    },
    {
      Header: "Sale End Date",
      accessor: "endDate",
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
                  filter["value"] = column["filterValue"];
                  filters.push(filter);
                });
                getLotsBySaleNumber(saleNumber, filters);
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
                getLotsBySaleNumber(saleNumber, filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: ({ row }) => {
        let data = row.original;
        return (
          <PPMSButton
            variant={"secondary"}
            label={"Manage Bidders"}
            size={"sm"}
            onPress={() => onClickAction(data)}
            id={"manage-bidders" + data.lotNumber}
          />
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
    manageAuctionAccessState.data.filteredRowsforManageBidder = apiData.slice(
      startIndex,
      endIndex
    );
    manageAuctionAccessState.other.page.totalRows = apiRows.length;
    manageAuctionAccessState.other.page.totalPages = Math.ceil(totalPages);
    manageAuctionAccessState.other.page.currentPage = page;
    manageAuctionAccessState.other.page.perPage = perPage;
    updateManageAuctionAccessState(state);
  };

  const getLotsBySaleNumber = async (saleNumber: string, filters: any) => {
    let params: any = {};
    params.page = manageAuctionAccessState.other.page.currentPage;
    params.size = manageAuctionAccessState?.other?.page?.perPage;
    params.saleNumber = saleNumber;
    let body: any = {};
    filters?.forEach((filter) => {
      if (filter.value) {
        body[filter.id] = filter.value;
      }
    });
    await auctionApiService
      .getLotsBySaleNumber(saleNumber, params, body)
      .then((response) => {
        let filteredRows =
          response && response.data && response.data.auctionDTOS
            ? response.data.auctionDTOS
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.lotNumber = row.lotNumber;
          obj.numberOfBidders = row.numberOfBidders;
          obj.auctionId = row.auctionId;
          obj.lotName = row.lotName;
          obj.auctionId = row.auctionId;
          obj.startDate = formattedDate(row?.startDate);
          obj.endDate = formattedDate(row?.endDate);
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
        manageAuctionAccessState.data.filteredRowsforManageBidder = filteredRows.slice(
          0,
          manageAuctionAccessState?.other?.page?.perPage
        );
        manageAuctionAccessState.other.loading = false;
        manageAuctionAccessState.other.page.totalRows = totalElements;
        manageAuctionAccessState.other.page.totalPages = totalPages;
        setLoading(false);
        updateManageAuctionAccessState(manageAuctionAccessState);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setLoading(true);
    let filter = [{}];
    getLotsBySaleNumber(saleNumber, filter);
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
          return data?.filteredRowsforManageBidder
            ? data.filteredRowsforManageBidder
            : [];
        }, [data.filteredRowsforManageBidder])}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAuctionAccessList);
