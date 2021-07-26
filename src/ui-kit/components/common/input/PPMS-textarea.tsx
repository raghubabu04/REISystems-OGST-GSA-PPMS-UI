import React, { createRef } from "react";
import PPMSLabel from "../form/PPMS-label";
import { PPMSPopover } from "../PPMS-popover";
import { PPMSFormGroup } from "../form/PPMS-form-group";
import PPMSErrorMessage from "../form/PPMS-error-message";
import { FaInfoCircle } from "react-icons/fa";
import PPMSTextarea from "../form/PPMS-textarea";

export interface PPMSInputNewProps {
  onChange?: any;
  onBlur?: (event) => any | null;
  isInvalid: boolean;
  isValid?: boolean;
  name?: string;
  message?: string;
  id: string;
  icon?: {};
  label?: string;
  labelBold?: boolean;
  placeHolder?: string;
  isRequired: boolean;
  infoTipContent?: any;
  infoTipClass?: string;
  inputType?:
    | "number"
    | "text"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "url";
  isDisabled: boolean;
  isReadOnly?: boolean;
  defaultValue?: string;
  value?: string | number;
  validationMessage?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  inputRef?: any;
  className?: string;
}
export interface PPMSInputNewState {}

export class PPMSTextArea extends React.Component<
  PPMSInputNewProps,
  PPMSInputNewState
> {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  inputRef = createRef<HTMLTextAreaElement>();
  onChange = (event) => {
    this.props.onChange(event);
  };

  onBlur = (event) => {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  render() {
    return (
      <>
        <PPMSFormGroup error={this.props.isInvalid}>
          <PPMSLabel
            htmlFor={this.props.name}
            hint={
              !this.props.isRequired && this.props.label ? `(Optional)` : ""
            }
            className={`${this.props.labelBold ? "text-bold" : ""}`}
          >
            {this.props.icon} {this.props.label}{" "}
            {this.props.infoTipContent && infoTip}
          </PPMSLabel>
          <PPMSTextarea
            id={this.props.id}
            label={this.props.label}
            name={this.props.name}
            placeholder={this.props.placeHolder}
            error={this.props.isInvalid}
            disabled={this.props.isDisabled}
            readOnly={this.props.isReadOnly}
            defaultValue={this.props.defaultValue}
            value={this.props.value}
            onChange={this.onChange}
            onBlur={this.onBlur}
            maxLength={this.props.maxLength}
            minLength={this.props.minLength}
            required={this.props.isRequired}
            inputRef={this.props.inputRef}
            autoComplete="off"
            className={this.props.className}
          />
          {this.props.isInvalid && (
            <PPMSErrorMessage>{this.props.validationMessage}</PPMSErrorMessage>
          )}
        </PPMSFormGroup>
      </>
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
        className={"usa-button  usa-button--unstyled"}
      >
        <FaInfoCircle />
      </button>
    }
  />
);
