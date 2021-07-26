import React, { createContext, useState } from "react";
import {
  SalesListPBSDOIState,
  SalesListPBSDOIStateDefault,
} from "./PBSDOI-SalesListState";

interface SalesListPBSDOIContext {
  salesListPBSDOIState: SalesListPBSDOIState;
  updateSalesListPBSDOIState: React.Dispatch<React.SetStateAction<any>>;
}

export const SalesListPBSDOIContext = createContext(
  {} as SalesListPBSDOIContext
);

export const SalesListPBSDOIContextProvider = ({ children }) => {
  const [salesListPBSDOIState, setSalesListPBSDOIState] = useState<
    SalesListPBSDOIState
  >(SalesListPBSDOIStateDefault);

  const value = {
    salesListPBSDOIState,
    updateSalesListPBSDOIState,
  };
  function updateSalesListPBSDOIState(newState: any) {
    setSalesListPBSDOIState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <SalesListPBSDOIContext.Provider value={value}>
      {children}
    </SalesListPBSDOIContext.Provider>
  );
};
