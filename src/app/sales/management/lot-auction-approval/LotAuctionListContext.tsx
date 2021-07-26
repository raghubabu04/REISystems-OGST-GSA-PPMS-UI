import React, { createContext, useState } from "react";
import {
  LotAuctionListState,
  LotAuctionListDefaultState,
} from "./LotAuctionListState";

interface LotAuctionListContext {
  lotAuctionListState: LotAuctionListState;
  updateLotAuctionListState: React.Dispatch<React.SetStateAction<any>>;
}

export const LotAuctionListContext = createContext({} as LotAuctionListContext);

export const LotAuctionListContextProvider = ({ children }) => {
  const [lotAuctionListState, setLotAuctionListState] = useState<
    LotAuctionListState
  >(LotAuctionListDefaultState);

  const value = {
    lotAuctionListState,
    updateLotAuctionListState,
  };
  function updateLotAuctionListState(newState: any) {
    setLotAuctionListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <LotAuctionListContext.Provider value={value}>
      {children}
    </LotAuctionListContext.Provider>
  );
};
