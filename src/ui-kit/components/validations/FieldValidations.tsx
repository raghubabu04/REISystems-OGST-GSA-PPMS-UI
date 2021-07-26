import { UserUtils } from "../../../utils/UserUtils";
import payment from "payment";
import { getJulianDate } from "../../../app/property/create-update-property/icn-class/IcnState";
import moment from "moment";
import {
  formatCurrency,
  formatTime,
  timeToNumber,
} from "../../utilities/FormatUtil";

export const zipInvalidMessage = "Zip code does not match city or state";
export const zipInvalidStateMessage = "Zip code does not match state";

export function isEmptyCheck(val) {
  return (
    !val || 0 === val.length || val === "- Select One -" || val === "Select One"
  );
}

export function isRequiredValidation(label, value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  }
  return validation;
}

/**
 * ------------ Validate Credit Card Fields --------------------
 *
 */
export function isCreditCardValid(label, value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (!payment.fns.validateCardNumber(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is not valid.`;
  }
  return validation;
}

export function isCVVValid(label, value, type) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (!payment.fns.validateCardCVC(value, type)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is not valid.`;
  }
  return validation;
}

export function isCardAmountValid(label, value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (parseInt(value.toString().replace(/[^0-9.]/g, "")) > 24999.99) {
    validation.isInvalid = true;
    validation.validationError = `${label} cannot be more than $24999.99`;
  }
  return validation;
}

export function isExpDateValid(label, value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (!payment.fns.validateCardExpiry(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is not valid.`;
  }
  return validation;
}

export function isDateAfterNow(label, value, format, compareDate, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
    isEmpty: false,
  };
  if (isRequired && value.length === 0) {
    validation.isEmpty = true;
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else {
    if (value.length === 0) {
      validation.isEmpty = true;
      return validation;
    }
    if (value.length > 0 && !moment(value, format, true).isValid()) {
      validation.isInvalid = true;
      validation.validationError = "Invalid date format.";
    } else if (moment(value, format).isBefore(moment(compareDate, format))) {
      validation.isInvalid = true;
      validation.validationError = "Date should be in the future.";
    }
  }
  return validation;
}
export function validateStartDate(startDate, label, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let dateToCompare = moment(startDate);
  let today = moment(new Date()).format("MM/DD/YYYY");
  let day = moment(dateToCompare).isSameOrAfter(today, "day");

  if (isRequired && startDate?.length === 0) {
    validation.isInvalid = true;
    validation.validationError = `${label} start date field cannot be empty.`;
  } else if (startDate && !validateDate(startDate)) {
    validation.isInvalid = true;
    validation.validationError = "Invalid date format.";
  } else if (startDate && day !== true) {
    validation.isInvalid = true;
    validation.validationError = `${label} start date cannot be less then today's date`;
  }
  return validation;
}
export function validateEndDate(endDate, label, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && (!endDate || endDate.length === 0)) {
    validation.isInvalid = true;
    validation.validationError = "End date field cannot be empty.";
  } else if (endDate && !validateDate(endDate)) {
    validation.isInvalid = true;
    validation.validationError = "Invalid date format.";
  }

  return validation;
}
export function validateTimeFromTo(label, value, meridian, isRequired) {
  let cleanValue = timeToNumber(value);
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && !cleanValue) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (
    (cleanValue &&
      cleanValue?.length === 4 &&
      !/^(1[0-2]|0?[1-9]):[0-5][0-9]$/.test(formatTime(cleanValue))) ||
    cleanValue?.length < 4
  ) {
    validation.isInvalid = true;
    validation.validationError = `${label} is invalid.`;
  } else if (
    moment("08:00 AM", "hh:mm a").isAfter(
      moment(`${formatTime(cleanValue)} ${meridian}`, "hh:mm a")
    ) ||
    moment("05:00 PM", "hh:mm a").isBefore(
      moment(`${formatTime(cleanValue)} ${meridian}`, "hh:mm a")
    )
  ) {
    validation.isInvalid = true;
    validation.validationError = `${label} cannot be before 8AM and after 5PM.`;
  }
  return validation;
}

export function validateTimeByZone(label, value, meridian, isRequired, zoneId) {
  let cleanValue = timeToNumber(value);
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && !cleanValue) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (
    (cleanValue &&
      cleanValue.length === 4 &&
      !/^(1[0-2]|0?[1-9]):[0-5][0-9]$/.test(formatTime(cleanValue))) ||
    cleanValue.length < 4
  ) {
    validation.isInvalid = true;
    validation.validationError = `${label} is invalid.`;
  } else if (
    (zoneId == "1" || zoneId == "2" || zoneId == "5") &&
    (moment("09:00 AM", "hh:mm a").isAfter(
      moment(`${formatTime(cleanValue)} ${meridian}`, "hh:mm a")
    ) ||
      moment("05:00 PM", "hh:mm a").isBefore(
        moment(`${formatTime(cleanValue)} ${meridian}`, "hh:mm a")
      ))
  ) {
    validation.isInvalid = true;
    validation.validationError = `${label} cannot be before 9AM and after 5PM.`;
  } else if (
    (zoneId == "3" || zoneId == "4") &&
    (moment("10:00 AM", "hh:mm a").isAfter(
      moment(`${formatTime(cleanValue)} ${meridian}`, "hh:mm a")
    ) ||
      moment("06:00 PM", "hh:mm a").isBefore(
        moment(`${formatTime(cleanValue)} ${meridian}`, "hh:mm a")
      ))
  ) {
    validation.isInvalid = true;
    validation.validationError = `${label} cannot be before 10AM and after 6PM.`;
  }
  return validation;
}
export function checkMinMaxValue(
  value,
  label,
  minValue,
  maxValue,
  otherValue,
  isRequired
) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && !value) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (value && (value < minValue || value > maxValue)) {
    validation.isInvalid = true;
    validation.validationError = `${label} should be between ${minValue} and ${maxValue} ${
      otherValue ? `or ${otherValue}` : ""
    } `;
  }
  return validation;
}
export function validateDateTimeRange(
  startLabel,
  endLabel,
  startDate,
  startTime,
  startAmPm,
  isStartRequired,
  endDate,
  endTime,
  endAmPm,
  isEndRequired
) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let start = moment(`${startDate} ${startTime} ${startAmPm}`);
  let end = moment(`${endDate} ${endTime} ${endAmPm}`);
  if (start.isValid() && end.isValid()) {
    if (start.isAfter(end)) {
      validation.isInvalid = true;
      validation.validationError = `${startLabel} cannot be after ${endLabel}`;
    }
  }
  return validation;
}

export function isRequiredValidationWithMax(
  label,
  value,
  maxValue,
  isRequired
) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (value && value > maxValue) {
    validation.isInvalid = true;
    validation.validationError = `${label} cannot be above ${formatCurrency.format(
      maxValue
    )}.`;
  }
  return validation;
}

export function percentageValidation(value, label, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (value && (value > 100 || value < 0)) {
    validation.isInvalid = true;
    validation.validationError = `${label} should be between 0%-100%.`;
  }
  return validation;
}

export function minMaxValueValidation(
  value,
  label,
  minValue,
  maxValue,
  isRequired
) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${label} is Required.`;
  } else if (value && (value > maxValue || value < 0)) {
    validation.isInvalid = true;
    validation.validationError = `${label} should be between ${minValue}-${maxValue}.`;
  }
  return validation;
}

export function ppmsEmailValidation(value, required) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!required && value === "") {
    return validation;
  } else {
    // Required & Empty
    if (value === "") {
      validation.isInvalid = true;
      validation.validationError = "Email Address is Required";
      return validation;
    } else {
      // Required & Not Empty
      let emailValidation = validateEmailAddress(value);
      validation.isInvalid = emailValidation.isInvalid;
      validation.validationError = emailValidation.validationError;
      return validation;
    }
  }
}

export function validateEmail(email) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    validation.isInvalid = true;
    validation.validationError = "Email Address is invalid.";
  } else if (
    !(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.gov$/i.test(email) ||
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.mil$/i.test(email)
    )
  ) {
    validation.isInvalid = true;
    validation.validationError = "Email Address needs to be a .gov or .mil.";
  }

  return validation;
}

export function validateEmailAddress(email) {
  if (email) {
    email = email.trim();
  } else {
    return {
      isInvalid: true,
      validationError: "Email Address is Required.",
    };
  }
  const isValid = checkEmail(email);

  return {
    isInvalid: !isValid,
    validationError: !isValid ? "Email Address is invalid." : "",
  };
}

export const checkEmail = (email): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export function validateConfirmEmailAddress(email, confirmEmail, validEmail) {
  if (email) {
    email = email.trim();
  }
  if (confirmEmail) {
    confirmEmail = confirmEmail.trim();
  }
  const valid = email === confirmEmail && validEmail;
  return {
    isInvalid: !valid,
    validationError: valid
      ? ""
      : email === confirmEmail
      ? "Email Address is invalid"
      : "Email Address does not match",
  };
}

export function validateFormattedPhoneNumber(value) {
  return validatePhoneFax(value);
}

export function validateFormattedFaxNumber(value) {
  return validatePhoneFax(value, "Fax");
}

export function validatePhoneFax(value, type = "Phone") {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (!value || value.length === 0) {
    validation.isInvalid = true;
    validation.validationError = `${type} Number is Required.`;
  } else {
    value = value.toString().replace(/[^0-9]/g, "");
    if (value && value.length === 0) {
      validation.isInvalid = true;
      validation.validationError = `${type} Number can contain only numbers.`;
    } else if (value.substring(0, 3) === "000" && value !== "0000000000") {
      validation.isInvalid = true;
      validation.validationError = `${type} Number area code cannot be all 000s.`;
    } else if (value.substring(0, 1) === "0") {
      validation.isInvalid = true;
      validation.validationError = `${type} Number cannot start with 0 and cannot be all 000s.`;
    } else if (value.replace(/[^0-9]/g, "").length !== 10) {
      validation.isInvalid = true;
      validation.validationError = `${type} Number length not met.`;
    }
  }
  return validation;
}

export function validateNonUsZipCode(zip, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^\d+$/.test(zip)) {
    if (zip.length === 0) {
      if (isRequired) {
        validation.isInvalid = true;
        validation.validationError = "Zip Code is Required.";
      } else {
        validation.isInvalid = false;
        validation.validationError = "";
      }
    } else {
      validation.isInvalid = true;
      validation.validationError = "Zip Code can contain only numbers.";
    }
  } else if (zip.length > 9) {
    validation.isInvalid = true;
    validation.validationError =
      "Zip code must be less than 9 characters long.";
  }
  return validation;
}

export function validateZipStateCity(
  results: any[],
  city: string,
  state: string
) {
  if (city && state) {
    let obj = results.find(
      (o) =>
        o.zipCity.toUpperCase().trim() === city.toUpperCase().trim() &&
        o.zipStateCode.toUpperCase() === state.toUpperCase()
    );
    if (obj) {
      return "";
    } else {
      return zipInvalidMessage;
    }
  } else {
    return "";
  }
}

export function validateZipState(results: any[], state: string) {
  if (state) {
    let obj = results.find(
      (o) => o.zipStateCode.toUpperCase() === state.toUpperCase()
    );
    if (obj) {
      return "";
    } else {
      return zipInvalidStateMessage;
    }
  } else {
    return "";
  }
}

export function validatePassword(password) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (
    !(
      password.length > 7 &&
      password.match(/[*@_!#%&$()^~{}]+/) &&
      password.match(/.*\d.*/) &&
      password.match(/.*[a-z].*/) &&
      password.match(/.*[A-Z].*/)
    )
  ) {
    validation.isInvalid = true;
    validation.validationError = "Password requirement is not met.";
  }
  return validation;
}

export function validateConfirmPassword(
  password,
  confirmPassword,
  passwordIsInvalid
) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (password === confirmPassword) {
    if (passwordIsInvalid) {
      validation.isInvalid = true;
      validation.validationError = "Password requirement is not met.";
    } else {
      validation.isInvalid = false;
      validation.validationError = "";
    }
  } else {
    validation.isInvalid = true;
    validation.validationError = "Password does not match.";
  }
  return validation;
}

export function validateSSN(ssn, isRequired) {
  let ssnRegex = /[^0-9]/g;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let ssnVal = ssn?.replace(ssnRegex, "")?.replace("-", "");
  if (isRequired && !(ssnVal?.length === 9)) {
    validation.isInvalid = true;
    validation.validationError = "Social Security Number should be 9 digits.";
  } else if (ssnVal?.length > 0 && !(ssnVal?.length === 9)) {
    validation.isInvalid = true;
    validation.validationError = "Social Security Number should be 9 digits.";
  }
  return validation;
}

export function validateConfirmSSN(ssn, confirmSSN, ssnIsInvalid) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let formattedConfirmSSN = confirmSSN?.replaceAll("-", "");
  if (
    ssn === formattedConfirmSSN ||
    (ssn?.length === 0 && formattedConfirmSSN === undefined) ||
    (ssn === undefined && formattedConfirmSSN?.length === 0)
  ) {
    if (formattedConfirmSSN?.length !== 9 && ssn?.length === 9) {
      validation.isInvalid = true;
      validation.validationError =
        "Confirm Social Security Number should be 9 digits.";
    } else {
      validation.isInvalid = false;
      validation.validationError = "";
    }
  } else {
    validation.isInvalid = true;
    validation.validationError =
      "Confirm Social Security Number does not match with Social Security Number.";
  }
  return validation;
}

export function validateEIN(ein) {
  let ssnRegex = /[^0-9]/g;
  let validation = {
    isInvalid: false,
    validationError: "",
    ein: ein,
  };
  let einVal = ein?.replace(ssnRegex, "").replace("-", "");
  if (einVal?.length !== 9) {
    validation.isInvalid = true;
    validation.validationError =
      "Employer Identification Number should be 9 digits.";
  }
  return validation;
}

export function validateConfirmEIN(ein, confirmEIN, einIsInvalid) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let formattedConfirmEIN = confirmEIN?.replace("-", "");
  if (ein === formattedConfirmEIN) {
    if (einIsInvalid) {
      validation.isInvalid = true;
      validation.validationError =
        "Employer Identification Number should be 9 digits.";
    } else {
      validation.isInvalid = false;
      validation.validationError = "";
    }
  } else {
    validation.isInvalid = true;
    validation.validationError =
      "Confirm Employer Identification Number does not match with Employer Identification Number.";
  }
  return validation;
}

export function validateVerificationCode(code) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (code.length !== 6) {
    validation.isInvalid = true;
    validation.validationError = "Verification Code length not met.";
  }
  return validation;
}

export function aacCodeValidation(code) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^[a-zA-Z0-9- ]*$/.test(code)) {
    validation.isInvalid = true;
    validation.validationError = "Special characters are not allowed.";
  } else if (code.indexOf(" ") >= 0) {
    validation.isInvalid = true;
    validation.validationError = "White spaces are not allowed.";
  } else if (code.length < 6 || code.length > 6) {
    validation.isInvalid = true;
    validation.validationError =
      "Please enter all 6 characters of Activity Address Code.";
  } else {
    const userLoggedIn = UserUtils.getUserInfo();
    const isSystemAdmin = UserUtils.isSystemAdminUser();
    const isAPOUser = UserUtils.isUserApo();
    const isNUOUser = UserUtils.isUserNuo();
    //Foreign Gift Manager check
    const isFGUser = UserUtils.isUserFg();
    if (
      userLoggedIn &&
      !isSystemAdmin &&
      !isAPOUser &&
      !isNUOUser &&
      !isFGUser
    ) {
      const userAACs = UserUtils.getUserAACs();
      if (userAACs && !userAACs.includes(code) && !UserUtils.isSalesUser()) {
        validation.isInvalid = true;
        validation.validationError = "Valid AAC must be entered";
      }
    }
  }
  return validation;
}

export function phoneValidation(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^\d+$/.test(value)) {
    validation.isInvalid = true;
    validation.validationError = "Phone number can contain only numbers.";
  } else if (value.length !== 10) {
    validation.isInvalid = true;
    validation.validationError = "Phone number length not met.";
  }
  return validation;
}

export function faxValidation(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let cleanValue = value ? value.toString().replace(/[^0-9]/g, "") : null;
  if (cleanValue && !/^\d+$/.test(cleanValue)) {
    validation.isInvalid = true;
    validation.validationError = "Fax number can contain only numbers.";
  } else if (cleanValue && cleanValue.length > 0 && cleanValue.length !== 10) {
    validation.isInvalid = true;
    validation.validationError = "Fax number length not met.";
  }
  return validation;
}

export function phoneExtensionValidation(value) {
  let phoneExtn = value ? value.toString().replace(/[^0-9]/g, "") : null;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^\d+$/.test(phoneExtn)) {
    if (!phoneExtn || phoneExtn.length === 0) {
      validation.isInvalid = false;
      validation.validationError = "";
    } else {
      validation.isInvalid = true;
      validation.validationError = "Extension number can contain only numbers.";
    }
  }
  return validation;
}

export function nonUsStateValidation(stateCode) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (stateCode.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Location State is required.";
  } else if (!/^[a-zA-Z\s]*$/.test(stateCode)) {
    validation.isInvalid = true;
    validation.validationError = "Location State must be only characters.";
  }
  return validation;
}

export function stateValidation(stateCode) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!stateCode || stateCode.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Location State is not selected.";
  }
  return validation;
}

export function countryValidation(countryCode) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!countryCode || countryCode.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Country is Required";
  }
  return validation;
}
export function zipValidation(value, isRequired) {
  value = value + "";
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (!/^\d+$/.test(value)) {
    if (value.length === 0) {
      if (isRequired) {
        validation.isInvalid = true;
        validation.validationError = "Zip Code is Required.";
      } else {
        validation.isInvalid = false;
        validation.validationError = "";
      }
    } else {
      validation.isInvalid = true;
      validation.validationError = "Zip Code can contain only numbers.";
    }
  } else if (value.length !== 5) {
    validation.isInvalid = true;
    validation.validationError = "Zip Code length not met.";
  }

  return validation;
}

export function zipExtensionValidation(extension) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (extension && extension.toString && !/^\d+$/.test(extension)) {
    if (extension.length === 0) {
      validation.isInvalid = false;
      validation.validationError = "";
    } else {
      validation.isInvalid = true;
      validation.validationError =
        "Zip Extension Code can contain only numbers.";
    }
  } else if (extension && extension.toString && extension.length !== 4) {
    validation.isInvalid = true;
    validation.validationError = "Zip Extension Code length not met.";
  }
  return validation;
}

export function securityQuestionValidation(value) {
  let quesvalid = value?.trim();
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (quesvalid.length < 7) {
    validation.isInvalid = true;
    validation.validationError =
      "Security question must be at least 7 characters long.";
  } else if (!quesvalid.replace(/\s/g, "").length) {
    validation.isInvalid = true;
    validation.validationError =
      "Security question cannot contain only whitespace.";
  }
  return validation;
}
export function securityAnswerValidation(answer, question) {
  let ans = answer?.trim();
  let ques = question?.trim();
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (ans.length < 5) {
    validation.isInvalid = true;
    validation.validationError = "Answer must be at least 5 characters long.";
  } else if (!ans.replace(/\s/g, "").length) {
    validation.isInvalid = true;
    validation.validationError = "Answer cannot contain only whitespace.";
  } else {
    if (ans === ques) {
      validation.isInvalid = true;
      validation.validationError =
        "Answer cannot be same as security question.";
    } else {
      validation.isInvalid = false;
      validation.validationError = "";
    }
  }
  return validation;
}
export function validatePropertyField(id, value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  validation.isInvalid = true;
  validation.validationError = "is Invalid";
  if (id === "aac-code") {
    if (value.length === 6) {
      validation.isInvalid = false;
    } else {
      validation.isInvalid = true;
      validation.validationError = "AAC Must be 6 Characters";
    }
  } else if (id === "serial-number") {
    if (!/^[a-zA-Z0-9- ]*$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError = "Special characters are not allowed.";
    } else if (value.indexOf(" ") >= 0) {
      validation.isInvalid = true;
      validation.validationError = "White spaces are not allowed.";
    } else if (value.length < 4 || value.length > 4) {
      validation.isInvalid = true;
      validation.validationError = "Serial Number must be 4 Characters";
    } else if (value.length === 4) {
      if (value === "0000") {
        validation.isInvalid = true;
        validation.validationError = "Serial# cannot be 0000";
      } else {
        validation.isInvalid = false;
      }
    }
  } else if (id === "suffix") {
    if (value.length === 0) {
      validation.isInvalid = false;
    } else if (!/^[a-zA-Z0-9- ]*$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError = "Special characters are not allowed.";
    } else if (value.indexOf(" ") >= 0) {
      validation.isInvalid = true;
      validation.validationError = "White spaces are not allowed.";
    } else {
      validation.isInvalid = false;
    }
  } else if (id === "julian-date") {
    if (!/^[0-9]+$/i.test(value)) {
      validation.isInvalid = true;
      validation.validationError = "Julian date can only be number";
      return validation;
    }

    if (value.length !== 4) {
      validation.isInvalid = true;
      validation.validationError = "Julian date must be 4 numbers";
      return validation;
    }

    if (value.length === 4) {
      if (value === "0000") {
        validation.isInvalid = true;
        validation.validationError = "Julian date cannot be 0000";
        return validation;
      }

      let julianDateValidation = validateJulianDate(getJulianDate(), value);

      if (julianDateValidation.isInvalid) {
        return julianDateValidation;
      }
    }
    validation.isInvalid = false;
    validation.validationError = "";
    return validation;
  }
  return validation;
}
export function acnValidation(code) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  validation.isInvalid = false;
  validation.validationError = "";

  return validation;
}

export const validateJulianDate = (currentDate: string, valueDate: string) => {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let valueYear = parseInt(valueDate.slice(0, 1));
  let currentYear = parseInt(currentDate.slice(0, 1));
  let valueDayOfYear = parseInt(valueDate.slice(1, 4));
  let currentDayOfYear = parseInt(currentDate.slice(1, 4));
  let yearDiff = currentYear - valueYear;
  let dayDiff = currentDayOfYear - valueDayOfYear;
  //adding dates to years due current year is different from value year
  if (yearDiff !== 0) {
    if (currentYear === 0) {
      currentDayOfYear += 365 * (10 - valueYear);
    } else {
      currentDayOfYear += 365 * yearDiff;
    }
    dayDiff = currentDayOfYear - valueDayOfYear;
  }
  if (valueDayOfYear > currentDayOfYear) {
    validation.isInvalid = true;
    validation.validationError = "Julian date cannot be a future date";
    return validation;
  }
  if (dayDiff > 30) {
    validation.isInvalid = true;
    validation.validationError = "Julian date can only be 30 days back";
    return validation;
  }
  return validation;
};

export function validateZipCode(zipCode) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let tokens = [];
  tokens = zipCode.split("-");
  let left = tokens[0];
  let right = "";
  if (tokens.length > 1) {
    right = tokens[1];
  }
  if (!/^\d+$/.test(left) || (tokens.length > 1 && !/^\d+$/.test(right))) {
    validation.isInvalid = true;
    validation.validationError = "Zip Code can contain only numbers.";
  } else if (left.length !== 5 || (tokens.length > 1 && right.length !== 4)) {
    validation.isInvalid = true;
    validation.validationError = "Zip Code length not met.";
  }
  return validation;
}

function validateDate(date) {
  let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
  return date_regex.test(date);
}

function validateDateTime(dateTime) {
  let date_time_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}\s+(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9])\s+[ap]m$/;
  return date_time_regex.test(dateTime);
}

export function validateCalendarStartDate(value, end) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let isStartDateBeforeEndDate = moment(value).isBefore(end);

  if (isStartDateBeforeEndDate !== true) {
    validation.isInvalid = true;
    validation.validationError =
      "Campaign start date must be earlier than Campaign end date";
  }
  return validation;
}

export function validateStartDatePicker(startDate, endDate, label) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let dateToCompare = moment(startDate);
  let today = moment(new Date()).format("MM/DD/YYYY");
  let day = moment(dateToCompare).isSameOrAfter(today, "day");
  let endDatePassed = endDate ? moment(startDate).isBefore(endDate) : true;
  if (startDate?.length === 0) {
    validation.isInvalid = true;
    validation.validationError = `${label} start date field cannot be empty.`;
  } else if (!validateDate(startDate)) {
    validation.isInvalid = true;
    validation.validationError = "Invalid date format.";
  } else if (day !== true) {
    validation.isInvalid = true;
    validation.validationError = `${label} start date cannot be less then today's date`;
  } else if (!endDatePassed) {
    validation.isInvalid = true;
    validation.validationError = `${label} start date must be before ${label} end date`;
  }
  return validation;
}

export function validateEndDatePicker(startDate, endDate, label) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let endDatePassed = moment(endDate).isAfter(startDate);

  if (endDate.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "End date field cannot be empty.";
  } else if (!validateDate(endDate)) {
    validation.isInvalid = true;
    validation.validationError = "Invalid date format.";
  } else if (!endDatePassed) {
    validation.isInvalid = true;
    validation.validationError = `${label} end date must be later than ${label} start date`;
  }
  return validation;
}

export function validateDatePicker(value, type) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (value.length === 0 || (type === "Year" && value.length !== 4)) {
    validation.isInvalid = true;
    validation.validationError = type + " length not met.";
  } else if (!/^\d+$/.test(value)) {
    validation.isInvalid = true;
    validation.validationError = type + " can contain only numbers.";
  } else if ((type === "month" && value <= 0) || value >= 13) {
    validation.isInvalid = true;
    validation.validationError = type + " is invalid.";
  }
  return validation;
}

export function validateDatePickerInput(dateInput, isRequired, type, format) {
  let validation = {
    isInvalid: false,
    validationError: "",
    isEmpty: false,
  };
  if (isRequired && (!dateInput || dateInput?.length === 0)) {
    validation.isEmpty = true;
    validation.isInvalid = true;
    validation.validationError = `${type} is Required.`;
  } else {
    if (dateInput?.length === 0) {
      validation.isEmpty = true;
      return validation;
    }
    if (
      dateInput &&
      dateInput?.length > 0 &&
      !moment(dateInput, format, true).isValid()
    ) {
      validation.isInvalid = true;
      validation.validationError = "Invalid date format.";
    }
  }
  return validation;
}
export function validateTime(time) {
  let time_regex = /^(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9])\s+[ap]m$/;
  return time_regex.test(time);
}
export const checkBidAmount = (bidAmount): boolean => {
  let numberOnlyRegX = /^[1-9]\d*(\.[0]{2})?$/;
  let valid = true;
  if (isNaN(bidAmount)) {
    valid = false;
  } else if (!numberOnlyRegX.test(bidAmount)) {
    valid = false;
  } else if (bidAmount > 99999999) {
    valid = false;
  }
  return valid;
};
