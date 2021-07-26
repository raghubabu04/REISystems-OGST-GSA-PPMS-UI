import React from "react";
import {
  validateEmailAddress,
  validatePhoneFax,
} from "../../../../ui-kit/components/validations/FieldValidations";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PPMSContact } from "../../../../ui-kit/components/PPMS-contact";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { values } from "lodash";

var modalOptions = [
  {
    value: "Notify Point of Contact when Available for Sale",
    id: "notify-poc-modal",
  },
];

interface PocModalState {
  firstName: string;
  firstNameIsInvalid: boolean;
  firstNameIsValid: boolean;
  firstNameValidationMessage: string;
  lastName: string;
  lastNameIsInvalid: boolean;
  lastNameIsValid: boolean;
  lastNameValidationMessage: string;
  phone: string;
  phoneIsInvalid: boolean;
  phoneIsValid: boolean;
  phoneValidationMessage: string;
  phoneExt: string;
  phoneExtIsInvalid: boolean;
  phoneExtIsValid: boolean;
  disbledExtension: boolean;
  phoneExtValidationMessage: string;
  fax: string;
  faxIsInvalid: boolean;
  faxIsValid: boolean;
  faxValidationMessage: string;
  email: string;
  emailIsInvalid: boolean;
  emailIsValid: boolean;
  emailValidationMessage: string;
  ccEmail: string;
  ccEmailIsInvalid: boolean;
  ccEmailIsValid: boolean;
  ccEmailValidationMessage: string;
  modalShow: boolean;
  notify: boolean;
}

const PocModalStateDefaults: PocModalState = {
  firstName: "",
  firstNameIsInvalid: false,
  firstNameIsValid: false,
  firstNameValidationMessage: "",
  lastName: "",
  lastNameIsInvalid: false,
  lastNameIsValid: false,
  lastNameValidationMessage: "",
  phone: "",
  phoneIsInvalid: false,
  phoneIsValid: false,
  phoneValidationMessage: "",
  phoneExt: "",
  phoneExtIsInvalid: false,
  phoneExtIsValid: false,
  disbledExtension: true,
  phoneExtValidationMessage: "",
  fax: "",
  faxIsInvalid: false,
  faxIsValid: false,
  faxValidationMessage: "",
  email: "",
  emailIsInvalid: false,
  emailIsValid: false,
  emailValidationMessage: "",
  ccEmail: "",
  ccEmailIsInvalid: false,
  ccEmailIsValid: false,
  ccEmailValidationMessage: "",
  modalShow: false,
  notify: false,
};

interface PocModalProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
  onModalChange?: any;
  propLocValues?: any;
  aacCode?: any;
  modalOpen?: any;
}

export class PocModal extends React.Component<PocModalProps, PocModalState> {
  constructor(props) {
    super(props);
    this.state = {
      ...PocModalStateDefaults,
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalShow !== newProps.modalOpen) {
      this.setState({ modalShow: newProps.modalOpen });
    }
  }

  //Call back function to update the modal close and open
  onModalChange = (event: any) => {
    this.props.onModalChange(event);
  };
  handleToUpdateModalState = (event: any, validation: any) => {
    let fieldValue: string = event.substring(event.indexOf(":") + 1);
    let field: string = fieldValue.substring(0, fieldValue.indexOf(":"));
    let value: string = fieldValue.substring(fieldValue.indexOf(":") + 1);
    switch (field) {
      case "firstName":
        if (value.length > 0) {
          this.setState({
            firstName: value,
            firstNameIsInvalid: false,
            firstNameIsValid: true,
          });
        } else {
          this.setState({
            firstName: value,
            firstNameIsInvalid: true,
            firstNameIsValid: false,
          });
        }
        break;
      case "lastName":
        if (value.length > 0) {
          this.setState({
            lastName: value,
            lastNameIsInvalid: false,
            lastNameIsValid: true,
          });
        } else {
          this.setState({
            lastName: value,
            lastNameIsInvalid: true,
            lastNameIsValid: false,
          });
        }
        break;
      case "phone":
        this.setState({
          phone: value,
          phoneIsInvalid: validation.isInvalid,
          phoneIsValid: !validation.isInvalid,
          phoneValidationMessage: validation.validationError,
          disbledExtension: !(value.length > 0),
        });

        break;
      case "phExt":
        this.setState({
          phoneExt: value,
        });
        break;
      case "fax":
        this.setState({
          fax: value,
          faxIsInvalid: validation.isInvalid,
          faxIsValid: !validation.isInvalid,
          faxValidationMessage: validation.validationError,
        });
        break;
      case "email":
        if (value === "") {
          this.setState({
            email: value,
            emailIsInvalid: true,
            emailIsValid: false,
            emailValidationMessage: "",
          });
        } else {
          this.setState({
            email: value,
            emailIsInvalid: validation.isInvalid,
            emailIsValid: !validation.isInvalid,
            emailValidationMessage: validation.validationError,
          });
        }
        break;
      case "ccEmail":
        if (value === "") {
          this.setState({
            ccEmail: value,
            ccEmailIsInvalid: false,
            ccEmailIsValid: true,
            ccEmailValidationMessage: "",
          });
        } else {
          this.setState({
            ccEmail: value,
            ccEmailIsInvalid: validation.isInvalid,
            ccEmailIsValid: !validation.isInvalid,
            ccEmailValidationMessage: validation.validationError,
          });
        }
        break;
    }
  };

  modalOpen = () => {
    this.setState({ modalShow: true });
  };

  modalHide = () => {
    this.setState({
      ...PocModalStateDefaults,
    });
    this.props.onModalChange("close");
  };

  validationForm = (): boolean => {
    let validateFirstName: boolean = this.state.firstName.length > 0;
    let validateSecondName: boolean = this.state.lastName.length > 0;
    let validateEmail = validateEmailAddress(this.state.email);
    let validationPhone = validatePhoneFax(this.state.phone);
    if (!validateFirstName) {
      this.setState({ firstNameIsInvalid: true });
    }

    if (!validateSecondName) {
      this.setState({ lastNameIsInvalid: true });
    }

    if (validateEmail.isInvalid) {
      this.setState({
        emailIsInvalid: true,
        emailIsValid: false,
      });
    }

    if (validationPhone.isInvalid) {
      this.setState({
        phoneIsInvalid: true,
        phoneIsValid: false,
      });
    }
    if (
      validateFirstName &&
      validateSecondName &&
      !validateEmail.isInvalid &&
      !validationPhone.isInvalid &&
      !this.state.faxIsInvalid &&
      !this.state.ccEmailIsInvalid
    )
      return true;
    else return false;
  };

  modalSave = (event: any) => {
    const { addToast } = this.props.actions;
    let commonService = new CommonApiService();
    if (this.validationForm()) {
      let data = new Map();
      data.set("aacPocId", 0);
      data.set("aacCode", this.props.aacCode);
      data.set("firstName", this.state.firstName);
      data.set("lastName", this.state.lastName);
      data.set("email", this.state.email);
      data.set("phone", this.state.phone.replace(/[^0-9]/g, ""));
      data.set("fax", this.state.fax.replace(/[^0-9]/g, ""));
      data.set("phoneExtension", this.state.phoneExt.replace(/[^0-9]/g, ""));
      data.set("ccEmail", this.state.ccEmail);
      data.set("contactID", 0);

      commonService
        .saveAndUpdatePointOfContact(Object.fromEntries(data))
        .then((response) => {
          let pocKeyStr =
          
            this.state.lastName +
            "-" +
            this.state.email;
          let pointOfContact = {
            pocId: response?.data?.aacPocId,
            pocFirstName: this.state.firstName,
            pocLastName: this.state.lastName,
            pocPhone: this.state.phone,
            pocPhoneExt: this.state.phoneExt,
            pocFax: this.state.fax,
            pocEmail: this.state.email,
            pocCcEmail: this.state.ccEmail,
            contactId: response?.data?.contactID,
            keyDisplayStr: pocKeyStr,
          };

          this.setState({
            ...PocModalStateDefaults,
          });
          addToast({
            text: "Point of Contact added successfully.",
            type: "success",
            heading: "Success",
          });
          this.props.onModalChange(pointOfContact);
        })
        .catch(() => {
          addToast({
            text: "Error Occurred.",
            type: "error",
            heading: "Error",
          });
        });
    }
  };

  render() {
    return (
      <>
        <PPMSModal
          body={
            <div className="modal-adjustment">
              <PPMSContact
                id={"poc-modal"}
                title={"Propety Custodian"}
                updateParentState={this.handleToUpdateModalState.bind(this)}
                firstLastNameRequired={true}
                showMiddleName={false}
                firstLastNameMaxLength={30}
                firstName={this.state.firstName}
                firstNameIsInvalid={this.state.firstNameIsInvalid}
                firstNameIsValid={this.state.firstNameIsValid}
                firstNameValidationMessage={
                  this.state.firstNameValidationMessage
                }
                onChangeFirstName={(value: any) =>
                  this.setState({ firstName: value })
                }
                middleName={""}
                lastName={this.state.lastName}
                lastNameIsInvalid={this.state.lastNameIsInvalid}
                lastNameIsValid={this.state.lastNameIsValid}
                lastNameValidationMessage={this.state.lastNameValidationMessage}
                onChangeLastName={(value: any) =>
                  this.setState({ lastName: value })
                }
                phone={this.state.phone}
                phoneIsInvalid={this.state.phoneIsInvalid}
                phoneIsValid={this.state.phoneIsValid}
                phoneValidationMessage={this.state.phoneValidationMessage}
                onChangePhoneNumber={(value: any) =>
                  this.setState({ phone: value })
                }
                extension={this.state.phoneExt}
                extensionIsInvalid={this.state.phoneExtIsInvalid}
                extensionIsValid={this.state.phoneExtIsValid}
                extensionValidationMessage={
                  this.state.phoneExtValidationMessage
                }
                onChangePhoneExt={(value: any) =>
                  this.setState({ phoneExt: value })
                }
                phoneExtRequired={true}
                disabledExtension={this.state.disbledExtension}
                phoneFax={this.state.fax}
                phoneFaxIsInvalid={this.state.faxIsInvalid}
                phoneFaxIsValid={this.state.faxIsValid}
                phoneFaxValidationMessage={this.state.faxValidationMessage}
                onChangePhoneFax={(value: any) => this.setState({ fax: value })}
                phoneFaxRequired={false}
                email={this.state.email}
                emailIsInvalid={this.state.emailIsInvalid}
                emailIsValid={this.state.emailIsValid}
                emailValidationMessage={this.state.emailValidationMessage}
                emailRequired={true}
                onChangeEmail={(value: any) => this.setState({ email: value })}
                ccEmail={this.state.ccEmail}
                ccEmailIsInvalid={this.state.ccEmailIsInvalid}
                ccEmailIsValid={this.state.ccEmailIsValid}
                onChangeCcEmail={(value: any) => {
                  this.setState({ ccEmail: value });
                }}
                ccEmailValidationMessage={this.state.ccEmailValidationMessage}
                emailMaxLength={64}
                options={modalOptions}
                disableNotifyToggle={true}
              />
            </div>
          }
          id={"PocModal"}
          title={"Add Point Of Contact"}
          size={"lg"}
          centered={true}
          label={"Save"}
          show={this.state.modalShow}
          handleClose={this.modalHide}
          handleSave={this.modalSave}
        />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(PocModal);
