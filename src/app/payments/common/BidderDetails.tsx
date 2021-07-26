import React from "react";
import { PPMSCardGroup } from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../ui-kit/utilities/FormatUtil";

interface BidderDetailsProps {
  userName?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  totalOpenContracts?: number;
  totalAmountDue?: number;
  status?: string;
}

const BidderDetails = (props: BidderDetailsProps) => {
  const {
    userName,
    name,
    address,
    city,
    state,
    totalOpenContracts,
    totalAmountDue,
    status
  } = props;
  return (
    <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
      <PPMSCard>
        <PPMSCardBody className="sale-number-details">
          <div className={"grid-row grid-gap"}>
            {userName && (
              <div className="tablet:grid-col">
                <>
                  <div className="tablet:grid-row">
                    <strong>Bidder Username</strong>
                  </div>
                  <div className="tablet:grid-row">
                    <Link
                      to={`#`}
                      className={"sales-transaction"}
                      key="sales-transaction-id"
                    >
                      {userName}
                    </Link>
                  </div>
                </>
              </div>
            )}
            {name && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Bidder Name</strong>
                </div>
                <div className="tablet:grid-row">{name}</div>
              </div>
            )}
            {status && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Status</strong>
                </div>
                <div className="tablet:grid-row">{status}</div>
              </div>
            )}
            {address && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Bidder Address</strong>
                </div>
                <div className="tablet:grid-row">{address}</div>
              </div>
            )}
            {(city || state) && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Bidder City/State</strong>
                </div>
                <div className="tablet:grid-row">{`${city ? city : ""} ${
                  state ? "/" + state : ""
                }`}</div>
              </div>
            )}
            {totalOpenContracts >= 0 && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Total Open Contracts</strong>
                </div>
                <div className="tablet:grid-row">{totalOpenContracts}</div>
              </div>
            )}
            {totalAmountDue >= 0 && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Total Amount Due</strong>
                </div>
                <div className="tablet:grid-row">
                  {formatCurrency.format(totalAmountDue)}
                </div>
              </div>
            )}
          </div>
        </PPMSCardBody>
      </PPMSCard>
    </PPMSCardGroup>
  );
};

export default BidderDetails;
