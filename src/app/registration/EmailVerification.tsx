import React from "react";
import { Form } from "react-bootstrap";
import { UserApiService } from "../../api-kit/user/user-api.service";
import { MdEmail } from "react-icons/md";
import { PPMSAlert } from "../../ui-kit/components/common/PPMS-alert";
import { PPMSInput } from "../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { validateEmail } from "../../ui-kit/components/validations/FieldValidations";
import { Paths } from "../Router";

interface State {
  isFormValidated: boolean;
  isEmailInvalid: boolean;
  isEmailValid: boolean;
  showErrorAlert: boolean;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  emailValue: string;
  verificationButtonLabel: string;
  validationMessage: string;
  verificationErrorMessage: string;
}

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}

export class EmailVerification extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isFormValidated: false,
      emailValue: "",
      isEmailInvalid: false,
      isEmailValid: false,
      showErrorAlert: false,
      isSubmitDisabled: true,
      isSubmitLoading: false,
      validationMessage: "Email Address is Required.",
      verificationErrorMessage: "",
      verificationButtonLabel: "Send Verification Code",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  private userApiService: UserApiService = new UserApiService();
  handleChange = (event: any) => {
    this.setState({
      isSubmitDisabled: true,
      emailValue: event.target.value,
    });
    const validation = validateEmail(event.target.value);
    this.handleValidation(event, validation);
  };

  handleValidation(event, validation) {
    const target = event.target;
    this.setValidation(target, validation);
    if (!validation.isInvalid) {
      const data = {
        params: {
          email: target.value,
        },
      };
      this.userApiService
        .checkStatus(data)
        .then((response: any) => {
          if (!response.data.invalid) {
            this.setState({
              isSubmitDisabled: false,
              isEmailInvalid: false,
              isEmailValid: true,
              verificationButtonLabel: "Send Verification Code"
            });
          } else {
            if (response.data.validationError === 'Pending Verification.') {
              this.setState({
                isSubmitDisabled: false,
                isEmailInvalid: false,
                isEmailValid: true,
                verificationButtonLabel: "Resend Verification Code",
              });
            } else {
              this.setState({
                isSubmitDisabled: true,
                isEmailInvalid: true,
                isEmailValid: false,
                validationMessage: response.data.validationError,
              });
            }
          }
        })
        .catch((error) => {
          this.setValidation(target, error.data);
        });
    }
  }

  setValidation(target, data: any) {
    this.setState({
      isEmailInvalid: data.isInvalid,
      isEmailValid: !data.isInvalid,
      validationMessage: data.validationError,
    });
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.setState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const data = {
        params: {
          email: this.state.emailValue,
        },
      };
      this.userApiService
        .generateVerificationCode(data)
        .then((response: any) => {
          this.setState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          this.props.history.push({
            pathname: `${Paths.verifyUser}`,
            search: "",
            state: { email: this.state.emailValue },
          });
        })
        .catch((error: any) => {
          this.setState({
            verificationErrorMessage: error.data.status,
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
        });
    }
    this.setState({
      isFormValidated: true,
    });
  };

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className="justify-content-md-center grid-row grid-gap-4">
          <h1>Email Verification</h1>
        </div>
        <div className="justify-content-md-center grid-row grid-gap-4">
          <img
            src={require("../../assets/images/registrationStep1.PNG")}
            alt="User Registration - Step 1"
          />
        </div>
        <PPMSAlert
          show={true}
          alertBody={"To register, we must first verify your email address."}
          alertClassName={"email-verification-body"}
          alertVariant={"primary"}
          alertKey={"email-verification"}
          id={"email-verification-alert"}
        />
        <PPMSAlert
          show={this.state.showErrorAlert}
          alertBody={
            this.state.verificationErrorMessage || " Error submitting request."
          }
          alertClassName={"email-verification-error"}
          alertVariant={"danger"}
          alertKey={"email-verification-error"}
          id={"email-verification-error-alert"}
        />
        {this.state.showErrorAlert && <hr />}
        <Form
          noValidate
          validated={this.state.isFormValidated}
          onSubmit={this.handleSubmit}
        >
          <div className={"grid-row"}>
            <div className={"tablet:grid-col-4"}>
            <PPMSInput
              inputType={"email"}
              id={"registrationEmail"}
              icon={<MdEmail id="verify-email-icon" />}
              placeHolder={"email@address.gov"}
              label={"Email Address"}
              onChange={this.handleChange}
              value={this.state.emailValue}
              className={"email-verification"}
              hint={"Must be .gov or .mil"}
              validationMessage={this.state.validationMessage}
              isInvalid={this.state.isEmailInvalid}
              isValid={this.state.isEmailValid}
              isRequired={true}
              isDisabled={false}
              minLength={5}
              maxLength={50}
            />
            </div>
          </div>
          <div className="justify-content-md-center grid-row grid-gap-4">
            <div className={"grid-col margin-top-3"}>
              <PPMSButton
                variant={"primary"}
                type={"submit"}
                value={"submit"}
                label={this.state.verificationButtonLabel}
                isDisabled={this.state.isSubmitDisabled}
                isLoading={this.state.isSubmitLoading}
                id={"submit"}
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
