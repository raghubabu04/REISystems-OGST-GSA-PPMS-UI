import React, { useContext, useEffect, useMemo } from "react";
import {
  bodyStyle,
  truckBodyStyle,
  color,
  colorGradient,
  FSC_RequiringRecallToggle,
  FSC_RequiringValueAddedServices,
  fuelType,
  noOfCylindersOptions,
  recallOptions,
  valueAddedServicesOptions,
} from "../constants/Constants";
import {
  validateAgencyClass,
  validateCommonItemName,
  validateCommonMake,
  validateCommonModel,
  validateFSCVehicleProperties,
  validateModelYear,
  validateTag,
  validateVin,
} from "../validations/propertyFieldValidations";
import { PropertyContext } from "../PropertyContext";
import { VehicleOpenRecallInfo } from "./VehicleOpenRecallInfo";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSFscSpecial } from "../../../../ui-kit/components/property/PPMS-fsc-special";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { isFormSubmitted } from "../../../../service/validation.service";
import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";

export interface FSCVehicleProps {
  updateFSCVehicle: any;
  triggerValidation?: boolean;
  makeIsRequired: boolean;
  modelIsRequired: boolean;
  validateFscSection: boolean;
}

function FSCVehicle(props: FSCVehicleProps) {
  const {
    fscVehicleState,
    updateFSCVehicleState,
    fscState,
    updateFSCState,
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
  //function called to update icnState with new value
  function updatefscVehicleState(newState: any, callback: any) {
    updateFSCVehicleState(newState);
    if (typeof callback === "function") {
      callback();
    }
  }

  function handleChange({ id, value, name, required }) {
    const { vehicleFSCData } = fscVehicleState;
    const { fsc } = fscState;
    //validations here -
    let errMsg;
    if (name === "agencyClass") {
      errMsg = validateAgencyClass(value, name, fscVehicleState);
    } else if (name === "tag") {
      errMsg = validateTag(value, name, fscVehicleState);
    } else if (name === "make") {
      errMsg = validateCommonMake(value, required).validationError;
    } else if (name === "model") {
      errMsg = validateCommonModel(value, required).validationError;
    } else if (name === "modelYear") {
      errMsg = validateModelYear(value);
    } else if (name === "vin") {
      errMsg = validateVin(value);
    } else if (name === "estimatedMileage") {
      if (!/^[-\d*]+$/.test(value) || value < 10) {
        errMsg =
          "Mileage has to be at least 2 digits and starting with non-zero.";
      }
    } else if (name === "itemName") {
      errMsg = validateCommonItemName(value).validationError;
    } else if (id === "fuelType" && isEmptyCheck(value)) {
      errMsg = fscVehicleState.validationMessage.fuelTypeMsg;
    } else if (id === "noOfCylinders" && isEmptyCheck(value)) {
      errMsg = fscVehicleState.validationMessage.noOfCylindersMsg;
    } else if (id === "bodyStyle" && isEmptyCheck(value)) {
      errMsg = fscVehicleState.validationMessage.bodyStyleMsg;
    } else if (id === "color" && isEmptyCheck(value)) {
      errMsg = fscVehicleState.validationMessage.colorMsg;
    } else {
      errMsg = validateFSCVehicleProperties({ id, value, name });
    }

    let validationMsg = setValidationMessage(id, errMsg);
    vehicleFSCData[id] = value;
    if (name === "itemName") {
      fsc["itemName"] = value;
      updateFSCState({
        fsc: fsc,
        itemNameInvalid: !isEmptyCheck(errMsg),
      });
    }
    updatefscVehicleState(
      {
        vehicleFSCData: vehicleFSCData,
        validationMessage: validationMsg,
      },
      function () {
        props.updateFSCVehicle({ vehicle: vehicleFSCData });
      }
    );
    let vehicleInvalid =
      validationMsg.agencyClassInvalid ||
      validationMsg.modelYearInvalid ||
      validationMsg.tagInvalid ||
      validationMsg.noOfCylindersInvalid ||
      validationMsg.modelYearInvalid ||
      validationMsg.bodyStyleInvalid ||
      validationMsg.vinInvalid ||
      validationMsg.makeInvalid ||
      validationMsg.itemNameInvalid ||
      validationMsg.bodyStyleInvalid ||
      validationMsg.modelInvalid ||
      validationMsg.estimatedMileageInvalid ||
      validationMsg.colorInvalid ||
      validationMsg.itemNameInvalid ||
      validationMsg.specialDescriptionCodeInvalid ||
      validationMsg.specialDescriptionTextInvalid;
    updateFSCState({
      vehicleInvalid: vehicleInvalid,
    });
  }
  function validateForm() {
    let itemName = {
      id: "itemName",
      value: fscVehicleState.vehicleFSCData.itemName,
      name: "itemName",
      required: true,
    };
    let agencyClass = {
      id: "agencyClass",
      value: fscVehicleState.vehicleFSCData.agencyClass,
      name: "agencyClass",
      required: fscVehicleState.validationMessage.agencyClassRequired,
    };
    let tag = {
      id: "tag",
      value: fscVehicleState.vehicleFSCData.tag,
      name: "tag",
      required: fscVehicleState.validationMessage.isTagRequired,
    };
    let noOfCylinders = {
      id: "noOfCylinders",
      value: fscVehicleState?.vehicleFSCData?.noOfCylinders?.toString(),
      name: "",
      required: true,
    };
    let fuelType = {
      id: "fuelType",
      value: fscVehicleState.vehicleFSCData.fuelType,
      name: "",
      required: true,
    };
    let modelYear = {
      id: "modelYear",
      value: fscVehicleState.vehicleFSCData.modelYear,
      name: "modelYear",
      required: true,
    };
    let bodyStyle = {
      id: "bodyStyle",
      value: fscVehicleState.vehicleFSCData.bodyStyle,
      name: "",
      required: true,
    };
    let vin = {
      id: "vin",
      value: fscVehicleState.vehicleFSCData.vin,
      name: "vin",
      required: true,
    };
    let make = {
      id: "make",
      value: fscVehicleState.vehicleFSCData.make,
      name: "make",
      required: props.makeIsRequired,
    };
    let model = {
      id: "model",
      value: fscVehicleState.vehicleFSCData.model,
      name: "model",
      required: props.modelIsRequired,
    };
    let estimatedMileage = {
      id: "estimatedMileage",
      value: fscVehicleState.vehicleFSCData.estimatedMileage,
      name: "estimatedMileage",
      required: true,
    };
    let color = {
      id: "color",
      value: fscVehicleState.vehicleFSCData.color,
      name: "",
      required: true,
    };
    handleChange(itemName);
    handleChange(agencyClass);
    handleChange(tag);
    handleChange(noOfCylinders);
    handleChange(fuelType);
    handleChange(modelYear);
    handleChange(bodyStyle);
    handleChange(vin);
    handleChange(make);
    handleChange(model);
    handleChange(estimatedMileage);
    handleChange(color);
    const validationMessage = fscVehicleState.validationMessage;
    if (isEmptyCheck(fscVehicleState.vehicleFSCData.transmissionType)) {
      validationMessage.transmissionTypeInvalid = true;
      updateFSCState({
        validationMessage: validationMessage,
        vehicleInvalid: true,
      });
    }
    if (
      FSC_RequiringRecallToggle.includes(fscState.data.fscCode) &&
      isEmptyCheck(fscVehicleState.vehicleFSCData.recalled)
    ) {
      validationMessage.recallIsInvalid = true;
      updateFSCState({
        validationMessage: validationMessage,
        vehicleInvalid: true,
      });
    }
    if (
      FSC_RequiringValueAddedServices.includes(fscState.data.fscCode) &&
      isEmptyCheck(fscState.valueAddedServices)
    ) {
      updateFSCState({
        isValueAddedServiceInValid: true,
        vehicleInvalid: true,
      });
    }
  }
  function handleToggleChange(items: any) {
    const field = items[0].field;
    const { vehicleFSCData, validationMessage } = fscVehicleState;

    let selectedVal = "";
    items.forEach((item) => {
      if (item.isSelected) {
        selectedVal = item.id;
        vehicleFSCData[field] = selectedVal;
      }
    });
    validationMessage.transmissionTypeInvalid = isEmptyCheck(selectedVal);

    updatefscVehicleState(
      { vehicleFSCData: vehicleFSCData, validationMessage: validationMessage },
      function () {
        props.updateFSCVehicle({ vehicle: vehicleFSCData });
      }
    );
  }

  function onChangeEvent(event: any) {
    const { vehicleFSCData } = fscVehicleState;
    vehicleFSCData[event.target.id] = event.target.value;
    updateFSCVehicleState({ vehicleFSCData: vehicleFSCData });
  }

  function setValidationMessage(id: any, errMsg: string | false) {
    const { validationMessage } = fscVehicleState;
    if (errMsg) {
      validationMessage[id + "Msg"] = errMsg;
      validationMessage[id + "Valid"] = false;
      validationMessage[id + "Invalid"] = true;
    } else {
      validationMessage[id + "Msg"] = "";
      validationMessage[id + "Valid"] = true;
      validationMessage[id + "Invalid"] = false;
    }
    return validationMessage;
  }

  let setRecallToggle = function checkifToggleIsRequired() {
    if (FSC_RequiringRecallToggle.includes(fscState.data.fscCode)) {
      return (
        <PPMSToggleRadio
          className=""
          id={"OpenRecall"}
          isRequired={true}
          options={fscVehicleState.recallOptions}
          isInline={false}
          isDisabled={false}
          name={"Vehicle Open Recall"}
          label={"Open Recall"}
          validationMessage={
            fscVehicleState.validationMessage.recallValidationMsg
          }
          isSingleSelect={true}
          onChange={handleRecall}
          isInvalid={fscVehicleState.validationMessage.recallIsInvalid}
          infoTipContent={<VehicleOpenRecallInfo />}
          infoTipClass={"ppms-usa-input-info-body"}
        />
      );
    }
  };

  let setValueAddedServicesToggle = function checkifValueAddedServiceToggleIsRequired() {
    if (FSC_RequiringValueAddedServices.includes(fscState.data.fscCode)) {
      return (
        <PPMSToggleRadio
          className=""
          id={"ValueAddedServices"}
          isRequired={true}
          options={fscState.valueAddedServicesOptions}
          isInline={false}
          isDisabled={false}
          name={"Value Added Services"}
          label={"Value Added Services"}
          validationMessage={fscState.valueAddedServiceValidationMsg}
          isSingleSelect={true}
          isInvalid={fscState.isValueAddedServiceInValid}
          onChange={handleValueAddedService}
        />
      );
    }
  };

  function handleRecall(OptionsState: typeof recallOptions) {
    const { vehicleFSCData, validationMessage } = fscVehicleState;
    let selectedVal = "";
    OptionsState.forEach((option) => {
      if (option.isSelected) {
        selectedVal = option.id;
        vehicleFSCData.recalled = selectedVal;
      }
    });
    validationMessage.recallIsInvalid = isEmptyCheck(selectedVal);
    updatefscVehicleState(
      {
        vehicleFSCData: vehicleFSCData,
        validationMessage: validationMessage,
      },
      function () {
        props.updateFSCVehicle({ vehicle: vehicleFSCData });
      }
    );
  }

  function handleValueAddedService(
    OptionsState: typeof valueAddedServicesOptions
  ) {
    let selectedVal: string = "";

    OptionsState.forEach((option) => {
      if (option.isSelected) {
        selectedVal = option.id;
      }
    });

    fscState.isValueAddedServiceInValid = isEmptyCheck(selectedVal);
    fscState.valueAddedServices = selectedVal;
    updateFSCState(fscState);
  }

  return useMemo(() => {
    return (
      <>
        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-8">
            <PPMSInput
              id={"itemName"}
              name={"itemName"}
              label={"Item Name"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={fscVehicleState.vehicleFSCData.itemName}
              onChange={onChangeEvent}
              onBlur={(event) => handleChange(event.target)}
              validationMessage={fscVehicleState.validationMessage.itemNameMsg}
              maxLength={69}
              minLength={4}
              isInvalid={fscVehicleState.validationMessage.itemNameInvalid}
              isValid={false}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-6">
            <PPMSToggleRadio
              isInline={false}
              name={"transmissionType"}
              isDisabled={false}
              options={fscVehicleState.transmissionTypeOptions}
              isRequired={true}
              validationMessage={
                fscVehicleState.validationMessage.transmissionTypeMsg
              }
              onChange={handleToggleChange}
              isInvalid={
                fscVehicleState.validationMessage.transmissionTypeInvalid
              }
              className=""
              id="vehcileTransmissionType"
              label={"Transmission Type"}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-4">
            <PPMSInput
              name={"agencyClass"}
              id={"agencyClass"}
              maxLength={3}
              minLength={3}
              validationMessage={
                fscVehicleState.validationMessage.agencyClassMsg
              }
              isInvalid={fscVehicleState.validationMessage.agencyClassInvalid}
              isValid={fscVehicleState.validationMessage.agencyClassValid}
              isRequired={fscVehicleState.validationMessage.agencyClassRequired}
              onChange={onChangeEvent}
              onBlur={(event) => handleChange(event.target)}
              label={"Agency Class"}
              value={fscVehicleState.vehicleFSCData.agencyClass}
              inputType={"text"}
              isDisabled={false}
            />
          </div>
          <div className="tablet:grid-col-4">
            <PPMSInput
              inputType={"text"}
              name="tag"
              id={"tag"}
              maxLength={5}
              minLength={5}
              validationMessage={fscVehicleState.validationMessage.tagMsg}
              isInvalid={fscVehicleState.validationMessage.tagInvalid}
              isValid={fscVehicleState.validationMessage.tagValid}
              isRequired={fscVehicleState.validationMessage.isTagRequired}
              onChange={onChangeEvent}
              onBlur={(event) => handleChange(event.target)}
              isDisabled={false}
              label={"Tag"}
              value={fscVehicleState.vehicleFSCData.tag}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-6">
            <PPMSSelect
              placeholderValue={"Select No Of Cylinders"}
              selectName={"noOfCylinders"}
              values={noOfCylindersOptions}
              onChange={(event) => handleChange(event.target)}
              validationMessage={
                fscVehicleState.validationMessage.noOfCylindersMsg
              }
              isInvalid={fscVehicleState.validationMessage.noOfCylindersInvalid}
              isValid={fscVehicleState.validationMessage.noOfCylindersValid}
              identifierKey={"id"}
              identifierValue={"value"}
              selectedValue={fscVehicleState?.vehicleFSCData?.noOfCylinders?.toString()}
              label={"No Of Cylinders"}
              isRequired={true}
            />
          </div>
          <div className="tablet:grid-col-6">
            <PPMSSelect
              placeholderValue={"Select Fuel Type"}
              selectName={"fuelType"}
              isRequired={true}
              values={fuelType}
              onChange={(event) => handleChange(event.target)}
              validationMessage={fscVehicleState.validationMessage.fuelTypeMsg}
              isInvalid={fscVehicleState.validationMessage.fuelTypeInvalid}
              isValid={fscVehicleState.validationMessage.fuelTypeValid}
              identifierKey={"id"}
              identifierValue={"value"}
              selectedValue={fscVehicleState.vehicleFSCData.fuelType}
              label={"Fuel Type"}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-6">
            <PPMSInput
              inputType={"text"}
              name="modelYear"
              id={"modelYear"}
              message={""}
              minLength={4}
              maxLength={4}
              validationMessage={fscVehicleState.validationMessage.modelYearMsg}
              isInvalid={fscVehicleState.validationMessage.modelYearInvalid}
              isValid={fscVehicleState.validationMessage.modelYearValid}
              isRequired={true}
              onChange={onChangeEvent}
              onBlur={(event) => handleChange(event.target)}
              isDisabled={false}
              label={"Model Year"}
              value={fscVehicleState.vehicleFSCData.modelYear}
            />
          </div>

          <div className="tablet:grid-col-6">
            <PPMSSelect
              placeholderValue={"Select Body Style"}
              selectName={"bodyStyle"}
              values={
                fscState.data.fscCode === "2320" ? truckBodyStyle : bodyStyle
              }
              onChange={(event) => handleChange(event.target)}
              validationMessage={fscVehicleState.validationMessage.bodyStyleMsg}
              isInvalid={fscVehicleState.validationMessage.bodyStyleInvalid}
              isValid={fscVehicleState.validationMessage.bodyStyleValid}
              identifierKey={"id"}
              identifierValue={"value"}
              selectedValue={fscVehicleState.vehicleFSCData.bodyStyle}
              label={"Body Style"}
              isRequired={true}
            />
          </div>
        </div>

        <div className="grid-row-grid-gap-4">
          <div className="tablet:grid-col-4">
            <PPMSInput
              name="vin"
              id={"vin"}
              message={""}
              maxLength={20}
              minLength={11}
              validationMessage={fscVehicleState.validationMessage.vinMsg}
              isInvalid={fscVehicleState.validationMessage.vinInvalid}
              isValid={fscVehicleState.validationMessage.vinValid}
              isRequired={true}
              onChange={onChangeEvent}
              onBlur={(event) => handleChange(event.target)}
              label={"Vehicle Identification Number"}
              value={fscVehicleState.vehicleFSCData.vin}
              inputType={"text"}
              isDisabled={false}
            />
          </div>
          {setRecallToggle()}
          {setValueAddedServicesToggle()}
          <div className="grid-row grid-gap-4">
            <div className="tablet:grid-col-4">
              <PPMSInput
                name="make"
                id={"make"}
                maxLength={20}
                minLength={1}
                validationMessage={fscVehicleState.validationMessage.makeMsg}
                isInvalid={fscVehicleState.validationMessage.makeInvalid}
                isValid={fscVehicleState.validationMessage.makeValid}
                isRequired={props.makeIsRequired}
                onChange={onChangeEvent}
                onBlur={(event) => handleChange(event.target)}
                label={"Make"}
                value={fscVehicleState.vehicleFSCData.make}
                inputType={"text"}
                isDisabled={false}
              />
            </div>
            <div className="tablet:grid-col-4">
              <PPMSInput
                name="model"
                id={"model"}
                maxLength={20}
                minLength={1}
                validationMessage={fscVehicleState.validationMessage.modelMsg}
                isInvalid={fscVehicleState.validationMessage.modelInvalid}
                isValid={fscVehicleState.validationMessage.modelValid}
                isRequired={props.modelIsRequired}
                onChange={onChangeEvent}
                onBlur={(event) => handleChange(event.target)}
                label={"Model"}
                value={fscVehicleState.vehicleFSCData.model}
                inputType={"text"}
                isDisabled={false}
              />
            </div>
            <div className="tablet:grid-col-4">
              <PPMSInput
                name="estimatedMileage"
                id={"estimatedMileage"}
                message={""}
                maxLength={7}
                minLength={2}
                validationMessage={
                  fscVehicleState.validationMessage.estimatedMileageMsg
                }
                isInvalid={
                  fscVehicleState.validationMessage.estimatedMileageInvalid
                }
                isValid={
                  fscVehicleState.validationMessage.estimatedMileageValid
                }
                isRequired={true}
                onChange={onChangeEvent}
                onBlur={(event) => handleChange(event.target)}
                label={"Estimated Mileage"}
                value={fscVehicleState.vehicleFSCData.estimatedMileage}
                inputType={"text"}
                isDisabled={false}
              />
            </div>
          </div>

          <div className="grid-row grid-gap-4">
            <div className="tablet:grid-col-6">
              <PPMSSelect
                placeholderValue={"Select Color"}
                selectName={"color"}
                values={color}
                onChange={(event) => handleChange(event.target)}
                validationMessage={fscVehicleState.validationMessage.colorMsg}
                isInvalid={fscVehicleState.validationMessage.colorInvalid}
                isValid={fscVehicleState.validationMessage.colorValid}
                identifierKey={"id"}
                identifierValue={"value"}
                selectedValue={fscVehicleState.vehicleFSCData.color}
                label={"Color"}
                isRequired={true}
              />
            </div>
            <div className="tablet:grid-col-6">
              <PPMSSelect
                placeholderValue={"Select Color Gradient"}
                selectName={"colorGradient"}
                values={colorGradient}
                onChange={(event) => handleChange(event.target)}
                validationMessage={""}
                isInvalid={false}
                isValid={false}
                identifierKey={"id"}
                identifierValue={"value"}
                selectedValue={fscVehicleState.vehicleFSCData.colorGradient}
                label={"Color Gradient"}
                isRequired={false}
              />
            </div>
          </div>

          <div className={"grid-row grid-gap-4"}>
            <PPMSFscSpecial
              id={"special"}
              specialDescriptionCode={
                fscVehicleState.vehicleFSCData.specialDescriptionCode
              }
              specialDescriptionText={
                fscVehicleState.vehicleFSCData.specialDescriptionText
              }
              required={false}
              updateSpecialDescriptionCode={(value: any, validation: any) => {
                const { vehicleFSCData, validationMessage } = fscVehicleState;
                const { fsc } = fscState;
                vehicleFSCData["specialDescriptionCode"] = value;

                validationMessage["specialDescriptionCodeMsg"] =
                  validation.validationError;
                validationMessage["specialDescriptionCodeInvalid"] =
                  validation.isInvalid;
                validationMessage[
                  "specialDescriptionCodeValid"
                ] = !validation.isInvalid;
                fsc["specialDescriptionCode"] = value;
                updateFSCVehicleState({
                  vehicleFSCData: vehicleFSCData,
                  validationMessage: validationMessage,
                });
                updateFSCState({
                  fsc: fsc,
                });
              }}
              updateSpecialDescriptionText={(value: any, validation: any) => {
                const { vehicleFSCData, validationMessage } = fscVehicleState;
                const { fsc } = fscState;
                vehicleFSCData["specialDescriptionText"] = value;

                validationMessage["specialDescriptionTextMsg"] =
                  validation.validationError;
                validationMessage["specialDescriptionTextInvalid"] =
                  validation.isInvalid;
                validationMessage[
                  "specialDescriptionTextValid"
                ] = !validation.isInvalid;
                fsc["specialDescriptionText"] = value;
                updateFSCVehicleState({
                  specialDescriptionText: value,
                  validationMessage: validationMessage,
                });
                updateFSCState({
                  fsc: fsc,
                });
              }}
            />
          </div>
        </div>
      </>
    );
  }, [fscState, fscVehicleState]);
}
export default FSCVehicle;
