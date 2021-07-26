import React from "react";
import {PPMSInput} from "./common/input/PPMS-input";
import {aacCodeValidation} from "./validations/FieldValidations";
import {CommonApiService} from "../../api-kit/common/common-api.service";
import {UserApiService} from "../../api-kit/user/user-api.service";
import {ErrorMessages} from "../../constants/Constants";
import {UserUtils} from "../../utils/UserUtils";
import {isFormSubmitted} from "../../service/validation.service";

export interface PPMSAacCodeProps {
  aacLabel: string;
  className: string;
  disabled: boolean;
  id: string;
  isInvalid: boolean;
  isValid: boolean;
  maxLength: number;
  minLength: number;
  message?: string;
  placeholder: string;
  required: boolean;
  size?: "sm" | "lg";
  validationMessage: string;
  value: string;
  updateAACCode: any;
  updateAgencyBureau: any;
  aacCodes?: any[];
}
export interface PPMSAacCodeState {
  isInvalid: boolean;
  isValid: boolean;
  validationMessage: string;
  value: string;
}
export class PPMSAacCode extends React.Component<
  PPMSAacCodeProps,
  PPMSAacCodeState
> {
  private isCurrent = true;
  constructor(props) {
    super(props);
    this.state = {
      isInvalid: this.props.isInvalid,
      isValid: this.props.isValid,
      validationMessage: this.props.validationMessage,
      value: this.props.value,
    };
    this.handleAACChange = this.handleAACChange.bind(this);
  }

  componentDidUpdate(prevProps: PPMSAacCodeProps) {
    if (prevProps.value !== this.state.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
  }
  componentWillUnmount() {
    this.isCurrent = false;
  }
  validateForm() {
    this.handleAACChange({ value: this.state.value });
  }
  commonApiService = new CommonApiService();
  userApiService = new UserApiService();
  handleAACChange = ({ value }) => {
    this.setState({
      value: value,
    });
    const aacCodeLength = value.length;
    const aacCodeCheck = aacCodeLength > 0;
    this.props.updateAACCode(value);
    this.props.updateAgencyBureau(
      "",
      "",
      aacCodeCheck,
      !(this.props.required || aacCodeLength >= 0)
    );
    let validation = {
      isInvalid: false,
      validationError: "",
    };

    if (!UserUtils.isUserNuo() && this.props.aacCodes && this.props.aacCodes.length === 0) {
      //when nothing is added
      if (this.props.required && aacCodeLength === 0) {
        validation = {
          isInvalid: true,
          validationError: " Primary AAC Code is required field",
        };
        this.setValidation(value, validation);
      }
    }

    if (aacCodeCheck && !validation.isInvalid) {
      validation = aacCodeValidation(value);
    }

    if (aacCodeLength > 0 && !validation.isInvalid) {
      this.setValidation(value, validation);
      const data = {
        params: {
          agencyCode: value,
        },
      };
      if (UserUtils.isUserSaspAdmin()) {
        this.commonApiService
          .getBureauFromPropertyAgencyContact(data)
          .then((response) => {
            this.props.updateAACCode(value);
            this.props.updateAgencyBureau(
              response.data.code,
              response.data.code + " - " + response.data.longName,
              false,
              true
            );
          })
          .catch((error) => {
            let data = {
              isInvalid: true,
              validationError:
                error.data && error.data.message
                  ? error.data.message
                  : ErrorMessages.REQUEST_PROCESSING_ERROR,
            };
            this.setValidation(value, data);
          });
      } else if (UserUtils.isUserNuo()) {
        this.userApiService
          .checkValidAgencyBureauForLoggedInNUO(value)
          .then((response) => {
            this.props.updateAACCode(value, false, true);
            this.props.updateAgencyBureau(
              response.data.code,
              response.data.code + " - " + response.data.longName,
              false,
              true,
              response.data.isInternalAgency
            );
          })
          .catch((error) => {
            let data = {
              isInvalid: true,
              validationError:
                error.data && error.data.message
                  ? error.data.message
                  : ErrorMessages.REQUEST_PROCESSING_ERROR,
            };
            this.props.updateAACCode(value, true, false);
            this.setValidation(value, data);
          });
      } else {
        this.commonApiService
          .getBureau(data)
          .then((response) => {
            this.props.updateAACCode(value);
            this.props.updateAgencyBureau(
              response.data.code,
              response.data.code + " - " + response.data.longName,
              false,
              true,
              response.data.isInternalAgency
            );
          })
          .catch((error) => {
            let data = {
              isInvalid: true,
              validationError:
                error.data && error.data.message
                  ? error.data.message
                  : ErrorMessages.REQUEST_PROCESSING_ERROR,
            };
            this.setValidation(value, data);
          });
      }
    } else {
      this.setValidation(value, validation);
    }
  };
  setValidation(value, data) {
    this.setState({
      isInvalid: data.isInvalid,
      isValid: !data.isInvalid,
      validationMessage: data.validationError,
    });

    if (
      this.props.aacCodes &&
      this.props.aacCodes.length > 0 &&
      value.length === 0
    ) {
      this.setState({
        isInvalid: false,
        isValid: false,
        validationMessage: data.validationError,
      });
    }
  }

  // Below method is to clear the aac code value
  componentWillReceiveProps(nextProps): void {
    if (
      this.state.value.length === 6 &&
      nextProps.value === "" &&
      !UserUtils.isUserSaspAdmin() &&
      UserUtils.getUserInfo() !== null
    ) {
      this.setState({
        value: nextProps.value,
        isValid: nextProps.isValid,
      });
    }
  }
  render() {
    return (
      <PPMSInput
        className={"aac-code"}
        isDisabled={this.props.disabled}
        id={this.props.id}
        name={this.props.id}
        inputType={"text"}
        isInvalid={this.state.isInvalid}
        isValid={this.state.isValid}
        label={
          this.props.aacLabel !== ""
            ? this.props.aacLabel
            : "Activity Address Code"
        }
        maxLength={this.props.maxLength}
        minLength={this.props.minLength}
        hint={this.props.message}
        onChange={(event) => this.handleAACChange(event.target)}
        placeHolder={this.props.placeholder}
        isRequired={this.props.required}
        validationMessage={this.state.validationMessage}
        value={this.state.value}
      />
    );
  }
}
