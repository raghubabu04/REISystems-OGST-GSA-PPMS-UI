export interface BidderPrimaryAddressInformationState {
  id?: bigint;
  isPrimaryAddressPoBoxErrorMessage: string;
  addressLine1: string;
  addressLine1IsInvalid: boolean;
  addressLine1IsValid: boolean;
  addressLine1ValidationMessage: string;
  addressLine2: string;
  addressLine2IsInvalid: boolean;
  addressLine2IsValid: boolean;
  addressLine2ValidationMessage: string;
  addressLine3: string;
  addressLine3IsInvalid: boolean;
  addressLine3IsValid: boolean;
  addressLine3ValidationMessage: string;
  city: string;
  cityIsInvalid: boolean;
  cityIsValid: boolean;
  cityValidationMessage: string;
  stateCode: string;
  stateCodeDefault: string;
  stateCodeIsInvalid: boolean;
  stateCodeIsValid: boolean;
  stateCodeValidationMessage: string;
  zip: string;
  zipIsInvalid: boolean;
  zipIsValid: boolean;
  zipValidationMessage: string;
  zipExtension: string;
  disabledZipExtension: boolean;
  isPrimaryAddressPoBox: boolean;
  isRadioBoxChecked: boolean;
  radioBoxInvalid: boolean;
  defaultIsPrimaryAddressPoBox: string;
  zip2Code: string;
  zip2IsInvalid: boolean;
  zip2IsValid: boolean;
  zip2ValidationMessage: string;
  isAddressPoBoxOptions: any;
}

export const bidderPrimaryAddressInformationStateDefault: BidderPrimaryAddressInformationState = {
  id: null,
  isPrimaryAddressPoBoxErrorMessage: "Please select Is primary/mailing address a PO Box or Personal Mailbox (PMB)",
  addressLine1: "",
  addressLine1IsInvalid: false,
  addressLine1IsValid: false,
  addressLine1ValidationMessage: "",
  addressLine2: "",
  addressLine2IsInvalid: false,
  addressLine2IsValid: false,
  addressLine2ValidationMessage: "",
  addressLine3: "",
  addressLine3IsInvalid: false,
  addressLine3IsValid: false,
  addressLine3ValidationMessage: "",
  city: "",
  cityIsInvalid: false,
  cityIsValid: false,
  cityValidationMessage: "",
  stateCode: "",
  stateCodeDefault: "",
  stateCodeIsInvalid: false,
  stateCodeIsValid: false,
  stateCodeValidationMessage: "",
  zip: "",
  zipIsInvalid: false,
  zipIsValid: false,
  zipValidationMessage: "",
  zipExtension: "",
  disabledZipExtension: false,
  isPrimaryAddressPoBox: false,
  isRadioBoxChecked: false,
  radioBoxInvalid: false,
  defaultIsPrimaryAddressPoBox: "",
  zip2Code: "",
  zip2IsInvalid: false,
  zip2IsValid: false,
  zip2ValidationMessage: "",
  isAddressPoBoxOptions: [
    { value: "Yes", id: "Y", isSelected: false },
    { value: "No", id: "N", isSelected: false },
  ],
}

export const BidderPrimaryAddressInformationStateJson = (
  bidderPrimaryAddressInformationState: BidderPrimaryAddressInformationState
) => [
    {
      isPrimaryAddressPoBox: bidderPrimaryAddressInformationState.isPrimaryAddressPoBox,
      addressLine1: bidderPrimaryAddressInformationState.addressLine1,
      addressLine2: bidderPrimaryAddressInformationState.addressLine2,
      addressLine3: bidderPrimaryAddressInformationState.addressLine3,
      city: bidderPrimaryAddressInformationState.city,
      stateCode: bidderPrimaryAddressInformationState.stateCode,
      zip: bidderPrimaryAddressInformationState.zip,
      zipExtension: bidderPrimaryAddressInformationState.zipExtension,
    },
  ];
