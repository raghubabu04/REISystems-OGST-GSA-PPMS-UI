import React, {useContext} from "react";
import {PPMSSelect} from "../../../../../ui-kit/components/common/select/PPMS-select";
import {bidderByMonthYear, includeBidders} from "../../constants/Constants";
import {MarketingCampaignContext} from "../MarketingCampaignContext";

export interface BidderSelectionCriteriaProps {
}

export function BidderSelectionCriteriaClass(
  props: BidderSelectionCriteriaProps
) {
  const {bidderSelectionState, updateBidderSelectionState} = useContext(
    MarketingCampaignContext
  );

  function handleLastBidderOnChange(event) {
    let lastBiddenDate = event.target.value;
    updateBidderSelectionState({
      lastBiddenDate: lastBiddenDate,
    });
  }

  function handleBidderOnChange(event) {
    let includeBidders = event.target.value;
    updateBidderSelectionState({
      includeBidders: includeBidders,
    });
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-7">
          <PPMSSelect
            isRequired={false}
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-bidden-last"}
            name={"bidden-last"}
            selectName={"bidden-last"}
            values={bidderByMonthYear}
            label={"Bidder has bid for same FSC in the last"}
            placeholderValue={"Select Options"}
            onChange={handleLastBidderOnChange}
            selectedValue={bidderSelectionState.lastBiddenDate}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-4">
          <PPMSSelect
            isRequired={false}
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-bidder-selection"}
            name={"bidder-selection"}
            selectName={"bidder-selection"}
            values={includeBidders}
            label={"Include bidders"}
            placeholderValue={"Select Bidders"}
            onChange={handleBidderOnChange}
            selectedValue={bidderSelectionState.includeBidders}
          />
        </div>
      </div>
    </>
  );
}
