import React, { createContext, useState } from "react";
import {ContractDocumentationState, ContractDocumentationStateDefault} from "./ContractDocumentationState";

interface ContractDocumentatonContext {
  contractDocumentationState: ContractDocumentationState;
  updateContractDocumentationState: React.Dispatch<React.SetStateAction<any>>;
}

export const ContractDocumentationContext = createContext(
  {} as ContractDocumentatonContext
);

export const ContractDocumentationContextProvider = ({ children }) => {

  const [contractDocumentationState, setContractDocumentationState] = useState<
    ContractDocumentationState
  >(ContractDocumentationStateDefault);

  const value = {
    contractDocumentationState,
    updateContractDocumentationState,    
  }

  function updateContractDocumentationState(newState: any) {
    setContractDocumentationState((prevState: any) => {
        return { ...prevState, ...newState };
    });  
  }
  
  return (
    <ContractDocumentationContext.Provider value={value}>
      {children}
    </ContractDocumentationContext.Provider>  
  );
};