import React, { createContext, useState } from "react";
import {
  RadiusSearchState,
  RadiusSearchStateDefault,
} from "./RadiusSearchState";

export interface IRadiusSearchContext {
  radiusSearchState: RadiusSearchState;
  updateRadiusSearchState: React.Dispatch<React.SetStateAction<any>>;
}

export const RadiusSearchContext = createContext({} as IRadiusSearchContext);

export const RadiusSearchContextProvider = ({ children }) => {
  const [radiusSearchState, setRadiusSearchState] = useState<RadiusSearchState>(
    RadiusSearchStateDefault
  );

  const value = {
    radiusSearchState,
    updateRadiusSearchState,
  };

  function updateRadiusSearchState(newState: any) {
    setRadiusSearchState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <RadiusSearchContext.Provider value={value}>
      {children}
    </RadiusSearchContext.Provider>
  );
};
