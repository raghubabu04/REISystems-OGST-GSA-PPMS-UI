export interface EditFleetDTO {
  lotId: string;
  lotNumber: string;
  salesId: string;
  salesNumber: string;
  aac: string;
  agency: string;
  contactNumber: string;
  propertyType: string;

  //Sale Information Section
  saleStartDate: string;
  saleEndDate: string;
  salesTime: string;
  salesMethod: string;
  saleStatus: string;
  auctionStatus: string;

  //Item Information Section
  icn: string;
  itemName: string;
  fsc: string;
  qty: string;
  unitPrice: string;
  unitMeasurement: string;
  startingPrice: string;
  upsetPrice: string;
  featuredItem: string;
  alcOrStationDeposit: string;
  appropriationFundSymbol: string;
  conditionCode: string;
  submitted: boolean;

  //Property Location Section:
  siteName: string;
  siteAddr: string;
  siteStreet: string;
  siteCity: string;
  siteState: string;
  siteZip: string;
  siteZipExt: string;
  locationCode: string;

  //  Custodian
  custodianName: string;
  custodianEmail: string;
  custodianCcEmail: string;
  custodianPhone: string;
  custodianFax: string;

  //  Lot Information
  inspectionFromDate: string;
  inspectionToDate: string;
  inspectionFromTime: string;
  inspectionToTime: string;
  lotStatus: string;

  //Vehicle Information
  engineNumber: string;
  fuelType: string;
  gvwr: string;
  vehicleType: string;
  dualWheel: string;
  tire: string;
  noPass: string;
  wheelbase: string;
  payload: string;
  isSalvageScrap: string;
  odometerCorrect: string;
  loanValue: string;
  tradeInValue: string;
  retailValue: string;
  manufactureSuggRetailPrice: string;
  vin: string;
  make: string;
  tag: string;
  model: string;
  year: string;
  body: string;
  color: string;
  tone: string;
  cylinders: string;
  noAxle: string;
  hp: string;
  odometerReading: string;
  propertyLotDescription: string;
  transmission: string;
  itemDescription: string;

  //Reporting Agency
  reportingAgencyAddressDTO: {
    reportingAgencyName: string;
    reportingAddressId: string;
    line1: string;
    line2: string;
    city: string;
    stateCode: string;
    zip: string;
    zip2: string;
  };

  //Point of Contact
  pointOfContactDTO: {
    firstName: string;
    lastName: string;
    phone: number;
    phoneExt: string;
    email: string;
    ccEmail: string;
  };
}
