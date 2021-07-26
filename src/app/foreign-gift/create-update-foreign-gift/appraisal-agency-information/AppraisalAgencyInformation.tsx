import React, { useContext, useEffect } from "react";
import { PropertyContext } from "../../../property/create-update-property/PropertyContext";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { validateCompanyName } from "../../../property/create-update-property/validations/propertyFieldValidations";

import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSAddress } from "../../../../ui-kit/components/PPMS-address";
import { isFormSubmitted } from "../../../../service/validation.service";
import { zipValidation } from "../../../../ui-kit/components/validations/FieldValidations";
import { PageUtils } from "../../../../../src/utils/PageUtils";

export interface AppraisalAgencyInformationProps {}
export function AppraisalAgencyInformation(
  props: AppraisalAgencyInformationProps
) {
  const {
    appraisalAgencyInformationState,
    updateAppraisalAgencyInformationState,
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
  }, [appraisalAgencyInformationState, giftInformationState]);

  function validateForm() {
    handleCompanyName(appraisalAgencyInformationState.companyName);
    handleAppraisalCompanyUrl(appraisalAgencyInformationState.companyUrl);
    handleCompanyAddress();
    handleAppraisalToUploadOption(
      appraisalAgencyInformationState.appraisalToUploadOptions
    );
  }

  function handleOnChangeCompanyName(value: any) {
    updateAppraisalAgencyInformationState({
      companyName: value,
      companyNameMsg: "",
      companyNameInvalid: false,
    });
  }
  function handleCompanyName(value: any) {
    let validations = validateCompanyName(
      value,
      giftInformationState.wantToBuy
    );
    updateAppraisalAgencyInformationState({
      companyName: value,
      companyNameInvalid: validations.isInvalid,
      companyNameMsg: validations.validationError,
    });
  }

  function handleOnChangeAppraisalCompanyUrl(url: string) {
    updateAppraisalAgencyInformationState({
      companyUrl: url,
      companyUrlMsg: "",
      companyUrlIsInvalid: false,
      companyUrlIsValid: true,
    });
  }

  function handleAppraisalCompanyUrl(url: string) {
    let validations = validateCompanyUrl(
      appraisalAgencyInformationState.companyUrl
    );
    updateAppraisalAgencyInformationState({
      companyUrl: url,
      companyUrlIsInvalid: validations.isInvalid,
      companyUrlIsValid: !validations.isInvalid,
      companyUrlMsg: validations.validationError,
    });
  }

  const validateCompanyUrl = (url: string) => {
    let companyUrl = url;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (giftInformationState.wantToBuy && companyUrl === "") {
      validation.isInvalid = true;
      validation.validationError = " Company URL is required";
    } else if (null != companyUrl && companyUrl.length > 0) {
      if (!PageUtils.isUrlValid(companyUrl)) {
        validation.isInvalid = true;
        validation.validationError = "Invalid company URL entered.";
      }
    }
    return validation;
  };

  function handleAppraisalToUploadOption(items) {
    let value = "";
    const selectedItem = items.filter((item) => item.isSelected === true);
    if (null != selectedItem && selectedItem.length > 0) {
      value = selectedItem[0].id;
    }
    updateAppraisalAgencyInformationState({
      appraisalToUpload: value !== "N",
    });
  }

  function handleCompanyAddress() {
    if (giftInformationState.wantToBuy) {
      let validateAddressLine1 =
        appraisalAgencyInformationState.companyAddress1?.length > 0;
      let validateCity =
        appraisalAgencyInformationState.companyCity?.length > 0;
      let validateState =
        appraisalAgencyInformationState.companyStateCode?.length > 0;
      let validateZip = zipValidation(
        appraisalAgencyInformationState.companyZipCode,
        true
      );
      updateAppraisalAgencyInformationState({
        companyAddress1IsInvalid: !validateAddressLine1,
        companyAddress1IsValid: validateAddressLine1,
      });
      updateAppraisalAgencyInformationState({
        companyCityIsInvalid: !validateCity,
        companyCityIsValid: validateCity,
      });
      updateAppraisalAgencyInformationState({
        companyStateIsInvalid: !validateState,
        companyStateIsValid: validateState,
      });
      updateAppraisalAgencyInformationState({
        companyZipIsInvalid: validateZip.isInvalid,
        companyZipIsValid: !validateZip.isInvalid,
        companyZipValidationMessage: validateZip.validationError,
      });

      if (
        validateAddressLine1 &&
        validateCity &&
        validateState &&
        !validateZip.isInvalid &&
        !appraisalAgencyInformationState.companyZip2IsInvalid
      )
        return true;
      else return false;
    }
  }

  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"tablet:grid-col-8"}>
          <PPMSInput
            id={"companyName"}
            name={"companyName"}
            label={"Company Name"}
            isRequired={giftInformationState.wantToBuy}
            isDisabled={false}
            inputType={"text"}
            value={appraisalAgencyInformationState.companyName}
            onChange={(event) => handleOnChangeCompanyName(event.target.value)}
            onBlur={(event) => handleCompanyName(event.target.value)}
            validationMessage={appraisalAgencyInformationState.companyNameMsg}
            maxLength={64}
            minLength={4}
            isInvalid={appraisalAgencyInformationState.companyNameInvalid}
            isValid={!appraisalAgencyInformationState.companyNameInvalid}
          />
        </div>
      </div>
      <PPMSAddress
        id={"appraisal-agency-address"}
        title={"Appraisal Agency"}
        address1={appraisalAgencyInformationState.companyAddress1}
        showAddressLine3={true}
        address1Required={giftInformationState.wantToBuy}
        address1IsInvalid={
          appraisalAgencyInformationState.companyAddress1IsInvalid
        }
        address1IsValid={appraisalAgencyInformationState.companyAddress1IsValid}
        address1ValidationMessage={
          appraisalAgencyInformationState.companyAddress1ValidationMessage
        }
        onChangeAddress1={(value) => {
          updateAppraisalAgencyInformationState({
            companyAddress1: value,
          });
        }}
        updateAddress1={(value: any, validation: any) => {
          if (giftInformationState.wantToBuy) {
            let valid = value.length > 0;
            updateAppraisalAgencyInformationState({
              companyAddress1: value,
              companyAddress1IsInvalid: !valid,
              companyAddress1IsValid: valid,
              companyAddress1ValidationMessage: validation.validationError,
              companyAddress2IsInvalid: false,
              companyAddress2IsValid: false,
              companyAddress2ValidationMessage: "",
              companyCityIsInvalid: false,
              companyCityIsValid: false,
              companyCityValidationMessage: "",
              companyZipIsInvalid: false,
              companyZipIsValid: false,
              companyZipValidationMessage: "",
            });
          }
        }}
        address2={appraisalAgencyInformationState.companyAddress2}
        address2Required={false}
        address2IsInvalid={
          appraisalAgencyInformationState.companyAddress2IsInvalid
        }
        address2IsValid={appraisalAgencyInformationState.companyAddress2IsValid}
        address2ValidationMessage={
          appraisalAgencyInformationState.companyAddress2ValidationMessage
        }
        updateAddress2={(value: any) => {
          updateAppraisalAgencyInformationState({
            companyAddress2: value,
          });
        }}
        address3={appraisalAgencyInformationState.companyAddress3}
        address3Required={false}
        address3IsInvalid={
          appraisalAgencyInformationState.companyAddress3IsInvalid
        }
        address3IsValid={appraisalAgencyInformationState.companyAddress3IsValid}
        address3ValidationMessage={
          appraisalAgencyInformationState.companyAddress3ValidationMessage
        }
        updateAddress3={(value: any) => {
          updateAppraisalAgencyInformationState({
            companyAddress3: value,
          });
        }}
        showZipExtension={true}
        city={appraisalAgencyInformationState.companyCity}
        cityRequired={giftInformationState.wantToBuy}
        cityIsInvalid={appraisalAgencyInformationState.companyCityIsInvalid}
        cityIsValid={appraisalAgencyInformationState.companyCityIsValid}
        cityValidationMessage={
          appraisalAgencyInformationState.companyCityValidationMessage
        }
        onChangeCity={(value) => {
          updateAppraisalAgencyInformationState({
            companyCity: value,
          });
        }}
        updateCity={(value: any, validation: any) => {
          updateAppraisalAgencyInformationState({
            companyCity: value,
          });
          if (giftInformationState.wantToBuy) {
            let valid = value.length > 0;
            updateAppraisalAgencyInformationState({
              companyCityIsInvalid: !valid,
              companyCityIsValid: valid,
              companyCityValidationMessage: validation.validationError,
              companyAddress2IsInvalid: false,
              companyAddress2IsValid: false,
              companyAddress2ValidationMessage: "",
              companyAddress1IsInvalid: false,
              companyAddress1IsValid: false,
              companyAddress1ValidationMessage: "",
              companyZipIsInvalid: false,
              companyZipIsValid: false,
              companyZipValidationMessage: "",
            });
          }
        }}
        state={appraisalAgencyInformationState.companyStateCode}
        stateRequired={giftInformationState.wantToBuy}
        stateIsInvalid={appraisalAgencyInformationState.companyStateIsInvalid}
        stateIsValid={appraisalAgencyInformationState.companyStateIsValid}
        updateState={(value: any, validation: any) => {
          updateAppraisalAgencyInformationState({
            companyStateCode: value,
            companyState: value,
          });
          if (giftInformationState.wantToBuy) {
            updateAppraisalAgencyInformationState({
              companyStateIsInvalid: validation.isInvalid,
              companyStateIsValid: !validation.isInvalid,
              companyStateValidationMessage: validation.validationError,
            });
          }
        }}
        zip={appraisalAgencyInformationState.companyZipCode}
        zipRequired={giftInformationState.wantToBuy}
        zipIsInvalid={appraisalAgencyInformationState.companyZipIsInvalid}
        zipIsValid={appraisalAgencyInformationState.companyZipIsValid}
        zipValidationMessage={
          appraisalAgencyInformationState.companyZipValidationMessage
        }
        onChangeZip={(value) => {
          updateAppraisalAgencyInformationState({
            companyZipCode: value,
          });
        }}
        updateZip={(
          value: any,
          inValid: boolean,
          valid: boolean,
          validationError: string,
          disabledZipExtension: boolean
        ) => {
          updateAppraisalAgencyInformationState({
            companyZipCode: value,
            companyZipIsInvalid: inValid,
            companyZipIsValid: valid,
            companyZipValidationMessage: validationError,
            disabledZipExtension: disabledZipExtension,
            companyAddress1IsInvalid: false,
            companyAddress1IsValid: false,
            companyAddress1ValidationMessage: "",
            companyCityIsInvalid: false,
            companyCityIsValid: false,
            companyCityValidationMessage: "",
          });
        }}
        validationExtensionMessage={
          appraisalAgencyInformationState.companyZip2ValidationMessage
        }
        zip2={appraisalAgencyInformationState.companyZip2Code}
        zip2IsInvalid={appraisalAgencyInformationState.companyZip2IsInvalid}
        zip2IsValid={appraisalAgencyInformationState.companyZip2IsValid}
        disabledZipExtension={
          appraisalAgencyInformationState.disabledZipExtension
        }
        onChangeZipExtension={(value) => {
          updateAppraisalAgencyInformationState({
            companyZip2Code: value,
          });
        }}
        updateZipExtension={(
          value: any,
          inValid: boolean,
          valid: boolean,
          validationError: string
        ) => {
          updateAppraisalAgencyInformationState({
            companyZip2Code: value,
            companyZip2IsInvalid: inValid,
            companyZip2IsValid: valid,
            companyZip2ValidationMessage: validationError,
          });
        }}
      />
      <div className={"grid-col-8"}>
        <PPMSInput
          id={"appraisalCompanyURL"}
          name={"appraisalCompanyURL"}
          label={"Appraisal Company URL"}
          isRequired={giftInformationState.wantToBuy}
          isDisabled={false}
          inputType={"text"}
          value={appraisalAgencyInformationState.companyUrl}
          onChange={(event) =>
            handleOnChangeAppraisalCompanyUrl(event.target.value)
          }
          onBlur={(event) => handleAppraisalCompanyUrl(event.target.value)}
          validationMessage={appraisalAgencyInformationState.companyUrlMsg}
          maxLength={64}
          minLength={4}
          isInvalid={appraisalAgencyInformationState.companyUrlIsInvalid}
          isValid={appraisalAgencyInformationState.companyUrlIsValid}
        />
      </div>
      <div className={"grid-col-6"}>
        <PPMSToggleRadio
          id={"appraisalToUploadOption"}
          options={appraisalAgencyInformationState.appraisalToUploadOptions}
          isInline={false}
          isDisabled={false}
          name={"appraisalToUploadOption"}
          className={"appraisalToUploadOption"}
          label={"Do you have an appraisal document to upload?"}
          validationMessage={
            appraisalAgencyInformationState.appraisalToUploadErrorMessage
          }
          onChange={handleAppraisalToUploadOption}
          isRequired={true}
          // isInvalid={appraisalAgencyInformationState.appraisalToUploadInvalid}
        />
      </div>
    </>
  );
}
