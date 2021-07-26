import React, { createContext, useState } from "react";
import {
  ManageContractsState,
  ManageContractsDefaultState,
} from "./ManageContractsState";

interface ManageContractsContext {
  manageContractsState: ManageContractsState;
  updateManageContractsState: React.Dispatch<React.SetStateAction<any>>;
}

export const ManageContractsContext = createContext(
  {} as ManageContractsContext
);

export const ManageContractsContextProvider = ({ children }) => {
  const [manageContractsState, setManageContractsState] = useState<
    ManageContractsState
  >(ManageContractsDefaultState);

  const value = {
    manageContractsState,
    updateManageContractsState,
  };
  function updateManageContractsState(newState: any) {
    setManageContractsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ManageContractsContext.Provider value={value}>
      {children}
    </ManageContractsContext.Provider>
  );
};
