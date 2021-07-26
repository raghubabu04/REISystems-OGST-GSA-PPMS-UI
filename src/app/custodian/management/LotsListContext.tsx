import React, { createContext, useState } from "react";
import { LotsListState, LotsListDefaultState } from "./LotsListState";

interface LotsListContext {
  lotsListState: LotsListState;
  updateLotsListState: React.Dispatch<React.SetStateAction<any>>;
}

export const LotsListContext = createContext({} as LotsListContext);

export const LotsListContextProvider = ({ children }) => {
  const [lotsListState, setLotsListState] = useState<LotsListState>(
    LotsListDefaultState
  );

  const value = {
    lotsListState,
    updateLotsListState,
  };
  function updateLotsListState(newState: any) {
    setLotsListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <LotsListContext.Provider value={value}>
      {children}
    </LotsListContext.Provider>
  );
};
