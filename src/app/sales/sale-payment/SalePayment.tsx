import React, { useContext, useEffect } from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { SalePaymentContext } from "./PaymentContext";
import SearchContract from "./search-contract/SearchContract";
import Payment from "./payment/Payment";
import { FleetButtons } from "../fleet/edit-fleet/FleetButtons";

import { isFormSubmitted } from "../../../service/validation.service";
import {
  validateTotalPaymentAmountOnSubmit,
  validationPendingAmountOnSubmit,
} from "./constants/Validations";
import { FleetApiService } from "../../../api-kit/sales/fleet-api-service";
import { PPMSAccordion } from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { SalePaymentDTO } from "./salePaymentDTO";
import { PageHelper, Paths } from "../../Router";

interface SalePaymentProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function SalePayment(props: SalePaymentProps) {
  const {
    salePaymentState,
    updateSalePaymentState,
    searchContractState,
    bidderInformationState,
    paymentState,
    updatePaymentState,
  } = useContext(SalePaymentContext);

  const fleetApiService = new FleetApiService();

  function toggleAccordion(event, section) {
    let { accordion } = salePaymentState;
    let isExpanded = !accordion[section];
    accordion[section] = isExpanded;
    updateSalePaymentState({
      accordion: accordion,
    });
  }

  useEffect(() => {
    const { primary } = paymentState;
    const { secondary } = paymentState;
    primary.cardNumber = "";
    primary.cardType = "";
    primary.expDate = "";
    primary.cvv = "";
    primary.amount = "";
    primary.cardHolderName = "";
    primary.cardHolderNameIsInValid = false;
    primary.cardHolderNameIsValid = false;
    primary.cardHolderValidationMessage = "";
    primary.cardNumberIsInValid = false;
    primary.cardNumberIsValid = false;
    primary.cardNumberValidationMessage = "";
    primary.cardTypeIsInValid = false;
    primary.cardTypeIsValid = false;
    primary.cardTypeValidationMessage = "";
    primary.expDateIsInValid = false;
    primary.expDateIsValid = false;
    primary.expDateValidationMessage = "";
    primary.cvvIsInValid = false;
    primary.cvvIsValid = false;
    primary.cvvValidationMessage = "";
    primary.amountIsInValid = false;
    primary.amountIsValid = false;
    primary.amountValidationMessage = "";
    secondary.cardNumber = "";
    secondary.cardType = "";
    secondary.expDate = "";
    secondary.cvv = "";
    secondary.amount = "";
    secondary.cardHolderName = "";
    secondary.cardHolderNameIsInValid = false;
    secondary.cardHolderNameIsValid = false;
    secondary.cardHolderValidationMessage = "";
    secondary.cardNumberIsInValid = false;
    secondary.cardNumberIsValid = false;
    secondary.cardNumberValidationMessage = "";
    secondary.cardTypeIsInValid = false;
    secondary.cardTypeIsValid = false;
    secondary.cardTypeValidationMessage = "";
    secondary.expDateIsInValid = false;
    secondary.expDateIsValid = false;
    secondary.expDateValidationMessage = "";
    secondary.cvvIsInValid = false;
    secondary.cvvIsValid = false;
    secondary.cvvValidationMessage = "";
    secondary.amountIsInValid = false;
    secondary.amountIsValid = false;
    secondary.amountValidationMessage = "";
    updatePaymentState({
      primary,
      secondary,
    });
  }, []);

  const { addToast } = props.actions;

  const items = [
    {
      title: "Search Contract",
      content: <SearchContract />,
      expanded: salePaymentState.accordion.toggleSaleContract,
      id: "saleSearchContract",
      handleToggle: (event) => toggleAccordion(event, "toggleSaleContract"),
    },
    {
      title: "Payment",
      content: <Payment />,
      expanded: salePaymentState.accordion.togglePayment,
      id: "salePaymentTog",
      handleToggle: (event) => toggleAccordion(event, "togglePayment"),
    },
  ];

  function pageValidation() {
    let validation = {
      inValid: false,
      validationError: "",
    };
    if (
      (paymentState.otherModeOfPayment &&
        !paymentState.amountIsInValid &&
        paymentState.pendingAmount.length > 0) ||
      !paymentState.primary.amountIsInValid ||
      !paymentState.secondary.amountIsInValid
    ) {
      validation = validateTotalPaymentAmountOnSubmit(
        paymentState.pendingAmount,
        paymentState.otherModeOfPayment,
        paymentState.amount,
        paymentState.amountIsInValid,
        paymentState.primary.amount,
        paymentState.primary.amountIsInValid,
        paymentState.secondary.amount,
        paymentState.secondary.amountIsInValid
      );
    }

    if (!validation.inValid) {
      validation = validationPendingAmountOnSubmit(paymentState.pendingAmount);
    }

    return validation;
  }

  function toJson(): SalePaymentDTO {
    return {
      contractNumber: searchContractState.searchContractNumber.replace("-", ""),
      vin: searchContractState.searchVinNumber,
      companyName: bidderInformationState.companyName,
      firstName: bidderInformationState.firstName,
      lastName: bidderInformationState.lastName,
      emailAddress: bidderInformationState.emailAddress,
      phoneNumber: bidderInformationState.phoneNumber
        ? bidderInformationState.phoneNumber.replace(/\D+/g, "")
        : "",
      totalPurchasePrice: paymentState.totalPurchase
        ? paymentState.totalPurchase.replaceAll(",", "")
        : "",
      pendingAmountDue: paymentState.pendingAmount
        ? paymentState.pendingAmount.replaceAll(",", "")
        : "",
      otherModeOfPayment: paymentState.otherModeOfPayment ? true : false,
      paymentDescription: paymentState.paymentDescription,
      amount: paymentState.amount
        ? paymentState.amount.replaceAll(",", "")
        : "",
      primaryCardHolderName: paymentState.primary.cardHolderName,
      primaryCreditCardNumber: paymentState.primary.cardNumber,
      primaryCardType: paymentState.primary.cardType,
      primaryExpirationDate: paymentState.primary.expDate,
      primaryCvv: paymentState.primary.cvv,
      primaryAmount: paymentState.primary.amount
        ? paymentState.primary.amount.replaceAll(",", "")
        : "",
      primaryStatus: "",
      secondaryCardHolderName: paymentState.secondary.cardHolderName,
      secondaryCreditCardNumber: paymentState.secondary.cardNumber,
      secondaryCardType: paymentState.secondary.cardType,
      secondaryExpirationDate: paymentState.secondary.expDate,
      secondaryCvv: paymentState.secondary.cvv,
      secondaryAmount: paymentState.secondary.amount
        ? paymentState.secondary.amount.replaceAll(",", "")
        : "",
      secondaryStatus: "",
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    isFormSubmitted.next(true);
    updateSalePaymentState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    let validation = pageValidation();
    const form = event.currentTarget;
    if (form.checkValidity() && !validation.inValid) {
      fleetApiService
        .submitLiveSalePayment(toJson())
        .then((response) => {
          if (response?.data?.status) {
            let paymentIds = response?.data?.paymentIds.toString();
            PageHelper.openPage(
              Paths.fleetPaymentConfirmation + `/${paymentIds}`
            );
          } else if (!response?.data?.paymentIds) {
            addToast({
              text: "Other Mode Payment Successful",
              type: "success",
              heading: "Success",
            });
            props.history.goBack();
          } else {
            updateSalePaymentState({
              isSubmitLoading: false,
              isSubmitDisabled: false,
            });
            addToast({
              text: "Payment unsuccessful",
              type: "error",
              heading: "Error",
            });
          }
        })
        .catch((error) => {});
    } else {
      updateSalePaymentState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
      });
      if (validation.inValid) {
        addToast({
          text: validation.validationError,
          type: "error",
          heading: "Error",
        });
      }
    }
  }

  return (
    <>
      <div className={"sale-payment grid-row ui-ppms"}>
        <div className="grid-row header-row mb-3">
          <h1>Fleet Sale Payment</h1>
        </div>
      </div>

      <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
        <div className={"desktop:grid-col-9"}>
          <PPMSAlert
            id={"form-verification-error-alert"}
            show={salePaymentState.showErrorAlert}
            alertBody={salePaymentState.FormErrorMessage}
            alertClassName={"form-verification-error"}
            alertVariant={"danger"}
            alertKey={"form-verification-error"}
          />
          {salePaymentState.showErrorAlert && <hr />}
        </div>
        <br />
        <Form
          noValidate
          validated={salePaymentState.isFormValidated}
          onSubmit={handleSubmit}
          className={"usa-accordion--bordered desktop:grid-col-12"}
          aria-multiselectable="true"
        >
          <PPMSAccordion bordered={true} items={items} />
          <div className={"grid-row grid-gap-6 margin-top-1"}>
            <FleetButtons
              isSubmitDisabled={salePaymentState.isSubmitDisabled}
              isSubmitLoading={salePaymentState.isSubmitLoading}
              cancelFunction={() => {
                props.history.goBack();
              }}
            />
          </div>
        </Form>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(SalePayment);
