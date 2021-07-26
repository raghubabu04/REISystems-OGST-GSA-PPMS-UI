import React from "react";
import { propertyTypes } from "../constants/Constants";
import { PropertyTypeInfo } from "./PropertyTypeInfo";
import { PropertyInfoState } from "./PropertyInfoState";

export const propertyInfoFields = (
  state: PropertyInfoState,
  handlePropTypeChange: any,
  handleChange: any,
  onChangeValue: any
) => [
  {
    selectName: "property-type",
    name: "propType",
    label: "Property Type",
    selectedValue: state.propType,
    values: propertyTypes,
    isRequired: true,
    identifierValue: "value",
    identifierKey: "id",
    infoTipContent: React.createElement(PropertyTypeInfo, {}),
    infoTipClass: "ppms-usa-input-info-body",
    onChange: handlePropTypeChange,
    validationMessage: state.propValidationMessage,
    isValid: state.isPropValid,
    isInvalid: state.isPropInValid,
  },
  //PPDMS-2807 Remove 3 flags from "Property Information" Section
  {
    id: "agency-location-code",
    name: "agencyLocationCode",
    label: "Agency Location Code",
    value: state.agencyLocationCode,
    inputType: "text",
    maxLength: 8,
    isRequired: state.isAlcRequired,
    validationMessage: state.alcValidationMessage,
    onChange: onChangeValue,
    onBlur: handleChange,
    isInvalid: state.isALCInValid,
    isValid: state.isALCValid,
    className: "big-label",
  },
  {
    id: "amount-to-be-reimbursed",
    name: "amountTobeReimbursed",
    label: "Appropriation/TAS fund to be reimbursed",
    value: state.amountTobeReimbursed,
    inputType: "text",
    maxLength: 80,
    validationMessage: state.afcReqMsg,
    onChange: onChangeValue,
    onBlur: handleChange,
    isInvalid: state.isAfcInvalid,
    isValid: state.isAfcValid,
    isRequired:
      state.isAppropriationTasRequired,
    message: !(
      state.isAppropriationTasRequired
    )
      ? "Optional"
      : null,
    outsideLink: true,
    outsideLinkContext: (
      <a
        aria-label="to get further information on the Federal Entities and contact list"
        className="usa-link usa-link--external ppms-external-link"
        href="http://fiscal.treasury.gov/gtas/contact-list-for-agencies.html"
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
    className: "big-label",
  },
  {
    id: "agency-control-number",
    name: "agencyControlNumber",
    label: "Agency Control Number",
    value: state.agencyControlNumber,
    inputType: "text",
    maxLength: 17,
    onChange: onChangeValue,
    onBlur: handleChange,
    validationMessage: state.acnValidationMessage,
    isValid: state.isACNValid,
    isInvalid: state.isACNInValid,
    className: "big-label",
    message: "Optional",
  },
];
