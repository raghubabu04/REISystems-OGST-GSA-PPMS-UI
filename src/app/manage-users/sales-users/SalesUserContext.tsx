import React, { createContext, useState } from "react";
import { SalesUserInformation, salesUserInformationDefault } from "./sales-user-information/SalesUserInformationState";
import { SalesUserTypeState, salesUserTypeStateDefault } from "./sales-user-type/SalesUserTypeState";
import { SalesUserFormState, salesUserFormStateDefault } from "./SalesUserFormState";
import { SalesUserZoneState, salesUserZoneDefault } from "./sales-user-zone/SalesUserZoneState";
import { SalesUserRolesState, salesUserRolesStateDefault } from "./sales-user-roles/SalesUserRolesState";

interface SalesUserContext {
    salesUserTypeState : SalesUserTypeState;
    updateSalesUserTypeState : React.Dispatch<React.SetStateAction<any>>;
    salesUserInformationState : SalesUserInformation;
    updateSalesUserInformationState : React.Dispatch<React.SetStateAction<any>>;
    salesUserFormState: SalesUserFormState;
    updateSalesUserFormState: React.Dispatch<React.SetStateAction<any>>;
    salesUserZoneState: SalesUserZoneState;
    updateSalesUserZoneState: React.Dispatch<React.SetStateAction<any>>;
    salesUserRolesState : SalesUserRolesState;
    updateSalesUserRolesState : React.Dispatch<React.SetStateAction<any>>;
}

export const SalesUserContext = createContext({} as SalesUserContext);

export const SalesUserProvider = ({ children }) => {
    const [salesUserTypeState, setSalesUserTypeState] = useState<SalesUserTypeState>(salesUserTypeStateDefault);
    const [salesUserInformationState, setSalesUserInformationState] = useState<SalesUserInformation>(salesUserInformationDefault);
    const [salesUserFormState, setSalesUserFormState] = useState<SalesUserFormState>(salesUserFormStateDefault);
    const [salesUserZoneState, setSalesUserZoneState] = useState<SalesUserZoneState>(salesUserZoneDefault);
    const [salesUserRolesState, setSalesUserRolesState] = useState<SalesUserRolesState>(salesUserRolesStateDefault);

    function updateSalesUserTypeState(newState: any) {
        setSalesUserTypeState((prevState: any) => {
            return { ...prevState, ...newState };
          });
    }

  function updateSalesUserRolesState(newState: any) {
    setSalesUserRolesState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

    function updateSalesUserInformationState(newState: any) {
        setSalesUserInformationState((prevState: any) => {
            return { ...prevState, ...newState };
          });
    }

    function updateSalesUserFormState(newState: any) {
        setSalesUserFormState((prevState: any) => {
            return { ...prevState, ...newState };
        });
    }

  function updateSalesUserZoneState(newState: any) {
    setSalesUserZoneState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }


    const value = {
        salesUserTypeState,
        updateSalesUserTypeState,
        salesUserInformationState,
        updateSalesUserInformationState,
        salesUserFormState,
        updateSalesUserFormState,
        salesUserZoneState,
        updateSalesUserZoneState,
        salesUserRolesState,
        updateSalesUserRolesState,
    };

    return (
        <SalesUserContext.Provider value={value}>
            {children}
        </SalesUserContext.Provider>
    );
}
