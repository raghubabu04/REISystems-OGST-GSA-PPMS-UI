export interface BidderContactInformationState {
  id?: bigint;
  daytimePhone: string;
  daytimePhoneIsInvalid: boolean;
  daytimePhoneIsValid: boolean;
  daytimePhoneValidationMessage: string;
  eveningPhone: string;
  eveningPhoneIsInvalid: boolean;
  eveningPhoneIsValid: boolean;
  eveningPhoneValidationMessage: string;
  daytimePhoneExt: string;
  daytimePhoneExtIsInvalid: boolean;
  daytimePhoneExtIsValid: boolean;
  daytimePhoneExtValidationMessage: string;
  eveningPhoneExt: string;
  eveningPhoneExtIsInvalid: boolean;
  eveningPhoneExtIsValid: boolean;
  eveningPhoneExtValidationMessage: string; 
  internationalPhone: string;
  internationalPhoneIsInvalid: boolean;
  internationalPhoneIsValid: boolean;
  internationalPhoneValidationMessage: string;

}

export const bidderContactInformationStateDefault: BidderContactInformationState = {
  id: null,
  daytimePhone: "",
  daytimePhoneIsInvalid: false,
  daytimePhoneIsValid: false,
  daytimePhoneValidationMessage: "",
  eveningPhone: "",
  eveningPhoneIsInvalid: false,
  eveningPhoneIsValid: false,
  eveningPhoneValidationMessage: "",
  daytimePhoneExt: "",
  daytimePhoneExtIsInvalid: false,
  daytimePhoneExtIsValid: false,
  daytimePhoneExtValidationMessage: "",
  eveningPhoneExt: "",
  eveningPhoneExtIsInvalid: false,
  eveningPhoneExtIsValid: false,
  eveningPhoneExtValidationMessage: "", 
  internationalPhone: "",
  internationalPhoneIsInvalid: false,
  internationalPhoneIsValid: false,
  internationalPhoneValidationMessage: "",
}

export const BidderContactInformationStateJson = (
  bidderContactInformationState: BidderContactInformationState
) => [
  { 
    daytimePhone:bidderContactInformationState.daytimePhone,
    eveningPhone:bidderContactInformationState.eveningPhone,
    daytimePhoneExt:bidderContactInformationState.daytimePhoneExt,
    eveningPhoneExt:bidderContactInformationState.eveningPhoneExt,
    internationalPhone:bidderContactInformationState.internationalPhone,
  },
];
