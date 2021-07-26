import moment from "moment";

export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function validateItemControlNumber(value: string, isRequired: boolean) {
  let validation = {
    Invalid: false,
    validationMsg: "",
    otherFields: false,
  };

  if (value.length > 0) {
    validation.otherFields = true;
  } else {
    validation.otherFields = false;
  }

  if (isEmptyCheck(value) && isRequired) {
    validation.Invalid = true;
    validation.validationMsg = "Item Control Number is Required.";
  }

  if (value.length < 6 && value.length != 0) {
    validation.Invalid = true;
    validation.validationMsg = "Minimum length must be 6 characters.";
  }
  if (!/^[a-zA-Z0-9]+$/.test(value) && value.length != 0) {
    validation.Invalid = true;
    validation.validationMsg = "Special characters are not allowed";
  }

  return validation;
}

export function validateExpirationDateChange(date: Date) {
  let validation = {
    inValid: false,
    validationMsg: "",
  };
  let endDate: Date = moment(new Date(Date.now())).add("180", "days").toDate();
  let startDate: Date = moment(new Date(Date.now()))
    .subtract("1", "days")
    .toDate();
  if (date > endDate) {
    validation.inValid = true;
    validation.validationMsg = "Expiration Date is greater then 180 days";
  } else if (date <= startDate) {
    validation.inValid = true;
    validation.validationMsg = "Expiration Date cannot be before today";
  }

  return validation;
}

export function formatICN(icnNumber) {
  let formattedicnValue;
  if (icnNumber.length > 6 && icnNumber.length <= 10) {
    formattedicnValue =
      icnNumber.substring(0, 6) + "-" + icnNumber.substring(6);
  } else if (icnNumber.length > 10 && icnNumber.length <= 14) {
    formattedicnValue =
      icnNumber.substring(0, 6) +
      "-" +
      icnNumber.substring(6, 10) +
      "-" +
      icnNumber.substring(10);
  } else if (icnNumber.length === 15) {
    formattedicnValue =
      icnNumber.substring(0, 6) +
      "-" +
      icnNumber.substring(6, 10) +
      "-" +
      icnNumber.substring(10, 14) +
      "-" +
      icnNumber.substring(14, 15);
  } else if (icnNumber) {
    formattedicnValue = icnNumber;
  } else {
    formattedicnValue = "";
  }
  return formattedicnValue;
}
