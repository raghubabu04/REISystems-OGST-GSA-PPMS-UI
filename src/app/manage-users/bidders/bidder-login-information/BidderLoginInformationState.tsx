export interface BidderLoginInformationState {
  id?: bigint;
  regTypeToggle?: string;
  isRegTypeToggleInvalid: boolean;
  regTypeToggleValidationMessage?: string;
  isRegTypeToggleDisabled?: boolean;
  isUsernameInvalid: boolean;
  bidderUsername: string;
  bidderUsernameValidationMessage: string;
  isUsernameDisabled?: boolean;
  isSecurityQuestionInvalid: boolean;
  bidderSecurityQuestionValidationMessage: string;
  bidderSecurityQuestion: string;
  isSecurityQuestionDisabled: boolean;
  isSecurityAnswerInvalid: boolean;
  bidderSecurityAnswerValidationMessage: string;
  bidderSecurityAnswer: string;
  isSecurityAnswerDisabled?: boolean;
  isConfirmLoginLoading: boolean;
  isConfirmLoginDisabled: boolean;
  confirmLoginInfoMessage: string;
  showUsernameError: boolean;
  showUsernameSuccess: boolean;
  loginInfoOptions: any[];
}

export const bidderLoginInformationStateDefault: BidderLoginInformationState = {
  id: null,
  regTypeToggle: "",
  isRegTypeToggleInvalid: false,
  regTypeToggleValidationMessage: "",
  isRegTypeToggleDisabled: false,
  isUsernameInvalid: false,
  bidderUsername: "",
  bidderUsernameValidationMessage: "",
  isUsernameDisabled: false,
  isSecurityQuestionInvalid: false,
  bidderSecurityQuestionValidationMessage: "",
  bidderSecurityQuestion: "",
  isSecurityQuestionDisabled: false,
  isSecurityAnswerInvalid: false,
  bidderSecurityAnswerValidationMessage: "",
  bidderSecurityAnswer: "",
  isSecurityAnswerDisabled: false,
  isConfirmLoginLoading: false,
  isConfirmLoginDisabled: true,
  confirmLoginInfoMessage: "",
  showUsernameError: false,
  showUsernameSuccess: false,
  loginInfoOptions: [
    { value: "Individual", id: "individual", isSelected: false },
    { value: "Company", id: "company", isSelected: false },
  ],
};

export const BidderLoginInformationStateJson = (
  bidderLoginInformationState: BidderLoginInformationState
) => [
  {
    id: bidderLoginInformationState.id,
    registrationType: bidderLoginInformationState.regTypeToggle,
    bidderUserName: bidderLoginInformationState.bidderUsername,
    securityQuestion: bidderLoginInformationState.bidderSecurityQuestion,
    securityAnswer: bidderLoginInformationState.bidderSecurityAnswer,
    bidderStatus: "DRAFT",
  },
];
