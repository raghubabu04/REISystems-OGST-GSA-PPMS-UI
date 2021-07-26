export interface InternalAgencyScreeningInfoState {
  showErrorAlert: boolean;
  verificationErrorMessage: string;
  internalScreeningDays: string;
  localScreeningDays: string;
  internalScreeningDaysIsInvalid: boolean;
  localScreeningDaysIsInvalid: boolean;
  internalScreeningDaysIsValid: boolean;
  localScreeningDaysIsValid: boolean;
  internalScreeningDaysValidationMessage: string;
  localScreeningDaysValidationMessage: string;
  accordianExpanded: boolean;
  accordingDisplay: string;
  internalBeginDate: Date;
  internalBeginDateIsRequired: boolean;
  internalBeginDateIsValid: boolean;
  internalBeginDateIsInValid: boolean;
  internalBeginDateMsg: string;
  agencyToggle: boolean;
  agencyToggleValidartionMessage: string;
  defaultAgencyToggle?: any;
}

export const InternalAgencyScreeningInfoDefault = {
  showErrorAlert: false,
  verificationErrorMessage: "",
  internalScreeningDays: "",
  localScreeningDays: "",
  internalScreeningDaysIsInvalid: false,
  localScreeningDaysIsInvalid: false,
  internalScreeningDaysIsValid: false,
  localScreeningDaysIsValid: false,
  internalScreeningDaysValidationMessage:
    "Internal Screening Days is Required.",
  localScreeningDaysValidationMessage: "Local Screening Days is Required.",
  accordianExpanded: true,
  accordingDisplay: "show",
  internalBeginDate: null,
  internalBeginDateIsRequired: false,
  internalBeginDateIsValid: false,
  internalBeginDateIsInValid: false,
  internalBeginDateMsg: "Internal Begin Date is Required.",
  agencyToggle: false,
  agencyToggleValidartionMessage: "Is Agency Active is Required.",
  defaultAgencyToggle: "",
};

export const InternalAgencyScreeningInfoStateJson = (
  internalAgencyScreeningInfoState: InternalAgencyScreeningInfoState
) => [
  {
    screeningDays: internalAgencyScreeningInfoState.internalScreeningDays,
    localScreeningDays: internalAgencyScreeningInfoState.localScreeningDays,
    isActive: internalAgencyScreeningInfoState.agencyToggle,
    beginDate: internalAgencyScreeningInfoState.internalBeginDate,
  },
];
