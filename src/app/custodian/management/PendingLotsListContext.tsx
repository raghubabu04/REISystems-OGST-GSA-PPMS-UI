import React, { createContext, useState } from "react";
import { PendingLotsListState, PendingLotsListDefaultState } from "./PendingLotsListState";

interface PendingLotsListContext {
  pendinglotsListState: PendingLotsListState;
  updatePendingLotsListState: React.Dispatch<React.SetStateAction<any>>;
}

export const PendingLotsListContext = createContext({} as PendingLotsListContext);

export const PendingLotsListContextProvider = ({ children }) => {
  const [pendinglotsListState, setPendingLotsListState] = useState<PendingLotsListState>(
    PendingLotsListDefaultState
  );

  const value = {
    pendinglotsListState,
    updatePendingLotsListState,
  };
  function updatePendingLotsListState(newState: any) {
    setPendingLotsListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <PendingLotsListContext.Provider value={value}>
      {children}
    </PendingLotsListContext.Provider>
  );
};
