import React from "react";
import { PPMSInput } from "../../../../../../../ui-kit/components/common/input/PPMS-input";
import { checkRequired } from "../constants/Utils";

interface BidProps {
  bidDetail: any;
  updateBidDetail: (type: string, value: string | {}) => any;
  validateBidDetail: (type: string, value: string | {}) => any;
  fieldDisabled?: boolean;
}

const Bid = (props: BidProps) => {
  const {
    bidDetail,
    updateBidDetail,
    validateBidDetail,
    fieldDisabled,
  } = props;
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"starting-bid"}
            label={"Starting Bid"}
            maxLength={8}
            inputType={"text"}
            isDisabled={bidDetail?.validation?.startingBid?.isDisabled}
            isRequired={true}
            isInvalid={bidDetail?.validation?.startingBid?.isInvalid}
            validationMessage={
              bidDetail?.validation?.startingBid?.validationError
            }
            value={bidDetail?.data?.startingBid}
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("starting-bid", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("starting-bid", event.target.value);
            }}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"bid-increment"}
            label={"Bid Increment"}
            inputType={"text"}
            maxLength={8}
            isDisabled={bidDetail?.validation?.bidIncrement?.isDisabled}
            isRequired={true}
            isInvalid={bidDetail?.validation?.bidIncrement?.isInvalid}
            validationMessage={
              bidDetail?.validation?.bidIncrement?.validationError
            }
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("bid-increment", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("bid-increment", event.target.value);
            }}
            value={bidDetail?.data?.bidIncrement}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"reserve-amount"}
            label={"Reserve Amount"}
            inputType={"text"}
            maxLength={8}
            isDisabled={bidDetail?.validation?.reserveAmount?.isDisabled}
            isRequired={false}
            isInvalid={bidDetail?.validation?.reserveAmount?.isInvalid}
            validationMessage={
              bidDetail?.validation?.reserveAmount?.validationError
            }
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("reserve-amount", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("reserve-amount", event.target.value);
            }}
            value={bidDetail?.data?.reserveAmount}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"bid-deposit-amount"}
            label={"Bid Deposit Amount"}
            inputType={"text"}
            maxLength={8}
            isDisabled={bidDetail?.validation?.bidDepositAmount?.isDisabled}
            isRequired={false}
            isInvalid={bidDetail?.validation?.bidDepositAmount?.isInvalid}
            validationMessage={
              bidDetail?.validation?.bidDepositAmount?.validationError
            }
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("bid-deposit-amount", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("bid-deposit-amount", event.target.value);
            }}
            value={bidDetail?.data?.bidDepositAmount}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"reduction-rate"}
            label={"Reduction Rate"}
            hint={"in percentage (%)"}
            inputType={"text"}
            maxLength={4}
            isDisabled={fieldDisabled}
            isRequired={checkRequired(bidDetail)}
            isInvalid={bidDetail?.validation?.reductionRate?.isInvalid}
            validationMessage={
              bidDetail?.validation?.reductionRate?.validationError
            }
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("reduction-rate", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("reduction-rate", event.target.value);
            }}
            value={bidDetail?.data?.reductionRate}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"no-bid-period"}
            label={"No Bid Period"}
            maxLength={2}
            hint={"in number of days"}
            inputType={"text"}
            isDisabled={fieldDisabled}
            isRequired={checkRequired(bidDetail)}
            isInvalid={bidDetail?.validation?.noBidPeriod?.isInvalid}
            validationMessage={
              bidDetail?.validation?.noBidPeriod?.validationError
            }
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("no-bid-period", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("no-bid-period", event.target.value);
            }}
            value={bidDetail?.data?.noBidPeriod}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"reduction-nlt"}
            label={"Reduction NLT Amount"}
            maxLength={4}
            inputType={"text"}
            isDisabled={fieldDisabled}
            isRequired={checkRequired(bidDetail)}
            isInvalid={bidDetail?.validation?.reductionNLTAmount?.isInvalid}
            validationMessage={
              bidDetail?.validation?.reductionNLTAmount?.validationError
            }
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("reduction-nlt", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("reduction-nlt", event.target.value);
            }}
            value={bidDetail?.data?.reductionNLTAmount}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"inactivity-period"}
            label={"Inactivity Period"}
            inputType={"text"}
            maxLength={4}
            hint={"in Minutes"}
            isDisabled={bidDetail?.validation?.inactivityPeriod?.isDisabled}
            isRequired={false}
            isInvalid={bidDetail?.validation?.inactivityPeriod?.isInvalid}
            validationMessage={
              bidDetail?.validation?.inactivityPeriod?.validationError
            }
            labelBold={true}
            onChange={(event) => {
              updateBidDetail("inactivity-period", event.target.value);
            }}
            onBlur={(event) => {
              validateBidDetail("inactivity-period", event.target.value);
            }}
            value={bidDetail?.data?.inactivityPeriod}
          />
        </div>
      </div>
    </>
  );
};

export default Bid;
