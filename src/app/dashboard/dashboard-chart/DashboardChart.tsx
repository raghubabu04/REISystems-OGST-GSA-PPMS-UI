import React, { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SeriesOptionsType, Point } from "highcharts";
import { DashboardChartContext } from "./DashboardChartContext";
import {
  dollarFormat,
  getChartOptions,
  ToolTipInfo,
} from "../constants/DashboardConstants";

export default function DashboardChart() {
  const { dashboardChartState } = useContext(DashboardChartContext);

  const xAxisLabelStyle = {
    fontSize: "12px",
    fontWeight: "bold",
  };

  var xAxisOptions: Highcharts.XAxisOptions = {
    labels: {
      style: xAxisLabelStyle,
    },
    categories: dashboardChartState.categories,
  };

  let getToolTipInfo = function (point: Point): ToolTipInfo {
    return {
      category: point.category,
      seriesName: point.series.name,
      acquisitionCost: point["custom"]["acquisitionCost"],
      lineItems: point["custom"]["lineItems"],
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
    return `Total Value: ${dollarFormat(
      toolTipInfo.acquisitionCost.toString()
    )}<br>Line items: ${toolTipInfo.lineItems}`;
  };

  let chartOptions = getChartOptions(
    dashboardChartState,
    xAxisOptions,
    descriptionFormatter,
    toolTipFormatter,
    dashboardChartState.series as SeriesOptionsType[]
  );

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
