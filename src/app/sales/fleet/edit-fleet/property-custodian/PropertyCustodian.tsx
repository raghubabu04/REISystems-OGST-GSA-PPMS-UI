import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { FleetContext } from "../Fleet-context";
import { PPMSEmail } from "../../../../../ui-kit/components/PPMS-email";
import { PPMSFormattedPhoneFax } from "../../../../../ui-kit/components/PPMS-formatted-phone-fax";
import { PPMSPhoneNumber } from "../../../../../ui-kit/components/PPMS-phone-number";
import { isFormSubmitted } from "../../../../../service/validation.service";
import {
  validateEmailAddress,
  validatePhoneFax,
} from "../../../../../ui-kit/components/validations/FieldValidations";

interface PropertyCustodianProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function PropertyCustodian(props: PropertyCustodianProps) {
  const { propertyCustodianState, updatePropertyCustodianState } = useContext(
    FleetContext
  );

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [propertyCustodianState]);

  function validateForm() {
    let custodianState = propertyCustodianState;
    let custodianNameValid = custodianState.custodianName.length > 0;
    let validateEmail = validateEmailAddress(custodianState.emailAddress);
    let validationPhone = validatePhoneFax(custodianState.phoneNumber);
    if (!custodianNameValid) {
      custodianState.custodianNameIsInValid = true;
      custodianState.custodianNameIsValid = false;
      custodianState.custodianNameValidationMessage =
        "Property Custodian Name is Required.";
    }
    custodianState.emailAddressIsInValid = validateEmail.isInvalid;
    custodianState.emailAddressIsValid = !validateEmail.isInvalid;
    custodianState.emailAddressValidationMessage = validateEmail.isInvalid
      ? `Property Custodian ${validateEmail.validationError}`
      : "";

    custodianState.phoneNumberIsInValid = validationPhone.isInvalid;
    custodianState.phoneNumberIsValid = !validationPhone.isInvalid;
    custodianState.phoneNumberValidationMessage = validationPhone.isInvalid
      ? `Property Custodian ${validationPhone.validationError}`
      : "";

    updatePropertyCustodianState(custodianState);
  }

  return (
    <>
      <div className={"grid-row"}>
        <PPMSInput
          id={"fleetCustodianName"}
          inputType={"text"}
          label={"Property Custodian Name"}
          labelBold={false}
          isRequired={true}
          maxLength={30}
          minLength={1}
          isDisabled={false}
          placeHolder={" "}
          value={propertyCustodianState.custodianName}
          onChange={(event) => {
            updatePropertyCustodianState({
              custodianName: event.target.value,
              custodianNameIsValid: false,
              custodianNameIsInValid: false,
              custodianNameValidationMessage: "",
            });
          }}
          onBlur={(event) => {
            let valid = event.target.value.length !== 0;
            updatePropertyCustodianState({
              custodianNameIsValid: valid,
              custodianNameIsInValid: !valid,
              custodianNameValidationMessage: valid
                ? ""
                : "Property Custodian Name is Required.",
            });
          }}
          isValid={propertyCustodianState.custodianNameIsValid}
          isInvalid={propertyCustodianState.custodianNameIsInValid}
          validationMessage={
            propertyCustodianState.custodianNameValidationMessage
          }
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <PPMSPhoneNumber
          id={"fleetPhoneNumber"}
          required={true}
          disabled={false}
          phone={propertyCustodianState.phoneNumber}
          isInvalid={propertyCustodianState.phoneNumberIsInValid}
          isValid={propertyCustodianState.phoneNumberIsValid}
          validationMessage={
            propertyCustodianState.phoneNumberValidationMessage
          }
          showExtension={false}
          onChangePhoneNumber={(value) => {
            updatePropertyCustodianState({
              phoneNumber: value,
              phoneNumberIsInValid: false,
              phoneNumberIsValid: false,
              phoneNumberValidationMessage: "",
            });
          }}
          updatePhoneNumber={(value: any, validation: any) => {
            updatePropertyCustodianState({
              phoneNumberValidationMessage: validation.isInvalid
                ? `Property Custodian ${validation.validationError}`
                : "",
              phoneNumberIsInValid: validation.isInvalid,
              phoneNumberIsValid: !validation.isInvalid,
            });
          }}
          maxLength={10}
        />
        <PPMSFormattedPhoneFax
          id={"fleetCustodianFax"}
          required={false}
          disabled={false}
          phoneFax={propertyCustodianState.faxNumber}
          onChangePhoneFax={(value) => {
            updatePropertyCustodianState({
              faxNumber: value,
              faxNumberIsInValid: false,
              faxNumberIsValid: false,
              faxNumberValidationMessage: "",
            });
          }}
          updatePhoneFax={(value: any, validation: any) => {
            updatePropertyCustodianState({
              faxNumberValidationMessage: !validation.isInvalid
                ? ""
                : `Property Custodian ${validation.validationError}`,
              faxNumberIsInValid: validation.isInvalid,
              faxNumberIsValid: !validation.isInvalid,
            });
          }}
          maxLength={14}
          isValid={propertyCustodianState.faxNumberIsValid}
          isInvalid={propertyCustodianState.faxNumberIsInValid}
          validationMessage={propertyCustodianState.faxNumberValidationMessage}
          numberFormatType="Fax"
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-8"}>
          <PPMSEmail
            id={"fleetCustodianEmail"}
            required={true}
            disabled={false}
            email={propertyCustodianState.emailAddress}
            emailLabel={"Email Address"}
            isValid={propertyCustodianState.emailAddressIsValid}
            isInvalid={propertyCustodianState.emailAddressIsInValid}
            validationMessage={
              propertyCustodianState.emailAddressValidationMessage
            }
            onChangeEmail={(value: any) => {
              updatePropertyCustodianState({
                emailAddress: value,
                emailAddressIsValid: false,
                emailAddressIsInValid: false,
                emailAddressValidationMessage: "",
              });
            }}
            updateEmail={(value: any, validation: any) => {
              updatePropertyCustodianState({
                emailAddressIsValid: !validation.isInvalid,
                emailAddressIsInValid: validation.isInvalid,
                emailAddressValidationMessage: validation.isInvalid
                  ? `Property Custodian ${validation.validationError}.`
                  : "",
              });
            }}
            maxLength={64}
          />
        </div>
        <div className={"grid-col-8"}>
          <PPMSEmail
            id={"fleetCustodianCcEmail"}
            required={false}
            disabled={false}
            email={propertyCustodianState.ccEmailAddress}
            emailLabel={"CC Email Address"}
            isValid={propertyCustodianState.ccEmailAddressIsValid}
            isInvalid={propertyCustodianState.ccEmailAddressIsInValid}
            validationMessage={
              propertyCustodianState.ccEmailAddressValidationMessage
            }
            onChangeEmail={(value: any) => {
              updatePropertyCustodianState({
                ccEmailAddress: value,
                ccEmailAddressIsValid: false,
                ccEmailAddressIsInValid: false,
                ccEmailAddressValidationMessage: "",
              });
            }}
            updateEmail={(value: any, validation: any) => {
              updatePropertyCustodianState({
                ccEmailAddressIsValid: !validation.isInvalid,
                ccEmailAddressIsInValid: validation.isInvalid,
                ccEmailAddressValidationMessage: validation.isInvalid
                  ? `Property Custodian ${validation.validationError}`
                  : "",
              });
            }}
            maxLength={64}
          />
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(PropertyCustodian);
