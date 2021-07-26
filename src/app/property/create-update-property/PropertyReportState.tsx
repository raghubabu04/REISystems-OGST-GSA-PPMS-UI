import {FSCModel} from "./federal-supply-class/model/FSCModel";

export interface PropertyReportState {
  showErrorAlert?: boolean;
  FormErrorMessage?: string;
  alertBodyArray?: string[];
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  isFormValidated?: boolean;
  verifyDisabled?: boolean;
  fsc?: FSCModel;
  isSubmitted?: boolean;
  isDraft?: boolean;
  propertyId?: number;
  stateValues?: any[];
  triggerValidation?: boolean;
  fileInfectedStatus?: boolean;
  submittedDate?: Date;
  accordion: {
    toggleAllAccordion: boolean;
    toggleICNAccordion: boolean;
    toggleAgencyInfoAccordion: boolean;
    toggleReportingAgencyAddressAccordion: boolean;
    togglePointofContactAccordion: boolean;
    togglePropertyLocationAccordion: boolean;
    togglePropertyCustodianAccordion: boolean;
    togglePropertyInformationAccordion: boolean;
    toggleFederalSupplyClassAccordion: boolean;
    toggleQuantityAndCostAccordion: boolean;
    toggleAdditionalInformationAccordion: boolean;
    toggleSalesNotesAccordion: boolean;
    toggleUploadMultiplPicturesDocumentsAccordion: boolean;
    toggleGiftInfoAccordion: boolean;
    toggleDonorInfoAccordian: boolean;
    toggleRecipientInfoAccordian: boolean;
    toggleAppraisalInfoAccordion: boolean;
    toggleAppraisalAgencyInformationAccordian: boolean;
    openItems: any[];
  };
  propertyGroup?: string;
  showActionHistoryModal?: boolean;
  showAddToPropertyActionModal: boolean;
  actionHistoryData: any;
  propertyData: any;
  showReportAgain: boolean;
  reportAgain:boolean;
}

export const PropertyReportStateDefault = {
  showErrorAlert: false,
  FormErrorMessage: "",
  alertBodyArray: [],
  isSubmitLoading: false,
  isSubmitDisabled: false,
  isFormValidated: false,
  verifyDisabled: false,
  fsc: new FSCModel(),
  isSubmitted: false,
  isDraft: true,
  propertyId: null,
  stateValues: [],
  triggerValidation: false,
  fileInfectedStatus: false,
  submittedDate: null,
  accordion: {
    toggleAllAccordion: true,
    toggleICNAccordion: true,
    toggleAgencyInfoAccordion: true,
    toggleReportingAgencyAddressAccordion: true,
    togglePointofContactAccordion: true,
    togglePropertyLocationAccordion: true,
    togglePropertyCustodianAccordion: true,
    togglePropertyInformationAccordion: true,
    toggleFederalSupplyClassAccordion: true,
    toggleQuantityAndCostAccordion: true,
    toggleAdditionalInformationAccordion: true,
    toggleSalesNotesAccordion: true,
    toggleUploadMultiplPicturesDocumentsAccordion: true,
    toggleGiftInfoAccordion: true,
    toggleDonorInfoAccordian: true,
    toggleRecipientInfoAccordian: true,
    toggleAppraisalInfoAccordion: true,
    toggleAppraisalAgencyInformationAccordian: true,
    openItems: [
      "toggleICNAccordion",
      "toggleAgencyInfoAccordion",
      "toggleReportingAgencyAddressAccordion",
      "togglePointofContactAccordion",
      "togglePropertyLocationAccordion",
      "togglePropertyCustodianAccordion",
      "togglePropertyInformationAccordion",
      "toggleFederalSupplyClassAccordion",
      "toggleQuantityAndCostAccordion",
      "toggleAdditionalInformationAccordion",
      "toggleSalesNotesAccordion",
      "toggleUploadMultiplPicturesDocumentsAccordion",
      "toggleGiftInfoAccordion",
      "toggleDonorInfoAccordian",
      "toggleRecipientInfoAccordian",
      "toggleAppraisalAgencyInformationAccordian",
      "toggleAppraisalInfoAccordion",
      "toggleAppraisalAgencyInformationAccordian",
    ],
  },
  propertyGroup: "",
  showAddToPropertyActionModal: false,
  actionHistoryData: [],
  showActionHistoryModal: false,
  propertyData: "",
  showReportAgain: false,
  reportAgain: false,
};
