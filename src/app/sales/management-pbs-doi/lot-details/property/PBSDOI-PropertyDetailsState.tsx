export interface PropertyDetailsPBSDOIState {
  other: {
    fieldDisabled: boolean;
    imagesDocumentsDisable: boolean;
    saveDisabled: boolean;
    addPropertyDisabled: boolean;
  };
  propertyDetail: {
    data: {
      urls: {
        id: number;
        name: string;
        url: string;
      }[];
      address: {
        zip: string;
        city: string;
        zip2: string;
        addressLine1: string;
        addressLine2: string;
        addressLine3: string;
        state: string;
      };
      ifb: string;
      propertyName: string;
      caseNumber: string;
      fsc: string;
      fscDoi: string;
      latitude: string;
      description: string;
      category: string;
      longitude: string;
    };
    validation: {
      urls: {
        name: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
        url: {
          isInvalid: boolean;
          validationError: string;
          isDisabled: boolean;
        };
      }[];
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
      ifb: { isInvalid: boolean; validationError: string; isDisabled: boolean };
      propertyName: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      caseNumber: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      fsc: { isInvalid: boolean; validationError: string; isDisabled: boolean };
      lotNumber: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      longitude: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      latitude: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      description: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      category: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
    };
  };
  poc: {
    data: {
      firstName: string;
      middleName: string;
      lastName: string;
      phone: string;
      phoneExtension: string;
      fax: string;
      email: string;
    };
    validation: {
      firstName: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      middleName: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      lastName: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      phone: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      phoneExtension: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
      fax: { isInvalid: boolean; validationError: string; isDisabled: boolean };
      email: {
        isInvalid: boolean;
        validationError: string;
        isDisabled: boolean;
      };
    };
  };
  sales: {
    saleId: number;
    saleNumber: string;
    sellingAgency: string;
  };
  lot: {
    data: {
      lotId: number;
      lotNumber: number;
    };
    validation: {
      lotNumber: { isInvalid: boolean; validationError: string };
    };
  };
}
export const PropertyDetailsPBSDOIStateDefault: PropertyDetailsPBSDOIState = {
  propertyDetail: {
    data: {
      caseNumber: "",
      propertyName: "",
      description: "",
      category: "",
      fsc: "",
      fscDoi: "",
      address: {
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        zip: "",
        zip2: "",
      },
      longitude: "",
      latitude: "",
      ifb: "",
      urls: [],
    },
    validation: {
      lotNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      caseNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      propertyName: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      description: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      category: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      fsc: { isInvalid: false, validationError: "", isDisabled: true },
      address: {
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
        city: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        state: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        zip: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        zip2: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
      },
      longitude: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      latitude: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      ifb: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      urls: [
        {
          name: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          url: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        },
      ],
    },
  },
  poc: {
    data: {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      phoneExtension: "",
      fax: "",
      email: "",
    },
    validation: {
      firstName: { isInvalid: false, validationError: "", isDisabled: false },
      middleName: { isInvalid: false, validationError: "", isDisabled: false },
      lastName: { isInvalid: false, validationError: "", isDisabled: false },
      phone: { isInvalid: false, validationError: "", isDisabled: false },
      phoneExtension: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      fax: { isInvalid: false, validationError: "", isDisabled: false },
      email: { isInvalid: false, validationError: "", isDisabled: false },
    },
  },
  sales: {
    saleId: null,
    saleNumber: "",
    sellingAgency: "",
  },
  lot: {
    data: {
      lotId: null,
      lotNumber: null,
    },
    validation: {
      lotNumber: { isInvalid: false, validationError: "" },
    },
  },
  other: {
    fieldDisabled: false,
    imagesDocumentsDisable: false,
    saveDisabled: false,
    addPropertyDisabled: false,
  },
};
