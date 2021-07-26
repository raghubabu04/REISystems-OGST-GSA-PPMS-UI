export interface Edit3040ReportingState {
  accordion: {
    toggleAllAccordion: boolean;
    toggleReceiptsAccordion: boolean;
    toggleDonationsAccordion: boolean;
    toggleTransferAccordion: boolean;
    toggleCommentsAccordion: boolean;
    openItems: any[];
  };
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  showErrorAlert: boolean;
  FormErrorMessage: string;
  alertBodyArray?: string[];
  showActionHistoryModal: boolean;
  isFormValidated?: boolean;
  financialYear: string;
  beginningInventory: string;
  endingInventory: string;
  quarter: string;
  reportStatus: string;
  actionHistoryData: any;
  reportStartDate: string;
  reportEndDate: string;
  reportState: string;
  reportedDate: string;
  viewEnabled: boolean;
}

export const Edit3040ReportingStateDefault: Edit3040ReportingState = {
  accordion: {
    toggleAllAccordion: true,
    toggleReceiptsAccordion: true,
    toggleDonationsAccordion: true,
    toggleTransferAccordion: true,
    toggleCommentsAccordion: true,
    openItems: [
      "toggleReceiptsAccordion",
      "toggleDonationsAccordion",
      "toggleTransferAccordion",
      "toggleCommentsAccordion",
    ],
  },
  isSubmitDisabled: false,
  isSubmitLoading: false,
  showErrorAlert: false,
  FormErrorMessage: "At least One field must be filled.",
  alertBodyArray: [],
  showActionHistoryModal: false,
  isFormValidated: false,
  financialYear: "",
  beginningInventory: "",
  endingInventory: "",
  quarter: "",
  reportStatus: "",
  actionHistoryData: [],
  reportStartDate:"",
  reportState:"",
  reportedDate:"",
  reportEndDate:"",
  viewEnabled: false,
};
