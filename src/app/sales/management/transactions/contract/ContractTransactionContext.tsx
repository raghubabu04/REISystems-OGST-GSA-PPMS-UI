import React, { createContext, useState } from "react";
import {ContractTransactionState, ContractTransactionStateDefault} from "./ContractTransactionState";

interface ContractTransactionContext {
  contractTransactionState: ContractTransactionState;
  updateContractTransactionState: React.Dispatch<React.SetStateAction<any>>;
}

export const ContractTransactionContext = createContext(
  {} as ContractTransactionContext
);

export const ContractTransactionContextProvider = ({ children }) => {

  const [contractTransactionState, setContractTransactionState] = useState<
    ContractTransactionState
    >(ContractTransactionStateDefault);

  const value = {
    contractTransactionState,
    updateContractTransactionState,
  };

  function updateContractTransactionState(newState: any) {
    setContractTransactionState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ContractTransactionContext.Provider value={value}>
      {children}
    </ContractTransactionContext.Provider>
  );
};
