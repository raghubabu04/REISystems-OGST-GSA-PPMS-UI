import React, { useContext, useEffect, useMemo } from "react";
import {
  validateCommonItemName,
  validateCommonMake,
  validateCommonModel,
} from "../validations/propertyFieldValidations";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSFscSpecial } from "../../../../ui-kit/components/property/PPMS-fsc-special";
import { PropertyContext } from "../PropertyContext";
import {
  PPMSToggleCheckbox,
  PPMSToggleRadio,
} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { isFormSubmitted } from "../../../../service/validation.service";
import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";
import { UserUtils } from "../../../../utils/UserUtils";
import {checkSelectedValueOptions, setOptionRequiredField} from "./FSC-aircraft";
import {
  areMajorComponentsMissingOptions, asbestosTypes, doesVesselHaveAsbestosOptions,
  doesVesselHavePCBOptions, isSurveyAvailableOptions, isVessel50FeetOrOver, isVesselInspectedOptions,
  isVesselSeaworthyOptions, missingOptions, valueAddedServicesOptions
} from "../constants/Constants";

export interface FSCVesselProps {
  updateFSCVessel: any;
  triggerValidation?: boolean;
  fscState?: any;
  validateFscSection: boolean
}

function FSCVessel(props: FSCVesselProps) {
  const {
    fscVesselState,
    updateFSCVesselState,
    fscState,
    updateFSCState,
    additionalInfoState,
    updateAdditionalInfoState,
    agencyInfoState,
    propertyInfoState,
    propertyReportState,
    icnState,
    updateERDAndSRD,
  } = useContext(PropertyContext);
  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }else if(props.validateFscSection){
        validateVesselForm();
        updateFSCState({
          validateFscSection: false,
        });
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [fscState, fscVesselState]);
  function handleVesselNameChange({ value }) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    if (value?.trim() === "" || !value) {
      validationMsg.nameOfVesselInvalid = true;
      updateFSCVesselState({
        nameOfVesselMsg: "Vessel Name is Required.",
        nameOfVesselValid: false,
      });
    } else {
      validationMsg.nameOfVesselInvalid = false;
      updateFSCVesselState({
        nameOfVesselMsg: "",
        nameOfVesselValid: true,
      });
    }
    vesselFSCData.nameOfVessel = value;
    updateFSCVesselState({
      vesselFSCData,
      validationMsg
    });
    setVesselValidationMessage();
  }
  function handleChange({ name, required, value, id }) {
    const { fsc} = fscState;
    let errMsgStr: string = "";
    if (name === "make") {
      errMsgStr = validateCommonMake(value, required).validationError;
      updateFSCState({
        makeInvalid: !isEmptyCheck(errMsgStr),
      });
    } else if (name === "model") {
      errMsgStr = validateCommonModel(value, required).validationError;
      updateFSCState({
        modelInvalid: !isEmptyCheck(errMsgStr),
      });
    }
    updateValidationMessage(id, errMsgStr);
  let makeData = name === "make" ? value : fscState.fsc.make;
  let modelData  = name === "model" ? value : fscState.fsc.model;
    fsc.make  = makeData;
    fsc.model = modelData;
    updateFSCState({
      make: makeData,
      model: modelData,
      fsc:fsc,
    })
  }
  function updateValidationMessage(id: any, errMsg: string) {
    let validationMessage = fscVesselState;
    if (errMsg) {
      //eg : e.currentTarget.id = fuelType ,  set validation message and validation flag
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

  function handleHullIdNumberChange({ value }) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    if (value?.trim() === "" || !value) {
      validationMsg.hullIdInvalid = true;
      updateFSCVesselState({
        hullIdMsg: "Vessel Hull Id Number is Required.",
        hullIdValid: false,
        //hullIdInvalid: true,
      });
    } else if (value?.length < 12 || value?.length > 14) {
      validationMsg.hullIdInvalid = true;
      updateFSCVesselState({
        hullIdMsg:
          "12-14 character unique serial number used to identify the vessel/boat.",
        hullIdValid: false,
        //hullIdInvalid: true,
      });
    } else {
      validationMsg.hullIdInvalid = false;
      updateFSCVesselState({
        hullIdMsg: "",
        hullIdValid: true,
        //hullIdInvalid: false,
      });
    }
    vesselFSCData.hullIdNumber = value;
    updateFSCVesselState({
      vesselFSCData,
      validationMsg,
    });
    setVesselValidationMessage();
  }

  function handleLengthChange({ value }) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    if (value?.trim() === "" || !value) {
      validationMsg.lengthInvalid = true;
      updateFSCVesselState({ lengthMsg: "Vessel Length is Required." });
      updateFSCVesselState({ lengthValid: false });
    } else if (isNaN(value)) {
      updateFSCVesselState({
        lengthMsg: "Vessel Length should be numeric and maximum of 5 digits.",
      });
      validationMsg.lengthInvalid = true;
      updateFSCVesselState({ lengthValid: false });
    } else {
      updateFSCVesselState({ lengthMsg: "" });
      updateFSCVesselState({ lengthValid: true });
      validationMsg.lengthInvalid = false;
    }
    vesselFSCData.length = value;
    updateFSCVesselState({ vesselFSCData,validationMsg });
    setVesselValidationMessage();
  }
  function handleBeamChange({ value }) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    if (value?.trim() === "" || !value) {
      validationMsg.beamInvalid = true;
      updateFSCVesselState({ beamMsg: "Vessel Beam is Required." });
      updateFSCVesselState({ beamValid: false });
    } else if (isNaN(value)) {
      updateFSCVesselState({
        beamMsg:
          "Beam-width of the vessel should be numeric and maximum of 5 digits.",
      });
      validationMsg.beamInvalid = true;
      updateFSCVesselState({ beamValid: false });
    } else {
      updateFSCVesselState({ beamMsg: "" });
      updateFSCVesselState({ beamValid: true });
      validationMsg.beamInvalid = false;
    }
    vesselFSCData.beam = value;
    updateFSCVesselState({ vesselFSCData,validationMsg });
    setVesselValidationMessage()
  }
  function handleDraftChange({ value }) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    if (value?.trim() === "" || !value) {
      updateFSCVesselState({ draftMsg: "Vessel Draft is Required." });
      validationMsg.draftInvalid = true;
      updateFSCVesselState({ draftValid: false,
      }
        );
    } else if (isNaN(value)) {
      updateFSCVesselState({
        draftMsg: "Vessel Draft should be numeric and maximum 5 digits.",
      });
      validationMsg.draftInvalid = true;
      updateFSCVesselState({ draftValid: false,
      });
    } else {
      updateFSCVesselState({ draftMsg: "" });
      validationMsg.draftInvalid = false;
      updateFSCVesselState({ draftValid: true,
      });
    }
    vesselFSCData.draft = value;
    updateFSCVesselState({ vesselFSCData,validationMsg });
    setVesselValidationMessage()
  }

  function handleTypesOfEnginesChange({ value }) {
    const { vesselFSCData,validationMsg} = fscVesselState;
    if (value?.trim() === "" || !value) {
      updateFSCVesselState({
        typesOfEngineMsg:
          "Engine Type must be entered which is a maximum of 20 characters long.",
      });
      validationMsg.typesOfEngineInvalid = true;
      updateFSCVesselState({
        typesOfEngineValid: false,
      });
    } else if (!/^[a-zA-Z0-9 ]+$/.test(value) && !isEmptyCheck(value)) {
      updateFSCVesselState({
        typesOfEngineMsg: "Engine Type cannot have special characters.",
      });
      validationMsg.typesOfEngineInvalid = true;
      updateFSCVesselState({
        typesOfEngineValid: false,
      });
    } else {
      updateFSCVesselState({ typesOfEngineMsg: "" });
      validationMsg.typesOfEngineInvalid = false;
      updateFSCVesselState({
        typesOfEngineValid: true,
      });
    }
    vesselFSCData.typesOfEngines = value;
    updateFSCVesselState({
      validationMsg,
      vesselFSCData,
    });
    setVesselValidationMessage();
  }

  function handleItemNameChange({ value }) {
    const { fsc} = fscState;
    let validation = validateCommonItemName(value);
    if (validation.isInvalid) {
      updateFSCVesselState({
        itemNameMsg: validation.validationError,
      });
      updateFSCVesselState({
        itemNameValid: false,
        itemNameInvalid: true
      });
      updateFSCState({
        itemName: value,
        itemNameValid: false,
        itemNameInvalid: true,
        itemNameIsRequired: true,
      });
    } else {
      updateFSCVesselState({ itemNameMsg: "" });
      updateFSCVesselState({ itemNameValid: true,
        itemNameInvalid: false });
      fsc.itemName = value;
      updateFSCState({
        fsc,
        itemNameValid: true,
        itemNameInvalid: false,
        itemNameIsRequired: false,
      });
    }
  }

  function handleHoursOnEngineChange({ value }) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    if (value?.trim() === "" || !value) {
      updateFSCVesselState({
        hoursOnEngineMsg:
          "Hours on Engine must be entered which should be maximum of 20 digits/characters long.",
      });
      validationMsg.hoursOnEngineInvalid = true;
      updateFSCVesselState({
        hoursOnEngineValid: false,
      });
    } else if (!/^[a-zA-Z0-9 ]+$/.test(value) && !isEmptyCheck(value)) {
      updateFSCVesselState({

      });
      validationMsg.hoursOnEngineInvalid = true;
      updateFSCVesselState({
        hoursOnEngineMsg: "Hours on Engine cannot have special characters.",
        hoursOnEngineValid: false,
      });
    } else {
      updateFSCVesselState({ hoursOnEngineMsg: "" });
      validationMsg.hoursOnEngineInvalid = false;
      updateFSCVesselState({
        hoursOnEngineMsg: "",
        hoursOnEngineValid: true,
      });
    }
    vesselFSCData.hoursOnEngine = value;
    updateFSCVesselState({
      vesselFSCData,
      });
    setVesselValidationMessage();
  }

  function handleComponentMissing(values) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    let selectedValue = values.find((item) => item.isSelected === true);
    if (selectedValue) {
      if (selectedValue.value === "Yes") {
        vesselFSCData.areMajorComponentsMissing = true;
        validationMsg.areMajorComponentsMissingInvalid = false;
        validationMsg.selectMissingInvalid = true;
        updateFSCVesselState({ componentsMissingDisable: false,
        });
      } else if (selectedValue.value === "No") {
        vesselFSCData.areMajorComponentsMissing = false;
        validationMsg.areMajorComponentsMissingInvalid = false;
        updateFSCVesselState({ componentsMissingDisable: true,
        });
        vesselFSCData.areMajorComponentsMissing = false;
        vesselFSCData.isEngineMissing = null;
        vesselFSCData.isElectronicMissing = null;
        vesselFSCData.isOtherMissing = null;
      }

      updateFSCVesselState({
        vesselFSCData,validationMsg
      });
    }
    setVesselValidationMessage();
  }

  function handleVesselHaveAsbestosChange(values) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    let selectedValue = values.find((value) => value.isSelected === true);
    if (selectedValue) {
      if (selectedValue.value === "Yes") {
        vesselFSCData.vesselHasAsbestos = true;
        validationMsg.asbestosTypeMissingInvalid = true;
        validationMsg.doesVesselHaveAsbestosInvalid = false;
        updateFSCVesselState({
          asbestosTypeDisable: false,
          asbestosTypeMissingInvalid:true,
        });
      } else if (selectedValue.value === "No") {
        updateFSCVesselState({
          asbestosTypeDisable: true,
          asbestosTypeMissingInvalid: false,
        });
        validationMsg.asbestosTypeMissingInvalid = false;
        validationMsg.doesVesselHaveAsbestosInvalid = false;
        vesselFSCData.vesselHasAsbestos = false;
        vesselFSCData.friable = null;

      }
      updateFSCVesselState({
        vesselFSCData, validationMsg
      });
    }
    setVesselValidationMessage();
  }
  function handleVesselSeaWorthyChange(values) {
    const { vesselFSCData,validationMsg} = fscVesselState;
    let selectedValue = values.find((value) => value.isSelected === true);
    if (selectedValue) {
      if (selectedValue.value === "Yes") {
        vesselFSCData.isVesselSeaworthy = true;
      } else if (selectedValue.value === "No") {
        vesselFSCData.isVesselSeaworthy = false;
      }
      validationMsg.isVesselSeaworthyInvalid = false;
      updateFSCVesselState({
        validationMsg,
      })
    }
    updateFSCVesselState({ vesselFSCData });
    setVesselValidationMessage();
  }
  function handleSelectMissing(values) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    if (values.length > 0) {
      vesselFSCData.isEngineMissing = values.find(
        (value) => value.value === "Engine Missing"
      ).isSelected;
      vesselFSCData.isElectronicMissing = values.find(
        (value) => value.value === "Electronic Missing"
      ).isSelected;
      vesselFSCData.isOtherMissing = values.find(
        (value) => value.value === "Other Missing"
      ).isSelected;
      validationMsg.areMajorComponentsMissingInvalid=false;
      validationMsg.selectMissingInvalid = false;
      updateFSCVesselState({
        validationMsg,
        vesselFSCData,
      });
    }
    setVesselValidationMessage();
  }
  function handleVesselInspected(values) {
    const { vesselFSCData,validationMsg} = fscVesselState;
    let selectedValue = values.find((value) => value.isSelected === true);
    if (selectedValue) {
      if (selectedValue.value === "Yes") {
        vesselFSCData.vesselInspectedByCoastGuard = true;
      } else if (selectedValue.value === "No") {
        vesselFSCData.vesselInspectedByCoastGuard = false;
      }
      validationMsg.isVesselInspectedInvalid = false;
    }
    updateFSCVesselState({ vesselFSCData,validationMsg });
    setVesselValidationMessage();
  }
  function handleSurveyAvailable(values) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    let selectedValue = values.find((value) => value.isSelected === true);
    if (selectedValue) {
      if (selectedValue.value === "Yes") {
        vesselFSCData.marineSurveyAvailable = true;
      } else if (selectedValue.value === "No") {
        vesselFSCData.marineSurveyAvailable = false;
      }
      validationMsg.isSurveyAvailableInvalid = false;
    }
    updateFSCVesselState({ vesselFSCData,validationMsg });
    setVesselValidationMessage();
  }
  function handleAsbestosChange(values) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    let selectedValue = values.find((value) => value.isSelected === true);
    if (selectedValue) {
      vesselFSCData.friable = selectedValue.value === "Friable";
      validationMsg.asbestosTypeMissingInvalid=false;
      updateFSCVesselState({
        validationMsg,
        vesselFSCData,
      });
    }
    setVesselValidationMessage();
  }
  function handlePCSCheck(values) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    let selectedValue = values.find((value) => value.isSelected === true);
    if (selectedValue) {
      if (selectedValue.value === "Yes") {
        vesselFSCData.vesselHasPCB = true;
      } else if (selectedValue.value === "No") {
        vesselFSCData.vesselHasPCB = false;
      }
      validationMsg.doesVesselHavePCBInvalid = false;
    }
    updateFSCVesselState({ vesselFSCData, validationMsg });
    setVesselValidationMessage();
  }

  function handleIsVessel50FeetOrOver(values: any) {
    const { vesselFSCData, validationMsg} = fscVesselState;
    let aacValue = icnState.aacCode;
    let agencyBureau = agencyInfoState.agencyBureau;
    let exchangeSaleFlag = propertyInfoState.isExchangeSales;
    let disposalCode = additionalInfoState.condition;
    let selectedValue = values.find((item) => item.isSelected === true);
    if (selectedValue) {
      if (selectedValue.value === "Yes") {
        vesselFSCData.isVessel50FeetOrOver = true;
        if (fscState.data.fscCategory === "vessel")
          updateAdditionalInfoState({
            manufactureIsRequired: true,
            dateOfManufactureIsRequired: true,
            manufacturerValueMsg: "Manufacturer is Required.",
            dateOfManufactureMsg: "Date of Manufacture is Required.",
          });
        else
          updateAdditionalInfoState({
            manufactureIsRequired: false,
            dateOfManufactureIsRequired: false,
          });
        updateFSCState({ validateFscSection: true });
      } else if (selectedValue.value === "No") {
        vesselFSCData.isVessel50FeetOrOver = false;
        updateAdditionalInfoState({
          manufactureIsRequired: false,
          dateOfManufactureIsRequired: false,
        });
        updateFSCState({ validateFscSection: true });
      }
      updateFSCVesselState({ vesselFSCData });
      if (!UserUtils.isSalesUser()) {
        updateERDAndSRD(
          exchangeSaleFlag,
          aacValue,
          agencyBureau,
          fscVesselState.vesselFSCData.isVessel50FeetOrOver,
          propertyInfoState.agencyControlNumber,
          disposalCode,
          null,
          fscState?.fsc?.fscCode,
          additionalInfoState.screeningDays,
          agencyInfoState.isInternalAgency,
          propertyReportState.isSubmitted,
          propertyReportState.submittedDate,
          true
        );
      }
    }
    setVesselValidationMessage();
  }

  function handleSpecialDescriptionTextChange(value, validation) {
    fscState.fsc.specialDescriptionText = value;
    updateFSCVesselState({
      validationMsg: validation,
    });
  }

  function handleSpecialDescriptionCodeChange(value, validation) {
    fscState.fsc.specialDescriptionCode = value;
    updateFSCVesselState({
      validationMsg: validation,
    });
  }
  function validateForm() {
    handleItemNameChange({ value: fscState.fsc.itemName });
    handleVesselNameChange({
      value: fscVesselState.vesselFSCData.nameOfVessel,
    });
    handleChange({
      name: "make",
      required: fscVesselState.vesselFSCData.isVessel50FeetOrOver,
      value: fscState.fsc.make,
      id: "make",
    });
    handleChange({
      name: "model",
      required: fscVesselState.vesselFSCData.isVessel50FeetOrOver,
      value: fscState.fsc.model,
      id: "model",
    });
    handleHullIdNumberChange({
      value: fscVesselState.vesselFSCData.hullIdNumber,
    });
    handleLengthChange({ value: fscVesselState.vesselFSCData.length });
    handleBeamChange({ value: fscVesselState.vesselFSCData.beam });
    handleDraftChange({ value: fscVesselState.vesselFSCData.draft });
    handleTypesOfEnginesChange({
      value: fscVesselState.vesselFSCData.typesOfEngines,
    });
    handleHoursOnEngineChange({
      value: fscVesselState.vesselFSCData.hoursOnEngine,
    });
    setVesselValidationMessage();
  }

  function validateVesselForm() {
    handleItemNameChange({ value: fscState.fsc.itemName });
 if(fscVesselState.vesselFSCData.isVessel50FeetOrOver){
    handleVesselNameChange({
      value: fscVesselState.vesselFSCData.nameOfVessel,
    });
    handleChange({
      name: "make",
      required: fscVesselState.vesselFSCData.isVessel50FeetOrOver,
      value: fscState.fsc.make,
      id: "make",
    });
    handleChange({
      name: "model",
      required: fscVesselState.vesselFSCData.isVessel50FeetOrOver,
      value: fscState.fsc.model,
      id: "model",
    });
    handleHullIdNumberChange({
      value: fscVesselState.vesselFSCData.hullIdNumber,
    });
    handleLengthChange({ value: fscVesselState.vesselFSCData.length });
    handleBeamChange({ value: fscVesselState.vesselFSCData.beam });
    handleDraftChange({ value: fscVesselState.vesselFSCData.draft });
    handleTypesOfEnginesChange({
      value: fscVesselState.vesselFSCData.typesOfEngines,
    });
    handleHoursOnEngineChange({
      value: fscVesselState.vesselFSCData.hoursOnEngine,
    });

    updateFSCVesselState({
      isVesselSeaworthyOptions: setOptionRequiredField(
        fscVesselState.isVesselSeaworthyOptions,
      ),
      areMajorComponentsMissingOptions: setOptionRequiredField(
        fscVesselState.areMajorComponentsMissingOptions,
      ),
      doesVesselHavePCBOptions: setOptionRequiredField(
        fscVesselState.doesVesselHavePCBOptions,
      ),
      doesVesselHaveAsbestosOptions: setOptionRequiredField(
        fscVesselState.doesVesselHaveAsbestosOptions,
      ),
      isVesselInspectedOptions: setOptionRequiredField(
        fscVesselState.isVesselInspectedOptions,
      ),
      isSurveyAvailableOptions: setOptionRequiredField(
        fscVesselState.isSurveyAvailableOptions,
      )
    });
   console.log("options first ", fscVesselState.isVesselSeaworthyOptions);
    if(checkSelectedValueOptions(fscVesselState.isVesselSeaworthyOptions)){
      let vesselFSCData = fscVesselState.vesselFSCData;
      let validationMsg = fscVesselState.validationMsg;
      validationMsg.isVesselSeaworthyInvalid = true;
      updateFSCVesselState({
        vesselFSCData,
        validationMsg,
      });
    }
    if(checkSelectedValueOptions(fscVesselState.areMajorComponentsMissingOptions)){
      let vesselFSCData = fscVesselState.vesselFSCData;
      let validationMsg = fscVesselState.validationMsg;
      validationMsg.areMajorComponentsMissingInvalid = true;
      updateFSCVesselState({
        validationMsg,
        vesselFSCData,
      });
    }
    if(checkSelectedValueOptions(fscVesselState.doesVesselHavePCBOptions)){
      let vesselFSCData = fscVesselState.vesselFSCData;
      let validationMsg = fscVesselState.validationMsg;
      validationMsg.doesVesselHavePCBInvalid = true;
      updateFSCVesselState({
        validationMsg,
        vesselFSCData,
      });
    }
    if(checkSelectedValueOptions(fscVesselState.doesVesselHaveAsbestosOptions)){
      let vesselFSCData = fscVesselState.vesselFSCData;
      let validationMsg = fscVesselState.validationMsg;
      validationMsg.doesVesselHaveAsbestosInvalid = true;
      updateFSCVesselState({
        validationMsg,
        vesselFSCData,
      });
    }
    if(checkSelectedValueOptions(fscVesselState.isVesselInspectedOptions)){
      let vesselFSCData = fscVesselState.vesselFSCData;
      let validationMsg = fscVesselState.validationMsg;
      validationMsg.isVesselInspectedInvalid = true;
      updateFSCVesselState({
        validationMsg,
        vesselFSCData,
      });
    }
    if(checkSelectedValueOptions(fscVesselState.isSurveyAvailableOptions)){
      let vesselFSCData = fscVesselState.vesselFSCData;
      let validationMsg = fscVesselState.validationMsg;
      validationMsg.isSurveyAvailableInvalid = true;
      updateFSCVesselState({
        validationMsg,
        vesselFSCData,
      });
    }
 }
    setVesselValidationMessage();
  }


  function setVesselValidationMessage(){
    let validation = fscVesselState.validationMsg;
    let vesselInvalid = validation.nameOfVesselInvalid||
                        validation.hullIdInvalid||
                        validation.lengthInvalid||
                        validation.beamInvalid||
                        validation.draftInvalid||
                        validation.typesOfEngineInvalid||
                        validation.hoursOnEngineInvalid||
                        validation.isVesselSeaworthyInvalid||
                        validation.areMajorComponentsMissingInvalid||
                        validation.doesVesselHavePCBInvalid||
                        validation.doesVesselHaveAsbestosInvalid||
                        validation.isVesselInspectedInvalid||
                        validation.isSurveyAvailableInvalid||
                        validation.selectMissingInvalid||
                        validation.asbestosTypeMissingInvalid;

      updateFSCState({
        vesselInvalid:vesselInvalid,
      });
  }
  return useMemo(() => {
    return (
      <div>
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
              onChange={(event) => {
                let fsc = fscState.fsc;
                fsc.itemName = event.target.value;
                updateFSCState({
                  fsc: fsc
                })
              }}
              onBlur={(event) => handleItemNameChange(event.target)}
              validationMessage={fscVesselState.itemNameMsg}
              maxLength={69}
              minLength={4}
              isInvalid={fscVesselState.itemNameInvalid}
              isValid={false}
            />
          </div>

          <div className="tablet:grid-col-12">
            <PPMSToggleRadio
              id={"is-vessel-50-feet-or-over"}
              options={fscVesselState.isVessel50FeetOrOverOptions}
              isInline={false}
              isDisabled={false}
              name={"isVessel50feetOrOver"}
              className={"isVessel50feetOrOver"}
              label={
                "You are reporting a Vessel. Is this vessel 50 feet or over?"
              }
              validationMessage={"Is this vessel 50 feet or over is Required."}
              onChange={handleIsVessel50FeetOrOver}
              isRequired={true}
            />
          </div>
        </div>
        <br />
        <div>
          {fscVesselState.vesselFSCData.isVessel50FeetOrOver && (
            <>
              <div className={"grid-row grid-gap-4"}>
                <div className={"tablet:grid-col-6"}>
                  <PPMSInput
                    id={"vessel-name"}
                    name={"vesselNAME"}
                    label={"Name of Vessel"}
                    onBlur={(event) => handleVesselNameChange(event.target)}
                    onChange={(event) => {
                      let vesselFSCData = fscVesselState.vesselFSCData;
                      vesselFSCData.nameOfVessel =
                        event.target.value;
                      updateFSCVesselState({
                        vesselFSCData: vesselFSCData,
                      });
                    }}
                    isRequired={true}
                    isDisabled={false}
                    inputType={"text"}
                    value={fscVesselState.vesselFSCData.nameOfVessel}
                    validationMessage={fscVesselState.nameOfVesselMsg}
                    isValid={fscVesselState.nameOfVesselValid}
                    isInvalid={fscVesselState.validationMsg.nameOfVesselInvalid}
                    maxLength={50}
                    minLength={1}
                  />
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    name="make"
                    id={"make"}
                    message={""}
                    maxLength={20}
                    minLength={1}
                    validationMessage={fscVesselState.makeMsg}
                    isInvalid={fscVesselState.makeInvalid}
                    isValid={fscVesselState.makeValid}
                    isRequired={true}
                    onBlur={(event) => handleChange(event.target)}
                    onChange={(event) => {
                      let fsc = fscState.fsc;
                      fsc.make = event.target.value;
                      updateFSCState({
                        fsc:fsc
                      })
                    }}
                    label={"Make"}
                    value={fscState.fsc.make}
                    inputType={"text"}
                    isDisabled={false}
                  />
                </div>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    name="model"
                    id={"model"}
                    message={""}
                    maxLength={20}
                    minLength={1}
                    validationMessage={fscVesselState.modelMsg}
                    isInvalid={fscVesselState.modelInvalid}
                    isValid={fscVesselState.modelValid}
                    isRequired={true}
                    onChange={(event) => {
                      fscState.fsc.model = event.target.value;
                    }}
                    onBlur={(event) => handleChange(event.target)}
                    label={"Model"}
                    value={fscState.fsc.model}
                    inputType={"text"}
                    isDisabled={false}
                  />
                </div>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"hull-id-number"}
                    name={"hullIdNumber"}
                    label={"Hull Id Number"}
                    onBlur={(event) => handleHullIdNumberChange(event.target)}
                    onChange={(event) => {
                      let vesselFSCData = fscVesselState.vesselFSCData;
                      vesselFSCData.hullIdNumber =
                        event.target.value;
                      updateFSCVesselState({
                        vesselFSCData: vesselFSCData,
                      });
                    }}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.hullIdInvalid}
                    isValid={fscVesselState.hullIdValid}
                    validationMessage={fscVesselState.hullIdMsg}
                    isDisabled={false}
                    inputType={"text"}
                    value={fscVesselState.vesselFSCData.hullIdNumber}
                    minLength={12}
                    maxLength={14}
                  />
                </div>
              </div>

              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <PPMSToggleRadio
                    id={"is-vessel-seaworthy"}
                    options={fscVesselState.isVesselSeaworthyOptions}
                    isInline={false}
                    isDisabled={false}
                    name={"isVesselSeaworthy"}
                    className={"isVesselSeaworthy"}
                    label={"Is Vessel Seaworthy? "}
                    validationMessage={fscVesselState.isVesselSeaworthyMsg}
                    onChange={handleVesselSeaWorthyChange}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.isVesselSeaworthyInvalid}
                  />
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"length"}
                    name={"length"}
                    label={"Length"}
                    onBlur={(event) => handleLengthChange(event.target)}
                    onChange={(event) => {
                      let vesselFSCData =fscVesselState.vesselFSCData;
                      vesselFSCData.length = event.target.value;
                      updateFSCVesselState({
                        vesselFSCData: vesselFSCData
                      });
                    }}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.lengthInvalid}
                    isValid={fscVesselState.lengthValid}
                    validationMessage={fscVesselState.lengthMsg}
                    isDisabled={false}
                    inputType={"text"}
                    value={fscVesselState.vesselFSCData.length}
                    minLength={1}
                    maxLength={5}
                  />
                </div>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"beam"}
                    name={"beam"}
                    label={"Beam"}
                    onBlur={(event) => handleBeamChange(event.target)}
                    onChange={(event) => {
                      let vesselFSCData = fscVesselState.vesselFSCData;
                      vesselFSCData.beam = event.target.value;
                      updateFSCVesselState({
                        vesselFSCData:vesselFSCData });
                    }}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.beamInvalid}
                    isValid={fscVesselState.beamValid}
                    validationMessage={fscVesselState.beamMsg}
                    isDisabled={false}
                    inputType={"text"}
                    value={fscVesselState.vesselFSCData.beam}
                    minLength={1}
                    maxLength={5}
                  />
                </div>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"draft"}
                    name={"draft"}
                    label={"Draft"}
                    onBlur={(event) => handleDraftChange(event.target)}
                    onChange={(event) => {
                      let vesselFSCData = fscVesselState.vesselFSCData;
                      vesselFSCData.draft = event.target.value;
                      updateFSCVesselState({
                        vesselFSCData: vesselFSCData,
                      });
                    }}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.draftInvalid}
                    isValid={fscVesselState.draftValid}
                    validationMessage={fscVesselState.draftMsg}
                    isDisabled={false}
                    inputType={"text"}
                    value={fscVesselState.vesselFSCData.draft}
                    minLength={1}
                    maxLength={5}
                  />
                </div>
              </div>

              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <PPMSToggleRadio
                    id={"are-major-components-missing"}
                    options={fscVesselState.areMajorComponentsMissingOptions}
                    isInline={false}
                    isDisabled={false}
                    name={"areMajorComponentsMissing"}
                    className={"areMajorComponentsMissing"}
                    label={"Are Major Components Missing?"}
                    validationMessage={
                      fscVesselState.areMajorComponentsMissingMsg
                    }
                    onChange={handleComponentMissing}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.areMajorComponentsMissingInvalid}
                  />
                </div>
              </div>
              {fscVesselState.vesselFSCData.areMajorComponentsMissing ===
              true ? (
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <PPMSToggleCheckbox
                      id={"major-components-missing"}
                      options={fscVesselState.missingOptions}
                      isInline={false}
                      isDisabled={fscVesselState.componentsMissingDisable}
                      name={"selectMissing"}
                      className={"selectMissing"}
                      label={"If yes, then select from the list."}
                      validationMessage={fscVesselState.componentTyoeMsg}
                      onChange={handleSelectMissing}
                      isRequired={
                        fscVesselState.vesselFSCData.areMajorComponentsMissing
                      }
                      isInvalid={fscVesselState.validationMsg.selectMissingInvalid}
                    />
                  </div>
                </div>
              ) : (
                <div />
              )}
              <div className={"grid-row grid-gap-4"}>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"types-of-engines"}
                    name={"typesOfEngines"}
                    label={"Types of Engines"}
                    onBlur={(event) => handleTypesOfEnginesChange(event.target)}
                    onChange={(event) => {
                      let vesselFSCData = fscVesselState.vesselFSCData;
                      vesselFSCData.typesOfEngines =
                        event.target.value;
                      updateFSCVesselState({ vesselFSCData:vesselFSCData });
                    }}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.typesOfEngineInvalid}
                    isValid={fscVesselState.typesOfEngineValid}
                    validationMessage={fscVesselState.typesOfEngineMsg}
                    isDisabled={false}
                    inputType={"text"}
                    value={fscVesselState.vesselFSCData.typesOfEngines}
                    minLength={1}
                    maxLength={20}
                  />
                </div>
                <div className={"tablet:grid-col-4"}>
                  <PPMSInput
                    id={"hours-on-engine"}
                    name={"hoursOnEngine"}
                    label={"Hours on Engine"}
                    onBlur={(event) => handleHoursOnEngineChange(event.target)}
                    onChange={(event) => {
                      let vesselFSCData = fscVesselState.vesselFSCData;
                      vesselFSCData.hoursOnEngine =
                        event.target.value;
                      updateFSCVesselState({ vesselFSCData: vesselFSCData });
                    }}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.hoursOnEngineInvalid}
                    isValid={fscVesselState.hoursOnEngineValid}
                    validationMessage={fscVesselState.hoursOnEngineMsg}
                    isDisabled={false}
                    inputType={"text"}
                    value={fscVesselState.vesselFSCData.hoursOnEngine}
                    minLength={1}
                    maxLength={20}
                  />
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <PPMSToggleRadio
                    id={"vessel-have-pcbs"}
                    options={fscVesselState.doesVesselHavePCBOptions}
                    isInline={false}
                    isDisabled={false}
                    name={"doesVesselHavePCS"}
                    className={"doesVesselHavePCS"}
                    label={"Does the vessel have PCBs?"}
                    validationMessage={fscVesselState.doesVesselHavePCBMsg}
                    onChange={handlePCSCheck}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.doesVesselHavePCBInvalid}
                  />
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <PPMSToggleRadio
                    id={"vessel-have-asbestos"}
                    options={fscVesselState.doesVesselHaveAsbestosOptions}
                    isInline={false}
                    isDisabled={false}
                    name={"doesVesselHaveAsbestos"}
                    className={"doesVesselHaveAsbestos"}
                    label={"Does the vessel have asbestos?"}
                    validationMessage={fscVesselState.doesVesselHaveAsbestosMsg}
                    onChange={handleVesselHaveAsbestosChange}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.doesVesselHaveAsbestosInvalid}
                  />
                </div>
              </div>
              {fscVesselState.vesselFSCData.vesselHasAsbestos === true ? (
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <PPMSToggleRadio
                      id={"asbestos-type"}
                      options={fscVesselState.asbestosTypes}
                      isInline={false}
                      isDisabled={fscVesselState.asbestosTypeDisable}
                      name={"selectAsbestos"}
                      className={"selectAsbestos"}
                      label={"If yes, select the type"}
                      validationMessage={fscVesselState.asbestosTypeMsg}
                      onChange={handleAsbestosChange}
                      isRequired={
                        fscVesselState.vesselFSCData.vesselHasAsbestos
                      }
                      isInvalid={fscVesselState.validationMsg.asbestosTypeMissingInvalid}
                    />
                  </div>
                </div>
              ) : (
                <div />
              )}
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <PPMSToggleRadio
                    id={"is-vessel-inspected"}
                    options={fscVesselState.isVesselInspectedOptions}
                    isInline={false}
                    isDisabled={false}
                    name={"isVesselInspected"}
                    className={"isVesselInspected"}
                    label={"Has the vessel been inspected by the Coast Guard?"}
                    validationMessage={fscVesselState.isVesselInspectedMsg}
                    onChange={handleVesselInspected}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.isVesselInspectedInvalid}
                  />
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <PPMSToggleRadio
                    id={"is-marine-survey-available"}
                    options={fscVesselState.isSurveyAvailableOptions}
                    isInline={false}
                    isDisabled={false}
                    name={"isSurveyAvailable"}
                    className={"isSurveyAvailable"}
                    label={"Is a Marine Survey of the vessel available?"}
                    validationMessage={
                      fscVesselState.isMarineSurveyAvailableMsg
                    }
                    onChange={handleSurveyAvailable}
                    isRequired={true}
                    isInvalid={fscVesselState.validationMsg.isSurveyAvailableInvalid}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className={"grid-row grid-gap-4"}>
          <PPMSFscSpecial
            id={"special"}
            specialDescriptionCode={fscState.fsc.specialDescriptionCode}
            specialDescriptionText={fscState.fsc.specialDescriptionText}
            required={false}
            updateSpecialDescriptionCode={(value: any, validation: any) => {
              handleSpecialDescriptionCodeChange(value, validation);
            }}
            updateSpecialDescriptionText={(value: any, validation: any) => {
              handleSpecialDescriptionTextChange(value, validation);
            }}
          />
        </div>
      </div>
    );
  }, [fscVesselState,fscState]);
}

export default FSCVessel;
