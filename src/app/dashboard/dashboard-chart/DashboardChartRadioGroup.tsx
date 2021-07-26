import React, { useContext } from "react";
import {
  dashboardChartRadioGroup,
  getChartSeries,
} from "../constants/DashboardConstants";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { DashboardChartContext } from "./DashboardChartContext";

export default function DashboardChartRadioGroup() {
  const { dashboardChartState, updateDashboardChartState } = useContext(
    DashboardChartContext
  );

  function onRadioSelect(event: any) {
    event.forEach((e: any) => {
      if (e.isSelected) {
        var chartOptions = getChartSeries(
          dashboardChartState.activeBtn,
          e.id,
          dashboardChartState.selectedWeeklyForFiscalYear,
          dashboardChartState.data
        );
        updateDashboardChartState({
          activeRadio: e.id,
          yAxisTitle: e.id === "acquisitionCost" ? `${e.value}($)` : e.value,
          categories: chartOptions.categories,
          series: chartOptions.series,
          weeklySeries: chartOptions.weeklySeries,
        });
      }
    });
  }

  return (
    <div className="dashboard-radio-group">
      <PPMSToggleRadio
        id={"dashboardRadio"}
        options={dashboardChartRadioGroup}
        isInline={true}
        isDisabled={false}
        name={"dashboardRadio"}
        label={""}
        validationMessage={"Error!"}
        onChange={onRadioSelect}
      />
    </div>
  );
}
