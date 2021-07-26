
export interface InternalAgencyState {
  showErrorAlert?: boolean;
  FormErrorMessage?: string;
  alertBodyArray?: string[];
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  isFormValidated?: boolean;
  verifyDisabled?: boolean;
  isSubmitted?: boolean;

}

export const InternalAgencyStateDefault = {
  showErrorAlert: false,
  FormErrorMessage: "",
  alertBodyArray: [],
  isSubmitLoading: false,
  isSubmitDisabled: false,
  isFormValidated: false,
  verifyDisabled: false,
  isSubmitted: false,
};
