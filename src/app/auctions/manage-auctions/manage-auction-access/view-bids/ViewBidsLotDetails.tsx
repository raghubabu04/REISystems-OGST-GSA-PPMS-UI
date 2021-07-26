import React, { StrictMode, useContext, useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import { ManageAuctionAccessContext } from "../ManageAuctionAccessContext";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import moment from "moment";
import { formatLotNumber } from "../../../../sales/management-pbs-doi/lot-details/property/common/constants/Utils";
interface ViewBidsLotDetailsProps {
  match: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  agencyBureaus: any;
  sale?: any;
  roles: any;
  user: any;
  setPrintLotIndex: any;
  auctionId: any;
}
const ViewBidsLotDetails = (props: ViewBidsLotDetailsProps) => {
  let auctionsAPIService = new AuctionsApiService();
  const { viewBidBidderState, updateViewBidBidderState } = useContext(
    ManageAuctionAccessContext
  );
  const [bidderLotDetails, setBidderLotDetails] = useState();
  useEffect(() => {
    getAuctions();
  }, []);
  const getAuctions = () => {
    auctionsAPIService
      .getAuction(props.auctionId)
      .then((response) => {
        //const data = viewBidBidderState.data;
        //data.lotDetails = response?.data;
        const { viewBidBidderData } = viewBidBidderState;
        viewBidBidderData.auctionStatus = response?.data?.status;
        updateViewBidBidderState({ viewBidBidderData });
        setBidderLotDetails(response?.data);
      })
      .catch((error) => {
        console.log("errors: ", error);
      });
  };
  //const auctionDetails = viewBidBidderState.data?.lotDetails;
  return (
    <StrictMode>
      <div className="ui-ppms usa-layout-docs__main  usa-prose usa-layout-docs">
        <ViewBidLot bidderLotDetails={bidderLotDetails} />
      </div>
    </StrictMode>
  );
};
const ViewBidLot = ({ bidderLotDetails }) => {
  return (
    <StrictMode>
      <>
        <div className={"usa-summary-box"}>
          <h2 className={"usa-summary-box__heading lot-review-h2"}>
            Lot Details
          </h2>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <div className={"grid-row"}>
                <div className={"grid-col-3"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <strong>Lot Number</strong>
                    </div>
                  </div>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      {formatLotNumber(
                        bidderLotDetails?.lotNumber
                          ? bidderLotDetails?.lotNumber
                          : "",
                        3
                      )}
                    </div>
                  </div>
                </div>
                <div className={"grid-col-3"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <strong>Lot Name</strong>
                    </div>
                  </div>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <div className={"grid-row"}>
                        <div className={"grid-col-12"}>
                          {bidderLotDetails?.lotName}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"grid-col-3"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <strong>Sale Start Date</strong>
                    </div>
                  </div>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      {moment(bidderLotDetails?.startDate).format(
                        "MM/DD/YYYY hh:mm a"
                      )}
                    </div>
                  </div>
                </div>
                <div className={"grid-col-3"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <strong>Sale Close Date</strong>
                    </div>
                  </div>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      {moment(bidderLotDetails?.endDate).format(
                        "MM/DD/YYYY hh:mm a"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={"grid-row"}>
                <div className={"grid-col-3"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <strong>Sale Status</strong>
                    </div>
                  </div>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      {bidderLotDetails?.status}
                    </div>
                  </div>
                </div>
                <div className={"grid-col-3"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <strong>Number of Bidders</strong>
                    </div>
                  </div>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      {bidderLotDetails?.numberOfBidders}
                    </div>
                  </div>
                </div>
                <div className={"grid-col-3"}>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      <strong>Reserve Price</strong>
                    </div>
                  </div>
                  <div className={"grid-row"}>
                    <div className={"grid-col-12"}>
                      $
                      {bidderLotDetails?.reserveAmount
                        ? bidderLotDetails?.reserveAmount
                            ?.toString()
                            ?.split(/(?=(?:\d{3})+(?:\.|$))/g)
                            .join(",")
                        : "0"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </>
    </StrictMode>
  );
};
const mapStateToProps = (state) => ({
  agencyBureaus: state.common.agencyBureaus,
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewBidsLotDetails);
