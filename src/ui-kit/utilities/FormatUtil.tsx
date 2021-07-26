import moment from "moment";
import payment from "payment";
import { isEmptyCheck } from "../components/validations/FieldValidations";

export function formatPhone(phone) {
  const input: string = phone;
  let formattedPhone;
  if (phone.length === 0 || input.length === 0) {
    return "";
  }
  const first = input.substring(0, 3);
  const middle = input.substring(3, 6);
  const last = input.substring(6, 10);
  if (input.length > 6) {
    formattedPhone = `(${first}) ${middle}-${last}`;
  } else if (input.length > 3) {
    formattedPhone = `(${first}) ${middle}`;
  } else if (input.length > 0) {
    formattedPhone = `(${first}`;
  }
  return formattedPhone;
}

export function formatExtension(extension) {
  const input = extension.replace(/[^0-9]/g, "").substring(0, 7);
  if (extension.length === 0 || input.length === 0) {
    return "";
  }
  //const input: string = extension;
  let formattedExtension: any;
  const first = input.substring(0, 3);
  const last = input.substring(3, 7);
  if (input.length > 3) {
    formattedExtension = `${first}-${last}`;
  } else if (input.length > 0) {
    formattedExtension = `${first}`;
  }
  return formattedExtension;
}

export function nullToStringUtil(stringToCheck) {
  return !stringToCheck ||
    false ||
    stringToCheck.toString() === "null" ||
    stringToCheck.toString() === "0" ||
    stringToCheck.toString().trim() === ""
    ? ""
    : stringToCheck;
}

export function formatDate(date) {
  if (date) {
    const dateValue = new Date(date);
    const month = dateValue.getMonth() + 1;
    const dd =
      dateValue.getDate().toString().length < 2
        ? "0" + dateValue.getDate()
        : dateValue.getDate();
    const mm = month.toString().length < 2 ? "0" + month : month;
    const yyyy = dateValue.getFullYear();
    return mm + "/" + dd + "/" + yyyy;
  }
}

export function formatICN(icnNumber) {
  let formattedicnValue;
  if (icnNumber && icnNumber.length === 14) {
    formattedicnValue =
      icnNumber.substring(0, 6) +
      "-" +
      icnNumber.substring(6, 10) +
      "-" +
      icnNumber.substring(10, 14);
  } else if (icnNumber && icnNumber.length === 15) {
    formattedicnValue =
      icnNumber.substring(0, 6) +
      "-" +
      icnNumber.substring(6, 10) +
      "-" +
      icnNumber.substring(10, 14) +
      "-" +
      icnNumber.substring(14, 15);
  }
  return formattedicnValue;
}

export function formatTCN(tcn) {
  return tcn ? tcn.replace(/(.{2})(.{2})(.{6})/, "$1-$2-$3") : "";
}

export function formatSaleNumber(saleNumber) {
  if (isEmptyCheck(saleNumber)) {
    return "";
  }
  let formattedSaleNumber: string =
    saleNumber.substring(0, 1) +
    "-" +
    saleNumber.substring(1, 2) +
    "-" +
    saleNumber.substring(2, 5) +
    "-" +
    saleNumber.substring(5, 6) +
    "-" +
    saleNumber.substring(6, 8) +
    "-" +
    saleNumber.substring(8, 11);
  if (saleNumber.length > 11) {
    formattedSaleNumber =
      formattedSaleNumber + "-" + saleNumber.substring(11, saleNumber.length);
  }
  return formattedSaleNumber;
}

export function formatSaleNumberForOptions(saleNumber) {
  let formattedSaleNumber = "";

  if (saleNumber) {
    if (saleNumber.length > 0) {
      formattedSaleNumber = saleNumber.substring(0, 1);
    }
    if (saleNumber.length > 1) {
      formattedSaleNumber += "-" + saleNumber.substring(1, 2);
    }
    if (saleNumber.length > 2) {
      formattedSaleNumber += "-" + saleNumber.substring(2, 5);
    }
    if (saleNumber.length > 5) {
      formattedSaleNumber += "-" + saleNumber.substring(5, 6);
    }
    if (saleNumber.length > 6) {
      formattedSaleNumber += "-" + saleNumber.substring(6, 8);
    }
    if (saleNumber.length > 8) {
      formattedSaleNumber += "-" + saleNumber.substring(8, 11);
    }
    if (saleNumber.length > 11) {
      formattedSaleNumber += "-" + saleNumber.substring(11, saleNumber.length);
    }
  }

  return formattedSaleNumber;
}

export function formatContractNumber(contractNumber) {
  //TODO Add contract number formatter
  return contractNumber;
}

export function formatSaleNumberPBSDOI(saleNumber) {
  let formattedSaleNumber;

  formattedSaleNumber =
    saleNumber.substring(0, 6) +
    "-" +
    saleNumber.substring(6, 8) +
    "-" +
    saleNumber.substring(8, 11);
  if (saleNumber.length > 11) {
    formattedSaleNumber =
      formattedSaleNumber + "-" + saleNumber.substring(11, saleNumber.length);
  }
  return formattedSaleNumber;
}

export function getFiscalYearEndDate(date) {
  var formattedDate = moment(new Date(date)).toDate();
  var year = formattedDate.getFullYear();

  var month = formattedDate.getMonth();
  if (month >= 9) {
    year = year + 1;
  }
  // return formattedDate.getFullYear();
  return year;
}

export const getDateFrom = (date) =>
  moment(moment(date).format("YYYY-MM-DD")).format("YYYY-MM-DDT00:00:00.000");
export const getDateTo = (date) =>
  moment(moment(date).format("YYYY-MM-DD")).format("YYYY-MM-DDT23:59:59.999");

export const oneToThreeDigitFormatter = (num) =>
  num.toLocaleString("en-US", {
    minimumIntegerDigits: 3,
    useGrouping: false,
  });

/**
 * Sanitize URL - Sourced from Braintree - @braintree/sanitize-url
 */

const invalidProtocolRegex = /^(%20|\s)*(decodeURIComponent|javascript|data|vbscript)/im;
const ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim;
const urlSchemeRegex = /^([^:]+):/gm;
const relativeFirstCharacters = [".", "/"];

function isRelativeUrlWithoutProtocol(url: string): boolean {
  return relativeFirstCharacters.indexOf(url[0]) > -1;
}

export function sanitizeUrl(url?: string): string {
  const sanitizedUrl = url.replace(ctrlCharactersRegex, "").trim();

  if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
    return sanitizedUrl;
  }

  const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);

  if (!urlSchemeParseResults) {
    return sanitizedUrl;
  }

  const urlScheme = urlSchemeParseResults[0];

  if (invalidProtocolRegex.test(urlScheme)) {
    return "about:blank";
  }

  return sanitizedUrl;
}

export const formatTime = (time) => {
  let formattedTime = "";
  if (time) {
    if (time.length < 2) {
      formattedTime = time;
    } else if (time.length === 2) {
      formattedTime = `${time.substring(0, 2)}:`;
    } else if (time.length > 3) {
      formattedTime = `${time.substring(0, 2)}:${time.substring(2, 4)}`;
    } else if (time.length === 3) {
      formattedTime = `${time.substring(0, 2)}`;
    }
  } else {
    formattedTime = null;
  }

  return formattedTime;
};

export const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatCreditCard = (value) => payment.fns.formatCardNumber(value);

export const formatCurrencyWODecimal = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const currencyToNumber = (currency) => {
  return currency
    ? Number(currency.toString().replace(/[^0-9\.-]+/g, ""))
    : null;
};

export const formatPercentage = (value) => {
  return value ? `${value}%` : null;
};
export const percentToNumber = (value) => {
  return value ? parseInt(`${value}`.replaceAll("%", "")) : null;
};

export const timeToNumber = (value) => {
  return value ? `${value}`.replaceAll(":", "") : null;
};

export function formatClaimNumber(claimNumber) {
  let formattedClaimNumber;

  if (claimNumber && claimNumber.length >= 9)
    formattedClaimNumber =
      claimNumber.substring(0, 2) +
      "-" +
      claimNumber.substring(2, 3) +
      "-" +
      claimNumber.substring(3, 8) +
      "-" +
      claimNumber.substring(8);
  return formattedClaimNumber;
}

export function numPadding(num, size) {
  if (num) {
    num = num?.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
  return num;
}

export const formatDateTime = (date) => {
  return moment(date).format("MM/DD/YYYY @ hh:mmA CT");
};
