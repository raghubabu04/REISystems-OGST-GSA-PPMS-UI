import { UserUtils } from "../../../../utils/UserUtils";

export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function validateJustification(justification) {
  let validation = {
    isInvalid: false,
    isValid: true,
    validationError: "",
  };
  if (isEmptyCheck(justification) && !UserUtils.hasPermission("APO")) {
    console.log("justification is empty???");
    validation.isInvalid = true;
    validation.isValid = false;
    validation.validationError = "Justification is required";
    return validation;
  }
  if (justification.length > 300) {
    validation.isInvalid = true;
    validation.isValid = false;

    validation.validationError =
      "Justification must be less than 300 characters";
    return validation;
  }
  return validation;
}

export function validateDateOnModal(DateOnModal) {
  let validation = {
    isInvalid: false,
    isValid: true,
    validationError: "",
  };
  if (isEmptyCheck(DateOnModal)) {
    validation.isInvalid = true;
    validation.isValid = false;
    validation.validationError = "Date is required";
    return validation;
  }
  return validation;
}
