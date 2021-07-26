import React from "react";
import { Form } from "react-bootstrap";
import { PPMSFirstNameLastName } from "../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSPhoneNumber } from "../../ui-kit/components/PPMS-phone-number";
import { PPMSPassword } from "../../ui-kit/components/PPMS-password";
import { PPMSEmailReadOnly } from "../../ui-kit/components/PPMS-email-read-only";
import { PPMSZip } from "../../ui-kit/components/PPMS-zip";
import { PPMSState } from "../../ui-kit/components/PPMS-state";
import { PPMSAacAgency } from "../../ui-kit/components/PPMS-aac-agency";
import { PPMSSubmit } from "../../ui-kit/components/PPMS-submit";
import { PPMSSecurityQuestion } from "../../ui-kit/components/PPMS-security-question";
import { UserApiService } from "../../api-kit/user/user-api.service";
import { PPMSAlert } from "../../ui-kit/components/common/PPMS-alert";
import { Paths } from "../Router";
import { isFormSubmitted } from "../../service/validation.service";
import {CommonApiService} from "../../api-kit/common/common-api.service";
import {
  validatePhoneFax,
  zipInvalidStateMessage,
  validateZipState
} from "../../ui-kit/components/validations/FieldValidations";

interface State {
  showErrorAlert: boolean;
  registrationErrorMessage: string;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  isFormValidated: boolean;
  aacCode: string;
  agencyBureau: string;
  firstName: string;
  isFirstNameInvalid: boolean;
  isFirstNameValid: boolean;
  middleName: string;
  lastName: string;
  isLastNameInvalid?: boolean;
  isLastNameValid?: boolean;
  phoneNumber: string;
  phoneExtension: string;
  isPhoneInvalid: boolean;
  isPhoneValid: boolean;
  phoneValidationMessage: string;
  state: string;
  stateFilter: string;
  stateIsInvalid: boolean;
  stateIsValid: boolean;
  stateValidationMessage: string;
  zip: string;
  zipIsValid: boolean;
  zipIsInvalid: boolean;
  zipValidationError: string;
  zipExtension: string;
  password: string;
  confirmPassword: string;
  question: string;
  answer: string;
  email: string;
  aacCodes: any[];
}
interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}
export class Registration extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showErrorAlert: false,
      registrationErrorMessage: "",
      isSubmitLoading: false,
      isSubmitDisabled: false,
      isFormValidated: false,
      aacCode: "",
      agencyBureau: "",
      firstName: "",
      isFirstNameInvalid: false,
      isFirstNameValid: true,
      middleName: "",
      lastName: "",
      isLastNameInvalid: false,
      isLastNameValid: true,
      phoneNumber: "",
      phoneExtension: "",
      isPhoneInvalid: false,
      isPhoneValid: true,
      phoneValidationMessage: "",
      state: "",
      stateFilter: "",
      stateIsInvalid: false,
      stateIsValid: true,
      stateValidationMessage: "",
      zip: "",
      zipIsValid: false,
      zipIsInvalid: false,
      zipValidationError: "",
      zipExtension: "",
      password: "",
      confirmPassword: "",
      question: "",
      answer: "",
      email: "",
      aacCodes: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.emailAddress =
      this.props.location.state && this.props.location.state.email
        ? this.props.location.state.email
        : "";
  }
  private readonly emailAddress;
  private userApiService: UserApiService = new UserApiService();
  private commonApiService = new CommonApiService();
  private isCurrent = true;
  componentDidMount() {
    this.setState({
      email: this.emailAddress,
    });
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
  }

  componentWillUnmount() {
    isFormSubmitted.next(false);
    this.isCurrent = false;
  }
  validateForm() {
    this.handleFirstName(this.state.firstName);
    this.handleLastName(this.state.lastName);
    const validation = validatePhoneFax(this.state.phoneNumber);
    this.handlePhoneNumber(this.state.phoneNumber, validation);
  }
  handleSubmit = (event: any) => {
    isFormSubmitted.next(true);
    event.preventDefault();
    this.setState({
      isSubmitLoading: true,
      isSubmitDisabled: true,
    });
    const form = event.currentTarget;

    if (
      form.checkValidity() === false ||
      this.emailAddress.length < 3 ||
      !this.state.state
    ) {
      event.stopPropagation();
      this.setState({
        isSubmitLoading: false,
        isSubmitDisabled: false,
      });
    } else {
      const data = {
        body: {
          aac: this.state.aacCode,
          agencyBureauCd: this.state.agencyBureau,
          firstName: this.state.firstName,
          middleName: this.state.middleName,
          lastName: this.state.lastName,
          emailAddress: this.emailAddress,
          phoneNumber: this.state.phoneNumber.replace(/[^0-9]/g, ""),
          phoneExt: this.state.phoneExtension.replace(/[^0-9]/g, ""),
          zipCode: this.state.zip,
          stateCode: this.state.state,
          securityQuestion: this.state.question,
          securityAnswer: this.state.answer,
          password: this.state.password,
        },
      };
      this.userApiService
        .registerUser(data)
        .then((response: any) => {
          this.setState({
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
          this.props.history.push({
            pathname: `${Paths.registrationSuccessful}`,
            search: "",
            state: "",
          });
          isFormSubmitted.next(false);
        })
        .catch((error: any) => {
          this.setState({
            registrationErrorMessage: error.data?.message,
            showErrorAlert: true,
            isSubmitLoading: false,
            isSubmitDisabled: false,
          });
        });
    }
  };

  handleFirstName = (value) => {
    if (value.trim().length > 0) {
      this.setState({
        firstName: value,
        isFirstNameInvalid: false,
        isFirstNameValid: true,
      });
    } else {
      this.setState({
        firstName: value,
        isFirstNameInvalid: true,
        isFirstNameValid: false,
      });
    }
  };

  handleLastName = (value) => {
    if (value.trim().length > 0) {
      this.setState({
        lastName: value,
        isLastNameInvalid: false,
        isLastNameValid: true,
      });
    } else {
      this.setState({
        lastName: value,
        isLastNameInvalid: true,
        isLastNameValid: false,
      });
    }
  };

  handlePhoneNumber = (value, validation) => {
    if (value === "") {
      this.setState({
        phoneNumber: value,
        isPhoneInvalid: validation.isInvalid,
        isPhoneValid: !validation.isInvalid,
        phoneExtension: "",
        phoneValidationMessage: validation.validationError
      });
    } else {
      this.setState({
        phoneNumber: value,
        isPhoneInvalid: validation.isInvalid,
        isPhoneValid: !validation.isInvalid,
        phoneValidationMessage: validation.validationError
      });
    }
  };

  handleState = (stateCode, validation) => {
    this.setState({
      state: stateCode,
      stateIsInvalid: validation.isInvalid,
      stateIsValid: !validation.isInvalid,
      stateValidationMessage: validation.validationError,
    });
  };

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className="justify-content-md-center grid-row grid-gap-4">
          <h1>User Registration</h1>
        </div>
        <PPMSAlert
          id={"form-verification-error"}
          show={this.state.showErrorAlert}
          alertBody={
            this.state.registrationErrorMessage || " Error submitting request."
          }
          alertClassName={"form-verification-error"}
          alertVariant={"danger"}
          alertKey={"form-verification-error"}
        />
        {this.state.showErrorAlert && <hr />}
        <Form
          noValidate
          validated={this.state.isFormValidated}
          onSubmit={this.handleSubmit}
        >
          <div className="form-section-header grid-row grid-gap-4">
            Agency / Bureau Information
          </div>
          <div className="form-section-content grid-row grid-gap-4">
            <PPMSAacAgency
              aacLabel={"Activity Address Code"}
              aacCode={this.state.aacCode}
              agencyBureau={this.state.agencyBureau}
              updateAACCode={(value: any) => {
                this.setState({ aacCode: value });
              }}
              updateAgencyBureau={(value: any) => {
                this.setState({ agencyBureau: value });
              }}
              required={true}
              aacCodes={this.state.aacCodes}
            />
          </div>
          <div className="form-section-header grid-row grid-gap-4">
            User Information
          </div>
          <div className="form-section-content grid-row grid-gap-4">
            <div className={"grid-row grid-gap-4"}>
              <PPMSFirstNameLastName
                id={"registration-first-middle-last-name"}
                maxLength={14}
                maxMiddleLength={1}
                required={true}
                firstName={this.state.firstName}
                onChangeFirstName={(value)=>{this.setState({firstName:value})}}
                updateFirstName={this.handleFirstName}
                middleName={this.state.middleName}
                showMiddleName={true}
                onChangeMiddleName={(value)=>{this.setState({middleName:value})}}
                updateMiddleName={(value: any) => {
                  this.setState({ middleName: value });
                }}
                lastName={this.state.lastName}
                onChangeLastName={(value)=>{this.setState({lastName:value})}}
                updateLastName={this.handleLastName}
                isFirstNameInvalid={this.state.isFirstNameInvalid}
                isFirstNameValid={this.state.isFirstNameValid}
                isLastNameInvalid={this.state.isLastNameInvalid}
                isLastNameValid={this.state.isLastNameValid}
                validationFirstMessage={"First Name is Required."}
                validationLastMessage={"Last Name is Required."}
              />
            </div>
            <div className={"grid-row grid-gap-4"}>
              <PPMSPhoneNumber
                id={"phone-number"}
                required={true}
                showExtension={true}
                disabled={false}
                phone={this.state.phoneNumber}
                updatePhoneNumber={this.handlePhoneNumber}
                extension={this.state.phoneExtension}
                onChangePhoneNumber={(value:any) => this.setState({phoneNumber: value})}
                onChangePhoneExt={(value:any)=> this.setState({phoneExtension:value})}
                updatePhoneExtension={(value: any) => {
                  this.setState({
                    phoneExtension: value,
                    isPhoneInvalid: false,
                    isPhoneValid: true,
                  });
                }}
                maxLength={10}
                maxLengthExtension={8}
                isInvalid={this.state.isPhoneInvalid}
                isValid={this.state.isPhoneValid}
                validationMessage={this.state.phoneValidationMessage}
              />
            </div>
            <div className={"grid-row grid-gap-4"}>
	            <PPMSEmailReadOnly
	              required={true}
	              emailAddress={this.emailAddress}
	            />
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-3"}>
                <PPMSState
                  id={"registration-state"}
                  label={"Location State"}
                  required={true}
                  selectedState={this.state.state}
                  updateLocationState={this.handleState}
                  isInvalid={this.state.stateIsInvalid}
                  isValid={this.state.stateIsValid}
                  validationMessage={this.state.stateValidationMessage}
                />
              </div>
              <div className={"grid-col"}>
                <PPMSZip
                  id={"registration-zip"}
                  isRequired={true}
                  disabled={false}
                  zip={this.state.zip}
                  isZipValid={this.state.zipIsValid}
                  isZipInvalid={this.state.zipIsInvalid}
                  onChangeZip={(value: any) => {
                    this.setState({ zip: value });
                  }}
                  updateZip={(
                    value: any,
                    inValid: boolean,
                    valid: boolean,
                    validationError: any
                  ) => {
                    this.setState({
                      zip: value,
                      zipIsInvalid: inValid,
                      zipIsValid: valid,
                      zipValidationError: validationError
                    });
                    if(!inValid || this.state.zipValidationError === zipInvalidStateMessage){
                      this.commonApiService
                        .getZipCode(value)
                        .then((response: any) => {
                          let errorMessage = validateZipState(response.data, this.state.state);
                          this.setState({
                            zipIsInvalid: errorMessage.length !== 0,
                            zipIsValid: errorMessage.length === 0,
                            zipValidationError: errorMessage
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          return error;
                        });
                    }
                  }}
                  validationMessage={this.state.zipValidationError}
                  placeholder={"ex: 20190"}
                  showZipExtension={false}
                  zipExtension={this.state.zipExtension}
                  onChangeZipExtension={(value: any) => {
                    this.setState({ zipExtension: value });
                  }}
                  updateZipExtension={(value: any) => {
                    this.setState({ zipExtension: value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="form-section-header grid-row grid-gap-4">
            Password / Security Question
          </div>
          <div className="form-section-content grid-row grid-gap-4">

            <PPMSSecurityQuestion
              question={this.state.question}
              updateQuestion={(value: any) => {
                this.setState({ question: value });
              }}
              answer={this.state.answer}
              updateAnswer={(value: any) => {
                this.setState({ answer: value });
              }}
              isRequired={true}
            />
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-3"}>
                <PPMSPassword
                  showPasswordMeter={true}
                  id={"registration-password"}
                  password={this.state.password}
                  label={"Password"}
                  updatePassword={(value: any) => {
                    this.setState({ password: value });
                  }}
                  confirmPassword={this.state.confirmPassword}
                  updateConfirmPassword={(value: any) => {
                    this.setState({ confirmPassword: value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="form-submit-btn-center grid-row grid-gap-4">
            <PPMSSubmit
              variant={"primary"}
              disabled={this.state.isSubmitDisabled}
              isLoading={this.state.isSubmitLoading}
            />
          </div>
        </Form>
      </div>
    );
  }
}
