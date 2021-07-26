import React from "react";
import { Link } from "react-router-dom";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardMedia from "../../../../ui-kit/components/common/card/PPMS-card-media";
import placeholderImage from "../../../../assets/images/placeholder-img.jpg";
import { formatSaleNumber } from "../../../../ui-kit/utilities/FormatUtil";
import { Paths } from "../../../Router";

interface AuctionPreviewProps {
  auction: any;
  listPage?: boolean;
  viewedTimes?: number;
}
export const AuctionPreviewTile = (props: AuctionPreviewProps) => {
  const auction = props.auction;

  const getAuctionField = (label: string) => {
    let value: string = "";
    switch (label) {
      case "Location":
        value = auction?.location;
        break;
      case "Start Date":
        value = auction?.startDate;
        break;
      case "Sale Method":
        value = auction?.saleMethod;
        break;
      case "Case #":
        value = auction?.caseNumber;
        break;
      case "IFB #":
        value = auction?.ifbNumber;
        break;
    }
    return (
      <li>
        <span>{label} </span> {value}
      </li>
    );
  };
  return (
    <>
      <PPMSCardGroup className={"ppms-card-group icn-card"}>
        <PPMSCard layout="flagDefault">
          <PPMSCardHeader className={`usa-header-slim flex-justify`}>
            <h3>
              <Link
                to={{
                  pathname: `${Paths.previewAuctions}/${auction?.lotId}`,
                  state: { auction: auction },
                }}
              >
                {formatSaleNumber(auction?.salesNumber)}- {auction?.lotNumber}
              </Link>
            </h3>

            <div className={"auction-sale-desc"}>
              <div>{auction?.lotName}</div>
            </div>
          </PPMSCardHeader>
          <PPMSCardMedia className={`usa-card-media-slim`}>
            <img
              src={
                auction.presignedUrl ? auction.presignedUrl : placeholderImage
              }
              alt="A placeholder"
            />
          </PPMSCardMedia>
          <PPMSCardBody className={`usa-body-slim`}>
            <div className="grid-row tablet:grid-gap-3">
              <ul className={"usa-list usa-list-icn-card ui-shade"}>
                {getAuctionField(`Location`)}
                {getAuctionField(`Start Date`)}
              </ul>
              {(auction?.sellingAgency === "DOI" ||
                auction?.sellingAgency === "PBS") && (
                <ul className={"usa-list usa-list-icn-card ui-shade"}>
                  {getAuctionField(`Sale Method`)}
                  {getAuctionField(`Case #`)}
                  {getAuctionField(`IFB #`)}
                </ul>
              )}
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
};
