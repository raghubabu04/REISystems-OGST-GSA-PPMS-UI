import React, { createContext, useState } from "react";
import { SalesListState, SalesListStateDefault } from "./SalesListState";

interface SalesListContext {
  salesListState: SalesListState;
  updateSalesListState: React.Dispatch<React.SetStateAction<any>>;
}

export const SalesListContext = createContext({} as SalesListContext);

export const SalesListContextProvider = ({ children }) => {
  const [salesListState, setSalesListState] = useState<SalesListState>(
    SalesListStateDefault
  );

  const value = {
    salesListState,
    updateSalesListState,
  };
  function updateSalesListState(newState: any) {
    setSalesListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <SalesListContext.Provider value={value}>
      {children}
    </SalesListContext.Provider>
  );
};
