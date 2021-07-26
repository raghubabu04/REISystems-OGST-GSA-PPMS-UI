import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import {
  phoneExtensionValidation,
  phoneValidation,
} from "./validations/FieldValidations";

export interface PPMSPhoneNumberFormatProps {
  disabled: boolean;
  disabledExtension: boolean;
  extension: string;
  extensionValidationMessage: string;
  id: string;
  isExtensionInvalid: boolean;
  isExtensionValid: boolean;
  isInvalid: boolean;
  isValid: boolean;
  maxLength: number;
  maxLengthExtension: number;
  phone: string;
  required: boolean;
  size: number;
  validationMessage: string;
}
export interface PPMSPhoneNumberFormatState {
  disabledExtension: boolean;
  extension: string;
  extensionValidationMessage: string;
  isExtensionInvalid: boolean;
  isExtensionValid: boolean;
  isInvalid: boolean;
  isValid: boolean;
  phone: string;
  validationMessage: string;
}

export class PPMSPhoneNumberFormat extends React.Component<
  PPMSPhoneNumberFormatProps,
  PPMSPhoneNumberFormatState
> {
  constructor(props) {
    super(props);
    this.state = {
      disabledExtension: true,
      extension: "",
      extensionValidationMessage: "",
      isExtensionInvalid: false,
      isExtensionValid: false,
      isInvalid: false,
      isValid: false,
      phone: "",
      validationMessage: "Phone Number is Required.",
    };
  }
  handlePhoneChange = (event) => {
    let target = event.target;
    let validation = phoneValidation(event.target.value);
    this.setValidation(target, validation);
    if (event.target.value.length > 0) {
      this.setState((prevState) => ({
        disabledExtension: false,
        phone: this.normalizeInput(target.value, prevState.phone),
      }));
    } else {
      this.setState({
        disabledExtension: true,
      });
    }
  };
  handleExtensionChange = (event) => {
    let target = event.target;
    let validation = phoneExtensionValidation(event.target.value);
    this.setState({
      isExtensionInvalid: validation.isInvalid,
      isExtensionValid: !validation.isInvalid,
      extensionValidationMessage: validation.validationError,
    });
  };
  setValidation(target, data) {
    this.setState({
      isInvalid: data.isInvalid,
      isValid: !data.isInvalid,
      validationMessage: data.validationError,
    });
  }

  normalizeInput(value, previousValue) {
    // return nothing if no value
    if (!value) return value;

    // only allows 0-9 inputs
    const currentValue = value.replace(/[^\d]/g, "");
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
      // returns: "x", "xx", "xxx"
      if (cvLength < 4) return currentValue;

      // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
      if (cvLength < 7)
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;

      // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
        3,
        6
      )}-${currentValue.slice(6, 10)}`;
    }
  }

  render() {
    return (
      <>
        <div className={"grid-col"}>
          <PPMSInput
            isDisabled={this.props.disabled}
            id={this.props.id}
            inputType={"tel"}
            isInvalid={this.state.isInvalid}
            isValid={this.state.isValid}
            label={"Phone Number"}
            maxLength={this.props.maxLength}
            minLength={14}
            min={14}
            message={
              "Phone Number must be no more than 10 digits and contain only numeric values."
            }
            name={"phoneFieldFirst"}
            onChange={this.handlePhoneChange}
            placeHolder={"xxx-xxx-xxxx"}
            isRequired={this.props.required}
            validationMessage={this.state.validationMessage}
            value={this.state.phone}
          />
        </div>
        <div className={"grid-col"}>
          <PPMSInput
            isDisabled={this.state.disabledExtension}
            id={this.props.id + "-extension"}
            inputType={"text"}
            isInvalid={this.state.isExtensionInvalid}
            isValid={this.state.isExtensionValid}
            label={"Phone Extension"}
            maxLength={this.props.maxLengthExtension}
            minLength={1}
            message={
              "Phone Extension must be no more than 7 digits and contain only numeric values."
            }
            name={"phoneExtension"}
            onChange={this.handleExtensionChange}
            placeHolder={"xxx-xxxx"}
            isRequired={false}
            validationMessage={this.state.extensionValidationMessage}
            value={this.state.extension}
          />
        </div>
      </>
    );
  }
}
