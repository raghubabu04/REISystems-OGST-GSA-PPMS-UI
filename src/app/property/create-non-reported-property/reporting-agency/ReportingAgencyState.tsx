export interface ReportingAgencyState {
  aacCode: string;
  disableAAC: boolean;
  aacIsInvalid: boolean;
  aacIsValid: boolean;
  aacValidationMessage: any;
  agencyBureau: string;
  agencyBureauCode: string;
  pocAddressValues: Array<string>;
  pocAddress: any;
  pocEmailValues: Array<string>;
  pocEmail: any;
  email: string;
  emailIsValid: boolean;
  emailIsInValid: boolean;
  emailValidationMessage: string;
  city: string;
  cityIsValid: boolean;
  cityIsInvalid: boolean;
  cityValidationMessage: string;
  state: string;
  stateIsInvalid: boolean;
  stateIsValid: boolean;
  stateValidationMessage: string;
}

export const ReportingAgencyStateDefault = {
  aacCode: "",
  disableAAC: false,
  aacIsInvalid: false,
  aacIsValid: false,
  aacValidationMessage: "",
  agencyBureau: "",
  agencyBureauCode: "",
  pocAddressValues: [],
  pocEmailValues: [],
  pocAddress: "",
  pocEmail: "",
  email: "",
  emailIsValid: false,
  emailIsInValid: false,
  emailValidationMessage: "",
  city: "",
  cityIsValid: false,
  cityIsInvalid: false,
  cityValidationMessage: "",
  state: "",
  stateIsInvalid: false,
  stateIsValid: false,
  stateValidationMessage: "",
};
