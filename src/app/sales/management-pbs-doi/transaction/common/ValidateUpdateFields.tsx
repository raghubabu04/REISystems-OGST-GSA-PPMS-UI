import {isEmpty} from "lodash";
import moment from "moment";
import {
  faxValidation,
  isRequiredValidation,
  phoneExtensionValidation,
  ppmsEmailValidation,
  validateFormattedPhoneNumber,
} from "../../../../../ui-kit/components/validations/FieldValidations";
import {saleMethodPBSDOI} from "../../common/Constants";

export const updationOfFields = (fieldName, value, state) => {
  switch (fieldName) {
    case "saleMethod":
      state.data.salesMethod = value;
      break;
    case "fiscalYear":
      state.data.fiscalYear = value;
      if (!isEmpty(value)) {
        state.validation.fiscalYearIsInvalid = false;
      } else {
        state.validation.fiscalYearIsInvalid = true;
        state.validation.fiscalYearValidationMessage =
          "Fiscal year is required";
      }
      break;
    case "region":
      state.data.region = value;
      break;
    case "regionCode":
      state.data.regionCode = value;
      break;
    case "firstName":
      state.data.contact.firstName = value;
      if (!isEmpty(value)) {
        state.validation.firstNameIsInvalid = false;
      } else {
        state.validation.firstNameIsInvalid = true;
        state.validation.firstNameValidationMessage = "First Name is required";
      }
      break;
    case "lastName":
      state.data.contact.lastName = value;
      if (!isEmpty(value)) {
        state.validation.lastNameIsInvalid = false;
      } else {
        state.validation.lastNameIsInvalid = true;
        state.validation.lastNameValidationMessage = "Last Name is required";
      }
      break;
    case "emailAddress":
      state.data.contact.email = value;
      if (!isEmpty(value)) {
        state.validation.emailAddressIsInvalid = false;
      } else {
        state.validation.emailAddressIsInvalid = true;
        state.validation.emailAddressValidationMessage =
          "Email Address is required";
      }
      break;
    case "phoneNumber":
      state.data.contact.phone = value;
      if (!isEmpty(value)) {
        state.validation.phoneNumberIsInvalid = false;
      } else {
        state.validation.phoneNumberIsInvalid = true;
        state.validation.phoneNumberValidationMessage =
          "Phone Number is required";
      }
      break;
    case "extn":
      state.data.contact.phoneExtension = value;
      if (!isEmpty(value)) {
        state.validation.extnIsInvalid = false;
      }
      break;
    case "faxNumber":
      state.data.contact.fax = value;
      if (!isEmpty(value)) {
        state.validation.faxNumberIsInvalid = false;
      } else {
        state.validation.faxNumberIsInvalid = true;
        state.validation.faxNumberValidationMessage = "Fax Number is required";
      }
      break;
    default:
      break;
  }
  return state;
};

export const validationOfFields = (fieldName, value, state) => {
  console.log("reached hheuuweruh");
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  let regexNumber = /^[0-9]+$/;
  switch (fieldName) {
    case "saleMethod":
      validation = isRequiredValidation("Sale Method", value);
      state.validation.firstNameIsInvalid = validation.isInvalid;
      state.validation.firstNameValidationMessage = validation.validationError;
      break;
    case "region":
      validation = isRequiredValidation("Region", value);
      state.validation.firstNameIsInvalid = validation.isInvalid;
      state.validation.firstNameValidationMessage = validation.validationError;
      break;
    case "fiscalYear":
      if (value.length < 2) {
        state.validation.fiscalYearIsInvalid = true;
        state.validation.fiscalYearValidationMessage =
          "Fiscal year length cannot be less than 2";
      } else if (value.length > 2) {
        state.validation.fiscalYearIsInvalid = true;
        state.validation.fiscalYearValidationMessage =
          "Fiscal year length cannot be greater than 2";
      } else if (!regexNumber.test(value)) {
        state.validation.fiscalYearIsInvalid = true;
        state.validation.fiscalYearValidationMessage =
          "Fiscal year should contain only numbers";
      } else if (
        state?.data?.fiscalYear <
        moment(new Date(Date.now()))
          .toDate()
          .getFullYear()
          .toString()
          .substr(2, 4)
      ) {
        state.validation.fiscalYearIsInvalid = true;
        state.validation.fiscalYearValidationMessage =
          "Fiscal year cannot be before present year";
      } else {
        state.validation.fiscalYearIsInvalid = false;
      }
      break;
    case "firstName":
      validation = isRequiredValidation("First Name", value);
      state.validation.firstNameIsInvalid = validation.isInvalid;
      state.validation.firstNameValidationMessage = validation.validationError;
      break;
    case "lastName":
      validation = isRequiredValidation("Last Name", value);
      state.validation.lastNameIsInvalid = validation.isInvalid;
      state.validation.lastNameValidationMessage = validation.validationError;
      break;
    case "emailAddress":
      validation = ppmsEmailValidation(value, true);
      state.validation.emailAddressIsInvalid = validation.isInvalid;
      state.validation.emailAddressValidationMessage =
        validation.validationError;
      break;
    case "phoneNumber":
      validation = validateFormattedPhoneNumber(value);
      state.validation.phoneNumberIsInvalid = validation.isInvalid;
      state.validation.phoneNumberValidationMessage =
        validation.validationError;
      break;
    case "extn":
      validation = phoneExtensionValidation(value);
      state.validation.extnIsInvalid = validation.isInvalid;
      state.validation.extnValidationMessage = validation.validationError;
      break;
    case "faxNumber":
      validation = faxValidation(value);
      state.validation.faxNumberIsInvalid = validation.isInvalid;
      state.validation.faxNumberValidationMessage = validation.validationError;
      break;
    default:
      break;
  }
  return state;
};

export const checkValidations = (state) => {
  if (
    isEmpty(state.data.salesMethod) ||
    isEmpty(state.data.fiscalYear) ||
    isEmpty(state.data.region) ||
    isEmpty(state.data.salesNumber) ||
    isEmpty(state.data.contact.firstName) ||
    isEmpty(state.data.contact.lastName) ||
    isEmpty(state.data.contact.email) ||
    isEmpty(state.data.contact.phone) ||
    isEmpty(state.data.contact.fax)
  ) {
    if (isEmpty(state.data.salesMethod)) {
      state.validation.saleMethodIsInvalid = true;
      state.validation.saleMethodValidationMessage = "Sale method is required";
    }
    if (isEmpty(state.data.fiscalYear)) {
      state.validation.fiscalYearIsInvalid = true;
      state.validation.fiscalYearValidationMessage = "Fiscal year is required";
    }
    if (isEmpty(state.data.region)) {
      state.validation.regionIsInvalid = true;
      state.validation.regionValidationMessage = "Region is required";
    }
    if (isEmpty(state.data.salesNumber)) {
      state.validation.saleNumberIsInvalid = true;
      state.validation.saleNumberValidationMessage = "Sale Number is required";
    }
    if (isEmpty(state.data.contact.firstName)) {
      state.validation.firstNameIsInvalid = true;
      state.validation.firstNameValidationMessage = "First Name is required";
    }
    if (isEmpty(state.data.contact.lastName)) {
      state.validation.lastNameIsInvalid = true;
      state.validation.lastNameValidationMessage = "Last Name is required";
    }
    if (isEmpty(state.data.contact.email)) {
      state.validation.emailAddressIsInvalid = true;
      state.validation.emailAddressValidationMessage =
        "Email Address is required";
    }
    if (isEmpty(state.data.contact.phone)) {
      state.validation.phoneNumberIsInvalid = true;
      state.validation.phoneNumberValidationMessage =
        "Phone Number is required";
    }
    if (isEmpty(state.data.contact.fax)) {
      state.validation.faxNumberIsInvalid = true;
      state.validation.faxNumberValidationMessage = "Fax Number is required";
    }
    state.other.validity = false;
    return state;
  } else if (
    state.validation.saleMethodIsInvalid ||
    state.validation.fiscalYearIsInvalid ||
    state.validation.regionIsInavlid ||
    state.validation.firstNameIsInvalid ||
    state.validation.lastNameIsInvalid ||
    state.validation.emailAddressIsInvalid ||
    state.validation.phoneNumberIsInvalid ||
    state.validation.extnIsInvalid ||
    state.validation.faxNumberIsInvalid
  ) {
    state.other.validity = false;
    return state;
  } else {
    state.other.validity = true;
    return state;
  }
};

export const resetState = () => {
  let state = {
    data: {
      salesMethod: "",
      fiscalYear: "",
      region: "",
      regionCode: "",
      salesNumber: "",
      contact: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        phoneExtension: "",
        fax: "",
      },
      pointOfContact: "",
      status: "",
    },
    other: {
      submitButtonDisabled: true,
      showActionHistoryModal: false,
      actionHistoryData: "",
      validity: false,
    },
    validation: {
      saleMethodDisabled: false,
      saleMethodIsInvalid: false,
      saleMethodValidationMessage: "",
      regionIsInavlid: false,
      regionValidationMessage: "",
      fiscalYearDisabled: false,
      fiscalYearIsInvalid: false,
      fiscalYearValidationMessage: "",
      regionDisabled: false,
      saleNumberDisabled: true,
      saleNumberIsInvalid: false,
      saleNumberValidationMessage: "",
      generateSaleNumberButtonDisabled: true,
      realitySpecialistOrSCOFieldsDisabled: false,
      firstNameIsInvalid: false,
      firstNameValidationMessage: "",
      lastNameIsInvalid: false,
      lastNameValidationMessage: "",
      emailAddressIsInvalid: false,
      emailAddressValidationMessage: "",
      phoneNumberIsInvalid: false,
      phoneNumberValidationMessage: "",
      extnIsInvalid: false,
      extnValidationMessage: "",
      faxNumberIsInvalid: false,
      faxNumberValidationMessage: "",
    },
    constants: {
      saleMethodPBSDOI: saleMethodPBSDOI,
      regionPBSDOI: [],
    },
  };
  return state;
};
