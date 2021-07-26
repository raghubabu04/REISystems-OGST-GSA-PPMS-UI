import React from "react";
import PPMSCard from "../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSState } from "../../ui-kit/components/PPMS-state";
import { PPMSSelect } from "../../ui-kit/components/common/select/PPMS-select";
import { PPMSEmail } from "../../ui-kit/components/PPMS-email";
import { PPMSInput } from "../../ui-kit/components/common/input/PPMS-input";
import PPMSPriority from "../../ui-kit/components/PPMS-priority";
import PPMSRegion from "../../ui-kit/components/PPMS-region";
import { FilterState } from "./FilterState";
import {
  allocationStatusCodes,
  aoApprovalStatusCodes,
  completedTransferStatusCodes,
  erdSrdDateType,
  myRequestsTCNCodes,
  releaseDateValues,
  requisitionTransferStatusCodes,
  TcnWorkFlowType,
} from "./create-update-property/constants/Constants";
import { PPMSDatepicker } from "../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { PPMSToggleRadio } from "../../ui-kit/components/common/toggle/PPMS-toggle";

export function getFilters(filterGroup: any[]) {
  return (
    <>
      {filterGroup.map((group) => {
        return (
          <PPMSCard className="margin-bottom-105">
            <PPMSCardBody
              className={"filter-card-body margin-x-neg-105 margin-y-neg-105"}
            >
              <div>
                <h3>
                  
                    {group.label}
                  
                </h3>
                
                  {group.fields.map((f) => {
                    return <div className={"grid-col"}>{getFilter(f)}</div>;
                  })}
                
              </div>
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
    case "email":
      field = React.createElement(PPMSEmail, f);
      break;
    case "priority":
      field = React.createElement(PPMSPriority, f);
      break;
    case "state":
      field = React.createElement(PPMSState, f);
      break;
    case "region":
      field = React.createElement(PPMSRegion, f);
      break;
    case "select":
      field = React.createElement(PPMSSelect, f);
      break;
    case "date":
      field = React.createElement(PPMSDatepicker, f);
      break;
    case "radio":
      field = React.createElement(PPMSToggleRadio, f);
      break;
    default:
      field = React.createElement(PPMSInput, f);
      break;
  }
  return field;
}

const getTcnStatusValues = (workflow: TcnWorkFlowType) => {
  switch (workflow) {
    case TcnWorkFlowType.ALLOCATIONS:
      return allocationStatusCodes;
    case TcnWorkFlowType.APPROVE_TRANSFER_ORDERS:
      return aoApprovalStatusCodes;
    case TcnWorkFlowType.REQUISITION_TRANSFER_ORDERS:
      return requisitionTransferStatusCodes;
    case TcnWorkFlowType.MY_REQUESTS:
      return myRequestsTCNCodes;
    case TcnWorkFlowType.COMPLETED_TRASFER:
      return completedTransferStatusCodes;
    default:
      break;
  }
};

export function transferRequestsFilter(
  filter: FilterState,
  workflow: TcnWorkFlowType,
  handleTransferRequestsChange: any
) {
  return getFilters([
    {
      label: "Filter by:",
      fields: [
        {
          id: "transferRequests",
          name: "transferRequests",
          label: "",
          inputType: "radio",
          options: [
            {
              value: "All Transfer Requests",
              id: "all",
              isSelected: filter.transferRequests === "all",
            },
            {
              value: "My Transfer Requests",
              id: "my",
              isSelected: filter.transferRequests === "my",
            },
          ],
          isInline: false,
          isDisabled: false,
          className: "",
          validationMessage: "",
          isSingleSelect: true,
          isRequired: true,
          onChange: handleTransferRequestsChange,
        },
      ],
    },
  ]);
}

export function UserFilters(
  filter: FilterState,
  handleChange: any,
  handleEmailChange: any
) {
  return getFilters([
    {
      label: "Search another user",
      fields: [
        {
          id: "apo-first-name",
          name: "apoFirstName",
          label: "",
          ariaLabel: "First Name",
          maxLength: 30,
          onChange: handleChange,
          isRequired: true,
          value: filter.apoFirstName,
          placeHolder: "First Name",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
        {
          id: "apo-last-name",
          name: "apoLastName",
          label: "",
          ariaLabel: "Last Name",
          maxLength: 30,
          onChange: handleChange,
          isRequired: true,
          value: filter.apoLastName,
          placeHolder: "Last Name",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
        {
          id: "apo-email",
          name: "apoEmail",
          label: "",
          ariaLabel: "Email",
          maxLength: 60,
          onChangeEmail: handleEmailChange,
          updateEmail: () => {},
          isRequired: true,
          email: filter.apoEmail,
          placeHolder: "Email ID",
          inputType: "email",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
      ],
    },
  ]);
}

export function TcnFilters(
  filter: FilterState,
  workflow: TcnWorkFlowType,
  handleChange: any,
  handleTCNStatusChange: any
) {
  const filters = [
    {
      label: "Transfer Control Number",
      fields: [
        {
          id: "transfer-control-number",
          name: "transferControlNumber",
          label: "",
          ariaLabel: "Transfer Control Number",
          maxLength: 12,
          onChange: handleChange,
          isRequired: true,
          value: filter.transferControlNumber,
          placeHolder: "TCN Number",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
      ],
    },
    {
      label: "TCN Status",
      fields: [
        {
          placeholderValue: "Not Selected",
          label: "",
          id: "tcnStatus",
          name: "tcnStatus",
          ariaLabel: "Transfer Control Number Status",
          values: getTcnStatusValues(workflow),
          isRequired: false,
          onChange: handleTCNStatusChange,
          identifierValue: "value",
          identifierKey: "id",
          inputType: "select",
          isInvalid: false,
          isValid: true,
          disabled: false,
          selectedValue:
            filter?.requestStatus?.length === 1 ? filter.requestStatus[0] : "",
        },
      ],
    },
    {
      label: "Item Control Number",
      fields: [
        {
          id: "Item-control-number",
          name: "itemControlNumber",
          label: "",
          ariaLabel: "Item Control Number",
          maxLength: 18,
          onChange: handleChange,
          isRequired: true,
          value: filter.itemControlNumber,
          placeHolder: "ICN Number",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
      ],
    },
  ];
  if (workflow === TcnWorkFlowType.APPROVE_TRANSFER_ORDERS) {
    const reportingAACFilter = {
      label: "Reporting AAC",
      fields: [
        {
          id: "reporting-aac",
          name: "reportingAACId",
          label: "",
          ariaLabel: "Reporting AAC",
          maxLength: 12,
          onChange: handleChange,
          isRequired: true,
          value: filter.reportingAACId,
          placeHolder: "Reporting AAC",
          inputType: "text",
          isInvalid: false,
          isDisabled: false,
          isValid: true,
        },
      ],
    };
    filters.unshift(reportingAACFilter);
  }
  return getFilters(filters);
}

export function ErdSrdFilters(
  filterType: erdSrdDateType,
  dateType: any,
  releaseDateFrom: any,
  releaseDateTo: any,
  handleDateSelect: any,
  handleReleaseDateFromChange: any,
  handleReleaseDateToChange: any
) {
  let filters = [];
  let dateSelectorTypeId: {
    releaseSelectorType: string;
    releaseDateFromId: string;
    releaseDateToId: string;
    title: string;
  } = {
    releaseSelectorType: "",
    releaseDateFromId: "",
    releaseDateToId: "",
    title: "",
  };

  switch (filterType) {
    case erdSrdDateType.ERD: {
      dateSelectorTypeId.releaseSelectorType = "Excess Release Date";
      dateSelectorTypeId.releaseDateFromId = "excessReleaseDateFrom";
      dateSelectorTypeId.releaseDateToId = "excessReleaseDateTo";
      dateSelectorTypeId.title = "ERD";
      break;
    }
    case erdSrdDateType.SRD: {
      dateSelectorTypeId.releaseSelectorType = "Surplus Release Date";
      dateSelectorTypeId.releaseDateFromId = "surplusReleaseDateFrom";
      dateSelectorTypeId.releaseDateToId = "surplusReleaseDateTo";
      dateSelectorTypeId.title = "SRD";
      break;
    }
    default: {
      break;
    }
  }

  const erdSrdFilter = {
    label: dateSelectorTypeId.releaseSelectorType,
    fields: [
      {
        placeholderValue: "Not Selected",
        label: "",
        ariaLabel: "Release Date Selection",
        values: releaseDateValues,
        isRequired: false,
        onChange: handleDateSelect,
        identifierValue: "value",
        identifierKey: "id",
        inputType: "select",
        isInvalid: false,
        isValid: true,
        disabled: false,
        selectedValue: dateType,
      },
    ],
  };
  filters.push(erdSrdFilter);

  if (dateType === "custom") {
    let releaseDateFromSelector = {
      label: `From Date(${dateSelectorTypeId.title})`,
      fields: [
        {
          id: dateSelectorTypeId.releaseDateFromId,
          placeholder: "MM/DD/YYYY",
          startDate: releaseDateFrom,
          updateDate: handleReleaseDateFromChange,
          display: "bottom-start",
          isValid: false,
          isRequired: false,
          inputType: "date",
        },
      ],
    };
    let releaseDateToSelector = {
      label: `To Date(${dateSelectorTypeId.title})`,
      fields: [
        {
          id: dateSelectorTypeId.releaseDateToId,
          placeholder: "MM/DD/YYYY",
          startDate: releaseDateTo,
          updateDate: handleReleaseDateToChange,
          display: "bottom-start",
          isValid: false,
          isRequired: false,
          inputType: "date",
        },
      ],
    };
    filters.push(releaseDateFromSelector);
    filters.push(releaseDateToSelector);
  }

  return getFilters(filters);
}
