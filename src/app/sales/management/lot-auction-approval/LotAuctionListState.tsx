export interface LotAuctionListState {
  data: {
    filteredRows: any[];
    selectedTab: string;
    selectedLots: any[];
    newSaleNumber: string;
    lotCustodianData: any;
    salesDetails: any;
  };
  other: {
    loading: boolean;
    paginationResetDefaultPage: boolean;
    page: any;
    showTransferLotModal: boolean;
    disableUploadButton: boolean;
  };
  checkSelectedValue: boolean;
  isAllPageRowsSelected: boolean;
}

export const LotAuctionListDefaultState: LotAuctionListState = {
  data: {
    filteredRows: [],
    selectedTab: "open",
    selectedLots: [],
    newSaleNumber: "",
    lotCustodianData: {},
    salesDetails: {},
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
    showTransferLotModal: false,
    disableUploadButton: false,
  },
  checkSelectedValue: true,
  isAllPageRowsSelected: false,
};
