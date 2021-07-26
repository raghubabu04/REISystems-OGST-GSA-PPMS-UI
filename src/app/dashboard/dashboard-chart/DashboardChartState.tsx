import {
  ChartSeries,
  WeeklyChartSeries,
} from "../constants/DashboardConstants";

export interface DashboardChartState {
  activeBtn: string;
  activeRadio: string;
  categories?: string[];
  series?: ChartSeries[];
  data?: any;
  showWeeklyForFiscalYear: boolean;
  selectedWeeklyForFiscalYear: boolean;
  yAxisTitle: string;
  weeklySeries?: WeeklyChartSeries[];
  weeklyCategories?: string[];
}

export const DashboardChartStateDefaults: DashboardChartState = {
  activeBtn: "year",
  activeRadio: "acquisitionCost",
  yAxisTitle: "Original Acquisition Cost ($)",
  showWeeklyForFiscalYear: false,
  selectedWeeklyForFiscalYear: false,
};
