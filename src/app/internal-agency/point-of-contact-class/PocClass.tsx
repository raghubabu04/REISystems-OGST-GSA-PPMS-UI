import React, { useContext, useEffect, useMemo } from "react";
import { PPMSContact } from "../../../ui-kit/components/PPMS-contact";
import { InternalAgencyContext } from "../InternalAgencyContext";
import {
  validateEmailAddress,
  validatePhoneFax,
} from "../../../ui-kit/components/validations/FieldValidations";
import { isFormSubmitted } from "../../../service/validation.service";

interface PocProps {}

function PocClass(props: PocProps) {
  //set state for this functional componnet
  const { pocState, updatePocState } = useContext(InternalAgencyContext);
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
  }, [pocState]);

  function handleToUpdatePocState(event: any, validation: any) {
    let fieldValue: string = event.substring(event.indexOf(":") + 1);
    let field: string = fieldValue.substring(0, fieldValue.indexOf(":"));
    let value: string = fieldValue.substring(fieldValue.indexOf(":") + 1);
    switch (field) {
      case "firstName":
        if (value.length > 0) {
          updatePocState({
            pocFirstName: value,
            pocFirstNameIsInvalid: false,
            pocFirstNameIsValid: true,
          });
        } else {
          updatePocState({
            pocFirstName: value,
            pocFirstNameIsInvalid: true,
            pocFirstNameIsValid: false,
          });
        }
        break;
      case "middleName":
        updatePocState({ pocMiddleName: value });
        break;
      case "lastName":
        if (value.length > 0) {
          updatePocState({
            pocLastName: value,
            pocLastNameIsInvalid: false,
            pocLastNameIsValid: true,
          });
        } else {
          updatePocState({
            pocLastName: value,
            pocLastNameIsInvalid: true,
            pocLastNameIsValid: false,
          });
        }
        break;
      case "phone":
        updatePocState({
          pocPhone: value,
          pocPhoneIsInvalid: validation.isInvalid,
          pocPhoneIsValid: !validation.isInvalid,
          pocPhoneValidationMessage: validation.validationError,
          pocDisabledExtension: value.length <= 0,
        });
        break;
      case "phExt":
        updatePocState({
          pocPhoneExt: value,
        });
        break;
      case "fax":
        updatePocState({
          pocFax: value,
          pocFaxIsInvalid: validation.isInvalid,
          pocFaxIsValid: !validation.isInvalid,
          pocFaxValidationMessage: validation.validationError,
        });

        break;
      case "email":
        if (value === "") {
          updatePocState({
            pocEmail: value,
            pocEmailIsInvalid: true,
            pocEmailIsValid: false,
            pocEmailValidationMessage: "",
          });
        } else {
          updatePocState({
            pocEmail: value,
            pocEmailIsInvalid: validation.isInvalid,
            pocEmailIsValid: !validation.isInvalid,
            pocEmailValidationMessage: validation.validationError,
          });
        }
        break;
      case "ccEmail":
        if (value === "") {
          updatePocState({
            pocCcEmail: value,
            pocCcEmailIsInvalid: false,
            pocCcEmailIsValid: true,
            pocCcEmailValidationMessage: "",
          });
        } else {
          updatePocState({
            pocCcEmail: value,
            pocCcEmailIsInvalid: validation.isInvalid,
            pocCcEmailIsValid: !validation.isInvalid,
            pocCcEmailValidationMessage: validation.validationError,
          });
        }
        break;
    }
  }

  function validateForm() {
    let validateFirstName: boolean = pocState.pocFirstName?.length > 0;
    let validateSecondName: boolean = pocState.pocLastName?.length > 0;
    let validateEmail = validateEmailAddress(pocState.pocEmail);
    let validationPhone = validatePhoneFax(pocState.pocPhone);

    if (!validateFirstName) {
      updatePocState({ pocFirstNameIsInvalid: true });
    }

    if (!validateSecondName) {
      updatePocState({ pocLastNameIsInvalid: true });
    }

    if (validateEmail.isInvalid) {
      updatePocState({
        pocEmailIsInvalid: true,
        pocEmailIsValid: false,
      });
    }

    if (validationPhone.isInvalid) {
      updatePocState({
        pocPhoneIsInvalid: true,
        pocPhoneIsValid: false,
      });
    }

    if (
      validateFirstName &&
      validateSecondName &&
      !validateEmail.isInvalid &&
      !validationPhone.isInvalid &&
      !pocState.pocFaxIsInvalid &&
      !pocState.pocCcEmailIsInvalid
    )
      return true;
    else return false;
  }

  return useMemo(() => {
    return (
      <>
        <PPMSContact
          id={"point-of-contact"}
          title={"Point of Contact"}
          updateParentState={handleToUpdatePocState.bind(this)}
          firstLastNameRequired={true}
          showMiddleName={true}
          firstLastNameMaxLength={30}
          firstName={pocState.pocFirstName}
          firstNameIsInvalid={pocState.pocFirstNameIsInvalid}
          firstNameIsValid={pocState.pocFirstNameIsValid}
          firstNameValidationMessage={pocState.pocFirstNameValidationMessage}
          onChangeFirstName={(value: any) =>
            updatePocState({ pocFirstName: value })
          }
          middleName={pocState.pocMiddleName}
          onChangeMiddleName={(value: any) =>
            updatePocState({ pocMiddleName: value })
          }
          lastName={pocState.pocLastName}
          lastNameIsInvalid={pocState.pocLastNameIsInvalid}
          lastNameIsValid={pocState.pocLastNameIsValid}
          lastNameValidationMessage={pocState.pocLastNameValidationMessage}
          onChangeLastName={(value: any) =>
            updatePocState({ pocLastName: value })
          }
          phone={pocState.pocPhone}
          phoneIsInvalid={pocState.pocPhoneIsInvalid}
          phoneIsValid={pocState.pocPhoneIsValid}
          onChangePhoneNumber={(value: any) =>
            updatePocState({ pocPhone: value })
          }
          phoneValidationMessage={pocState.pocPhoneValidationMessage}
          extension={pocState.pocPhoneExt}
          extensionIsInvalid={pocState.pocPhoneExtIsInvalid}
          extensionIsValid={pocState.pocPhoneExtIsValid}
          disabledExtension={false}
          onChangePhoneExt={(value: any) =>
            updatePocState({ pocPhoneExt: value })
          }
          extensionValidationMessage={pocState.pocPhoneExtValidationMessage}
          phoneExtRequired={true}
          phoneFax={pocState.pocFax}
          phoneFaxIsInvalid={pocState.pocFaxIsInvalid}
          phoneFaxIsValid={pocState.pocFaxIsValid}
          phoneFaxValidationMessage={pocState.pocFaxValidationMessage}
          onChangePhoneFax={(value) => updatePocState({ pocFax: value })}
          phoneFaxRequired={false}
          email={pocState.pocEmail}
          emailIsInvalid={pocState.pocEmailIsInvalid}
          emailIsValid={pocState.pocEmailIsValid}
          emailValidationMessage={pocState.pocEmailValidationMessage}
          emailRequired={pocState.pocEmailRequired}
          onChangeEmail={(value: any) => updatePocState({ pocEmail: value })}
          ccEmail={pocState.pocCcEmail}
          ccEmailIsInvalid={pocState.pocCcEmailIsInvalid}
          ccEmailIsValid={pocState.pocCcEmailIsValid}
          ccEmailValidationMessage={pocState.pocCcEmailValidationMessage}
          onChangeCcEmail={(value: any) =>
            updatePocState({ pocCcEmail: value })
          }
          emailMaxLength={64}
          disableNotifyToggle={true}
        />
      </>
    );
  }, [pocState]);
}
export default PocClass;
