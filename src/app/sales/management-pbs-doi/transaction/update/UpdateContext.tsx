import React, { createContext, useState } from "react";
import {
  TransactionPBSDOIState,
  TransactionPBSDOIStateDefault,
} from "../PBSDOI-TransactionState";

interface TransactionUpdatePBSDOIContext {
  updateTransactionState: TransactionPBSDOIState;
  updateUpdateTransactionState: React.Dispatch<React.SetStateAction<any>>;
}

export const TransactionUpdateContext = createContext(
  {} as TransactionUpdatePBSDOIContext
);

export const TransactionUpdatePBSDOIContextProvider = ({ children }) => {
  const [updateTransactionState, setUpdateTransactionState] = useState<
    TransactionPBSDOIState
  >(TransactionPBSDOIStateDefault);

  const value = {
    updateTransactionState,
    updateUpdateTransactionState,
  };
  function updateUpdateTransactionState(newState: any) {
    setUpdateTransactionState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <TransactionUpdateContext.Provider value={value}>
      {children}
    </TransactionUpdateContext.Provider>
  );
};
