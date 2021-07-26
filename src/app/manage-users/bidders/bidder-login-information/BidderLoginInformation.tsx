import { BidderContext } from "../BidderContext";
import React, { useContext, useEffect } from "react";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { BidderConfirmUserDTO } from "../../../models/BidderUser";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { BidderLoginInformationStateJson } from "./BidderLoginInformationState";
import {
  securityAnswerValidation,
  securityQuestionValidation,
} from "../../../../ui-kit/components/validations/FieldValidations";
import { PPMSSecurityQuestion } from "../../../../ui-kit/components/PPMS-security-question";

interface BidderLoginInformationProps { }

export default function BidderLoginInformation(
  props: BidderLoginInformationProps
) {
  const {
    bidderLoginInformationState,
    updateBidderLoginInformationState,
    updateBidderPersonalInformationState,
  } = useContext(BidderContext);
  let userApiService = new UserApiService();

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [bidderLoginInformationState]);

  function handleRegistrationTypeToggle(event) {
    let selectedRegistrationTypeId = "";
    event.forEach((item) => {
      if (item.isSelected) {
        selectedRegistrationTypeId = item.id;
      }
    });
    updateBidderLoginInformationState({
      isConfirmLoginDisabled: false,
      regTypeToggle: selectedRegistrationTypeId,
      isRegTypeToggleInvalid: false,
      regTypeToggleValidationMessage: "",
    });
    if (bidderLoginInformationState.regTypeToggle === "individual") {
      updateBidderPersonalInformationState({
        ein: "",
        confirmEIN: "",
        companyName: "",
      });
    }
    if (bidderLoginInformationState.regTypeToggle === "company") {
      updateBidderPersonalInformationState({
        dateOfBirth: "",
      });
    }
  }

  function handleUsernameChange(event) {
    const username = event.trim().toUpperCase();
    const validation = validateUsername(username);
    updateBidderLoginInformationState({
      isConfirmLoginDisabled: false,
      bidderUsername: username,
      isUsernameInvalid: validation.isInvalid,
      bidderUsernameValidationMessage: validation.validationError,
    });
  }

  function handleSecurityQuestionChange(value) {
    updateBidderLoginInformationState({
      isConfirmLoginDisabled: false,
      bidderSecurityQuestion: value,
    });
  }

  function handleSecurityAnswerChange(answerValue) {
    updateBidderLoginInformationState({
      isConfirmLoginDisabled: false,
      bidderSecurityAnswer: answerValue,
    });
  }

  function validateUsername(username) {
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (username.includes(" ")) {
      validation.isInvalid = true;
      validation.validationError = "User Name cannot contain spaces.";
    } else if (/[#%&/;,'"]/g.test(username)) {
      validation.isInvalid = true;
      validation.validationError =
        "User Name cannot contain the following special characters: #%&/;,'\"";
    }
    return validation;
  }

  function validate() {
    let isValid = true;
    let validation = {
      isRegTypeToggleInvalid: false,
      regTypeToggleValidationMessage: "",
      isUsernameInvalid: false,
      bidderUsernameValidationMessage: "",
      isSecurityQuestionInvalid: false,
      bidderSecurityQuestionValidationMessage: "",
      isSecurityAnswerInvalid: false,
      bidderSecurityAnswerValidationMessage: "",
    };
    if (bidderLoginInformationState.regTypeToggle.length === 0) {
      validation.isRegTypeToggleInvalid = true;
      validation.regTypeToggleValidationMessage =
        "Registration Type is Required";
      isValid = false;
    }
    if (bidderLoginInformationState.bidderUsername.length === 0) {
      validation.isUsernameInvalid = true;
      validation.bidderUsernameValidationMessage = "User Name is Required";
      isValid = false;
    }
    if (bidderLoginInformationState.bidderSecurityQuestion.length === 0) {
      validation.isSecurityQuestionInvalid = true;
      validation.bidderSecurityQuestionValidationMessage =
        "Security Question is Required";
      isValid = false;
    } else {
      let validateSecretAnswer = securityQuestionValidation(bidderLoginInformationState.bidderSecurityQuestion);
      if (validateSecretAnswer.isInvalid === true && validateSecretAnswer.validationError.length !== 0) {
        validation.isSecurityQuestionInvalid = true;
        validation.bidderSecurityQuestionValidationMessage = validateSecretAnswer.validationError;
        isValid = false;
      }
    }

    if (bidderLoginInformationState.bidderSecurityAnswer.length === 0) {
      validation.isSecurityAnswerInvalid = true;
      validation.bidderSecurityAnswerValidationMessage =
        "Security Answer is Required";
      isValid = false;
    } else {
      let validateSecretAnswer = securityAnswerValidation(
        bidderLoginInformationState.bidderSecurityAnswer,
        bidderLoginInformationState.bidderSecurityQuestion
      );
      if (validateSecretAnswer.isInvalid === true && validateSecretAnswer.validationError.length !== 0) {
        validation.isSecurityAnswerInvalid = true;
        validation.bidderSecurityAnswerValidationMessage = validateSecretAnswer.validationError;
        isValid = false;
      }
    }

    if (bidderLoginInformationState.bidderSecurityQuestion === bidderLoginInformationState.bidderSecurityAnswer) {
      validation.isSecurityAnswerInvalid = true;
      validation.bidderSecurityAnswerValidationMessage =
        "Answer cannot be same as security question.";
      isValid = false;
    }

    updateBidderLoginInformationState({
      isRegTypeToggleInvalid: validation.isRegTypeToggleInvalid,
      regTypeToggleValidationMessage: validation.regTypeToggleValidationMessage,
      isUsernameInvalid: validation.isUsernameInvalid,
      bidderUsernameValidationMessage:
        validation.bidderUsernameValidationMessage,
      isSecurityQuestionInvalid: validation.isSecurityQuestionInvalid,
      bidderSecurityQuestionValidationMessage:
        validation.bidderSecurityQuestionValidationMessage,
      isSecurityAnswerInvalid: validation.isSecurityAnswerInvalid,
      bidderSecurityAnswerValidationMessage:
        validation.bidderSecurityAnswerValidationMessage,
    });
    return isValid;
  }

  function toLoginInfoJSON(): BidderConfirmUserDTO {
    let bidderLoginInformation = BidderLoginInformationStateJson(
      bidderLoginInformationState
    )[0];

    return ({
      registrationType: bidderLoginInformation.registrationType,
      bidderUserName: bidderLoginInformation.bidderUserName,
      securityQuestion: bidderLoginInformation.securityQuestion,
      securityAnswer: bidderLoginInformation.securityAnswer,
      bidderStatus: bidderLoginInformation.bidderStatus,
    } as unknown) as BidderConfirmUserDTO;
  }

  function onConfirmLoginPress(event: any) {
    isFormSubmitted.next(true);
    event.preventDefault();
    updateBidderLoginInformationState({
      isConfirmLoginDisabled: true,
      isConfirmLoginLoading: true,
    });
    if (validate()) {
      const data: BidderConfirmUserDTO = toLoginInfoJSON();

      userApiService
        .verifyBidderUsernameExists(bidderLoginInformationState.bidderUsername)
        .then((response) => {
          if (!response.data) {
            userApiService
              .confirmBidderUser(data)
              .then((innerResponse) => {
                updateBidderLoginInformationState({
                  id: innerResponse.data,
                  showUsernameError: false,
                  showUsernameSuccess: true,
                  confirmLoginInfoMessage: "Login Information Confirmed",
                  isRegTypeToggleDisabled: true,
                  isUsernameDisabled: true,
                  isSecurityQuestionDisabled: true,
                  isSecurityAnswerDisabled: true,
                  isConfirmLoginLoading: false,
                });
                bidderLoginInformationState.loginInfoOptions.forEach((item) => {
                  if (bidderLoginInformationState.regTypeToggle !== item.id) {
                    item.isDisabled = true;
                  }
                });
                updateBidderLoginInformationState({
                  loginInfoOptions:
                    bidderLoginInformationState.loginInfoOptions,
                });
              })
              .catch(() => {
                updateBidderLoginInformationState({
                  showUsernameError: true,
                  showUsernameSuccess: false,
                  confirmLoginInfoMessage: "Error",
                  isConfirmLoginLoading: false,
                  isConfirmLoginDisabled: false,
                });
              });
          } else {
            updateBidderLoginInformationState({
              isUsernameInvalid: true,
              bidderUsernameValidationMessage:
                "Please enter a different User Name",
              showUsernameError: true,
              showUsernameSuccess: false,
              confirmLoginInfoMessage: "User Name already exists",
              isConfirmLoginLoading: false,
              isConfirmLoginDisabled: false,
            });
          }
        })
        .catch(() => {
          updateBidderLoginInformationState({
            showUsernameError: true,
            showUsernameSuccess: false,
            confirmLoginInfoMessage: "Error",
            isConfirmLoginLoading: false,
            isConfirmLoginDisabled: false,
          });
        });
    } else {
      updateBidderLoginInformationState({
        showUsernameError: true,
        showUsernameSuccess: false,
        confirmLoginInfoMessage: "Error submitting login information",
        isConfirmLoginDisabled: false,
        isConfirmLoginLoading: false,
      });
    }
  }

  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSToggleRadio
            id={"registration-type-toggle"}
            options={bidderLoginInformationState.loginInfoOptions}
            isInline={false}
            isDisabled={false}
            name={"registrationType"}
            className={"registrationType"}
            label={"Registration Type"}
            isSingleSelect={true}
            onChange={handleRegistrationTypeToggle}
            isRequired={true}
            isInvalid={bidderLoginInformationState.isRegTypeToggleInvalid}
            validationMessage={
              bidderLoginInformationState.regTypeToggleValidationMessage
            }
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-5"}>
          <PPMSInput
            className={"bidder-username"}
            isDisabled={bidderLoginInformationState.isUsernameDisabled}
            id={"bidder-username"}
            name={"bidder-username"}
            isInvalid={bidderLoginInformationState.isUsernameInvalid}
            label={"User Name"}
            onChange={(event) => handleUsernameChange(event.target.value)}
            placeHolder={"Enter a username"}
            isRequired={true}
            inputType={"text"}
            validationMessage={
              bidderLoginInformationState.bidderUsernameValidationMessage
            }
            value={bidderLoginInformationState.bidderUsername}
            hint={"Limit: 30 characters"}
            maxLength={30}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <PPMSSecurityQuestion
            question={bidderLoginInformationState.bidderSecurityQuestion}
            updateQuestion={(value: any) => {
              handleSecurityQuestionChange(value);
            }}
            answer={bidderLoginInformationState.bidderSecurityAnswer}
            updateAnswer={(value: any) => {
              handleSecurityAnswerChange(value)
            }}
            isRequired={true}
          />
        </div>
      </div>
      <br />
      <div className={"grid-col-12"}>
        <PPMSAlert
          id={"username-exists-danger-msg"}
          show={
            bidderLoginInformationState.showUsernameError &&
            !bidderLoginInformationState.showUsernameSuccess
          }
          alertBody={bidderLoginInformationState.confirmLoginInfoMessage}
          alertClassName={"username-exists-error"}
          alertKey={"username-exists-error"}
          alertVariant={"danger"}
        />
        <PPMSAlert
          id={"username-exists-success-msg"}
          show={
            bidderLoginInformationState.showUsernameSuccess &&
            !bidderLoginInformationState.showUsernameError
          }
          alertBody={bidderLoginInformationState.confirmLoginInfoMessage}
          alertClassName={"username-exists-success"}
          alertKey={"username-exists-success"}
          alertVariant={"success"}
        />
      </div>
      <br />
      <div className={"grid-row float-right"}>
        <div className={"grid-col-12"}>
          <PPMSButton
            id={"confirm-login-information"}
            variant={"primary"}
            label={"Confirm Login Information"}
            isDisabled={bidderLoginInformationState.isConfirmLoginDisabled}
            isLoading={bidderLoginInformationState.isConfirmLoginLoading}
            onPress={onConfirmLoginPress}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
