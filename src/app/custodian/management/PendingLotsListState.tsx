export interface PendingLotsListState {
    data: { filteredRows: any[]; selectedTab: string };
    other: { loading: boolean; paginationResetDefaultPage: boolean; page: any };
  }
  
  export const PendingLotsListDefaultState: PendingLotsListState = {
    data: { filteredRows: [], selectedTab: "open" },
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
  