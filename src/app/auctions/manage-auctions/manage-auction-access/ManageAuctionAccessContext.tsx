import React, { createContext, useState } from "react";
import {
  ManageAuctionAccessState,
  ManageAuctionAccessStateDefault,
} from "./ManageAuctionAccessState";
import {
  ViewBidBidderState,
  ViewBidBidderStateDefault,
} from "./view-bids/ViewBidBidderState";
import { ViewBidsState, ViewBidsStateDefault } from "./view-bids/ViewBidsState";
import {
  ManageBidderDefaultState,
  ManageBidderState,
} from "./manage-auction/manage-bidders/ManageBidderState";

export interface IManageAuctionAccessContext {
  manageAuctionAccessState: ManageAuctionAccessState;
  updateManageAuctionAccessState: React.Dispatch<React.SetStateAction<any>>;
  viewBidsState: ViewBidsState;
  updateViewBidsState: React.Dispatch<React.SetStateAction<any>>;
  viewBidBidderState: ViewBidBidderState;
  updateViewBidBidderState: React.Dispatch<React.SetStateAction<any>>;
  manageBidderState: ManageBidderState;
  updateManageBidderState: React.Dispatch<React.SetStateAction<any>>;
}

export const ManageAuctionAccessContext = createContext(
  {} as IManageAuctionAccessContext
);

export const ManageAuctionAccessContextProvider = ({ children }) => {
  const [manageAuctionAccessState, setManageAuctionAccessState] = useState<
    ManageAuctionAccessState
  >(ManageAuctionAccessStateDefault);
  const [viewBidsState, setviewBidsState] = useState<ViewBidsState>(
    ViewBidsStateDefault
  );
  const [viewBidBidderState, setViewBidBidderState] = useState<
    ViewBidBidderState
  >(ViewBidBidderStateDefault);

  const [manageBidderState, setManageBidderState] = useState<ManageBidderState>(
    ManageBidderDefaultState
  );
  const value = {
    manageAuctionAccessState,
    updateManageAuctionAccessState,
    viewBidsState,
    updateViewBidsState,
    viewBidBidderState,
    updateViewBidBidderState,
    manageBidderState,
    updateManageBidderState,
  };
  function updateManageAuctionAccessState(newState: any) {
    setManageAuctionAccessState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  function updateViewBidsState(newState: any) {
    setviewBidsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  function updateViewBidBidderState(newState: any) {
    setViewBidBidderState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateManageBidderState(newState: any) {
    setManageBidderState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }
  return (
    <ManageAuctionAccessContext.Provider value={value}>
      {children}
    </ManageAuctionAccessContext.Provider>
  );
};
