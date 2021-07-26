import React, { useContext, useEffect } from "react";
import { PPMSAddress } from "../../../../ui-kit/components/PPMS-address";
import { PPMSEmailConfirm } from "../../../../ui-kit/components/PPMS-email-confirm";
import { PPMSFirstNameLastName } from "../../../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { UserProfileSaleContext } from "../UserProfileForSalesContext";



interface UserProfileForSalesUserInformationProps {}

export default function UserProfileForSalesUserInformation(props: UserProfileForSalesUserInformationProps) {
    const {salesUserProfileInformationState, updateSalesUserProfileInformationState} = useContext(UserProfileSaleContext);

    return (
        <React.Fragment>
            <div className={"grid-row grid-gap-4"}>
                <PPMSFirstNameLastName
                id={'sales-user-information-firstname-lastname'}
                disabled={true}
                required={true}
                maxLength={1000}
                maxMiddleLength={1}
                showMiddleName={true}
                firstName={salesUserProfileInformationState.firstName}
                isFirstNameInvalid={salesUserProfileInformationState.isFirstNameInvalid}
                validationFirstMessage={salesUserProfileInformationState.firstNameInvalidErrorMessage}
                middleName={salesUserProfileInformationState.middleName}
                lastName={salesUserProfileInformationState.lastName}
                isLastNameInvalid={salesUserProfileInformationState.isLastNameInvalid}
                validationLastMessage={salesUserProfileInformationState.lastNameInvalidErrorMessage}
                updateFirstName={firstNameUpdated}
                updateLastName={lastNameUpdated}
                updateMiddleName={(value => updateSalesUserProfileInformationState({middleName: value}))}
                onChangeFirstName={(value => updateSalesUserProfileInformationState({firstName: value}))}
                onChangeLastName={(value => updateSalesUserProfileInformationState({lastName: value}))}
                onChangeMiddleName={(value => updateSalesUserProfileInformationState({middleName: value}))}
                />
            </div>
            <div className={"grid-row grid-gap-4"}>
                <PPMSPhoneNumber
                id={'sales-user-information-phonenumber'}
                disabled={false}
                showExtension={true}
                phone={salesUserProfileInformationState.phoneNumber}
                maxLength={10}
                isInvalid={salesUserProfileInformationState.isPhoneNumberInvalid}
                validationMessage={salesUserProfileInformationState.phoneNumberInvalidErrorMessage}
                extension={salesUserProfileInformationState.phoneExtension}
                maxLengthExtension={8}
                isExtensionInvalid={salesUserProfileInformationState.isPhoneExtensionInvalid}
                extensionValidationMessage={salesUserProfileInformationState.phoneExtensionInvalidErrorMessage}
                required={true}
                updatePhoneNumber={phoneNumberUpdated}
                updatePhoneExtension={phoneExtensionUpdated}
                onChangePhoneNumber={(value => updateSalesUserProfileInformationState({phoneNumber: value}))}
                onChangePhoneExt={(value => updateSalesUserProfileInformationState({phoneExtension: value}))}
                />
            </div>
            <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col-12"}>
                  <PPMSEmailConfirm
                     id={"sales-user-email"}
                     required={true}
                     validateExistingUser={false}
                     disabled={salesUserProfileInformationState.id !== null}
                     email={salesUserProfileInformationState.emailAddress}
                     isEmailInvalid={salesUserProfileInformationState.isEmailAddressInvalid}
                     isEmailValid={!salesUserProfileInformationState.isEmailAddressValid}
                     confirmEmail={""}
                     updateEmail={emailAddressUpdated}
                     updateConfirmEmail={confirmEmailAddressUpdated}
                     emailValidationMessage={salesUserProfileInformationState.emailAddressInvalidErrorMessage}
                     confirmEmailValidationMessage={salesUserProfileInformationState.confirmEmailAddressInvalidErrorMessage}
                  />
                </div>
            </div>
            <PPMSAddress
            id={"sales-user-address"} 
            address1={salesUserProfileInformationState.salesUserAddress1}
            address1Required={true}
            showAddressLine3={true}
            address1IsInvalid={
                salesUserProfileInformationState.salesUserAddress1IsInvalid
            }
            address1IsValid={
                salesUserProfileInformationState.salesUserAddress1IsValid
            }
            address1ValidationMessage={
                salesUserProfileInformationState.salesUserAddress1ValidationMessage
            }
            onChangeAddress1={(value: any)=>{ updateSalesUserProfileInformationState({salesUserAddress1: value}) }}
            updateAddress1={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateSalesUserProfileInformationState({
                salesUserAddress1: value,
                salesUserAddress1IsInvalid: !valid,
                salesUserAddress1IsValid: valid,
                salesUserAddress1ValidationMessage: validation.error,
              });
            }}
            address2={salesUserProfileInformationState.salesUserAddress2}
            address2Required={false}
            address2IsInvalid={
                salesUserProfileInformationState.salesUserAddress2IsInvalid
            }
            address2IsValid={
                salesUserProfileInformationState.salesUserAddress2IsValid
            }
            address2ValidationMessage={
                salesUserProfileInformationState.salesUserAddress2ValidationMessage
            }
            updateAddress2={(value: any) => {
                updateSalesUserProfileInformationState({
                salesUserAddress2: value,
              });
            }}
            address3={salesUserProfileInformationState.salesUserAddress3}
            address3Required={false}
            address3IsInvalid={
                salesUserProfileInformationState.salesUserAddress3IsInvalid
            }
            address3IsValid={
                salesUserProfileInformationState.salesUserAddress3IsValid
            }
            address3ValidationMessage={
                salesUserProfileInformationState.salesUserAddress3ValidationMessage
            }
            updateAddress3={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateSalesUserProfileInformationState({
                salesUserAddress3: value,
                salesUserAddress3IsInvalid: !valid,
                salesUserAddress3IsValid: valid,
                salesUserAddress3ValidationMessage: validation.error,
              });
            }}
            city={salesUserProfileInformationState.salesUserCity}
            cityRequired={true}
            cityIsInvalid={salesUserProfileInformationState.salesUserCityIsInvalid}
            cityIsValid={salesUserProfileInformationState.salesUserCityIsValid}
            cityValidationMessage={
                salesUserProfileInformationState.salesUserCityValidationMessage
            }
            onChangeCity={(value: any) => {updateSalesUserProfileInformationState({salesUserCity: value})}}
            updateCity={(value: any, validation: any) => {
              let valid = value.length > 0;
              updateSalesUserProfileInformationState({
                salesUserCity: value,
                salesUserCityIsInvalid: !valid,
                salesUserCityIsValid: valid,
                salesUserCityValidationMessage: validation.error,
              });
            }}
            state={salesUserProfileInformationState.salesUserStateCode}
            stateRequired={true}
            stateIsInvalid={
                salesUserProfileInformationState.salesUserStateIsInvalid
            }
            stateIsValid={salesUserProfileInformationState.salesUserStateIsValid}
            updateState={(value: any, validation: any) => {
                updateSalesUserProfileInformationState({
                salesUserStateCode: value,
                salesUserStateIsInvalid: validation.isInvalid,
                salesUserStateIsValid: !validation.isInvalid,
                salesUserStateValidationMessage: validation.error,
              });
            }}
            zip={salesUserProfileInformationState.salesUserZipCode}
            zipRequired={true}
            zipIsInvalid={salesUserProfileInformationState.salesUserZipIsInvalid}
            zipIsValid={salesUserProfileInformationState.salesUserZipIsValid}
            zipValidationMessage={
                salesUserProfileInformationState.salesUserZipValidationMessage
            }
            onChangeZip={(value: any)=>{
                updateSalesUserProfileInformationState({
                salesUserZipCode: value})
            }}
            updateZip={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string,
              disabledZipExtension: boolean
            ) => {
                updateSalesUserProfileInformationState({
                salesUserZipCode: value,
                salesUserZipIsInvalid: inValid,
                salesUserZipIsValid: valid,
                salesUserZipValidationMessage: validationError,
                salesUserDisabledZipExtension: disabledZipExtension,
              });
            }}
            showZipExtension={true}
            zip2={salesUserProfileInformationState.salesUserZip2Code}
            zip2IsInvalid={salesUserProfileInformationState.salesUserZip2IsInvalid}
            zip2IsValid={salesUserProfileInformationState.salesUserZip2IsValid}
            disabledZipExtension={
                salesUserProfileInformationState.salesUserDisabledZipExtension || salesUserProfileInformationState.salesUserZipCode.length === 0
            }
            onChangeZipExtension={(value: any)=>{
                updateSalesUserProfileInformationState({
                salesUserZip2Code: value})
            }}
            updateZipExtension={(
              value: any,
              inValid: boolean,
              valid: boolean,
              validationError: string
            ) => {
                updateSalesUserProfileInformationState({
                salesUserZip2Code: value,
                salesUserZip2IsInvalid: inValid,
                salesUserZip2IsValid: valid,
                salesUserZip2ValidationMessage: validationError,
              });
            }}
            validationExtensionMessage={
                salesUserProfileInformationState.salesUserZip2ValidationMessage
            }
          />
        </React.Fragment>
    );

    function firstNameUpdated(value : string) {
        if(value && value.length > 0) {
            updateSalesUserProfileInformationState({
                firstName: value,
                isFirstNameInvalid: false,
                firstNameInvalidErrorMessage: ''
            })
        } else {
            updateSalesUserProfileInformationState({
                firstName: value,
                isFirstNameInvalid: true,
                firstNameInvalidErrorMessage: 'First Name is Required'
            })
        }
    }

    function lastNameUpdated(value: string) {
        if(value && value.length > 0) {
            updateSalesUserProfileInformationState({
                lastName: value,
                isLastNameInvalid: false,
                lastNameInvalidErrorMessage: ''
            })
        } else {
            updateSalesUserProfileInformationState({
                lastName: value,
                isLastNameInvalid: true,
                lastNameInvalidErrorMessage: 'Last Name is Required'
            })
        }
    }

    function phoneNumberUpdated(value: string, validation: any){
        updateSalesUserProfileInformationState({
            phoneNumber: value,
            isPhoneNumberInvalid: validation.isInvalid,
            phoneNumberInvalidErrorMessage: validation.validationError
        });
    }

    function phoneExtensionUpdated(value: string){
        updateSalesUserProfileInformationState({
            phoneExtension: value
        });
    }

    function emailAddressUpdated(value: string, validation: any){
        updateSalesUserProfileInformationState({
            emailAddress : value,
            isEmailAddressInvalid : validation.isInvalid,
            emailAddressInvalidErrorMessage : validation.validationError,
            confirmDisabled: validation.confirmDisabled,
        });
    }

    function confirmEmailAddressUpdated(value: string, validation: any){
        updateSalesUserProfileInformationState({
            confirmEmailAddress : value,
            isConfirmEmailAddressInvalid : validation.isInvalid,
            confirmEmailAddressInvalidErrorMessage : validation.validationError
        });

    }

}