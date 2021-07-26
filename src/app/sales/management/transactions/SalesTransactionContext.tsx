import React, { createContext, useState } from "react";
import {
  SalesTransactionState,
  SalesTransactionStateDefault,
} from "./SalesTransactionState";

interface SalesTransactionContext {
  salesTransactionState: SalesTransactionState;
  updateSalesTransactionState: React.Dispatch<React.SetStateAction<any>>;
}

export const SalesTransactionContext = createContext(
  {} as SalesTransactionContext
);

export const SalesTransactionContextProvider = ({ children }) => {
  const [salesTransactionState, setSalesTransactionState] = useState<
    SalesTransactionState
  >(SalesTransactionStateDefault);

  const value = {
    salesTransactionState,
    updateSalesTransactionState,
  };
  function updateSalesTransactionState(newState: any) {
    setSalesTransactionState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <SalesTransactionContext.Provider value={value}>
      {children}
    </SalesTransactionContext.Provider>
  );
};
