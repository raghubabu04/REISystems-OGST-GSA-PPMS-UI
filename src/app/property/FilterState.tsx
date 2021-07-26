export interface FilterState {
  apoLastName?: string;
  apoFirstName?: string;
  apoEmail?: string;
  reportingAACId?: string;
  transferControlNumber?: string;
  priority?: string;
  region?: string;
  state?: string;
  requestStatus?: string[];
  excessDateType?: "";
  erdDateFrom?: any;
  erdDateTo?: any;
  surplusDateType?: any;
  srdDateFrom?: any;
  srdDateTo?: any;
  transferRequests?: string;
  itemControlNumber?: string;
}

export const FilterStateDefaults: FilterState = {
  apoLastName: "",
  apoFirstName: "",
  apoEmail: "",
  reportingAACId: "",
  transferControlNumber: "",
  priority: "",
  region: "",
  state: "",
  requestStatus: [],
  excessDateType: "",
  erdDateFrom: "",
  erdDateTo: "",
  surplusDateType: "",
  srdDateFrom: "",
  srdDateTo: "",
  transferRequests: "all",
  itemControlNumber: "",
};
