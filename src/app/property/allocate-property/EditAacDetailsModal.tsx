import "react";
import React from "react";
import {PropertyApiService} from "../../../api-kit/property/property-api-service";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import {PPMSInput} from "../../../ui-kit/components/common/input/PPMS-input";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {PPMSEmail} from "../../../ui-kit/components/PPMS-email";
import {formatExtension, formatPhone, nullToStringUtil,} from "../../../ui-kit/utilities/FormatUtil";

interface EditAacProps {
  showModal: boolean;
  handleClose: any;
  oldAo?: any;
  tcn: string;
  afterSaveAction: any;
  requestorAAC?: string;
  requestorAgencyBureauCd?: string;
}

interface EditAacState {
  showModal: boolean;
  isEmailValid: boolean;
  errorMessage: string;
  email: string;
  aoFirstName: string;
  aoLastName: string;
  aoPhoneNumber: string;
  aoPhoneExtension: string;
  aoMiddleName: string;
  aoFax: string;
  aoBureauCd: string;
  aoUser?: any;
}

export default class EditAacDetailModal extends React.Component<
  EditAacProps,
  EditAacState
> {
  private userApiService: UserApiService = new UserApiService();
  private propertyApi: PropertyApiService = new PropertyApiService();

  constructor(props: EditAacProps) {
    super(props);
    this.state = {
      showModal: this.props.showModal,
      isEmailValid: true,
      errorMessage: "",
      email: this.props.oldAo?.emailAddress,
      aoLastName: this.props.oldAo?.lastName,
      aoPhoneNumber: formatPhone(
        nullToStringUtil(this.props.oldAo?.phoneNumber) + ""
      ),
      aoFirstName: this.props.oldAo?.firstName,
      aoPhoneExtension: this.props.oldAo?.phoneExtension,
      aoMiddleName: this.props.oldAo?.middleName,
      aoBureauCd: this.props.oldAo?.agencyBureauCd,
      aoFax: this.props.oldAo?.fax,
      aoUser: this.props.oldAo,
    };
  }

  handleSave = (event) => {
    if (this.state.isEmailValid) {
      const payload = {
        transferControlNumber: this.props.tcn,
        approvingOfficialEmail: this.state.email,
      };

      this.propertyApi
        .updateAoDetails(payload)
        .then((resp) => {
          if (resp.status === 200) {
            this.props.afterSaveAction(true);
          } else this.props.afterSaveAction(false);
        })
        .catch((error) => {
          this.props.afterSaveAction(false);
        });
    }
  };

  handleClose(event) {
    this.props.handleClose();
  }

  handleEmailChange = (value: any, validation: any) => {
    this.setState({
      isEmailValid: validation === undefined ? false : !validation.isInvalid,
      errorMessage:
        validation === undefined
          ? "Email is Required."
          : validation.validationError,
      email: value,
    });

    if (value === this.props.oldAo?.emailAddress) {
      return;
    }

    if (validation !== undefined && !validation.isInvalid) {
      this.userApiService
        .getApprovingOfficialByEmail(value)
        .then((resp) => {
          if (resp.status === 200) {
            this.setState({
              aoFirstName: resp.data.firstName,
              aoLastName: resp.data.lastName,
              aoPhoneNumber: formatPhone(resp.data.phoneNumber + ""),
              aoPhoneExtension: formatExtension(resp.data.phoneExt + ""),
              aoMiddleName: resp.data.middleName,
              aoFax: resp.data.fax,
              aoBureauCd: resp.data.agencyBureauCd,
              aoUser: resp.data,
              isEmailValid: true,
            });
            if(resp.data.agencyBureauCd !== this.props?.requestorAgencyBureauCd?.toString()){
              this.setState({
                email: value,
                errorMessage:
                  "Requestor and AO does not belong to same agency",

                isEmailValid: false,
              });
            }
          } else if (resp.status === 204) {
            this.setState({
              email: value,
              errorMessage:
                "User with email exists but does not have Approving Official permission",

              isEmailValid: false,
            });
          }
        })
        .catch((error) => {
          if (error.status === 400) {
            this.setState({
              email: value,
              errorMessage: "User with email does not exist",
              isEmailValid: false,
            });
          }
        });
    }
  };

  modalBody() {
    return (
      <>
        <div className="grid-row">
          <div className="grid-col">
            <PPMSEmail
              id={"ao-email"}
              required={true}
              disabled={false}
              email={this.state.email}
              emailLabel={"Email Address"}
              isValid={this.state.isEmailValid}
              isInvalid={!this.state.isEmailValid}
              validationMessage={this.state.errorMessage}
              onChangeEmail={(value: any)=> this.setState({email:value})}
              updateEmail={this.handleEmailChange}
              maxLength={52}
            />
          </div>
        </div>
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <PPMSInput
              isDisabled={true}
              id={"edit-acc-firstName"}
              name={"edit-acc-firstname"}
              inputType={"text"}
              label={"First Name"}
              minLength={1}
              placeHolder={"First Name"}
              isRequired={true}
              value={this.state.aoFirstName}
            />
          </div>
          <div className="grid-col grid-gap-1">
            <PPMSInput
              isDisabled={true}
              id={"edit-acc-middleName"}
              name={"edit-acc-middlename"}
              inputType={"text"}
              label={"Middle Name"}
              minLength={1}
              placeHolder={"Middle Name"}
              value={this.state.aoMiddleName}
            />
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <PPMSInput
              isDisabled={true}
              id={"edit-acc-lastName"}
              name={"edit-acc-lastname"}
              inputType={"text"}
              label={"Last Name"}
              minLength={1}
              placeHolder={"Last Name"}
              isRequired={true}
              value={this.state.aoLastName}
            />
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <PPMSInput
              isDisabled={true}
              id={"edit-acc-bureau"}
              name={"edit-acc-bureau"}
              inputType={"text"}
              label={"Agency Bureau"}
              minLength={1}
              placeHolder={"Agency Bureau"}
              isRequired={true}
              value={this.state.aoBureauCd}
            />
          </div>
        </div>
        <div className="grid-row grid-gap">
          <div className="grid-col-8">
            <PPMSInput
              isDisabled={true}
              id={"edit-acc-phone"}
              name={"edit-acc-phone"}
              inputType={"text"}
              label={"Phone"}
              minLength={1}
              placeHolder={"Phone"}
              isRequired={true}
              value={this.state.aoPhoneNumber}
            />
          </div>
          <div className="grid-col-4 grid-gap-2">
            <PPMSInput
              isDisabled={true}
              id={"edit-acc-phone-extn"}
              name={"edit-acc-phon-extne"}
              inputType={"text"}
              label={"Extn."}
              minLength={1}
              placeHolder={"Extn."}
              value={this.state.aoPhoneExtension}
            />
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <PPMSInput
              isDisabled={true}
              id={"edit-acc-fax"}
              name={"edit-acc-fax"}
              inputType={"text"}
              label={"Fax"}
              minLength={1}
              placeHolder={"Fax"}
              isRequired={false}
              value={this.state.aoFax}
            />
          </div>
        </div>
      </>
    );
  }

  render() {
    return (
      <PPMSModal
        body={this.modalBody()}
        id={"approving-agency-update"}
        show={this.state.showModal}
        handleClose={(event) => {
          this.setState({
            showModal: false,
          });
          this.handleClose(event);
        }}
        handleSave={this.handleSave}
        title={"Approving Official Information"}
        label={"Save"}
        labelCancel={"Cancel"}
        backdrop={"static"}
      />
    );
  }
}
