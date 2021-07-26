import React, { createContext, useState } from "react";
import {
  FinalizeSalePBSDOIState,
  FinalizeSalePBSDOIStateDefault,
} from "./PBSDOI-FinalizeSaleState";

interface FinalizeSalePBSDOIContext {
  finalizeSalePBSDOIState: FinalizeSalePBSDOIState;
  updateFinalizeSalePBSDOIState: React.Dispatch<React.SetStateAction<any>>;
}

export const FinalizeSalePBSDOIContext = createContext(
  {} as FinalizeSalePBSDOIContext
);

export const FinalizeSalePBSDOIContextProvider = ({ children }) => {
  const [finalizeSalePBSDOIState, setFinalizeSalePBSDOIState] = useState<
    FinalizeSalePBSDOIState
  >(FinalizeSalePBSDOIStateDefault);

  const value = {
    finalizeSalePBSDOIState,
    updateFinalizeSalePBSDOIState,
  };
  function updateFinalizeSalePBSDOIState(newState: any) {
    setFinalizeSalePBSDOIState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <FinalizeSalePBSDOIContext.Provider value={value}>
      {children}
    </FinalizeSalePBSDOIContext.Provider>
  );
};
