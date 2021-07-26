import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface SalesNotesState {
  salesNotes: string;
  salesNotesIsValid: boolean;
  salesNotesIsInvalid: boolean;
  salesNotesErrorMsg: string;
  validationMessage: string;
  isValid: boolean;
  isInvalid: boolean;
  triggerValidation: boolean;
  actionHistoryData?: any;
}

export const SalesNotesStateDefault: SalesNotesState = {
  salesNotes: "",
  salesNotesIsValid: false,
  salesNotesIsInvalid: false,
  salesNotesErrorMsg: "Sales Notes is Required.",
  validationMessage: "",
  isValid: true,
  isInvalid: false,
  triggerValidation: false,
  actionHistoryData: [],
};

const vFields = ["salesNotesIsInvalid"];

const eFields = ["salesNotes"];

export function updateSalesNotesNav(
  newState: SalesNotesState,
  prevState: SalesNotesState
): void {
  const salesNotesInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });

  const salesNotesEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });

  newState.salesNotesIsValid = !salesNotesInvalid && !salesNotesEmpty;
}
