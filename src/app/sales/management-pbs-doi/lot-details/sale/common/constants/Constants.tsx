import moment from "moment";

export const resetState = () => {
  return {
    auctionDetail: {
      data: {
        startDate: moment(Date.now()).format("MM/DD/YYYY"),
        startTime: "",
        startAmPm: "",
        endDate: null,
        endTime: "",
        endAmPm: "",
        address: {
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          city: "",
          state: "",
          zip: "",
          zip2: "",
        },
      },
      validation: {
        startDate: { isInvalid: false, validationError: "", isDisabled: false },
        startTime: { isInvalid: false, validationError: "", isDisabled: false },
        startAmPm: { isInvalid: false, validationError: "", isDisabled: false },
        endDate: { isInvalid: false, validationError: "", isDisabled: false },
        endTime: { isInvalid: false, validationError: "", isDisabled: false },
        endAmPm: { isInvalid: false, validationError: "", isDisabled: false },
        startEndDateTime: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        address: {
          zip: { isInvalid: false, validationError: "", isDisabled: false },
          city: { isInvalid: false, validationError: "", isDisabled: false },
          zip2: { isInvalid: false, validationError: "", isDisabled: false },
          addressLine1: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          addressLine2: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          addressLine3: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          state: { isInvalid: false, validationError: "", isDisabled: false },
        },
      },
      constants: {
        startAmPmOptions: [
          { id: `1-start-am-pm`, value: "AM", isSelected: false },
          { id: `2-start-am-pm`, value: "PM", isSelected: false },
        ],
        endAmPmOptions: [
          { id: `1-end-am-pm`, value: "AM", isSelected: false },
          { id: `2-end-am-pm`, value: "PM", isSelected: false },
        ],
      },
    },
    bidDetail: {
      data: {
        startingBid: null,
        bidIncrement: null,
        reserveAmount: null,
        bidDepositAmount: null,
        reductionRate: null,
        noBidPeriod: null,
        reductionNLTAmount: null,
        inactivityPeriod: null,
      },
      validation: {
        startingBid: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        bidIncrement: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        reserveAmount: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        bidDepositAmount: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        reductionRate: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        noBidPeriod: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        reductionNLTAmount: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        inactivityPeriod: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
      },
    },
    openHouseDetail: {
      data: {
        fromDate: moment(Date.now()).format("MM/DD/YYYY"),
        fromTime: "",
        fromAmPm: "",
        toDate: moment(Date.now()).format("MM/DD/YYYY"),
        toTime: "",
        toAmPm: "",
        additionalInstructions: "",
      },
      validation: {
        fromDate: { isInvalid: false, validationError: "", isDisabled: false },
        fromTime: { isInvalid: false, validationError: "", isDisabled: false },
        fromAmPm: { isInvalid: false, validationError: "", isDisabled: false },
        toDate: { isInvalid: false, validationError: "", isDisabled: false },
        toTime: { isInvalid: false, validationError: "", isDisabled: false },
        toAmPm: { isInvalid: false, validationError: "", isDisabled: false },
        fromToDateTime: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        additionalInstructions: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
      },
      constants: {
        fromAmPmOptions: [
          { id: `1-from-am-pm`, value: "AM", isSelected: false },
          { id: `2-from-am-pm`, value: "PM", isSelected: false },
        ],
        toAmPmOptions: [
          { id: `1-to-am-pm`, value: "AM", isSelected: false },
          { id: `2-to-am-pm`, value: "PM", isSelected: false },
        ],
      },
    },
    sales: {
      saleId: null,
      saleNumber: "",
      saleMethod: "",
    },
    lot: {
      data: {
        lotId: null,
        lotNumber: null,
      },
      validation: {
        lotNumber: { isInvalid: false, validationError: "", isDisabled: false },
      },
    },
    other: { fieldDisabled: false, saveDisabled: false },
  };
};
