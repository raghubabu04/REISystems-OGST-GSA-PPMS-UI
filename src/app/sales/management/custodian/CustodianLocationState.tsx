export interface CustodianLocationState {
  franconiaOptions: any[];
  data: {
    custodian: {
      lotCustodianId: number;
      franconiaAsset: boolean;
      salesId: number;
      lotIds: any;
      notes: string;
      custodianInformation: {
        firstName: string;
        lastName: string;
        email: string;
        ccEmail: string;
        phone: string;
        phoneExtension: string;
        agencyBureauCd: string;
        contactId: string;
        addressDTO: {
          addressLine1: string;
          addressLine2: string;
          addressLine3: string;
          city: string;
          state: string;
          zipCode: string;
          zipExtn: string;
        };
      };
      updateAssignedLots: boolean;
    };
    listOfCustodians: any[];
  };
  icnList: {
    data: any[];
    selectedLot: number;
    page: any;
  };
  validation: {
    userEmailDisable: boolean;
    userEmailIsValid: boolean;
    userEmailIsInvalid: boolean;
    userEmailValidationMessage: string;
    userPhoneIsInvalid: boolean;
    userPhoneValidationMessage: string;
    userPhoneExtnIsInvalid: boolean;
    userPhoneExtnValidationMessage: string;
    userFirstNameIsInvalid: boolean;
    userFirstNameValidationMessage: string;
    userLastNameIsInvalid: boolean;
    userLastNameValidationMessage: string;
    userCCEmailIsValid: boolean;
    userCCEmailIsInvalid: boolean;
    userCCEmailValidationMessage: string;
    agencyBureauIsInvalid: boolean;
    agencyBureauIsValid: boolean;
    agencyBureauValidationMessage: string;
    saveBtnDisabled: boolean;
    assignBtnDisabled: boolean;
    addCustodianBtnDisable: boolean;
    addCustodianBtnLoading: boolean;
    userCCEmailDisable: boolean;
    addressLine1ValidationMessage: string;
    addressLine1isValid: boolean;
    addressLine1isInvalid: boolean;

    addressLine2ValidationMessage: string;
    addressLine2isValid: boolean;
    addressLine2isInvalid: boolean;

    cityValidationMessage: string;
    cityisValid: boolean;
    cityisInvalid: boolean;

    zipcodeValidationMessage: string;
    zipcodeisValid: boolean;
    zipcodeisInvalid: boolean;

    zipcodeExtensionValidationMessage: string;
    zipcodeExtensionisValid: boolean;
    zipcodeExtensionisInvalid: boolean;

    stateisInvalid: boolean;

    submitToCustodianDisabled: boolean;
  };
  other: {
    lotNumber: number;
    emailAddress: string;
    custodianModal: boolean;
    custodianDisabledOnly: boolean;
    showNoResultsModal: boolean;
    modalMessage: string;
    lotOptions: any;
    agencyBureaus: any;
    lotsList: any;
    editLots: any;
    page: any;
    emailNew: boolean;
    actionDisabled: boolean;
    salesDetails: any;
    locationDisableOnly: boolean;
    edit: boolean;
    fscCodes: any[];
    fscCodeList: any[];
    fcsSelectedValues: any[];
    itemControlNumber: string;
    icnIsInvalid: boolean;
    icnIsValid: boolean;
    icnValidationMessage: string;
    aacId: string;
    aacIsInvalid: boolean;
    aacIsValid: boolean;
    aacValidationMessage: string;

    agencyBureauIsInvalid: boolean;
    agencyBureauIsValid: boolean;
    agencyBureauValidationMessage: string;
    selectedAgencyBureaus: any[];
    selectedPropertyType: any;
    propertyTypeIsInvalid: boolean;
    propertyTypeIsValid: boolean;
    propertyTypeValidationMessage: string;
    includeExclude?: string;
    isChecked?: boolean;
  };
  filters: {
    lotNumber: number;
    emailAddress: string;
    agency: any;
    include: string;
    propType: string;
    fsc: any[];
    icn: string;
    lotName: string;
  };
}

export const CustodianLocationStateDefault: CustodianLocationState = {
  franconiaOptions: [
    { value: "Yes", id: "Y", isSelected: false },
    { value: "No", id: "N", isSelected: true },
  ],
  data: {
    custodian: {
      lotCustodianId: null,
      franconiaAsset: false,
      salesId: 0,
      lotIds: [],
      notes: "",
      custodianInformation: {
        firstName: "",
        lastName: "",
        email: "",
        ccEmail: "",
        phone: "",
        phoneExtension: "",
        agencyBureauCd: "",
        contactId: null,
        addressDTO: {
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          city: "",
          state: "",
          zipCode: "",
          zipExtn: "",
        },
      },
      updateAssignedLots: false,
    },
    listOfCustodians: [],
  },
  icnList: {
    data: [],
    selectedLot: null,
    page: {
      currentPage: 1,
      totalRows: 0,
      pageSize: 10,
    },
  },
  validation: {
    userEmailDisable: true,
    userEmailIsValid: false,
    userEmailIsInvalid: false,
    userEmailValidationMessage: "",
    userPhoneIsInvalid: false,
    userPhoneValidationMessage: "",
    userPhoneExtnIsInvalid: false,
    userPhoneExtnValidationMessage: "",
    userFirstNameIsInvalid: false,
    userFirstNameValidationMessage: "",
    userLastNameIsInvalid: false,
    userLastNameValidationMessage: "",
    userCCEmailIsValid: false,
    userCCEmailIsInvalid: false,
    userCCEmailValidationMessage: "",
    agencyBureauIsInvalid: false,
    agencyBureauIsValid: false,
    agencyBureauValidationMessage: "",
    saveBtnDisabled: true,
    assignBtnDisabled: true,
    addCustodianBtnDisable: true,
    addCustodianBtnLoading: true,
    userCCEmailDisable: true,

    addressLine1ValidationMessage: "",
    addressLine1isValid: false,
    addressLine1isInvalid: false,

    addressLine2ValidationMessage: "",
    addressLine2isValid: false,
    addressLine2isInvalid: false,

    cityValidationMessage: "",
    cityisValid: false,
    cityisInvalid: false,

    zipcodeValidationMessage: "",
    zipcodeisValid: false,
    zipcodeisInvalid: false,

    zipcodeExtensionValidationMessage: "",
    zipcodeExtensionisValid: false,
    zipcodeExtensionisInvalid: false,

    stateisInvalid: false,
    submitToCustodianDisabled: true,
  },
  other: {
    lotNumber: null,
    emailAddress: "",
    custodianModal: false,
    custodianDisabledOnly: true,
    showNoResultsModal: false,
    modalMessage: "",
    lotOptions: [],
    agencyBureaus: [],
    lotsList: [],
    editLots: [],
    page: {
      currentPage: 1,
      totalRows: 0,
      pageSize: 10,
    },
    emailNew: false,
    actionDisabled: true,
    salesDetails: [],
    locationDisableOnly: true,
    edit: false,
    fscCodes: [],
    fscCodeList: [],
    fcsSelectedValues: [],
    itemControlNumber: "",
    icnIsInvalid: false,
    icnIsValid: false,
    icnValidationMessage: "",
    aacId: "",
    aacIsInvalid: false,
    aacIsValid: false,
    aacValidationMessage: "",
    agencyBureauIsInvalid: false,
    agencyBureauIsValid: false,
    agencyBureauValidationMessage: "",
    selectedAgencyBureaus: [],
    selectedPropertyType: "",
    propertyTypeIsInvalid: false,
    propertyTypeIsValid: false,
    propertyTypeValidationMessage: "",
    includeExclude: "Include",
    isChecked: false,
  },
  filters: {
    lotNumber: null,
    emailAddress: "",
    agency: "",
    include: "Include",
    propType: "",
    fsc: [],
    icn: "",
    lotName: "",
  },
};
