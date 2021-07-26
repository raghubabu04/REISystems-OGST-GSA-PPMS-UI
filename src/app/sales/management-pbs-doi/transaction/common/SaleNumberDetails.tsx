import React from "react";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { formatSaleNumber } from "../../../../../ui-kit/utilities/FormatUtil";

interface SaleNumberDetailsProps {
  state: any;
  generateSaleNumber?: any;
  updateValueOfField?: any;
  validateFields?: any;
}

const SaleNumberDetails = (props: SaleNumberDetailsProps) => {
  const {
    state,
    generateSaleNumber,
    updateValueOfField,
    validateFields,
  } = props;
  return (
    <div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSSelect
            id={"sale-method-pbsdoi"}
            identifierKey={"id"}
            identifierValue={"value"}
            name={"sale-method"}
            values={state.constants.saleMethodPBSDOI}
            label={"Sale Method"}
            isRequired={true}
            placeholderValue={"Select"}
            selectedValue={state.data.salesMethod}
            onChange={(event) => {
              let id = event.target.options[event.target.selectedIndex].id;
              let value = event.target.options[event.target.selectedIndex].text;
              updateValueOfField("saleMethod", id);
            }}
            disabled={state.validation.saleMethodDisabled}
            isInvalid={state.validation.saleMethodIsInvalid}
            validationMessage={state.validation.saleMethodValidationMessage}
          />
        </div>
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-fiscal-year"}
            inputType={"text"}
            isDisabled={state.validation.fiscalYearDisabled}
            label={"Fiscal Year"}
            onChange={(event) =>
              updateValueOfField("fiscalYear", event.target.value)
            }
            isRequired={true}
            value={state.data.fiscalYear}
            isInvalid={state.validation.fiscalYearIsInvalid}
            validationMessage={state.validation.fiscalYearValidationMessage}
            onBlur={() => {
              validateFields("fiscalYear", state.data.fiscalYear);
            }}
            maxLength={2}
          />
        </div>
        <div className="grid-col-4">
          <PPMSSelect
            id={"sale-region-pbsdoi"}
            identifierKey={"id"}
            identifierValue={"value"}
            name={"sale-region"}
            values={state.constants.regionPBSDOI}
            label={"Sale Region"}
            isRequired={true}
            placeholderValue={"Select"}
            selectedValue={state.data.region}
            onChange={(event) => {
              let id = event.target.options[event.target.selectedIndex].id;
              let value = event.target.options[event.target.selectedIndex].text;
              updateValueOfField("region", id);
              updateValueOfField("regionCode", value);
            }}
            disabled={state.validation.regionDisabled}
            isInvalid={state.validation.regionIsInvalid}
            validationMessage={state.validation.regionValidationMessage}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-number-pbsdoi"}
            inputType={"text"}
            isDisabled={true}
            label={"Sale Number"}
            isReadOnly={true}
            isRequired={true}
            value={
              state.data.salesNumber
                ? formatSaleNumber(state.data.salesNumber)
                : ""
            }
            isInvalid={state.validation.saleNumberIsInvalid}
            validationMessage={state.validation.saleNumberValidationMessage}
          />
        </div>
        <div className="grid-col-6 generate-button">
          <PPMSButton
            id={"generate-sale-number"}
            variant={"primary"}
            isDisabled={state.validation.generateSaleNumberButtonDisabled}
            onPress={generateSaleNumber}
            label={"Generate Sale Number"}
          />
        </div>
      </div>
    </div>
  );
};

export default SaleNumberDetails;
