import moment from "moment";

import { PropertyApiService } from "../../../../api-kit/property/property-api-service";
import { ERDRequestDTO } from "../../../models/ERDRequestDTO";
import { SRDRequestsDTO } from "../../../models/SRDRequestDTO";
import { restrictedFSCCode } from "../constants/Constants";
import { PropertyInfoStateDefault } from "../property-info-class/PropertyInfoState";

export function isEmptyCheck(val) {
  return !val || 0 === val.length;
}

export function getFormattedICN(icn) {
  return icn.length <= 14
    ? icn.replace(/(.{6})(.{4})(.{4})/, "$1-$2-$3")
    : icn.replace(/(.{6})(.{4})(.{4})(.+)/, "$1-$2-$3-$4");
}

// test for regex - alphabets, number , space and hypen

export function validateFSCVehicleProperties({ id, value, name }): string {
  //test for mandatory field
  if (isEmptyCheck(value)) {
    return name + " is Required";
  } else if (
    // test for number
    ["estimatedMileage", "modelYear"].indexOf(id) + 1 &&
    isNaN(value)
  ) {
    return name + " can accept only numbers.";
  } else if (id === "vin") {
    return validateVin(value);
  } else return "";
}

export function validateAgencyClass(value, name, fscVehicleState): string {
  if (
    fscVehicleState.validationMessage["agencyClassRequired"] &&
    isEmptyCheck(value)
  ) {
    return name + " is required";
  } else if (!isEmptyCheck(value) && value.length !== 3) {
    return "Agency Class must be 3 characters.";
  } else if (
    !isEmptyCheck(value) &&
    !/^([A-z][A-z0-9]*[A-z0-9]*)$/.test(value)
  ) {
    return "First Character must be A through Z and second and third character could be 0 to 9 or A through Z. No special Character allowed.";
  }
}

export function validateTag(value, name, fscVehicleState): string {
  if (
    fscVehicleState.validationMessage["isTagRequired"] &&
    isEmptyCheck(value)
  ) {
    return name + " is required";
  } else if (!isEmptyCheck(value) && value.length !== 5) {
    return "Tag must be 5 characters.";
  }
}

export function validateModelYear(value): string {
  if (/^[^0-9]+$/.test(value)) {
    return "Model Year can contain only numbers.";
  }
  if (value < 1900 || value > new Date().getFullYear())
    return "Model Year must be between 1900-current year.";
}

export function validateFiscalYear(value, currentfiscalYear) {
  let fiscalYear = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(fiscalYear)) {
    validation.isInvalid = true;
    validation.validationError = "Fiscal Year is required";
  } else if (fiscalYear.trim().length < 4 || !/^\d+$/.test(fiscalYear.trim())) {
    validation.isInvalid = true;
    validation.validationError = "Enter a valid fiscal year";
  } else if (value > currentfiscalYear) {
    validation.isInvalid = true;
    validation.validationError = "Fiscal Year should not be future Fiscal Year";
  }
  return validation;
}

export function validateCommonItemName(value: string) {
  let itemName = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(itemName)) {
    validation.isInvalid = true;
    validation.validationError = "Item Name is required";
  } else if (itemName.length < 4) {
    validation.isInvalid = true;
    validation.validationError = "Enter a valid item name.";
  }
  return validation;
}

export function validateTitle(value: any, name: string) {
  let title = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(title)) {
    validation.isInvalid = true;
    validation.validationError = name + " Title is required";
  }
  return validation;
}

export function validateCompanyName(value: any, isRequired) {
  let companyName = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(companyName)) {
    validation.isInvalid = true;
    validation.validationError = "Appraisal Company Name is required.";
  }
  return validation;
}

export function validateCommonModel(value: string, required: boolean) {
  let model = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^[-a-zA-Z0-9 ]+$/.test(model) && !isEmptyCheck(model)) {
    validation.isInvalid = true;
    validation.validationError =
      "Model can have only alphabets,numeric,space & hyphen. Other Special Characters are Not Allowed.";
  }
  if (isEmptyCheck(model) && required) {
    validation.isInvalid = true;
    validation.validationError = "Model is required.";
  }
  return validation;
}

export function validateCommonMake(value: string, required: boolean) {
  let make = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^[-a-zA-Z0-9 ]+$/.test(make) && !isEmptyCheck(make)) {
    validation.isInvalid = true;
    validation.validationError =
      "Make can have only alphabets,numeric,space & hyphen. Other Special Characters are Not Allowed";
  }
  if (isEmptyCheck(make) && required) {
    validation.isInvalid = true;
    validation.validationError = "Make is required";
  }
  return validation;
}

export function validateVin(value) {
  if (!value) {
    return "VIN number is required";
  }
  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    return "Special characters are not allowed in VIN";
  }
  if (value?.length < 11) {
    return "First eleven characters must be filled in VIN";
  }
}

/*End of validations for FSC-vehicle */

/* Validations for FSC-Weapons */
let notAllowedStrings = [
  ":",
  "#",
  ".",
  "NO:",
  "SER:",
  "SER NO:",
  "SL NO:",
  "SL NO",
  "SL-NO:",
  "SL-NO",
  "SERIAL NO:",
];

export function validateWeaponSerialNumber(value: string) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!isEmptyCheck(value)) {
    for (let i = 0; i < notAllowedStrings.length; i++) {
      if (value.toUpperCase().includes(notAllowedStrings[i])) {
        validation.isInvalid = true;
        validation.validationError =
          "Serial Number should not contain ':', '#', '.', 'NO:', 'SER:', 'SER NO:', 'SL NO:', 'SL NO', 'SL-NO:', 'SL-NO', 'SERIAL NO:' for this FSC.";
        break;
      }
    }
  } else {
    validation.isInvalid = true;
    validation.validationError = "Serial Number is Required";
  }

  return validation;
}

export function validateWeaponSelection(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (value?.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Weapon Selection is required";
  }
  return validation;
}

/* Validations for Unit of issue */
export function unitOfIssueValidation(unitCode) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (unitCode) {
    validation.isInvalid = false;
    validation.validationError = "Unit of issue is required";
  }
  return validation;
}

export function validateQuantityField(value, fscCode) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (
    !/^\d+$/.test(value) ||
    parseInt(value) < 1 ||
    value.length === 0 ||
    isNaN(value)
  ) {
    if (value.length === 0) {
      validation.isInvalid = true;
      validation.validationError = "Quantity is required";
    } else if (/^[^0-9]+$/.test(value) || isNaN(value)) {
      validation.isInvalid = true;
      validation.validationError = "Quantity can contain only numbers";
    } else if (/^[0]*$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError = "Quantity must be greater than zero";
    }
  } else if (parseInt(value) > 1 && restrictedFSCCode.includes(fscCode)) {
    validation.isInvalid = true;
    validation.validationError = "Quantity cannot be more than 1 for this FSC";
  }
  return validation;
}

export function validateOriginalAcqCostField(value) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!/^[1-9]*$/.test(value) || !/^\d+$/.test(value)) {
    if (value.length === 0 || (value.length === 1 && value.includes("$"))) {
      validation.isInvalid = true;
      validation.validationError = "Original Acquisition Cost is required";
    } else if (/^[^0-9]+$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError =
        "Original acquisition cost must be numeric only.";
    } else if (/^[0]*$/.test(value) || /^[$][0]*$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError =
        "Original acquisition cost must be greater than zero.";
    }
    return validation;
  }
}

/*End of Validations for Unit of issue */

export function validateCurrency(amount) {
  return /^\d+(\.\d{1,2})?$/.test(amount);
}

export function beforeToday(dateToBeValidated) {
  return new Date(dateToBeValidated).toDateString < new Date().toDateString;
}

export function validateManufacturer(value, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Manufacturer is required";
    return validation;
  }
  return validation;
}

export function validateManufacturerDate(
  value,
  isRequired,
  acquisitionDate,
  updateAdditionalInfoState
) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = "Date of Manufacture is required";
    return validation;
  } else if (
    value &&
    value?.length > 0 &&
    !moment(value, "MM/DD/YYYY", true).isValid()
  ) {
    validation.isInvalid = true;
    validation.validationError = "Invalid date format.";
  } else if (
    moment(value, "yyyy-MM-dd") >
    moment(new Date(Date.now()), "yyyy-MM-dd").subtract("1", "days")
  ) {
    validation.validationError =
      "Date of Manufacture cannot be today or future date.";
    validation.isInvalid = true;
  } else if (acquisitionDate !== null && value !== null) {
    let dateOfAcquisition = moment(acquisitionDate, "yyyy-MM-dd");
    let manufactureDate = moment(value, "yyyy-MM-dd");

    if (manufactureDate > dateOfAcquisition) {
      validation.validationError =
        "Date of Manufacture must be before Acquisition date";
      validation.isInvalid = true;
    } else if (
      dateOfAcquisition <
      moment(new Date(Date.now()), "yyyy-MM-dd").subtract("1", "days")
    ) {
      updateAdditionalInfoState({
        acquisitionDateIsInvalid: false,
        acquisitionDateIsValid: true,
        acquisitionDateMsg: "",
      });
    }
  }
  return validation;
}

export function validateFairMarketValue(id, name, value, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (isEmptyCheck(value) && isRequired) {
    validation.isInvalid = true;
    validation.validationError = name + " is required";
    return validation;
  }
  return validation;
}

export function validatePropTYpe(agencyBureau, propTypeValue) {
  let validation: Validation = new Validation();
  if (
    ((agencyBureau && agencyBureau.startsWith("18")) ||
      (agencyBureau && agencyBureau.startsWith("99"))) &&
    !(
      propTypeValue === "NA" ||
      propTypeValue === "TS" ||
      propTypeValue === "WM" ||
      propTypeValue === "ES"
    )
  ) {
    validation.isInvalid = true;
    validation.validationError =
      "Property Type has to be one of 'NA', 'TS', 'WM' or 'ES'";
  }
  return validation;
}

export function validateACN(
  agencyBureau,
  agencyControlNumber,
  fscCode,
  acnValue
) {
  let validation = {
    isACNInvalid: false,
    acnvalidationError: "",
    isFscInvalid: false,
    fscValidationError: "",
  };

  if (
    agencyBureau &&
    agencyBureau.startsWith("89") &&
    acnValue !== "" &&
    !(
      acnValue === "ERLE" ||
      acnValue.startsWith("ERLE") ||
      acnValue === "LEDP" ||
      acnValue.startsWith("LEDP") ||
      acnValue === "HR" ||
      acnValue.startsWith("HR") ||
      acnValue === "ED" ||
      acnValue.startsWith("ED") ||
      acnValue === "NA" ||
      acnValue.startsWith("NA") ||
      acnValue === "LOCAL" ||
      acnValue.startsWith("LOCAL")
    )
  ) {
    validation.isACNInvalid = true;
    validation.acnvalidationError =
      "Agency Control Number must begin: 'ERLE', 'LEDP', 'HR', 'ED', 'NA' or 'LOCAL'";
  }
  if (
    fscCode &&
    Number(fscCode) >= 6600 &&
    agencyBureau &&
    Number(fscCode) <= 6699 &&
    agencyBureau.startsWith("89") &&
    !(acnValue.startsWith("ERLE") || acnValue.startsWith("LEDP"))
  ) {
    validation.isACNInvalid = true;
    validation.acnvalidationError =
      "ERLE item: Agency Control Number must be 'ERLE' or 'LEDP' only";
  }
  if (
    acnValue &&
    (acnValue.startsWith("ERLE") || acnValue.startsWith("LEDP")) &&
    fscCode &&
    !fscCode.startsWith("66")
  ) {
    validation.isFscInvalid = true;
    validation.fscValidationError =
      "For ERLE/LEDP items - FSC must begin with '66'";
  }
  return validation;
}

export function validateFSC(agencyControlNumber, fscCode, agencyBureau) {
  let validation = {
    isACNInvalid: false,
    acnvalidationError: "",
    isFscInvalid: false,
    fscValidationError: "",
  };

  if (fscCode === "") {
    validation.isFscInvalid = true;
    validation.fscValidationError =
      "Federal Supply Class / National Stock Number is required";
  }
  //validation on ACN field on selection of FSC

  if (
    agencyControlNumber &&
    !(
      agencyControlNumber.startsWith("ERLE") ||
      agencyControlNumber.startsWith("LEDP")
    ) &&
    fscCode &&
    Number(fscCode) >= 6600 &&
    Number(fscCode) <= 6699 &&
    agencyBureau.startsWith("89")
  ) {
    validation.isACNInvalid = true;
    validation.acnvalidationError =
      "ERLE item: Agency Control Number must be 'ERLE' or 'LEDP' only";
  }
  //validation on ACN field on removal of FSC
  else if (
    agencyBureau &&
    agencyBureau.startsWith("89") &&
    agencyControlNumber !== "" &&
    !(
      agencyControlNumber === "ERLE" ||
      agencyControlNumber.startsWith("ERLE") ||
      agencyControlNumber === "LEDP" ||
      agencyControlNumber.startsWith("LEDP") ||
      agencyControlNumber === "HR" ||
      agencyControlNumber.startsWith("HR") ||
      agencyControlNumber === "ED" ||
      agencyControlNumber.startsWith("ED") ||
      agencyControlNumber === "NA" ||
      agencyControlNumber.startsWith("NA") ||
      agencyControlNumber === "LOCAL" ||
      agencyControlNumber.startsWith("LOCAL")
    )
  ) {
    validation.isACNInvalid = true;
    validation.acnvalidationError =
      "Agency Control Number must begin: 'ERLE', 'LEDP', 'HR', 'ED', 'NA' or 'LOCAL'";
  }

  if (
    agencyControlNumber &&
    (agencyControlNumber.startsWith("ERLE") ||
      agencyControlNumber.startsWith("LEDP")) &&
    fscCode &&
    !fscCode.startsWith("66")
  ) {
    validation.isFscInvalid = true;
    validation.fscValidationError =
      "For ERLE/LEDP items - FSC must begin with '66'";
  }
  return validation;
}

/*export function validateALCByPropType(propTypes, agencyLocationCode) {
  let validation: Validation = new Validation();
  if ( propTypes === "NR" && !agencyLocationCode) {
    validation.isInvalid = true;
    validation.validationError = "Agency Location Code is Required";
  } else {
    validation.isInvalid = false;
    validation.validationError = "";
  }
  return validation;
}*/
export function validateALCnChangeOfReimbersement(
  amountTobeReimbursed,
  agencyLocationCode
) {
  let validation: Validation = new Validation();
  if (amountTobeReimbursed && !agencyLocationCode) {
    validation.isInvalid = true;
    validation.validationError = "Agency Location Code is required";
  } else {
    validation.isInvalid = false;
    validation.validationError = "";
  }
  return validation;
}

export function validateAmountToBeReimbersed(
  isAppropriationTasRequired: boolean,
  amountTobeReimbursed: string
) {
  let validation: Validation = new Validation();
  if (isAppropriationTasRequired && isEmptyCheck(amountTobeReimbursed)) {
    validation.isInvalid = true;
    validation.validationError = PropertyInfoStateDefault.afcReqMsg;
  } else {
    validation.isInvalid = false;
    validation.validationError = "";
  }
  return validation;
}

export function validateALOnChangeOfALC(
  isAlcRequired: boolean,
  agencyLocationCode: string
) {
  let validation: Validation = new Validation();
  if (isAlcRequired && isEmptyCheck(agencyLocationCode)) {
    validation.isInvalid = true;
    validation.validationError = PropertyInfoStateDefault.alcValidationMessage;
  } else if (isAlcRequired && agencyLocationCode.length < 8) {
    validation.isInvalid = true;
    validation.validationError =
      PropertyInfoStateDefault.alcValidationLengthMessage;
  } else {
    validation.isInvalid = false;
    validation.validationError = "";
  }
  if (
    !/^[0-9]+$/.test(agencyLocationCode) &&
    !isEmptyCheck(agencyLocationCode)
  ) {
    validation.isInvalid = true;
    validation.validationError =
      PropertyInfoStateDefault.alcValidationPatternMessage;
  }
  return validation;
}

// Validation additionalInfoClass
/**
 * Validate Condition
 */
export function validateCondition(id) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (id === null || id === "") {
    validation.isInvalid = true;
    validation.validationError = "Valid condition codes are: 1,4,7,X OR S";
    return validation;
  }
  return validation;
}

// Validate Hazardous
export function validateHazardous(id) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  if (isEmptyCheck(id)) {
    validation.isInvalid = true;
    validation.validationError = "Hazmat indicator must be selected";
    return validation;
  }

  return validation;
}

// Validate flightSafetyCriticalAircraft
export function validateFlightSafetyCriticalAircraft(id) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(id)) {
    validation.isInvalid = true;
    validation.validationError =
      "Flight Safety Critical Aircraft Part must be selected";
    return validation;
  }
  return validation;
}

// Validate SRD

//format date
export function dateFormatted(dateStr: string) {
  return (
    dateStr.substr(4, 2) +
    "/" +
    dateStr.substr(6, 2) +
    "/" +
    dateStr.substr(0, 4)
  );
}

export async function validateExcessReleaseDate(
  exchangeSaleFlag?: string,
  aacCode?: string,
  agencyBureau?: string,
  agencyControlNumber?: string,
  disposalConditionCode?: string,
  isEquipmentForComputersForLearning?: boolean,
  fscCode?: string,
  screeningDays?: number,
  isInternalAgency?: boolean,
  isSubmitted?: boolean,
  submittedDate?: Date
): Promise<ERDValidation> {
  let validation: ERDValidation = {
    isInvalid: false,
    validationError: "",
    excessReleaseDate: null,
  };

  let erdRequest: ERDRequestDTO = {
    exchangeSaleFlag: exchangeSaleFlag,
    aacCode: aacCode,
    agencyBureau: agencyBureau,
    disposalConditionCode: disposalConditionCode,
    fscCode: fscCode,
    isEquipmentForComputersForLearning: isEquipmentForComputersForLearning,
    isSubmitted: isSubmitted,
    screeningDays: screeningDays,
    isInternalAgency: isInternalAgency,
    submittedDate: submittedDate ? submittedDate?.toUTCString() : "",
    agencyControlNumber: agencyControlNumber,
  };

  const erdResponse = await new PropertyApiService().getValidDate(
    "erd",
    erdRequest
  );
  let newERD: string = erdResponse?.data?.toString();
  if (!isEmptyCheck(newERD)) {
    validation.isInvalid = false;
    validation.validationError = "";
    validation.excessReleaseDate = new Date(dateFormatted(newERD));
  }
  return validation;
}

export function validateAcquisitionDate(
  agencyBureau: string,
  acquisitionDate?: Date
) {
  return {
    acquisitionDateIsRequired: agencyBureau === "4757" ? true : false,
    acquisitionDateIsInvalid:
      agencyBureau === "4757" && acquisitionDate == null ? true : false,
    acquisitionDateMsg:
      agencyBureau === "4757" && acquisitionDate == null
        ? "Date of Acquisition is Required for SASP Items Reporting"
        : "",
  };
}

export async function validateSurplusReleaseDate(
  exchangeSaleFlag: string,
  aacCode: string,
  fscCode: string,
  agencyBureau: string,
  isVessel50FeetOrOver: boolean,
  disposalConditionCode: string,
  isSubmitted: boolean,
  excessReleaseDate: Date,
  isInternalAgency: boolean,
  submittedDate: Date,
  isSubmittedFromUI?: boolean
): Promise<SRDValidation> {
  let validation: SRDValidation = {
    isInvalid: false,
    validationError: "",
    surplusReleaseDate: null,
  };

  let srdRequest: SRDRequestsDTO = {
    exchangeSaleFlag: exchangeSaleFlag,
    aacCode: aacCode,
    agencyBureau: agencyBureau,
    isVessel50FeetOrOver: isVessel50FeetOrOver,
    disposalConditionCode: disposalConditionCode,
    fscCode: fscCode,
    isSubmitted: isSubmitted,
    isInternalAgency: isInternalAgency,
    erd: excessReleaseDate ? moment(excessReleaseDate).format("yyyyMMDD") : "",
    submittedDate: submittedDate
      ? moment(submittedDate).format("yyyyMMDD")
      : "",
    isSubmittedFromUI: true,
  };

  const srdResponse = await new PropertyApiService().getValidDate(
    "srd",
    srdRequest
  );

  let newSRD: string = srdResponse?.data?.toString();
  if (!isEmptyCheck(newSRD)) {
    validation.isInvalid = false;
    validation.validationError = "";
    validation.surplusReleaseDate = new Date(dateFormatted(newSRD));
  }
  return validation;
}

//Validate demilitariztion
export function validateDemilitarization(
  inputedValue: string,
  selectedFASC: string
) {
  let validation = {
    isInvalid: false,
    errorMsg: "",
  };

  let demilitariztionCodes = ["C", "D", "E", "F", "G", "P"];
  let isWaiverRequired =
    selectedFASC !== "N" && demilitariztionCodes.includes(inputedValue);

  if (isWaiverRequired) {
    validation.isInvalid = true;
    validation.errorMsg =
      "Select Approved Waiver option of Federal Asset Sales Center for Demilitarization code that you have selected";
  }
  return validation;
}

export function validateAircraftSerialNumber(value): Validation {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (value?.trim() === "" || !value) {
    validation.isInvalid = true;
    validation.validationError = "Serial Number is required";
  } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
    validation.isInvalid = true;
    validation.validationError =
      "Serial Number must contain alphabets and numeric characters";
  }
  return validation;
}

// Validate property Description
export function trimString(val) {
  val = val.replace(/\s/g, "");
  return val;
}

export function validatePropertyDescription(propertyDescription): Validation {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(propertyDescription) || propertyDescription === "") {
    validation.isInvalid = true;
    validation.validationError =
      "Property description must be 25 characters or longer";
    return validation;
  }

  propertyDescription = propertyDescription.replace(/(<([^>]+)>)/g, "");
  propertyDescription = propertyDescription.replace("'", ".");
  propertyDescription = propertyDescription.replace(/&nbsp;/gi, " ");

  if (propertyDescription.length < 25 || isEmptyCheck(propertyDescription)) {
    validation.isInvalid = true;
    validation.validationError =
      "Property description must be 25 characters or longer";
    return validation;
  }
  if (trimString(propertyDescription).length < 25) {
    validation.isInvalid = true;
    validation.validationError =
      "Property description must be 25 characters or longer";
    return validation;
  }

  if (propertyDescription.length > 10000) {
    validation.isInvalid = true;
    validation.validationError =
      "Property description must be shorter than 10000 characters";
    return validation;
  }
  return validation;
}

export function validateSalesNotes(salesNotes): Validation {
  let validation = {
    isInvalid: false,
    validationError: "",
  };

  salesNotes = salesNotes?.replace(/(<([^>]+)>)/g, "");
  salesNotes = salesNotes?.replace("'", ".");
  salesNotes = salesNotes?.replace(/&nbsp;/gi, " ");

  if (salesNotes?.length > 1 && salesNotes?.length < 25) {
    validation.isInvalid = true;
    validation.validationError = "Sales notes must be 25 characters or longer";
    return validation;
  }

  if (salesNotes?.length > 10000) {
    validation.isInvalid = true;
    validation.validationError =
      "Sales notes must be shorter than 10000 characters";
    return validation;
  }
  return validation;
}

export class Validation {
  isInvalid: boolean = false;
  validationError: string = "";
}

export class ERDValidation extends Validation {
  isInvalid: boolean = false;
  validationError: string = "";
  excessReleaseDate: Date;
}

export class SRDValidation extends Validation {
  isInvalid: boolean = false;
  validationError: string = "";
  surplusReleaseDate: Date;
}

export function validateSpecialDescriptionCode(value: any): Validation {
  let specialDescriptionCode = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(specialDescriptionCode)) {
    validation.isInvalid = true;
    validation.validationError = "Special Description Code is required";
  } else if (specialDescriptionCode.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Enter a valid Special Description Code";
  }
  return validation;
}

export function validateSpecialDescriptionText(value: any): Validation {
  let specialDescriptionText = value;
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(specialDescriptionText)) {
    validation.isInvalid = true;
    validation.validationError = "Special Description text is required";
  } else if (specialDescriptionText.length === 0) {
    validation.isInvalid = true;
    validation.validationError = "Enter a valid Special Description text.";
  }
  return validation;
}

export function validateSerialNumberExist(
  fscCode: string,
  serialNumber: string,
  icn: string
) {
  const propertyAPICall = new PropertyApiService();

  let data = {};
  data["specDescCode"] = serialNumber;
  data["fscCode"] = fscCode;
  data["icn"] = icn;

  return propertyAPICall.checkSpecialDescriptionCode(data).catch((error) => {
    console.error("Checking if Serial Number Exist gave Error:", error);
  });
}

export function validateAppraisalValue(name, value, isRequired) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(value)) {
    validation.isInvalid = true;
    validation.validationError = name + " is required";
    return validation;
  }
  return validation;
}

export interface Validation {
  isInvalid: boolean;
  validationError: string;
}

export function validateVaultShelfNumber(value, updateGiftInformationState) {
  let vaultShelfNumber = value;
  let validation: Validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(vaultShelfNumber)) {
    console.log("Vault Shelf Number is required ");
    validation.isInvalid = true;
    validation.validationError = "Vault Shelf Number is required";
  }
  updateGiftInformationState({
    vaultShelfNumber: value,
    vaultShelfNumberInvalid: validation.isInvalid,
    vaultShelfNumberErrorMessage: validation.validationError,
  });
  return validation;
}

export function validateFGMReceivedDate(
  value,
  recDateValue,
  name,
  isRequired,
  updateGiftInformationState
) {
  let today = new Date();
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isRequired && isEmptyCheck(value)) {
    console.log("restrictedItemSelectedValue FGM is Empty 1 ");
    validation.isInvalid = true;
    validation.validationError = name + " is required";
    updateGiftInformationState({
      dateReceivedByFGM: value,
      dateReceivedByFGMInvalid: validation.isInvalid,
      dateReceivedByFGMErrorMessage: validation.validationError,
    });
    return validation;
  } else if (moment(value).isAfter(today)) {
    console.log("restrictedItemSelectedValue FGM is Empty 2 ");
    validation.isInvalid = true;
    validation.validationError = name + " should not be future date";
    updateGiftInformationState({
      dateReceivedByFGM: value,
      dateReceivedByFGMInvalid: validation.isInvalid,
      dateReceivedByFGMErrorMessage: validation.validationError,
    });
  } else if (moment(value).isBefore(moment(recDateValue))) {
    console.log("restrictedItemSelectedValue FGM is Empty 3 ");
    validation.isInvalid = true;
    validation.validationError =
      name + " should not be before Date Received by Recipient";
    updateGiftInformationState({
      dateReceivedByFGM: value,
      dateReceivedByFGMInvalid: validation.isInvalid,
      dateReceivedByFGMErrorMessage: validation.validationError,
    });
  }
  return validation;
}

export function validateRestrictedItem(value, updateGiftInformationState) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (null == value) {
    validation.isInvalid = true;
    validation.validationError = "Restricted Item is required";
  }
  updateGiftInformationState({
    restrictedItemSelectedValue: value,
    restrictedItemInvalid: validation.isInvalid,
    restrictedItemErrorMessage: validation.validationError,
  });
  return validation;
}

export function validateVaultLocation(
  value: string,
  updateGiftInformationState
) {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (isEmptyCheck(value)) {
    console.log("restrictedItemSelectedValue ", "it is Empty");
    validation.isInvalid = true;
    validation.validationError = "Vault Location is required";
  }
  updateGiftInformationState({
    vaultLocationSelectedValue: value,
    vaultLocationInvalid: validation.isInvalid,
    vaultLocationErrorMessage: validation.validationError,
  });
  return validation;
}
