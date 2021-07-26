import React from "react";
import TCNAllocationDetails from "./TCNAllocationDetails";
interface CompleteTransferProps {
  match: any;
  history: any;
}
export const CompleteTransferDetails = (props: CompleteTransferProps) => {
  const tcn = props.match.params.tcn;
  return (
    <TCNAllocationDetails
      tcn={tcn}
      completeTransfer={true}
      history={props.history}
    />
  );
};
