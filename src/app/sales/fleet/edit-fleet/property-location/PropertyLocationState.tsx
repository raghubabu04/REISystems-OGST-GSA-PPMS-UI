import { isEmptyCheck } from "../validations/fleetValidations";

export interface PropertyLocationState {
  siteName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  cityIsInValid: boolean;
  cityIsValid: boolean;
  cityValidationMessage: string;
  state: string;
  stateIsInValid: boolean;
  stateIsValid: boolean;
  stateValidationMessage: string;
  zipCode: string;
  zipCodeIsInValid: boolean;
  ZipCodeIsValid: boolean;
  zipCodeValidationMessage: string;
  zipCodeExtension: string;
  zipCodeExtensionIsInValid: boolean;
  zipCodeExtensionIsValid: boolean;
  zipCodeExtensionValidationMessage: string;
  propertyLocationCode: string;
  propertyLocationCodeIsInValid: boolean;
  propertyLocationCodeIsValid: boolean;
  propertyLocationCodeValidationMessage: string;
  propertyLocationIsInvalid: boolean;
  propertyLocationIsValid: boolean;
}

export const propertyLocationStateDefault: PropertyLocationState = {
  siteName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  cityIsInValid: false,
  cityIsValid: false,
  cityValidationMessage: "",
  state: "",
  stateIsInValid: false,
  stateIsValid: false,
  stateValidationMessage: "",
  zipCode: "",
  zipCodeIsInValid: false,
  ZipCodeIsValid: false,
  zipCodeValidationMessage: "",
  propertyLocationCode: "",
  propertyLocationCodeIsInValid: false,
  propertyLocationCodeIsValid: false,
  propertyLocationCodeValidationMessage: "",
  zipCodeExtension: "",
  zipCodeExtensionIsInValid: false,
  zipCodeExtensionIsValid: false,
  zipCodeExtensionValidationMessage: "",
  propertyLocationIsInvalid: false,
  propertyLocationIsValid: false,
};

const vFields = [
  "cityIsInValid",
  "stateIsInValid",
  "zipCodeIsInValid",
  "zipCodeExtensionIsInValid",
  "propertyLocationCodeIsInValid",
];

const eFields = ["city", "state", "zipCode", "propertyLocationCode"];

export function updatePropertyLocationNav(
  newState: PropertyLocationState,
  prevState: PropertyLocationState
): void {
  const propertyLocationIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const propertyLocationIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.propertyLocationIsInvalid = propertyLocationIsInvalid;
  newState.propertyLocationIsValid =
    !propertyLocationIsInvalid && !propertyLocationIsEmpty;
}
