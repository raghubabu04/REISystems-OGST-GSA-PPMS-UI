import moment from "moment";

export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function validateDateofBirth(value, isRequired) {
  let eighteenYearsAgo = moment().subtract(18, "years");
  let birthday = moment(value);
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Date of Birth is Required";
    return validation;
  } else if (eighteenYearsAgo.isBefore(birthday)) {
    validation.isInvalid = true;
    validation.validationError = "User should be 18 years or older";
    return validation;
  }
  return validation;
}

export function validateCompanyName(value: any, isRequired) {
  let companyName = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(companyName)) {
    validation.isInvalid = true;
    validation.validationError = "Company Name is required";
  }
  return validation;
}
