import React from "react";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PPMSAddress } from "../../../../ui-kit/components/PPMS-address";
import {
  zipValidation,
  zipInvalidMessage,
} from "../../../../ui-kit/components/validations/FieldValidations";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";

interface RepAgencyAddressModalState {
  repAddress1: string;
  repAddress1IsInvalid: boolean;
  repAddress1IsValid: boolean;
  repAddress1ValidationMessage: string;
  repAddress2: string;
  repAddress2IsInvalid: boolean;
  repAddress2IsValid: boolean;
  repAddress2ValidationMessage: string;
  repAddress3: string;
  repAddress3IsInvalid: boolean;
  repAddress3IsValid: boolean;
  repAddress3ValidationMessage: string;
  repCity: string;
  repCityIsInvalid: boolean;
  repCityIsValid: boolean;
  repCityValidationMessage: string;
  repStateCode: string;
  repState: string;
  repStateDefault: string;
  repStateIsInvalid: boolean;
  repStateIsValid: boolean;
  repStateValidationMessage: string;
  repZipCode: string;
  repZipIsInvalid: boolean;
  repZipIsValid: boolean;
  repZipValidationMessage: string;
  repZip2Code: string;
  repZip2IsInvalid: boolean;
  repZip2IsValid: boolean;
  repZip2ValidationMessage: string;
  modalShow: boolean;
  disabledZipExtension: boolean;
}

const RepAgencyAddressModalStateDefaults: RepAgencyAddressModalState = {
  repAddress1: "",
  repAddress1IsInvalid: false,
  repAddress1IsValid: false,
  repAddress1ValidationMessage: "",
  repAddress2: "",
  repAddress2IsInvalid: false,
  repAddress2IsValid: false,
  repAddress2ValidationMessage: "",
  repAddress3: "",
  repAddress3IsInvalid: false,
  repAddress3IsValid: false,
  repAddress3ValidationMessage: "",
  repCity: "",
  repCityIsInvalid: false,
  repCityIsValid: false,
  repCityValidationMessage: "",
  repStateCode: "",
  repState: "",
  repStateDefault: "",
  repStateIsInvalid: false,
  repStateIsValid: false,
  repStateValidationMessage: "",
  repZipCode: "",
  repZipIsInvalid: false,
  repZipIsValid: false,
  repZipValidationMessage: "",
  repZip2Code: "",
  repZip2IsInvalid: false,
  repZip2IsValid: false,
  repZip2ValidationMessage: "",
  modalShow: false,
  disabledZipExtension: true,
};

interface RepAgencyAddressModalProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
  onModalChange?: any;
  aacCode?: any;
  repLocValues?: any;
  modalOpen?: any;
}

export class RepAgencyAddressModal extends React.Component<
  RepAgencyAddressModalProps,
  RepAgencyAddressModalState
> {
  constructor(props) {
    super(props);
    this.state = {
      ...RepAgencyAddressModalStateDefaults,
    };
  }

  private commonApiService = new CommonApiService();

  componentWillReceiveProps(newProps) {
    if (this.state.modalShow !== newProps.modalOpen) {
      this.setState({ modalShow: newProps.modalOpen });
    }
  }

  modalOpen = () => {
    this.setState({ modalShow: true });
  };
  modalHide = () => {
    this.setState({
      ...RepAgencyAddressModalStateDefaults,
    });
    this.props.onModalChange("close");
  };

  validateForm = () => {
    let validateAddressLine1 = this.state.repAddress1.length > 0;
    let validateCity = this.state.repCity.length > 0;
    let validateState = this.state.repStateCode.length > 0;
    let validateZip = zipValidation(this.state.repZipCode, true);

    if (this.state.repZipValidationMessage.indexOf(zipInvalidMessage) !== -1) {
      validateZip.isInvalid = true;
      validateZip.validationError = zipInvalidMessage;
    }

    if (!validateAddressLine1) {
      this.setState({
        repAddress1IsInvalid: true,
        repAddress1IsValid: false,
      });
    } else {
      this.setState({
        repAddress1IsInvalid: false,
        repAddress1IsValid: true,
        repAddress1ValidationMessage: "",
      });
    }

    if (!validateCity) {
      this.setState({
        repCityIsInvalid: true,
        repCityIsValid: false,
      });
    } else {
      this.setState({
        repCityIsInvalid: false,
        repCityIsValid: true,
        repCityValidationMessage: "",
      });
    }

    if (!validateState) {
      this.setState({
        repStateIsInvalid: true,
        repStateIsValid: false,
      });
    }

    if (validateZip.isInvalid) {
      this.setState({
        repZipIsInvalid: validateZip.isInvalid,
        repZipIsValid: !validateZip.isInvalid,
        repZipValidationMessage: `Reporting Agency ${validateZip.validationError}`,
      });
    } else {
      this.setState({
        repZipIsInvalid: validateZip.isInvalid,
        repZipIsValid: !validateZip.isInvalid,
        repZipValidationMessage: "",
      });
    }
    if (
      validateAddressLine1 &&
      validateCity &&
      validateState &&
      !validateZip.isInvalid &&
      !this.state.repZip2IsInvalid
    )
      return true;
    else return false;
  };

  modalSave = (event: any) => {
    const { addToast } = this.props.actions;
    if (this.validateForm()) {
      let data = new Map();
      data.set("aacReportingAddressId", 0);
      data.set("aacCode", this.props.aacCode);
      data.set("line1", this.state.repAddress1);
      data.set("line2", this.state.repAddress2);
      data.set("line3", this.state.repAddress3);
      data.set("city", this.state.repCity);
      data.set("stateCode", this.state.repStateCode);
      data.set("zip", this.state.repZipCode);
      data.set("zip2", this.state.repZip2Code);
      data.set("addressId", 0);
      let canUpdate = true;

      this.props.repLocValues.some((repLocValue: any) => {
        if (
          repLocValue["line1"].toLowerCase() ===
            this.state.repAddress1.toLowerCase() &&
          repLocValue["line2"].toLowerCase() ===
            this.state.repAddress2.toLowerCase() &&
          repLocValue["city"].toLowerCase() ===
            this.state.repCity.toLowerCase() &&
          repLocValue["zip"] + "" === this.state.repZipCode
        ) {
          canUpdate = false;
          return true;
        } else {
          return false;
        }
      });
      if (canUpdate) {
        this.commonApiService
          .saveAndUpdateReportingAddress(Object.fromEntries(data))
          .then((response) => {
            let repKeyDisplayStr =
           
              this.state.repAddress1 +
              "-" +
              this.state.repCity;
            let repLocation = {
              repAddressId: response?.data?.aacReportingAddressId,
              repAddress1: this.state.repAddress1,
              repAddress2: this.state.repAddress2,
              repAddress3: this.state.repAddress3,
              repCity: this.state.repCity,
              repStateCode: this.state.repStateCode,
              repZipCode: this.state.repZipCode,
              repZip2Code: this.state.repZip2Code,
              addressId: response?.data?.addressId,
              keyDisplayStr: repKeyDisplayStr,
            };

            this.setState({
              ...RepAgencyAddressModalStateDefaults,
            });
            addToast({
              text: "Reporting Agency Address added successfully.",
              type: "success",
              heading: "Success",
            });
            this.props.onModalChange(repLocation);
          })
          .catch(() => {
            addToast({
              text: "Error occurred.",
              type: "error",
              heading: "Error",
            });
          });
      } else {
        this.setState({
          repAddress1IsInvalid: true,
          repAddress1IsValid: false,
          repAddress1ValidationMessage:
            "Reporting Agency Address Line 1 already exists.",
          repAddress2IsInvalid: true,
          repAddress2IsValid: false,
          repAddress2ValidationMessage:
            "Reporting Agency Address Line 2 already exists.",
          repCityIsInvalid: true,
          repCityIsValid: false,
          repCityValidationMessage: "Reporting Agency City already exists.",
          repZipIsInvalid: true,
          repZipIsValid: false,
          repZipValidationMessage: "Reporting Agency Zip Code already exists",
        });
      }
    }
  };

  render() {
    return (
      <>
        <PPMSModal
          id={"RepAgencyAddressModal"}
          body={
            <div className="modal-adjustment">
              <PPMSAddress
                id={"reporting-agency-modal"}
                title={"Reporting Agency"}
                showAddressLine3={true}
                address1={this.state.repAddress1}
                address1Required={true}
                address1IsInvalid={this.state.repAddress1IsInvalid}
                address1IsValid={this.state.repAddress1IsValid}
                address1ValidationMessage={
                  this.state.repAddress1ValidationMessage
                }
                onChangeAddress1={(value)=>{
                  this.setState({repAddress1: value});
                }}
                updateAddress1={(value: any, validation: any) => {
                  let valid = value.length > 0 ? true : false;
                  this.setState(
                    {
                      repAddress1: value,
                      repAddress1IsInvalid: !valid,
                      repAddress1IsValid: valid,
                      repAddress1ValidationMessage: validation.validationError,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                address2={this.state.repAddress2}
                address2Required={false}
                address2IsInvalid={this.state.repAddress2IsInvalid}
                address2IsValid={this.state.repAddress2IsValid}
                address2ValidationMessage={
                  this.state.repAddress2ValidationMessage
                }
                updateAddress2={(value: any, validation: any) => {
                  let valid = value.length > 0 ? true : false;
                  this.setState(
                    {
                      repAddress2: value,
                      repAddress2IsInvalid: !valid,
                      repAddress2IsValid: valid,
                      repAddress2ValidationMessage: validation.validationError,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                address3={this.state.repAddress3}
                address3Required={false}
                address3IsInvalid={this.state.repAddress3IsInvalid}
                address3IsValid={this.state.repAddress3IsValid}
                address3ValidationMessage={
                  this.state.repAddress3ValidationMessage
                }
                updateAddress3={(value: any, validation: any) => {
                  let valid = value.length > 0 ? true : false;
                  this.setState({
                    repAddress3: value,
                    repAddress3IsInvalid: !valid,
                    repAddress3IsValid: valid,
                    repAddress3ValidationMessage: validation.validationError,
                  });
                }}
                city={this.state.repCity}
                cityRequired={true}
                cityIsInvalid={this.state.repCityIsInvalid}
                cityIsValid={this.state.repCityIsValid}
                cityValidationMessage={this.state.repCityValidationMessage}
                onChangeCity={(value)=>{
                  this.setState({
                    repCity: value})
                  }
                }
                updateCity={(value: any, validation: any) => {
                  let valid = value.length > 0 ? true : false;
                  this.setState(
                    {
                      repCity: value,
                      repCityIsInvalid: !valid,
                      repCityIsValid: valid,
                      repCityValidationMessage: validation.validationError,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                state={this.state.repStateCode}
                stateRequired={true}
                stateIsInvalid={this.state.repStateIsInvalid}
                stateIsValid={this.state.repStateIsValid}
                updateState={(value: any, validation: any) => {
                  this.setState({
                    repStateCode: value,
                    repState: value,
                    repStateIsInvalid: validation.isInvalid,
                    repStateIsValid: !validation.isInvalid,
                    repStateValidationMessage: validation.validationError,
                  });
                }}
                showZipExtension={true}
                zip={this.state.repZipCode}
                zipRequired={true}
                zipIsInvalid={this.state.repZipIsInvalid}
                zipIsValid={this.state.repZipIsValid}
                zipValidationMessage={this.state.repZipValidationMessage}
                onChangeZip={(value)=>{
                  this.setState(
                    {
                      repZipCode: value})
                }
              }
                updateZip={(
                  value: any,
                  inValid: boolean,
                  valid: boolean,
                  validationError: string,
                  disabledZipExtension: boolean
                ) => {
                  this.setState(
                    {
                      repZipCode: value,
                      repZipIsInvalid: inValid,
                      repZipIsValid: valid,
                      repZipValidationMessage: validationError,
                      disabledZipExtension: disabledZipExtension,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                zip2={this.state.repZip2Code}
                zip2IsInvalid={this.state.repZip2IsInvalid}
                zip2IsValid={this.state.repZip2IsValid}
                disabledZipExtension={this.state.disabledZipExtension}
                validationExtensionMessage={this.state.repZip2ValidationMessage}
                onChangeZipExtension={(value)=>{
                  this.setState({
                    repZip2Code: value
                  })
                }}
                updateZipExtension={(
                  value: any,
                  inValid: boolean,
                  valid: boolean,
                  validationError: string
                ) => {
                  this.setState({
                    repZip2Code: value,
                    repZip2IsInvalid: inValid,
                    repZip2IsValid: valid,
                    repZip2ValidationMessage: validationError,
                  });
                }}
              />
            </div>
          }
          title={"Add Reporting Agency Address"}
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
export default connect(null, mapDispatchToProps)(RepAgencyAddressModal);
