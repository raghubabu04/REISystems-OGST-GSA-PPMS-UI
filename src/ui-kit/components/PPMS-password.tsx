import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import { ProgressBar } from "react-bootstrap";
import {
  validateConfirmPassword,
  validatePassword,
} from "./validations/FieldValidations";
import * as zxcvbn from "zxcvbn";
import { isFormSubmitted } from "../../service/validation.service";

export interface PPMSPasswordProps {
  confirmPassword: string;
  id: string;
  isConfirmPasswordInvalid?: boolean;
  isConfirmPasswordValid?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  password: string;
  passwordMeter?: { score: number; variant: any };
  showPasswordMeter: boolean;
  validationConfirmPasswordMessage?: string;
  validationMessage?: string;
  updatePassword: any;
  updateConfirmPassword: any;
  label: string;
}
export interface PPMSPasswordState {
  confirmPassword: string;
  isConfirmPasswordInvalid: boolean;
  isConfirmPasswordValid: boolean;
  isInvalid: boolean;
  isValid: boolean;
  password: string;
  passwordMeter: { score: number; variant: any };
  validationConfirmPasswordMessage: string;
  validationMessage: string;
}

export class PPMSPassword extends React.Component<
  PPMSPasswordProps,
  PPMSPasswordState
> {
  constructor(props) {
    super(props);
    this.state = {
      confirmPassword: this.props.confirmPassword,
      isConfirmPasswordInvalid: false,
      isConfirmPasswordValid: false,
      isInvalid: false,
      isValid: false,
      password: this.props.password,
      passwordMeter: {score: 0, variant: "danger"},
      validationConfirmPasswordMessage: "Password Confirmation is Required.",
      validationMessage: "Password is Required.",
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(
      this
    );
  }
  private isCurrent = true;
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
  }

  validateForm() {
    this.handlePasswordChange({value: this.state.password});
    this.handlePasswordConfirmChange({value: this.state.confirmPassword});
  }

  componentWillUnmount() {
    this.isCurrent = false;
  }

  handlePasswordChange = ({value}) => {
    let validation = validatePassword(value?.trim());
    this.passwordStrengthMeter(value?.trim());
    this.setState({
      password: value?.trim(),
      isInvalid: validation.isInvalid,
      isValid: !validation.isInvalid,
      validationMessage: validation.validationError,
    });
    this.props.updatePassword(value?.trim());
  };

  passwordStrengthMeter(value) {
    let scorePercentage = ((zxcvbn(value).score + 1) / 5) * 100;
    let variant = "danger";
    if (value.length === 0) {
      scorePercentage = 0;
    } else {
      variant = (function () {
        if (scorePercentage === 20) {
          return "danger";
        } else if (scorePercentage === 40 || scorePercentage === 60) {
          return "warning";
        } else if (scorePercentage === 80) {
          return "info";
        } else if (scorePercentage === 100) {
          return "success";
        }
      })();
    }

    let passwordMeter = {
      score: scorePercentage,
      variant: variant,
    };
    this.setState({
      passwordMeter: passwordMeter,
    });
  }

  handlePasswordConfirmChange = ({value}) => {
    let validation = validateConfirmPassword(
      this.state.password,
      value,
      this.state.isInvalid
    );
    this.setState({
      confirmPassword: value?.trim(),
      isConfirmPasswordInvalid: validation.isInvalid,
      isConfirmPasswordValid: !validation.isInvalid,
      validationConfirmPasswordMessage: validation.validationError,
    });
    this.props.updateConfirmPassword(value?.trim());
  };

  render() {
    return (
      <>
        <PPMSInput
          inputType={"password"}
          id={this.props.id}
          label={this.props.label}
          hint={
            "Password must be between 8 and 16 characters and must contain at least one number, one lower case character, one upper case character and one special character."
          }
          validationMessage={this.state.validationMessage}
          isInvalid={this.state.isInvalid}
          isValid={this.state.isValid}
          isRequired={true}
          value={this.state.password}
          onChange={(event) => this.handlePasswordChange(event.target)}
          maxLength={16}
          minLength={8}
          isDisabled={false}
        />
        {this.props.showPasswordMeter && (
          <>
            <br/>
            <div className={"grid-col"}>
              <ProgressBar
                variant={this.state.passwordMeter.variant}
                now={this.state.passwordMeter.score}
                key={"password-meter"}
              />
            </div>
          </>
        )}
        <PPMSInput
          inputType={"password"}
          id={this.props.id + "-confirm"}
          label={"Confirm " + this.props.label}
          validationMessage={this.state.validationConfirmPasswordMessage}
          isInvalid={this.state.isConfirmPasswordInvalid}
          isValid={this.state.isConfirmPasswordValid}
          isRequired={true}
          value={this.state.confirmPassword}
          onChange={(event) => this.handlePasswordConfirmChange(event.target)}
          maxLength={16}
          minLength={8}
          isDisabled={false}
        />
      </>
    );
  }
}
