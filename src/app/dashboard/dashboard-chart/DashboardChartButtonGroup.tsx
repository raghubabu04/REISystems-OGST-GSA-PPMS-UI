import React, { useContext } from "react";
import { Nav } from "react-bootstrap";
import {
  dashboardChartBtnGroup,
  getChartSeries,
} from "../constants/DashboardConstants";
import { DashboardChartContext } from "./DashboardChartContext";

export default function DashboardChartButtonGroup() {
  const { dashboardChartState, updateDashboardChartState } = useContext(
    DashboardChartContext
  );

  function onBtnSelect(event: any) {
    const activeBtn = event.toString();
    const selectedWeeklyForFiscalYear =
      activeBtn === "weeks"
        ? dashboardChartState.selectedWeeklyForFiscalYear
        : false;

    var chartOptions = getChartSeries(
      activeBtn,
      dashboardChartState.activeRadio,
      selectedWeeklyForFiscalYear,
      dashboardChartState.data
    );
    updateDashboardChartState({
      activeBtn: activeBtn,
      categories: chartOptions.categories,
      series: chartOptions.series,
      weeklySeries: chartOptions.weeklySeries,
      showWeeklyForFiscalYear: activeBtn === "weeks" ? true : false,
      selectedWeeklyForFiscalYear: selectedWeeklyForFiscalYear,
    });
  }

  return (
    <Nav
      as={"ul"}
      key={`key-nav-dashboardChartBtnGroup`}
      className="usa-button-group usa-button-group--segmented dashboard-btn-group"
    >
      {dashboardChartBtnGroup.map((f) => {
        return (
          <Nav.Item
            as={"li"}
            key={`key-${f.id}`}
            className="usa-button-group__item"
          >
            <Nav.Link
              eventKey={f.id}
              as={"button"}
              key={`key-link-${f.id}`}
              className={`usa-button ${
                dashboardChartState.activeBtn !== `${f.id}`
                  ? "usa-button--outline"
                  : ""
              }`}
              onSelect={onBtnSelect}
            >
              {f.value}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}
