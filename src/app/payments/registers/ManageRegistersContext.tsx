import React, { createContext, useState } from "react";
import {
  ManageRegistersState,
  ManageRegistersListDefaultState,
} from "./ManageRegistersState";

interface ManageRegistersContext {
  manageRegistersState: ManageRegistersState;
  updateManageRegistersState: React.Dispatch<React.SetStateAction<any>>;
}

export const ManageRegistersContext = createContext(
  {} as ManageRegistersContext
);

export const ManageRegistersContextProvider = ({ children }) => {
  const [manageRegistersState, setManageRegistersState] = useState<
    ManageRegistersState
  >(ManageRegistersListDefaultState);

  const value = {
    manageRegistersState,
    updateManageRegistersState,
  };
  function updateManageRegistersState(newState: any) {
    setManageRegistersState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ManageRegistersContext.Provider value={value}>
      {children}
    </ManageRegistersContext.Provider>
  );
};
