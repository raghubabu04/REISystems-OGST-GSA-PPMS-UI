import React, { useContext } from "react";
import { BidderContext } from "../BidderContext";
import { PPMSAddress } from "../../../../ui-kit/components/PPMS-address";

interface BidderSecondaryAddressInformationProps {
}

export default function BidderSecondaryAddressInformation(props: BidderSecondaryAddressInformationProps) {
  const { bidderPersonalInformationState,
    updateBidderPersonalInformationState, bidderSecondaryAddressInformationState, updateBidderSecondaryAddressInformationState } = useContext(BidderContext);


  let nonInternationalAddress;
  if (bidderPersonalInformationState.country?.toUpperCase() === "US") {
    nonInternationalAddress =
      <>
        <div className={"grid-col-12"}>
          <PPMSAddress
            id={"secondary-address-information"}
            title={"Physical Address Information"}
            showAddressLine3={true}
            address1={bidderSecondaryAddressInformationState.secondaryAddressLine1}
            address1Required={true}
            address1IsInvalid={bidderSecondaryAddressInformationState.secondaryAddressLine1IsInvalid}
            address1ValidationMessage={bidderSecondaryAddressInformationState.secondaryAddressLine1ValidationMessage}
            onChangeAddress1={(value: any) => {
              updateBidderSecondaryAddressInformationState({ secondaryAddressLine1: value })
            }}
            showZipExtension={true}
            updateAddress1={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateBidderSecondaryAddressInformationState({
                secondaryAddressLine1: value,
                secondaryAddressLine1IsInvalid: !valid,
                secondaryAddressLine1IsValid: valid,
                secondaryAddressLine1ValidationMessage: validation.validationError,
              });
            }}
            address2={bidderSecondaryAddressInformationState.secondaryAddressLine2}
            address2Required={false}
            address2IsInvalid={bidderSecondaryAddressInformationState.secondaryAddressLine2IsInvalid}
            address2ValidationMessage={bidderSecondaryAddressInformationState.secondaryAddressLine2ValidationMessage}
            updateAddress2={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryAddressLine2: value,
              });
            }}
            address3={bidderSecondaryAddressInformationState.secondaryAddressLine3}
            address3Required={false}
            address3IsInvalid={bidderSecondaryAddressInformationState.secondaryAddressLine3IsInvalid}
            address3ValidationMessage={bidderSecondaryAddressInformationState.secondaryAddressLine3ValidationMessage}
            updateAddress3={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryAddressLine3: value,
              });
            }}
            city={bidderSecondaryAddressInformationState.secondaryCity}
            cityRequired={true}
            cityIsInvalid={bidderSecondaryAddressInformationState.secondaryCityIsInvalid}
            cityValidationMessage={bidderSecondaryAddressInformationState.secondaryCityValidationMessage}
            onChangeCity={(value: any) => {
              updateBidderSecondaryAddressInformationState({ secondaryCity: value })
            }}
            updateCity={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateBidderSecondaryAddressInformationState({
                secondaryCity: value,
                secondaryCityIsInvalid: !valid,
                secondaryCityIsValid: valid,
                secondaryCityValidationMessage: validation.error,
              });
            }}
            state={bidderSecondaryAddressInformationState.secondaryStateCode}
            stateRequired={true}
            stateIsInvalid={bidderSecondaryAddressInformationState.secondaryStateCodeIsInvalid}
            updateState={(value: any, validation: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryStateCode: value,
                secondaryStateCodeIsInvalid: validation.isInvalid,
                secondaryStateCodeIsValid: !validation.isInvalid,
                secondaryStateCodeValidationMessage: validation.error,
              });
            }}
            zip={bidderSecondaryAddressInformationState.secondaryZip}
            zipRequired={true}
            zipIsInvalid={bidderSecondaryAddressInformationState.secondaryZipIsInvalid}
            zipValidationMessage={bidderSecondaryAddressInformationState.secondaryZipValidationMessage}
            onChangeZip={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip: value
              })
            }}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string,
              disabledZipExtension: boolean
            ) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip: value,
                secondaryZipIsInvalid: inValid,
                secondaryZipIsValid: valid,
                secondaryZipValidationMessage: validationError,
                disabledZipExtension: disabledZipExtension,
              });
            }}
            zip2={bidderSecondaryAddressInformationState.secondaryZip2Code}
            zip2IsInvalid={bidderSecondaryAddressInformationState.secondaryZip2IsInvalid}
            zip2IsValid={bidderSecondaryAddressInformationState.secondaryZip2IsValid}
            disabledZipExtension={
              bidderSecondaryAddressInformationState.secondarydDisabledZipExtension || bidderSecondaryAddressInformationState.secondaryZip.length === 0
            }
            onChangeZipExtension={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip2Code: value
              })
            }}
            updateZipExtension={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string
            ) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip2Code: value,
                secondaryZip2IsInvalid: inValid,
                secondaryZip2IsValid: valid,
                secondaryZip2ValidationMessage: validationError,
              });
            }}
            validationExtensionMessage={
              bidderSecondaryAddressInformationState.secondaryZip2ValidationMessage
            }
          />
        </div>
      </>
  }
  let internationalAddress;
  if (bidderPersonalInformationState.country?.toUpperCase() !== "US") {
    internationalAddress =
      <>
        <div className={"grid-col-12"}>
          <PPMSAddress
            id={"secondary-address-information"}
            title={"Physical Address Information"}
            nonUsUser={true}
            showAddressLine3={true}
            address1={bidderSecondaryAddressInformationState.secondaryAddressLine1}
            address1Required={true}
            address1IsInvalid={bidderSecondaryAddressInformationState.secondaryAddressLine1IsInvalid}
            address1ValidationMessage={bidderSecondaryAddressInformationState.secondaryAddressLine1ValidationMessage}
            onChangeAddress1={(value: any) => {
              updateBidderSecondaryAddressInformationState({ secondaryAddressLine1: value })
            }}
            showZipExtension={true}
            updateAddress1={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateBidderSecondaryAddressInformationState({
                secondaryAddressLine1: value,
                secondaryAddressLine1IsInvalid: !valid,
                secondaryAddressLine1IsValid: valid,
                secondaryAddressLine1ValidationMessage: validation.validationError,
              });
            }}
            address2={bidderSecondaryAddressInformationState.secondaryAddressLine2}
            address2Required={false}
            address2IsInvalid={bidderSecondaryAddressInformationState.secondaryAddressLine2IsInvalid}
            address2ValidationMessage={bidderSecondaryAddressInformationState.secondaryAddressLine2ValidationMessage}
            updateAddress2={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryAddressLine2: value,
              });
            }}
            address3={bidderSecondaryAddressInformationState.secondaryAddressLine3}
            address3Required={false}
            address3IsInvalid={bidderSecondaryAddressInformationState.secondaryAddressLine3IsInvalid}
            address3ValidationMessage={bidderSecondaryAddressInformationState.secondaryAddressLine3ValidationMessage}
            updateAddress3={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryAddressLine3: value,
              });
            }}
            city={bidderSecondaryAddressInformationState.secondaryCity}
            cityRequired={true}
            cityIsInvalid={bidderSecondaryAddressInformationState.secondaryCityIsInvalid}
            cityValidationMessage={bidderSecondaryAddressInformationState.secondaryCityValidationMessage}
            onChangeCity={(value: any) => {
              updateBidderSecondaryAddressInformationState({ secondaryCity: value })
            }}
            updateCity={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateBidderSecondaryAddressInformationState({
                secondaryCity: value,
                secondaryCityIsInvalid: !valid,
                secondaryCityIsValid: valid,
                secondaryCityValidationMessage: validation.error,
              });
            }}
            state={bidderSecondaryAddressInformationState.secondaryStateCode}
            stateRequired={true}
            stateIsInvalid={bidderSecondaryAddressInformationState.secondaryStateCodeIsInvalid}
            updateState={(value: any, validation: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryStateCode: value,
                secondaryStateCodeIsInvalid: validation.isInvalid,
                secondaryStateCodeIsValid: !validation.isInvalid,
                secondaryStateCodeValidationMessage: validation.error,
              });
            }}
            zip={bidderSecondaryAddressInformationState.secondaryZip}
            zipRequired={true}
            zipIsInvalid={bidderSecondaryAddressInformationState.secondaryZipIsInvalid}
            zipValidationMessage={bidderSecondaryAddressInformationState.secondaryZipValidationMessage}
            onChangeZip={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip: value
              })
            }}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string,
              disabledZipExtension: boolean
            ) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip: value,
                secondaryZipIsInvalid: inValid,
                secondaryZipIsValid: valid,
                secondaryZipValidationMessage: validationError,
                disabledZipExtension: disabledZipExtension,
              });
            }}
            zip2={bidderSecondaryAddressInformationState.secondaryZip2Code}
            zip2IsInvalid={bidderSecondaryAddressInformationState.secondaryZip2IsInvalid}
            zip2IsValid={bidderSecondaryAddressInformationState.secondaryZip2IsValid}
            disabledZipExtension={
              bidderSecondaryAddressInformationState.secondarydDisabledZipExtension || bidderSecondaryAddressInformationState.secondaryZip.length === 0
            }
            onChangeZipExtension={(value: any) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip2Code: value
              })
            }}
            updateZipExtension={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string
            ) => {
              updateBidderSecondaryAddressInformationState({
                secondaryZip2Code: value,
                secondaryZip2IsInvalid: inValid,
                secondaryZip2IsValid: valid,
                secondaryZip2ValidationMessage: validationError,
              });
            }}
            validationExtensionMessage={
              bidderSecondaryAddressInformationState.secondaryZip2ValidationMessage
            }
          />
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
