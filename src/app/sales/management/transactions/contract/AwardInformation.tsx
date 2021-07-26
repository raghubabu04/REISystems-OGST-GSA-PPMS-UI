import React, { useEffect, useState } from "react";
import { PPMSForm } from "../../../../../ui-kit/components/common/form/PPMS-form";
import {
  formatCurrencyWODecimal,
  formatDate,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import { Paths } from "../../../../Router";
interface AwardInformationDetailsProps {
  saleId?: string;
  zoneId?: any;
  showCurrentItems?: boolean;
  totalICNs?: number;
  totalValidLots?: number;
  availableLots?: any[];
  showAvailableLots?: boolean;
  isPropertyCustodian?: boolean;
  awardDetails?: any;
}
const AwardInformationDetails = (props: AwardInformationDetailsProps) => {
  const { awardDetails } = props;
  return (
    <>
      <div className={"grid-row grid-gap"}>
        <div className="tablet:grid-col-auto">
          <div className="tablet:grid-row-12">
            <div className="tablet:grid-row">
              <strong>Bidder:</strong>
              <p>{awardDetails.bidderName ? awardDetails.bidderName : "-"}</p>
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-auto">
          <div className="tablet:grid-row-12">
            <div className="tablet:grid-row">
              <strong>Bidder Username: </strong>
              <p>
                {awardDetails.bidderUsername? <a href={Paths.viewBidder + "/" + awardDetails.bidderUsername}>
                {awardDetails.bidderUsername}
                </a> : "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-auto">
          <div className="tablet:grid-row-12">
            <div className="tablet:grid-row">
              <strong>Award Date: </strong>
              <p>
                {awardDetails.awardedDate
                  ? formatDate(awardDetails.awardedDate)
                  : "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-auto">
          <div className="tablet:grid-row-12">
            <div className="tablet:grid-row">
              <strong>Award Amount: </strong>
              <p>
                {awardDetails.bidAmount
                  ? formatCurrencyWODecimal.format(awardDetails.bidAmount)
                  : "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-auto">
          <div className="tablet:grid-row-12">
            <div className="tablet:grid-row">
              <strong>Amount Due: </strong>
              <p>
                {awardDetails.amountDue
                  ? formatCurrencyWODecimal.format(awardDetails.amountDue)
                  : "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-auto">
          <div className="tablet:grid-row-12">
            <div className="tablet:grid-row">
              <strong>Reserve Met:</strong>
              <p>{awardDetails.reserveMet ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AwardInformationDetails;
