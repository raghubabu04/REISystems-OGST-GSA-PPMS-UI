export interface SalePaymentState {
  accordion: {
    toggleSaleContract: boolean;
    toggleBidderInformation: boolean;
    togglePayment:boolean;
  };
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  showErrorAlert: boolean;
  FormErrorMessage: string;
  alertBodyArray?: string[];
  isFormValidated?: boolean;
}

export const defaultSalePaymentState: SalePaymentState = {
  accordion: {
    toggleSaleContract: true,
    toggleBidderInformation: true,
    togglePayment:true,
  },
  isSubmitDisabled: false,
  isSubmitLoading: false,
  showErrorAlert: false,
  FormErrorMessage: "At least One field must be filled.",
  alertBodyArray: [],
  isFormValidated: false,
};
