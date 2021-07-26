import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import { Paths } from "../../Router";
import {
  formatCurrencyWODecimal,
  formatSaleNumber,
} from "../../../ui-kit/utilities/FormatUtil";
import PPMSCardMedia from "../../../ui-kit/components/common/card/PPMS-card-media";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import placeholderImage from "../../../assets/images/placeholder-img.jpg";
import moment from "moment";
import { formatLotNumber } from "../../sales/management-pbs-doi/lot-details/property/common/constants/Utils";
import { isEmptyCheck } from "../../property/create-update-property/validations/propertyFieldValidations";

interface AuctionPreviewProps {
  auction: any;
  listPage?: boolean;
  viewedTimes?: number;
  realEstate?: boolean;
  isFeaturedList?: boolean;
  handleFeaturedItem?: any;
  addedToFeatured?: boolean;
}
export const AuctionPreviewTile = (props: AuctionPreviewProps) => {
  const auction = props.auction;

  const [predesignedUrl, setPredesignedUrl] = useState<string>(
    props.isFeaturedList
      ? auction.presignedUrlList[0]
      : props.auction?.preSignedURL
  );

  const [curItem, setCurItem] = useState(0);

  useEffect(() => {
    const urls: string[] = props.auction?.presignedUrlList;
    if (urls && urls.length > 1) {
      const timer = window.setInterval(() => {
        setCurItem((prevItem) =>
          prevItem != urls.length - 1 ? prevItem + 1 : 0
        );
      }, 1000);
      return () => {
        window.clearInterval(timer);
      };
    }
  }, []);

  useEffect(() => {
    const url: string = props.isFeaturedList
      ? auction.presignedUrlList[curItem]
      : props.auction?.preSignedURL;
    setPredesignedUrl(!isEmptyCheck(url) ? url : placeholderImage);
  }, [curItem]);

  const getAuctionField = (label: string) => {
    let value: string = "";
    switch (label) {
      case "Location":
        value = `${auction?.location?.city}, ${auction?.location?.state} ${auction?.location?.zipCode}`;
        break;
      case "Start Date":
        value =
          auction.featuredSellingAgency === "PBS"
            ? moment(moment(auction?.startDate, "YYYY-MM-DDTHH:mm"))
                .format("MM/DD/YYYY hh:mm A")
                .toString()
            : auction.type === "SALES"
            ? `${moment(moment(auction?.startDate, "YYYY-MM-DDTHH:mm"))
                .format("MM/DD/YYYY")
                .toString()} ${
                auction?.startingTime
                  ? auction?.startingTime.substring(0, 5) +
                    " " +
                    auction?.startingTime.substring(5)
                  : ""
              }`
            : auction.type === "LOT"
            ? moment(moment(auction?.startingTime, "YYYY-MM-DDTHH:mm"))
                .format("MM/DD/YYYY hh:mm A")
                .toString()
            : auction?.startDate
            ? moment(moment(auction?.startDate, "YYYY-MM-DDTHH:mm"))
                .format("MM/DD/YYYY hh:mm A")
                .toString()
            : null;
        break;
      case "Closing Date":
        value = auction?.closingDate
          ? moment(moment(auction.closingDate, "YYYY-MM-DDTHH:mm"))
              .format("MM/DD/YYYY hh:mm A")
              .toString()
          : null;
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
      case " Closing Date":
        value = auction?.closingDate
          ? moment(moment(auction?.closingDate, "YYYY-MM-DDTHH:mm"))
              .format("MM/DD/YYYY hh:mm A")
              .toString()
          : null;
        break;
      case "No. of Bidders":
        value = auction?.noOfBidders;
        break;
      case "Current Bid":
        value = auction?.currentBid
          ? formatCurrencyWODecimal.format(auction?.currentBid)
          : null;
        break;
      case "Status":
        value = auction?.status;
        break;
      case "Number of Lots":
        value = auction?.numberOfLots;
        break;
      case "Property Name":
        value = auction?.propertyName;
        break;
      default:
        break;
    }
    return (
      <li>
        <span><strong>{label} </strong></span> {value}
      </li>
    );
  };
  return (
    <>
      <PPMSCardGroup className={`ppms-card-group icn-card`}>
        <PPMSCard layout="flagDefault">
          <PPMSCardHeader
            className={`usa-header-slim flex-justify ${
              props.realEstate ? "real-estate-header" : ""
            }`}
          >
            <h3>
              <Link
                to={{
                  pathname:
                    auction.featuredSellingAgency === "PBS"
                      ? `${
                          Paths.realEstateAuctions +
                          "/sale/" +
                          auction.salesNumber
                        }`
                      : auction.type === "SALES"
                      ? `${Paths.auctionsList + "/sale/" + auction.salesNumber}`
                      : `${Paths.previewAuctions}/${auction?.auctionId}`,
                  state: { auction: auction },
                }}
              >
                {auction.type === "SALES"
                  ? formatSaleNumber(auction?.salesNumber)
                  : formatSaleNumber(auction?.salesNumber) +
                    "-" +
                    formatLotNumber(auction?.lotNumber?.toString(), 3)}
              </Link>
            </h3>
            <div className={"auction-sale-desc"}>
              <div>
                {props.isFeaturedList
                  ? auction?.description
                    ? auction?.description.replace(/(<([/p>]+)>)/gi, "")
                    : ""
                  : auction?.saleMethod}
              </div>
            </div>
            <div><strong>Status:</strong> {auction?.status}</div>
          </PPMSCardHeader>
          <PPMSCardMedia className={`usa-card-media-slim`}>
            <img src={predesignedUrl} alt="A placeholder" />
          </PPMSCardMedia>
          <PPMSCardBody className={`usa-body-slim`}>
            <div className="grid-row tablet:grid-gap-3">
              <ul
                className={`usa-list usa-list-auction-card ui-shade ${
                  props.realEstate ? "real-estate-body" : ""
                }`}
              >
                {auction?.type === "SALES"
                  ? getAuctionField(`Number of Lots`)
                  : getAuctionField(`Location`)}
                {getAuctionField(`Start Date`)}
                {props.isFeaturedList && auction.status === "Active" ? (
                  getAuctionField(`Closing Date`)
                ) : (
                  <li> </li>
                )}
                {props.isFeaturedList ? (
                  <li className="text-right"><PPMSButton
                    id={"featured-item"}
                    label={
                      props.addedToFeatured
                        ? "Remove from Featured Items"
                        : "Add as Featured Item"
                    }
                    variant={"primary"}
                    onPress={props.handleFeaturedItem}
                  /></li>
                ) : null}
              </ul>
              {(auction?.sellingAgency === "DOI" ||
                auction?.sellingAgency === "PBS") && (
                <ul
                  className={`usa-list usa-list-auction-card ui-shade ${
                    props.realEstate ? "real-estate-body" : ""
                  }`}
                >
                  {getAuctionField(`Property Name`)}
                  {getAuctionField(`Closing Date`)}
                  {getAuctionField(`No. of Bidders`)}
                  {getAuctionField(`Current Bid`)}
                </ul>
              )}
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
};
