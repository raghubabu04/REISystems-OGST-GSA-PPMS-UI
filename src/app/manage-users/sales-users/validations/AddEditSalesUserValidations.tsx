
export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function validateWarrantLimit(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Warrant Limit must be selected";
  }
  return validation;
}
