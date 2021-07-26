import React, { createContext, useState } from "react";
import {
  ManageAuctionListState,
  ManageAuctionListDefaultState,
} from "./ManageAuctionListState";

interface ManageAuctionListContext {
  manageAuctionListState: ManageAuctionListState;
  updateManageAuctionListState: React.Dispatch<React.SetStateAction<any>>;
}

export const ManageAuctionListContext = createContext({} as ManageAuctionListContext);
export const ManageAuctionListContextProvider = ({ children }) => {
  const [manageAuctionListState, setManageAuctionListState] = useState<ManageAuctionListState>(
    ManageAuctionListDefaultState
  );
  const value = {
    manageAuctionListState,
    updateManageAuctionListState,
  };
  function updateManageAuctionListState(newState: any) {
    setManageAuctionListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  return (
    <ManageAuctionListContext.Provider value={value}>
      {children}
    </ManageAuctionListContext.Provider>
  );
};
