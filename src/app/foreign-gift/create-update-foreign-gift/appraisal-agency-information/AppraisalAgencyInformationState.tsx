import { appraisalToUploadOptions } from "../../../property/create-update-property/constants/Constants";
import { isEmptyCheck } from "../../../property/create-update-property/validations/propertyFieldValidations";
import { GiftInformationState } from "../gift-information/GiftInformationState";

export interface AppraisalAgencyInformationState {
  appraisalAgencyInfoId: number;
  accordianExpanded: boolean;
  accordingDisplay: string;
  companyName: string;
  companyNameInvalid: boolean;
  companyNameMsg: string;
  companyAddress1: string;
  companyAddress1IsInvalid: boolean;
  companyAddress1IsValid: boolean;
  companyAddress1ValidationMessage: string;
  companyAddress2: string;
  companyAddress2IsInvalid: boolean;
  companyAddress2IsValid: boolean;
  companyAddress2ValidationMessage: string;
  companyAddress3: string;
  companyAddress3IsInvalid: boolean;
  companyAddress3IsValid: boolean;
  companyAddress3ValidationMessage: string;
  companyCity: string;
  companyCityIsInvalid: boolean;
  companyCityIsValid: boolean;
  companyCityValidationMessage: string;
  companyStateCode: string;
  companyState: string;
  companyStateDefault: string;
  companyStateIsInvalid: boolean;
  companyStateIsValid: boolean;
  companyStateValidationMessage: string;
  companyZipCode: string;
  companyZipIsInvalid: boolean;
  companyZipIsValid: boolean;
  companyZipValidationMessage: string;
  companyZip2Code: string;
  companyZip2IsInvalid: boolean;
  companyZip2IsValid: boolean;
  companyZip2ValidationMessage: string;
  appraisalToUploadOptions: any[];
  appraisalToUpload: boolean;

  appraisalToUploadErrorMessage: string;
  disabledZipExtension: boolean;
  companyUrl: string;
  companyUrlIsInvalid: boolean;
  companyUrlIsValid: boolean;
  companyUrlMsg: string;
  appraisalAgencyInfoInvalid: boolean;
  appraisalAgencyInfoValid: boolean;
  wantToBuyGift: boolean;
}

export const AppraisalAgencyInformationStateDefaults = {
  appraisalAgencyInfoId: null,
  accordianExpanded: true,
  accordingDisplay: "show",
  companyName: "",
  companyNameInvalid: false,
  companyNameMsg: "Appraisal Company Name is required",
  companyAddress1: "",
  companyAddress1IsInvalid: false,
  companyAddress1IsValid: false,
  companyAddress1ValidationMessage: "",
  companyAddress2: "",
  companyAddress2IsInvalid: false,
  companyAddress2IsValid: false,
  companyAddress2ValidationMessage: "",
  companyAddress3: "",
  companyAddress3IsInvalid: false,
  companyAddress3IsValid: false,
  companyAddress3ValidationMessage: "",

  companyCity: "",
  companyCityIsInvalid: false,
  companyCityIsValid: false,
  companyCityValidationMessage: "",
  companyStateCode: "",
  companyState: "",
  companyStateDefault: "",
  companyStateIsInvalid: false,
  companyStateIsValid: false,
  companyStateValidationMessage: "",

  companyZipCode: "",
  companyZipIsInvalid: false,
  companyZipIsValid: false,
  companyZipValidationMessage: "",
  companyZip2Code: "",
  companyZip2IsInvalid: false,
  companyZip2IsValid: false,
  companyZip2ValidationMessage: "",

  appraisalToUploadOptions: appraisalToUploadOptions,
  appraisalToUpload: null,

  appraisalToUploadErrorMessage: "Appraisal form to Upload is required",

  companyUrl: "",
  companyUrlIsInvalid: false,
  companyUrlIsValid: false,
  companyUrlMsg: "Company URL is required.",

  disabledZipExtension: true,
  appraisalAgencyInfoInvalid: false,
  appraisalAgencyInfoValid: false,
  wantToBuyGift: false,
};

export const appAgencyInfoValidationDefaults = {
  companyNameInvalid: false,
  companyAddress1IsInvalid: false,
  companyCityIsInvalid: false,
  companyStateIsInvalid: false,
  companyZipIsInvalid: false,
  companyUrlIsInvalid: false,
  companyNameMsg: "",
  companyAddress1ValidationMessage: "",
  companyCityValidationMessage: "",
  companyStateValidationMessage: "",
  companyZipValidationMessage: "",
  companyUrlMsg: "",
};

const AppraisalAgencyAddressJson = (
  appraisalAgencyInformationState: AppraisalAgencyInformationState
) => [
  {
    line1: appraisalAgencyInformationState?.companyAddress1?.trim(),
    line2: appraisalAgencyInformationState?.companyAddress2?.trim(),
    line3: appraisalAgencyInformationState?.companyAddress3?.trim(),
    city: appraisalAgencyInformationState?.companyCity?.trim(),
    stateCode: appraisalAgencyInformationState?.companyStateCode,
    zip: appraisalAgencyInformationState?.companyZipCode,
    zip2: appraisalAgencyInformationState?.companyZip2Code,
  },
];
export const AppraisalAgencyInformationStateJson = (
  appraisalAgencyInformationState: AppraisalAgencyInformationState
) => [
  {
    appraisalAgencyInfoId:
      appraisalAgencyInformationState?.appraisalAgencyInfoId,
    companyName: appraisalAgencyInformationState?.companyName?.trim(),
    companyAddress: AppraisalAgencyAddressJson(
      appraisalAgencyInformationState
    )[0],
    companyUrl: appraisalAgencyInformationState?.companyUrl?.trim(),
    isAppraisalToUpload: appraisalAgencyInformationState?.appraisalToUpload,
  },
];

const vFields = [
  "companyNameInvalid",
  "companyUrlInvalid",
  "companyAddress1IsInvalid",
  "companyAddress2IsInvalid",
  "companyAddress3IsInvalid",
  "companyCityIsInvalid",
  "companyStateIsInvalid",
  "companyZipIsInvalid",
  "companyZip2IsInvalid",
];

const eFields = [
  "companyName",
  "companyAddress1",
  "companyCity",
  "companyStateCode",
  "companyZipCode",
  "companyUrl",
];

export function updateAppraisalAgencyInfoNav(
  newState: AppraisalAgencyInformationState,
  prevState: AppraisalAgencyInformationState
): void {
  const appraisalAgencyInfoInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const appraisalAgencyInfoEmpty: boolean = checkIsEmpty(newState, prevState);
  newState.appraisalAgencyInfoInvalid = appraisalAgencyInfoInvalid;
  newState.appraisalAgencyInfoValid =
    !appraisalAgencyInfoInvalid && !appraisalAgencyInfoEmpty;
}

export function checkIsEmpty(
  newState: AppraisalAgencyInformationState,
  prevState: AppraisalAgencyInformationState
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
