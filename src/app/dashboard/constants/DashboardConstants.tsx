import {
  Point,
  ScreenReaderFormatterCallbackFunction,
  SeriesOptionsType,
  TooltipFormatterCallbackFunction,
} from "highcharts";
import { DashboardChartState } from "../dashboard-chart/DashboardChartState";

export const dashboardChartBtnGroup = [
  {
    id: "weeks",
    value: "Weeks FY YTD",
  },
  {
    id: "months",
    value: "Months FY YTD",
  },
  {
    id: "year",
    value: "FY YTD",
  },
];

export const dashboardChartRadioGroup = [
  {
    id: "acquisitionCost",
    value: "Original Acquisition Cost",
    isSelected: true,
  },
  {
    id: "lineItems",
    value: "Line Items",
  },
];

export interface ToolTipInfo {
  category?: string;
  seriesName?: string;
  acquisitionCost: number;
  lineItems: number;
}

export interface ChartSeries {
  name: string;
  data: number[];
  keys: string[];
  color: string;
}

export interface WeeklyChartInnerSeries {
  x: number;
  y: number;
  z: number;
  category: string;
  property: string;
}
export interface WeeklyChartSeries {
  name: string;
  data: WeeklyChartInnerSeries[];
  color: string;
}

export interface DashboardChartOptions {
  categories?: string[];
  series?: ChartSeries[];
  weeklyCategories?: number[];
  weeklySeries?: WeeklyChartSeries[];
}

let getArray = function (
  data: Object[],
  type: string,
  property: string
): number[] {
  let items = [];
  data.forEach((element) => {
    items.push([
      Number(element[type][property]),
      Number(element[type]["acquisitionCost"]),
      Number(element[type]["lineItems"]),
    ]);
  });
  return items;
};

interface EightWeeksSeries {
  key?: string;
  transferred?: {
    acquisitionCost: number;
    lineItems: number;
  };
  donated?: {
    acquisitionCost: number;
    lineItems: number;
  };
}

let getEightWeeksData = function (data: any[]): EightWeeksSeries[] {
  let items: EightWeeksSeries[] = [];
  const transferredAcquisitionCosts = data["transferredAcquisitionCost"];
  const donatedAcquisitionCosts = data["donatedAcquisitionCost"];
  const transferredLineItems = data["transferredLineItems"];
  const donatedLineItems = data["donatedLineItems"];
  transferredAcquisitionCosts
    .slice(-8)
    .forEach((transferredAcquisitionCost: any) => {
      const key = transferredAcquisitionCost["x"];
      var transferredLineItem = transferredLineItems.find((item: any) => {
        return item["x"] === key;
      });
      var donatedLineItem = donatedLineItems.find((item: any) => {
        return item["x"] === key;
      });
      var donatedAcquisitionCost = donatedAcquisitionCosts.find((item: any) => {
        return item["x"] === key;
      });
      const transfered = {
        acquisitionCost: transferredAcquisitionCost["y"],
        lineItems: transferredLineItem["y"],
      };
      const donated = {
        acquisitionCost: donatedAcquisitionCost["y"],
        lineItems: donatedLineItem["y"],
      };
      items.push({
        key: getWeek(key),
        transferred: transfered,
        donated: donated,
      });
    });
  return items;
};

export function getCategories(chartDataList: Object[]): string[] {
  return chartDataList.map(function (item: any) {
    return item["key"];
  });
}

let getWeek = function (datetime: number, weekNumber?: number): string {
  let date: Date = new Date(datetime);
  let firstDayOfWeek = `${Number(date.getUTCMonth() + 1)}/${date.getUTCDate()}`;
  if (weekNumber && weekNumber === 1) {
    firstDayOfWeek = `10/1`;
  }
  let enddate = new Date(datetime);
  enddate.setDate(date.getDate() + 6);
  let lastDayOfWeek = `${Number(
    enddate.getUTCMonth() + 1
  )}/${enddate.getUTCDate()}`;
  return `${firstDayOfWeek}-${lastDayOfWeek}`;
};

export function getSeries(data: any, type: string): ChartSeries[] {
  let transLineItems = getArray(data, "transferred", type);

  let donatedLineItems = getArray(data, "donated", type);

  return [
    {
      name: "Property Transferred",
      data: transLineItems,
      keys: ["y", "custom.acquisitionCost", "custom.lineItems"],
      color: "#205493",
    },
    {
      name: "Property Donated",
      data: donatedLineItems,
      keys: ["y", "custom.acquisitionCost", "custom.lineItems"],
      color: "#222C31",
    },
  ];
}

let pushItemsToWeeklyChartSeries = function (
  items: WeeklyChartInnerSeries[],
  property: string,
  data: Object[],
  otherData: Object[]
) {
  let weekNumber: number = 1;
  data.forEach((element: Object[]) => {
    const key = element["x"],
      value = element["y"];
    var result = otherData.find((item: any) => {
      return item["x"] === key;
    });
    items.push({
      x: Number(key),
      y: Number(value),
      z: Number(result["y"]),
      category: getWeek(key, weekNumber),
      property: property,
    });
    weekNumber++;
  });
};
export interface WeeklyChartSeries {
  name: string;
  data: WeeklyChartInnerSeries[];
}
let getWeeklyArray = function (
  data: Object[],
  type: string,
  property: string
): WeeklyChartInnerSeries[] {
  let items: WeeklyChartInnerSeries[] = [];
  const transferredAcquisitionCost = data["transferredAcquisitionCost"];
  const donatedAcquisitionCost = data["donatedAcquisitionCost"];
  const transferredLineItems = data["transferredLineItems"];
  const donatedLineItems = data["donatedLineItems"];
  if (property === "acquisitionCost") {
    if (type === "transferred") {
      pushItemsToWeeklyChartSeries(
        items,
        property,
        transferredAcquisitionCost,
        transferredLineItems
      );
    }
    if (type === "donated") {
      pushItemsToWeeklyChartSeries(
        items,
        property,
        donatedAcquisitionCost,
        donatedLineItems
      );
    }
  } else if (property === "lineItems") {
    if (type === "transferred") {
      pushItemsToWeeklyChartSeries(
        items,
        property,
        transferredLineItems,
        transferredAcquisitionCost
      );
    }
    if (type === "donated") {
      pushItemsToWeeklyChartSeries(
        items,
        property,
        donatedLineItems,
        donatedAcquisitionCost
      );
    }
  }
  return items;
};

export function getWeeklyForFiscalYearSeries(
  data: any,
  type: string
): WeeklyChartSeries[] {
  let transLineItems = getWeeklyArray(data, "transferred", type);

  let donatedLineItems = getWeeklyArray(data, "donated", `${type}`);

  return [
    {
      name: "Property Transferred",
      data: transLineItems,
      color: "#205493",
    },
    {
      name: "Property Donated",
      data: donatedLineItems,
      color: "#222C31",
    },
  ];
}

export let getChartSeries = function (
  activeBtn: string,
  activeRadio: string,
  selectedWeeklyForFiscalYear: boolean,
  data: any
): DashboardChartOptions {
  let chartDatList = [];
  if (activeBtn === "months") {
    chartDatList = data?.monthlyChartDataList;
  } else if (activeBtn === "year") {
    chartDatList = data?.yearlyChartDataList;
  } else if (activeBtn === "weeks") {
    chartDatList = data?.weeklyChartDataList;
  }
  if (selectedWeeklyForFiscalYear === true) {
    return {
      weeklySeries: getWeeklyForFiscalYearSeries(chartDatList, activeRadio),
    };
  } else {
    if (activeBtn === "months" || activeBtn === "year") {
      return {
        categories: getCategories(chartDatList),
        series: getSeries(chartDatList, activeRadio),
      };
    } else if (activeBtn === "weeks") {
      const eightWeeksData: EightWeeksSeries[] = getEightWeeksData(
        data?.weeklyChartDataList
      );
      return {
        categories: getCategories(eightWeeksData),
        series: getSeries(eightWeeksData, activeRadio),
      };
    }
    return {};
  }
};

export let getYAxisOptions = function (
  dashboardChartState: DashboardChartState
): Highcharts.YAxisOptions {
  return {
    min: 0,
    title: {
      text: dashboardChartState.yAxisTitle,
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
  };
};

export const plotOptions: Highcharts.PlotOptions = {
  series: {
    animation: false,
    events: {
      legendItemClick: function () {
        return false;
      },
    },
  },
  bar: {
    dataLabels: {
      enabled: true,
    },
  },
};

export const legendOptions: Highcharts.LegendOptions = {
  itemStyle: {
    fontSize: "18px",
  },
  align: "left",
  symbolRadius: 0,
  backgroundColor: "#FFFFFF",
};

export let getChartOptions = function (
  dashboardChartState: DashboardChartState,
  xAxisOptions: Highcharts.XAxisOptions,
  descriptionFormatter: ScreenReaderFormatterCallbackFunction<Point>,
  toolTipFormatter: TooltipFormatterCallbackFunction,
  series: SeriesOptionsType[]
): Highcharts.Options {
  return {
    accessibility: {
      enabled: true,
      point: {
        descriptionFormatter: descriptionFormatter,
      },
    },
    title: {
      text: "",
    },
    chart: {
      animation: false,
      type: "column",
    },
    xAxis: xAxisOptions,
    yAxis: getYAxisOptions(dashboardChartState),
    plotOptions: plotOptions,
    legend: legendOptions,
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: toolTipFormatter,
    },
    series: series,
  };
};

export let dollarFormat = function (acquisitionCost: string): string {
  return `$${acquisitionCost
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    .replace("$", "")}`;
};
