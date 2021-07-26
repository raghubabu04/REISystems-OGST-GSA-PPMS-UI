import { saleMethodPBSDOI } from "../common/Constants";

export interface TransactionPBSDOIState {
  data: {
    salesMethod: string;
    fiscalYear: string;
    region: string;
    regionCode: string;
    salesNumber: string;
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      phoneExtension: string;
      fax: string;
    };
    pointOfContact: string;
    status: string;
  };
  other: {
    submitButtonDisabled: boolean;
    showActionHistoryModal: boolean;
    actionHistoryData: any;
    validity: boolean;
  };
  validation: {
    saleMethodDisabled: boolean;
    saleMethodIsInvalid: boolean;
    saleMethodValidationMessage: string;
    regionIsInavlid: boolean;
    regionValidationMessage: string;
    fiscalYearDisabled: boolean;
    fiscalYearIsInvalid: boolean;
    fiscalYearValidationMessage: string;
    regionDisabled: boolean;
    saleNumberDisabled: boolean;
    saleNumberIsInvalid: boolean;
    saleNumberValidationMessage: string;
    generateSaleNumberButtonDisabled: boolean;
    realitySpecialistOrSCOFieldsDisabled: boolean;
    firstNameIsInvalid: boolean;
    firstNameValidationMessage: string;
    lastNameIsInvalid: boolean;
    lastNameValidationMessage: string;
    emailAddressIsInvalid: boolean;
    emailAddressValidationMessage: string;
    phoneNumberIsInvalid: boolean;
    phoneNumberValidationMessage: string;
    extnIsInvalid: boolean;
    extnValidationMessage: string;
    faxNumberIsInvalid: boolean;
    faxNumberValidationMessage: string;
  };
  constants: {
    saleMethodPBSDOI: any;
    regionPBSDOI: any;
  };
}

export const TransactionPBSDOIStateDefault: TransactionPBSDOIState = {
  data: {
    salesMethod: "",
    fiscalYear: "",
    region: "",
    regionCode: "",
    salesNumber: "",
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      phoneExtension: "",
      fax: "",
    },
    pointOfContact: "",
    status: "",
  },
  other: {
    submitButtonDisabled: true,
    showActionHistoryModal: false,
    actionHistoryData: "",
    validity: false,
  },
  validation: {
    saleMethodDisabled: false,
    saleMethodIsInvalid: false,
    saleMethodValidationMessage: "",
    regionIsInavlid: false,
    regionValidationMessage: "",
    fiscalYearDisabled: false,
    fiscalYearIsInvalid: false,
    fiscalYearValidationMessage: "",
    regionDisabled: false,
    saleNumberDisabled: true,
    saleNumberIsInvalid: false,
    saleNumberValidationMessage: "",
    generateSaleNumberButtonDisabled: true,
    realitySpecialistOrSCOFieldsDisabled: false,
    firstNameIsInvalid: false,
    firstNameValidationMessage: "",
    lastNameIsInvalid: false,
    lastNameValidationMessage: "",
    emailAddressIsInvalid: false,
    emailAddressValidationMessage: "",
    phoneNumberIsInvalid: false,
    phoneNumberValidationMessage: "",
    extnIsInvalid: false,
    extnValidationMessage: "",
    faxNumberIsInvalid: false,
    faxNumberValidationMessage: "",
  },
  constants: {
    saleMethodPBSDOI: saleMethodPBSDOI,
    regionPBSDOI: [],
  },
};
