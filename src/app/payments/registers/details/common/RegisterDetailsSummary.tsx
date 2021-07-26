import React from "react";
import PPMSCard from "../../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import moment from "moment";

interface RegisterDetailsSummaryProps {
  registerDetails: any;
}

const RegisterDetailsSummary = (props: RegisterDetailsSummaryProps) => {
  const { registerDetails } = props;
  let dateFormat = "MM/DD/YYYY hh:mmA";
  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard>
          <PPMSCardBody className="sale-number-details">
            <div className={"grid-row grid-gap"}>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Register Number</div>
                <div className="tablet:grid-row">
                  {registerDetails?.registerNumber}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Register Status</div>
                <div className="tablet:grid-row">{registerDetails?.status}</div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Closed Date</div>
                <div className="tablet:grid-row">
                  {registerDetails?.closeDate
                    ? moment(registerDetails?.closeDate).format(dateFormat)
                    : "-"}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Closed By</div>
                <div className="tablet:grid-row">
                  {registerDetails?.closeBy ? registerDetails?.closeBy : "-"}
                </div>
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
};

export default RegisterDetailsSummary;
