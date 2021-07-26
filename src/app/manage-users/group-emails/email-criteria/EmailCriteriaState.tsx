import {UserUtils} from "../../../../utils/UserUtils";

export interface EmailCriteriaState {
  agency: any;
  state: any;
  recipientType: any;
  isRecipientTypeInvalid: boolean;
  recipientTypeInvalidErrorMessage: string;
  agencyOptions:any;
  stateOptions:any;
  bidderType:string;
  bidderCity:string;
  bidderStateCode:string;
  saleNumber:string;
  lotNumber:string;
  isEmailCriteriaInvalid:boolean;
  isEmailCriteriaInvalidMessage:string;
  isStateInvalid:boolean;
  cityInvalidMessage:string;
  isCityInvalid:boolean;
  stateInvalidMessage:string;
  isSaleNumberInvalid:boolean;
  saleNumberInvalidMessage:string;
  isLotNumberInvalid:boolean;
  lotNumberInvalidMessage:string;
}

export const EmailCriteriaStateDefault = {
  agency: [],
  state: [],
  recipientType: [],
  isRecipientTypeInvalid: false,
  recipientTypeInvalidErrorMessage:"",
  agencyOptions:[],
  stateOptions:[],
  bidderType: "",
  bidderCity:"",
  bidderStateCode:"",
  saleNumber:"",
  lotNumber:"",
  isEmailCriteriaInvalid:false,
  isEmailCriteriaInvalidMessage : "",
  isStateInvalid:false,
  isCityInvalid: false,
  cityInvalidMessage:"",
  stateInvalidMessage:"",
  isSaleNumberInvalid:false,
  isLotNumberInvalid: false,
  saleNumberInvalidMessage:"",
  lotNumberInvalidMessage:""
}
