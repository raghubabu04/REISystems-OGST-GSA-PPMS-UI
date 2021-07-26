import React, { StrictMode } from "react";
import ReadMore from "./ReadMore";

import PPMSAlert from "../../../ui-kit/components/common/alert/PPMS-alert";

interface AuctionAlertProps {
  item: any;
}

const formatDate = (dateString) => {
  let dateDraft = new Date(dateString);
  let startDate = dateDraft.toDateString();
  return startDate;
};

const AuctionAlert = (props: AuctionAlertProps) => {
  return (
    <StrictMode>
      <PPMSAlert type="warning">
        <div className="alert-item">
          <ReadMore
            text={props.item.alertText}
            maxCharacterCount={500}
          ></ReadMore>
          <p className={"text-italic"}>
            {" "}
            Effective on {formatDate(props.item.startDate)}
          </p>
        </div>
      </PPMSAlert>
    </StrictMode>
  );
};

export default AuctionAlert;
