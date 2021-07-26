import {
  checkMinMaxValue,
  isEmptyCheck,
  isRequiredValidation,
  isRequiredValidationWithMax,
  minMaxValueValidation,
  percentageValidation,
  validateDateTimeRange,
  validateEndDate,
  validateStartDate,
  validateTimeFromTo,
  zipExtensionValidation,
  zipValidation,
} from "../../../../../../../ui-kit/components/validations/FieldValidations";
import {
  currencyToNumber,
  formatCurrency,
  formatPercentage,
  formatTime,
  percentToNumber,
  timeToNumber,
} from "../../../../../../../ui-kit/utilities/FormatUtil";
import { checkForValidity } from "../../../property/common/constants/Utils";
import moment from "moment";

export const saleDetailUpdate = (type, value, state) => {
  switch (type) {
    case "sale-start-date": {
      state.auctionDetail.data.startDate = value;
      break;
    }
    case "sale-start-time": {
      let inputValue = value.target.value
      if (inputValue.length == 2 && value.nativeEvent.inputType=="insertText") {
        state.auctionDetail.data.startTime = formatTime(timeToNumber(inputValue));
      } else {
        state.auctionDetail.data.startTime = inputValue;
      }
      break;
    }
    case "start-am-pm": {
      state.auctionDetail.data.startAmPm = value;
      break;
    }
    case "start-am-pm-options": {
      state.auctionDetail.constants.startAmPmOptions = value;
      break;
    }
    case "sale-end-date": {
      state.auctionDetail.data.endDate = value;
      break;
    }
    case "sale-end-time": {
      let inputValue = value.target.value
      if (inputValue.length == 2 && value.nativeEvent.inputType == "insertText") {
        state.auctionDetail.data.endTime = formatTime(timeToNumber(inputValue));
      } else {
        state.auctionDetail.data.endTime = inputValue;
      }
      break;
    }
    case "end-am-pm": {
      state.auctionDetail.data.endAmPm = value;
      break;
    }
    case "end-am-pm-options": {
      state.auctionDetail.constants.endAmPmOptions = value;
      break;
    }
    case "address-1": {
      state.auctionDetail.data.address.addressLine1 = value;
      break;
    }
    case "address-2": {
      state.auctionDetail.data.address.addressLine2 = value;
      break;
    }
    case "address-3": {
      state.auctionDetail.data.address.addressLine3 = value;
      break;
    }
    case "city": {
      state.auctionDetail.data.address.city = value;
      break;
    }
    case "state": {
      state.auctionDetail.data.address.state = value;
      break;
    }
    case "zip": {
      state.auctionDetail.data.address.zip = value;
      break;
    }
    case "zip2": {
      state.auctionDetail.data.address.zip2 = value;
      break;
    }
    case "starting-bid": {
      state.bidDetail.data.startingBid = value.replace(/[^0-9.]/g, "");
      break;
    }
    case "bid-increment": {
      state.bidDetail.data.bidIncrement = value.replace(/[^0-9.]/g, "");
      break;
    }
    case "reserve-amount": {
      state.bidDetail.data.reserveAmount = value.replace(/[^0-9.]/g, "");
      break;
    }
    case "bid-deposit-amount": {
      state.bidDetail.data.bidDepositAmount = value.replace(/[^0-9.]/g, "");
      break;
    }
    case "reduction-rate": {
      state.bidDetail.data.reductionRate = value.replace(/[^0-9]/g, "");
      break;
    }
    case "no-bid-period": {
      state.bidDetail.data.noBidPeriod = value.replace(/[^0-9]/g, "");
      break;
    }
    case "reduction-nlt": {
      state.bidDetail.data.reductionNLTAmount = value.replace(/[^0-9.]/g, "");
      break;
    }
    case "inactivity-period": {
      state.bidDetail.data.inactivityPeriod = value.replace(/[^0-9]/g, "");
      break;
    }
    case "open-house-from-date": {
      state.openHouseDetail.data.fromDate = value;
      break;
    }
    case "open-house-from-time": {
      let inputValue = value.target.value
      if (inputValue.length == 2 && value.nativeEvent.inputType == "insertText") {
        state.openHouseDetail.data.fromTime = formatTime(timeToNumber(inputValue));
      } else {
        state.openHouseDetail.data.fromTime = inputValue;
      }
      break;
    }
    case "open-house-from-am-pm": {
      state.openHouseDetail.data.fromAmPm = value;
      break;
    }
    case "open-house-from-am-pm-options": {
      state.openHouseDetail.constants.fromAmPmOptions = value;
      break;
    }
    case "open-house-to-date": {
      state.openHouseDetail.data.toDate = value;
      break;
    }
    case "open-house-to-time": {
      let inputValue = value.target.value
      if (inputValue.length == 2 && value.nativeEvent.inputType == "insertText") {
        state.openHouseDetail.data.toTime = formatTime(timeToNumber(inputValue));
      } else {
        state.openHouseDetail.data.toTime = inputValue;
      }
      break;
    }
    case "open-house-to-am-pm": {
      state.openHouseDetail.data.toAmPm = value;
      break;
    }
    case "open-house-to-am-pm-options": {
      state.openHouseDetail.constants.toAmPmOptions = value;
      break;
    }
    case "additional-instructions": {
      state.openHouseDetail.data.additionalInstructions = value;
      break;
    }
  }
  return state;
};

export const saleDetailValidate = (type, value, state) => {
  let validation = { isInvalid: false, validationError: "" };
  switch (type) {
    case "sale-start-date": {
      validation = validateStartDate(value, "Sale", true);
      state.auctionDetail.validation.startDate = validation;
      state.auctionDetail.validation.startEndDateTime = validateDateTimeRange(
        "Sale Start Date",
        "Sale End Date",
        value,
        state.auctionDetail.data.startTime,
        state.auctionDetail.data.startAmPm,
        true,
        state.auctionDetail.data.endDate,
        state.auctionDetail.data.endTime,
        state.auctionDetail.data.endAmPm,
        false
      );
      break;
    }
    case "sale-start-time": {
      validation = validateTimeFromTo(
        "Sale Start Time",
        value,
        state.auctionDetail.data.startAmPm,
        true
      );
      state.auctionDetail.validation.startTime = validation;
      state.auctionDetail.validation.startEndDateTime = validateDateTimeRange(
        "Sale Start Date",
        "Sale End Date",
        state.auctionDetail.data.startDate,
        value,
        state.auctionDetail.data.startAmPm,
        true,
        state.auctionDetail.data.endDate,
        state.auctionDetail.data.endTime,
        state.auctionDetail.data.endAmPm,
        false
      );
      break;
    }
    case "start-am-pm": {
      validation = validateTimeFromTo(
        "Sale Start Time",
        state.auctionDetail.data.startTime,
        value,
        true
      );
      state.auctionDetail.validation.startTime = validation;
      state.auctionDetail.validation.startEndDateTime = validateDateTimeRange(
        "Sale Start Date",
        "Sale End Date",
        state.auctionDetail.data.startDate,
        state.auctionDetail.data.startTime,
        value,
        true,
        state.auctionDetail.data.endDate,
        state.auctionDetail.data.endTime,
        state.auctionDetail.data.endAmPm,
        false
      );
      break;
    }
    case "sale-end-date": {
      validation = validateEndDate(value, "Sale", false);
      state.auctionDetail.validation.endDate = validation;
      state.auctionDetail.validation.startEndDateTime = validateDateTimeRange(
        "Sale Start Date",
        "Sale End Date",
        state.auctionDetail.data.startDate,
        state.auctionDetail.data.startTime,
        state.auctionDetail.data.startAmPm,
        true,
        value,
        state.auctionDetail.data.endTime,
        state.auctionDetail.data.endAmPm,
        false
      );
      break;
    }
    case "sale-end-time": {
      validation = validateTimeFromTo(
        "Sale End Time",
        value,
        state.auctionDetail.data.endAmPm,
        false
      );
      state.auctionDetail.validation.endTime = validation;
      state.auctionDetail.validation.startEndDateTime = validateDateTimeRange(
        "Sale Start Date",
        "Sale End Date",
        state.auctionDetail.data.startDate,
        state.auctionDetail.data.startTime,
        state.auctionDetail.data.startAmPm,
        true,
        state.auctionDetail.data.endDate,
        value,
        state.auctionDetail.data.endAmPm,
        false
      );
      break;
    }
    case "end-am-pm": {
      validation = validateTimeFromTo(
        "Sale End Time",
        state.auctionDetail.data.endTime,
        value,
        false
      );
      state.auctionDetail.validation.endTime = validation;
      state.auctionDetail.validation.startEndDateTime = validateDateTimeRange(
        "Sale Start Date",
        "Sale End Date",
        state.auctionDetail.data.startDate,
        state.auctionDetail.data.startTime,
        state.auctionDetail.data.startAmPm,
        true,
        state.auctionDetail.data.endDate,
        state.auctionDetail.data.endTime,
        value,
        false
      );
      break;
    }
    case "address-1": {
      state.auctionDetail.validation.address.addressLine1 = isRequiredValidation(
        "Address Line 1",
        value
      );
      break;
    }
    case "city": {
      state.auctionDetail.validation.address.city = isRequiredValidation(
        "City",
        value
      );
      break;
    }
    case "state": {
      state.auctionDetail.validation.address.state = isRequiredValidation(
        "State",
        value
      );
      break;
    }
    case "zip": {
      state.auctionDetail.validation.address.zip = zipValidation(value, true);
      break;
    }
    case "zip2": {
      state.auctionDetail.validation.address.zip2 = zipExtensionValidation(
        value
      );
      break;
    }
    case "starting-bid": {
      state.bidDetail.validation.startingBid = isRequiredValidationWithMax(
        "Starting Bid",
        currencyToNumber(value),
        99999999,
        true
      );
      value = value ? currencyToNumber(value) : null;
      state.bidDetail.data.startingBid = value
        ? formatCurrency.format(value)
        : null;
      break;
    }
    case "bid-increment": {
      state.bidDetail.validation.bidIncrement = isRequiredValidationWithMax(
        "Bid Increment",
        currencyToNumber(value),
        99999999,
        true
      );
      value = value ? currencyToNumber(value) : null;
      state.bidDetail.data.bidIncrement = value
        ? formatCurrency.format(value)
        : null;
      break;
    }
    case "reserve-amount": {
      state.bidDetail.validation.reserveAmount = isRequiredValidationWithMax(
        "Reserve Amount",
        value,
        99999999,
        false
      );
      value = value ? currencyToNumber(value) : null;
      state.bidDetail.data.reserveAmount = value
        ? formatCurrency.format(value)
        : null;
      break;
    }
    case "bid-deposit-amount": {
      state.bidDetail.validation.bidDepositAmount = isRequiredValidationWithMax(
        "Bid Deposit Amount",
        value,
        99999999,
        false
      );
      value = value ? currencyToNumber(value) : null;
      state.bidDetail.data.bidDepositAmount = value
        ? formatCurrency.format(value)
        : null;
      break;
    }
    case "reduction-rate": {
      state.bidDetail.validation.reductionRate = percentageValidation(
        value,
        "Reduction Rate",
        checkRequired(state.bidDetail)
      );
      let formattedPercentValue = value ? percentToNumber(value) : null;
      state.bidDetail.data.reductionRate =
        formattedPercentValue && /^\d+$/.test(`${formattedPercentValue}`)
          ? formatPercentage(formattedPercentValue)
          : null;
      if (!checkRequired(state.bidDetail)) {
        state.bidDetail.validation.noBidPeriod = {
          isInvalid: false,
          validationError: "",
        };
        state.bidDetail.validation.reductionNLTAmount = {
          isInvalid: false,
          validationError: "",
        };
      }
      break;
    }
    case "no-bid-period": {
      state.bidDetail.validation.noBidPeriod = minMaxValueValidation(
        value,
        "No Bid Period",
        0,
        50,
        checkRequired(state.bidDetail)
      );
      if (!checkRequired(state.bidDetail)) {
        state.bidDetail.validation.reductionRate = {
          isInvalid: false,
          validationError: "",
        };
        state.bidDetail.validation.reductionNLTAmount = {
          isInvalid: false,
          validationError: "",
        };
      }
      break;
    }
    case "reduction-nlt": {
      state.bidDetail.validation.reductionNLTAmount = isRequiredValidationWithMax(
        "Reduction NLT Amount",
        value,
        99999999.99,
        checkRequired(state.bidDetail)
      );
      let formattedCurrencyValue = value ? currencyToNumber(value) : null;
      state.bidDetail.data.reductionNLTAmount = formattedCurrencyValue
        ? formatCurrency.format(formattedCurrencyValue)
        : null;
      if (!checkRequired(state.bidDetail)) {
        state.bidDetail.validation.reductionRate = {
          isInvalid: false,
          validationError: "",
        };
        state.bidDetail.validation.noBidPeriod = {
          isInvalid: false,
          validationError: "",
        };
      }
      break;
    }
    case "inactivity-period": {
      if (value !== "1440") {
        state.bidDetail.validation.inactivityPeriod = checkMinMaxValue(
          value,
          "Inactivity Period",
          0,
          240,
          1440,
          false
        );
      }
      break;
    }
    case "open-house-from-date": {
      validation = validateStartDate(value, "Date From", true);
      state.openHouseDetail.validation.fromDate = validation;
      state.openHouseDetail.validation.fromToDateTime = validateDateTimeRange(
        "Date From",
        "Date To",
        value,
        state.openHouseDetail.data.fromTime,
        state.openHouseDetail.data.fromAmPm,
        true,
        state.openHouseDetail.data.toDate,
        state.openHouseDetail.data.toTime,
        state.openHouseDetail.data.toAmPm,
        true
      );
      break;
    }
    case "open-house-from-time": {
      validation = validateTimeFromTo(
        "Time From",
        value,
        state.openHouseDetail.data.fromAmPm,
        true
      );
      state.openHouseDetail.validation.fromTime = validation;
      state.openHouseDetail.validation.fromToDateTime = validateDateTimeRange(
        "Date From",
        "Date To",
        state.openHouseDetail.data.fromDate,
        value,
        state.openHouseDetail.data.fromAmPm,
        true,
        state.openHouseDetail.data.toDate,
        state.openHouseDetail.data.toTime,
        state.openHouseDetail.data.toAmPm,
        true
      );
      break;
    }
    case "open-house-from-am-pm": {
      validation = validateTimeFromTo(
        "Time From",
        state.openHouseDetail.data.fromTime,
        value,
        true
      );
      state.openHouseDetail.validation.fromTime = validation;
      state.openHouseDetail.validation.fromToDateTime = validateDateTimeRange(
        "Date From",
        "Date To",
        state.openHouseDetail.data.fromDate,
        state.openHouseDetail.data.fromTime,
        value,
        true,
        state.openHouseDetail.data.toDate,
        state.openHouseDetail.data.toTime,
        state.openHouseDetail.data.toAmPm,
        true
      );
      break;
    }
    case "open-house-to-date": {
      validation = validateEndDate(value, "Date To", true);
      state.openHouseDetail.validation.toDate = validation;
      state.openHouseDetail.validation.fromToDateTime = validateDateTimeRange(
        "Date From",
        "Date To",
        state.openHouseDetail.data.fromDate,
        state.openHouseDetail.data.fromTime,
        state.openHouseDetail.data.fromAmPm,
        true,
        value,
        state.openHouseDetail.data.toTime,
        state.openHouseDetail.data.toAmPm,
        true
      );
      break;
    }
    case "open-house-to-time": {
      validation = validateTimeFromTo(
        "Time To",
        value,
        state.openHouseDetail.data.toAmPm,
        true
      );
      state.openHouseDetail.validation.toTime = validation;
      state.openHouseDetail.validation.fromToDateTime = validateDateTimeRange(
        "Date From",
        "Date To",
        state.openHouseDetail.data.fromDate,
        state.openHouseDetail.data.fromTime,
        state.openHouseDetail.data.fromAmPm,
        true,
        state.openHouseDetail.data.toDate,
        value,
        state.openHouseDetail.data.toAmPm,
        true
      );
      break;
    }
    case "open-house-to-am-pm": {
      validation = validateTimeFromTo(
        "Time To",
        state.openHouseDetail.data.toTime,
        value,
        true
      );
      state.openHouseDetail.validation.toTime = validation;
      state.openHouseDetail.validation.fromToDateTime = validateDateTimeRange(
        "Date From",
        "Date To",
        state.openHouseDetail.data.fromDate,
        state.openHouseDetail.data.fromTime,
        state.openHouseDetail.data.fromAmPm,
        true,
        state.openHouseDetail.data.toDate,
        state.openHouseDetail.data.toTime,
        value,
        true
      );
      break;
    }
  }
  return state;
};
export const validity = (state) => {
  let valid = false;
  let invalidMessage = "";
  let checkAD = checkForValidity(state.auctionDetail.validation);
  if (!checkAD?.isInvalid) {
    let checkBD = checkForValidity(state.bidDetail.validation);
    if (!checkBD.isInvalid) {
      let checkOHD = checkForValidity(state.openHouseDetail.validation);
      if (!checkOHD.isInvalid) {
        valid = true;
      } else {
        invalidMessage = checkOHD.validationError;
      }
    } else {
      invalidMessage = checkBD.validationError;
    }
  } else {
    invalidMessage = checkAD.validationError;
  }
  if (state.sales.saleMethod !== "OA") {
    let checkAAD = checkForValidity(state.auctionDetail.validation.address);
    if (checkAAD?.isInvalid) {
      invalidMessage = checkAAD.validationError;
    }
  }
  return { valid: valid, invalidMessage: invalidMessage };
};

export const checkValidation = (state) => {
  saleDetailValidate(
    "sale-start-date",
    state.auctionDetail.data.startDate,
    state
  );
  saleDetailValidate(
    "sale-start-time",
    state.auctionDetail.data.startTime,
    state
  );
  saleDetailValidate("start-am-pm", state.auctionDetail.data.startAmPm, state);
  saleDetailValidate("sale-end-date", state.auctionDetail.data.endDate, state);
  saleDetailValidate("sale-end-time", state.auctionDetail.data.endTime, state);
  saleDetailValidate("end-am-pm", state.auctionDetail.data.endAmPm, state);
  saleDetailValidate(
    "address-1",
    state.auctionDetail.data.address.addressLine1,
    state
  );
  saleDetailValidate(
    "address-2",
    state.auctionDetail.data.address.addressLine2,
    state
  );
  saleDetailValidate(
    "address-3",
    state.auctionDetail.data.address.addressLine3,
    state
  );
  saleDetailValidate("city", state.auctionDetail.data.address.city, state);
  saleDetailValidate("state", state.auctionDetail.data.address.state, state);
  saleDetailValidate("zip", state.auctionDetail.data.address.zip, state);
  saleDetailValidate("zip2", state.auctionDetail.data.address.zip2, state);
  saleDetailValidate("starting-bid", state.bidDetail.data.startingBid, state);
  saleDetailValidate("bid-increment", state.bidDetail.data.bidIncrement, state);
  saleDetailValidate(
    "reserve-amount",
    state.bidDetail.data.reserveAmount,
    state
  );
  saleDetailValidate(
    "bid-deposit-amount",
    state.bidDetail.data.bidDepositAmount,
    state
  );
  saleDetailValidate(
    "reduction-rate",
    state.bidDetail.data.reductionRate,
    state
  );
  saleDetailValidate("no-bid-period", state.bidDetail.data.noBidPeriod, state);
  saleDetailValidate(
    "reduction-nlt",
    state.bidDetail.data.reductionNLTAmount,
    state
  );
  saleDetailValidate(
    "inactivity-period",
    state.bidDetail.data.inactivityPeriod,
    state
  );
  saleDetailValidate(
    "open-house-from-date",
    state.openHouseDetail.data.fromDate,
    state
  );
  saleDetailValidate(
    "open-house-from-time",
    state.openHouseDetail.data.fromTime,
    state
  );
  saleDetailValidate(
    "open-house-from-am-pm",
    state.openHouseDetail.data.fromAmPm,
    state
  );
  saleDetailValidate(
    "open-house-to-date",
    state.openHouseDetail.data.toDate,
    state
  );
  saleDetailValidate(
    "open-house-to-time",
    state.openHouseDetail.data.toTime,
    state
  );
  saleDetailValidate(
    "open-house-to-am-pm",
    state.openHouseDetail.data.toAmPm,
    state
  );
  saleDetailValidate(
    "additional-instructions",
    state.openHouseDetail.data.additionalInstructions,
    state
  );
  return state;
};

export const updateStateValues = (state, response) => {
  let dateResponseFormat = "YYYY-MM-DDTHH:mm";
  let dateUIFormat = "MM/DD/YYYY";
  let timeUIFormat = "hh:mm";
  let meridianUIFormat = "A";
  let startDate = moment(
    response?.auctionDetailsDTO?.saleStartDate,
    dateResponseFormat
  );
  let endDate = moment(
    response?.auctionDetailsDTO?.saleEndDate,
    dateResponseFormat
  );
  state.auctionDetail.data.startDate = startDate.isValid()
    ? moment(startDate.toDate()).format(dateUIFormat)
    : null;
  state.auctionDetail.data.startTime = startDate.isValid()
    ? moment(startDate.toDate()).format(timeUIFormat)
    : null;
  state.auctionDetail.data.startAmPm = startDate.isValid()
    ? moment(startDate.toDate()).format(meridianUIFormat)
    : "AM";
  state.auctionDetail.data.endDate = endDate.isValid()
    ? moment(endDate.toDate()).format(dateUIFormat)
    : null;
  state.auctionDetail.data.endTime = endDate.isValid()
    ? moment(endDate.toDate()).format(timeUIFormat)
    : null;
  state.auctionDetail.data.endAmPm = endDate.isValid()
    ? moment(endDate.toDate()).format(meridianUIFormat)
    : "AM";
  state.auctionDetail.constants.startAmPmOptions.forEach((item) => {
    console.log({ item });
    if (item.value === state.auctionDetail.data.startAmPm) {
      item.isSelected = true;
    }
  });
  state.auctionDetail.constants.endAmPmOptions.forEach((item) => {
    if (item.value === state.auctionDetail.data.endAmPm) {
      item.isSelected = true;
    }
  });
  state.auctionDetail.data.address.addressLine1 =
    response?.auctionDetailsDTO?.addressDTO?.addressLine1;
  state.auctionDetail.data.address.addressLine2 =
    response?.auctionDetailsDTO?.addressDTO?.addressLine2;
  state.auctionDetail.data.address.addressLine3 =
    response?.auctionDetailsDTO?.addressDTO?.addressLine3;
  state.auctionDetail.data.address.city =
    response?.auctionDetailsDTO?.addressDTO?.city;
  state.auctionDetail.data.address.state =
    response?.auctionDetailsDTO?.addressDTO?.state;
  state.auctionDetail.data.address.zip =
    response?.auctionDetailsDTO?.addressDTO?.zipCode;
  state.auctionDetail.data.address.zip2 =
    response?.auctionDetailsDTO?.addressDTO?.zipExtn;
  state.bidDetail.data.startingBid = response?.biddingDetailsPBSDOIDTO
    ?.startingBid
    ? formatCurrency.format(response?.biddingDetailsPBSDOIDTO?.startingBid)
    : null;

  state.bidDetail.data.bidIncrement = response?.biddingDetailsPBSDOIDTO
    ?.bidIncrement
    ? formatCurrency.format(response?.biddingDetailsPBSDOIDTO?.bidIncrement)
    : null;
  state.bidDetail.data.reserveAmount = response?.biddingDetailsPBSDOIDTO
    ?.reserveAmount
    ? formatCurrency.format(response?.biddingDetailsPBSDOIDTO?.reserveAmount)
    : null;
  state.bidDetail.data.bidDepositAmount = response?.biddingDetailsPBSDOIDTO
    ?.bidDepositAmount
    ? formatCurrency.format(response?.biddingDetailsPBSDOIDTO?.bidDepositAmount)
    : null;
  state.bidDetail.data.reductionRate = response?.biddingDetailsPBSDOIDTO
    ?.reductionRate
    ? formatPercentage(response?.biddingDetailsPBSDOIDTO?.reductionRate)
    : null;
  state.bidDetail.data.noBidPeriod =
    response?.biddingDetailsPBSDOIDTO?.noBidPeriod;
  state.bidDetail.data.reductionNLTAmount = response?.biddingDetailsPBSDOIDTO
    ?.reductionNltAmount
    ? formatCurrency.format(
        response?.biddingDetailsPBSDOIDTO?.reductionNltAmount
      )
    : null;
  state.bidDetail.data.inactivityPeriod =
    response?.biddingDetailsPBSDOIDTO?.inactivityPeriod;
  let fromDate = moment(
    response?.openHouseDTO?.openHouseFromDate,
    dateResponseFormat
  );
  let toDate = moment(
    response?.openHouseDTO?.openHouseToDate,
    dateResponseFormat
  );
  state.openHouseDetail.data.fromDate = fromDate.isValid()
    ? moment(fromDate.toDate()).format(dateUIFormat)
    : null;
  state.openHouseDetail.data.fromTime = fromDate.isValid()
    ? moment(fromDate.toDate()).format(timeUIFormat)
    : null;
  state.openHouseDetail.data.fromAmPm = fromDate.isValid()
    ? moment(fromDate.toDate()).format(meridianUIFormat)
    : "AM";
  state.openHouseDetail.data.toDate = toDate.isValid()
    ? moment(toDate.toDate()).format(dateUIFormat)
    : null;
  state.openHouseDetail.data.toTime = toDate.isValid()
    ? moment(toDate.toDate()).format(timeUIFormat)
    : null;
  state.openHouseDetail.data.toAmPm = toDate.isValid()
    ? moment(toDate.toDate()).format(meridianUIFormat)
    : "AM";
  state.openHouseDetail.constants.fromAmPmOptions.forEach((item) => {
    if (item.value === state.openHouseDetail.data.fromAmPm) {
      item.isSelected = true;
    }
  });
  state.openHouseDetail.constants.toAmPmOptions.forEach((item) => {
    if (item.value === state.openHouseDetail.data.toAmPm) {
      item.isSelected = true;
    }
  });
  state.openHouseDetail.data.additionalInstructions =
    response?.openHouseDTO?.additionalInstructions;
  return state;
};

export const generateValidRequest = (state) => {
  let dateFormat = "YYYY-MM-DDTHH:mm";
  return {
    lotId: parseInt(state?.lot?.data?.lotId),
    lotNumber: state?.lot?.data?.lotNumber,
    salesId: parseInt(state?.sales?.saleId),
    auctionDetailsDTO: {
      saleStartDate: moment(
        `${state?.auctionDetail?.data?.startDate} ${state.auctionDetail.data.startTime} ${state.auctionDetail.data.startAmPm}`
      ).isValid()
        ? moment(
            `${state?.auctionDetail?.data?.startDate} ${state.auctionDetail.data.startTime} ${state.auctionDetail.data.startAmPm}`
          ).format(dateFormat)
        : null,
      saleEndDate: moment(
        `${state?.auctionDetail?.data?.endDate} ${state.auctionDetail.data.endTime} ${state.auctionDetail.data.endAmPm}`
      ).isValid()
        ? moment(
            `${state?.auctionDetail?.data?.endDate} ${state.auctionDetail.data.endTime} ${state.auctionDetail.data.endAmPm}`
          ).format(dateFormat)
        : null,
      addressDTO: {
        addressLine1: state?.auctionDetail?.data?.address?.addressLine1,
        addressLine2: state?.auctionDetail?.data?.address?.addressLine2,
        addressLine3: state?.auctionDetail?.data?.address?.addressLine3,
        zipCode: state?.auctionDetail?.data?.address?.zip,
        city: state?.auctionDetail?.data?.address?.city,
        state: state?.auctionDetail?.data?.address?.state,
        zipExtn: state?.auctionDetail?.data?.address?.zip2,
      },
    },
    biddingDetailsPBSDOIDTO: {
      startingBid: state?.bidDetail?.data?.startingBid?.replace(/[^0-9.]/g, ""),
      reserveAmount: state?.bidDetail?.data?.reserveAmount?.replace(
        /[^0-9.]/g,
        ""
      ),
      bidIncrement: state?.bidDetail?.data?.bidIncrement?.replace(
        /[^0-9.]/g,
        ""
      ),
      bidDepositAmount: state?.bidDetail?.data?.bidDepositAmount?.replace(
        /[^0-9.]/g,
        ""
      ),
      reductionRate: state?.bidDetail?.data?.reductionRate?.replace(
        /[^0-9]/g,
        ""
      ),
      reductionNltAmount: state?.bidDetail?.data?.reductionNLTAmount?.replace(
        /[^0-9.]/g,
        ""
      ),
      inactivityPeriod: state?.bidDetail?.data?.inactivityPeriod,
      noBidPeriod: state?.bidDetail?.data?.noBidPeriod,
    },
    openHouseDTO: {
      openHouseFromDate: moment(
        `${state?.openHouseDetail?.data?.fromDate} ${state.openHouseDetail.data.fromTime} ${state.openHouseDetail.data.fromAmPm}`
      ).isValid()
        ? moment(
            `${state?.openHouseDetail?.data?.fromDate} ${state.openHouseDetail.data.fromTime} ${state.openHouseDetail.data.fromAmPm}`
          ).format(dateFormat)
        : null,
      openHouseToDate: moment(
        `${state?.openHouseDetail?.data?.toDate} ${state.openHouseDetail.data.toTime} ${state.openHouseDetail.data.toAmPm}`
      ).isValid()
        ? moment(
            `${state?.openHouseDetail?.data?.toDate} ${state.openHouseDetail.data.toTime} ${state.openHouseDetail.data.toAmPm}`
          ).format(dateFormat)
        : null,
      additionalInstructions:
        state?.openHouseDetail?.data?.additionalInstructions,
    },
  };
};

export const checkRequired = (bidDetail) => {
  return (
    !isEmptyCheck(bidDetail?.data?.reductionRate) ||
    !isEmptyCheck(bidDetail?.data?.noBidPeriod) ||
    !isEmptyCheck(bidDetail?.data?.reductionNLTAmount)
  );
};
