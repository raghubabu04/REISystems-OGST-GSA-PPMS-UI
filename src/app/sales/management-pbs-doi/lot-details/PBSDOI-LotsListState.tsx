export interface LotsListPBSDOIState {
  data: { filteredRows: any; selectedTab: string; lotId: string };
  other: { loading: boolean; paginationResetDefaultPage: boolean; page: any; salesNumber: string; salesMethod: string; showDeleteModal: boolean };
}

export const LotsListPBSDOIStateDefault: LotsListPBSDOIState = {
  data: { filteredRows: [], selectedTab: "", lotId: "" },
  other: {
    loading: false,
    paginationResetDefaultPage: false,
    page: {
      totalRows: 0,
      totalPages: 0,
      perPage: 10,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      currentPage: 1,
    },
    salesNumber: "",
    salesMethod: "",
    showDeleteModal: false,
  },
};
