import React, { useContext, useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSToggleCheckbox } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { CardComponent } from "../CardComponent";

import {
  cardValidation,
  cvvNumberValidation,
  expiryDateNumber,
  expiryDateValidation,
  formatDecimalNumber,
  otherAmountValidation,
  requiredValidation,
  validateTotalPaymentAmount,
  validateAmountNotOver25K,
} from "../constants/Validations";
import { SalePaymentContext } from "../PaymentContext";
import { FleetApiService } from "../../../../api-kit/sales/fleet-api-service";


interface PaymentProps {}

function Payment(props: PaymentProps) {
  const { paymentState, updatePaymentState } = useContext(SalePaymentContext);

  const fleetApiService = new FleetApiService();

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [paymentState]);

  function validateForm() {
    onBlurTotalPurchasePrice(paymentState.totalPurchase);
    if (paymentState.otherModeOfPayment && !paymentState.amountIsInValid) {
      onBlurOtherAmount(paymentState.amount);
    }
    onBlurCardNumber(paymentState.primary.cardNumber, true);
    onBlurCVV(paymentState.primary.cvv, true);
    onBlurExpDate(paymentState.primary.expDate, true);
    onBlurCardHolderName(paymentState.primary.cardHolderName, true);
    if (!paymentState.primary.amountIsInValid) {
      onBlurAmount(paymentState.primary.amount, true);
    }
    if (paymentState.enableSecondary) {
      onBlurCardNumber(paymentState.secondary.cardNumber, false);
      onBlurCVV(paymentState.secondary.cvv, false);
      onBlurExpDate(paymentState.secondary.expDate, false);
      onBlurCardHolderName(paymentState.secondary.cardHolderName, false);
      if (!paymentState.secondary.amountIsInValid) {
        onBlurAmount(paymentState.secondary.amount, false);
      }
    }
  }

  function onBlurCardNumber(value, isPrimary: boolean) {
    let validation = cardValidation(value);
    const { primary } = paymentState;
    const { secondary } = paymentState;
    if (isPrimary) {
      primary.cardNumberIsInValid = validation.inValid;
      primary.cardNumberIsValid = !validation.inValid;
      primary.cardNumberValidationMessage = validation.validationError;
      let cvvValidation = cvvNumberValidation(primary.cvv, primary.cardType);
      primary.cvvIsInValid = cvvValidation.inValid;
      primary.cvvIsValid = !cvvValidation.inValid;
      primary.cvvValidationMessage = cvvValidation.validationError;
      updatePaymentState({
        primary,
      });
    } else {
      secondary.cardNumberIsInValid = validation.inValid;
      secondary.cardNumberIsValid = !validation.inValid;
      secondary.cardNumberValidationMessage = validation.validationError;
      let cvvValidation = cvvNumberValidation(
        secondary.cvv,
        secondary.cardType
      );
      secondary.cvvIsInValid = cvvValidation.inValid;
      secondary.cvvIsValid = !cvvValidation.inValid;
      secondary.cvvValidationMessage = cvvValidation.validationError;
      updatePaymentState({
        secondary,
      });
    }
  }

  function onBlurExpDate(value, isPrimary: boolean) {
    let validation = expiryDateValidation(value);
    const { primary } = paymentState;
    const { secondary } = paymentState;
    if (isPrimary) {
      primary.expDateIsInValid = validation.inValid;
      primary.expDateIsValid = !validation.inValid;
      primary.expDateValidationMessage = validation.validationError;
      primary.expDate = value;
      updatePaymentState({
        primary,
      });
    } else {
      secondary.expDateIsInValid = validation.inValid;
      secondary.expDateIsValid = !validation.inValid;
      secondary.expDateValidationMessage = validation.validationError;
      secondary.expDate = value;
      updatePaymentState({
        secondary,
      });
    }
  }

  function onBlurCVV(value, isPrimary: boolean) {
    let validation = cvvNumberValidation(
      value,
      isPrimary
        ? paymentState.primary.cardType
        : paymentState.secondary.cardType
    );
    const { primary } = paymentState;
    const { secondary } = paymentState;
    if (isPrimary) {
      primary.cvvIsInValid = validation.inValid;
      primary.cvvIsValid = !validation.inValid;
      primary.cvvValidationMessage = validation.validationError;

      updatePaymentState({
        primary,
      });
    } else {
      secondary.cvvIsInValid = validation.inValid;
      secondary.cvvIsValid = !validation.inValid;
      secondary.cvvValidationMessage = validation.validationError;
      updatePaymentState({
        secondary,
      });
    }
  }

  function onChangeAmount(value, isPrimary: boolean) {
    const { primary } = paymentState;
    const { secondary } = paymentState;
    value = formatDecimalNumber(value, false);
    if (isPrimary) {
      primary.amountIsInValid = false;
      primary.amountIsValid = false;
      primary.amountValidationMessage = "";
      primary.amount = value;

      updatePaymentState({
        primary,
      });
    } else {
      secondary.amountIsInValid = false;
      secondary.amountIsValid = false;
      secondary.amountValidationMessage = "";
      secondary.amount = value;
      updatePaymentState({
        secondary,
      });
    }
  }

  function onBlurAmount(value, isPrimary: boolean) {
    const { primary } = paymentState;
    const { secondary } = paymentState;
    value = formatDecimalNumber(value, true);
    let validation = requiredValidation(value, "Amount");
    if (isPrimary) {
      let totalValidation = validateTotalPaymentAmount(
        paymentState.pendingAmount,
        paymentState.otherModeOfPayment,
        paymentState.amount,
        paymentState.amountIsInValid,
        value,
        validation.inValid,
        paymentState.secondary.amount,
        paymentState.secondary.amountIsInValid
      );
      let totalValidation1 = validateTotalPaymentAmount(
        paymentState.pendingAmount,
        paymentState.otherModeOfPayment,
        paymentState.amount,
        paymentState.amountIsInValid,
        value,
        totalValidation.inValid,
        paymentState.secondary.amount,
        paymentState.secondary.amountIsInValid
      );
      if (totalValidation.inValid) {
        validation.inValid = totalValidation.inValid;
        validation.validationError = totalValidation.validationError;
      }
      if (!validation.inValid) {
        validation = validateAmountNotOver25K(value);
      }
      if (!validation.inValid) {
        let data = {
          screditCardNumber: paymentState.primary.cardNumber,
          scardType: paymentState.primary.cardType,
          amount: value.replace(",", ""),
        };
        fleetApiService
          .getCardPaymentThreshold(data)
          .then((res) => {
            if (!res?.data?.valid) {
              validation.inValid = true;
              validation.validationError =
                "Maximum of $24,999.99 allowed per card per day";
              primary.amount = value;
              primary.amountIsInValid = validation.inValid;
              primary.amountIsValid = !validation.inValid;
              primary.amountValidationMessage = validation.validationError;
              updatePaymentState({
                primary,
              });
            } else {
              updatePaymentState({
                dynamicPendingAmount: formatDecimalNumber(
                  totalValidation1.pendingAmount,
                  false
                ),
              });
            }
          })
          .catch((error) => {});
      } else {
        let dynamicPendingAmount = formatDecimalNumber(
          totalValidation1.pendingAmount,
          false
        );
        primary.amount = value;
        primary.amountIsInValid = validation.inValid;
        primary.amountIsValid = !validation.inValid;
        primary.amountValidationMessage = validation.validationError;
        updatePaymentState({
          primary,
          dynamicPendingAmount,
        });
      }
    } else {
      let totalValidation = validateTotalPaymentAmount(
        paymentState.pendingAmount,
        paymentState.otherModeOfPayment,
        paymentState.amount,
        paymentState.amountIsInValid,
        paymentState.primary.amount,
        paymentState.primary.amountIsInValid,
        value,
        validation.inValid
      );
      let totalValidation1 = validateTotalPaymentAmount(
        paymentState.pendingAmount,
        paymentState.otherModeOfPayment,
        paymentState.amount,
        paymentState.amountIsInValid,
        paymentState.primary.amount,
        paymentState.primary.amountIsInValid,
        value,
        totalValidation.inValid
      );
      if (totalValidation.inValid) {
        validation.inValid = totalValidation.inValid;
        validation.validationError = totalValidation.validationError;
      }
      if (!validation.inValid) {
        validation = validateAmountNotOver25K(value);
      }
      if (!validation.inValid) {
        let data = {
          screditCardNumber: paymentState.primary.cardNumber,
          scardType: paymentState.primary.cardType,
          amount: value.replace(",", ""),
        };
        fleetApiService
          .getCardPaymentThreshold(data)
          .then((res) => {
            if (!res.data.valid) {
              validation.inValid = true;
              validation.validationError =
                "Maximum of $24,999.99 allowed per card per day";
              secondary.amount = value;
              secondary.amountIsInValid = validation.inValid;
              secondary.amountIsValid = !validation.inValid;
              secondary.amountValidationMessage = validation.validationError;
              updatePaymentState({
                secondary,
              });
            } else {
              updatePaymentState({
                dynamicPendingAmount: formatDecimalNumber(
                  totalValidation1.pendingAmount,
                  false
                ),
              });
            }
          })
          .catch((error) => {});
      } else {
        let dynamicPendingAmount = formatDecimalNumber(
          totalValidation1.pendingAmount,
          false
        );
        secondary.amount = value;
        secondary.amountIsInValid = validation.inValid;
        secondary.amountIsValid = !validation.inValid;
        secondary.amountValidationMessage = validation.validationError;
        updatePaymentState({
          secondary,
          dynamicPendingAmount,
        });
      }
    }
  }

  function onChangeOtherMode(event) {
    let value: boolean = event[0].isSelected;
    updatePaymentState({
      otherModeOfPayment: value,
    });
    if (!value) {
      let validation = validateTotalPaymentAmount(
        paymentState.pendingAmount,
        value,
        paymentState.amount,
        paymentState.amountIsInValid,
        paymentState.primary.amount,
        paymentState.primary.amountIsInValid,
        paymentState.secondary.amount,
        paymentState.secondary.amountIsInValid
      );
      if (!validation.inValid) {
        let dynamicPendingAmount = formatDecimalNumber(
          validation.pendingAmount,
          false
        );
        updatePaymentState({
          dynamicPendingAmount: dynamicPendingAmount,
        });
      }
      updatePaymentState({
        amountIsInValid: false,
        amountIsValid: false,
        amount: "",
        amountValidationMessage: "",
      });
    } else {
      let validation = validateTotalPaymentAmount(
        paymentState.pendingAmount,
        value,
        paymentState.amount,
        paymentState.amountIsInValid,
        paymentState.primary.amount,
        paymentState.primary.amountIsInValid,
        paymentState.secondary.amount,
        paymentState.secondary.amountIsInValid
      );
      if (!validation.inValid) {
        let dynamicPendingAmount = formatDecimalNumber(
          validation.pendingAmount,
          false
        );
        updatePaymentState({
          dynamicPendingAmount: dynamicPendingAmount,
        });
      }
      updatePaymentState({
        amountIsInValid: validation.inValid,
        amountIsValid: !validation.inValid,
        amountValidationMessage: validation.validationError,
      });
    }
  }

  function onBlurTotalPurchasePrice(value) {
    value = formatDecimalNumber(value, true);
    let validation = requiredValidation(value, "Total Purchase Price");
    if (!paymentState.partiallyPaid) {
      let totalValidation = validateTotalPaymentAmount(
        value,
        paymentState.otherModeOfPayment,
        paymentState.amount,
        paymentState.amountIsInValid,
        paymentState.primary.amount,
        paymentState.primary.amountIsInValid,
        paymentState.secondary.amount,
        paymentState.secondary.amountIsInValid
      );
      if (!totalValidation.inValid) {
        let dynamicPendingAmount = formatDecimalNumber(
          totalValidation.pendingAmount,
          false
        );

        updatePaymentState({
          dynamicPendingAmount: dynamicPendingAmount,
        });
      }

      updatePaymentState({
        pendingAmount: value,
      });
    }
    updatePaymentState({
      totalPurchase: value,
      totalPurchaseIsInValid: validation.inValid,
      totalPurchaseIsValid: !validation.inValid,
      totalPurchaseValidationMessage: validation.validationError,
    });
  }

  function onBlurOtherAmount(value) {
    value = formatDecimalNumber(value, true);
    if (paymentState.otherModeOfPayment) {
      let validation = requiredValidation(value, "Amount");
      if (!validation.inValid) {
        validation = otherAmountValidation(
          paymentState.pendingAmount,
          value,
          paymentState.partiallyPaid
        );
      }
      let totalValidation = validateTotalPaymentAmount(
        paymentState.pendingAmount,
        paymentState.otherModeOfPayment,
        value,
        validation.inValid,
        paymentState.primary.amount,
        paymentState.primary.amountIsInValid,
        paymentState.secondary.amount,
        paymentState.secondary.amountIsInValid
      );

      if (!totalValidation.inValid) {
        let dynamicPendingAmount = formatDecimalNumber(
          totalValidation.pendingAmount,
          false
        );
        updatePaymentState({
          dynamicPendingAmount: dynamicPendingAmount,
        });
      } else {
        validation.inValid = totalValidation.inValid;
        validation.validationError = totalValidation.validationError;
      }
      updatePaymentState({
        amount: value,
        amountIsInValid: validation.inValid,
        amountIsValid: !validation.inValid,
        amountValidationMessage: validation.validationError,
      });
    } else {
      updatePaymentState({
        amount: value,
      });
    }
  }

  function onBlurCardHolderName(value, isPrimary: boolean) {
    let validation = requiredValidation(value, "Name on card");
    const { primary } = paymentState;
    const { secondary } = paymentState;
    if (isPrimary) {
      primary.cardHolderNameIsInValid = validation.inValid;
      primary.cardHolderNameIsValid = !validation.inValid;
      primary.cardHolderValidationMessage = validation.validationError;

      updatePaymentState({
        primary,
      });
    } else {
      secondary.cardHolderNameIsInValid = validation.inValid;
      secondary.cardHolderNameIsValid = !validation.inValid;
      secondary.cardHolderValidationMessage = validation.validationError;
      updatePaymentState({
        secondary,
      });
    }
  }

  return (
    <>
      <div className="grid-row grid-gap-4">
        <div className="grid-col-4">
          <PPMSInput
            id={"payment-total-purchase"}
            name={"totalPurchase"}
            label={"Total Purchase Price"}
            value={
              paymentState.totalPurchase ? `$${paymentState.totalPurchase}` : ""
            }
            labelBold={true}
            onBlur={(event) => {
              onBlurTotalPurchasePrice(event.target.value);
            }}
            onChange={(event) => {
              let value = formatDecimalNumber(event.target.value, false);
              updatePaymentState({
                totalPurchase: value,
                totalPurchaseIsInValid: false,
                totalPurchaseIsValid: false,
                totalPurchaseValidationMessage: "",
              });
            }}
            isDisabled={paymentState.totalPurchaseAmountIsDisabled}
            inputType={"text"}
            isInvalid={paymentState.totalPurchaseIsInValid}
            isValid={paymentState.totalPurchaseIsValid}
            isRequired={true}
            validationMessage={paymentState.totalPurchaseValidationMessage}
            placeHolder={"$0.00"}
            maxLength={11}
          />
        </div>
        <div className="grid-col-4">
          <PPMSInput
            id={"payment-pending-amount"}
            name={"pendingAmount"}
            label={"Pending Amount Due"}
            value={
              paymentState.dynamicPendingAmount
                ? `$${paymentState.dynamicPendingAmount}`
                : ""
            }
            labelBold={true}
            onBlur={(event) => {}}
            onChange={(event) => {}}
            isDisabled={true}
            inputType={"text"}
            isInvalid={paymentState.pendingAmountIsInValid}
            isValid={paymentState.pendingAmountIsValid}
            isRequired={true}
            placeHolder={"$0.00"}
            validationMessage={paymentState.pendingAmountValidationMessage}
            maxLength={11}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className="grid-col-4">
          <PPMSToggleCheckbox
            id={"otherModePayment"}
            name={"otherMode"}
            label={""}
            options={paymentState.otherModeOptions}
            className={""}
            validationMessage={""}
            isInline={true}
            isDisabled={false}
            isInvalid={false}
            isSingleSelect={false}
            onChange={onChangeOtherMode}
          />
        </div>
        <div className="grid-col-2">
          <PPMSInput
            id={"payment-amount"}
            name={"paymentAmount"}
            label={"Amount"}
            value={paymentState.amount ? `$${paymentState.amount}` : ""}
            onBlur={(event) => {
              onBlurOtherAmount(event.target.value);
            }}
            onChange={(event) => {
              let value = formatDecimalNumber(event.target.value, false);
              updatePaymentState({
                amount: value,
                amountIsInValid: false,
                amountIsValid: false,
                amountValidationMessage: "",
              });
            }}
            isDisabled={!paymentState.otherModeOfPayment}
            inputType={"text"}
            isInvalid={paymentState.amountIsInValid}
            isValid={paymentState.amountIsValid}
            isRequired={paymentState.otherModeOfPayment}
            validationMessage={paymentState.amountValidationMessage}
            maxLength={11}
            placeHolder={"$0.00"}
          />
        </div>
      </div>
      {paymentState.partiallyPaid && !paymentState.enablePrimary && (
        <div className={"grid-row grid-gap-2"}>
          <div className={"grid-col"}>
            <PPMSButton
              id={`add-card`}
              type={"button"}
              label={"Add Primary Credit Card"}
              size={"sm"}
              icon={<FiPlus />}
              isDisabled={false}
              onPress={() => {
                updatePaymentState({
                  enablePrimary: !paymentState.enablePrimary,
                });
              }}
            />
          </div>
        </div>
      )}
      {paymentState.enablePrimary && (
        <div
          key={"credit-primary"}
          className={"grid-row grid-gap-2 credit-card-box margin-top-2"}
        >
          <h4 className="margin-top-0 margin-bottom-0">Primary Credit Card</h4>
          <div className={"grid-col-11"}>
            <CardComponent
              cardHolderName={paymentState.primary.cardHolderName}
              cardNumber={paymentState.primary.cardNumber}
              cardType={paymentState.primary.cardType}
              expDate={paymentState.primary.expDate}
              cvv={paymentState.primary.cvv}
              amount={paymentState.primary.amount}
              cardNumberIsInValid={paymentState.primary.cardNumberIsInValid}
              cardNumberIsValid={paymentState.primary.cardNumberIsValid}
              cardNumberValidationMessage={
                paymentState.primary.cardNumberValidationMessage
              }
              cardTypeIsInValid={paymentState.primary.cardTypeIsInValid}
              cardTypeIsValid={paymentState.primary.cardNumberIsValid}
              cardTypeValidationMessage={
                paymentState.primary.cardNumberValidationMessage
              }
              expDateIsInValid={paymentState.primary.expDateIsInValid}
              expDateIsValid={paymentState.primary.expDateIsValid}
              expDateValidationMessage={
                paymentState.primary.expDateValidationMessage
              }
              cvvIsInValid={paymentState.primary.cvvIsInValid}
              cvvIsValid={paymentState.primary.cvvIsValid}
              cvvValidationMessage={paymentState.primary.cvvValidationMessage}
              amountIsInValid={paymentState.primary.amountIsInValid}
              amountIsValid={paymentState.primary.amountIsValid}
              amountValidationMessage={
                paymentState.primary.amountValidationMessage
              }
              cardHolderNameIsInValid={
                paymentState.primary.cardHolderNameIsInValid
              }
              cardHolderNameIsValid={paymentState.primary.cardHolderNameIsValid}
              cardHolderNameValidationMessage={
                paymentState.primary.cardHolderValidationMessage
              }
              onBlurCardHolderName={(value) => {
                onBlurCardHolderName(value, true);
              }}
              onChangeCardHolderName={(value) => {
                const { primary } = paymentState;
                primary.cardHolderName = value;
                primary.cardHolderNameIsInValid = false;
                primary.cardHolderNameIsValid = false;
                primary.cardHolderValidationMessage = "";
                updatePaymentState({
                  primary,
                });
              }}
              onChangeCardNumber={(value) => {
                const { primary } = paymentState;
                primary.cardNumber = value.replace(/\D+/g, "");
                primary.cardNumberIsInValid = false;
                primary.cardNumberIsValid = false;
                primary.cardNumberValidationMessage = "";
                updatePaymentState({
                  primary,
                });
              }}
              onBlurCardNumber={(value) => {
                onBlurCardNumber(value, true);
              }}
              onChangeCardType={(value) => {
                const { primary } = paymentState;
                primary.cardType = value;
                updatePaymentState({
                  primary,
                });
              }}
              onChangeExpDate={(value) => {
                value = expiryDateNumber(value);
                const { primary } = paymentState;
                primary.expDate = value;
                primary.expDateIsInValid = false;
                primary.expDateIsValid = false;
                primary.expDateValidationMessage = "";
                updatePaymentState({
                  primary,
                });
              }}
              onBlurExpDate={(value) => {
                onBlurExpDate(value, true);
              }}
              onChangeCVV={(value) => {
                value = value.replace(/\D+/g, "");
                const { primary } = paymentState;
                primary.cvv = value;
                primary.cvvIsInValid = false;
                primary.cvvIsValid = false;
                primary.cvvValidationMessage = "";
                updatePaymentState({
                  primary,
                });
              }}
              onBlurCVV={(value) => {
                onBlurCVV(value, true);
              }}
              onChangeAmount={(value) => onChangeAmount(value, true)}
              onBlurAmount={(value) => {
                onBlurAmount(value, true);
              }}
            />
          </div>

          {paymentState.partiallyPaid && (
            <div className={"grid-col-1 flex-align-self-center"}>
              <PPMSButton
                id={`remove-card`}
                type={"button"}
                label={""}
                icon={<FaTrashAlt />}
                onPress={() => {
                  let value: boolean = !paymentState.enablePrimary;
                  updatePaymentState({
                    enablePrimary: value,
                  });
                  if (!value) {
                    const { primary } = paymentState;
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
                    updatePaymentState({
                      primary,
                    });
                  }
                }}
                isDisabled={false}
              />
            </div>
          )}
        </div>
      )}
      {!paymentState.enableSecondary && !paymentState.partiallyPaid && (
        <div className={"grid-row grid-gap-2"}>
          <div className={"grid-col"}>
            <PPMSButton
              id={`add-card`}
              type={"button"}
              label={"Add Secondary Credit Card"}
              size={"sm"}
              icon={<FiPlus />}
              isDisabled={paymentState.isSecondaryButtonDisabled}
              onPress={() => {
                updatePaymentState({
                  enableSecondary: !paymentState.enableSecondary,
                });
              }}
            />
          </div>
        </div>
      )}
      {paymentState.enableSecondary && !paymentState.partiallyPaid && (
        <div
          key={"credit-secondary"}
          className={"grid-row grid-gap-2 credit-card-box"}
        >
          <h4 className="margin-bottom-0">Secondary Credit Card</h4>
          <div className={"grid-col-11"}>
            <CardComponent
              cardHolderName={paymentState.secondary.cardHolderName}
              cardNumber={paymentState.secondary.cardNumber}
              cardType={paymentState.secondary.cardType}
              expDate={paymentState.secondary.expDate}
              cvv={paymentState.secondary.cvv}
              amount={paymentState.secondary.amount}
              cardNumberIsInValid={paymentState.secondary.cardNumberIsInValid}
              cardNumberIsValid={paymentState.secondary.cardNumberIsValid}
              cardNumberValidationMessage={
                paymentState.secondary.cardNumberValidationMessage
              }
              cardTypeIsInValid={paymentState.secondary.cardTypeIsInValid}
              cardTypeIsValid={paymentState.secondary.cardNumberIsValid}
              cardTypeValidationMessage={
                paymentState.secondary.cardNumberValidationMessage
              }
              expDateIsInValid={paymentState.secondary.expDateIsInValid}
              expDateIsValid={paymentState.secondary.expDateIsValid}
              expDateValidationMessage={
                paymentState.secondary.expDateValidationMessage
              }
              cvvIsInValid={paymentState.secondary.cvvIsInValid}
              cvvIsValid={paymentState.secondary.cvvIsValid}
              cvvValidationMessage={paymentState.secondary.cvvValidationMessage}
              amountIsInValid={paymentState.secondary.amountIsInValid}
              amountIsValid={paymentState.secondary.amountIsValid}
              amountValidationMessage={
                paymentState.secondary.amountValidationMessage
              }
              cardHolderNameIsInValid={
                paymentState.secondary.cardHolderNameIsInValid
              }
              cardHolderNameIsValid={
                paymentState.secondary.cardHolderNameIsValid
              }
              cardHolderNameValidationMessage={
                paymentState.secondary.cardHolderValidationMessage
              }
              onBlurCardHolderName={(value) => {
                onBlurCardHolderName(
                  paymentState.secondary.cardHolderName,
                  false
                );
              }}
              onChangeCardHolderName={(value) => {
                const { secondary } = paymentState;
                secondary.cardHolderName = value;
                secondary.cardHolderNameIsInValid = false;
                secondary.cardHolderNameIsValid = false;
                secondary.cardHolderValidationMessage = "";
                updatePaymentState({
                  secondary,
                });
              }}
              onChangeCardNumber={(value) => {
                const { secondary } = paymentState;
                secondary.cardNumber = value.replace(/\D+/g, "");
                secondary.cardNumberIsInValid = false;
                secondary.cardNumberIsValid = false;
                secondary.cardNumberValidationMessage = "";
                updatePaymentState({
                  secondary,
                });
              }}
              onBlurCardNumber={(value) => {
                onBlurCardNumber(value, false);
              }}
              onChangeCardType={(value) => {
                const { secondary } = paymentState;
                secondary.cardType = value;
                updatePaymentState({
                  secondary,
                });
              }}
              onChangeExpDate={(value) => {
                value = expiryDateNumber(value);
                const { secondary } = paymentState;
                secondary.expDate = value;
                secondary.expDateIsInValid = false;
                secondary.expDateIsValid = false;
                secondary.expDateValidationMessage = "";
                updatePaymentState({
                  secondary,
                });
              }}
              onBlurExpDate={(value) => {
                onBlurExpDate(value, false);
              }}
              onChangeCVV={(value) => {
                value = value.replace(/\D+/g, "");
                const { secondary } = paymentState;
                secondary.cvv = value;
                secondary.cvvIsInValid = false;
                secondary.cvvIsValid = false;
                secondary.cvvValidationMessage = "";
                updatePaymentState({
                  secondary,
                });
              }}
              onBlurCVV={(value) => {
                onBlurCVV(value, false);
              }}
              onChangeAmount={(value) => onChangeAmount(value, false)}
              onBlurAmount={(value) => {
                onBlurAmount(value, false);
              }}
            />
          </div>
          <div className={"grid-col-1 flex-align-self-center"}>
            <PPMSButton
              id={`remove-card`}
              type={"button"}
              label={""}
              icon={<FaTrashAlt />}
              onPress={() => {
                let value: boolean = !paymentState.enableSecondary;
                updatePaymentState({
                  enableSecondary: value,
                });
                if (!value) {
                  const { secondary } = paymentState;
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
                    secondary,
                  });
                }
              }}
              isDisabled={false}
            />
          </div>
        </div>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Payment);
