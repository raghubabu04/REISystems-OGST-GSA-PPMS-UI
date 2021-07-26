import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface PropCustState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  propCustFirstName: string;
  propCustFirstNameIsInvalid: boolean;
  propCustFirstNameIsValid: boolean;
  propCustFirstNameValidationMessage: string;
  propCustLastName: string;
  propCustLastNameIsInvalid: boolean;
  propCustLastNameIsValid: boolean;
  propCustLastNameValidationMessage: string;
  propCustPhone?: any;
  propCustPhoneIsInvalid: boolean;
  propCustPhoneIsValid: boolean;
  propCustPhoneValidationMessage: string;
  propCustPhoneExt?: any;
  propCustDisabledExtension: boolean;
  propCustPhoneExtIsInvalid: boolean;
  propCustPhoneExtIsValid: boolean;
  propCustPhoneExtValidationMessage: string;
  propCustFax: string;
  propCustFaxIsInvalid: boolean;
  propCustFaxIsValid: boolean;
  propCustFaxValidationMessage: string;
  propCustEmail: string;
  propCustEmailIsInvalid: boolean;
  propCustEmailIsValid: boolean;
  propCustEmailValidationMessage: string;
  propCustCcEmail: string;
  propCustCcEmailIsInvalid: boolean;
  propCustCcEmailIsValid: boolean;
  propCustCcEmailValidationMessage: string;
  propCustNotify: boolean;
  propCustNotifyDefault: string;
  propCustValues: Array<string>;
  keyDisplayStr: string;
  modalShow: boolean;
  propCustId: number;
  aacCode: string;
  contactId: string;
  updateDisabled: boolean;
  showErrorAlert?: boolean;
  FormErrorMessage?: string;
  alertBodyArray?: string[];
  propCustOptions: any[];
  propCustIsInvalid: boolean;
  propCustIsValid: boolean;
  deleteAlert: boolean;
}
export const PropCustStateDefault: PropCustState = {
  accordianExpanded: true,
  accordingDisplay: "show",
  propCustFirstName: "",
  propCustFirstNameIsInvalid: false,
  propCustFirstNameIsValid: false,
  propCustFirstNameValidationMessage: "",
  propCustLastName: "",
  propCustLastNameIsInvalid: false,
  propCustLastNameIsValid: false,
  propCustLastNameValidationMessage: "",
  propCustPhone: "",
  propCustPhoneIsInvalid: false,
  propCustPhoneIsValid: false,
  propCustPhoneValidationMessage: "",
  propCustPhoneExt: "",
  propCustPhoneExtIsInvalid: false,
  propCustPhoneExtIsValid: false,
  propCustDisabledExtension: false,
  propCustPhoneExtValidationMessage: "",
  propCustFax: "",
  propCustFaxIsInvalid: false,
  propCustFaxIsValid: false,
  propCustFaxValidationMessage: "",
  propCustEmail: "",
  propCustEmailIsInvalid: false,
  propCustEmailIsValid: false,
  propCustEmailValidationMessage: "",
  propCustCcEmail: "",
  propCustCcEmailIsInvalid: false,
  propCustCcEmailIsValid: false,
  propCustCcEmailValidationMessage: "",
  propCustNotify: true,
  propCustNotifyDefault: "",
  propCustValues: [],
  keyDisplayStr: "",
  modalShow: false,
  propCustId: 0,
  aacCode: "",
  contactId: "",
  updateDisabled: true,
  showErrorAlert: false,
  FormErrorMessage: "",
  alertBodyArray: [],
  propCustOptions: [
    {
      value: "Notify Property Custodian when Available for Sale",
      id: "notify-propCust",
      isSelected: false,
    },
  ],
  propCustIsInvalid: false,
  propCustIsValid: false,
  deleteAlert: false,
};

export const PropCustStateJson = (propCustState: PropCustState) => [
  {
    firstName: propCustState?.propCustFirstName?.trim(),
    lastName: propCustState?.propCustLastName?.trim(),
    middleName: "",
    email: propCustState.propCustEmail.trim(),
    ccEmail: propCustState.propCustCcEmail.trim(),
    phone: propCustState.propCustPhone.replace(/[^0-9]/g, ""),
    fax: propCustState.propCustFax.replace(/[^0-9]/g, ""),
    phoneExtension: propCustState.propCustPhoneExt.replace(/[^0-9]/g, ""),
    isDeleted: false,
  },
];

const vFields = [
  "propCustFirstNameIsInvalid",
  "propCustLastNameIsInvalid",
  "propCustPhoneIsInvalid",
  "propCustPhoneExtIsInvalid",
  "propCustFaxIsInvalid",
  "propCustEmailIsInvalid",
  "propCustCcEmailIsInvalid",
];

const eFields = [
  "propCustFirstName",
  "propCustLastName",
  "propCustPhone",
  "propCustEmail",
];

export function updatePropCustNav(
  newState: PropCustState,
  prevState: PropCustState
): void {
  const propCustIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const propCustIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.propCustIsInvalid = propCustIsInvalid;
  newState.propCustIsValid = !propCustIsInvalid && !propCustIsEmpty;
}
