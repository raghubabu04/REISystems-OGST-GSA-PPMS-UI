import React from "react";
import PPMSLabel from "../form/PPMS-label";
import { PPMSPopover } from "../PPMS-popover";
import PPMSTextInput from "../form/PPMS-text-input";
import { PPMSFormGroup } from "../form/PPMS-form-group";
import PPMSErrorMessage from "../form/PPMS-error-message";
import { FaInfoCircle } from "react-icons/fa";
import { isEmptyCheck } from "../../validations/FieldValidations";
import { PageUtils } from "../../../../utils/PageUtils";

export interface PPMSInputNewProps {
  onChange?: any;
  onBlur?: any;
  isInvalid?: boolean;
  isValid?: boolean;
  name?: string;
  message?: string;
  id: string;
  title?: string;
  icon?: {};
  label?: string;
  labelBold?: boolean;
  placeHolder?: string;
  prefixIcon?: any;
  isRequired?: boolean;
  infoTipContent?: any;
  infoTipClass?: string;
  inputType:
    | "number"
    | "text"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "time"
    | "datetime-local"
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
  className?: string;
  outsideLink?: boolean;
  outsideLinkContext?: any;
  hint?: string;
  inputRef?: any;
  ariaLabel?: string;
  addBreak?: boolean;
}
export interface PPMSInputNewState {}

export class PPMSInput extends React.Component<
  PPMSInputNewProps,
  PPMSInputNewState
> {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  private ref = React.createRef();

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.validationMessage !== prevProps.validationMessage) {
      let ref = this.props.inputRef ? this.props.inputRef : this.ref;
      PageUtils.setCustomValidity(ref.current, this.props.validationMessage);
    }
  }

  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  onBlur = (event) => {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  render() {
    let fieldLabel = !isEmptyCheck(this.props.label) ? (
      <>
        <PPMSLabel
          htmlFor={this.props.id}
          hint={!this.props.isRequired && this.props.label ? `(Optional)` : ""}
          className={`${this.props.labelBold ? "text-bold" : ""}`}
          addBreak={this.props.addBreak}
        >
          {this.props.icon} {this.props.label}{" "}
          {this.props.infoTipContent && infoTip}
          {this.props.outsideLink && this.props.outsideLinkContext}
        </PPMSLabel>
        {this.props.addBreak ? <div className={"grid-row"}></div> : <></>}
      </>
    ) : (
      ""
    );
    return (
      <>
        <PPMSFormGroup
          error={this.props.isInvalid}
          className={this.props.className}
          id={`formGroup-${this.props.id}`}
        >
          {fieldLabel}
          <div
            className={`usa-input-group ${
              this.props.isInvalid ? "usa-input-group--error" : ""
            }`}
          >
            {this.props.prefixIcon && (
              <div className="usa-input-prefix" aria-hidden="true">
                {this.props.prefixIcon}
              </div>
            )}
            <PPMSTextInput
              id={this.props.id}
              title={this.props.title}
              name={this.props.name}
              type={this.props.inputType}
              ariaLabel={this.props.ariaLabel}
              placeholder={this.props.placeHolder}
              validationStatus={this.props.isInvalid ? "error" : ""}
              disabled={this.props.isDisabled}
              readOnly={this.props.isReadOnly}
              defaultValue={this.props.defaultValue}
              value={this.props.value}
              required={this.props.isRequired}
              onChange={this.onChange}
              onBlur={this.onBlur}
              maxLength={this.props.maxLength}
              minLength={this.props.minLength}
              min={this.props.min}
              max={this.props.max}
              pattern={this.props.pattern}
              className={this.props.className}
              autoComplete="off"
              inputRef={this.props.inputRef ? this.props.inputRef : this.ref}
            />
          </div>
          {this.props.hint && (
            <span className="usa-hint">{this.props.hint}</span>
          )}
          {this.props.isInvalid && (
            <PPMSErrorMessage id={`errorMessage-${this.props.id}`}>
              {this.props.validationMessage}
            </PPMSErrorMessage>
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
        className={"usa-button usa-button--unstyled"}
      >
        <FaInfoCircle />
      </button>
    }
  />
);
