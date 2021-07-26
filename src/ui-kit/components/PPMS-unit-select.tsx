import React, { createRef } from "react";
import { PPMSPopover } from "./common/PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";
import { PPMSFormGroup } from "./common/form/PPMS-form-group";
import PPMSLabel from "./common/form/PPMS-label";
import PPMSDropdown from "./common/form/PPMS-dropdown";
import PPMSErrorMessage from "./common/form/PPMS-error-message";
import { isFormSubmitted } from "../../service/validation.service";

export interface Props {
  defaultValue?: string;
  identifierKey: string;
  identifierValue: string;
  isInvalid: boolean;
  isValid: boolean;
  label: string;
  isRequired: boolean;
  selectClass?: string;
  selectedValue: string;
  selectName?: string;
  validationMessage: string;
  values: any;
  onChange: any;
  name?: string;
  message?: string;
  infoTipContent?: any;
  infoTipClass?: string;
  placeholderValue?: string;
  icon?: {};
  hint?: string;
}
export interface State {
  isInvalid: boolean;
}

export class PPMSUnitSelect extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isInvalid: false,
    };
  }
  selectRef = createRef<HTMLSelectElement>();
  onChange = (event) => {
    this.setState({
      isInvalid: false,
    });
    this.props.onChange(event);
  };
  componentDidMount() {
    isFormSubmitted.subscribe((submit) => {
      if (
        submit &&
        this.props.isRequired &&
        !this.selectRef?.current?.validity?.valid
      ) {
        this.setState({
          isInvalid: true,
        });
      } else {
        this.setState({
          isInvalid: false,
        });
      }
    });
  }
  render() {
    const options = this.props.values.map((data: any) => (
      <option
        key={data[this.props.identifierKey]}
        id={data[this.props.identifierKey]}
        value={data[this.props.identifierKey]}
      >
        {data[this.props.identifierKey] +
          " - " +
          data[this.props.identifierValue]}
      </option>
    ));
    const infoTip = (
      <PPMSPopover
        trigger={["click"]}
        id={this.props.selectName}
        placement={"right"}
        popoverTitle={this.props.label}
        popoverContent={this.props.infoTipContent}
        className={this.props.infoTipClass}
        triggerSource={
          <FaInfoCircle
            className={`ppms-usa-input-info-icon ${
              this.props.infoTipContent ? "usa-label-float" : ""
            }`}
          />
        }
      />
    );
    return (
      <PPMSFormGroup error={this.props.isInvalid || this.state.isInvalid}>
        <PPMSLabel
          htmlFor={this.props.name}
          hint={this.props.message && `(${this.props.message})`}
        >
          {this.props.icon} {this.props.label}{" "}
          {this.props.infoTipContent && infoTip}
        </PPMSLabel>
        {this.props.infoTipContent && infoTip}
        {this.props.hint && <span className="usa-hint">{this.props.hint}</span>}
        <PPMSDropdown
          id={"unitOfIssue"}
          name={this.props.name}
          validationStatus={
            (this.props.isInvalid && !this.props.isValid) ||
            this.state.isInvalid
              ? "error"
              : ""
          }
          onChange={this.onChange}
          value={this.props.selectedValue}
          inputRef={this.selectRef}
          autoComplete="off"
          title={"Unit Of Issue"}
        >
          {this.props.placeholderValue && (
            <option key={"empty"} id={"empty"} value={""}>
              - {this.props.placeholderValue} -
            </option>
          )}
          {options}
        </PPMSDropdown>
        {(this.props.isInvalid || this.state.isInvalid) && (
          <PPMSErrorMessage>{this.props.validationMessage}</PPMSErrorMessage>
        )}
      </PPMSFormGroup>
    );
  }
}
