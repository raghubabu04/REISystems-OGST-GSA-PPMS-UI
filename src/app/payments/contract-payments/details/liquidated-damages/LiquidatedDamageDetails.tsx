import React, { StrictMode, useContext, useEffect, useState } from "react";
import { ContractDetailsContext } from "../common/ContractDetailsContext";
import ContractBidderSummary from "../common/ContractBidderSummary";
import ContractNotesFileUpload from "../common/ContractNotesFileUpload";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import {
  cash,
  check,
  checkValidation,
  creditCard,
  paymentDetailUpdate,
  validatePaymentDetail,
  validity,
  wireTransfer,
} from "../../../bidder-payments/details/common/constants/Utils";
import { PageHelper, Paths } from "../../../../Router";
import {
  currencyToNumber,
  formatCurrency,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import Payment from "../../../bidder-payments/details/create/components/Payment";
import { PPMSAccordion } from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { generateRequest } from "./common/Utils";
import { isRequiredValidation } from "../../../../../ui-kit/components/validations/FieldValidations";
interface LiquidatedDamageDetailsProps {
  match: any;
  user: any;
  location: any;
  holiday?: any;
  getHolidays?: any;
  actions?: any;
  roles: any;
}
const LiquidatedDamageDetails = (props: LiquidatedDamageDetailsProps) => {
  const { match, actions, holiday, getHolidays, roles } = props;
  const { addToast } = actions;
  let contractNumber: string = "";
  if (match?.params?.contractNumber) {
    contractNumber = match?.params?.contractNumber;
  }
  let { contractDetailsState, updateContractDetailsState } = useContext(
    ContractDetailsContext
  );
  let shownItems = [];
  const [showModal, updateShowModal] = useState(false);
  const [totalAmountData, updateTotalAmountData] = useState(null);
  const [currentRefundNotes, setCurrentRefundNotes] = useState("");
  const [liquidatedDamage, updateLiquidatedDamage] = useState({
    value: null,
    isInvalid: null,
    validationMessage: "",
  });
  const [resetNotes, updateResetNotes] = useState(false);

  const salesAPIService = new SalesApiService();
  const updateTypes = (typesSelected) => {
    let state = contractDetailsState;
    state.other.typesSelected = typesSelected;
    updatePaymentType(typesSelected);
    if (!typesSelected.cash) {
      state.paymentDetail.data.methodOfPayment.cash = cash().data;
      state.paymentDetail.validation.methodOfPayment.cash = cash().validation;
    }
    if (!typesSelected.check) {
      state.paymentDetail.data.methodOfPayment.check = check().data;
      state.paymentDetail.validation.methodOfPayment.check = check().validation;
    }
    if (!typesSelected.creditCard) {
      state.paymentDetail.data.methodOfPayment.creditCard = creditCard().data;
      state.paymentDetail.validation.methodOfPayment.creditCard = creditCard().validation;
    }
    if (!typesSelected.wireTransfer) {
      state.paymentDetail.data.methodOfPayment.wireTransfer = wireTransfer().data;
      state.paymentDetail.validation.methodOfPayment.wireTransfer = wireTransfer().validation;
    }
    updateContractDetailsState(state);
  };
  const validatePayment = (type, value) => {
    let state = contractDetailsState;
    updateContractDetailsState(validatePaymentDetail(type, value, state));
  };

  const submitPayment = (state, notes) => {
    state.other.saveDisabled = true;
    let bidderId = state.data.bidderDetails.bidderId;
    let data = generateRequest(
      state,
      notes,
      [state?.data?.contractDetails?.contractId],
      roles
    );
    salesAPIService
      .liquidatedDamagePayment(data, bidderId)
      .then(() => {
        resetPayment();
        addToast({
          text: `${roles.isCLO?"Payment submitted successfully.":"Notes Saved Successfully."}`,
          type: "success",
          heading: "Success",
        });
        PageHelper.openPage(Paths.bidderPayments);
      })
      .catch((error) => {
        console.error(error);
        addToast({
          text: `${roles.isCLO?"Payment could not be processed.":"Notes could not be saved."}`,
          type: "error",
          heading: "Error",
        });
      })
      .finally(() => {
        state.other.saveDisabled = false;
        updateContractDetailsState(state);
      });
  };
  const submitPaymentPrep = (state) => {
    let validState = checkValidation(state);
    updateContractDetailsState(validState);
    let validation = validity(validState);
    if (validation.valid) {
      updateTotalAmountData(totalAmountCheck(validState));
      updateShowModal(true);
    } else {
      addToast({
        text: `${validation.invalidMessage}`,
        type: "error",
        heading: "Error",
      });
    }
  };
  const totalAmountCheck = (state) => {
    let data = {
      message: "",
      id: 0,
    };
    let totalDue = currencyToNumber(
      state.data.contractFeeDetails.liquidatedDamageFee
    );
    let totalToPay = 0;
    if (state.other.typesSelected.check) {
      totalToPay += currencyToNumber(
        state.paymentDetail.data.methodOfPayment.check.amount
      );
    }
    if (state.other.typesSelected.cash) {
      totalToPay += currencyToNumber(
        state.paymentDetail.data.methodOfPayment.cash.amount
      );
    }
    if (state.other.typesSelected.creditCard) {
      state.paymentDetail.data.methodOfPayment.creditCard.forEach((card) => {
        totalToPay += currencyToNumber(card.amount);
      });
    }
    if (state.other.typesSelected.wireTransfer) {
      totalToPay += currencyToNumber(
        state.paymentDetail.data.methodOfPayment.wireTransfer.amount
      );
    }
    if (totalToPay > totalDue) {
      data.id = 1;
      data.message =
        "The total amount entered is greater than amount due. Please update the information.";
    } else if (totalToPay < totalDue) {
      data.id = 2;
      data.message =
        "The total amount entered is less than the amount due. Do you want to continue to submit payment information?";
    } else if (totalToPay === totalDue) {
      data.id = 3;
      data.message =
        "The total amount entered is equal to the amount due. Do you want to submit payment information?";
    }
    return data;
  };
  const closeModal = () => {
    updateShowModal(false);
  };

  const updatePayment = (type, value) => {
    let state = contractDetailsState;
    updateContractDetailsState(paymentDetailUpdate(type, value, state));
  };
  const paymentTypes: any = () => {
    return {
      cash: false,
      check: false,
      creditCard: false,
      wireTransfer: false,
    };
  };
  const createOptions = () => {
    return [
      { id: "creditCard", value: "Credit Card", isSelected: false },
      { id: "cash", value: "Cash", isSelected: false },
      { id: "check", value: "Check", isSelected: false },
      { id: "wireTransfer", value: "Wire Transfer", isSelected: false },
    ];
  };
  const processedByCheck: any = () => {
    return [
      { id: `by-finance`, value: "Finance", isSelected: false },
      { id: `by-sales`, value: "Sales", isSelected: false },
    ];
  };
  const [processedByOptions, updateProcessedByOptions] = useState(
    processedByCheck()
  );
  const [paymentTypeOptions, updatePaymentTypeOptions] = useState(
    createOptions()
  );
  const [paymentType, updatePaymentType] = useState(paymentTypes);
  const getPaymentDetails = (contractIds) => {
    salesAPIService
      .getPaymentDetails(contractIds)
      .then((response) => {
        let state = contractDetailsState;
        state.paymentDetail.data.amountDue = response?.data?.totalAmountDue;
        state.paymentDetail.data.amountPaid = response?.data?.totalAmountPaid;
        updateContractDetailsState(state);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const resetPayment = () => {
    let state = contractDetailsState;
    state.other.typesSelected = paymentTypes;

    state.paymentDetail.data.methodOfPayment.cash = cash().data;
    state.paymentDetail.validation.methodOfPayment.cash = cash().validation;

    state.paymentDetail.data.methodOfPayment.check = check().data;
    state.paymentDetail.validation.methodOfPayment.check = check().validation;

    state.paymentDetail.data.methodOfPayment.creditCard = creditCard().data;
    state.paymentDetail.validation.methodOfPayment.creditCard = creditCard().validation;

    state.paymentDetail.data.methodOfPayment.wireTransfer = wireTransfer().data;
    state.paymentDetail.validation.methodOfPayment.wireTransfer = wireTransfer().validation;
    state.paymentDetail.data.processedBy = null;
    let formattedValue = contractDetailsState.data.contractFeeDetails
      .liquidatedDamageFee
      ? formatCurrency.format(
          parseInt(
            contractDetailsState.data.contractFeeDetails.liquidatedDamageFee
              .toString()
              .replace(/[^0-9.]/g, "")
          )
        )
      : null;
    updateLiquidatedDamage({
      value: formattedValue,
      isInvalid: null,
      validationMessage: "",
    });
    updateProcessedByOptions(processedByCheck);
    updateContractDetailsState(state);
    updatePaymentTypeOptions(createOptions);
    updatePaymentType(paymentTypes);
    updateResetNotes(!resetNotes);
    setCurrentRefundNotes("");
  };
  useEffect(() => {
    if (contractDetailsState?.data?.contractDetails?.contractId) {
      getPaymentDetails([
        contractDetailsState?.data?.contractDetails?.contractId,
      ]);
    }
  }, [contractDetailsState?.data?.contractDetails?.contractId]);

  const updateLiqDamageFromAPI = (liqDamage) => {
    let data = liquidatedDamage;
    data.value = liqDamage
      ? formatCurrency.format(
          parseInt(liqDamage.toString().replace(/[^0-9.]/g, ""))
        )
      : null;
    updateLiquidatedDamage(data);
  };

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  let payments = {
    title: "Payment Details",
    content: (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-3"}>
            <strong>
              <span>Claim Number:</span>
            </strong>{" "}
            {contractDetailsState.data.contractFeeDetails.paymentClaimNumber
              ? contractDetailsState.data.contractFeeDetails.paymentClaimNumber
              : "-"}
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-4"}>
            <PPMSInput
              id={"liquidated-damage-fee"}
              inputType={"text"}
              isDisabled={!roles.isCLO}
              isInvalid={liquidatedDamage.isInvalid}
              validationMessage={liquidatedDamage.validationMessage}
              label={"Liquidated Damage Fee"}
              labelBold={true}
              value={liquidatedDamage.value}
              onChange={(event) => {
                updateLiquidatedDamage({
                  value: event.target.value.replace(/[^0-9.]/g, ""),
                  isInvalid: liquidatedDamage.isInvalid,
                  validationMessage: liquidatedDamage.validationMessage,
                });
              }}
              onBlur={(event) => {
                let formattedValue = event.target.value
                  ? event.target.value.replace(/[^0-9.]/g, "")
                  : null;
                let validity = isRequiredValidation(
                  "Liquidated Damage Fee",
                  event.target.value
                );
                updateLiquidatedDamage({
                  value: formattedValue
                    ? formatCurrency.format(formattedValue)
                    : null,
                  isInvalid: validity.isInvalid,
                  validationMessage: validity.validationError,
                });
              }}
              isRequired={true}
            />
          </div>
        </div>
        {roles.isCLO && (
          <Payment
            holiday={holiday}
            getHolidaysByYear={getHolidaysByYear}
            isSinglePayment={false}
            paymentDetails={contractDetailsState?.paymentDetail}
            updatePayment={updatePayment}
            validatePayment={validatePayment}
            paymentTypes={paymentType}
            createOptions={paymentTypeOptions}
            updateTypes={updateTypes}
            showProcessedBy={true}
            processedByOptions={processedByOptions}
            updateProcessedByOptions={updateProcessedByOptions}
          />
        )}
      </>
    ),
    expanded: true,
    id: "payment-details-id",
    className: "payment-details",
  };
  const prepareView = () => {
    let views = [];
    views.push(payments);
    return views;
  };
  shownItems = prepareView();

  return (
    <>
      <StrictMode>
        <div className={"grid-conatiner ui-ppms"}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className={"container"}>
                <div className="item-search-result">
                  <h1>Liquidated Damage Details</h1>
                </div>
              </div>
            </div>
          </div>
          <br />
          <ContractBidderSummary
            contractNumber={contractNumber}
            updateLiqDamageAmount={(liqDamageFee) =>
              updateLiqDamageFromAPI(liqDamageFee)
            }
          />

          <div>
            <>
              <br />
              <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                  <PPMSAccordion
                    items={shownItems.length > 0 ? shownItems : []}
                  />
                </div>
                <br />
              </div>
            </>
          </div>
          <PPMSModal
            id={"confirmation-window"}
            show={showModal}
            body={<>{totalAmountData?.message}</>}
            title={"Confirmation"}
            handleClose={closeModal}
            handleSave={() => {
              submitPayment(contractDetailsState, currentRefundNotes);
            }}
            hideLabel={totalAmountData?.id === 1}
            label={"Submit"}
            labelCancel={totalAmountData?.id === 1 ? "Close" : "Cancel"}
          />
          <ContractNotesFileUpload
            contractDetails={contractDetailsState?.data?.contractDetails}
            setCurrentRefundNotes={setCurrentRefundNotes}
            noteType={"REFUND"}
            resetNotes={resetNotes}
          />
          <div className="desktop:grid-col-9">
            <PPMSButton
              id={"submit-liquidated-damage"}
              label={"Submit"}
              className={"out-button"}
              onPress={() =>
                roles.isCLO
                  ? submitPaymentPrep(contractDetailsState)
                  : submitPayment(contractDetailsState, currentRefundNotes)
              }
              isDisabled={
                contractDetailsState?.other.saveDisabled ||
                (roles.isCLO &&
                  !(
                    contractDetailsState?.other.typesSelected.cash ||
                    contractDetailsState?.other.typesSelected.check ||
                    contractDetailsState?.other.typesSelected.wireTransfer ||
                    contractDetailsState?.other.typesSelected.creditCard
                  ))
              }
            />
            <PPMSButton
              id={"cancel-liquidated-damage"}
              label={"Cancel"}
              className={"out-button"}
              onPress={() => {
                resetPayment();
              }}
              isDisabled={false}
            />
          </div>
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
)(LiquidatedDamageDetails);
