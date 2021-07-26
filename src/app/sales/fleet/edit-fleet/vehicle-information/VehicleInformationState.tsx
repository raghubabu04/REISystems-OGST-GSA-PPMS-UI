import { isEmptyCheck } from "../validations/fleetValidations";
export interface VehicleInformationState {
  engineNumber: string;
  engineNumberIsInvalid: boolean;
  engineNumberValidationMsg: string;
  fuelType: string;
  GWVR: string;
  vehicleType: string;
  vehicleTypeIsInvalid: boolean;
  vehicleTypeValidationMsg: string;
  dualWheel: string;
  tire: string;
  noPass: string;
  wheelBase: string;
  payload: string;
  mileage: string;
  mileageIsInvalid: boolean;
  mileageValidationMsg: string;
  salvageScrap: string;
  odometerCorrect: string;
  loanValue: string;
  tradeInValue: string;
  retailValue: string;
  MSRP: string;
  odometerOptions: any[];
  salvageScrapOptions: any[];
  vehicleVin: number;
  vinValidationMessage: string;
  isVinInValid: boolean;
  vehicleMake: string;
  vehicleMakeValidationMessage: string;
  isVehicleMakeInValid: boolean;
  vehicleClass: string;
  vehicleTag: string;
  vehicleModel: string;
  modelValidation: string;
  isVehicleModelInValid: boolean;
  vehicleYear: string;
  vehicleYearValidationMessage: string;
  isVehicleYearInValid: boolean;
  vehicleBody: string;
  vehicleColor: string;
  vehicleColorValidationMessage: string;
  isColorInValid: boolean;
  vehicleColorTone: string;
  colorToneValidationMessage: string;
  isColorToneInValid: boolean;
  vehicleCylinder: string;
  vehicleAxle: string;
  vehicleHorsepower: string;
  propertyDescription: string;
  itemDescriptionIsInvalid: boolean;
  itemDescriptionErrorMsg: string;
  transmissionOptions: any[];
  transmission: string;
  transmissionIsInvalid: boolean;
  itemDescription: string;
  vehicleInformationIsInvalid: boolean;
  vehicleInformationIsValid: boolean;
}

export const vehicleInformationStateDefault: VehicleInformationState = {
  engineNumber: "",
  engineNumberIsInvalid: false,
  engineNumberValidationMsg: "Vehicle engine number is required",
  fuelType: "",
  GWVR: "",
  vehicleType: "",
  vehicleTypeIsInvalid: false,
  vehicleTypeValidationMsg: "Vehicle type is required",
  dualWheel: "",
  tire: "",
  noPass: "",
  wheelBase: "",
  payload: "",
  mileage: "",
  mileageIsInvalid: false,
  mileageValidationMsg: "Mileage is required",
  salvageScrap: "false",
  odometerCorrect: "false",
  loanValue: "",
  tradeInValue: "",
  retailValue: "",
  MSRP: "",
  odometerOptions: [
    {
      id: `Y`,
      value: "Yes",
      isSelected: false,
    },
    {
      id: `N`,
      value: "No",
      isSelected: true,
    },
  ],
  salvageScrapOptions: [
    {
      id: `Y`,
      value: "Yes",
      isSelected: false,
    },
    {
      id: `N`,
      value: "No",
      isSelected: true,
    },
  ],
  vehicleVin: null,
  vinValidationMessage: "VIN is required.",
  vehicleMakeValidationMessage: "Vehicle make is required.",
  modelValidation: "Vehicle model is required.",
  vehicleYearValidationMessage: "Vehicle year is required.",
  vehicleColorValidationMessage: "Color is required.",
  colorToneValidationMessage: "Color tone is required.",
  isVehicleYearInValid: false,
  isVinInValid: false,
  isVehicleMakeInValid: false,
  isVehicleModelInValid: false,
  isColorInValid: false,
  isColorToneInValid: false,
  vehicleClass: "",
  vehicleTag: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleBody: "",
  vehicleColor: "",
  vehicleColorTone: "",
  vehicleCylinder: "",
  vehicleAxle: "",
  vehicleHorsepower: "",
  propertyDescription: "",
  itemDescriptionIsInvalid: false,
  itemDescriptionErrorMsg: "",
  transmissionOptions: [
    {
      id: "Automatic",
      longName: "Automatic",
      isSelected: false,
    },
    {
      id: "Manual",
      longName: "Manual",
      isSelected: false,
    },
  ],
  transmission: "",
  transmissionIsInvalid: false,
  itemDescription: "",
  vehicleInformationIsInvalid: false,
  vehicleInformationIsValid: false,
};

const vFields = [
  "engineNumberIsInvalid",
  "vehicleTypeIsInvalid",
  "mileageIsInvalid",
  "isVinInValid",
  "isVehicleMakeInValid",
  "isVehicleModelInValid",
  "isColorInValid",
  "isColorToneInValid",
  "propertyDescriptionIsInvalid",
  "transmissionIsInvalid",
];

const eFields = [
  "engineNumber",
  "vehicleType",
  "mileage",
  "vehicleVin",
  "vehicleMake",
  "vehicleModel",
  "vehicleColor",
  "vehicleColorTone",
  "propertyDescription",
  "transmission"
];

export function updateVehicleInformationNav(
  newState: VehicleInformationState,
  prevState: VehicleInformationState
): void {
  const vehicleInformationIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const vehicleInformationIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.vehicleInformationIsInvalid = vehicleInformationIsInvalid;
  newState.vehicleInformationIsValid =
    !vehicleInformationIsInvalid && !vehicleInformationIsEmpty;
}
