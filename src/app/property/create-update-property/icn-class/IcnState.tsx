import moment from "moment";
import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface IcnState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  aacIsInvalid: boolean;
  aacIsValid: boolean;
  aacCode: string;
  aacValidationMessage: string;
  julianDate: string;
  julianDateValidationMessage: string;
  julianDateIsInvalid: boolean;
  julianDateIsValid: boolean;
  serialNum: string;
  suffix: string;
  serialIsInvalid: boolean;
  serialIsValid: boolean;
  serialValidationMessage: string;
  suffixIsInvalid: boolean;
  suffixIsValid: boolean;
  suffixValidationMessage: string;
  showIcnCodeValid: boolean;
  isIcnValid: boolean;
  icnVerificationMessage: string;
  disableAAC: boolean;
  disableJulianDate: boolean;
  disableSerialNumber: boolean;
  disableSuffix: boolean;
  disableIcnConfirmButton: boolean;
  showBarcodeModal: boolean;
  icnIsInvalid: boolean;
  icnIsValid: boolean;
}

export const getJulianDate = () => {
  let now = moment(new Date());
  let day = now.dayOfYear().toString();
  //padding leading zero
  while (day.length < 3) day = "0" + day;
  let lastYearDigit = now.year().toString().substr(3);
  return lastYearDigit + day;
};

export const IcnStateDefault = {
  accordianExpanded: true,
  accordingDisplay: "show",
  aacIsInvalid: false,
  aacIsValid: false,
  aacCode: "",
  aacValidationMessage: "Is Required",
  julianDate: getJulianDate(),
  julianDateValidationMessage: "Is Required",
  julianDateIsInvalid: false,
  julianDateIsValid: false,
  serialNum: "",
  suffix: "",
  serialIsInvalid: false,
  serialIsValid: false,
  serialValidationMessage: "Is Required",
  suffixIsInvalid: false,
  suffixIsValid: false,
  suffixValidationMessage: "Suffix cannot have special characters",
  showIcnCodeValid: false,
  isIcnValid: false,
  icnVerificationMessage: "",
  disableAAC: false,
  disableJulianDate: false,
  disableSerialNumber: false,
  disableSuffix: false,
  disableIcnConfirmButton: false,
  showBarcodeModal: false,
  icnIsInvalid: false,
  icnIsValid: false,
};

const vFields = [
  "aacIsInvalid",
  "julianDateIsInvalid",
  "serialIsInvalid",
  "suffixIsInvalid",
];

const efields = ["aacCode", "serialNum", "julianDate"];

export function updateIcnNav(newState: IcnState, prevState: IcnState): void {
  const icnIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const icnInfoEmpty: boolean = efields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.icnIsInvalid = icnIsInvalid;
  newState.icnIsValid = !icnIsInvalid && !icnInfoEmpty;
}
