import React from "react";
import { AccordionItem } from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../Router";

interface AdvancedSearchSalesProps {
  attributeName: string;
  handleICN: any;
  icn: string;
  icnIsInvalid: boolean;
  icnIsValid: boolean;
  icnValidationMessage: string;
  vin: string;
  handleVIN: any;
  tag: string;
  handleTag: any;
  sales: string;
  handleSales: any;
  lot: string;
  isLotInvalid: boolean;
  lotValidationMessage: string;
  handleLot: any;
  contract: string;
  handleContract: any;
  bidderEmailIsInvalid: boolean;
  bidderEmailIsValid: boolean;
  bidderEmailValidationMessage: string;
  bidderEmail: string;
  handleBidderEmail: any;
  bidderfName: string;
  handleBidderFName: any;
  bidderlName: string;
  handleBidderLName: any;
  bidderNumber: string;
  handleBidderNumber: any;
  bidderNumberIsInvalid: boolean;
  bidderNumberIsValid: boolean;
  bidderNumberValidationMessage: string;
  salesSearchState?: any;
  updateSalesSearchState?: any;
  handleUserIdChange?: any;
  searchEmail?: any;
}
interface AdvancedSearchSalesState {
  isExpended: boolean;
}

export class AdvancedSearchSales extends React.Component<
  AdvancedSearchSalesProps,
  AdvancedSearchSalesState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isExpended: false,
    };
  }
  handleAdvancedSearchToggle = (event) => {
    this.setState({
      isExpended: !this.state.isExpended,
    });
  };
  handleICN = (event) => {
    this.props.handleICN(event);
  };
  handleVIN = (event) => {
    this.props.handleVIN(event);
  };
  handleTag = (event) => {
    this.props.handleTag(event);
  };
  handleSales = (event) => {
    this.props.handleSales(event);
  };
  handleLot = (event) => {
    this.props.handleLot(event);
  };
  handleContract = (event) => {
    this.props.handleContract(event);
  };
  handleBidderEmail = (event) => {
    this.props.handleBidderEmail(event);
  };
  handleBidderFName = (event) => {
    this.props.handleBidderFName(event);
  };
  handleBidderLName = (event) => {
    this.props.handleBidderLName(event);
  };
  handleBidderNumber = (event) => {
    this.props.handleBidderNumber(event);
  };
  handleUserIdChange = (event) => {
    this.props.handleUserIdChange(event);
  };
  searchEmail = (event) => {
    this.props.searchEmail(event);
  };
  render() {
    return (
      <div className={"ui-ppms"}>
        <div className={"usa-accordion"}>
          <AccordionItem
            title={"Advanced Search"}
            handleToggle={this.handleAdvancedSearchToggle}
            content={
              <>
                <ModelContent
                  attributeName={this.props.attributeName}
                  // icn
                  handleICN={this.handleICN}
                  icn={this.props.icn}
                  icnIsInvalid={this.props.icnIsInvalid}
                  icnIsValid={this.props.icnIsValid}
                  icnValidationMessage={this.props.icnValidationMessage}
                  // vin
                  vin={this.props.vin}
                  handleVIN={this.handleVIN}
                  // tag
                  tag={this.props.tag}
                  handleTag={this.handleTag}
                  // sales
                  sales={this.props.sales}
                  handleSales={this.handleSales}
                  // lot
                  lot={this.props.lot}
                  isLotInvalid={this.props.isLotInvalid}
                  lotValidationMessage={this.props.lotValidationMessage}
                  handleLot={this.handleLot}
                  // contract
                  contract={this.props.contract}
                  handleContract={this.handleContract}
                  // bidder email
                  bidderEmailIsInvalid={this.props.bidderEmailIsInvalid}
                  bidderEmailIsValid={this.props.bidderEmailIsValid}
                  bidderEmailValidationMessage={
                    this.props.bidderEmailValidationMessage
                  }
                  bidderEmail={this.props.bidderEmail}
                  handleBidderEmail={this.handleBidderEmail}
                  // bidder first name
                  bidderfName={this.props.bidderfName}
                  handleBidderFName={this.handleBidderFName}
                  // bidder last name
                  bidderlName={this.props.bidderlName}
                  handleBidderLName={this.handleBidderLName}
                  // bidder number
                  bidderNumber={this.props.bidderNumber}
                  bidderNumberIsInvalid={this.props.bidderNumberIsInvalid}
                  bidderNumberIsValid={this.props.bidderNumberIsValid}
                  bidderNumberValidationMessage={
                    this.props.bidderNumberValidationMessage
                  }
                  handleBidderNumber={this.handleBidderNumber}
                  salesSearchState={this.props.salesSearchState}
                  updateSalesSearchState={this.props.updateSalesSearchState}
                  handleUserIdChange={this.handleUserIdChange}
                  searchEmail={this.searchEmail}
                />
              </>
            }
            className={"advanced-search-toggle"}
            expanded={this.state.isExpended}
            id={"adviced-search"}
          />
        </div>
      </div>
    );
  }
}
const ModelContent = ({
  attributeName,
  handleICN,
  icnIsInvalid,
  icnIsValid,
  icnValidationMessage,
  icn,
  vin,
  handleVIN,
  tag,
  handleTag,
  sales,
  handleSales,
  lot,
  isLotInvalid,
  lotValidationMessage,
  handleLot,
  bidderEmailIsInvalid,
  bidderEmailIsValid,
  bidderEmailValidationMessage,
  bidderEmail,
  handleBidderEmail,
  contract,
  handleContract,
  bidderfName,
  handleBidderFName,
  bidderlName,
  handleBidderLName,
  bidderNumber,
  handleBidderNumber,
  bidderNumberIsInvalid,
  bidderNumberIsValid,
  bidderNumberValidationMessage,
  salesSearchState,
  updateSalesSearchState,
  handleUserIdChange,
  searchEmail,
}) => {
  return (
    <React.Fragment>
      <div className="advanced-search-option">
        <>
          <div className="grid-row grid-gap-2 advanced-search-sales-mt">
            {attributeName === "Item" && (
              <div className={"tablet:grid-col-6"}>
                <div className={"flat-widget ppms-widget"}>
                  <div
                    className={
                      "usa-card__body non-tcn-main-row card-header-height widget-header"
                    }
                  >
                    Item Attributes
                  </div>
                  <div className={"usa-card__body"}>
                    <div className="grid-row">
                      <div className="p-0 grid-col-6">
                        <PPMSInput
                          label={"Item Control Number"}
                          labelBold={true}
                          maxLength={18}
                          minLength={6}
                          isDisabled={attributeName === "Item" ? false : true}
                          id="item-control-number"
                          inputType={"text"}
                          isInvalid={icnIsInvalid}
                          isValid={icnIsValid}
                          validationMessage={icnValidationMessage}
                          isRequired={false}
                          value={icn}
                          onChange={handleICN}
                        />
                      </div>
                    </div>
                    <div className={"grid-row grid-gap-2"}>
                      <div className={"grid-col-6"}>
                        <div className="grid-row">
                          <div className="p-0 grid-col-12">
                            <PPMSInput
                              label={"VIN"}
                              labelBold={true}
                              isDisabled={
                                attributeName === "Item" ? false : true
                              }
                              id="vin-number"
                              maxLength={20}
                              inputType={"text"}
                              isInvalid={false}
                              isValid={true}
                              validationMessage={""}
                              isRequired={false}
                              value={vin}
                              onChange={handleVIN}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={"grid-col-6"}>
                        <div className="grid-row">
                          <div className="p-0 grid-col-12">
                            <PPMSInput
                              label={"Tag Number"}
                              labelBold={true}
                              isDisabled={
                                attributeName === "Item" ? false : true
                              }
                              maxLength={5}
                              id="tag-number"
                              inputType={"text"}
                              isRequired={false}
                              value={tag}
                              onChange={handleTag}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {attributeName === "Sale" && (
              <div className={"tablet:grid-col-6"}>
                <div className={"flat-widget ppms-widget"}>
                  <div
                    className={
                      "usa-card__body non-tcn-main-row card-header-height widget-header"
                    }
                  >
                    Sales/Lot Attributes
                  </div>
                  <div className={"usa-card__body"}>
                    <div className="grid-row grid-gap-2">
                      <div className="grid-col-6">
                        <div className="grid-row">
                          <div className="p-0 grid-col-12">
                            <PPMSInput
                              label={"Sale Number"}
                              labelBold={true}
                              maxLength={16}
                              isDisabled={
                                attributeName === "Sale" ? false : true
                              }
                              id="sale-number"
                              inputType={"text"}
                              isRequired={false}
                              value={sales}
                              onChange={handleSales}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid-col-6">
                        <div className="grid-row">
                          <div className="p-0 grid-col-12">
                            <PPMSInput
                              label={"Lot Number"}
                              labelBold={true}
                              isDisabled={
                                attributeName === "Sale"
                                  ? sales.length === 0
                                  : true
                              }
                              isInvalid={isLotInvalid}
                              validationMessage={lotValidationMessage}
                              maxLength={3}
                              id="lot-number"
                              inputType={"text"}
                              isRequired={false}
                              value={sales.length === 0 ? "" : lot}
                              onChange={handleLot}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
        <div className="grid-row grid-gap-2">
          {attributeName === "Contract" && (
            <div className={"tablet:grid-col-6"}>
              <div className={"flat-widget ppms-widget"}>
                <div
                  className={
                    "usa-card__body non-tcn-main-row card-header-height widget-header"
                  }
                >
                  Contract Attributes
                </div>
                <div className={"usa-card__body"}>
                  <div className="grid-row">
                    <div className="p-0 grid-col-6">
                      <PPMSInput
                        label={"Contract Number"}
                        labelBold={true}
                        isDisabled={attributeName === "Contract" ? false : true}
                        id="contract-number"
                        inputType={"text"}
                        maxLength={14}
                        isRequired={false}
                        value={contract}
                        onChange={handleContract}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {attributeName === "Bidder" && (
            <div className={"tablet:grid-col-12"}>
              <div className={"flat-widget ppms-widget"}>
                <div
                  className={
                    "usa-card__body non-tcn-main-row card-header-height widget-header"
                  }
                >
                  Bidder Attributes
                </div>
                <div className={"usa-card__body"}>
                  <div className="grid-row award-information-content_margin grid-gap-2">
                    <div className="p-0 grid-col-6 ">
                      <div className="grid-row">
                        <div className="p-0 grid-col-12">
                          <PPMSInput
                            label={"Bidder Email"}
                            labelBold={true}
                            isDisabled={
                              attributeName === "Bidder" ? false : true
                            }
                            id="bidder-email"
                            inputType={"email"}
                            isInvalid={bidderEmailIsInvalid}
                            isValid={bidderEmailIsValid}
                            validationMessage={bidderEmailValidationMessage}
                            isRequired={false}
                            value={bidderEmail}
                            onChange={handleBidderEmail}
                            onBlur={searchEmail}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-0 grid-col-6">
                      <div className="grid-row">
                        <div className="p-0 grid-col-12">
                          <PPMSInput
                            label={"Bidder Number"}
                            labelBold={true}
                            isDisabled={
                              attributeName === "Bidder" ? false : true
                            }
                            id="bidder-number"
                            inputType={"text"}
                            isInvalid={bidderNumberIsInvalid}
                            isValid={bidderNumberIsValid}
                            validationMessage={bidderNumberValidationMessage}
                            isRequired={false}
                            value={bidderNumber}
                            onChange={handleBidderNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid-row">
                    <div
                      className={
                        "grid-row grid-gap-2 award-information-content_margin"
                      }
                    >
                      {salesSearchState.bidder.showBidderUserIds && (
                        <PPMSToggleRadio
                          id={"userId"}
                          options={salesSearchState.bidder.bidderUserIdsOptions}
                          isInline={true}
                          isDisabled={false}
                          name={"userId"}
                          className={"user-id"}
                          isLabelNotRequired={false}
                          validationMessage={""}
                          isSingleSelect={true}
                          onChange={handleUserIdChange}
                          isRequired={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid-row-12">
                    <div className={"grid-row grid-gap-2"}>
                      {salesSearchState.bidder.showBidder ? (
                        salesSearchState.bidder.bidderName ? (
                          salesSearchState.bidder.registrationType ===
                          "Company" ? (
                            <>
                              <div className={"grid-col-2"}>
                                <strong>Company Name</strong>
                              </div>
                              <div className={"grid-col-4"}>
                                <strong>Company Address</strong>
                              </div>
                              <div className={"grid-col-2"}>
                                <strong>Company Registration Type</strong>
                              </div>
                              <div className={"grid-col-2"}>
                                <strong>Company Username</strong>
                              </div>
                              <div className={"grid-col-2"}>
                                <strong>Company Status</strong>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={"grid-col-2"}>
                                <strong>Bidder Name</strong>
                              </div>
                              <div className={"grid-col-4"}>
                                <strong>Bidder Address</strong>
                              </div>
                              <div className={"grid-col-2"}>
                                <strong>Bidder Registration Type</strong>
                              </div>
                              <div className={"grid-col-2"}>
                                <strong>Bidder Username</strong>
                              </div>
                              <div className={"grid-col-2"}>
                                <strong>Bidder Status</strong>
                              </div>
                            </>
                          )
                        ) : (
                          <div>No Record Founds</div>
                        )
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div className={"grid-row grid-gap-2"}>
                      {salesSearchState.bidder.showBidder ? (
                        <>
                          <div className={"grid-col-2"}>
                            {salesSearchState.bidder.bidderName}
                          </div>
                          <div className={"grid-col-4"}>
                            {salesSearchState.bidder.bidderAddress}
                          </div>
                          <div className={"grid-col-2"}>
                            {salesSearchState.bidder.registrationType}
                          </div>
                          <div className={"grid-col-2"}>
                            <PPMSButton
                              id={"contract-transaction"}
                              type={"button"}
                              variant={"link"}
                              className={"usa-link"}
                              label={salesSearchState.bidder.bidderUsername}
                              onPress={() =>
                                PageHelper.openPage(
                                  Paths.viewBidder +
                                    `/${salesSearchState.bidder.bidderUsername}`
                                )
                              }
                            />
                          </div>
                          <div className={"grid-col-2"}>
                            {salesSearchState.bidder.bidderStatus}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className={"grid-row grid-gap-2"}>
                    <div className="grid-col-6">
                      <div className="grid-row">
                        <div className="p-0 grid-col-12">
                          <PPMSInput
                            label={"Bidder First Name"}
                            labelBold={true}
                            isDisabled={
                              attributeName === "Bidder" ? false : true
                            }
                            id="bidder-first-name"
                            inputType={"text"}
                            isRequired={false}
                            value={bidderfName}
                            onChange={handleBidderFName}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid-col-6">
                      <div className="grid-row">
                        <div className="p-0 grid-col-12">
                          <PPMSInput
                            label={"Bidder Last Name"}
                            labelBold={true}
                            isDisabled={
                              attributeName === "Bidder" ? false : true
                            }
                            id="bidder-last-name"
                            inputType={"text"}
                            isRequired={false}
                            value={bidderlName}
                            onChange={handleBidderLName}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
