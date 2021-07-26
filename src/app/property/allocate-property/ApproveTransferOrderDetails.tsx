import React from "react";
import TCNAllocationDetails from "./TCNAllocationDetails";
interface ApproveTODetailsProps {
  match: any;
  history: any;
}
export const ApproveTransferOrderDetails = (props: ApproveTODetailsProps) => {
  const tcn = props.match.params.tcn;
  return (
    <TCNAllocationDetails tcn={tcn} approveTO={true} history={props.history} />
  );
};
