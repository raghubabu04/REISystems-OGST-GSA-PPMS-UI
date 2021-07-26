import {
  isCardAmountValid,
  isCreditCardValid,
  isCVVValid,
  isExpDateValid,
  isRequiredValidation,
  isRequiredValidationWithMax,
  validateDatePickerInput,
} from "../../../../../../ui-kit/components/validations/FieldValidations";
import {
  currencyToNumber,
  formatCurrency,
} from "../../../../../../ui-kit/utilities/FormatUtil";
import moment from "moment";

export const paymentDetailUpdate = (type, value, state) => {
  switch (type) {
    case "processed-by":
      state.paymentDetail.data.processedBy = value;
      break;
    case "credit-card":
      state.paymentDetail.data.methodOfPayment.creditCard = value.data;
      state.paymentDetail.validation.methodOfPayment.creditCard =
        value.validation;
      break;
    case "deposit-ticket-number-cash":
      state.paymentDetail.data.methodOfPayment.cash.depositTicketNumber = value.replace(
        /[^0-9A-Za-z]/g,
        ""
      );
      break;
    case "deposit-date-cash":
      state.paymentDetail.data.methodOfPayment.cash.depositDate = value;
      break;
    case "cash-amount":
      state.paymentDetail.data.methodOfPayment.cash.amount = value.replace(
        /[^0-9.]/g,
        ""
      );
      break;
    case "voucher-date":
      state.paymentDetail.data.methodOfPayment.check.voucherDate = value;
      break;
    case "settlement-date":
      state.paymentDetail.data.methodOfPayment.check.settlementDate = value;
      break;
    case "date-on-check":
      state.paymentDetail.data.methodOfPayment.check.dateOnCheck = value;
      break;
    case "deposit-ticket-number-check":
      state.paymentDetail.data.methodOfPayment.check.depositTicketNumber = value.replace(
        /[^0-9A-Za-z]/g,
        ""
      );
      break;
    case "check-number":
      state.paymentDetail.data.methodOfPayment.check.checkNumber = value.replace(
        /[^0-9A-Za-z]/g,
        ""
      );
      break;
    case "name-on-check":
      state.paymentDetail.data.methodOfPayment.check.nameOnCheck = value.replace(
        /[^0-9A-Za-z ]/g,
        ""
      );
      break;
    case "check-amount":
      state.paymentDetail.data.methodOfPayment.check.amount = value.replace(
        /[^0-9.]/g,
        ""
      );
      break;
    case "deposit-ticket-number-wt":
      state.paymentDetail.data.methodOfPayment.wireTransfer.depositTicketNumber = value.replace(
        /[^0-9A-Za-z]/g,
        ""
      );
      break;
    case "name-on-wt":
      state.paymentDetail.data.methodOfPayment.wireTransfer.nameOnWireTransfer = value.replace(
        /[^0-9A-Za-z ]/g,
        ""
      );
      break;
    case "wt-amount":
      state.paymentDetail.data.methodOfPayment.wireTransfer.amount = value.replace(
        /[^0-9.]/g,
        ""
      );
      break;
  }
  return state;
};

export const validatePaymentDetail = (type, value, state) => {
  switch (type) {
    case "processed-by":
      state.paymentDetail.validation.processedBy = isRequiredValidation(
        "Processed By",
        value
      );
      break;
    case "deposit-ticket-number-cash":
      state.paymentDetail.validation.methodOfPayment.cash.depositTicketNumber = isRequiredValidation(
        "Deposit Ticket #",
        value
      );
      break;
    case "deposit-date-cash":
      state.paymentDetail.validation.methodOfPayment.cash.depositDate = isRequiredValidation(
        "Deposit Date",
        value
      );
      break;
    case "cash-amount":
      state.paymentDetail.validation.methodOfPayment.cash.amount = isRequiredValidationWithMax(
        "Cash Amount",
        currencyToNumber(value),
        99999999,
        true
      );
      value = value ? currencyToNumber(value) : null;
      state.paymentDetail.data.methodOfPayment.cash.amount = value
        ? formatCurrency.format(value)
        : null;
      break;
    case "voucher-date":
      state.paymentDetail.validation.methodOfPayment.check.voucherDate = isRequiredValidation(
        "Voucher Date",
        value
      );
      break;
    case "settlement-date":
      state.paymentDetail.validation.methodOfPayment.check.settlementDate = isRequiredValidation(
        "Settlement Date",
        value
      );
      break;
    case "date-on-check":
      state.paymentDetail.validation.methodOfPayment.check.dateOnCheck = isRequiredValidation(
        "Date On Check",
        value
      );
      break;
    case "deposit-ticket-number-check":
      state.paymentDetail.validation.methodOfPayment.check.depositTicketNumber = isRequiredValidation(
        "Deposit Ticket #",
        value
      );
      break;
    case "check-number":
      state.paymentDetail.validation.methodOfPayment.check.checkNumber = isRequiredValidation(
        "Check #",
        value
      );
      break;
    case "name-on-check":
      state.paymentDetail.validation.methodOfPayment.check.nameOnCheck = isRequiredValidation(
        "Name on Check",
        value
      );
      break;
    case "check-amount":
      state.paymentDetail.validation.methodOfPayment.check.amount = isRequiredValidationWithMax(
        "Cash Amount",
        currencyToNumber(value),
        99999999,
        true
      );
      state.paymentDetail.data.methodOfPayment.check.amount = value
        ? formatCurrency.format(value)
        : null;
      break;
    case "deposit-ticket-number-wt":
      state.paymentDetail.validation.methodOfPayment.wireTransfer.depositTicketNumber = isRequiredValidation(
        "Deposit Ticket #",
        value
      );
      break;
    case "name-on-wt":
      state.paymentDetail.validation.methodOfPayment.wireTransfer.nameOnWireTransfer = isRequiredValidation(
        "Name on the Wire Transfer",
        value
      );
      break;
    case "wt-amount":
      state.paymentDetail.validation.methodOfPayment.wireTransfer.amount = isRequiredValidationWithMax(
        "Cash Amount",
        currencyToNumber(value),
        99999999,
        true
      );
      state.paymentDetail.data.methodOfPayment.wireTransfer.amount = value
        ? formatCurrency.format(value)
        : null;
      break;
  }
  return state;
};

const validateCreditCards = (state) => {
  let validations = [];
  state.paymentDetail?.data?.methodOfPayment?.creditCard.forEach(
    (card, index) => {
      validations = validationCreditCardsPrep(
        index,
        "credit-card-number",
        card.cardNumber,
        state
      );
      validations = validationCreditCardsPrep(
        index,
        "expiration-date",
        card.expDate,
        state
      );
      validations = validationCreditCardsPrep(
        index,
        "name-on-card",
        card.nameOnCard,
        state
      );
      validations = validationCreditCardsPrep(index, "cvv", card.cvv, state);
      validations = validationCreditCardsPrep(
        index,
        "amount",
        card.amount,
        state
      );
      if (state.paymentDetail.data.processedBy === "Finance") {
        validations = validationCreditCardsPrep(
          index,
          "authorization-number",
          card.authorizationNumber,
          state
        );
        validations = validationCreditCardsPrep(
          index,
          "authorization-date",
          card.authorizationDate,
          state
        );
        validations = validationCreditCardsPrep(
          index,
          "tracking-id",
          card.trackingID,
          state
        );
      }
    }
  );
  state.paymentDetail.validation.methodOfPayment.creditCard = validations;
  return state;
};

const validationCreditCardsPrep = (i, type, value, state) => {
  const validation = state.paymentDetail.validation.methodOfPayment.creditCard;
  switch (type) {
    case "credit-card-number":
      validation[i].cardNumber = isCreditCardValid("Credit Card Number", value);
      break;
    case "expiration-date":
      validation[i].expDate = isExpDateValid("Expiration Date", value);
      break;
    case "name-on-card":
      validation[i].nameOnCard = isRequiredValidation("Name on Card", value);
      break;
    case "cvv":
      validation[i].cvv = isCVVValid("CVV", value, validation[i].type);
      break;
    case "amount":
      validation[i].amount = isCardAmountValid("Amount", value);
      break;
    case "authorization-number":
      validation[i].authorizationNumber = isRequiredValidation(
        "Authorization Number",
        value
      );
      break;
    case "tracking-id":
      validation[i].trackingID = isRequiredValidation("Tracking ID", value);
      break;
    case "authorization-date":
      validation[i].authorizationDate = validateDatePickerInput(
        value,
        true,
        "Authorization Date",
        "MM/DD/YYYY"
      );
      break;
  }
  return validation;
};

export const checkValidation = (state) => {
  if (state.other.typesSelected.cash) {
    validatePaymentDetail(
      "deposit-ticket-number-cash",
      state.paymentDetail.data.methodOfPayment.cash.depositTicketNumber,
      state
    );
    validatePaymentDetail(
      "deposit-date-cash",
      state.paymentDetail.data.methodOfPayment.cash.depositDate,
      state
    );
    validatePaymentDetail(
      "cash-amount",
      currencyToNumber(state.paymentDetail.data.methodOfPayment.cash.amount),
      state
    );
  }

  if (state.other.typesSelected.check) {
    validatePaymentDetail(
      "voucher-date",
      state.paymentDetail.data.methodOfPayment.check.voucherDate,
      state
    );
    validatePaymentDetail(
      "name-on-check",
      state.paymentDetail.data.methodOfPayment.check.nameOnCheck,
      state
    );
    validatePaymentDetail(
      "settlement-date",
      state.paymentDetail.data.methodOfPayment.check.settlementDate,
      state
    );
    validatePaymentDetail(
      "date-on-check",
      state.paymentDetail.data.methodOfPayment.check.dateOnCheck,
      state
    );
    validatePaymentDetail(
      "deposit-ticket-number-check",
      state.paymentDetail.data.methodOfPayment.check.depositTicketNumber,
      state
    );
    validatePaymentDetail(
      "check-number",
      state.paymentDetail.data.methodOfPayment.check.checkNumber,
      state
    );
    validatePaymentDetail(
      "check-amount",
      currencyToNumber(state.paymentDetail.data.methodOfPayment.check.amount),
      state
    );
  }
  if (state.other.typesSelected.wireTransfer) {
    validatePaymentDetail(
      "deposit-ticket-number-wt",
      state.paymentDetail.data.methodOfPayment.wireTransfer.depositTicketNumber,
      state
    );
    validatePaymentDetail(
      "name-on-wt",
      state.paymentDetail.data.methodOfPayment.wireTransfer.nameOnWireTransfer,
      state
    );
    validatePaymentDetail(
      "wt-amount",
      currencyToNumber(
        state.paymentDetail.data.methodOfPayment.wireTransfer.amount
      ),
      state
    );
  }

  if (state.other.typesSelected.creditCard) {
    validatePaymentDetail(
      "processed-by",
      state.paymentDetail.data.processedBy,
      state
    );
    validateCreditCards(state);
  }

  return state;
};

export const validity = (state) => {
  let valid = false;
  let invalidMessage = "";
  let checkCash = checkForValidity(
    state.paymentDetail.validation.methodOfPayment.cash
  );
  if (!checkCash?.isInvalid) {
    let checkCheck = checkForValidity(
      state.paymentDetail.validation.methodOfPayment.check
    );
    if (!checkCheck.isInvalid) {
      let checkWT = checkForValidity(
        state.paymentDetail.validation.methodOfPayment.wireTransfer
      );
      if (!checkWT.isInvalid) {
        let checkPB = state.paymentDetail.validation.processedBy;
        if (!checkPB.isInvalid) {
          let checkCC = { isInvalid: false, validationError: "" };
          state.paymentDetail.validation.methodOfPayment.creditCard.every(
            (card) => {
              let validityCheck = checkForValidity(card);
              if (validityCheck.isInvalid) {
                checkCC = validityCheck;
                return false;
              }
              return true;
            }
          );
          if (!checkCC?.isInvalid) {
            valid = true;
          } else {
            invalidMessage = checkCC?.validationError;
          }
        } else {
          invalidMessage = checkPB.validationError;
        }
      } else {
        invalidMessage = checkWT.validationError;
      }
    } else {
      invalidMessage = checkCheck.validationError;
    }
  } else {
    invalidMessage = checkCash.validationError;
  }

  return { valid: valid, invalidMessage: invalidMessage };
};

export const checkForValidity = (object) => {
  let inValidObject = { isInvalid: false, validationError: "" };
  Object.keys(object).every((key) => {
    let thisObject = object[key];
    if (thisObject?.isInvalid === true) {
      inValidObject = thisObject;
      return false;
    }
    return true;
  });
  return inValidObject;
};

export const generateValidRequest = (state, contractIds) => {
  let dateFormat = "YYYY-MM-DDTHH:mm";
  return {
    contractId: contractIds,
    processedBy: state.paymentDetail.data.processedBy,
    paymentDTO: {
      cash: state.other.typesSelected.cash
        ? {
            depositTicketNumber:
              state.paymentDetail.data.methodOfPayment.cash.depositTicketNumber,
            depositDate: moment(
              state.paymentDetail.data.methodOfPayment.cash.depositDate
            ).isValid()
              ? moment(
                  state.paymentDetail.data.methodOfPayment.cash.depositDate
                ).format(dateFormat)
              : null,
            amount: state.paymentDetail.data.methodOfPayment.cash.amount.replace(
              /[^0-9.]/g,
              ""
            ),
          }
        : null,
      check: state.other.typesSelected.check
        ? {
            voucherDate: moment(
              state.paymentDetail.data.methodOfPayment.check.voucherDate
            ).isValid()
              ? moment(
                  state.paymentDetail.data.methodOfPayment.check.voucherDate
                ).format(dateFormat)
              : null,
            settlementDate: moment(
              state.paymentDetail.data.methodOfPayment.check.settlementDate
            ).isValid()
              ? moment(
                  state.paymentDetail.data.methodOfPayment.check.settlementDate
                ).format(dateFormat)
              : null,
            dateOnCheck: moment(
              state.paymentDetail.data.methodOfPayment.check.dateOnCheck
            ).isValid()
              ? moment(
                  state.paymentDetail.data.methodOfPayment.check.dateOnCheck
                ).format(dateFormat)
              : null,
            depositTicketNumber:
              state.paymentDetail.data.methodOfPayment.check
                .depositTicketNumber,
            checkNumber:
              state.paymentDetail.data.methodOfPayment.check.checkNumber,
            nameOnCheck:
              state.paymentDetail.data.methodOfPayment.check.nameOnCheck,
            amount: state.paymentDetail.data.methodOfPayment.check.amount.replace(
              /[^0-9.]/g,
              ""
            ),
          }
        : null,
      creditCard: state.other.typesSelected.creditCard
        ? prepareCreditCardRequest(
            state.paymentDetail.data.methodOfPayment.creditCard
          )
        : null,
      wireTransfer: state.other.typesSelected.wireTransfer
        ? {
            depositTicketNumber:
              state.paymentDetail.data.methodOfPayment.wireTransfer
                .depositTicketNumber,
            nameOnWireTransfer:
              state.paymentDetail.data.methodOfPayment.wireTransfer
                .nameOnWireTransfer,
            amount: state.paymentDetail.data.methodOfPayment.wireTransfer.amount.replace(
              /[^0-9.]/g,
              ""
            ),
          }
        : null,
    },
  };
};

const prepareCreditCardRequest = (creditCards: any[]) => {
  let dateFormat = "YYYY-MM-DDTHH:mm";
  let cards = [];
  creditCards.forEach((card) => {
    let cardInfo = {
      cardNumber: card.cardNumber.toString().replace(/[^0-9]/g, ""),
      type: card.type,
      expDate: moment(card.expDate, "MM/YYYY").format("YYYY-MM"),
      cvv: card.cvv,
      nameOnCard: card.nameOnCard,
      amount: card.amount.toString().replace(/[^0-9.]/g, ""),
      authorizationNumber: card.authorizationNumber,
      trackingID: card.trackingID,
      authorizationDate: moment(card.authorizationDate).isValid()
        ? moment(card.authorizationDate).format(dateFormat)
        : null,
    };
    cards.push(cardInfo);
  });
  return cards;
};

/**
 * Reset Values on Change of Checkbox
 */

export const cash = () => {
  return {
    data: {
      depositTicketNumber: "",
      depositDate: null,
      amount: null,
    },
    validation: {
      depositTicketNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      depositDate: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      amount: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
    },
  };
};

export const check = () => {
  return {
    data: {
      voucherDate: null,
      settlementDate: null,
      dateOnCheck: null,
      depositTicketNumber: "",
      checkNumber: "",
      nameOnCheck: "",
      amount: null,
    },
    validation: {
      voucherDate: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      settlementDate: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      dateOnCheck: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      depositTicketNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      checkNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      nameOnCheck: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      amount: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
    },
  };
};

export const wireTransfer = () => {
  return {
    data: {
      depositTicketNumber: "",
      nameOnWireTransfer: "",
      amount: null,
    },
    validation: {
      depositTicketNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      nameOnWireTransfer: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      amount: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
    },
  };
};

export const creditCard = () => {
  return {
    data: [
      {
        cardNumber: null,
        type: "",
        expDate: null,
        nameOnCard: "",
        cvv: null,
        amount: null,
        authorizationNumber: "",
        trackingID: "",
        authorizationDate: null,
      },
    ],
    validation: [
      {
        cardNumber: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        expDate: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        nameOnCard: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        cvv: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        amount: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        authorizationNumber: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        trackingID: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        authorizationDate: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
      },
    ],
  };
};
