import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import {
  validateConfirmEIN,
  validateEIN,
} from "./validations/FieldValidations";
import { isFormSubmitted } from "../../service/validation.service";

export interface PPMSeinProps {
  confirmEIN: string;
  id: string;
  isConfirmEINInvalid?: boolean;
  isConfirmEINValid?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  isDisabled?: boolean;
  ein: string;
  validationConfirmEINMessage?: string;
  validationMessage?: string;
  updateEIN: any;
  updateConfirmEIN: any;
}

export interface PPMSeinState {
  confirmEIN: string;
  isConfirmEINInvalid: boolean;
  isConfirmEINValid: boolean;
  isInvalid: boolean;
  isValid: boolean;
  ein: string;
  validationConfirmEINMessage: string;
  validationMessage: string;
}

export class PPMSeinConfirm extends React.Component<
  PPMSeinProps,
  PPMSeinState
> {
  constructor(props) {
    super(props);
    this.state = {
      confirmEIN: this.props.confirmEIN,
      isConfirmEINInvalid: false,
      isConfirmEINValid: false,
      isInvalid: false,
      isValid: false,
      ein: this.props.ein,
      validationConfirmEINMessage:
        "Confirm Employer Identification Number is Required.",
      validationMessage: "Employer Identification Number is Required.",
    };
    this.handleEINChange = this.handleEINChange.bind(this);
    this.handleEINConfirmChange = this.handleEINConfirmChange.bind(this);
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

  componentDidUpdate(
    prevProps: Readonly<PPMSeinProps>,
    prevState: Readonly<PPMSeinState>,
    snapshot?: any
  ) {
    if (prevProps.ein !== this.props.ein) {
      this.handleEINChange({ value: this.props.ein });
    }
    if (prevProps.confirmEIN !== this.props.confirmEIN) {
      this.handleEINConfirmChange({ value: this.props.confirmEIN });
    }
  }

  validateForm() {
    this.handleEINChange({ value: this.state.ein });
    this.handleEINConfirmChange({ value: this.state.confirmEIN });
  }

  componentWillUnmount() {
    this.isCurrent = false;
  }

  handleEINChange = ({ value }) => {
    let einRegex = /[^0-9]/g;
    let validation = validateEIN(value?.trim());
    let einVal = value?.replace(einRegex, "").replace("-", "");
    let formattedEINValue = einVal;
    if (einVal?.length === 9) {
      formattedEINValue = einVal.substring(0, 2) + "-" + einVal.substring(2, 9);
      this.setState({
        ein: formattedEINValue,
      });
    }
    this.setState(
      {
        ein: formattedEINValue,
        isInvalid: validation.isInvalid,
        isValid: !validation.isInvalid,
        validationMessage: validation.validationError,
      },
      () => {
        this.props.updateEIN(formattedEINValue?.trim());
        this.handleEINConfirmChange({ value: this.state.confirmEIN });
      }
    );
  };

  handleEINConfirmChange = ({ value }) => {
    let einRegex = /[^0-9]/g;
    let validation = validateConfirmEIN(
      this.state.ein?.replace("-", ""),
      value,
      this.state.isInvalid
    );
    let einConfirmVal = value?.replace(einRegex, "")?.replace("-", "");
    let formattedConfirmEINValue = einConfirmVal;
    if (einConfirmVal?.length === 9) {
      formattedConfirmEINValue =
        einConfirmVal.substring(0, 2) + "-" + einConfirmVal.substring(2, 9);
      this.setState({
        confirmEIN: formattedConfirmEINValue,
      });
    }
    this.setState({
      confirmEIN: formattedConfirmEINValue,
      isConfirmEINInvalid: validation.isInvalid,
      isConfirmEINValid: !validation.isInvalid,
      validationConfirmEINMessage: validation.validationError,
    });
    this.props.updateConfirmEIN(formattedConfirmEINValue?.trim());
  };

  render() {
    return (
      <>
        <div className="tablet:grid-col">
          <PPMSInput
            inputType={"text"}
            id={this.props.id}
            label={"Employer Identification Number"}
            hint={"Employer Identification Number must be 9 digits"}
            validationMessage={this.state.validationMessage}
            isInvalid={this.state.isInvalid}
            isValid={this.state.isValid}
            isRequired={true}
            value={this.state.ein}
            onChange={(event) => this.handleEINChange(event.target)}
            maxLength={9}
            minLength={9}
            isDisabled={this.props.isDisabled}
            placeHolder={"xx-xxxxxxx"}
          />
        </div>
        <div className="tablet:grid-col">
          {!this.props.isDisabled && (
            <PPMSInput
              inputType={"text"}
              id={this.props.id + "-confirm"}
              label={"Confirm Employer Identification Number"}
              validationMessage={this.state.validationConfirmEINMessage}
              isInvalid={this.state.isConfirmEINInvalid}
              isValid={this.state.isConfirmEINValid}
              isRequired={true}
              value={this.state.confirmEIN}
              onChange={(event) => this.handleEINConfirmChange(event.target)}
              maxLength={9}
              minLength={9}
              isDisabled={this.props.isDisabled}
              placeHolder={"xx-xxxxxxx"}
            />
          )}
        </div>
      </>
    );
  }
}
