import { StringChain } from "lodash";

export interface EditFleetState {
  accordion: {
    openItems: any[];
    toggleAllAccordion: boolean;
    toggleSaleAccordion: boolean;
    toggleItemAccordion: boolean;
    toggleLotAccordion: boolean;
    toggleLocationAccordion: boolean;
    toggleCustodianAccordion: boolean;
    toggleVehicleAccordion: boolean;
    toggleDescriptionAccordion: boolean;
    toggleUploadAccordion: boolean;
    toggleReportingAgencyAccordion: boolean;
    togglePointOfContactAccordion: boolean;
    toggleUploadMultiplPicturesDocumentsAccordion: boolean;
  };
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  showErrorAlert: boolean;
  FormErrorMessage: string;
  alertBodyArray?: string[];
  isFormValidated?: boolean;
  saleNumber: string;
  lotNumber: string;
  saleId: string;
  aac: string;
  agencyNumber: string;
  showActionHistoryModal: boolean;
  actionHistoryData: any[];
  itemControlNumber: string;
  showSendtoGSAAuctionModal: boolean;
  isSendToGSA: boolean;
  sendAuctionSaveDisable: boolean;
  disableAuctionButton: boolean;
  contractNumber: string;
  propertyType: string;
  submitted: boolean;
}

export const editFleetStateDefault: EditFleetState = {
  accordion: {
    openItems: [
      "toggleItemAccordion",
      "toggleLotAccordion",
      "toggleSaleAccordion",
      "toggleLocationAccordion",
      "toggleCustodianAccordion",
      "toggleReportingAgencyAccordion",
      "togglePointOfContactAccordion",
      "toggleVehicleAccordion",
      "toggleDescriptionAccordion",
      "toggleUploadAccordion",
      "toggleUploadMultiplPicturesDocumentsAccordion",
      "toggleReportingAgencyAccordion",
    ],
    toggleAllAccordion: true,
    toggleItemAccordion: true,
    toggleLotAccordion: true,
    toggleSaleAccordion: true,
    toggleLocationAccordion: true,
    toggleCustodianAccordion: true,
    toggleVehicleAccordion: true,
    toggleDescriptionAccordion: true,
    toggleUploadAccordion: true,
    toggleReportingAgencyAccordion: true,
    togglePointOfContactAccordion: true,
    toggleUploadMultiplPicturesDocumentsAccordion: true,
  },
  isSubmitDisabled: false,
  isSubmitLoading: false,
  showErrorAlert: false,
  FormErrorMessage: "At least One field must be filled.",
  alertBodyArray: [],
  isFormValidated: false,
  saleNumber: "",
  lotNumber: "",
  aac: "",
  agencyNumber: "",
  showActionHistoryModal: false,
  actionHistoryData: [],
  itemControlNumber: "",
  saleId: "",
  showSendtoGSAAuctionModal: false,
  isSendToGSA: false,
  sendAuctionSaveDisable: false,
  disableAuctionButton: false,
  contractNumber: "",
  propertyType: "Fleet",
  submitted: false,
};
