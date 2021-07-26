import React, { StrictMode, useContext, useEffect, useState } from "react";
import { ContractDetailsContext } from "../common/ContractDetailsContext";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import ContractPaymentList from "../common/ContractPaymentList";
import ContractBidderSummary from "../common/ContractBidderSummary";
import { isEmptyCheck } from "../../../../property/create-update-property/validations/propertyFieldValidations";
import ContractFeeDetails from "../../../../sales/contracts/contract-refund/ContractFeeDetails";
import ContractNotesFileUpload from "../common/ContractNotesFileUpload";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import RefundModal from "./RefundModal";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { PageHelper, Paths } from "../../../../Router";
import ContractFeeSummary from "../common/ContractFeeSummary";

interface ContractRefundDetailsProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  roles: any;
}

const ContractRefundDetails = (props: ContractRefundDetailsProps) => {
  const { match, actions, roles } = props;
  const {addToast} = props.actions;
  let { contractDetailsState, updateContractDetailsState } = useContext(
    ContractDetailsContext
  );
  let contractNumber: string = "";
  if (match?.params?.contractNumber) {
    contractNumber = match?.params?.contractNumber;
  }
  const [currentRefundNotes, setCurrentRefundNotes] = useState("");
  const [registerId, setRegisterId] = useState(null);
  const [registerNumber, setRegisterNumber] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [trackingId, setTrackingId] = useState("")
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  let salesAPIService = new SalesApiService();

  const onSubmit = () => {
    let data ={
      notes: currentRefundNotes
    };
    salesAPIService
    .submitRefund(contractDetailsState.data.contractDetails.contractId, data)
    .then((response)=>{
      addToast({
        text: `Successfully submitted the refund for the contract ${contractNumber}`,
        type: "success",
        heading: "Success",
      });
      PageHelper.openPage(
        `${Paths.contractRefundList}`
      );
    })
    .catch((error)=>{
      addToast({
        text: "Error confirming request",
        type: "error",
        heading: "Error",
      });
    })
  };
  const cancelRefund = () => {
    salesAPIService
    .cancelRefund(contractDetailsState.data.contractDetails.contractId)
    .then((response)=>{})
    .catch((error)=>{
      addToast({
        text: "Error confirming request",
        type: "error",
        heading: "Error",
      });
    })
  };
  const handleRefund =(payId, amount, trackId) =>{
    setPaymentId(payId);
    setRefundAmount(amount);
    setTrackingId(trackId);
    setShowRefundModal(true);
  }
  const handleRefundAmountChange = (value) =>{
    setRefundAmount(value);
  }
  const handleTrackingIdChange = (value) =>{
    setTrackingId(value);
  }
  const handleCloseRefundModal = () => {
    setRefundAmount("");
    setTrackingId("");
    setShowRefundModal(false);
  }
  const handleSaveRefundModal = (value) =>{
    let data  = {
      contractId: contractDetailsState.data.contractDetails.contractId,
      paymentId: value,
      refundAmount: refundAmount,
      trackingId: trackingId,
    }
    salesAPIService
    .saveRefund(data)
    .then((response) =>{
      addToast({
        text: `Successfully saved the refund details`,
        type: "success",
        heading: "Success",
      });
      handleCloseRefundModal();
    })
    .catch((error)=>{
      addToast({
        text: "Error confirming request",
        type: "error",
        heading: "Error",
      });
    })
  }
  return (
    <>
      <StrictMode>
        <div className={"grid-conatiner ui-ppms"}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className={"container"}>
                <div className="item-search-result">
                  <h1>Refund Details</h1>
                </div>
              </div>
            </div>
          </div>
          <br />
          <ContractBidderSummary
            setRegisterId={setRegisterId}
            setRegisterNumber={setRegisterNumber}
            contractNumber={contractNumber}
          />
            <div className={"grid-row grid-gap-4"}>
              <ContractFeeSummary contractFeeDetails={contractDetailsState?.data?.contractFeeDetails} type={"refund"}/>
            </div>
          <ContractPaymentList
            paymentDetails={contractDetailsState?.data?.paymentDetails}
            registerId={registerId}
            handleRefund={handleRefund}
            type={"refund"}
            roles={roles}
            registerNumber={registerNumber}
          />
          <ContractNotesFileUpload
            contractDetails={contractDetailsState?.data?.contractDetails}
            setCurrentRefundNotes={setCurrentRefundNotes}
            noteType={"REFUND"}
          />
          <div className="desktop:grid-col-9">
            <PPMSButton
              id={"add-new-lot-link"}
              label={"Submit"}
              className={"out-button"}
              onPress={onSubmit}
              isDisabled={false}
            />
            <PPMSButton
              id={"add-new-lot-link"}
              label={"Cancel"}
              className={"out-button"}
              onPress={() => {
                cancelRefund();
                PageHelper.openPage(
                  `${Paths.contractRefundList}`
                );
              }}
              isDisabled={false}
            />
          </div>
        </div>
        <div className="grid-row grid-gap-4">
        <PPMSModal
        show={showRefundModal}
        handleClose={handleCloseRefundModal}
        handleSave={() => handleSaveRefundModal(paymentId)}
        title={"Refund"}
        centered={true}
        backdrop={"static"}
        labelCancel={"Cancel"}
        body={
          <RefundModal handleRefundAmountChange={handleRefundAmountChange} handleTrackingIdChange={handleTrackingIdChange} refundAmount={refundAmount} trackingId={trackingId}/>
        }
        id={"refund-modal"}
      />
        </div>
      </StrictMode>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators({ addToast }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractRefundDetails);
