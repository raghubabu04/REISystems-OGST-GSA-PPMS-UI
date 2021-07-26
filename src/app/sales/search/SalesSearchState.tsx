export interface SalesSearchState {
  zoneList: any[];
  icnDetailsList: any[];
  totalRows: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  rowsPerPageOptions: any[];
  defaultZoneId: string;
  salesAttribute: string;
  itemControlNumber: string;
  icnIsInvalid: boolean;
  icnIsValid: boolean;
  icnValidationMessage: string;
  searchType: {
    type: string;
  };
  isSearchTypeUpdated: boolean;
  salesSearchTypeAdvanced: string;
  advancedSearchText: string;
  vin: string;
  tag: string;
  sales: string;
  lot: string;
  isLotInvalid: boolean;
  lotValidationMessage: string;
  contract: string;
  bidderEmailIsInvalid: boolean;
  bidderEmailIsValid: boolean;
  bidderEmailValidationMessage: string;
  bidderEmail: string;
  bidderfName: string;
  bidderlName: string;
  bidderNumber: string;
  bidderNumberIsInvalid: boolean;
  bidderNumberIsValid: boolean;
  bidderNumberValidationMessage: string;
  showModal: boolean;
  modalMessage: string;
  selectZoneOptions: [
    {
      value: string;
      zones: string;
      id: string;
      isSelected: boolean;
    },
    {
      value: string;
      zones: string;
      id: string;
      isSelected: boolean;
    },
    {
      value: string;
      zones: string;
      id: string;
      isSelected: boolean;
    },
    {
      value: string;
      zones: string;
      id: string;
      isSelected: boolean;
    },
    {
      value: string;
      zones: string;
      id: string;
      isSelected: boolean;
    },
    {
      value: string;
      zones: string;
      id: string;
      isSelected: boolean;
    }
  ];

  bidder: {
    bidderId: number;
    userName: string;
    bidderName: string;
    bidderUsername: string;
    bidderAddress: string;
    bidderStatus: string;
    registrationType: string;
    bidderUserIdsOptions?: any[];
    selectedUserId?: string;
    bidderUserIds?: any[];
    showBidder?: boolean;
    showBidderUserIds?: boolean;
  };
}

export const SalesSearchStateDefault: SalesSearchState = {
  zoneList: [
    {
      value: "All Zones",
      zones: "1,2,3,4,5",
      id: "all",
      isSelected: true,
    },
  ],
  icnDetailsList: [],
  totalRows: 0,
  totalPages: 0,
  perPage: 50,
  currentPage: 1,
  rowsPerPageOptions: [50, 100, 150, 200],
  defaultZoneId: "all",
  salesAttribute: "Item",
  itemControlNumber: "",
  icnIsInvalid: false,
  icnIsValid: false,
  icnValidationMessage: "",
  searchType: {
    type: "ALL_WORDS",
  },
  isSearchTypeUpdated: false,
  salesSearchTypeAdvanced: "ALL_WORDS",
  advancedSearchText: "",
  vin: "",
  tag: "",
  sales: "",
  lot: "",
  isLotInvalid: false,
  lotValidationMessage: "",
  contract: "",
  bidderEmailIsInvalid: false,
  bidderEmailIsValid: false,
  bidderEmailValidationMessage: "",
  bidderEmail: "",
  bidderfName: "",
  bidderlName: "",
  bidderNumber: "",
  bidderNumberIsInvalid: false,
  bidderNumberIsValid: false,
  bidderNumberValidationMessage: "",
  showModal: false,
  modalMessage: "",
  selectZoneOptions: [
    {
      value: "All Zones",
      zones: "1,2,3,4,5",
      id: "all",
      isSelected: true,
    },
    {
      value: "Mid Atlantic Zone",
      zones: "1",
      id: "mid",
      isSelected: false,
    },
    {
      value: "Southeast – Great Lakes Zone",
      zones: "2",
      id: "southeast",
      isSelected: false,
    },
    {
      value: "Southwest – Central Zone",
      zones: "3",
      id: "southwest",
      isSelected: false,
    },
    {
      value: "Pacific Rim Zone",
      zones: "4",
      id: "pacific",
      isSelected: false,
    },
    {
      value: "National Capitol Zone",
      zones: "5",
      id: "national",
      isSelected: false,
    },
  ],
  bidder: {
    bidderId: 0,
    userName: "",
    bidderName: "",
    bidderUsername: "",
    registrationType: "",
    bidderAddress: "",
    bidderStatus: "",
    bidderUserIdsOptions: [],
    selectedUserId: "",
    bidderUserIds: [],
    showBidderUserIds: false,
    showBidder: false,
  },
};
