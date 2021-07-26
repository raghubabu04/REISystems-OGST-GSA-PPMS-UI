export interface UserProfileForSalesUserRolesState {
  userRoles: any[]; 
  warrantLimit:string;
}

export const userProfilerForSalesUserRolesStateDefault: UserProfileForSalesUserRolesState = {
  userRoles: [], 
  warrantLimit:""
};

export const UserProfileForSalesUserRolesStateJson = (
  salesUserRolesState: UserProfileForSalesUserRolesState
) => [
  {
    userRoles: salesUserRolesState.userRoles.map(r => r.roleCd),
    warrantLimit:salesUserRolesState.warrantLimit
  },
];