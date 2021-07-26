import { cloneDeep } from "lodash";
import { FSCModel } from "./FSCModel";
import {
  makeRequiredCodeList,
  manufactureDateRequiredCodeList,
  manufactureRequiredCodeList,
  modelRequiredCodeList,
  valueAddedServicesOptions,
} from "../../constants/Constants";
import { isEmptyCheck } from "../../validations/propertyFieldValidations";

export interface FSCState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  niin: string;
  niinInvalid: boolean;
  niinValid: boolean;
  niinValidationMessage: string;
  fscOptions: any;
  fsc: FSCModel;
  fcsSelectedValue: string;
  fcsSelectedValues: any;
  specialDescriptionCode: string;
  specialDescriptionText: string;
  federalSalesCenter: string;
  data: {
    fscCode: string;
    fscCategory: string;
  };
  itemName: string;
  make: string;
  model: string;
  modelMsg: string;
  modelValid: boolean;
  modelInvalid: boolean;
  modelIsRequired: boolean;
  isOver50feet: boolean;
  modelRequiredCodeList: string[];
  manufactureRequiredCodeList: string[];
  manufactureDateRequiredCodeList: string[];
  makeMsg: string;
  makeValid: boolean;
  makeInvalid: boolean;
  makeIsRequired: boolean;
  makeRequiredCodeList: string[];
  itemNameMsg: string;
  itemNameValid: boolean;
  itemNameInvalid: boolean;
  itemNameIsRequired: boolean;
  specialDescriptionCodeMsg: string;
  specialDescriptionCodeValid: boolean;
  specialDescriptionCodeInvalid: boolean;
  specialDescriptionCodeIsRequired: boolean;
  specialDescriptionTextMsg: string;
  specialDescriptionTextValid: boolean;
  specialDescriptionTextInvalid: boolean;
  specialDescriptionTextIsRequired: boolean;
  quantity: string;
  fairMarketValue: string;
  fairMarketValueIsRequired: boolean;
  fairMarketValueIsValid: boolean;
  fairMarketValueIsInValid: boolean;
  fairMarketValueMsg: string;
  manufacturer: string;
  manufactureIsRequired: boolean;
  fightSafetyCriticalAircraftPart: string;
  dateOfManufacture: string;
  dateOfManufactureIsRequired: boolean;
  dateOfManufactureMsg: string;
  acquisitionDate: string;
  acquisitionDateIsRequired: boolean;
  acquisitionDateMsg: string;
  acquisitionDateIsInvalid: boolean;
  surplusReleaseDate: string;
  propertyDescription: string;
  validationMessage: string;
  isValid: boolean;
  isInvalid: boolean;
  triggerValidation: boolean;
  aacCode: string;
  agencyCode: string;
  isSalesCenterValid: boolean;
  isSalesCenterInvalid: boolean;
  salesCenterValidationMessage: string;
  isSalesCenterdisabled: boolean;
  isDisabled: boolean;
  specialInstructions: string;
  specialInstructionsOptions: any[];
  valueAddedServicesOptions: any[];
  isValueAddedServiceInValid: boolean;
  valueAddedServiceValidationMsg: string;
  valueAddedServices: string;
  trailerInvalid: boolean;
  fscInfoInvalid: boolean;
  fscInfoValid: boolean;
  validateFscSection: boolean;
  vehicleInvalid: boolean;
  airCraftInvalid: boolean;
  computerInvalid: boolean;
  vesselInvalid: boolean;
  weaponInvalid: boolean;
}

export const FSCStateDefaultsOrigin: FSCState = {
  accordianExpanded: true,
  accordingDisplay: "show",
  niin: "",
  niinInvalid: false,
  niinValid: false,
  niinValidationMessage: "",
  fscOptions: [],
  fsc: new FSCModel(),
  fcsSelectedValue: "G",
  fcsSelectedValues: [],
  itemName: "",
  make: "",
  model: "",
  modelMsg: "Model must be entered",
  modelValid: false,
  modelInvalid: false,
  modelIsRequired: false,
  modelRequiredCodeList: modelRequiredCodeList,
  manufactureRequiredCodeList: manufactureRequiredCodeList,
  manufactureDateRequiredCodeList: manufactureDateRequiredCodeList,
  isOver50feet: false,
  makeMsg: "Make must be entered",
  makeValid: false,
  makeInvalid: false,
  makeIsRequired: false,
  makeRequiredCodeList: makeRequiredCodeList,
  itemNameMsg: "Item Name must be entered",
  itemNameValid: false,
  itemNameInvalid: false,
  itemNameIsRequired: true,
  specialDescriptionCodeMsg: "",
  specialDescriptionCodeValid: false,
  specialDescriptionCodeInvalid: false,
  specialDescriptionCodeIsRequired: false,
  specialDescriptionTextMsg: "",
  specialDescriptionTextValid: false,
  specialDescriptionTextInvalid: false,
  specialDescriptionTextIsRequired: false,
  specialDescriptionCode: "",
  specialDescriptionText: "",
  federalSalesCenter: "",
  data: {
    fscCode: "",
    fscCategory: "",
  },
  quantity: "",
  fairMarketValue: "",
  fairMarketValueIsRequired: false,
  fairMarketValueIsValid: false,
  fairMarketValueIsInValid: false,
  fairMarketValueMsg: "Fair Market Value is required",
  manufacturer: "",
  fightSafetyCriticalAircraftPart: "",
  dateOfManufacture: "",
  manufactureIsRequired: false,
  dateOfManufactureIsRequired: false,
  dateOfManufactureMsg: "",
  acquisitionDate: "",
  acquisitionDateIsRequired: false,
  acquisitionDateIsInvalid: false,
  acquisitionDateMsg: "",
  surplusReleaseDate: "",
  propertyDescription: "",
  validationMessage: "",
  salesCenterValidationMessage: "",
  isValid: false,
  isInvalid: false,
  isSalesCenterValid: false,
  isSalesCenterInvalid: false,
  triggerValidation: false,
  aacCode: "",
  agencyCode: "",
  isSalesCenterdisabled: false,
  isDisabled: false,
  specialInstructions: "",
  valueAddedServicesOptions: valueAddedServicesOptions,
  isValueAddedServiceInValid: false,
  valueAddedServiceValidationMsg: "Value Added Service is required",
  valueAddedServices: "N",
  specialInstructionsOptions: [
    {
      value: "Contractor Inventory",
      id: "contractor-inventory",
      isSelected: false,
      isDisabled: false,
    },
    {
      value: "Overseas Inventory",
      id: "overseas-inventory",
      isSelected: false,
      isDisabled: false,
    },
  ],
  trailerInvalid: false,
  fscInfoInvalid: false,
  fscInfoValid: false,
  validateFscSection: false,
  vehicleInvalid: false,
  airCraftInvalid: false,
  computerInvalid: false,
  vesselInvalid: false,
  weaponInvalid: false,
};

export const FSCStateDefaults: FSCState = cloneDeep(FSCStateDefaultsOrigin);

const vFields = [
  "isInvalid",
  "niinInvalid",
  "modelInvalid",
  "makeInvalid",
  "itemNameInvalid",
  "trailerInvalid",
  "fairMarketValueIsInValid",
  "isSalesCenterInvalid",
  "acquisitionDateIsInvalid",
  "vehicleInvalid",
  "airCraftInvalid",
  "vesselInvalid",
  "computerInvalid",
  "weaponInvalid",
];

export function updateFSCNav(newState: FSCState, prevState: FSCState): void {
  let fscInfoInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });

  const fscInfoIsEmpty: boolean =
    newState?.data !== undefined
      ? isEmptyCheck(newState?.data?.fscCode)
      : isEmptyCheck(prevState?.data?.fscCode);

  newState.fscInfoInvalid = fscInfoInvalid;
  newState.fscInfoValid = !fscInfoInvalid && !fscInfoIsEmpty;
}
