import React, { useContext } from "react";
import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SeriesOptionsType } from "highcharts";
import { DashboardChartContext } from "./DashboardChartContext";
import {
  dollarFormat,
  getChartOptions,
  ToolTipInfo,
} from "../constants/DashboardConstants";

export default function DashboardWeeklyFiscalYearChart() {
  const { dashboardChartState } = useContext(DashboardChartContext);

  const xAxisLabelStyle = {
    fontSize: "12px",
    fontWeight: "bold",
  };

  var xAxisOptions: Highcharts.XAxisOptions = {
    type: "datetime",
    tickInterval: 1000 * 3600 * 24 * 30, // 1 month
    labels: {
      style: xAxisLabelStyle,
      staggerLines: 1,
      formatter: function () {
        return Highcharts.dateFormat("%b", this.value).toUpperCase();
      },
    },
  };

  let getToolTipInfo = function (point: Point): ToolTipInfo {
    return {
      seriesName: point.series.name,
      category: point.options["category"],
      acquisitionCost:
        point.options["property"] === "acquisitionCost"
          ? point.options["y"]
          : point.options["z"],
      lineItems:
        point.options["property"] === "acquisitionCost"
          ? point.options["z"]
          : point.options["y"],
    };
  };

  let descriptionFormatter = function (point: Point) {
    const toolTipInfo: ToolTipInfo = getToolTipInfo(point);
    return `${toolTipInfo.category} ${
      toolTipInfo.seriesName
    } Total Value: ${dollarFormat(
      toolTipInfo.acquisitionCost.toString()
    )} Line items: ${toolTipInfo.lineItems}`;
  };

  let toolTipFormatter = function () {
    const toolTipInfo: ToolTipInfo = getToolTipInfo(this.point);
    return `${toolTipInfo.category}<br/>Total Value: ${dollarFormat(
      toolTipInfo.acquisitionCost.toString()
    )}<br>Total Line Items: ${toolTipInfo.lineItems}`;
  };

  let chartOptions = getChartOptions(
    dashboardChartState,
    xAxisOptions,
    descriptionFormatter,
    toolTipFormatter,
    dashboardChartState.weeklySeries as SeriesOptionsType[]
  );

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
