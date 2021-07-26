import React from "react";
import { AccordionItem } from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import {
  PPMSToggleCheckbox,
  PPMSToggleRadio,
} from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { propertyTypes } from "../create-update-property/constants/Constants";
import PPMSLabel from "../../../ui-kit/components/common/form/PPMS-label";
import PPMSMultiSelect from "../../../ui-kit/components/PPMS-multi-select";
import {
  dateValues,
  releaseDateValues,
} from "../create-update-property/constants/Constants";
import { PPMSDatepicker } from "../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { AdvancedSearchHistory } from "./AdvancedSearchHistory";

interface AdvancedSearchPropertyProps {
  handleAdvancedSearchBtnClick?: any;
  handleAdvancedClearBtnClick?: any;
  handleConditionChange?: any;
  handleReimbursementRequiredChange?: any;
  handleNIINChange?: any;
  handleChange?: any;
  fscState?: any[];
  fcsSelectedValues?: any[];
  icn?: string;
  handleICN?: any;
  icnIsInvalid?: any;
  icnIsValid?: any;
  icnValidationMessage?: any;
  aacId?: string;
  handleAAC?: any;
  aacIsInvalid?: any;
  aacIsValid?: any;
  aacValidationMessage?: any;
  agencyBureaus?: any;
  selectedAgencyBureaus?: any;
  selectedStateValues?: any;
  states?: any;
  handleStateChange?: any;
  tcn?: string;
  tcnIsInvalid?: any;
  tcnIsValid?: any;
  tcnValidationMessage?: any;
  handleAgencyBureau?: any;
  propertyTypeIsInvalid?: any;
  propertyTypeIsValid?: any;
  propertyTypeValidationMessage?: any;
  selectedPropertyType?: any;
  handlePropertyType?: any;
  agencyBureauIsInvalid?: any;
  agencyBureauIsValid?: any;
  agencyBureauValidationMessage?: any;
  niinCode?: string;
  advancedConditions?: any;
  yesNoRadioOptions?: any;
  handleDateReportSelect?: any;
  handleSurplusDateSelect?: any;
  handleExcessDateSelect?: any;
  reportedDateType?: any;
  surplusDateType?: any;
  excessDateType?: any;
  handleDateReportedFromChange?: any;
  handleDateReportedToChange?: any;
  dateReportedFrom?: any;
  dateReportedTo?: any;
  handleExcessReleaseDateFromChange?: any;
  handleExcessReleaseDateToChange?: any;
  excessReleaseDateFrom?: any;
  excessReleaseDateTo?: any;
  handleSurplusReleaseDateFromChange?: any;
  handleSurplusReleaseDateToChange?: any;
  surplusReleaseDateFrom?: any;
  surplusReleaseDateTo?: any;
  historyPropertyTypeValue?: any;
  handleHistoryPropertyType?: any;
  disableAdvancedSearchAttributes?: boolean;

  handleDonorCountrySelect?: any;
  handleAdministrationSelect?: any;
  handleVaultLocationSelect?: any;
  donorCountrySelected?: any;
  administrationSelected?: any;
  vaultLocationSelected?: any;
  handleRecipientNameChange?: any;
  handleDonorNameChange?: any;
  fiscalYear?: any;
  handleFiscalYearChange?: any;
  recipientName?: any;
  donorName?: any;
}
interface AdvancedSearchPropertyState {
  isExpended: boolean;
}

export class AdvancedSearchProperty extends React.Component<
  AdvancedSearchPropertyProps,
  AdvancedSearchPropertyState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isExpended: false,
    };
  }

  handleDateReportSelect = (event) => {
    this.props.handleDateReportSelect(event);
  };
  handleSurplusDateSelect = (event) => {
    this.props.handleSurplusDateSelect(event);
  };
  handleExcessDateSelect = (event) => {
    this.props.handleExcessDateSelect(event);
  };

  handleAdvancedSearchToggle = (event) => {
    this.setState({
      isExpended: !this.state.isExpended,
    });
  };
  handleICN = (event) => {
    this.props.handleICN(event);
  };

  handleAAC = (event) => {
    this.props.handleAAC(event);
  };
  handlePropertyType = (event) => {
    this.props.handlePropertyType(event);
  };
  handleAgencyBureau = (event) => {
    this.props.handleAgencyBureau(event);
  };
  handleChange = (event) => {
    this.props.handleChange(event);
  };
  handleNIINChange = (event) => {
    this.props.handleNIINChange(event);
  };
  handleConditionChange = (event) => {
    this.props.handleConditionChange(event);
  };
  handleReimbursementRequiredChange = (event) => {
    this.props.handleReimbursementRequiredChange(event);
  };
  handleDateReportedFromChange = (event) => {
    this.props.handleDateReportedFromChange(event);
  };
  handleDateReportedToChange = (event) => {
    this.props.handleDateReportedToChange(event);
  };

  handleExcessReleaseDateFromChange = (event) => {
    this.props.handleExcessReleaseDateFromChange(event);
  };
  handleExcessReleaseDateToChange = (event) => {
    this.props.handleExcessReleaseDateToChange(event);
  };
  handleSurplusReleaseDateFromChange = (event) => {
    this.props.handleSurplusReleaseDateFromChange(event);
  };
  handleSurplusReleaseDateToChange = (event) => {
    this.props.handleSurplusReleaseDateToChange(event);
  };

  handleHistoryPropertyType = (event) => {
    this.props.handleHistoryPropertyType(event);
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
                {!this.props.disableAdvancedSearchAttributes ? (
                  <ModelContent
                    handleDateReportSelect={this.handleDateReportSelect}
                    handleSurplusDateSelect={this.handleSurplusDateSelect}
                    handleExcessDateSelect={this.handleExcessDateSelect}
                    reportedDateType={this.props.reportedDateType}
                    surplusDateType={this.props.surplusDateType}
                    excessDateType={this.props.excessDateType}
                    icn={this.props.icn}
                    tcn={this.props.tcn}
                    aacId={this.props.aacId}
                    fscState={this.props.fscState}
                    fcsSelectedValues={this.props.fcsSelectedValues}
                    handleChange={this.handleChange}
                    handleNIINChange={this.handleNIINChange}
                    handleConditionChange={this.handleConditionChange}
                    handleReimbursementRequiredChange={
                      this.handleReimbursementRequiredChange
                    }
                    handleICN={this.handleICN}
                    icnIsInvalid={this.props.icnIsInvalid}
                    icnIsValid={this.props.icnIsValid}
                    icnValidationMessage={this.props.icnValidationMessage}
                    tcnIsInvalid={this.props.tcnIsInvalid}
                    tcnIsValid={this.props.tcnIsValid}
                    tcnValidationMessage={this.props.tcnValidationMessage}
                    handleAAC={this.handleAAC}
                    aacIsInvalid={this.props.aacIsInvalid}
                    aacIsValid={this.props.aacIsValid}
                    aacValidationMessage={this.props.aacValidationMessage}
                    agencyBureauIsInvalid={this.props.agencyBureauIsInvalid}
                    agencyBureauIsValid={this.props.agencyBureauIsValid}
                    agencyBureauValidationMessage={
                      this.props.agencyBureauValidationMessage
                    }
                    agencyBureaus={this.props.agencyBureaus}
                    selectedAgencyBureaus={this.props.selectedAgencyBureaus}
                    selectedStateValues={this.props.selectedStateValues}
                    states={this.props.states}
                    handleStateChange={this.props.handleStateChange}
                    handleAgencyBureau={this.props.handleAgencyBureau}
                    propertyTypeIsInvalid={this.props.propertyTypeIsInvalid}
                    propertyTypeIsValid={this.props.propertyTypeIsValid}
                    propertyTypeValidationMessage={
                      this.props.propertyTypeValidationMessage
                    }
                    selectedPropertyType={this.props.selectedPropertyType}
                    handlePropertyType={this.handlePropertyType}
                    niinCode={this.props.niinCode}
                    advancedConditions={this.props.advancedConditions}
                    yesNoRadioOptions={this.props.yesNoRadioOptions}
                    handleDateReportedFromChange={
                      this.handleDateReportedFromChange
                    }
                    handleDateReportedToChange={this.handleDateReportedToChange}
                    dateReportedFrom={this.props.dateReportedFrom}
                    dateReportedTo={this.props.dateReportedTo}
                    handleExcessReleaseDateFromChange={
                      this.handleExcessReleaseDateFromChange
                    }
                    handleExcessReleaseDateToChange={
                      this.handleExcessReleaseDateToChange
                    }
                    excessReleaseDateFrom={this.props.excessReleaseDateFrom}
                    excessReleaseDateTo={this.props.excessReleaseDateTo}
                    handleSurplusReleaseDateFromChange={
                      this.handleSurplusReleaseDateFromChange
                    }
                    handleSurplusReleaseDateToChange={
                      this.handleSurplusReleaseDateToChange
                    }
                    surplusReleaseDateFrom={this.props.surplusReleaseDateFrom}
                    surplusReleaseDateTo={this.props.surplusReleaseDateTo}
                  />
                ) : (
                  <AdvancedSearchHistory
                    historySelectedValue={this.props.historyPropertyTypeValue}
                    handleHistoryPropertyType={this.handleHistoryPropertyType}
                  />
                )}
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
  icn,
  tcn,
  fscState,
  handleChange,
  handleNIINChange,
  fcsSelectedValues,
  handleConditionChange,
  handleReimbursementRequiredChange,
  handleICN,
  icnIsInvalid,
  icnIsValid,
  icnValidationMessage,
  tcnIsInvalid,
  tcnIsValid,
  tcnValidationMessage,
  aacId,
  handleAAC,
  aacIsInvalid,
  aacIsValid,
  aacValidationMessage,
  agencyBureaus,
  selectedAgencyBureaus,
  selectedStateValues,
  states,
  handleAgencyBureau,
  handleStateChange,
  agencyBureauIsInvalid,
  agencyBureauIsValid,
  agencyBureauValidationMessage,
  propertyTypeIsValid,
  propertyTypeIsInvalid,
  propertyTypeValidationMessage,
  selectedPropertyType,
  handlePropertyType,
  niinCode,
  advancedConditions,
  yesNoRadioOptions,
  handleDateReportSelect,
  handleSurplusDateSelect,
  handleExcessDateSelect,
  reportedDateType,
  surplusDateType,
  excessDateType,
  handleDateReportedFromChange,
  handleDateReportedToChange,
  dateReportedFrom,
  dateReportedTo,
  handleExcessReleaseDateFromChange,
  handleExcessReleaseDateToChange,
  excessReleaseDateFrom,
  excessReleaseDateTo,
  handleSurplusReleaseDateFromChange,
  handleSurplusReleaseDateToChange,
  surplusReleaseDateFrom,
  surplusReleaseDateTo,
}) => {
  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4 margin-top-2"}>
        <div className={"tablet:grid-col-6"}>
          <div className={"flat-widget ppms-widget"}>
            <div
              className={
                "usa-card__body non-tcn-main-row card-header-height widget-header"
              }
            >
              Item Agency and Transfer
            </div>
            <div className={"usa-card__body"}>
              <div className={"grid-row grid-gap-4"}>
                <div className="advance-search-label grid-col-12">
                  <PPMSLabel htmlFor={"agency bureau"}>
                    Reporting Agency/Agency Bureau
                  </PPMSLabel>
                </div>
                <div className="p-0 grid-col-12">
                  <PPMSMultiSelect
                    avoidHighlightFirstOption={true}
                    caseSensitiveSearch={false}
                    alphaNumericOrDigitSearch={true}
                    isPivotSorted={true}
                    emptyRecordMsg={"---- No Agency Bureau Found ----"}
                    chipVariant={"primary"}
                    id={"agencyBureau"}
                    options={agencyBureaus}
                    isRequired={false}
                    placeholder={"Select Agency Bureau"}
                    displayValue={"agencyBureau"}
                    selectedValues={selectedAgencyBureaus}
                    showCheckbox={false}
                    isObject={true}
                    onSelect={handleAgencyBureau}
                    onRemove={handleAgencyBureau}
                    singleSelect={false}
                    singleSelectAndTypeSearch={true}
                    selectionLimit={1}
                    closeOnSelect={true}
                    isInvalid={agencyBureauIsInvalid}
                    isValid={agencyBureauIsValid}
                    validationMessage={agencyBureauValidationMessage}
                  />
                </div>
              </div>

              <div className={"grid-row grid-gap-4"}>
                <div className="advance-search-label margin-top-2 grid-col-12">
                  <PPMSLabel htmlFor="stateSearch">State</PPMSLabel>
                </div>
                <div className="p-0 grid-col-6">
                  <PPMSMultiSelect
                    avoidHighlightFirstOption={true}
                    caseSensitiveSearch={false}
                    emptyRecordMsg={"---- No State Found ----"}
                    chipVariant={"primary"}
                    id={"stateSearch"}
                    isRequired={false}
                    placeholder={"Select State"}
                    options={states}
                    displayValue={"states"}
                    selectedValues={selectedStateValues}
                    showCheckbox={false}
                    isObject={true}
                    singleSelect={false}
                    closeOnSelect={true}
                    onSelect={handleStateChange}
                    onRemove={handleStateChange}
                  />
                </div>
              </div>

              {/**End Body */}
            </div>
          </div>
        </div>

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
              <div className={"grid-row"}>
                <div className="advance-search-label grid-col-12">
                  <PPMSLabel htmlFor={"Item Control Number"}>
                    Item Control Number
                  </PPMSLabel>
                </div>
                <div className="p-0 grid-col-6">
                  <PPMSInput
                    maxLength={18}
                    minLength={6}
                    isDisabled={false}
                    id="Item Control Number"
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

              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col-7"}>
                  <div className="advance-search-label margin-top-2 grid-col-12">
                    <PPMSLabel htmlFor="niin-search">
                      National Item Identification Number (NIIN)
                    </PPMSLabel>
                  </div>
                  <div className="grid-col-12">
                    <PPMSInput
                      isDisabled={false}
                      placeHolder={
                        "Search by National Item Identification Number (NIIN)"
                      }
                      id={"niin-search"}
                      inputType={"text"}
                      isInvalid={false}
                      isValid={false}
                      isRequired={false}
                      value={niinCode}
                      onChange={handleNIINChange}
                      maxLength={50}
                    />
                  </div>
                </div>
                <div className={"grid-col-5"}>
                  <div className="advance-search-label  margin-top-2 grid-col-12">
                    <PPMSLabel htmlFor={"Property Type"}>
                      Property Type
                    </PPMSLabel>
                  </div>
                  <div className="grid-col-12">
                    <PPMSSelect
                      placeholderValue={"--Select Property Type--"}
                      isRequired={false}
                      isValid={propertyTypeIsValid}
                      isInvalid={propertyTypeIsInvalid}
                      validationMessage={propertyTypeValidationMessage}
                      identifierKey="id"
                      identifierValue="value"
                      selectedValue={selectedPropertyType}
                      onChange={handlePropertyType}
                      values={propertyTypes}
                    />
                  </div>
                </div>
              </div>

              <div className={"grid-row"}>
                <div className="advance-search-label margin-top-2 grid-col-12">
                  <PPMSLabel htmlFor="fscCodeSearch">
                    Federal Supply Class/National Stock Number
                  </PPMSLabel>
                </div>
                <div className="grid-col-12">
                  <PPMSMultiSelect
                    avoidHighlightFirstOption={true}
                    caseSensitiveSearch={false}
                    emptyRecordMsg={"---- No FSC Code Found ----"}
                    chipVariant={"primary"}
                    id={"fscCodeSearch"}
                    isRequired={false}
                    placeholder={"Select FSC"}
                    options={fscState}
                    displayValue={"longName"}
                    selectedValues={fcsSelectedValues}
                    showCheckbox={false}
                    isObject={true}
                    singleSelect={false}
                    closeOnSelect={true}
                    onSelect={handleChange}
                    onRemove={handleChange}
                  />
                </div>
              </div>

              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col-6"}>
                  <div className="advance-search-label margin-top-2 grid-col-12">
                    <PPMSLabel htmlFor="searchCondition">Condition</PPMSLabel>
                  </div>
                  <div className="grid-col-12 margin-top-1">
                    <PPMSToggleCheckbox
                      id={"searchCondition"}
                      options={advancedConditions}
                      isInline={true}
                      isDisabled={false}
                      name={"searchCondition"}
                      className={"searchCondition"}
                      label={""}
                      validationMessage={"Error!"}
                      isSingleSelect={false}
                      onChange={handleConditionChange}
                    />
                  </div>
                </div>

                <div className={"grid-col-6"}>
                  <div className="advance-search-label margin-top-2 grid-col-12">
                    <PPMSLabel htmlFor="reimbursementRequired">
                      Reimbursement Required
                    </PPMSLabel>
                  </div>
                  <div className="grid-col-12 margin-top-1">
                    <PPMSToggleRadio
                      id={"reimbursementRequired"}
                      options={yesNoRadioOptions}
                      isInline={true}
                      isDisabled={false}
                      name={"reimbursementRequired"}
                      className={"reimbursementRequired"}
                      label={""}
                      validationMessage={"Error!"}
                      onChange={handleReimbursementRequiredChange}
                    />
                  </div>
                </div>
                {/**End Body */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={"flat-widget ppms-widget"}>
        <div
          className={
            "usa-card__body non-tcn-main-row card-header-height widget-header"
          }
        >
          Item Timeline
        </div>
        <div className={"usa-card__body"}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col-4"}>
              <div
                className={
                  "date-reported-label advance-search-label margin-top-2 grid-col-12"
                }
              >
                <PPMSLabel htmlFor={"Date Reported"}>Date Reported</PPMSLabel>
              </div>
              <div className="grid-col-12">
                <PPMSSelect
                  placeholderValue={"--Select Date Reported--"}
                  label={null}
                  values={dateValues}
                  identifierKey={"id"}
                  identifierValue={"value"}
                  isInvalid={false}
                  isValid={false}
                  isRequired={false}
                  selectedValue={reportedDateType}
                  validationMessage={""}
                  onChange={handleDateReportSelect}
                />
              </div>
              {reportedDateType === "custom" && (
                <>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col-6"}>
                      <PPMSLabel
                        className="datesLabel"
                        htmlFor={"Date Reported"}
                      >
                        From
                      </PPMSLabel>
                      <PPMSDatepicker
                        id={"dateReportedFrom"}
                        format={"MM/DD/YYYY"}
                        startDate={dateReportedFrom}
                        updateDate={handleDateReportedFromChange}
                        display={"bottom-start"}
                        placeholder={"MM/DD/YYYY"}
                        isRequired={false}
                        isInvalid={false}
                        className={"dateMargin"}
                      />
                    </div>
                    <div className={"grid-col-6"}>
                      <PPMSLabel className="datesLabel" htmlFor={"end date"}>
                        To
                      </PPMSLabel>
                      <PPMSDatepicker
                        id={"dateReportedTo"}
                        format={"MM/DD/YYYY"}
                        startDate={dateReportedTo}
                        updateDate={handleDateReportedToChange}
                        display={"bottom-start"}
                        placeholder={"MM/DD/YYYY"}
                        isRequired={false}
                        isInvalid={false}
                        className={"dateMargin"}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className={"grid-col-4"}>
              <div
                className={
                  "date-reported-label advance-search-label margin-top-2 grid-col-12"
                }
              >
                <PPMSLabel htmlFor={" Surplus Release Date"}>
                  {" "}
                  Surplus Release Date
                </PPMSLabel>
              </div>
              <div className="grid-col-12">
                <PPMSSelect
                  placeholderValue={"--Select Surplus Release Date--"}
                  label={null}
                  values={releaseDateValues}
                  identifierKey={"id"}
                  identifierValue={"value"}
                  isInvalid={false}
                  isValid={false}
                  isRequired={false}
                  selectedValue={surplusDateType}
                  validationMessage={""}
                  onChange={handleSurplusDateSelect}
                />
              </div>

              {surplusDateType === "custom" && (
                <>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col-6"}>
                      <PPMSLabel
                        className="datesLabel"
                        htmlFor={"start date surplusReleaseDate "}
                      >
                        From
                      </PPMSLabel>

                      <PPMSDatepicker
                        id={"surplusReleaseDateFrom"}
                        format={"MM/DD/YYYY"}
                        startDate={surplusReleaseDateFrom}
                        updateDate={handleSurplusReleaseDateFromChange}
                        display={"bottom-start"}
                        placeholder={"MM/DD/YYYY"}
                        isRequired={false}
                        isInvalid={false}
                        className={"dateMargin"}
                      />
                    </div>
                    <div className={"grid-col-6"}>
                      <PPMSLabel
                        className="datesLabel"
                        htmlFor={"end date surplusReleaseDate"}
                      >
                        To
                      </PPMSLabel>

                      <PPMSDatepicker
                        id={"surplusReleaseDateTo"}
                        format={"MM/DD/YYYY"}
                        startDate={surplusReleaseDateTo}
                        updateDate={handleSurplusReleaseDateToChange}
                        display={"bottom-start"}
                        placeholder={"MM/DD/YYYY"}
                        isRequired={false}
                        isInvalid={false}
                        className={"dateMargin"}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={"grid-col-4"}>
              <div className="excess-release-date-label advance-search-label margin-top-2 grid-col-12">
                <PPMSLabel htmlFor={"Excess Release Date"}>
                  Excess Release Date
                </PPMSLabel>
              </div>
              <div className="grid-col-12">
                <PPMSSelect
                  placeholderValue={"--Select Excess Release Date--"}
                  label={null}
                  values={releaseDateValues}
                  identifierKey={"id"}
                  identifierValue={"value"}
                  isInvalid={false}
                  isValid={false}
                  isRequired={false}
                  selectedValue={excessDateType}
                  validationMessage={""}
                  onChange={handleExcessDateSelect}
                />
              </div>
              {excessDateType === "custom" && (
                <>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col-6"}>
                      <PPMSLabel className="datesLabel" htmlFor={"start date"}>
                        From
                      </PPMSLabel>
                      <PPMSDatepicker
                        id={"excessReleaseDateFrom"}
                        format={"MM/DD/YYYY"}
                        startDate={excessReleaseDateFrom}
                        updateDate={handleExcessReleaseDateFromChange}
                        display={"bottom-start"}
                        placeholder={"MM/DD/YYYY"}
                        isRequired={false}
                        isInvalid={false}
                        className={"dateMargin"}
                      />
                    </div>
                    <div className={"grid-col-6"}>
                      <PPMSLabel className="datesLabel" htmlFor={"end date"}>
                        To
                      </PPMSLabel>
                      <PPMSDatepicker
                        id={"excessReleaseDateTo"}
                        format={"MM/DD/YYYY"}
                        startDate={excessReleaseDateTo}
                        updateDate={handleExcessReleaseDateToChange}
                        display={"bottom-start"}
                        placeholder={"MM/DD/YYYY"}
                        isRequired={false}
                        isInvalid={false}
                        className={"dateMargin"}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/**End Body */}
        </div>
      </div>
    </React.Fragment>
  );
};
