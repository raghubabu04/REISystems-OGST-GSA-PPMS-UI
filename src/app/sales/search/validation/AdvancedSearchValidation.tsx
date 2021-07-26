import { regexForTCNandICN } from "../../constant/Constants";
import Moment from "moment";

function checkEmailAddressValid(email: string) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) ? true : false;
}
export function validateItemControlNumber(value: any) {
  let validation = {
    isInvalid: false,
    validationError: "",
    itemControlNumber: value,
  };
  const icnRegex = regexForTCNandICN;
  let icnVal = value.replace(icnRegex, "");

  if (icnVal.length > 6 && icnVal.length < 14) {
    validation.isInvalid = true;
    validation.itemControlNumber = "";
    validation.validationError =
      "Item control number should be 14 or 15 characters long";
  }
  if (icnVal.length > 0 && icnVal.length < 6) {
    validation.isInvalid = true;
    validation.itemControlNumber = "";
    validation.validationError =
      "Item control number should be minimum 6 characters long";
  }
  return validation;
}

export function validateBidderEmail(value: any) {
  let validation = {
    isInvalid: false,
    validationError: "",
    value: value,
  };
  let isEmailValid = checkEmailAddressValid(value);
  if (!isEmailValid && value.length > 0) {
    validation.isInvalid = true;
    validation.validationError = "Invalid email address.";
  }
  return validation;
}
//format date
export function dateFormatted(dateStr: string) {
  if (dateStr !== null) {
    return Moment(dateStr).format("MM/DD/YYYY");
  }
  return null;
}

// format SALES number
export function salesNumberFormatted(sales: string) {
  let formattedNumber;
  if (sales.length === 11) {
    formattedNumber =
      sales.substring(0, 1) +
      "-" +
      sales.substring(1, 2) +
      "-" +
      sales.substring(2, 5) +
      "-" +
      sales.substring(5, 6) +
      "-" +
      sales.substring(6, 8) +
      "-" +
      sales.substring(8, 11);
  } else {
    return "";
  }
  return formattedNumber;
}
