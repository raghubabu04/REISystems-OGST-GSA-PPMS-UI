export const documentTypeOptions = [
  {
    id: "1",
    value: "LEA Certification",
    isSelected: false,
  },
  {
    id: "2",
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

export const apoUserFilterOptions = [
  {
    value: "Show users under my Territory",
    id: "show-users-under-my-territory",
    isSelected: true,
  },
  {
    value: "Show all users",
    id: "show-all-users",
    isSelected: false,
  }
];
