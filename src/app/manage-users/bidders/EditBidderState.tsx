import React from "react";
import BidderContactInformation from "./bidder-contact-information/BidderContactInformation";
import BidderExperianVerification from "./bidder-experian-verification/BidderExperianVerification";
import BidderLoginInformation from "./bidder-login-information/BidderLoginInformation";
import BidderPersonalInformation from "./bidder-personal-information/BidderPersonalInformation";
import BidderPrimaryAddressInformation from "./bidder-primary-address-information/BidderPrimaryAddressInformation";
import BidderSecondaryAddressInformation from "./bidder-secondary-address-information/BidderSecondaryAddressInformation";
import BidderAccountPreferences from "./bidder-account-preferences/BidderAccountPreferences";

export interface EditBidderState {
  isFormValidated?: boolean;
  isSubmitLoading?: boolean;
  isSubmitDisabled?: boolean;
  showErrorAlert?: boolean;
  alertMessages?: string[];
  submitLabel?: string;
  showActionHistoryModal?: boolean;
  actionHistoryData?: any;
}

export const editBidderStateDefault: EditBidderState = {
  isFormValidated: false,
  isSubmitLoading: false,
  isSubmitDisabled: false,
  showErrorAlert: false,
  alertMessages: [],
  submitLabel: "Approve",
  showActionHistoryModal: false,
  actionHistoryData:[]
}
