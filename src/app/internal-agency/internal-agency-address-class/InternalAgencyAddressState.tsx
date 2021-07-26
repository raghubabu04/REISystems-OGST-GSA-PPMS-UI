export interface InternalAgencyAddressState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  internalAgencyAddress1: string;
  internalAgencyAddress1IsInvalid: boolean;
  internalAgencyAddress1IsValid: boolean;
  internalAgencyAddress1ValidationMessage: string;
  internalAgencyAddress2: string;
  internalAgencyAddress2IsInvalid: boolean;
  internalAgencyAddress2IsValid: boolean;
  internalAgencyAddress2ValidationMessage: string;
  internalAgencyAddress3: string;
  internalAgencyAddress3IsInvalid: boolean;
  internalAgencyAddress3IsValid: boolean;
  internalAgencyAddress3ValidationMessage: string;
  internalAgencyCity: string;
  internalAgencyCityIsInvalid: boolean;
  internalAgencyCityIsValid: boolean;
  internalAgencyCityValidationMessage: string;
  internalAgencyStateCode: string;
  internalAgencyState: string;
  internalAgencyStateDefault: string;
  internalAgencyStateIsInvalid: boolean;
  internalAgencyStateIsValid: boolean;
  internalAgencyStateValidationMessage: string;
  internalAgencyZipCode: string;
  internalAgencyZipIsInvalid: boolean;
  internalAgencyZipIsValid: boolean;
  internalAgencyZipValidationMessage: string;
  internalAgencyZip2Code: string;
  internalAgencyZip2IsInvalid: boolean;
  internalAgencyZip2IsValid: boolean;
  internalAgencyZip2ValidationMessage: string;
  internalAgencyCode: string;
  internalAgencyCodeValidationMessage: string;
  internalAgencyCodeIsInvalid: boolean;
  internalAgencyCodeIsValid: boolean;
  internalAbbreviatedAgency: string;
  internalAbbreviatedAgencyValidationMessage: string;
  internalAbbreviatedAgencyIsInvalid: boolean;
  internalAbbreviatedAgencyIsValid: boolean;
  internalAgencyName: string;
  internalAgencyNameValidationMessage: string;
  internalAgencyNameIsInvalid: boolean;
  internalAgencyNameIsValid: boolean;
  internalDisabledZipExtension: boolean;
}

export const InternalAgencyAddressStateDefault = {
  accordianExpanded: true,
  accordingDisplay: "show",
  internalAgencyAddress1: "",
  internalAgencyAddress1IsInvalid: false,
  internalAgencyAddress1IsValid: false,
  internalAgencyAddress1ValidationMessage: "",
  internalAgencyAddress2: "",
  internalAgencyAddress2IsInvalid: false,
  internalAgencyAddress2IsValid: false,
  internalAgencyAddress2ValidationMessage: "",
  internalAgencyAddress3: "",
  internalAgencyAddress3IsInvalid: false,
  internalAgencyAddress3IsValid: false,
  internalAgencyAddress3ValidationMessage: "",
  internalAgencyCity: "",
  internalAgencyCityIsInvalid: false,
  internalAgencyCityIsValid: false,
  internalAgencyCityValidationMessage: "",
  internalAgencyStateCode: "",
  internalAgencyState: "",
  internalAgencyStateDefault: "",
  internalAgencyStateIsInvalid: false,
  internalAgencyStateIsValid: false,
  internalAgencyStateValidationMessage: "",
  internalAgencyZipCode: "",
  internalAgencyZipIsInvalid: false,
  internalAgencyZipIsValid: false,
  internalAgencyZipValidationMessage: "",
  internalAgencyZip2Code: "",
  internalAgencyZip2IsInvalid: false,
  internalAgencyZip2IsValid: false,
  internalAgencyZip2ValidationMessage: "",
  internalAgencyCode: "",
  internalAgencyCodeValidationMessage: "Internal Agency Code is Required",
  internalAgencyCodeIsInvalid: false,
  internalAgencyCodeIsValid: false,
  internalAbbreviatedAgency: "",
  internalAbbreviatedAgencyValidationMessage:
    "Abbreviated Agency Name is Required",
  internalAbbreviatedAgencyIsInvalid: false,
  internalAbbreviatedAgencyIsValid: false,
  internalAgencyName: "",
  internalAgencyNameValidationMessage: "Agency Name is a required field",
  internalAgencyNameIsInvalid: false,
  internalAgencyNameIsValid: false,
  internalDisabledZipExtension: false,
};

export const InternalAgencyAddressStateJson = (
  internalAgencyAgencyAddressState: InternalAgencyAddressState
) => [
  {
    line1: internalAgencyAgencyAddressState.internalAgencyAddress1.trim(),
    line2: internalAgencyAgencyAddressState.internalAgencyAddress2.trim(),
    line3: internalAgencyAgencyAddressState.internalAgencyAddress3,
    city: internalAgencyAgencyAddressState.internalAgencyCity.trim(),
    stateCode: internalAgencyAgencyAddressState.internalAgencyStateCode,
    zip: internalAgencyAgencyAddressState.internalAgencyZipCode,
    zip2: internalAgencyAgencyAddressState.internalAgencyZip2Code,
  },
];
