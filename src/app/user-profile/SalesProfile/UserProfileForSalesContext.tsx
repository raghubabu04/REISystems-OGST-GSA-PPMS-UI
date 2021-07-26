import React, { createContext, useState } from "react";
import { UserProfileForSalesUserInformation, userProfileForSalesUserInformationDefault } from "./profile-sales-user-information/UserProfileForSalesUserInformationState";
import { UserProfileForSalesUserRolesState, userProfilerForSalesUserRolesStateDefault } from "./profile-sales-user-roles/UserProfileForSalesUserRolesState";
import { UserProfileForSalesUserTypeState, userProfileForsalesUserTypeStateDefault } from "./profile-sales-user-type/UserProfileForSalesUserTypeState";
import { userProfileForSalesUserZoneDefault, UserProfileForSalesUserZoneState } from "./profile-sales-user-zone/UserProfileForSalesUserZoneState";
import { UserProfileForSalesUserFormState, userProfileForSalesUserFormStateDefault } from "./UserProfileForSalesUserFormState";


interface UserProfileSaleContext { 
    salesUserProfileInformationState : UserProfileForSalesUserInformation;
    updateSalesUserProfileInformationState : React.Dispatch<React.SetStateAction<any>>;
    salesUserProfileFormState: UserProfileForSalesUserFormState;
    updateSalesUserProfileFormState: React.Dispatch<React.SetStateAction<any>>;
    salesProfileUserTypeState : UserProfileForSalesUserTypeState;
    updateSalesProfileUserTypeState : React.Dispatch<React.SetStateAction<any>>;
    salesProfileUserRolesState : UserProfileForSalesUserRolesState;
    updateSalesProfileUserRolesState : React.Dispatch<React.SetStateAction<any>>;
    salesProfileUserZoneState: UserProfileForSalesUserZoneState;
    updateSalesProfileUserZoneState: React.Dispatch<React.SetStateAction<any>>;
}

export const UserProfileSaleContext = createContext({} as UserProfileSaleContext);

export const UserProfileSalesProvider = ({ children }) => {
    const [salesUserProfileInformationState, setSalesUserProfileInformationState] = useState<UserProfileForSalesUserInformation>(userProfileForSalesUserInformationDefault);
    const [salesUserProfileFormState, setSalesUserProfileFormState] = useState<UserProfileForSalesUserFormState>(userProfileForSalesUserFormStateDefault);
    const [salesProfileUserTypeState, setSalesProfileUserTypeState] = useState<UserProfileForSalesUserTypeState>(userProfileForsalesUserTypeStateDefault);
    const [salesProfileUserRolesState, setSalesProfileUserRolesState] = useState<UserProfileForSalesUserRolesState>(userProfilerForSalesUserRolesStateDefault);
    const [salesProfileUserZoneState, setSalesProfileUserZoneState] = useState<UserProfileForSalesUserZoneState>(userProfileForSalesUserZoneDefault);
    
    function updateSalesUserProfileInformationState(newState: any) {
        setSalesUserProfileInformationState((prevState: any) => {
            return { ...prevState, ...newState };
          });
    } 
    function updateSalesUserProfileFormState(newState: any) {
        setSalesUserProfileFormState((prevState: any) => {
            return { ...prevState, ...newState };
        });
    }
    function updateSalesProfileUserTypeState(newState: any) {
        setSalesProfileUserTypeState((prevState: any) => {
            return { ...prevState, ...newState };
          });
    }
    function updateSalesProfileUserRolesState(newState: any) {
        setSalesProfileUserRolesState((prevState: any) => {
            return { ...prevState, ...newState };
          });
    }

    function updateSalesProfileUserZoneState(newState: any) {
        setSalesProfileUserZoneState((prevState: any) => {
          return { ...prevState, ...newState };
        });
      }

    const value = { 
         salesUserProfileInformationState,
         updateSalesUserProfileInformationState,
         salesUserProfileFormState,
         updateSalesUserProfileFormState,
         salesProfileUserTypeState,
         updateSalesProfileUserTypeState,
         salesProfileUserRolesState,
         updateSalesProfileUserRolesState,
         salesProfileUserZoneState,
         updateSalesProfileUserZoneState,
    };

    return (
        <UserProfileSaleContext.Provider value={value}>
            {children}
        </UserProfileSaleContext.Provider>
    );
}