export interface ContractsListState {
  salesId?: any;
  saleNumber?: any;
  contractNumber?: any;
  data: { filteredRows: any[]; selectedTab: string; contractData: any[] };
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
    filter: {
      contractNumber?: string;
      contractStatus?: string;
      bidderEmail?: string;
      fscCode?: string;
      paymentDateFrom?: string;
      paymentDateTo?: string;
      removalDateFrom?: string;
      removalDateTo?: string;
    };
  };
  contractId?: any;
  actionDisabled?: boolean;
}

export const ContractsListDefaultState: ContractsListState = {
  salesId: "",
  saleNumber: "",
  contractNumber: "",
  data: { filteredRows: [], selectedTab: "open", contractData: [] },
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
      sort: "contractNumber,ASC",
    },
    filter: {
      contractNumber: "",
      contractStatus: "",
      bidderEmail: "",
      fscCode: "",
      paymentDateFrom: "",
      paymentDateTo: "",
      removalDateFrom: "",
      removalDateTo: "",
    },
  },
  contractId: "",
  actionDisabled: false,
};
