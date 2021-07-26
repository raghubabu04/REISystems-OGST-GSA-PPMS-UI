import React, { useContext, useEffect, useState } from "react";
import { PPMSAccordion } from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PaymentDetailsContext } from "./CreateUpdateContext";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import Awards from "./components/Awards";
import Payment from "./components/Payment";
import { commonActions } from "../../../../../_redux/_actions/common.actions";
import {
  cash,
  check,
  checkValidation,
  creditCard,
  generateValidRequest,
  paymentDetailUpdate,
  validatePaymentDetail,
  validity,
  wireTransfer,
} from "../common/constants/Utils";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { PageHelper, Paths } from "../../../../Router";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import moment from "moment";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { currencyToNumber } from "../../../../../ui-kit/utilities/FormatUtil";

interface CreateProps {
  actions?: any;
  location?: any;
  holiday?: any;
  getHolidays?: any;
  isSinglePayment?: boolean;
  contractIds?: any[];
  bidderId: number;
}

const CreateUpdate = (props: CreateProps) => {
  const {
    holiday,
    getHolidays,
    isSinglePayment,
    contractIds,
    bidderId,
  } = props;
  const salesAPIService = new SalesApiService();
  const auctionAPIService = new AuctionsApiService();
  const [showModal, updateShowModal] = useState(false);
  let shownItems = [];
  const { addToast } = props.actions;
  const { paymentDetailsState, updatePaymentDetailsState } = useContext(
    PaymentDetailsContext
  );
  useEffect(() => {
    let state = paymentDetailsState;
    state.paymentDetail.data.processedBy = "Sales";
    updatePaymentDetailsState(state);
  }, []);

  const [totalAmountData, updateTotalAmountData] = useState(null);
  const submitPayment = (bidderId, state) => {
    state.other.saveDisabled = true;
    let data = generateValidRequest(state, contractIds);
    salesAPIService
      .addPayments(data, bidderId)
      .then(() => {
        resetPayment();
        addToast({
          text: `Payment submitted successfully.`,
          type: "success",
          heading: "Success",
        });
        PageHelper.openPage(Paths.bidderPayments);
      })
      .catch((error) => {
        console.error(error);
        addToast({
          text: `Payment could not be processed.`,
          type: "error",
          heading: "Error",
        });
      })
      .finally(() => {
        state.other.saveDisabled = false;
        updatePaymentDetailsState(state);
      });
  };
  const closeModal = () => {
    updateShowModal(false);
  };

  const submitPaymentPrep = (state) => {
    let validState = checkValidation(state);
    updatePaymentDetailsState(validState);
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
    let totalDue = state.paymentDetail.data.amountDue;
    let totalPaid = state.paymentDetail.data.amountPaid;
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
  const getAwardDetails = (contractId) => {
    auctionAPIService
      .getAwardDetails(contractId)
      .then((response) => {
        let state = paymentDetailsState;
        state.awardDetail.data = response.data;
        updatePaymentDetailsState(state);
      })
      .catch((error) => {
        console.error(error);
      });
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
      { id: `by-sales`, value: "Sales", isSelected: true },
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
        let state = paymentDetailsState;
        state.paymentDetail.data.amountDue = response?.data?.totalAmountDue;
        state.paymentDetail.data.amountPaid = response?.data?.totalAmountPaid;
        updatePaymentDetailsState(state);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const resetPayment = () => {
    let state = paymentDetailsState;
    state.other.typesSelected = paymentTypes;

    state.paymentDetail.data.methodOfPayment.cash = cash().data;
    state.paymentDetail.validation.methodOfPayment.cash = cash().validation;

    state.paymentDetail.data.methodOfPayment.check = check().data;
    state.paymentDetail.validation.methodOfPayment.check = check().validation;

    state.paymentDetail.data.methodOfPayment.creditCard = creditCard().data;
    state.paymentDetail.validation.methodOfPayment.creditCard = creditCard().validation;

    state.paymentDetail.data.methodOfPayment.wireTransfer = wireTransfer().data;
    state.paymentDetail.validation.methodOfPayment.wireTransfer = wireTransfer().validation;

    updatePaymentDetailsState(state);
    updatePaymentTypeOptions(createOptions);
    updatePaymentType(paymentTypes);
  };
  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  const updatePayment = (type, value) => {
    let state = paymentDetailsState;
    updatePaymentDetailsState(paymentDetailUpdate(type, value, state));
  };
  const updateTypes = (typesSelected) => {
    let state = paymentDetailsState;
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
    updatePaymentDetailsState(state);
  };

  const validatePayment = (type, value) => {
    let state = paymentDetailsState;
    updatePaymentDetailsState(validatePaymentDetail(type, value, state));
  };

  const buttons = (
    <div className="grid-row grid-gap-2">
      <div className="grid-col">
        <div className={"grid-row grid-gap-3"}>
          <div className={"grid-col-auto"}>
            <PPMSButton
              id={"submit-payment"}
              label={"Submit"}
              type={"button"}
              className={"primary"}
              onPress={() => submitPaymentPrep(paymentDetailsState)}
              isDisabled={
                paymentDetailsState.other.saveDisabled ||
                !(
                  paymentDetailsState.other.typesSelected.cash ||
                  paymentDetailsState.other.typesSelected.check ||
                  paymentDetailsState.other.typesSelected.wireTransfer ||
                  paymentDetailsState.other.typesSelected.creditCard
                )
              }
            />
          </div>
          <div className={"grid-col-auto"}>
            <PPMSButton
              id={"cancel-payment"}
              label={"Cancel"}
              type={"button"}
              className={"primary"}
              isDisabled={paymentDetailsState.other.saveDisabled}
              onPress={() => resetPayment()}
            />
          </div>
        </div>
      </div>
    </div>
  );
  let awardDetail = {
    title: "Award Details",
    content: (
      <>
        <Awards
          saleLotNumber={paymentDetailsState?.awardDetail?.data?.saleLotNumber}
          lotName={paymentDetailsState?.awardDetail?.data?.lotName}
          contractNumber={
            paymentDetailsState?.awardDetail?.data?.contractNumber
          }
          awardDate={moment(
            paymentDetailsState?.awardDetail?.data?.awardDate
          ).format("MM/DD/YYYY hh:mmA")}
          paymentDueDate={moment(
            paymentDetailsState?.awardDetail?.data?.paymentDueDate
          ).format("MM/DD/YYYY hh:mmA")}
        />
      </>
    ),
    expanded: true,
    id: "award-details-id",
    className: "award-details",
  };

  let payments = {
    title: "Payment Details",
    content: (
      <>
        <Payment
          holiday={holiday}
          getHolidaysByYear={getHolidaysByYear}
          isSinglePayment={isSinglePayment}
          paymentDetails={paymentDetailsState.paymentDetail}
          updatePayment={updatePayment}
          validatePayment={validatePayment}
          paymentTypes={paymentType}
          createOptions={paymentTypeOptions}
          updateTypes={updateTypes}
          showProcessedBy={false}
          processedByOptions={processedByOptions}
          updateProcessedByOptions={updateProcessedByOptions}
        />
      </>
    ),
    expanded: true,
    id: "payment-details-id",
    className: "payment-details",
  };
  const prepareView = () => {
    let views = [];
    if (contractIds?.length === 1) {
      views.push(awardDetail);
    }
    views.push(payments);
    return views;
  };
  useEffect(() => {
    if (contractIds?.length === 1) {
      getAwardDetails(contractIds[0]);
    }
    getPaymentDetails(contractIds);
  }, []);
  shownItems = prepareView();
  return (
    <div>
      <>
        {buttons}
        <br />
        <div className={"grid-row"}>
          <div className={"grid-col-12"}>
            <PPMSAccordion items={shownItems} />
          </div>
          <br />
        </div>
        {buttons}
      </>
      <PPMSModal
        id={"confirmation-window"}
        show={showModal}
        body={<>{totalAmountData?.message}</>}
        title={"Confirmation"}
        handleClose={closeModal}
        handleSave={() => {
          submitPayment(bidderId, paymentDetailsState);
        }}
        hideLabel={totalAmountData?.id === 1}
        label={"Submit"}
        labelCancel={totalAmountData?.id === 1 ? "Close" : "Cancel"}
      />
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
  };
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  holiday: state.common.holiday,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateUpdate);
