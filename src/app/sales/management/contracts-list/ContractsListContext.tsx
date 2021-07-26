import React, { createContext, useState } from "react";
import {
  ContractsListState,
  ContractsListDefaultState,
} from "./ContractsListState";

interface ContractsListContext {
  contractsListState: ContractsListState;
  updateContractsListState: React.Dispatch<React.SetStateAction<any>>;
}

export const ContractsListContext = createContext({} as ContractsListContext);

export const ContractsListContextProvider = ({ children }) => {
  const [contractsListState, setContractsListState] = useState<
    ContractsListState
  >(ContractsListDefaultState);

  const value = {
    contractsListState,
    updateContractsListState,
  };
  function updateContractsListState(newState: any) {
    setContractsListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ContractsListContext.Provider value={value}>
      {children}
    </ContractsListContext.Provider>
  );
};
