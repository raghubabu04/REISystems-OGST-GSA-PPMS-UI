import { boolean } from "yup";
import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface PropertyInfoState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  propType: string;
  agencyLocationCode: string;
  amountTobeReimbursed: string;
  agencyControlNumber: string;
  afcReqMsg: string;
  isAfcValid: boolean;
  isAfcInvalid: boolean;
  reimbursementIsReq: string;
  isDonation: string;
  isExchangeSales: string;

  isAppropriationTasDisabled: boolean;
  isAppropriationTasRequired: boolean;
  reimbursemenCode: string;

  acnValidationMessage: string;
  isACNValid: boolean;
  isACNInValid: boolean;

  propValidationMessage: string;
  isPropValid: boolean;
  isPropInValid: boolean;

  alcValidationMessage: string;
  isALCValid: boolean;
  isALCInValid: boolean;
  isAlcRequired: boolean;
  fileUploaded: boolean;

  NUOContacts: any[];
  APOContacts: any[];

  propInfoInvalid: boolean;
  propInfoValid: boolean;
}

export const PropertyInfoStateDefault = {
  accordianExpanded: true,
  accordingDisplay: "show",
  propType: "NR",
  agencyLocationCode: "",
  amountTobeReimbursed: "",
  agencyControlNumber: "",
  reimbursementIsReq: "N",

  afcReqMsg:
    "Appropriation/TAS Fund code must be entered accurately to obtain reimbursement for you Agency and to complete this property report submission. Please contact your Agency's Finance Department for the correct TAS code.",
  isDonation: "Y",
  isExchangeSales: "N",
  isAppropriationTasDisabled: true,
  isAppropriationTasRequired: false,
  reimbursemenCode: "",
  acnValidationMessage: "",
  isACNValid: false,
  isACNInValid: false,
  isPropValid: true,
  isPropInValid: false,
  propValidationMessage: "",
  alcValidationMessage: "Agency Location Code is Required",
  alcValidationLengthMessage: "Must be 8 characters",
  alcValidationPatternMessage: "Must be numerical only",
  isALCValid: false,
  isALCInValid: false,
  isAlcRequired: false,
  isAfcValid: false,
  isAfcInvalid: false,
  fileUploaded: false,

  NUOContacts: [],
  APOContacts: [],
  propInfoInvalid: false,
  propInfoValid: false,
};

const vFields = [
  "isPropInValid",
  "isAfcInvalid",
  "isALCInValid",
  "isACNInValid",
];

const eFields = ["agencyLocationCode", "amountTobeReimbursed"];

export function updatePropInfoNav(
  newState: PropertyInfoState,
  prevState: PropertyInfoState
): void {
  const propInfoInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const propInfoEmpty: boolean =
    prevState.propType == "NR"
      ? false
      : eFields.some((f) => {
          return newState[f] !== undefined
            ? isEmptyCheck(newState[f])
            : isEmptyCheck(prevState[f]);
        });
  newState.propInfoInvalid = propInfoInvalid;
  newState.propInfoValid = !propInfoInvalid && !propInfoEmpty;
}
