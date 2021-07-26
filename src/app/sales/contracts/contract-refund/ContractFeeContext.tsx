import React, { createContext, useState } from "react";
import { ContractFeeDefault, ContractFeeState } from "./Constants";

interface ContractsListContext {
  contractFeeState: ContractFeeState;
  updateContractFeeState: React.Dispatch<React.SetStateAction<any>>;
}

export const ContractFeeContext = createContext({} as ContractsListContext);

export const ContractFeeContextProvider = ({ children }) => {
  const [contractFeeState, setContractFeeState] = useState<
    ContractFeeState
  >(ContractFeeDefault);

  const value = {
    contractFeeState,
    updateContractFeeState,
  };
  function updateContractFeeState(newState: ContractFeeState) {
    setContractFeeState((prevState: ContractFeeState) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ContractFeeContext.Provider value={value}>
      {children}
    </ContractFeeContext.Provider>
  );
};
