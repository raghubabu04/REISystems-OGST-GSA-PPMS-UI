export interface MarketingCampaignState {
    accordianExpanded?:boolean;
    showErrorAlert?: boolean;
    FormErrorMessage?: string;
    alertBodyArray?: string[];
    isSubmitDisabled?: boolean;
    isSubmitLoading?: boolean;
    isFormValidated?: boolean;
    verifyDisabled?: boolean;
    isSubmitted?: boolean;
    triggerValidation?:boolean;
    revealConfirmSubmitModal?:boolean;
    campaignId?:string;

  }

  export const MarketingCampaignStateDefault = {
    accordianExpanded: true,
    showErrorAlert: false,
    FormErrorMessage: "",
    alertBodyArray: [],
    isSubmitLoading: false,
    isSubmitDisabled: false,
    isFormValidated: false,
    verifyDisabled: false,
    isSubmitted: false,
    triggerValidation:false,
    revealConfirmSubmitModal:false
  };
