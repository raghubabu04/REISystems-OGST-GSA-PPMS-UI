import React from "react";
import PPMSCard from "../../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { FilterState } from "../Filter/FilterState";
import PPMSMultiSelect from "../../../../../ui-kit/components/PPMS-multi-select";
import {
  propertyTypes,
  hazardousValues,
  assignmentValues,
  conditionValues,
  addedServiceValues,
} from "../constants/Constants";
import { PPMSIncludeExclude } from "../../../../../ui-kit/components/common/toggle/PPMS-include-exclude";

export function getFilters(filterGroup: any[]) {
  return (
    <>
      {filterGroup.map((group) => {
        return (
          <PPMSCard className="margin-bottom-105">
            <PPMSCardBody
              className={"filter-card-body margin-x-neg-105 margin-y-neg-105"}
            >
              <h4 className="margin-bottom-1px">{group.label}</h4>
              {group.fields.map((f) => {
                return <div className={"grid-col"}>{getFilter(f)}</div>;
              })}
            </PPMSCardBody>
          </PPMSCard>
        );
      })}
    </>
  );
}

function getFilter(f: any) {
  let field: any;
  switch (f.inputType) {
    case "select":
      field = React.createElement(PPMSSelect, f);
      break;
    case "multi":
      field = React.createElement(PPMSMultiSelect, f);
      break;
    case "include":
      field = React.createElement(PPMSIncludeExclude, f);
      break;
    default:
      field = React.createElement(PPMSInput, f);
      break;
  }
  return field;
}

export function agencyFilter(
  filter: FilterState,
  handleAgencyBureau: any,
  isChecked: boolean,
  handleIncludeChange: any
) {
  return getFilters([
    {
      label: "Agency/Bureau",
      fields: [
        {
          avoidHighlightFirstOption: true,
          caseSensitiveSearch: false,
          alphaNumericOrDigitSearch: true,
          isPivotSorted: true,
          emptyRecordMsg: "---- No Agency Bureau Found ----",
          chipVariant: "primary",
          id: "agencyBureau",
          options: filter.agencyBureaus,
          isRequired: false,
          placeholder: "Select Agency Bureau",
          displayValue: "agencyBureau",
          selectedValues: filter.selectedAgencyBureaus,
          showCheckbox: false,
          isObject: true,
          onSelect: handleAgencyBureau,
          onRemove: handleAgencyBureau,
          singleSelect: false,
          singleSelectAndTypeSearch: true,
          selectionLimit: 1,
          closeOnSelect: true,
          isInvalid: false,
          isValid: true,
          inputType: "multi",
        },
        {
          isDisabled: false,
          isChecked: isChecked,
          id: "include-exclude",
          name: "include-exclude",
          onChange: handleIncludeChange,
          inputType: "include",
          ariaLabel: "Included or Excluded Selection",
        },
      ],
    },
  ]);
}

export function propertyTypeFilter(
  filter: FilterState,
  handleSelectionChange: any
) {
  return getFilters([
    {
      label: "Property Type",
      fields: [
        {
          placeholderValue: "Not Selected",
          label: "",
          id: "propertyType",
          name: "propertyType",
          ariaLabel: "Property Type Selection",
          values: propertyTypes,
          isRequired: true,
          onChange: handleSelectionChange,
          identifierValue: "value",
          identifierKey: "id",
          inputType: "select",
          isInvalid: false,
          isValid: true,
          disabled: false,
          selectedValue: filter?.propertyType,
        },
      ],
    },
  ]);
}

export function fscFilter(filter: FilterState, handleFSCChange: any) {
  return getFilters([
    {
      label: "FSC / FSG",
      fields: [
        {
          avoidHighlightFirstOption: true,
          caseSensitiveSearch: false,
          emptyRecordMsg: "---- No FSC Code Found ----",
          chipVariant: "primary",
          id: "fscCodeSearch",
          isRequired: false,
          placeholder: "Select FSC",
          options: filter.fscCodes,
          displayValue: "longName",
          selectedValues: filter.fcsSelectedValues,
          showCheckbox: false,
          isObject: true,
          singleSelect: false,
          closeOnSelect: true,
          onSelect: handleFSCChange,
          onRemove: handleFSCChange,
          inputType: "multi",
        },
      ],
    },
  ]);
}

export function hazardousFilter(
  filter: FilterState,
  handleSelectionChange: any
) {
  return getFilters([
    {
      label: "Hazardous",
      fields: [
        {
          placeholderValue: "Not Selected",
          label: "",
          id: "hazardous",
          name: "hazardous",
          ariaLabel: "Hazardous Selection",
          values: hazardousValues,
          isRequired: true,
          onChange: handleSelectionChange,
          identifierValue: "value",
          identifierKey: "id",
          inputType: "select",
          isInvalid: false,
          isValid: true,
          disabled: false,
          selectedValue: filter?.hazardous,
        },
      ],
    },
  ]);
}

export function assignmentFilter(
  filter: FilterState,
  handleAssignmentChange: any
) {
  return getFilters([
    {
      label: "By Assignment",
      fields: [
        {
          label: "",
          id: "assignment",
          name: "assignment",
          ariaLabel: "By Assignment Selection",
          values: assignmentValues,
          isRequired: true,
          onChange: handleAssignmentChange,
          identifierValue: "value",
          identifierKey: "value",
          inputType: "select",
          isInvalid: false,
          isValid: true,
          disabled: false,
          selectedValue: filter?.assignment,
        },
      ],
    },
  ]);
}

export function aacFilter(filter: FilterState, handleChange: any) {
  return getFilters([
    {
      label: "AAC",
      fields: [
        {
          id: "aac",
          name: "AACId",
          label: "",
          ariaLabel: "AAC",
          maxLength: 6,
          onChange: handleChange,
          isRequired: true,
          value: filter.aac,
          placeHolder: "AAC",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
      ],
    },
  ]);
}

export function emailAddressFilter(
  filter: FilterState,
  handleEmailChange: any
) {
  return getFilters([
    {
      label: "By Email Address",
      fields: [
        {
          id: "emailId",
          name: "emailId",
          label: "",
          ariaLabel: "By Email Address",
          maxLength: 60,
          onChange: handleEmailChange,
          updateEmail: () => {},
          isRequired: true,
          value: filter.email,
          placeHolder: "Search Email Address",
          inputType: "email",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
      ],
    },
  ]);
}

export function searchByRangeFilter(filter: FilterState, handleChange: any) {
  return getFilters([
    {
      label: "Search By Range",
      fields: [
        {
          id: "startingIcn",
          name: "startingIcn",
          label: "",
          ariaLabel: "Starting ICN",
          maxLength: 18,
          onChange: handleChange,
          isRequired: true,
          value: filter.startingIcn,
          placeHolder: "Starting ICN",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
        {
          id: "endingIcn",
          name: "endingIcn",
          label: "",
          ariaLabel: "Ending ICN",
          maxLength: 18,
          onChange: handleChange,
          isRequired: true,
          value: filter.endingIcn,
          placeHolder: "Ending ICN",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
      ],
    },
  ]);
}
export function conditionFilter(
  filter: FilterState,
  handleSelectionChange: any
) {
  return getFilters([
    {
      label: "Condition Code",
      fields: [
        {
          placeholderValue: "Not Selected",
          label: "",
          id: "condition",
          name: "condition",
          ariaLabel: "Condition Code",
          values: conditionValues,
          isRequired: true,
          onChange: handleSelectionChange,
          identifierValue: "value",
          identifierKey: "id",
          inputType: "select",
          isInvalid: false,
          isValid: true,
          disabled: false,
          selectedValue: filter?.condition,
        },
      ],
    },
  ]);
}

export function stateCodeFilter(
  filter: FilterState,
  handleStateCodeChange: any
) {
  return getFilters([
    {
      label: "State",
      fields: [
        {
          avoidHighlightFirstOption: true,
          caseSensitiveSearch: false,
          emptyRecordMsg: "---- No State Found ----",
          chipVariant: "primary",
          id: "stateSearch",
          isRequired: false,
          placeholder: "Select State",
          options: filter.stateCode,
          displayValue: "stateName",
          selectedValues: filter.stateCodeSelectedValues,
          showCheckbox: false,
          isObject: true,
          singleSelect: false,
          closeOnSelect: true,
          onSelect: handleStateCodeChange,
          onRemove: handleStateCodeChange,
          inputType: "multi",
        },
      ],
    },
  ]);
}

export function regionFilter(filter: FilterState, handleSelectionChange: any) {
  return getFilters([
    {
      label: "Region",
      fields: [
        {
          placeholderValue: "Not Selected",
          label: "",
          id: "region",
          name: "region",
          ariaLabel: "Region",
          values: filter.regionValues,
          isRequired: true,
          onChange: handleSelectionChange,
          identifierValue: "value",
          identifierKey: "id",
          inputType: "select",
          isInvalid: false,
          isValid: true,
          disabled: false,
          selectedValue: filter?.region,
        },
      ],
    },
  ]);
}

export function addedServiceFilter(
  filter: FilterState,
  handleSelectionChange: any
) {
  return getFilters([
    {
      label: "Value Added Services",
      fields: [
        {
          placeholderValue: "Not Selected",
          label: "",
          id: "addedService",
          name: "addedService",
          ariaLabel: "Value Added Service",
          values: addedServiceValues,
          isRequired: true,
          onChange: handleSelectionChange,
          identifierValue: "value",
          identifierKey: "id",
          inputType: "select",
          isInvalid: false,
          isValid: true,
          disabled: false,
          selectedValue: filter?.addedService,
        },
      ],
    },
  ]);
}
