import React, { createContext, useState } from "react";
import {
  DefaultContractsState,
  DefaultContractsOriginalState,
} from "./DefaultContractsState";

interface DefaultContractsContext {
  defaultContractsState: DefaultContractsState;
  updateDefaultContractsState: React.Dispatch<React.SetStateAction<any>>;
}

export const DefaultContractsContext = createContext(
  {} as DefaultContractsContext
);

export const DefaultContractsContextProvider = ({ children }) => {
  const [defaultContractsState, setDefaultContractsState] = useState<
    DefaultContractsState
  >(DefaultContractsOriginalState);

  const value = {
    defaultContractsState,
    updateDefaultContractsState,
  };
  function updateDefaultContractsState(newState: any) {
    setDefaultContractsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <DefaultContractsContext.Provider value={value}>
      {children}
    </DefaultContractsContext.Provider>
  );
};
