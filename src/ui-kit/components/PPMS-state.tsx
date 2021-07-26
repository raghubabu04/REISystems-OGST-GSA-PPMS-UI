import React from "react";
import { PPMSSelect } from "./common/select/PPMS-select";
import { CommonApiService } from "../../api-kit/common/common-api.service";
import { nonUsStateValidation, stateValidation } from "./validations/FieldValidations";
import { isFormSubmitted } from "../../service/validation.service";
import { PPMSInput } from "./common/input/PPMS-input";
export interface PPMSStateProps {
  identifierKey?: string;
  identifierValue?: string;
  id: string;
  isInvalid?: boolean;
  nonUsUser?: boolean;
  isValid?: boolean;
  disabled?: boolean;
  label?: string;
  labelBold?: boolean;
  locationStateOptions?: any;
  placeHolderValue?: string;
  required: boolean;
  selectedState?: string;
  validationMessage?: string;
  updateLocationState: any;
  inputRef?: any;
  name?: string;
}
export interface PPMSStateState {
  isInvalid?: boolean;
  isValid?: boolean;
  locationStateOptions?: any;
  validationMessage?: string;
}
export class PPMSState extends React.Component<PPMSStateProps, PPMSStateState> {
  constructor(props) {
    super(props);
    this.state = {
      locationStateOptions: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  private isCurrent = true;
  commonApiService = new CommonApiService();
  componentDidMount() {
    this.commonApiService
      .getStateList()
      .then((response) => {
        let stateList = [];
        response.data.map((state) => {
          stateList.push({
            stateCode: `${state.stateCode}-${this.props.id}`,
            stateName: state.stateName,
          });
        });
        this.setState({
          locationStateOptions: stateList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    isFormSubmitted.subscribe((submit) => {
      if (submit && this.isCurrent) {
        this.validateForm();
        isFormSubmitted.next(false);
      }
    });
  }
  validateForm() {
    if (this.props.nonUsUser) {
      let validation = nonUsStateValidation(this.props.selectedState);
      this.props.updateLocationState(this.props.selectedState, validation);
    } else {
      let validation = stateValidation(this.props.selectedState);
      this.props.updateLocationState(this.props.selectedState, validation);
    }
  }
  componentWillUnmount() {
    this.isCurrent = false;
  }

  handleNonUsStateChange(state: string) {
    let validation = nonUsStateValidation(state);
    this.setState({
      isInvalid: validation.isInvalid,
      isValid: !validation.isInvalid,
      validationMessage: validation.validationError,
    });
    this.props.updateLocationState(state, validation);
  }

  handleChange({ selectedIndex }) {
    const stateCode = this.state.locationStateOptions[selectedIndex - 1]
      ? this.state.locationStateOptions[selectedIndex - 1].stateCode
      : "";
    let validation = stateValidation(stateCode);
    this.setState({
      isInvalid: validation.isInvalid,
      isValid: !validation.isInvalid,
      validationMessage: validation.validationError,
    });
    this.props.updateLocationState(stateCode.split("-")[0], validation);
  }

  render() {
    const isUserNonUS = this.props.nonUsUser;
    return (
      <>
        {isUserNonUS ? <PPMSInput
          isDisabled={this.props.disabled ? this.props.disabled : false}
          id={this.props.id}
          name={this.props.id}
          inputType={"text"}
          isInvalid={
            this.props.isInvalid ? this.props.isInvalid : false
          }
          isValid={false}
          label={"State"}
          labelBold={this.props.labelBold}
          minLength={2}
          onChange={(event) => {
            this.handleNonUsStateChange(event.target?.value)
          }}
          onBlur={(event) => this.handleNonUsStateChange(event.target?.value)}
          isRequired={
            this.props.required
          }
          validationMessage={
            (this.props.validationMessage === undefined &&
              !this.props.isInvalid) ||
              this.props.validationMessage !== undefined
              ? this.props.validationMessage
              : "Location State is Required."
          }
          value={
            this.props.selectedState
          }
          inputRef={this.props.inputRef}
        /> : <PPMSSelect
          id={this.props.id + "-select"}
          disabled={this.props.disabled}
          placeholderValue={
            this.props.placeHolderValue
              ? this.props.placeHolderValue
              : "Select State"
          }
          selectName={this.props.id + "-state"}
          name={this.props.id + ".state"}
          identifierKey={
            this.props.identifierKey ? this.props.identifierKey : "stateCode"
          }
          identifierValue={
            this.props.identifierValue ? this.props.identifierValue : "stateName"
          }
          isInvalid={this.props.isInvalid}
          isValid={this.props.isValid}
          label={this.props.label}
          labelBold={this.props.labelBold}
          isRequired={this.props.required}
          selectedValue={`${this.props.selectedState}-${this.props.id}`}
          validationMessage={
            (this.props.validationMessage === undefined &&
              !this.props.isInvalid) ||
              this.props.validationMessage !== undefined
              ? this.props.validationMessage
              : "Location State is Required."
          }
          values={this.state.locationStateOptions}
          onChange={(event) => this.handleChange(event.target)}
          inputRef={this.props.inputRef}
          ariaLabel={"State selection"}
        />}
      </>
    );
  }
}
