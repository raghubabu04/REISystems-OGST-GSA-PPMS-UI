import React from "react";
import { Form } from "react-bootstrap";
import { UserApiService } from "../../api-kit/user/user-api.service";
import { FaQrcode } from "react-icons/fa";
import { PPMSAlert } from "../../ui-kit/components/common/PPMS-alert";
import { PPMSInput } from "../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { validateVerificationCode } from "../../ui-kit/components/validations/FieldValidations";
import { Paths } from "../Router";

interface State {
  isFormValidated: boolean;
  isVerificationCodeInvalid: boolean;
  isVerificationCodeValid: boolean;
  showErrorAlert: boolean;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  isResendDisabled: boolean;
  isResendLoading: boolean;
  verificationCodeValue: string;
  validationMessage: string;
  verificationErrorMessage: string;
}
interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}
export class VerifyUser extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isFormValidated: false,
      verificationCodeValue: "",
      isVerificationCodeInvalid: false,
      isVerificationCodeValid: false,
      showErrorAlert: false,
      isSubmitDisabled: true,
      isSubmitLoading: false,
      isResendDisabled: false,
      isResendLoading: false,
      validationMessage: "is Required",
      verificationErrorMessage: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  private userApiService: UserApiService = new UserApiService();
  handleChange = (event: any) => {
    this.setState({
      isSubmitDisabled: true,
      verificationCodeValue: event.target.value,
    });
    const validation = validateVerificationCode(event.target.value);
    this.handleValidation(event, validation);
  };

  handleClick = (event: any) => {};

  handleResendVerification = (event: any) => {
    this.setState({
      isResendLoading: true,
      isResendDisabled: true,
      isSubmitDisabled: true,
    });
    const data = {
      params: {
        email: this.props.location.state.email,
      },
    };
    this.userApiService
      .generateVerificationCode(data)
      .then((response: any) => {
        this.setState({
          isResendLoading: false,
          isResendDisabled: false,
          isSubmitDisabled: false,
        });
      })
      .catch((error: any) => {
        console.log(error);
        this.setState({
          verificationErrorMessage: error.data.status,
          showErrorAlert: true,
          isResendLoading: false,
          isResendDisabled: false,
          isSubmitDisabled: false,
        });
      });
  };

  handleValidation(event, validation) {
    this.setState({
      isVerificationCodeInvalid: validation.isInvalid,
      isVerificationCodeValid: !validation.isInvalid,
      validationMessage: validation.validationError,
    });
    if (!validation.isInvalid) {
      this.setState({ isSubmitDisabled: false });
    }
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.setState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
      isResendDisabled: true,
    });
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const data = {
        body: {
          verificationCode: this.state.verificationCodeValue,
          email: this.props.location.state.email,
        },
      };
      console.log(this.props.location.state.email);
      this.userApiService
        .validateVerificationCode(data)
        .then((response: any) => {
          this.setState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
            isResendDisabled: false,
          });
          this.props.history.push({
            pathname: `${Paths.userRegistration}`,
            search: "",
            state: { email: response.data.email },
          });
        })
        .catch((error: any) => {
          this.setState({
            verificationErrorMessage: error.data.status,
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
            isResendDisabled: false,
          });
        });
    }
    this.setState({ isFormValidated: true });
  };

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className="justify-content-md-center grid-row grid-gap-4">
          <h1>Verification Code</h1>
        </div>
        <div className="justify-content-md-center grid-row grid-gap-4">
          <img
            src={require("../../assets/images/registrationStep2.PNG")}
            alt="User Registration - Step 2"
          />
        </div>
        <PPMSAlert
          id={"verification-code-alert"}
          show={true}
          alertBody={"Provide the verification code to continue registration."}
          alertClassName={"verification-code-body"}
          alertVariant={"primary"}
          alertKey={"verification-code"}
        />
        <PPMSAlert
          id={"verification-code-error-alert"}
          show={this.state.showErrorAlert}
          alertBody={this.state.verificationErrorMessage || " Error Verifying."}
          alertClassName={"form-verification-error"}
          alertVariant={"danger"}
          alertKey={"verification-code-error"}
        />
        {this.state.showErrorAlert && <hr />}
        <Form
          noValidate
          validated={this.state.isFormValidated}
          onSubmit={this.handleSubmit}
        >
          <div className={"grid-row"}>
          <div className={"tablet:grid-col-2"}>
            <PPMSInput
              inputType={"text"}
              id={"verification-code-input"}
              icon={<FaQrcode id="verification-code-icon" />}
              placeHolder={"ex. 123456"}
              label={"Verification Code"}
              onChange={this.handleChange}
              value={this.state.verificationCodeValue}
              className={"verification-code"}
              hint={
                "Please enter the verification code that you got from your email."
              }
              validationMessage={this.state.validationMessage}
              isInvalid={this.state.isVerificationCodeInvalid}
              isValid={this.state.isVerificationCodeValid}
              isRequired={true}
              isDisabled={false}
              minLength={5}
              maxLength={50}
            />
            </div>
          </div>
          <div className="justify-content-md-center grid-row grid-gap-4 margin-top-3">
            <div className={"grid-row grid-gap-2 grid-col"}>
              <div className={"grid-col-auto"}>
                <PPMSButton
                  variant={"outline-primary"}
                  type={"button"}
                  value={"resend-code"}
                  label={"Resend Verification Code"}
                  onPress={this.handleResendVerification}
                  isDisabled={this.state.isResendDisabled}
                  isLoading={this.state.isResendLoading}
                  id={"resend-code"}
                />
              </div>
              <div className={"grid-col-auto"}>
                <PPMSButton
                  variant={"primary"}
                  type={"submit"}
                  value={"submit"}
                  label={"Submit"}
                  onPress={this.handleClick}
                  isDisabled={this.state.isSubmitDisabled}
                  isLoading={this.state.isSubmitLoading}
                  id={"submit"}
                />
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
