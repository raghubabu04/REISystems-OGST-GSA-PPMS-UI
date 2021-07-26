import React, { createContext, useState } from "react";
import {
  TransactionPBSDOIState,
  TransactionPBSDOIStateDefault,
} from "../PBSDOI-TransactionState";

interface TransactionCreatePBSDOIContext {
  createTransactionState: TransactionPBSDOIState;
  updateCreateTransactionState: React.Dispatch<React.SetStateAction<any>>;
}

export const TransactionCreatePBSDOIContext = createContext(
  {} as TransactionCreatePBSDOIContext
);

export const TransactionCreatePBSDOIContextProvider = ({ children }) => {
  const [createTransactionState, setCreateTransactionState] = useState<
    TransactionPBSDOIState
  >(TransactionPBSDOIStateDefault);

  const value = {
    createTransactionState,
    updateCreateTransactionState,
  };
  function updateCreateTransactionState(newState: any) {
    setCreateTransactionState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <TransactionCreatePBSDOIContext.Provider value={value}>
      {children}
    </TransactionCreatePBSDOIContext.Provider>
  );
};
