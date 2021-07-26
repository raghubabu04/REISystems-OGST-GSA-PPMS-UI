import React, { StrictMode, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import BidderPaymentHistory from "./bidderPaymentHistory/BidderPaymentHistory";
import OpenUnpaidDetails from "../../open-unpaid-contract/OpenUnpaidDetails";
import BidderDetails from "../../common/BidderDetails";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { ModalActionHistoryContent } from "../../../sales/management/transactions/SalesTransaction";

interface BidderPaymentDetailsProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

const BidderPaymentDetails = (props: BidderPaymentDetailsProps) => {
  const { match } = props;
  const [bidderDetail, updateBidderDetail] = useState(null);
  const [actionhistory, setActionHistory] = useState([]);
  const [actionModal, setActionModal] = useState(false);
  let bidderId = null;
  if (match.params.bidderId) {
    bidderId = match.params.bidderId;
  }
  let salesAPIService: SalesApiService = new SalesApiService();

  function handleHistory() {
    const data = {
      params: {
        objectType: "PAYMENT",
        objectId: bidderId,
      },
    };
    salesAPIService
      .getActionHistoryForSalesObject(data)
      .then((response: any) => {
        setActionHistory(response.data);
        setActionModal(true);
        console.log("This is the moodel", actionModal);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
    <StrictMode>
      <div className={"bidder-payments-details"}>
        <div className="grid-row header-row mb-3">
          <h1>Bidder Payment Details</h1>
        </div>
        <BidderDetails
          userName={bidderDetail?.bidderUserName}
          name={bidderDetail?.bidderName}
          totalOpenContracts={bidderDetail?.totalOpenContracts}
          totalAmountDue={bidderDetail?.totalAmountDue}
          status={bidderDetail?.status}
        />
        <div className={"grid-conatiner ui-ppms"}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className="grid-row tablet:grid-gap-2  ">
                <div className={"grid-col cart-row cart-tray"}></div>
                <div className="grid-col-3 flex-top-tray">
                  <PPMSButton
                    className={"out-button"}
                    type={"button"}
                    value={""}
                    label={"Action History"}
                    onPress={() => handleHistory()}
                    id={"action-history"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />

        <Tabs
          justify
          defaultActiveKey={"open-unpaid-contracts"}
          id="bidder-payment-details-tabs"
          className="ppms-tabs"
          variant="tabs"
        >
          <Tab eventKey="open-unpaid-contracts" title="Open/Unpaid Contracts">
            <OpenUnpaidDetails
              {...props}
              bidderId={bidderId}
              updateBidderContractDetail={(data) => updateBidderDetail(data)}
            />
          </Tab>
          <Tab eventKey="bidder-payment-history" title="Bidder Payment History">
            <BidderPaymentHistory {...props} />
          </Tab>
        </Tabs>

        <div className="grid-row grid-gap-4">
          <PPMSModal
            body={
              <ModalActionHistoryContent
                data={actionhistory}
                listID={"list-id"}
                title={bidderDetail?.bidderUserName}
              />
            }
            id={"show-action-history"}
            show={actionModal}
            handleClose={() => {
              setActionModal(false);
            }}
            handleSave={""}
            title={"Payment History: "}
            centered={true}
            backdrop={"static"}
            label={"Ok"}
            hideLabelCancel={true}
            hideLabel={true}
            size={actionModal ? "lg" : null}
          />
        </div>
      </div>
    </StrictMode>
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
)(BidderPaymentDetails);
