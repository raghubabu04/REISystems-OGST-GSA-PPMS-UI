import moment from "moment";
import React, { StrictMode, useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AuctionsApiService } from "../../../../../../api-kit/auctions/auctions-api-service";
import { BidderApiService } from "../../../../../../api-kit/auctions/bidder-api-service";
import PPMSDatatable from "../../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSButton } from "../../../../../../ui-kit/components/common/PPMS-button";
import { addToast } from "../../../../../../_redux/_actions/toast.actions";
import { AuctionStatus, BidderStatus } from "../../Constants";
import AddBidderModal from "./AddBidderModal";
import { PageHelper, Paths } from "../../../../../Router";
import ViewBidsLotDetails from "../../view-bids/ViewBidsLotDetails";
import { sale } from "../../../../../../_redux/_reducers/sale.reducer";
import { ManageAuctionAccessContext } from "../../ManageAuctionAccessContext";

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

const ManageBidderListPage = (props: listProps) => {
  const { match, location } = props;
  const { addToast } = props.actions;
  const [filters, setFilters] = useState([]);

  const [loading, setLoading] = useState(false);
  const [apiRows, setApiRows] = useState([]);
  let auctionId = null;
  if (match.params.auctionId) {
    auctionId = match.params.auctionId;
  }
  let bidderApiService = new BidderApiService();
  let auctionApiService = new AuctionsApiService();

  const {
    manageBidderState,
    updateManageBidderState,
    manageAuctionAccessState,
    updateManageAuctionAccessState,
    viewBidBidderState,
  } = useContext(ManageAuctionAccessContext);
  const columns: any[] = [
    {
      Header: "Bidder User Id",
      accessor: "userId",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bidder Name",
      accessor: "bidderName",
      filter: "search",
      width: "150",
    },
    {
      Header: "Bidder Email",
      accessor: "bidderEmail",
      filter: "search",
      width: "150",
    },
    {
      Header: "Last Login",
      accessor: "lastLogin",
      filter: "search",
      width: "150",
    },
    {
      Header: "Bidder Status",
      accessor: "status",
      filter: "search",
      width: "150",
    },
    {
      Header: "Grantor Name",
      accessor: "grantorName",
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
                setFilters(filters);
                getBidders(
                  auctionId,
                  filters,
                  manageBidderState.other.page.currentPage,
                  manageBidderState.other.page.perPage
                );
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
                getBidders(
                  auctionId,
                  filters,
                  manageBidderState.other.page.currentPage,
                  manageBidderState.other.page.perPage
                );
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: ({ row }) => {
        let data = row.original;
        let bidderId = data.bidderId;
        let label = data.status == BidderStatus.ACTIVE ? "Lock" : "Unlock";
        let status =
          data.status == BidderStatus.ACTIVE
            ? BidderStatus.INACTIVE
            : BidderStatus.ACTIVE;
        let disabled = data.status == BidderStatus.DELETED ? true : false;
        return (
          viewBidBidderState.viewBidBidderData.auctionStatus ===
            AuctionStatus.ACTIVE && (
            <>
              <PPMSButton
                variant={"secondary"}
                label={label}
                size={"sm"}
                onPress={() => updateBidderStatus(bidderId, status)}
                id={"lock-unlock" + bidderId}
                isDisabled={disabled}
              />
              <PPMSButton
                variant={"secondary"}
                label={"Delete"}
                size={"sm"}
                onPress={() =>
                  updateBidderStatus(bidderId, BidderStatus.DELETED)
                }
                id={"delete" + bidderId}
                isDisabled={disabled}
              />
            </>
          )
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];
  const onClickAction = () => {
    let salesId = manageAuctionAccessState.data.salesDetails.id;
    let salesNumber = manageAuctionAccessState.data.salesDetails.salesNumber;
    PageHelper.openPage(
      Paths.manageAuctionAccess +
      `/${salesId}/${salesNumber}`
    )
  };
  const updateBidderStatus = (id, status) => {
    let data: any = {};
    data.status = status;
    bidderApiService.updateBidderStatus(id, data).then((response) => {
      getBidders(
        auctionId,
        filters,
        manageBidderState.other.page.currentPage,
        manageBidderState.other.page.perPage
      ).then(() => {
        let bidders = manageBidderState.data.filteredRows;
        let bidder = bidders.filter((bid) => {
          return bid.bidderId == id;
        });
        addToast({
          text:
            "Successfully change bidder id " +
            id +
            " status to " +
            bidder[0].status,
          type: "success",
          heading: "Success",
        });
      });

      handleCloseModal();
    });
  };
  const getBidders = async (auctionId, filters, page, size) => {
    console.log("Sales Details ", sale);
    console.log("Sales Details 1 ",manageAuctionAccessState.data.salesDetails);
    let params: any = {};
    params.page = page;
    params.size = size;
    let body: any = {};

    filters?.forEach((filter) => {
      if (filter.value) {
        body[filter.id] = filter.value;
      }
    });
    await bidderApiService
      .getBidders(auctionId, params, body)
      .then((response) => {
        let filteredRows =
          response && response.data && response.data.bidderDTOList
            ? response.data.bidderDTOList
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.bidderName = row.name;
          obj.userId = row.userId;
          obj.bidderEmail = row.email;
          obj.status = row.status;
          obj.bidderId = row.bidderId;
          obj.auctionId = row.auctionId;
          obj.grantorName = row.granterName;
          obj.lastLogin = row.lastLogin
            ? moment(row.lastLogin).format("MM/DD/yyyy hh:m a")
            : "-";
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
        manageBidderState.data.filteredRows = filteredRows.slice(
          0,
          manageBidderState?.other?.page?.perPage
        );
        manageBidderState.other.loading = false;
        manageBidderState.other.page.totalRows = totalElements;
        manageBidderState.other.page.totalPages = totalPages;
        setLoading(false);
        updateManageBidderState(manageBidderState);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setLoading(true);
    getBidders(
      auctionId,
      filters,
      manageBidderState.other.page.currentPage,
      manageBidderState.other.page.perPage
    );
  }, []);

  const handlePageChange = (perPage, page) => {
    let state = manageBidderState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    manageBidderState.data.filteredRows = apiData.slice(startIndex, endIndex);
    manageBidderState.other.page.totalRows = apiRows.length;
    manageBidderState.other.page.totalPages = Math.ceil(totalPages);
    manageBidderState.other.page.currentPage = page;
    manageBidderState.other.page.perPage = perPage;
    getBidders(auctionId, filters, page, perPage);
    updateManageBidderState(state);
  };

  const handleAddBidder = () => {
    let state = manageBidderState;
    state.other.showModal = true;
    updateManageBidderState(state);
    getBidders(
      auctionId,
      filters,
      state.other.page.currentPage,
      state.other.page.perPage
    );
  };

  const handleCloseModal = () => {
    let state = manageBidderState;
    state.other.showModal = false;
    updateManageBidderState(state);
  };

  const handleSaveModal = (userId) => {
    auctionApiService
      .addBidderToAuction(auctionId, userId)
      .then((response) => {
        addToast({
          text: "Successfully added bidder to auction",
          type: "success",
          heading: "Success",
        });
        handleCloseModal();
        setLoading(true);
        getBidders(
          auctionId,
          filters,
          manageBidderState.other.page.currentPage,
          manageBidderState.other.page.perPage
        );
      })
      .catch((error) => {
        console.error(error);
        if (error.data.status.includes("exist")) {
          addToast({
            text: `${error?.data?.status}`,
            type: "error",
            heading: "Error",
          });
        } else {
          addToast({
            text: "Error confirming request",
            type: "error",
            heading: "Error",
          });
        }
      });
  };
  return (
    <StrictMode>
      <div className="ui-ppms usa-layout-docs__main  usa-prose usa-layout-docs">
        <DataTable
          data={manageBidderState?.data}
          columns={columns}
          page={manageBidderState?.other?.page}
          loading={loading}
          handlePageChange={handlePageChange}
          handleToggleAllPageRows={props.handleToggleAllPageRows}
          handleTogglePageRow={props.handleTogglePageRow}
          handleAddBidder={handleAddBidder}
          auctionId={auctionId}
          auctionStatus={viewBidBidderState.viewBidBidderData.auctionStatus}
        />
        <div className="grid-row grid-gap-4">
          <AddBidderModal
            showModal={manageBidderState?.other?.showModal}
            handleCloseModal={handleCloseModal}
            handleSaveModal={handleSaveModal}
          />
        </div>
      </div>
      <br />
      <div className={"grid-row-auto"}>
        <PPMSButton
          id={"back"}
          type={"button"}
          variant={"link"}
          label={"< Back To Manage Auctions"}
          onPress={() => onClickAction()}
          className="back-to-manage-auction usa-button "
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
  handlePageChange,
  handleToggleAllPageRows,
  handleTogglePageRow,
  handleAddBidder,
  auctionId,
  auctionStatus,
}) => {
  return (
    <>
      <PPMSDatatable
        title={"Manage Bidders"}
        data={React.useMemo(() => {
          return data?.filteredRows ? data.filteredRows : [];
        }, [data?.filteredRows])}
        columns={columns}
        defaultSortField={"Lot"}
        onChange={(event, page) => {
          handlePageChange(event, page);
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
        subHeaderComponent={
          <>
            <div>
              <ViewBidsLotDetails auctionId={auctionId} />
            </div>
            <div>
              {auctionStatus === AuctionStatus.ACTIVE && (
                <PPMSButton
                  id={"add-bidder"}
                  label={"Add Bidder"}
                  type={"button"}
                  className={"out-button"}
                  onPress={() => {
                    handleAddBidder();
                  }}
                />
              )}
            </div>
          </>
        }
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
)(ManageBidderListPage);
