import React from "react";
import { PPMSPopover } from "../PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";
import { PPMSFormGroup } from "../form/PPMS-form-group";
import PPMSLabel from "../form/PPMS-label";
import PPMSErrorMessage from "../form/PPMS-error-message";
import { PPMSCheckbox } from "../form/PPMS-checkbox";
import PPMSRadio from "../form/PPMS-radio";
import { isFormSubmitted } from "../../../../service/validation.service";

export interface CheckboxProps {
  className: string;
  isDisabled: boolean;
  id: string;
  label?: string;
  labelBold?: boolean;
  name: string;
  options: any[];
  validationMessage: string;
  onChange: any;
  isRequired?: boolean;
  isSingleSelect?: boolean;
  isLabelNotRequired?: boolean;
  isInvalid?: boolean;
  infoTipContent?: any;
  infoTipClass?: string;
  hint?: any;
  message?: any;
  isInline?: boolean;
  inputRef?: any;
  showAllOptions?: boolean;
  allOptionsLabel?: string;
}
export interface CheckboxState {
  isInvalid: boolean;
  options: any[];
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
        title="additional information"
      >
        <FaInfoCircle />
      </button>
    }
  />
);
export function prepareOptions(props) {
  let createOptions = [];
  props.options.forEach((option: any) => {
    createOptions.push({
      value: option.value,
      id: option.id,
      isSelected: option.isSelected,
      isDisabled: option.isDisabled ? option.isDisabled : false,
      field: props.name,
    });
  });
  return createOptions;
}

export class PPMSToggleCheckbox extends React.Component<
  CheckboxProps,
  CheckboxState
> {
  constructor(props) {
    super(props);
    this.state = {
      isInvalid: false,
      options: [],
    };
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.props.isRequired) {
        this.showError();
        this.props.onChange(this.state.options);
      }
    });
    this.setState({
      options: prepareOptions(this.props),
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.options !== state.options) {
      return { options: props.options };
    }
    return null;
  }

  showError() {
    if (!this.state.options.find((option: any) => option.isSelected === true)) {
      this.setState({ isInvalid: true });
      //This is needed for form validity check, if props is required;
      this.state.options.forEach((options) => {
        options.required = true;
      });
    }
  }

  onSelect = (event: any) => {
    //This is needed for form validity check, if props is required;
    this.state.options.forEach((options) => {
      options.required = false;
    });
    this.setState({ isInvalid: false });
    if (this.props.showAllOptions) {
      if (event.target.value === this.props.allOptionsLabel) {
        this.state.options.forEach((option: any) => {
          option.isSelected = false;
        });
      } else {
        this.state.options.find(
          (option: any) => option.value === this.props.allOptionsLabel
        ).isSelected = false;
      }
    }
    this.state.options.find(
      (option: any) => option.value === event.target.value
    ).isSelected = event.target.checked;
    if (this.props.isSingleSelect) {
      this.state.options.forEach((option: any) => {
        if (
          event.target.value === option.value ||
          event.target.checked === false
        ) {
          option.isDisabled = false;
        } else {
          option.isDisabled = true;
        }
      });
    }
    if (this.props.isRequired && event.target.checked === false) {
      this.showError();
    }
    this.props.onChange(this.state.options);
  };

  render() {
    let isInvalid = this.state.isInvalid || this.props.isInvalid;
    let isItemSelected = !!this.state.options.find(
      (option: any) => option.isSelected === true
    );
    let req = this.props.isRequired && !isItemSelected;

    const checkboxes = this.props?.options?.map((option) => (
      <>
        <PPMSCheckbox
          name={this.props.name}
          className={`${this.props.className} ${
            this.props.isInline ? "float-left margin-right-3" : ""
          }`}
          value={option.value}
          id={option.id + "-" + this.props.name}
          key={option.id + "-" + this.props.name}
          label={!this.props.isLabelNotRequired ? option.value : ""}
          onChange={this.onSelect}
          disabled={
            this.props.isDisabled ? this.props.isDisabled : option.isDisabled
          }
          defaultChecked={!!option.isSelected}
          required={req}
          isInvalid={!!isInvalid}
          inputRef={this.props.inputRef}
        />
      </>
    ));
    return (
      <>
        <PPMSFormGroup error={isInvalid}>
          {this.props.label && (
            <PPMSLabel
              htmlFor={this.props.name}
              hint={
                !this.props.isRequired && this.props.label ? `(Optional)` : ""
              }
              className={`${this.props.labelBold ? "text-bold" : ""}`}
            >
              {this.props.label}{" "}
              {this.props.infoTipClass && infoTip(this.props)}
            </PPMSLabel>
          )}
          {this.props.hint && (
            <span className="usa-hint">{this.props.hint}</span>
          )}
          {checkboxes}
          {this.props.isInline && (
            <>
              <br />
              <br />
            </>
          )}
          {isInvalid && (
            <PPMSErrorMessage>{this.props.validationMessage}</PPMSErrorMessage>
          )}
        </PPMSFormGroup>
      </>
    );
  }
}
export interface RadioProps {
  className?: string;
  isDisabled: boolean;
  id: string;
  label?: string;
  labelBold?: boolean;
  name: string;
  options: any[];
  validationMessage: string;
  onChange: any;
  isRequired?: boolean;
  isSingleSelect?: boolean;
  isLabelNotRequired?: boolean;
  isInvalid?: boolean;
  infoTipContent?: any;
  infoTipClass?: string;
  hint?: any;
  message?: any;
  isInline?: boolean;
  inputRef?: any;
  formClass?: any;
  inLineWithOutRightMargin?:boolean
}
export interface RadioState {
  isInvalid: boolean;
  options: any[];
}
export class PPMSToggleRadio extends React.Component<RadioProps, RadioState> {
  constructor(props) {
    super(props);
    this.state = {
      isInvalid: false,
      options: [],
    };
    this.onSelect = this.onSelect.bind(this);
  }
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.props.isRequired) {
        if (
          !this.state.options.find((option: any) => option.isSelected === true)
        ) {
          this.setState({ isInvalid: true });
          //This is needed for form validity check, if props is required;
          this.state.options.forEach((options) => {
            options.required = true;
          });
        }
      }
    });
    this.setState({
      options: prepareOptions(this.props),
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.options !== state.options) {
      return { options: props.options };
    }
    return null;
  }
  onSelect = (event) => {
    this.state.options.forEach((options) => {
      options.required = false;
    });
    this.setState({ isInvalid: false });
    this.state.options.forEach((option: any) => {
      if (option.value === event.target.value) {
        option.isSelected = true;
      } else {
        option.isSelected = false;
      }
    });
    this.props.onChange(this.state.options);
  };

  render() {
    let isInvalid: boolean = this.state.isInvalid || this.props.isInvalid;
    const radios = this.props.options.map((option) => (
      <PPMSRadio
        name={this.props.name}
        className={`${this.props.className} ${
          this.props.isInline && !this.props.inLineWithOutRightMargin  ? "float-left margin-right-3" :
            this.props.isInline && this.props.inLineWithOutRightMargin  ? "float-left":""
        }`}
        value={option.value}
        key={`${option.id}-${this.props.name}`}
        id={option.id + "-" + this.props.name}
        label={!this.props.isLabelNotRequired ? option.value : ""}
        infoTip={option.infoTip}
        onChange={this.onSelect}
        disabled={
          this.props.isDisabled ? this.props.isDisabled : option.isDisabled
        }
        defaultChecked={!!option.isSelected}
        required={option.required ? option.required : false}
        inputRef={this.props.inputRef}
      />
    ));
    return (
      <>
        <PPMSFormGroup
          error={isInvalid}
          className={`${this.props.formClass ? this.props.formClass : ""}`}
        >
          {this.props.label && (
            <PPMSLabel
              htmlFor={this.props.name}
              hint={
                !this.props.isRequired && this.props.label ? `(Optional)` : ""
              }
              className={`${this.props.labelBold ? "text-bold" : ""}`}
            >
              {this.props.label}{" "}
              {this.props.infoTipClass && infoTip(this.props)}
            </PPMSLabel>
          )}
          {this.props.hint && (
            <span className="usa-hint">{this.props.hint}</span>
          )}
          {radios}
          {isInvalid && (
            <PPMSErrorMessage>{this.props.validationMessage}</PPMSErrorMessage>
          )}
        </PPMSFormGroup>
      </>
    );
  }
}
