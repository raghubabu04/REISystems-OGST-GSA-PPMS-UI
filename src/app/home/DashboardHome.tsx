import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";

export interface DashboardProps {
  user: any;
  userAccess: string[];
  roles: any;
  loggedIn: boolean;
  permissions: any[];
  aacs: any[];
  authentication: any;
}

function DashboardHome(props: DashboardProps) {
  let permissionsLabel, userZoneLabel, aacLabel;
  let permissions =
    props.permissions &&
    props.permissions.map((permission, i) => {
      return (
        <>
          {i > 0 ? ", " : ""}
          <span key={"roles-" + i}> {permission}</span>
        </>
      );
    });
  let aacCodes =
    props.aacs &&
    props.aacs.map((aac, i) => {
      return (
        <>
          {i > 0 ? ", " : ""}
          <span key={"aacCode-" + i}> {aac}</span>
        </>
      );
    });

  let userZones = props?.authentication?.zones?.map((zone, i) => {
    return (
      <>
        {i > 0 ? ", " : ""}
        <span key={"userzone-" + i}> {zone}</span>
      </>
    );
  });
  if (props?.user?.userRoles?.length > 0) {
    permissionsLabel = (
      <p>
        User Roles:
        <strong>{permissions}</strong>
      </p>
    );
    userZoneLabel = (
      <p>
        User Zones:
        <strong> {userZones}</strong>
      </p>
    );
  } else if (props?.permissions?.length > 0) {
    permissionsLabel = (
      <p>
        Permissions:
        <strong>{permissions}</strong>
      </p>
    );
    aacLabel = (
      <p>
        AAC Codes:
        <strong> {aacCodes}</strong>
      </p>
    );
  }
  return (
    <div>
      <div className="dash-header">
        <h1>
          <span>
            Welcome, {props?.user && props?.user?.firstName}{" "}
            {props?.user?.user && props?.user?.lastName}
          </span>
        </h1>
        <div className="user-contact-detail">
          <span>
            <a href="mailto:ppdms.sm.user@gmail.com">
              <FaEnvelope /> {props?.user && props?.user?.emailAddress}
            </a>
          </span>
          <span>
            <FaPhone /> {props?.user && props?.user?.phoneNumber}
          </span>
        </div>
        <div className="usa-summary-box" role="complementary">
          <div className="usa-summary-box__body">
            <div className="usa-summary-box__text">
              <ul className="usa-list data-list">
                <li>
                  <p>Access level:</p>
                  <p>{props.userAccess}</p>
                </li>
                <li>{permissionsLabel}</li>
                <li>
                  <p>
                    Email Address:
                    <strong> {props.user && props.user.emailAddress}</strong>
                  </p>
                </li>
                <li>
                  Name:
                  <strong>
                    {props.user && props.user.firstName}{" "}
                    {props.user && props.user.lastName}
                  </strong>
                </li>
                <li>
                  <p>
                    Phone:
                    <strong> {props.user && props.user.phoneNumber}</strong>
                  </p>
                </li>
                <li>
                  <p>
                    Is SM:
                    <strong>
                      {" "}
                      {props.roles && props.roles.isSM ? "Yes" : "No"}
                    </strong>
                  </p>
                </li>
                <li>
                  <p>
                    Location State:
                    <strong>
                      {" "}
                      {props.user && props.user.userLocationState}
                    </strong>
                  </p>
                </li>
                <li>{aacLabel}</li>
                <li>{userZoneLabel}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
