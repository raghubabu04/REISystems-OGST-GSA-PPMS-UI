import React, { useContext, useEffect, useMemo } from "react";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSEmail } from "../../../../ui-kit/components/PPMS-email";
import { PPMSFirstNameLastName } from "../../../../ui-kit/components/PPMS-firstname-lastname";
import { PPMSPhoneNumber } from "../../../../ui-kit/components/PPMS-phone-number";
import { PropertyContext } from "../../../property/create-update-property/PropertyContext";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";

import {
  isEmptyCheck,
  validateAppraisalValue,
} from "../../../property/create-update-property/validations/propertyFieldValidations";
import { validateEmailAddress } from "../../../../ui-kit/components/validations/FieldValidations";
interface AppraisalInformationProps {}
export function AppraisalInformation(props: AppraisalInformationProps) {
  const {
    appraisalInformationState,
    updateAppraisalInformationState,
    giftInformationState,
  } = useContext(PropertyContext);

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
  }, [appraisalInformationState, giftInformationState]);

  function handleFirstNameChangeName(value: string) {
    if (value && value.length > 0) {
      updateAppraisalInformationState({
        firstName: value,
        isFirstNameInvalid: false,
        firstNameInvalidErrorMessage: "",
      });
    } else if (giftInformationState.wantToBuy === true) {
      updateAppraisalInformationState({
        firstName: value,
        isFirstNameInvalid: true,
        firstNameInvalidErrorMessage: "Appraiser First Name is Required",
      });
    }
  }
  function handleLastNameChangeName(value: string) {
    if (value && value.length > 0) {
      updateAppraisalInformationState({
        lastName: value,
        isLastNameInvalid: false,
        lastNameInvalidErrorMessage: "",
      });
    } else if (giftInformationState.wantToBuy === true) {
      updateAppraisalInformationState({
        lastName: value,
        isLastNameInvalid: true,
        lastNameInvalidErrorMessage: "Appraiser Last Name is Required",
      });
    }
  }
  function validateEmailAddres(email) {
    let validEmail = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(email) && giftInformationState.wantToBuy) {
      validEmail.isInvalid = true;
      validEmail.validationError = "Email Address is Required";
    } else if (!isEmptyCheck(email)) {
      validEmail = validateEmailAddress(email);
    }
    emailAddressUpdated(email, validEmail);
  }
  function emailAddressUpdated(value: string, validation: any) {
    updateAppraisalInformationState({
      emailAddress: value,
      isEmailAddressInvalid: validation.isInvalid,
      emailAddressInvalidErrorMessage: validation.validationError,
    });
  }

  function handleOnchangeAppraisalValue(value) {
    let appraisalValue = value
      .replace(/([^.]*\.[^.]*)\./g, "$1")
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    appraisalValue = appraisalValue.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(appraisalValue)) {
      appraisalValue = Number(appraisalValue).toFixed(2);
    }

    appraisalValue =
      "$" +
      appraisalValue
        .toString()
        // .replace(/([^.]*\.[^.]*)\./g, '$1')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");

    updateAppraisalInformationState({ appraisalValue });
  }
  function handleAppraisalValue({ value, id, name }) {
    let appraisalValue = value
      ? value
          .replace(/([^.]*\.[^.]*)\./g, "$1")
          .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
          .toString()
      : "";
    appraisalValue = appraisalValue.replace(/^[0]+$/, "");
    appraisalValue = appraisalValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .replace("$", "");

    let validation = validateAppraisalValue(
      name,
      appraisalValue,
      giftInformationState.wantToBuy
    );
    appraisalValue = "$" + appraisalValue;
    updateAppraisalInformationState({
      appraisalValue: !validation.isInvalid
        ? appraisalValue.toString().replace(/,/gi, "")
        : null,
      isAppraisalValueInvalid: validation.isInvalid,
      appraisalValueInvalidErrorMessage: validation.validationError,
    });
  }
  function handleDateOfApprovalChange(date: any) {
    let validation = valiDateDateOfApproval(
      date,
      giftInformationState.wantToBuy
    );
    updateAppraisalInformationState({
      dateOfApproval: date,
      isDateOfApprovalInvalid: validation.isInvalid,
      isDateOfApprovalValid: !validation.isInvalid,
      dateOfApprovalErrorMessage: validation.validationError,
    });
  }
  function valiDateDateOfApproval(value, isRequired) {
    let today = new Date();
    let validation = {
      isInvalid: false,
      validationError: "",
    };

    if (isRequired && isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Date of Approval is required";
      return validation;
    } else if (moment(value).isAfter(today)) {
      validation.isInvalid = true;
      validation.validationError = "Date of Approval should not be future date";
    }
    return validation;
  }
  function validateForm() {
    handleFirstNameChangeName(appraisalInformationState.firstName);
    handleLastNameChangeName(appraisalInformationState.lastName);
    handleAppraisalValue({
      value: appraisalInformationState.appraisalValue,
      id: "appraisalValue",
      name: "Appraisal Value",
    });
    handleDateOfApprovalChange(appraisalInformationState.dateOfApproval);
    const phone = appraisalInformationState.phoneNumber;
    let validationPhone = validatePhoneNumber(
      phone,
      giftInformationState.wantToBuy
    );
    phoneNumberUpdated(phone, validationPhone);

    const email = appraisalInformationState.emailAddress;
    validateEmailAddres(email);
  }
  function validatePhoneNumber(value, isRequired) {
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isRequired && isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Phone Number is Required.";
    }
    return validation;
  }
  function phoneNumberUpdated1(value: string) {
    let validationPhone = validatePhoneNumber(
      value,
      giftInformationState.wantToBuy
    );
    phoneNumberUpdated(value, validationPhone);
  }
  function phoneNumberUpdated(value: string, validation: any) {
    updateAppraisalInformationState({
      phoneNumber: value,
      isPhoneNumberInvalid: validation.isInvalid,
      phoneNumberInvalidErrorMessage: validation.validationError,
    });
  }
  function phoneExtensionUpdated(value: string) {
    updateAppraisalInformationState({
      phoneExtension: value,
    });
  }
  return useMemo(() => {
    return (
      <React.Fragment>
        <div className={"grid-row grid-gap-4"}>
          <PPMSFirstNameLastName
            id={"appraisal-firstname-lastname"}
            required={giftInformationState.wantToBuy}
            maxLength={30}
            showMiddleName={false}
            firstName={appraisalInformationState.firstName}
            isFirstNameInvalid={appraisalInformationState.isFirstNameInvalid}
            validationFirstMessage={
              appraisalInformationState.firstNameInvalidErrorMessage
            }
            middleName={""}
            lastName={appraisalInformationState.lastName}
            isLastNameInvalid={appraisalInformationState.isLastNameInvalid}
            validationLastMessage={
              appraisalInformationState.lastNameInvalidErrorMessage
            }
            maxMiddleLength={100}
            updateFirstName={handleFirstNameChangeName}
            updateLastName={handleLastNameChangeName}
            updateMiddleName={""}
            onChangeFirstName={(value) =>
              updateAppraisalInformationState({ firstName: value })
            }
            onChangeLastName={(value) =>
              updateAppraisalInformationState({ lastName: value })
            }
            onChangeMiddleName={""}
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <PPMSPhoneNumber
            id={"appraisal-information-phonenumber"}
            showExtension={true}
            disabled={false}
            phone={appraisalInformationState.phoneNumber}
            maxLength={10}
            required={giftInformationState.wantToBuy}
            updatePhoneNumber={phoneNumberUpdated1}
            updatePhoneExtension={phoneExtensionUpdated}
            isInvalid={appraisalInformationState.isPhoneNumberInvalid}
            validationMessage={
              appraisalInformationState.phoneNumberInvalidErrorMessage
            }
            extension={appraisalInformationState.phoneExtension}
            maxLengthExtension={8}
            isExtensionInvalid={
              appraisalInformationState.isPhoneExtensionInvalid
            }
            extensionValidationMessage={
              appraisalInformationState.phoneExtensionInvalidErrorMessage
            }
            onChangePhoneNumber={(value) =>
              updateAppraisalInformationState({ phoneNumber: value })
            }
            onChangePhoneExt={(value) =>
              updateAppraisalInformationState({ phoneExtension: value })
            }
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            <PPMSEmail
              id={"appraisal-email"}
              emailLabel={"Email Address"}
              email={appraisalInformationState.emailAddress}
              isInvalid={appraisalInformationState.isEmailAddressInvalid}
              validationMessage={
                appraisalInformationState.emailAddressInvalidErrorMessage
              }
              required={giftInformationState.wantToBuy}
              maxLength={64}
              updateEmail={validateEmailAddres}
              onChangeEmail={(value) =>
                updateAppraisalInformationState({ emailAddress: value })
              }
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <PPMSDatepicker
            id={"dateOfApproval"}
            startDate={appraisalInformationState.dateOfApproval}
            name={"dateOfApproval"}
            updateDate={(date) => handleDateOfApprovalChange(date)}
            display={"bottom-end"}
            label={"Date of Approval"}
            isRequired={giftInformationState.wantToBuy}
            placeholder={"Date of Approval"}
            validationMessage={
              appraisalInformationState.dateOfApprovalErrorMessage
            }
            maxDate={moment(new Date(Date.now())).toDate()}
            isInvalid={appraisalInformationState.isDateOfApprovalInvalid}
            useDefaultValidation={false}
            format={"MM/DD/YYYY"}
          />
        </div>
        <div className={"tablet:grid-col-6"}>
          <PPMSInput
            id={"appraisalValue"}
            name={"Appraisal Value"}
            label={"Appraisal Value"}
            isRequired={giftInformationState.wantToBuy}
            isDisabled={false}
            inputType={"text"}
            value={appraisalInformationState.appraisalValue}
            onChange={(event) => {
              handleOnchangeAppraisalValue(event.target.value);
            }}
            onBlur={(event) => handleAppraisalValue(event.target)}
            validationMessage={
              appraisalInformationState.appraisalValueInvalidErrorMessage
            }
            maxLength={18}
            minLength={1}
            isInvalid={appraisalInformationState.isAppraisalValueInvalid}
            isValid={!appraisalInformationState.isAppraisalValueInvalid}
            placeHolder={"$0.00"}
            className="big-label"
          />
        </div>
      </React.Fragment>
    );
  }, [giftInformationState, appraisalInformationState]);
}
