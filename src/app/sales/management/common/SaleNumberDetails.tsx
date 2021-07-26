import React, { useContext, useEffect, useState } from "react";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../../ui-kit/components/common/card/PPMS-card-group";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { formatSaleNumber } from "../../../../ui-kit/utilities/FormatUtil";
import { Paths } from "../../../Router";
import { Link } from "react-router-dom";
import { ManageAuctionAccessContext } from "../../../auctions/manage-auctions/manage-auction-access/ManageAuctionAccessContext";
interface SalesNumberDetailsProps {
  saleId: number;
  zoneId: any;
  showCurrentItems?: boolean;
  totalICNs?: number;
  totalValidLots?: number;
  availableLots?: any[];
  showAvailableLots?: boolean;
  isPropertyCustodian?: boolean;
}
const SaleNumberDetails = (props: SalesNumberDetailsProps) => {
  const {
    saleId,
    zoneId,
    showCurrentItems,
    availableLots,
    showAvailableLots,
    totalICNs,
    totalValidLots,
    isPropertyCustodian,
  } = props;
  const saleService = new SalesApiService();
  const [saleNumber, setSaleNumber] = useState("");
  const [saleDescription, setSaleDescription] = useState("");
  const [salePOCName, setSalePOCName] = useState("");
  const [sellingAgency, setSellingAgency] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [saleStatus, setSaleStatus] = useState("");
  const {
    manageAuctionAccessState,
    updateManageAuctionAccessState,
  } = useContext(ManageAuctionAccessContext);

  useEffect(() => {
    saleService
      .getSaleDetails(saleId)
      .then((res) => {
        let salesDetails = res.data.salesNumberDetails;
        setSaleNumber(salesDetails.salesNumber);
        setSaleDate(salesDetails.salesDate);
        setSellingAgency(salesDetails.sellingAgency);
        setSaleDescription(salesDetails.salesDescription);
        setSaleStatus(salesDetails.salesStatus);

        if (salesDetails.pointOfContact === "POC-SCO") {
          setSalePOCName(
            salesDetails.sco.firstName + " " + salesDetails.sco.lastName
          );
        } else if (salesDetails.pointOfContact === "POC-MS") {
          setSalePOCName(
            salesDetails.marketingSpecialist.firstName +
              " " +
              salesDetails.marketingSpecialist.lastName
          );
        } else if (salesDetails.pointOfContact === "POC-ASCO") {
          setSalePOCName(
            salesDetails.alternateSCO.firstName +
              " " +
              salesDetails.alternateSCO.lastName
          );
        } else if (salesDetails.sellingAgency === "PBS") {
          setSalePOCName(
            salesDetails.realtySpecialist.firstName +
              " " +
              salesDetails.realtySpecialist.lastName
          );
        } else if (salesDetails.pointOfContact === "DOI") {
          setSalePOCName(
            salesDetails.sco.firstName + " " + salesDetails.sco.lastName
          );
        }

        updateManageAuctionAccessState({
          saleMethod: salesDetails?.salesMethod,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard>
          <PPMSCardBody className="sale-number-details">
            <div className={"grid-row grid-gap"}>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Sale Number</div>
                <div className="tablet:grid-row">
                  {isPropertyCustodian ? (
                    <>{formatSaleNumber(saleNumber)}</>
                  ) : sellingAgency === "PBS" || sellingAgency === "DOI" ? (
                    <Link
                      to={`${Paths.salesTransactionPBSDOI}/${saleId}?zoneId=${zoneId}`}
                      className={"sales-transaction-pbsdoi"}
                      key="sales-transaction-pbsdoi-id"
                    >
                      {formatSaleNumber(saleNumber)}
                    </Link>
                  ) : sellingAgency !== undefined &&
                    sellingAgency !== null &&
                    sellingAgency !== "" ? (
                    <Link
                      to={`${Paths.salesTransaction}${
                        saleId ? "/" + saleId : ""
                      }?zoneId=${zoneId}`}
                      className={"sales-transaction"}
                      key="sales-transaction-id"
                    >
                      {formatSaleNumber(saleNumber)}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Sale Date</div>
                <div className="tablet:grid-row">
                  {saleDate === "" || saleDate === null ? "-" : saleDate}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Sale Status</div>
                <div className="tablet:grid-row">
                  {saleStatus === "" || saleStatus === null ? "-" : saleStatus}
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="tablet:grid-row">Sale Description</div>
                {saleDescription === "" || saleDescription === null
                  ? "-"
                  : saleDescription.replace(/<[^>]*>?/gm, "").substring(0, 25)}
              </div>
            </div>
          </PPMSCardBody>
          {showCurrentItems && (
            <PPMSCardBody className="sale-number-details-2">
              <div className={"grid-row grid-gap"}>
                <div className="tablet:grid-row">
                  Items Currently in Sale:{" "}
                  <strong>{totalICNs ? totalICNs : 0}</strong> item(s) in{" "}
                  <strong>{totalValidLots ? totalValidLots : 0}</strong> lot(s).
                </div>
              </div>
            </PPMSCardBody>
          )}
          {showAvailableLots && (
            <PPMSCardBody className="sale-number-details-2">
              <div className={"grid-row grid-gap"}>
                <div className="tablet:grid-row">
                  {availableLots && availableLots.length > 0 ? (
                    <>
                      <strong>Available Lots: </strong>
                      {availableLots.join(", ")}
                    </>
                  ) : (
                    <>
                      <strong>All Lots assigned to Custodians.</strong>
                    </>
                  )}
                </div>
              </div>
            </PPMSCardBody>
          )}
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
};

export default SaleNumberDetails;
