import React from "react";
import TCNAllocationDetails from "./TCNAllocationDetails";
interface RequisitionDetailsProps {
  match: any;
  history: any;
}
export const RequisitionTcnDetails = (props: RequisitionDetailsProps) => {
  const tcn = props.match.params.tcn;
  return (
    <TCNAllocationDetails
      tcn={tcn}
      requisition={true}
      history={props.history}
    />
  );
};
