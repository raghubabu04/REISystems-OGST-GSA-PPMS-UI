import React, { useContext, useEffect, useMemo } from "react";
import { PPMSAddress } from "../../../ui-kit/components/PPMS-address";
import { InternalAgencyContext } from "../InternalAgencyContext";
import { isFormSubmitted } from "../../../service/validation.service";

interface InternalAgencyAddressProps {}

function InternalAgencyAddressClass(props: InternalAgencyAddressProps) {
  //set state for this functional componnet
  const {
    internalAgencyAddressState,
    updateInternalAgencyAddressState,
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
  }, [internalAgencyAddressState]);

  function validateForm() {}
  return useMemo(() => {
    return (
      <React.Fragment>
        <PPMSAddress
          id={"internal-agency"}
          title={"Internal Agency"}
          address1={internalAgencyAddressState.internalAgencyAddress1}
          showAddressLine3={true}
          address1Required={true}
          address1IsInvalid={
            internalAgencyAddressState.internalAgencyAddress1IsInvalid
          }
          address1IsValid={
            internalAgencyAddressState.internalAgencyAddress1IsValid
          }
          address1ValidationMessage={
            internalAgencyAddressState.internalAgencyAddress1ValidationMessage
          }
          onChangeAddress1={(value: any)=>{ updateInternalAgencyAddressState({internalAgencyAddress1: value}) }}
          updateAddress1={(value: any, validation: any) => {
            let valid = value.length > 0;
            updateInternalAgencyAddressState({
              internalAgencyAddress1: value,
              internalAgencyAddress1IsInvalid: !valid,
              internalAgencyAddress1IsValid: valid,
              internalAgencyAddress1ValidationMessage: validation.error,
            });
          }}
          address2={internalAgencyAddressState.internalAgencyAddress2}
          address2Required={false}
          address2IsInvalid={
            internalAgencyAddressState.internalAgencyAddress2IsInvalid
          }
          address2IsValid={
            internalAgencyAddressState.internalAgencyAddress2IsValid
          }
          address2ValidationMessage={
            internalAgencyAddressState.internalAgencyAddress2ValidationMessage
          }
          updateAddress2={(value: any) => {
            updateInternalAgencyAddressState({
              internalAgencyAddress2: value,
            });
          }}
          address3={internalAgencyAddressState.internalAgencyAddress3}
          address3Required={false}
          address3IsInvalid={
            internalAgencyAddressState.internalAgencyAddress3IsInvalid
          }
          address3IsValid={
            internalAgencyAddressState.internalAgencyAddress3IsValid
          }
          address3ValidationMessage={
            internalAgencyAddressState.internalAgencyAddress3ValidationMessage
          }
          updateAddress3={(value: any, validation: any) => {
            let valid = value.length > 0;
            updateInternalAgencyAddressState({
              internalAgencyAddress3: value,
              internalAgencyAddress3IsInvalid: !valid,
              internalAgencyAddress3IsValid: valid,
              internalAgencyAddress3ValidationMessage: validation.error,
            });
          }}
          city={internalAgencyAddressState.internalAgencyCity}
          cityRequired={true}
          cityIsInvalid={internalAgencyAddressState.internalAgencyCityIsInvalid}
          cityIsValid={internalAgencyAddressState.internalAgencyCityIsValid}
          cityValidationMessage={
            internalAgencyAddressState.internalAgencyCityValidationMessage
          }
          onChangeCity={(value: any) => {updateInternalAgencyAddressState({internalAgencyCity: value})}}
          updateCity={(value: any, validation: any) => {
            let valid = value.length > 0;
            updateInternalAgencyAddressState({
              internalAgencyCity: value,
              internalAgencyCityIsInvalid: !valid,
              internalAgencyCityIsValid: valid,
              internalAgencyCityValidationMessage: validation.error,
            });
          }}
          state={internalAgencyAddressState.internalAgencyStateCode}
          stateRequired={true}
          stateIsInvalid={
            internalAgencyAddressState.internalAgencyStateIsInvalid
          }
          stateIsValid={internalAgencyAddressState.internalAgencyStateIsValid}
          updateState={(value: any, validation: any) => {
            updateInternalAgencyAddressState({
              internalAgencyStateCode: value,
              internalAgencyStateIsInvalid: validation.isInvalid,
              internalAgencyStateIsValid: !validation.isInvalid,
              internalAgencyStateValidationMessage: validation.error,
            });
          }}
          zip={internalAgencyAddressState.internalAgencyZipCode}
          zipRequired={true}
          zipIsInvalid={internalAgencyAddressState.internalAgencyZipIsInvalid}
          zipIsValid={internalAgencyAddressState.internalAgencyZipIsValid}
          zipValidationMessage={
            internalAgencyAddressState.internalAgencyZipValidationMessage
          }
          onChangeZip={(value: any)=>{
            updateInternalAgencyAddressState({
              internalAgencyZipCode: value})
          }}
          showZipExtension={true}
          updateZip={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string,
            disabledZipExtension: boolean
          ) => {
            updateInternalAgencyAddressState({
              internalAgencyZipCode: value,
              internalAgencyZipIsInvalid: inValid,
              internalAgencyZipIsValid: valid,
              internalAgencyZipValidationMessage: validationError,
              disabledZipExtension: disabledZipExtension,
            });
          }}
          zip2={internalAgencyAddressState.internalAgencyZip2Code}
          zip2IsInvalid={internalAgencyAddressState.internalAgencyZip2IsInvalid}
          zip2IsValid={internalAgencyAddressState.internalAgencyZip2IsValid}
          disabledZipExtension={
            internalAgencyAddressState.internalDisabledZipExtension || internalAgencyAddressState.internalAgencyZipCode.length === 0
          }
          onChangeZipExtension={(value: any)=>{
            updateInternalAgencyAddressState({
              internalAgencyZip2Code: value})
          }}
          updateZipExtension={(
            value: any,
            inValid: boolean,
            valid: boolean,
            validationError: string
          ) => {
            updateInternalAgencyAddressState({
              internalAgencyZip2Code: value,
              internalAgencyZip2IsInvalid: inValid,
              internalAgencyZip2IsValid: valid,
              internalAgencyZip2ValidationMessage: validationError,
            });
          }}
          validationExtensionMessage={
            internalAgencyAddressState.internalAgencyZip2ValidationMessage
          }
        />
      </React.Fragment>
    );
  }, [internalAgencyAddressState]);
}

export default InternalAgencyAddressClass;
