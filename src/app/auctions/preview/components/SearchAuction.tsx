import moment from "moment";
import React, { useState } from "react";
import { AccordionItem } from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

import PPMSMultiSelect from "../../../../ui-kit/components/PPMS-multi-select";
import { formatNumber } from "../../../property/reporting/3040-reporting/edit-3040-report/constants-3040";
import {
  formatSaleNumber,
  LotStatusId,
  radiusOptions,
} from "../constants/AuctionPreviewConstant";

interface SearchAuctionProps {
  catergoryOptions: any[];
  selectedCategoryOptions: any[];
  stateOptions: any[];
  selectedStateOptions: any[];
  zipCode: string;
  selectedRadius: string;
  minimumValue: string;
  maximumValue: string;
  saleNumber: string;
  bidOptions: any;
  handleCategory: any;
  handleState: any;
  onChangeZipCode: any;
  onBlurZipCode: any;
  handleRadius: any;
  onChangeMinValue: any;
  onBlurMinValue: any;
  onChangeMaxValue: any;
  onBlurMaxValue: any;
  onChangeSaleNumber: any;
  onBlurSaleNumber: any;
  handleBidDeposit: any;
  lotStatus: string;
  toDate: string;
  updateToDate: any;
  fromDate: string;
  updateFromDate: any;
  toggleExpanded: any;
  handleToggleExpanded: any;
}

export function SearchAuction(props: SearchAuctionProps) {
  return (
    <div className={"ui-ppms"}>
      <div className={"usa-accordion"}>
        <AccordionItem
          title={"Advanced Search"}
          handleToggle={props.handleToggleExpanded}
          content={
            <>
              <AuctionSearch
                catergoryOptions={props.catergoryOptions}
                selectedCategoryOptions={props.selectedCategoryOptions}
                stateOptions={props.stateOptions}
                selectedStateOptions={props.selectedStateOptions}
                zipCode={props.zipCode}
                selectedRadius={props.selectedRadius}
                minimumValue={props.minimumValue}
                maximumValue={props.maximumValue}
                saleNumber={props.saleNumber}
                bidOptions={props.bidOptions}
                handleCategory={props.handleCategory}
                handleState={props.handleState}
                onChangeZipCode={props.onChangeZipCode}
                onBlurZipCode={props.onBlurZipCode}
                handleRadius={props.handleRadius}
                onChangeMinValue={props.onChangeMinValue}
                onBlurMinValue={props.onBlurMinValue}
                onChangeMaxValue={props.onChangeMaxValue}
                onBlurMaxValue={props.onBlurMaxValue}
                onChangeSaleNumber={props.onChangeSaleNumber}
                onBlurSaleNumber={props.onBlurSaleNumber}
                handleBidDeposit={props.handleBidDeposit}
                lotStatus={props.lotStatus}
                toDate={props.toDate}
                updateToDate={props.updateToDate}
                fromDate={props.fromDate}
                updateFromDate={props.updateFromDate}
              />
            </>
          }
          className={"advanced-search-toggle auction-advanced"}
          expanded={props.toggleExpanded}
          id={"adviced-search"}
        />
      </div>
    </div>
  );
}

const AuctionSearch = ({
  catergoryOptions,
  selectedCategoryOptions,
  stateOptions,
  selectedStateOptions,
  zipCode,
  selectedRadius,
  minimumValue,
  maximumValue,
  saleNumber,
  bidOptions,
  handleCategory,
  handleState,
  onChangeZipCode,
  onBlurZipCode,
  handleRadius,
  onChangeMinValue,
  onBlurMinValue,
  onChangeMaxValue,
  onBlurMaxValue,
  onChangeSaleNumber,
  onBlurSaleNumber,
  handleBidDeposit,
  lotStatus,
  toDate,
  updateToDate,
  fromDate,
  updateFromDate,
}) => {
  return (
    <>
      {lotStatus === LotStatusId.CLOSED_AUCTION && (
        <div className={"grid-row grid-gap-6"}>
          <div className="auction-date-title">{"From: "}</div>
          <div className="grid-col-3 auction-date-field">
            <div className="grid-row-col">
              <PPMSDatepicker
                id={"From-auction-date"}
                format={"MM/DD/YYYY"}
                label={""}
                labelBold={true}
                display={""}
                updateDate={(value) => {
                  updateFromDate(
                    value ? moment(value).format("MM/DD/YYYY") : ""
                  );
                }}
                startDate={
                  fromDate ? moment(new Date(fromDate)).toDate() : null
                }
                maxDate={
                  toDate
                    ? moment(new Date(toDate)).toDate()
                    : moment(new Date(Date.now())).toDate()
                }
                className={""}
                isRequired={false}
                notShowFormat={true}
                isDisabled={false}
                isInvalid={false}
                useDefaultValidation={false}
                validationMessage={""}
              />
            </div>
          </div>
          <div className="auction-date-title">{"To: "}</div>
          <div className="grid-col-3 auction-date-field">
            <div className="grid-row-col">
              <PPMSDatepicker
                id={"to-auction-date"}
                label={""}
                labelBold={true}
                display={""}
                updateDate={(value) => {
                  updateToDate(value ? moment(value).format("MM/DD/YYYY") : "");
                }}
                startDate={toDate ? moment(new Date(toDate)).toDate() : null}
                minDate={fromDate ? moment(new Date(fromDate)).toDate() : null}
                maxDate={moment(new Date(Date.now())).toDate()}
                isRequired={false}
                notShowFormat={true}
                isDisabled={false}
                isInvalid={false}
                useDefaultValidation={false}
                validationMessage={""}
                format={"MM/DD/YYYY"}
              />
            </div>
          </div>
        </div>
      )}
      <div className={"grid-row grid-gap-6"}>
        <div className="grid-col-5">
          <PPMSMultiSelect
            avoidHighlightFirstOption={true}
            caseSensitiveSearch={false}
            emptyRecordMsg={"---- No Categories Found ----"}
            chipVariant={"primary"}
            id={"categorySearch"}
            label={"Category"}
            labelClassName={"multi-select-label"}
            isRequired={false}
            placeholder={"Select Category"}
            options={catergoryOptions}
            displayValue={"categoryName"}
            selectedValues={selectedCategoryOptions}
            showCheckbox={false}
            isObject={true}
            singleSelect={false}
            closeOnSelect={true}
            onSelect={handleCategory}
            onRemove={handleCategory}
          />
        </div>
        <div className="grid-col-3">
          <PPMSMultiSelect
            avoidHighlightFirstOption={true}
            caseSensitiveSearch={false}
            emptyRecordMsg={"---- No Categories Found ----"}
            chipVariant={"primary"}
            id={"categorySearch"}
            isRequired={false}
            label={"State"}
            labelClassName={"multi-select-label"}
            placeholder={"Select State"}
            options={stateOptions}
            displayValue={"state"}
            selectedValues={selectedStateOptions}
            showCheckbox={false}
            isObject={true}
            singleSelect={false}
            closeOnSelect={true}
            onSelect={handleState}
            onRemove={handleState}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-6"}>
        <div className="grid-col-2">
          <PPMSInput
            title={"zip code"}
            isDisabled={false}
            label={"Zip Code"}
            id={"auction-zip-code"}
            inputType={"text"}
            isInvalid={false}
            isValid={true}
            isRequired={true}
            value={zipCode}
            labelBold={true}
            placeHolder={"e.g 75063"}
            maxLength={5}
            minLength={5}
            onChange={onChangeZipCode}
            onBlur={onBlurZipCode}
          />
        </div>
        <div className="grid-col-3">
          <PPMSSelect
            placeholderValue={"--Select Radius--"}
            isRequired={true}
            isValid={true}
            isInvalid={false}
            validationMessage={""}
            //disabled={zipCode ? false: true}
            disabled={false}
            label={"Radius"}
            labelBold={true}
            identifierKey="id"
            identifierValue="value"
            selectedValue={selectedRadius}
            onChange={handleRadius}
            values={radiusOptions}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-6"}>
        <div className="grid-col-3">
          <PPMSInput
            title={"minimum value"}
            isDisabled={false}
            label={"Minimum Value"}
            id={"auction-minimum-value"}
            placeHolder={"e.g 100"}
            inputType={"text"}
            isInvalid={false}
            isValid={true}
            isRequired={true}
            value={formatNumber(minimumValue)}
            labelBold={true}
            maxLength={10}
            minLength={8}
            onChange={onChangeMinValue}
            onBlur={onBlurMinValue}
          />
        </div>
        <div className="grid-col-3">
          <PPMSInput
            title={"maximum value"}
            isDisabled={false}
            label={"Maximum Value"}
            id={"auction-maximum-value"}
            placeHolder={"e.g 500"}
            inputType={"text"}
            isInvalid={false}
            isValid={true}
            isRequired={true}
            value={formatNumber(maximumValue)}
            labelBold={true}
            maxLength={10}
            minLength={8}
            onChange={onChangeMaxValue}
            onBlur={onBlurMaxValue}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-6"}>
        <div className="grid-col-3">
          <PPMSInput
            title={"sales lot number"}
            isDisabled={false}
            label={"Sale/Lot Number"}
            id={"auction-sales-value"}
            inputType={"text"}
            isInvalid={false}
            isValid={true}
            isRequired={true}
            value={formatSaleNumber(saleNumber)}
            labelBold={true}
            onChange={onChangeSaleNumber}
            onBlur={onBlurSaleNumber}
            maxLength={20}
          />
        </div>
        <div className="grid-col-3">
          <PPMSToggleRadio
            isInline={true}
            name={"bidDepositAuction"}
            isRequired={true}
            isDisabled={false}
            options={bidOptions}
            validationMessage={""}
            onChange={handleBidDeposit}
            id="bid-deposit-auction"
            label={"Bid Deposit Required"}
            labelBold={true}
          />
        </div>
      </div>
    </>
  );
};
