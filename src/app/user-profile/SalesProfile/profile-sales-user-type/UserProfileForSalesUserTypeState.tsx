export interface UserProfileForSalesUserTypeState {
    userType:string; 
}

export const userProfileForsalesUserTypeStateDefault: UserProfileForSalesUserTypeState = {
    userType: '',
}; 
export const UserProfileForSalesUserTypeStateJson = (
    salesUserTypeState: UserProfileForSalesUserTypeState
  ) => [
    {
      salesUserType: salesUserTypeState.userType,
    },
  ];

  