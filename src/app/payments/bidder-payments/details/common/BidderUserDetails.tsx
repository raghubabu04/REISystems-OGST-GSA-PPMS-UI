import React from "react";
import PPMSCard from "../../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
interface BidderUserDetailsProps {
  details: any;
}
const BidderUserDetails = (props: BidderUserDetailsProps) => {
  const { details } = props;
  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard>
          <PPMSCardBody className="sale-number-details">
            <div className={"grid-row grid-gap"}>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Bidder Username</div>
                <div className="tablet:grid-row">{details.bidderUserName}</div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Bidder Name</div>
                <div className="tablet:grid-row">
                  {details.bidderName}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Status</div>
                <div className="tablet:grid-row">{details.status}</div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Total Open Contract(s)</div>
                {details.totalOpenContracts}
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Total Amount Due</div>
                {details.totalAmountDue}
              </div>
            </div>
          
          
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
     
    </>
  );
};

export default BidderUserDetails;
