import { Validation } from "../../../create-update-property/validations/propertyFieldValidations";

export enum ReportStatus {
  DRAFT = "DRAFT",
  DELINQUENT = "DELINQUENT",
  PENDING = "PENDING APPROVAL",
  APPROVED = "APPROVED",
}

export const report3040RadioGroup = [
  {
    id: "allReports",
    value: "All Reports",
    isSelected: true,
  },
  {
    id: "delinquentReports",
    value: "Delinquent Reports",
    isSelected: false,
  },
];

export const Quarters = new Map([
  ["QUARTER1", "1st Quarter"],
  ["QUARTER2", "2nd Quarter"],
  ["QUARTER3", "3rd Quarter"],
  ["QUARTER4", "4th Quarter"],
]);

export enum Titles3040 {
  RECEIPTS = "Receipts",
  DONATIONS = "Donations",
  TRANSFERS = "Transfers",
  COMMENTS = "Comments",
  PUBLIC_AGENCY_DONATIONS = "Public Agency Donations",
  NON_PROFIT_DONATIONS = "Non-Profit Donations",
  MISC_TRANSFERS = "Misc Transfers",
  MISC_NON_TRANSFERS = "Misc Non-transfers",
}

export enum DonationsPublic {
  CONSERVATION = "Conservation",
  ECONOMIC_DEVELOPMENT = "Economic Development",
  EDUCATION = "Education",
  PARKS_AND_RECREATION = "Parks and Recreation",
  PUBLIC_SAFETY = "Public Safety",
  PUBLIC_HEALTH = "Public Health",
  FAMILIES_OR_INDIVIDUALS = "Assistance to Impoverished Families or Individuals",
  HOMELESS = "Assistance to the Homeless",
  TWO_OR_MORE = "Two or More of the Above",
  OLDER_AMERICANS = "Assistance to Older Americans",
  OTHERS = "Other",
}
export enum DonationsNonProfit {
  PUBLIC_HEALTH = "Public Health",
  EDUCATION = "Education",
  FAMILIES_OR_INDIVIDUALS = "Assistance to Impoverished Families or Individuals",
  HOMELESS = "Assistance to the Homeless",
  OLDER_AMERICANS = "Assistance to Older Americans",
}

export enum ReceiptsCategory {
  FEDERAL_AGENCY = "Federal Agency",
  FROM_OTHER_STATES = "From Other States",
  FROM_OVERSEAS = "From Overseas",
  OTHER_RECEIPTS_ADJUST = "Other Receipts/POS Adjust",
}

export enum MiscNonTransfer {
  ABANDONED_AND_DESTORYED = "Abandoned or Destroyed",
  SOLD = "Sold",
  OTHER_NEGATIVE_ADJUSTMENTS = "Other Negative Adjustments",
}

export enum MiscTransfer {
  TRANSFERS_TO_VETERAN_ORGANIZATIONS = "Transfers to Veteran Organizations",
  SBA_DISASTER_TRANSFERS = "SBA Disaster Transfers",
  SEA_TRANSFERS = "SEA Transfers",
  SBA_VOSB_TRANSFERS = "SBA VOSB Transfers",
  TRANSFERS_TO_SASP = "Transfers to the SASP",
  SBA_8_TRANSFERS = "SBA 8(a) Transfers",
  TRANSFERS_TO_OTHER_STATES = "Transfers to Other States",
  RETURN_TO_FEDERAL_AGENCY = "Return to Federal Agency",
}

export const titleInfoTips = new Map([
  [
    Titles3040.RECEIPTS,
    "Property recieved during the quarter is entered in this section",
  ],
  [Titles3040.DONATIONS, ""],
  [Titles3040.TRANSFERS, ""],
  [Titles3040.COMMENTS, ""],
  [
    Titles3040.PUBLIC_AGENCY_DONATIONS,
    "Property donated to Public Agencies is entered in the section",
  ],
  [
    Titles3040.NON_PROFIT_DONATIONS,
    "Property donated to Non-profit Organizations is entered in this section.",
  ],
  [
    Titles3040.MISC_TRANSFERS,
    "Property donated to other recipient groups is entered here",
  ],
  [
    Titles3040.MISC_NON_TRANSFERS,
    "Property disposed of or transferred is entered here",
  ],
]);

export const receiptsInfoTips = new Map([
  [ReceiptsCategory.FEDERAL_AGENCY, ""],
  [ReceiptsCategory.FROM_OTHER_STATES, ""],
  [ReceiptsCategory.FROM_OVERSEAS, ""],
  [ReceiptsCategory.OTHER_RECEIPTS_ADJUST, ""],
]);

export const donationsPublicInfoTips = new Map([
  [DonationsPublic.CONSERVATION, ""],
  [DonationsPublic.ECONOMIC_DEVELOPMENT, ""],
  [DonationsPublic.EDUCATION, ""],
  [DonationsPublic.FAMILIES_OR_INDIVIDUALS, ""],
  [DonationsPublic.HOMELESS, ""],
  [DonationsPublic.OLDER_AMERICANS, ""],
  [DonationsPublic.OTHERS, ""],
  [DonationsPublic.PARKS_AND_RECREATION, ""],
  [DonationsPublic.PUBLIC_HEALTH, ""],
  [DonationsPublic.PUBLIC_SAFETY, ""],
  [
    DonationsPublic.TWO_OR_MORE,
    "E.g. Counties/Townships that offer an array of public services",
  ],
]);

export const donationsNonProfitInfoTips = new Map([
  [DonationsNonProfit.EDUCATION, ""],
  [DonationsNonProfit.FAMILIES_OR_INDIVIDUALS, ""],
  [DonationsNonProfit.HOMELESS, ""],
  [DonationsNonProfit.OLDER_AMERICANS, ""],
  [DonationsNonProfit.PUBLIC_HEALTH, ""],
]);

export const miscNonTransferInfoTips = new Map([
  [
    MiscNonTransfer.ABANDONED_AND_DESTORYED,
    "Undistributed property approved for abandonment or destruction",
  ],
  [MiscNonTransfer.OTHER_NEGATIVE_ADJUSTMENTS, ""],
  [MiscNonTransfer.SOLD, "Undistributed property sold"],
]);

export const miscTransferInfoTips = new Map([
  [MiscTransfer.RETURN_TO_FEDERAL_AGENCY, ""],
  [MiscTransfer.SBA_8_TRANSFERS, "Donations to SBA 8(a) Program Participants"],
  [
    MiscTransfer.SBA_DISASTER_TRANSFERS,
    "Donations to small businesses in disaster areas",
  ],
  [
    MiscTransfer.SBA_VOSB_TRANSFERS,
    "Donations to veteran owned small businesses",
  ],
  [
    MiscTransfer.SEA_TRANSFERS,
    "Donations of DOD-generated property to Service Educational Activities",
  ],
  [
    MiscTransfer.TRANSFERS_TO_OTHER_STATES,
    "Undistributed property transferred to another SASP",
  ],
  [
    MiscTransfer.TRANSFERS_TO_SASP,
    "Federal Property acquired under a Coop Agreement for SASP Federal Use",
  ],
  [
    MiscTransfer.TRANSFERS_TO_VETERAN_ORGANIZATIONS,
    "Donations to Veterans Service Organizations",
  ],
]);

export const receiptsIndexs = new Map([
  [0, "pocAdjust"],
  [1, "fromOverSeas"],
  [2, "fromOtherStates"],
  [3, "federalAgencyAmount"],
]);

export const donationsPublicAmountIndexs = new Map([
  [0, "other"],
  [1, "assistanceToOlderAmericans"],
  [2, "assistanceToHomeless"],
  [3, "publicHealth"],
  [4, "education"],
  [5, "conversation"],
]);

export const donationsPublicOtherAmountIndexs = new Map([
  [1, "twoOrMore"],
  [2, "FamiliesOrIndividuals"],
  [3, "publicSafety"],
  [4, "parksAndRecreation"],
  [5, "economicDevelopment"],
]);

export const nonProfitDonationsAmountIndexs = new Map([
  [0, "assistanceToOlderAmericans"],
  [1, "assistanceToHomeless"],
  [2, "education"],
]);

export const nonProfitDonationsOtherAmountIndexs = new Map([
  [1, "familiesOrIndividuals"],
  [2, "publicHealth"],
]);

export const miscAmountIndexs = new Map([
  [0, "transfersToVeteran"],
  [1, "seaTransfers"],
  [2, "transfersToSASP"],
  [3, "transferToOther"],
]);

export const miscOtherAmountIndexs = new Map([
  [0, "sbaDisasterTransfers"],
  [1, "sbaVOSBtransfers"],
  [2, "sbaTransfers"],
  [3, "returnToFederal"],
]);

export const nonMiscAmountIndexs = new Map([
  [0, "otherNegative"],
  [1, "sold"],
]);

export const nonMiscOtherAmountIndexs = new Map([[1, "abandoned"]]);

export function numberWithCommas(value) {
  if (value || value === 0) {
    if (value.toString().substring(0, 1) === "0") {
      return "0";
    } else {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  } else {
    return "";
  }
}

export function convertToNumber(value) {
  if (value || value === 0) {
    return value.toString().replace(/\D+/g, "");
  } else {
    return "";
  }
}

export function formatNumber(value) {
  if (value || value === 0) {
    return value
      .toString()
      .replace(/\D+/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

export function formatNumberWithNegative(value) {
  if (value || value === 0) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

export function formatInventoryValue(value) {
  if (value || value === 0) {
    if (+value.toString().replaceAll(",", "") >= 0) {
      return `$${value
        .toString()
        .replace(/\D+/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    } else {
      return `-$${value
        .toString()
        .replace(/\D+/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  } else {
    return "";
  }
}

export function validateComments(comments, required, sectionName): Validation {
  let validation = {
    isInvalid: false,
    validationError: "",
  };
  if (!comments) {
    comments = "";
  }
  comments = comments?.replace(/(<([^>]+)>)/g, "");
  comments = comments?.replace("'", ".");
  comments = comments?.replace(/&nbsp;/gi, " ");

  if (required) {
    if (comments?.length === 0) {
      validation.isInvalid = true;
      validation.validationError = `${sectionName} is Required.`;
    }
  }

  if (comments?.length > 500) {
    validation.isInvalid = true;
    validation.validationError = `${sectionName} must be shorter than 500 characters.`;
    return validation;
  }
  return validation;
}
