export interface BidderTransactionsState {
  data: {
    filteredRows: any[];
    selectedTab: string;
    bidderTransactionsDetails: any;
  };
  other: {
    loading: boolean;
    paginationResetDefaultPage: boolean;
    page: any;
  };
}

export const BidderTransactionsDefaultState: BidderTransactionsState = {
  data: {
    filteredRows: [],
    selectedTab: "",
    bidderTransactionsDetails: {},
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
};
