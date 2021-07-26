import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import { validatePhoneFax } from "./validations/FieldValidations";

export interface PPMSFormattedPhoneFaxProps {
  disabled?: boolean;
  id: string;
  isInvalid?: boolean;
  isValid?: boolean;
  maxLength?: number;
  numberFormatType?: string;
  phoneFax?: string;
  required: boolean;
  size?: "sm" | "lg";
  validationMessage?: string;
  updatePhoneFax?: any;
  onChangePhoneFax?: any;
  labelBold?: boolean;
}
export interface PPMSFormattedPhoneFaxState {}

export class PPMSFormattedPhoneFax extends React.Component<
  PPMSFormattedPhoneFaxProps,
  PPMSFormattedPhoneFaxState
> {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    if (
      !this.props.required &&
      event.target.value.replace(/[^0-9]/g, "") === ""
    ) {
      let validation = {
        isInvalid: false,
        validationError: "",
      };
      this.props.updatePhoneFax("", validation);
    } else {
      const phoneFax = this.formatPhoneFax(event.target.value);
      const validation = validatePhoneFax(
        phoneFax,
        this.props.numberFormatType
      );
      this.props.updatePhoneFax(phoneFax, validation);
    }
  };
  formatPhoneFax = (value) => {
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
  render() {
    return (
      <>
        <div className={"tablet:grid-col-4"}>
          <PPMSInput
            inputType={"tel"}
            maxLength={this.props.maxLength}
            minLength={1}
            value={this.props.phoneFax}
            label={`${this.props.numberFormatType} Number`}
            labelBold={this.props.labelBold}
            name={this.props.id}
            id={this.props.id}
            isValid={this.props.isValid}
            isInvalid={this.props.isInvalid}
            onChange={(event) =>
              this.props.onChangePhoneFax(
                this.formatPhoneFax(event.target.value)
              )
            }
            onBlur={this.handleChange}
            hint={`${this.props.numberFormatType} Limit: 10 digits`}
            placeHolder={" "}
            validationMessage={this.props.validationMessage}
            isRequired={this.props.required}
            isDisabled={this.props.disabled}
          />
        </div>
      </>
    );
  }
}
