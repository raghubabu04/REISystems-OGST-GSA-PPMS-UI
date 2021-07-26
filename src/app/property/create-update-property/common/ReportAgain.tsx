import React, { useContext, useEffect } from "react";
import { PropertyApiService } from "../../../../api-kit/property/property-api-service";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { validatePropertyField } from "../../../../ui-kit/components/validations/FieldValidations";
import { UserUtils } from "../../../../utils/UserUtils";
import { getJulianDate } from "../icn-class/IcnState";
import { PropertyContext } from "../PropertyContext";

interface ReportAgainProps {
  aacCode: string;
  julianDate?: string;
  serialNumber?: string;
  suffix?: string;
}

export function ReportAgain(props: ReportAgainProps) {
  const { reportAgainState, updateReportAgainState } = useContext(
    PropertyContext
  );

  const propertyApiService = new PropertyApiService();

  useEffect(() => {
      updateReportAgainState({
        modalJulianDate: getJulianDate(),
        julianDateisValid: true,
      });
  }, []);

  function onBlurSerialNumber() {
    const validation = validatePropertyField(
      "serial-number",
      reportAgainState.modalSerialNumber
    );
    updateReportAgainState({
      serialNumberIsValid: !validation.isInvalid,
      serialNumberIsinvalid: validation.isInvalid,
      serialNumerValidationMessage: validation.validationError,
      icnValid: true,
      icnVerificationMessage: "",
    });
  }

  function onBlurJulianDate() {
    const validation = validatePropertyField(
      "julian-date",
      reportAgainState.modalJulianDate
    );
    updateReportAgainState({
      julianDateisValid: !validation.isInvalid,
      julianDateIsinvalid: validation.isInvalid,
      julianDateValidationMessage: validation.validationError,
      icnValid: true,
      icnVerificationMessage: "",
    });
    
  }

  function onBlurSuffix() {
    const validation = validatePropertyField(
      "suffix",
      reportAgainState.modalSuffix
    );
    updateReportAgainState({
      suffixIsValid: !validation.isInvalid,
      suffixIsInvalid: validation.isInvalid,
      suffixValidationMessage: validation.validationError,
      icnValid: true,
      icnVerificationMessage: "",
    });
  }




  return (
    <>
      <div className={"grid-row"}>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"aac-code-reportAgain"}
            name={"aacCode"}
            label={"AAC CODE"}
            onBlur={() => {}}
            onChange={() => {}}
            isRequired={true}
            maxLength={6}
            validationMessage={""}
            isInvalid={false}
            isValid={true}
            isDisabled={true}
            inputType={"text"}
            value={props.aacCode}
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"julian-date-reportAgain"}
            name={"julianDate"}
            label={"Julian date"}
            maxLength={4}
            onChange={(event) => {
              updateReportAgainState({
                modalJulianDate: event.target.value.toUpperCase(),
                julianDateValidationMessage: "",
                julianDateIsinvalid: false,
                julianDateisValid: false,
                icnValid: true,
                icnVerificationMessage: "",
              });
            }}
            onBlur={onBlurJulianDate}
            validationMessage={reportAgainState.julianDateValidationMessage}
            isRequired={true}
            isDisabled={
              !(
                UserUtils.hasPermission("APO") ||
                UserUtils.hasPermission("NU") ||
                UserUtils.hasPermission("SM")
              )
            }
            value={reportAgainState.modalJulianDate}
            inputType={"text"}
            isInvalid={reportAgainState.julianDateIsinvalid}
            isValid={reportAgainState.julianDateisValid}
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"serial-number-reportAgain"}
            name={"serialNum"}
            label={"Serial Number"}
            maxLength={4}
            onChange={(event) => {
              updateReportAgainState({
                modalSerialNumber: event.target.value.toUpperCase(),
                serialNumberIsinvalid: false,
                serialNumberIsValid: false,
                serialNumerValidationMessage: "",
                icnValid: true,
                icnVerificationMessage: "",
              });
            }}
            onBlur={onBlurSerialNumber}
            isRequired={true}
            validationMessage={reportAgainState.serialNumerValidationMessage}
            isInvalid={reportAgainState.serialNumberIsinvalid}
            isValid={reportAgainState.serialNumberIsValid}
            isDisabled={false}
            inputType={"text"}
            value={reportAgainState.modalSerialNumber}
          />
        </div>
        <div className={"grid-col-1"}>
          <PPMSInput
            id={"suffix-reportAgain"}
            name={"suffix"}
            label={"Suffix"}
            maxLength={1}
            onChange={(event) => {
              updateReportAgainState({
                modalSuffix: event.target.value.toUpperCase(),
                icnValid: true,
                icnVerificationMessage: "",
              });
            }}
            onBlur={onBlurSuffix}
            validationMessage={reportAgainState.suffixValidationMessage}
            isInvalid={reportAgainState.suffixIsInvalid}
            isValid={reportAgainState.suffixIsValid}
            isDisabled={false}
            inputType={"text"}
            isRequired={false}
            value={reportAgainState.modalSuffix}
          />
        </div>
        <div className={"tablet:grid-col-8"}>
          <PPMSAlert
            id={"icn-verification-danger-msg"}
            show={!reportAgainState.icnValid}
            alertBody={reportAgainState.icnVerificationMessage}
            alertClassName={"email-verification-error"}
            alertKey={"email-verification-error"}
            alertVariant={"danger"}
          />
        </div>
      </div>
    </>
  );
}
