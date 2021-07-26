import { StringLocale } from "yup";

export interface RadiusSearchState {
  zipCode: string;
  zipCodeIsInvalid: boolean;
  zipCodeErrorMsg: string;
  isSelectedRadiusEnabled: boolean;
  advancedSearchText: string;
  searchType: string;
  status: string;
  selectedRadius: string;
}

export const RadiusSearchStateDefault: RadiusSearchState = {
  zipCode: "",
  zipCodeIsInvalid: false,
  zipCodeErrorMsg: "",
  isSelectedRadiusEnabled: false,
  advancedSearchText: "",
  searchType: "ALL_WORDS",
  status: "all",
  selectedRadius: "",
};
