import React, { useContext, useEffect, useMemo } from "react";

import { HealthNoticeOnFormaldehydeEmissions } from "./HealthNoticeOnFormaldehydeEmissions";
import {
  isEmptyCheck,
  validateCommonItemName,
  validateCommonMake,
  validateCommonModel,
  validateSpecialDescriptionCode,
  validateSpecialDescriptionText,
  validateVin,
} from "../validations/propertyFieldValidations";
import { PropertyContext } from "../PropertyContext";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSPopover } from "../../../../ui-kit/components/common/PPMS-popover";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSFscSpecial } from "../../../../ui-kit/components/property/PPMS-fsc-special";
import { PPMSToggleCheckbox } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { isFormSubmitted } from "../../../../service/validation.service";

export interface FSCTrailerProps {
  updateFSCTrailer: any;
  triggerValidation?: boolean;
  aacCode?: string;
  validateFscSection: boolean;
}
function FSCTrailer(props: FSCTrailerProps) {
  const {
    fscTrailerState,
    updateFSCTrailerState,
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

  function handleChange({ id, value, name, required }) {
    const errMsg = validate({ id, value, name, required });
    let validationMsg = setValidationMessage(id, errMsg);

    fscTrailerState.trailerFSCData.bodyStyle =
      id === "bodyStyle" ? value : fscTrailerState.trailerFSCData.bodyStyle;
    fscTrailerState.trailerFSCData.modelYear =
      id === "modelYear" ? value : fscTrailerState.trailerFSCData.modelYear;
    fscTrailerState.trailerFSCData.vin =
      id === "vin" ? value : fscTrailerState.trailerFSCData.vin;
    fscTrailerState.trailerFSCData.length =
      id === "length" ? value : fscTrailerState.trailerFSCData.length;
    fscTrailerState.trailerFSCData.barcode =
      id === "barcode" ? value : fscTrailerState.trailerFSCData.barcode;
    fscTrailerState.trailerFSCData.numberOfAxles =
      id === "numberOfAxles"
        ? value
        : fscTrailerState.trailerFSCData.numberOfAxles;
    fscTrailerState.trailerFSCData.numberOfBedrooms =
      id === "numberOfBedrooms"
        ? value
        : fscTrailerState.trailerFSCData.numberOfBedrooms;
    fscTrailerState.trailerFSCData.numberOfBathrooms =
      id === "numberOfBathrooms"
        ? value
        : fscTrailerState.trailerFSCData.numberOfBathrooms;
    fscTrailerState.trailerFSCData.windZone =
      id === "windZone" ? value : fscTrailerState.trailerFSCData.windZone;
    updateFSCTrailerState({
      validationMessage: validationMsg,
      fscTrailerState,
    });
    fscState.fsc.make = id === "make" ? value : fscState.fsc.make;
    fscState.fsc.model = id === "model" ? value : fscState.fsc.model;
    fscState.fsc.itemName = id === "itemName" ? value : fscState.fsc.itemName;
    let trailerInvalid =
      validationMsg.modelInvalid ||
      validationMsg.makeInvalid ||
      validationMsg.modelYearInvalid ||
      validationMsg.vinInvalid ||
      validationMsg.lengthInvalid ||
      validationMsg.barcodeInvalid ||
      validationMsg.trailerTypeInvalid ||
      validationMsg.numberOfAxlesInvalid ||
      validationMsg.numberOfBathroomsInvalid ||
      validationMsg.itemNameInvalid ||
      validationMsg.bodyStyleInvalid ||
      validationMsg.windZoneInvalid ||
      validationMsg.lengthInvalid;
    updateFSCState({
      trailerInvalid: trailerInvalid,
    });
  }
  function validate({ id, value, name, required }) {
    let validationMsg = undefined;
    let numberFields = [
      "modelYear",
      "vin",
      "length",
      "barcode",
      "numberOfAxles",
      "numberOfBedrooms",
      "numberOfBathrooms",
      "windZone",
    ];
    //let fieldId = id;

    if (numberFields.indexOf(id) !== -1) {
      if (value?.length > 0) {
        if (!/^[\d*]+$/.test(value)) {
          validationMsg = name + " must be numeric only";
        } else {
          if (id === "modelYear") {
            if (value < 1900 || value > new Date().getFullYear()) {
              validationMsg = "Model Year must be between 1900-current year";
            }
          }
        }
      } else if (required && (!value || value === "")) {
        validationMsg = name + " is required";
      }
    }
    if (id === "bodyStyle" && (!value || value === "") && required) {
      validationMsg = "Body Style is required";
    }
    if (name === "Make") {
      validationMsg = validateCommonMake(value, required).validationError;
    } else if (name === "Model") {
      validationMsg = validateCommonModel(value, required).validationError;
    } else if (name === "itemName") {
      validationMsg = validateCommonItemName(value).validationError;
    } else if (id === "special") {
      validationMsg = validateSpecialDescriptionCode(value).validationError;
    } else if (id === "vin") {
      validationMsg = validateVin(value);
    }
    return validationMsg;
  }

  function handleToggleChange(items: any) {
    for (let i = 0; i < items.length; i++) {
      let item = items[i];

      if (item.id === "isSlideOut") {
        fscTrailerState.trailerFSCData.isSlideOut = item.isSelected;
      }
      if (item.id === "isAwning") {
        fscTrailerState.trailerFSCData.isAwning = item.isSelected;
      }
      if (item.id === "isNeitherTrailerType") {
        fscTrailerState.trailerFSCData.isNeitherTrailerType = item.isSelected;
      }
    }

    let errMsg = undefined;
    if (
      (fscTrailerState.trailerFSCData.isSlideOut ||
        fscTrailerState.trailerFSCData.isAwning) &&
      fscTrailerState.trailerFSCData.isNeitherTrailerType
    ) {
      errMsg =
        "Trailer type must be selected: Slide out and/or Awning or Neither";
    }

    if (
      !fscTrailerState.trailerFSCData.isSlideOut &&
      !fscTrailerState.trailerFSCData.isAwning &&
      !fscTrailerState.trailerFSCData.isNeitherTrailerType
    ) {
      errMsg = "Trailer type is required";
    }
    let validationMsg = setValidationMessage("trailerType", errMsg);
    updateFSCTrailerState({
      validationMessage: validationMsg,
      fscTrailerState,
    });
    updateFSCState({
      trailerInvalid: !isEmptyCheck(errMsg) ? true : false,
    });
  }

  function setValidationMessage(id: any, errMsg: string | false) {
    const { validationMessage } = fscTrailerState;
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
  function validateForm() {
    let itemName = {
      id: "itemName",
      value: fscState.fsc.itemName,
      name: "itemName",
      required: true,
    };
    handleChange(itemName);
    let bodyStyle = {
      id: "bodyStyle",
      value: fscTrailerState.trailerFSCData.bodyStyle,
      name: "",
      required: true,
    };
    handleChange(bodyStyle);
    let make = {
      id: "make",
      value: fscState.fsc.make,
      name: "Make",
      required: true,
    };
    handleChange(make);
    let model = {
      id: "model",
      value: fscState.fsc.model,
      name: "Model",
      required: true,
    };
    handleChange(model);
    let modelYear = {
      id: "modelYear",
      value: fscTrailerState.trailerFSCData.modelYear,
      name: "Model Year",
      required: true,
    };
    handleChange(modelYear);
    let vin = {
      id: "vin",
      value: fscTrailerState.trailerFSCData.vin,
      name: "Vehicle Identification Number",
      required: true,
    };
    handleChange(vin);
    let length = {
      id: "length",
      value: fscTrailerState.trailerFSCData.length,
      name: "Length (feet)",
      required: true,
    };
    handleChange(length);
    let barcode = {
      id: "barcode",
      value: fscTrailerState.trailerFSCData.barcode,
      name: "Barcode",
      required: true,
    };
    handleChange(barcode);
    if (
      fscTrailerState.trailerFSCData.bodyStyle === "PM" ||
      fscTrailerState.trailerFSCData.bodyStyle === "MH"
    ) {
      let numberOfAxles = {
        id: "numberOfAxles",
        value: fscTrailerState.trailerFSCData.numberOfAxles,
        name: "Number of Axles",
        required:
          fscTrailerState.trailerFSCData.bodyStyle === "PM" ||
          fscTrailerState.trailerFSCData.bodyStyle === "MH",
      };

      handleChange(numberOfAxles);
      let numberOfBedrooms = {
        id: "numberOfBedrooms",
        value: fscTrailerState.trailerFSCData.numberOfBedrooms,
        name: "Number of Bedrooms",
        required:
          fscTrailerState.trailerFSCData.bodyStyle === "PM" ||
          fscTrailerState.trailerFSCData.bodyStyle === "MH",
      };
      handleChange(numberOfBedrooms);
      let numberOfBathrooms = {
        id: "numberOfBathrooms",
        value: fscTrailerState.trailerFSCData.numberOfBathrooms,
        name: "Number of Bathrooms",
        required:
          fscTrailerState.trailerFSCData.bodyStyle === "PM" ||
          fscTrailerState.trailerFSCData.bodyStyle === "MH",
      };
      handleChange(numberOfBathrooms);
      let windZone = {
        id: "windZone",
        value: fscTrailerState.trailerFSCData.windZone,
        name: "Wind zone",
        required:
          fscTrailerState.trailerFSCData.bodyStyle === "PM" ||
          fscTrailerState.trailerFSCData.bodyStyle === "MH",
      };
      handleChange(windZone);
    }
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
              value={fscState.fsc.itemName}
              onBlur={(event) => handleChange(event.target)}
              onChange={(event) => {
                fscState.fsc.itemName = event.target.value;
                updateFSCTrailerState({});
              }}
              validationMessage={fscTrailerState.validationMessage.itemNameMsg}
              maxLength={69}
              minLength={4}
              isInvalid={fscTrailerState.validationMessage.itemNameInvalid}
              isValid={fscTrailerState.validationMessage.itemNameValid}
            />
          </div>

          <div className="tablet:grid-col-6">
            <PPMSSelect
              placeholderValue={"Select body style"}
              selectName={"bodyStyle"}
              values={fscTrailerState.trailerBodyStyleOptions}
              onChange={(event) => handleChange(event.target)}
              validationMessage={fscTrailerState.validationMessage.bodyStyleMsg}
              isInvalid={fscTrailerState.validationMessage.bodyStyleInvalid}
              isValid={fscTrailerState.validationMessage.bodyStyleValid}
              identifierKey={"id"}
              identifierValue={"value"}
              selectedValue={fscTrailerState.trailerFSCData.bodyStyle}
              label={"Body Style"}
              isRequired={true}
            />
          </div>
        </div>
        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-4">
            <PPMSInput
              inputType={"text"}
              name="Make"
              id={"make"}
              message={""}
              minLength={1}
              maxLength={20}
              validationMessage={fscTrailerState.validationMessage.makeMsg}
              isInvalid={fscTrailerState.validationMessage.makeInvalid}
              isValid={fscTrailerState.validationMessage.makeValid}
              isRequired={true}
              onChange={(event) => {
                fscState.fsc.make = event.target.value;
                updateFSCTrailerState({});
              }}
              onBlur={(event) => handleChange(event.target)}
              isDisabled={false}
              label={"Make"}
              value={fscState.fsc.make}
            />
          </div>

          <div className="tablet:grid-col-4">
            <PPMSInput
              inputType={"text"}
              name="Model"
              id={"model"}
              message={""}
              minLength={1}
              maxLength={20}
              validationMessage={fscTrailerState.validationMessage.modelMsg}
              isInvalid={fscTrailerState.validationMessage.modelInvalid}
              isValid={fscTrailerState.validationMessage.modelValid}
              isRequired={true}
              onChange={(event) => {
                fscState.fsc.model = event.target.value;
                updateFSCTrailerState({});
              }}
              onBlur={(event) => handleChange(event.target)}
              isDisabled={false}
              label={"Model"}
              value={fscState.fsc.model}
            />
          </div>

          <div className="tablet:grid-col-4">
            <PPMSInput
              inputType={"text"}
              name="Model Year"
              id={"modelYear"}
              message={""}
              minLength={4}
              maxLength={4}
              validationMessage={fscTrailerState.validationMessage.modelYearMsg}
              isInvalid={fscTrailerState.validationMessage.modelYearInvalid}
              isValid={fscTrailerState.validationMessage.modelYearValid}
              isRequired={true}
              onBlur={(event) => handleChange(event.target)}
              onChange={(event) => {
                fscTrailerState.trailerFSCData.modelYear = event.target.value;
                updateFSCTrailerState({ fscTrailerState });
              }}
              isDisabled={false}
              label={"Model Year"}
              value={fscTrailerState.trailerFSCData.modelYear}
            />
          </div>
        </div>
        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-6">
            <PPMSInput
              name="Vehicle Identification Number"
              id={"vin"}
              message={""}
              maxLength={20}
              minLength={1}
              validationMessage={fscTrailerState.validationMessage.vinMsg}
              isInvalid={fscTrailerState.validationMessage.vinInvalid}
              isValid={fscTrailerState.validationMessage.vinValid}
              isRequired={true}
              onBlur={(event) => handleChange(event.target)}
              onChange={(event) => {
                fscTrailerState.trailerFSCData.vin = event.target.value;
                updateFSCTrailerState({ fscTrailerState });
              }}
              label={"Vehicle Identification Number"}
              value={fscTrailerState.trailerFSCData.vin}
              inputType={"text"}
              isDisabled={false}
            />
          </div>
        </div>
        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-4">
            <PPMSInput
              id={"length"}
              name={"Length (feet)"}
              label={"Length (feet)"}
              onBlur={(event) => handleChange(event.target)}
              onChange={(event) => {
                fscTrailerState.trailerFSCData.length = event.target.value;
                updateFSCTrailerState({ fscTrailerState });
              }}
              isRequired={true}
              isInvalid={fscTrailerState.validationMessage.lengthInvalid}
              isValid={fscTrailerState.validationMessage.lengthValid}
              validationMessage={fscTrailerState.validationMessage.lengthMsg}
              isDisabled={false}
              inputType={"text"}
              value={fscTrailerState.trailerFSCData.length}
              minLength={1}
              maxLength={2}
            />
          </div>

          <div className="tablet:grid-col-4">
            <PPMSInput
              id={"barcode"}
              name={"Barcode"}
              label={"Barcode"}
              onBlur={(event) => handleChange(event.target)}
              onChange={(event) => {
                fscTrailerState.trailerFSCData.barcode = event.target.value;
                updateFSCTrailerState({ fscTrailerState });
              }}
              isRequired={true}
              isInvalid={fscTrailerState.validationMessage.barcodeInvalid}
              isValid={fscTrailerState.validationMessage.barcodeValid}
              validationMessage={fscTrailerState.validationMessage.barcodeMsg}
              isDisabled={false}
              inputType={"text"}
              value={fscTrailerState.trailerFSCData.barcode}
              minLength={1}
              maxLength={15}
            />
          </div>
        </div>
        {fscTrailerState.trailerFSCData.bodyStyle === "TT" ? (
          <>
            <div className="grid-row grid-gap-4">
              <div className="tablet:grid-col-6">
                <PPMSToggleCheckbox
                  isInline={false}
                  name={"trailerType"}
                  isDisabled={false}
                  options={fscTrailerState.trailerTypeStyleOptions}
                  validationMessage={
                    fscTrailerState.validationMessage.trailerTypeMsg
                  }
                  onChange={handleToggleChange}
                  className=""
                  id={"trailerType"}
                  isRequired={true}
                  label={"Trailer Type"}
                  isInvalid={
                    fscTrailerState.validationMessage.trailerTypeInvalid
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <div />
        )}
        {fscTrailerState.trailerFSCData.bodyStyle === "PM" ||
        fscTrailerState.trailerFSCData.bodyStyle === "MH" ? (
          <>
            <div className="grid-row grid-gap-4">
              <div className="tablet:grid-col-6">
                <PPMSInput
                  id={"numberOfAxles"}
                  name={"Number of Axles"}
                  label={"Number of Axles"}
                  onBlur={(event) => handleChange(event.target)}
                  onChange={(event) => {
                    fscTrailerState.trailerFSCData.numberOfAxles =
                      event.target.value;
                    updateFSCTrailerState({ fscTrailerState });
                  }}
                  isRequired={true}
                  isInvalid={
                    fscTrailerState.validationMessage.numberOfAxlesInvalid
                  }
                  isValid={fscTrailerState.validationMessage.numberOfAxlesValid}
                  validationMessage={
                    fscTrailerState.validationMessage.numberOfAxlesMsg
                  }
                  isDisabled={false}
                  inputType={"text"}
                  value={fscTrailerState.trailerFSCData.numberOfAxles}
                  minLength={1}
                  maxLength={1}
                />
              </div>

              <div className="tablet:grid-col-6">
                <PPMSInput
                  id={"numberOfBedrooms"}
                  name={"Number of Bedrooms"}
                  label={"Number of Bedrooms"}
                  onBlur={(event) => handleChange(event.target)}
                  onChange={(event) => {
                    fscTrailerState.trailerFSCData.numberOfBedrooms =
                      event.target.value;
                    updateFSCTrailerState({ fscTrailerState });
                  }}
                  isRequired={true}
                  isInvalid={
                    fscTrailerState.validationMessage.numberOfBedroomsInvalid
                  }
                  isValid={
                    fscTrailerState.validationMessage.numberOfBedroomsValid
                  }
                  validationMessage={
                    fscTrailerState.validationMessage.numberOfBedroomsMsg
                  }
                  isDisabled={false}
                  inputType={"text"}
                  value={fscTrailerState.trailerFSCData.numberOfBedrooms}
                  minLength={1}
                  maxLength={1}
                />
              </div>

              <div className="tablet:grid-col-6">
                <PPMSInput
                  id={"numberOfBathrooms"}
                  name={"Number of Bathrooms"}
                  label={"Number of Bathrooms"}
                  onBlur={(event) => handleChange(event.target)}
                  onChange={(event) => {
                    fscTrailerState.trailerFSCData.numberOfBathrooms =
                      event.target.value;
                    updateFSCTrailerState({ fscTrailerState });
                  }}
                  isRequired={true}
                  isInvalid={
                    fscTrailerState.validationMessage.numberOfBathroomsInvalid
                  }
                  isValid={
                    fscTrailerState.validationMessage.numberOfBathroomsValid
                  }
                  validationMessage={
                    fscTrailerState.validationMessage.numberOfBathroomsMsg
                  }
                  isDisabled={false}
                  inputType={"text"}
                  value={fscTrailerState.trailerFSCData.numberOfBathrooms}
                  minLength={1}
                  maxLength={1}
                />

                <div className="tablet:grid-col-6"></div>
                <PPMSInput
                  id={"windZone"}
                  name={"Wind zone"}
                  label={"Wind Zone"}
                  onBlur={(event) => handleChange(event.target)}
                  onChange={(event) => {
                    fscTrailerState.trailerFSCData.windZone =
                      event.target.value;
                    updateFSCTrailerState({ fscTrailerState });
                  }}
                  isRequired={true}
                  isInvalid={fscTrailerState.validationMessage.windZoneInvalid}
                  isValid={fscTrailerState.validationMessage.windZoneValid}
                  validationMessage={
                    fscTrailerState.validationMessage.windZoneMsg
                  }
                  isDisabled={false}
                  inputType={"text"}
                  value={fscTrailerState.trailerFSCData.windZone}
                  minLength={1}
                  maxLength={1}
                />
              </div>
            </div>
          </>
        ) : (
          <div />
        )}
        <div className={"grid-row grid-gap-4"}>
          <PPMSFscSpecial
            id={"special"}
            specialDescriptionCode={fscState.fsc.specialDescriptionCode}
            specialDescriptionText={fscState.fsc.specialDescriptionText}
            required={false}
            updateSpecialDescriptionCode={(value: any, validation: any) => {
              const { validationMessage } = fscTrailerState;
              const { fsc } = fscState;
              fsc["specialDescriptionCode"] = value;

              validationMessage["specialDescriptionCodeMsg"] =
                validation.specialDescriptionCodeMsg;
              validationMessage["specialDescriptionCodeInvalid"] =
                validation.specialDescriptionCodeInvalid;
              validationMessage[
                "specialDescriptionCodeValid"
              ] = !validation.specialDescriptionCodeValid;
              fsc["specialDescriptionCode"] = value;

              updateFSCTrailerState({
                fscTrailerState,
              });
              updateFSCState({
                fscState,
              });
            }}
            updateSpecialDescriptionText={(value: any, validation: any) => {
              const { validationMessage } = fscTrailerState;
              const { fsc } = fscState;
              fsc["specialDescriptionText"] = value;

              validationMessage["specialDescriptionTextMsg"] =
                validation.specialDescriptionTextMsg;
              validationMessage["specialDescriptionTextInvalid"] =
                validation.specialDescriptionTextInvalid;
              validationMessage[
                "specialDescriptionTextValid"
              ] = !validation.specialDescriptionTextValid;
              fsc["specialDescriptionText"] = value;

              updateFSCTrailerState({
                fscTrailerState,
              });
              updateFSCState({
                fscState,
              });
            }}
          />
        </div>
 
      </>
    );
  }, [fscTrailerState]);
}
export default FSCTrailer;
