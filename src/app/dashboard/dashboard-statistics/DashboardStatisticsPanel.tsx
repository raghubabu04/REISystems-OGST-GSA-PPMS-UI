import React, { useEffect, useState } from "react";
import { UserUtils } from "../../../utils/UserUtils";
import { DashboardApiService } from "../../../api-kit/dashboard/dahboard-api-service";
import { FaCalendarAlt, FaRegFile, FaRegFileImage } from "react-icons/fa";
import PropertyListPage from "../../property/manage-property/PropertyListPage";
import { PageHelper, Paths } from "../../Router";
export interface DashboardStats {
  totalProperties?: number;
  totalPropertiesWithImage?: number;
  totalIrregularProperties?: number;
  averageAllocationDays?: number;
}

export const DashboardStatsDefaults = {
  totalProperties: 0,
  totalPropertiesWithImage: 0,
  totalIrregularProperties: 0,
  averageAllocationDays: 0,
};

export default function DashboardStatisticsPanel() {
  let dashboardService = new DashboardApiService();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(
    DashboardStatsDefaults
  );

  function updateDashboardStats(newState: DashboardStats) {
    setDashboardStats((prevState: any) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  }

  useEffect(() => {
    dashboardService.getPropertyStatistics().then((response: any) => {
      console.log("This is the response", response.data);
      updateDashboardStats({
        totalProperties: response?.data?.totalProperties
          ? response.data.totalProperties
          : 0,
        totalPropertiesWithImage: response?.data?.totalPropertiesWithImage
          ? response.data.totalPropertiesWithImage
          : 0,
        totalIrregularProperties: response?.data?.totalIrregularProperties
          ? response.data.totalIrregularProperties
          : 0,
        averageAllocationDays: response?.data?.averageAllocationTime
          ? response.data.averageAllocationTime
          : 0,
      });
    });
  }, []);

  const imagePercent =
    dashboardStats.totalProperties === 0
      ? 0
      : (
          (dashboardStats.totalPropertiesWithImage * 100) /
          dashboardStats.totalProperties
        ).toFixed();

  return (
    <>
      <div className="ui-ppms">
        <div className="grid-row">
          <h1 className="dashboard-top-panel-header">
            <b>{UserUtils.getUserType()} Dashboard</b>
          </h1>
        </div>
        <div className="grid-row grid-gap-4">
          <div className={"grid-col-4"}>
            <div className={"user-task-databox1"}>
              <div className={"dashboard-stastic-value"}>
                <b>{imagePercent}</b>
                <span className={"dashboard-top-panel-sub-header-top"}>%</span>
              </div>
              <div className={"dashboard-static-icon"}>
                <i className="fas mr-2">
                  {<FaRegFileImage role="img" aria-label={"file dashboard"} />}
                </i>
              </div>
              <div className="user-task-data-txt">
                <a
                  href={"#"}
                  onClick={() => {
                    PageHelper.openPage(Paths.propertyListWithoutImages);
                  }}
                >
                  PROPERTY REPORTED WITH PICTURES
                </a>
              </div>
            </div>
          </div>
          <div className={"grid-col-4"}>
            <div className={"user-task-databox2"}>
              <div className={"dashboard-stastic-value"}>
                <strong>{dashboardStats.totalIrregularProperties}</strong>
              </div>
              <div className={"dashboard-static-icon"}>
                <i className="fas mr-2">
                  {<FaRegFile role="img" aria-label={"reg-file-dashboard"} />}
                </i>
              </div>
              <div className="user-task-data-txt">
                <a
                  href={"#"}
                  onClick={() => {
                    PageHelper.openPage(Paths.irregularPropertyList);
                  }}
                >
                  IRREGULAR PROPERTY REPORTS
                </a>
              </div>
            </div>
          </div>
          <div className={"grid-col-4 "}>
            <div className={"user-task-databox3"}>
              <div className={"dashboard-stastic-value"}>
                <b>{dashboardStats.averageAllocationDays}</b>{" "}
                <span className={"dashboard-top-panel-sub-header"}>DAYS</span>
              </div>
              <div className={"dashboard-static-icon"}>
                <i className="fas mr-2">
                  {
                    <FaCalendarAlt
                      role="img"
                      aria-label={"calendar dashboard"}
                    />
                  }
                </i>
              </div>
              <div className="user-task-data-txt">AVERAGE ALLOCATION TIME</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
