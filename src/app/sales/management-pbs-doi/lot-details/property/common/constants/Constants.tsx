export const category = () => {
  return [
    { id: "agriculture", value: "Agriculture" },
    { id: "commercial", value: "Commercial" },
    { id: "industrial", value: "Industrial" },
    { id: "land", value: "Land" },
    { id: "lighthouse", value: "Lighthouse" },
    { id: "multi-residential", value: "Multi-Residential" },
    { id: "multiple-use", value: "Multiple Use" },
    { id: "residential", value: "Residential" },
    { id: "other", value: "Other" },
  ];
};

export const doiCategory = [
  {
    auctionCategoryCode: "20",
    categoryCode: null,
    code: "110",
    description: "Aircraft and Aircraft Parts",
    fgCategoryCode: null,
    longName: "Aircraft and Aircraft Parts",
  },
];

export const resetState = () => {
  return {
    propertyDetail: {
      data: {
        caseNumber: "",
        propertyName: "",
        description: "",
        category: "",
        fsc: "",
        fscDoi: "",
        address: {
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          city: "",
          state: "",
          zip: "",
          zip2: "",
        },
        longitude: "",
        latitude: "",
        ifb: "",
        urls: [],
      },
      validation: {
        lotNumber: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        caseNumber: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        propertyName: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        description: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        category: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        fsc: { isInvalid: false, validationError: "", isDisabled: true },
        address: {
          addressLine1: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          addressLine2: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          addressLine3: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          city: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          state: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          zip: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          zip2: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        },
        longitude: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        latitude: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        ifb: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        urls: [
          {
            name: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            url: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
          },
        ],
      },
    },
    poc: {
      data: {
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        phoneExtension: "",
        fax: "",
        email: "",
      },
      validation: {
        firstName: { isInvalid: false, validationError: "", isDisabled: false },
        middleName: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        lastName: { isInvalid: false, validationError: "", isDisabled: false },
        phone: { isInvalid: false, validationError: "", isDisabled: false },
        phoneExtension: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        fax: { isInvalid: false, validationError: "", isDisabled: false },
        email: { isInvalid: false, validationError: "", isDisabled: false },
      },
    },
    sales: {
      saleId: null,
      saleNumber: "",
      sellingAgency: "",
    },
    lot: {
      data: {
        lotId: null,
        lotNumber: null,
      },
      validation: {
        lotNumber: { isInvalid: false, validationError: "" },
      },
    },
    other: {
      fieldDisabled: false,
      imagesDocumentsDisable: false,
      saveDisabled: false,
      addPropertyDisabled: false,
    },
  };
};
