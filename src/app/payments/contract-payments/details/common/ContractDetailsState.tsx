export interface ContractDetailsState {
  paymentDetail: {
    data: {
      amountDue: number;
      amountPaid: number;
      processedBy: string;
      methodOfPayment: {
        cash: {
          depositTicketNumber: string;
          depositDate: string;
          amount: number;
        };
        check: {
          voucherDate: string;
          settlementDate: string;
          dateOnCheck: string;
          depositTicketNumber: string;
          checkNumber: string;
          nameOnCheck: string;
          amount: number;
        };
        creditCard: CreditCard[];
        wireTransfer: {
          depositTicketNumber: string;
          nameOnWireTransfer: string;
          amount: number;
        };
      };
    };
    validation: {
      processedBy: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      methodOfPayment: {
        cash: {
          depositTicketNumber: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          depositDate: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          amount: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
        };
        check: {
          voucherDate: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          settlementDate: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          dateOnCheck: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          depositTicketNumber: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          checkNumber: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          nameOnCheck: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          amount: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
        };
        creditCard: ValidCreditCard[];
        wireTransfer: {
          depositTicketNumber: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          nameOnWireTransfer: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
          amount: {
            isInvalid: boolean;
            validationError: string;
            isDisabled: boolean;
          };
        };
      };
    };
  };
  data: {
    filteredRows: any[];
    paymentDetails: any;
    bidderDetails: {
      bidderData: any;
      userData: any;
      bidderId?: string;
      bidderEmail?: string;
      bidderUsername?: string;
    };
    contractFeeDetails: {
      awardAmount: string;
      gsaFee: string;
      agencyReimbursement: string;
      liquidatedDamageFee: string;
      totalRefundAmount?: string;
      claimNumber: string;
      reasonForRefund: string;
      salesNotes?: string;
      originalAwardAmount?: string;
      contractStatus: string;
      paymentStatus: string;
      chargebackAmount: string;
      paymentClaimNumber: string;
      refundType
    };
    contractDetails: {
      saleId: string;
      zoneId: any;
      contractNumber: string;
      contractStatus: string;
      bidderEmail: string;
      salesNumber: string;
      lotId: string;
      fscCode: string;
      paymentDate: string;
      removalDate: string;
      contractId: any;
      lotNumber?: number;
      notesHistory?: any[];
    };
  };
  other: {
    loading: boolean;
    paginationResetDefaultPage: boolean;
    page: any;
    saveDisabled: boolean;
    typesSelected: {
      cash: boolean;
      check: boolean;
      creditCard: boolean;
      wireTransfer: boolean;
    };
  };
}

export const ContractDetailsDefaultState: ContractDetailsState = {
  paymentDetail: {
    data: {
      amountDue: null,
      amountPaid: null,
      processedBy: "",
      methodOfPayment: {
        cash: {
          depositTicketNumber: "",
          depositDate: null,
          amount: null,
        },
        check: {
          voucherDate: null,
          settlementDate: null,
          dateOnCheck: null,
          depositTicketNumber: "",
          checkNumber: "",
          nameOnCheck: "",
          amount: null,
        },
        creditCard: [
          {
            cardNumber: null,
            type: "",
            expDate: null,
            nameOnCard: "",
            cvv: null,
            amount: null,
            authorizationNumber: "",
            trackingID: "",
            authorizationDate: null,
          },
        ],
        wireTransfer: {
          depositTicketNumber: "",
          nameOnWireTransfer: "",
          amount: null,
        },
      },
    },
    validation: {
      processedBy: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      methodOfPayment: {
        cash: {
          depositTicketNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          depositDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          amount: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        },
        check: {
          voucherDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          settlementDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          dateOnCheck: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          depositTicketNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          checkNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          nameOnCheck: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          amount: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        },
        creditCard: [
          {
            cardNumber: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            expDate: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            nameOnCard: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            cvv: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            amount: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            authorizationNumber: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            trackingID: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
            authorizationDate: {
              isInvalid: false,
              validationError: "",
              isDisabled: false,
            },
          },
        ],
        wireTransfer: {
          depositTicketNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          nameOnWireTransfer: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          amount: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        },
      },
    },
  },
  data: {
    filteredRows: [],
    paymentDetails: [],
    bidderDetails: {
      bidderData: {},
      userData: {},
      bidderId: "",
      bidderEmail: "",
      bidderUsername: "",
    },
    contractFeeDetails: {
      awardAmount: "$0.00",
      gsaFee: "$0.00",
      agencyReimbursement: "$0.00",
      liquidatedDamageFee: "$0.00",
      claimNumber: "",
      reasonForRefund: "Default for Non-Removal",
      contractStatus: "Default for non removal",
      paymentStatus: "",
      totalRefundAmount: "$0.00",
      originalAwardAmount: "$0.00",
      chargebackAmount: "0.00",
      paymentClaimNumber: null,
      refundType: "$0.00"
    },
    contractDetails: {
      contractNumber: "",
      saleId: "",
      zoneId: null,
      contractStatus: "",
      bidderEmail: "",
      salesNumber: "",
      lotId: "",
      fscCode: "",
      paymentDate: "",
      removalDate: "",
      contractId: null,
      lotNumber: null,
      notesHistory: [],
    },
  },
  other: {
    loading: false,
    paginationResetDefaultPage: false,
    page: {
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      currentPage: 1,
    },
    saveDisabled: false,
    typesSelected: {
      cash: false,
      check: false,
      creditCard: false,
      wireTransfer: false,
    },
  },
};

interface CreditCard {
  cardNumber: number;
  type: string;
  expDate: string;
  nameOnCard: string;
  cvv: number;
  amount: number;
  authorizationNumber: string;
  trackingID: string;
  authorizationDate: string;
}
interface ValidCreditCard {
  cardNumber: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
  expDate: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
  nameOnCard: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
  cvv: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
  amount: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
  authorizationNumber: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
  trackingID: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
  authorizationDate: {
    isInvalid: boolean;
    validationError: string;
    isDisabled: boolean;
  };
}
