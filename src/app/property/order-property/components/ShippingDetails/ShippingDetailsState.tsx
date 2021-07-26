export interface ShippingDetailsState {
  activityAddressCode: string;
  userFirstName: string;
  userMiddleName: string;
  userLastName: string;
  userPhone: string;
  userPhoneExt: string;
  userFax: string;
  userEmail: string;
  userId: string;
  cartId: string;

  contactId: string;
  userFirstNameModal: string;
  userMiddleNameModal: string;
  userLastNameModal: string;
  userPhoneModal: string;
  userPhoneExtModal: string;
  userFaxModal: string;
  userEmailModal: string;

  agencyApprovalOfficerFirstNameModal?: string;
  agencyApprovalOfficerMiddleNameModal?: string;
  agencyApprovalOfficerLastNameModal?: string;
  agencyApprovalOfficerFaxModal?: string;
  agencyApprovalOfficerPhoneModal?: string;
  agencyApprovalOfficerPhoneExtModal?: string;
  agencyApprovalOfficerAgencyBureauModal?: string;
  agencyApprovalOfficerEmailModal: string;
  isExistingAPO: boolean;
  showEditButtons?: boolean;
  showLeaInfo: boolean;
  showLeaInfoByRequestor: boolean;
  agencyApprovalOfficerFirstName: string;
  agencyApprovalOfficerMiddleName: string;
  agencyApprovalOfficerLastName: string;
  agencyApprovalOfficerFax: string;
  agencyApprovalOfficerPhone: string;
  agencyApprovalOfficerPhoneExt: string;
  agencyApprovalOfficerEmail: string;
  agencyApprovalOfficerRoom: string;
  agencyApprovalOfficerAgencyBureau: string;
  agencyApprovalOfficerAddressLine1: string;
  agencyApprovalOfficerAddressLine2: string;
  agencyApprovalOfficerAddressLine3: string;

  shippingDetailsAttn: string;
  shippingDetailsAddressLine1: string;
  shippingDetailsAddressLine2: string;
  shippingDetailsAddressLine3: string;
  shippingDetailsCity: string;
  shippingDetailsState: string;
  shippingDetailsZipcode: string;
  shippingDetailsInstructions: string;
  justification: string;

  agencyApprovalOfficerFirstNameIsInValid: boolean;
  agencyApprovalOfficerMiddleNameIsInValid: boolean;
  agencyApprovalOfficerLastNameIsInValid: boolean;
  agencyApprovalOfficerFaxIsInValid: boolean;
  agencyApprovalOfficerPhoneIsInValid: boolean;
  agencyApprovalOfficerPhoneExtIsInValid: boolean;
  agencyApprovalOfficerEmailIsInValid: boolean;
  agencyApprovalOfficerEmailIsValid: boolean;

  agencyApprovalOfficerFirstNameValidationMessage: string;
  agencyApprovalOfficerMiddleNameValidationMessage: string;
  agencyApprovalOfficerLastNameValidationMessage: string;
  agencyApprovalOfficerFaxValidationMessage: string;
  agencyApprovalOfficerPhoneValidationMessage: string;
  agencyApprovalOfficerPhoneExtValidationMessage: string;
  agencyApprovalOfficerEmailValidationMessage: string;

  doneeTileEmail: string;
  doneeTileFirstName: string;
  doneeTileLastName: string;
  doneeTileMiddleName: string;
  doneeTilePhoneNumber: string;
  doneeTileOrg: string;
  doneeTileTitle: string;
  doneeTilePhoneExt: string;

  doneeShippingId: string;

  doneeTileShippingAddressAttn: string;
  doneeTileShippingAddressLine1: string;
  doneeTileShippingAddressLine2: string;
  doneeTileShippingAddressLine3: string;
  doneeTileShippingCity: string;
  doneeTileShippingStateCode: string;
  doneeTileShippingState: string;
  doneeTileShippingZipcode: string;
  doneeTileShippingZipExt: string;
  doneeTileShippingInstructions: string;

  doneeShippingAddressAttn: string;
  doneeShippingAddressLine1: string;
  doneeShippingAddressLine2: string;
  doneeShippingAddressLine3: string;
  doneeShippingCity: string;
  doneeShippingStateCode: string;
  doneeShippingZipcode: string;
  doneeShippingZipExt: string;
  doneeShippingInstructions: string;
  doneeShippingSaveBtnDisabled: boolean;
  doneeShippingDetailsDisabled: boolean;

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

  doneeInfoUserDetailsDisabled: boolean;
  doneeInfoLeaDetailsDisabled: boolean;

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
  doneeInfodisabledZipExtension: boolean;

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
  doneeShippingdisabledZipExtension: boolean;
  leaEditRestricted: boolean;

  isShippingUpdated: boolean;

  validation: {
    shippingDetailsAddressLine1ValidationMessage: string;
    shippingDetailsAddressLine1isValid: boolean;
    shippingDetailsAddressLine1isInvalid: boolean;
    shippingDetailsAddressLine1isRequired: boolean;

    shippingDetailsAddressLine2ValidationMessage: string;
    shippingDetailsAddressLine2isValid: boolean;
    shippingDetailsAddressLine2isInvalid: boolean;
    shippingDetailsAddressLine2isRequired: boolean;

    shippingDetailsCityValidationMessage: string;
    shippingDetailsCityisValid: boolean;
    shippingDetailsCityisInvalid: boolean;
    shippingDetailsCityisRequired: boolean;

    shippingDetailsZipcodeValidationMessage: string;
    shippingDetailsZipcodeisValid: boolean;
    shippingDetailsZipcodeisInvalid: boolean;
    shippingDetailsZipcodeisRequired: boolean;

    shippingDetailsAttnValidationMessage: string;
    shippingDetailsAttnisValid: boolean;
    shippingDetailsAttnisInvalid: boolean;
    shippingDetailsSaveBtnDisabled: boolean;

    shippingDetailsStateisInvalid: boolean;

    activityAddressCodeIsInvalid: boolean;
    activityAddressCodeIsValid: boolean;
    activityAddressValidation: string;

    userEmailIsValid: boolean;
    userEmailIsInvalid: boolean;
    userEmailValidationMessage: string;
    requestorDetailsSaveBtnDisabled: boolean;
    userPhoneIsInvalid: boolean;
    userPhoneValidationMessage: string;
    userFaxIsInvalid: boolean;
    userFaxValidationMessage: string;
    userFirstNameIsInvalid: boolean;
    userFirstNameValidationMessage: string;
    userLastNameIsInvalid: boolean;
    userLastNameValidationMessage: string;

    agencyApprovalOfficerDetailsSaveBtnDisabled: boolean;
    agencyApprovalOfficerApprovalOfficermailValidationMessage: string;
  };
}

export const ShippingDetailsStateDefault: ShippingDetailsState = {
  activityAddressCode: "",
  userFirstName: "",
  userMiddleName: "",
  userLastName: "",
  userPhone: "",
  userPhoneExt: "",
  userFax: "",
  userEmail: "",
  userId: "",
  cartId: "",
  contactId: "",
  userFirstNameModal: "",
  userMiddleNameModal: "",
  userLastNameModal: "",
  userPhoneModal: "",
  userPhoneExtModal: "",
  userFaxModal: "",
  userEmailModal: "",
  agencyApprovalOfficerFirstName: "",
  agencyApprovalOfficerMiddleName: "",
  agencyApprovalOfficerLastName: "",
  agencyApprovalOfficerFax: "",
  agencyApprovalOfficerPhone: "",
  agencyApprovalOfficerPhoneExt: "",
  agencyApprovalOfficerEmail: "",
  agencyApprovalOfficerRoom: "",
  agencyApprovalOfficerAgencyBureau: "",
  agencyApprovalOfficerAddressLine1: "",
  agencyApprovalOfficerAddressLine2: "",
  agencyApprovalOfficerAddressLine3: "",
  agencyApprovalOfficerEmailModal: "",
  shippingDetailsAttn: "",
  shippingDetailsAddressLine1: "",
  shippingDetailsAddressLine2: "",
  shippingDetailsAddressLine3: "",
  shippingDetailsCity: "",
  shippingDetailsState: "",
  shippingDetailsZipcode: "",
  shippingDetailsInstructions: "",

  agencyApprovalOfficerFirstNameModal: "",
  agencyApprovalOfficerMiddleNameModal: "",
  agencyApprovalOfficerLastNameModal: "",
  agencyApprovalOfficerFaxModal: "",
  agencyApprovalOfficerPhoneModal: "",
  agencyApprovalOfficerPhoneExtModal: "",
  agencyApprovalOfficerAgencyBureauModal: "",
  isExistingAPO: true,

  justification: "",
  showEditButtons: true,
  showLeaInfo: false,
  showLeaInfoByRequestor: false,
  agencyApprovalOfficerFirstNameIsInValid: false,
  agencyApprovalOfficerMiddleNameIsInValid: false,
  agencyApprovalOfficerLastNameIsInValid: false,
  agencyApprovalOfficerFaxIsInValid: false,
  agencyApprovalOfficerPhoneIsInValid: false,
  agencyApprovalOfficerPhoneExtIsInValid: false,
  agencyApprovalOfficerEmailIsInValid: false,
  agencyApprovalOfficerEmailIsValid: false,

  agencyApprovalOfficerFirstNameValidationMessage: "",
  agencyApprovalOfficerMiddleNameValidationMessage: "",
  agencyApprovalOfficerLastNameValidationMessage: "",
  agencyApprovalOfficerFaxValidationMessage: "",
  agencyApprovalOfficerPhoneValidationMessage: "",
  agencyApprovalOfficerPhoneExtValidationMessage: "",
  agencyApprovalOfficerEmailValidationMessage: "",

  doneeTileEmail: "",
  doneeTileFirstName: "",
  doneeTileLastName: "",
  doneeTileMiddleName: "",
  doneeTilePhoneNumber: "",
  doneeTilePhoneExt: "",
  doneeTileOrg: "",
  doneeTileTitle: "",

  doneeShippingId: "",

  doneeTileShippingAddressAttn: "",
  doneeTileShippingAddressLine1: "",
  doneeTileShippingAddressLine2: "",
  doneeTileShippingAddressLine3: "",
  doneeTileShippingCity: "",
  doneeTileShippingStateCode: "",
  doneeTileShippingState: "",
  doneeTileShippingZipcode: "",
  doneeTileShippingZipExt: "",
  doneeTileShippingInstructions: "",

  doneeShippingAddressAttn: "",
  doneeShippingAddressLine1: "",
  doneeShippingAddressLine2: "",
  doneeShippingAddressLine3: "",
  doneeShippingCity: "",
  doneeShippingStateCode: "",
  doneeShippingZipcode: "",
  doneeShippingZipExt: "",
  doneeShippingInstructions: "",
  doneeShippingSaveBtnDisabled: false,
  doneeShippingDetailsDisabled: false,

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
  doneeShippingdisabledZipExtension: false,

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

  doneeInfoUserDetailsDisabled: false,
  doneeInfoLeaDetailsDisabled: false,

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
  doneeInfodisabledZipExtension: true,
  leaEditRestricted: false,

  isShippingUpdated: false,

  validation: {
    shippingDetailsAddressLine1ValidationMessage: "",
    shippingDetailsAddressLine1isValid: true,
    shippingDetailsAddressLine1isInvalid: false,
    shippingDetailsAddressLine1isRequired: true,

    shippingDetailsAddressLine2ValidationMessage: "",
    shippingDetailsAddressLine2isValid: true,
    shippingDetailsAddressLine2isInvalid: false,
    shippingDetailsAddressLine2isRequired: true,

    shippingDetailsCityValidationMessage: "",
    shippingDetailsCityisValid: true,
    shippingDetailsCityisInvalid: false,
    shippingDetailsCityisRequired: true,

    shippingDetailsZipcodeValidationMessage: "",
    shippingDetailsZipcodeisValid: true,
    shippingDetailsZipcodeisInvalid: false,
    shippingDetailsZipcodeisRequired: true,

    shippingDetailsAttnValidationMessage: "",
    shippingDetailsAttnisValid: true,
    shippingDetailsAttnisInvalid: false,
    shippingDetailsSaveBtnDisabled: false,

    shippingDetailsStateisInvalid: false,
    activityAddressCodeIsInvalid: false,
    activityAddressCodeIsValid: false,
    activityAddressValidation: "",
    agencyApprovalOfficerDetailsSaveBtnDisabled: false,
    agencyApprovalOfficerApprovalOfficermailValidationMessage: "",
    userEmailIsValid: false,
    userEmailIsInvalid: false,
    userEmailValidationMessage: "",
    requestorDetailsSaveBtnDisabled: false,
    userPhoneIsInvalid: false,
    userPhoneValidationMessage: "",
    userFaxIsInvalid: false,
    userFaxValidationMessage: "",
    userFirstNameIsInvalid: false,
    userFirstNameValidationMessage: "",
    userLastNameIsInvalid: false,
    userLastNameValidationMessage: "",
  },
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
  doneeInfoUserDetailsDisabled: false,
  doneeInfoLeaDetailsDisabled: false,
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
  doneeInfodisabledZipExtension: false,
  doneeInfoApprovalOfficerFirstName: "",
  doneeInfoApprovalOfficerMiddleName: "",
  doneeInfoApprovalOfficerLastName: "",
  showDoneeAlert: false,
  doneeAlertMessage: "",
};

export const defaultValidValidation = {};
