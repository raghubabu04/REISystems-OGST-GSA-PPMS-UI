import React from "react";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSFormattedPhoneFax } from "../../../../../ui-kit/components/PPMS-formatted-phone-fax";
import { PPMSPhoneNumber } from "../../../../../ui-kit/components/PPMS-phone-number";
import { formatPhone } from "../../../../../ui-kit/utilities/FormatUtil";
interface RealitySpecialistOrSCOProps {
  state: any;
  updateValueOfField?: any;
  validateFields?: any;
}
const RealtySpecialistOrSCODetails = (props: RealitySpecialistOrSCOProps) => {
  const { state, updateValueOfField, validateFields } = props;
  return (
    <>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"first-name-pbsdoi"}
            inputType={"text"}
            isDisabled={state?.validation?.realitySpecialistOrSCOFieldsDisabled}
            label={"First Name"}
            isRequired={true}
            value={state?.data?.contact?.firstName}
            onChange={(event) => {
              updateValueOfField("firstName", event?.target?.value);
            }}
            isInvalid={state?.validation?.firstNameIsInvalid}
            validationMessage={state?.validation?.firstNameValidationMessage}
            onBlur={() => {
              validateFields("firstName", state?.data?.contact?.firstName);
            }}
            maxLength={30}
          />
        </div>
        <div className="grid-col-4">
          <PPMSInput
            id={"last-name-pbsdoi"}
            inputType={"text"}
            isDisabled={state?.validation?.realitySpecialistOrSCOFieldsDisabled}
            label={"Last Name"}
            isRequired={true}
            value={state?.data?.contact?.lastName}
            onChange={(event) => {
              updateValueOfField("lastName", event?.target?.value);
            }}
            isInvalid={state?.validation?.lastNameIsInvalid}
            validationMessage={state?.validation?.lastNameValidationMessage}
            onBlur={() => {
              validateFields("lastName", state?.data?.contact?.lastName);
            }}
            maxLength={30}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"email-address-pbsdoi"}
            inputType={"text"}
            isDisabled={state?.validation?.realitySpecialistOrSCOFieldsDisabled}
            label={"Email Address"}
            isRequired={true}
            value={state?.data?.contact?.email}
            onChange={(event) => {
              updateValueOfField("emailAddress", event?.target?.value);
            }}
            isInvalid={state?.validation?.emailAddressIsInvalid}
            validationMessage={state?.validation?.emailAddressValidationMessage}
            onBlur={() => {
              validateFields("emailAddress", state?.data?.contact?.email);
            }}
            maxLength={64}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <PPMSPhoneNumber
          phone={state?.data?.contact?.phone}
          extension={state?.data?.contact?.phoneExtension}
          showExtension={true}
          id={`custodian-phone`}
          maxLength={16}
          maxLengthExtension={8}
          required={true}
          disabled={state?.validation?.realitySpecialistOrSCOFieldsDisabled}
          disabledExtension={
            state?.validation?.realitySpecialistOrSCOFieldsDisabled
          }
          isInvalid={state?.validation?.phoneNumberIsInvalid}
          isExtensionInvalid={state?.validation?.extnIsInvalid}
          validationMessage={state?.validation?.phoneNumberValidationMessage}
          extensionValidationMessage={state?.validation?.extnValidationMessage}
          onChangePhoneNumber={(value) => {
            updateValueOfField("phoneNumber", value);
          }}
          updatePhoneNumber={(value) => {
            validateFields("phoneNumber", value);
          }}
          updatePhoneExtension={(value) => {
            validateFields("extn", value);
          }}
          onChangePhoneExt={(value) => {
            updateValueOfField("extn", value);
          }}
        />
        <PPMSFormattedPhoneFax
          disabled={state?.validation?.realitySpecialistOrSCOFieldsDisabled}
          id={"poc-fax-number"}
          labelBold={false}
          maxLength={16}
          isInvalid={state?.validation?.faxNumberIsInvalid}
          validationMessage={state?.validation?.faxNumberValidationMessage}
          isValid={true}
          numberFormatType={"Fax"}
          phoneFax={state?.data?.contact?.fax}
          required={true}
          updatePhoneFax={(value) => {
            validateFields("faxNumber", value);
          }}
          onChangePhoneFax={(value) => updateValueOfField("faxNumber", value)}
        />
      </div>
    </>
  );
};

export default RealtySpecialistOrSCODetails;
