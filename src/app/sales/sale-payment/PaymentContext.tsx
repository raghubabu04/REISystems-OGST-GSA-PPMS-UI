import React, { createContext, useState } from "react";
import {
  BidderInformationState,
  defaultBidderInformationState,
} from "./bidder-information/BidderInformationState";
import { defaultPaymentState, PaymentState } from "./payment/PaymentState";
import { defaultSalePaymentState, SalePaymentState } from "./SalePaymentState";
import {
  defaultSearchContractState,
  SearchContractState,
} from "./search-contract/SearchContractState";

interface IPaymentContext {
  searchContractState: SearchContractState;
  updateSearchContractState: React.Dispatch<React.SetStateAction<any>>;
  bidderInformationState: BidderInformationState;
  updateBidderInformationState: React.Dispatch<React.SetStateAction<any>>;
  salePaymentState: SalePaymentState;
  updateSalePaymentState: React.Dispatch<React.SetStateAction<any>>;
  paymentState: PaymentState;
  updatePaymentState: React.Dispatch<React.SetStateAction<any>>;
}

export const SalePaymentContext = createContext({} as IPaymentContext);

export const SalePaymentProvider = ({ children }) => {
  const [searchContractState, setSearchContractState] = useState<
    SearchContractState
  >(defaultSearchContractState);

  const [bidderInformationState, setBidderInformationState] = useState<
    BidderInformationState
  >(defaultBidderInformationState);

  const [salePaymentState, setSalePaymentState] = useState<SalePaymentState>(
    defaultSalePaymentState
  );

  const [paymentState, setPaymentState] = useState<PaymentState>(
    defaultPaymentState
  );

  const value = {
    searchContractState,
    updateSearchContractState,
    bidderInformationState,
    updateBidderInformationState,
    salePaymentState,
    updateSalePaymentState,
    paymentState,
    updatePaymentState,
  };

  function updateSearchContractState(newState: any) {
    setSearchContractState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateBidderInformationState(newState: any) {
    setBidderInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateSalePaymentState(newState: any) {
    setSalePaymentState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updatePaymentState(newState: any) {
    setPaymentState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <SalePaymentContext.Provider value={value}>
      {children}
    </SalePaymentContext.Provider>
  );
};
