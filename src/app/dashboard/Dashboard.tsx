import React, { StrictMode } from "react";
import DashboardCardsPanel from "./dashboard-cards/DashboardCardsPanel";
import DashboardStatisticsPanel from "./dashboard-statistics/DashboardStatisticsPanel";
import DashboardChartPanel from "./dashboard-chart/DashboardChartPanel";
import { DashboardChartContextProvider } from "./dashboard-chart/DashboardChartContext";

export interface DashboardProps {}

export default function Dashboard(props: DashboardProps) {
  return (
    <StrictMode>
      <div className="grid-conatiner">
        <div className="grid-row grid-gap">
          <div className="grid-col-3">
            <DashboardCardsPanel />
          </div>
          <br />
          <div className="grid-col-9">
            <DashboardStatisticsPanel />
            
            <br />
            <DashboardChartContextProvider>
              <DashboardChartPanel />
            </DashboardChartContextProvider>
          </div>
        </div>
      </div>
    </StrictMode>
  );
}
