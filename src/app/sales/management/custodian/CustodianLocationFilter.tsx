import React from "react";
import { AccordionItem } from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";

interface CustodianLocationFilterProps {
  handleLotNumberChange?: any;
  lotNumber?: any;
  handleICN?: any;
  icn?: string;
  icnIsInvalid?: any;
  icnIsValid?: any;
  icnValidationMessage?: any;
  emailAddress?: any;
  handleEmailAddressChange?: any;
  applyFilter?: any;
  clearFilter?: any;
  onApply: any;
  onClear: any;
}

interface CustodianLocationFilterState {
  isExpanded: boolean;
  lotNumber: any;
  itemControlNumber?: any;
  emailAddress?: String;
}

export class CustodianLocationFilter extends React.Component<
  CustodianLocationFilterProps,
  CustodianLocationFilterState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isExpanded: false,
      lotNumber: "",
      itemControlNumber: "",
      emailAddress: "",
    }
  }

  handleAdvancedSearchToggle = (event) => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };

  handleLotNumberChange = (event) => {
    this.props.handleLotNumberChange(event);
  };

  handleICN = (event) => {
    this.props.handleICN(event);
  };

  handleEmailAddressChange = (event) => {
    this.props.handleEmailAddressChange(event);
  };

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className={"usa-accordion"}>
          <AccordionItem
            title={"Custodian Location Filter"}
            handleToggle={this.handleAdvancedSearchToggle}
            content={
              <>
                {
                  <ModelContent
                    icn={this.props.icn}
                    handleLotNumberChange={this.handleLotNumberChange}
                    lotNumber={this.props.lotNumber}
                    handleICN={this.handleICN}
                    icnIsInvalid={this.props.icnIsInvalid}
                    icnIsValid={this.props.icnIsValid}
                    icnValidationMessage={this.props.icnValidationMessage}
                    applyFilter={this.props.applyFilter}
                    clearFilter={this.props.clearFilter}
                    handleEmailAddressChange={this.props.handleEmailAddressChange}
                    emailAddress={this.props.emailAddress}
                  
                  />
                }
              </>
            }
            className={"advanced-search-toggle"}
            expanded={this.state.isExpanded}
            id={"adviced-search"}
          />
        </div>
      </div>
    );
  }
}

const ModelContent = ({
  lotNumber,
  handleLotNumberChange,
  handleICN,
  icnIsInvalid,
  icnIsValid,
  icn,
  icnValidationMessage,
  emailAddress,
  handleEmailAddressChange,
  applyFilter,
  clearFilter,
}) => {
  return (
    <React.Fragment>
      <div className="">
        <div className={"sales-inner-filters"}>
          <div className={"grid-row grid-gap-2 flex-justify"}>
            <div className={"grid-col-2"}>
              <PPMSInput
                  title={"Lot Number"}
                  isDisabled={false}
                  id={"lot-number-id"}
                  label={"Lot Number"}
                  isRequired={true}
                  inputType={"number"}
                  isInvalid={false}
                  isValid={false}
                  value={lotNumber}
                  onChange={handleLotNumberChange}
                  maxLength={3}
              />
            </div>
            <div className={"grid-col-4"}>
              <PPMSInput
                maxLength={18}
                minLength={6}
                isDisabled={false}
                id={"Item Control Number"}
                label={"Item Control Number"}
                inputType={"text"}
                isInvalid={icnIsInvalid}
                isValid={icnIsValid}
                validationMessage={icnValidationMessage}
                isRequired={true}
                value={icn}
                onChange={handleICN}
              />
            </div>
            <div className={"grid-col-6"}>
              <PPMSInput
                maxLength={69}
                title={"Email Address"}
                isDisabled={false}
                id={"email-address-id"}
                label={"Email Address"}
                isRequired={true}
                inputType={"email"}
                isInvalid={false}
                isValid={false}
                value={emailAddress}
                onChange={handleEmailAddressChange}
              />
            </div>
          </div>
          <div className="grid-row">
            <div className="grid-col text-center margin-top-2">
              <PPMSButton
                id={"property-main-search"}
                label={"Apply Filter"}
                onPress={applyFilter}
                variant={"primary"}
                size="lg"
              />
              <PPMSButton
                id={"Search"}
                label={"Clear Filter"}
                onPress={clearFilter}
                variant={"secondary"}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
