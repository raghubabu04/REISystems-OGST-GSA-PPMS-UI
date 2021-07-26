
export enum LotStatusId {
  ALL_AUCTIONS = "all",
  PREVIEW_AUCTION = "preview",
  NEW_TODAY = "new",
  CLOSING_TODAY = "closing",
  CLOSED_AUCTION = "closed",
}

export const auctionTypeOptions = [
  {
    value: "All Auctions",
    id: LotStatusId.ALL_AUCTIONS,
    isSelected: true,
  },
  {
    value: "Preview Auction",
    id: LotStatusId.PREVIEW_AUCTION,
    isSelected: false,
  },
  {
    value: "New Today",
    id: LotStatusId.NEW_TODAY,
    isSelected: false,
  },
  {
    value: "Closing Today",
    id: LotStatusId.CLOSING_TODAY,
    isSelected: false,
  },
  {
    value: "Closed Auction",
    id: LotStatusId.CLOSED_AUCTION,
    isSelected: false,
  },
];

export const radiusOptions = [
  { value: "5", id: "5" },
  { value: "10", id: "10" },
  { value: "20", id: "20" },
  { value: "30", id: "30" },
  { value: "40", id: "50" },
  { value: "50", id: "50" },
  { value: "60", id: "60" },
  { value: "70", id: "70" },
  { value: "80", id: "80" },
  { value: "90", id: "90" },
  { value: "100", id: "100" },
  { value: "200", id: "200" },
  { value: "300", id: "300" },
  { value: "400", id: "400" },
  { value: "500", id: "500" },
];

export const bidOptions = [
  {
    id: "Y",
    value: "Yes",
    isSelected: false,
  },
  {
    id: "N",
    value: "No",
    isSelected: false,
  },
];

export function populateZipCode(value) {
  const zipSize = value.length;
  if (zipSize < 5 && zipSize >= 1) {
    for (let i = 1; i <= 5 - zipSize; i++) {
      value = "0" + value;
    }
    return value;
  } else {
    return value;
  }
}

export function formatSaleNumber(value) {
  value = value.replaceAll("-", "");
  let formatSaleNumber;
  if (value.length <= 1) {
    formatSaleNumber = value;
  } else if (value.length >= 2 && value.length < 3) {
    formatSaleNumber = value.substring(0, 1) + "-" + value.substring(1, 2);
  } else if (value.length >= 3 && value.length < 6) {
    formatSaleNumber =
      value.substring(0, 1) +
      "-" +
      value.substring(1, 2) +
      "-" +
      value.substring(2, 5);
  } else if (value.length === 6) {
    formatSaleNumber =
      value.substring(0, 1) +
      "-" +
      value.substring(1, 2) +
      "-" +
      value.substring(2, 5) +
      "-" +
      value.substring(5, 6);
  } else if (value.length > 6 && value.length <= 8) {
    formatSaleNumber =
      value.substring(0, 1) +
      "-" +
      value.substring(1, 2) +
      "-" +
      value.substring(2, 5) +
      "-" +
      value.substring(5, 6) +
      "-" +
      value.substring(6, 8);
  } else if (value.length > 8 && value.length <= 11) {
    formatSaleNumber =
      value.substring(0, 1) +
      "-" +
      value.substring(1, 2) +
      "-" +
      value.substring(2, 5) +
      "-" +
      value.substring(5, 6) +
      "-" +
      value.substring(6, 8) +
      "-" +
      value.substring(8, 11);
  } else if (value.length > 11) {
    formatSaleNumber =
      value.substring(0, 1) +
      "-" +
      value.substring(1, 2) +
      "-" +
      value.substring(2, 5) +
      "-" +
      value.substring(5, 6) +
      "-" +
      value.substring(6, 8) +
      "-" +
      value.substring(8, 11) +
      "-" +
      value.substring(11, value.length);
  }
  return formatSaleNumber;
}

export const advancedSearchValuesMap = new Map([
  ["Exact Phrase", "EXACT_PHRASE"],
  ["Any Word", "ANY_WORD"],
  ["All Words", "ALL_WORDS"],
]);
