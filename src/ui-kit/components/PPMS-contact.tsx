import React from "react";
import { PPMSFirstNameLastName } from "./PPMS-firstname-lastname";
import { PPMSPhoneNumber } from "./PPMS-phone-number";
import { PPMSFormattedPhoneFax } from "./PPMS-formatted-phone-fax";
import { PPMSEmail } from "./PPMS-email";
import { PPMSToggleCheckbox } from "./common/toggle/PPMS-toggle";

interface PPMSContactProps {
  id?: any;
  title?: any;
  updateParentState: any;
  firstLastNameRequired?: boolean;
  firstLastNameMaxLength?: any;
  showMiddleName?: boolean;
  firstName?: any;
  firstNameIsInvalid?: boolean;
  firstNameIsValid?: boolean;
  firstNameValidationMessage?: any;
  onChangeFirstName?: any;
  middleName?: any;
  onChangeMiddleName?: any;
  lastName?: any;
  lastNameIsInvalid?: boolean;
  lastNameIsValid?: boolean;
  onChangeLastName?: any;
  lastNameValidationMessage?: any;
  phoneExtRequired?: boolean;
  phone?: any;
  phoneIsInvalid?: boolean;
  phoneIsValid?: boolean;
  phoneValidationMessage?: any;
  onChangePhoneNumber?: any;
  extension?: any;
  onChangePhoneExt?: any;
  extensionIsInvalid?: boolean;
  extensionIsValid?: boolean;
  extensionValidationMessage?: any;
  disabledExtension?: boolean;
  phoneFaxRequired?: boolean;
  phoneFax?: any;
  onChangePhoneFax?: any;
  phoneFaxIsValid?: boolean;
  phoneFaxIsInvalid?: boolean;
  phoneFaxValidationMessage?: any;
  size?: any;
  emailRequired?: boolean;
  email?: any;
  emailIsValid?: boolean;
  emailIsInvalid?: boolean;
  emailValidationMessage?: any;
  onChangeEmail?: any;
  emailMaxLength?: any;
  ccEmail?: any;
  ccEmailIsValid?: boolean;
  ccEmailIsInvalid?: boolean;
  onChangeCcEmail?: any;
  ccEmailValidationMessage?: any;
  disableNotifyToggle?: boolean;
  options?: any;
}

export class PPMSContact extends React.Component<PPMSContactProps, any> {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleNotifyChange = this.handleNotifyChange.bind(this);
  }

  handleNotifyChange = (target) => {
    const value = target[0];
    if (value.isSelected === true) {
      this.setState({ notifyFlag: true, options: target });
      this.props.updateParentState(`${this.props.id}:notify:` + true);
    } else {
      this.setState({ notifyFlag: false });
      this.props.updateParentState(`${this.props.id}:notify:` + false);
    }
  };

  render() {
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <PPMSFirstNameLastName
            id={`${this.props.id}-first-last-name`}
            required={
              this.props.firstLastNameRequired
                ? this.props.firstLastNameRequired
                : true
            }
            maxLength={this.props.firstLastNameMaxLength}
            maxMiddleLength={1}
            showMiddleName={this.props.showMiddleName}
            firstName={this.props.firstName}
            isFirstNameInvalid={this.props.firstNameIsInvalid}
            isFirstNameValid={this.props.firstNameIsValid}
            validationFirstMessage={
              (this.props.firstNameValidationMessage === "" &&
                !this.props.firstNameIsInvalid) ||
              this.props.firstNameValidationMessage !== ""
                ? this.props.firstNameValidationMessage
                : `${this.props.title} First Name is Required.`
            }
            onChangeFirstName={(value) => {
              this.props.onChangeFirstName(value);
            }}
            updateFirstName={(value: any) => {
              this.props.updateParentState(
                `${this.props.id}:firstName:` + value
              );
            }}
            middleName={this.props.middleName}
            onChangeMiddleName={(value) => {
              this.props.onChangeMiddleName(value);
            }}
            updateMiddleName={(value: any) => {
              this.props.updateParentState(
                `${this.props.id}:middleName:` + value
              );
            }}
            lastName={this.props.lastName}
            isLastNameInvalid={this.props.lastNameIsInvalid}
            isLastNameValid={this.props.lastNameIsValid}
            onChangeLastName={(value) => this.props.onChangeLastName(value)}
            updateLastName={(value: any) => {
              this.props.updateParentState(
                `${this.props.id}:lastName:` + value
              );
            }}
            validationLastMessage={
              (this.props.lastNameValidationMessage === "" &&
                !this.props.lastNameIsInvalid) ||
              this.props.lastNameValidationMessage !== ""
                ? this.props.lastNameValidationMessage
                : `${this.props.title} Last Name is Required.`
            }
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <PPMSPhoneNumber
            id={`${this.props.id}-phone-number`}
            required={
              this.props.phoneExtRequired ? this.props.phoneExtRequired : true
            }
            disabled={false}
            phone={this.props.phone}
            isInvalid={this.props.phoneIsInvalid}
            isValid={this.props.phoneIsValid}
            validationMessage={
              (this.props.phoneValidationMessage === "" &&
                !this.props.phoneIsInvalid) ||
              this.props.phoneValidationMessage !== ""
                ? this.props.phoneValidationMessage
                : `${this.props.title} Phone is Required.`
            }
            showExtension={true}
            onChangePhoneNumber={(value) =>
              this.props.onChangePhoneNumber(value)
            }
            updatePhoneNumber={(value: any, validation: any) => {
              if (validation.isInvalid) {
                validation.validationError = `${this.props.title} ${validation.validationError}`;
              }
              this.props.updateParentState(
                `${this.props.id}:phone:` + value,
                validation
              );
            }}
            extension={this.props.extension}
            onChangePhoneExt={(value) => this.props.onChangePhoneExt(value)}
            isExtensionInvalid={this.props.extensionIsInvalid}
            isExtensionValid={this.props.extensionIsValid}
            extensionValidationMessage={
              this.props.extensionValidationMessage
                ? this.props.extensionValidationMessage
                : ""
            }
            updatePhoneExtension={(value: any, validation: any) => {
              this.props.updateParentState(
                `${this.props.id}:phExt:` + value,
                validation
              );
            }}
            disabledExtension={this.props.disabledExtension}
            maxLength={10}
            maxLengthExtension={8}
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <PPMSFormattedPhoneFax
            id={`${this.props.id}-fax-number`}
            required={this.props.phoneFaxRequired}
            disabled={false}
            phoneFax={this.props.phoneFax}
            onChangePhoneFax={(value) => this.props.onChangePhoneFax(value)}
            updatePhoneFax={(value: any, validation: any) => {
              if (validation.isInvalid) {
                validation.validationError = `${this.props.title} ${validation.validationError}`;
              }

              this.props.updateParentState(
                `${this.props.id}:fax:` + value,
                validation
              );
            }}
            maxLength={14}
            isValid={this.props.phoneFaxIsValid}
            isInvalid={this.props.phoneFaxIsInvalid}
            validationMessage={
              (this.props.phoneFaxValidationMessage === "" &&
                !this.props.phoneFaxIsInvalid) ||
              this.props.phoneFaxValidationMessage !== ""
                ? this.props.phoneFaxValidationMessage
                : `${this.props.title} Fax is Required.`
            }
            numberFormatType="Fax"
            size={this.props.size}
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            <PPMSEmail
              id={`${this.props.id}-email`}
              required={
                this.props.emailRequired ? this.props.emailRequired : true
              }
              disabled={false}
              email={this.props.email}
              emailLabel={"Email Address"}
              isValid={this.props.emailIsValid}
              isInvalid={this.props.emailIsInvalid}
              validationMessage={
                (this.props.emailValidationMessage === "" &&
                  !this.props.emailIsInvalid) ||
                this.props.emailValidationMessage !== ""
                  ? this.props.emailValidationMessage
                  : `${this.props.title} Email is Required.`
              }
              onChangeEmail={(value: any) => this.props.onChangeEmail(value)}
              updateEmail={(value: any, validation: any) => {
                if (validation.isInvalid) {
                  validation.validationError = `${this.props.title} ${validation.validationError}`;
                }
                this.props.updateParentState(
                  `${this.props.id}:email:` + value,
                  validation
                );
              }}
              maxLength={this.props.emailMaxLength}
            />
          </div>
          <div className={"grid-col-12"}>
            <PPMSEmail
              id={`${this.props.id}-ccEmail`}
              required={false}
              disabled={false}
              email={this.props.ccEmail}
              isValid={this.props.ccEmailIsValid}
              isInvalid={this.props.ccEmailIsInvalid}
              emailLabel={"CC Email Address"}
              onChangeEmail={(value: any) => this.props.onChangeCcEmail(value)}
              updateEmail={(value: any, validation: any) => {
                if (validation.isInvalid) {
                  validation.validationError = `${this.props.title} ${validation.validationError}`;
                }
                this.props.updateParentState(
                  `${this.props.id}:ccEmail:` + value,
                  validation
                );
              }}
              validationMessage={
                (this.props.ccEmailValidationMessage === "" &&
                  !this.props.ccEmailIsInvalid) ||
                this.props.ccEmailValidationMessage !== ""
                  ? this.props.ccEmailValidationMessage
                  : `${this.props.title} Email is Required.`
              }
              maxLength={this.props.emailMaxLength}
            />
          </div>
        </div>
        {!this.props.disableNotifyToggle ? (
          <div className={"grid-row grid-gap-4"}>
            <PPMSToggleCheckbox
              id={`${this.props.id}-notify`}
              options={this.props.options}
              isInline={false}
              isDisabled={false}
              name={"notify"}
              className={"toggle-single-checkbox"}
              label={""}
              isRequired={false}
              validationMessage={""}
              isSingleSelect={true}
              onChange={this.handleNotifyChange}
            />
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}
