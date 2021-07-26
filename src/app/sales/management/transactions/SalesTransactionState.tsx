import {
  addressDTO,
  contactDTO,
  dedicatedRegister,
  pointOfContact,
  saleMethod,
  templateCode,
  time,
} from "./constants/Constants";

export interface SalesTransactionState {
  data: {
    salesNumberDetails: {
      id: number;
      salesMethod: string;
      salesMethodValue: string;
      salesDate: string;
      salesTime: string;
      salesNumber: string;
      salesDescription: string;
      templateCode: string;
      paymentDueDate: string;
      removalDueDate: string;
      zoneId: any;
      sco: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        phoneExtension: string;
        fax: string;
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
      alternateSCO: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        phoneExtension: string;
        fax: string;
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
      marketingSpecialist: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        phoneExtension: string;
        fax: string;
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
      pointOfContact: string;
      isDedicatedRegister?: boolean;
    };
    gsaPointOfContact: {
      salesLocationAAC: string;
      agencyName: string;
      addressDTO: {
        addressLine1: string;
        addressLine2: string;
        addressLine3: string;
        city: string;
        state: string;
        zipCode: string;
        zipExtn: string;
      };
      contact: string;
      phoneNumber: string;
      extn: string;
    };
  };
  validation: {
    salesDescInvalid: boolean;
    salesDescValidationMsg: string;
    salesTemplateCodeInvalid: boolean;
    salesTemplateCodeValidationMsg: string;
    paymentDueDateInvalid: boolean;
    paymentDueDateValidationMsg: string;
    removalDueDateInvalid: boolean;
    removalDueDateValidationMsg: string;
    alternateSCOInvalid: boolean;
    alternateSCOValidationMsg: string;
    saleTimeisInvalid: boolean;
    soc: string;
    salesTimeValidationMessage: string;
    contactInvalid: boolean;
    contactValidationMessage: string;

    contactAddressLine1ValidationMessage: string;
    contactAddressLine1isValid: boolean;
    contactAddressLine1isInvalid: boolean;

    contactAddressLine2ValidationMessage: string;
    contactAddressLine2isValid: boolean;
    contactAddressLine2isInvalid: boolean;

    contactCityValidationMessage: string;
    contactCityisValid: boolean;
    contactCityisInvalid: boolean;

    contactZipcodeValidationMessage: string;
    contactZipcodeisValid: boolean;
    contactZipcodeisInvalid: boolean;

    contactPhoneValidationMessage: string;
    contactPhoneisValid: boolean;
    contactPhoneisInvalid: boolean;

    contactPhoneExtnValidationMessage: string;
    contactPhoneExtnisValid: boolean;
    contactPhoneExtnisInvalid: boolean;

    contactStateisInvalid: boolean;
    submitBtnDisable: boolean;
    saleDateValidationMessage: string;
    saleWeekendDate: boolean;
    saleDateInValid: boolean;
  };
  constants: {
    alternateSCO: any[];
    marketingSpecialist: any[];
    pointOfContact: any[];
    saleMethod: any[];
    templateCode: any[];
    time: any[];
  };
  other: {
    clearData: number;
    isReadOnly: boolean;
    amPm: string;
  };
  readonly: {
    saleMethodsIsDisabled?: boolean;
    saleDateIsDisabled?: boolean;
    saleTimeIsReadOnly?: boolean;
    timeToggleIsDisabled?: boolean;
    generateSaleBtnIsDisabled?: boolean;
    saleDescriptionIsReadOnly?: boolean;
    templateCodeIsReadOnly?: boolean;
  };
  required: {
    saleDescriptionIsRequired?: boolean;
    templateCodeIsRequired?: boolean;
    paymentDueDateIsRequired?: boolean;
    removalDueDateIsRequired?: boolean;
    scoIsRequired?: boolean;
    alternateSCOIsRequired?: boolean;
    marketingSpecialistIsRequired?: boolean;
    pointOfContactIsRequired?: boolean;
  };
  showActionHistoryModal?: boolean;
  actionHistoryData?: any;
  dedicatedRegisterOptions: any[];
}

export const SalesTransactionStateDefault: SalesTransactionState = {
  data: {
    salesNumberDetails: {
      id: null,
      salesMethod: "",
      salesMethodValue: "",
      salesDate: "",
      salesTime: "",
      salesNumber: "",
      salesDescription: "",
      templateCode: "",
      paymentDueDate: "",
      removalDueDate: "",
      zoneId: "",
      sco: contactDTO(),
      alternateSCO: contactDTO(),
      marketingSpecialist: contactDTO(),
      pointOfContact: "POC-SCO",
      isDedicatedRegister: false,
    },
    gsaPointOfContact: {
      salesLocationAAC: "",
      agencyName: "",
      addressDTO: addressDTO(),
      contact: "",
      phoneNumber: "",
      extn: "",
    },
  },
  validation: {
    salesDescInvalid: false,
    saleTimeisInvalid: false,
    salesDescValidationMsg: "Description is required",
    salesTemplateCodeInvalid: false,
    salesTemplateCodeValidationMsg:
      "An invalid Template Code was entered, please enter a valid template code with a maximum of 4 alphanumeric characters.",
    paymentDueDateInvalid: false,
    paymentDueDateValidationMsg: "Payment Due Date is required",
    removalDueDateInvalid: false,
    removalDueDateValidationMsg: "Removal Due Date is required",
    alternateSCOInvalid: false,
    alternateSCOValidationMsg: "An Alternate SCO is required to select",
    soc: "",
    salesTimeValidationMessage: "Sale time is required",
    contactInvalid: false,
    contactValidationMessage: "Invalid contact",
    contactAddressLine1ValidationMessage: "Invalid address line 1",
    contactAddressLine1isValid: false,
    contactAddressLine1isInvalid: false,

    contactAddressLine2ValidationMessage: "Invalid address line 2",
    contactAddressLine2isValid: false,
    contactAddressLine2isInvalid: false,

    contactCityValidationMessage: "Invalid city",
    contactCityisValid: false,
    contactCityisInvalid: false,

    contactZipcodeValidationMessage: "Invalid zipcode",
    contactZipcodeisValid: false,
    contactZipcodeisInvalid: false,

    contactPhoneValidationMessage: "Invalid phone number",
    contactPhoneisValid: false,
    contactPhoneisInvalid: false,

    contactPhoneExtnValidationMessage: "Invalid phone extension",
    contactPhoneExtnisValid: false,
    contactPhoneExtnisInvalid: false,

    contactStateisInvalid: false,
    submitBtnDisable: true,
    saleDateInValid: false,
    saleDateValidationMessage: "",
    saleWeekendDate: false,
  },
  constants: {
    alternateSCO: [],
    marketingSpecialist: [],
    pointOfContact: pointOfContact(),
    saleMethod: saleMethod,
    templateCode: templateCode,
    time: time(),
  },
  other: {
    clearData: 0,
    isReadOnly: false,
    amPm: "AM",
  },
  readonly: {
    saleMethodsIsDisabled: false,
    saleTimeIsReadOnly: false,
    timeToggleIsDisabled: false,
    generateSaleBtnIsDisabled: false,
    saleDescriptionIsReadOnly: false,
    templateCodeIsReadOnly: false,
  },
  required: {
    saleDescriptionIsRequired: true,
    templateCodeIsRequired: false,
    paymentDueDateIsRequired: false,
    removalDueDateIsRequired: false,
    scoIsRequired: true,
    alternateSCOIsRequired: false,
    marketingSpecialistIsRequired: false,
    pointOfContactIsRequired: true,
  },
  showActionHistoryModal: false,
  actionHistoryData: [],
  dedicatedRegisterOptions: [
    {
      id: "Y",
      value: "Yes",
      isSelected: false,
    },
    {
      id: "N",
      value: "No",
      isSelected: true,
    },
  ],
};
