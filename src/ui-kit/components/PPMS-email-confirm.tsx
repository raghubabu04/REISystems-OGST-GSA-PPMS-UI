import React from "react";
import {validateConfirmEmailAddress, validateEmailAddress,} from "./validations/FieldValidations";
import {PPMSInput} from "./common/input/PPMS-input";
import {UserApiService} from "../../api-kit/user/user-api.service";
import {ErrorMessages} from "../../constants/Constants";
import {isFormSubmitted} from "../../service/validation.service";
export interface Props {
  confirmDisabled?: boolean;
  confirmEmail: string;
  confirmEmailLabel?: string;
  confirmEmailMessage?: string;
  confirmEmailValidationMessage?: string;
  disabled?: boolean;
  email: string;
  emailLabel?: string;
  emailMessage?: string;
  emailValidationMessage?: string;
  id: string;
  labelBold?: boolean;
  isConfirmEmailInvalid?: boolean;
  isConfirmEmailValid?: boolean;
  isEmailInvalid?: boolean;
  isEmailValid?: boolean;
  isFormValidated?: boolean;
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  required: boolean;
  validateExistingUser?: boolean;
  updateEmail: any;
  updateConfirmEmail: any;
  showEmailConfirm?: boolean;
  currentUserEmailAddress?: string;
}
export interface State {
}
export class PPMSEmailConfirm extends React.Component<Props, State> {
  userApiService = new UserApiService();
  constructor(props) {
    super(props);
    this.state = {};
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleConfirmEmailChange = this.handleConfirmEmailChange.bind(this);
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
    this.handleEmailChange({ value: this.props.email ? this.props.email : "" });
    this.handleConfirmEmailChange({
      value: this.props.confirmEmail ? this.props.confirmEmail : "",
    });
  }
  componentWillUnmount() {
    this.isCurrent = false;
  }
  handleEmailChange = ({ value }) => {
    // Not Required & Empty
    let emailValidation = {
      isInvalid: false,
      validationError: "",
      confirmDisabled: false,
    };
    let confirmEmailValidation = {
      isInvalid: false,
      validationError: "",
    };
    if (!this.props.required && value === "") {
      this.props.updateEmail("", emailValidation);
      this.props.updateConfirmEmail("", confirmEmailValidation);
    } else {
      // Required & Empty
      if (value === "") {
        emailValidation.confirmDisabled = true;
        emailValidation.validationError = "Email is Required";
        emailValidation.isInvalid = true;
        this.props.updateEmail("", emailValidation);
        this.props.updateConfirmEmail("", confirmEmailValidation);
      } else {
        // Required & Not Empty
        let validation = validateEmailAddress(value);
        if (
          (this.props.validateExistingUser
            ? this.props.validateExistingUser
            : false) &&
          !validation.isInvalid
        ) {
          //check the currentemailaddress
          if (this.props.currentUserEmailAddress !== value) {
            this.verifyEmailExists(value);
          } else {
            this.props.updateEmail(value, validation);
            this.props.updateConfirmEmail(this.props.confirmEmail, validation);
          }
        } else {
          emailValidation.isInvalid = validation.isInvalid;
          emailValidation.validationError = validation.validationError;
          emailValidation.confirmDisabled = validation.isInvalid;
          this.props.updateEmail(value, emailValidation);
          // email is valid
          if (!validation.isInvalid) {
            let confirmValidation = validateConfirmEmailAddress(
              value,
              this.props.confirmEmail,
              !validation.isInvalid
            );
            confirmEmailValidation.validationError = confirmValidation.validationError;
            confirmEmailValidation.isInvalid = confirmValidation.isInvalid;
            this.props.updateConfirmEmail(
              this.props.confirmEmail,
              confirmEmailValidation
            );
          } else {
            confirmEmailValidation.isInvalid = true;
            confirmEmailValidation.validationError = "";
            this.props.updateConfirmEmail(
              this.props.confirmEmail,
              confirmEmailValidation
            );
          }
          // this.props.updateEmail(value,emailValidation);
          if (this.props.confirmEmail !== "")
            this.props.updateConfirmEmail(
              this.props.confirmEmail,
              confirmEmailValidation
            );
        }
      }
    }
  };
  handleConfirmEmailChange = ({ value }) => {
    const validation = validateConfirmEmailAddress(
      this.props.email,
      value,
      this.props.isEmailValid
    );
    let confirmEmailValidation = {
      isInvalid: false,
      validationError: "",
    };
    confirmEmailValidation.isInvalid = validation.isInvalid;
    confirmEmailValidation.validationError = validation.validationError;
    this.props.updateConfirmEmail(value, confirmEmailValidation);
  };
  verifyEmailExists(email) {
    const self = this;
    let validation;
    //self.props.updateEmail(email);
    this.userApiService
      .verifyEmailExists({ params: { email: email } })
      .then((response) => {
        validation = {
          isInvalid: response.data.invalid,
          validationError: response.data.validationError,
        };
      })
      .catch((error) => {
        validation = {
          isInvalid: error.data && error.data.invalid,
          validationError:
            error.data && error.data.validationError
              ? error.data.validationError
              : ErrorMessages.REQUEST_PROCESSING_ERROR,
        };
      })
      .finally(() => {
        const isEmailValid = !(validation && validation.isInvalid);
        // self.setState({
        //   confirmDisabled: validation && validation.isInvalid,
        //   email: email,
        //   emailValidationMessage: validation && validation.validationError,
        //   isEmailInvalid: !isEmailValid,
        //   isEmailValid: isEmailValid,
        // });
        let emailValidation = {
          isInvalid: !isEmailValid,
          validationError: validation.validationError,
          confirmDisabled: validation.isInvalid,
        };
        self.props.updateEmail(email, emailValidation);
        //self.props.updateConfirmEmail(this.state.confirmEmail);
        // email is valid
        if (isEmailValid) {
          validation = validateConfirmEmailAddress(
            email,
            self.props.confirmEmail,
            isEmailValid
          );
          self.props.updateConfirmEmail(self.props.confirmEmail, validation);
        } else {
          self.props.updateConfirmEmail(self.props.confirmEmail, {
            isInvalid: true,
            validationError: "",
          });
        }
      });
  }
  render() {
    return (
      <>
        <div className="grid-row">
          <div className={"grid-col-12"}>
            <PPMSInput
              className={"email-registration"}
              isDisabled={this.props.disabled ? this.props.disabled : false}
              id={this.props.id + "-email"}
              name={this.props.id + "-email"}
              isInvalid={this.props.isEmailInvalid}
              isValid={this.props.isEmailValid}
              label={
                this.props.emailLabel ? this.props.emailLabel : "Email Address"
              }
              labelBold={this.props.labelBold}
              message={this.props.emailMessage}
              onChange={(event) => this.handleEmailChange(event.target)}
              placeHolder={"email@domain.gov"}
              isRequired={this.props.required}
              inputType={"email"}
              validationMessage={this.props.emailValidationMessage}
              value={this.props.email}
              minLength={5}
              maxLength={50}
            />
          </div>
          {this.props.showEmailConfirm && (
            <div className={"grid-col-12"}>
              <PPMSInput
                // onBlur={this.handleConfirmEmailChange}
                className={"email-registration"}
                isDisabled={false}
                id={this.props.id + "-confirmEmail"}
                name={this.props.id + "-confirmEmail"}
                isInvalid={this.props.isConfirmEmailInvalid}
                isValid={this.props.isConfirmEmailValid}
                label={
                  this.props.confirmEmailLabel
                    ? this.props.confirmEmailLabel
                    : "Confirm Email Address"
                }
                labelBold={this.props.labelBold}
                message={this.props.confirmEmailMessage}
                onChange={(event) =>
                  this.handleConfirmEmailChange(event.target)
                }
                placeHolder={"email@domain.gov"}
                isRequired={this.props.required}
                inputType={"email"}
                validationMessage={this.props.confirmEmailValidationMessage}
                value={this.props.confirmEmail}
                minLength={5}
                maxLength={50}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}