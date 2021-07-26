import React from "react";
import { connect } from "react-redux";
import { AllocationContextProvider } from "../allocate-property/AllocationContext";
import AllocationsApproveTransferOrders from "../allocate-property/AllocationsApproveTransferOrders";
import { TcnWorkFlowType } from "../create-update-property/constants/Constants";
import Filter from "../Filter";
interface SearchAllocationsProps {
  tcnInfo?: any;
  roles?: any;
  location?: Location;
  router?: any;
  workflow: TcnWorkFlowType;
}

const getTableContent: Function = (props) => {
  switch (props.workflow) {
    case TcnWorkFlowType.ALLOCATIONS:
      return <AllocationsApproveTransferOrders {...props} />;
    case TcnWorkFlowType.APPROVE_TRANSFER_ORDERS:
    case TcnWorkFlowType.REQUISITION_TRANSFER_ORDERS:
    case TcnWorkFlowType.COMPLETED_TRASFER:
      return (
        <AllocationContextProvider>
          <AllocationsApproveTransferOrders {...props} />
        </AllocationContextProvider>
      );

    default:
      return <></>;
  }
};

export function SearchAllocations(props: SearchAllocationsProps) {
  return (
    <div className="grid-conatiner ui-ppms">
      <h1>{props.workflow}</h1>
      <div className="grid-row grid-gap-4">
        <div className="desktop:grid-col-3 filter-cards usa-layout-docs__sidenav">
          <Filter {...props} />
        </div>
        <div className="desktop:grid-col-9 usa-layout-docs__main">
          {getTableContent(props)}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  roles: state.authentication.roles,
});

export default connect(mapStateToProps)(SearchAllocations);
