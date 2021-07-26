import { isEmptyCheck } from "../validations/fleetValidations";

export interface PropertyCustodianState {
  custodianName: string;
  phoneNumber: string;
  faxNumber: string;
  emailAddress: string;
  ccEmailAddress: string;
  custodianNameIsInValid: boolean;
  custodianNameIsValid: boolean;
  custodianNameValidationMessage: string;
  phoneNumberIsInValid: boolean;
  phoneNumberIsValid: boolean;
  phoneNumberValidationMessage: string;
  faxNumberIsInValid: boolean;
  faxNumberIsValid: boolean;
  faxNumberValidationMessage: string;
  emailAddressIsInValid: boolean;
  emailAddressIsValid: boolean;
  emailAddressValidationMessage: string;
  ccEmailAddressIsInValid: boolean;
  ccEmailAddressIsValid: boolean;
  ccEmailAddressValidationMessage: string;
  propertyCustodianIsInvalid: boolean;
  propertyCustodianIsValid: boolean;
}

export const propertyCustodianStateDefault: PropertyCustodianState = {
  custodianName: "",
  phoneNumber: "",
  faxNumber: "",
  emailAddress: "",
  ccEmailAddress: "",
  custodianNameIsInValid: false,
  custodianNameIsValid: false,
  custodianNameValidationMessage: "",
  phoneNumberIsInValid: false,
  phoneNumberIsValid: false,
  phoneNumberValidationMessage: "",
  emailAddressIsInValid: false,
  emailAddressIsValid: false,
  emailAddressValidationMessage: "",
  faxNumberIsInValid: false,
  faxNumberIsValid: false,
  faxNumberValidationMessage: "",
  ccEmailAddressIsInValid: false,
  ccEmailAddressIsValid: false,
  ccEmailAddressValidationMessage: "",
  propertyCustodianIsInvalid: false,
  propertyCustodianIsValid: false,
};

const vFields = [
  "custodianNameIsInValid",
  "phoneNumberIsInValid",
  "emailAddressIsInValid",
];

const eFields = ["custodianName", "phoneNumber", "emailAddress"];

export function updatePropertyCustodianNav(
  newState: PropertyCustodianState,
  prevState: PropertyCustodianState
): void {
  const propertyCustodianIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const propertyCustodianIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.propertyCustodianIsInvalid = propertyCustodianIsInvalid;
  newState.propertyCustodianIsValid =
    !propertyCustodianIsInvalid && !propertyCustodianIsEmpty;
}
