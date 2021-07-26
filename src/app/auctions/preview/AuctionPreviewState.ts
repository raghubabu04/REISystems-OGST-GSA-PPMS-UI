import {
  auctionTypeOptions,
  bidOptions,
  LotStatusId,
} from "./constants/AuctionPreviewConstant";

export interface AuctionPreviewState {
  auctionTypeOptions: any;
  lotStatus: string;
  advancedSearchType: string;
  advancedSearchText: string;
  searchType: string;
  catergoryOptions: any[];
  selectedCategoryOptions: any[];
  selectedCategoryValues: any[];
  stateOptions: any[];
  selectedStateOptions: any[];
  selectedStateValues: any[];
  toggleExpanded: boolean;
  toDate: string;
  fromDate: string;
  zipCode: string;
  showAlert: boolean;
  alertBody: string;
  selectedRadius: string;
  minimumValue: string;
  maximumValue: string;
  saleNumber: string;
  bidOptions: any[];
  bidRequired: boolean;
  searchModal: boolean;
  page: number;
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
}

export const defaultAuctionPreviewState: AuctionPreviewState = {
  auctionTypeOptions: auctionTypeOptions,
  advancedSearchType: "ALL_WORDS",
  lotStatus: LotStatusId.ALL_AUCTIONS,
  searchType: "all",
  advancedSearchText: "",
  catergoryOptions: [],
  selectedCategoryOptions: [],
  selectedCategoryValues: [],
  stateOptions: [],
  selectedStateOptions: [],
  selectedStateValues: [],
  toggleExpanded: false,
  zipCode: "",
  showAlert: false,
  alertBody: "",
  selectedRadius: "",
  toDate: "",
  fromDate: "",
  minimumValue: "",
  maximumValue: "",
  saleNumber: "",
  bidOptions: bidOptions,
  bidRequired: null,
  searchModal: false,
  page: 1,
  totalRows: 0,
  rowsPerPage: 50,
  currentPage: 1,
};
