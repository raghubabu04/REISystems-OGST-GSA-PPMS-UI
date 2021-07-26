import React, { useContext, useEffect } from "react";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { NonNonReportedTransferContext } from "../NonReportedTransferContext";
import {
  sourceCodeValues,
  conditionOptions,
  personalPropertyCenterOptions,
} from "../constants/Constants";
import {
  validateSourceCode,
  validateItemName,
  validateFSC,
  validateQuantity,
  validateUnitCost,
  isEmptyCheck,
} from "../validations/NonReportedTransferValidations";
import PPMSMultiSelect from "../../../../ui-kit/components/PPMS-multi-select";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSUnitSelect } from "../../../../ui-kit/components/PPMS-unit-select";
import { isFormSubmitted } from "../../../../service/validation.service";
import { ItemInformationStateDefault } from "./ItemInformationState";

export interface ItemInformationProps {}

export function ItemInformationClass(props: ItemInformationProps) {
  const { itemInformationState, updateItemInformationState } = useContext(
    NonNonReportedTransferContext
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
  }, [itemInformationState]);

  useEffect(() => {
    conditionOptions.forEach((o) => {
      o.isSelected = false;
    });
    personalPropertyCenterOptions.forEach((o) => {
      if (o.id === "1") {
        o.isSelected = true;
      } else {
        o.isSelected = false;
      }
    });

    updateItemInformationState({
      ...ItemInformationStateDefault,
      conditionOptions: conditionOptions,
      unitOfIssueOptions: itemInformationState.unitOfIssueOptions,
      personalPropertyCenterOptions: personalPropertyCenterOptions,
      fscOptions: itemInformationState.fscOptions,
      fcsSelectedValues: [],
    });
  }, []);

  useEffect(() => {
    let commonApiService = new CommonApiService();
    commonApiService
      .getFSCCodes()
      .then((response: any) => {
        updateItemInformationState({ fscOptions: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
    commonApiService
      .getUnitList()
      .then((response) => {
        formatUnitOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function validateForm() {
    handleItemNameBlur(itemInformationState.itemName);
    handleQuantityChange(itemInformationState.quantity);
    handleUnitCostChange(itemInformationState.unitCost);
    handleSourceCodeChange(itemInformationState.sourceCode);
    if (isEmptyCheck(itemInformationState.condition)) {
      updateItemInformationState({
        conditionInvalid: true,
      });
    }
  }

  function formatUnitOptions(data) {
    let options = [];
    for (let option of data) {
      let newOption = {
        id: option.code,
        value: option.description,
      };
      options.push(newOption);
    }
    updateItemInformationState({ unitOfIssueOptions: options });
  }

  function handleSourceCodeChange(selectValue: any) {
    let errorMessage = validateSourceCode(selectValue);
    if (errorMessage) {
      updateItemInformationState({
        sourceCodeInvalid: errorMessage.isInvalid,
        sourceCodeValidationMsg: errorMessage.validationError,
      });
    }
    updateItemInformationState({
      sourceCode: selectValue,
    });
  }

  function handleFscChange(value) {
    let validations = validateFSC(value);
    updateItemInformationState({
      fscIsInvalid: validations.isInvalid,
      fcsSelectedValue: value.length > 0 ? value[0].code : "",
      fscValidationMessage: validations.validationError,
    });
  }

  function handleItemNameBlur(value: any) {
    let errorMessage = validateItemName(value);
    if (errorMessage) {
      updateItemInformationState({
        itemNameIsInvalid: errorMessage.isInvalid,
        itemNameValidationMsg: errorMessage.validationError,
      });
    }
  }

  function handleConditionChange(event) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateItemInformationState({
          condition: e.id,
          conditionValidationMsg: "",
        });
      }
    });
  }

  function handlePropertyCenterChange(event) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateItemInformationState({
          personalPropertyCenter: e.value,
        });
      }
    });
  }

  function handleQuantityChange(value: any) {
    let errorMessage = validateQuantity(value);
    if (errorMessage) {
      updateItemInformationState({
        quantityIsInvalid: errorMessage.isInvalid,
        quantityValidationMsg: errorMessage.validationError,
      });
    }

    let multiplyBy = itemInformationState.unitCost;
    if (itemInformationState.unitCost === "") multiplyBy = "0";
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
    updateItemInformationState({
      quantity: quantity,
      totalAcqCost: totalAcqCost,
    });
  }

  function handleUnitChange(event) {
    let unit = event.target.value;
    updateItemInformationState({
      unitOfIssue: unit,
    });
  }

  function handleUnitCostChange(value: any) {
    if (value === "$") {
      value = "";
    }
    let errorMessage = validateUnitCost(value);
    updateItemInformationState({
      unitCostIsInvalid: errorMessage.isInvalid,
      unitCostValidationMsg: errorMessage.validationError,
    });
    if (!errorMessage.isInvalid) {
      value =
        "$" +
        value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          .replace("$", "");
    }

    let multiplyBy = itemInformationState.quantity;
    if (itemInformationState.quantity === "") multiplyBy = "0";

    let unitCost = value
      .replace(/([^.]*\.[^.]*)\./g, "$1")
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    unitCost = unitCost.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(unitCost)) {
      unitCost = Number(unitCost).toFixed(2);
    }

    let totalAcqCost = (Number(unitCost) * Number(multiplyBy)).toString();

    totalAcqCost = parseFloat(totalAcqCost.toString()).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    updateItemInformationState({
      unitCost: value,
      totalAcqCost: totalAcqCost,
    });
  }

  return (
    <>
      <PPMSSelect
        id={"source-code"}
        name={"source-code"}
        placeholderValue={"Select Source Code"}
        selectName={"selectSourceCode"}
        values={sourceCodeValues}
        onChange={(event) => handleSourceCodeChange(event.target.value)}
        isInvalid={itemInformationState.sourceCodeInvalid}
        validationMessage={itemInformationState.sourceCodeValidationMsg}
        identifierKey={"id"}
        identifierValue={"value"}
        selectedValue={itemInformationState.sourceCode}
        label={"Source Code"}
        isRequired={true}
      />
      <PPMSMultiSelect
        avoidHighlightFirstOption={true}
        caseSensitiveSearch={false}
        emptyRecordMsg={"---- No FSC Code Found ----"}
        chipVariant={"primary"}
        label={"Federal Supply Class"}
        id={"fscCode"}
        options={itemInformationState.fscOptions}
        isRequired={true}
        placeholder={"Enter FSC Code"}
        displayValue={"longName"}
        selectedValues={itemInformationState.fcsSelectedValues}
        showCheckbox={false}
        isObject={true}
        onSelect={handleFscChange}
        onRemove={handleFscChange}
        selectionLimit={1}
        singleSelect={false}
        closeOnSelect={true}
        isInvalid={itemInformationState.fscIsInvalid}
        isValid={itemInformationState.fscIsValid}
        validationMessage={itemInformationState.fscValidationMessage}
        validate={() => {
          updateItemInformationState({
            fscValidationMessage:
              "Federal Supply Class / National Stock Number is Required.",
            fscIsInvalid: true,
          });
        }}
        triggerValidation={itemInformationState.fscTriggerValidation}
      />
      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSInput
            id={"itemName"}
            name={"itemName"}
            label={"Item Name"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={itemInformationState.itemName}
            onChange={(event) => {
              let name = event.target.value.toString();
              updateItemInformationState({
                itemName: name,
                itemNameIsInvalid: false,
                itemNameValidationMsg: "",
              });
            }}
            onBlur={(event) => handleItemNameBlur(event.target.value)}
            validationMessage={itemInformationState.itemNameValidationMsg}
            isInvalid={itemInformationState.itemNameIsInvalid}
            isValid={false}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className={"grid-col-6"}>
          <PPMSToggleRadio
            id={"condition"}
            options={itemInformationState.conditionOptions}
            isInline={false}
            isDisabled={false}
            name={"condition"}
            className={"condition"}
            label={"Condition:"}
            validationMessage={itemInformationState.conditionValidationMsg}
            isSingleSelect={true}
            onChange={handleConditionChange}
            isRequired={true}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"tablet:grid-col-4 grid-col-6"}>
          <PPMSInput
            id={"quantity"}
            name={"quantity"}
            label={"Quantity"}
            minLength={1}
            maxLength={5}
            onBlur={(event) => handleQuantityChange(event.target.value)}
            onChange={(event) => {
              let quantity = event.target.value
                .toString()
                ?.replace(/[^0-9]/g, "");
              quantity = quantity?.replace(/^[0]+$/, "");
              updateItemInformationState({
                quantity,
                quantityIsInvalid: false,
                quantityValidationMsg: "",
              });
            }}
            isRequired={true}
            validationMessage={itemInformationState.quantityValidationMsg}
            isInvalid={itemInformationState.quantityIsInvalid}
            isValid={!itemInformationState.quantityIsInvalid}
            isDisabled={false}
            inputType={"text"}
            value={itemInformationState.quantity}
          />
        </div>
        <div className={"tablet:grid-col-4 grid-col-6"}>
          <PPMSUnitSelect
            name={"UnitOfIssue"}
            identifierKey={"id"}
            identifierValue={"value"}
            isInvalid={itemInformationState.unitOfIssueIsInvalid}
            isValid={!itemInformationState.unitOfIssueIsInvalid}
            label={"Unit of Issue"}
            onChange={handleUnitChange}
            isRequired={true}
            selectName={"unitOfIssue"}
            selectedValue={itemInformationState.unitOfIssue}
            validationMessage={itemInformationState.unitOfIssueValidationMsg}
            values={itemInformationState.unitOfIssueOptions}
          />
        </div>
      </div>
      <PPMSInput
        id={"unitCost"}
        name={"unitCost"}
        label={"Unit Cost"}
        hint={"Per Unit"}
        maxLength={18}
        minLength={2}
        value={itemInformationState.unitCost}
        onBlur={(event) => handleUnitCostChange(event.target.value)}
        onChange={(event) => {
          let unitCost = event.target.value
            .replace(/([^.]*\.[^.]*)\./g, "$1")
            .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
            .toString();
          unitCost = unitCost.replace(/^[0]+$/, "");
          if (/^\d+\.\d\d\d$/.test(unitCost)) {
            unitCost = Number(unitCost).toFixed(2);
          } else if (unitCost.includes(".")) {
            unitCost = unitCost;
          } else {
            unitCost = unitCost.substring(0, 11);
          }
          unitCost =
            "$" +
            unitCost
              .toString()
              // .replace(/([^.]*\.[^.]*)\./g, '$1')
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              .replace("$", "");

          updateItemInformationState({
            unitCost,
            unitCostIsInvalid: false,
            unitCostValidationMsg: "",
          });
        }}
        isDisabled={false}
        inputType={"text"}
        isInvalid={itemInformationState.unitCostIsInvalid}
        isValid={!itemInformationState.unitCostIsInvalid}
        isRequired={true}
        validationMessage={itemInformationState.unitCostValidationMsg}
        placeHolder={"$0.00"}
        className={"big-label tablet:grid-col-auto"}
      />
      <PPMSInput
        id={"totalAcqCost"}
        name={"totalAcqCost"}
        label={"Total Acquisition Cost"}
        value={itemInformationState.totalAcqCost}
        onChange={() => {}}
        isDisabled={true}
        inputType={"text"}
        isInvalid={false}
        isValid={false}
        isRequired={false}
        placeHolder={"$0.00"}
        minLength={0}
        maxLength={50}
        className={"big-label tablet:grid-col-auto"}
      />
      <div className="grid-row grid-gap-4">
        <div className={"grid-col-6"}>
          <PPMSToggleRadio
            id={"personal-property-center"}
            options={itemInformationState.personalPropertyCenterOptions}
            isInline={false}
            isDisabled={false}
            name={"personal-Property-Center"}
            className={"personalPropertyCenterClass"}
            label={"Personal Property Center:"}
            validationMessage={""}
            isSingleSelect={true}
            onChange={handlePropertyCenterChange}
            isRequired={true}
          />
        </div>
      </div>
    </>
  );
}
