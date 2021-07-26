import React, { createContext, useState } from "react";
import {
  CustodianLocationState,
  CustodianLocationStateDefault,
} from "./CustodianLocationState";

interface CustodianLocationContext {
  custodianLocationState: CustodianLocationState;
  updateCustodianLocationState: React.Dispatch<React.SetStateAction<any>>;
}

export const CustodianLocationContext = createContext(
  {} as CustodianLocationContext
);

export const CustodianLocationContextProvider = ({ children }) => {
  const [custodianLocationState, setCustodianLocationState] = useState<
    CustodianLocationState
  >(CustodianLocationStateDefault);

  const value = {
    custodianLocationState,
    updateCustodianLocationState,
  };
  function updateCustodianLocationState(newState: any) {
    setCustodianLocationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <CustodianLocationContext.Provider value={value}>
      {children}
    </CustodianLocationContext.Provider>
  );
};
