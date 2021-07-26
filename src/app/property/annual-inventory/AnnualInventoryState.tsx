export interface AnnualInventoryState {
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  rowsPerPageOptions: [number, number, number, number, number];
  sort: string;
  firearmSerialNoFilter: string;
  itemNameFilter: string;
  lastInventoryDateFromFilter: string;
  lastInventoryDateToFilter: string;
  ownershipChangeDateToFilter: string;
  ownershipChangeDateFromFilter: string;
  icnFilter: string;
  tcnFilter: string;
  inventoryFilter: string;
  itemStatusFilter: string;
  itemStatusValue: string;
  stateCodeFilter: string;
  stateCodeValue: string;
  leaEmailFilter: string;
  leaEmailValue: string;
  organizationNameFilter: string;
  organizationNameValue: string;
  manageInventory: {
    manageInventoryModal: boolean;
    itemControlNumber: string;
    inventory: string;
    comment: string;
    commentIsInvalid: boolean;
  };
  annualInventoryCycle: {
    manageAnnualInventoryModal: boolean;
    cycleStartDate: any;
    cycleEndDate: any;
    enableStartDate: boolean;
    hideAnnualInventoryButton: boolean;
    endDateInvalid: boolean;
  };
  disableManageInventory: boolean;
  toggleAccordion: boolean;
  stateCodeList: any[];
  leaEmailValidationMsg: string;
  leaEmailIsInvalid: boolean;
  orgNameValidationMsg: string;
  orgNameIsInvalid: boolean;
  topApplyBtnIsDisabled: boolean;
  isStateSasp: boolean;
  canViewTopfilters: boolean;
  showTransferModal: boolean;
  transferModalTcn: string;
  transferModalIcn: string;
  transferModalSerialNumber: string;
  transferModalItemName: string;
  transferModalItemStatus: string;
}

export const AnnualInventoryStateDefault: AnnualInventoryState = {
  paginationResetDefaultPage: false,
  filteredItems: [],
  loading: false,
  totalRows: 0,
  totalPages: 0,
  perPage: 50,
  currentPage: 1,
  rowsPerPageOptions: [10, 20, 30, 40, 50],
  sort: "specialDescriptionCode,ASC",
  firearmSerialNoFilter: "",
  itemNameFilter: "",
  lastInventoryDateFromFilter: "",
  lastInventoryDateToFilter: "",
  ownershipChangeDateToFilter: "",
  ownershipChangeDateFromFilter: "",
  icnFilter: "",
  tcnFilter: "",
  inventoryFilter: "",
  itemStatusFilter: "A",
  itemStatusValue: "A",
  stateCodeFilter: "",
  leaEmailFilter: "",
  stateCodeValue: "",
  leaEmailValue: "",
  organizationNameValue: "",
  organizationNameFilter: "",
  manageInventory: {
    itemControlNumber: "",
    manageInventoryModal: false,
    inventory: "",
    comment: "",
    commentIsInvalid: false,
  },
  annualInventoryCycle: {
    manageAnnualInventoryModal: false,
    cycleStartDate: "",
    cycleEndDate: "",
    enableStartDate: true,
    hideAnnualInventoryButton: true,
    endDateInvalid: false,
  },
  disableManageInventory: true,
  toggleAccordion: true,
  stateCodeList: [],
  leaEmailValidationMsg: "",
  leaEmailIsInvalid: false,
  orgNameValidationMsg: "",
  orgNameIsInvalid: false,
  topApplyBtnIsDisabled: false,
  isStateSasp: false,
  canViewTopfilters: false,
  showTransferModal: false,
  transferModalTcn: "",
  transferModalIcn: "",
  transferModalSerialNumber: "",
  transferModalItemName: "",
  transferModalItemStatus: "",
};