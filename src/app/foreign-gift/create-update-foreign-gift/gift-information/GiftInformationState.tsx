import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";
import { buyOptions } from "../../../property/create-update-property/constants/Constants";
import { FSCState } from "../../../property/create-update-property/federal-supply-class/model/FSCState";
import { AdminState } from "../../administration/AdministrationState";

export interface GiftInformationState {
  giftInfoId: number;
  itemName: string;
  itemNameInvalid: boolean;
  itemNameMsg: string;
  interestedOptions: any[];
  wantToBuy: boolean;
  buyErrorMessage: string;
  fiscalYear: string;
  fiscalYearInvalid: boolean;
  fiscalYearMsg: string;

  fairMarketValue: string;
  fairMarketValueSave: number;
  fairMarketValueIsRequired: boolean;
  fairMarketValueIsValid: boolean;
  fairMarketValueIsInValid: boolean;
  fairMarketValueMsg: string;

  unitOfIssueDefault: string;
  unitOfIssue: string;

  accordianExpanded: boolean;
  accordingDisplay: string;
  propertyDescription: string;
  propertyDescriptionIsInvalid: boolean;
  propertyDescriptionErrorMsg: string;

  recipientReceivedDate: Date;
  isRecipientReceivedDateInvalid: boolean;
  recipientReceiveDateErrorMessage: string;
  restrictedItemSelectedValue: any;
  restrictedItemSelectedOptions: any[];

  restrictedItemInvalid: boolean;
  restrictedItemErrorMessage: string;
  vaultLocationSelectedValue: string;
  vaultLocationSelectedOptions: any[];
  vaultLocationInvalid: boolean;
  vaultLocationErrorMessage: string;

  vaultShelfNumber: string;
  vaultShelfNumberInvalid: boolean;
  vaultShelfNumberErrorMessage: string;

  upsetPrice: string;
  upsetPriceSave: number;
  upsetPriceInvalid: boolean;
  upsetPriceErrorMessage: string;

  dateReceivedByFGM: Date;
  dateReceivedByFGMInvalid: boolean;
  dateReceivedByFGMErrorMessage: string;
  showAdditionalFields: boolean;
  giftPropertyStatus: string;
  giftInfoInvalid: boolean;
  giftInfoValid: boolean;
  fscCode: string;
  fscInvalid: boolean;
  presidentName: string;
  presidentNameInvalid: boolean;
  workflow: string;
  dosApprovalDate: Date;
}

export const GiftInformationStateDefaults = {
  giftInfoId: null,
  itemName: "",
  itemNameMsg: "Item Name must be entered",
  itemNameInvalid: false,
  interestedOptions: buyOptions,
  wantToBuy: null,
  buyErrorMessage: "Does the recipient want to buy should be Yes or No",

  fairMarketValue: "",
  fairMarketValueSave: null,
  fairMarketValueIsRequired: false,
  fairMarketValueIsValid: false,
  fairMarketValueIsInValid: false,
  fairMarketValueMsg: "Fair Market Value is Required.",

  unitOfIssue: "EA",

  accordianExpanded: true,
  accordingDisplay: "show",
  unitOfIssueDefault: "EA (each)",
  fiscalYear: new Date().getFullYear().toString(),
  fiscalYearMsg: "Fiscal Year is Required.",
  fiscalYearInvalid: false,
  propertyDescription: "",
  propertyDescriptionIsInvalid: false,
  propertyDescriptionErrorMsg: "Property Description is Required.",
  recipientReceivedDate: null,
  isRecipientReceivedDateInvalid: false,
  recipientReceiveDateErrorMessage: "Date Received is Required",

  restrictedItemSelectedValue: null,
  restrictedItemSelectedOptions: [],
  restrictedItemInvalid: false,
  restrictedItemErrorMessage: "",

  vaultLocationSelectedValue: "",
  vaultLocationSelectedOptions: [],
  vaultLocationInvalid: false,
  vaultLocationErrorMessage: "Vault Location is Required",

  vaultShelfNumber: "",
  vaultShelfNumberInvalid: false,
  vaultShelfNumberErrorMessage: "Vault Shelf Number is Required",

  upsetPrice: "",
  upsetPriceSave: null,
  upsetPriceInvalid: false,
  upsetPriceErrorMessage: "Upset Price is Required",

  dateReceivedByFGM: null,
  dateReceivedByFGMInvalid: false,
  dateReceivedByFGMErrorMessage: "",
  showAdditionalFields: false,
  giftPropertyStatus: "",
  giftInfoInvalid: false,
  giftInfoValid: false,
  //added these properties for highlight functionality of left nav
  fscCode: "",
  fscInvalid: false,
  presidentName: "",
  presidentNameInvalid: false,
  workflow: "",
  dosApprovalDate: null,
};

const vFields = [
  "itemNameInvalid",
  "propertyDescriptionIsInvalid",
  "fairMarketValueIsInValid",
  "fiscalYearInvalid",
  "isRecipientReceivedDateInvalid",
  "presidentNameInvalid",
  "fscInvalid",
];

const eFields = [
  "itemName",
  "recipientReceivedDate",
  "propertyDescription",
  "fiscalYear",
  "fairMarketValueSave",
  "presidentName",
  "fscCode",
];

export function updateGiftInfoNav(
  newState: GiftInformationState,
  prevState: GiftInformationState
): void {
  const giftInfoInvalid = getGiftInfoInvalid(newState, prevState);

  const giftInfoInvalidForAdminWorkflow = getGiftInfoInvalidForAdminWorkflow(
    newState,
    prevState
  );

  const giftInfoEmpty = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.giftInfoInvalid = giftInfoInvalid || giftInfoInvalidForAdminWorkflow;
  newState.giftInfoValid = !giftInfoInvalid && !giftInfoEmpty;
}

export function getGiftInfoInvalid(
  newState: GiftInformationState,
  prevState: GiftInformationState
): boolean {
  return vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
}

const vFieldsAdminWorflow = [
  "vaultShelfNumberInvalid",
  "restrictedItemInvalid",
  "dateReceivedByFGMInvalid",
  "vaultLocationInvalid",
  "fairMarketValueIsInValid",
];

export function getGiftInfoInvalidForAdminWorkflow(
  newState: GiftInformationState,
  prevState: GiftInformationState
): boolean {
  const workflow =
    newState.workflow !== undefined ? newState.workflow : prevState.workflow;
  if (workflow === "APPROVE_FOREIGN_GIFT") {
    return vFieldsAdminWorflow.some((f) => {
      return newState[f] !== undefined ? newState[f] : prevState[f];
    });
  }
  return false;
}
