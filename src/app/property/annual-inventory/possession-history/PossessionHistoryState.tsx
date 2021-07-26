export interface PossessionHistoryState {
  statusComment: string;
  statusCode: string;
  statusSaveButtonDisabled: boolean;
  updateStatusButtonDisabled: boolean;
  displayStatusCode: string;

  transferComment: string;

  transerButtonDisabled: boolean;

  doneeTileEmail: string;
  doneeTileFirstName: string;
  doneeTileLastName: string;
  doneeTileMiddleName: string;
  doneeTilePhoneNumber: string;
  doneeTileOrg: string;
  doneeTileTitle: string;
  doneeTilePhoneExt: string;

  doneeShippingId: string;

  doneeTileShippingAddressLine1: string;
  doneeTileShippingAddressLine2: string;
  doneeTileShippingAddressLine3: string;
  doneeTileShippingCity: string;
  doneeTileShippingStateCode: string;
  doneeTileShippingState: string;
  doneeTileShippingZipcode: string;
  doneeTileShippingZipExt: string;

  doneeShippingAddressLine1: string;
  doneeShippingAddressLine2: string;
  doneeShippingAddressLine3: string;
  doneeShippingCity: string;
  doneeShippingStateCode: string;
  doneeShippingZipcode: string;
  doneeShippingZipExt: string;

  doneeInfoUserId: string;
  doneeInfoAddressId: string;
  doneeInfoEmail: string;
  doneeInfoFirstName: string;
  doneeInfoMiddleName: string;
  doneeInfoLastName: string;
  doneeInfoPhone: string;
  doneeInfoPhoneExt: string;
  doneeInfoOrgName: string;
  doneeInfoTitle: string;
  doneeInfoAddressLine1: string;
  doneeInfoAddressLine2: string;
  doneeInfoAddressLine3: string;
  doneeInfoCity: string;
  doneeInfoState: string;
  doneeInfoZipcode: string;
  doneeInfoZipExt: string;

  doneeInfoApprovalOfficerEmail: string;
  doneeInfoApprovalOfficerEmailIsInvalid: boolean;
  doneeInfoApprovalOfficerEmailValidationMessage: string;
  doneeInfoApprovalOfficerFirstName: string;
  doneeInfoApprovalOfficerMiddleName: string;
  doneeInfoApprovalOfficerLastName: string;

  showDoneeAlert: boolean;
  doneeAlertMessage: string;
  doneeInfoEmailIsInvalid: boolean;
  doneeInfoEmailIsValid: boolean;
  doneeInfoEmailValidationMessage: string;
  doneeInfoFirstNameIsInvalid: boolean;
  doneeInfoFirstNameValidationMessage: string;
  doneeInfoLastNameIsInvalid: boolean;
  doneeInfoLastNameValidationMessage: string;
  doneeInfoPhoneIsInvalid: boolean;
  doneeInfoPhoneValidationMessage: string;
  doneeInfoOrgNameIsInvalid: boolean;
  doneeInfoOrgNameValidationMessage: string;
  doneeInfoTitleIsInvalid: boolean;
  doneeInfoTitleValidationMessage: string;
  doneeInfoAddressLine1IsInvalid: boolean;
  doneeInfoAddressLine1ValidationMessage: string;
  doneeInfoAddressLine2IsInvalid: boolean;
  doneeInfoAddressLine2ValidationMessage: string;
  doneeInfoAddressLine3IsInvalid: boolean;
  doneeInfoAddressLine3ValidationMessage: string;
  doneeInfoCityIsInvalid: boolean;
  doneeInfoCityValidationMessage: string;
  doneeInfoStateIsInvalid: boolean;
  doneeInfoStateValidationMessage: string;
  doneeInfoZipcodeIsInvalid: boolean;
  doneeInfoZipcodeValidationMessage: string;
  doneeInfoZipExtIsInvalid: boolean;
  doneeInfoZipExtValidationMessage: string;

  doneeShippingAddressLine1IsInvalid: boolean;
  doneeShippingAddressLine1IsValid: boolean;
  doneeShippingAddressLine1ValidationMessage: string;
  doneeShippingAddressLine1IsRequired: boolean;
  doneeShippingAddressLine2IsInvalid: boolean;
  doneeShippingAddressLine2ValidationMessage: string;
  doneeShippingAddressLine2IsRequired: boolean;
  doneeShippingAddressLine3IsInvalid: boolean;
  doneeShippingAddressLine3ValidationMessage: string;
  doneeShippingAddressLine3IsRequired: boolean;
  doneeShippingCityIsInvalid: boolean;
  doneeShippingCityIsValid: boolean;
  doneeShippingCityValidationMessage: string;
  doneeShippingCityIsRequired: boolean;
  doneeShippingStateIsInvalid: boolean;
  doneeShippingStateIsValid: boolean;
  doneeShippingStateValidationMessage: string;
  doneeShippingStateIsRequired: boolean;
  doneeShippingZipcodeIsInvalid: boolean;
  doneeShippingZipcodeIsValid: boolean;
  doneeShippingZipcodeValidationMessage: string;
  doneeShippingZipCodeIsRequired: boolean;
  doneeShippingZipExtIsInvalid: boolean;
  doneeShippingZipExtValidationMessage: string;

  dateOfTransfer: Date;
  dateOfTransferIsRequired: boolean;
  dateOfTransferIsInValid: boolean;
  dateOfTransferMsg: string;

  receiveDateTransfer: Date;

  isValidEmail: boolean;
  dateIsSelected: boolean;
  transferSaveButtonDisabled: boolean;
}

export const PossessionHistoryStateDefault: PossessionHistoryState = {
  statusComment: "",
  statusCode: "",
  statusSaveButtonDisabled: true,
  updateStatusButtonDisabled: false,
  displayStatusCode: "",
  transferComment: "",

  transerButtonDisabled: false,

  doneeTileEmail: "",
  doneeTileFirstName: "",
  doneeTileLastName: "",
  doneeTileMiddleName: "",
  doneeTilePhoneNumber: "",
  doneeTilePhoneExt: "",
  doneeTileOrg: "",
  doneeTileTitle: "",

  doneeShippingId: "",

  doneeTileShippingAddressLine1: "",
  doneeTileShippingAddressLine2: "",
  doneeTileShippingAddressLine3: "",
  doneeTileShippingCity: "",
  doneeTileShippingStateCode: "",
  doneeTileShippingState: "",
  doneeTileShippingZipcode: "",
  doneeTileShippingZipExt: "",

  doneeShippingAddressLine1: "",
  doneeShippingAddressLine2: "",
  doneeShippingAddressLine3: "",
  doneeShippingCity: "",
  doneeShippingStateCode: "",
  doneeShippingZipcode: "",
  doneeShippingZipExt: "",

  doneeShippingAddressLine1IsInvalid: false,
  doneeShippingAddressLine1IsValid: false,
  doneeShippingAddressLine1ValidationMessage: "",
  doneeShippingAddressLine1IsRequired: true,
  doneeShippingAddressLine2IsInvalid: false,
  doneeShippingAddressLine2ValidationMessage: "",
  doneeShippingAddressLine2IsRequired: true,
  doneeShippingAddressLine3IsInvalid: false,
  doneeShippingAddressLine3ValidationMessage: "",
  doneeShippingAddressLine3IsRequired: true,
  doneeShippingCityIsInvalid: false,
  doneeShippingCityIsValid: false,
  doneeShippingCityValidationMessage: "",
  doneeShippingCityIsRequired: true,
  doneeShippingStateIsInvalid: false,
  doneeShippingStateIsValid: false,
  doneeShippingStateValidationMessage: "",
  doneeShippingStateIsRequired: true,
  doneeShippingZipcodeIsInvalid: false,
  doneeShippingZipcodeIsValid: false,
  doneeShippingZipcodeValidationMessage: "",
  doneeShippingZipCodeIsRequired: true,
  doneeShippingZipExtIsInvalid: false,
  doneeShippingZipExtValidationMessage: "",

  showDoneeAlert: false,
  doneeAlertMessage: "",
  doneeInfoUserId: "",
  doneeInfoAddressId: "",
  doneeInfoEmail: "",
  doneeInfoFirstName: "",
  doneeInfoMiddleName: "",
  doneeInfoLastName: "",
  doneeInfoPhone: "",
  doneeInfoPhoneExt: "",
  doneeInfoOrgName: "",
  doneeInfoTitle: "",
  doneeInfoAddressLine1: "",
  doneeInfoAddressLine2: "",
  doneeInfoAddressLine3: "",
  doneeInfoCity: "",
  doneeInfoState: "",
  doneeInfoZipcode: "",
  doneeInfoZipExt: "",
  doneeInfoApprovalOfficerEmail: "",
  doneeInfoApprovalOfficerFirstName: "",
  doneeInfoApprovalOfficerMiddleName: "",
  doneeInfoApprovalOfficerLastName: "",

  doneeInfoApprovalOfficerEmailIsInvalid: false,
  doneeInfoApprovalOfficerEmailValidationMessage: "",
  doneeInfoEmailIsInvalid: false,
  doneeInfoEmailIsValid: false,
  doneeInfoEmailValidationMessage: "",
  doneeInfoFirstNameIsInvalid: false,
  doneeInfoFirstNameValidationMessage: "First Name is Required.",
  doneeInfoLastNameIsInvalid: false,
  doneeInfoLastNameValidationMessage: "Last Name is Required.",
  doneeInfoPhoneIsInvalid: false,
  doneeInfoPhoneValidationMessage: "",
  doneeInfoOrgNameIsInvalid: false,
  doneeInfoOrgNameValidationMessage: "Organization Name is Required.",
  doneeInfoTitleIsInvalid: false,
  doneeInfoTitleValidationMessage: "",
  doneeInfoAddressLine1IsInvalid: false,
  doneeInfoAddressLine1ValidationMessage: "",
  doneeInfoAddressLine2IsInvalid: false,
  doneeInfoAddressLine2ValidationMessage: "",
  doneeInfoAddressLine3IsInvalid: false,
  doneeInfoAddressLine3ValidationMessage: "",
  doneeInfoCityIsInvalid: false,
  doneeInfoCityValidationMessage: "",
  doneeInfoStateIsInvalid: false,
  doneeInfoStateValidationMessage: "",
  doneeInfoZipcodeIsInvalid: false,
  doneeInfoZipcodeValidationMessage: "",
  doneeInfoZipExtIsInvalid: false,
  doneeInfoZipExtValidationMessage: "",

  dateOfTransfer: null,
  dateOfTransferIsRequired: true,
  dateOfTransferIsInValid: false,
  dateOfTransferMsg: "",

  receiveDateTransfer: null,

  isValidEmail: false,
  dateIsSelected: false,
  transferSaveButtonDisabled: true,
};

export const defaultDoneeInfoDetails = {
  doneeInfoAddressId: "",
  doneeInfoEmail: "",
  doneeInfoFirstName: "",
  doneeInfoMiddleName: "",
  doneeInfoLastName: "",
  doneeInfoPhone: "",
  doneeInfoPhoneExt: "",
  doneeInfoOrgName: "",
  doneeInfoTitle: "",
  doneeInfoAddressLine1: "",
  doneeInfoAddressLine2: "",
  doneeInfoAddressLine3: "",
  doneeInfoCity: "",
  doneeInfoZipcode: "",
  doneeInfoZipExt: "",
  doneeInfoApprovalOfficerEmail: "",
  doneeInfoAac: "",
  doneeInfoAacCodes: [],
  doneeInfoagencyBureauCd: "",
  doneeInfonuoEmailAddress: "",
  doneeInfoPermissions: [],
  doneeInfofedContractorNonFedRecipientDonee: false,
  doneeInfoApprovalOfficerEmailIsInvalid: false,
  doneeInfoApprovalOfficerEmailValidationMessage: "",
  doneeInfoEmailIsInvalid: false,
  doneeInfoEmailIsValid: false,
  doneeInfoEmailValidationMessage: "",
  doneeInfoFirstNameIsInvalid: false,
  doneeInfoFirstNameValidationMessage: "First Name is Required.",
  doneeInfoLastNameIsInvalid: false,
  doneeInfoLastNameValidationMessage: "Last Name is Required.",
  doneeInfoPhoneIsInvalid: false,
  doneeInfoPhoneValidationMessage: "",
  doneeInfoOrgNameIsInvalid: false,
  doneeInfoOrgNameValidationMessage: "Organization Name is Required.",
  doneeInfoTitleIsInvalid: false,
  doneeInfoTitleValidationMessage: "",
  doneeInfoAddressLine1IsInvalid: false,
  doneeInfoAddressLine1ValidationMessage: "",
  doneeInfoAddressLine2IsInvalid: false,
  doneeInfoAddressLine2ValidationMessage: "",
  doneeInfoAddressLine3IsInvalid: false,
  doneeInfoAddressLine3ValidationMessage: "",
  doneeInfoCityIsInvalid: false,
  doneeInfoCityValidationMessage: "",
  doneeInfoStateIsInvalid: false,
  doneeInfoStateValidationMessage: "",
  doneeInfoZipcodeIsInvalid: false,
  doneeInfoZipcodeValidationMessage: "",
  doneeInfoZipExtIsInvalid: false,
  doneeInfoZipExtValidationMessage: "",
  doneeInfoApprovalOfficerFirstName: "",
  doneeInfoApprovalOfficerMiddleName: "",
  doneeInfoApprovalOfficerLastName: "",
  showDoneeAlert: false,
  doneeAlertMessage: "",

  transferComment: "",

  isValidEmail: false,
  dateIsSelected: false,
  transferSaveButtonDisabled: true,

  dateOfTransfer: null,
};
