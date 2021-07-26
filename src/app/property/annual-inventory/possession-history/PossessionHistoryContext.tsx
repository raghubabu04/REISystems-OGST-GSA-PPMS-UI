import React, { createContext, useState } from "react";

import {
  PossessionHistoryState,
  PossessionHistoryStateDefault,
} from "./PossessionHistoryState";

interface PossessionHistoryContext {
  possessionHistoryState: PossessionHistoryState;
  updatePossessionHistoryState: React.Dispatch<React.SetStateAction<any>>;
}

export const PossessionHistoryContext = createContext(
  {} as PossessionHistoryContext
);

export const PossessionHistoryContextProvider = ({ children }) => {
  const [possessionHistoryState, setPossessionHistoryState] = useState<
    PossessionHistoryState
  >(PossessionHistoryStateDefault);

  const value = {
    possessionHistoryState,
    updatePossessionHistoryState,
  };

  function updatePossessionHistoryState(newState: any) {
    setPossessionHistoryState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  return (
    <PossessionHistoryContext.Provider value={value}>
      {children}
    </PossessionHistoryContext.Provider>
  );
};
