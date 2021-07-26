export interface ManageFleetState {
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  rowsPerPageOptions: [number, number, number, number, number];
  sort: string;

  zone: {
    isAddDisabled: boolean;
    isAddAllDisabled: boolean;
    isZoneEmpty: boolean;
    isZonesPresent: boolean;
    validationMessage: string;
    zoneList: Array<any>;
    selectedZone: string;
    zoneRegions: Array<any>;
    addedZonesList: Array<any>;
  };
  region: string;
  salesId: number;
  salesNumber: string;
  saleStartDate: string;
  saleEndDate: string;
  lotId: number;
  fmslotItemId: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  fsc: string;
  startingBid: number;
  reservePrice: number;
  salvageScrap: boolean;
  featuredItem: boolean;

  zoneFilter: string;
  regionFilter: String;
  salesNumberFilter: string;
  vinFilter: string;
  yearFilter: string;
  makeFilter: string;
  modelFilter: string;
  fscFilter: string;
  startingBidFilter: string;
  reservePriceFilter: string;
  salvageFilter: string;
  featuredItemFilter: string;

  showSendtoGSAAuctionModal: boolean;
  zoneValues: any;
  regionValues: any;
  bid: boolean;
  submitted: boolean;
}

export const ManageFleetDefaultState: ManageFleetState = {
  paginationResetDefaultPage: false,
  filteredItems: [],
  zoneValues: [],
  regionValues: [],
  loading: false,
  totalRows: 0,
  totalPages: 0,
  perPage: 50,
  currentPage: 1,
  rowsPerPageOptions: [50, 100, 150, 200, 250],
  sort: "",

  zoneFilter: "",
  regionFilter: "",
  salesNumberFilter: "",
  vinFilter: "",
  yearFilter: "",
  makeFilter: "",
  modelFilter: "",
  fscFilter: "",
  startingBidFilter: "",
  reservePriceFilter: "",
  salvageFilter: "",
  featuredItemFilter: "",

  zone: {
    isAddDisabled: true,
    isAddAllDisabled: false,
    isZoneEmpty: false,
    isZonesPresent: false,
    validationMessage: "",
    zoneList: ["All Zones", "1", "2", "3", "4"],
    selectedZone: "",
    zoneRegions: [],
    addedZonesList: [],
  },
  region: "",
  salesId: null,
  salesNumber: "",
  saleStartDate: "",
  saleEndDate: "",
  lotId: null,
  fmslotItemId: null,
  vin: "",
  year: null,
  make: "",
  model: "",
  fsc: "",
  startingBid: null,
  reservePrice: null,
  salvageScrap: null,
  featuredItem: null,
  showSendtoGSAAuctionModal: false,
  bid: false,
  submitted: false,
};
