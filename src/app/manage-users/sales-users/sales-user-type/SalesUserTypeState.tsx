import { UserUtils } from "../../../../utils/UserUtils";

export interface SalesUserTypeState {
    userType:string;
    isUserTypeInvalid: boolean;
    userTypeInvalidErrorMessage: string;
}
export const SALES_USER_TYPE_TO_ROLE_MAP = {"FMU":['Fleet Internal', 'Fleet Internal Admin','Fleet External'],"PBS":['Sales Admin','Regional Manager'],"DOI":['Sales Admin','Regional Manager']};
export const salesUserTypeStateDefault: SalesUserTypeState = {
    userType: '',
    isUserTypeInvalid: false,
    userTypeInvalidErrorMessage: ''
};

export const SalesUserTypeStateJson = (
  salesUserTypeState: SalesUserTypeState
) => [
  {
    salesUserType: salesUserTypeState.userType,
  },
];
