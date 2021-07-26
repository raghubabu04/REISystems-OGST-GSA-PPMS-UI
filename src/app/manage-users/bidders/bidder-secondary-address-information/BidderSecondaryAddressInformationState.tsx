export interface BidderSecondaryAddressInformationState {
  secondaryAddressLine1: string;
  secondaryAddressLine1IsInvalid: boolean;
  secondaryAddressLine1IsValid: boolean;
  secondaryAddressLine1ValidationMessage: string;
  secondaryAddressLine2: string;
  secondaryAddressLine2IsInvalid: boolean;
  secondaryAddressLine2IsValid: boolean;
  secondaryAddressLine2ValidationMessage: string;
  secondaryAddressLine3: string;
  secondaryAddressLine3IsInvalid: boolean;
  secondaryAddressLine3IsValid: boolean;
  secondaryAddressLine3ValidationMessage: string;
  secondaryCity: string;
  secondaryCityIsInvalid: boolean;
  secondaryCityIsValid: boolean;
  secondaryCityValidationMessage: string;
  secondaryStateCode: string; 
  secondaryStateCodeDefault: string;
  secondaryStateCodeIsInvalid: boolean;
  secondaryStateCodeIsValid: boolean;
  secondaryStateCodeValidationMessage: string;
  secondaryZip: string;
  secondaryZipIsInvalid: boolean;
  secondaryZipIsValid: boolean;
  secondaryZipValidationMessage: string;
  secondaryZipExtension: string; 
  secondarydDisabledZipExtension: boolean;
  secondaryZip2Code: string;
  secondaryZip2IsInvalid: boolean;
  secondaryZip2IsValid: boolean;
  secondaryZip2ValidationMessage: string;
   
}

export const bidderSecondaryAddressInformationStateDefault: BidderSecondaryAddressInformationState = {
  secondaryAddressLine1: "",
  secondaryAddressLine1IsInvalid: false,
  secondaryAddressLine1IsValid: false,
  secondaryAddressLine1ValidationMessage: "",
  secondaryAddressLine2: "",
  secondaryAddressLine2IsInvalid: false,
  secondaryAddressLine2IsValid: false,
  secondaryAddressLine2ValidationMessage: "",
  secondaryAddressLine3: "",
  secondaryAddressLine3IsInvalid: false,
  secondaryAddressLine3IsValid: false,
  secondaryAddressLine3ValidationMessage: "",
  secondaryCity: "",
  secondaryCityIsInvalid: false,
  secondaryCityIsValid: false,
  secondaryCityValidationMessage: "",
  secondaryStateCode: "", 
  secondaryStateCodeDefault: "",
  secondaryStateCodeIsInvalid: false,
  secondaryStateCodeIsValid: false,
  secondaryStateCodeValidationMessage: "",
  secondaryZip: "",
  secondaryZipIsInvalid: false,
  secondaryZipIsValid: false,
  secondaryZipValidationMessage: "",
  secondaryZipExtension: "", 
  secondarydDisabledZipExtension: false,
  secondaryZip2Code: "",
  secondaryZip2IsInvalid: false,
  secondaryZip2IsValid: false,
  secondaryZip2ValidationMessage: "",
}

export const BidderSecondaryAddressInformationStateJson = (
  bidderSecondaryAddressInformationState: BidderSecondaryAddressInformationState
) => [
  {
    secondaryAddressLine1: bidderSecondaryAddressInformationState.secondaryAddressLine1,
    secondaryAddressLine2: bidderSecondaryAddressInformationState.secondaryAddressLine2,
    secondaryAddressLine3: bidderSecondaryAddressInformationState.secondaryAddressLine3,
    secondaryCity: bidderSecondaryAddressInformationState.secondaryCity,
    secondaryStateCode: bidderSecondaryAddressInformationState.secondaryStateCode,
    secondaryZip: bidderSecondaryAddressInformationState.secondaryZip,
    secondaryZipExtension: bidderSecondaryAddressInformationState.secondaryZipExtension,
  },
];
