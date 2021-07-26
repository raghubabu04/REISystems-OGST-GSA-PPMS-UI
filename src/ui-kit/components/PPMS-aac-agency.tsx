import React from "react";
import { PPMSAacCode } from "./PPMS-aac-code";
import { PPMSAgencyBureau } from "./PPMS-agency-bureau";
import { isFormSubmitted } from "../../service/validation.service";

export interface PPMSAacAgencyProps {
  aacCode: string;
  aacLabel: string;
  aacValidationMessage?: string;
  isAACCodeDisabled?: boolean;
  agencyBureau: string;
  agencyDisabled?: boolean;
  isAACCodeInvalid?: boolean;
  isAACCodeValid?: boolean;
  isFormValidated?: boolean;
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  updateAACCode: any;
  updateAgencyBureau: any;
  isAACInvalid?: boolean;
  isAACValid?: boolean;
  required?: boolean;
  aacCodes?: any[];
}
export interface PPMSAacAgencyState {
  aacCode: string;
  aacValidationMessage?: string;
  agencyBureau: string;
  isAACCodeInvalid?: boolean;
  isAACCodeValid?: boolean;
  aacCodes?: any[];
}

export class PPMSAacAgency extends React.Component<
  PPMSAacAgencyProps,
  PPMSAacAgencyState
> {
  private isCurrent = true;
  constructor(props) {
    super(props);
    this.state = {
      aacCode: this.props.aacCode,
      agencyBureau: this.props.agencyBureau,
      aacValidationMessage: "Activity Address Code is Required.",
      isAACCodeInvalid: false,
      isAACCodeValid: false,
      aacCodes: this.props.aacCodes,
    };
  }
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
  }

  componentDidUpdate(prevProps): void {
    if (prevProps.aacCode !== this.props.aacCode) {
      this.setState({
        aacCode: this.props.aacCode,
      });
    }

    if (prevProps.agencyBureau !== this.props.agencyBureau) {
      this.setState({
        isAACCodeValid: false,
        agencyBureau: this.props.agencyBureau,
      });
    }

    if (prevProps.aacCodes !== this.props.aacCodes) {
      this.setState({
        aacCodes: this.props.aacCodes,
      });
    }
  }
  componentWillUnmount() {
    this.isCurrent = false;
  }
  validateForm() {}
  handleAgencyBureauChange(
    value,
    placeholder,
    isInvalid,
    isValid,
    isInternalAgency
  ) {
    this.setState({
      agencyBureau: placeholder,
      isAACCodeInvalid: isInvalid,
      isAACCodeValid: isValid,
      // isInternalAgency: isInternalAgency,
    });
    this.props.updateAgencyBureau(
      value,
      placeholder,
      isInvalid,
      isValid,
      isInternalAgency
    );
  }
  handleAACCodeChange(value, isInvalid, isValid) {
    this.setState({
      aacCode: value,
      isAACCodeInvalid: isInvalid,
      isAACCodeValid: isValid,
    });
    this.props.updateAACCode(value);
  }

  render() {
    return (
      <div className={"grid-row grid-gap-4"}>
        <div className={"tablet:grid-col-6 grid-col-12"}>
          <PPMSAacCode
            aacLabel={
              this.props.aacLabel !== ""
                ? this.props.aacLabel
                : "Activity Address Code"
            }
            className={"verification-code"}
            disabled={this.props.isAACCodeDisabled ? true : false}
            id={"aac-code"}
            isInvalid={this.state.isAACCodeInvalid}
            isValid={this.state.isAACCodeValid}
            maxLength={6}
            minLength={6}
            message={"Please enter 6 characters AAC code."}
            placeholder={" "}
            required={this.props.required}
            updateAACCode={(value, isInvalid, isValid) => {
              this.handleAACCodeChange(value, isInvalid, isValid);
            }}
            updateAgencyBureau={(
              value,
              placeholder,
              isInvalid,
              isValid,
              isInternalAgency
            ) => {
              this.handleAgencyBureauChange(
                value,
                placeholder,
                isInvalid,
                isValid,
                isInternalAgency
              );
            }}
            validationMessage={this.state.aacValidationMessage}
            value={this.state.aacCode}
            aacCodes={this.props.aacCodes}
          />
        </div>
        <div className={"tablet:grid-col-6 grid-col-12"}>
          <PPMSAgencyBureau
            isAACCodeInvalid={this.state.isAACCodeInvalid}
            isAACCodeValid={this.state.isAACCodeValid}
            value={this.state.agencyBureau}
            isRequired={this.props.required}
          />
        </div>
      </div>
    );
  }
}
