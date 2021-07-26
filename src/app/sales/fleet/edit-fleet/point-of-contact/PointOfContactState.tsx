import { isEmptyCheck } from "../validations/fleetValidations";

export interface PointOfContactState {
  pointOfContactIsInvalid: boolean;
  pointOfContactIsValid: boolean;
  firstName: string;
  isFirstNameInvalid: boolean;
  lastName: string;
  isLastNameInvalid: boolean;
  pointOfContactOptions: any[];
  pocSelected: string;
  phoneNumber: string;
  isPhoneNumberInvalid: boolean;
  phoneNumberInvalidErrorMessage: string;
  phoneExtension: string;
  email: string;
  emailIsInvalid: boolean;
  emailValidationMessage: string;
  ccEmail: string;
  ccEmailIsInvalid: boolean;
  ccEmailValidationMessage: string;
}

export const pointOfContactStateDefault: PointOfContactState = {
  pointOfContactIsInvalid: false,
  pointOfContactIsValid: false,
  firstName: "",
  isFirstNameInvalid: false,
  lastName: "",
  isLastNameInvalid: false,
  pointOfContactOptions: [],
  pocSelected: "",
  phoneNumber: "",
  isPhoneNumberInvalid: false,
  phoneNumberInvalidErrorMessage: "",
  phoneExtension: "",
  email: "",
  emailIsInvalid: false,
  emailValidationMessage: "",
  ccEmail: "",
  ccEmailIsInvalid: false,
  ccEmailValidationMessage: "",
};

const vFields = [
  "isFirstNameInvalid",
  "isLastNameInvalid",
  "isPhoneNumberInvalid",
  "emailIsInvalid",
  "ccEmailIsInvalid",
];

const eFields = ["firstName", "lastName", "phoneNumber", "email"];

export function updatePointOfContactNav(
  newState: PointOfContactState,
  prevState: PointOfContactState
): void {
  const pointOfContactIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const pointOfContactIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.pointOfContactIsInvalid = pointOfContactIsInvalid;
  newState.pointOfContactIsValid =
    !pointOfContactIsInvalid && !pointOfContactIsEmpty;
}
