import React, { useEffect } from "react";
import { PPMSCardGroup } from "../../../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../../../ui-kit/components/common/card/PPMS-card-body";
import {
  formatContractNumber,
  formatSaleNumber,
} from "../../../../../../ui-kit/utilities/FormatUtil";
import { NON_INTERNATE_SALES_METHOD } from "../../constants/Constants";
import {formatLotNumber} from "../../../../management-pbs-doi/lot-details/property/common/constants/Utils";

interface ContractNumberDetailsProps {
  contractDetails?: any;
  zoneId?: any;
  salesMethod?: any;
}

const ContractNumberDetails = (props: ContractNumberDetailsProps) => {
  const { zoneId, contractDetails, salesMethod } = props;

  useEffect(() => {}, []);

  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard>
          <PPMSCardBody className="sale-number-details">
            <div className={"grid-row grid-gap"}>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Contract Number</div>
                <div className="tablet:grid-row">
                  {contractDetails?.contractDTO?.contractNumber
                    ? formatContractNumber(
                        contractDetails?.contractDTO?.contractNumber
                      )
                    : "-"}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Sale Number</div>
                <div className="tablet:grid-row">
                  {contractDetails?.contractDTO?.salesNumber
                    ? formatSaleNumber(
                        contractDetails?.contractDTO?.salesNumber
                      )
                    : "-"}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Lot Number</div>
                <div className="tablet:grid-row">
                  {contractDetails?.lotDTO?.lotNumber?formatLotNumber(contractDetails?.lotDTO?.lotNumber,3):"-"}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Contract Status</div>
                {!NON_INTERNATE_SALES_METHOD.includes(salesMethod) && (
                  <div className="tablet:grid-row">
                    {contractDetails?.contractDTO?.contractStatus}
                  </div>
                )}
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
};

export default ContractNumberDetails;
