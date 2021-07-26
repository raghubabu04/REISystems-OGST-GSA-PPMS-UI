import React, { useContext, useEffect, useMemo } from "react";
import FSCVehicle from "./FSC-vehicle";
import FSCAircraft from "./FSC-aircraft";
import FSCTrailer from "./FSC-trailer";
import FSCOther from "./FSC-Other";
import {
  isEmptyCheck,
  validateDemilitarization,
  validateFSC,
} from "../validations/propertyFieldValidations";
import validateFSCSalesCenter from "../validations/validateFSCSalesCenter";

import {
  FSCAircraftData,
  FSCComputerData,
  FSCModel,
  FSCOtherData,
  FSCTrailerData,
  FSCVehicleData,
  FSCVesselData,
  FSCWeaponData,
} from "./model/FSCModel";

import {
  aircraftFSCCode,
  federalSalesCenterTypes,
  federalSalesCenterTypesForSalesUsers,
  restrictedFSCCode,
  vehicleFSCCode,
  vesselFSCCode,
  weaponsFSCCode,
} from "../constants/Constants";

import { computersFSCCode } from "../constants/ComputerConstants";
import { FSCWeapons } from "./FSC-weapons";
import FSCComputers from "./FSC-computers";
import { FederalAssetSalesCenterInfo } from "./FederalAssetSalesCenterInfo";
import { PropertyContext } from "../PropertyContext";
import PPMSMultiSelect from "../../../../ui-kit/components/PPMS-multi-select";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleCheckbox } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import FSCVessel from "./FSC-vessel";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { UserUtils } from "../../../../utils/UserUtils";
interface FSCProps {}

export function FederalSupplyClass(props: FSCProps) {
  const {
    icnState,
    fscState,
    updateFSCState,
    agencyInfoState,
    propertyInfoState,
    propertyLocationState,
    additionalInfoState,
    propertyReportState,
    fscAircraftState,
    updateAdditionalInfoState,
    updatePropertyInfoState,
    updateERDAndSRD,
    fscVesselState,
    updateFSCVesselState,
    updateFscAircraftState,
    fscTrailerState,
    updateFSCTrailerState,
    fscComputerState,
    updateFSCComputerState,
    fscVehicleState,
    updateFSCVehicleState,
    unitOfIssueState,
    updateUnitOfIssueState,
  } = useContext(PropertyContext);
  let fsc = !isEmptyCheck(propertyReportState.propertyId)
    ? fscState.fsc
    : new FSCModel();

  function handleNIINChange(event: any) {
    let niinValue = event.target.value;
    if (isNaN(niinValue)) {
      updateFSCState({
        niinInvalid: true,
        niinValid: false,
        niinValidationMessage: "NIIN should be numeric only.",
      });
    } else if (niinValue != "" && niinValue.length < 9) {
      updateFSCState({
        niin: event.target.value,
        niinInvalid: true,
        niinValid: false,
        niinValidationMessage: "NIIN should be 9 numeric digits",
      });
      fsc.niin = event.target.value;
      updateFSC(fsc);
    } else {
      updateFSCState({
        niin: event.target.value,
        niinInvalid: false,
        niinValid: true,
        niinValidationMessage: "",
      });
      fsc.niin = event.target.value;
      updateFSC(fsc);
    }
  }

  function handleFederalSalesCenterChange(event: any) {
    let selectedFederalSalesCenterValue = event.target.value;
    fsc.federalSalesCenter = event.target.value;

    updateFSC(fsc);
    updatePropertyInfoState({
      isAppropriationTasDisabled:
        propertyInfoState.propType === "PR" && event.target.value !== "G",
      amountTobeReimbursed:
        propertyInfoState.propType === "PR" && event.target.value !== "G"
          ? ""
          : propertyInfoState.amountTobeReimbursed,
      reimbursementIsReq:
        propertyInfoState.propType === "PR" && event.target.value !== "G"
          ? "N"
          : "P",
    });

    // PPDMS:763 -Validate "Federal Asset Sales Center"
    let validatedSalesCenter = validateFSCSalesCenter(
      selectedFederalSalesCenterValue,
      fscState.data.fscCode,
      icnState.aacCode,
      propertyLocationState.propStateCode,
      agencyInfoState.aac
    );

    // PPDMS:763 -Update FSCState after Validation"
    updateFSCState({
      federalSalesCenter: selectedFederalSalesCenterValue,
      fcsSelectedValue: selectedFederalSalesCenterValue,
      isSalesCenterValid: !validatedSalesCenter.isSalesCenterInValid,
      isSalesCenterInvalid: validatedSalesCenter.isSalesCenterInValid,
      salesCenterValidationMessage:
        validatedSalesCenter.salesCenterValidationMessage,
      isSalesCenterdisabled: validatedSalesCenter.isSalesCenterdisabled,
    });

    //PPDMS-2554 Validate Demiliterization against Approved Waiver in Federal Sales Center
    validateDemilitarizationAfterFederalSalesCenterChange(
      additionalInfoState.demilitarization,
      selectedFederalSalesCenterValue
    );
  }

  function validateDemilitarizationAfterFederalSalesCenterChange(
    selectedDemilitarizationValue: string,
    selectedFederalAssetSalesCenter = fscState.fcsSelectedValue
  ) {
    let validation = validateDemilitarization(
      selectedDemilitarizationValue,
      selectedFederalAssetSalesCenter
    );

    updateAdditionalInfoState({
      demilitarization: selectedDemilitarizationValue,
      demilitarizationIsInvalid: validation.isInvalid,
      demilitarizationlIsValid: !validation.isInvalid,
      demilitarizationErrorMsg: validation.errorMsg,
    });
  }

  function updateFSC(value: any) {
    fsc.vehicle = fsc.vehicle ? fsc.vehicle : new FSCVehicleData();
    fsc.vessel = fsc.vessel ? fsc.vessel : new FSCVesselData();
    fsc.weapon = fsc.weapon ? fsc.weapon : new FSCWeaponData();
    fsc.aircraft = fsc.aircraft ? fsc.aircraft : new FSCAircraftData();
    fsc.other = fsc.other ? fsc.other : new FSCOtherData();
    fsc.computer = fsc.computer ? fsc.computer : new FSCComputerData();
    fsc.trailerHome = fsc.trailerHome ? fsc.trailerHome : new FSCTrailerData();
    if (fscState.data.fscCategory === "vehicle") {
      fsc.make = value.vehicle ? value.vehicle.make : "";
      fsc.model = value.vehicle ? value.vehicle.model : "";
      fsc.itemName = value.vehicle ? value.vehicle.itemName : "";
      fsc.specialDescriptionCode = value?.vehicle
        ? value.vehicle.specialDescriptionCode
        : "";
      fsc.specialDescriptionText = value?.vehicle
        ? value.vehicle.specialDescriptionText
        : "";
      fsc.vehicle = value?.vehicle;
    } else if (fscState.data.fscCategory === "vessel") {
      fsc.vessel = value?.vessel;
      fsc.make = value?.vessel?.make;
      fsc.model = value?.vessel?.model;
      fsc.itemName = value?.vessel ? value?.vessel?.itemName : "";
      fsc.specialDescriptionCode = value?.vessel
        ? value?.vessel?.specialDescriptionCode
        : "";
      fsc.specialDescriptionText = value?.vessel
        ? value?.vessel?.specialDescriptionText
        : "";
      //Model is a required field for vessels over 50ft
      if (value.vessel.isVessel50FeetOrOver) {
        updateFSCState({
          modelIsRequired: true,
          isOver50feet: true,
        });
        updateAdditionalInfoState({
          manufactureIsRequired: true,
          dateOfManufactureIsRequired: true,
          manufacturerValueMsg: "Manufacturer is required",
          dateOfManufactureMsg: "Date of Manufacture is required",
        });
      } else if (value.vessel.isVessel50FeetOrOver === false) {
        updateFSCState({
          modelIsRequired: false,
          isOver50feet: false,
        });
        updateAdditionalInfoState({
          manufactureIsRequired: false,
          dateOfManufactureIsRequired: false,
          manufacturerIsInValid: false,
          dateOfManufactureIsInValid: false,
          manufacturerValueMsg: "",
          dateOfManufactureMsg: "",
        });
      }
    } else if (fscState.data.fscCategory === "weapon") {
      fsc.specialDescriptionCode = value.weapon
        ? value.weapon.specialDescriptionCode
        : "";
      fsc.make = value.weapon ? value.weapon.make : "";
      fsc.model = value.weapon ? value.weapon.model : "";
      fsc.weapon = value.weapon;
    } else if (fscState.data.fscCategory === "aircraft") {
      fsc.specialDescriptionCode = value?.aircraft?.serialNumber
        ? value.aircraft.serialNumber
        : "";
      fsc.make = value.make;
      fsc.model = value.model;
      fsc.aircraft = value.aircraft;
      updateAdditionalInfoState({
        manufactureIsRequired: true,
        dateOfManufactureIsRequired: true,
        manufacturerValueMsg: "Manufacturer is required",
        dateOfManufactureMsg: "Date of Manufacture is required",
      });
    } else if (fscState.data.fscCategory === "other") {
      fsc.make = value?.other ? value?.other?.make : "";
      fsc.model = value?.other ? value?.other?.model : "";
      fsc.itemName = value?.other ? value?.other?.itemName : "";
      fsc.specialDescriptionCode = value?.other
        ? value?.other?.specialDescriptionCode
        : "";
      fsc.specialDescriptionText = value?.other
        ? value.other.specialDescriptionText
        : "";
      fsc.other = value.other;
    } else if (fscState.data.fscCategory === "computer") {
      fsc.make = value.computer.make;
      fsc.model = value.computer.computerModel;
      fsc.computer.hardwareType = value.computer.hardwareType;
      fsc.computer.equipmentType = value.computer.equipmentType;
      fsc.computer.processorType = value.computer.processorType;
      fsc.computer.processingSpeed = value.computer.processingSpeed;
      fsc.computer.ram = value.computer.ram;
      fsc.computer.hardDiskSize = value.computer.hardDiskSize;
      fsc.computer.hardDiskStatus = value.computer.hardDiskStatus;
      fsc.computer.isEquipmentForComputersForLearning =
        value.computer.isEquipmentForComputersForLearning;
      fsc.computer.isEquipmentForComputersForLearningEligible =
        value.computer.isEquipmentForComputersForLearningEligible;
    } else if (fscState.data.fscCategory === "trailer") {
      if (value.trailer) {
        fsc.make = value.trailer.make;
        fsc.model = value.trailer.model;
        fsc.trailerHome.bodyStyle = value.trailer.bodyStyle;
        fsc.trailerHome.modelYear = value.trailer.modelYear;
        fsc.trailerHome.vin = value.trailer.vin;
        fsc.trailerHome.length = value.trailer.length;
        fsc.trailerHome.barcode = value.trailer.barcode;
        fsc.trailerHome.isSlideOut = value.trailer.isSlideOut;
        fsc.trailerHome.isAwning = value.trailer.isAwning;
        fsc.trailerHome.isNeitherTrailerType =
          value.trailer.isNeitherTrailerType;
        fsc.trailerHome.numberOfAxles = value.trailer.numberOfAxles;
        fsc.trailerHome.numberOfBedrooms = value.trailer.numberOfBedrooms;
        fsc.trailerHome.numberOfBathrooms = value.trailer.numberOfBathrooms;
        fsc.trailerHome.windZone = value.trailer.windZone;
      }
    }
    fsc.fscCode = fscState.data.fscCode;

    updateFSCState({ fsc: fsc });
  }

  function handleSpecialInstructionsChange(values: any) {
    let selectedValue = values.filter((item) => {
      return item.isSelected;
    });
    if (selectedValue.length > 0) {
      updateFSCState({ specialInstructions: selectedValue[0].value });
      fsc.specialInstructions = selectedValue[0].value;
      updateFSC(fsc);
    } else {
      updateFSCState({ specialInstructions: "" });
      fsc.specialInstructions = "";
      updateFSC(fsc);
    }
  }

  function handleChange(value: any) {
    let { data } = fscState;
    resetFscComputer();
    resetFscTrailer();
    //PPDMS-5226 By Default all radio buttons are defaulted to "N0". But according to PPDMS-632 user should select value.
    resetFscVessel();
    if (value?.length > 0) {
      const code = value[0].code;
      //hide and show the corresponding form fields based on the selected FSC Code
      if (vehicleFSCCode.find((vehicleCode) => code === vehicleCode)) {
        data.fscCategory = "vehicle";
        resetFscVehicle();
      } else if (vesselFSCCode.find((vesselCode) => code === vesselCode)) {
        data.fscCategory = "vessel";
      } else if (weaponsFSCCode.find((weaponsCode) => code === weaponsCode)) {
        data.fscCategory = "weapon";
      } else if (
        computersFSCCode.find((computersCode) => code === computersCode)
      ) {
        data.fscCategory = "computer";
      } else if (
        aircraftFSCCode.find((aircraftCode) => code === aircraftCode)
      ) {
        data.fscCategory = "aircraft";
        resetFscAircraft();
      } else if (
        (code === "2330" && fscState.aacCode === "703112") ||
        (code === "2331" && /^70\d\d$/.test(fscState.agencyCode))
      ) {
        data.fscCategory = "trailer";
      } else {
        data.fscCategory = "other";
      }
      let FSCrequiringApprovedWaiver = [
        "1005",
        "1010",
        "1015",
        "1020",
        "1025",
        "1030",
        "1035",
      ];
      if (FSCrequiringApprovedWaiver.includes(code)) {
        fscState.fcsSelectedValue = "N";
      }
      data.fscCode = code;

      updateFSCState({ validateFscSection: true });
    } else {
      data.fscCode = "";
      data.fscCategory = "";
      fscState.fcsSelectedValue = "G";
      updateFSCState({ validateFscSection: false });
    }

    // checkForMandatoryFields(data.fscCode);
    checkForMandatoryFields(
      data.fscCode,
      fsc,
      fscState,
      updateFSCState,
      updateFieldRequired,
      updateFSC
    );
    let aacValue = icnState.aacCode;
    let agencyBureau = agencyInfoState.agencyBureau;
    let exchangeSaleFlag = propertyInfoState.isExchangeSales;
    let disposalCode = additionalInfoState.condition;

    if (data.fscCode.startsWith("66") && agencyInfoState.aac.startsWith("89")) {
      updateAdditionalInfoState({
        isDropAfterInternalScreeningRequired: agencyInfoState.isInternalAgency,
        //by default set value of dropAfterInternalScreening to "Yes"
        dropAfterInternalScreening: agencyInfoState.isInternalAgency,
      });
    }

    if (!UserUtils.isSalesUser()) {
      updateERDAndSRD(
        exchangeSaleFlag,
        aacValue,
        agencyBureau,
        fscVesselState.vesselFSCData.isVessel50FeetOrOver,
        propertyInfoState.agencyControlNumber,
        disposalCode,
        null,
        fsc.fscCode,
        additionalInfoState.screeningDays,
        agencyInfoState.isInternalAgency,
        propertyReportState.isSubmitted,
        propertyReportState.submittedDate,
        true
      );
    }
    fsc.fscCode = data.fscCode;
    updateFSCState({ data });
    updateFSC(fsc);
    let validation = validateFSC(
      propertyInfoState.agencyControlNumber,
      fscState.data.fscCode,
      agencyBureau
    );

    let isAACrestrictedforSalesCenter = fscState.isSalesCenterdisabled;

    if (!isAACrestrictedforSalesCenter) {
      // PPDMS:763 -Validate "Federal Asset Sales Center" against "Federal Supply Class/National Stock Number"
      let fscValidation = validateFSCSalesCenter(
        fscState.fcsSelectedValue,
        fscState.data.fscCode,
        icnState.aacCode,
        propertyLocationState.propStateCode,
        agencyInfoState.aac
      );
      // PPDMS:763 -Update FSCState after Validation"
      updateFSCState({
        isValid: !validation.isFscInvalid,
        isInvalid: validation.isFscInvalid,
        validationMessage: validation.fscValidationError,
        triggerValidation: validation.isFscInvalid,
        //Update SalesCenter Validation
        isSalesCenterValid: !fscValidation.isSalesCenterInValid,
        isSalesCenterInvalid: fscValidation.isSalesCenterInValid,
        salesCenterValidationMessage:
          fscValidation.salesCenterValidationMessage,
        federalAssetSalesCenterdisabled: fscValidation.isSalesCenterdisabled,
      });
    }

    updatePropertyInfoState({
      isACNVAlid: !validation.isACNInvalid,
      isACNInValid: validation.isACNInvalid,
      acnValidationMessage: validation.acnvalidationError,
    });

    //PPDMS:2191 - Update Unit of Issue Quantity on category change
    if (
      restrictedFSCCode.includes(data.fscCode) &&
      parseInt(unitOfIssueState.quantity) > 1
    ) {
      updateUnitOfIssueState({
        quantityValidationMessage:
          "Quantity cannot be more than 1 for this FSC",
        quantityIsInvalid: true,
        quantityIsValid: false,
      });
    } else {
      updateUnitOfIssueState({
        quantityValidationMessage: "",
        quantityIsInvalid: false,
        quantityIsValid: false,
      });
    }
  }

  /*
  export function checkForMandatoryFields(value: any) {
    //Check for FSC codes where make will be required
    let codeWasFound = false;
    for (let code of fscState.makeRequiredCodeList) {
      if (value === code) {
        codeWasFound = true;
        updateFSCState({ makeIsRequired: true });
      }
    }
    //For when user selects non mandatory code after selecting a true one
    if (!codeWasFound) {
      updateFSCState({
        makeIsRequired: false,
      });
    }
    //Item name required check to be put here
    updateFSCState({
      itemNameIsRequired: true,
    });
    codeWasFound = false;
    //Check for FSC codes where model will be required
    for (let code of fscState.modelRequiredCodeList) {
      if (value === code) {
        codeWasFound = true;
        updateFSCState({ modelIsRequired: true });
      }
    }
    if (!codeWasFound && !fscState.isOver50feet) {
      updateFSCState({
        modelIsRequired: false,
      });
    }

    updateFieldRequired(
      value,
      fscState.manufactureRequiredCodeList,
      "manufactureIsRequired"
    );

    updateFieldRequired(
      value,
      fscState.manufactureDateRequiredCodeList,
      "dateOfManufactureIsRequired"
    );

    updateFSC(fsc);
  }
*/

  function updateFieldRequired(value, requiredList, updateFieldName) {
    let codeWasFound = false;
    for (let code of requiredList) {
      if (value === code) {
        codeWasFound = true;
        updateAdditionalInfoState({
          [updateFieldName]: true,
        });
        updateFSCState({
          [updateFieldName]: true,
        });
      }
    }
    if (!codeWasFound) {
      updateAdditionalInfoState({
        [updateFieldName]: false,
      });
      updateFSCState({
        [updateFieldName]: false,
      });
    }
  }

  function resetFscAircraft() {
    fscAircraftState.aircraftFSCData = new FSCAircraftData();

    updateFscAircraftState({
      isAircraftOperationalOptions: [
        {
          value: "Yes",
          id: "Y",
          isSelected: false,
          required: true,
          field: "isAircraftOperational",
        },
        {
          value: "No",
          id: "N",
          isSelected: false,
          required: true,
          field: "isAircraftOperational",
        },
      ],

      areHistoricalMaintenanceRecordsAvailableOptions: [
        {
          value: "Yes",
          id: "Y",
          isSelected: false,
          required: true,
          field: "areHistoricalMaintenanceRecordsAvailable",
        },
        {
          value: "No",
          id: "N",
          isSelected: false,
          required: true,
          field: "areHistoricalMaintenanceRecordsAvailable",
        },
      ],
      isDataPlateAvailableOptions: [
        {
          value: "Yes",
          id: "Y",
          isSelected: false,
          required: true,
          field: "isDataPlateAvailable",
        },
        {
          value: "No",
          id: "N",
          isSelected: false,
          required: true,
          field: "isDataPlateAvailable",
        },
      ],
      areMajorComponentsMissingOptions: [
        {
          value: "Yes",
          id: "Y",
          isSelected: false,
          required: true,
          field: "areMajorComponentsMissing",
        },
        {
          value: "No",
          id: "N",
          isSelected: false,
          required: true,
          field: "areMajorComponentsMissing",
        },
      ],
      isAircraftCertifiedByFAAOptions: [
        {
          value: "Yes",
          id: "Y",
          isSelected: false,
          required: true,
          field: "isAircraftCertifiedByFAA",
        },
        {
          value: "No",
          id: "N",
          isSelected: false,
          required: true,
          field: "isAircraftCertifiedByFAA",
        },
      ],
      isAircraftMaintainedByFAAOptions: [
        {
          value: "Yes",
          id: "Y",
          isSelected: false,
          required: true,
          field: "isAircraftMaintainedByFAA",
        },
        {
          value: "No",
          id: "N",
          isSelected: false,
          required: true,
          field: "isAircraftMaintainedByFAA",
        },
      ],
      isAircraftUsedNonFlightPurposeOptions: [
        {
          value: "Yes",
          id: "Y",
          isSelected: false,
          required: true,
          field: "isAircraftUsedNonFlightPurpose",
        },
        {
          value: "No",
          id: "N",
          isSelected: false,
          required: true,
          field: "isAircraftUsedNonFlightPurpose",
        },
      ],
      isEngineMissingOptions: [
        {
          id: "EM",
          value: "Engine Missing",
          isSelected: false,
          required: true,
          field: "isEngineMissing",
        },
      ],
      otherMissingComponentsOptions: [
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
      ],
      nonFlightPurposeOptions: [
        {
          id: "isGroundTraining",
          value: "Ground Training",
          isSelected: false,
          field: "nonFlightPurpose",
          required: true,
        },
        {
          id: "isStaticDisplay",
          value: "Static Display",
          isSelected: false,
          required: true,
        },
        {
          id: "isExtensiveDisassemblyAndReassembly",
          value: "Extensive Disassemby and re-assembly",
          isSelected: false,
          required: true,
        },
        {
          id: "isRepeatedBurningForFireFightingTraining",
          value: "Repeated burning for fire-fighting training",
          isSelected: false,
          required: true,
        },
        {
          id: "isExtensiveCannibalization",
          value: "Extensive cannibalization",
          isSelected: false,
          required: true,
        },
      ],
      militaryAirCraftOnly: [
        {
          id: "isAircraftAuthorizedForSaleAndExchangeForCommUse",
          value: "Aircraft Authorized for sale and exchange for commercial use",
          isSelected: false,
        },
        {
          id: "isAircraftPreviouslyUsedForInstrAndOrStaticDisp",
          value:
            "Aircraft previously used for ground instruction and/or static display",
          isSelected: false,
        },
        {
          id: "isAircraftCombatConfAsDeterminedByDod",
          value: "Aircraft that are combat configured as determined by DoD",
          isSelected: false,
        },
      ],
    });
  }

  function resetFscVehicle() {
    fscVehicleState.vehicleFSCData = new FSCVehicleData();
    updateFSCVehicleState({
      recallOptions: [
        { value: "Yes", id: "Y", isSelected: false, required: true },
        { value: "No", id: "N", isSelected: false, required: true },
      ],
      transmissionTypeOptions: [
        {
          id: "A",
          value: "Automatic",
          isSelected: false,
          required: true,
          field: "transmissionType",
        },
        {
          id: "M",
          value: "Manual",
          isSelected: false,
          required: true,
          field: "transmissionType",
        },
      ],
    });
  }

  function resetFscComputer() {
    fscComputerState.fscComputersData = new FSCComputerData();
    updateFSCComputerState({
      hardwareType: "",
      equipmentType: "",
      processorType: "",
      hardDiskSize: "",
      processingSpeed: "",
      ram: "",
      hardDiskStatusOptions: selectedValueOptions(
        fscComputerState.hardDiskStatusOptions,
        [""]
      ),
      isEquipmentForComputersForLearning: selectedValueOptions(
        fscComputerState.isEquipmentForComputersForLearningOptions,
        fscComputerState.fscComputersData.isEquipmentForComputersForLearning
          ? ["Y"]
          : ["N"]
      ),
      isEquipmentForComputersForLearningEligible: selectedValueOptions(
        fscComputerState.cflEligibleOptions,
        [""]
      ),
    });
  }

  function resetFscTrailer() {
    fscTrailerState.trailerFSCData = new FSCTrailerData();
    updateFSCTrailerState({
      bodyStyle: "",
      modelYear: "",
      vin: "",
      length: "",
      barcode: "",
      isSlideOut: null,
      isAwning: null,
      isNeitherTrailerType: null,
      numberOfAxles: "",
      numberOfBedrooms: "",
      numberOfBathrooms: "",
      windZone: "",
    });
  }

  function resetFscVessel() {
    fscVesselState.vesselFSCData = new FSCVesselData();
    updateFSCVesselState({
      asbestosTypes: selectedValueOptions(fscVesselState.asbestosTypes, [""]),
      areMajorComponentsMissingOptions: selectedValueOptions(
        fscVesselState.areMajorComponentsMissingOptions,
        [""]
      ),
      doesVesselHaveAsbestosOptions: selectedValueOptions(
        fscVesselState.doesVesselHaveAsbestosOptions,
        [""]
      ),
      doesVesselHavePCSOptions: selectedValueOptions(
        fscVesselState.doesVesselHavePCBOptions,
        [""]
      ),
      isSurveyAvailableOptions: selectedValueOptions(
        fscVesselState.isSurveyAvailableOptions,
        [""]
      ),
      isVessel50FeetOrOverOptions: selectedValueOptions(
        fscVesselState.isVessel50FeetOrOverOptions,
        fscVesselState.vesselFSCData.isVessel50FeetOrOver ? ["Y"] : ["N"]
      ),
      missingOptions: selectedValueOptions(fscVesselState.missingOptions, [
        "",
        "",
        "",
      ]),
      isVesselInspectedOptions: selectedValueOptions(
        fscVesselState.isVesselInspectedOptions,
        [""]
      ),
      isVesselSeaworthyOptions: selectedValueOptions(
        fscVesselState.isVesselSeaworthyOptions,
        [""]
      ),
    });
    fscState.fsc.itemName = "";
    fscState.niin = "";
    fscState.fsc.make = "";
    fscState.fsc.model = "";
    fscState.fsc.specialDescriptionCode = "";
    fscState.fsc.specialDescriptionText = "";
    fscState.specialInstructions = "";
  }

  function selectedValueOptions(options: any[], selectedValues: any[]) {
    options.forEach((option) => {
      option.isSelected = selectedValues.includes(option.id);
    });
    return options;
  }

  useEffect(() => {
    let commonApiService = new CommonApiService();
    commonApiService
      .getFSCCodes()
      .then((response: any) => {
        updateFSCState({ fscOptions: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return useMemo(() => {
    return (
      <>
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
                    "Federal Supply Class / National Stock Number is Required.",
                  isInvalid: true,
                });
              }}
              triggerValidation={fscState.triggerValidation}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-row"}>
            <PPMSSelect
              selectName={"federal-sales-center"}
              label={"Federal Asset Sales Center"}
              values={
                !UserUtils.isSalesUser()
                  ? federalSalesCenterTypes
                  : federalSalesCenterTypesForSalesUsers
              }
              isRequired={true}
              onChange={handleFederalSalesCenterChange}
              identifierValue={"value"}
              identifierKey={"id"}
              isInvalid={fscState.isSalesCenterInvalid}
              isValid={fscState.isSalesCenterValid}
              infoTipContent={<FederalAssetSalesCenterInfo />}
              infoTipClass={"ppms-usa-input-info-body"}
              selectedValue={fscState.fcsSelectedValue}
              validationMessage={fscState.salesCenterValidationMessage}
              disabled={fscState.isSalesCenterdisabled}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            <PPMSInput
              id={"reporting-NIIN"}
              name={"excessReportingNIIN"}
              label={"National Item Identification Number (NIIN)"}
              isRequired={false}
              isDisabled={false}
              inputType={"text"}
              value={fscState.niin}
              onChange={(event) => {
                updateFSCState({
                  niin: event.target.value,
                });
                fsc.niin = event.target.value;
                updateFSC(fsc);
              }}
              onBlur={handleNIINChange}
              maxLength={9}
              minLength={0}
              isInvalid={fscState.niinInvalid}
              isValid={fscState.niinValid}
              validationMessage={fscState.niinValidationMessage}
              className={"big-label"}
            />
          </div>
        </div>
        <PPMSToggleCheckbox
          id={"special-instruction"}
          options={fscState.specialInstructionsOptions}
          isInline={false}
          isDisabled={false}
          name={"specialInstructions"}
          className={"inventory"}
          label={"Special Instructions:"}
          validationMessage={""}
          isSingleSelect={true}
          onChange={handleSpecialInstructionsChange}
        />
        {fscState.data.fscCategory === "vehicle" ? (
          <>
            <FSCVehicle
              updateFSCVehicle={updateFSC}
              makeIsRequired={fscState.makeIsRequired}
              modelIsRequired={fscState.modelIsRequired}
              validateFscSection={fscState.validateFscSection}
            />
          </>
        ) : (
          <div />
        )}
        {fscState.data.fscCategory === "vessel" ? (
          <>
            <FSCVessel
              updateFSCVessel={updateFSC}
              fscState={fscState}
              validateFscSection={fscState.validateFscSection}
            />
          </>
        ) : (
          <div />
        )}
        {fscState.data.fscCategory === "weapon" ? (
          <>
            <FSCWeapons
              fscCode={fscState.data.fscCode}
              updateFSCWeapons={updateFSC}
              triggerValidation={fscState.triggerValidation}
              validateFscSection={fscState.validateFscSection}
            />
          </>
        ) : (
          <div />
        )}
        {fscState.data.fscCategory === "computer" ? (
          <>
            <FSCComputers
              fscCode={fscState.data.fscCode}
              updateFSCComputers={updateFSC}
              validateFscSection={fscState.validateFscSection}
            />
          </>
        ) : (
          <div />
        )}
        {fscState.data.fscCategory === "trailer" ? (
          <>
            <FSCTrailer
              updateFSCTrailer={updateFSC}
              aacCode={fscState.aacCode}
              validateFscSection={fscState.validateFscSection}
            />
          </>
        ) : (
          <div />
        )}
        {fscState.data.fscCategory === "aircraft" ? (
          <>
            <FSCAircraft
              updateFSCAircraft={updateFSC}
              modelIsRequired={fscState.modelIsRequired}
              agencyBureau={agencyInfoState.agencyBureau}
              validateFscSection={fscState.validateFscSection}
            />
          </>
        ) : (
          <div />
        )}
        {fscState.data.fscCategory === "other" ? (
          <>
            <FSCOther
              updateFSCOther={updateFSC}
              makeIsRequired={fscState.makeIsRequired}
              modelIsRequired={fscState.modelIsRequired}
              itemNameIsRequired={fscState.itemNameIsRequired}
              specialDescriptionCodeIsRequired={
                fscState.specialDescriptionCodeIsRequired
              }
              specialDescriptionTextIsRequired={
                fscState.specialDescriptionTextIsRequired
              }
              validateFSCOtherSection={fscState.validateFscSection}
            />
          </>
        ) : (
          <div />
        )}
      </>
    );
  }, [
    fscState,
    propertyInfoState,
    agencyInfoState,
    additionalInfoState,
    unitOfIssueState,
  ]);
}
export function checkForMandatoryFields(
  value: any,
  fsc,
  fscState,
  updateFSCState,
  updateFieldRequired,
  updateFSC
) {
  //Check for FSC codes where make will be required
  let codeWasFound = false;
  for (let code of fscState.makeRequiredCodeList) {
    if (value === code) {
      codeWasFound = true;
      updateFSCState({ makeIsRequired: true });
    }
  }
  //For when user selects non mandatory code after selecting a true one
  if (!codeWasFound) {
    updateFSCState({
      makeIsRequired: false,
    });
  }
  //Item name required check to be put here
  updateFSCState({
    itemNameIsRequired: true,
  });
  codeWasFound = false;
  //Check for FSC codes where model will be required
  for (let code of fscState.modelRequiredCodeList) {
    if (value === code) {
      codeWasFound = true;
      updateFSCState({ modelIsRequired: true });
    }
  }
  if (!codeWasFound && !fscState.isOver50feet) {
    updateFSCState({
      modelIsRequired: false,
    });
  }

  updateFieldRequired(
    value,
    fscState.manufactureRequiredCodeList,
    "manufactureIsRequired"
  );

  updateFieldRequired(
    value,
    fscState.manufactureDateRequiredCodeList,
    "dateOfManufactureIsRequired"
  );

  updateFSC(fsc);
}
