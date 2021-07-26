import {
  areHistoricalMaintenanceRecordsAvailableOptions,
  areMajorComponentsMissingOptions,
  isAircraftCertifiedByFAAOptions,
  isAircraftMaintainedByFAAOptions,
  isAircraftOperationalOptions,
  isAircraftUsedNonFlightPurposeOptions,
  isDataPlateAvailableOptions,
  isEngineMissingOptions,
  militaryAirCraftOnly,
  nonFlightPurposeOptions,
  otherMissingComponentsOptions,
} from "../../constants/Constants";
import { FSCAircraftData } from "./FSCModel";

export interface FSCAircraftState {
  areHistoricalMaintenanceRecordsAvailableOptions: any[];
  isDataPlateAvailableOptions: any[];
  areMajorComponentsMissingOptions: any[];
  isAircraftOperationalOptions: any[];
  isAircraftCertifiedByFAAOptions: any[];
  isAircraftMaintainedByFAAOptions: any[];
  isAircraftUsedNonFlightPurposeOptions: any[];
  isEngineMissingOptions: any[];
  otherMissingComponentsOptions: any[];
  nonFlightPurposeOptions: any[];
  militaryAirCraftOnly: any[];
  aircraftFSCData: FSCAircraftData;
  validationMessage: {
    manufacturerMsg: string;
    manufacturerValid: boolean;
    manufacturerInvalid: boolean;
    manufactureDateMsg: string;
    manufactureDateValid: boolean;
    manufactureDateInvalid: boolean;
    modelMsg: string;
    modelValid: boolean;
    modelInvalid: boolean;
    makeMsg: string;
    makeValid: boolean;
    makeInvalid: boolean;
    isAircraftOperationalMsg: string;
    areMajorComponentsMissingMsg: string;
    serialNumberMsg: string;
    serialNumberValid: boolean;
    serialNumberInvalid: boolean;
    isDataPlateAvailableMsg: string;
    areHistoricalMaintenanceRecordsAvailableMsg: string;
    isAircraftCertifiedByFAAMsg: string;
    isAircraftMaintainedByFAAMsg: string;
    isAircraftUsedNonFlightPurposeMsg: string;
    nonFlightPurposeOptionsMsg: string;
    isEngineMissingMsg: string;
    avionicsOtherNoMissingMsg: string;
    otherMissingComponentMsg: string;
    isEngineMissingRequiredFlag: boolean;
    avionicsOtherNoMissingRequiredFlag: boolean;
    isAvionicsOtherNosMissingSelected: boolean;
    nonFlightPurposeOptionsRequired: boolean;
    showerror: boolean;
    militaryAirCraftOnlyMsg: string;
    itemNameMsg: string;
    itemNameValid: boolean;
    itemNameInvalid: boolean;
    specialDescriptionTextMsg: string;
    specialDescriptionTextInvalid: boolean;
    specialDescriptionTextValid: boolean;
    areMajorEngineMissingRequiredFlag: boolean;

    isAircraftOperationalInvalid: boolean,
    isAircraftOperationalValid: boolean,
    areHistoricalMaintenanceRecordsAvailableInvalid: boolean,
    areHistoricalMaintenanceRecordsAvailableValid: boolean,
    isDataPlateAvailableInvalid: boolean,
    isDataPlateAvailableValid: boolean,
    areMajorComponentsMissingInvalid: boolean,
    areMajorComponentsMissingValid: boolean,
    isAircraftCertifiedByFAAInvalid: boolean,
    isAircraftCertifiedByFAAValid: boolean,
    isAircraftMaintainedByFAAInvalid: boolean,
    isAircraftMaintainedByFAAValid: boolean,
    isAircraftUsedNonFlightPurposeInvalid: boolean,
    isAircraftUsedNonFlightPurposeValid: boolean,
    isEngineMissingInvalid: boolean,
    isEngineMissingValid: boolean,
    avionicsOtherNoMissingInvalid: boolean,
    avionicsOtherNoMissingValid: boolean,
  };
}

export const FSCAircraftDefaults: FSCAircraftState = {
  aircraftFSCData: new FSCAircraftData(),
  areHistoricalMaintenanceRecordsAvailableOptions: areHistoricalMaintenanceRecordsAvailableOptions,
  isDataPlateAvailableOptions: isDataPlateAvailableOptions,
  areMajorComponentsMissingOptions: areMajorComponentsMissingOptions,
  isAircraftOperationalOptions: isAircraftOperationalOptions,
  isAircraftCertifiedByFAAOptions: isAircraftCertifiedByFAAOptions,
  isAircraftMaintainedByFAAOptions: isAircraftMaintainedByFAAOptions,
  isAircraftUsedNonFlightPurposeOptions: isAircraftUsedNonFlightPurposeOptions,
  isEngineMissingOptions: isEngineMissingOptions,
  otherMissingComponentsOptions: otherMissingComponentsOptions,
  nonFlightPurposeOptions: nonFlightPurposeOptions,
  militaryAirCraftOnly: militaryAirCraftOnly,

  validationMessage: {
    manufacturerMsg: "Manufacturer is Required.",
    manufacturerValid: false,
    manufacturerInvalid: false,
    manufactureDateMsg: "Manufacture Date is Required.",
    manufactureDateValid: false,
    manufactureDateInvalid: false,
    modelMsg: "Model is Required.",
    modelValid: false,
    modelInvalid: false,
    makeMsg: "Make is Required.",
    makeValid: false,
    makeInvalid: false,
    isAircraftOperationalMsg: "Aircraft Operational is Required.",
    areMajorComponentsMissingMsg: "Major Components Missing is Required.",
    serialNumberMsg: "Serial Number is Required.",
    serialNumberValid: false,
    serialNumberInvalid: false,
    isDataPlateAvailableMsg: "Dataplate is Required.",
    areHistoricalMaintenanceRecordsAvailableMsg:
      "Historical and Maintainence records available is Required.",
    isAircraftCertifiedByFAAMsg:
      "Has aircraft been certificated by the Federal Aviations Administration is Required.",
    isAircraftMaintainedByFAAMsg:
      "Has aircraft been maintained to Federal Aviations Administration standards is Required.",
    isAircraftUsedNonFlightPurposeMsg:
      "Has aircraft been used for non flight purpose is Required.",
    nonFlightPurposeOptionsMsg:
      "Select at least one Non Flight Purpose Option.",
    isEngineMissingMsg: "",
    avionicsOtherNoMissingMsg: "Select engine missing or others from the list.",
    otherMissingComponentMsg: "",
    isEngineMissingRequiredFlag: false,
    avionicsOtherNoMissingRequiredFlag: false,
    isAvionicsOtherNosMissingSelected: false,
    nonFlightPurposeOptionsRequired: false,
    showerror: false,
    militaryAirCraftOnlyMsg: "Select Military Aircarft Only Option",
    itemNameMsg: "Item Name is Required.",
    itemNameValid: false,
    itemNameInvalid: false,
    specialDescriptionTextMsg: "Special Description Text is Required.",
    specialDescriptionTextInvalid: false,
    specialDescriptionTextValid: false,
    areMajorEngineMissingRequiredFlag: false,
    isAircraftOperationalInvalid: false,
    isAircraftOperationalValid: false,

    areHistoricalMaintenanceRecordsAvailableInvalid: false,
    areHistoricalMaintenanceRecordsAvailableValid: false,
    isDataPlateAvailableInvalid: false,
    isDataPlateAvailableValid: false,
    areMajorComponentsMissingInvalid: false,
    areMajorComponentsMissingValid: false,
    isAircraftCertifiedByFAAInvalid: false,
    isAircraftCertifiedByFAAValid: false,
    isAircraftMaintainedByFAAInvalid: false,
    isAircraftMaintainedByFAAValid: false,
    isAircraftUsedNonFlightPurposeInvalid: false,
    isAircraftUsedNonFlightPurposeValid: false,
    isEngineMissingInvalid: false,
    isEngineMissingValid: false,
    avionicsOtherNoMissingInvalid: false,
    avionicsOtherNoMissingValid: false,

  },
};
