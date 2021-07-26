export class FSCVehicleData {
  vehicleId: number;
  agencyClass: string;
  transmissionType: string;
  tag: string;
  noOfCylinders: number;
  modelYear: string;
  fuelType: string;
  bodyStyle: string;
  vin: string;
  itemName: string;
  make: string;
  model: string;
  estimatedMileage: number;
  color: string;
  colorGradient: string;
  recalled: string;
  specialDescriptionCode: string;
  specialDescriptionText: string;
}

export class FSCVesselData {
  isVessel50FeetOrOver: boolean = false;
  nameOfVessel: string = "";
  hullIdNumber: string = "";
  isVesselSeaworthy: boolean = false;
  length: string = "";
  beam: string = "";
  draft: string = "";
  areMajorComponentsMissing: boolean = false;
  isEngineMissing: boolean = false;
  isElectronicMissing: boolean = false;
  isOtherMissing: boolean = false;
  typesOfEngines: string = "";
  hoursOnEngine: string = "";
  vesselHasPCB: boolean = false;
  vesselHasAsbestos: boolean = false;
  friable: boolean;
  vesselInspectedByCoastGuard: boolean = false;
  marineSurveyAvailable: boolean = false;
}

export class FSCWeaponData {
  type: string;
  make: string;
  model: string;
  size: string;
  longName: string;
  specialDescriptionCode: string;
  specialDescriptionText: string;
}

export class FSCTrailerData {
  bodyStyle: string;
  modelYear: string;
  vin: string;
  length: string;
  barcode: string;
  isSlideOut: boolean;
  isAwning: boolean;
  isNeitherTrailerType: boolean;
  numberOfAxles: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  windZone: string;
  trailerHomeId: number;
}

export class FSCAircraftData {
  isAircraftCertifiedByFAA: boolean;
  areHistoricalMaintenanceRecordsAvailable: boolean;
  isAircraftUsedNonFlightPurpose: boolean;
  areMajorComponentsMissing: boolean;
  isEngineMissing: boolean;
  isAircraftMaintainedByFAA: boolean;
  isDataPlateAvailable: boolean;
  isAircraftOperational: boolean;
  isGroundTraining: string;
  isStaticDisplay: string;
  isExtensiveDisassemblyAndReassembly: string;
  isRepeatedBurningForFireFightingTraining: string;
  isExtensiveCannibalization: string;
  avionicsOtherNoMissing: string;
  isAircraftAuthorizedForSaleAndExchangeForCommUse: boolean;
  isAircraftPreviouslyUsedForInstrAndOrStaticDisp: boolean;
  isAirCraftCombatConfAsDeterminedByDOD: boolean;
  aircraftId: number;
  serialNumber: string;
}

export class FSCComputerData {
  computerId: number;
  hardwareType: string;
  equipmentType: string;
  processorType: string;
  hardDiskSize: string;
  processingSpeed: string;
  ram: string;
  hardDiskStatus: string;
  isEquipmentForComputersForLearning: boolean;
  isEquipmentForComputersForLearningEligible: string;
}

export class FSCModel {
  fscCode: string;
  niin: string;
  specialInstructions: string;
  specialDescriptionCode: string;
  specialDescriptionText: string;
  itemName: string;
  make: string;
  model: string;
  vessel = new FSCVesselData();
  weapon = new FSCWeaponData();
  vehicle = new FSCVehicleData();
  aircraft = new FSCAircraftData();
  other = new FSCOtherData();
  computer = new FSCComputerData();
  trailerHome = new FSCTrailerData();
  federalSalesCenter: string;
  aircraftId: number;

  manufacturer: string;
}

export class FSCOtherData {
  itemName: string;
  make: string;
  model: string;
  specialDescriptionCode: string;
  specialDescriptionText: string;
  validateFscOtherSection?: boolean;
}
