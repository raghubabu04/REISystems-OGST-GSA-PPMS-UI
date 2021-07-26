import React, { createContext, useState } from "react";
import {
  LotReviewApprovalState,
  LotReviewApprovalDefaultState,
} from "./LotReviewApprovalState";

interface LotReviewApprovalContext {
  lotReviewApprovalState: LotReviewApprovalState;
  updateLotReviewApprovalState: React.Dispatch<React.SetStateAction<any>>;
}

export const LotReviewApprovalContext = createContext(
  {} as LotReviewApprovalContext
);

export const LotReviewApprovalContextProvider = ({ children }) => {
  const [lotReviewApprovalState, setLotReviewApprovalState] = useState<
    LotReviewApprovalState
  >(LotReviewApprovalDefaultState);

  const value = {
    lotReviewApprovalState,
    updateLotReviewApprovalState,
  };
  function updateLotReviewApprovalState(newState: any) {
    setLotReviewApprovalState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <LotReviewApprovalContext.Provider value={value}>
      {children}
    </LotReviewApprovalContext.Provider>
  );
};
