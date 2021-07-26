import moment from "moment";

export interface SaleDetailsPBSDOIState {
  auctionDetail: {
    data: {
      startDate: string;
      startTime: string;
      startAmPm: string;
      endDate: string;
      endTime: string;
      endAmPm: string;
      address: {
        addressLine1: string;
        addressLine2: string;
        addressLine3: string;
        city: string;
        state: string;
        zip: string;
        zip2: string;
      };
    };
    validation: {
      startDate: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      startTime: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      startAmPm: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      endDate: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      endTime: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      endAmPm: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      startEndDateTime: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      address: {
        zip: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
        city: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
        zip2: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
        addressLine1: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
        addressLine2: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
        addressLine3: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
        state: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
      };
    };
    constants: {
      startAmPmOptions: any;
      endAmPmOptions: any;
    };
  };
  bidDetail: {
    data: {
      startingBid: number;
      bidIncrement: number;
      reserveAmount: number;
      bidDepositAmount: number;
      reductionRate: number;
      noBidPeriod: string;
      reductionNLTAmount: number;
      inactivityPeriod: string;
    };
    validation: {
      startingBid: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      bidIncrement: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      reserveAmount: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      bidDepositAmount: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      reductionRate: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      noBidPeriod: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      reductionNLTAmount: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      inactivityPeriod: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
    };
  };
  openHouseDetail: {
    data: {
      fromDate: string;
      fromTime: string;
      fromAmPm: string;
      toDate: string;
      toTime: string;
      toAmPm: string;
      additionalInstructions: string;
    };
    validation: {
      fromDate: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      fromTime: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      fromAmPm: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      toDate: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      toTime: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      toAmPm: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      fromToDateTime: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      additionalInstructions: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
    };
    constants: {
      fromAmPmOptions: any;
      toAmPmOptions: any;
    };
  };
  sales: {
    saleId: number;
    saleNumber: string;
    saleMethod: string;
  };
  lot: {
    data: {
      lotId: number;
      lotNumber: number;
    };
    validation: {
      lotNumber: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
    };
  };
  other: { fieldDisabled: boolean; saveDisabled: boolean };
}

export const SaleDetailsPBSDOIStateDefault: SaleDetailsPBSDOIState = {
  auctionDetail: {
    data: {
      startDate: moment(Date.now()).format("MM/DD/YYYY"),
      startTime: "",
      startAmPm: "AM",
      endDate: null,
      endTime: "",
      endAmPm: "AM",
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
      noBidPeriod: "",
      reductionNLTAmount: null,
      inactivityPeriod: "",
    },
    validation: {
      startingBid: { isInvalid: false, validationError: "", isDisabled: false },
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
      noBidPeriod: { isInvalid: false, validationError: "", isDisabled: false },
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
      fromAmPm: "AM",
      toDate: moment(Date.now()).format("MM/DD/YYYY"),
      toTime: "",
      toAmPm: "AM",
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
