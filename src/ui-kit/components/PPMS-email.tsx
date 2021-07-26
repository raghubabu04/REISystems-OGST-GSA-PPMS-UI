import React from "react";
import { ppmsEmailValidation } from "./validations/FieldValidations";
import { PPMSInput } from "./common/input/PPMS-input";

export interface Props {
  disabled?: boolean;
  email: string;
  emailLabel?: string;
  labelBold?: boolean;
  emailMessage?: string;
  placeHolder?: string;
  id: string;
  name?: string;
  validationMessage?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  isFormValidated?: boolean;
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  required: boolean;
  updateEmail?: any;
  onChangeEmail: any;
  maxLength: number;
  ariaLabel?: string;
}
export interface State {}

export class PPMSEmail extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange = (event) => {
    this.validateEmail(event.target.value);
  };

  onChangeEmail = (event) => {
    this.props.onChangeEmail(event.target.value);
  };

  validateEmail = (value) => {
    let validation = ppmsEmailValidation(value, this.props.required);
    this.props.updateEmail(value ? value : "", validation);
  };

  render() {
    return (
      <>
        <PPMSInput
          className={"email-registration"}
          isDisabled={this.props.disabled ? this.props.disabled : false}
          id={this.props.id + "-email"}
          name={this.props.name ? this.props.name : this.props.id + "-email"}
          isInvalid={this.props.isInvalid}
          isValid={this.props.isValid}
          label={this.props.emailLabel}
          labelBold={this.props.labelBold}
          hint={this.props.emailMessage}
          onChange={(event) => {
            this.onChangeEmail(event);
          }}
          onBlur={(event) => this.handleEmailChange(event)}
          placeHolder={this.props.placeHolder}
          isRequired={this.props.required}
          inputType={"email"}
          validationMessage={
            (this.props.validationMessage === "" && !this.props.isInvalid) ||
            this.props.validationMessage !== ""
              ? this.props.validationMessage
              : "Email is Required."
          }
          value={this.props.email}
          maxLength={this.props.maxLength}
          minLength={5}
          ariaLabel={this.props.ariaLabel}
        />
      </>
    );
  }
}
