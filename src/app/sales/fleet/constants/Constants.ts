import { regexForTCNandICN } from "../../constant/Constants";

export const fleetFscValues = [
  {
    id: "2305",
    longName: "2305 - GROUND EFFECT VEHICLES, AUTO, CAR",
  },
  {
    id: "2310",
    longName: "2310 - PASSENGER MOTOR VEHICLES, AUTO, CAR",
  },
  {
    id: "2320",
    longName: "2320 - TRUCKS AND TRACK TRACTORS, WHEELED",
  },
  {
    id: "2330",
    longName: "2330 - TRAILERS, MANUFACTURED HOMES",
  },
  {
    auctionCategoryCode: "170",
    longName: "2340 - MOTORCYCLES, MOTOR SCOOTERS, AND BICYCLES",
  },
];

export const conditionCodeValues = [
  {
    id: "1",
    longName: "Never Used",
  },
  {
    id: "4",
    longName: "Usable/Good Condition",
  },
  {
    id: "7",
    longName: "Repair Needed",
  },
  {
    id: "S",
    longName: "Scrap",
  },
  {
    id: "X",
    longName: "Salvage",
  },
];

export const transmissionValues = [
  {
    id: "Automatic",
    longName: "Automatic",
  },
  {
    id: "Manual",
    longName: "Manual",
  },
];

export function formatPriceNumber(value) {
  value = value.toString().replaceAll(",", "").replaceAll("$", "");
  if (value || value === 0) {
    if (value.toString().substring(0, 1) === "0") {
      return "0";
    } else {
      return value
        .toString()
        .replace(/\D+/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
}

export function formatItemControlNumber(value) {
  value = value.replace(regexForTCNandICN, "");
  if (value.length === 14) {
    value =
      value.substring(0, 6) +
      "-" +
      value.substring(6, 10) +
      "-" +
      value.substring(10, 14);
  } else if (value.length === 15) {
    value =
      value.substring(0, 6) +
      "-" +
      value.substring(6, 10) +
      "-" +
      value.substring(10, 14) +
      "-" +
      value.substring(14, 15);
  }
  return value;
}

export function itemName(make, model, year) {
  let value = "";
  if (make) {
    value += make + " ";
  }
  if (model) {
    value += model + " ";
  }
  if (year) {
    value += year + " ";
  }

  return value;
}

export function formatEditableCellNumber(value) {
  if (value || value === 0) {
    return value
      .toString()
      .replace(/\D+/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}
