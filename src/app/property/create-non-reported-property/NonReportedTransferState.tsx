export interface NonReportedTransferState {
  accordianExpanded?: boolean;
  showErrorAlert?: boolean;
  FormErrorMessage?: string;
  alertBodyArray?: string[];
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  isFormValidated?: boolean;
  verifyDisabled?: boolean;
  isSubmitted?: boolean;
  triggerValidation?: boolean;
  revealConfirmSubmitModal?: boolean;
  campaignId?: string;
  fileInfectedStatus?: boolean;
}

export const NonReportedTransferStateDefault = {
  accordianExpanded: true,
  showErrorAlert: false,
  FormErrorMessage: "",
  alertBodyArray: [],
  isSubmitLoading: false,
  isSubmitDisabled: false,
  isFormValidated: false,
  verifyDisabled: false,
  isSubmitted: false,
  triggerValidation: false,
  revealConfirmSubmitModal: false,
  fileInfectedStatus: false,
};
