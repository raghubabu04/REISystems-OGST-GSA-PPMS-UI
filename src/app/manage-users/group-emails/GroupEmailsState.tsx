export interface GroupEmailsState {
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
  groupEmailId: string;
  groupEmailCriteriaId: string;
  fileUploaded: boolean;
  fileInfectedStatus: boolean;
  disableBtn: boolean;
}

export const GroupEmailsStateDefault = {
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
  groupEmailId: null,
  groupEmailCriteriaId: null,
  fileUploaded: false,
  fileInfectedStatus: false,
  disableBtn: false,
};
