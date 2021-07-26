import React, { useEffect, useState } from "react";
import { PPMSForm } from "../../../../../ui-kit/components/common/form/PPMS-form";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import {formatDate} from "../../../../../ui-kit/utilities/FormatUtil";
interface ContractNumberDetailsProps {
  saleId?: string;
  zoneId?: any;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedByName?: string;
  showCurrentItems?: boolean;
  totalICNs?: number;
  totalValidLots?: number;
  availableLots?: any[];
  showAvailableLots?: boolean;
  isPropertyCustodian?: boolean;
  contractHistoryFunction?: any;
}
const ContractHistory = (props: ContractNumberDetailsProps) => {
  return (
    <>
      <div className={"grid-row grid-gap"}>
        <div className="tablet:grid-col-5">
          
            <strong>Last Updated By:</strong>  {props.updatedByName}
          
        </div>
        <div className="tablet:grid-col-4">
          
            <strong>Last Updated Date:</strong>  {formatDate(props.updatedAt)}
          
        </div>
        <div className={"tablet:grid-col-3 text-right"}>
          <PPMSButton
            className={"out-button"}
            type={"button"}
            value={""}
            label={"Contract History"}
            onPress={props.contractHistoryFunction}
            id={"view-contract-history"}
          />
        </div>
      </div>
    </>
  );
};

export default ContractHistory;
