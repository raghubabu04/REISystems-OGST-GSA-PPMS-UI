import React, {createContext, useState} from 'react'
import {
  EmailSelectionCriteriaState,
  EmailSelectionCriteriaStateDefault
} from "./email-criteria/EmailSelectionCriteriaState";
import {
  ItemSelectionCriteriaState,
  ItemSelectionCriteriaStateDefault
} from "./item-selection-criteria/ItemSelectionCriteriaState";
import {CampaignDetailsState, CampaignDetailsStateDefault} from "./campaign/CampaignDetailsState";
import {BidderSelectionState, BidderSelectionStateDefault} from "./bidder-selection/BidderSelectionState";
import {MarketingCampaignState, MarketingCampaignStateDefault} from "./MarketingCampaignState";


interface CampaignContext {

  bidderSelectionState : BidderSelectionState;
  updateBidderSelectionState: React.Dispatch<React.SetStateAction<any>>;

  campaignDetailsState: CampaignDetailsState;
  updateCampaignDetailsState: React.Dispatch<React.SetStateAction<any>>;

  itemSelectionCriteriaState : ItemSelectionCriteriaState;
  updateItemSelectionCriteriaState : React.Dispatch<React.SetStateAction<any>>;

  emailSelectionCriteriaState : EmailSelectionCriteriaState;
  updateEmailSelectionCriteriaState : React.Dispatch<React.SetStateAction<any>>;

  marketingCampaignState: MarketingCampaignState;
  updateMarketingCampaignState: React.Dispatch<React.SetStateAction<any>>;

}

export const MarketingCampaignContext = createContext({} as CampaignContext);


export const MarketingCampaignProvider = ({ children }) => {

  const [bidderSelectionState, setBidderSelectionState] = useState<BidderSelectionState>(BidderSelectionStateDefault);
  const [campaignDetailsState, setCampaignDetailsState] = useState<CampaignDetailsState>(CampaignDetailsStateDefault);
  const [itemSelectionCriteriaState, setItemSelectionCriteriaState] = useState<ItemSelectionCriteriaState>(ItemSelectionCriteriaStateDefault);
  const [emailSelectionCriteriaState, setEmailSelectionCriteriaState] = useState<EmailSelectionCriteriaState>(EmailSelectionCriteriaStateDefault);
  const [marketingCampaignState, setMarketingCampaignState] = useState<MarketingCampaignState>(MarketingCampaignStateDefault);

  const value = {
    bidderSelectionState,
    updateBidderSelectionState,
    campaignDetailsState,
    updateCampaignDetailsState,
    itemSelectionCriteriaState,
    updateItemSelectionCriteriaState,
    emailSelectionCriteriaState,
    updateEmailSelectionCriteriaState,
    marketingCampaignState,
    updateMarketingCampaignState
  };

  function updateBidderSelectionState(newState: any) {
    setBidderSelectionState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateCampaignDetailsState(newState: any) {
    setCampaignDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateItemSelectionCriteriaState(newState: any) {
    setItemSelectionCriteriaState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateEmailSelectionCriteriaState(newState: any) {
    setEmailSelectionCriteriaState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateMarketingCampaignState(newState: any){
    setMarketingCampaignState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <MarketingCampaignContext.Provider value={value}>
      {children}
    </MarketingCampaignContext.Provider>
  );

};

