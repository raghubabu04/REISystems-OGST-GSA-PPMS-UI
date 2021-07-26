import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";

export interface RecipientInfoState {
  phoneNumber: string;
  isPhoneNumberInvalid: boolean;
  phoneNumberInvalidErrorMessage: string;
  phoneExtension: string;
  isPhoneExtensionInvalid: boolean;
  phoneExtensionInvalidErrorMessage: string;
  emailAddress: string;
  isEmailAddressInvalid: boolean;
  emailAddressInvalidErrorMessage: string;
  title: string;
  titleMsg: string;
  titleInvalid: boolean;
  recipientFirstName: string;
  recipientLastName: string;
  firstNameMsg: string;
  firstNameInvalid: boolean;
  lastNameInvalid: boolean;
  firstMessage: string;
  lastMessage: string;
  recipientInfoValid: boolean;
  recipientInfoInvalid: boolean;
}

export const RecipientInfoStateDefaults = {
  phoneNumber: "",
  isPhoneNumberInvalid: false,
  phoneNumberInvalidErrorMessage: "",
  phoneExtension: "",
  isPhoneExtensionInvalid: false,
  phoneExtensionInvalidErrorMessage: "",
  emailAddress: "",
  isEmailAddressInvalid: false,
  emailAddressInvalidErrorMessage: "",
  title: "",
  titleMsg: "Receipient Title is required",
  titleInvalid: false,
  recipientFirstName: "",
  recipientLastName: "",
  firstNameMsg: "Receipient First Name is required",
  firstNameInvalid: false,
  lastNameInvalid: false,
  firstMessage: "Receipient First Name is required",
  lastMessage: "Receipient Last Name is required",
  recipientInfoValid: false,
  recipientInfoInvalid: false,
};

export const RecipientJson = (recipientInfoState: RecipientInfoState) => [
  {
    firstName: recipientInfoState?.recipientFirstName?.trim(),
    lastName: recipientInfoState?.recipientLastName?.trim(),
    recipientTitle: recipientInfoState?.title?.trim(),
    phone: recipientInfoState?.phoneNumber?.replace(/[^0-9]/g, ""),
    phoneExtension: recipientInfoState?.phoneExtension?.trim(),
    email: recipientInfoState?.emailAddress?.trim(),
  },
];

const vFields = [
  "titleInvalid",
  "firstNameInvalid",
  "lastNameInvalid",
  "isPhoneNumberInvalid",
  "isEmailAddressInvalid",
];

const eFields = ["title", "recipientFirstName", "recipientLastName"];

export function updateRecipientInfoNav(
  newState: RecipientInfoState,
  prevState: RecipientInfoState
): void {
  const recipientInfoInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const recipientInfoEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.recipientInfoInvalid = recipientInfoInvalid;
  newState.recipientInfoValid = !recipientInfoInvalid && !recipientInfoEmpty;
}
