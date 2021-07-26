import React, { createContext, useState } from "react";
import {
  GiftInformationState,
  GiftInformationStateDefaults,
} from "./create-update-foreign-gift/gift-information/GiftInformationState";
import {
  AppraisalAgencyInformationState,
  AppraisalAgencyInformationStateDefaults,
} from "./create-update-foreign-gift/appraisal-agency-information/AppraisalAgencyInformationState";
interface IForeignGiftContext {
  giftInformationState: GiftInformationState;
  updateGiftInformationState: React.Dispatch<React.SetStateAction<any>>;
  appraisalAgencyInformationState: AppraisalAgencyInformationState;
  updateAppraisalAgencyInformationState: React.Dispatch<React.SetStateAction<any>>;
}

export const ForeignGiftContext = createContext({} as IForeignGiftContext);

export const ForeignGiftProvider = ({ children }) => {
  const [giftInformationState, setGiftInformationState] = useState<
    GiftInformationState
  >(GiftInformationStateDefaults);

  const [appraisalAgencyInformationState, setAppraisalAgencyInformationState] = useState<
    AppraisalAgencyInformationState
  >(AppraisalAgencyInformationStateDefaults);

  const value: IForeignGiftContext = {
    giftInformationState,
    updateGiftInformationState,
    appraisalAgencyInformationState,
    updateAppraisalAgencyInformationState,
  };

  //function called to update giftInformationState with new value
  function updateGiftInformationState(newState: any) {
    setGiftInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateAppraisalAgencyInformationState(newState: any) {
    setAppraisalAgencyInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <ForeignGiftContext.Provider value={value}>
      {children}
    </ForeignGiftContext.Provider>
  );
};
