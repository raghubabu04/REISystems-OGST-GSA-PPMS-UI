/**
 * React class component to render the Computer Related Assets.
 * The codes accessing this list is from src/app/property/constants/ComputerConstants.ts
 */
import React, { useContext, useEffect, useMemo } from "react";
import { fscCodes7025 } from "../constants/ComputerConstants";
import { PropertyContext } from "../PropertyContext";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSFscSpecial } from "../../../../ui-kit/components/property/PPMS-fsc-special";
import {
  isEmptyCheck,
  validateCommonItemName,
} from "../validations/propertyFieldValidations";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { isFormSubmitted } from "../../../../service/validation.service";

export interface FSCComputersProps {
  updateFSCComputers: any;
  fscCode: string;
  validateFscSection: boolean;
}

export function FSCComputers(props: FSCComputersProps) {
  const {
    fscState,
    updateFSCState,
    fscComputerState,
    updateFSCComputerState,
  } = useContext(PropertyContext);
  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      } else if (props.validateFscSection) {
        validateForm();
        updateFSCState({
          validateFscSection: false,
        });
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [fscState]);
  function handleToggleChange(items: any) {
    const field = items[0].field;
    const fscComputersData = fscComputerState.fscComputersData;
    const selectedItem = items.filter((item: any) => item.isSelected === true);
    updateFSCComputerState({ fscComputersData });
    if (selectedItem.length > 0) {
      if (selectedItem[0].value === "Yes") {
        fscComputersData.isEquipmentForComputersForLearning = true;
        fscComputersData.isEquipmentForComputersForLearningEligible = "";
      } else if (selectedItem[0].value === "No") {
        fscComputersData.isEquipmentForComputersForLearning = false;
        fscComputersData.isEquipmentForComputersForLearningEligible = "";
      }
      if (
        selectedItem[0].id === "sanitized" ||
        selectedItem[0].id === "nonSanitized" ||
        selectedItem[0].id === "removed" ||
        selectedItem[0].id === "degaussed" ||
        selectedItem[0].id === "notApplicable"
      ) {
        fscComputersData[field] = selectedItem[0].value;
      }
      if (selectedItem[0].id === "schoolsOnly") {
        fscComputersData["isEquipmentForComputersForLearningEligible"] = "S";
      } else if (selectedItem[0].id === "allOrganizations") {
        fscComputersData["isEquipmentForComputersForLearningEligible"] = "A";
      }
    }
    updateFSCComputerState({
      computer: fscComputersData,
    });
    updateComputerEligibleForLearning();
  }

  function updateComputerEligibleForLearning() {
    if (fscComputerState.fscComputersData) {
      const computer = fscComputerState.fscComputersData;
      const fscInfoInvalid: boolean =
        computer.isEquipmentForComputersForLearning &&
        isEmptyCheck(computer.isEquipmentForComputersForLearningEligible);
      updateFSCState({
        computerInvalid: fscInfoInvalid,
      });
    }
  }

  function handleChange(event: any) {
    const fscComputersData = fscComputerState.fscComputersData;
    const fsc = fscState.fsc;
    if (event.currentTarget.name === "make") {
      fsc.make = event.currentTarget.value;
    } else if (event.currentTarget.name === "model") {
      fsc.model = event.currentTarget.value;
    } else {
      fscComputersData[event.currentTarget.id] = event.currentTarget.value;
    }
    updateFSCComputerState({
      fscComputersData,
      computer: fscComputersData,
    });
    updateFSCState({
      fsc,
    });
  }

  function handleItemChange({ name, value }) {
    const { fscComputersData, validationMessage } = fscComputerState;
    const { fsc } = fscState;
    if (name === "itemName") {
      let errMsgStr = validateCommonItemName(value).validationError;

      let validationErr = validateCommonItemName(value).isInvalid;

      let validationMsg = {
        itemNameMsg: errMsgStr,
        itemNameInvalid: validationErr,
        itemNameValid: !validationErr,
      };
      validationMessage["itemNameMsg"] = validationMsg.itemNameMsg;
      validationMessage["itemNameInvalid"] = validationMsg.itemNameInvalid;
      validationMessage["itemNameValid"] = validationMsg.itemNameValid;

      updateFSCComputerState({
        computer: fscComputersData,
        validationMessage,
      });
      fsc.itemName = value;
      updateFSCState({
        fsc: fsc,
        itemNameInvalid: !isEmptyCheck(validationErr),
      });
    }
  }

  function validateForm() {
    handleItemChange({ name: "itemName", value: fscState?.fsc?.itemName });
    updateComputerEligibleForLearning();
  }
  return useMemo(() => {
    /**
     * Make everything except hardware/equipment/make/model and cfl selections disappear
     */
    let fscCode7025SpecificFieldsEnabled: boolean = true;
    if (fscCodes7025.includes(props.fscCode)) {
      fscCode7025SpecificFieldsEnabled = false;
    }
    let yesNoOptionsChecked;
    if (
      fscComputerState?.fscComputersData?.isEquipmentForComputersForLearning !==
      null
    ) {
      yesNoOptionsChecked = fscComputerState.fscComputersData
        .isEquipmentForComputersForLearning
        ? "Y"
        : "N";
    }

    let cflChecked;
    if (
      fscComputerState?.fscComputersData
        ?.isEquipmentForComputersForLearningEligible
    ) {
      cflChecked =
        fscComputerState.fscComputersData
          .isEquipmentForComputersForLearningEligible === "S"
          ? "schoolsOnly"
          : "allOrganizations";
    }
    return (
      <>
        <div className="grid-row grid-gap-4">
          <div className={"tablet:grid-col-8"}>
            <PPMSInput
              id={"itemName"}
              name={"itemName"}
              label={"Item Name"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={fscState.fsc.itemName}
              onBlur={(event) => handleItemChange(event.currentTarget)}
              onChange={(event) => {
                const { fsc } = fscState;
                fsc.itemName = event.target.value;
                updateFSCComputerState({});
              }}
              validationMessage={fscComputerState.validationMessage.itemNameMsg}
              maxLength={69}
              minLength={4}
              isInvalid={fscComputerState.validationMessage.itemNameInvalid}
              isValid={false}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              id={"hardwareType"}
              onChange={handleChange}
              isValid={false}
              isInvalid={false}
              value={fscComputerState.fscComputersData.hardwareType}
              label={"Hardware"}
              isRequired={false}
              message={"Optional"}
              isDisabled={false}
              inputType={"text"}
              maxLength={20}
            />
          </div>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              id={"equipmentType"}
              onChange={handleChange}
              isValid={false}
              isInvalid={false}
              value={fscComputerState.fscComputersData.equipmentType}
              label={"Equipment"}
              isRequired={false}
              message={"Optional"}
              isDisabled={false}
              inputType={"text"}
              maxLength={20}
            />
          </div>
          <div className={"tablet:grid-col-4"}>
            <PPMSInput
              name={"make"}
              id={"make"}
              onChange={handleChange}
              isValid={false}
              isInvalid={false}
              value={fscState.fsc.make}
              label={"Make"}
              isRequired={false}
              message={"Optional"}
              isDisabled={false}
              inputType={"text"}
              maxLength={20}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-6"}>
            <PPMSInput
              name={"model"}
              id={"model"}
              minLength={1}
              isValid={false}
              isInvalid={false}
              isRequired={false}
              message={"Optional"}
              onChange={handleChange}
              label={"Model"}
              value={fscState.fsc.model}
              inputType={"text"}
              isDisabled={false}
              maxLength={20}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-6"}>
            {fscCode7025SpecificFieldsEnabled ? (
              <PPMSInput
                id={"processorType"}
                name={"processorType"}
                onChange={handleChange}
                isValid={false}
                isInvalid={false}
                label={"Processor Type"}
                isRequired={false}
                message={"Optional"}
                inputType={"text"}
                isDisabled={false}
                maxLength={20}
                value={fscComputerState.fscComputersData.processorType}
              />
            ) : null}
          </div>
          <div className={"tablet:grid-col-6"}>
            {fscCode7025SpecificFieldsEnabled ? (
              <PPMSInput
                id={"processingSpeed"}
                name={"processingSpeed"}
                onChange={handleChange}
                isValid={false}
                isInvalid={false}
                validationMessage={""}
                value={fscComputerState.fscComputersData.processingSpeed}
                label={"Processing Speed"}
                isRequired={false}
                message={"Optional"}
                inputType={"text"}
                isDisabled={false}
                maxLength={20}
              />
            ) : null}
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"tablet:grid-col-6"}>
            {fscCode7025SpecificFieldsEnabled ? (
              <PPMSInput
                id={"ram"}
                name={"ram"}
                onChange={handleChange}
                isValid={false}
                isInvalid={false}
                validationMessage={""}
                value={fscComputerState.fscComputersData.ram}
                label={"RAM"}
                isRequired={false}
                message={"Optional"}
                inputType={"text"}
                isDisabled={false}
                maxLength={20}
              />
            ) : null}
          </div>
          <div className={"tablet:grid-col-6"}>
            {fscCode7025SpecificFieldsEnabled ? (
              <PPMSInput
                id={"hardDiskSize"}
                name={"hardDiskSize"}
                onChange={handleChange}
                isValid={false}
                isInvalid={false}
                validationMessage={""}
                value={fscComputerState.fscComputersData.hardDiskSize}
                label={"Hard Disk size"}
                isRequired={false}
                message={"Optional"}
                inputType={"text"}
                isDisabled={false}
                maxLength={20}
              />
            ) : null}
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            {fscCode7025SpecificFieldsEnabled ? (
              <PPMSToggleRadio
                isInline={false}
                name={"hardDiskStatus"}
                isRequired={false}
                message={"Optional"}
                isDisabled={false}
                options={fscComputerState.hardDiskStatusOptions}
                isInvalid={false}
                validationMessage={""}
                onChange={handleToggleChange}
                className=""
                id=""
                label={"Hard Drive Status"}
              />
            ) : null}
          </div>
          <div className={"grid-col-12"}>
            <PPMSToggleRadio
              isInline={false}
              name={"isEquipmentForComputersForLearning"}
              isRequired={true}
              isDisabled={false}
              options={
                fscComputerState.isEquipmentForComputersForLearningOptions
              }
              isInvalid={false}
              validationMessage={
                fscComputerState.validationMessage
                  .isEquipmentForCFLValidationMsg
              }
              onChange={handleToggleChange}
              id="isEquipmentForComputersForLearning"
              label={
                "Do you want this item screen in the Computers for Learning (CFL) module?"
              }
              // defaultChecked={yesNoOptionsChecked}
            />
          </div>
        </div>{" "}
        <div>
          {fscComputerState.fscComputersData[
            "isEquipmentForComputersForLearning"
          ] ? (
            <PPMSToggleRadio
              isInline={false}
              name={"isEquipmentForComputersForLearningEligible"}
              isRequired={fscComputerState.makeCFLEligibleForMandatory}
              message={
                !fscComputerState.makeCFLEligibleForMandatory
                  ? "Optional"
                  : null
              }
              isDisabled={false}
              options={fscComputerState.cflEligibleOptions}
              isInvalid={
                fscComputerState.validationMessage.cflEligibleForCFLInvalid
              }
              validationMessage={
                fscComputerState.validationMessage.cflEligibleForValidationMsg
              }
              onChange={handleToggleChange}
              className=""
              id=""
              label={"Who do you want this item to be able to screen in CFL?"}
            />
          ) : null}
        </div>
        <div className={"grid-row grid-gap-4"}>
          <PPMSFscSpecial
            id={"special"}
            specialDescriptionCode={fscState.fsc.specialDescriptionCode}
            specialDescriptionText={fscState.fsc.specialDescriptionText}
            required={false}
            updateSpecialDescriptionCode={(value: any, validation: any) => {
              const { fscComputersData, validationMessage } = fscComputerState;
              const { fsc } = fscState;
              fsc.specialDescriptionCode = value;

              validationMessage["specialDescriptionCodeMsg"] =
                validation.specialDescriptionCodeMsg;
              validationMessage["specialDescriptionCodeInvalid"] =
                validation.specialDescriptionCodeInvalid;
              validationMessage[
                "specialDescriptionCodeValid"
              ] = !validation.specialDescriptionCodeValid;
              fsc.specialDescriptionCode = value;
              updateFSCComputerState({
                fscComputersData,
                computer: fscComputersData,
                validationMessage,
              });
              updateFSCState({
                fsc,
              });
            }}
            updateSpecialDescriptionText={(value: any, validation: any) => {
              const { fscComputersData, validationMessage } = fscComputerState;
              const { fsc } = fscState;
              fsc.specialDescriptionText = value;
              validationMessage["specialDescriptionTextMsg"] =
                validation.specialDescriptionTextMsg;
              validationMessage["specialDescriptionTextInvalid"] =
                validation.specialDescriptionTextInvalid;
              validationMessage[
                "specialDescriptionTextValid"
              ] = !validation.specialDescriptionTextValid;
              fsc.specialDescriptionText = value;
              updateFSCComputerState({
                fscComputersData,
                computer: fscComputersData,
                validationMessage,
              });
              updateFSCState({
                fsc,
              });
            }}
          />
        </div>
      </>
    );
  }, [fscComputerState]);
}

export default FSCComputers;
