export const propertyTypeValues = [
  { value: "Airport Donations (YSZ)", id: "YSZ", isSelected: true },
  { value: "Transfer (YSU)", id: "YSU" },
  { value: "Donations (YSV)", id: "YSV" },
];

export const propertyTypeConst = {
  airportDonations: "YSZ",
  transfer: "YSU",
  donations: "YSV",
};

export const propertyActionCodes = {
  publicReports: "A-Public Airports",
  surplusProperty: "H-State Agencies for Surplus Property",
};

export const transferActionCodeOptions = [
  {
    id: "directTransfer",
    value: "Direct Transfer",
    isSelected: false,
  },
  {
    id: "blank",
    value: "Blank",
    isSelected: true,
  },
];

export const gainingAgencyReason = [
  { value: "Special On-Site Screening", id: "01" },
  { value: "Agency Relocation", id: "02" },
  { value: "Direct Transfer", id: "03" },
  { value: "Overseas Property", id: "04" },
  { value: "PPC Property", id: "05" },
  { value: "Other", id: "06" },
];

export const sourceCodeValues = [
  { id: "5", value: "DoD Non-Reported and Exchange/Sale Property" },
  { id: "6", value: "Civilian Agency Non-Reported and Exchange/Sale Property" },
  { id: "8", value: "DoD Non-Reported Contractor Inventory Property" },
  {
    id: "9",
    value: "Civilian Agency Non-Reported Contractor Inventory Property",
  },
  { id: "E", value: "Atlantic Direct Transfer and Donations" },
  { id: "K", value: "Non-Reported Seized and Forfeited" },
  { id: "R", value: "Atlantic Stateside Transfers and Donations" },
  { id: "S", value: "Pacific Stateside Transfers and Donations" },
  { id: "V", value: "Pacific Direct Transfers and Donations" },
];

export const conditionOptions = [
  { id: "N", value: "New or Unused", isSelected: false },
  { id: "U", value: "Usable", isSelected: false },
  { id: "R", value: "Repairable", isSelected: false },
  { id: "X", value: "Salvage", isSelected: false },
  { id: "S", value: "Scrap", isSelected: false },
];


export const personalPropertyCenterOptions =[
  { id: "1", value: "Blank", isSelected: true },
  { id: "2", value: "Franconia", isSelected: false },
]
