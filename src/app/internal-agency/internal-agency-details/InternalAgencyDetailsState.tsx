export interface InternalAgencyDetailsState {
  accordianExpanded: boolean;
  accordingDisplay: string;
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
  internalAgencyCodeIsDisabled: boolean;
}

export const InternalAgencyDetailsStateDefault = {
  accordianExpanded: true,
  accordingDisplay: "show",
  internalAgencyCode: "",
  internalAgencyCodeValidationMessage: "",
  internalAgencyCodeIsInvalid: false,
  internalAgencyCodeIsValid: false,
  internalAbbreviatedAgency: "",
  internalAbbreviatedAgencyValidationMessage: "",
  internalAbbreviatedAgencyIsInvalid: false,
  internalAbbreviatedAgencyIsValid: false,
  internalAgencyName: "",
  internalAgencyNameValidationMessage: "",
  internalAgencyNameIsInvalid: false,
  internalAgencyNameIsValid: false,
  internalAgencyCodeIsDisabled: false,
};

export const InternalAgencyDetailsStateJson = (
  internalAgencyDetailsState: InternalAgencyDetailsState
) => [
  {
    agencyCode: internalAgencyDetailsState.internalAgencyCode,
    agencyName: internalAgencyDetailsState.internalAgencyName,
    agencyAbbreviation: internalAgencyDetailsState.internalAbbreviatedAgency,
  },
];
