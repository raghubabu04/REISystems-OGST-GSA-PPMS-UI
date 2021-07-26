export const pointOfContact = () => {
  return [{ value: "SCO", id: "POC-SCO" }];
};

export const pointOfContactSelected = {
  SCO: "POC-SCO",
  ASCO: "POC-ASCO",
  MS: "POC-MS",
  RSASCO: "ASCO-empty",
  RSMS: "MS-empty",
};

export const saleMethod = [
  {
    id: "internet",
    value: "Internet",
  },
  {
    id: "vas",
    value: "Internet/VAS",
  },
  {
    id: "retail",
    value: "Fixed(Retail)",
  },
  {
    id: "sasp",
    value: "Fixed(SASP)",
  },
  {
    id: "buynow",
    value: "Fixed(Buy Now)",
  },
  {
    id: "negotiated",
    value: "Negotiated",
  },
  {
    id: "term",
    value: "Term",
  },
  {
    id: "sealed bid",
    value: "Sealed Bid",
  },
  {
    id: "live",
    value: "Live",
  },
];

export const saleFleetMethod = [
  {
    id: "Auction",
    value: "Auction",
  },
  {
    id: "F",
    value: "Formal",
  },
  {
    id: "Sealed / Informal",
    value: "Sealed / Informal",
  },
  {
    id: "N",
    value: "Negotiated",
  },
  {
    id: "R",
    value: "Retail",
  },
  {
    id: "S",
    value: "Spot",
  },
  {
    id: "T",
    value: "Term",
  },
  {
    id: "live sale",
    value: "Live Sale",
  },
];

export const templateCode = [
  {
    id: "buynow",
    value: "Fixed(Buy Now)",
    isSelected: false,
  },
  {
    id: "negotiated",
    value: "Negotiated",
    isSelected: false,
  },
  {
    id: "term",
    value: "Term",
    isSelected: false,
  },
  {
    id: "sealed bid",
    value: "Sealed Bid",
    isSelected: false,
  },
  {
    id: "live",
    value: "Live",
    isSelected: false,
  },
];

export const time = () => {
  return [
    {
      id: "am",
      value: "AM",
      isSelected: true,
    },
    {
      id: "pm",
      value: "PM",
      isSelected: false,
    },
  ];
};
export const dedicatedRegister = () => {
  return [
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
  ];
};
export const fromTime = [
  {
    id: "am",
    value: "AM",
    isSelected: true,
  },
  {
    id: "pm",
    value: "PM",
    isSelected: false,
  },
];

export const toTime = [
  {
    id: "am",
    value: "AM",
    isSelected: true,
  },
  {
    id: "pm",
    value: "PM",
    isSelected: false,
  },
];

export const modalFeatureItemOptions = [
  {
    value: "Featured Item",
    id: "featured-item",
    isSelected: false,
  },
];

export const defaultState = () => {
  return {
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
      saleDateIsDisabled: false,
      saleTimeIsReadOnly: false,
      timeToggleIsDisabled: false,
      generateSaleBtnIsDisabled: false,
      saleDescriptionIsReadOnly: false,
      templateCodeIsReadOnly: false,
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
};

export const addressDTO = () => {
  return {
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    zipCode: "",
    zipExtn: "",
  };
};

export const contactDTO = () => {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneExtension: "",
    fax: "",
    addressDTO: addressDTO(),
  };
};

export enum PaymentStatus {
  PAID = "PAID",
}

export enum PaymentMethod {
  CREDIT_CARD = "Credit Card",
  WIRE_TRANSFER = "Wire Transfer",
  CASH = "Cash",
  CHECK = "Check",
}
export enum BidStatus {
  ACTIVE = "Active",
  CLOSED = "Closed",
  PREVIEW = "Preview",
  AWARDED = "Awarded",
}

export enum BidderStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  DEFAULTED = "DEFAULTED",
}

export enum AwardStatus {
  AWARDED = "Awarded",
  CLOSED = "Closed",
  PENDING_AWRAD = "Award Pending",
}

export const NON_INTERNATE_SALES_METHOD = [
  "retail",
  "negotiated",
  "term",
  "sealed bid",
  "live",
  "sasp",
];
