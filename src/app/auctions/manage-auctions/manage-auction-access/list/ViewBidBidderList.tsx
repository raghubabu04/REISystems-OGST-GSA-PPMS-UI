import React, {
  StrictMode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { ManageAuctionAccessContext } from "../ManageAuctionAccessContext";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import {
  formatCurrency,
  getDateFrom,
  getDateTo,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { isFormSubmitted } from "../../../../../service/validation.service";
import ViewBidsLotDetails from "../view-bids/ViewBidsLotDetails";
import queryString from "query-string";
import { PageHelper, Paths } from "../../../../Router";
import { AuctionStatus } from "../Constants";

interface ViewBidBidderListProps {
  showCheckboxes: boolean;
  match: any;
  user: any;
  location: any;
  actions?: any;
  roles: any;
  auctionId: number;
}

const BidBidderList = (props: ViewBidBidderListProps) => {
  const { match, location } = props;

  const { addToast } = props.actions;
  const [printBidList, setPrintBidList] = useState(-1);
  const auctionsApiService = new AuctionsApiService();

  const {
    viewBidBidderState,
    updateViewBidBidderState,
    viewBidsState,
    updateViewBidsState,
  } = useContext(ManageAuctionAccessContext);

  let auctionId = null;

  if (match.params.auctionId) {
    auctionId = match.params.auctionId;
  }

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBidBidders(auctionId, [{}]);
    setLoading(true);
  }, []);

  useEffect(() => {
    if (printBidList !== -1) {
      window.print();
      setPrintBidList(-1);
    }
  }, [printBidList]);
  const columns: any[] = [
    {
      Header: "Bid ID",
      accessor: "bidId",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bidder User ID",
      accessor: "bidderUsername",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bidder Name",
      accessor: "bidderName",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bidder Email",
      accessor: "bidderEmail",
      filter: "search",
      width: "150",
    },
    {
      Header: "Bid Type",
      accessor: "bidType",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bid Status",
      accessor: "bidStatus",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bid Number",
      accessor: "bidNumber",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bid Date/Time",
      accessor: "bidDate",
      filter: "search",
      width: "150",
    },
    {
      Header: "Bid Amount",
      accessor: "bidAmount",
      filter: "search",
      width: "100",
    },
    {
      Header: "Bid Proxy Amount",
      accessor: "proxyBidAmount",
      filter: "search",
      width: "100",
    },
    {
      Header: "IP Address",
      accessor: "ipAddress",
      filter: "search",
      width: "100",
    },
    {
      Header: "High Bid",
      accessor: "isHighBid",
      filter: "search",
      width: "100",
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
                getBidBidders(auctionId, filters);
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
                getBidBidders(auctionId, filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: (bidBidder) => {
        let bidBidderInfo = bidBidder.row.values;
        return (
          bidBidderInfo.isHighBid === "true" &&
          viewBidBidderState.viewBidBidderData.auctionStatus ===
            AuctionStatus.ACTIVE && (
            <PPMSButton
              variant={"primary"}
              type={"button"}
              label={"Cancel"}
              onPress={(event) => {
                const { cancelBid } = viewBidBidderState;
                cancelBid.cancelBidId = event.currentTarget.value;
                cancelBid.showCancelBidConfirmationModal = true;
                updateViewBidBidderState(cancelBid);
              }}
              value={bidBidderInfo.bidId}
              id={"cancelBid"}
              isDisabled={false}
              size={"sm"}
            />
          )
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  const handleChangeTable = async (perPage, page) => {
    let filter: any = viewBidBidderState.other.filter;
    let data: any = {
      ...filter,
      params: {
        page,
        size: perPage,
      },
    };

    try {
      let getBidBidderListResponse = await auctionsApiService.getBidBidderList(
        data,
        auctionId
      );

      let filteredRows = getBidBidderListResponse?.data
        ?.bidBidderSearchResultList
        ? getBidBidderListResponse?.data?.bidBidderSearchResultList
        : [];

      filteredRows = filteredRows.map((row) => {
        let bidBidderInfo: any = {};
        bidBidderInfo.bidId = row.bidId ? row.bidId : "";
        bidBidderInfo.bidAmount = row.bidAmount
          ? formatCurrency.format(row.bidAmount)
          : "$0";
        bidBidderInfo.bidNumber = row.bidNumber ? row.bidNumber : "";
        bidBidderInfo.bidStatus = row.bidStatus ? row.bidStatus : "";
        bidBidderInfo.bidType = row.bidType ? row.bidType : "";
        bidBidderInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        bidBidderInfo.bidDate = row.bidDate ? row.bidDate : "";
        bidBidderInfo.bidderName = row.bidderName ? row.bidderName : "";
        bidBidderInfo.bidderUsername = row.bidderUsername
          ? row.bidderUsername
          : "";
        bidBidderInfo.proxyBidAmount = row.proxyBidAmount
          ? formatCurrency.format(row.proxyBidAmount)
          : "$0";
        bidBidderInfo.ipAddress = row.ipAddress ? row.ipAddress : "";
        bidBidderInfo.isHighBid = row.isHighBid ? "true" : "false";

        return bidBidderInfo;
      });

      let totalElements = getBidBidderListResponse?.data?.totalElements
        ? getBidBidderListResponse.data.totalElements
        : 0;
      let totalPages = getBidBidderListResponse?.data?.totalPages
        ? getBidBidderListResponse.data.totalPages
        : 0;
      viewBidBidderState.data.filteredRows = filteredRows;
      viewBidBidderState.other.loading = false;
      viewBidBidderState.other.page.totalRows = totalElements;
      viewBidBidderState.other.page.totalPages = totalPages;
      viewBidBidderState.other.page.currentPage = page;
      viewBidBidderState.other.page.perPage = perPage;
      viewBidBidderState.other.filter = data;
      setLoading(false);
      let state = viewBidBidderState;
      updateViewBidBidderState(state);
    } catch (error) {
      console.error("ViewBidderBidList Page has error on handleChangeTable");
    }
  };

  const getBidBidders = async (auctionId: string, filters: any) => {
    let bidderUsername = "";
    let bidderName = "";
    let bidderEmail = "";
    let bidType = "";
    let bidStatus = "";
    let bidNumber;
    let bidDate = "";
    let bidAmount = "";
    let proxyBidAmount = "";
    let ipAddress = "";

    filters?.forEach((filter) => {
      if (filter?.value) {
        switch (filter.id) {
          case "bidderUsername":
            bidderUsername = filter["value"]?.trim();
            break;
          case "bidderName":
            bidderName = filter["value"]?.trim();
            break;
          case "bidderEmail":
            bidderEmail = filter["value"]?.trim();
            break;
          case "bidType":
            bidType = filter["value"]?.trim();
            break;
          case "bidStatus":
            bidStatus = filter["value"]?.trim();
            break;
          case "bidNumber":
            bidNumber = filter["value"]?.trim();
            break;
          case "bidDate":
            bidDate = filter["value"]?.trim();
            break;
          case "bidAmount":
            bidAmount = filter["value"]?.trim().replace(/[^0-9\.-]+/g, "");
            break;
          case "proxyBidAmount":
            proxyBidAmount = filter["value"]?.trim().replace(/[^0-9\.-]+/g, "");
            break;
          case "ipAddress":
            ipAddress = filter["value"]?.trim();
            break;
        }
      }
    });

    let bidDateFrom = bidDate ? getDateFrom(bidDate) : "";
    let bidDateTo = bidDate ? getDateTo(bidDate) : "";

    let filter: any = {
      bidderUsername,
      bidderName,
      bidderEmail,
      bidType,
      bidStatus,
      bidNumber,
      bidDateFrom,
      bidDateTo,
      bidAmount,
      proxyBidAmount,
      ipAddress,
    };

    let data: any = {
      ...filter,
      params: {
        page: 1,
        size: viewBidBidderState?.other?.page?.perPage,
      },
    };

    try {
      let getBidBidderListResponse = await auctionsApiService.getBidBidderList(
        data,
        auctionId
      );

      let filteredRows = getBidBidderListResponse?.data
        ?.bidBidderSearchResultList
        ? getBidBidderListResponse?.data?.bidBidderSearchResultList
        : [];

      filteredRows = filteredRows.map((row) => {
        let bidBidderInfo: any = {};
        bidBidderInfo.bidId = row.bidId ? row.bidId : "";
        bidBidderInfo.bidAmount = row.bidAmount
          ? formatCurrency.format(row.bidAmount)
          : "$0";
        bidBidderInfo.bidNumber = row.bidNumber ? row.bidNumber : "";
        bidBidderInfo.bidStatus = row.bidStatus ? row.bidStatus : "";
        bidBidderInfo.bidType = row.bidType ? row.bidType : "";
        bidBidderInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        bidBidderInfo.bidDate = row.bidDate ? row.bidDate : "";
        bidBidderInfo.bidderName = row.bidderName ? row.bidderName : "";
        bidBidderInfo.bidderUsername = row.bidderUsername
          ? row.bidderUsername
          : "";
        bidBidderInfo.proxyBidAmount = row.proxyBidAmount
          ? formatCurrency.format(row.proxyBidAmount)
          : "$0";
        bidBidderInfo.ipAddress = row.ipAddress ? row.ipAddress : "";
        bidBidderInfo.isHighBid = row.isHighBid ? "true" : "false";

        return bidBidderInfo;
      });

      let totalElements = getBidBidderListResponse?.data?.totalElements
        ? getBidBidderListResponse.data.totalElements
        : 0;
      let totalPages = getBidBidderListResponse?.data?.totalPages
        ? getBidBidderListResponse.data.totalPages
        : 0;
      viewBidBidderState.data.filteredRows = filteredRows;
      viewBidBidderState.other.loading = false;
      viewBidBidderState.other.page.totalRows = totalElements;
      viewBidBidderState.other.page.totalPages = totalPages;
      viewBidBidderState.other.page.currentPage = 1;
      viewBidBidderState.other.filter = filter;
      setLoading(false);
      let state = viewBidBidderState;
      updateViewBidBidderState(state);
    } catch (error) {
      console.error("ViewBidderBidList Page has error on getBidBidderList API");
    }
  };
  const renderSelectButtons = () => {
    return (
      <>
        <PPMSButton
          className={"out-button lot_bid_list-print"}
          type={"button"}
          value={""}
          label={"Print"}
          onPress={() => {
            setPrintBidList(1);
          }}
          id={"print"}
        />
      </>
    );
  };

  const handleCancelModalClose = () => {
    const { cancelBid } = viewBidBidderState;
    cancelBid.showCancelBidConfirmationModal = false;
    cancelBid.cancelBidId = "";
    cancelBid.cancelBidConfirmation = "";
    cancelBid.cancelBidConfirmationInvalid = false;
    cancelBid.showError = false;
    cancelBid.errorMessage = "";
    updateViewBidBidderState(cancelBid);
    isFormSubmitted.next(false);
  };

  const handlCancelModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { cancelBid } = viewBidBidderState;

    try {
      let cancelBidResponse = await auctionsApiService.cancelBid(
        cancelBid.cancelBidId
      );
      if (cancelBidResponse.status === 200) {
        handleCancelModalClose();
        addToast({
          text: `Bid is successfully cancelled!`,
          type: "success",
          heading: "Success",
        });
      }
      let search = location.search;
      let query = queryString.parse(search);
      const { perPage } = viewBidBidderState.other.page;
      const data = {
        params: {
          page: viewBidBidderState.other.page.currentPage,
          size: perPage,
        },
      };
      getBidBidders(auctionId, [{}]);
      isFormSubmitted.next(false);
    } catch (error) {
      addToast({
        text: "Could not cancel the bid.",
        type: "error",
        heading: "Error",
      });
      cancelBid.showCancelBidConfirmationModal = false;
      updateViewBidBidderState(cancelBid);
      handleCancelModalClose();
      isFormSubmitted.next(false);
    } finally {
      handleCancelModalClose();
      isFormSubmitted.next(false);
    }
  };

  return useMemo(() => {
    return (
      <StrictMode>
        <div className={"ui-ppms grid-row grid-gap-4"}>
          <div className="grid-row header-row mb-3">
            <h1>View Bids</h1>
          </div>
          <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
            <div>
              <ViewBidsLotDetails auctionId={auctionId} />
            </div>
            <div className="grid-col-12 align-self-right">
              {renderSelectButtons()}
            </div>
            <PPMSDatatable
              title={""}
              data={
                viewBidBidderState?.data?.filteredRows
                  ? viewBidBidderState.data.filteredRows
                  : []
              }
              columns={columns}
              defaultSortField={"bidAmount"}
              sortDesc={true}
              onChange={(event, page) => {
                handleChangeTable(event, page);
              }}
              rowsPerPageOptions={
                viewBidBidderState?.other?.page?.rowsPerPageOptions
              }
              totalRows={viewBidBidderState?.other?.page?.totalRows}
              totalPages={viewBidBidderState?.other?.page?.totalPages}
              rowsPerPage={viewBidBidderState?.other?.page?.perPage}
              isPaginationEnabled={true}
              showFilters={true}
              serverSort={false}
              loading={viewBidBidderState.other.loading}
              hiddenColumns={["isHighBid", "bidId"]}
              currentPage={viewBidBidderState?.other?.page?.currentPage - 1}
            />
            <PPMSModal
              show={viewBidBidderState.cancelBid.showCancelBidConfirmationModal}
              centered={true}
              backdrop={"static"}
              handleClose={handleCancelModalClose}
              handleSave={handlCancelModalSubmit}
              title={"Cancel Bid Confirmation"}
              body={"Do you want to cancel the highest bid?"}
              id={"cancel-high-bid-confirmation"}
              label={"Yes"}
              labelCancel={"No"}
            />
            <br />
            <div className={"grid-row-auto"}>
              <PPMSButton
                id={"backToManageAuctions"}
                type={"button"}
                variant={"link"}
                label={"< Back To Manage Auctions"}
                onPress={() =>
                  PageHelper.openPage(
                    Paths.manageAuctionAccess +
                      `/${viewBidsState.data.salesDetails.id}/${viewBidsState.data.salesDetails.salesNumber}`
                  )
                }
                className="usa-button"
              />
            </div>
          </div>
        </div>
      </StrictMode>
    );
  }, [viewBidBidderState]);
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BidBidderList);
