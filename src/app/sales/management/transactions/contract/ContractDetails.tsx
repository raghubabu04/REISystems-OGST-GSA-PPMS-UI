import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../../../../Router";
import { PPMSForm } from "../../../../../ui-kit/components/common/form/PPMS-form";
import { formatSaleNumber } from "../../../../../ui-kit/utilities/FormatUtil";
import { formatLotNumber } from "../../../management-pbs-doi/lot-details/property/common/constants/Utils";
export interface ContractDetailsProps {
  saleId?: string;
  zoneId?: any;
  contractNumber?: string;
  contractStatus?: string;
  bidderEmail?: string;
  salesNumber?: string;
  lotId?: string;
  fscCode?: string;
  paymentDate?: string;
  removalDate?: string;
  showCurrentItems?: boolean;
  totalICNs?: number;
  totalValidLots?: number;
  availableLots?: any[];
  showAvailableLots?: boolean;
  isPropertyCustodian?: boolean;
  contractDetails?: any;
  lotNumber?: number;
  defaultZoneId?: any;
  contractId?: any;
  notesHistory?: any[];
}
const ContractDetails = (props: ContractDetailsProps) => {
  const { saleId, contractId, contractNumber, defaultZoneId } = props;
  return (
    <>
      <div className={"grid-row grid-gap"}>
        <div className="tablet:grid-col">
          <div className="tablet:grid-row">Contract Number</div>
          <div className="tablet:grid-row">
            {" "}
            <Link
              to={
                Paths.contractTransaction +
                `/${saleId}/${contractId}?contractNumber=${
                  contractNumber?.split("-")[0]
                }`
              }
              className={"sales-transaction"}
              key="sales-transaction-id"
            >
              {contractNumber}
            </Link>
          </div>
        </div>
        <div className="tablet:grid-col">
          <div className="tablet:grid-row">Sale Number</div>
          <div className="tablet:grid-row">
            {" "}
            <Link
              to={`${Paths.salesTransaction}${
                saleId ? "/" + saleId : ""
              }?zoneId=${defaultZoneId}`}
              className={"sales-transaction"}
              key="sales-transaction-id"
            >
              {formatSaleNumber(props.salesNumber)}
            </Link>
          </div>
        </div>
        <div className="tablet:grid-col">
          <div className="tablet:grid-row">Lot Number</div>
          <div className="tablet:grid-row">
            {formatLotNumber(props.lotNumber ? props.lotNumber : "", 3)}
          </div>
        </div>
        <div className="tablet:grid-col">
          <div className="tablet:grid-row">Contract Status</div>
          <div className="tablet:grid-row">{props.contractStatus}</div>
        </div>
      </div>
      <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
        <PPMSForm
          noValidate
          large={false}
          search={true}
          onSubmit={() => {}}
          className={"usa-accordion--bordered desktop:grid-col-12"}
        >
          {" "}
        </PPMSForm>
      </div>
    </>
  );
};

export default ContractDetails;
