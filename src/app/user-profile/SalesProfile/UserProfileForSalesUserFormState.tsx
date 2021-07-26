

export interface UserProfileForSalesUserFormState {
    isFormValidated?: boolean;
    isSubmitLoading?: boolean;
    isSubmitDisabled?: boolean;
}

export const userProfileForSalesUserFormStateDefault : UserProfileForSalesUserFormState = {
    isFormValidated: false,
    isSubmitLoading: false,
    isSubmitDisabled: false,
}