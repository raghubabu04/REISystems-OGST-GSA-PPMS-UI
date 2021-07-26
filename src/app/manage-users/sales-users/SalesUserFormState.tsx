export interface SalesUserFormState {
    isFormValidated?: boolean;
    isSubmitLoading?: boolean;
    isSubmitDisabled?: boolean;
    showErrorAlert?: boolean;
    alertMessages?: string[];
    showActionHistoryModal?: boolean;
    actionHistoryData?: any;
}

export const salesUserFormStateDefault : SalesUserFormState = {
    isFormValidated: false,
    isSubmitLoading: false,
    isSubmitDisabled: false,
    showErrorAlert: false,
    alertMessages: [],
    showActionHistoryModal: false,
    actionHistoryData:[]
};
