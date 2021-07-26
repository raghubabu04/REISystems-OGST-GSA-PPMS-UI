import React, {useContext, useEffect} from "react";
import {PPMSTextEditor} from "../../../../ui-kit/components/common/PPMS-texteditor";
import {PPMSInput} from "../../../../ui-kit/components/common/input/PPMS-input";
import {GroupEmailsContext} from "../GroupEmailsContext";
import {validateEmailText, validateSubjectLine,} from "../validations/AddGroupEmailsValidations";
import {isFormSubmitted} from "../../../../service/validation.service";


export interface EmailContentProps {
}

export function EmailContentClass(
  props: EmailContentProps
) {

  const {
    emailContentState,
    updateEmailContentState,
  } = useContext(GroupEmailsContext);
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
  }, [emailContentState]);

  function validateForm() {
    handleEmailTextChange(emailContentState.EmailTextValue);
    handleSubjectLine({value: emailContentState.subjectLine})
  }

  function handleSubjectLine({value}) {
    let validation = validateSubjectLine(value);
    updateEmailContentState({
      subjectLine: value,
      SubjectLineInvalid: validation.isInvalid,
      SubjectLineValidationMsg: validation.validationError
    })
  }

  function handleEmailTextChange(value) {
    let validation = validateEmailText(value);
    let EmailTextLength: number = 0;
    const EmailTextMaxLength: number = 5000;
    if (
      emailContentState.EmailTextValue.length < value.length
    ) {
      EmailTextLength = EmailTextMaxLength - value.trim().replace(/(<([^>]+)>)/g, "").length;
    } else {
      EmailTextLength =
        emailContentState.EmailTextCharacterLeft +
        (emailContentState.EmailTextValue.length -
          value.length);
    }
    EmailTextLength =
      EmailTextLength > EmailTextMaxLength
        ? EmailTextMaxLength
        : EmailTextLength;
    updateEmailContentState({
      EmailTextCharacterLeft: EmailTextLength,
      EmailTextValue: value,
      EmailTextInvalid: validation.isInvalid,
      EmailTextValidationMsg: validation.validationError,
    });
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-12">
          <PPMSInput
            id={"subject-line"}
            name={"subject-line"}
            inputType={"text"}
            isDisabled={false}
            label={"Subject Line"}
            isRequired={true}
            onChange={(event) => handleSubjectLine(event?.target)}
            value={emailContentState.subjectLine}
            isInvalid={emailContentState.SubjectLineInvalid}
            isValid={!emailContentState.SubjectLineInvalid}
            validationMessage={emailContentState.SubjectLineValidationMsg}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          <PPMSTextEditor
            id={"email-content"}
            onChange={(event) => handleEmailTextChange(event)}
            value={emailContentState.EmailTextValue}
            label={"Email Text"}
            isInvalid={emailContentState.EmailTextInvalid}
            isValid={!emailContentState.SubjectLineInvalid}
            isRequired={true}
            validationMessage={emailContentState.EmailTextValidationMsg}
          />
        </div>
      </div>
      {emailContentState.EmailTextCharacterLeft >= 0 ? (
        <span>
          <strong>
            {emailContentState.EmailTextCharacterLeft}
          </strong>{" "}
          Character(s) left
        </span>
      ) : (
        ""
      )}

    </>
  );
}
