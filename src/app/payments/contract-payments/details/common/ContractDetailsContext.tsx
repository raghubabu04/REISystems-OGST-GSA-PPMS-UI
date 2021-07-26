import React, { createContext, useState } from "react";
import {
  ContractDetailsState,
  ContractDetailsDefaultState,
} from "./ContractDetailsState";

interface ContractDetailsContext {
  contractDetailsState: ContractDetailsState;
  updateContractDetailsState: React.Dispatch<React.SetStateAction<any>>;
}

export const ContractDetailsContext = createContext(
  {} as ContractDetailsContext
);

export const ContractDetailsContextProvider = ({ children }) => {
  const [contractDetailsState, setContractDetailsState] = useState<
    ContractDetailsState
  >(ContractDetailsDefaultState);

  const value = {
    contractDetailsState,
    updateContractDetailsState,
  };
  function updateContractDetailsState(newState: any) {
    setContractDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ContractDetailsContext.Provider value={value}>
      {children}
    </ContractDetailsContext.Provider>
  );
};
