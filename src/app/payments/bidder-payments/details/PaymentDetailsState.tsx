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
export interface PaymentDetailsState {
  other: {
    saveDisabled: boolean;
    typesSelected: {
      cash: boolean;
      check: boolean;
      creditCard: boolean;
      wireTransfer: boolean;
    };
  };
  bidderDetail: {
    data: {
      userName: string;
      name: string;
      address: string;
      cityState: string;
    };
  };
  awardDetail: {
    data: {
      saleLotNumber: string;
      lotName: string;
      contractNumber: string;
      awardDate: string;
      paymentDueDate: string;
    };
  };
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
}
export const PaymentDetailsStateDefault: PaymentDetailsState = {
  other: {
    saveDisabled: false,
    typesSelected: {
      cash: false,
      check: false,
      creditCard: false,
      wireTransfer: false,
    },
  },
  bidderDetail: {
    data: {
      userName: "",
      name: "",
      address: "",
      cityState: "",
    },
  },
  awardDetail: {
    data: {
      saleLotNumber: "",
      lotName: "",
      contractNumber: "",
      awardDate: "",
      paymentDueDate: "",
    },
  },
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
};
