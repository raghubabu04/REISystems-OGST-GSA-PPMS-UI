import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";

export interface DonorInfoState {
  country: string;
  countryIsInvalid: boolean;
  title: string;
  titleMsg: string;
  titleInvalid: boolean;
  donorFirstName: string;
  donorMiddleName: string;
  donorLastName: string;
  firstNameMsg: string;
  firstNameInvalid: boolean;
  middleNameInvalid: boolean;
  lastNameInvalid: boolean;
  firstMessage: string;
  lastMessage: string;
  donorInfoInvalid: boolean;
  donorInfoValid: any;
}

export const DonorInfoStateDefaults = {
  country: "",
  countryIsInvalid: false,
  title: "",
  titleMsg: "Donor Title is required",
  titleInvalid: false,
  donorFirstName: "",
  donorMiddleName: "",
  donorLastName: "",
  firstNameMsg: "Donor First Name is required",
  firstNameInvalid: false,
  middleNameInvalid: false,
  lastNameInvalid: false,
  firstMessage: "Donor First Name is required",
  lastMessage: "Last Name is required",
  donorInfoInvalid: false,
  donorInfoValid: false,
};

export const DonorJson = (donorInfoState: DonorInfoState) => [
  {
    firstName: donorInfoState?.donorFirstName?.trim(),
    lastName: donorInfoState?.donorLastName?.trim(),
    donorTitle: donorInfoState?.title?.trim(),
    countryCode: donorInfoState?.country?.trim(),
  },
];

const vFields = [
  "titleInvalid",
  "firstNameInvalid",
  "lastNameInvalid",
  "countryIsInvalid",
];

const eFields = ["title", "donorFirstName", "donorLastName", "country"];

export function updateDonorInfoNav(
  newState: DonorInfoState,
  prevState: DonorInfoState
): void {
  const donorInfoInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const donorInfoEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.donorInfoInvalid = donorInfoInvalid;
  newState.donorInfoValid = !donorInfoInvalid && !donorInfoEmpty;
}
