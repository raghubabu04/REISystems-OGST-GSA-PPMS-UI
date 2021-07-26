import React, { createContext, useState } from "react";
import {
  PropertyDetailsPBSDOIState,
  PropertyDetailsPBSDOIStateDefault,
} from "../PBSDOI-PropertyDetailsState";

interface PropertyDetailsCreatePBSDOIContext {
  createPropertyDetailsState: PropertyDetailsPBSDOIState;
  updateCreatePropertyDetailsState: React.Dispatch<React.SetStateAction<any>>;
}

export const PropertyDetailsCreateContext = createContext(
  {} as PropertyDetailsCreatePBSDOIContext
);

export const PropertyDetailsCreatePBSDOIContextProvider = ({ children }) => {
  const [createPropertyDetailsState, setCreatePropertyDetailsState] = useState<
    PropertyDetailsPBSDOIState
  >(PropertyDetailsPBSDOIStateDefault);

  const value = {
    createPropertyDetailsState,
    updateCreatePropertyDetailsState,
  };
  function updateCreatePropertyDetailsState(newState: any) {
    setCreatePropertyDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <PropertyDetailsCreateContext.Provider value={value}>
      {children}
    </PropertyDetailsCreateContext.Provider>
  );
};
