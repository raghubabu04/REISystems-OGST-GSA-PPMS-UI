export interface PocState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  pocFirstName: string;
  pocFirstNameIsInvalid: boolean;
  pocFirstNameIsValid: boolean;
  pocFirstNameValidationMessage: string;
  pocMiddleName: string;
  pocLastName: string;
  pocLastNameIsInvalid: boolean;
  pocLastNameIsValid: boolean;
  pocLastNameValidationMessage: string;
  pocPhone?: any;
  pocPhoneIsInvalid: boolean;
  pocPhoneIsValid: boolean;
  pocPhoneValidationMessage: string;
  pocPhoneExt?: any;
  pocPhoneExtIsInvalid: boolean;
  pocPhoneExtIsValid: boolean;
  pocDisabledExtension: boolean;
  pocPhoneExtValidationMessage: string;
  pocFax: string;
  pocFaxIsInvalid: boolean;
  pocFaxIsValid: boolean;
  pocFaxValidationMessage: string;
  pocEmail: string;
  pocEmailIsInvalid: boolean;
  pocEmailIsValid: boolean;
  pocEmailValidationMessage: string;
  pocEmailRequired: boolean;
  pocCcEmail: string;
  pocCcEmailIsInvalid: boolean;
  pocCcEmailIsValid: boolean;
  pocCcEmailValidationMessage: string;
  pocNotify: boolean;
}
export const PocStateDefault = {
  accordianExpanded: true,
  accordingDisplay: "show",
  pocFirstName: "",
  pocFirstNameIsInvalid: false,
  pocFirstNameIsValid: false,
  pocFirstNameValidationMessage: "",
  pocMiddleName: "",
  pocLastName: "",
  pocLastNameIsInvalid: false,
  pocLastNameIsValid: false,
  pocLastNameValidationMessage: "",
  pocPhoneIsInvalid: false,
  pocPhoneIsValid: false,
  pocPhone: "",
  pocPhoneValidationMessage: "",
  pocPhoneExtIsInvalid: false,
  pocPhoneExtIsValid: false,
  pocDisabledExtension: true,
  pocPhoneExtValidationMessage: "",
  pocPhoneExt: "",
  pocFax: "",
  pocFaxIsInvalid: false,
  pocFaxIsValid: false,
  pocFaxValidationMessage: "",
  pocEmail: "",
  pocEmailIsInvalid: false,
  pocEmailIsValid: false,
  pocEmailValidationMessage: "",
  pocEmailRequired: true,
  pocCcEmail: "",
  pocCcEmailIsInvalid: false,
  pocCcEmailIsValid: false,
  pocCcEmailValidationMessage: "",
  pocNotify: false,
};

export const PocStateJson = (pocState: PocState) => [
  {
    firstName: pocState?.pocFirstName?.trim(),
    lastName: pocState?.pocLastName?.trim(),
    middleName: pocState.pocMiddleName,
    email: pocState?.pocEmail?.trim(),
    ccEmail: pocState?.pocCcEmail?.trim(),
    phone: pocState.pocPhone.replace(/[^0-9]/g, ""),
    fax: pocState.pocFax.replace(/[^0-9]/g, ""),
    phoneExtension: pocState.pocPhoneExt.replace(/[^0-9]/g, ""),
  },
];