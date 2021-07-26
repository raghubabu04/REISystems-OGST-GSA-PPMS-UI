import { stat } from "fs";
import React, { useContext, useEffect } from "react";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSEmail } from "../../../../ui-kit/components/PPMS-email";
import { PPMSFirstNameLastName } from "../../../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { PPMSState } from "../../../../ui-kit/components/PPMS-state";
import { PPMSZip } from "../../../../ui-kit/components/PPMS-zip";
import {
  stateValidation,
  validateConfirmEmailAddress,
  validateEmail,
  validateEmailAddress,
  validateFormattedPhoneNumber,
  zipExtensionValidation,
  zipValidation
} from "../../../../ui-kit/components/validations/FieldValidations";
import { SalesUserContext } from "../SalesUserContext";
import {PPMSAddress} from "../../../../ui-kit/components/PPMS-address";
import {PPMSEmailConfirm} from "../../../../ui-kit/components/PPMS-email-confirm";

interface SalesUserInformationProps {}

export default function SalesUserInformation(props: SalesUserInformationProps) {
    const {salesUserInformationState, updateSalesUserInformationState} = useContext(SalesUserContext);

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
    }, [salesUserInformationState]);

    return (
        <React.Fragment>
            <div className={"grid-row grid-gap-4"}>
                <PPMSFirstNameLastName
                id={'sales-user-information-firstname-lastname'}
                required={true}
                maxLength={30}
                maxMiddleLength={1}
                showMiddleName={true}
                firstName={salesUserInformationState.firstName}
                isFirstNameInvalid={salesUserInformationState.isFirstNameInvalid}
                validationFirstMessage={salesUserInformationState.firstNameInvalidErrorMessage}
                middleName={salesUserInformationState.middleName}
                lastName={salesUserInformationState.lastName}
                isLastNameInvalid={salesUserInformationState.isLastNameInvalid}
                validationLastMessage={salesUserInformationState.lastNameInvalidErrorMessage}
                updateFirstName={firstNameUpdated}
                updateLastName={lastNameUpdated}
                updateMiddleName={(value => updateSalesUserInformationState({middleName: value}))}
                onChangeFirstName={(value => updateSalesUserInformationState({firstName: value}))}
                onChangeLastName={(value => updateSalesUserInformationState({lastName: value}))}
                onChangeMiddleName={(value => updateSalesUserInformationState({middleName: value}))}
                />
            </div>
            <div className={"grid-row grid-gap-4"}>
                <PPMSPhoneNumber
                id={'sales-user-information-phonenumber'}
                disabled={false}
                showExtension={true}
                phone={salesUserInformationState.phoneNumber}
                maxLength={10}
                isInvalid={salesUserInformationState.isPhoneNumberInvalid}
                validationMessage={salesUserInformationState.phoneNumberInvalidErrorMessage}
                extension={salesUserInformationState.phoneExtension}
                maxLengthExtension={8}
                isExtensionInvalid={salesUserInformationState.isPhoneExtensionInvalid}
                extensionValidationMessage={salesUserInformationState.phoneExtensionInvalidErrorMessage}
                required={true}
                updatePhoneNumber={phoneNumberUpdated}
                updatePhoneExtension={phoneExtensionUpdated}
                onChangePhoneNumber={(value => updateSalesUserInformationState({phoneNumber: value}))}
                onChangePhoneExt={(value => updateSalesUserInformationState({phoneExtension: value}))}
                />
            </div>
            <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col-12"}>
                  <PPMSEmailConfirm
                    id={"sales-user-email"}
                    required={true}
                    validateExistingUser={true}
                    disabled={salesUserInformationState.id !== null}
                    email={salesUserInformationState.emailAddress}
                    isEmailInvalid={salesUserInformationState.isEmailAddressInvalid}
                    isEmailValid={!salesUserInformationState.isEmailAddressValid}
                    confirmEmail={salesUserInformationState.confirmEmailAddress}
                    confirmDisabled={salesUserInformationState.confirmDisabled}
                    isConfirmEmailInvalid={salesUserInformationState.isConfirmEmailAddressInvalid}
                    isConfirmEmailValid={!salesUserInformationState.isConfirmEmailAddressValid}
                    showEmailConfirm={true}
                    updateEmail={emailAddressUpdated}
                    updateConfirmEmail={confirmEmailAddressUpdated}
                    emailValidationMessage={salesUserInformationState.emailAddressInvalidErrorMessage}
                    confirmEmailValidationMessage={salesUserInformationState.confirmEmailAddressInvalidErrorMessage}
                  />
                </div>
            </div>
          <PPMSAddress
            id={"sales-user-address"}
            title={"Sales User"}
            showAddressLine3={true}
            address1={salesUserInformationState.salesUserAddress1}
            address1Required={true}
            address1IsInvalid={
              salesUserInformationState.salesUserAddress1IsInvalid
            }
            address1IsValid={
              salesUserInformationState.salesUserAddress1IsValid
            }
            address1ValidationMessage={
              salesUserInformationState.salesUserAddress1ValidationMessage
            }
            onChangeAddress1={(value: any)=>{ updateSalesUserInformationState({salesUserAddress1: value}) }}
            updateAddress1={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateSalesUserInformationState({
                salesUserAddress1: value,
                salesUserAddress1IsInvalid: !valid,
                salesUserAddress1IsValid: valid,
                salesUserAddress1ValidationMessage: validation.error,
              });
            }}
            address2={salesUserInformationState.salesUserAddress2}
            address2Required={false}
            address2IsInvalid={
              salesUserInformationState.salesUserAddress2IsInvalid
            }
            address2IsValid={
              salesUserInformationState.salesUserAddress2IsValid
            }
            address2ValidationMessage={
              salesUserInformationState.salesUserAddress2ValidationMessage
            }
            updateAddress2={(value: any) => {
              updateSalesUserInformationState({
                salesUserAddress2: value,
              });
            }}
            address3={salesUserInformationState.salesUserAddress3}
            address3Required={false}
            address3IsInvalid={
              salesUserInformationState.salesUserAddress3IsInvalid
            }
            address3IsValid={
              salesUserInformationState.salesUserAddress3IsValid
            }
            address3ValidationMessage={
              salesUserInformationState.salesUserAddress3ValidationMessage
            }
            showZipExtension={true}
            updateAddress3={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateSalesUserInformationState({
                salesUserAddress3: value,
                salesUserAddress3IsInvalid: !valid,
                salesUserAddress3IsValid: valid,
                salesUserAddress3ValidationMessage: validation.error,
              });
            }}
            city={salesUserInformationState.salesUserCity}
            cityRequired={true}
            cityIsInvalid={salesUserInformationState.salesUserCityIsInvalid}
            cityIsValid={salesUserInformationState.salesUserCityIsValid}
            cityValidationMessage={
              salesUserInformationState.salesUserCityValidationMessage
            }
            onChangeCity={(value: any) => {updateSalesUserInformationState({salesUserCity: value})}}
            updateCity={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateSalesUserInformationState({
                salesUserCity: value,
                salesUserCityIsInvalid: !valid,
                salesUserCityIsValid: valid,
                salesUserCityValidationMessage: validation.error,
              });
            }}
            state={salesUserInformationState.salesUserStateCode}
            stateRequired={true}
            stateIsInvalid={
              salesUserInformationState.salesUserStateIsInvalid
            }
            stateIsValid={salesUserInformationState.salesUserStateIsValid}
            updateState={(value: any, validation: any) => {
              updateSalesUserInformationState({
                salesUserStateCode: value,
                salesUserStateIsInvalid: validation.isInvalid,
                salesUserStateIsValid: !validation.isInvalid,
                salesUserStateValidationMessage: validation.error,
              });
            }}
            zip={salesUserInformationState.salesUserZipCode}
            zipRequired={true}
            zipIsInvalid={salesUserInformationState.salesUserZipIsInvalid}
            zipIsValid={salesUserInformationState.salesUserZipIsValid}
            zipValidationMessage={
              salesUserInformationState.salesUserZipValidationMessage
            }
            onChangeZip={(value: any)=>{
              updateSalesUserInformationState({
                salesUserZipCode: value})
            }}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string,
              disabledZipExtension: boolean
            ) => {
              updateSalesUserInformationState({
                salesUserZipCode: value,
                salesUserZipIsInvalid: inValid,
                salesUserZipIsValid: valid,
                salesUserZipValidationMessage: validationError,
                salesUserDisabledZipExtension: disabledZipExtension,
              });
            }}
            zip2={salesUserInformationState.salesUserZip2Code}
            zip2IsInvalid={salesUserInformationState.salesUserZip2IsInvalid}
            zip2IsValid={salesUserInformationState.salesUserZip2IsValid}
            disabledZipExtension={
              salesUserInformationState.salesUserDisabledZipExtension || salesUserInformationState.salesUserZipCode.length === 0
            }
            onChangeZipExtension={(value: any)=>{
              updateSalesUserInformationState({
                salesUserZip2Code: value})
            }}
            updateZipExtension={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string
            ) => {
              updateSalesUserInformationState({
                salesUserZip2Code: value,
                salesUserZip2IsInvalid: inValid,
                salesUserZip2IsValid: valid,
                salesUserZip2ValidationMessage: validationError,
              });
            }}
            validationExtensionMessage={
              salesUserInformationState.salesUserZip2ValidationMessage
            }
          />
        </React.Fragment>
    );

    function firstNameUpdated(value : string) {
        if(value && value.length > 0) {
            updateSalesUserInformationState({
                firstName: value,
                isFirstNameInvalid: false,
                firstNameInvalidErrorMessage: ''
            })
        } else {
            updateSalesUserInformationState({
                firstName: value,
                isFirstNameInvalid: true,
                firstNameInvalidErrorMessage: 'First Name is Required'
            })
        }
    }

    function lastNameUpdated(value: string) {
        if(value && value.length > 0) {
            updateSalesUserInformationState({
                lastName: value,
                isLastNameInvalid: false,
                lastNameInvalidErrorMessage: ''
            })
        } else {
            updateSalesUserInformationState({
                lastName: value,
                isLastNameInvalid: true,
                lastNameInvalidErrorMessage: 'Last Name is Required'
            })
        }
    }

    function phoneNumberUpdated(value: string, validation: any){
        updateSalesUserInformationState({
            phoneNumber: value,
            isPhoneNumberInvalid: validation.isInvalid,
            phoneNumberInvalidErrorMessage: validation.validationError
        });
    }

    function phoneExtensionUpdated(value: string){
        updateSalesUserInformationState({
            phoneExtension: value
        });
    }

    function emailAddressUpdated(value: string, validation: any){
        updateSalesUserInformationState({
            emailAddress : value,
            isEmailAddressInvalid : validation.isInvalid,
            emailAddressInvalidErrorMessage : validation.validationError,
            confirmDisabled: validation.confirmDisabled,
        });
    }

    function confirmEmailAddressUpdated(value: string, validation: any){
        updateSalesUserInformationState({
            confirmEmailAddress : value,
            isConfirmEmailAddressInvalid : validation.isInvalid,
            confirmEmailAddressInvalidErrorMessage : validation.validationError
        });

    }

    function validate() {
        firstNameUpdated(salesUserInformationState.firstName);
        lastNameUpdated(salesUserInformationState.lastName);

        const phone = salesUserInformationState.phoneNumber;
        let validationPhone = validateFormattedPhoneNumber(phone);
        phoneNumberUpdated(phone, validationPhone);
    }
}
