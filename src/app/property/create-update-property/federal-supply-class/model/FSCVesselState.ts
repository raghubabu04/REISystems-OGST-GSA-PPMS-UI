import {
  areMajorComponentsMissingOptions,
  asbestosTypes,
  doesVesselHaveAsbestosOptions,
  doesVesselHavePCBOptions,
  isSurveyAvailableOptions,
  isVessel50FeetOrOver,
  isVesselInspectedOptions,
  isVesselSeaworthyOptions,
  missingOptions,
} from "../../constants/Constants";
import { FSCVesselData } from "./FSCModel";

export interface FSCVesselState {
  vesselFSCData: FSCVesselData;

  nameOfVesselMsg: string;
  nameOfVesselValid: boolean;
  manufacturerMsg: string;
  manufactureValid: boolean;
  manufacturerInvalid: boolean;
  manufactureDateMsg: string;
  manufactureDateValid: boolean;
  manufactureDateInvalid: boolean;
  hullIdMsg: string;
  hullIdValid: boolean;
  isVesselSeaworthyMsg: string;
  lengthMsg: string;
 lengthValid: boolean;
  beamMsg: string;
 beamValid: boolean;
  draftMsg: string;
 draftValid: boolean;
  areMajorComponentsMissingMsg: string;
  componentTyoeMsg: string;
  typesOfEngineMsg: string;
  typesOfEngineValid: boolean;
  hoursOnEngineMsg: string;
  hoursOnEngineValid: boolean;
  doesVesselHavePCBMsg: string;
  doesVesselHaveAsbestosMsg: string;
  asbestosTypeMsg: string;
  isVesselInspectedMsg: string;
  isMarineSurveyAvailableMsg: string;
  componentsMissingDisable: boolean;
  asbestosTypeDisable: boolean;
  modelMsg: string;
  modelValid: boolean;
  modelInvalid: boolean;
  makeMsg: string;
  makeValid: boolean;
  makeInvalid: boolean;
  itemNameMsg: string;
  itemNameValid: boolean;
  itemNameInvalid: boolean;
  validationMsg: {
    specialDescriptionCodeMsg: string;
    specialDescriptionCodeValid: boolean;
    specialDescriptionCodeInvalid: boolean;

    nameOfVesselInvalid: boolean;
    hullIdInvalid: boolean;
    lengthInvalid: boolean;
    beamInvalid: boolean;
    draftInvalid: boolean;
    typesOfEngineInvalid: boolean;
    hoursOnEngineInvalid: boolean;
    isVesselSeaworthyInvalid: boolean;
    areMajorComponentsMissingInvalid: boolean;
    doesVesselHavePCBInvalid: boolean;
    doesVesselHaveAsbestosInvalid: boolean;
    isVesselInspectedInvalid: boolean;
    isSurveyAvailableInvalid: boolean;

    isVessel50FeetOrOverInvalid:boolean;
    selectMissingInvalid:boolean;
    asbestosTypeMissingInvalid: boolean;
  };
  validationTextMsg: {
    specialDescriptionTextMsg: string;
    specialDescriptionTextValid: boolean;
    specialDescriptionTextInvalid: boolean;
  };
  isVesselSeaworthyOptions: any[];
  areMajorComponentsMissingOptions: any[];
  doesVesselHavePCBOptions: any[];
  doesVesselHaveAsbestosOptions: any[];
  isVesselInspectedOptions: any[];
  isSurveyAvailableOptions: any[];
  missingOptions: any[];
  asbestosTypes: any[];
  isVessel50FeetOrOverOptions: any[];

}

export const FSCVesselDefaults: FSCVesselState = {
  vesselFSCData: new FSCVesselData(),
  isVesselSeaworthyOptions: isVesselSeaworthyOptions,
  areMajorComponentsMissingOptions: areMajorComponentsMissingOptions,
  doesVesselHavePCBOptions: doesVesselHavePCBOptions,
  doesVesselHaveAsbestosOptions: doesVesselHaveAsbestosOptions,
  isVesselInspectedOptions: isVesselInspectedOptions,
  isSurveyAvailableOptions: isSurveyAvailableOptions,
  missingOptions: missingOptions,
  asbestosTypes: asbestosTypes,
  isVessel50FeetOrOverOptions: isVessel50FeetOrOver,
  /*  make: "",
  model: "",*/
  validationMsg: {
    specialDescriptionCodeInvalid: false,
    specialDescriptionCodeMsg: "",
    specialDescriptionCodeValid: false,


    nameOfVesselInvalid: false,
    hullIdInvalid: false,
    lengthInvalid: false,
    beamInvalid: false,
    draftInvalid: false,
    typesOfEngineInvalid: false,
    hoursOnEngineInvalid: false,
    isVesselSeaworthyInvalid: false,
    areMajorComponentsMissingInvalid: false,
    doesVesselHavePCBInvalid: false,
    doesVesselHaveAsbestosInvalid: false,
    isVesselInspectedInvalid: false,
    isSurveyAvailableInvalid: false,

    isVessel50FeetOrOverInvalid:false,
    selectMissingInvalid:false,
    asbestosTypeMissingInvalid:false,
  },
  validationTextMsg: {
    specialDescriptionTextInvalid: false,
    specialDescriptionTextMsg: "",
    specialDescriptionTextValid: false,
  },
  /*  manufacturer: "",
  manufactureDate: null,*/
  /*  isVessel50FeetOrOver: false,
  nameOfVessel: "",
  hullIdNumber: "",
  isVesselSeaworthy: null,
  length: "",
  beam: "",
  draft: "",
  areMajorComponentsMissing: null,
  isEngineMissing: null,
  isElectronicMissing: null,
  isOtherMissing: null,
  typesOfEngines: "",
  hoursOnEngine: "",
  doesVesselHavePCBs: null,
  doesVesselHaveAsbestos: null,
  isFriable: null,
  isVesselInspectedByCoastGuard: null,
  isMarineSurveyAvailable: null,*/
  nameOfVesselMsg: "Vessel Name is Required.",
  nameOfVesselValid: false,
  manufacturerMsg: "Manufacture Name is Required.",
  manufactureValid: false,
  manufacturerInvalid: false,
  manufactureDateMsg: "Manufacture Date is Required.",
  manufactureDateValid: false,
  manufactureDateInvalid: false,
  hullIdMsg: "Vessel Hull Id Number is Required.",
  hullIdValid: false,
  isVesselSeaworthyMsg: "Is Vessel Seaworthy is Required.",
  lengthMsg: "Vessel Length is Required.",
  lengthValid: false,
  beamMsg: "Vessel Beam is Required.",
  beamValid: false,
  draftMsg: "Vessel Draft is Required.",
  draftValid: false,
  areMajorComponentsMissingMsg: "Are Major Components missing is Required.",
  componentTyoeMsg: "Type of Missing Component must be selected.",
  typesOfEngineMsg:
    "Engine Type must be entered which is a maximum of 20 characters long.",
  typesOfEngineValid: false,
  hoursOnEngineMsg:
    "Hours on Engine must be entered which should be maximum of 20 digits/characters long.",
  hoursOnEngineValid: false,
  doesVesselHavePCBMsg: "Does the vessel have PCB's is Required.",
  doesVesselHaveAsbestosMsg: "Does the vessel have Asbestos is Required.",
  asbestosTypeMsg: "Type of Asbestos must be selected.",
  isVesselInspectedMsg: "Is Vessel inspected is Required.",
  isMarineSurveyAvailableMsg: "Is Marine survey available is Required.",
  componentsMissingDisable: true,
  asbestosTypeDisable: true,
  modelMsg: "Model is Required.",
  modelValid: false,
  modelInvalid: false,
  makeMsg: "Make is Required.",
  makeValid: false,
  makeInvalid: false,
  /*  itemName: "",
  specialDescriptionCode: "",
  specialDescriptionText: "",*/
  itemNameMsg: "Item Name is Required.",
  itemNameValid: false,
  itemNameInvalid: false,

};
