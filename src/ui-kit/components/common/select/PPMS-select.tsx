import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { PPMSPopover } from "../PPMS-popover";
import PPMSDropdown from "../form/PPMS-dropdown";
import PPMSLabel from "../form/PPMS-label";
import { PPMSFormGroup } from "../form/PPMS-form-group";
import PPMSErrorMessage from "../form/PPMS-error-message";
import { isEmptyCheck } from "../../validations/FieldValidations";
import { PageUtils } from "../../../../utils/PageUtils";

export interface PPMSSelectProps {
  placeholderValue?: string;
  placeholderTextOnlyValue?: boolean;
  disabled?: boolean;
  identifierKey?: string;
  identifierValue?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  label?: string;
  labelBold?: boolean;
  isRequired?: boolean;
  selectClass?: string;
  selectedValue?: string;
  name?: string;
  title?: string;
  selectName?: string;
  validationMessage?: string;
  values?: any;
  onChange?: any;
  infoTipContent?: any;
  infoTipClass?: string;
  defaultValue?: string;
  message?: string;
  id?: string;
  icon?: {};
  inputRef?: any;
  ariaLabel?: string;
}
export interface PPMSSelectState {}

export class PPMSSelect extends React.Component<
  PPMSSelectProps,
  PPMSSelectState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  private ref = React.createRef();

  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.validationMessage !== prevProps.validationMessage) {
      let ref = this.props.inputRef ? this.props.inputRef : this.ref;
      PageUtils.setCustomValidity(ref.current, this.props.validationMessage);
    }
  }

  render() {
    const options = this?.props?.values?.map((data: any, index: number) => (
      <option
        key={`${data[this.props.identifierKey]}-${index}`}
        id={data[this.props.identifierKey]} //DO NOT CHANGE THIS
        value={data[this.props.identifierKey]}
      >
        {data[this.props.identifierValue]}
      </option>
    ));
    let fieldLabel = !isEmptyCheck(this.props.label) ? (
      <>
        <PPMSLabel
          htmlFor={this.props.selectName}
          hint={!this.props.isRequired && this.props.label ? `(Optional)` : ""}
          infoTipContent={this.props.infoTipContent && infoTip(this.props)}
          className={`${this.props.labelBold ? "text-bold" : ""}`}
        >
          {this.props.icon} {this.props.label}
        </PPMSLabel>
      </>
    ) : (
      ""
    );
    return (
      <PPMSFormGroup
        error={this.props.isInvalid}
        className={this.props.selectClass}
        id={`formGroup-${this.props.placeholderValue}-${this.props.id}`}
      >
        {fieldLabel}
        <PPMSDropdown
          id={this.props.selectName}
          name={this.props.name}
          title={this.props.title}
          ariaLabel={this.props.ariaLabel}
          required={this.props.isRequired}
          validationStatus={
            this.props.isInvalid && !this.props.isValid ? "error" : ""
          }
          onChange={this.onChange}
          value={this.props.selectedValue}
          inputRef={this.props.inputRef ? this.props.inputRef : this.ref}
          disabled={this.props.disabled ? this.props.disabled : false}
        >
          {this.props.placeholderValue && (
            <option key={"empty"} id={this.props.id} value={""}>
              {this.props.placeholderTextOnlyValue ? "" : "-"}{" "}
              {this.props.placeholderValue}{" "}
              {this.props.placeholderTextOnlyValue ? "" : "-"}
            </option>
          )}
          {options}
        </PPMSDropdown>
        {this.props.isInvalid && (
          <PPMSErrorMessage id={`errorMessage-${this.props.id}`}>
            {this.props.validationMessage}
          </PPMSErrorMessage>
        )}
      </PPMSFormGroup>
    );
  }
}

const infoTip = (props) => (
  <PPMSPopover
    trigger={["click"]}
    id={props.id + "InfoTip"}
    placement={"right"}
    popoverTitle={props.label}
    popoverContent={props.infoTipContent}
    className={props.infoTipClass}
    triggerSource={
      <button
        id={`${props.id}-tooltip-button`}
        type={"button"}
        className={"usa-button usa-button--unstyled"}
        title="additional information"
      >
        <FaInfoCircle />
      </button>
    }
  />
);
