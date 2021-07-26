import PPMSLot from "../../../../../ui-kit/components/sales/PPMSLot";
import React from "react";
import ContractDetails from "./ContractDetails";

export interface ContractTransactionState {
  contractNumber?: string;
  contractStatus?: string;
  saleNumber?: string;
  lotId?: string;
  creationUser?: string;
  lastUpdated?: string;
  lastUpdatedBy?: string;
  salesDetails?: any;
  bidderName?: string;
  bidderNumber?: string;
  awardDate?: string;
  awardAmount?: string;
  amountDue?: string;
  reserveMet?: string;
  actionHistoryData?: any;
  showActionHistoryModal?: boolean;
  contractData: any;
  withdrawReason?: string;
  withdrawErrorMsg?: string;
  withdrawInvalid?: boolean;
  awardData: any;
  salesNumberDetails: any;
  errors: {
    invalidLots: any[];
  };
  constants: {
    lotOptions: any[];
    lotOptionsData: any[];
    isLotDescriptionDisabled: boolean;
    selectedLotDescriptionType: string;
    lotDescriptionType: any[];
  };
  data: {
    salesId: number;
    lots: any[];
    salesDetails: any;
    totalIcnCount: number;
    totalLotCount: number;
    newSaleNumber: string;
  };
  lotData: any;
  other: {
    totalProperties: number;
    page: any;
    actionDisabled: boolean;
    showDelotModal: boolean;
    showVoidContractModal: boolean;
    property: any;
  };
  voidType: string;
  delotAllNote: string;
  delotAllErrorMsg: string;
  delotAllInvalid: boolean;
  bidder?: {
    userId: number;
    userName: string;
    saleNumber: string;
    lotNumber: string;
    bidAmount: string;
    bidderAdded: boolean;
  };
  bidderUserIdsOptions?: any[];
  selectedUserId?: string;
}
export const ContractTransactionStateDefault: ContractTransactionState = {
  contractNumber: "",
  contractStatus: "",
  saleNumber: "",
  lotId: "",
  creationUser: "",
  lastUpdated: "",
  lastUpdatedBy: "",

  bidderName: "",
  bidderNumber: "",
  awardDate: "",
  awardAmount: "",
  amountDue: "",
  reserveMet: "",

  contractData: {
    contractId: "",
    contractStatus: "",
    contractNumber: "",
    bidderEmail: "",
    claimNumber: "",
    fscCode: "",
    paymentDate: "",
    removalDate: "",
    salesNumber: "",
    updatedAt: "",
    createdBy: "",
    updatedBy: "",
    createdByName: "",
    paymentStatus: "",
    nonPayDefaultDate: "",
    nonRemDefaultDate: "",
    prelPaymentDueDate: "",
    prelRemovalDueDate: "",
    paymentInfoDTOList: [],
    contractScoContact: "",
    contractAlternateScoContact: "",
    useAlternateSco: false,
  },

  withdrawReason: "",
  withdrawErrorMsg: "",
  withdrawInvalid: false,
  awardData: {},
  salesNumberDetails: {
    preliminaryRemovalDueDate: "",
    removalDueDate: "",
  },
  constants: {
    lotOptions: [],
    lotOptionsData: [],
    selectedLotDescriptionType: "ICN",
    lotDescriptionType: [
      { id: "ICN", value: "Use ICN Description" },
      { id: "CUS", value: "Custom Description" },
    ],
    isLotDescriptionDisabled: true,
  },
  errors: {
    invalidLots: [],
  },
  other: {
    totalProperties: 0,
    page: {
      currentPage: 1,
      totalRows: 0,
      pageSize: 10,
    },
    actionDisabled: true,
    showDelotModal: false,
    showVoidContractModal: false,
    property: {},
  },

  lotData: [],
  actionHistoryData: [],
  showActionHistoryModal: false,
  data: {
    salesId: 0,
    lots: [],
    totalIcnCount: 0,
    totalLotCount: 0,
    salesDetails: [],
    newSaleNumber: "",
  },
  voidType: "",
  delotAllNote: "",
  delotAllErrorMsg: "",
  delotAllInvalid: false,
  bidder: {
    userId: 0,
    userName: "",
    saleNumber: "",
    lotNumber: "",
    bidAmount: "",
    bidderAdded: false,
  },
  bidderUserIdsOptions: [],
  selectedUserId: "",
};
