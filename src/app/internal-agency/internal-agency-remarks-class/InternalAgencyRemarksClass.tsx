import React, { useContext, useEffect } from "react";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import { InternalAgencyContext } from "../InternalAgencyContext";
import { validateRemarks } from "../validations/InternalAgencyFieldValidations";
import { isFormSubmitted } from "../../../service/validation.service";

export function InternalAgencyRemarksClass(props: any) {
  const {
    internalAgencyRemarksState,
    updateInternalAgencyRemarksState,
  } = useContext(InternalAgencyContext);
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
  }, [internalAgencyRemarksState]);
  function validateForm() {
    handleCharactersChange({ value: internalAgencyRemarksState.remarks });
  }
  function handleCharactersChange({ value }) {
    let validation = validateRemarks(value);
    let remarksLength: number = 0;
    const remarksMaxLength: number = 800;
    if (internalAgencyRemarksState.remarks.length < value.length) {
      remarksLength = remarksMaxLength - value.length;
    } else {
      remarksLength =
        internalAgencyRemarksState.remarksCharacterLeft +
        (internalAgencyRemarksState.remarks.length - value.length);
    }
    updateInternalAgencyRemarksState({
      remarksCharacterLeft: remarksLength,
      remarks: value,
      remarksIsInvalid: validation.isInvalid,
      remarksErrorMsg: validation.validationError,
    });
  }

  return (
    <>
      <React.Fragment>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSTextArea
              id={"internalAgencyRemarks"}
              name={"internalAgencyRemarks"}
              label={"Remarks"}
              isRequired={true}
              isDisabled={false}
              maxLength={800}
              inputType={"text"}
              value={internalAgencyRemarksState.remarks}
              onChange={(event) => handleCharactersChange(event.target)}
              validationMessage={internalAgencyRemarksState.remarksErrorMsg}
              isInvalid={internalAgencyRemarksState.remarksIsInvalid}
              isValid={false}
            />
          </div>
        </div>
        <span>
          <strong>{internalAgencyRemarksState.remarksCharacterLeft}</strong>{" "}
          Characters left
        </span>
      </React.Fragment>
    </>
  );
}

export default InternalAgencyRemarksClass;
