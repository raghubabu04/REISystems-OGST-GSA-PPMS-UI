import { time } from "../../../management/transactions/constants/Constants";
import { isEmptyCheck } from "../validations/fleetValidations";

export interface LotInformationState {
  inspectionStartDate: string;
  inspectionStartDateValidationMessage: string;
  inspectionStartDateisInvalid: boolean;
  inspectionEndDate: string;
  inspectionEndDateValidationMessage: string;
  inspectionEndDateisInvalid: boolean;
  inspectionStartTime: string;
  inspectionStartTimeisInvalid: boolean;
  inspectionStartTimeIsValid: boolean;
  inspectionStartTimeValidationMessage: string;
  inspectionEndTime: string;
  inspectionEndTimeisInvalid: boolean;
  inspectionEndTimeIsValid: boolean;
  inspectionEndTimeValidationMessage: string;
  startTime: any[];
  endTime: any[];
  amPmStartTime: string;
  amPmEndTime: string;
  lotStatus: string;
  lotInformationIsInvalid: boolean;
  lotInformationIsValid: boolean;
}

export const lotInformationStateDefault: LotInformationState = {
  inspectionStartDate: "",
  inspectionStartDateisInvalid: false,
  inspectionStartDateValidationMessage: "",
  inspectionEndDate: "",
  inspectionEndDateisInvalid: false,
  inspectionEndDateValidationMessage: "",
  inspectionStartTime: "",
  inspectionStartTimeisInvalid: false,
  inspectionStartTimeIsValid: false,
  inspectionStartTimeValidationMessage: "",
  inspectionEndTime: "",
  inspectionEndTimeisInvalid: false,
  inspectionEndTimeIsValid: false,
  inspectionEndTimeValidationMessage: "",
  startTime: time(),
  endTime: time(),
  amPmStartTime: "AM",
  amPmEndTime: "AM",
  lotStatus: "",
  lotInformationIsInvalid: false,
  lotInformationIsValid: false,
};

const vFields = [
  "inspectionStartDateisInvalid",
  "inspectionEndDateisInvalid",
  "inspectionStartTimeisInvalid",
  "inspectionEndTimeisInvalid",
];

const eFields = [
  "inspectionStartDate",
  "inspectionEndDate",
  "inspectionStartTime",
  "inspectionEndTime",
];

export function updateLotInformationNav(
  newState: LotInformationState,
  prevState: LotInformationState
): void {
  const lotInformationIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const lotInformationIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.lotInformationIsInvalid = lotInformationIsInvalid;
  newState.lotInformationIsValid =
    !lotInformationIsInvalid && !lotInformationIsEmpty;
}
