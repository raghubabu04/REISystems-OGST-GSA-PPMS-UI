export interface FilterState {
  selectedAgencyBureaus?: any[];
  agencyBureaus?: any[];
  includeExclude?: string;
  isChecked?: boolean;
  propertyType?: string;
  fcsSelectedValues?: any[];
  fscCodeList?: any[];
  fscCodes?: any[];
  hazardous?: string;
  hazardousValues?: any[];
  aac?: string;
  email?: string;
  assignment?: string;
  assignmentValues?: any[];
  startingIcn?: string;
  endingIcn?: string;
  condition?: string;
  conditionValues?: any[];
  stateCodeSelectedValues?: any[];
  stateCodeList?: any[];
  stateCode?: any[];
  region?: string;
  regionValues?: any[];
  addedService?: string;
  addedServiceValues?: any[];
}

export const FilterStateDefaults: FilterState = {
  selectedAgencyBureaus: [],
  agencyBureaus: [],
  includeExclude: "Include",
  isChecked: false,
  propertyType: "",
  fcsSelectedValues: [],
  fscCodeList: [],
  fscCodes: [],
  hazardous: "",
  aac: "",
  assignment: "Assigned to Me",
  email: "",
  startingIcn: "",
  endingIcn: "",
  condition: "",
  stateCodeSelectedValues: [],
  stateCodeList: [],
  stateCode: [],
  region: "",
  addedService: "",
};
