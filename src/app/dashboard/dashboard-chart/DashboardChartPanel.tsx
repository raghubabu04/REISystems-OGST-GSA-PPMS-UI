import React, { useContext, useEffect } from "react";
import DashboardChartButtonGroup from "./DashboardChartButtonGroup";
import DashboardChartRadioGroup from "./DashboardChartRadioGroup";
import { DashboardChartContext } from "./DashboardChartContext";
import { DashboardApiService } from "../../../api-kit/dashboard/dahboard-api-service";
import {
  DashboardChartOptions,
  getChartSeries,
} from "../constants/DashboardConstants";
import DashboardChartCheckBoxWeeklyFiscalYear from "./DashboardChartCheckBoxWeeklyFiscalYear";
import Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import DashboardChartWeeklyFiscalYear from "./DashboardChartWeeklyFiscalYear";
import DashboardChart from "./DashboardChart";
import { FaRegChartBar } from "react-icons/fa";

// init the module
highchartsAccessibility(Highcharts);

export default function DashboardChartPanel() {
  const { dashboardChartState, updateDashboardChartState } = useContext(
    DashboardChartContext
  );

  useEffect(() => {
    const dashboardApiService = new DashboardApiService();
    dashboardApiService
      .getChartData()
      .then((response: any) => {
        const chartData: DashboardChartOptions = getChartSeries(
          dashboardChartState.activeBtn,
          dashboardChartState.activeRadio,
          dashboardChartState.selectedWeeklyForFiscalYear,
          response?.data
        );
        updateDashboardChartState({
          data: response?.data,
          categories: chartData.categories,
          series: chartData.series,
          weeklyCategories: chartData.weeklyCategories,
        });
      })
      .catch((error: any) => {
        console.log("error log", error);
      });
  }, []);

  return (
    <>
    <div className="ui-ppms">
    <div className="dashboard-chart-blue-body">
    <div className="dashboard-chart-blue-header">
      <div className="grid-row">
        <div className="grid-col-6">
          <div className="dashboard-chart-headertxt">
          <i className="fas mr-2">{<FaRegChartBar />}</i>
            <b>All Properties Reported In My Territory</b>
          </div>
        </div>
        <div className="grid-col-6">
          <DashboardChartButtonGroup />
        </div>
      </div>
      <br />
      <div className="grid-row">
        <DashboardChartRadioGroup />
      </div>
      <br />
      {dashboardChartState.selectedWeeklyForFiscalYear ? (
        <DashboardChartWeeklyFiscalYear />
      ) : (
        <DashboardChart />
      )}
      {dashboardChartState.showWeeklyForFiscalYear && (
        <DashboardChartCheckBoxWeeklyFiscalYear />
      )}
      </div>
    </div>
    </div>
    </>
  );
}
