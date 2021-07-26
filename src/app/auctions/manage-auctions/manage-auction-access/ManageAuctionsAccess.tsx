import React, { StrictMode, useContext, useEffect } from "react";
import { ManageAuctionAccessContext } from "./ManageAuctionAccessContext";
import { Tab, Tabs } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import TerminateAuction from "./terminate-auction/TerminateAuction";
import { LotAuctionListContextProvider } from "../../../sales/management/lot-auction-approval/LotAuctionListContext";
import SaleNumberDetails from "../../../sales/management/common/SaleNumberDetails";
import queryString from "query-string";
import ManageAuction from "./manage-auction/ManageAuction";
import ExtendAuction from "./extend-auction/ExtendAuction";
import ViewBids from "./view-bids/ViewBids";
import { PageHelper, Paths } from "../../../../app/Router";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSActionList } from "../../../../ui-kit/components/PPMS-action-list";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { AuctionsApiService } from "../../../../api-kit/auctions/auctions-api-service";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";

interface ManageAuctionsAccessProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

function ManageAuctionAccess(props: ManageAuctionsAccessProps) {
  const { match, location } = props;
  const auctionsApiService = new AuctionsApiService();
  const saleService = new SalesApiService();
  const onlineMethod = ["internet", "vas", "Online Auction"];

  const {
    manageAuctionAccessState,
    updateManageAuctionAccessState,
  } = useContext(ManageAuctionAccessContext);

  let search = location.search;

  let query = queryString.parse(search);

  let saleId = null;
  let saleNumber = null;
  if (match.params.saleId) {
    saleId = match.params.saleId;
    saleNumber = match.params.saleNumber;
  }

  const handleManageAuctionsActionHistory = () => {
    let state = manageAuctionAccessState;
    let saleNumber = match.params.saleId ? match.params.saleNumber : null;
    const data = {
      params: {
        objectType: "AUCTIONS",
        objectId: saleNumber.replace(/[^a-zA-Z0-9 ]/g, ""),
      },
    };
    auctionsApiService
      .getActionHistoryForAuctions(data)
      .then((response: any) => {
        updateManageAuctionAccessState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  function handleClose() {
    updateManageAuctionAccessState({
      showActionHistoryModal: false,
    });
  }

  useEffect(() => {
    saleService
      .getSaleDetails(saleId)
      .then((res) => {
        let salesDetails = res.data.salesNumberDetails;
        updateManageAuctionAccessState({
          salesMethod: salesDetails?.salesMethod,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <StrictMode>
      <LotAuctionListContextProvider>
        <div className={"manage-auction-access"}>
          <SaleNumberDetails saleId={saleId} zoneId={query.zoneId} />
          <div className={"action-history-button-div"}>
            <PPMSButton
              variant={"secondary"}
              label={"Action History"}
              size={"lg"}
              onPress={handleManageAuctionsActionHistory}
              className={"action-history-btn"}
              id={"action-history"}
            />
          </div>
          <br />
          {!manageAuctionAccessState.isLoading && (
            <Tabs
              justify
              defaultActiveKey={
                onlineMethod.includes(manageAuctionAccessState.salesMethod)
                  ? "manage-bidders"
                  : "extend-auction"
              }
              id="manage-auction-access"
              variant="tabs"
              className="ppms-tabs"
            >
              {onlineMethod.includes(manageAuctionAccessState.salesMethod) && (
                <Tab eventKey="manage-bidders" title="Manage Bidders">
                  <ManageAuction {...props} />
                </Tab>
              )}

              <Tab eventKey="extend-auction" title="Extend Auctions">
                <ExtendAuction {...props} />
              </Tab>

              <Tab eventKey="terminate-auction" title="Terminate Auctions">
                <TerminateAuction {...props} />
              </Tab>

              {onlineMethod.includes(manageAuctionAccessState.salesMethod) && (
                <Tab eventKey="view-bids" title="View Bids">
                  <ViewBids saleId={saleId} sourceTab={"viewBids"} {...props} />
                </Tab>
              )}
            </Tabs>
          )}
        </div>
        <div className="grid-row grid-gap-4">
          <PPMSModal
            body={
              <ModalActionHistoryContent
                data={manageAuctionAccessState.actionHistoryData}
                listID={"list-id"}
                title={match.params.saleNumber}
              />
            }
            id={"show-action-history"}
            show={manageAuctionAccessState.showActionHistoryModal}
            handleClose={handleClose}
            handleSave={""}
            title={"Action History: " + match.params.saleNumber}
            centered={true}
            backdrop={"static"}
            label={"Ok"}
            hideLabelCancel={true}
            hideLabel={manageAuctionAccessState.showActionHistoryModal}
            size={manageAuctionAccessState.showActionHistoryModal ? "lg" : null}
          />
        </div>
        <div className={"grid-row-auto"}>
          <PPMSButton
            id={"back"}
            type={"button"}
            variant={"link"}
            label={"< Back To Manage Auctions"}
            onPress={() => PageHelper.openPage(Paths.manageAuctionList)}
            className="back-to-manage-auction usa-button "
          />
        </div>
      </LotAuctionListContextProvider>
    </StrictMode>
  );
}

export const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAuctionAccess);
