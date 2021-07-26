import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import {
  validateNonUsZipCode,
  zipExtensionValidation,
  zipValidation,
} from "./validations/FieldValidations";
import { isFormSubmitted } from "../../service/validation.service";

export interface PPMSZipProps {
  disabled: boolean;
  nonUsUser?: boolean;
  disabledZipExtension?: boolean;
  showZipExtension: boolean;
  id: string;
  labelBold?: boolean;
  isRequired: boolean;
  isZipExtensionInvalid?: boolean;
  isZipExtensionValid?: boolean;
  isZipInvalid?: boolean;
  isZipValid?: boolean;
  size?: "sm" | "lg";
  validationExtensionMessage?: string;
  validationMessage?: string;
  zip: string;
  zipExtension: string;
  updateZip: any;
  updateZipExtension: any;
  placeholder?: string;
  inputRef?: any;
  inputRefExt?: any;
  onChangeZip: any;
  onChangeZipExtension?: any;
}
export interface PPMSZipState { }

export class PPMSZip extends React.Component<PPMSZipProps, PPMSZipState> {
  private isCurrent = true;
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleExtensionChange = this.handleExtensionChange.bind(this);
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
    this.handleChange({ value: this.props.zip });
  }

  handleChange = ({ value }) => {
    let validation;
    if (this.props.nonUsUser) {
      validation = validateNonUsZipCode(value.trim(), this.props.isRequired);
    } else {
      validation = zipValidation(value, this.props.isRequired);
    }
    this.props.updateZip(
      value,
      validation.isInvalid,
      !validation.isInvalid,
      validation.validationError,
      !(value?.length > 0)
    );
  };

  handleExtensionChange = ({ value }) => {
    let validation = zipExtensionValidation(value);
    this.props.updateZipExtension(
      value,
      validation.isInvalid,
      !validation.isInvalid,
      validation.validationError
    );
  };
  render() {
    const nonUsZipCode = this.props.nonUsUser;
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              isDisabled={this.props.disabled ? this.props.disabled : false}
              id={this.props.id}
              name={this.props.id}
              inputType={"text"}
              isInvalid={
                this.props.isZipInvalid ? this.props.isZipInvalid : false
              }
              isValid={this.props.isZipValid ? this.props.isZipValid : false}
              label={"Zip Code"}
              labelBold={this.props.labelBold}
              maxLength={nonUsZipCode ? 9 : 5}
              minLength={nonUsZipCode ? 1 : 5}
              onChange={(event) => {
                this.props.onChangeZip(event.target.value);
              }}
              onBlur={(event) => this.handleChange(event.target)}
              placeHolder={this.props.placeholder}
              isRequired={this.props.isRequired}
              validationMessage={
                (this.props.validationMessage === "" &&
                  !this.props.isZipInvalid) ||
                  this.props.validationMessage !== ""
                  ? this.props.validationMessage
                  : "Zip Code is Required."
              }
              value={this.props.zip}
              inputRef={this.props.inputRef}
            />
          </div>
          {this.props.showZipExtension && (
            <>
              <div className={"tablet:grid-col-5"}>
                <PPMSInput
                  isDisabled={
                    this.props.disabledZipExtension
                      ? this.props.disabledZipExtension
                      : false
                  }
                  id={this.props.id + "-extension"}
                  name={this.props.id + ".extension"}
                  inputType={"text"}
                  isInvalid={
                    this.props.isZipExtensionInvalid
                      ? this.props.isZipExtensionInvalid
                      : false
                  }
                  isValid={
                    this.props.isZipExtensionValid
                      ? this.props.isZipExtensionValid
                      : false
                  }
                  label={"Zip Ext."}
                  labelBold={this.props.labelBold}
                  maxLength={4}
                  minLength={4}
                  onChange={(event) => {
                    this.props.onChangeZipExtension(event.target.value);
                  }}
                  onBlur={(event) => this.handleExtensionChange(event.target)}
                  placeHolder={"ex: 3254"}
                  isRequired={false}
                  validationMessage={
                    this.props.validationExtensionMessage
                      ? this.props.validationExtensionMessage
                      : ""
                  }
                  value={this.props.zipExtension}
                  className={"input-ext"}
                  inputRef={this.props.inputRefExt}
                />
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
