export interface ManageAuctionAccessState {
  data: {
    filteredRows: any[];
    filteredRowsforManageBidder: any[];
    selectedTab: string;
    auctionId: string;
    selectedLots: any[];
    newSaleNumber: string;
    lotCustodianData: any;
    salesDetails: any;
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
  salesMethod: string;
  showActionHistoryModal?: boolean;
  actionHistoryData?: any;
  isLoading: boolean;
}

export const ManageAuctionAccessStateDefault: ManageAuctionAccessState = {
  data: {
    filteredRows: [],
    filteredRowsforManageBidder: [],
    selectedTab: "",
    auctionId: "",
    selectedLots: [],
    newSaleNumber: "",
    lotCustodianData: {},
    salesDetails: {},
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
  salesMethod: "",
  showActionHistoryModal: false,
  actionHistoryData: [],
  isLoading: true,
};
