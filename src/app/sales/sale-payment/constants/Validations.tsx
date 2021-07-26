import moment from "moment";
import { cardTypes } from "./Constants";

export function formatDecimalNumber(amount, onBlur: boolean) {
  var value = amount.toString();
  value = value.replace(/[^0-9.]|\.(?=.*\.)/g, "");
  let result = "";
  if (value.includes(".")) {
    let num = value.substr(0, value.indexOf(".")).substring(0, 6);
    let decimalValue = value
      .substr(value.indexOf(".") + 1, value.indexOf(".") + 2)
      .substring(0, 2);

    num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (decimalValue.length === 0 && onBlur) {
      decimalValue = "00";
    }

    result = num + "." + decimalValue;
  } else {
    result = value.substring(0, 6).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return result;
}

export function requiredValidation(value, prefix) {
  let validation = {
    inValid: false,
    isRequired: false,
    validationError: "",
  };

  if (!value || value.length === 0) {
    validation.inValid = true;
    validation.isRequired = true;
    validation.validationError = `${prefix} is required.`;
  }

  return validation;
}

export function vinValidation(value) {
  let validation = {
    inValid: false,
    isRequired: false,
    validationError: "",
  };

  if (value.length < 6) {
    validation.inValid = true;
    validation.validationError = "VIN number is invalid.";
  }
  return validation;
}

export function cardValidation(value) {
  let validation = {
    inValid: false,
    validationError: "",
  };

  if (value.length === 0) {
    validation.inValid = true;
    validation.validationError = "Credit card number is required.";
    return validation;
  }

  if (value.length < 14 && value.length > 0) {
    validation.inValid = true;
    validation.validationError = "Credit card number is invalid.";
  }
  return validation;
}

export function expiryDateNumber(value) {
  value = value.replace(/\D+/g, "");
  if (value.length > 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 6);
  }
  return value;
}

export function expiryDateValidation(value) {
  let validation = {
    inValid: false,
    validationError: "",
  };
  value = value.replace(/\D+/g, "");
  if (value.length === 0) {
    validation.inValid = true;
    validation.validationError = "Expiration date is required.";
    return validation;
  }

  if (value.length < 6) {
    validation.inValid = true;
    validation.validationError = "Expiration date is invalid.";
    return validation;
  } else {
    let valueMonth = value.substring(0, 2);
    let valueYear = value.substring(2, 6);

    let month = moment().month() + 1;
    let year = moment().year().toString();

    if (valueMonth < month && valueYear === year) {
      validation.inValid = true;
      validation.validationError = "Expiration date is invalid.";
    } else if (valueYear < year) {
      validation.inValid = true;
      validation.validationError = "Expiration date is invalid.";
    } else if (valueMonth > 12 || valueMonth === "00") {
      validation.inValid = true;
      validation.validationError = "Expiration date is invalid.";
    }

    return validation;
  }
}

export function cvvNumberValidation(value, cardType) {
  let validation = {
    inValid: false,
    validationError: "",
  };

  if (value.length === 0) {
    validation.inValid = true;
    validation.validationError = "CVV is required.";
  }

  let cvvLength = cardType === cardTypes.AMEX ? 4 : 3;

  if (value.length !== cvvLength && value.length > 0) {
    validation.inValid = true;
    validation.validationError = "CVV is invalid.";
  }
  return validation;
}

export function validateTotalPaymentAmount(
  pendingAmount,
  isOtherPayment: boolean,
  otherPaymentAmount,
  otherPaymentAmountValid: boolean,
  primaryAmount,
  primaryAmountValid: boolean,
  secondaryAmount,
  secondaryAmountValid: boolean
) {
  let validation = {
    inValid: false,
    pendingAmount: 0,
    validationError: "",
  };
  pendingAmount = pendingAmount ? pendingAmount : "0";
  otherPaymentAmount = otherPaymentAmount
    ? !otherPaymentAmountValid
      ? otherPaymentAmount
      : "0"
    : "0";
  primaryAmount = primaryAmount
    ? !primaryAmountValid
      ? primaryAmount
      : "0"
    : "0";
  secondaryAmount = secondaryAmount
    ? !secondaryAmountValid
      ? secondaryAmount
      : "0"
    : "0";
  if (isOtherPayment) {
    if (
      parseFloat(pendingAmount.replace(",", "")) <
      parseFloat(otherPaymentAmount.replace(",", "")) +
        parseFloat(primaryAmount.replace(",", "")) +
        parseFloat(secondaryAmount.replace(",", ""))
    ) {
      validation.inValid = true;
      validation.validationError =
        "Amount entered is more than pending amount due.";
    }
    validation.pendingAmount =
      parseFloat(pendingAmount.replace(",", "")) -
      (parseFloat(otherPaymentAmount.replace(",", "")) +
        parseFloat(primaryAmount.replace(",", "")) +
        parseFloat(secondaryAmount.replace(",", "")));
  } else {
    if (
      parseFloat(pendingAmount.replace(",", "")) <
      parseFloat(primaryAmount.replace(",", "")) +
        parseFloat(secondaryAmount.replace(",", ""))
    ) {
      validation.inValid = true;
      validation.validationError =
        "Amount entered is more than pending amount due.";
    }
    validation.pendingAmount =
      parseFloat(pendingAmount.replace(",", "")) -
      (parseFloat(primaryAmount.replace(",", "")) +
        parseFloat(secondaryAmount.replace(",", "")));
  }
  return validation;
}

export function validateAmountNotOver25K(amount) {
  let validation = {
    inValid: false,
    isRequired: false,
    validationError: "",
  };
  if (parseFloat(amount.replace(",", "")) >= 25000) {
    validation.inValid = true;
    validation.validationError =
      "Maximum of $24,999.99 allowed per card per day";
  }
  return validation;
}

export function validateTotalPaymentAmountOnSubmit(
  pendingAmount,
  isOtherPayment: boolean,
  otherPaymentAmount,
  otherPaymentAmountValid: boolean,
  primaryAmount,
  primaryAmountValid: boolean,
  secondaryAmount,
  secondaryAmountValid: boolean
) {
  let validation = {
    inValid: false,
    validationError: "",
  };
  pendingAmount = pendingAmount ? pendingAmount : "0";
  otherPaymentAmount = otherPaymentAmount
    ? !otherPaymentAmountValid
      ? otherPaymentAmount
      : "0"
    : "0";
  primaryAmount = primaryAmount
    ? !primaryAmountValid
      ? primaryAmount
      : "0"
    : "0";
  secondaryAmount = secondaryAmount
    ? !secondaryAmountValid
      ? secondaryAmount
      : "0"
    : "0";
  if (isOtherPayment) {
    if (
      parseFloat(pendingAmount.replace(",", "")) >
      parseFloat(otherPaymentAmount.replace(",", "")) +
        parseFloat(primaryAmount.replace(",", "")) +
        parseFloat(secondaryAmount.replace(",", ""))
    ) {
      validation.inValid = true;
      validation.validationError =
        "Amount entered is less than pending amount due.";
    }
  } else {
    if (
      parseFloat(pendingAmount.replace(",", "")) >
      parseFloat(primaryAmount.replace(",", "")) +
        parseFloat(secondaryAmount.replace(",", ""))
    ) {
      validation.inValid = true;
      validation.validationError =
        "Amount entered is less than pending amount due.";
    }
  }

  if (!validation.inValid) {
    validation = validateTotalPaymentAmount(
      pendingAmount,
      isOtherPayment,
      otherPaymentAmount,
      otherPaymentAmountValid,
      primaryAmount,
      primaryAmountValid,
      secondaryAmount,
      secondaryAmountValid
    );
  }

  return validation;
}

export function validationPendingAmountOnSubmit(pendingAmount) {
  let validation = {
    inValid: false,
    validationError: "",
  };
  pendingAmount = pendingAmount ? pendingAmount : "0";

  if (parseInt(pendingAmount.replace(",", "")) <= 0) {
    validation.inValid = true;
    validation.validationError = "No Pending Amount to be Paid";
  }
  return validation;
}

export function otherAmountValidation(
  pendingAmount,
  otherPaymentAmount,
  partiallyPaid: Boolean
) {
  let validation = {
    inValid: false,
    isRequired: false,
    validationError: "",
  };
  pendingAmount = pendingAmount ? pendingAmount : "0";
  otherPaymentAmount = otherPaymentAmount ? otherPaymentAmount : "0";

  if (
    parseFloat(pendingAmount.replace(",", "")) ===
      parseFloat(otherPaymentAmount.replace(",", "")) &&
    !partiallyPaid
  ) {
    validation.inValid = true;
    validation.validationError = "Payment through credit card(s) required.";
  }
  return validation;
}
