import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface RepAgencyAddressState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  repAddress1: string;
  repAddress1IsInvalid: boolean;
  repAddress1IsValid: boolean;
  repAddress1ValidationMessage: string;
  repAddress2: string;
  repAddress2IsInvalid: boolean;
  repAddress2IsValid: boolean;
  repAddress2ValidationMessage: string;
  repAddress3: string;
  repAddress3IsInvalid: boolean;
  repAddress3IsValid: boolean;
  repAddress3ValidationMessage: string;
  repCity: string;
  repCityIsInvalid: boolean;
  repCityIsValid: boolean;
  repCityValidationMessage: string;
  repStateCode: string;
  repState: string;
  repStateDefault: string;
  repStateIsInvalid: boolean;
  repStateIsValid: boolean;
  repStateValidationMessage: string;
  repZipCode: string;
  repZipIsInvalid: boolean;
  repZipIsValid: boolean;
  repZipValidationMessage: string;
  repZip2Code: string;
  repZip2IsInvalid: boolean;
  repZip2IsValid: boolean;
  repZip2ValidationMessage: string;
  repLocValues: Array<string>;
  keyDisplayStr: string;
  modalShow: boolean;
  repAddressId: number;
  repAacCode: string;
  addressId: string;
  updateDisabled: boolean;
  disableExtension: boolean;
  repAddressInvalid: boolean;
  repAddressValid: boolean;
  deleteAlert: boolean;
}

export const RepAgencyAddressStateDefault: RepAgencyAddressState = {
  accordianExpanded: true,
  accordingDisplay: "show",
  repAddress1: "",
  repAddress1IsInvalid: false,
  repAddress1IsValid: false,
  repAddress1ValidationMessage: "",
  repAddress2: "",
  repAddress2IsInvalid: false,
  repAddress2IsValid: false,
  repAddress2ValidationMessage: "",
  repAddress3: "",
  repAddress3IsInvalid: false,
  repAddress3IsValid: false,
  repAddress3ValidationMessage: "",
  repCity: "",
  repCityIsInvalid: false,
  repCityIsValid: false,
  repCityValidationMessage: "",
  disableExtension: true,
  repStateCode: "",
  repState: "",
  repStateDefault: "",
  repStateIsInvalid: false,
  repStateIsValid: false,
  repStateValidationMessage: "",
  repZipCode: "",
  repZipIsInvalid: false,
  repZipIsValid: false,
  repZipValidationMessage: "",
  repZip2Code: "",
  repZip2IsInvalid: false,
  repZip2IsValid: false,
  repZip2ValidationMessage: "",
  repLocValues: [],
  keyDisplayStr: "",
  modalShow: false,
  repAddressId: 0,
  repAacCode: "",
  addressId: "",
  updateDisabled: true,
  repAddressInvalid: false,
  repAddressValid: false,
  deleteAlert: false,
};

export const RepAgencyAddressStateJson = (
  repAgencyAddressState: RepAgencyAddressState
) => [
  {
    line1: repAgencyAddressState?.repAddress1?.trim(),
    line2: repAgencyAddressState?.repAddress2?.trim(),
    line3: repAgencyAddressState?.repAddress3,
    city: repAgencyAddressState?.repCity?.trim(),
    stateCode: repAgencyAddressState?.repStateCode,
    zip: repAgencyAddressState?.repZipCode,
    zip2: repAgencyAddressState?.repZip2Code,
    isDeleted: false,
  },
];

const vFields = [
  "repAddress1IsInvalid",
  "repAddress2IsInvalid",
  "repAddress3IsInvalid",
  "repCityIsInvalid",
  "repStateIsInvalid",
  "repZipIsInvalid",
  "repZip2IsInvalid",
];

const eFields = ["repAddress1", "repCity", "repStateCode", "repZipCode"];

export function updateRepAddressNav(
  newState: RepAgencyAddressState,
  prevState: RepAgencyAddressState
): void {
  const repAddressInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const donorInfoEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.repAddressInvalid = repAddressInvalid;
  newState.repAddressValid = !repAddressInvalid && !donorInfoEmpty;
}
