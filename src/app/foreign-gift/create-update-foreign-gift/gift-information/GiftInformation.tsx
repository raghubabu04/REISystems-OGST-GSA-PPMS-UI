import React, { Fragment, useContext, useEffect, useMemo } from "react";
import { PPMSUnitOfIssue } from "../../../../ui-kit/components/PPMS-unit-of-issue";
import { PropertyContext } from "../../../property/create-update-property/PropertyContext";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import {
  validateFairMarketValue,
  validateCommonItemName,
  validatePropertyDescription,
  validateFiscalYear,
  validateVaultShelfNumber,
  validateFGMReceivedDate,
  validateRestrictedItem,
  validateVaultLocation,
} from "../../../property/create-update-property/validations/propertyFieldValidations";
import { Administration } from "../../administration/Administration";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSTextEditor } from "../../../../ui-kit/components/common/PPMS-texteditor";
import PPMSMultiSelect from "../../../../ui-kit/components/PPMS-multi-select";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { appValidationDefaults } from "../appraisalInformation/AppraisalInformationState";
import { appAgencyInfoValidationDefaults } from "../appraisal-agency-information/AppraisalAgencyInformationState";
import { PPMSDatepicker } from "../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";
import { UserUtils } from "../../../../utils/UserUtils";
import {
  restrictedItemOptions,
  vaultLocationOptions,
} from "../constants/Constants";

export interface GiftInformationProps {
  workflow: string;
}
export function GiftInformation(props: GiftInformationProps) {
  const {
    giftInformationState,
    updateGiftInformationState,
    adminInfoState,
    fscState,
    updateFSCState,
    updateAppraisalAgencyInformationState,
    updateAppraisalInformationState,
  } = useContext(PropertyContext);

  useEffect(() => {
    let commonApiService = new CommonApiService();
    commonApiService
      .getForeignGiftFSCCodes()
      .then((response: any) => {
        updateFSCState({ fscOptions: response.data });
        showAdditonalFields();
        getCurrentFiscalyear();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
  }, [giftInformationState, fscState]);

  function handleUnitOfIssueChange(value) {
    updateGiftInformationState({
      unitOfIssue: value,
    });
  }

  function handleOnChangeItemName(value: any) {
    updateGiftInformationState({
      itemName: value,
      itemNameMsg: "",
      itemNameInvalid: false,
    });
  }

  function handleItemName(value: any) {
    let validations = validateCommonItemName(value);
    updateGiftInformationState({
      itemName: value,
      itemNameInvalid: validations.isInvalid,
      itemNameMsg: validations.validationError,
    });
  }

  function handleVaultShelfNumber(value: any) {
    let validations = validateVaultShelfNumber(
      value,
      updateGiftInformationState
    );
    updateGiftInformationState({
      vaultShelfNumber: value,
      vaultShelfNumberInvalid: validations.isInvalid,
      vaultShelfNumberErrorMessage: validations.validationError,
    });
  }

  function handleYearOnChange(value: any) {
    updateGiftInformationState({
      fiscalYear: value,
      fiscalYearMsg: "",
      fiscalYearInvalid: false,
    });
  }

  function handleYearOnBlur(value: any) {
    let validations = validateFiscalYear(value, getCurrentFiscalyear());
    updateGiftInformationState({
      fiscalYear: value,
      fiscalYearInvalid: validations.isInvalid,
      fiscalYearMsg: validations.validationError,
    });
  }

  function handlebuyOption(items) {
    let value = "";

    const selectedItem = items.filter((item) => item.isSelected === true);
    if (selectedItem.length > 0) {
      value = selectedItem[0].id;
    }
    updateGiftInformationState({
      wantToBuy: value !== "N",
    });
    if (value == "N") {
      updateAppraisalInformationState(appValidationDefaults);
      updateAppraisalAgencyInformationState(appAgencyInfoValidationDefaults);
      updateAppraisalInformationState({
        wantToBuyGift: value !== "N",
      });
      updateGiftInformationState({
        wantToBuyGift: value !== "N",
      });
    }
  }

  function handlePropertyDescriptionChange() {
    let validation = validatePropertyDescription(
      giftInformationState.propertyDescription
    );

    updateGiftInformationState({
      propertyDescriptionIsInvalid: validation.isInvalid,
      propertyDescriptionErrorMsg: validation.validationError,
    });
  }

  function handleChange(value: any) {
    let validation = validateFSC(value);
    let code: string = "";
    if (value.length > 0) {
      code = value[0]?.code;
    }
    updateGiftInformationState({
      fscCode: code,
      fscInvalid: validation.isFscInvalid,
    });

    updateFSCState({
      fscCode: code,
      isValid: !validation.isFscInvalid,
      isInvalid: validation.isFscInvalid,
      validationMessage: validation.fscValidationError,
      triggerValidation: validation.isFscInvalid,
    });
  }

  function validateFSC(fscCode: any) {
    let validation = {
      isFscInvalid: false,
      fscValidationError: "",
    };

    if (isEmptyCheck(fscCode)) {
      validation.isFscInvalid = true;
      validation.fscValidationError =
        "Federal Supply Class / National Stock Number is required";
    }

    return validation;
  }
  function handleOnchangeFairMarketValue(value) {
    let fairMarketValue = value
      .replace(/([^.]*\.[^.]*)\./g, "$1")
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    fairMarketValue = fairMarketValue.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(fairMarketValue)) {
      fairMarketValue = Number(fairMarketValue).toFixed(2);
    }

    fairMarketValue =
      "$" +
      fairMarketValue
        .toString()
        // .replace(/([^.]*\.[^.]*)\./g, '$1')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");

    updateGiftInformationState({ fairMarketValue });
  }
  function handleFairMarketValue({ value, id, name }) {
    let valueToBeChecked = value
      .replace(/([^.]*\.[^.]*)\./g, "$1")
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    valueToBeChecked = valueToBeChecked.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(valueToBeChecked)) {
      valueToBeChecked = Number(valueToBeChecked).toFixed(2);
    }

    let validation = validateFairMarketValue(id, name, valueToBeChecked, true);
    valueToBeChecked =
      "$" +
      valueToBeChecked
        .toString()
        // .replace(/([^.]*\.[^.]*)\./g, '$1')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");
    switch (id) {
      case "fairMarketValue":
        updateGiftInformationState({
          fairMarketValueSave: !validation.isInvalid
            ? valueToBeChecked.toString().replace(/,/gi, "").replace("$", "")
            : null,
          fairMarketValueIsInValid: validation.isInvalid,
          fairMarketValueIsValid: !validation.isInvalid,
          fairMarketValueMsg: validation.validationError,
        });

        break;
      case "upsetPrice":
        if (UserUtils.isUserFg() || UserUtils.isSystemAdminUser()) {
          updateGiftInformationState({
            upsetPriceSave: !validation.isInvalid
              ? valueToBeChecked.toString().replace(/,/gi, "").replace("$", "")
              : null,
            upsetPriceInvalid: validation.isInvalid,
            upsetPriceErrorMessage: validation.validationError,
          });
        }

        break;
      default:
        break;
    }
  }
  function handleUpsetPriceValue(value) {
    let upsetPrice = value
      .replace(/([^.]*\.[^.]*)\./g, "$1")
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    upsetPrice = upsetPrice.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(upsetPrice)) {
      upsetPrice = Number(upsetPrice).toFixed(2);
    }
    upsetPrice =
      "$" +
      upsetPrice
        .toString()
        // .replace(/([^.]*\.[^.]*)\./g, '$1')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");

    updateGiftInformationState({ upsetPrice });
  }

  function validateForm() {
    handleItemName(giftInformationState.itemName);
    handleFairMarketValue({
      id: "fairMarketValue",
      value: giftInformationState.fairMarketValue,
      name: "Fair Market Value",
    });
    handleDateOnSubmit(giftInformationState.recipientReceivedDate);
    if (props.workflow == "APPROVE_FOREIGN_GIFT") {
      handleVaultShelfNumber(giftInformationState.vaultShelfNumber);
      validateRestrictedItem(
        giftInformationState.restrictedItemSelectedValue,
        updateGiftInformationState
      );
      handleDateReceivedByFGM(giftInformationState.dateReceivedByFGM);
      handleVaultShelfNumberBlur(giftInformationState.vaultShelfNumber);
      validateVaultLocation(
        giftInformationState.vaultLocationSelectedValue,
        updateGiftInformationState
      );
      handleFairMarketValue({
        id: "upsetPrice",
        value: giftInformationState.upsetPrice,
        name: "Upset Price",
      });
    }
  }

  function handleDate(value) {
    let validation = validateReceivedDate(
      value,
      "Date Received by Recipient",
      true
    );
    updateGiftInformationState({
      recipientReceivedDate: value,
      isRecipientReceivedDateInvalid: validation.isInvalid,
      recipientReceiveDateErrorMessage: validation.validationError,
    });
  }
  function handleDateReceivedByFGM(value) {
    let validation = validateFGMReceivedDate(
      value,
      giftInformationState.recipientReceivedDate,
      "Date Received by FGM",
      true,
      updateGiftInformationState
    );
    updateGiftInformationState({
      dateReceivedByFGM: value,
      dateReceivedByFGMInvalid: validation.isInvalid,
      dateReceivedByFGMErrorMessage: validation.validationError,
    });
  }
  function validateReceivedDate(value, name, isRequired) {
    let today = new Date();
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isRequired && isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = name + " is required";
      return validation;
    } else if (moment(value).isAfter(today)) {
      validation.isInvalid = true;
      validation.validationError = name + " should not be future date";
    }
    return validation;
  }
  function handleDateOnSubmit(value: Date) {
    let validation = validateReceivedDateOnSubmit(
      value,
      "Date Received by Recipient",
      true
    );
    updateGiftInformationState({
      recipientReceivedDate: value,
      isRecipientReceivedDateInvalid: validation.isInvalid,
      recipientReceiveDateErrorMessage: validation.validationError,
    });
  }
  function validateReceivedDateOnSubmit(
    value: Date,
    name: string,
    isRequired: boolean
  ) {
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isRequired && isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = name + " is required.";
      return validation;
    }
    return validation;
  }
  function showAdditonalFields() {
    let show = false;
    if (UserUtils.isUserFg() || UserUtils.isSystemAdminUser()) {
      show = true;
    }
    updateGiftInformationState({
      showAdditionalFields: show,
    });
  }
  function handleRestrictedItemChange(event: any) {
    console.log("Events of Restricted ", event);
    event.forEach((e) => {
      if (e.isSelected) {
        validateRestrictedItem(e.value, updateGiftInformationState);
        updateGiftInformationState({
          restrictedItemSelectedValue: e.value,
        });
      }
    });
  }

  function handleVaultLocationChange(event: any) {
    event.forEach((e) => {
      if (e.isSelected) {
        validateVaultLocation(e.value, updateGiftInformationState);
      }
    });
  }

  function handleVaultShelfNumberChange(value: any) {
    updateGiftInformationState({
      vaultShelfNumber: value,
      vaultShelfNumberErrorMessage: "",
      vaultShelfNumberInvalid: false,
    });
  }

  function handleVaultShelfNumberBlur(value: any) {
    let validation = validateVaultShelfNumber(
      value,
      updateGiftInformationState
    );
    updateGiftInformationState({
      vaultShelfNumber: value,
      vaultShelfNumberInvalid: validation.isInvalid,
      vaultShelfNumberErrorMessage: validation.validationError,
    });
  }

  function getCurrentFiscalyear() {
    let fiscalYear;
    let today = new Date();
    if (today.getMonth() + 1 <= 10) {
      fiscalYear = today.getFullYear();
    } else {
      fiscalYear = today.getFullYear() + 1;
    }
    updateGiftInformationState({
      fiscalYear: fiscalYear,
    });
    return fiscalYear;
  }
  return useMemo(() => {
    // console.log("Props Workflow " + props.workflow);
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-8"}>
            <PPMSInput
              id={"itemName"}
              name={"itemName"}
              label={"Item Name"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={giftInformationState.itemName}
              onChange={(event) => handleOnChangeItemName(event.target.value)}
              onBlur={(event) => handleItemName(event.target.value)}
              validationMessage={giftInformationState.itemNameMsg}
              maxLength={64}
              minLength={4}
              isInvalid={giftInformationState.itemNameInvalid}
              isValid={!giftInformationState.itemNameInvalid}
            />
          </div>
        </div>
        <div className={"grid-col-6"}>
          <PPMSToggleRadio
            id={"buyOption"}
            options={giftInformationState.interestedOptions}
            isInline={false}
            isDisabled={false}
            name={"buyOption"}
            className={"buyOption"}
            label={"Does the recipient want to buy?"}
            validationMessage={giftInformationState.buyErrorMessage}
            onChange={handlebuyOption}
            isRequired={true}
          />
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4 grid-col-6"}>
            <PPMSInput
              id={"fiscalYear"}
              name={"fiscalYear"}
              label={"Fiscal Year"}
              minLength={1}
              maxLength={4}
              onChange={(event) => handleYearOnChange(event.target.value)}
              onBlur={(event) => handleYearOnBlur(event.target.value)}
              isRequired={true}
              validationMessage={giftInformationState.fiscalYearMsg}
              isInvalid={giftInformationState.fiscalYearInvalid}
              isValid={!giftInformationState.fiscalYearInvalid}
              isDisabled={false}
              inputType={"text"}
              value={giftInformationState.fiscalYear}
            />
          </div>
          <div className={"tablet:grid-col-5"}>
            <Administration
              id={"administration"}
              label={"Administration"}
              required={adminInfoState.isRequired}
              isInvalid={adminInfoState.isInvalid}
              isValid={adminInfoState.isValid}
              disabled={false}
              selectedAdminstration={adminInfoState.presidentName}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4 grid-col-6"}>
            <PPMSUnitOfIssue
              label={"Unit of Issue"}
              required={true}
              unitOfIssue={giftInformationState.unitOfIssue}
              unitOfIssueDefault={giftInformationState.unitOfIssueDefault}
              updateUnitOfIssues={handleUnitOfIssueChange}
            />
          </div>

          <div className={"tablet:grid-col-6"}>
            <PPMSInput
              id={"fairMarketValue"}
              name={"Fair Market Value"}
              label={"Fair Market Value"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={giftInformationState.fairMarketValue}
              onChange={(event) => {
                handleOnchangeFairMarketValue(event.target.value);
              }}
              onBlur={(event) => handleFairMarketValue(event.target)}
              validationMessage={giftInformationState.fairMarketValueMsg}
              maxLength={18}
              minLength={1}
              isInvalid={giftInformationState.fairMarketValueIsInValid}
              isValid={giftInformationState.fairMarketValueIsInValid}
              placeHolder={"$0.00"}
              className="big-label"
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSMultiSelect
              avoidHighlightFirstOption={true}
              caseSensitiveSearch={false}
              emptyRecordMsg={"---- No FSC Code Found ----"}
              chipVariant={"primary"}
              label={"Federal Supply Class / National Stock Number"}
              id={"fscCode"}
              options={fscState.fscOptions}
              isRequired={true}
              placeholder={"Enter FSC Code"}
              displayValue={"longName"}
              selectedValues={fscState.fcsSelectedValues}
              showCheckbox={false}
              isObject={true}
              onSelect={handleChange}
              onRemove={handleChange}
              selectionLimit={1}
              singleSelect={false}
              closeOnSelect={true}
              isInvalid={fscState.isInvalid}
              isValid={fscState.isValid}
              validationMessage={fscState.validationMessage}
              validate={() => {
                updateFSCState({
                  validationMessage:
                    "Federal Supply Class / National Stock Number is required",
                  isInvalid: true,
                });
              }}
              triggerValidation={fscState.triggerValidation}
            />
          </div>
        </div>
        {giftInformationState.showAdditionalFields &&
        props.workflow == "APPROVE_FOREIGN_GIFT" ? (
          <div>
            <div className="grid-row grid-gap-4">
              <div className={"grid-col-4"}>
                <PPMSToggleRadio
                  id={"restrictedItem"}
                  options={restrictedItemOptions}
                  isInline={false}
                  isDisabled={false}
                  name={"restrictedItem"}
                  className={"restrictedItem"}
                  label={"Restricted Item:"}
                  validationMessage={
                    giftInformationState.restrictedItemErrorMessage
                  }
                  isSingleSelect={true}
                  isInvalid={giftInformationState.restrictedItemInvalid}
                  onChange={(event) => handleRestrictedItemChange(event)}
                  isRequired={true}
                />
              </div>
              <div className={"grid-col-6"}>
                <PPMSInput
                  id={"upsetPrice"}
                  name={"Upset Price"}
                  label={"Upset Price"}
                  maxLength={18}
                  minLength={1}
                  onChange={(event) =>
                    handleUpsetPriceValue(event.target.value)
                  }
                  onBlur={(event) => handleFairMarketValue(event.target)}
                  isRequired={true}
                  validationMessage={
                    giftInformationState.upsetPriceErrorMessage
                  }
                  isInvalid={giftInformationState.upsetPriceInvalid}
                  isValid={!giftInformationState.upsetPriceInvalid}
                  isDisabled={false}
                  inputType={"text"}
                  value={giftInformationState.upsetPrice}
                />
              </div>
            </div>
            <div className="grid-row grid-gap-4">
              <div className={"grid-col-4"}>
                <PPMSToggleRadio
                  id={"vaultLocation"}
                  options={vaultLocationOptions}
                  isInline={false}
                  isDisabled={false}
                  name={"vaultLocation"}
                  className={"vaultLocation"}
                  label={"Vault Location:"}
                  validationMessage={
                    giftInformationState.vaultLocationErrorMessage
                  }
                  isSingleSelect={true}
                  isInvalid={giftInformationState.vaultLocationInvalid}
                  onChange={handleVaultLocationChange}
                  isRequired={true}
                />
              </div>

              <div className={"grid-col-6"}>
                <PPMSInput
                  id={"vaultShelfNumber"}
                  name={"vaultShelfNumber"}
                  label={"Vault Shelf Number"}
                  minLength={1}
                  maxLength={12}
                  onChange={(event) =>
                    handleVaultShelfNumberChange(event.target.value)
                  }
                  onBlur={(event) =>
                    handleVaultShelfNumberBlur(event.target.value)
                  }
                  isRequired={true}
                  validationMessage={
                    giftInformationState.vaultShelfNumberErrorMessage
                  }
                  isInvalid={giftInformationState.vaultShelfNumberInvalid}
                  isValid={!giftInformationState.vaultShelfNumberInvalid}
                  isDisabled={false}
                  inputType={"text"}
                  value={giftInformationState.vaultShelfNumber}
                />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className={"grid-row grid-gap-4"}>
          <PPMSDatepicker
            id={"dateReceivedByRecipient"}
            startDate={
              giftInformationState.recipientReceivedDate
                ? giftInformationState.recipientReceivedDate
                : null
            }
            name={"Date Received by Recipient"}
            updateDate={(date) => handleDate(date)}
            display={"bottom-end"}
            label={"Date Received by Recipient"}
            isRequired={true}
            placeholder={"Date Received by Recipient"}
            validationMessage={
              giftInformationState.recipientReceiveDateErrorMessage
            }
            maxDate={new Date(Date.now())}
            isInvalid={giftInformationState.isRecipientReceivedDateInvalid}
            useDefaultValidation={false}
            format={"MM/DD/YYYY"}
          />
          {giftInformationState.showAdditionalFields &&
          props.workflow == "APPROVE_FOREIGN_GIFT" ? (
            <PPMSDatepicker
              id={"dateReceivedByFGM"}
              startDate={
                giftInformationState.dateReceivedByFGM
                  ? giftInformationState.dateReceivedByFGM
                  : null
              }
              name={"Date Received by FGM"}
              updateDate={(date) => handleDateReceivedByFGM(date)}
              display={"bottom-end"}
              label={"Date Received by FGM"}
              isRequired={true}
              placeholder={"Date Received by FGM"}
              validationMessage={
                giftInformationState.dateReceivedByFGMErrorMessage
              }
              maxDate={moment(new Date(Date.now())).toDate()}
              isInvalid={giftInformationState.dateReceivedByFGMInvalid}
              useDefaultValidation={false}
              format={"MM/DD/YYYY"}
            />
          ) : (
            <></>
          )}
        </div>
        {giftInformationState.dosApprovalDate != null && (
          <div className={"grid-row grid-gap-4"}>
            <PPMSDatepicker
              id={"dosApprovalDate"}
              startDate={
                giftInformationState.dosApprovalDate
                  ? giftInformationState.dosApprovalDate
                  : null
              }
              name={"DOS Approval Date"}
              updateDate={""}
              display={"bottom-end"}
              label={"DOS Approval Date"}
              isRequired={true}
              isDisabled={true}
              placeholder={"DOS Approval Date"}
              useDefaultValidation={false}
              format={"MM/DD/YYYY"}
            />
          </div>
        )}
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSTextEditor
              id={"propertyDescription"}
              value={giftInformationState.propertyDescription}
              onChange={(descData: any) => {
                updateGiftInformationState({ propertyDescription: descData });
              }}
              onBlur={handlePropertyDescriptionChange}
              label={"Property Description"}
              isInvalid={giftInformationState.propertyDescriptionIsInvalid}
              isValid={false}
              isRequired={true}
              validationMessage={
                giftInformationState.propertyDescriptionErrorMsg
              }
              onBlurCheck={true}
            />
          </div>
        </div>
      </>
    );
  }, [giftInformationState, adminInfoState, fscState]);
}
