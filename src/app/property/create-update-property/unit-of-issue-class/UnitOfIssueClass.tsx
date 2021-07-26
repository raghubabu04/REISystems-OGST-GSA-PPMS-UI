import React, { useContext, useEffect } from "react";
import {
  validateQuantityField,
  validateOriginalAcqCostField,
} from "../validations/propertyFieldValidations";
import { PropertyContext } from "../PropertyContext";
import { PPMSUnitOfIssue } from "../../../../ui-kit/components/PPMS-unit-of-issue";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { isFormSubmitted } from "../../../../service/validation.service";

export interface UnitOfIssueProps {}

export function UnitOfIssueClass(props: UnitOfIssueProps) {
  const { unitOfIssueState, updateUnitOfIssueState,fscState } = useContext(
    PropertyContext
  );
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
  }, [unitOfIssueState]);
  function handleUnitOfIssueChange(value: any) {
    updateUnitOfIssueState({
      unitOfIssue: value,
    });
  }

  function handleQuantityChange({ value }) {
    let validation = {
      isInvalid: false,
      validationError: "",
    };

    let tempValidation = validateQuantityField(value,fscState?.data?.fscCode ? fscState?.data?.fscCode.toString(): "");
    if (tempValidation) {
      validation = tempValidation;
    }

    let multiplyBy = unitOfIssueState.originalAcqCost;
    if (unitOfIssueState.originalAcqCost === "") multiplyBy = "0";
    else {
      multiplyBy = multiplyBy.replace("$", "");
      multiplyBy = multiplyBy.replace(/,/g, "");
    }

    let quantity = value.toString()?.replace(/[^0-9]/g, "");
    quantity = quantity?.replace(/^[0]+$/, "");
    let totalAcqCost = (Number(quantity) * Number(multiplyBy)).toString();

    totalAcqCost = parseFloat(totalAcqCost.toString()).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (
      (quantity >= 10 && parseInt(multiplyBy) >= 100000) ||
      parseFloat(totalAcqCost.replace("$", "").replace(/,/g, "")) >= 1000000.0
    ) {
      updateUnitOfIssueState({
        verificationErrorMessage:
          "The Original Acquisition Cost (per Unit) and/or Total Acquisition Cost is equal to or over $1 Million. Please make sure that the Original Acquisition Cost (per Unit) and Total Acquisition Cost is correct.",
        showErrorAlert: true,
      });
    } else {
      updateUnitOfIssueState({
        showErrorAlert: false,
      });
    }

    updateUnitOfIssueState({
      totalAcqCost,
      quantity,
      quantityValidationMessage: validation.validationError,
      quantityIsInvalid: validation.isInvalid,
      quantityIsValid: !validation.isInvalid,
    });
  }

  function handleOriginalAcqCostChange({ value }) {
    let validation = {
      isInvalid: false,
      validationError: "",
    };

    let tempValidation = validateOriginalAcqCostField(value);
    if (tempValidation) {
      validation = tempValidation;
    }

    let multiplyBy = unitOfIssueState.quantity;
    if (unitOfIssueState.quantity === "") multiplyBy = "0";

    let originalAcqCost = value
      .replace(/([^.]*\.[^.]*)\./g, "$1")
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    originalAcqCost = originalAcqCost.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(originalAcqCost)) {
      originalAcqCost = Number(originalAcqCost).toFixed(2);
    }  else if(originalAcqCost.includes(".")){
      originalAcqCost= originalAcqCost;
    }   else{
      originalAcqCost=originalAcqCost.substring(0,11);
    }  

    let totalAcqCost = (
      Number(originalAcqCost) * Number(multiplyBy)
    ).toString();

    totalAcqCost = parseFloat(totalAcqCost.toString()).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (
      originalAcqCost >= 1000000 ||
      parseFloat(totalAcqCost.replace("$", "").replace(/,/g, "")) >= 1000000.0
    ) {
      updateUnitOfIssueState({
        verificationErrorMessage:
          "The Original Acquisition Cost (per Unit) and/or Total Acquisition Cost is equal to or over $1 Million. Please make sure that the Original Acquisition Cost (per Unit) and Total Acquisition Cost is correct.",
        showErrorAlert: true,
      });
    } else {
      updateUnitOfIssueState({
        showErrorAlert: false,
      });
    }

    originalAcqCost =
      "$" +
      originalAcqCost
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "");

    updateUnitOfIssueState({
      originalAcqCost,
      totalAcqCost,
      originalAcqCostValidationMessage: validation.validationError,
      originalAcqCostIsInvalid: validation.isInvalid,
      originalAcqCostIsValid: !validation.isInvalid,
    });
  }


  function validateForm() {
    handleQuantityChange({ value: unitOfIssueState.quantity });
    handleOriginalAcqCostChange({ value: unitOfIssueState.originalAcqCost });
  }
  return (
    <>
      <React.Fragment>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4 grid-col-6"}>
            <PPMSInput
              id={"quantity"}
              name={"quantity"}
              label={"Quantity"}
              minLength={1}
              maxLength={5}
              onBlur={(event) => handleQuantityChange(event.target)}
              onChange={(event) =>{
                let quantity = event.target.value.toString()?.replace(/[^0-9]/g, "");
                quantity = quantity?.replace(/^[0]+$/, "");
                updateUnitOfIssueState({
                    quantity})}}
              isRequired={true}
              validationMessage={unitOfIssueState.quantityValidationMessage}
              isInvalid={unitOfIssueState.quantityIsInvalid}
              isValid={unitOfIssueState.quantityIsValid}
              isDisabled={false}
              inputType={"text"}
              value={unitOfIssueState.quantity}
            />
          </div>
          <div className={"tablet:grid-col-4 grid-col-6"}>
            <PPMSUnitOfIssue
              label={"Unit of Issue"}
              required={true}
              unitOfIssue={unitOfIssueState.unitOfIssue}
              unitOfIssueDefault={unitOfIssueState.unitOfIssueDefault}
              updateUnitOfIssues={handleUnitOfIssueChange}
            />
          </div>
        </div>
        <div className="grid-row grid-gap-4">
        <PPMSInput
          id={"originalAcqCost"}
          name={"originalAcqCost"}
          label={"Original Acquisition Cost"}
          hint={"Per Unit"}
          maxLength={18}
          minLength={2}
          value={unitOfIssueState.originalAcqCost}
          onBlur={(event) => handleOriginalAcqCostChange(event.target)}
          onChange={(event) =>{
            let originalAcqCost = event.target.value
                          .replace(/([^.]*\.[^.]*)\./g, "$1")
                          .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
                          .toString();
          originalAcqCost = originalAcqCost.replace(/^[0]+$/, "");
            updateUnitOfIssueState({
            originalAcqCost})
          }}
          isDisabled={false}
          inputType={"text"}
          isInvalid={unitOfIssueState.originalAcqCostIsInvalid}
          isValid={unitOfIssueState.originalAcqCostIsValid}
          isRequired={true}
          validationMessage={unitOfIssueState.originalAcqCostValidationMessage}
          placeHolder={"$0.00"}
          infoTipContent={unitOfIssueState.infoTipContent}
          infoTipClass={"ppms-usa-input-info-body"}
          className={"big-label full tablet:grid-col-4"}
        />
        <PPMSInput
          id={"totalAcqCost"}
          name={"totalAcqCost"}
          label={"Total Acquisition Cost"}
          value={unitOfIssueState.totalAcqCost}
          onChange={() => {}}
          isDisabled={true}
          inputType={"text"}
          isInvalid={false}
          isValid={false}
          isRequired={false}
          placeHolder={"$0.00"}
          minLength={0}
          maxLength={50}
          className={"big-label full tablet:grid-col-4"}
        />
        </div>
        <PPMSAlert
          id={"original-acquisition-cost-warning-alert"}
          show={unitOfIssueState.showErrorAlert}
          alertBody={unitOfIssueState.verificationErrorMessage}
          alertClassName={"original-acquisition-cost-warning"}
          alertVariant={"warning"}
          alertKey={"original-acquisition-cost-warning"}
        />
        {unitOfIssueState.showErrorAlert && <hr />}
      </React.Fragment>
    </>
  );
}

export default UnitOfIssueClass;
