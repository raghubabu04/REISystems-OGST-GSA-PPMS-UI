export const warrantLimitOptions = [
  {
    id: "25K",
    value: "25K",
    isSelected: false,
  },
  {
    id: "250K",
    value: "250K",
    isSelected: false,
  },
  {
    id: "10M",
    value: "10M",
    isSelected: false,
  },
  {
    id: "Unlimited",
    value: "Unlimited",
    isSelected: false,
  },
];

export const icnWithdrawalOptions = [
  {
    id: "INA",
    value: "Item Not available",
    isSelected: false,
  },
  {
    id: "DUPLICATE",
    value: "Duplicate ICN",
    isSelected: false,
  },
  {
    id: "AGENCY_USE",
    value: "Agency Use",
    isSelected: false,
  },
  {
    id: "FBR",
    value: "Financial or Bureau Reassignment",
    isSelected: false,
  },
  {
    id: "MRD",
    value: "Major Reporting Discrepancy",
    isSelected: false,
  },
  {
    id: "TRD",
    value: "Transferred/Donated",
    isSelected: false,
  },
  {
    id: "NSS",
    value: "Not Suitable for Sale",
    isSelected: false,
  },
  {
    id: "MINIMAL",
    value: "Minimal/No Market Value or No Bid",
    isSelected: false,
  },
  {
    id: "HW",
    value: "Hazardous Waste",
    isSelected: false,
  },
];

export const icnAdditionalWithdrawalOptions = [
  {
    id: "SS_NAP",
    value: "Security Sensitive/Not Appropriate",
    isSelected: false,
  },
  {
    id: "VR",
    value: "Vehicle Recall",
    isSelected: false,
  },
];

export const hazardousValues = [
  {
    id: "M",
    value: "Hazardous Material",
    isSelected: false,
  },
  {
    id: "W",
    value: "Hazardous Waste",
    isSelected: false,
  },
  {
    id: "N",
    value: "No",
    isSelected: false,
  },
];

export const valueAddedValues = [
  {
    id: "Y",
    value: "Yes",
    isSelected: false,
  },
  {
    id: "N",
    value: "No",
    isSelected: false,
  },
];

export const assignmentsValues = [
  {
    id: "M",
    value: "Assigned to Me",
    isSelected: true,
  },
  {
    id: "A",
    value: "All Zone Items",
    isSelected: false,
  },
  {
    id: "O",
    value: "Assigned to Others",
    isSelected: false,
  },
  {
    id: "N",
    value: "Not Assigned",
    isSelected: false,
  },
];

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
