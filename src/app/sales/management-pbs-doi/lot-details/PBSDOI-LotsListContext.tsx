import React, { createContext, useState } from "react";
import {
  LotsListPBSDOIState,
  LotsListPBSDOIStateDefault,
} from "./PBSDOI-LotsListState";

interface LotsListPBSDOIContext {
  lotsListPBSDOIState: LotsListPBSDOIState;
  updateLotsListPBSDOIState: React.Dispatch<React.SetStateAction<any>>;
}

export const LotsListPBSDOIContext = createContext({} as LotsListPBSDOIContext);

export const LotsListPBSDOIContextProvider = ({ children }) => {
  const [lotsListPBSDOIState, setLotsListPBSDOIState] = useState<
    LotsListPBSDOIState
  >(LotsListPBSDOIStateDefault);

  const value = {
    lotsListPBSDOIState,
    updateLotsListPBSDOIState,
  };
  function updateLotsListPBSDOIState(newState: any) {
    setLotsListPBSDOIState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <LotsListPBSDOIContext.Provider value={value}>
      {children}
    </LotsListPBSDOIContext.Provider>
  );
};
