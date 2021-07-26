import React, {createContext, useState} from 'react'
import {
  ItemInformationState,
  ItemInformationStateDefault
} from "./item-information/ItemInformationState";
import {
  GainingAgencyState,
  GainingAgencyStateDefault
} from "./gaining-agency/GainingAgencyState";
import {ReportingAgencyState, ReportingAgencyStateDefault} from "./reporting-agency/ReportingAgencyState";
import {PropertyTypeState, PropertyTypeStateDefault} from "./property-type/PropertyTypeState";
import {NonReportedTransferState, NonReportedTransferStateDefault} from "./NonReportedTransferState";


interface NonReportedTransferContext {

  propertyTypeState : PropertyTypeState;
  updatePropertyTypeState: React.Dispatch<React.SetStateAction<any>>;

  reportingAgencyState: ReportingAgencyState;
  updateReportingAgencyState: React.Dispatch<React.SetStateAction<any>>;

  gainingAgencyState : GainingAgencyState;
  updateGainingAgencyState : React.Dispatch<React.SetStateAction<any>>;

  itemInformationState : ItemInformationState;
  updateItemInformationState : React.Dispatch<React.SetStateAction<any>>;

  nonReportedTransferState: NonReportedTransferState;
  updateNonReportedTransferState: React.Dispatch<React.SetStateAction<any>>;

}

export const NonNonReportedTransferContext = createContext({} as NonReportedTransferContext);


export const NonReportedTransferProvider = ({ children }) => {

  const [propertyTypeState, setPropertyTypeState] = useState<PropertyTypeState>(PropertyTypeStateDefault);
  const [reportingAgencyState, setReportingAgencyState] = useState<ReportingAgencyState>(ReportingAgencyStateDefault);
  const [gainingAgencyState, setGainingAgencyState] = useState<GainingAgencyState>(GainingAgencyStateDefault);
  const [itemInformationState, setItemInformationState] = useState<ItemInformationState>(ItemInformationStateDefault);
  const [nonReportedTransferState, setNonReportedTransferState] = useState<NonReportedTransferState>(NonReportedTransferStateDefault);

  const value = {
    propertyTypeState,
    updatePropertyTypeState,
    reportingAgencyState,
    updateReportingAgencyState,
    gainingAgencyState,
    updateGainingAgencyState,
    itemInformationState,
    updateItemInformationState,
    nonReportedTransferState,
    updateNonReportedTransferState
  };

  function updatePropertyTypeState(newState: any) {
    setPropertyTypeState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateReportingAgencyState(newState: any) {
    setReportingAgencyState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateGainingAgencyState(newState: any) {
    setGainingAgencyState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateItemInformationState(newState: any) {
    setItemInformationState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateNonReportedTransferState(newState: any){
    setNonReportedTransferState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  return (
    <NonNonReportedTransferContext.Provider value={value}>
      {children}
    </NonNonReportedTransferContext.Provider>
  );

};

