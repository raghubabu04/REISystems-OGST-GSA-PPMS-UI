import { FSCVehicleData } from "./FSCModel";
import { recallOptions, transmissionType } from "../../constants/Constants";

export interface FSCVehicleState {
  vehicleFSCData: FSCVehicleData;
  errors: { fuelType: string };
  recallOptions: any[];
  transmissionTypeOptions: any[];
  validationMessage: {
    fuelTypeMsg: string;
    fuelTypeValid: boolean;
    fuelTypeInvalid: boolean;
    transmissionTypeMsg: string;
    transmissionTypeValid: boolean;
    transmissionTypeInvalid: boolean;
    agencyClassMsg: string;
    agencyClassValid: boolean;
    agencyClassInvalid: boolean;
    agencyClassRequired: boolean;
    tagMsg: string;
    tagValid: boolean;
    tagInvalid: boolean;
    isTagRequired: boolean;
    noOfCylindersMsg: string;
    noOfCylindersValid: boolean;
    noOfCylindersInvalid: boolean;
    modelYearMsg: string;
    modelYearValid: boolean;
    modelYearInvalid: boolean;
    bodyStyleMsg: string;
    bodyStyleValid: boolean;
    bodyStyleInvalid: boolean;
    vinMsg: string;
    vinValid: boolean;
    vinInvalid: boolean;
    makeMsg: string;
    makeValid: boolean;
    makeInvalid: boolean;
    modelMsg: string;
    modelInvalid: boolean;
    modelValid: boolean;
    estimatedMileageMsg: string;
    estimatedMileageValid: boolean;
    estimatedMileageInvalid: boolean;
    colorMsg: string;
    colorValid: boolean;
    colorInvalid: boolean;
    colorGradientMsg: string;
    colorGradientValid: boolean;
    recallValidationMsg: string;
    recallIsInvalid: boolean;
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
  };
}

export const FSCVehicleStateDefault = {
  vehicleFSCData: {
    vehicleId: null,
    agencyClass: "",
    transmissionType: "",
    tag: "",
    noOfCylinders: null,
    modelYear: "",
    fuelType: "",
    bodyStyle: "",
    vin: "",
    make: "",
    model: "",
    estimatedMileage: null,
    color: "",
    colorGradient: "",
    recalled: "",
    itemName: "",
    specialDescriptionCode: "",
    specialDescriptionText: "",
  },
  errors: { fuelType: "" },
  recallOptions: recallOptions,
  transmissionTypeOptions: transmissionType,
  validationMessage: {
    fuelTypeMsg: "Fuel Type is Required.",
    fuelTypeValid: false,
    fuelTypeInvalid: false,
    transmissionTypeMsg: "Transmission Type is Required.",
    transmissionTypeValid: false,
    transmissionTypeInvalid: false,
    agencyClassMsg: "Agency Class is Required.",
    agencyClassValid: false,
    agencyClassInvalid: false,
    agencyClassRequired: false,
    tagMsg: "Tag is Required.",
    tagValid: false,
    tagInvalid: false,
    isTagRequired: false,
    noOfCylindersMsg: "No Of Cylinders is Required.",
    noOfCylindersValid: false,
    noOfCylindersInvalid: false,
    modelYearMsg: "Model year is Required.",
    modelYearValid: false,
    modelYearInvalid: false,
    bodyStyleMsg: "Body style is Required.",
    bodyStyleValid: false,
    bodyStyleInvalid: false,
    vinMsg: "Vin is Required.",
    vinValid: false,
    vinInvalid: false,
    makeMsg: "Make is Required.",
    makeInvalid: false,
    makeValid: false,
    modelMsg: "Model is Required.",
    modelInvalid: false,
    modelValid: false,
    estimatedMileageMsg: "Estimated mileage is Required.",
    estimatedMileageValid: false,
    estimatedMileageInvalid: false,
    colorMsg: "Color is Required.",
    colorValid: false,
    colorInvalid: false,
    colorGradientMsg: "",
    colorGradientValid: false,
    recallValidationMsg: "Recall selection is Required.",
    recallIsInvalid: false,
    itemNameMsg: "Item Name is Required.",
    itemNameValid: false,
    itemNameInvalid: false,
    itemNameIsRequired: true,
    specialDescriptionCodeMsg: "Special Description Code is Required.",
    specialDescriptionCodeValid: false,
    specialDescriptionCodeInvalid: false,
    specialDescriptionCodeIsRequired: false,
    specialDescriptionTextMsg: "Special Description Text is Required.",
    specialDescriptionTextValid: false,
    specialDescriptionTextInvalid: false,
    specialDescriptionTextIsRequired: false,
  },
};
