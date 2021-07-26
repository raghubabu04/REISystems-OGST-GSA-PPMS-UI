import React, { useContext, useEffect } from "react";
import { BidderContext } from "../BidderContext";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSAddress } from "../../../../ui-kit/components/PPMS-address";
import { bidderSecondaryAddressInformationStateDefault } from "../bidder-secondary-address-information/BidderSecondaryAddressInformationState";
import { BidderPrimaryAddressInfoTip } from "./BidderPrimaryAddressInfoTip";
import { bidderPersonalInformationStateDefault } from "../bidder-personal-information/BidderPersonalInformationState";

interface BidderPrimaryAddressInformationProps { }

export default function BidderPrimaryAddressInformation(
  props: BidderPrimaryAddressInformationProps
) {
  const {
    bidderPersonalInformationState,
    updateBidderPersonalInformationState,
    bidderPrimaryAddressInformationState,
    updateBidderPrimaryAddressInformationState,
    updateBidderSecondaryAddressInformationState,
  } = useContext(BidderContext);

  function handlePrimaryAddressPoBoxe(event) {
    let selectedValue = "";
    let isPrimaryAddress = "";

    event.forEach((item) => {
      if (item.isSelected) {
        selectedValue = item.value;
        isPrimaryAddress = item.id;
      }
    });
    updateBidderPrimaryAddressInformationState({
      isPrimaryAddressPoBox: selectedValue === "Yes",
      defaultIsPrimaryAddressPoBox: isPrimaryAddress,
      isRadioBoxChecked: true,
      radioBoxInvalid: false
    });

    if (selectedValue === "No") {
      updateBidderSecondaryAddressInformationState(
        bidderSecondaryAddressInformationStateDefault
      );
    }
  }

  function checkIfAddressFieldsChanged() {
    if (!bidderPrimaryAddressInformationState.isRadioBoxChecked) {
      updateBidderPrimaryAddressInformationState({
        radioBoxInvalid: true
      })
    } else {
      updateBidderPrimaryAddressInformationState({
        radioBoxInvalid: false
      })
    }
  }

  let nonInternationalAddress;
  if (bidderPersonalInformationState.country?.toUpperCase() === "US") {
    nonInternationalAddress = <>
      <div className={"grid-row"}>
        <PPMSToggleRadio
          id={"isPrimaryAddressPoBox"}
          options={bidderPrimaryAddressInformationState.isAddressPoBoxOptions}
          isInline={false}
          isDisabled={false}
          isInvalid={bidderPrimaryAddressInformationState.radioBoxInvalid}
          name={"isPrimaryAddressPoBox"}
          className={"usaCitizen"}
          label={
            "Is your primary/mailing address a PO Box or Personal Mailbox (PMB)?"
          }
          isSingleSelect={true}
          validationMessage={
            bidderPrimaryAddressInformationState.isPrimaryAddressPoBoxErrorMessage
          }
          onChange={handlePrimaryAddressPoBoxe}
          isRequired={true}
          infoTipContent={<BidderPrimaryAddressInfoTip />}
          infoTipClass={"ppms-usa-input-info-body"}
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <PPMSAddress
            id={"primary-address-information"}
            title={"Primary Address Information"}
            showAddressLine3={true}
            address1={bidderPrimaryAddressInformationState.addressLine1}
            address1Required={true}
            address1IsInvalid={
              bidderPrimaryAddressInformationState.addressLine1IsInvalid
            }
            address1ValidationMessage={
              bidderPrimaryAddressInformationState.addressLine1ValidationMessage
            }
            onChangeAddress1={(value: any) => {
              updateBidderPrimaryAddressInformationState({
                addressLine1: value,
              });
            }}
            updateAddress1={(value: any, validation: any) => {
              checkIfAddressFieldsChanged();
              let valid = value?.length > 0;
              updateBidderPrimaryAddressInformationState({
                addressLine1: value,
                addressLine1IsInvalid: !valid,
                addressLine1IsValid: valid,
                addressLine1ValidationMessage: validation.validationError,
              });
            }}
            address2={bidderPrimaryAddressInformationState.addressLine2}
            address2Required={false}
            address2IsInvalid={
              bidderPrimaryAddressInformationState.addressLine2IsInvalid
            }
            address2ValidationMessage={
              bidderPrimaryAddressInformationState.addressLine2ValidationMessage
            }
            updateAddress2={(value: any) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                addressLine2: value,
              });
            }}
            address3={bidderPrimaryAddressInformationState.addressLine3}
            address3Required={false}
            address3IsInvalid={
              bidderPrimaryAddressInformationState.addressLine3IsInvalid
            }
            address3ValidationMessage={
              bidderPrimaryAddressInformationState.addressLine3ValidationMessage
            }
            updateAddress3={(value: any) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                addressLine3: value,
              });
            }}
            city={bidderPrimaryAddressInformationState.city}
            cityRequired={true}
            cityIsInvalid={bidderPrimaryAddressInformationState.cityIsInvalid}
            cityValidationMessage={
              bidderPrimaryAddressInformationState.cityValidationMessage
            }
            onChangeCity={(value: any) => {
              updateBidderPrimaryAddressInformationState({ city: value });
            }}
            updateCity={(value: any, validation: any) => {
              checkIfAddressFieldsChanged();
              let valid = value?.length > 0;
              updateBidderPrimaryAddressInformationState({
                city: value,
                cityIsInvalid: !valid,
                cityIsvalid: valid,
                cityValidationMessage: validation.error,
              });
            }}
            state={bidderPrimaryAddressInformationState.stateCode}
            stateRequired={true}
            stateIsInvalid={
              bidderPrimaryAddressInformationState.stateCodeIsInvalid
            }
            updateState={(value: any, validation: any) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                stateCode: value,
                stateCodeIsInvalid: validation.isInvalid,
                stateCodeIsValid: !validation.isInvalid,
                stateCodeValidationMessage: validation.validationError,
              });
            }}
            zip={bidderPrimaryAddressInformationState.zip}
            zipRequired={true}
            zipIsInvalid={bidderPrimaryAddressInformationState.zipIsInvalid}
            zipValidationMessage={
              bidderPrimaryAddressInformationState.zipValidationMessage
            }
            onChangeZip={(value: any) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                zip: value,
              });
            }}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string,
              disabledZipExtension: boolean
            ) => {
              updateBidderPrimaryAddressInformationState({
                zipCode: value,
                zipIsInvalid: inValid,
                zipIsValid: valid,
                zipValidationMessage: validationError,
                disabledZipExtension: disabledZipExtension,
              });
            }}
            zip2={bidderPrimaryAddressInformationState.zip2Code}
            zip2IsInvalid={bidderPrimaryAddressInformationState.zip2IsInvalid}
            zip2IsValid={bidderPrimaryAddressInformationState.zip2IsValid}
            showZipExtension={true}
            disabledZipExtension={
              bidderPrimaryAddressInformationState.disabledZipExtension ||
              bidderPrimaryAddressInformationState.zip?.length === 0
            }
            onChangeZipExtension={(value: any) => {
              updateBidderPrimaryAddressInformationState({
                zip2Code: value,
              });
            }}
            updateZipExtension={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string
            ) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                zip2Code: value,
                zip2IsInvalid: inValid,
                zip2IsValid: valid,
                zip2ValidationMessage: validationError,
              });
            }}
            validationExtensionMessage={
              bidderPrimaryAddressInformationState.zip2ValidationMessage
            }
          />
        </div>
      </div>
    </>
  }

  let internationalAddress;
  if (bidderPersonalInformationState.country?.toUpperCase() !== "US") {
    internationalAddress = <>
      <div className={"grid-row"}>
        <PPMSToggleRadio
          id={"isPrimaryAddressPoBox"}
          options={bidderPrimaryAddressInformationState.isAddressPoBoxOptions}
          isInline={false}
          isDisabled={false}
          isInvalid={bidderPrimaryAddressInformationState.radioBoxInvalid}
          name={"isPrimaryAddressPoBox"}
          className={"usaCitizen"}
          label={
            "Is your primary/mailing address a PO Box or Personal Mailbox (PMB)?"
          }
          isSingleSelect={true}
          validationMessage={
            bidderPrimaryAddressInformationState.isPrimaryAddressPoBoxErrorMessage
          }
          onChange={handlePrimaryAddressPoBoxe}
          isRequired={true}
          infoTipContent={<BidderPrimaryAddressInfoTip />}
          infoTipClass={"ppms-usa-input-info-body"}
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <PPMSAddress
            id={"primary-address-information"}
            title={"Primary Address Information"}
            nonUsUser={true}
            showAddressLine3={true}
            address1={bidderPrimaryAddressInformationState.addressLine1}
            address1Required={true}
            address1IsInvalid={
              bidderPrimaryAddressInformationState.addressLine1IsInvalid
            }
            address1ValidationMessage={
              bidderPrimaryAddressInformationState.addressLine1ValidationMessage
            }
            onChangeAddress1={(value: any) => {
              updateBidderPrimaryAddressInformationState({
                addressLine1: value,
              });
            }}
            updateAddress1={(value: any, validation: any) => {
              checkIfAddressFieldsChanged();
              let valid = value?.length > 0;
              updateBidderPrimaryAddressInformationState({
                addressLine1: value,
                addressLine1IsInvalid: !valid,
                addressLine1IsValid: valid,
                addressLine1ValidationMessage: validation.validationError,
              });
            }}
            address2={bidderPrimaryAddressInformationState.addressLine2}
            address2Required={false}
            address2IsInvalid={
              bidderPrimaryAddressInformationState.addressLine2IsInvalid
            }
            address2ValidationMessage={
              bidderPrimaryAddressInformationState.addressLine2ValidationMessage
            }
            updateAddress2={(value: any) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                addressLine2: value,
              });
            }}
            address3={bidderPrimaryAddressInformationState.addressLine3}
            address3Required={false}
            address3IsInvalid={
              bidderPrimaryAddressInformationState.addressLine3IsInvalid
            }
            address3ValidationMessage={
              bidderPrimaryAddressInformationState.addressLine3ValidationMessage
            }
            updateAddress3={(value: any) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                addressLine3: value,
              });
            }}
            city={bidderPrimaryAddressInformationState.city}
            cityRequired={true}
            cityIsInvalid={bidderPrimaryAddressInformationState.cityIsInvalid}
            cityValidationMessage={
              bidderPrimaryAddressInformationState.cityValidationMessage
            }
            onChangeCity={(value: any) => {
              updateBidderPrimaryAddressInformationState({ city: value });
            }}
            updateCity={(value: any, validation: any) => {
              checkIfAddressFieldsChanged();
              let valid = value?.length > 0;
              updateBidderPrimaryAddressInformationState({
                city: value,
                cityIsInvalid: !valid,
                cityIsvalid: valid,
                cityValidationMessage: validation.error,
              });
            }}
            state={bidderPrimaryAddressInformationState.stateCode}
            stateRequired={true}
            stateIsInvalid={
              bidderPrimaryAddressInformationState.stateCodeIsInvalid
            }
            stateValidationMessage={bidderPrimaryAddressInformationState.stateCodeValidationMessage}
            updateState={(value: any, validation: any) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                stateCode: value,
                stateCodeIsInvalid: validation.isInvalid,
                stateCodeIsValid: !validation.isInvalid,
                stateCodeValidationMessage: validation.validationError,
              });
            }}
            zip={bidderPrimaryAddressInformationState.zip}
            zipRequired={true}
            zipIsInvalid={bidderPrimaryAddressInformationState.zipIsInvalid}
            zipValidationMessage={
              bidderPrimaryAddressInformationState.zipValidationMessage
            }
            onChangeZip={(value: any) => {
              updateBidderPrimaryAddressInformationState({
                zip: value,
              });
            }}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string,
              disabledZipExtension: boolean
            ) => {
              checkIfAddressFieldsChanged();
              updateBidderPrimaryAddressInformationState({
                zipCode: value,
                zipIsInvalid: inValid,
                zipIsValid: valid,
                zipValidationMessage: validationError,
                disabledZipExtension: disabledZipExtension,
              });
            }}
            zip2={bidderPrimaryAddressInformationState.zip2Code}
            zip2IsInvalid={bidderPrimaryAddressInformationState.zip2IsInvalid}
            zip2IsValid={bidderPrimaryAddressInformationState.zip2IsValid}
            showZipExtension={false}
            disabledZipExtension={
              bidderPrimaryAddressInformationState.disabledZipExtension ||
              bidderPrimaryAddressInformationState.zip?.length === 0
            }
            onChangeZipExtension={(value: any) => {
              updateBidderPrimaryAddressInformationState({
                zip2Code: value,
              });
            }}
            updateZipExtension={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string
            ) => {
              updateBidderPrimaryAddressInformationState({
                zip2Code: value,
                zip2IsInvalid: inValid,
                zip2IsValid: valid,
                zip2ValidationMessage: validationError,
              });
            }}
            validationExtensionMessage={
              bidderPrimaryAddressInformationState.zip2ValidationMessage
            }
          />
        </div>
      </div>
    </>
  }

  return (
    <React.Fragment>
      {nonInternationalAddress}
      {internationalAddress}
    </React.Fragment>
  );
}
