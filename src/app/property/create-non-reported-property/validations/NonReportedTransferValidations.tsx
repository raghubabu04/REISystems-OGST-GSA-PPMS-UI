export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function validatePropertyType(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Property Type must be selected";
  }
  return validation;
}

export function validateGainingAgencyReason(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Reason is Required.";
  }
  return validation;
}

export function validateSourceCode(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Source Code is Required.";
  }
  return validation;
}

export function validateItemName(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Item Name is Required.";
  }
  // } else if (value.length < 4) {
  //   validation.isInvalid = true;
  //   validation.validationError = "Item name must be at least 4 characters";
  // } else if (value.length > 69) {
  //   validation.isInvalid = true;
  //   validation.validationError =
  //     "Item name must be at no more than 69 characters";
  // }
  return validation;
}

export function validateFSC(fsc) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!fsc[0]) {
    validation.isInvalid = true;
    validation.validationError =
      "Federal Supply Class / National Stock Number is Required.";
  }
  return validation;
}

export function validateStateChange(state) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!state[0]) {
    validation.isInvalid = true;
    validation.validationError = "Location State is Required.";
  }
  return validation;
}

export function validateQuantity(quantity) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(quantity)) {
    validation.isInvalid = true;
    validation.validationError = "Quantity is Required.";
  }
  return validation;
}

export function validateUnitCost(unitCost) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(unitCost)) {
    validation.isInvalid = true;
    validation.validationError = "Unit Cost is Required.";
  }
  return validation;
}
