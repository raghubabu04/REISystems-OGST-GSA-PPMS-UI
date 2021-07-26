import React, { useContext, useEffect, useMemo } from "react";
import {
  isEmptyCheck,
  validateAircraftSerialNumber,
  validateCommonItemName,
  validateCommonMake,
  validateCommonModel,
  validateSerialNumberExist,
  validateSpecialDescriptionText,
} from "../validations/propertyFieldValidations";
import { PropertyContext } from "../PropertyContext";
import { UserUtils } from "../../../../utils/UserUtils";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import {
  PPMSToggleCheckbox,
  PPMSToggleRadio,
} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { isFormSubmitted } from "../../../../service/validation.service";
import PPMSLabel from "../../../../ui-kit/components/common/form/PPMS-label";
import { aircraftFSCCode } from "../constants/Constants";

export interface FSCAircraftProps {
  updateFSCAircraft: any;
  triggerValidation?: boolean;
  modelIsRequired: boolean;
  agencyBureau: string;
  validateFscSection: boolean;
}

function FSCAircraft(props: FSCAircraftProps) {
  const {
    icnState,
    fscAircraftState,
    updateFscAircraftState,
    fscState,
    updateFSCState,
    agencyInfoState,
  } = useContext(PropertyContext);

  useEffect(() => {
    if (fscAircraftState?.isEngineMissingOptions[0]?.isSelected) {
      fscAircraftState.otherMissingComponentsOptions.forEach((ele) => {
        ele.required = false;
      });
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }else if(props.validateFscSection){
        validateForm();
        validateAircraftForm();
        updateFSCState({
          validateFscSection: false,
        });
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [fscState, fscAircraftState]);

  function handleChange(event: any) {
    const { aircraftFSCData} = fscAircraftState;
    const { fsc } = fscState;
    if (event.currentTarget.name === "make") {
      let errMsgStr = validateCommonMake(
        event.currentTarget.value,
        event.currentTarget.required
      ).validationError;
    validationMessage: updateValidationMessage(
      event.currentTarget.id,
      errMsgStr
    )
      updateFscAircraftState({
        validationMessage: updateValidationMessage(
          event.currentTarget.id,
          errMsgStr
        ),
      });
      updateFSCState({
        make: event.currentTarget.value,
        makeInvalid: !isEmptyCheck(errMsgStr),
      });
    }
    else if (event.currentTarget.name === "model") {
      let errMsgStr = validateCommonModel(
        event.currentTarget.value,
        event.currentTarget.required
      ).validationError;
      //updateValidationMessage(event.currentTarget.id, errMsgStr);
      updateFscAircraftState({
        validationMessage: updateValidationMessage(
          event.currentTarget.id,
          errMsgStr
        ),
      });
      updateFSCState({
        model: event.currentTarget.value,
        modelInvalid: !isEmptyCheck(errMsgStr),
      });
    }
    else if (event.currentTarget.name === "itemName") {
      let errMsgStr = validateCommonItemName(event.currentTarget.value)
        .validationError;
      updateFscAircraftState({
        validationMessage: updateValidationMessage(
          event.currentTarget.id,
          errMsgStr
        ),
      });
      updateFSCState({
        itemName: event.currentTarget.value,
        itemNameInvalid: !isEmptyCheck(errMsgStr),
      });
    }
    else if (event.currentTarget.name === "specialDescriptionText") {
      let errMsgStr = validateSpecialDescriptionText(event.currentTarget.value)
        .validationError;
      updateValidationMessage(event.currentTarget.id, errMsgStr);
    }
    else if (event.currentTarget.name === "Serial Number") {
      let aircraftValidation = validateAircraftSerialNumber(
        event.currentTarget.value
      );
      let errMsgStr = aircraftValidation.validationError;
      let validationMessage = updateValidationMessage(
        event.currentTarget.id,
        errMsgStr
      )
      updateFscAircraftState({
        validationMessage: validationMessage,
      });

      let shouldCheckSerialNumber =
        event.currentTarget.value.length === 12 &&
        !aircraftValidation.isInvalid &&
        aircraftFSCCode.includes(fsc.fscCode);

      if (shouldCheckSerialNumber) {
        validateSerialNumberExist(
          fsc.fscCode,
          event.currentTarget.value,
          icnState.aacCode +
            icnState.julianDate +
            icnState.serialNum +
            icnState.suffix
        ).then((response) => {
          if (response.status === 200 && response.data === true) {
            validationMessage = updateValidationMessage(
              "serialNumber",
              "Aircraft serial number already exists, Please change"
            );
            updateFscAircraftState({
              validationMessage: validationMessage,
            });
          }
        });
      }
      setAircraftValidationMessage();
    } else {
      const errMsg = validateProperty(event.currentTarget);
      let validationMessage = updateValidationMessage(
        event.currentTarget.id,
        errMsg
      )
      updateFscAircraftState({
        validationMessage: validationMessage,
      });
    }

    switch (event.currentTarget.name) {
      case "model":
        fsc.model = event.target.value;
        break;
      case "make":
        fsc.make = event.target.value;
        break;
      case "itemName":
        fsc.itemName = event.target.value;
        break;
      case "specialDescriptionText":
        fsc.specialDescriptionText = event.target.value;
        break;
      case "Serial Number":
        aircraftFSCData.serialNumber = event.target.value;
        fsc.specialDescriptionCode = event.target.value;
        break;
    }
    updateFSCState({
      fsc,
    });
    updateFscAircraftState({
      aircraftFSCData,
    });
    setAircraftValidationMessage();
  }

  function handleToggleChange(items: any) {
    const field = items[0].field;

    const { aircraftFSCData, validationMessage } = fscAircraftState;
    const selectedItem = items.filter((item) => item.isSelected === true);
    let  selectedHasValue = (selectedItem?.[0]?.value ==="Yes" || selectedItem?.[0]?.value =="No") ? true:false;
    switch (field) {
      case "isAircraftOperational":
        aircraftFSCData.isAircraftOperational =
          (field === "isAircraftOperational" &&
          selectedItem.length > 0 &&
          selectedItem[0].value === "Yes")? true:
            (field === "isAircraftOperational" &&
          selectedItem.length > 0 &&
          selectedItem[0].value === "No")? false:null;
        if(selectedHasValue){
          validationMessage.isAircraftOperationalInvalid = false;
        }
        break;
      case "isDataPlateAvailable":
        aircraftFSCData.isDataPlateAvailable =
          (field === "isDataPlateAvailable" &&
          selectedItem.length > 0 &&
          selectedItem[0].value === "Yes")? true:
            (field === "isDataPlateAvailable" &&
              selectedItem.length > 0 &&
              selectedItem[0].value === "No") ? false : null;
        if(selectedHasValue){
          validationMessage.isDataPlateAvailableInvalid = false;
        }
        break;
      case "areHistoricalMaintenanceRecordsAvailable":
        aircraftFSCData.areHistoricalMaintenanceRecordsAvailable =
          (field === "areHistoricalMaintenanceRecordsAvailable" &&
          selectedItem.length > 0 &&
          selectedItem[0].value === "Yes")?true:
          (aircraftFSCData.areHistoricalMaintenanceRecordsAvailable =
            field === "areHistoricalMaintenanceRecordsAvailable" &&
            selectedItem.length > 0 &&
            selectedItem[0].value === "No")?false:null;
          if(selectedHasValue){
            validationMessage.areHistoricalMaintenanceRecordsAvailableInvalid = false;
          }
        break;
      case "isAircraftCertifiedByFAA":
        aircraftFSCData.isAircraftCertifiedByFAA =
          (field === "isAircraftCertifiedByFAA" &&
          selectedItem.length > 0 &&
          selectedItem[0].value === "Yes")?true:
            (field === "isAircraftCertifiedByFAA" &&
              selectedItem.length > 0 &&
              selectedItem[0].value === "No")? false:null;
            if(selectedHasValue){
              validationMessage.isAircraftCertifiedByFAAInvalid = false;
            }
        break;
      case "isAircraftMaintainedByFAA":
        aircraftFSCData.isAircraftMaintainedByFAA =
          (field === "isAircraftMaintainedByFAA" &&
          selectedItem.length > 0 &&
          selectedItem[0].value === "Yes")?true:
            (field === "isAircraftMaintainedByFAA" &&
              selectedItem.length > 0 &&
              selectedItem[0].value === "No")? false:null;
        if(selectedHasValue){
          validationMessage.isAircraftMaintainedByFAAInvalid = false;
        }
        break;
    }
    updateFscAircraftState({
      validationMessage,
      aircraftFSCData,
    });
    setAircraftValidationMessage()
  }
  function handleComponentMissingChange(items) {
    const { aircraftFSCData, validationMessage } = fscAircraftState;
    let selectedVal: string = "";
    let itemHasSelectedValue : boolean = false;
    items.forEach((item) => {
      let key = item.field;
      if (item.isSelected) {
        selectedVal = item.value;
        itemHasSelectedValue = !isEmptyCheck(selectedVal);
        switch (key) {
          case "areMajorComponentsMissing":
            updateMajorComponentsMissing(
              aircraftFSCData,
              validationMessage,
              selectedVal
            );
            break;
          case "isEngineMissing":
            updateEngineMissing(
              aircraftFSCData,
              validationMessage,
              selectedVal
            );
            //validateSelectedAircraftForm(key,itemHasSelectedValue);
            break;
          case "avionicsOtherNoMissing":
            updateAvonics(aircraftFSCData, validationMessage, selectedVal);
            //validateSelectedAircraftForm(key,itemHasSelectedValue);
            break;
        }
        updateFscAircraftState({
          aircraftFSCData: aircraftFSCData,
          validationMessage: validationMessage,
        });
      } else if (!item.isSelected && key === "isEngineMissing") {
        updateEngineMissing(aircraftFSCData, validationMessage, selectedVal);
      }
    });

    function updateEngineMissing(
      aircraftFSCData,
      validationMessage,
      selectedVal
    ) {
      if (selectedVal === "Engine Missing") {
        aircraftFSCData.isEngineMissing = true;
        validationMessage.areMajorEngineMissingRequiredFlag = false;
        validationMessage.isEngineMissingRequiredFlag = false;
        validationMessage.avionicsOtherNoMissingRequiredFlag = false;
        validationMessage.isEngineMissingInvalid = false;
        validationMessage.avionicsOtherNoMissingInvalid= false;
        updateSelectedOptionalIsEngineMissing();

        if (!validationMessage.isAvionicsOtherNosMissingSelected) {
          updateOptionaAvonicsEngineMissing();
        }
      } else {
        aircraftFSCData.isEngineMissing = false;
        if (!validationMessage.isAvionicsOtherNosMissingSelected) {
          validationMessage.areMajorEngineMissingRequiredFlag = true;
          aircraftFSCData.areMajorComponentsMissing = true;
          validationMessage.avionicsOtherNoMissingRequiredFlag = true;
          validationMessage.isAvionicsOtherNosMissingSelected = false;
          if (validationMessage.areMajorEngineMissingRequiredFlag) {
            updateRequiredAvonicsEngineMissing();
            updateRequiredIsEngineMissing();
          }
        }
      }
      updateFscAircraftState({
        aircraftFSCData: aircraftFSCData,
        validationMessage: validationMessage,
      });
    }

    function updateMajorComponentsMissing(
      aircraftFSCData,
      validationMessage,
      selectedVal
    ) {
      if (selectedVal === "No") {
        aircraftFSCData.areMajorComponentsMissing = false;
        validationMessage.areMajorEngineMissingRequiredFlag = false;
        validationMessage.avionicsOtherNoMissingRequiredFlag = false;
        validationMessage.isEngineMissingRequiredFlag = false;
        fscAircraftState.isEngineMissingOptions = selectedValueOptions(
          fscAircraftState.isEngineMissingOptions,
          [""]
        );
        fscAircraftState.otherMissingComponentsOptions = selectedValueOptions(
          fscAircraftState.otherMissingComponentsOptions,
          ["", "", ""]
        );
        validationMessage.areMajorComponentsMissingInvalid = false;
        validationMessage.avionicsOtherNoMissingInvalid = false;
        updateOptionalIsEngineMissing();
        updateOptionaAvonicsEngineMissing();
      } else {
        validationMessage.areMajorEngineMissingRequiredFlag = true;
        aircraftFSCData.areMajorComponentsMissing = true;
        validationMessage.avionicsOtherNoMissingRequiredFlag = true;
        validationMessage.isEngineMissingRequiredFlag = true;
        validationMessage.areMajorComponentsMissingInvalid = false;
        if (validationMessage.areMajorEngineMissingRequiredFlag) {
          updateRequiredAvonicsEngineMissing();
          updateRequiredIsEngineMissing();
        }

      }
      updateFscAircraftState({
        aircraftFSCData: aircraftFSCData,
        validationMessage: validationMessage,
      });
    }

    function updateAvonics(aircraftFSCData, validationMessage, selectedVal) {
      switch (selectedVal) {
        case "Avionics":
          aircraftFSCData.avionicsOtherNoMissing = "Y";
          validationMessage.avionicsOtherNoMissingInvalid = false;
          validationMessage.isEngineMissingInvalid = false;
          break;
        case "Other":
          aircraftFSCData.avionicsOtherNoMissing = "O";
          validationMessage.avionicsOtherNoMissingInvalid = false;
          validationMessage.isEngineMissingInvalid = false;
          break;
        case "No":
          aircraftFSCData.avionicsOtherNoMissing = "N";
          validationMessage.avionicsOtherNoMissingInvalid = false;
          validationMessage.isEngineMissingInvalid = false;
          break;
        default:
          aircraftFSCData.isExtensiveDisassemblyAndReassembly = "";
      }
      validationMessage.isAvionicsOtherNosMissingSelected = true;
      validationMessage.areMajorEngineMissingRequiredFlag = false;
      validationMessage.avionicsOtherNoMissingRequiredFlag = false;
      validationMessage.isEngineMissingRequiredFlag = false;
      if (!aircraftFSCData.isEngineMissing) {
        fscAircraftState.isEngineMissingOptions = selectedValueOptions(
          fscAircraftState.isEngineMissingOptions,
          [""]
        );
        updateOptionalIsEngineMissing();
      }
      validationMessage.showerror = false;
      updateFscAircraftState({
        aircraftFSCData: aircraftFSCData,
        validationMessage: validationMessage,
      });
    }
  }

  function handleAircraftUsedNonFlightPurpose(items) {
    const field = items[0].field;
    const { aircraftFSCData, validationMessage } = fscAircraftState;
    let selectedVal: string = "";
    items.forEach((item) => {
      if (item.isSelected) {
        selectedVal = item.value;
        if (field === "isAircraftUsedNonFlightPurpose") {
          if (selectedVal === "No") {
            setNonFlightPurposeToFalse(aircraftFSCData);
            validationMessage.nonFlightPurposeOptionsRequired = false;
            aircraftFSCData.isAircraftUsedNonFlightPurpose = false;
            validationMessage.isAircraftUsedNonFlightPurposeInvalid = false;
            validationMessage.nonFlightPurposeOptionsMsg = "";
            updateFscAircraftState({
              nonFlightPurposeOptions: [
                {
                  id: "isGroundTraining",
                  value: "Ground Training",
                  isSelected: false,
                  field: "nonFlightPurpose",
                },
                {
                  id: "isStaticDisplay",
                  value: "Static Display",
                  isSelected: false,
                },
                {
                  id: "isExtensiveDisassemblyAndReassembly",
                  value: "Extensive Disassemby and re-assembly",
                  isSelected: false,
                },
                {
                  id: "isRepeatedBurningForFireFightingTraining",
                  value: "Repeated burning for fire-fighting training",
                  isSelected: false,
                },
                {
                  id: "isExtensiveCannibalization",
                  value: "Extensive cannibalization",
                  isSelected: false,
                },
              ],
              validationMessage: validationMessage,
              aircraftFSCData: aircraftFSCData,
            });
          } else {
            validationMessage.nonFlightPurposeOptionsRequired = true;
            aircraftFSCData.isAircraftUsedNonFlightPurpose = true;
            validationMessage.isAircraftUsedNonFlightPurposeInvalid = false;
            validationMessage.nonFlightPurposeOptionsMsg =
              "Select at least one Non Flight Purpose Option.";
            validationMessage.showerror = true;
            updateFscAircraftState({
              nonFlightPurposeOptions: [
                {
                  id: "isGroundTraining",
                  value: "Ground Training",
                  isSelected: false,
                  field: "nonFlightPurpose",
                },
                {
                  id: "isStaticDisplay",
                  value: "Static Display",
                  isSelected: false,
                },
                {
                  id: "isExtensiveDisassemblyAndReassembly",
                  value: "Extensive Disassemby and re-assembly",
                  isSelected: false,
                },
                {
                  id: "isRepeatedBurningForFireFightingTraining",
                  value: "Repeated burning for fire-fighting training",
                  isSelected: false,
                },
                {
                  id: "isExtensiveCannibalization",
                  value: "Extensive cannibalization",
                  isSelected: false,
                },
              ],
              validationMessage,
              aircraftFSCData,
            });
          }
        }
      }
      updateFscAircraftState({
        aircraftFSCData,
        validationMessage,
      });
    });
  }
  function selectedValueOptions(options: any[], selectedValues: any[]) {
    options.forEach((option) => {
      if (selectedValues.includes(option.id)) {
        option.isSelected = true;
      } else {
        option.isSelected = false;
      }
    });
    return options;
  }

  function handleNonFlightPurposeChange(values) {
    let { aircraftFSCData, validationMessage } = fscAircraftState;
    let isOptionSelected = "notSelected";

    if (values.length > 0) {
      values.forEach((item) => {
        let key = item.id;
        aircraftFSCData[key] = item.isSelected;
        switch (key) {
          case "isGroundTraining":
            aircraftFSCData.isGroundTraining = item.isSelected;
            validationMessage.isAircraftUsedNonFlightPurposeInvalid=false;
            break;
          case "isStaticDisplay":
            aircraftFSCData.isStaticDisplay = item.isSelected;
            validationMessage.isAircraftUsedNonFlightPurposeInvalid=false;
            break;
          case "isExtensiveDisassemblyAndReassembly":
            aircraftFSCData.isExtensiveDisassemblyAndReassembly =
              item.isSelected;
            validationMessage.isAircraftUsedNonFlightPurposeInvalid=false;
            break;
          case "isRepeatedBurningForFireFightingTraining":
            aircraftFSCData.isRepeatedBurningForFireFightingTraining =
              item.isSelected;
            validationMessage.isAircraftUsedNonFlightPurposeInvalid=false;
            break;
          case "isExtensiveCannibalization":
            aircraftFSCData.isExtensiveCannibalization = item.isSelected;
            validationMessage.isAircraftUsedNonFlightPurposeInvalid=false;
            break;
        }
        if (item.isSelected) {
          validationMessage.nonFlightPurposeOptionsMsg = "";
          isOptionSelected = "Selected";
        }
      });
      updateFscAircraftState({
        aircraftFSCData: aircraftFSCData,
        validationMessage: validationMessage,
      });
    }
    if (isOptionSelected === "notSelected") {
      validationMessage.nonFlightPurposeOptionsMsg =
        "Select atleast one Non Flight Purpose Option.";
      updateFscAircraftState({
        nonFlightPurposeOptions: [
          {
            id: "isGroundTraining",
            value: "Ground Training",
            isSelected: false,
            field: "nonFlightPurpose",
          },
          {
            id: "isStaticDisplay",
            value: "Static Display",
            isSelected: false,
          },
          {
            id: "isExtensiveDisassemblyAndReassembly",
            value: "Extensive Disassemby and re-assembly",
            isSelected: false,
          },
          {
            id: "isRepeatedBurningForFireFightingTraining",
            value: "Repeated burning for fire-fighting training",
            isSelected: false,
          },
          {
            id: "isExtensiveCannibalization",
            value: "Extensive cannibalization",
            isSelected: false,
          },
        ],
        validationMessage,
      });
    }
  }

  function updateOptionalIsEngineMissing() {
    fscAircraftState.isEngineMissingOptions = [
      {
        id: "EM",
        value: "Engine Missing",
        isSelected: false,
        required: false,
        field: "isEngineMissing",
      },
    ];
  }

  function updateOptionaAvonicsEngineMissing() {
    fscAircraftState.otherMissingComponentsOptions = [
      {
        id: "Y",
        value: "Avionics",
        isSelected: false,
        required: false,
        field: "avionicsOtherNoMissing",
      },
      {
        id: "O",
        value: "Other",
        isSelected: false,
        required: false,
        field: "avionicsOtherNoMissing",
      },
      {
        id: "N",
        value: "No",
        isSelected: false,
        required: false,
        field: "avionicsOtherNoMissing",
      },
    ];
  }

  function updateRequiredIsEngineMissing() {
    fscAircraftState.isEngineMissingOptions = [
      {
        id: "EM",
        value: "Engine Missing",
        isSelected: false,
        required: true,
        field: "isEngineMissing",
      },
    ];
  }

  function updateSelectedOptionalIsEngineMissing() {
    fscAircraftState.isEngineMissingOptions = [
      {
        id: "EM",
        value: "Engine Missing",
        isSelected: true,
        required: false,
        field: "isEngineMissing",
      },
    ];
  }

  function updateRequiredAvonicsEngineMissing() {
    fscAircraftState.otherMissingComponentsOptions = [
      {
        id: "Y",
        value: "Avionics",
        isSelected: false,
        required: true,
        field: "avionicsOtherNoMissing",
      },
      {
        id: "O",
        value: "Other",
        isSelected: false,
        required: true,
        field: "avionicsOtherNoMissing",
      },
      {
        id: "N",
        value: "No",
        isSelected: false,
        required: true,
        field: "avionicsOtherNoMissing",
      },
    ];
  }

  function setNonFlightPurposeToFalse(aircraftFSCData) {
    aircraftFSCData.isGroundTraining = false;
    aircraftFSCData.isStaticDisplay = false;
    aircraftFSCData.isExtensiveDisassemblyAndReassembly = false;
    aircraftFSCData.isRepeatedBurningForFireFightingTraining = false;
    aircraftFSCData.isExtensiveCannibalization = false;
    return aircraftFSCData;
  }

  function updateValidationMessage(id: any, errMsg: string) {
    const { validationMessage } = fscAircraftState;
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

  function validateProperty({ id, value, name, tagName }) {
    //test for mandaory field
    if (value?.trim() === "") {
      return tagName?.trim() === "SELECT"
        ? name + " must be selected"
        : name + " must be entered";
    } else if (value === undefined) {
      return name + " is Required.";
    }  else {
      return undefined;
    }
  }

  function handleMilitaryAirCraftOnly(values) {
    let { aircraftFSCData } = fscAircraftState;
    if (values.length > 0) {
      values.forEach((element) => {
        aircraftFSCData[element.id] = element.isSelected;
      });
    }

    updateFscAircraftState({
      aircraftFSCData,
    });
  }

  function validateForm() {
    if (
      fscAircraftState.otherMissingComponentsOptions[0]["required"] === false
    ) {
      let validation = fscAircraftState.validationMessage;
      let aircraftData = fscAircraftState.aircraftFSCData;
      validation.areMajorEngineMissingRequiredFlag = false;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    let itemNameError = validateCommonItemName(fscState?.fsc?.itemName)
      .validationError;
    updateFscAircraftState({
      validationMessage: updateValidationMessage("itemName", itemNameError),
    });

    let modelError = validateCommonModel(fscState?.fsc?.model, true)
      .validationError;
    updateFscAircraftState({
      validationMessage: updateValidationMessage("model", modelError),
    });

    updateFSCState({
      itemNameInvalid: !isEmptyCheck(itemNameError),
      modelInvalid: !isEmptyCheck(modelError),
    });

    const serialNumber = validateProperty({
      id: "serialNumber",
      value: fscAircraftState?.aircraftFSCData?.serialNumber,
      name: "Serial Number",
      tagName: "INPUT",
    });
    let validationMsg = updateValidationMessage("serialNumber", serialNumber);
    updateFscAircraftState({
      validationMessage: validationMsg,
    });
    setAircraftValidationMessage();

    let aircraftValidation = validateAircraftSerialNumber(
      fscAircraftState.aircraftFSCData.serialNumber
    );
    let serialNumberErrMsgStr = aircraftValidation.validationError;
  let validationMessage = updateValidationMessage(
      "serialNumber",
        serialNumberErrMsgStr
    );
    updateFscAircraftState({
      validationMessage: validationMessage,
    });
    setAircraftValidationMessage();
    let givenSerialNumber = fscAircraftState?.aircraftFSCData?.serialNumber;
    let givenFscCode = fscState?.fsc?.fscCode;

    let shouldCheckSerialNumber =
      givenSerialNumber?.length === 12 &&
      !aircraftValidation.isInvalid &&
      aircraftFSCCode.includes(givenFscCode);

    if (shouldCheckSerialNumber) {
      validateSerialNumberExist(
        givenFscCode,
        givenSerialNumber,
        icnState.aacCode +
        icnState.julianDate +
        icnState.serialNum +
        icnState.suffix
      ).then((response) => {
        if (response.status === 200 && response.data === true) {
          let validationMessage = updateValidationMessage(
            "serialNumber",
            "Aircraft serial number already exists, Please change"
          );
          updateFscAircraftState({
            validationMessage: validationMessage,
          });
          updateFscAircraftState({
            validationMessage: validationMessage,
            serialNumberChecked: true,
          });
          setAircraftValidationMessage();
        }
      });
    }
  }

  function validateAircraftForm() {
    let validation = fscAircraftState.validationMessage;
    updateFscAircraftState({
      isAircraftOperationalOptions: setOptionRequiredField(
        fscAircraftState.isAircraftOperationalOptions,
      ),
      areHistoricalMaintenanceRecordsAvailableOptions: setOptionRequiredField(
        fscAircraftState.areHistoricalMaintenanceRecordsAvailableOptions,
      ),
      isDataPlateAvailableOptions: setOptionRequiredField(
        fscAircraftState.isDataPlateAvailableOptions,
      ),
      areMajorComponentsMissingOptions: setOptionRequiredField(
        fscAircraftState.areMajorComponentsMissingOptions,
      ),
      isAircraftCertifiedByFAAOptions: setOptionRequiredField(
        fscAircraftState.isAircraftCertifiedByFAAOptions,
      ),
      isAircraftMaintainedByFAAOptions: setOptionRequiredField(
        fscAircraftState.isAircraftMaintainedByFAAOptions,
      ),
      isAircraftUsedNonFlightPurposeOptions: setOptionRequiredField(
        fscAircraftState.isAircraftUsedNonFlightPurposeOptions,
      ),
    });
    if(checkSelectedValueOptions(fscAircraftState.isAircraftOperationalOptions)){
      validation.isAircraftOperationalInvalid = true;
      let aircraftData = fscAircraftState.aircraftFSCData;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    if(checkSelectedValueOptions(fscAircraftState.areHistoricalMaintenanceRecordsAvailableOptions)){
      let validation = fscAircraftState.validationMessage;
      validation.areHistoricalMaintenanceRecordsAvailableInvalid = true;
      let aircraftData = fscAircraftState.aircraftFSCData;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    if(checkSelectedValueOptions(fscAircraftState.isDataPlateAvailableOptions)){
      validation.isDataPlateAvailableInvalid = true;
      let aircraftData = fscAircraftState.aircraftFSCData;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    if(checkSelectedValueOptions(fscAircraftState.areMajorComponentsMissingOptions)){
      validation.areMajorComponentsMissingInvalid = true;
      let aircraftData = fscAircraftState.aircraftFSCData;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    if(checkSelectedValueOptions(fscAircraftState.isAircraftCertifiedByFAAOptions)){
      validation.isAircraftCertifiedByFAAInvalid = true;
      let aircraftData = fscAircraftState.aircraftFSCData;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    if(checkSelectedValueOptions(fscAircraftState.isAircraftMaintainedByFAAOptions)){
      validation.isAircraftMaintainedByFAAInvalid = true;
      let aircraftData = fscAircraftState.aircraftFSCData;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    if(checkSelectedValueOptions(fscAircraftState.isAircraftUsedNonFlightPurposeOptions)){
      validation.isAircraftUsedNonFlightPurposeInvalid = true;
      let aircraftData = fscAircraftState.aircraftFSCData;
      updateFscAircraftState({
        validationMessage: validation,
        aircraftFSCData: aircraftData,
      });
    }
    setAircraftValidationMessage();
  }
  function setAircraftValidationMessage(){
    let validationMessage = fscAircraftState.validationMessage;
    let aircraftIsValid = validationMessage.serialNumberInvalid||
      validationMessage.isAircraftOperationalInvalid||
      validationMessage.areHistoricalMaintenanceRecordsAvailableInvalid||
      validationMessage.isDataPlateAvailableInvalid||
      validationMessage.areMajorComponentsMissingInvalid||
      validationMessage.isAircraftCertifiedByFAAInvalid||
      validationMessage.isAircraftMaintainedByFAAInvalid||
      validationMessage.isAircraftUsedNonFlightPurposeInvalid||
      validationMessage.isEngineMissingInvalid||
      validationMessage.avionicsOtherNoMissingInvalid;
    updateFSCState({
      airCraftInvalid:aircraftIsValid
    });
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
              onBlur={handleChange}
              onChange={(event) => {
                fscState.fsc.itemName = event.target.value;
                updateFscAircraftState({});
              }}
              validationMessage={fscAircraftState.validationMessage.itemNameMsg}
              maxLength={69}
              minLength={4}
              isInvalid={fscAircraftState.validationMessage.itemNameInvalid}
              isValid={fscAircraftState.validationMessage.itemNameValid}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-4">
            <PPMSInput
              name="make"
              id={"make"}
              maxLength={20}
              minLength={1}
              validationMessage={fscAircraftState.validationMessage.makeMsg}
              isInvalid={fscAircraftState.validationMessage.makeInvalid}
              isValid={fscAircraftState.validationMessage.makeValid}
              isRequired={false} // fix for PPMS 1222
              message={"Optional"}
              onBlur={handleChange}
              onChange={(event) => {
                fscState.fsc.make = event.target.value;
                updateFscAircraftState({});
              }}
              label={"Make"}
              value={fscState.fsc.make}
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
              validationMessage={fscAircraftState.validationMessage.modelMsg}
              isInvalid={fscAircraftState.validationMessage.modelInvalid}
              isValid={fscAircraftState.validationMessage.modelValid}
              isRequired={true}
              onBlur={handleChange}
              onChange={(event) => {
                fscState.fsc.model = event.target.value;
                updateFscAircraftState({});
              }}
              label={"Model"}
              value={fscState.fsc.model}
              inputType={"text"}
              isDisabled={false}
            />
          </div>
          <div className="tablet:grid-col-4">
            <PPMSInput
              name={"Serial Number"}
              id={"serialNumber"}
              maxLength={12}
              minLength={12}
              onBlur={handleChange}
              onChange={(event) => {
                fscAircraftState.aircraftFSCData.serialNumber =
                  event.target.value;
                updateFscAircraftState({ fscAircraftState });
              }}
              validationMessage={
                fscAircraftState.validationMessage.serialNumberMsg
              }
              isInvalid={fscAircraftState.validationMessage.serialNumberInvalid}
              isValid={fscAircraftState.validationMessage.serialNumberValid}
              isRequired={true}
              label={"Serial Number"}
              value={fscAircraftState.aircraftFSCData.serialNumber}
              inputType={"text"}
              isDisabled={false}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-6">
            <PPMSToggleRadio
              isInline={false}
              name={"isAircraftOperational"}
              isRequired={true}
              isDisabled={false}
              options={fscAircraftState.isAircraftOperationalOptions}
              validationMessage={
                fscAircraftState.validationMessage.isAircraftOperationalMsg
              }
              onChange={handleToggleChange}
              className=""
              id="isAircraftOperational"
              label={"Is Aircraft Operational ?"}
              isInvalid={fscAircraftState.validationMessage.isAircraftOperationalInvalid}
            />
          </div>
        </div>
        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-6">
            <PPMSToggleRadio
              isInline={false}
              name={"areMajorComponentsMissing"}
              isDisabled={false}
              isRequired={true}
              options={fscAircraftState.areMajorComponentsMissingOptions}
              validationMessage={
                fscAircraftState.validationMessage.areMajorComponentsMissingMsg
              }
              onChange={handleComponentMissingChange}
              className=""
              id="areMajorComponentsMissing"
              label={"Are Major Components Missing ?"}
              isInvalid={fscAircraftState.validationMessage.areMajorComponentsMissingInvalid}
            />
          </div>
        </div>

        {fscAircraftState.aircraftFSCData.areMajorComponentsMissing === true ? (
          <div>
            <PPMSLabel htmlFor={"isEngineMissing"}>
              {"If yes, then select from the list "}
            </PPMSLabel>
            <PPMSToggleCheckbox
              isInline={false}
              name={"isEngineMissing"}
              isDisabled={false}
              options={fscAircraftState.isEngineMissingOptions}
              validationMessage={
                fscAircraftState.validationMessage.isEngineMissingMsg
              }
              onChange={handleComponentMissingChange}
              className=""
              id="isEngineMissing"
              isRequired={
                fscAircraftState.validationMessage
                  .areMajorEngineMissingRequiredFlag === true
                  ? true
                  : false
              }
              isInvalid={
                fscAircraftState.validationMessage
                  .areMajorEngineMissingRequiredFlag === true
                  ? true
                  : false
              }
            />

            <div className="grid-row grid-gap-4">
              <div className="tablet:grid-col-6">
                <PPMSToggleRadio
                  isInline={false}
                  name={"avionicsOtherNoMissing"}
                  isDisabled={false}
                  options={fscAircraftState.otherMissingComponentsOptions}
                  validationMessage={
                    fscAircraftState.validationMessage.avionicsOtherNoMissingMsg
                  }
                  onChange={handleComponentMissingChange}
                  isRequired={
                    fscAircraftState.validationMessage
                      .areMajorEngineMissingRequiredFlag === true
                      ? true
                      : false
                  }
                  isInvalid={
                    fscAircraftState.validationMessage
                      .areMajorEngineMissingRequiredFlag === true
                      ? true
                      : false
                  }
                  className=""
                  id="avionicsOtherNoMissing"
                />
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-6">
            <PPMSToggleRadio
              isInline={false}
              name={"isDataPlateAvailable"}
              isDisabled={false}
              options={fscAircraftState.isDataPlateAvailableOptions}
              validationMessage={
                fscAircraftState.validationMessage.isDataPlateAvailableMsg
              }
              onChange={handleToggleChange}
              isRequired={true}
              className=""
              id="isDataPlateAvailable"
              label={"Is the Dataplate available ?"}
              isInvalid={fscAircraftState.validationMessage.isDataPlateAvailableInvalid}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-12">
            <PPMSToggleRadio
              isInline={false}
              name={"areHistoricalMaintenanceRecordsAvailable"}
              isDisabled={false}
              options={
                fscAircraftState.areHistoricalMaintenanceRecordsAvailableOptions
              }
              validationMessage={
                fscAircraftState.validationMessage
                  .areHistoricalMaintenanceRecordsAvailableMsg
              }
              isRequired={true}
              onChange={handleToggleChange}
              className=""
              id="areHistoricalMaintenanceRecordsAvailable"
              label={"Are historical and Maintainence records available ?"}
              isInvalid={fscAircraftState.validationMessage.areHistoricalMaintenanceRecordsAvailableInvalid}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-12">
            <PPMSToggleRadio
              isInline={false}
              name={"isAircraftCertifiedByFAA"}
              isDisabled={false}
              options={fscAircraftState.isAircraftCertifiedByFAAOptions}
              validationMessage={
                fscAircraftState.validationMessage.isAircraftCertifiedByFAAMsg
              }
              onChange={handleToggleChange}
              isRequired={true}
              className=""
              id="isAircraftCertifiedByFAA"
              label={
                "Has aircraft been certificated by the Federal Aviations Administration ?"
              }
              isInvalid={fscAircraftState.validationMessage.isAircraftCertifiedByFAAInvalid}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-12">
            <PPMSToggleRadio
              isInline={false}
              name={"isAircraftMaintainedByFAA"}
              isRequired={true}
              isDisabled={false}
              options={fscAircraftState.isAircraftMaintainedByFAAOptions}
              validationMessage={
                fscAircraftState.validationMessage.isAircraftMaintainedByFAAMsg
              }
              onChange={handleToggleChange}
              className=""
              id="isAircraftMaintainedByFAA"
              label={
                "Has aircraft been maintained to Federal Aviations Administration standards ?"
              }
              isInvalid={fscAircraftState.validationMessage.isAircraftMaintainedByFAAInvalid}
            />
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-12">
            <PPMSToggleRadio
              isInline={false}
              isRequired={true}
              name={"isAircraftUsedNonFlightPurpose"}
              isDisabled={false}
              options={fscAircraftState.isAircraftUsedNonFlightPurposeOptions}
              validationMessage={
                fscAircraftState.validationMessage
                  .isAircraftUsedNonFlightPurposeMsg
              }
              onChange={handleAircraftUsedNonFlightPurpose}
              className=""
              id="isAircraftUsedNonFlightPurpose"
              label={"Has aircraft been used for non flight purpose?"}
              isInvalid={fscAircraftState.validationMessage.isAircraftUsedNonFlightPurposeInvalid}
            />
            {fscAircraftState.aircraftFSCData.isAircraftUsedNonFlightPurpose ? (
              <PPMSToggleCheckbox
                isInline={false}
                name={"nonFlightPurposeOptions"}
                isDisabled={false}
                options={fscAircraftState.nonFlightPurposeOptions}
                validationMessage={
                  fscAircraftState.validationMessage.nonFlightPurposeOptionsMsg
                }
                onChange={handleNonFlightPurposeChange}
                className=""
                id="nonFlightPurposeOptions"
                label={"If yes, then select all that apply "}
                isRequired={true}
                message={
                  !fscAircraftState.validationMessage
                    .nonFlightPurposeOptionsRequired
                    ? "Optional"
                    : null
                }
              />
            ) : (
              <div />
            )}

            {(agencyInfoState.agencyBureau.startsWith("21") ||
              agencyInfoState.agencyBureau.startsWith("17") ||
              agencyInfoState.agencyBureau.startsWith("57") ||
              agencyInfoState.agencyBureau.startsWith("97")) &&
            (UserUtils.hasPermission("NU") || UserUtils.hasPermission("SM")) ? (
              <PPMSToggleRadio
                isInline={false}
                name={"Military Aircraft Only"}
                isDisabled={false}
                options={fscAircraftState.militaryAirCraftOnly}
                validationMessage={
                  fscAircraftState.validationMessage.militaryAirCraftOnlyMsg
                }
                onChange={handleMilitaryAirCraftOnly}
                className=""
                id="militaryAircraftOnly"
                label={"Military Aircraft Only "}
                isRequired={true}
              />
            ) : (
              <div />
            )}
          </div>
        </div>

        <div className="grid-row grid-gap-4">
          <div className="tablet:grid-col-12">
            <PPMSInput
              id={"specialDescriptionText"}
              name={"specialDescriptionText"}
              label={"Special Description Text"}
              isRequired={false}
              message={"Optional"}
              isDisabled={false}
              inputType={"text"}
              value={fscState.fsc.specialDescriptionText}
              onChange={handleChange}
              validationMessage={""}
              maxLength={69}
              minLength={0}
              isInvalid={
                fscAircraftState.validationMessage.specialDescriptionTextInvalid
              }
              isValid={false}
            />
          </div>
        </div>
      </>
    );
  }, [fscAircraftState, fscState]);
}

export default FSCAircraft;


export function checkSelectedValueOptions(options: any[]) {
  let optionIsSelected: boolean = false;
  options.forEach((option) => {
    if(!option.isSelected && option.required){
      optionIsSelected = true;
    }
  });
  return optionIsSelected
}
export function setOptionRequiredField(options: any[]) {
  let optionIsSelected: boolean = false;
  options.forEach((option) => {
    if(option.isSelected){
      optionIsSelected = true;
    }
  });
  if(optionIsSelected){
    options.forEach((option) => {
      option.required = false;
    });
  }
  return options
}
