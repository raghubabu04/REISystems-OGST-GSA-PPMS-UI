import { UserUtils } from "../../../../utils/UserUtils";
import {
  condition,
  demilitarization,
  dropAfterInternalScreening,
  dropAfterInternalScreeningDisabled,
  flightSafety,
  hazardous,
} from "../constants/Constants";
import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface AdditionalInfoState {
  fairMarketValue: string;
  fairMarketValueSave: number;
  fairMarketValueIsRequired: boolean;
  fairMarketValueIsValid: boolean;
  fairMarketValueIsInValid: boolean;
  fairMarketValueMsg: string;
  fairMarketValueTooltip: string;
  condition: string;
  conditionIsValid: boolean;
  conditionIsInValid: boolean;
  conditionOptions: any[];
  conditionErrorMsg: string;
  hazardous: string;
  hazardousErrorMsg: string;
  demilitarization: string;
  manufacturer: string;
  manufacturerIsValid: false;
  manufacturerIsInValid: false;
  manufacturerValueMsg: string;
  fightSafetyCriticalAircraftPart: string;
  dateOfManufacture: Date;
  dateOfManufactureIsRequired: boolean;
  dateOfManufactureIsValid: false;
  dateOfManufactureIsInValid: false;
  dateOfManufactureMsg: string;
  acquisitionDate: Date;
  acquisitionDateIsRequired: boolean;
  acquisitionDateMsg: string;
  acquisitionDateIsInvalid: boolean;
  surplusReleaseDate: Date;
  excessReleaseDate: Date;
  excessReleaseDateIsInvalid: false;
  excessReleaseEndDate: Date;
  excessReleaseDateValidationMsg: string;
  propertyDescription: string;
  propertyDescriptionIsInvalid: boolean;
  propertyDescriptionErrorMsg: string;
  validationMessage: string;
  isValid: boolean;
  isInvalid: boolean;
  triggerValidation: boolean;
  accordianExpanded: boolean;
  accordingDisplay: string;
  manufactureIsRequired: boolean;
  modalShowSRD: boolean;
  modalShowERD: boolean;
  requestedSurplusReleaseDate: Date;
  requestedSurplusReleaseDateJustification: string;
  requestSRDJustificationIsInvalid: boolean;
  changeRequestId: number;
  changeRequestIdSubmitted: boolean;
  dropAfterInternalScreening: boolean;
  dropAfterInternalScreeningFlag: string;
  isDropAfterInternalScreeningRequired: boolean;
  requestedExcessReleaseDate: Date;
  requestedExcessReleaseDateJustification: string;
  requestERDJustificationIsInvalid: boolean;
  changeRequestERDId: number;
  changeRequestERDIdSubmitted: boolean;
  justificationERDErrorMsg: string;
  justificationERDIsInvalid: boolean;
  justificationERDIsValid: boolean;
  justificationSRDIsInvalid: boolean;
  justificationSRDErrorMsg: string;
  justificationSRDIsValid: boolean;
  srdOnModalIsInvalid: boolean;
  srdOnModalIsValid: boolean;
  srdOnModalErrorMsg: string;
  erdOnModalIsInvalid: boolean;
  erdOnModalIsValid: boolean;
  erdOnModalErrorMsg: string;
  screeningDays: number;
  isNotAllowedToRequest: boolean;
  disableSaveBtn: boolean;
  hazardousOptions: any[];
  flightSafetyOptions: any[];
  dropAfterInternalScreeningOptions: any[];
  dropAfterInternalScreeningDisabledOptions: any[];
  demilitarizationOptions: any[];
  demilitarizationIsInvalid: boolean;
  demilitarizationlIsValid: boolean;
  demilitarizationErrorMsg: string;
  additionalInfoInvalid: boolean;
  additionalInfoValid: boolean;
}

export const AdditionalInfoStateDefault: AdditionalInfoState = {
  accordianExpanded: true,
  accordingDisplay: "show",
  fairMarketValue: "",
  fairMarketValueSave: null,
  fairMarketValueIsRequired: false,
  fairMarketValueIsValid: false,
  fairMarketValueIsInValid: false,
  fairMarketValueMsg: "Fair Market Value is Required.",
  condition: "",
  conditionOptions: condition,
  conditionIsValid: false,
  conditionIsInValid: false,
  conditionErrorMsg: "Property Condition must be selected.",
  hazardous: "N",
  hazardousOptions: hazardous,
  hazardousErrorMsg: "Hazardous must be selected.",
  demilitarization: "A",
  manufacturer: "",
  manufacturerIsValid: false,
  manufacturerIsInValid: false,
  manufacturerValueMsg: "Manufacturer is Required.",
  fightSafetyCriticalAircraftPart: "B",
  flightSafetyOptions: flightSafety,
  dateOfManufacture: null,
  dateOfManufactureIsRequired: false,
  dateOfManufactureIsValid: false,
  dateOfManufactureIsInValid: false,
  dateOfManufactureMsg: "Date of Manufacture is Required.",
  acquisitionDate: null,
  acquisitionDateIsRequired: false,
  acquisitionDateIsInvalid: false,
  acquisitionDateMsg: "",
  surplusReleaseDate: null,
  excessReleaseDate: null,
  excessReleaseDateIsInvalid: false,
  excessReleaseEndDate: null,
  excessReleaseDateValidationMsg: "",
  propertyDescription: "",
  propertyDescriptionIsInvalid: false,
  propertyDescriptionErrorMsg: "Property Description is Required.",
  validationMessage: "",
  isValid: true,
  isInvalid: false,
  triggerValidation: false,
  manufactureIsRequired: false,
  fairMarketValueTooltip: "Contact the APO/ Zone Sales office",
  modalShowSRD: false,
  modalShowERD: false,
  requestedSurplusReleaseDate: null,
  requestedSurplusReleaseDateJustification: "",
  requestSRDJustificationIsInvalid: false,
  changeRequestId: null,
  changeRequestIdSubmitted: false,
  dropAfterInternalScreening: false,
  dropAfterInternalScreeningFlag: "",
  isDropAfterInternalScreeningRequired: true,
  requestedExcessReleaseDate: null,
  requestedExcessReleaseDateJustification: "",
  requestERDJustificationIsInvalid: false,
  changeRequestERDId: null,
  changeRequestERDIdSubmitted: false,
  justificationERDErrorMsg: "",
  justificationERDIsInvalid: false,
  justificationSRDIsInvalid: false,
  justificationSRDErrorMsg: "",
  justificationERDIsValid: false,
  justificationSRDIsValid: false,
  srdOnModalIsInvalid: false,
  srdOnModalIsValid: false,
  srdOnModalErrorMsg: "",
  erdOnModalIsInvalid: false,
  erdOnModalIsValid: false,
  erdOnModalErrorMsg: "",
  screeningDays: 0,
  isNotAllowedToRequest: false,
  disableSaveBtn: false,
  dropAfterInternalScreeningOptions: dropAfterInternalScreening,
  dropAfterInternalScreeningDisabledOptions: dropAfterInternalScreeningDisabled,
  demilitarizationOptions: demilitarization,
  demilitarizationIsInvalid: false,
  demilitarizationlIsValid: false,
  demilitarizationErrorMsg: "",
  additionalInfoInvalid: false,
  additionalInfoValid: false,
};

const vFields = [
  "conditionIsInValid",
  "manufacturerIsInValid",
  "dateOfManufactureIsInValid",
  "acquisitionDateIsInvalid",
  "propertyDescriptionIsInvalid",
  "demilitarizationIsInvalid",
  "srdOnModalIsInvalid",
  "dateOfManufactureIsInValid",
];

const eFields = ["condition", "propertyDescription"];

export function updateAdditionalInfoNav(
  newState: AdditionalInfoState,
  prevState: AdditionalInfoState
): void {
  const additionalInfoInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });

  const additionalInfoEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  let srdEmpty: boolean = false;
  if (!UserUtils.isSalesUser()) {
    srdEmpty =
      newState["surplusReleaseDate"] !== undefined
        ? isEmptyCheck(newState["surplusReleaseDate"])
        : isEmptyCheck(prevState["surplusReleaseDate"]);
  }

  newState.additionalInfoInvalid = additionalInfoInvalid;
  newState.additionalInfoValid =
    !additionalInfoInvalid && !additionalInfoEmpty && !srdEmpty;
}
