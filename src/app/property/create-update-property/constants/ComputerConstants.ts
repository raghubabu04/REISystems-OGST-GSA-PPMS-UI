export const cflEligibleOptions = [
  {
    value: "Schools and non-profits",
    id: "allOrganizations",
    isSelected: false,
    required: true,
  },
  {
    value: "Schools only",
    id: "schoolsOnly",
    isSelected: false,
    required: true,
  },
];

export const hardDiskStatus = [
  {
    value: "Sanitized",
    id: "sanitized",
    isSelected: false,
    field: "hardDiskStatus",
  },
  {
    value: "Non-sanitized",
    id: "nonSanitized",
    isSelected: false,
    field: "hardDiskStatus",
  },
  {
    value: "Removed",
    id: "removed",
    isSelected: false,
    field: "hardDiskStatus",
  },
  {
    value: "Degaussed",
    id: "degaussed",
    isSelected: false,
    field: "hardDiskStatus",
  },
  {
    value: "Not applicable",
    id: "notApplicable",
    isSelected: false,
    field: "hardDiskStatus",
  },
]; /*Computers*/
export const computersFSCCode = [
  "7010",
  "7020",
  "7021",
  "7022",
  "7015",
  "7025",
  "7030",
  "7035",
  "7040",
  "7042",
  "7045",
  "7050",
];
export const fscCodes7025 = ["7025"];

export const isEquipmentForComputersForLearning = [
  {
    value: "Yes",
    id: "Y",
    isSelected: false,
    field: "isEquipmentForComputersForLearning",
    required: true,
  },
  {
    value: "No",
    id: "N",
    isSelected: true,
    field: "isEquipmentForComputersForLearning",
    required: true,
  },
];
