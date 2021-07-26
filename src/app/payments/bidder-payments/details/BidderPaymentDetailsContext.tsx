import React, { createContext, useState } from "react";
import {
  BidderPaymentDetailsState,
  BidderPaymentDetailsListDefaultState,
} from "./BidderPaymentDetailsState";

interface BidderPaymentDetailsContext {
  bidderPaymentDetailsState: BidderPaymentDetailsState;
  updateBidderPaymentDetailsState: React.Dispatch<React.SetStateAction<any>>;
}

export const BidderPaymentDetailsContext = createContext(
  {} as BidderPaymentDetailsContext
);

export const BidderPaymentDetailsContextProvider = ({ children }) => {
  const [bidderPaymentDetailsState, setBidderPaymentDetailsState] = useState<
    BidderPaymentDetailsState
  >(BidderPaymentDetailsListDefaultState);

  const value = {
    bidderPaymentDetailsState,
    updateBidderPaymentDetailsState,
  };
  function updateBidderPaymentDetailsState(newState: any) {
    setBidderPaymentDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <BidderPaymentDetailsContext.Provider value={value}>
      {children}
    </BidderPaymentDetailsContext.Provider>
  );
};
