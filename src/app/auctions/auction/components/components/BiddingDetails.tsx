import React from "react";
import { bidderDetails } from "./constant/AuctionConstants";
import { FaInfoCircle } from "react-icons/fa";
import { PPMSPopover } from "../../../../../ui-kit/components/common/PPMS-popover";
import { PageUtils } from "../../../../../utils/PageUtils";
import InternetVASContent from "./components/InternetVASContent";
import { formatCurrency } from "../../../../../ui-kit/utilities/FormatUtil";
import moment from "moment/moment";
import { PBS_STATIC_TEXT } from "./constant/AuctionConstants";
interface BiddingDetailsProps {
  biddingDetailsData: any;
  auctionDetails?: any;
  isFleetAuction?: boolean;
}

interface BiddingDetailsState {}

const Description = (props) => (
  <div
    className="biddingDetails-description"
    dangerouslySetInnerHTML={{ __html: props.content }}
  />
);

const infoTip = (props) => (
  <PPMSPopover
    trigger={["click"]}
    id={props?.id + "InfoTip"}
    placement={"right"}
    popoverTitle={props?.label}
    popoverContent={props?.infoTipContent}
    className={"usa-label form-label"}
    triggerSource={
      <button
        id={`${props.id}-tooltip-button`}
        type={"button"}
        className={"usa-button  usa-button--unstyled"}
        title="additional information"
      >
        <FaInfoCircle />
      </button>
    }
  />
);

const BiddingDetails = (props: BiddingDetailsProps) => {
  const { auctionDetails } = props;
  let isLiveSale = props?.auctionDetails?.saleMethod === "Sealed / Informal";
  let isSaleActive = props?.auctionDetails?.status === "Active";
  let runningLength = "0";

  if (props?.auctionDetails?.sellingAgency === "FLEET") {
    if (isLiveSale && isSaleActive) {
      runningLength = "1";
    } else if (isLiveSale && !isSaleActive) {
      runningLength = "0";
    } else if (!isLiveSale) {
      runningLength = props?.biddingDetailsData?.templateCodes?.runningLength;
    } else {
      runningLength = "0";
    }
  } else {
    runningLength = props?.biddingDetailsData?.templateCodes?.duration
      ? PageUtils.pluralizeResults(
          props?.biddingDetailsData?.templateCodes?.duration,
          "day"
        )
      : "";
  }

  return (
    <div className="PPMSViewInfo text-adjustment bid-details-container">
      <div className={"usa-list margin-adjustment"}>
        <h3>{bidderDetails.auctionDescriptionAndBiddingRules.header}</h3>
        <Description
          content={bidderDetails.auctionDescriptionAndBiddingRules.content}
        />
      </div>
      <ul className={"usa-list margin-adjustment"}>
        <li>
          <span>
            <b>{bidderDetails.auctionProperties.currentHighBid.label} </b>
            {infoTip(bidderDetails.auctionProperties.currentHighBid)}
          </span>
          {auctionDetails?.currentBid
            ? formatCurrency.format(auctionDetails?.currentBid)
            : formatCurrency.format(auctionDetails?.minBid)}
        </li>
        <li>
          <span>
            <b>{bidderDetails.auctionProperties.bidIncrement.label} </b>
            {infoTip(bidderDetails.auctionProperties.bidIncrement)}
          </span>
          {formatCurrency.format(auctionDetails.bidIncrement)}
        </li>

        <li>
          <span>
            <b>{bidderDetails.auctionProperties.reservePrice.label} </b>
            {infoTip(bidderDetails.auctionProperties.reservePrice)}
          </span>
          {auctionDetails?.reserveAmount > 0 ? "Yes" : "No"}
        </li>

        <li>
          <span>
            <b>{bidderDetails.auctionProperties.bidDepositRequired.label} </b>
            {infoTip(bidderDetails.auctionProperties.bidDepositRequired)}
          </span>
          {auctionDetails?.bidDepositRequired ? "Yes" : "No"}
        </li>

        <li>
          <span>
            <b>{bidderDetails.auctionProperties.inactivityPeriod.label} </b>
            {infoTip(bidderDetails.auctionProperties.inactivityPeriod)}
          </span>
          {props?.biddingDetailsData?.templateCodes?.inactiveTime ||
          props?.biddingDetailsData?.templateCodes?.inactiveTime === 0
            ? PageUtils.pluralizeResults(
                props?.biddingDetailsData?.templateCodes?.inactiveTime,
                "minute"
              )
            : "0"}
        </li>
        <li>
          <span>
            <b>{bidderDetails.auctionProperties.runLength.label} </b>
            {infoTip(bidderDetails.auctionProperties.runLength)}
          </span>
          {runningLength}
        </li>
        <li>
          <span>
            <b>
              {
                bidderDetails.auctionProperties
                  .inactivityPeriodforReductionOfBidIncrement.label
              }
            </b>
            {infoTip(
              bidderDetails.auctionProperties
                .inactivityPeriodforReductionOfBidIncrement
            )}
          </span>
          {props?.biddingDetailsData?.templateCodes?.duration &&
          !props.isFleetAuction
            ? PageUtils.pluralizeResults(
                props?.biddingDetailsData?.templateCodes?.duration,
                "day"
              )
            : "0"}
        </li>

        <li>
          <span>
            <b>
              {bidderDetails.auctionProperties.reductionOfBidIncrement.label}
            </b>
            {infoTip(bidderDetails.auctionProperties.reductionOfBidIncrement)}
          </span>
          {props?.biddingDetailsData?.templateCodes?.reductionRate ||
          props?.biddingDetailsData?.templateCodes?.reductionRate === 0
            ? PageUtils.getFormattedPercentage(
                props?.biddingDetailsData?.templateCodes?.reductionRate
              )
            : "0"}
        </li>
        <li>
          <span>
            <b>
              {
                bidderDetails.auctionProperties.reductionOfBidIncrementLimit
                  .label
              }
            </b>
            {infoTip(
              bidderDetails.auctionProperties.reductionOfBidIncrementLimit
            )}
          </span>
          {props?.biddingDetailsData?.templateCodes?.lowestReduction ||
          props?.biddingDetailsData?.templateCodes?.lowestReduction === 0
            ? PageUtils.getFormattedCurrency(
                props?.biddingDetailsData?.templateCodes?.lowestReduction
              )
            : "0"}
        </li>

        <li>
          <span>
            <b>{bidderDetails.auctionProperties.startTime.label} </b>
            {infoTip(bidderDetails.auctionProperties.startTime)}
          </span>
          {auctionDetails.startDate
            ? moment(auctionDetails.startDate).format("MM/DD/YYYY hh:mmA") +
              " CT"
            : ""}
        </li>
        <li>
          <span>
            <b>{bidderDetails.auctionProperties.closingTime.label} </b>
            {infoTip(bidderDetails.auctionProperties.closingTime)}
          </span>
          {auctionDetails.endDate
            ? moment(auctionDetails.endDate).format("MM/DD/YYYY hh:mmA") + " CT"
            : ""}
        </li>

        <li>
          <span>
            <b>{bidderDetails.auctionProperties.status.label} </b>
            {infoTip(bidderDetails.auctionProperties.status)}
          </span>
          {auctionDetails.status}
        </li>
      </ul>
      {props?.biddingDetailsData?.internetVAS && <InternetVASContent />}
      <div className={"margin-adjustment"}>{PBS_STATIC_TEXT}</div>
    </div>
  );
};

export default BiddingDetails;
