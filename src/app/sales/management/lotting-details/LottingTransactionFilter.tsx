import React from "react";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { AccordionItem } from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSIncludeExclude } from "../../../../ui-kit/components/common/toggle/PPMS-include-exclude";
import PPMSMultiSelect from "../../../../ui-kit/components/PPMS-multi-select";
import { propertyTypes } from "../add-icns-to-lot/constants/Constants";

interface LottingTransactionFilterProps {
  handleAdvancedSearchBtnClick?: any;
  handleAdvancedClearBtnClick?: any;
  handleChange?: any;
  handleLotNameChange?: any;
  lotName?: any;
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

  handleAgencyBureau?: any;
  handleIncludeChange?: any;
  propertyTypeIsInvalid?: any;
  propertyTypeIsValid?: any;
  propertyTypeValidationMessage?: any;
  selectedPropertyType?: any;
  handlePropertyType?: any;
  agencyBureauIsInvalid?: any;
  agencyBureauIsValid?: any;
  agencyBureauValidationMessage?: any;
  applyFilter?: any;
  clearFilter?: any;
  onApply: any;
  onClear: any;
  isChecked: boolean;
}
interface LottingTransactionFilterState {
  isExpanded: boolean;
  selectedAgencyBureaus?: any[];
  agencyBureaus?: any[];
  includeExclude?: string;
  isChecked?: boolean;
  selectedPropertyType?: string;
  fcsSelectedValues?: any[];
  fscCodeList?: any[];
  fscCodes?: any[];
  itemControlNumber?: any;
  lotName: any;
}

export class LottingTransactionFilter extends React.Component<
  LottingTransactionFilterProps,
  LottingTransactionFilterState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isExpanded: false,
      selectedAgencyBureaus: [],
      agencyBureaus: [],
      includeExclude: "Include",
      isChecked: this.props.isChecked ? this.props.isChecked : false,
      selectedPropertyType: "",
      fcsSelectedValues: [],
      fscCodeList: [],
      fscCodes: [],
      itemControlNumber: "",
      lotName: "",
    };
  }

  private commonApiService = new CommonApiService();

  componentDidMount() {
    this.commonApiService
      .getFSCCodes()
      .then((response: any) => {
        this.setState({
          fscCodes: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    this.commonApiService
      .getAllAgencyBureaus()
      .then((resp) => {
        let agencyBureau = resp.data.map((item) => {
          return {
            value: item.longName.trim(),
            agencyBureau: item.code + "-" + item.longName.trim(),
            id: item.code,
            isSelected: false,
          };
        });
        this.setState({
          agencyBureaus: agencyBureau,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleAdvancedSearchToggle = (event) => {
    this.setState({
      isExpanded: !this.state.isExpanded,
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
  handleIncludeChange = (check) => {
    this.props.handleIncludeChange(check);
  };

  handleLotNameChange = (event) => {
    this.props.handleLotNameChange(event);
  };

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className={"usa-accordion"}>
          <AccordionItem
            title={"Lotting Transaction Filter"}
            handleToggle={this.handleAdvancedSearchToggle}
            content={
              <>
                {
                  <ModelContent
                    icn={this.props.icn}
                    aacId={this.props.aacId}
                    fscState={this.props.fscState}
                    fcsSelectedValues={this.props.fcsSelectedValues}
                    handleChange={this.handleChange}
                    handleLotNameChange={this.handleLotNameChange}
                    lotName={this.props.lotName}
                    handleICN={this.handleICN}
                    icnIsInvalid={this.props.icnIsInvalid}
                    icnIsValid={this.props.icnIsValid}
                    icnValidationMessage={this.props.icnValidationMessage}
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
                    handleAgencyBureau={this.props.handleAgencyBureau}
                    propertyTypeIsInvalid={this.props.propertyTypeIsInvalid}
                    propertyTypeIsValid={this.props.propertyTypeIsValid}
                    propertyTypeValidationMessage={
                      this.props.propertyTypeValidationMessage
                    }
                    selectedPropertyType={this.props.selectedPropertyType}
                    handlePropertyType={this.handlePropertyType}
                    applyFilter={this.props.applyFilter}
                    clearFilter={this.props.clearFilter}
                    handleIncludeChange={this.handleIncludeChange}
                    isChecked={this.props.isChecked}
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
  icn,
  fscState,
  handleChange,
  handleLotNameChange,
  lotName,
  fcsSelectedValues,
  handleICN,
  icnIsInvalid,
  icnIsValid,
  icnValidationMessage,
  aacId,
  handleAAC,
  aacIsInvalid,
  aacIsValid,
  aacValidationMessage,
  agencyBureaus,
  selectedAgencyBureaus,
  handleAgencyBureau,

  agencyBureauIsInvalid,
  agencyBureauIsValid,
  agencyBureauValidationMessage,
  propertyTypeIsValid,
  propertyTypeIsInvalid,
  propertyTypeValidationMessage,
  selectedPropertyType,
  handlePropertyType,
  applyFilter,
  clearFilter,
  handleIncludeChange,
  isChecked,
}) => {
  return (
    <React.Fragment>
      <div className="">
        <div className={"sales-inner-filters"}>
          <div className={"grid-row grid-gap-2 flex-justify"}>
            <div className={"grid-col-4"}>
              <PPMSInput
                title={"Lot Name"}
                isDisabled={false}
                id={"lot-name-id"}
                label={"Lot Name"}
                isRequired={true}
                inputType={"text"}
                isInvalid={false}
                isValid={false}
                value={lotName}
                onChange={handleLotNameChange}
                maxLength={69}
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
            <div className={"grid-col-3"}>
              <PPMSSelect
                placeholderValue={"Select Property Type"}
                isRequired={true}
                label={"Property Type"}
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
          <div className={"grid-row grid-gap-2 flex-justify"}>
            <div className={"grid-col-8"}>
              <PPMSMultiSelect
                avoidHighlightFirstOption={true}
                caseSensitiveSearch={false}
                emptyRecordMsg={"---- No FSC Code Found ----"}
                chipVariant={"primary"}
                id={"fscCodeSearch"}
                isRequired={false}
                label={"FSC/FSG"}
                placeholder={"Select FSC/FSG"}
                options={fscState}
                displayValue={"longName"}
                selectedValues={fcsSelectedValues}
                selectionLimit={1}
                showCheckbox={false}
                isObject={true}
                singleSelect={false}
                closeOnSelect={true}
                onSelect={handleChange}
                onRemove={handleChange}
              />
            </div>
          </div>
          <div className={"grid-row grid-gap-2 flex-justify"}>
            <div className={"grid-col-8"}>
              <PPMSMultiSelect
                avoidHighlightFirstOption={true}
                caseSensitiveSearch={false}
                alphaNumericOrDigitSearch={true}
                isPivotSorted={true}
                emptyRecordMsg={"---- No Agency Bureau Found ----"}
                chipVariant={"primary"}
                id={"agencyBureau"}
                label={"Agency/Bureau"}
                options={agencyBureaus}
                isRequired={false}
                placeholder={"Select Agency Bureau"}
                displayValue={"agencyBureau"}
                selectedValues={selectedAgencyBureaus}
                showCheckbox={false}
                selectionLimit={1}
                isObject={true}
                onSelect={handleAgencyBureau}
                onRemove={handleAgencyBureau}
                singleSelect={false}
                singleSelectAndTypeSearch={true}
                closeOnSelect={true}
                isInvalid={agencyBureauIsInvalid}
                isValid={agencyBureauIsValid}
                validationMessage={agencyBureauValidationMessage}
              />
              <PPMSIncludeExclude
                isDisabled={false}
                isChecked={isChecked}
                id={"include-exclude"}
                name={"include-exclude"}
                onChange={handleIncludeChange}
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

      {/**End Body */}
    </React.Fragment>
  );
};
