import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { FleetContext } from "../Fleet-context";
import { isFormSubmitted } from "../../../../../service/validation.service";
import {
  validateEmptyCheck,
  validatePhoneNumber,
  validateEmailAddress,
} from "../validations/fleetValidations";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSPhoneNumber } from "../../../../../ui-kit/components/PPMS-phone-number";
import { UserApiService } from "../../../../../api-kit/user/user-api.service";
import { pointOfContactStateDefault } from "./PointOfContactState";

interface PointOfContactProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

function PointOfContactState(props: PointOfContactProps) {
  const { pointOfContactState, updatePointOfContactState } = useContext(
    FleetContext
  );

  const userApiService = new UserApiService();

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
  }, [pointOfContactState]);

  useEffect(() => {
    userApiService
      .getFleetUserList()
      .then((response) => {
        let pointOfContactOptions = response.data;
        for (let item of pointOfContactOptions) {
          let displayName = item.lastName + ":  " + item.email;
          item["displayName"] = displayName;
        }
        updatePointOfContactState({
          pointOfContactOptions: pointOfContactOptions,
        });
      })
      .catch((error) => {
        addToast({
          text: "Error fetching the fleet user data.",
          type: "error",
          heading: "Error",
        });
      });
  }, []);

  function validateForm() {
    //First Name
    let errorFirstName = validateEmptyCheck(pointOfContactState.firstName);
    if (errorFirstName.isInvalid) {
      updatePointOfContactState({
        isFirstNameInvalid: errorFirstName.isInvalid,
      });
    }
    //Last Name
    let errorLastName = validateEmptyCheck(pointOfContactState.lastName);
    if (errorLastName.isInvalid) {
      updatePointOfContactState({
        isLastNameInvalid: errorLastName.isInvalid,
      });
    }
    //Phone Number
    let errorPhone = validatePhoneNumber(pointOfContactState.phoneNumber);
    if (errorPhone.isInvalid) {
      updatePointOfContactState({
        isPhoneNumberInvalid: errorPhone.isInvalid,
        phoneNumberInvalidErrorMessage: errorPhone.validationError,
      });
    }
    //Email
    let errorEmail = validateEmailAddress(pointOfContactState.email, false);
    if (errorEmail.isInvalid) {
      updatePointOfContactState({
        emailIsInvalid: errorEmail.isInvalid,
        emailValidationMessage: errorEmail.validationError,
      });
    }
    //CCEmail
    let errorCCEmail = validateEmailAddress(pointOfContactState.ccEmail, true);
    if (errorCCEmail.isInvalid) {
      updatePointOfContactState({
        ccEmailIsInvalid: errorCCEmail.isInvalid,
        ccEmailValidationMessage: errorCCEmail.validationError,
      });
    }
  }

  function handleSelection(value: any) {
    if (!value) {
      updatePointOfContactState({
        ...pointOfContactStateDefault,
        pointOfContactOptions: pointOfContactState.pointOfContactOptions,
      });
    } else {
      const poc = pointOfContactState.pointOfContactOptions.filter(
        (o) => o["displayName"] === value
      );
      if (poc[0]) {
        updatePointOfContactState({
          firstName: poc[0]["firstName"],
          lastName: poc[0]["lastName"],
          phoneNumber: poc[0]["phone"],
          phoneExtension: poc[0]["phoneExt"],
          email: poc[0]["email"],
          ccEmail: poc[0]["ccEmail"],
          displayName: poc[0]["displayName"],
          isFirstNameInvalid: false,
          isLastNameInvalid: false,
          isPhoneNumberInvalid: false,
          emailIsInvalid: false,
          ccEmailIsInvalid: false,
          pocSelected: poc[0]["displayName"],
        });
      }
    }
  }

  function handlePhoneBlur(phoneNumber) {
    let validationPhone = validatePhoneNumber(
      phoneNumber.replace(/[() -    ]/g, "")
    );
    updatePointOfContactState({
      isPhoneNumberInvalid: validationPhone.isInvalid,
      phoneNumberInvalidErrorMessage: validationPhone.validationError,
    });
  }

  function handleEmailBlur(event) {
    let validationEmail = validateEmailAddress(event.target.value, false);
    updatePointOfContactState({
      emailIsInvalid: validationEmail.isInvalid,
      emailValidationMessage: validationEmail.validationError,
    });
  }

  function handleCCEmailBlur(event) {
    let validationCCEmail = validateEmailAddress(event.target.value, true);
    updatePointOfContactState({
      ccEmailIsInvalid: validationCCEmail.isInvalid,
      ccEmailValidationMessage: validationCCEmail.validationError,
    });
  }

  return (
    <>
      <div className={"grid-row"}>
        <div className={"grid-col-8"}>
          <PPMSSelect
            id={"fleet-point-of-contact-select"}
            identifierKey={"displayName"}
            identifierValue={"displayName"}
            name={"pocSelect"}
            values={pointOfContactState.pointOfContactOptions}
            label={"Point Of Contact"}
            isRequired={false}
            placeholderValue={"Select"}
            selectedValue={pointOfContactState.pocSelected}
            onChange={(event) => {
              handleSelection(event.target.value);
            }}
            disabled={false}
            title={"poc-select"}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"fleet-poc-firstname"}
            name={"fleet-poc-firstname"}
            label={"First Name"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={pointOfContactState.firstName}
            onChange={(event) => {
              updatePointOfContactState({
                firstName: event.target.value,
                isFirstNameInvalid: false,
              });
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updatePointOfContactState({ isFirstNameInvalid: true });
              }
            }}
            validationMessage={"Point of contact first name is required"}
            isInvalid={pointOfContactState.isFirstNameInvalid}
            maxLength={12}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"fleet-poc-lastname"}
            name={"fleet-poc-lastname"}
            label={"Last Name"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={pointOfContactState.lastName}
            onChange={(event) => {
              updatePointOfContactState({
                lastName: event.target.value,
                isLastNameInvalid: false,
              });
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                updatePointOfContactState({ isLastNameInvalid: true });
              }
            }}
            validationMessage={"Point of Contact Last Name is Required"}
            isInvalid={pointOfContactState.isLastNameInvalid}
            maxLength={12}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <PPMSPhoneNumber
          id={"fleet-point-of-contact-phonenumber"}
          showExtension={true}
          disabled={false}
          phone={pointOfContactState.phoneNumber}
          maxLength={10}
          required={true}
          updatePhoneNumber={handlePhoneBlur}
          updatePhoneExtension={() => {}}
          isInvalid={pointOfContactState.isPhoneNumberInvalid}
          validationMessage={pointOfContactState.phoneNumberInvalidErrorMessage}
          extension={pointOfContactState.phoneExtension}
          maxLengthExtension={8}
          isExtensionInvalid={false}
          extensionValidationMessage={""}
          onChangePhoneNumber={(value) =>
            updatePointOfContactState({
              phoneNumber: value,
              isPhoneNumberInvalid: false,
            })
          }
          onChangePhoneExt={(value) =>
            updatePointOfContactState({ phoneExtension: value })
          }
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-8"}>
          <PPMSInput
            id={"fleet-poc-email"}
            name={"fleet-poc-email"}
            label={"Email"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={pointOfContactState.email}
            onChange={(event) => {
              updatePointOfContactState({
                email: event.target.value,
              });
            }}
            onBlur={handleEmailBlur}
            validationMessage={pointOfContactState.emailValidationMessage}
            isInvalid={pointOfContactState.emailIsInvalid}
            maxLength={64}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-8"}>
          <PPMSInput
            id={"fleet-poc-cc-email"}
            name={"fleet-poc-cc-email"}
            label={"CC Email"}
            isRequired={false}
            isDisabled={false}
            inputType={"text"}
            value={pointOfContactState.ccEmail}
            onChange={(event) => {
              updatePointOfContactState({
                ccEmail: event.target.value,
              });
            }}
            onBlur={handleCCEmailBlur}
            validationMessage={pointOfContactState.ccEmailValidationMessage}
            isInvalid={pointOfContactState.ccEmailIsInvalid}
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

export default connect(null, mapDispatchToProps)(PointOfContactState);
