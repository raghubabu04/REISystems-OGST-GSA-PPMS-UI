import React, { useEffect, useState } from "react";
import { DashboardApiService } from "../../../api-kit/dashboard/dahboard-api-service";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import { PageHelper, Paths } from "../../Router";
import { Link } from "react-router-dom";
export interface DashboardCards {
  newMessages?: number;
  myProperties?: number;
  myRequests?: number;
  myAllocations?: number;
  myRequisitions?: number;
  newUsers?: number;
}

export const DashboardCardsDefaults = {
  newMessages: 0,
  myProperties: 0,
  myRequests: 0,
  myAllocations: 0,
  myRequisitions: 0,
  newUsers: 0,
};

export default function DashboardCardsPanel() {
  let dashboardService = new DashboardApiService();

  const [dashboardCards, setDashboardCards] = useState<DashboardCards>(
    DashboardCardsDefaults
  );

  //function called to update DashboardState
  function updateDashboardCards(newState: DashboardCards) {
    setDashboardCards((prevState: any) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  }

  useEffect(() => {
    dashboardService.getPropertyCards().then((response: any) => {
      updateDashboardCards({
        myProperties: response?.data?.myProperties,
        myRequests: response?.data?.myRequests,
        myAllocations: response?.data?.myAllocations,
        myRequisitions: response?.data?.myRequisitions,
      });
    });
    dashboardService.getUserCards().then((response: any) => {
      updateDashboardCards({
        newUsers: response?.data,
      });
    });
  }, []);

  return (
    <div className="ui-ppms">
      <PPMSCardGroup className={"ppms-card-group"}>
        <PPMSCard>
          <div className="dashboard-side-card">
            <PPMSCardBody className={"dashboard-card-body"}>
              <div className={"dashboard-panel-header dashboard-side-card-txt"}>
                <b>{dashboardCards.myRequests}</b>
              </div>
              <div className="dashboard-side-card-smtxt">
                <Link to={Paths.tasks}>My Change Requests</Link>
              </div>
            </PPMSCardBody>
          </div>
        </PPMSCard>
        <PPMSCard>
          <div className="dashboard-side-card">
            <PPMSCardBody className={"dashboard-card-body"}>
              <div className={"dashboard-panel-header dashboard-side-card-txt"}>
                <b>{dashboardCards.myAllocations}</b>
              </div>
              <div className="dashboard-side-card-smtxt">
                <Link to={Paths.allocations}>My Allocations</Link>
              </div>
            </PPMSCardBody>
          </div>
        </PPMSCard>
        <PPMSCard>
          <div className="dashboard-side-card">
            <PPMSCardBody className={"dashboard-card-body"}>
              <div className={"dashboard-panel-header dashboard-side-card-txt"}>
                <b>{dashboardCards.myRequisitions}</b>
              </div>
              <div className="dashboard-side-card-smtxt">
                <Link to={Paths.requisitionTransferOrders}>
                  My Requisitions
                </Link>
              </div>
            </PPMSCardBody>
          </div>
        </PPMSCard>
        <PPMSCard>
          <div className="dashboard-side-card">
            <PPMSCardBody className={"dashboard-card-body"}>
              <div className={"dashboard-panel-header dashboard-side-card-txt"}>
                <b>{dashboardCards.myProperties}</b>
              </div>
              <div className="dashboard-side-card-smtxt">
                <a
                  href={"#"}
                  onClick={() => {
                    PageHelper.openPage(Paths.newPropertyList);
                  }}
                >
                  New Property Reports
                </a>
              </div>
            </PPMSCardBody>
          </div>
        </PPMSCard>
        <PPMSCard>
          <div className="dashboard-side-card">
            <PPMSCardBody className={"dashboard-card-body"}>
              <div className={"dashboard-panel-header dashboard-side-card-txt"}>
                <b>{dashboardCards.newUsers}</b>
              </div>
              <div className="dashboard-side-card-smtxt">
                <Link to={Paths.usersList + "?myTerritory=true&newUsers=true"}>
                  New Users
                </Link>
              </div>
            </PPMSCardBody>
          </div>
        </PPMSCard>
      </PPMSCardGroup>
    </div>
  );
}
