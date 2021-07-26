import React, { createContext, useState } from "react";
import { AddBidderState, addBidderStateDefault } from "./AddBidderState";
import { EditBidderState, editBidderStateDefault } from "./EditBidderState";
import {
  BidderContactInformationState,
  bidderContactInformationStateDefault,
} from "./bidder-contact-information/BidderContatInformationState";
import {
  BidderLoginInformationState,
  bidderLoginInformationStateDefault,
} from "./bidder-login-information/BidderLoginInformationState";
import {
  BidderPersonalInformationState,
  bidderPersonalInformationStateDefault,
} from "./bidder-personal-information/BidderPersonalInformationState";
import {
  BidderPrimaryAddressInformationState,
  bidderPrimaryAddressInformationStateDefault,
} from "./bidder-primary-address-information/BidderPrimaryAddressInformationState";
import {
  BidderSecondaryAddressInformationState,
  bidderSecondaryAddressInformationStateDefault,
} from "./bidder-secondary-address-information/BidderSecondaryAddressInformationState";
import {
  bidderExperianVerificationDefault,
  BidderExperianVerificationState,
} from "./bidder-experian-verification/BidderExperianVerificationState";
import {
  BidderTermsAndConditionsState,
  bidderTermsAndConditionsStateDefault,
} from "./bidder-terms-and-conditions/BidderTermsAndConditionState";
import {
  BidderAccountPreferencesState,
  bidderAccountPreferencesStateDefault,
} from "./bidder-account-preferences/BidderAccountPreferencesState";
import {
  EditBidderProfileState,
  editBidderProfileStateDefault,
} from "../../user-profile/bidder-profile/EditBidderProfileState";
import { TermsAndConditionsState, termsAndConditionsStateDefault } from "./termsAndConditions/TermsAndConditionsState";

interface BidderContext {
  bidderLoginInformationState: BidderLoginInformationState;
  updateBidderLoginInformationState: React.Dispatch<React.SetStateAction<any>>;
  bidderPersonalInformationState: BidderPersonalInformationState;
  updateBidderPersonalInformationState: React.Dispatch<
    React.SetStateAction<any>
  >;
  bidderPrimaryAddressInformationState: BidderPrimaryAddressInformationState;
  updateBidderPrimaryAddressInformationState: React.Dispatch<
    React.SetStateAction<any>
  >;
  bidderSecondaryAddressInformationState: BidderSecondaryAddressInformationState;
  updateBidderSecondaryAddressInformationState: React.Dispatch<
    React.SetStateAction<any>
  >;
  bidderContactInformationState: BidderContactInformationState;
  updateBidderContactInformationState: React.Dispatch<
    React.SetStateAction<any>
  >;
  addBidderState: AddBidderState;
  updateAddBidderState: React.Dispatch<React.SetStateAction<any>>;
  editBidderState: EditBidderState;
  updateEditBidderState: React.Dispatch<React.SetStateAction<any>>;
  editBidderProfileState: EditBidderProfileState;
  updateEditBidderProfileState: React.Dispatch<React.SetStateAction<any>>;
  bidderTermsAndConditionsState: BidderTermsAndConditionsState;
  updateBidderTermsAndConditionsState: React.Dispatch<
    React.SetStateAction<any>
  >;
  bidderExperianVerificationState: BidderExperianVerificationState;
  updateBidderExperianVerificationState: React.Dispatch<
    React.SetStateAction<any>
  >;
  bidderAccountPreferencesState: BidderAccountPreferencesState;
  updateBidderAccountPreferencesState: React.Dispatch<
    React.SetStateAction<any>
  >;
  termsAndConditionsState: TermsAndConditionsState;
  updateTermsAndConditionsState: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export const BidderContext = createContext({} as BidderContext);

export const BidderProvider = ({ children }) => {
  const [
    bidderLoginInformationState,
    setBidderLoginInformationState,
  ] = useState<BidderLoginInformationState>(bidderLoginInformationStateDefault);
  const [
    bidderPersonalInformationState,
    setBidderPersonalInformationState,
  ] = useState<BidderPersonalInformationState>(
    bidderPersonalInformationStateDefault
  );
  const [
    bidderPrimaryAddressInformationState,
    setBidderPrimaryAddressInformationState,
  ] = useState<BidderPrimaryAddressInformationState>(
    bidderPrimaryAddressInformationStateDefault
  );
  const [
    bidderSecondaryAddressInformationState,
    setBidderSecondaryAddressInformationState,
  ] = useState<BidderSecondaryAddressInformationState>(
    bidderSecondaryAddressInformationStateDefault
  );
  const [
    bidderContactInformationState,
    setBidderContactInformationState,
  ] = useState<BidderContactInformationState>(
    bidderContactInformationStateDefault
  );
  const [addBidderState, setAddBidderState] = useState<AddBidderState>(
    addBidderStateDefault
  );
  const [
    bidderExperianVerificationState,
    setBidderExperianVerificationState,
  ] = useState<BidderExperianVerificationState>(
    bidderExperianVerificationDefault
  );
  const [
    bidderTermsAndConditionsState,
    setBidderTermsAndConditionsState,
  ] = useState<BidderTermsAndConditionsState>(
    bidderTermsAndConditionsStateDefault
  );
  const [
    bidderAccountPreferencesState,
    setBidderAccountPreferencesState,
  ] = useState<BidderAccountPreferencesState>(
    bidderAccountPreferencesStateDefault
  );
  const [
    termsAndConditionsState,
    setTermsAndConditionsState,
  ] = useState<TermsAndConditionsState>(
    termsAndConditionsStateDefault
  );
  const [editBidderState, setEditBidderState] = useState<EditBidderState>(
    editBidderStateDefault
  );
  const [editBidderProfileState, setEditBidderProfileState] = useState<
    EditBidderProfileState
  >(editBidderProfileStateDefault);

  const value = {
    bidderLoginInformationState,
    updateBidderLoginInformationState,
    bidderPersonalInformationState,
    updateBidderPersonalInformationState,
    bidderPrimaryAddressInformationState,
    updateBidderPrimaryAddressInformationState,
    bidderSecondaryAddressInformationState,
    updateBidderSecondaryAddressInformationState,
    bidderContactInformationState,
    updateBidderContactInformationState,
    addBidderState,
    updateAddBidderState,
    editBidderState,
    updateEditBidderState,
    editBidderProfileState,
    updateEditBidderProfileState,
    bidderTermsAndConditionsState,
    updateBidderTermsAndConditionsState,
    bidderExperianVerificationState,
    updateBidderExperianVerificationState,
    bidderAccountPreferencesState,
    updateBidderAccountPreferencesState,
    termsAndConditionsState,
    updateTermsAndConditionsState
  };

  function updateBidderLoginInformationState(newState: any) {
    setBidderLoginInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateBidderPersonalInformationState(newState: any) {
    setBidderPersonalInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  function updateBidderExperianVerificationState(newState: any) {
    setBidderExperianVerificationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  function updateBidderPrimaryAddressInformationState(newState: any) {
    setBidderPrimaryAddressInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateBidderSecondaryAddressInformationState(newState: any) {
    setBidderSecondaryAddressInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateBidderContactInformationState(newState: any) {
    setBidderContactInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateAddBidderState(newState: any) {
    setAddBidderState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateEditBidderState(newState: any) {
    setEditBidderState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateEditBidderProfileState(newState: any) {
    setEditBidderProfileState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateBidderTermsAndConditionsState(newState: any) {
    setBidderTermsAndConditionsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateBidderAccountPreferencesState(newState: any) {
    setBidderAccountPreferencesState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateTermsAndConditionsState(newState: any) {
    setTermsAndConditionsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  return (
    <BidderContext.Provider value={value}>{children}</BidderContext.Provider>
  );
};
