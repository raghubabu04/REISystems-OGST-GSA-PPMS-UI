import React, { createContext, useState, Dispatch } from "react";
import {
  InternalAgencyAddressState,
  InternalAgencyAddressStateDefault,
} from "./internal-agency-address-class/InternalAgencyAddressState";
import { PocState, PocStateDefault } from "./point-of-contact-class/PocState";
import { InternalAgencyScreeningInfoState, InternalAgencyScreeningInfoDefault} from "./internal-agency-screening-info-class/InternalAgencyScreeningInfoState";
import { InternalAgencyRemarksState, InternalAgencyRemarksDefault} from "./internal-agency-remarks-class/InternalAgencyRemarksState";
import {
  InternalAgencyState,
  InternalAgencyStateDefault,
} from "./InternalAgencyState";
import {
  InternalAgencyDetailsState,
  InternalAgencyDetailsStateDefault,
} from "./internal-agency-details/InternalAgencyDetailsState";


interface InternalAgencyContext {

  internalAgencyAddressState: InternalAgencyAddressState;
  updateInternalAgencyAddressState: React.Dispatch<React.SetStateAction<any>>;
  pocState: PocState;
  updatePocState: React.Dispatch<React.SetStateAction<any>>;
  internalAgencyScreeningInfoState: InternalAgencyScreeningInfoState;
  updateInternalAgencyScreeningInfoState: React.Dispatch<React.SetStateAction<any>>;
  internalAgencyRemarksState: InternalAgencyRemarksState;
  updateInternalAgencyRemarksState: React.Dispatch<React.SetStateAction<any>>;
  internalAgencyState: InternalAgencyState;
  updateInternalAgencyState: React.Dispatch<React.SetStateAction<any>>;
  internalAgencyDetailsState: InternalAgencyDetailsState;
  updateInternalAgencyDetailsState: React.Dispatch<React.SetStateAction<any>>;

}

export const InternalAgencyContext = createContext({} as InternalAgencyContext);

export const InternalAgencyProvider = ({ children }) => {


  const [internalAgencyAddressState, setInternalAgencyAddressState] = useState<
    InternalAgencyAddressState
    >(InternalAgencyAddressStateDefault);
  const [pocState, setPocState] = useState<PocState>(PocStateDefault);
  const [internalAgencyScreeningInfoState, setInternalAgencyScreeningInfoState] = useState<InternalAgencyScreeningInfoState>(InternalAgencyScreeningInfoDefault);
  const [internalAgencyRemarksState, setInternalAgencyRemarksState] = useState<InternalAgencyRemarksState>(InternalAgencyRemarksDefault);
  var [internalAgencyState, setInternalAgencyState] = useState<
    InternalAgencyState
    >(InternalAgencyStateDefault);
  const [internalAgencyDetailsState, setInternalAgencyDetailsState] = useState<
    InternalAgencyDetailsState
    >(InternalAgencyDetailsStateDefault);

  const value = {
    internalAgencyAddressState,
    updateInternalAgencyAddressState,
    pocState,
    updatePocState,
    internalAgencyScreeningInfoState,
    updateInternalAgencyScreeningInfoState,
    internalAgencyRemarksState,
    updateInternalAgencyRemarksState,
    internalAgencyState,
    updateInternalAgencyState,
    internalAgencyDetailsState,
    updateInternalAgencyDetailsState,

  };

  //function called to update InternalAgencyAddressState with new value
  function updateInternalAgencyAddressState(newState: any) {
    setInternalAgencyAddressState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updatePocState(newState: any) {
    setPocState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateInternalAgencyScreeningInfoState(newState: any) {
    setInternalAgencyScreeningInfoState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateInternalAgencyRemarksState(newState: any) {
    setInternalAgencyRemarksState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateInternalAgencyState(newState: any) {
    setInternalAgencyState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateInternalAgencyDetailsState(newState: any) {
    setInternalAgencyDetailsState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }


  return (
    <InternalAgencyContext.Provider value={value}>
      {children}
    </InternalAgencyContext.Provider>
  );
};
