import { modalFeatureItemOptions } from "../../../management/transactions/constants/Constants";
import { fleetFscValues } from "../../constants/Constants";
import { isEmptyCheck } from "../validations/fleetValidations";

export interface ItemInformationState {
  itemControlNumber: string;
  itemName: string;
  fsc: string;
  unitOfIssue: string;
  quantity: string;
  unitPrice: string;
  unitPriceValidationMsg: string;
  unitPriceIsInvalid: boolean;
  upsetPrice: string;
  upsetPriceValidationMsg: string;
  upsetPriceIsInvalid: boolean;
  itemNameValidationMsg: string;
  itemNameIsInvalid: boolean;
  fscOptions: any;
  fcsSelectedValue: string;
  fcsSelectedValues: any;
  fscIsInvalid: boolean;
  fscIsValid: boolean;
  fscValidationMessage: string;
  fscTriggerValidation: boolean;
  startingPrice: string;
  startingPriceValidationMsg: string;
  startingPriceIsInvalid: boolean;
  modalFeatureItemOption: any[];
  featureItem: boolean;
  fscValues: any[];
  conditionOptions: any[];
  conditionCode: string;
  alcStation: string;
  appropriationFund: string;
  itemInformationIsInvalid: boolean;
  itemInformationIsValid: boolean;
  lotIsInPreviewOrActive: boolean;
}

export const itemInformationStateDefault: ItemInformationState = {
  itemControlNumber: "",
  itemName: "",
  fsc: "",
  unitOfIssue: "EA",
  quantity: "1",
  unitPrice: "",
  unitPriceValidationMsg: "",
  unitPriceIsInvalid: false,
  upsetPrice: "",
  upsetPriceValidationMsg: "",
  upsetPriceIsInvalid: false,
  itemNameValidationMsg: "",
  itemNameIsInvalid: false,
  fscOptions: [],
  fcsSelectedValue: "",
  fcsSelectedValues: [],
  fscIsInvalid: false,
  fscIsValid: false,
  fscValidationMessage: "",
  fscTriggerValidation: false,
  startingPrice: "",
  startingPriceValidationMsg: "",
  startingPriceIsInvalid: false,
  modalFeatureItemOption: modalFeatureItemOptions,
  featureItem: false,
  fscValues: fleetFscValues,
  conditionOptions: [
    {
      id: "1",
      longName: "Never Used",
      isSelected: false,
    },
    {
      id: "4",
      longName: "Usable/Good Condition",
      isSelected: false,
    },
    {
      id: "7",
      longName: "Repair Needed",
      isSelected: false,
    },
    {
      id: "S",
      longName: "Scrap",
      isSelected: false,
    },
    {
      id: "X",
      longName: "Salvage",
      isSelected: false,
    },
  ],
  conditionCode: "",
  alcStation: "47000016",
  appropriationFund: "47X4330",
  itemInformationIsInvalid: false,
  itemInformationIsValid: false,
  lotIsInPreviewOrActive: false,
};

const vFields = [
  "unitPriceIsInvalid",
  "upsetPriceIsInvalid",
  "itemNameIsInvalid",
  "startingPriceIsInvalid",
];

const eFields = ["unitPrice", "upsetPrice", "itemName", "startingPrice"];

export function updateItemInformationNav(
  newState: ItemInformationState,
  prevState: ItemInformationState
): void {
  const itemInformationIsValid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const itemInformationIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.itemInformationIsInvalid = itemInformationIsValid;
  newState.itemInformationIsValid =
    !itemInformationIsValid && !itemInformationIsEmpty;
}
