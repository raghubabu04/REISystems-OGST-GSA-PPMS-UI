import React, { createContext, useState } from "react";
import {
  SaleDetailsPBSDOIState,
  SaleDetailsPBSDOIStateDefault,
} from "../PBSDOI-SaleDetailsState";

interface SaleDetailsCreatePBSDOIContext {
  createSaleDetailsState: SaleDetailsPBSDOIState;
  updateCreateSaleDetailsState: React.Dispatch<React.SetStateAction<any>>;
}

export const SaleDetailsCreateContext = createContext(
  {} as SaleDetailsCreatePBSDOIContext
);

export const SaleDetailsCreatePBSDOIContextProvider = ({ children }) => {
  const [createSaleDetailsState, setCreateSaleDetailsState] = useState<
    SaleDetailsPBSDOIState
  >(SaleDetailsPBSDOIStateDefault);

  const value = {
    createSaleDetailsState,
    updateCreateSaleDetailsState,
  };
  function updateCreateSaleDetailsState(newState: any) {
    setCreateSaleDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <SaleDetailsCreateContext.Provider value={value}>
      {children}
    </SaleDetailsCreateContext.Provider>
  );
};
