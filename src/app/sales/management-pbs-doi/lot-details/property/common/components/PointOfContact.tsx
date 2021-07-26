import React from "react";
import { PPMSFirstNameLastName } from "../../../../../../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSPhoneNumber } from "../../../../../../../ui-kit/components/PPMS-phone-number";
import { PPMSFormattedPhoneFax } from "../../../../../../../ui-kit/components/PPMS-formatted-phone-fax";
import { PPMSEmail } from "../../../../../../../ui-kit/components/PPMS-email";
interface PointOfContactProps {
  poc?: any;
  updatePoc?: (type: string, value: string | {}) => any;
  validatePoc?: (type: string, value: string | {}) => any;
  fieldDisabled?: boolean;
}
function PointOfContact(props: PointOfContactProps) {
  const { poc, updatePoc, validatePoc, fieldDisabled } = props;
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <PPMSFirstNameLastName
          id={"sales-user-information-firstname-lastname"}
          required={true}
          maxLength={30}
          labelBold={true}
          showMiddleName={true}
          disabled={fieldDisabled}
          firstName={poc?.data.firstName}
          isFirstNameInvalid={poc?.validation?.firstName?.isInvalid}
          validationFirstMessage={poc?.validation?.firstName?.validationError}
          middleName={poc?.data?.middleName}
          lastName={poc?.data?.lastName}
          maxMiddleLength={1}
          isLastNameInvalid={poc?.validation?.lastName?.isInvalid}
          validationLastMessage={poc?.validation?.lastName?.validationError}
          updateFirstName={(value) => validatePoc("firstName", value)}
          updateLastName={(value) => validatePoc("lastName", value)}
          updateMiddleName={(value) => validatePoc("middleName", value)}
          onChangeFirstName={(value) => updatePoc("firstName", value)}
          onChangeLastName={(value) => updatePoc("lastName", value)}
          onChangeMiddleName={(value) => updatePoc("middleName", value)}
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <PPMSPhoneNumber
          id={"sales-user-information-phonenumber"}
          showExtension={true}
          disabled={fieldDisabled}
          disabledExtension={fieldDisabled}
          phone={poc?.data?.phone}
          maxLength={10}
          labelBold={true}
          isInvalid={poc?.validation?.phone?.isInvalid}
          validationMessage={poc?.validation?.phone?.validationError}
          extension={poc?.data?.phoneExtension}
          maxLengthExtension={8}
          isExtensionInvalid={poc?.validation?.phoneExtension?.isInvalid}
          extensionValidationMessage={
            poc?.validation?.phoneExtension?.validationError
          }
          required={true}
          updatePhoneNumber={(value) => validatePoc("phoneNumber", value)}
          updatePhoneExtension={(value) => validatePoc("phoneExtension", value)}
          onChangePhoneNumber={(value) => updatePoc("phoneNumber", value)}
          onChangePhoneExt={(value) => updatePoc("phoneExtension", value)}
        />
        <PPMSFormattedPhoneFax
          disabled={fieldDisabled}
          id={"poc-fax-number"}
          labelBold={true}
          maxLength={16}
          isInvalid={poc?.validation?.fax?.isInvalid}
          validationMessage={poc?.validation?.fax?.validationError}
          isValid={true}
          numberFormatType={"Fax"}
          phoneFax={poc?.data?.fax}
          required={false}
          updatePhoneFax={(value) => validatePoc("fax", value)}
          onChangePhoneFax={(value) => updatePoc("fax", value)}
        />
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-6"}>
          <PPMSEmail
            email={poc?.data?.email}
            emailLabel={"Email Address"}
            disabled={fieldDisabled}
            labelBold={true}
            id={"sales-user-email"}
            placeHolder={"email@domain.gov"}
            isInvalid={poc?.validation?.email?.isInvalid}
            validationMessage={poc?.validation?.email?.validationError}
            required={true}
            onChangeEmail={(value) => updatePoc("emailAddress", value)}
            updateEmail={(value) => validatePoc("emailAddress", value)}
            maxLength={64}
          />
        </div>
      </div>
    </>
  );
}

export default PointOfContact;
