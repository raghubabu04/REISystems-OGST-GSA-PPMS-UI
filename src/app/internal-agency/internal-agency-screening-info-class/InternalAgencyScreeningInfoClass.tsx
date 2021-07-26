import React, { useContext, useEffect } from "react";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { InternalAgencyContext } from "../InternalAgencyContext";
import { isAgencyActive } from "../../internal-agency/constants/Constants";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSDatepicker } from "../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import {
  validateInternalBeginDate,
  validateInternalScreeningDays,
  validatelocalScreeningDays,
} from "../validations/InternalAgencyFieldValidations";
import { isFormSubmitted } from "../../../service/validation.service";

export interface InternalAgencyScreeningInfoProps {}

export function InternalAgencyScreeningInfoClass(
  props: InternalAgencyScreeningInfoProps
) {
  const {
    internalAgencyScreeningInfoState,
    updateInternalAgencyScreeningInfoState,
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
  }, [internalAgencyScreeningInfoState]);
  function validateForm() {
    handleInternalScreening({
      value: internalAgencyScreeningInfoState.internalScreeningDays,
    });
    handleLocalScreening({
      value: internalAgencyScreeningInfoState.localScreeningDays,
    });
    handleInternalBeginDateChange(
      internalAgencyScreeningInfoState.internalBeginDate
    );
  }

  function handleInternalBeginDateChange(date: any) {
    let validation = validateInternalBeginDate(
      date,
      internalAgencyScreeningInfoState.internalBeginDateIsRequired
    );
    updateInternalAgencyScreeningInfoState({
      internalBeginDate: date,
      internalBeginDateIsInValid: validation.isInvalid,
      internalBeginDateIsValid: !validation.isInvalid,
      internalBeginDateMsg: validation.validationError,
    });
  }

  function handleLocalScreening({ value }) {
    let validation = validatelocalScreeningDays(value);
    updateInternalAgencyScreeningInfoState({
      localScreeningDays: validation.value,
      localScreeningDaysIsInvalid: validation.isInvalid,
      localScreeningDaysIsValid: !validation.isInvalid,
      localScreeningDaysValidationMessage: validation.validationError,
    });
  }

  function handleInternalScreening({ value }) {
    let validation = validateInternalScreeningDays(value);
    updateInternalAgencyScreeningInfoState({
      internalScreeningDays: validation.value,
      internalScreeningDaysIsInvalid: validation.isInvalid,
      internalScreeningDaysIsValid: !validation.isInvalid,
      internalScreeningDaysValidationMessage: validation.validationError,
    });
  }

  function handleAgencyActiveToggle(event) {
    let selectedAgencyValue = "";
    let agencySelectedValue: "";
    event.forEach((item) => {
      if (item.isSelected) {
        selectedAgencyValue = item.value;
        agencySelectedValue = item.id;
      }
    });
    updateInternalAgencyScreeningInfoState({
      agencyToggle: selectedAgencyValue === "Yes" ? "true" : "false",
      defaultAgencyToggle: agencySelectedValue,
    });
  }

  return (
    <>
      <React.Fragment>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              id={"internal-screening-days"}
              name={"internal-screening-days"}
              label={"Internal Screening Days"}
              minLength={1}
              maxLength={2}
              isRequired={true}
              validationMessage={
                internalAgencyScreeningInfoState.internalScreeningDaysValidationMessage
              }
              isInvalid={
                internalAgencyScreeningInfoState.internalScreeningDaysIsInvalid
              }
              isValid={
                internalAgencyScreeningInfoState.internalScreeningDaysIsValid
              }
              isDisabled={false}
              inputType={"text"}
              value={internalAgencyScreeningInfoState.internalScreeningDays}
              onChange={(event) => handleInternalScreening(event.target)}
            />
          </div>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              id={"local-screening-days"}
              name={"local-screening-days"}
              label={"Local Screening Days"}
              minLength={1}
              maxLength={2}
              isRequired={false}
              validationMessage={
                internalAgencyScreeningInfoState.localScreeningDaysValidationMessage
              }
              isInvalid={
                internalAgencyScreeningInfoState.localScreeningDaysIsInvalid
              }
              isValid={
                internalAgencyScreeningInfoState.localScreeningDaysIsValid
              }
              isDisabled={false}
              inputType={"text"}
              value={internalAgencyScreeningInfoState.localScreeningDays}
              onChange={(event) => handleLocalScreening(event.target)}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-auto"}>
            <PPMSToggleRadio
              id={"agency-active-toggle"}
              options={isAgencyActive}
              isInline={false}
              isDisabled={false}
              name={"agencyActive"}
              className={"agencyActive"}
              label={"Is Agency Active ?"}
              isSingleSelect={true}
              validationMessage={
                internalAgencyScreeningInfoState.agencyToggleValidartionMessage
              }
              onChange={handleAgencyActiveToggle}
              isRequired={true}
            />
          </div>
          <div className="grid-col-4">
          <PPMSDatepicker
            id={"internalBeginDate"}
            format={"MM/DD/YYYY"}
            name={"internalBeginDate"}
            startDate={internalAgencyScreeningInfoState.internalBeginDate}
            updateDate={(date) => handleInternalBeginDateChange(date)}
            display={"bottom-end"}
            label={"Internal Begin Date"}
            placeholder={"Internal Begin Date"}
            isRequired={
              internalAgencyScreeningInfoState.internalBeginDateIsRequired
            }
            isInvalid={
              internalAgencyScreeningInfoState.internalBeginDateIsInValid
            }
            validationMessage={
              internalAgencyScreeningInfoState.internalBeginDateMsg
            }
          />
          </div>
        </div>
      </React.Fragment>
    </>
  );
}

export default InternalAgencyScreeningInfoClass;
