import { ContractTransactionState } from "./ContractTransactionState";

export interface ContractDocumentationState {
  contractData: any;
  lotData: any;
  fileInfectedStatus: boolean;
  isUploadCancelled: boolean;
  salesDetails?: any;
  actionDisabled: boolean;
}

export const ContractDocumentationStateDefault: ContractDocumentationState = {
  contractData: {
    contractNumber: "",
    contractStatus: "",
    bidderEmail: "",
    fscCode: "",
    paymentDate: "",
    removalDate: "",
    salesNumber: "",
    updatedAt: "",
    createdBy: "",
    updatedBy: "",
    createdByName: "",
    contractScoContact: "",
    contractAlternateScoContact: "",
    useAlternateSco: false,
  },
  lotData: [],
  fileInfectedStatus: false,
  isUploadCancelled: false,
  salesDetails: [],
  actionDisabled: false,
};
