import React, { createContext, useState } from "react";
import {
  BidderTransactionsState,
  BidderTransactionsDefaultState,
} from "./BidderTransactionsState";

interface BidderTransactionsContext {
  bidderTransactionsState: BidderTransactionsState;
  updateBidderTransactionsState: React.Dispatch<React.SetStateAction<any>>;
}

export const BidderTransactionsContext = createContext(
  {} as BidderTransactionsContext
);

export const BidderTransactionsContextProvider = ({ children }) => {
  const [bidderTransactionsState, setBidderTransactionsState] = useState<
    BidderTransactionsState
  >(BidderTransactionsDefaultState);

  const value = {
    bidderTransactionsState,
    updateBidderTransactionsState,
  };
  function updateBidderTransactionsState(newState: any) {
    setBidderTransactionsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <BidderTransactionsContext.Provider value={value}>
      {children}
    </BidderTransactionsContext.Provider>
  );
};
