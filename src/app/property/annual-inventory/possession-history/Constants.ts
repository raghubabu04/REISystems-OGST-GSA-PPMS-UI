export const statusCodeValues = [
  { id: "A", value: "Active Firearm is in the possession of the LEA" },
  { id: "M1", value: "Missing and under investigation" },
  { id: "M2", value: "Missing and fee assessed but not paid" },
  { id: "M3", value: "Missing and fee paid" },
  { id: "D", value: "Destroyed" },
  //User should not be able to use transferred status selection
  // { id: "T", value: "Transferred to another LEA" },
  { id: "C1", value: "Record of missing firearm is now closed, fee paid" },
  { id: "C2", value: "Record of missing firearm is now closed, fee waived" },
  { id: "C3", value: "Record is closed, firearm destroyed with GSA approval" },
  { id: "C4", value: "Record is closed, firearm destroyed, fee paid" },
  { id: "C5", value: "Record is closed, firearm destroyed, fee waived" },
  // { id: "C6", value: "Record is closed, firearm transferred to another LEA" },
];

export const statusCodeValuesFullList = [
  { id: "A", value: "Active Firearm is in the possession of the LEA" },
  { id: "M1", value: "Missing and under investigation" },
  { id: "M2", value: "Missing and fee assessed but not paid" },
  { id: "M3", value: "Missing and fee paid" },
  { id: "D", value: "Destroyed" },
  { id: "T", value: "Transferred to another LEA" },
  { id: "C1", value: "Record of missing firearm is now closed, fee paid" },
  { id: "C2", value: "Record of missing firearm is now closed, fee waived" },
  { id: "C3", value: "Record is closed, firearm destroyed with GSA approval" },
  { id: "C4", value: "Record is closed, firearm destroyed, fee paid" },
  { id: "C5", value: "Record is closed, firearm destroyed, fee waived" },
  { id: "C6", value: "Record is closed, firearm transferred to another LEA" },
];

export const ItemStatusCodeValues = [
  {
    id: "A",
    value: "Active Firearm is in the possession of the LEA",
    isSelected: true,
  },
  { id: "M1", value: "Missing and under investigation", isSelected: false },
  {
    id: "M2",
    value: "Missing and fee assessed but not paid",
    isSelected: false,
  },
  { id: "M3", value: "Missing and fee paid", isSelected: false },
  { id: "D", value: "Destroyed", isSelected: false },
  {
    id: "C1",
    value: "Record of missing firearm is now closed, fee paid",
    isSelected: false,
  },
  {
    id: "C2",
    value: "Record of missing firearm is now closed, fee waived",
    isSelected: false,
  },
  {
    id: "C3",
    value: "Record is closed, firearm destroyed with GSA approval",
    isSelected: false,
  },
  {
    id: "C4",
    value: "Record is closed, firearm destroyed, fee paid",
    isSelected: false,
  },
  {
    id: "C5",
    value: "Record is closed, firearm destroyed, fee waived",
    isSelected: false,
  },
];

export const documentTypeOptions = [
  {
    id: "1",
    value: "Donee Letter of Intent",
    isSelected: false,
  },
  {
    id: "2",
    value: "Conditional Transfer Document",
    isSelected: false,
  },
  {
    id: "3",
    value: "Other",
    isSelected: false,
  },
];
export const documentTypes = {
  options: documentTypeOptions,
  documentTypesKey: "id",
  documentTypesValue: "value",
  isRequired: true,
};
