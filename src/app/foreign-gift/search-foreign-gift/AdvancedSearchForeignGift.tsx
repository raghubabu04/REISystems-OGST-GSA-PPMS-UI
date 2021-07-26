import React from "react";
import { AccordionItem } from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import PPMSLabel from "../../../ui-kit/components/common/form/PPMS-label";
import { AdvancedSearchHistory } from "../../property/search-property/AdvancedSearchHistory";
import { vaultLocationOptions } from "../create-update-foreign-gift/constants/Constants";

interface AdvancedSearchForeignGiftProps {
  disableAdvancedSearchAttributes?: boolean;
  historyPropertyTypeValue?: any;
  handleHistoryPropertyType?: any;
  yesNoRadioOptions?: any;
  icn?: string;
  handleICN?: any;
  icnIsInvalid?: any;
  icnIsValid?: any;
  icnValidationMessage?: any;
  handleDonorCountrySelect?: any;
  donorCountrySelected?: any;
  handleAdministrationSelect?: any;
  administrationSelected?: any;
  handleVaultLocationSelect?: any;
  vaultLocationSelected?: any;
  handleRecipientNameChange?: any;
  recipientName?: any;
  handleDonorNameChange?: any;
  donorName?: any;
  handleFiscalYearChange?: any;
  fiscalYear?: any;
  donorCountryList: any[];
  adminList: any[];
}
interface AdvancedSearchForeignGiftState {
  isExpended: boolean;
}

export class AdvancedSearchForeignGift extends React.Component<
  AdvancedSearchForeignGiftProps,
  AdvancedSearchForeignGiftState
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
  handleDonorCountrySelect = (event) => {
    this.props.handleDonorCountrySelect(event);
  };
  handleAdministrationSelect = (event) => {
    this.props.handleAdministrationSelect(event);
  };
  handleVaultLocationSelect = (event) => {
    this.props.handleVaultLocationSelect(event);
  };
  handleRecipientNameChange = (event) => {
    this.props.handleRecipientNameChange(event);
  };
  handleDonorNameChange = (event) => {
    this.props.handleDonorNameChange(event);
  };
  handleFiscalYearChange = (event) => {
    this.props.handleFiscalYearChange(event);
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
                    icn={this.props.icn}
                    handleDonorCountrySelect={this.handleDonorCountrySelect}
                    handleAdministrationSelect={this.handleAdministrationSelect}
                    handleVaultLocationSelect={this.handleVaultLocationSelect}
                    handleICN={this.handleICN}
                    icnIsInvalid={this.props.icnIsInvalid}
                    icnIsValid={this.props.icnIsValid}
                    icnValidationMessage={this.props.icnValidationMessage}
                    donorCountryList={this.props.donorCountryList}
                    donorCountrySelected={this.props.donorCountrySelected}
                    administrationSelected={this.props.administrationSelected}
                    vaultLocationSelected={this.props.vaultLocationSelected}
                    handleRecipientNameChange={this.handleRecipientNameChange}
                    handleDonorNameChange={this.handleDonorNameChange}
                    handleFiscalYearChange={this.handleFiscalYearChange}
                    recipientName={this.props.recipientName}
                    donorName={this.props.donorName}
                    fiscalYear={this.props.fiscalYear}
                    adminList={this.props.adminList}
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
  handleDonorCountrySelect,
  handleAdministrationSelect,
  handleVaultLocationSelect,
  handleICN,
  icnIsInvalid,
  icnIsValid,
  icnValidationMessage,
  donorCountryList,
  donorCountrySelected,
  administrationSelected,
  vaultLocationSelected,
  handleRecipientNameChange,
  handleDonorNameChange,
  handleFiscalYearChange,
  recipientName,
  donorName,
  fiscalYear,
  adminList,
}) => {
  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4 margin-top-2"}>
        <div className={"tablet:grid-col-12"}>
          <div className={"flat-widget ppms-widget"}>
            <div
              className={
                "usa-card__body non-tcn-main-row card-header-height widget-header"
              }
            >
              Item Attributes
            </div>
            <div className={"usa-card__body"}>
              <div className={"grid-row grid-gap-4"}>
                <div className="grid-col-3">
                  <div className="advance-search-label grid-col-12">
                    <PPMSLabel htmlFor={"item-control-number"}>
                      Item Control Number
                    </PPMSLabel>
                  </div>
                  <div className="p-0 grid-col-12">
                    <PPMSInput
                      maxLength={18}
                      minLength={1}
                      isDisabled={false}
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
                <div className="grid-col-2">
                  <div className="advance-search-label grid-col-12">
                    <PPMSLabel htmlFor={"fiscal-year-search"}>
                      Fiscal Year
                    </PPMSLabel>
                  </div>
                  <div className="p-0 grid-col-12">
                    <PPMSInput
                      maxLength={18}
                      minLength={14}
                      isDisabled={false}
                      id="fiscal-year-search"
                      inputType={"text"}
                      isInvalid={false}
                      isValid={false}
                      validationMessage={""}
                      isRequired={false}
                      value={fiscalYear}
                      onChange={handleFiscalYearChange}
                    />
                  </div>
                </div>
                <div className={"grid-col-3"}>
                  <div className={"advanced-search-label grid-col-12"}>
                    <div className="advance-search-label grid-col-12">
                      <PPMSLabel htmlFor={"administration-search"}>
                        Administration
                      </PPMSLabel>
                    </div>
                    <div className="grid-col-12">
                      <PPMSSelect
                        title={"select administration"}
                        placeholderValue={"--Select Administration--"}
                        label={null}
                        values={adminList}
                        identifierKey={"id"}
                        identifierValue={"value"}
                        id={"administration-search"}
                        isInvalid={false}
                        isValid={false}
                        isRequired={false}
                        selectedValue={administrationSelected}
                        validationMessage={""}
                        onChange={handleAdministrationSelect}
                      />
                    </div>
                  </div>
                </div>
                <div className={"grid-col-4"}>
                  <div className={"advanced-search-label grid-col-12"}>
                    <div className="advance-search-label grid-col-12">
                      <PPMSLabel htmlFor={"donor-country-search"}>
                        Donor Country
                      </PPMSLabel>
                    </div>
                    <div className="grid-col-12">
                      <PPMSSelect
                        title={"select donor country"}
                        placeholderValue={"--Select Donor Country--"}
                        label={null}
                        values={donorCountryList}
                        id={"donor-country-search"}
                        identifierKey={"id"}
                        identifierValue={"value"}
                        isInvalid={false}
                        isValid={false}
                        isRequired={false}
                        selectedValue={donorCountrySelected}
                        validationMessage={""}
                        onChange={handleDonorCountrySelect}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col-3"}>
                  <div className="advance-search-label margin-top-2 grid-col-12">
                    <PPMSLabel htmlFor="recipient-name-search">
                      Recipient Name
                    </PPMSLabel>
                  </div>
                  <div className="grid-col-12">
                    <PPMSInput
                      isDisabled={false}
                      placeHolder={"Search by Recipient Name"}
                      id={"recipient-name-search"}
                      inputType={"text"}
                      isInvalid={false}
                      isValid={false}
                      isRequired={false}
                      value={recipientName}
                      onChange={handleRecipientNameChange}
                      maxLength={62}
                    />
                  </div>
                </div>
                <div className={"grid-col-3"}>
                  <div className="advance-search-label margin-top-2 grid-col-12">
                    <PPMSLabel htmlFor={"donor-name-search"}>
                      Donor Name
                    </PPMSLabel>
                  </div>
                  <div className="grid-col-12">
                    <PPMSInput
                      isDisabled={false}
                      placeHolder={"Search by Donor Name"}
                      id={"donor-name-search"}
                      inputType={"text"}
                      isInvalid={false}
                      isValid={false}
                      isRequired={false}
                      value={donorName}
                      onChange={handleDonorNameChange}
                      maxLength={62}
                    />
                  </div>
                </div>
                <div className={"grid-col-4"}>
                  <div className={"advanced-search-label grid-col-12"}>
                    <div className="advance-search-label margin-top-2 grid-col-12">
                      <PPMSLabel htmlFor={"Item Control Number"}>
                        Vault Location
                      </PPMSLabel>
                    </div>
                    <div className="grid-col-8">
                      <PPMSSelect
                        title={"select vault location"}
                        placeholderValue={"--Select Vault Location--"}
                        label={null}
                        values={vaultLocationOptions}
                        identifierKey={"id"}
                        identifierValue={"value"}
                        isInvalid={false}
                        isValid={false}
                        isRequired={false}
                        selectedValue={vaultLocationSelected}
                        validationMessage={""}
                        onChange={handleVaultLocationSelect}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
