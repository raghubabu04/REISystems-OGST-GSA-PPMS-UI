export interface ViewBidsState {
  data: {
    filteredRows: any[];
    selectedTab: string;
    auctionId: string;
    selectedLots: any[];
    newSaleNumber: string;
    lotCustodianData: any;
    salesDetails: any;
    selectedRowDetails: any;
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
    showModal: boolean;
  };
}

export const ViewBidsStateDefault: ViewBidsState = {
  data: {
    filteredRows: [],
    selectedTab: "",
    auctionId: "",
    selectedLots: [],
    newSaleNumber: "",
    lotCustodianData: {},
    salesDetails: {},
    selectedRowDetails: {},
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
    showModal: false,
  },
};
