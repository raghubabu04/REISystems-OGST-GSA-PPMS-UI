export interface SalesUserRolesState {
  userRole: any;
  salesUserRolesOptions: any;
  selectedRolesList: [];
  isUserRoleIsInvalid: boolean;
  userRoleValidationMessage: string;
  isSFOSelected: boolean;
  selectWarrantLimit: string;
  selectWarrantLimitIsInvalid: boolean;
  selectWarrantLimitValidationMessage: string
}

export const salesUserRolesStateDefault: SalesUserRolesState = {
  userRole: "",
  salesUserRolesOptions:[],
  isSFOSelected:false,
  selectedRolesList: [],
  isUserRoleIsInvalid: false,
  userRoleValidationMessage: "",
  selectWarrantLimit:"",
  selectWarrantLimitIsInvalid: false,
  selectWarrantLimitValidationMessage: ""

};

export const SalesUserRolesStateJson = (
  salesUserRolesState: SalesUserRolesState
) => [
  {
    userRoles: salesUserRolesState.selectedRolesList,
    warrantLimit: salesUserRolesState.selectWarrantLimit,
  },
];
