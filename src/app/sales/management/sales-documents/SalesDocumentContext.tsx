import React, { createContext, useState } from "react";
import {
  SalesDocumentState,
  DefaultSalesDocumentState,
} from "./SalesDocumentState";

interface SalesDocumentContext {
  salesDocumentState: SalesDocumentState;
  updateSalesDocumentState: React.Dispatch<React.SetStateAction<any>>;
}

export const SalesDocumentContext = createContext({} as SalesDocumentContext);

export const SalesDocumentContextProvider = ({ children }) => {
  const [salesDocumentState, setSalesDocumentState] = useState<
    SalesDocumentState
  >(DefaultSalesDocumentState);

  const value = {
    salesDocumentState,
    updateSalesDocumentState,
  };
  function updateSalesDocumentState(newState: any) {
    setSalesDocumentState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <SalesDocumentContext.Provider value={value}>
      {children}
    </SalesDocumentContext.Provider>
  );
};
