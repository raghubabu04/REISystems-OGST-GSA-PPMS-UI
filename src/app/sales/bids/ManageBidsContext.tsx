import React, { createContext, useState } from "react";
import { ManageBidsState, ManageBidsDefaultState } from "./ManageBidsState";

interface ManageBidsContext {
  manageBidsState: ManageBidsState;
  updateManageBidsState: React.Dispatch<React.SetStateAction<any>>;
}

export const ManageBidsContext = createContext({} as ManageBidsContext);

export const ManageBidsContextProvider = ({ children }) => {
  const [manageBidsState, 
    setManageBidsState] = useState<ManageBidsState>(
    ManageBidsDefaultState
  );

  const value = {
    manageBidsState,
    updateManageBidsState,
  };
  function updateManageBidsState(newState: any) {
    setManageBidsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ManageBidsContext.Provider value={value}>
      {children}
    </ManageBidsContext.Provider>
  );
};
