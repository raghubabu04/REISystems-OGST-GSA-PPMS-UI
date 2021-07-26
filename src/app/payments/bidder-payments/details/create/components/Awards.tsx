import React from "react";
import { formatSaleNumber } from "../../../../../../ui-kit/utilities/FormatUtil";

interface AwardsProps {
  saleLotNumber?: string;
  lotName?: string;
  contractNumber?: string;
  awardDate?: string;
  paymentDueDate?: string;
}

const Awards = (props: AwardsProps) => {
  const {
    saleLotNumber,
    lotName,
    contractNumber,
    awardDate,
    paymentDueDate,
  } = props;

  return (
    <div className="">
      <ul className="usa-list usa-list-award">
        <li>
          <span>Sale/Lot Number:</span>
          {saleLotNumber ? formatSaleNumber(saleLotNumber) : ""}
        </li>
        <li>
          <span>Lot Name:</span>
          {lotName}
        </li>
        <li>
          <span>Contract Number:</span>
          {contractNumber}
        </li>
        <li>
          <span>Award Date:</span>
          {awardDate}
        </li>
        <li>
          <span>Payment Due Date:</span>
          {paymentDueDate}
        </li>
      </ul>
    </div>
  );
};

export default Awards;
