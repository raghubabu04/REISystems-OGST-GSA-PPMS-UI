import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface PropertyLocationState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  propAddress1: string;
  propAddress1IsInvalid: boolean;
  propAddress1IsValid: boolean;
  propAddress1ValidationMessage: string;
  propAddress2: string;
  propAddress2IsInvalid: boolean;
  propAddress2IsValid: boolean;
  propAddress2ValidationMessage: string;
  propAddress3: string;
  propAddress3IsInvalid: boolean;
  propAddress3IsValid: boolean;
  propAddress3ValidationMessage: string;
  propCity: string;
  propCityIsInvalid: boolean;
  propCityIsValid: boolean;
  propCityValidationMessage: string;
  propStateCode: string;
  propState: string;
  propStateDefault: string;
  propStateIsInvalid: boolean;
  propStateIsValid: boolean;
  propStateValidationMessage: string;
  propZipCode: string;
  propZipIsInvalid: boolean;
  propZipIsValid: boolean;
  propZipValidationMessage: string;
  propZip2Code: string;
  propZip2IsInvalid: boolean;
  propZip2IsValid: boolean;
  propZip2ValidationMessage: string;
  propLocValues: Array<string>;
  keyDisplayStr: string;
  propLocationId: number;
  propAacCode: string;
  addressId: string;
  updateDisabled: boolean;
  modalShow: boolean;
  disabledZipExtension: boolean;
  propLocationIsInvalid: boolean;
  propLocationIsValid: boolean;
  deleteAlert: boolean;
}

export const PropertyLocationStateDefault: PropertyLocationState = {
  accordianExpanded: true,
  accordingDisplay: "show",
  propAddress1: "",
  propAddress1IsInvalid: false,
  propAddress1IsValid: false,
  propAddress1ValidationMessage: "",
  propAddress2: "",
  propAddress2IsInvalid: false,
  propAddress2IsValid: false,
  propAddress2ValidationMessage: "",
  propAddress3: "",
  propAddress3IsInvalid: false,
  propAddress3IsValid: false,
  propAddress3ValidationMessage: "",
  propCity: "",
  propCityIsInvalid: false,
  propCityIsValid: false,
  propCityValidationMessage: "",
  propStateCode: "",
  propState: "",
  propStateDefault: "",
  propStateIsInvalid: false,
  propStateIsValid: false,
  propStateValidationMessage: "",
  propZipCode: "",
  propZipIsInvalid: false,
  propZipIsValid: false,
  propZipValidationMessage: "",
  propZip2Code: "",
  propZip2IsInvalid: false,
  propZip2IsValid: false,
  propZip2ValidationMessage: "",
  propLocValues: [],
  keyDisplayStr: "",
  propLocationId: 0,
  propAacCode: "",
  addressId: "",
  updateDisabled: true,
  modalShow: false,
  disabledZipExtension: true,
  propLocationIsInvalid: false,
  propLocationIsValid: false,
  deleteAlert: false,
};

export const PropertyLocationStateJson = (
  propertyLocationState: PropertyLocationState
) => [
  {
    line1: propertyLocationState?.propAddress1?.trim(),
    line2: propertyLocationState?.propAddress2?.trim(),
    line3: propertyLocationState?.propAddress3,
    city: propertyLocationState?.propCity?.trim(),
    stateCode: propertyLocationState?.propStateCode,
    zip: propertyLocationState?.propZipCode,
    zip2: propertyLocationState?.propZip2Code,
    isDeleted: false,
  },
];

const vFields = [
  "propAddress1IsInvalid",
  "propAddress2IsInvalid",
  "propAddress3IsInvalid",
  "propCityIsInvalid",
  "propStateIsInvalid",
  "propZipIsInvalid",
  "propZip2IsInvalid",
];

const eFields = ["propAddress1", "propCity", "propStateCode", "propZipCode"];

export function updatePropertyLocationNav(
  newState: PropertyLocationState,
  prevState: PropertyLocationState
): void {
  const propLocationIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const propLocationIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.propLocationIsInvalid = propLocationIsInvalid;
  newState.propLocationIsValid = !propLocationIsInvalid && !propLocationIsEmpty;
}
