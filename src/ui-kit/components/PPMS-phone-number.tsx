import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import { formatExtension } from "../utilities/FormatUtil";
import { validatePhoneFax } from "./validations/FieldValidations";

export interface PPMSPhoneNumberProps {
  disabled?: boolean;
  disabledExtension?: boolean;
  showExtension: boolean;
  extension?: string;
  extensionValidationMessage?: string;
  id: string;
  isExtensionInvalid?: boolean;
  isExtensionValid?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  maxLength?: number;
  maxLengthExtension?: number;
  phone?: string;
  required?: boolean;
  size?: "sm" | "lg";
  validationMessage?: string;
  updatePhoneNumber?: any;
  updatePhoneExtension?: any;
  onChangePhoneNumber?: any;
  onChangePhoneExt?: any;
  label?: string;
  labelBold?: boolean;
}
export interface PPMSPhoneNumberState {}

export class PPMSPhoneNumber extends React.Component<
  PPMSPhoneNumberProps,
  PPMSPhoneNumberState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatPhoneprops = (value) => {
    const input = value.replace(/[^0-9]/g, "").substring(0, 10);
    if (value.length === 0 || input.length === 0) {
      return "";
    }
    const first = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);
    if (input.length > 6) {
      value = `(${first}) ${middle}-${last}`;
    } else if (input.length > 3) {
      value = `(${first}) ${middle}`;
    } else if (input.length > 0) {
      value = `(${first}`;
    }
    return value;
  };

  handleChange = (event) => {
    const formattedPhone = this.formatPhone(event);
    const validation = validatePhoneFax(formattedPhone);
    this.props.updatePhoneNumber(formattedPhone, validation);
  };

  formatPhone = (event) => {
    const input = event.target.value.replace(/[^0-9]/g, "").substring(0, 10);
    if (event.target.value.length === 0 || input.length === 0) {
      return "";
    }
    const first = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);
    if (input.length > 6) {
      event.target.value = `(${first}) ${middle}-${last}`;
    } else if (input.length > 3) {
      event.target.value = `(${first}) ${middle}`;
    } else if (input.length > 0) {
      event.target.value = `(${first}`;
    }
    return event.target.value;
  };
  handleExtensionChange = (event) => {
    const formattedExtension = formatExtension(event.target.value);
    //let validation = phoneExtensionValidation(formattedExtension);

    this.props.updatePhoneExtension(formattedExtension);
  };

  render() {
    return (
      <>
        <div className={"tablet:grid-col-4 grid-col-6"}>
          <PPMSInput
            isDisabled={this.props.disabled}
            id={this.props.id}
            name={this.props.id}
            inputType={"tel"}
            isInvalid={this.props.isInvalid}
            isValid={this.props.isValid}
            label={this.props.label ? this.props.label : "Phone Number"}
            labelBold={this.props.labelBold}
            maxLength={14}
            minLength={14}
            hint={"Limit: 10 digits"}
            onChange={(event) => {
              this.props.onChangePhoneNumber(this.formatPhone(event));
            }}
            onBlur={this.handleChange}
            placeHolder={" "}
            isRequired={this.props.required}
            validationMessage={this.props.validationMessage}
            value={this.props.phone}
          />
        </div>
        {this.props.showExtension ? (
          <div className={"tablet:grid-col-7 grid-col-6"}>
            <PPMSInput
              isDisabled={this.props.disabledExtension}
              id={this.props.id + "-extension"}
              name={this.props.id + "-extension"}
              inputType={"tel"}
              isInvalid={this.props.isExtensionInvalid}
              isValid={this.props.isExtensionValid}
              label={"Phone Ext."}
              labelBold={this.props.labelBold}
              maxLength={this.props.maxLengthExtension}
              hint={"Limit: 7 digits"}
              onChange={(event) => {
                this.props.onChangePhoneExt(
                  formatExtension(event.target.value)
                );
              }}
              onBlur={this.handleExtensionChange}
              placeHolder={" "}
              isRequired={false}
              validationMessage={this.props.extensionValidationMessage}
              value={this.props.extension}
              className={"input-ext"}
            />
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}
