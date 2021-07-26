import {
  conditionOptions,
  personalPropertyCenterOptions,
} from "../constants/Constants";

export interface ItemInformationState {
  sourceCodeInvalid: boolean;
  sourceCodeValidationMsg: string;
  sourceCode: string;
  fscOptions: any;
  fcsSelectedValue: string;
  fcsSelectedValues: any;
  fscIsInvalid: boolean;
  fscIsValid: boolean;
  fscValidationMessage: string;
  fscTriggerValidation: boolean;
  itemName: string;
  itemNameValidationMsg: string;
  itemNameIsInvalid: boolean;
  condition: string;
  conditionOptions: any;
  conditionInvalid: boolean;
  conditionValidationMsg: string;
  personalPropertyCenterOptions: any;
  personalPropertyCenter: string;
  unitOfIssue: string;
  unitOfIssueOptions: any;
  unitOfIssueValidationMsg: string;
  unitOfIssueIsInvalid: boolean;
  quantity: string;
  quantityValidationMsg: string;
  quantityIsInvalid: boolean;
  unitCost: string;
  unitCostValidationMsg: string;
  unitCostIsInvalid: boolean;
  totalAcqCost: string;
}

export const ItemInformationStateDefault = {
  sourceCodeInvalid: false,
  sourceCodeValidationMsg: "User must select a value from the drop down",
  sourceCode: "",
  fscOptions: [],
  fcsSelectedValue: "",
  fcsSelectedValues: [],
  fscIsInvalid: false,
  fscIsValid: false,
  fscValidationMessage: "",
  fscTriggerValidation: false,
  itemName: "",
  itemNameValidationMsg: "",
  itemNameIsInvalid: false,
  conditionInvalid: false,
  conditionOptions: conditionOptions,
  conditionValidationMsg: "Condition is Required.",
  personalPropertyCenterOptions: personalPropertyCenterOptions,
  unitOfIssueOptions: [],
  quantity: "",
  condition: "",
  personalPropertyCenter: "",
  quantityValidationMsg: "",
  quantityIsInvalid: false,
  unitOfIssueValidationMsg: "",
  unitOfIssueIsInvalid: false,
  unitOfIssue: "EA",
  unitCost: "",
  unitCostValidationMsg: "",
  unitCostIsInvalid: false,
  totalAcqCost: "",
};
