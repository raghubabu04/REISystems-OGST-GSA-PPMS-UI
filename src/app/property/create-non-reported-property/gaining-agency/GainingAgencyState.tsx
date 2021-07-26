export interface GainingAgencyState {
  gainingAgencyReason: string;
  gainingAgencyReasonIsInvalid?: any;
  gainingAgencyReasonValidationMessage?: any;
  selectedPriority: string;
  selectedRegion: string;
  priorityValues: Array<string>;
  regionValues: Array<string>;
  aacCode: string;
  agencyBureauCode: string;
  disableAAC: boolean;
  aacIsInvalid: boolean;
  aacIsValid: boolean;
  aacValidationMessage: any;
  agencyBureau: string;
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
  cityValidationMessage:string;
  state:string;
  stateIsInvalid: boolean;
  stateIsValid: boolean;
  stateValidationMessage: string;
  priorityIsInvalid?: boolean;
  priorityIsValid?: boolean;
  priorityValidationMessage?: any;
  regionIsInvalid?: boolean;
  regionIsValid?: boolean;
  regionValidationMessage?: any;


}

export const GainingAgencyStateDefault = {
  gainingAgencyReason: "",
  gainingAgencyReasonIsInvalid: false,
  gainingAgencyReasonValidationMessage: "",
  selectedPriority: "",
  agencyBureauCode: "",
  selectedRegion:"",
  priorityValues:[],
  regionValues:[],
  aacCode: "",
  disableAAC: false,
  aacIsInvalid: false,
  aacIsValid: false,
  aacValidationMessage: "",
  agencyBureau:"",
  pocAddressValues:[],
  pocEmailValues:[],
  pocAddress:"",
  pocEmail:"",
  email: "",
  emailIsValid: false,
  emailIsInValid: false,
  emailValidationMessage:"",
  city:"",
  cityIsValid: false,
  cityIsInvalid: false,
  cityValidationMessage: "",
  state: "",
  stateIsInvalid: false,
  stateIsValid: false,
  stateValidationMessage: "",
  priorityIsInvalid: false,
  priorityIsValid: false,
  priorityValidationMessage: "",
  regionIsInvalid: false,
  regionIsValid: false,
  regionValidationMessage: "",

};
