import React, { createContext, useState } from "react";
import { SalesSearchState, SalesSearchStateDefault } from "./SalesSearchState";

interface SalesSearchContext {
  salesSearchState: SalesSearchState;
  updateSalesSearchState: React.Dispatch<React.SetStateAction<any>>;
}

export const SalesSearchContext = createContext({} as SalesSearchContext);

export const SalesSearchContextProvider = ({ children }) => {
  const [salesSearchState, setSalesSearchState] = useState<SalesSearchState>(
    SalesSearchStateDefault
  );
  const value = {
    salesSearchState,
    updateSalesSearchState,
  };
  function updateSalesSearchState(newState: any) {
    setSalesSearchState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <SalesSearchContext.Provider value={value}>
      {children}
    </SalesSearchContext.Provider>
  );
};
