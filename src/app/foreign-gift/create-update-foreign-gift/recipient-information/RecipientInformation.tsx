import React, { useContext, useEffect, useMemo } from "react";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSFirstNameLastName } from "../../../../ui-kit/components/PPMS-firstname-lastname";
import { PropertyContext } from "../../../property/create-update-property/PropertyContext";
import { validateTitle } from "../../../property/create-update-property/validations/propertyFieldValidations";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { PPMSEmail } from "../../../../ui-kit/components/PPMS-email";
import { isFormSubmitted } from "../../../../service/validation.service";

export interface RecipientInformationProps {}
export function RecipientInformation(props: RecipientInformationProps) {
  const { recipientInfoState, updateRecipientInfoState } = useContext(
    PropertyContext
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
  }, [recipientInfoState]);

  function validateForm() {
    handleTitle(recipientInfoState.title);
    handleNameUpdate(recipientInfoState.recipientFirstName, "First Name");
    handleNameUpdate(recipientInfoState.recipientLastName, "Last Name");
  }

  function handleTitle(value: any) {
    let validations = validateTitle(value, "Recipient");
    updateRecipientInfoState({
      title: value,
      titleInvalid: validations.isInvalid,
      titleMsg: validations.validationError,
    });
  }

  function handleOnChangeTitle(value: any) {
    updateRecipientInfoState({
      title: value,
      titleMsg: "",
      titleInvalid: false,
    });
  }

  function handleNameUpdate(value: any, name: string) {
    let isInValid;
    let validationMsg;
    if (name === "First Name") {
      isInValid = recipientInfoState.firstNameInvalid;
      validationMsg = recipientInfoState.firstMessage;
    } else {
      isInValid = recipientInfoState.lastNameInvalid;
      validationMsg = recipientInfoState.lastNameInvalid;
    }

    if (null == value || value.length === 0) {
      isInValid = true;
      validationMsg = "Recipient " + name + " is required";
    } else {
      isInValid = false;
      validationMsg = "";
    }
    if (name === "First Name") {
      updateRecipientInfoState({
        recipientFirstName: value,
        firstNameInvalid: isInValid,
        firstMessage: validationMsg,
      });
    } else {
      updateRecipientInfoState({
        recipientLastName: value,
        lastNameInvalid: isInValid,
        lastMessage: validationMsg,
      });
    }
  }

  function phoneNumberUpdated(value: string, validation: any) {
    let isInvalid = validation.isInvalid;
    let validationError = validation.validationError;
    if (value.length === 0) {
      isInvalid = false;
      validationError = "";
    }
    updateRecipientInfoState({
      phoneNumber: value,
      isPhoneNumberInvalid: isInvalid,
      phoneNumberInvalidErrorMessage: validationError,
    });
  }

  function phoneExtensionUpdated(value: string) {
    updateRecipientInfoState({
      phoneExtension: value,
    });
  }

  function emailAddressUpdated(value: string, validation: any) {
    updateRecipientInfoState({
      emailAddress: value,
      isEmailAddressInvalid: validation.isInvalid,
      emailAddressInvalidErrorMessage: validation.validationError,
    });
  }
  return useMemo(() => {
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <PPMSFirstNameLastName
            id={"recipient-info-first-middle-last-name"}
            maxLength={30}
            disabled={false}
            required={true}
            firstName={recipientInfoState.recipientFirstName}
            onChangeFirstName={(value: any) =>
              updateRecipientInfoState({
                firstMessage: "",
                firstNameInvalid: false,
                recipientFirstName: value,
              })
            }
            updateFirstName={(value: any) => {
              handleNameUpdate(value, "First Name");
            }}
            validationFirstMessage={recipientInfoState.firstMessage}
            isFirstNameInvalid={recipientInfoState.firstNameInvalid}
            lastName={recipientInfoState.recipientLastName}
            onChangeLastName={(value: any) => {
              updateRecipientInfoState({
                lastMessage: "",
                lastNameInvalid: false,
                recipientLastName: value,
              });
            }}
            updateLastName={(value: any) => {
              handleNameUpdate(value, "Last Name");
            }}
            validationLastMessage={recipientInfoState.lastMessage}
            isLastNameInvalid={recipientInfoState.lastNameInvalid}
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-8"}>
            <PPMSInput
              id={"receipient-title"}
              name={"title"}
              label={"Title"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={recipientInfoState.title}
              onChange={(event) => handleOnChangeTitle(event.target.value)}
              onBlur={(event) => handleTitle(event.target.value)}
              validationMessage={recipientInfoState.titleMsg}
              maxLength={64}
              minLength={1}
              isInvalid={recipientInfoState.titleInvalid}
              isValid={!recipientInfoState.titleInvalid}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <PPMSPhoneNumber
            id={"receipient-phonenumber"}
            showExtension={true}
            disabled={false}
            phone={recipientInfoState.phoneNumber}
            maxLength={10}
            isInvalid={recipientInfoState.isPhoneNumberInvalid}
            validationMessage={
              recipientInfoState.phoneNumberInvalidErrorMessage
            }
            extension={recipientInfoState.phoneExtension}
            maxLengthExtension={7}
            isExtensionInvalid={recipientInfoState.isPhoneExtensionInvalid}
            extensionValidationMessage={
              recipientInfoState.phoneExtensionInvalidErrorMessage
            }
            required={false}
            updatePhoneNumber={phoneNumberUpdated}
            updatePhoneExtension={phoneExtensionUpdated}
            onChangePhoneNumber={(value) =>
              updateRecipientInfoState({ phoneNumber: value })
            }
            onChangePhoneExt={(value) =>
              updateRecipientInfoState({ phoneExtension: value })
            }
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            <PPMSEmail
              id={"receipient-email"}
              emailLabel={"Email Address"}
              email={recipientInfoState.emailAddress}
              isInvalid={recipientInfoState.isEmailAddressInvalid}
              validationMessage={
                recipientInfoState.emailAddressInvalidErrorMessage
              }
              required={false}
              maxLength={64}
              updateEmail={emailAddressUpdated}
              onChangeEmail={(value) =>
                updateRecipientInfoState({ emailAddress: value })
              }
            />
          </div>
        </div>
      </>
    );
  }, [recipientInfoState]);
}
