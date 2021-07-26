import {IcnState} from "../icn-class/IcnState";
import {ChangeRequestStatus} from "../../../models/ChangeRequestModel";

export const transmissionType = [
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
];

export const fuelType = [
  {
    id: "G",
    value: "Gasoline",
    isSelected: false,
  },
  {
    id: "D",
    value: "Diesel",
    isSelected: false,
  },
  {
    id: "A",
    value: "Alternative",
    isSelected: false,
  },
  {
    id: "H",
    value: "Hybrid",
    isSelected: false,
  },
  {
    id: "O",
    value: "Other",
    isSelected: false,
  },
];

export const truckBodyStyle = [
  {
    id: "P2",
    value: "Pickup 2 Door",
    isSelected: false,
  },
  {
    id: "P3",
    value: "Pickup 3 Door",
    isSelected: false,
  },
  {
    id: "P4",
    value: "Pickup 4 Door",
    isSelected: false,
  },
  {
    id: "HD",
    value: "Heavy Duty",
    isSelected: false,
  },
  {
    id: "UT",
    value: "Utility",
    isSelected: false,
  },
  {
    id: "BO",
    value: "Box",
    isSelected: false,
  },
  {
    id: "TR",
    value: "Tractor",
    isSelected: false,
  },
  {
    id: "SU",
    value: "SUV",
    isSelected: false,
  },
  {
    id: "VA",
    value: "Van",
    isSelected: false,
  },
  {
    id: "MV",
    value: "Mini Van",
    isSelected: false,
  },
  {
    id: "OT",
    value: "Other",
    isSelected: false,
  },
];

export const bodyStyle = [
  {
    id: "S2",
    value: "Sedan 2 Door",
    isSelected: false,
  },
  {
    id: "S3",
    value: "Sedan 3 Door",
    isSelected: false,
  },
  {
    id: "S4",
    value: "Sedan 4 Door",
    isSelected: false,
  },
  {
    id: "CO",
    value: "Coupe",
    isSelected: false,
  },
  {
    id: "WA",
    value: "Wagon",
    isSelected: false,
  },
  {
    id: "SU",
    value: "SUV",
    isSelected: false,
  },
  {
    id: "VA",
    value: "Van",
    isSelected: false,
  },
  {
    id: "MV",
    value: "Mini Van",
    isSelected: false,
  },
  {
    id: "AM",
    value: "Ambulance",
    isSelected: false,
  },
  {
    id: "BU",
    value: "Bus",
    isSelected: false,
  },
  {
    id: "OT",
    value: "Other",
    isSelected: false,
  },
];

export const color = [
  {
    id: "BK",
    value: "Black",
    isSelected: false,
  },
  {
    id: "BL",
    value: "Blue",
    isSelected: false,
  },
  {
    id: "BR",
    value: "Brown",
    isSelected: false,
  },
  {
    id: "BG",
    value: "Blue-green / Turquoise",
    isSelected: false,
  },
  {
    id: "GD",
    value: "Gold / Bronze",
    isSelected: false,
  },
  {
    id: "GY",
    value: "Gray",
    isSelected: false,
  },
  {
    id: "GR",
    value: "Green",
    isSelected: false,
  },
  {
    id: "OR",
    value: "Orange",
    isSelected: false,
  },
  {
    id: "RE",
    value: "Red",
    isSelected: false,
  },
  {
    id: "SI",
    value: "Silver",
    isSelected: false,
  },
  {
    id: "WH",
    value: "White",
    isSelected: false,
  },
  {
    id: "YE",
    value: "Yellow",
    isSelected: false,
  },
  {
    id: "OT",
    value: "Other",
    isSelected: false,
  },
];

export const colorGradient = [
  {
    id: "L",
    value: "Light",
    isSelected: false,
  },
  {
    id: "M",
    value: "Medium",
    isSelected: false,
  },
  {
    id: "D",
    value: "Dark",
    isSelected: false,
  },
];

export const noOfCylindersOptions = [
  {
    id: "02",
    value: "02",
    isSelected: false,
  },
  {
    id: "03",
    value: "03",
    isSelected: false,
  },
  {
    id: "04",
    value: "04",
    isSelected: false,
  },

  {
    id: "05",
    value: "05",
    isSelected: false,
  },

  {
    id: "06",
    value: "06",
    isSelected: false,
  },
  {
    id: "08",
    value: "08",
    isSelected: false,
  },
  {
    id: "10",
    value: "10",
    isSelected: false,
  },
  {
    id: "12",
    value: "12",
    isSelected: false,
  },
  {
    id: "UN",
    value: "UN",
    isSelected: false,
  },
];

export const trailerBodyStyle = [
  {
    id: "MH",
    value: "Manufactured Housing",
    isSelected: false,
  },

  {
    id: "PM",
    value: "Park Model",
    isSelected: false,
  },

  {
    id: "TT",
    value: "Travel Trailer",
    isSelected: false,
  },

  {
    id: "OT",
    value: "Other",
    isSelected: false,
  },
];

export const trailerTypeStyle = [
  {
    id: "isSlideOut",
    value: "Slide out",
    isSelected: false,
    required: true,
  },
  {
    id: "isAwning",
    value: "Awning",
    isSelected: false,
    required: true,
  },
  {
    id: "isNeitherTrailerType",
    value: "Neither",
    isSelected: false,
    required: true,
  },
];

/*Advance Search ICN and TCN constants*/
export const regexForTCNandICN = /[^a-zA-Z0-9. ]/g;

/*Below Constants are for Federal Supply Class*/

/*Vehicle*/
export const vehicleFSCCode = ["2310", "2320", "2312", "2311"];
/*Aircraft*/
export const aircraftFSCCode = ["1510", "1520"];
/*Trailor*/
export const trailerFSCCode = ["2330"];
/*Vessel*/
export const vesselFSCCode = createArrayfun(1900, 1990);

export const allWeaponsFSCCode = createArrayfun(1000, 1099);

/*Quantity Restrictied categories */
export const restrictedFSCCode = [
  "2310",
  "2311",
  "2312",
  "2320",
  "2350",
  "2355",
  "2330",
  "2331",
  "1510",
  "1520",
]
  .concat(vesselFSCCode)
  .concat(allWeaponsFSCCode);

function createArrayfun(lowEnd: any, highEnd: any) {
  const list = [];
  for (var i = lowEnd; i <= highEnd; i++) {
    list.push(i.toString());
  }
  return list;
}
/*Weapons*/
export const weaponsFSCCode = ["1005", "1010"];

export const yesOrNoOptions = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: false },
];
export const areHistoricalMaintenanceRecordsAvailableOptions = [
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
];
export const isDataPlateAvailableOptions = [
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
];
export const areMajorComponentsMissingOptions = [
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
];
export const isAircraftOperationalOptions = [
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
];
export const isAircraftCertifiedByFAAOptions = [
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
];
export const isAircraftMaintainedByFAAOptions = [
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
];
export const isAircraftUsedNonFlightPurposeOptions = [
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
];
export const isVesselSeaworthyOptions = [
  {
    value: "Yes",
    id: "Y",
    isSelected: false,
    required: true,
    field: "isVesselSeaworthy",
  },
  {
    value: "No",
    id: "N",
    isSelected: false,
    required: true,
    field: "isVesselSeaworthy",
  },
];
export const areMajorVesselComponentsMissingOptions = [
  {
    value: "Yes",
    id: "Y",
    isSelected: false,
    required: true,
    field: "areMajorVesselComponentsMissing",
  },
  {
    value: "No",
    id: "N",
    isSelected: false,
    required: true,
    field: "areMajorVesselComponentsMissing",
  },
];
export const doesVesselHavePCBOptions = [
  {
    value: "Yes",
    id: "Y",
    isSelected: false,
    required: true,
    field: "doesVesselHavePCS",
  },
  {
    value: "No",
    id: "N",
    isSelected: false,
    required: true,
    field: "doesVesselHavePCS",
  },
];
export const doesVesselHaveAsbestosOptions = [
  {
    value: "Yes",
    id: "Y",
    isSelected: false,
    required: true,
    field: "doesVesselHaveAsbestos",
  },
  {
    value: "No",
    id: "N",
    isSelected: false,
    required: true,
    field: "doesVesselHaveAsbestos",
  },
];
export const isVesselInspectedOptions = [
  {
    value: "Yes",
    id: "Y",
    isSelected: false,
    required: true,
    field: "isVesselInspected",
  },
  {
    value: "No",
    id: "N",
    isSelected: false,
    required: true,
    field: "isVesselInspected",
  },
];
export const isSurveyAvailableOptions = [
  {
    value: "Yes",
    id: "Y",
    isSelected: false,
    required: true,
    field: "isSurveyAvailable",
  },
  {
    value: "No",
    id: "N",
    isSelected: false,
    required: true,
    field: "isSurveyAvailable",
  },
];
export const isVessel50FeetOrOver = [
  { value: "Yes", id: "Y", isSelected: false, field: "isVessel50FeetOrOver" },
  { value: "No", id: "N", isSelected: true, field: "isVessel50FeetOrOver" },
];
export const missingOptions = [
  {
    value: "Engine Missing",
    id: "EN",
    isSelected: false,
    field: "selectMissing",
  },
  {
    value: "Electronic Missing",
    id: "EL",
    isSelected: false,
    field: "selectMissing",
  },
  {
    value: "Other Missing",
    id: "OT",
    isSelected: false,
    field: "selectMissing",
  },
];
export const asbestosTypes = [
  { value: "Friable", id: "F", isSelected: false, field: "asbestosTypeMissing" },
  { value: "Non-Friable", id: "NF", isSelected: false, field: "asbestosTypeMissing"},
];
export const specialInstructions = [
  {
    value: "Contractor Inventory",
    id: "contractor-inventory",
    isSelected: false,
  },
  {
    value: "Overseas Inventory",
    id: "overseas-inventory",
    isSelected: false,
  },
];

export const filterProperty = [
  {
    value: "Show All",
    id: "show-all-property",
    isSelected: true,
  },
  {
    value: "Show My Property",
    id: "show-my-property",
    isSelected: false,
  },
  {
    value: "Show Others Property",
    id: "show-others-property",
    isSelected: false,
  },
];

export const taskStatusOptions = [
  {
    value: "Show All",
    id: "all",
    isSelected: true,
  },
  {
    value: "Pending",
    id: "pending",
    isSelected: false,
  },
  {
    value: "Approved",
    id: "approved",
    isSelected: false,
  },
  {
    value: "Denied",
    id: "denied",
    isSelected: false,
  },
];

/*Property Types*/
export const propertyTypes = [
  { value: "Regular Excess Screening (No Special Requirements)", id: "NR" },
  { value: "Surplus sale proceeds retention", id: "PR" },
  {
    value: "Property was purchased with working capital or revolving funds",
    id: "WC",
  },
  {
    value: "Exchange Sale (Replacement Authority)",
    id: "ES",
  },
  {
    value: "Special legislative authority",
    id: "TS",
  },
  {
    value: "Purchased with non-appropriated funds",
    id: "NA",
  },
  {
    value:
      "Reported by a wholly owned or mixed-ownership Government corporation",
    id: "WM",
  },
];

export const salesPropertyTypes = [
  {
    value: "Exchange Sale",
    id: "B",
  },
  {
    value: "Excess (Surplus)",
    id: "A",
  },
  {
    value: "Other Reimbursable Property",
    id: "C",
  },
  {
    value: "Surplus Reimbursable",
    id: "G",
  },
];

export const federalSalesCenterTypes = [
  { value: "GSA (All commodities and locations nationwide)", id: "G" },
  {
    value:
      "USDA-CEPO( Limited to property located within the Washington, D.C. metropolitan area)",
    id: "A",
  },
  {
    value: "DOI/AMD (Limited to aircraft and aircraft parts only. FSG 15 )",
    id: "4",
  },
  {
    value: "Dept of Treasury/IRS Vehicle sales (Limited to passenger vehicles)",
    id: "5",
  },
  {
    value:
      "Approved Waiver (This item is covered by a waiver from GSA OGP and is not required to be sold via a Sales Center)",
    id: "N",
  },
  {
    value:
      "Legislative and Judicial branches (Not required to use eFas Sales Centers)",
    id: "6",
  },
];

export const federalSalesCenterTypesForSalesUsers = [
  { value: "GSA (All commodities and locations nationwide)", id: "G" },
];

/*Aircraft*/
export const isEngineMissingOptions = [
  {
    id: "EM",
    value: "Engine Missing",
    isSelected: false,
    required: true,
    field: "isEngineMissing",
  },
];
export const otherMissingComponentsOptions = [
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
export const nonFlightPurposeOptions = [
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
];
export const buyOptions = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: false },
];

export const appraisalToUploadOptions = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: false },
];

export const condition = [
  {
    id: "N",
    value: "New or Unused",
    isSelected: false,
  },
  {
    id: "U",
    value: "Usable",
    isSelected: false,
  },
  {
    id: "R",
    value: "Repairable",
    isSelected: false,
  },
  {
    id: "X",
    value: "Salvage",
    isSelected: false,
  },
  {
    id: "S",
    value: "Scrap",
    isSelected: false,
  },
];
export const hazardous = [
  {
    id: "M",
    value: "Hazardous Material",
    isSelected: false,
  },
  {
    id: "W",
    value: "Hazardous Waste",
    isSelected: false,
  },
  {
    id: "N",
    value: "No",
    isSelected: true,
  },
];

export const demilitarizationForSales = [
  {
    id: "A",
    value: "Demilitarization not required",
    isSelected: true,
  },
];

export const demilitarization = [
  {
    id: "A",
    value: "Demilitarization not required",
    isSelected: true,
  },
  {
    id: "B",
    value:
      "Demilitarization not required, Trade Security Controls not required",
    isSelected: false,
  },
  {
    id: "C",
    value:
      "Remove and/or demilitarize installed key point(s), or lethal parts, components, and accessories",
    isSelected: false,
  },
  {
    id: "D",
    value:
      "Demilitarize by mutilation to preclude restoration or repair or, if authorized, by burial or deep water dumping",
    isSelected: false,
  },
  {
    id: "E",
    value:
      "Demilitarize based on instructions furnished by DOD Demilitarization Program Office",
    isSelected: false,
  },
  {
    id: "F",
    value:
      "Demilitarize based on instructions furnished by Item/Technical Manager",
    isSelected: false,
  },
  {
    id: "G",
    value: "Demilitarize and declassify or remove any sensitive markings",
    isSelected: false,
  },
  {
    id: "P",
    value:
      "Demilitarize and declassify or remove any sensitive markings for Security classified items",
    isSelected: false,
  },
  {
    id: "Q",
    value:
      "Demilitarization not required, Strategic List item controlled by the Dept. of Commerce, subject to Export Administration regulations",
    isSelected: false,
  },
];

export enum erdSrdDateType {
  ERD = "Excess Request Date",
  SRD = "Surplus Request Date",
}

export enum TcnStatus {
  REQUESTED = "Requested",
  PENDING_ALLOCATION = "Pending Allocation",
  ALLOCATION_CONFIRMED = "Allocation Confirmed",
  ALLOCATION_DENIED = "Allocation Denied",
  PENDING_AO_APPROVAL = "Pending AO Approval",
  APPROVED_BY_AO = "AO Approved",
  DENIED_BY_AO = "AO Denied",
  TRANSFERRED = "Transferred",
  DONATED = "Donated",
  TRANSFER_DENIED = "Transfer Denied",
  DONATION_DENIED = "Donation Denied",
  DENIED = "Denied",
  PENDING_APO_REQUISITION = "Pending APO Requisition",
  RECALL_DENIED = "Recall Denied",
  INTERNAL_TRANSFER = "Internal Transfer",
}

export enum PropertyGroupType {
  PROPERTY = "property",
  FOREIGN_GIFT = "foreignGift",
}

export enum TcnDefaultStatus {
  REQUESTED = "REQUESTED",
  PENDING_ALLOCATION = "PENDING_ALLOCATION",
  ALLOCATION_CONFIRMED = "ALLOCATION_CONFIRMED",
  ALLOCATION_DENIED = "ALLOCATION_DENIED",
  PENDING_AO_APPROVAL = "PENDING_AO_APPROVAL",
  APPROVED_BY_AO = "APPROVED_BY_AO",
  DENIED_BY_AO = "DENIED_BY_AO",
  TRANSFERRED = "TRANSFERRED",
  DONATED = "DONATED",
  TRANSFER_DENIED = "TRANSFER_DENIED",
  DONATION_DENIED = "DONATION_DENIED",
  DENIED = "DENIED",
  PENDING_APO_REQUISITION = "PENDING_APO_REQUISITION",
  RECALL_DENIED = "RECALL_DENIED",
  INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
  PENDING = "PENDING",
}

export enum TcnWorkFlowType {
  ALLOCATIONS = "Allocations",
  APPROVE_TRANSFER_ORDERS = "Approve Transfer Orders",
  REQUISITION_TRANSFER_ORDERS = "Requisition Transfer Orders",
  MY_REQUESTS = "My Requests",
  COMPLETED_TRASFER = "Completed Transfers",
}

export const historyPropertyFilter = [
  {
    value: "All",
    id: "all-history",
    isSelected: true,
  },
  {
    value: "Internal Transfer",
    id: "internal-transfer",
    isSelected: false,
  },
  {
    value: "Transferred",
    id: "transferred",
    isSelected: false,
  },
  {
    value: "Donated",
    id: "donated",
    isSelected: false,
  },
  {
    value: "Returned",
    id: "returned",
    isSelected: false,
  },
  {
    value: "Waiver Or Returned",
    id: "waiver-returned",
    isSelected: false,
  },
  {
    value: "Returned After Internal Transfer",
    id: "returned-after-internal-transfer",
    isSelected: false,
  },
];

/**
 * Avaibale TCN status for ALLOCATIONS Page
 */
export const allocationAllTcnStatus = [
  TcnDefaultStatus.REQUESTED,
  TcnDefaultStatus.PENDING_ALLOCATION,
  TcnDefaultStatus.ALLOCATION_CONFIRMED,
  TcnDefaultStatus.ALLOCATION_DENIED,
];
export const allocationDefaultTcnStatus = [
  TcnDefaultStatus.REQUESTED,
  TcnDefaultStatus.PENDING_ALLOCATION,
];
export const allocationStatusCodes = [
  {
    id: "REQUESTED",
    value: TcnStatus.REQUESTED,
    isSelected: false,
  },
  {
    id: "PENDING_ALLOCATION",
    value: TcnStatus.PENDING_ALLOCATION,
    isSelected: false,
  },
  {
    id: "ALLOCATION_CONFIRMED",
    value: TcnStatus.ALLOCATION_CONFIRMED,
    isSelected: false,
  },
  {
    id: "ALLOCATION_DENIED",
    value: TcnStatus.ALLOCATION_DENIED,
    isSelected: false,
  },
];

/**
 * Avaibale TCN status for APPROVE TRANSFER ORDERS Page
 */
export const aoApprovalDefaultTcnStatus = [
  TcnDefaultStatus.PENDING_AO_APPROVAL,
  TcnDefaultStatus.ALLOCATION_CONFIRMED,
];
export const aoApprovalAllTcnStatus = [
  TcnDefaultStatus.PENDING_AO_APPROVAL,
  TcnDefaultStatus.ALLOCATION_CONFIRMED,
  TcnDefaultStatus.APPROVED_BY_AO,
  TcnDefaultStatus.DENIED_BY_AO,
  TcnDefaultStatus.INTERNAL_TRANSFER,
];
export const aoApprovalStatusCodes = [
  {
    id: "ALLOCATION_CONFIRMED",
    value: TcnStatus.ALLOCATION_CONFIRMED,
    isSelected: false,
  },
  {
    id: "PENDING_AO_APPROVAL",
    value: TcnStatus.PENDING_AO_APPROVAL,
    isSelected: false,
  },
  {
    id: "APPROVED_BY_AO",
    value: TcnStatus.APPROVED_BY_AO,
    isSelected: false,
  },
  {
    id: "DENIED_BY_AO",
    value: TcnStatus.DENIED_BY_AO,
    isSelected: false,
  },
  {
    id: "INTERNAL_TRANSFER",
    value: TcnStatus.INTERNAL_TRANSFER,
    isSelected: false,
  },
];

/**
 * Avaibale TCN status for REQUISITION TRANSFER ORDERS Page
 */
export const requisitionTransferAllTcnStatus = [
  TcnDefaultStatus.APPROVED_BY_AO,
  TcnDefaultStatus.PENDING_APO_REQUISITION,
  TcnDefaultStatus.TRANSFERRED,
  TcnDefaultStatus.TRANSFER_DENIED,
  TcnDefaultStatus.DONATED,
  TcnDefaultStatus.DONATION_DENIED,
  TcnDefaultStatus.ALLOCATION_CONFIRMED,
];
export const requisitionTransferDefaultTcnStatus = [
  TcnDefaultStatus.APPROVED_BY_AO,
  TcnDefaultStatus.PENDING_APO_REQUISITION,
];
export const requisitionTransferStatusCodes = [
  {
    id: "APPROVED_BY_AO",
    value: TcnStatus.APPROVED_BY_AO,
    isSelected: false,
  },
  {
    id: "TRANSFERRED",
    value: TcnStatus.TRANSFERRED,
    isSelected: false,
  },
  {
    id: "DONATED",
    value: TcnStatus.DONATED,
    isSelected: false,
  },
  {
    id: "TRANSFER_DENIED",
    value: TcnStatus.TRANSFER_DENIED,
    isSelected: false,
  },
  {
    id: "DONATION_DENIED",
    value: TcnStatus.DONATION_DENIED,
    isSelected: false,
  },
  {
    id: "PENDING_APO_REQUISITION",
    value: TcnStatus.PENDING_APO_REQUISITION,
    isSelected: false,
  },
  {
    id: "ALLOCATION_CONFIRMED",
    value: TcnStatus.ALLOCATION_CONFIRMED,
    isSelected: false,
  },
];

/**
 * Avaibale TCN status for COMPLETED TRANSFERS Page
 */
export const completedTransferAllTcnStatus = [
  TcnDefaultStatus.TRANSFERRED,
  TcnDefaultStatus.DONATED,
];
export const completedTransferDefaultTcnStatus = [
  TcnDefaultStatus.TRANSFERRED,
  TcnDefaultStatus.DONATED,
];
export const completedTransferStatusCodes = [
  {
    id: "TRANSFERRED",
    value: TcnStatus.TRANSFERRED,
    isSelected: false,
  },
  {
    id: "DONATED",
    value: TcnStatus.DONATED,
    isSelected: false,
  },
  {
    id: "RECALL_DENIED",
    value: TcnStatus.RECALL_DENIED,
    isSelected: false,
  },
];

/**
 * Avaibale TCN status for PROPERTY REQUESTS Page
 */
export const myRequestsDefaultTcnStatus = [
  TcnDefaultStatus.REQUESTED,
  TcnDefaultStatus.PENDING_ALLOCATION,
  TcnDefaultStatus.ALLOCATION_CONFIRMED,
  TcnDefaultStatus.ALLOCATION_DENIED,
  TcnDefaultStatus.PENDING_AO_APPROVAL,
  TcnDefaultStatus.APPROVED_BY_AO,
  TcnDefaultStatus.INTERNAL_TRANSFER,
  TcnDefaultStatus.DENIED_BY_AO,
  TcnDefaultStatus.TRANSFERRED,
  TcnDefaultStatus.DONATED,
  TcnDefaultStatus.TRANSFER_DENIED,
  TcnDefaultStatus.DONATION_DENIED,
  TcnDefaultStatus.PENDING_APO_REQUISITION,
];
export const myRequestsAllTcnStatus = [
  TcnDefaultStatus.REQUESTED,
  TcnDefaultStatus.PENDING_ALLOCATION,
  TcnDefaultStatus.ALLOCATION_CONFIRMED,
  TcnDefaultStatus.ALLOCATION_DENIED,
  TcnDefaultStatus.PENDING_AO_APPROVAL,
  TcnDefaultStatus.APPROVED_BY_AO,
  TcnDefaultStatus.INTERNAL_TRANSFER,
  TcnDefaultStatus.DENIED_BY_AO,
  TcnDefaultStatus.TRANSFERRED,
  TcnDefaultStatus.DONATED,
  TcnDefaultStatus.TRANSFER_DENIED,
  TcnDefaultStatus.DONATION_DENIED,
  TcnDefaultStatus.PENDING_APO_REQUISITION,
];
export const myRequestsTCNCodes = [
  {
    id: "REQUESTED",
    value: TcnStatus.REQUESTED,
    isSelected: false,
  },
  {
    id: "PENDING_ALLOCATION",
    value: TcnStatus.PENDING_ALLOCATION,
    isSelected: false,
  },
  {
    id: "ALLOCATION_CONFIRMED",
    value: TcnStatus.ALLOCATION_CONFIRMED,
    isSelected: false,
  },
  {
    id: "ALLOCATION_DENIED",
    value: TcnStatus.ALLOCATION_DENIED,
    isSelected: false,
  },
  {
    id: "PENDING_AO_APPROVAL",
    value: TcnStatus.PENDING_AO_APPROVAL,
    isSelected: false,
  },
  {
    id: "APPROVED_BY_AO",
    value: TcnStatus.APPROVED_BY_AO,
    isSelected: false,
  },
  {
    id: "INTERNAL_TRANSFER",
    value: TcnStatus.INTERNAL_TRANSFER,
    isSelected: false,
  },
  {
    id: "DENIED_BY_AO",
    value: TcnStatus.DENIED_BY_AO,
    isSelected: false,
  },
  {
    id: "TRANSFERRED",
    value: TcnStatus.TRANSFERRED,
    isSelected: false,
  },
  {
    id: "DONATED",
    value: TcnStatus.DONATED,
    isSelected: false,
  },
  {
    id: "TRANSFER_DENIED",
    value: TcnStatus.TRANSFER_DENIED,
    isSelected: false,
  },
  {
    id: "DONATION_DENIED",
    value: TcnStatus.DONATION_DENIED,
    isSelected: false,
  },
  {
    id: "PENDING_APO_REQUISITION",
    value: TcnStatus.PENDING_APO_REQUISITION,
    isSelected: false,
  },
];

export const flightSafety = [
  {
    id: "B",
    value: "Blank",
    isSelected: true,
  },
  {
    id: "E",
    value: "FSCAP hardened for nuclear warfare",
    isSelected: false,
  },
  {
    id: "F",
    value: "Flight Safety Critical Aircraft Part",
  },
];

export const changeRequestStatus = [
  {
    id: ChangeRequestStatus.APPROVED,
    value: "Approve",
    isSelected: false,
    required: true,
    isDisabled: false,
  },
  {
    id: ChangeRequestStatus.DENIED,
    value: "Deny",
    isSelected: false,
    required: true,
  },
];

export const joinIcn = (state: IcnState) => {
  let icnVal = "";
  if (state.suffix) {
    icnVal = `${state.aacCode}${state.julianDate}${state.serialNum}${state.suffix}`;
  } else {
    icnVal = `${state.aacCode}${state.julianDate}${state.serialNum}`;
  }
  return icnVal;
};

export const dropAfterInternalScreening = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: true },
];

export const manageInventory = [
  { value: "Yes", id: "Y" },
  { value: "No", id: "N" },
];

export const dropAfterInternalScreeningDisabled = [
  { value: "Yes", id: "Y", isSelected: true },
  {
    value: "No",
    id: "N",
    isSelected: false,
    isDisabled: true,
  },
];

export const propertyWithdrawalReason = [
  { value: "Item no longer Available", id: "I" },
  { value: "Duplicate Entry", id: "D" },
  { value: "Item Needed by Agency", id: "IN" },
  { value: "Reporting description not accurate", id: "R" },
  { value: "Alternate disposal method", id: "A" },
  { value: "Abandonment and Destruction", id: "AD" },
  { value: "Other", id: "O" },
];
export const dateValues = [
  { value: "Today", id: "Today" },
  { value: "Past 2 Days", id: "pastTwo" },
  { value: "Past Week", id: "pastWeek" },
  { value: "Past Month", id: "pastMonth" },
  { value: "Custom Date", id: "custom" },
];
export const releaseDateValues = [
  { value: "Today", id: "Today" },
  { value: "Next 2 Days", id: "nextTwo" },
  { value: "Next Week", id: "nextWeek" },
  { value: "Next Month", id: "nextMonth" },
  { value: "Custom Date", id: "custom" },
];

export const advancedSearchValues = [
  { value: "Exact Phrase", caps: "EXACT_PHRASE", id: "Exact" },
  { value: "Any Word", caps: "ANY_WORD", id: "Any" },
  { value: "All Words", caps: "ALL_WORDS", id: "All" },
];

export const specialPermissions = ["IS", "IR", "IF", "IO", "IN"];
export const militaryAirCraftOnly = [
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
];
//PPDMS-1249
export const recallOptions = [
  { value: "Yes", id: "Y", isSelected: false, required: true },
  { value: "No", id: "N", isSelected: false, required: true },
];

export const valueAddedServicesOptions = [
  { value: "Yes", id: "Y", isSelected: false, required: true },
  { value: "No", id: "N", isSelected: true, required: true },
];

export const reportAgainOptions = [
  { value: "Copy addresses and POC data", id: "SOME", isSelected: false },
  { value: "Copy all data", id: "All", isSelected: false },
];

/*Vehicle*/
export const FSC_RequiringRecallToggle = ["2310", "2320"];

/*Value Added Services*/
export const FSC_RequiringValueAddedServices = [
  "2305",
  "2310",
  "2311",
  "2312",
  "2320",
  "2330",
  "2331",
  "2340",
  "2350",
  "2355",
];

export const FSC_DoneeInfo = ["1005", "1010"];

/*Search Default*/
export const codeList = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
];

export const internalExcessAndFGOptions = [
  {
    value: "All Property",
    id: "all",
    isSelected: true,
  },
  {
    value: "Internal Agency Property",
    id: "internal",
    isSelected: false,
  },
  {
    value: "Excess Property",
    id: "excess",
    isSelected: false,
  },
  {
    value: "Foreign Gifts",
    id: "foreignGifts",
    isSelected: false,
  },
]
export const internalExcessOptions = [
  {
    value: "All Property",
    id: "all",
    isSelected: true,
  },
  {
    value: "Internal Agency Property",
    id: "internal",
    isSelected: false,
  },
  {
    value: "Excess Property",
    id: "excess",
    isSelected: false,
  },
  {
    value: "Foreign Gifts",
    id: "foreignGifts",
    isSelected: false,
  },
  {
    value: "History Records",
    id: "history",
    isSelected: false,
  },
];
export const onlyForeignGiftInternalExcessOptions = [
  {
    value: "Excess Property",
    id: "excess",
    isSelected: true,
  },
  {
    value: "Foreign Gifts",
    id: "foreignGifts",
    isSelected: false,
  },
];
export const onlyForeignGiftOptions = [
  {
    value: "Foreign Gifts",
    id: "foreignGifts",
    isSelected: true,
  },
];
export const externalNUExcessOptions = [
  {
    value: "Excess Property",
    id: "excess",
    isSelected: true,
  },
  {
    value: "Foreign Gifts",
    id: "foreignGifts",
    isSelected: false,
  },
  {
    value: "History Records",
    id: "history",
    isSelected: false,
  },
];
export const transferRequestsOptions = [
  {
    value: "All Transfer Requests",
    id: "all",
    isSelected: true,
  },
  {
    value: "My Transfer Requests",
    id: "my",
    isSelected: false,
  },
];

export const modelRequiredCodeList = [
  "2310",
  "2320",
  "2330",
  "7010",
  "7020",
  "7021",
  "7025",
  "7030",
  "7035",
  "7040",
  "7042",
  "7045",
  "7050",
  "1510",
  "1520",
  "2620",
  "2810",
  "2915",
  "2925",
  "2935",
  "2945",
  "2995",
  "4920",
  "5821",
  "5826",
  "5841",
  "6340",
  "6610",
  "6615",
  "1610",
  "1615",
  "1620",
  "1630",
  "1640",
  "1650",
  "1660",
  "1670",
  "1675",
  "1677",
  "1680",
  "1710",
  "1720",
  "1725",
  "1730",
  "1735",
  "1740",
];

export const manufactureRequiredCodeList = [
  "2620",
  "2810",
  "2915",
  "2925",
  "2935",
  "2945",
  "2995",
  "4920",
  "5821",
  "5826",
  "5841",
  "6340",
  "6610",
  "6615",
  "1610",
  "1615",
  "1620",
  "1630",
  "1640",
  "1650",
  "1660",
  "1670",
  "1675",
  "1677",
  "1680",
  "1710",
  "1720",
  "1725",
  "1730",
  "1735",
  "1740",
];

export const manufactureDateRequiredCodeList = [
  "2620",
  "2810",
  "2915",
  "2925",
  "2935",
  "2945",
  "2995",
  "4920",
  "5821",
  "5826",
  "5841",
  "6340",
  "6610",
  "6615",
  "1610",
  "1615",
  "1620",
  "1630",
  "1640",
  "1650",
  "1660",
  "1670",
  "1675",
  "1677",
  "1680",
  "1710",
  "1720",
  "1725",
  "1730",
  "1735",
  "1740",
];

export const makeRequiredCodeList = [
  "2310",
  "2320",
  "2330",
  "7010",
  "7025",
  "7021",
  "7035",
  "1510",
  "1520",
];

export const recallReason = [
  { value: "Shortage/Partial Recall", id: "SR" },
  { value: "Overage", id: "O" },
  { value: "Complete Recall", id: "CR" },
];

export const nonReportedRecallReason = [{ value: "Complete Recall", id: "CR" }];

export const recallAdditionalReasons = [
  { value: "Item No Longer Available", id: 1 },
  { value: "Duplicate Entry", id: 2 },
  { value: "Item Needed By Agency", id: 3 },
  { value: "Reporting Error", id: 4 },
  { value: "Reporting description not accurate", id: 5 },
  { value: "Alternate disposal method", id: 6 },
  { value: "Abandonment and Destruction", id: 7 },
  { value: "Property no longer needed by requestor", id: 8 },
  { value: "Property not picked up by recipient", id: 9 },
  { value: "Other", id: 10 },
];
