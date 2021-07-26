import React, { createContext, useState } from "react";
import {
  AddICNsToLotState,
  AddICNsToLotStateDefault,
} from "./AddICNsToLotState";

interface AddICNsToLotContext {
  addICNsToLotState: AddICNsToLotState;
  updateAddICNsToLotState: React.Dispatch<React.SetStateAction<any>>;
}

export const AddICNsToLotContext = createContext({} as AddICNsToLotContext);

export const AddICNsToLotContextProvider = ({ children }) => {
  const [addICNsToLotState, setAddICNsToLotState] = useState<AddICNsToLotState>(
    AddICNsToLotStateDefault
  );

  const value = {
    addICNsToLotState,
    updateAddICNsToLotState,
  };
  function updateAddICNsToLotState(newState: any) {
    setAddICNsToLotState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <AddICNsToLotContext.Provider value={value}>
      {children}
    </AddICNsToLotContext.Provider>
  );
};
