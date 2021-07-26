import React, { createContext, useState } from "react";
import { FilterState, FilterStateDefaults } from "./FilterState";

export interface IFilterContext {
  searchCriteria: FilterState;
  hasQueryParams: boolean;
  updateSearchCriteria: React.Dispatch<React.SetStateAction<any>>;
  setHasQueryParamsToTrue: Function;
}

export const FilterContext = createContext({} as IFilterContext);

export const FilterContextProvider = ({ children }) => {
  const [searchCriteria, setSearchCriteria] = useState<FilterState>(
    FilterStateDefaults
  );

  const [hasQueryParams, setHasQueryParams] = useState<boolean>(false);

  //function called to update DashboardState
  function updateSearchCriteria(newState: FilterState) {
    setSearchCriteria((prevState: FilterState) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  }

  function setHasQueryParamsToTrue() {
    setHasQueryParams(true);
  }

  const value: IFilterContext = {
    searchCriteria,
    updateSearchCriteria,
    hasQueryParams,
    setHasQueryParamsToTrue,
  };
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
