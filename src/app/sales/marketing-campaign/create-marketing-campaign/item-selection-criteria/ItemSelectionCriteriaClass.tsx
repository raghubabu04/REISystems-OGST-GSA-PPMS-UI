import React, {useContext} from "react";
import {PPMSSelect} from "../../../../../ui-kit/components/common/select/PPMS-select";
import {auctionEndDates, auctionStartDates, selectItemBasedOn,} from "../../constants/Constants";
import {MarketingCampaignContext} from "../MarketingCampaignContext";
import {PPMSInput} from "../../../../../ui-kit/components/common/input/PPMS-input";
import PPMSMultiSelect from "../../../../../ui-kit/components/PPMS-multi-select";
import {validateBidderFrom, validateEndingRangeValue, validateFsc,} from "../../validations/AddEditCampaignValidations";
import {PPMSLabel} from "../../../../../ui-kit/components/common/form/PPMS-label";
import {formatSaleNumberForOptions} from "../../../../../ui-kit/utilities/FormatUtil";

export interface ItemSelectionCriteriaProps {
}

export function ItemSelectionCriteriaClass(props: ItemSelectionCriteriaProps) {
  const {
    itemSelectionCriteriaState,
    updateItemSelectionCriteriaState,
  } = useContext(MarketingCampaignContext);

  function handleSaleItemNumberChange(event) {
    let value= event?.target?.value.replaceAll("-","");
    let isSaleOrLotInvalid=false;
    let saleOrLotValidationErrorMessage="";
    if(value && !(value.length===11 || value.length===14)){
      isSaleOrLotInvalid=true
      saleOrLotValidationErrorMessage="Please enter the valid Sale/lot Number";
    }
    updateItemSelectionCriteriaState({
      saleItemNumber:formatSaleNumberForOptions(value),
      isSaleOrLotInvalid:isSaleOrLotInvalid,
      saleOrLotValidationErrorMessage:saleOrLotValidationErrorMessage
    });
  }

  function handleFscChangeSelect(event) {
    handleFscValidation(event);
    let fcsSelectedValues = [];
    event.forEach((e) => {
      fcsSelectedValues.push(e);
    });
    updateItemSelectionCriteriaState({
      fscSelectedValues: fcsSelectedValues,
    });
  }

  function handleFscValidation(event) {
    let errorMessage = validateFsc(event);
    if (errorMessage) {
      updateItemSelectionCriteriaState({
        fscInvalidMessage: errorMessage.validationError,
        fscInvalid: errorMessage.isInvalid,
      });
    }
  }

  function handleFscChangeRemove(event) {
    handleFscValidation(event);
    let fcsSelectedValues = [];
    event.forEach((e) => {
      fcsSelectedValues.push(e);
    });
    updateItemSelectionCriteriaState({
      fscSelectedValues: fcsSelectedValues,
    });
  }

  function handleBidAmountFromChange(event) {
    let bidAmountfrom = event.target.value
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    bidAmountfrom = bidAmountfrom.replace(/^[0]+$/, "");

    if (bidAmountfrom.includes(".")) {
      updateItemSelectionCriteriaState({ isDecimalPresentFrom: true });
    } else {
      updateItemSelectionCriteriaState({ isDecimalPresentFrom: false });
    }
    if (/^\d+\.\d\d\d$/.test(bidAmountfrom)) {
      bidAmountfrom = Number(bidAmountfrom).toFixed(2);
    }
    bidAmountfrom = bidAmountfrom
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    bidAmountfrom =
      "$" +
      bidAmountfrom
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");
    let validateStartRange = validateEndingRangeValue(
      bidAmountfrom,
      itemSelectionCriteriaState.bidAmountRangeTo
    );
    if (validateStartRange) {
      updateItemSelectionCriteriaState({
        endingRangeInvalid: validateStartRange.isInvalid,
        endingRangeInvalidMessage: validateStartRange.validationError,
      });
    }
    updateItemSelectionCriteriaState({
      bidAmountRangeFrom: bidAmountfrom,
    });
  }

  function handleBidAmountToChange(event) {
    let bidAmountTo = event.target.value
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    bidAmountTo = bidAmountTo.replace(/^[0]+$/, "");

    if (bidAmountTo.includes(".")) {
      updateItemSelectionCriteriaState({ isDecimalPresentTo: true });
    } else {
      updateItemSelectionCriteriaState({ isDecimalPresentTo: false });
    }
    if (/^\d+\.\d\d\d$/.test(bidAmountTo)) {
      bidAmountTo = Number(bidAmountTo).toFixed(2);
    }
    bidAmountTo = bidAmountTo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    bidAmountTo =
      "$" +
      bidAmountTo
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");
    let validatedToChange = validateEndingRangeValue(
      itemSelectionCriteriaState.bidAmountRangeFrom
        ? itemSelectionCriteriaState.bidAmountRangeFrom
        : 0,
      bidAmountTo
    );
    if (validatedToChange) {
      updateItemSelectionCriteriaState({
        endingRangeInvalid: validatedToChange.isInvalid,
        endingRangeInvalidMessage: validatedToChange.validationError,
      });
    }
    updateItemSelectionCriteriaState({
      bidAmountRangeTo: bidAmountTo,
    });
  }

  function onlyWholeNumber(value) {
    let wholeNumber = value.toString()?.replace(/[^0-9]/g, "");
    return wholeNumber?.replace(/^[0]+$/, "");
  }

  function handleBidNumberFromChange(event) {
    let bidNumFrom = onlyWholeNumber(event.target.value);
    let validateFrom = validateBidderFrom(
      bidNumFrom,
      itemSelectionCriteriaState.bidderNumTo
    );
    if (validateFrom) {
      updateItemSelectionCriteriaState({
        bidderNumToInvalid: validateFrom.isInvalid,
        bidderNumToInvalidMessage: validateFrom.validationError,
      });
    }

    updateItemSelectionCriteriaState({
      bidderNumFrom: bidNumFrom,
    });
  }

  function handleBidNumberToChange(event) {
    let bidNumTo = onlyWholeNumber(event.target.value);
    let validateFrom = validateBidderFrom(
      itemSelectionCriteriaState.bidderNumFrom,
      bidNumTo
    );
    if (validateFrom) {
      updateItemSelectionCriteriaState({
        bidderNumToInvalid: validateFrom.isInvalid,
        bidderNumToInvalidMessage: validateFrom.validationError,
      });
    }
    updateItemSelectionCriteriaState({
      bidderNumTo: bidNumTo,
    });
  }

  function handleAuctionStartingIn(event) {
    let startValue = event.target.value;
    updateItemSelectionCriteriaState({
      auctionStart: startValue,
    });
  }

  function handleAuctionEndingIn(event) {
    let endValue = event.target.value;
    updateItemSelectionCriteriaState({
      auctionEnd: endValue,
    });
  }

  function handleSelectItemBasedOn(event) {
    let value = event.target.value;
    updateItemSelectionCriteriaState({
      selectItem: value,
    });
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col">
          <PPMSMultiSelect
            avoidHighlightFirstOption={true}
            caseSensitiveSearch={false}
            emptyRecordMsg={"---- No FSC Code Found ----"}
            chipVariant={"primary"}
            label={"Federal Supply Class"}
            id={"fscCode"}
            name={"fscCode"}
            isRequired={true}
            hint={"Select FSC"}
            options={itemSelectionCriteriaState?.fscOptions}
            displayValue={"longName"}
            selectedValues={itemSelectionCriteriaState.fscSelectedValues}
            showCheckbox={false}
            isObject={true}
            singleSelect={false}
            selectionLimit={1}
            closeOnSelect={true}
            onSelect={handleFscChangeSelect}
            onRemove={handleFscChangeRemove}
            validationMessage={itemSelectionCriteriaState.fscInvalidMessage}
            isInvalid={itemSelectionCriteriaState.fscInvalid}
            validate={() => {
              updateItemSelectionCriteriaState({
                fscInvalidMessage: itemSelectionCriteriaState.fscInvalidMessage,
                fscInvalid: itemSelectionCriteriaState.fscInvalid,
              });
            }}
          />
        </div>
      </div>
      <div className="grid-row mt-1">
        <div className="grid-col-6 labelMargin">
          <PPMSInput
            isInvalid={itemSelectionCriteriaState.isSaleOrLotInvalid}
            id={"sale-item-id"}
            name={"sale-item-id"}
            isRequired={false}
            inputType={"text"}
            isDisabled={false}
            label={"Sale/Lot Number"}
            value={itemSelectionCriteriaState.saleItemNumber}
            onChange={handleSaleItemNumberChange}
            validationMessage={itemSelectionCriteriaState.saleOrLotValidationErrorMessage}
          />
        </div>
      </div>
      <PPMSLabel htmlFor={"bid-amount-range-from bid-amount-range-to"}>
        Bid Amount Range <span className="usa-hint">&nbsp; (Optional)</span>
      </PPMSLabel>
      <div className="grid-row">
        <div className="grid-col-3 labelMargin">
          <PPMSInput
            isValid={false}
            id={"bid-amount-range-from"}
            name={"bid-amount-range-from"}
            title={"bid amount range from"}
            isRequired={false}
            inputType={"text"}
            isDisabled={false}
            placeHolder={"$0.00"}
            value={itemSelectionCriteriaState.bidAmountRangeFrom}
            maxLength={itemSelectionCriteriaState.isDecimalPresentFrom ? 12 : 9}
            minLength={0}
            onChange={handleBidAmountFromChange}
            validationMessage={
              itemSelectionCriteriaState.startRangeInvalidMessage
            }
            isInvalid={itemSelectionCriteriaState.startRangeInvalid}
          />
        </div>
        <div className="grid-col-1 align-self-center text-center mt-05">To</div>
        <div className="grid-col-3 labelMargin">
          <PPMSInput
            isValid={false}
            id={"bid-amount-range-to"}
            name={"bid-amount-range-to"}
            title={"bid amount range to"}
            isRequired={false}
            inputType={"text"}
            isDisabled={false}
            placeHolder={"$0.00"}
            value={itemSelectionCriteriaState.bidAmountRangeTo}
            maxLength={itemSelectionCriteriaState.isDecimalPresentTo ? 12 : 9}
            minLength={0}
            validationMessage={
              itemSelectionCriteriaState.endingRangeInvalidMessage
            }
            isInvalid={itemSelectionCriteriaState.endingRangeInvalid}
            onChange={handleBidAmountToChange}
          />
        </div>
      </div>
      <PPMSLabel htmlFor={"no-bidders-from1 no-bidders-from2"}>
        No. of Bidders in Auction{" "}
        <span className="usa-hint">&nbsp; (Optional)</span>
      </PPMSLabel>
      <div className="grid-row">
        <div className="grid-col-2 labelMargin">
          <PPMSInput
            isValid={false}
            title={"no of bidders from1"}
            id={"no-bidders-from1"}
            name={"no-bidders-from1"}
            isRequired={false}
            inputType={"text"}
            pattern={"[0-9]*"}
            value={itemSelectionCriteriaState.bidderNumFrom}
            isDisabled={false}
            maxLength={4}
            minLength={0}
            onChange={handleBidNumberFromChange}
            isInvalid={itemSelectionCriteriaState.bidderNumFromInvalid}
            validationMessage={
              itemSelectionCriteriaState.bidderNumFromInvalidMessage
            }
          />
        </div>
        <div className="grid-col-1 text-center mt-05">
          <span>To</span>
        </div>
        <div className="grid-col-2 labelMargin">
          <PPMSInput
            isValid={false}
            title={"no of bidders from2"}
            id={"no-bidders-from2"}
            name={"no-bidders-from2"}
            isRequired={false}
            inputType={"text"}
            pattern={"^[0-9- ]*$/"}
            value={itemSelectionCriteriaState.bidderNumTo}
            isDisabled={false}
            maxLength={4}
            minLength={0}
            onChange={handleBidNumberToChange}
            isInvalid={itemSelectionCriteriaState.bidderNumToInvalid}
            validationMessage={
              itemSelectionCriteriaState.bidderNumToInvalidMessage
            }
          />
        </div>
      </div>

      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-auction-start"}
            name={"auction-start"}
            selectName={"auction-start"}
            values={auctionStartDates}
            label={"Auction Starting In"}
            isRequired={false}
            placeholderValue={"Select Auction Starting In"}
            onChange={handleAuctionStartingIn}
            selectedValue={itemSelectionCriteriaState.auctionStart}
          />
        </div>
        <div className="grid-col-5">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-auction-end"}
            name={"auction-end"}
            selectName={"auction-end"}
            values={auctionEndDates}
            label={"Auction Ending In"}
            isRequired={false}
            placeholderValue={"Select Auction Ending In"}
            onChange={handleAuctionEndingIn}
            selectedValue={itemSelectionCriteriaState.auctionEnd}
          />
        </div>
      </div>

      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-item-selection"}
            name={"item-selection"}
            selectName={"item-selection"}
            values={selectItemBasedOn}
            label={"Select Item based on"}
            isRequired={false}
            placeholderValue={"Select Item based on"}
            onChange={handleSelectItemBasedOn}
            selectedValue={itemSelectionCriteriaState.selectItem}
          />
        </div>
      </div>
    </>
  );
}
