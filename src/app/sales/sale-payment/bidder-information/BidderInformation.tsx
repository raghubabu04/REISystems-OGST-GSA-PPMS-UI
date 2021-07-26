import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSEmail } from "../../../../ui-kit/components/PPMS-email";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { SalePaymentContext } from "../PaymentContext";

interface BidderInformationProps {}

function BidderInformation(props: BidderInformationProps) {
  const { bidderInformationState, updateBidderInformationState } = useContext(
    SalePaymentContext
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
  }, [bidderInformationState]);

  function validateForm() {
    onBlurFirstName(bidderInformationState.firstName);
    onBlurLastName(bidderInformationState.lastName);
  }

  function onBlurFirstName(value) {
    let valid = value.replace(/\s+/g, "").length > 0;
    updateBidderInformationState({
      firstNameIsInValid: !valid,
      firstNameIsValid: valid,
      firstNameValidationMessage:valid ? "": "First name is required.",
    });
  }

  function onBlurLastName(value) {
    let valid = value.replace(/\s+/g, "").length > 0;
    updateBidderInformationState({
      lastNameIsInValid: !valid,
      lastNameIsValid: valid,
      lastNameValidationMessage:valid ? "" :  "Last name is required.",
    });
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-10">
          <PPMSInput
            id={"bidder-company-name"}
            name={"companyName"}
            label={"Company Name"}
            value={bidderInformationState.companyName}
            onBlur={(event) => {}}
            onChange={(event) => {
              updateBidderInformationState({
                companyName: event.target.value,
              });
            }}
            isDisabled={false}
            inputType={"text"}
            isInvalid={bidderInformationState.companyNameIsInValid}
            isValid={bidderInformationState.companyNameIsValid}
            isRequired={false}
            validationMessage={
              bidderInformationState.companyNameValidationMessage
            }
            maxLength={30}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSInput
            id={"bidder-first-name"}
            name={"firstName"}
            label={"First Name"}
            value={bidderInformationState.firstName}
            onBlur={(event) => {
              onBlurFirstName(event.target.value);
            }}
            onChange={(event) => {
              updateBidderInformationState({
                firstName: event.target.value,
                firstNameIsInValid: false,
                firstNameIsValid: false,
                firstNameValidationMessage: "",
              });
            }}
            isDisabled={false}
            inputType={"text"}
            isInvalid={bidderInformationState.firstNameIsInValid}
            isValid={bidderInformationState.firstNameIsValid}
            isRequired={true}
            validationMessage={
              bidderInformationState.firstNameValidationMessage
            }
            maxLength={30}
          />
        </div>
        <div className="grid-col-5">
          <PPMSInput
            id={"bidder-last-name"}
            name={"lastName"}
            label={"Last Name"}
            value={bidderInformationState.lastName}
            onBlur={(event) => {
              onBlurLastName(event.target.value);
            }}
            onChange={(event) => {
              updateBidderInformationState({
                lastName: event.target.value,
                lastNameIsInValid: false,
                lastNameIsValid: false,
                lastNameValidationMessage: "",
              });
            }}
            isDisabled={false}
            inputType={"text"}
            isInvalid={bidderInformationState.lastNameIsInValid}
            isValid={bidderInformationState.lastNameIsValid}
            isRequired={true}
            validationMessage={bidderInformationState.lastNameValidationMessage}
            maxLength={30}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className="grid-col-6">
          <PPMSEmail
            id={"bidder-email"}
            email={bidderInformationState.emailAddress}
            onChangeEmail={(value) => {
              updateBidderInformationState({
                emailAddress: value,
                emailAddressIsInValid: false,
                emailAddressIsValid: false,
                emailAddressValidationMessage: "",
              });
            }}
            isValid={bidderInformationState.emailAddressIsValid}
            isInvalid={bidderInformationState.emailAddressIsInValid}
            emailLabel={"Email Address"}
            validationMessage={
              bidderInformationState.emailAddressValidationMessage
            }
            updateEmail={(value, validation) => {
              updateBidderInformationState({
                emailAddressIsValid: !validation.isInvalid,
                emailAddressIsInValid: validation.isInvalid,
                emailAddressValidationMessage: validation.validationError,
              });
            }}
            required={false}
            maxLength={64}
          />
        </div>
        <PPMSPhoneNumber
          id={"bidder-phoneNumber"}
          required={false}
          disabled={false}
          phone={bidderInformationState.phoneNumber}
          isInvalid={bidderInformationState.phoneNumberIsInValid}
          isValid={bidderInformationState.phoneNumberIsValid}
          validationMessage={
            bidderInformationState.phoneNumberValidationMessage
          }
          showExtension={false}
          onChangePhoneNumber={(value) => {
            updateBidderInformationState({
              phoneNumber: value,
              phoneNumberIsInValid: false,
              phoneNumberIsValid: false,
              phoneNumberValidationMessage: "",
            });
          }}
          updatePhoneNumber={(value: any, validation: any) => {
            if (value.length !== 0) {
              updateBidderInformationState({
                phoneNumberIsInValid: validation.isInvalid,
                phoneNumberIsValid: !validation.isInvalid,
                phoneNumberValidationMessage: validation.validationError,
              });
            }
          }}
        />
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(BidderInformation);
