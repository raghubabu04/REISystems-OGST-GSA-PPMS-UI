export interface BidderPaymentDetailsState {
  data: {
    filteredRows: any[];
    selectedTab: string;
    bidderUserDetails: any;
  };
  other: {
    loading: boolean;
    paginationResetDefaultPage: boolean;
    page: any;
  };
}

export const BidderPaymentDetailsListDefaultState: BidderPaymentDetailsState = {
  data: {
    filteredRows: [],
    selectedTab: "",
    bidderUserDetails: {},
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
