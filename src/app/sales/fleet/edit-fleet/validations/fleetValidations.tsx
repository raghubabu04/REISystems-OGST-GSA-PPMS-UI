import { validateDatePickerInput } from "../../../../../ui-kit/components/validations/FieldValidations";
import { timeToNumber } from "../../../../../ui-kit/utilities/FormatUtil";
import moment from "moment";

export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function validatePhoneNumber(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!isEmptyCheck(value)) {
    value = value.toString().replace(/[() -    ]/g, "");
  }
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Point of Contact Phone Number is Required";
  } else if (value.startsWith("000")) {
    validation.isInvalid = true;
    validation.validationError =
      "Point of Contact phone number area code cannot be all 000's";
  } else if (value.length < 10) {
    validation.isInvalid = true;
    validation.validationError = "Point of Contact phone number length not met";
  } else if (value.startsWith("0")) {
    validation.isInvalid = true;
    validation.validationError =
      "Point of Contact phone number cannot start with 0'";
  }

  return validation;
}

export function validateEmailAddress(email, isCCEmail: boolean) {
  if (email) {
    email = email.trim();
  } else if (!isCCEmail) {
    return {
      isInvalid: true,
      validationError: "Point of Contact Email is required",
    };
  } else {
    return {
      isInvalid: false,
      validationError: "",
    };
  }
  const isValid = checkEmail(email);
  if (!isValid) {
    return {
      isInvalid: true,
      validationError: "Point of Contact Email is invalid",
    };
  }

  return {
    isInvalid: false,
    validationError: "",
  };
}

export const checkEmail = (email): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export function validateItemName(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Item Name is Required.";
  }
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

export function validatePrice(value, name: string) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = `${name} is Required.`;
  }
  return validation;
}

export function validateStartDate(DateOnModal) {
  let validation = {
    isInvalid: false,
    isValid: true,
    validationError: "",
  };
  if (isEmptyCheck(DateOnModal)) {
    validation.isInvalid = true;
    validation.isValid = false;
    validation.validationError = "Inspection Start Date is required";
    return validation;
  }
  return validation;
}

export function validateEndDate(DateOnModal) {
  let validation = {
    isInvalid: false,
    isValid: true,
    validationError: "",
  };
  if (isEmptyCheck(DateOnModal)) {
    validation.isInvalid = true;
    validation.isValid = false;
    validation.validationError = "Inspection End Date is required";
    return validation;
  }
  return validation;
}

export function validateStartEndTime(label, value) {
  let cleanValue = timeToNumber(value);
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!cleanValue) {
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
    parseInt(cleanValue.substr(0, 2)) > 12 ||
    parseInt(cleanValue.substr(0, 2)) < 1
  ) {
    validation.isInvalid = true;
    validation.validationError = `${label} Please enter a valid time.`;
  }
  return validation;
}

export function formatTime(value: string) {
  value = value.replace(/\D+/g, "");
  if (value.length <= 2) {
    return value;
  } else if (value.length > 2) {
    value = value.substr(0, 2) + ":" + value.substr(2, 5);
    return value;
  }
}

export function validateFleetStartEndDate(
  startDate: string,
  endDate: string,
  isStartDate: boolean,
  isStartDateInValid: boolean,
  dateName: string,
  componentName: string,
  includeHolidays: boolean,
  holidays: any
) {
  let validation = {
    isInValid: false,
    validationError: "",
  };
  if (isStartDate && moment(startDate).isValid()) {
    if (moment(endDate).diff(moment(startDate)) < 0) {
      validation.validationError = `${dateName} cannot be greater than ${componentName} end date.`;
      validation.isInValid = true;
    } else if (
      moment(startDate).diff(
        moment(new Date()).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
      ) < 0
    ) {
      validation.validationError = `${dateName} cannot be less than today.`;
      validation.isInValid = true;
    }

    if (includeHolidays && !validation.isInValid) {
      holidays.forEach((element) => {
        if (
          moment(element).format("YYYY-MM-DD") ===
          moment(startDate).format("YYYY-MM-DD")
        ) {
          validation.validationError = `${dateName} cannot be a holiday.`;
          validation.isInValid = true;
        }
      });
    }

    if (!isWeekDay(startDate) && !validation.isInValid) {
      validation.validationError = `${dateName} cannot be a weekend day.`;
      validation.isInValid = true;
    }
  } else if (!isStartDate && moment(endDate).isValid()) {
    if (moment(startDate).diff(moment(endDate)) > 0) {
      validation.validationError = `${dateName} cannot be less than  ${componentName} start date.`;
      validation.isInValid = true;
    } else if (isStartDateInValid || startDate === null || startDate === "") {
      if (
        moment(endDate).diff(
          moment(new Date()).set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
        ) < 0
      ) {
        validation.validationError = `${dateName} cannot be less than today.`;
        validation.isInValid = true;
      }
    }
    if (includeHolidays && !validation.isInValid) {
      holidays.forEach((element) => {
        if (
          moment(element).format("YYYY-MM-DD") ===
          moment(endDate).format("YYYY-MM-DD")
        ) {
          validation.validationError = `${dateName} cannot be a holiday.`;
          validation.isInValid = true;
        }
      });
    }

    if (!isWeekDay(endDate) && !validation.isInValid) {
      validation.validationError = `${dateName} cannot be a weekend day.`;
      validation.isInValid = true;
    }
  } else if (isStartDate) {
    let startDateValidation = validateDatePickerInput(
      startDate === null ? "" : startDate,
      true,
      dateName,
      "MM/DD/YYYY"
    );
    validation.isInValid = startDateValidation.isInvalid;
    validation.validationError = startDateValidation.validationError;
  } else if (!isStartDate) {
    let endDateValidation = validateDatePickerInput(
      endDate === null ? "" : endDate,
      true,
      dateName,
      "MM/DD/YYYY"
    );
    validation.isInValid = endDateValidation.isInvalid;
    validation.validationError = endDateValidation.validationError;
  }

  return validation;
}

function isWeekDay(date) {
  let day = moment(date).day();
  return day !== 0 && day !== 6;
}

const isHoliday = (date, holidays) => {
  let isHoliday: boolean = false;
  holidays.forEach((element) => {
    if (
      moment(element).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
    ) {
      isHoliday = true;
    }
  });
  return isHoliday;
};

export function validateStartEndTimeCombination(
  startTime: string,
  endTime: string,
  startTimeAmPm,
  endTimeAmPm,
  startDate,
  endDate,
  timeName: string,
  timeComponent: string,
  isStartTime: boolean
) {
  let validation = {
    isInValid: false,
    validationError: "",
  };
  if (
    moment(startDate).diff(moment(endDate)) === 0 &&
    startTime &&
    endTime &&
    startDate &&
    endDate &&
    moment(startDate).isValid() &&
    moment(endDate).isValid()
  ) {
    if (isStartTime) {
      if (startTimeAmPm === "PM" && endTimeAmPm === "AM") {
        validation.isInValid = true;
        validation.validationError = `${timeName} cannot be greater than ${timeComponent} end time.`;
      } else if (startTimeAmPm === endTimeAmPm) {
        if (
          startTime.substring(0, 2) === endTime.substring(0, 2) &&
          startTime.substring(3, 5) > endTime.substring(3, 5)
        ) {
          validation.isInValid = true;
          validation.validationError = `${timeName} cannot be greater than ${timeComponent} end time.`;
        } else if (startTime.substring(0, 2) > endTime.substring(0, 2)) {
          validation.isInValid = true;
          validation.validationError = `${timeName} cannot be greater than ${timeComponent} end time.`;
        } else if (startTime === endTime) {
          validation.isInValid = true;
          validation.validationError = `${timeName} cannot be equal to ${timeComponent} end time.`;
        }
      }
    } else {
      if (startTimeAmPm === "PM" && endTimeAmPm === "AM") {
        validation.isInValid = true;
        validation.validationError = `${timeName} cannot be less than ${timeComponent} start time.`;
      } else if (startTimeAmPm === endTimeAmPm) {
        if (
          startTime.substring(0, 2) === endTime.substring(0, 2) &&
          startTime.substring(3, 5) > endTime.substring(3, 5)
        ) {
          validation.isInValid = true;
          validation.validationError = `${timeName} cannot be less than ${timeComponent} start time.`;
        } else if (startTime.substring(0, 2) > endTime.substring(0, 2)) {
          validation.isInValid = true;
          validation.validationError = `${timeName} cannot be less than ${timeComponent} start time.`;
        } else if (startTime === endTime) {
          validation.isInValid = true;
          validation.validationError = `${timeName} cannot be equal to ${timeComponent} start time.`;
        }
      }
    }
  }
  return validation;
}

export function validateEmptyCheck(value) {
  let validation = {
    isInvalid: false,
  };
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
  }
  return validation;
}

export function validateVin(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let spaceCheck = /\s/;
  if (isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "VIN is required";
  } else if (spaceCheck.test(value)) {
    validation.isInvalid = true;
    validation.validationError = "VIN has spaces";
  } else if (value.length < 11) {
    validation.isInvalid = true;
    validation.validationError = "VIN is required";
  }
  return validation;
}

// Validate property Description
export function trimString(val) {
  val = val.replace(/\s/g, "");
  return val;
}

export function validatePropertyDescription(itemDescription) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(itemDescription) || itemDescription === "") {
    return validation;
  }

  itemDescription = itemDescription.replace(/(<([^>]+)>)/g, "");
  itemDescription = itemDescription.replace("'", ".");
  itemDescription = itemDescription.replace(/&nbsp;/gi, " ");

  if (itemDescription.length > 10000) {
    validation.isInvalid = true;
    validation.validationError =
      "Item description must be fewer than 10,000 characters.";
    return validation;
  }
  return validation;
}
