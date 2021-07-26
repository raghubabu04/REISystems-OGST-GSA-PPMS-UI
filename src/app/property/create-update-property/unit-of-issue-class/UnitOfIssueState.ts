import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface UnitOfIssueState {
  showErrorAlert: boolean;
  verificationErrorMessage: string;
  unitOfIssue: string;
  quantity: string;
  originalAcqCost: string;
  totalAcqCost: string;
  unitOfIssueValidationMessage: string;
  quantityIsInvalid: boolean;
  quantityIsValid: boolean;
  quantityValidationMessage: string;
  originalAcqCostIsValid: boolean;
  originalAcqCostIsInvalid: boolean;
  originalAcqCostValidationMessage: string;
  unitOfIssueDefault: string;
  infoTipContent: string;
  accordianExpanded: boolean;
  accordingDisplay: string;
  unitOfIssueInvalid: boolean;
  unitOfIssueIsValid: boolean;
}

export const UnitOfIssueStateDefaults = {
  showErrorAlert: false,
  verificationErrorMessage: "",
  unitOfIssue: "EA",
  quantity: "",
  originalAcqCost: "",
  totalAcqCost: "",
  unitOfIssueValidationMessage: "Unit of Issue is Required.",
  quantityIsInvalid: false,
  quantityIsValid: false,
  quantityValidationMessage: "Quantity is Required.",
  originalAcqCostIsValid: false,
  originalAcqCostIsInvalid: false,
  originalAcqCostValidationMessage: "Original Acquisition Cost is Required.",
  unitOfIssueDefault: "EA (each)",
  infoTipContent:
    "Total Acquisition Cost = Quantity * Original Acquisition Cost (per Unit)",
  accordianExpanded: true,
  accordingDisplay: "show",
  unitOfIssueInvalid: false,
  unitOfIssueIsValid: false,
};

const vFields = ["quantityIsInvalid", "originalAcqCostIsInvalid"];

const eFields = ["quantity", "originalAcqCost"];

export function updateUnitOfIssueNav(
  newState: UnitOfIssueState,
  prevState: UnitOfIssueState
): void {
  const unitOfIssueInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const unitOfIssueEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.unitOfIssueInvalid = unitOfIssueInvalid;
  newState.unitOfIssueIsValid = !unitOfIssueInvalid && !unitOfIssueEmpty;
}
