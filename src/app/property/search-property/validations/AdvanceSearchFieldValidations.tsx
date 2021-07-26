import { regexForTCNandICN } from "../../create-update-property/constants/Constants";

export function validateItemControlNumber(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
    itemControlNumber: value,
  };
  const icnRegex = regexForTCNandICN;
  let icnVal = value.replace(icnRegex, "");
  if (icnVal.length > 0 && icnVal.length < 14) {
    validation.isInvalid = true;
    validation.itemControlNumber = "";
    validation.validationError =
      "Item control number should be 14 or 15 characters long";
  }
  return validation;
}

export function validateItemControlNumberWithMinSix(value) {
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
      "Item control number should be maximum 14 or 15 characters long";
  }
  if (icnVal.length < 6) {
    validation.isInvalid = true;
    validation.itemControlNumber = "";
    validation.validationError =
      "Item control number should be minimum 6 characters long";
  }
  return validation;
}

export function validateTransferControlNumber(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
    transferControlNumber: value,
  };
  const tcnRegex = regexForTCNandICN;
  let tcnVal = value.replace(tcnRegex, "");
  if (tcnVal.length > 0 && tcnVal.length < 2) {
    validation.isInvalid = true;
    validation.transferControlNumber = "";
    validation.validationError =
      "Transfer control number should be 2 or more than 2 characters long";
  }
  return validation;
}

export function validateAAC(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
    itemControlNumber: value,
  };
  if (value.length > 0 && value.length < 6) {
    validation.isInvalid = true;
    validation.itemControlNumber = "";
    validation.validationError =
      "Activity Address Code should be 6 characters long";
  }
  return validation;
}
