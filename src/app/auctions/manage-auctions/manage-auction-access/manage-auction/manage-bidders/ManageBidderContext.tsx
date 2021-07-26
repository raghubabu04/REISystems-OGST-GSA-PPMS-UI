import React, { createContext, useState } from "react";
import {
  ManageBidderDefaultState,
  ManageBidderState,
} from "./ManageBidderState";

export interface IManageBidderContext {
  manageBidderState: ManageBidderState;
  updateManageBidderState: React.Dispatch<React.SetStateAction<any>>;
}

export const ManageBidderContext = createContext({} as IManageBidderContext);

export const ManageBidderContextProvider = ({ children }) => {
  const [manageBidderState, setManageBidderState] = useState<ManageBidderState>(
    ManageBidderDefaultState
  );

  const value = {
    manageBidderState,
    updateManageBidderState,
  };
  function updateManageBidderState(newState: any) {
    setManageBidderState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  return (
    <ManageBidderContext.Provider value={value}>
      {children}
    </ManageBidderContext.Provider>
  );
};
