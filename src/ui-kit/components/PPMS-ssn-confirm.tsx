import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import {
  validateConfirmSSN,
  validateSSN,
} from "./validations/FieldValidations";
import { isFormSubmitted } from "../../service/validation.service";
import {UserApiService} from "../../api-kit/user/user-api.service";

export interface PPMSssnProps {
  confirmSSN: string;
  id: string;
  isConfirmSSNInvalid?: boolean;
  isConfirmSSNValid?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  isDisabled?: boolean;
  ssn: string;
  registrationType?:string
  validationConfirmSSNMessage?: string;
  validationMessage?: string;
  updateSSN: any;
  updateConfirmSSN: any;
}

export interface PPMSssnState {
  confirmSSN: string;
  isConfirmSSNInvalid: boolean;
  isConfirmSSNValid: boolean;
  isInvalid: boolean;
  isValid: boolean;
  ssn: string;
  validationConfirmSSNMessage: string;
  validationMessage: string;
}

export class PPMSssnConfirm extends React.Component<
  PPMSssnProps,
  PPMSssnState
> {
  constructor(props) {
    super(props);
    this.state = {
      confirmSSN: this.props.confirmSSN,
      isConfirmSSNInvalid: false,
      isConfirmSSNValid: false,
      isInvalid: false,
      isValid: false,
      ssn: this.props.ssn,
      validationConfirmSSNMessage:
        "Confirm Social Security Number is Required.",
      validationMessage: "Social Security Number is Required.",
    };
    this.handleSSNChange = this.handleSSNChange.bind(this);
    this.handleSSNConfirmChange = this.handleSSNConfirmChange.bind(this);
  }

  private isCurrent = true;
  private userApiService = new UserApiService();

  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
  }

  componentDidUpdate(
    prevProps: Readonly<PPMSssnProps>,
    prevState: Readonly<PPMSssnState>,
    snapshot?: any
  ) {
    if (prevProps.ssn !== this.props.ssn) {
      this.handleSSNChange({ value: this.props.ssn }, true);
    }
    if (prevProps.confirmSSN !== this.props.confirmSSN) {
      this.handleSSNConfirmChange({ value: this.props.confirmSSN });
    }
  }

  validateForm() {
    this.handleSSNChange({value: this.state.ssn});
    this.handleSSNConfirmChange({ value: this.state.confirmSSN });
  }

  componentWillUnmount() {
    this.isCurrent = false;
  }

  handleSSNChange = ({ value }, isCallFromComponentDidUpdate?:boolean ) => {
    let ssnRegex = /[^0-9]/g;
    let validation = validateSSN(value?.trim(), this.props.isRequired);
    let ssnVal = value?.replace(ssnRegex, "")?.replace("-", "");
    let formattedSSNValue = ssnVal;
    if (ssnVal?.length === 9) {
      formattedSSNValue =
        ssnVal.substring(0, 3) +
        "-" +
        ssnVal.substring(3, 5) +
        "-" +
        ssnVal.substring(5, 9);
      if(this.props?.registrationType === 'individual' && !isCallFromComponentDidUpdate){
        this.userApiService.
        verifySsnExists(formattedSSNValue).
        then(resp => {
          if(resp.data){
            this.setState({
              isInvalid: true,
              isValid: false,
              validationMessage: "Please provide unique Social Security Number"
            })
          }
        })
      }
      this.setState({
        ssn: formattedSSNValue,
      });
    }
    this.setState(
      {
        ssn: formattedSSNValue,
        isInvalid: validation.isInvalid,
        isValid: !validation.isInvalid,
        validationMessage: validation.validationError,
      },
      () => {
        this.props.updateSSN(formattedSSNValue?.trim());
        this.handleSSNConfirmChange({ value: this.state.confirmSSN });
      }
    );
  };
  handleSSNConfirmChange = ({ value }) => {
    let ssnRegex = /[^0-9]/g;
    let validation = validateConfirmSSN(
      this.state.ssn?.replaceAll("-", ""),
      value,
      this.state.isInvalid
    );
    let ssnConfirmVal = value?.replace(ssnRegex, "")?.replace("-", "");
    let formattedConfirmSSNValue = ssnConfirmVal;
    if (ssnConfirmVal?.length === 9) {
      formattedConfirmSSNValue =
        ssnConfirmVal.substring(0, 3) +
        "-" +
        ssnConfirmVal.substring(3, 5) +
        "-" +
        ssnConfirmVal.substring(5, 9);
      this.setState({
        confirmSSN: formattedConfirmSSNValue,
      });
    }
    this.setState({
      confirmSSN: formattedConfirmSSNValue,
      isConfirmSSNInvalid: validation.isInvalid,
      isConfirmSSNValid: !validation.isInvalid,
      validationConfirmSSNMessage: validation.validationError,
    });
    this.props.updateConfirmSSN(formattedConfirmSSNValue?.trim());
  };

  render() {
    return (
      <>
        <div className="tablet:grid-col">
          <PPMSInput
            inputType={"text"}
            id={this.props.id}
            label={"Social Security Number"}
            hint={
              this.props.isDisabled
                ? ""
                : "Social Security Number must be 9 digits"
            }
            validationMessage={this.state.validationMessage}
            isInvalid={this.state.isInvalid}
            isValid={this.state.isValid}
            isRequired={this.props.isRequired}
            value={this.state.ssn}
            onChange={(event) => this.handleSSNChange(event.target)}
            maxLength={9}
            minLength={9}
            isDisabled={this.props.isDisabled}
            placeHolder={"xxx-xx-xxxx"}
          />
        </div>
        <div className="tablet:grid-col">
          {!this.props.isDisabled && (
            <PPMSInput
              inputType={"text"}
              id={this.props.id + "-confirm"}
              label={"Confirm Social Security Number"}
              validationMessage={this.state.validationConfirmSSNMessage}
              isInvalid={this.state.isConfirmSSNInvalid}
              isValid={this.state.isConfirmSSNValid}
              isRequired={this.props.isRequired}
              value={this.state.confirmSSN}
              onChange={(event) => this.handleSSNConfirmChange(event.target)}
              maxLength={9}
              minLength={9}
              isDisabled={this.props.isDisabled}
              placeHolder={"xxx-xx-xxxx"}
            />
          )}
        </div>
      </>
    );
  }
}
