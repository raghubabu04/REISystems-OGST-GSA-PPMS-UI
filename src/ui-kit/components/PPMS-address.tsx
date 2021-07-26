import React from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import { PPMSZip } from "./PPMS-zip";
import { PPMSState } from "./PPMS-state";
import { isFormSubmitted } from "../../service/validation.service";
import { CommonApiService } from "../../api-kit/common/common-api.service";
import { validateZipStateCity } from "../../ui-kit/components/validations/FieldValidations";
import { PageUtils } from "../../utils/PageUtils";

interface PPPMSAddressProps {
  id?: any;
  className?: any;
  nonUsUser?: boolean;
  title?: any;
  addressDisabaled?: boolean;
  address1Required?: boolean;
  showAddressLine3: boolean;
  inputRef?: any;
  address1?: any;
  address1MaxLength?: number;
  address2MaxLength?: number;
  onChangeAddress1?: any;
  updateAddress1?: any;
  address1IsValid?: boolean;
  address1IsInvalid?: boolean;
  address1ValidationMessage?: any;
  address2Required?: boolean;
  address2?: any;
  address2ValidationMessage?: any;
  address2IsValid?: boolean;
  address2IsInvalid?: boolean;
  address3Required?: boolean;
  address3?: any;
  address3IsValid?: boolean;
  address3IsInvalid?: boolean;
  address3ValidationMessage?: any;
  updateAddress2?: any;
  updateAddress3?: any;
  cityRequired?: boolean;
  city?: any;
  onChangeCity?: any;
  onBlurAddress2?: any;
  onBlurAddress3?: any;
  cityIsValid?: boolean;
  cityIsInvalid?: boolean;
  cityValidationMessage?: any;
  updateCity?: any;
  stateRequired?: boolean;
  stateIsInvalid?: boolean;
  stateIsValid?: boolean;
  stateValidationMessage?: string;
  state?: any;
  stateDisabled?: boolean;
  updateState?: any;
  zipRequired?: boolean;
  zip?: any;
  onChangeZip?: any;
  zipIsValid?: boolean;
  zipIsInvalid?: boolean;
  zipValidationMessage?: any;
  updateZip?: any;
  zip2?: any;
  onChangeZipExtension?: any;
  zip2IsValid?: boolean;
  zip2IsInvalid?: boolean;
  disabledZipExtension?: boolean;
  validationExtensionMessage?: any;
  updateZipExtension?: any;
  disableZipValidation?: boolean;
  showZipExtension: boolean;
  labelBold?: boolean;
}

export class PPMSAddress extends React.Component<PPPMSAddressProps, any> {
  private commonApiService = new CommonApiService();
  private isCurrent = true;
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAddress1Change = this.handleAddress1Change.bind(this);
    this.handleAddress2Change = this.handleAddress2Change.bind(this);
    this.handleAddress3Change = this.handleAddress3Change.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
  }
  private zipRef = React.createRef();
  zipValidation(city: string, state: string, zip: string) {
    if (
      zip &&
      state &&
      city &&
      zip.length === 5 &&
      !this.props.disableZipValidation
    ) {
      this.commonApiService
        .getZipCode(zip)
        .then((response: any) => {
          let errorMessage = validateZipStateCity(response.data, city, state);
          if (this.props.updateZip) {
            this.props.updateZip(
              this.props.zip,
              errorMessage.length !== 0,
              errorMessage.length === 0,
              errorMessage,
              this.props.disabledZipExtension
            );
            let ref = this.props.inputRef ? this.props.inputRef : this.zipRef;
            PageUtils.setCustomValidity(ref.current, errorMessage);
          }
        })
        .catch((error) => {
          console.log(error);
          return error;
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
    if (!this.props.nonUsUser) {
      this.zipValidation(this.props.city, this.props.state, this.props.zip);
    }
    this.handleCityChange({
      validity: !this.props.cityIsInvalid,
      value: this.props.city,
    });

    this.handleAddress1Change({
      validity: !this.props.address1IsInvalid,
      value: this.props.address1,
    });
  }
  handleAddress1Change = ({ validity, value }) => {
    let validation = {
      isInvalid: !validity.valid,
      validationError: !validity.valid
        ? `${this.props.title} Address Line 1 is Required.`
        : "",
    };
    if (this.props.updateAddress1) {
      this.props.updateAddress1(value, validation);
    }
  };
  handleAddress2Change = ({ validity, value }) => {
    let validation = {
      isInvalid: !validity.valid,
      validationError: !validity.valid
        ? `${this.props.title} Address Line 2 is Required.`
        : "",
    };
    if (this.props.updateAddress2) {
      this.props.updateAddress2(value, validation);
    }
  };
  handleAddress3Change = ({ validity, value }) => {
    let validation = {
      isInvalid: !validity.valid,
      validationError: !validity.valid
        ? `${this.props.title} Address Line 3 is Required.`
        : "",
    };
    if (this.props.updateAddress3) {
      this.props.updateAddress3(value, validation);
    }
  };
  handleCityChange = ({ validity, value }) => {
    let validation = {
      isInvalid: !validity.valid,
      validationError: !validity.valid
        ? `${this.props.title} City is Required.`
        : "",
    };
    if (this.props.updateCity) {
      this.props.updateCity(value, validation);
    }
    if (!this.props.nonUsUser) {
      this.zipValidation(value, this.props.state, this.props.zip);
    }
  };
  render() {
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-7"}>
            <PPMSInput
              id={`${this.props.id}-address-line1`}
              inputType={"text"}
              label={"Address Line 1"}
              labelBold={this.props.labelBold}
              name={`${this.props.id}.address1`}
              isRequired={this.props.address1Required}
              maxLength={
                this.props.address1MaxLength ? this.props.address1MaxLength : 36
              }
              minLength={1}
              isDisabled={
                this.props.addressDisabaled
                  ? this.props.addressDisabaled
                  : false
              }
              inputRef={this.props.inputRef}
              placeHolder={" "}
              value={this.props.address1}
              onChange={(event) => {
                this.props.onChangeAddress1(event.target.value);
              }}
              onBlur={(event) => this.handleAddress1Change(event.target)}
              isValid={this.props.address1IsValid}
              isInvalid={this.props.address1IsInvalid}
              validationMessage={
                this.props.address1ValidationMessage
                  ? this.props.address1ValidationMessage
                  : `${this.props.title} Address Line 1 is Required.`
              }
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-7"}>
            <PPMSInput
              id={`${this.props.id}-address-line2`}
              inputType={"text"}
              label={"Address Line 2"}
              labelBold={this.props.labelBold}
              name={`${this.props.id}.address2`}
              isRequired={this.props.address2Required}
              maxLength={
                this.props.address2MaxLength ? this.props.address2MaxLength : 36
              }
              minLength={1}
              isDisabled={
                this.props.addressDisabaled
                  ? this.props.addressDisabaled
                  : false
              }
              placeHolder={" "}
              inputRef={this.props.inputRef}
              value={this.props.address2}
              onChange={(event) => this.handleAddress2Change(event.target)}
              onBlur={
                this.props.onBlurAddress2
                  ? (event) => this.props.onBlurAddress2(event.target.value)
                  : null
              }
              isValid={
                this.props.address2Required ? this.props.address2IsValid : false
              }
              isInvalid={
                this.props.address2Required
                  ? this.props.address2IsInvalid
                  : false
              }
              validationMessage={
                this.props.address2Required
                  ? this.props.address2ValidationMessage
                    ? this.props.address2ValidationMessage
                    : `${this.props.title} Address Line 2 is Required.`
                  : ""
              }
            />
          </div>
        </div>
        {this.props.showAddressLine3 ? (
          <div className={"grid-row grid-gap-4"}>
            <div className={"tablet:grid-col-7"}>
              <PPMSInput
                id={`${this.props.id}-address-line3`}
                inputType={"text"}
                label={"Address Line 3"}
                labelBold={this.props.labelBold}
                name={`${this.props.id}.address3`}
                isRequired={this.props.address3Required}
                maxLength={36}
                minLength={1}
                isDisabled={
                  this.props.addressDisabaled
                    ? this.props.addressDisabaled
                    : false
                }
                placeHolder={" "}
                inputRef={this.props.inputRef}
                value={this.props.address3}
                onChange={(event) => this.handleAddress3Change(event.target)}
                onBlur={
                  this.props.onBlurAddress3
                    ? (event) => this.props.onBlurAddress3(event.target.value)
                    : null
                }
                isValid={
                  this.props.address3Required
                    ? this.props.address3IsValid
                    : false
                }
                isInvalid={
                  this.props.address3Required
                    ? this.props.address3IsInvalid
                    : false
                }
                validationMessage={
                  this.props.address3Required
                    ? this.props.address3ValidationMessage
                      ? this.props.address3ValidationMessage
                      : `${this.props.title} Address Line 3 is Required.`
                    : ""
                }
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-7"}>
            <PPMSInput
              id={`${this.props.id}-city`}
              inputType={"text"}
              name={`${this.props.id}.city`}
              label={"City"}
              labelBold={this.props.labelBold}
              isRequired={this.props.cityRequired}
              maxLength={28}
              minLength={1}
              inputRef={this.props.inputRef}
              isDisabled={
                this.props.addressDisabaled
                  ? this.props.addressDisabaled
                  : false
              }
              value={this.props.city}
              onChange={(event) => {
                this.props.onChangeCity(event.target.value);
              }}
              onBlur={(event) => this.handleCityChange(event.target)}
              isValid={this.props.cityIsValid}
              isInvalid={this.props.cityIsInvalid}
              validationMessage={
                this.props.cityValidationMessage
                  ? this.props.cityValidationMessage
                  : `${this.props.title} City is Required.`
              }
            />
          </div>
          <div className={"tablet:grid-col-5"}>
            <PPMSState
              id={`${this.props.id}-state`}
              label={"State"}
              nonUsUser={this.props.nonUsUser}
              labelBold={this.props.labelBold}
              required={this.props.stateRequired}
              isInvalid={this.props.stateIsInvalid}
              isValid={this.props.stateIsValid}
              validationMessage={this.props.stateValidationMessage}
              selectedState={this.props.state}
              updateLocationState={(value: any, validation: any) => {
                this.props.updateState(value, validation);
                if (!this.props.nonUsUser) {
                  this.zipValidation(this.props.city, value, this.props.zip);
                }
              }}
              disabled={
                this.props.addressDisabaled
                  ? this.props.addressDisabaled
                  : this.props.stateDisabled
                  ? this.props.stateDisabled
                  : false
              }
              name={`${this.props.id}.state`}
              inputRef={this.props.inputRef}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-12"}>
            <PPMSZip
              id={`${this.props.id}.zip`}
              isRequired={this.props.zipRequired}
              nonUsUser={this.props.nonUsUser}
              disabled={
                this.props.addressDisabaled
                  ? this.props.addressDisabaled
                  : false
              }
              zip={this.props.zip}
              labelBold={this.props.labelBold}
              onChangeZip={(value) => {
                this.props.onChangeZip(value);
              }}
              isZipValid={this.props.zipIsValid}
              isZipInvalid={this.props.zipIsInvalid}
              validationMessage={
                (this.props.zipValidationMessage === "" &&
                  !this.props.zipIsInvalid) ||
                this.props.zipValidationMessage !== ""
                  ? this.props.zipValidationMessage
                  : `${this.props.title} Zip Code is Required.`
              }
              updateZip={(
                value: any,
                inValid: boolean,
                valid: boolean,
                validationError: string,
                disabledZipExtension: any
              ) => {
                if (inValid) {
                  validationError = `${this.props.title} ${validationError}`;
                }
                this.props.updateZip(
                  value,
                  inValid,
                  valid,
                  validationError,
                  disabledZipExtension
                );
                if (!this.props.nonUsUser) {
                  this.zipValidation(this.props.city, this.props.state, value);
                }
              }}
              zipExtension={this.props.zip2}
              onChangeZipExtension={(value) =>
                this.props.onChangeZipExtension(value)
              }
              isZipExtensionValid={this.props.zip2IsValid}
              isZipExtensionInvalid={this.props.zip2IsInvalid}
              disabledZipExtension={
                this.props.addressDisabaled
                  ? this.props.addressDisabaled
                  : false
              }
              validationExtensionMessage={this.props.validationExtensionMessage}
              showZipExtension={this.props.showZipExtension}
              updateZipExtension={(
                value: any,
                inValid: boolean,
                valid: boolean,
                validationError: string
              ) => {
                if (this.props.updateZipExtension) {
                  this.props.updateZipExtension(
                    value,
                    inValid,
                    valid,
                    validationError
                  );
                }
              }}
              inputRef={this.props.inputRef ? this.props.inputRef : this.zipRef}
            />
          </div>
        </div>
      </>
    );
  }
}
