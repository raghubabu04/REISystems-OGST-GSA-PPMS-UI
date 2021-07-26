import React, { useContext, useMemo } from "react";
import { getChartSeries } from "../constants/DashboardConstants";
import { PPMSToggleCheckbox } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { DashboardChartContext } from "./DashboardChartContext";

export default function DashboardChartCheckBoxWeeklyFiscalYear() {
  const { dashboardChartState, updateDashboardChartState } = useContext(
    DashboardChartContext
  );

  function onCheckFiscalYearWeekly(values: any) {
    if (values.length > 0) {
      const selectedWeeklyForFiscalYear: boolean = values.find((value: any) => {
        if (value.value === "Fiscal Year YTD") {
          return value;
        }
      }).isSelected;

      var chartOptions = getChartSeries(
        dashboardChartState.activeBtn,
        dashboardChartState.activeRadio,
        selectedWeeklyForFiscalYear,
        dashboardChartState.data
      );
      updateDashboardChartState({
        categories: chartOptions.categories,
        series: chartOptions.series,
        weeklySeries: chartOptions.weeklySeries,
        selectedWeeklyForFiscalYear: selectedWeeklyForFiscalYear,
      });
    }
  }

  return useMemo(() => {
    //import to reset the "Fiscal Year YTD" checkbox
    const weeklyFiscalYearSelected =
      dashboardChartState.activeBtn === "weeks" &&
      dashboardChartState.selectedWeeklyForFiscalYear
        ? true
        : false;

    let defaultWeeklyFiscalYear = [
      {
        id: "weeklyFiscalYear",
        value: "Fiscal Year YTD",
        isSelected: weeklyFiscalYearSelected,
      },
    ];
    return (
      <PPMSToggleCheckbox
        id={`fiscal-year-weekly`}
        options={defaultWeeklyFiscalYear}
        isInline={false}
        isDisabled={false}
        name={"notify"}
        className={"toggle-single-checkbox"}
        label={""}
        validationMessage={""}
        isSingleSelect={true}
        onChange={onCheckFiscalYearWeekly}
      />
    );
  }, [dashboardChartState]);
}
