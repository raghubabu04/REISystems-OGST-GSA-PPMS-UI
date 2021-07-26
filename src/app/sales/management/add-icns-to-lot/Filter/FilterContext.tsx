import React, { createContext, useState } from "react";
import { FilterState, FilterStateDefaults } from "./FilterState";

export interface IFilterContext {
  searchCriteria: FilterState;
  updateSearchCriteria: React.Dispatch<React.SetStateAction<any>>;
}

export const FilterContext = createContext({} as IFilterContext);

export const SalesFilterContextProvider = ({ children }) => {
  const [searchCriteria, setSearchCriteria] = useState<FilterState>(
    FilterStateDefaults
  );

  //function called to update DashboardState
  function updateSearchCriteria(newState: FilterState) {
    setSearchCriteria((prevState: FilterState) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  }

  const value: IFilterContext = {
    searchCriteria,
    updateSearchCriteria,
  };
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
