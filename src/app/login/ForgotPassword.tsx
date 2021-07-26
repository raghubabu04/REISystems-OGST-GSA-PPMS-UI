import React from "react";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { UserApiService } from "../../api-kit/user/user-api.service";
import { PPMSEmail } from "../../ui-kit/components/PPMS-email";
import { isFormSubmitted } from "../../service/validation.service";
import { AuthApiService } from "../../api-kit/auth/auth-api.service";
import { PPMSAlert } from "../../ui-kit/components/common/PPMS-alert";
import { PPMSInput } from "../../ui-kit/components/common/input/PPMS-input";
import { VerifyOtpDTO } from "../models/VerifyOtpDTO";
import { PPMSPassword } from "../../ui-kit/components/PPMS-password";
import { ResetPasswordDTO } from "../models/ResetPasswordDTO";
import { Paths } from "../Router";
import PPMSLabel from "../../ui-kit/components/common/form/PPMS-label";

export interface ForgotPasswordProps {
  history: any;
}

export interface ForgotPasswordState {
  oktaUserId: string;
  factorId: string;
  email: string;
  isEmailInvalid: boolean;
  emailValidationMessage: string;
  otp?: string;
  isOtpInvalid?: boolean;
  otpValidationMessage?: string;
  securityQuestion: string;
  securityAnswer: string;
  isSecurityAnswerInvalid: boolean;
  securityAnswerValidationMessage: string;
  newPassword: string;
  confirmNewPassword: string;
  page: number;
  showErrorAlert?: boolean;
  FormErrorMessage?: string;
}

const Banner = (props) => {
  return (
    <>
      <div className="login-banner">
        <div className="login-banner-body">
          <span>
            This is a{" "}
            <strong>
              U.S. General Services Administration Federal Government
            </strong>
            computer system that is <strong>FOR OFFICIAL USE ONLY</strong>. This
            system is subject to monitoring. Individuals found performing
            unauthorized activities are subject to disciplinary action including
            criminal prosecution.
          </span>
        </div>
      </div>
    </>
  );
};

export class ForgotPassword extends React.Component<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  private userApiService: UserApiService = new UserApiService();
  private authApiService: AuthApiService = new AuthApiService();

  constructor(props: ForgotPasswordProps) {
    super(props);
    this.state = {
      oktaUserId: "",
      factorId: "",
      email: "",
      isEmailInvalid: false,
      emailValidationMessage: "",
      securityQuestion: "",
      securityAnswer: "",
      isSecurityAnswerInvalid: false,
      securityAnswerValidationMessage: "",
      newPassword: "",
      confirmNewPassword: "",
      page: 1,
      showErrorAlert: false,
      FormErrorMessage: "",
    } as ForgotPasswordState;
  }

  componentWillMount() {}

  componentWillUnmount() {
    isFormSubmitted.next(false);
  }

  handleEmailChange = (value: any, validation: any) => {
    this.setState({
      email: value,
      isEmailInvalid: validation === undefined ? true : validation.isInvalid,
      emailValidationMessage:
        validation === undefined
          ? "Email is Required."
          : validation.validationError,
    });
    if (validation !== undefined && !validation.isInvalid) {
      this.userApiService
        .verifyEmailExists({ params: { email: value } })
        .then((response) => {
          if (!response.data.invalid) {
            this.setState({
              isEmailInvalid: true,
              emailValidationMessage: "Email address does not exist",
            });
          } else {
            this.setState({
              isEmailInvalid: false,
              emailValidationMessage: "",
            });
          }
        });
    }
  };

  handleOTPChange = (value: any) => {
    const input = value.replace(/[^0-9]/g, "").substring(0, 6);
    this.setState({
      otp: input,
      isOtpInvalid: false,
      otpValidationMessage: "",
    });
  };

  handleSecurityAnswerChange = (value: any) => {
    this.setState({
      securityAnswer: value,
      isSecurityAnswerInvalid: false,
      securityAnswerValidationMessage: "",
    });
  };

  render() {
    const handleNext = () => {
      if (this.state.page === 1) {
        if (!this.state.isEmailInvalid) {
          this.userApiService
            .getOktaUserId(this.state.email)
            .then((response) => {
              this.setState({
                oktaUserId: response.data,
              });
              this.authApiService
                .checkSendOTP(this.state.oktaUserId)
                .then((resp) => {
                  if (resp.data.length === 2) {
                    this.userApiService
                      .getSecurityQuestion(this.state.email)
                      .then((r) => {
                        this.setState({
                          securityQuestion: r.data,
                          page: 3,
                        });
                      })
                      .catch(() => {
                        this.setState({
                          showErrorAlert: true,
                        });
                      });
                  } else if (resp.data.length === 4) {
                    this.setState({
                      factorId: resp.data[3],
                      page: 2,
                    });
                  }
                })
                .catch((error) => {
                  if (error.status === 500) {
                    this.setState({
                      showErrorAlert: true,
                      FormErrorMessage:
                        "Email address does not exist in the system.",
                    });
                  }
                });
            });
        }
      } else if (this.state.page === 2) {
        const data = {
          oktaUserId: this.state.oktaUserId,
          factorId: this.state.factorId,
          otp: this.state.otp,
        } as VerifyOtpDTO;
        this.authApiService
          .verifyOTP(data)
          .then((response) => {
            if (response.status === 200) {
              this.userApiService
                .getSecurityQuestion(this.state.email)
                .then((r) => {
                  this.setState({
                    securityQuestion: r.data,
                    page: 3,
                  });
                })
                .catch(() => {
                  this.setState({
                    showErrorAlert: true,
                  });
                });
            }
          })
          .catch((e) => {
            if (e.status === 403) {
              this.setState({
                isOtpInvalid: true,
                otpValidationMessage: "Invalid OTP entered",
              });
            }
          });
      } else if (this.state.page === 3) {
        const data = {
          oktaUserId: this.state.oktaUserId,
          password: this.state.newPassword,
          securityAnswer: this.state.securityAnswer,
        } as ResetPasswordDTO;
        this.authApiService
          .updateForgotPassword(data)
          .then(() => {
            this.props.history.push({
              pathname: `${Paths.login}`,
            });
          })
          .catch((e) => {
            if (e.status === 400) {
              this.setState({
                showErrorAlert: true,
                FormErrorMessage:
                  " New password cannot be same as old password.",
              });
            } else if (e.status === 403) {
              this.setState({
                showErrorAlert: true,
                FormErrorMessage: "",
                isSecurityAnswerInvalid: true,
                securityAnswerValidationMessage: "Incorrect Security Answer",
              });
            } else {
              this.setState({
                showErrorAlert: true,
              });
            }
          });
      } else {
        this.setState({
          showErrorAlert: true,
        });
      }
    };

    let forgotPasswordScreen;
    if (this.state.page === 1) {
      forgotPasswordScreen = (
        <>
          <div className="grid-row">
            <h2>Forgot Password</h2>
          </div>
          <div className={"desktop:grid-col-9"}>
            <PPMSAlert
              id={"form-verification-error-alert"}
              show={this.state.showErrorAlert}
              alertBody={
                this.state.FormErrorMessage || " Error submitting request."
              }
              alertClassName={"form-verification-error"}
              alertVariant={"danger"}
              alertKey={"form-verification-error"}
            />
            {this.state.showErrorAlert && <hr />}
          </div>
          <div className="grid-row grid-gap-4">
            <div className="desktop:grid-col-8">
              <PPMSEmail
                email={this.state.email}
                emailLabel={"Enter your email address"}
                isInvalid={this.state.isEmailInvalid}
                validationMessage={this.state.emailValidationMessage}
                id={"forgot-password-email"}
                required={true}
                onChangeEmail={(event) => {
                  this.setState({
                    email: event.target,
                  });
                }}
                updateEmail={this.handleEmailChange}
                maxLength={52}
              />
            </div>
          </div>
          <br />
          <div className="grid-row">
            <PPMSButton
              className={"next-button"}
              type={"button"}
              label={"Next"}
              onPress={handleNext}
              id={"forgot-password-next"}
            />
          </div>
          <br /> <br />
        </>
      );
    } else if (this.state.page === 2) {
      forgotPasswordScreen = (
        <>
          <div className="grid-row">
            <h2>Forgot Password</h2>
          </div>
          <div className={"desktop:grid-col-9"}>
            <PPMSAlert
              id={"form-verification-error-alert"}
              show={this.state.showErrorAlert}
              alertBody={
                this.state.FormErrorMessage || " Error submitting request."
              }
              alertClassName={"form-verification-error"}
              alertVariant={"danger"}
              alertKey={"form-verification-error"}
            />
            {this.state.showErrorAlert && <hr />}
          </div>
          <div className="grid-row">
            <PPMSInput
              id={"forgot-password-otp"}
              inputType={"text"}
              label={"Please enter the OTP"}
              isRequired={true}
              isDisabled={false}
              isInvalid={this.state.isOtpInvalid}
              validationMessage={this.state.otpValidationMessage}
              onChange={(event) => this.handleOTPChange(event.target.value)}
              value={this.state.otp}
              placeHolder={"Enter OTP"}
              maxLength={6}
            />
          </div>
          <br />
          <div className="grid-row">
            <PPMSButton
              className={"next-button"}
              type={"button"}
              label={"Next"}
              onPress={handleNext}
              id={"forgot-password-next"}
            />
          </div>
          <br /> <br />
        </>
      );
    } else if (this.state.page === 3) {
      forgotPasswordScreen = (
        <>
          <div className="grid-row">
            <h2>Forgot Password</h2>
          </div>
          <div className={"desktop:grid-col-9"}>
            <PPMSAlert
              id={"form-verification-error-alert"}
              show={this.state.showErrorAlert}
              alertBody={
                this.state.FormErrorMessage || " Error submitting request."
              }
              alertClassName={"form-verification-error"}
              alertVariant={"danger"}
              alertKey={"form-verification-error"}
            />
            {this.state.showErrorAlert && <hr />}
          </div>
          <div className="grid-row">
            <div className="desktop:grid-col-12">
              <PPMSLabel htmlFor={"forgot-password-security-answer"}>
                {"Security Question:"} <br />
                <strong>{this.state.securityQuestion}</strong>
              </PPMSLabel>
              <PPMSInput
                id={"forgot-password-security-answer"}
                inputType={"text"}
                label={"Security Answer:"}
                isRequired={true}
                isDisabled={false}
                isInvalid={this.state.isSecurityAnswerInvalid}
                validationMessage={this.state.securityAnswerValidationMessage}
                onChange={(event) =>
                  this.handleSecurityAnswerChange(event.target.value)
                }
                value={this.state.securityAnswer}
              />
            </div>
          </div>
          <br />
          <PPMSPassword
            showPasswordMeter={true}
            id={"forgot-password-new-pass"}
            password={this.state.newPassword}
            label={"New Password"}
            updatePassword={(value: any) => {
              this.setState({ newPassword: value });
            }}
            confirmPassword={this.state.confirmNewPassword}
            updateConfirmPassword={(value: any) => {
              this.setState({ confirmNewPassword: value });
            }}
          />
          <br />
          <div className="grid-row">
            <PPMSButton
              className={"next-button"}
              type={"button"}
              label={"Submit"}
              onPress={handleNext}
              id={"forgot-password-next"}
            />
          </div>
          <br /> <br />
        </>
      );
    }
    return (
      <div>
        <div className="grid-container ui-ppms">
          <div className="grid-row grid-gap-4">
            <Banner {...this.props} />
          </div>

          <div className="margin-top-5 forgot-password">
            {forgotPasswordScreen}
          </div>
        </div>
      </div>
    );
  }
}
