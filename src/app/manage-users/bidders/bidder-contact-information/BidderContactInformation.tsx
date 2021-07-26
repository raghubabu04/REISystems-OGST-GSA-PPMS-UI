import React, { useContext, useEffect } from "react";
import { BidderContext } from "../BidderContext";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { isFormSubmitted } from "../../../../service/validation.service";
import { validatePhoneFax } from "../../../../ui-kit/components/validations/FieldValidations";

interface BidderContactInformationProps {}

export default function BidderContactInformation(
  props: BidderContactInformationProps
) {
  const {
    bidderPersonalInformationState,
    bidderContactInformationState,
    updateBidderContactInformationState,
  } = useContext(BidderContext);

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validate();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [bidderContactInformationState]);


  function validate() {
    const validation = validatePhoneFax(bidderContactInformationState.daytimePhone);
    dayTimePhoneNumberUpdated(bidderContactInformationState.daytimePhone,validation);

    const validation1 = validatePhoneFax(bidderContactInformationState.eveningPhone);
    eveningTimePhoneNumberUpdated(bidderContactInformationState.eveningPhone,validation1);

    internationalPhoneNumberUpdated(bidderContactInformationState.internationalPhone)
  }

  let showLocalPhone;
  if (bidderPersonalInformationState.country?.toUpperCase() === "US") {
    showLocalPhone = <>
      <div className={"grid-row grid-gap-4"}>
        <PPMSPhoneNumber
          id={"contact-information"}
          showExtension={true}
          disabled={false}
          label={"Daytime Phone"}
          phone={bidderContactInformationState.daytimePhone}
          maxLength={10}
          isInvalid={bidderContactInformationState.daytimePhoneIsInvalid}
          validationMessage={
            bidderContactInformationState.daytimePhoneValidationMessage
          }
          extension={bidderContactInformationState.daytimePhoneExt}
          maxLengthExtension={8}
          isExtensionInvalid={
            bidderContactInformationState.daytimePhoneExtIsInvalid
          }
          extensionValidationMessage={
            bidderContactInformationState.daytimePhoneExtValidationMessage
          }
          required={true}
          updatePhoneNumber={dayTimePhoneNumberUpdated}
          updatePhoneExtension={dayTimePhoneExtensionUpdated}
          onChangePhoneNumber={(value) =>
            updateBidderContactInformationState({ daytimePhone: value })
          }
          onChangePhoneExt={(value) =>
            updateBidderContactInformationState({ daytimePhoneExt: value })
          }
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <PPMSPhoneNumber
          id={"contact-information"}
          showExtension={true}
          disabled={false}
          label={"Evening Phone"}
          phone={bidderContactInformationState.eveningPhone}
          maxLength={10}
          isInvalid={bidderContactInformationState.eveningPhoneIsInvalid}
          validationMessage={
            bidderContactInformationState.eveningPhoneValidationMessage
          }
          extension={bidderContactInformationState.eveningPhoneExt}
          maxLengthExtension={8}
          isExtensionInvalid={
            bidderContactInformationState.eveningPhoneExtIsInvalid
          }
          extensionValidationMessage={
            bidderContactInformationState.eveningPhoneExtValidationMessage
          }
          required={true}
          updatePhoneNumber={eveningTimePhoneNumberUpdated}
          updatePhoneExtension={eveningTimePhoneExtensionUpdated}
          onChangePhoneNumber={(value) =>
            updateBidderContactInformationState({ eveningPhone: value })
          }
          onChangePhoneExt={(value) =>
            updateBidderContactInformationState({ eveningPhoneExt: value })
          }
        />
      </div>
    </>
  }

  let showInternationalPhone;
  if (bidderPersonalInformationState.country?.toUpperCase() !== "US") {
    showInternationalPhone = <>
      <div className={"grid-row"}>
        <PPMSInput
          isDisabled={false}
          id={"international-phone"}
          name={"international-phone"}
          isInvalid={bidderContactInformationState.internationalPhoneIsInvalid}
          label={"International Phone"}
          onChange={(event) =>
            internationalPhoneNumberUpdated(event.target.value)
          }
          isRequired={true}
          maxLength={10}
          hint={"Limit: 10 digits"}
          inputType={"text"}
          validationMessage={
            bidderContactInformationState.internationalPhoneValidationMessage
          }
          value={bidderContactInformationState.internationalPhone}
        />
      </div>
    </>
  }

  return (
    <React.Fragment>
      {showLocalPhone}
      {showInternationalPhone}
    </React.Fragment>
  );
  function internationalPhoneNumberUpdated(value: string) {
    const input = value.replace(/[^0-9]/g, "").substring(0, 10);
    let validation = {
      isInvalid: false,
      validationMessage: ""
    }
    if (value.length === 0 || input.length === 0) {
      validation.isInvalid = true;
      validation.validationMessage = "International Phone number is required";
    } else {
      if (input.length !== 10) {
        validation.isInvalid = true;
        validation.validationMessage = "International Phone number length not met";
      }
    }
    updateBidderContactInformationState({
      internationalPhone: input,
      internationalPhoneIsInvalid: validation.isInvalid,
      internationalPhoneValidationMessage: validation.validationMessage
    })
  }
  function eveningTimePhoneNumberUpdated(value: string, validation: any) {
    updateBidderContactInformationState({
      eveningPhone: value,
      eveningPhoneIsInvalid: validation.isInvalid,
      eveningPhoneValidationMessage: validation.validationError,
    });
  }
  function eveningTimePhoneExtensionUpdated(value: string) {
    updateBidderContactInformationState({
      eveningPhoneExt: value,
    });
  }
  function dayTimePhoneNumberUpdated(value: string, validation: any) {
    updateBidderContactInformationState({
      daytimePhone: value,
      daytimePhoneIsInvalid: validation.isInvalid,
      daytimePhoneValidationMessage: validation.validationError,
    });
  }

  function dayTimePhoneExtensionUpdated(value: string) {
    updateBidderContactInformationState({
      daytimePhoneExt: value,
    });
  }
}
