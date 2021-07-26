import React from "react";
import { connect } from "react-redux";
import { TcnWorkFlowType } from "../create-update-property/constants/Constants";
import Filter from "../Filter";
import MyRequestsList from "./MyRequestsList";
interface MyRequestsProps {
  tcnInfo?: any;
  roles?: any;
  location?: Location;
  router?: any;
  workflow: TcnWorkFlowType;
}

export function MyRequests(props: MyRequestsProps) {
  return (
    <div className="grid-conatiner ui-ppms">
      <h1>Property Requests</h1>
      <div className="grid-row grid-gap-4">
        <div className="desktop:grid-col-3 filter-cards usa-layout-docs__sidenav">
          <Filter {...props} />
        </div>
        <div className="desktop:grid-col-9 usa-layout-docs__main">
          <MyRequestsList {...props} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  roles: state.authentication.roles,
});

export default connect(mapStateToProps)(MyRequests);
