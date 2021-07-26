export abstract class PropertyReport {
  itemControlNumber: string;
  aacId: string;
  notify_poc: boolean;
  notifyCustodian: boolean;
  //ccEmail: string;
  isSubmitted: boolean;
  propertyId: number;
  reportingAgencyAddress: {
    line1: string;
    line2: string;
    line3: string;
    city: string;
    stateCode: string;
    zip: number;
    zip2: number;
    isDeleted: boolean;
  };
  propertyLocation: {
    line1: string;
    line2: string;
    line3: string;
    city: string;
    stateCode: string;
    zip: number;
    zip2: number;
    isDeleted: boolean;
  };
  propertyPOC: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: number;
    fax: string;
    phoneExtension: number;
    isDeleted: boolean;
  };
  propertyCustodian: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: number;
    fax: string;
    phoneExtension: number;
    isDeleted: boolean;
  };
  airCraft: {
    //manufacturer: string;
    model: string;
    serialNumber: string;
    //manufactureDate: Date;
    isEngineMissing: boolean;
    isAircraftOperational: boolean;
    areMajorComponentsMissing: boolean;
    isDataPlateAvailable: boolean;
    areHistoricalMaintenanceRecordsAvailable: boolean;
    isAircraftCertifiedByFAA: boolean;
    isAircraftMaintainedByFAA: boolean;
    isAircraftUsedNonFlightPurpose: boolean;
    isGroundTraining: boolean;
    isStaticDisplay: boolean;
    isExtensiveDisassemblyAndReassembly: boolean;
    isRepeatedBurningForFireFightingTraining: boolean;
    isExtensiveCannibalization: boolean;
    avionicsOtherNoMissing: string;
  };
  vehicle: {
    agencyClass: string;
    transmissionType: string;
    numberOfCylinders: number;
    tag: string;
    modelYear: string;
    fuelType: string;
    bodyStyle: string;
    color: string;
    colorGradient: string;
    vin: string;
    model: string;
    make: string;
    estimatedMileage: number;
    //acquisitionDate: Date;
    //manufactureDate: Date;
  };
  weapon: {
    type: string;
    make: string;
    model: string;
    size: string;
  };
  computer: {
    hardWareType: string;
    equipmentType: string;
    hardwareEquipmentMakeType: string;
    computerModel: string;
    processorType: string;
    hardDiskSize: string;
    processorSize: string;
    processingSpeed: string;
    ramSize: string;
    isEquipmentForCFL: string;
    isEquipmentCFLEligible: string;
  };
  vessel: {
    nameOfVessel: string;
    //manufacturer: string;
    //manufactureDate: Date;
    model: string;
    hullIdNumber: string;
    length: string;
    beam: string;
    draft: string;
    typesOfEngines: string;
    hoursOnEngine: string;
    isVessel50FeetOrOver: boolean;
    isVesselSeaworthy: boolean;
    areMajorComponentsMissing: boolean;
    isEngineMissing: boolean;
    isElectronicMissing: boolean;
    isOtherMissing: boolean;
    vesselHasPCB: boolean;
    vesselHasAsbestos: boolean;
    friable: boolean;
    vesselInspectedByCoastGuard: boolean;
    marineSurveyAvailable: boolean;
  };
  propertyType: string;
  contractInventoryCode: string;
  overseasInventoryCode: string;
  agencyLocationCode: string;
  agencyControlNumber: string;
  amountTobeReimbursed: string;
  federalSalesCenter: string;
  excessReleaseDate: Date;
  surplusReleaseDate: Date;
  itemName: string;
  specialDescriptionCode: string;
  specialDescriptionText: string;
  quantity: number;
  unitOfIssue: string;
  acquisitionCost: number;
  fairMarketValue: number;
  condition: string;
  hazardous: string;
  demilitarizationCode: string;
  isDeleted: boolean;
  propertyDescription: string;
  salesNotes: string;
  fscncode: string;
  niincode: string;
  fscapcode: string;
  //manufacturer: string;
  //fightSafetyCriticalAircraftPart: string;
  //dateOfManufacture: Date;
  //acquisitionDate: Date;
  manufacturer: string;
  manufactureDate: Date;
  propertyGroup: string;
  fiscalYear: string;
  recipientWantsToBuy: string;
  administration: string;
  donorInfo: {
    firstName: string;
    lastName: string;
    donorTitle: string;
    countryCode: string;
  };
  appraisalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    phoneExtension: string;
    dateOfApproval: Date;
    appraisalValue: number;
  };

  appraisalAgencyInformation: {
    companyName: string;
    companyAddress: {
      line1: string;
      line2: string;
      line3: string;
      city: string;
      stateCode: string;
      zip: string;
      zip2: string;
      isDeleted: boolean;
    };
    companyUrl: string;
    isAppraisalToUpload: boolean;
  };
}
/**
 * Factory method to construct the model object from the provided interface object/structure
 * @param dto
 */
export class PropertyReportDto extends PropertyReport {
  static asPropertyReportDto(dto: PropertyReport): PropertyReportDto {
    return Object.assign(new PropertyReportDto(), dto);
  }
}
