export interface MyMessagesState {
  data: {
    filteredRows: any[];
    userId: number;
  };
  other: {
    loading: boolean;
    paginationResetDefaultPage: boolean;
    page: any;
  };
}

export const MyMessagesDefaultState: MyMessagesState = {
  data: {
    filteredRows: [],
    userId: 0,
  },
  other: {
    loading: false,
    paginationResetDefaultPage: false,
    page: {
      totalRows: 0,
      totalPages: 0,
      pageSize: 50,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      currentPage: 1,
    },
  },
};
