import React from "react";
import BidderContactInformation from "./bidder-contact-information/BidderContactInformation";
import BidderExperianVerification from "./bidder-experian-verification/BidderExperianVerification";
import BidderLoginInformation from "./bidder-login-information/BidderLoginInformation";
import BidderPersonalInformation from "./bidder-personal-information/BidderPersonalInformation";
import BidderPrimaryAddressInformation from "./bidder-primary-address-information/BidderPrimaryAddressInformation";
import BidderSecondaryAddressInformation from "./bidder-secondary-address-information/BidderSecondaryAddressInformation";

export interface AddBidderState {
  isFormValidated?: boolean;
  isSubmitLoading?: boolean;
  isSubmitDisabled?: boolean;
  showErrorAlert?: boolean;
  alertMessages?: string[];
}

export const addBidderStateDefault: AddBidderState = {
  isFormValidated: false,
  isSubmitLoading: false,
  isSubmitDisabled: false,
  showErrorAlert: false,
  alertMessages: [],
}
