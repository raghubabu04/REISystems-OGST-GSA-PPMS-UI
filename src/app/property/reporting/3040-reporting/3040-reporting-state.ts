export interface Reporting3040State {
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  rowsPerPageOptions: [number, number, number, number, number];
  sort: string;
  financialYear: string;
  quarter: string;
  beginningInventory: string;
  totalReceipts: string;
  totalDeduction: string;
  endingInventory: string;
  reportedDate: string;
  status: string;
  fyFilter: string;
  state: string;
  quarterFilter: string;
  beginningInventoryFilter: string;
  totalReceiptsFilter: string;
  totalDeductionFilter: string;
  endingInventoryFilter: string;
  reportedDateFilter: string;
  reportedDateFromFilter: string;
  reportedDateToFilter: string;
  financialyearFilter: string;
  stateFilter: string;

  regionValues: any;
  statusFilter: string;
  startDate: string;
  endDate: string;
}

export const Reporting3040defaultState: Reporting3040State = {
  paginationResetDefaultPage: false,
  filteredItems: [],
  regionValues: [],
  loading: false,
  totalRows: 0,
  totalPages: 0,
  perPage: 50,
  currentPage: 1,
  rowsPerPageOptions: [50, 100, 150, 200, 250],
  sort: "",
  fyFilter: "",
  quarterFilter: "",
  beginningInventoryFilter: "",
  totalReceiptsFilter: "",
  totalDeductionFilter: "",
  endingInventoryFilter: "",
  financialyearFilter: new Date().getFullYear().toString(),
  stateFilter: "",
  state: "",
  reportedDateFilter: "",
  statusFilter: "",
  financialYear: "",
  quarter: null,
  beginningInventory: "",
  totalReceipts: "",
  totalDeduction: "",
  endingInventory: "",
  reportedDate: "",
  status: null,
  startDate: "",
  endDate: "",
  reportedDateFromFilter: "",
  reportedDateToFilter: "",
};
