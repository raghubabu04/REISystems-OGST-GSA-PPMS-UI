export interface CreateWantListState {
  accordianExpanded?: boolean;
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  showErrorAlert: boolean;
  FormErrorMessage: string;
  alertBodyArray?: string[];
  showActionHistoryModal: boolean;
  isFormValidated?: boolean;
}

export const CreateWantListStateDefault: CreateWantListState = {
  accordianExpanded: true,
  isSubmitDisabled: false,
  isSubmitLoading: false,
  showErrorAlert: false,
  FormErrorMessage: "At least One field must be filled.",
  alertBodyArray: [],
  showActionHistoryModal: false,
  isFormValidated: false,
};
