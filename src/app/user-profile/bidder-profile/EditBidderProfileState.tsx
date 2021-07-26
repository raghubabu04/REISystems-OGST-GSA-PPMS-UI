import React from "react";

export interface EditBidderProfileState {
  isFormValidated?: boolean;
  isSubmitLoading?: boolean;
  isSubmitDisabled?: boolean;
  showErrorAlert?: boolean;
  alertMessages?: string[];
  submitLabel?: string;
  showActionHistoryModal?: boolean;
  actionHistoryData?: any;
}

export const editBidderProfileStateDefault: EditBidderProfileState = {
  isFormValidated: false,
  isSubmitLoading: false,
  isSubmitDisabled: false,
  showErrorAlert: false,
  alertMessages: [],
  submitLabel: "Approve",
  showActionHistoryModal: false,
  actionHistoryData: [],
};
