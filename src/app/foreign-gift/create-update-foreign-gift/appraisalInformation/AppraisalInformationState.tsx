import { isEmptyCheck } from "../../../property/create-update-property/validations/propertyFieldValidations";
import { GiftInformationState } from "../gift-information/GiftInformationState";

export interface AppraisalInformationState {
  appraisalInfoId: number;
  firstName?: string;
  isFirstNameInvalid: boolean;
  firstNameInvalidErrorMessage: string;

  lastName?: string;
  isLastNameInvalid: boolean;
  lastNameInvalidErrorMessage: string;

  phoneNumber?: string;
  isPhoneNumberInvalid: boolean;
  phoneNumberInvalidErrorMessage: string;

  phoneExtension?: string;
  isPhoneExtensionInvalid: boolean;
  phoneExtensionInvalidErrorMessage: string;

  emailAddress?: string;
  isEmailAddressInvalid: boolean;
  emailAddressInvalidErrorMessage: string;

  appraisalValue?: string;
  isAppraisalValueInvalid: boolean;
  appraisalValueInvalidErrorMessage: string;

  dateOfApproval: Date;
  isDateOfApprovalInvalid: boolean;
  dateOfApprovalErrorMessage: string;
  appraisalInfoInvalid: boolean;
  appraisalInfoValid: boolean;
  wantToBuyGift: boolean;
}

export const appraisalInformationDefault: AppraisalInformationState = {
  appraisalInfoId: null,
  firstName: "",
  isFirstNameInvalid: false,
  firstNameInvalidErrorMessage: "",
  lastName: "",
  isLastNameInvalid: false,
  lastNameInvalidErrorMessage: "",
  phoneNumber: "",
  isPhoneNumberInvalid: false,
  phoneNumberInvalidErrorMessage: "",
  phoneExtension: "",
  isPhoneExtensionInvalid: false,
  phoneExtensionInvalidErrorMessage: "",
  emailAddress: "",
  isEmailAddressInvalid: false,
  emailAddressInvalidErrorMessage: "",
  appraisalValue: "",
  isAppraisalValueInvalid: false,
  appraisalValueInvalidErrorMessage: "",
  dateOfApproval: null,
  isDateOfApprovalInvalid: false,
  dateOfApprovalErrorMessage: "",
  appraisalInfoInvalid: false,
  appraisalInfoValid: false,
  wantToBuyGift: false,
};

export const appValidationDefaults = {
  isFirstNameInvalid: false,
  firstNameInvalidErrorMessage: "",
  isLastNameInvalid: false,
  lastNameInvalidErrorMessage: "",
  isPhoneNumberInvalid: false,
  phoneNumberInvalidErrorMessage: "",
  isPhoneExtensionInvalid: false,
  phoneExtensionInvalidErrorMessage: "",
  isEmailAddressInvalid: false,
  emailAddressInvalidErrorMessage: "",
  isAppraisalValueInvalid: false,
  appraisalValueInvalidErrorMessage: "",
  isDateOfApprovalInvalid: false,
  dateOfApprovalErrorMessage: "",
  appraisalInfoInvalid: false,
  appraisalInfoValid: false,
};

const vFields = [
  "isFirstNameInvalid",
  "isLastNameInvalid",
  "isEmailAddressInvalid",
  "isPhoneNumberInvalid",
  "isDateOfApprovalInvalid",
  "isAppraisalValueInvalid",
];

const eFields = [
  "firstName",
  "lastName",
  "emailAddress",
  "phoneNumber",
  "dateOfApproval",
];

export function updateAppraisalInfoNav(
  newState: AppraisalInformationState,
  prevState: AppraisalInformationState
): void {
  const appraisalInfoInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const appraisalInfoEmpty: boolean = checkIsEmpty(newState, prevState);
  newState.appraisalInfoInvalid = appraisalInfoInvalid;
  newState.appraisalInfoValid = !appraisalInfoInvalid && !appraisalInfoEmpty;
}

export function checkIsEmpty(
  newState: AppraisalInformationState,
  prevState: AppraisalInformationState
): boolean {
  const wantToBuyGift =
    newState.wantToBuyGift !== undefined
      ? newState.wantToBuyGift
      : prevState.wantToBuyGift;
  return wantToBuyGift
    ? eFields.some((f) => {
        return newState[f] !== undefined
          ? isEmptyCheck(newState[f])
          : isEmptyCheck(prevState[f]);
      })
    : false;
}
