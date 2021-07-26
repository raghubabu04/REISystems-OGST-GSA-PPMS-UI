import * as React from "react";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import { formatSaleNumber } from "../../../../ui-kit/utilities/FormatUtil";
import { Link } from "react-router-dom";
import { Paths } from "../../../Router";
import { PPMSCardGroup } from "../../../../ui-kit/components/common/card/PPMS-card-group";
import { saleMethodPBSDOI } from "./Constants";

type DescriptionProps = {
  id?: string;
  number: string;
  method: string;
  status?: string;
  propertyName?: string;
  type?: string;
  zoneId?: number;
};
export const Description = (props: DescriptionProps) => {
  const { id, number, method, status, propertyName, type, zoneId } = props;
  let saleMethod = "";
  saleMethodPBSDOI.forEach((item) => {
    if (item.id === method) {
      saleMethod = item.value;
    }
  });
  return (
    <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
      <PPMSCard>
        <PPMSCardBody className="sale-number-details">
          <div className={"grid-row grid-gap"}>
            <div className="tablet:grid-col">
              <div className="tablet:grid-row">
                {type === "list" ? (
                  <strong>Sale Number</strong>
                ) : (
                  <strong>Sale Lot Number</strong>
                )}
              </div>
              <div className="tablet:grid-row">
                <Link
                  to={`${Paths.salesTransactionPBSDOI}${
                    id ? "/" + id : ""
                  }?zoneId=${zoneId}`}
                  className={"sales-transaction"}
                  key="sales-transaction-id"
                >
                  {number ? formatSaleNumber(number) : null}
                </Link>
              </div>
            </div>
            <div className="tablet:grid-col">
              <div className="tablet:grid-row">
                <strong>Sale Method</strong>
              </div>
              <div className="tablet:grid-row">{saleMethod}</div>
            </div>
            {status && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Sale Status</strong>
                </div>
                <div className="tablet:grid-row">{status}</div>
              </div>
            )}
            {propertyName && (
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">
                  <strong>Property Name</strong>
                </div>
                <div className="tablet:grid-row">{propertyName}</div>
              </div>
            )}
          </div>
        </PPMSCardBody>
      </PPMSCard>
    </PPMSCardGroup>
  );
};
