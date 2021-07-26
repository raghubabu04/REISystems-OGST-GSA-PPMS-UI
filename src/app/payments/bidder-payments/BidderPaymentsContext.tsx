import React, { createContext, useState } from "react";
import {
  BidderPaymentsState,
  BidderPaymentsListDefaultState,
} from "./BidderPaymentsState";

interface BidderPaymentsContext {
  bidderPaymentsState: BidderPaymentsState;
  updateBidderPaymentsState: React.Dispatch<React.SetStateAction<any>>;
}

export const BidderPaymentsContext = createContext({} as BidderPaymentsContext);

export const BidderPaymentsContextProvider = ({ children }) => {
  const [bidderPaymentsState, setBidderPaymentsState] = useState<
    BidderPaymentsState
  >(BidderPaymentsListDefaultState);

  const value = {
    bidderPaymentsState,
    updateBidderPaymentsState,
  };
  function updateBidderPaymentsState(newState: any) {
    setBidderPaymentsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <BidderPaymentsContext.Provider value={value}>
      {children}
    </BidderPaymentsContext.Provider>
  );
};
