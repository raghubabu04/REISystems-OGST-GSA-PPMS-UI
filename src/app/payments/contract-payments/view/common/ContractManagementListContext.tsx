import React, { createContext, useState } from "react";
import {
  ContractManagementState,
  ContractManagementListDefaultState,
} from "./ContractManagementListState";

interface ContractManagementContext {
  contractManagementState: ContractManagementState;
  updateContractManagementState: React.Dispatch<React.SetStateAction<any>>;
}

export const ContractManagementContext = createContext(
  {} as ContractManagementContext
);

export const ContractManagementContextProvider = ({ children }) => {
  const [contractManagementState, setContractManagementState] = useState<
    ContractManagementState
  >(ContractManagementListDefaultState);

  const value = {
    contractManagementState,
    updateContractManagementState,
  };
  function updateContractManagementState(newState: any) {
    setContractManagementState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ContractManagementContext.Provider value={value}>
      {children}
    </ContractManagementContext.Provider>
  );
};
