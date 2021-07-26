import React from "react";
import { PPMSUnitSelect } from "./PPMS-unit-select";
import { CommonApiService } from "../../api-kit/common/common-api.service";
import { unitOfIssueValidation } from "../../app/property/create-update-property/validations/propertyFieldValidations";

export interface Props {
  identifierKey?: string;
  identifierValue?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  label: string;
  unitOfIssueOptions?: any;
  required: boolean;

  unitOfIssue: string;
  unitOfIssueDefault: string;
  validationMessage?: string;
  updateUnitOfIssues: any;
}
export interface State {
  identifierKey?: string;
  identifierValue?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  label: string;

  unitOfIssueOptions?: any;
  required: boolean;
  unitOfIssue: string;
  unitOfIssueDefault: string;
  validationMessage?: string;
}

export class PPMSUnitOfIssue extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      identifierKey: this.props.identifierKey
        ? this.props.identifierKey
        : "code",
      identifierValue: this.props.identifierValue
        ? this.props.identifierValue
        : "description",
      isInvalid: false,
      isValid: false,
      label: this.props.label,
      unitOfIssueOptions: [],
      required: this.props.required,
      unitOfIssue: this.props.unitOfIssue,
      unitOfIssueDefault: this.props.unitOfIssueDefault,
      validationMessage: this.props.validationMessage
        ? this.props.validationMessage
        : "Unit Of Issue is Required.",
    };
    this.handleUnitChange = this.handleUnitChange.bind(this);
  }

  private commonApiService = new CommonApiService();
  componentDidMount() {
    this.commonApiService
      .getUnitList()
      .then((response) => {
        this.setState({
          unitOfIssueOptions: response.data,
          //unitOfIssueDefault: response.data[0],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleUnitChange(event) {
    const unitCode = this.state.unitOfIssueOptions[
      event.target.selectedIndex - 1
    ]
      ? this.state.unitOfIssueOptions[event.target.selectedIndex - 1].unitCode
      : "";
    let validation = unitOfIssueValidation(unitCode);
    this.setState({
      isInvalid: validation.isInvalid,
      isValid: !validation.isInvalid,
      validationMessage: validation.validationError,
    });
    event.target.setCustomValidity(validation.validationError);
    this.props.updateUnitOfIssues(event.currentTarget.value);
  }

  render() {
    return (
      <PPMSUnitSelect
        identifierKey={this.state.identifierKey}
        identifierValue={this.state.identifierValue}
        isInvalid={this.state.isInvalid}
        isValid={this.state.isValid}
        label={this.state.label}
        onChange={this.handleUnitChange}
        isRequired={this.state.required}
        selectName={"unitOfIssue"}
        selectedValue={this.props.unitOfIssue}
        validationMessage={this.state.validationMessage}
        values={this.state.unitOfIssueOptions}
      />
    );
  }
}
