import moment from "moment";
import { conditionOptions } from "../../../create-non-reported-property/constants/Constants";
import { yesOrNoOptions } from "../../constants/constants";

export interface ItemInformationState {
  selectedStateList: any[];
  selectedStateValues: any;
  statesOptions: any;
  stateIsInvalid: boolean;
  stateValidationMessage: string;
  statesIsRequired: boolean;
  fscOptions: any;
  fscIsRequired: boolean;
  fcsSelectedValues: any;
  fscCodeList: any;
  fscInvalid: boolean;
  fscIsValid: boolean;
  fscValidationMsg: string;
  condition: string;
  conditionOptions: any;
  searchIsRequired: boolean;
  searchInvalid: boolean;
  searchValidationMsg: string;
  conditionInvalid: boolean;
  conditionValidationMsg: string;
  conditionIsRequired: boolean;
  expirationDate: Date;
  expirationDateIsRequired: boolean;
  expirationDateMsg: string;
  expirationDateIsInvalid: boolean;
  searchType: string;
  searchOption: string;
  searchText: string;
  icn: string;
  icnInvalid: boolean;
  icnIsValid: boolean;
  icnIsRequired: boolean;
  icnValdiationMessage: string;
  reimbursementRequired: string;
  reimbursementIsRequired: boolean;
  wantListId: string;
  wantListName: string;
  wantListNameIsValid: boolean;
  wantListNameIsInvalid: boolean;
  wantListNameValidationMsg: string;
  fscSelectionLimit: any;
  stateSelectionLimit: any;
  itemNameIsDisabled: boolean;
  fscIsDisabaled: boolean;
  stateIsDisabled: boolean;
  yesOrNoOptions: any;
}

export const ItemInformationStateDefault: ItemInformationState = {
  selectedStateList: [],
  selectedStateValues: [],
  statesOptions: [],
  stateIsInvalid: false,
  stateValidationMessage: "",
  statesIsRequired: false,
  fscOptions: [],
  fcsSelectedValues: [],
  fscCodeList: [],
  fscInvalid: false,
  fscIsValid: false,
  fscIsRequired: false,
  fscValidationMsg: "",
  condition: "",
  conditionInvalid: false,
  conditionOptions: conditionOptions,
  conditionValidationMsg: "User must select a value.",
  conditionIsRequired: true,
  expirationDate: moment(new Date(Date.now())).add("180", "days").toDate(),
  expirationDateIsRequired: true,
  expirationDateIsInvalid: false,
  expirationDateMsg: "",
  searchType: "ALL_WORDS",
  searchOption: "All Words",
  searchText: "",
  searchIsRequired: false,
  searchInvalid: false,
  searchValidationMsg: "Item Name or Property Description is Required.",
  icn: "",
  icnInvalid: false,
  icnIsValid: false,
  icnIsRequired: false,
  icnValdiationMessage: "",
  reimbursementRequired: "N",
  reimbursementIsRequired: false,
  wantListId: "",
  wantListName: "",
  wantListNameIsValid: false,
  wantListNameIsInvalid: false,
  wantListNameValidationMsg: "",
  itemNameIsDisabled: false,
  fscIsDisabaled: false,
  stateIsDisabled: false,
  fscSelectionLimit: "",
  stateSelectionLimit: "",
  yesOrNoOptions: yesOrNoOptions,
};
