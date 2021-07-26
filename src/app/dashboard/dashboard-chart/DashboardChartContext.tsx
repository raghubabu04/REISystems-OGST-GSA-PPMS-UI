import React, { createContext, useState } from "react";
import {
  DashboardChartState,
  DashboardChartStateDefaults,
} from "./DashboardChartState";

export interface IDashboardContext {
  dashboardChartState: DashboardChartState;
  updateDashboardChartState: React.Dispatch<React.SetStateAction<any>>;
}

export const DashboardChartContext = createContext({} as IDashboardContext);

export const DashboardChartContextProvider = ({ children }) => {
  const [dashboardChartState, setDashboardChartState] = useState<
    DashboardChartState
  >(DashboardChartStateDefaults);

  //function called to update DashboardState
  function updateDashboardChartState(newState: DashboardChartState) {
    setDashboardChartState((prevState: DashboardChartState) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  }

  const value = {
    dashboardChartState,
    updateDashboardChartState,
  };
  return (
    <DashboardChartContext.Provider value={value}>
      {children}
    </DashboardChartContext.Provider>
  );
};
