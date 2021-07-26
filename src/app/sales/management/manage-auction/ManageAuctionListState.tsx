export interface ManageAuctionListState {
  data: {
    filteredRows: any[];
  };
  other: {
    loading: boolean;
    paginationResetDefaultPage: boolean;
    page: any;
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
}

export const ManageAuctionListDefaultState: ManageAuctionListState = {
  data: {
    filteredRows: []
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
};
