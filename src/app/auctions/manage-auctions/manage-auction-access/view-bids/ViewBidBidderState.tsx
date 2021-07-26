export interface ViewBidBidderState {
  data: {
    filteredRows: any[];
    selectedTab: string;
    auctionId: string;
    lotDetails: any;
  };
  zone: {
    isAddDisabled: boolean;
    isAddAllDisabled: boolean;
    isZoneEmpty: boolean;
    validationMessage: string;
    zoneList: Array<any>;
    selectedZone: string;
    zoneRegions: Array<any>;
    addedZonesList: Array<any>;
  };
  other: {
    loading: boolean;
    paginationResetDefaultPage: boolean;
    page: any;
    filter: {
      bidderUsername?: string;
      bidderName?: string;
      bidderEmail?: string;
      bidType?: string;
      bidStatus?: string;
      bidNumber?: string;
      bidDateTime?: string;
      bidAmount?: string;
      bidProxyAmount?: string;
    };
    showModal: boolean;
  };

  viewBidBidderData: {
    filteredRows: any[];
    selectedTab: string;
    auctionId: string;
    auctionStatus: string;
    selectedLots: any[];
    newSaleNumber: string;
    lotCustodianData: any;
    salesDetails: any;
  };

  cancelBid: {
    showCancelBidConfirmationModal: boolean;
    cancelBidId: string;
    cancelBidConfirmation: string;
    cancelBidConfirmationInvalid: boolean;
    showError: boolean;
    errorMessage: string;
  };
}

export const ViewBidBidderStateDefault: ViewBidBidderState = {
  data: {
    filteredRows: [],
    selectedTab: "",
    auctionId: "",
    lotDetails: {},
  },
  zone: {
    isAddDisabled: true,
    isAddAllDisabled: false,
    isZoneEmpty: false,
    validationMessage: "",
    zoneList: [],
    selectedZone: "",
    zoneRegions: [],
    addedZonesList: [],
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
    filter: {
      bidderUsername: "",
      bidderName: "",
      bidderEmail: "",
      bidType: "",
      bidStatus: "",
      bidNumber: "",
      bidDateTime: "",
      bidAmount: "",
      bidProxyAmount: "",
    },
    showModal: false,
  },
  viewBidBidderData: {
    filteredRows: [],
    selectedTab: "",
    auctionId: "",
    auctionStatus: "",
    selectedLots: [],
    newSaleNumber: "",
    lotCustodianData: {},
    salesDetails: {},
  },
  cancelBid: {
    showCancelBidConfirmationModal: false,
    cancelBidId: "",
    cancelBidConfirmation: "",
    cancelBidConfirmationInvalid: false,
    showError: false,
    errorMessage: "",
  },
};
