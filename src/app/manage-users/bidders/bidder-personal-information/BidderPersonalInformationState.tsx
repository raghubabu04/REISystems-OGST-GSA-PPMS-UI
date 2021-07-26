export interface BidderPersonalInformationState {
  id?: bigint;
  firstName: string;
  isFirstNameInvalid: boolean;
  firstNameInvalidErrorMessage: string;
  middleName?: string;
  lastName: string;
  isLastNameInvalid: boolean;
  lastNameInvalidErrorMessage: string;
  emailAddress: string;
  isEmailAddressInvalid: boolean;
  isEmailAddressValid: boolean;
  emailAddressInvalidErrorMessage: string;
  confirmEmailAddress: string;
  confirmDisabled: boolean;
  isConfirmEmailAddressInvalid: boolean;
  isConfirmEmailAddressValid: boolean;
  confirmEmailAddressInvalidErrorMessage: string;
  dateOfBirth: Date;
  dateOfBirthIsRequired: boolean;
  dateOfBirthIsValid: boolean;
  dateOfBirthIsInValid: boolean;
  dateOfBirthMsg: string;
  usaCitizenOptions: any,
  usaCitizenToggle: boolean,
  usaCitizenToggleValidationMessage: string,
  defaultUSACitizenToggle: string,
  country: string;
  countryIsInvalid: boolean;
  countryValidationMessage: string;
  isCountryDisabled?: boolean;
  ssn: string,
  confirmSSN: string,
  companyName: string,
  companyNameIsRequired: boolean,
  companyNameIsInValid: boolean,
  companyNameValidationMsg: string,
  ein: string,
  confirmEIN: string,
}

export const bidderPersonalInformationStateDefault: BidderPersonalInformationState = {
  id: null,
  firstName: "",
  isFirstNameInvalid: false,
  firstNameInvalidErrorMessage: "",
  middleName: "",
  lastName: "",
  isLastNameInvalid: false,
  lastNameInvalidErrorMessage: "",
  emailAddress: "",
  isEmailAddressInvalid: false,
  isEmailAddressValid: false,
  emailAddressInvalidErrorMessage: "",
  confirmEmailAddress: "",
  confirmDisabled: false,
  isConfirmEmailAddressInvalid: false,
  isConfirmEmailAddressValid: false,
  confirmEmailAddressInvalidErrorMessage: "",
  dateOfBirth: null,
  dateOfBirthIsRequired: true,
  dateOfBirthIsValid: false,
  dateOfBirthIsInValid: false,
  dateOfBirthMsg: "Date of Birth is Required",
  usaCitizenOptions: [
    {value: "Yes", id: "Y", isSelected: false},
    {value: "No", id: "N", isSelected: false},
  ],
  usaCitizenToggle: false,
  usaCitizenToggleValidationMessage: "Please select Are you a citizen of the United States of America",
  defaultUSACitizenToggle: "",
  country: "US",
  countryIsInvalid: false,
  countryValidationMessage: "",
  isCountryDisabled: false,
  ssn: "",
  confirmSSN: "",
  companyName: "",
  companyNameIsRequired: true,
  companyNameIsInValid: false,
  companyNameValidationMsg: "Company Name is Required",
  ein: "",
  confirmEIN: "",
}

export const BidderPersonalInformationStateJson = (
  bidderPersonalInformationState: BidderPersonalInformationState
) => [
  {
    firstName: bidderPersonalInformationState.firstName,
    middleName: bidderPersonalInformationState.middleName,
    lastName: bidderPersonalInformationState.lastName,
    emailAddress: bidderPersonalInformationState.emailAddress,
    dateOfBirth: bidderPersonalInformationState.dateOfBirth,
    country: bidderPersonalInformationState.country,
    ssn: bidderPersonalInformationState.ssn,
    isUsCitizen: bidderPersonalInformationState.usaCitizenToggle,
    companyName: bidderPersonalInformationState.companyName,
    ein: bidderPersonalInformationState.ein
  },
];
