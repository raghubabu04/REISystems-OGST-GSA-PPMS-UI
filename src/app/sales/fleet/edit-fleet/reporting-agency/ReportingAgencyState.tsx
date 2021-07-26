import { isEmptyCheck } from "../validations/fleetValidations";

export interface ReportingAgencyState {
  agencyName: string;
  agencyNameIsInvalid: boolean;
  addressLine1: string;
  addressLine1IsInvalid: boolean;
  addressLine2: string;
  city: string;
  cityIsInvalid: boolean;
  cityValidationMsg: string;
  state: string;
  stateIsInvalid: boolean;
  zip: string;
  zipIsValid: boolean;
  zipIsInvalid: boolean;
  zipValidationError: string;
  zipExtension: string;
  showConfirmUpdateModal: boolean;
  agencyId: string;
  reportingAgencyIsInvalid: boolean;
  reportingAgencyIsValid: boolean;
}

export const reportingAgencyStateDefault: ReportingAgencyState = {
  agencyName: "",
  agencyNameIsInvalid: false,
  addressLine1: "",
  addressLine1IsInvalid: false,
  addressLine2: "",
  city: "",
  cityIsInvalid: false,
  cityValidationMsg: "Reporting agency city is Required.",
  state: "",
  stateIsInvalid: false,
  zip: "",
  zipIsValid: true,
  zipIsInvalid: false,
  zipValidationError: "",
  zipExtension: "",
  showConfirmUpdateModal: false,
  agencyId: "",
  reportingAgencyIsInvalid: false,
  reportingAgencyIsValid: false,
};

const vFields = [
  "agencyNameIsInvalid",
  "addressLine1IsInvalid",
  "cityIsInvalid",
  "stateIsInvalid",
  "zipIsInvalid",
];

const eFields = ["agencyName", "addressLine1", "city", "state", "zip"];

export function updateReportingAgencyNav(
  newState: ReportingAgencyState,
  prevState: ReportingAgencyState
): void {
  const reportingAgencyIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const saleInformationIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.reportingAgencyIsInvalid = reportingAgencyIsInvalid;
  newState.reportingAgencyIsValid =
    !reportingAgencyIsInvalid && !saleInformationIsEmpty;
}
