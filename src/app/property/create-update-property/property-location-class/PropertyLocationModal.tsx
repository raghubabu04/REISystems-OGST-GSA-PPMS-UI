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

interface PropertyLocationModalState {
  propAddress1: string;
  propAddress1IsInvalid: boolean;
  propAddress1IsValid: boolean;
  propAddress1ValidationMessage: string;
  propAddress2: string;
  propAddress2IsInvalid: boolean;
  propAddress2IsValid: boolean;
  propAddress2ValidationMessage: string;
  propAddress3: string;
  propAddress3IsInvalid: boolean;
  propAddress3IsValid: boolean;
  propAddress3ValidationMessage: string;
  propCity: string;
  propCityIsInvalid: boolean;
  propCityIsValid: boolean;
  propCityValidationMessage: string;
  propStateCode: string;
  propState: string;
  propStateDefault: string;
  propStateIsInvalid: boolean;
  propStateIsValid: boolean;
  propStateValidationMessage: string;
  propZipCode: string;
  propZipIsInvalid: boolean;
  propZipIsValid: boolean;
  propZipValidationMessage: string;
  propZip2Code: string;
  propZip2IsInvalid: boolean;
  propZip2IsValid: boolean;
  propZip2ValidationMessage: string;
  modalShow: boolean;
  disabledZipExtension: boolean;
}

const PropertyLocationModalDefaults: PropertyLocationModalState = {
  propAddress1: "",
  propAddress1IsInvalid: false,
  propAddress1IsValid: false,
  propAddress1ValidationMessage: "",
  propAddress2: "",
  propAddress2IsInvalid: false,
  propAddress2IsValid: false,
  propAddress2ValidationMessage: "",
  propAddress3: "",
  propAddress3IsInvalid: false,
  propAddress3IsValid: false,
  propAddress3ValidationMessage: "",
  propCity: "",
  propCityIsInvalid: false,
  propCityIsValid: false,
  propCityValidationMessage: "",
  propStateCode: "",
  propState: "",
  propStateDefault: "",
  propStateIsInvalid: false,
  propStateIsValid: false,
  propStateValidationMessage: "",
  propZipCode: "",
  propZipIsInvalid: false,
  propZipIsValid: false,
  propZipValidationMessage: "",
  propZip2Code: "",
  propZip2IsInvalid: false,
  propZip2IsValid: false,
  propZip2ValidationMessage: "",
  modalShow: false,
  disabledZipExtension: true,
};

interface propertyLocationModalProps {
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

export class PropertyLocationModal extends React.Component<
  propertyLocationModalProps,
  PropertyLocationModalState
> {
  constructor(props) {
    super(props);
    this.state = {
      ...PropertyLocationModalDefaults,
    };
  }

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
      ...PropertyLocationModalDefaults,
    });
    this.props.onModalChange("close");
  };

  validateForm = () => {
    let validateAddressLine1 = this.state.propAddress1.length > 0;
    let validateCity = this.state.propCity.length > 0;
    let validateState = this.state.propStateCode.length > 0;
    let validateZip = zipValidation(this.state.propZipCode, true);
    if (this.state.propZipValidationMessage.indexOf(zipInvalidMessage) !== -1) {
      validateZip.isInvalid = true;
      validateZip.validationError = zipInvalidMessage;
    }

    if (!validateAddressLine1) {
      this.setState({
        propAddress1IsInvalid: true,
        propAddress1IsValid: false,
      });
    } else {
      this.setState({
        propAddress1IsInvalid: false,
        propAddress1IsValid: true,
      });
    }

    if (!validateCity) {
      this.setState({
        propCityIsInvalid: true,
        propCityIsValid: false,
      });
    } else {
      this.setState({
        propCityIsInvalid: false,
        propCityIsValid: true,
      });
    }

    if (!validateState) {
      this.setState({
        propStateIsInvalid: true,
        propStateIsValid: false,
      });
    }

    if (validateZip.isInvalid) {
      this.setState({
        propZipIsInvalid: validateZip.isInvalid,
        propZipIsValid: !validateZip.isInvalid,
        propZipValidationMessage: `Property Location ${validateZip.validationError}`,
      });
    } else {
      this.setState({
        propZipIsInvalid: validateZip.isInvalid,
        propZipIsValid: !validateZip.isInvalid,
        propZipValidationMessage: "",
      });
    }

    if (
      validateAddressLine1 &&
      validateCity &&
      validateState &&
      !validateZip.isInvalid &&
      !this.state.propZip2IsInvalid
    )
      return true;
    else return false;
  };

  modalSave = (event: any) => {
    const { addToast } = this.props.actions;
    let commonService = new CommonApiService();
    if (this.validateForm()) {
      let canUpdate = true;

      this.props.propLocValues.some((propLocValue: any) => {
        if (
          propLocValue["line1"].toLowerCase() ===
            this.state.propAddress1.toLowerCase() &&
          propLocValue["line2"].toLowerCase() ===
            this.state.propAddress2.toLowerCase() &&
          propLocValue["city"].toLowerCase() ===
            this.state.propCity.toLowerCase() &&
          propLocValue["zip"] + "" === this.state.propZipCode
        ) {
          canUpdate = false;
          return true;
        } else {
          return false;
        }
      });
      if (canUpdate) {
        let data = new Map();
        data.set("aacPropertyLocationId", 0);
        data.set("aacCode", this.props.aacCode);
        data.set("line1", this.state.propAddress1);
        data.set("line2", this.state.propAddress2);
        data.set("line3", this.state.propAddress3);
        data.set("city", this.state.propCity);
        data.set("stateCode", this.state.propStateCode);
        data.set("zip", this.state.propZipCode);
        data.set("zip2", this.state.propZip2Code);
        data.set("addressId", 0);

        commonService
          .saveAndUpdatePropertyLocation(Object.fromEntries(data))
          .then((response) => {
            let propKeyDisplayStr =
          
              this.state.propAddress1 +
              "-" +
              this.state.propCity;
            let propLocation = {
              propLocationId: response?.data?.aacPropertyLocationId,
              propAddress1: this.state.propAddress1,
              propAddress2: this.state.propAddress2,
              propAddress3: this.state.propAddress3,
              propCity: this.state.propCity,
              propStateCode: this.state.propStateCode,
              propZipCode: this.state.propZipCode,
              propZip2Code: this.state.propZip2Code,
              addressId: response?.data?.addressId,
              keyDisplayStr: propKeyDisplayStr,
            };

            this.setState({
              ...PropertyLocationModalDefaults,
            });
            addToast({
              text: "Property Location added successfully.",
              type: "success",
              heading: "Success",
            });
            this.props.onModalChange(propLocation);
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
          propAddress1IsInvalid: true,
          propAddress1IsValid: false,
          propAddress1ValidationMessage:
            "Property Location Address Line 1 already exists.",
          propCityIsInvalid: true,
          propCityIsValid: false,
          propCityValidationMessage: "Property Location City already exists.",
          propZipIsInvalid: true,
          propZipIsValid: false,
          propZipValidationMessage: "Property Location Zip Code already exists",
        });
      }
    }
  };

  render() {
    return (
      <>
        <PPMSModal
          id={"PropertyLocationModal"}
          body={
            <div className="modal-adjustment">
              <PPMSAddress
                id={"property-location-agency-modal"}
                title={"Property Location"}
                showAddressLine3={true}
                address1={this.state.propAddress1}
                address1Required={true}
                address1IsInvalid={this.state.propAddress1IsInvalid}
                address1IsValid={this.state.propAddress1IsValid}
                address1ValidationMessage={
                  this.state.propAddress1ValidationMessage
                }
                onChangeAddress1={(value)=>{
                  this.setState({propAddress1: value});
                }
                }
                updateAddress1={(value: any, validation: any) => {
                  let valid = value.length > 0 ? true : false;
                  this.setState(
                    {
                      propAddress1: value,
                      propAddress1IsInvalid: !valid,
                      propAddress1IsValid: valid,
                      propAddress1ValidationMessage: validation.validationError,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                address2={this.state.propAddress2}
                address2Required={false}
                address2IsInvalid={this.state.propAddress2IsInvalid}
                address2IsValid={this.state.propAddress2IsValid}
                address2ValidationMessage={
                  this.state.propAddress2ValidationMessage
                }
                updateAddress2={(value: any) => {
                  this.setState(
                    {
                      propAddress2: value,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                address3={this.state.propAddress3}
                address3Required={false}
                address3IsInvalid={this.state.propAddress3IsInvalid}
                address3IsValid={this.state.propAddress3IsValid}
                address3ValidationMessage={
                  this.state.propAddress3ValidationMessage
                }
                updateAddress3={(value: any, validation: any) => {
                  let valid = value.length > 0 ? true : false;
                  this.setState({
                    propAddress3: value,
                    propAddress3IsInvalid: !valid,
                    propAddress3IsValid: valid,
                    propAddress3ValidationMessage: validation.validationError,
                  });
                }}
                city={this.state.propCity}
                cityRequired={true}
                cityIsInvalid={this.state.propCityIsInvalid}
                cityIsValid={this.state.propCityIsValid}
                cityValidationMessage={this.state.propCityValidationMessage}
                onChangeCity={(value)=>{
                  this.setState({
                    propCity: value})
                  }
                }
                updateCity={(value: any, validation: any) => {
                  this.setState(
                    {
                      propCity: value,
                      propCityIsInvalid: validation.isInvalid,
                      propCityIsValid: !validation.isInvalid,
                      propCityValidationMessage: validation.validationError,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                state={this.state.propStateCode}
                stateRequired={true}
                stateIsInvalid={this.state.propStateIsInvalid}
                stateIsValid={this.state.propStateIsValid}
                updateState={(value: any, validation: any) => {
                  this.setState({
                    propStateCode: value,
                    propStateIsInvalid: validation.isInvalid,
                    propStateIsValid: !validation.isInvalid,
                    propStateValidationMessage: validation.validationError,
                  });
                }}
                zip={this.state.propZipCode}
                showZipExtension={true}
                zipRequired={true}
                zipIsInvalid={this.state.propZipIsInvalid}
                zipIsValid={this.state.propZipIsValid}
                zipValidationMessage={this.state.propZipValidationMessage}
                onChangeZip={(value)=>{
                  this.setState({
                    propZipCode: value
                  })
                }}
                updateZip={(
                  value: any,
                  inValid: boolean,
                  valid: boolean,
                  validationError: string,
                  disabledZipExtension: boolean
                ) => {
                  this.setState(
                    {
                      propZipCode: value,
                      propZipIsInvalid: inValid,
                      propZipIsValid: valid,
                      propZipValidationMessage: validationError,
                      disabledZipExtension: disabledZipExtension,
                    },
                    () => {
                      this.validateForm();
                    }
                  );
                }}
                zip2={this.state.propZip2Code}
                zip2IsInvalid={this.state.propZip2IsInvalid}
                zip2IsValid={this.state.propZip2IsValid}
                disabledZipExtension={this.state.disabledZipExtension}
                validationExtensionMessage={
                  this.state.propZip2ValidationMessage
                }
                onChangeZipExtension={(value)=>{
                  this.setState({
                    propZip2Code: value})
                }}
                updateZipExtension={(
                  value: any,
                  inValid: boolean,
                  valid: boolean,
                  validationError: string
                ) => {
                  this.setState({
                    propZip2Code: value,
                    propZip2IsInvalid: inValid,
                    propZip2IsValid: valid,
                    propZip2ValidationMessage: validationError,
                  });
                }}
              />
            </div>
          }
          title={"Add Property Location"}
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
export default connect(null, mapDispatchToProps)(PropertyLocationModal);
