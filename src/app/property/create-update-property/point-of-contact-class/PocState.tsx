import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface PocState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  pocFirstName: string;
  pocFirstNameIsInvalid: boolean;
  pocFirstNameIsValid: boolean;
  pocFirstNameValidationMessage: string;
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
  pocCcEmail: string;
  pocCcEmailIsInvalid: boolean;
  pocCcEmailIsValid: boolean;
  pocCcEmailValidationMessage: string;
  pocNotify: boolean;
  pocNotifyDefault: string;
  pocValues: Array<string>;
  keyDisplayStr: string;
  modalShow: boolean;
  pocId: number;
  pocAacCode: string;
  contactId: string;
  updateDisabled: boolean;
  showErrorAlert?: boolean;
  FormErrorMessage?: string;
  alertBodyArray?: string[];
  pocOption: any[];
  pocIsInvalid: boolean;
  pocIsValid: boolean;
  deleteAlert: boolean;
}
export const PocStateDefault: PocState = {
  accordianExpanded: true,
  accordingDisplay: "show",
  pocFirstName: "",
  pocFirstNameIsInvalid: false,
  pocFirstNameIsValid: false,
  pocFirstNameValidationMessage: "",
  pocLastName: "",
  pocLastNameIsInvalid: false,
  pocLastNameIsValid: false,
  pocLastNameValidationMessage: "",
  pocPhone: "",
  pocPhoneIsInvalid: false,
  pocPhoneIsValid: false,
  pocPhoneValidationMessage: "",
  pocPhoneExt: "",
  pocPhoneExtIsInvalid: false,
  pocPhoneExtIsValid: false,
  pocDisabledExtension: false,
  pocPhoneExtValidationMessage: "",
  pocFax: "",
  pocFaxIsInvalid: false,
  pocFaxIsValid: false,
  pocFaxValidationMessage: "",
  pocEmail: "",
  pocEmailIsInvalid: false,
  pocEmailIsValid: false,
  pocEmailValidationMessage: "",
  pocCcEmail: "",
  pocCcEmailIsInvalid: false,
  pocCcEmailIsValid: false,
  pocCcEmailValidationMessage: "",
  pocNotify: false,
  pocNotifyDefault: "",
  pocValues: [],
  keyDisplayStr: "",
  modalShow: false,
  pocId: 0,
  pocAacCode: "",
  contactId: "",
  updateDisabled: true,
  showErrorAlert: false,
  FormErrorMessage: "",
  alertBodyArray: [],
  pocOption: [
    {
      value: "Notify Point of Contact when Available for Sale",
      id: "notify-poc",
      isSelected: false,
    },
  ],
  pocIsInvalid: false,
  pocIsValid: false,
  deleteAlert: false,
};

export const PocStateJson = (pocState: PocState) => [
  {
    firstName: pocState?.pocFirstName?.trim(),
    lastName: pocState?.pocLastName?.trim(),
    middleName: "",
    email: pocState?.pocEmail?.trim(),
    ccEmail: pocState?.pocCcEmail?.trim(),
    phone: pocState.pocPhone.replace(/[^0-9]/g, ""),
    fax: pocState.pocFax.replace(/[^0-9]/g, ""),
    phoneExtension: pocState.pocPhoneExt.replace(/[^0-9]/g, ""),
    isDeleted: false,
  },
];

const vFields = [
  "pocFirstNameIsInvalid",
  "pocLastNameIsInvalid",
  "pocPhoneIsInvalid",
  "pocPhoneExtIsInvalid",
  "pocFaxIsInvalid",
  "pocEmailIsInvalid",
  "pocCcEmailIsInvalid",
];

const eFields = ["pocFirstName", "pocLastName", "pocEmail", "pocPhone"];

export function updatePocStateNav(
  newState: PocState,
  prevState: PocState
): void {
  const pocIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const pocIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.pocIsInvalid = pocIsInvalid;
  newState.pocIsValid = !pocIsInvalid && !pocIsEmpty;
}
