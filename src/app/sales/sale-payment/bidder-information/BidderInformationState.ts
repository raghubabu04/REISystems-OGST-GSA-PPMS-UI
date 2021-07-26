export interface BidderInformationState {
  companyName: string;
  companyNameIsInValid: boolean;
  companyNameIsValid: boolean;
  companyNameValidationMessage: string;
  firstName: string;
  firstNameIsInValid: boolean;
  firstNameIsValid: boolean;
  firstNameValidationMessage: string;
  lastName: string;
  lastNameIsInValid: boolean;
  lastNameIsValid: boolean;
  lastNameValidationMessage: string;
  emailAddress: string;
  emailAddressIsInValid: boolean;
  emailAddressIsValid: boolean;
  emailAddressValidationMessage: string;
  phoneNumber: string;
  phoneNumberIsInValid: boolean;
  phoneNumberIsValid: boolean;
  phoneNumberValidationMessage: string;
}

export const defaultBidderInformationState: BidderInformationState = {
  companyName: "",
  companyNameIsInValid: false,
  companyNameIsValid: false,
  companyNameValidationMessage: "",
  firstName: "",
  firstNameIsInValid: false,
  firstNameIsValid: false,
  firstNameValidationMessage: "",
  lastName: "",
  lastNameIsInValid: false,
  lastNameIsValid: false,
  lastNameValidationMessage: "",
  emailAddress: "",
  emailAddressIsInValid: false,
  emailAddressIsValid: false,
  emailAddressValidationMessage: "",
  phoneNumber: "",
  phoneNumberIsInValid: false,
  phoneNumberIsValid: false,
  phoneNumberValidationMessage: "",
};
