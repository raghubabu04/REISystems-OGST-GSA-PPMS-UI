import { reportAgainOptions } from "../constants/Constants";

export interface ReportAgainState {
  copyAllData?: boolean;
  modalAacCode: string;
  modalJulianDate: string;
  modalSerialNumber: string;
  modalSuffix: string;
  julianDateValidationMessage: string;
  julianDateIsinvalid: boolean;
  julianDateisValid: boolean;
  serialNumberIsinvalid: boolean;
  serialNumberIsValid: boolean;
  serialNumerValidationMessage: string;
  suffixIsInvalid: boolean;
  suffixIsValid: boolean;
  suffixValidationMessage: string;
  optionValue: string;
  reportAgainOptions: any;
  optionsInvalid: false;
  icnVerificationMessage: string;
  icnValid: boolean;
}

export const ReportAgainStateDefault: ReportAgainState = {
  modalAacCode: "",
  modalJulianDate: "",
  modalSerialNumber: "",
  modalSuffix: "",
  julianDateValidationMessage: "",
  julianDateIsinvalid: false,
  julianDateisValid: false,
  serialNumberIsinvalid: false,
  serialNumberIsValid: false,
  serialNumerValidationMessage: "",
  suffixIsInvalid: false,
  suffixIsValid: false,
  suffixValidationMessage: "",
  optionValue: "",
  reportAgainOptions: reportAgainOptions,
  optionsInvalid: false,
  icnVerificationMessage: "",
  icnValid: true,
};
