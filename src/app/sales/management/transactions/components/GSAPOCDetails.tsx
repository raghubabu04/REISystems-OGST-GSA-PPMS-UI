import { isEmpty } from "lodash";
import React, { useContext } from "react";
import { async } from "rxjs";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSPhoneNumber } from "../../../../../ui-kit/components/PPMS-phone-number";
import { PPMSState } from "../../../../../ui-kit/components/PPMS-state";
import {
  validatePhoneFax,
  phoneExtensionValidation,
  validateZipStateCity,
  zipValidation,
} from "../../../../../ui-kit/components/validations/FieldValidations";
import { SalesTransactionContext } from "../SalesTransactionContext";
import { SalesTransactionState } from "../SalesTransactionState";

interface GSAPOCDetailsProps {}

const GSAPOCDetails = (props: GSAPOCDetailsProps) => {
  const { salesTransactionState, updateSalesTransactionState } = useContext(
    SalesTransactionContext
  );
  let commonApiService = new CommonApiService();
  const cityStateZipValidation = async (state) => {
    const cityToVerify = state.data.gsaPointOfContact.addressDTO.city;
    const stateToVerify = state.data.gsaPointOfContact.addressDTO.state;
    const zipToVerify = state.data.gsaPointOfContact.addressDTO.zipCode;
    let validation = null;
    if (cityToVerify && stateToVerify && zipToVerify) {
      await commonApiService
        .getZipCode(zipToVerify)
        .then((response: any) => {
          return (validation = validateZipStateCity(
            response.data,
            cityToVerify,
            stateToVerify
          ));
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
    return validation;
  };
  return (
    <>
      <div className="grid-row grid-gap">
        <div className="grid-col-2">
          <PPMSInput
            id={"sale-location-aac"}
            inputType={"text"}
            isDisabled={true}
            label={"Sale Location AAC"}
            isRequired={true}
            value={
              salesTransactionState.data.gsaPointOfContact.salesLocationAAC
            }
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.salesLocationAAC =
                event.target.value;
              updateSalesTransactionState(state);
            }}
          />
        </div>
        <div className="grid-col-4">
          <PPMSInput
            id={"agency-name"}
            inputType={"text"}
            isDisabled={true}
            label={"Agency Name"}
            isRequired={true}
            value={salesTransactionState.data.gsaPointOfContact.agencyName}
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.agencyName = event.target.value;
              updateSalesTransactionState(state);
            }}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-address-line-1"}
            inputType={"text"}
            isDisabled={false}
            label={"Address"}
            isRequired={true}
            value={
              salesTransactionState.data.gsaPointOfContact.addressDTO
                .addressLine1
            }
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.addressDTO.addressLine1 =
                event.target.value;
              if (state.data.gsaPointOfContact.addressDTO.addressLine1 === "") {
                state.validation.contactAddressLine1isInvalid = true;
              } else {
                state.validation.contactAddressLine1isInvalid = false;
                state.validation.submitBtnDisable = false;
              }
              updateSalesTransactionState(state);
            }}
            isInvalid={
              salesTransactionState.validation.contactAddressLine1isInvalid
            }
            validationMessage={
              salesTransactionState.validation
                .contactAddressLine1ValidationMessage
            }
            isReadOnly={salesTransactionState.other.isReadOnly}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-address-line-2"}
            inputType={"text"}
            isDisabled={false}
            isRequired={true}
            value={
              salesTransactionState.data.gsaPointOfContact.addressDTO
                .addressLine2
            }
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.addressDTO.addressLine2 =
                event.target.value;
              if (state.data.gsaPointOfContact.addressDTO.addressLine2 === "") {
                state.validation.contactAddressLine2isInvalid = true;
              } else {
                state.validation.contactAddressLine2isInvalid = false;
                state.validation.submitBtnDisable = false;
              }
              updateSalesTransactionState(state);
            }}
            isInvalid={
              salesTransactionState.validation.contactAddressLine2isInvalid
            }
            validationMessage={
              salesTransactionState.validation
                .contactAddressLine2ValidationMessage
            }
            isReadOnly={salesTransactionState.other.isReadOnly}
            title={"sale-address-line-2"}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-address-line-3"}
            inputType={"text"}
            isDisabled={false}
            isRequired={false}
            value={
              salesTransactionState.data.gsaPointOfContact.addressDTO
                .addressLine3
            }
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.addressDTO.addressLine3 =
                event.target.value;
              updateSalesTransactionState(state);
            }}
            isReadOnly={salesTransactionState.other.isReadOnly}
            title={"sale-address-line-3"}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-city"}
            inputType={"text"}
            isDisabled={false}
            label={"City"}
            isRequired={true}
            value={salesTransactionState.data.gsaPointOfContact.addressDTO.city}
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.addressDTO.city = event.target.value;
              if (state.data.gsaPointOfContact.addressDTO.city === "") {
                state.validation.contactCityisInvalid = true;
              } else {
                state.validation.submitBtnDisable = false;
                state.validation.contactCityisInvalid = false;
              }
              updateSalesTransactionState(state);
            }}
            isInvalid={salesTransactionState.validation.contactCityisInvalid}
            validationMessage={
              salesTransactionState.validation.contactCityValidationMessage
            }
            isReadOnly={salesTransactionState.other.isReadOnly}
            onBlur={async () => {
              let state = salesTransactionState;
              if (
                !isEmpty(state.data.gsaPointOfContact.addressDTO.state) &&
                !isEmpty(state.data.gsaPointOfContact.addressDTO.zipCode)
              ) {
                await cityStateZipValidation(state).then((response) => {
                  if (!isEmpty(response)) {
                    state.validation.contactZipcodeisInvalid = true;
                    state.validation.contactCityisInvalid = true;
                    state.validation.contactZipcodeValidationMessage = response;
                  } else {
                    state.validation.submitBtnDisable = false;
                    state.validation.contactCityisInvalid = false;
                    state.validation.contactZipcodeisInvalid = false;
                  }
                });
              } else {
                state.validation.submitBtnDisable = false;
                state.validation.contactCityisInvalid = false;
                state.validation.contactZipcodeisInvalid = false;
              }
              updateSalesTransactionState(state);
            }}
          />
        </div>
        <div className="grid-col-4">
          <PPMSState
            id={"sales-state"}
            label={"State"}
            required={true}
            isValid={true}
            selectedState={
              salesTransactionState.data.gsaPointOfContact.addressDTO.state
            }
            updateLocationState={async (event: any) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.addressDTO.state = event;
              if (state.data.gsaPointOfContact.addressDTO.state === "") {
                state.validation.contactStateisInvalid = true;
              } else {
                if (
                  !isEmpty(state.data.gsaPointOfContact.addressDTO.city) &&
                  !isEmpty(state.data.gsaPointOfContact.addressDTO.zipCode)
                ) {
                  await cityStateZipValidation(state).then((response) => {
                    if (!isEmpty(response)) {
                      state.validation.contactZipcodeisInvalid = true;
                      state.validation.contactZipcodeValidationMessage = response;
                    } else {
                      state.validation.submitBtnDisable = false;
                      state.validation.contactStateisInvalid = false;
                      state.validation.contactZipcodeisInvalid = false;
                    }
                  });
                } else {
                  state.validation.submitBtnDisable = false;
                  state.validation.contactStateisInvalid = false;
                }
              }
              updateSalesTransactionState(state);
            }}
            disabled={salesTransactionState.other.isReadOnly}
            isInvalid={salesTransactionState.validation.contactStateisInvalid}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-3">
          <PPMSInput
            id={"sale-zip"}
            inputType={"number"}
            isDisabled={false}
            label={"ZIP Code"}
            isRequired={true}
            value={
              salesTransactionState.data.gsaPointOfContact.addressDTO.zipCode
            }
            onBlur={async () => {
              let state = salesTransactionState;
              if (
                !isEmpty(state.data.gsaPointOfContact.addressDTO.state) &&
                !isEmpty(state.data.gsaPointOfContact.addressDTO.city)
              ) {
                await cityStateZipValidation(state).then((response) => {
                  if (!isEmpty(response)) {
                    state.validation.contactZipcodeisInvalid = true;
                    state.validation.contactZipcodeValidationMessage = response;
                  } else {
                    state.validation.submitBtnDisable = false;
                    state.validation.contactZipcodeisInvalid = false;
                  }
                });
              } else {
                state.validation.submitBtnDisable = false;
                state.validation.contactZipcodeisInvalid = false;
              }
              updateSalesTransactionState(state);
            }}
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.addressDTO.zipCode =
                event.target.value;
              if (
                state.data.gsaPointOfContact.addressDTO.zipCode === "" ||
                state.data.gsaPointOfContact.addressDTO.zipCode.length < 5
              ) {
                state.validation.contactZipcodeisInvalid = true;
              } else {
                state.validation.contactZipcodeisInvalid = false;
                state.validation.submitBtnDisable = false;
              }
              updateSalesTransactionState(state);
            }}
            isInvalid={salesTransactionState.validation.contactZipcodeisInvalid}
            validationMessage={
              salesTransactionState.validation.contactZipcodeValidationMessage
            }
            isReadOnly={salesTransactionState.other.isReadOnly}
          />
        </div>
        <div className="grid-col-2">
          <PPMSInput
            id={"sale-zip-extn"}
            inputType={"number"}
            isDisabled={false}
            label={"ZIP Ext."}
            isRequired={false}
            value={
              salesTransactionState.data.gsaPointOfContact.addressDTO.zipExtn
            }
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.addressDTO.zipExtn =
                event.target.value;
              updateSalesTransactionState(state);
            }}
            isReadOnly={salesTransactionState.other.isReadOnly}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-contact"}
            inputType={"text"}
            isDisabled={true}
            label={"Email Address"}
            isRequired={true}
            value={salesTransactionState.data.gsaPointOfContact.contact}
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.gsaPointOfContact.contact = event.target.value;
              if (state.data.gsaPointOfContact.contact === "") {
                state.validation.contactInvalid = true;
              } else {
                state.validation.contactInvalid = false;
                state.validation.submitBtnDisable = false;
              }
              updateSalesTransactionState(state);
            }}
            isInvalid={salesTransactionState.validation.contactInvalid}
            validationMessage={
              salesTransactionState.validation.contactValidationMessage
            }
            isReadOnly={salesTransactionState.other.isReadOnly}
          />
        </div>
        <div className="grid-col-8">
          <div className="grid-row grid-gap-2">
            <PPMSPhoneNumber
              id={"sales-phonenumber"}
              disabled={false}
              showExtension={true}
              disabledExtension={false}
              phone={
                salesTransactionState?.data?.gsaPointOfContact?.phoneNumber
              }
              maxLength={10}
              labelBold={false}
              isInvalid={
                salesTransactionState?.validation?.contactPhoneisInvalid
              }
              validationMessage={
                salesTransactionState?.validation?.contactPhoneValidationMessage
              }
              extension={salesTransactionState?.data?.gsaPointOfContact?.extn}
              maxLengthExtension={8}
              isExtensionInvalid={
                salesTransactionState?.validation?.contactPhoneExtnisInvalid
              }
              extensionValidationMessage={
                salesTransactionState?.validation
                  ?.contactPhoneExtnValidationMessage
              }
              required={true}
              onChangePhoneNumber={(value) => {
                let state = salesTransactionState;
                state.data.gsaPointOfContact.phoneNumber = value;
                updateSalesTransactionState(state);
              }}
              onChangePhoneExt={(value) => {
                let state = salesTransactionState;
                state.data.gsaPointOfContact.extn = value;
                updateSalesTransactionState(state);
              }}
              updatePhoneNumber={(value) => {
                let validation = {
                  isInvalid: false,
                  validationError: "",
                };
                let state = salesTransactionState;
                validation = validatePhoneFax(value);
                state.validation.contactPhoneisInvalid = validation.isInvalid;
                state.validation.contactPhoneValidationMessage =
                  validation.validationError;
                updateSalesTransactionState(state);
              }}
              updatePhoneExtension={(value) => {
                let validation = {
                  isInvalid: false,
                  validationError: "",
                };
                let state = salesTransactionState;
                validation = phoneExtensionValidation(value);
                state.validation.contactPhoneExtnisInvalid =
                  validation.isInvalid;
                state.validation.contactPhoneExtnValidationMessage =
                  validation.validationError;
                updateSalesTransactionState(state);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GSAPOCDetails;
