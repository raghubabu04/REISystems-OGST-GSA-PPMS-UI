
export interface UserProfileForSalesUserInformation {
  id?: bigint;
  firstName: string;
  isFirstNameInvalid: boolean;
  firstNameInvalidErrorMessage: string;
  middleName?: string;
  lastName: string;
  isLastNameInvalid: boolean;
  lastNameInvalidErrorMessage: string;
  phoneNumber?: string;
  isPhoneNumberInvalid: boolean;
  phoneNumberInvalidErrorMessage: string;
  phoneExtension?: string;
  isPhoneExtensionInvalid: boolean;
  phoneExtensionInvalidErrorMessage: string;
  emailAddress: string;
  isEmailAddressInvalid: boolean;
  isEmailAddressValid:boolean;
  emailAddressInvalidErrorMessage: string;
  confirmEmailAddress: string;
  confirmDisabled:boolean;
  isConfirmEmailAddressInvalid: boolean;
  isConfirmEmailAddressValid:boolean;
  confirmEmailAddressInvalidErrorMessage: string;
  salesUserAddress1: string;
  salesUserAddress1IsInvalid: boolean;
  salesUserAddress1IsValid: boolean;
  salesUserAddress1ValidationMessage: string;
  salesUserAddress2: string;
  salesUserAddress2IsInvalid: boolean;
  salesUserAddress2IsValid: boolean;
  salesUserAddress2ValidationMessage: string;
  salesUserAddress3: string;
  salesUserAddress3IsInvalid: boolean;
  salesUserAddress3IsValid: boolean;
  salesUserAddress3ValidationMessage: string;
  salesUserCity: string;
  salesUserCityIsInvalid: boolean;
  salesUserCityIsValid: boolean;
  salesUserCityValidationMessage: string;
  salesUserStateCode: string;
  salesUserState: string;
  salesUserStateDefault: string;
  salesUserStateIsInvalid: boolean;
  salesUserStateIsValid: boolean;
  salesUserStateValidationMessage: string;
  salesUserZipCode: string;
  salesUserZipIsInvalid: boolean;
  salesUserZipIsValid: boolean;
  salesUserZipValidationMessage: string;
  salesUserZip2Code: string;
  salesUserZip2IsInvalid: boolean;
  salesUserZip2IsValid: boolean;
  salesUserZip2ValidationMessage: string;
  salesUserDisabledZipExtension: boolean;
}

export const userProfileForSalesUserInformationDefault : UserProfileForSalesUserInformation = {
  id: null,
  firstName: "",
  isFirstNameInvalid: false,
  firstNameInvalidErrorMessage: "",
  middleName: "",
  lastName: "",
  isLastNameInvalid: false,
  lastNameInvalidErrorMessage: "",
  phoneNumber: "",
  isPhoneNumberInvalid: false,
  phoneNumberInvalidErrorMessage: "",
  phoneExtension: "",
  isPhoneExtensionInvalid: false,
  phoneExtensionInvalidErrorMessage: "",
  emailAddress: "",
  isEmailAddressInvalid: false,
  isEmailAddressValid:false,
  emailAddressInvalidErrorMessage: "",
  confirmEmailAddress: "",
  confirmDisabled:false,
  isConfirmEmailAddressInvalid: false,
  isConfirmEmailAddressValid:false,
  confirmEmailAddressInvalidErrorMessage: "",
  salesUserAddress1: "",
  salesUserAddress1IsInvalid: false,
  salesUserAddress1IsValid: false,
  salesUserAddress1ValidationMessage: "",
  salesUserAddress2: "",
  salesUserAddress2IsInvalid: false,
  salesUserAddress2IsValid: false,
  salesUserAddress2ValidationMessage: "",
  salesUserAddress3: "",
  salesUserAddress3IsInvalid: false,
  salesUserAddress3IsValid: false,
  salesUserAddress3ValidationMessage: "",
  salesUserCity: "",
  salesUserCityIsInvalid: false,
  salesUserCityIsValid: false,
  salesUserCityValidationMessage: "",
  salesUserStateCode: "",
  salesUserState: "",
  salesUserStateDefault: "",
  salesUserStateIsInvalid: false,
  salesUserStateIsValid: false,
  salesUserStateValidationMessage: "",
  salesUserZipCode: "",
  salesUserZipIsInvalid: false,
  salesUserZipIsValid: false,
  salesUserZipValidationMessage: "",
  salesUserZip2Code: "",
  salesUserZip2IsInvalid: false,
  salesUserZip2IsValid: false,
  salesUserZip2ValidationMessage: "",
  salesUserDisabledZipExtension: false,
}
export const UserProfileForSalesUserInformationStateJson = (
  salesUserInformationState: UserProfileForSalesUserInformation
) => [
  {
    id: salesUserInformationState.id,
    firstName: salesUserInformationState.firstName,
    middleName: salesUserInformationState.middleName,
    lastName: salesUserInformationState.lastName,
    emailAddress: salesUserInformationState.emailAddress,
    phoneNumber: salesUserInformationState.phoneNumber.replace(/[^0-9]/g, ""),
    phoneExt: salesUserInformationState.phoneExtension.replace(/[^0-9]/g, ""),
    line1: salesUserInformationState.salesUserAddress1.trim(),
    line2: salesUserInformationState.salesUserAddress2.trim(),
    line3: salesUserInformationState.salesUserAddress3,
    city: salesUserInformationState.salesUserCity.trim(),
    stateCode: salesUserInformationState.salesUserStateCode,
    zip: salesUserInformationState.salesUserZipCode,
    zip2: salesUserInformationState.salesUserZip2Code,
  },
];