import React, { useState } from "react";
import { createContext } from "react";
import { EditFleetState, editFleetStateDefault } from "./EditFleetState";
import {
  ItemInformationState,
  itemInformationStateDefault,
  updateItemInformationNav,
} from "./item-information/ItemInformationState";
import {
  LotInformationState,
  lotInformationStateDefault,
  updateLotInformationNav,
} from "./lot-information/LotInformationState";
import {
  PropertyCustodianState,
  propertyCustodianStateDefault,
  updatePropertyCustodianNav,
} from "./property-custodian/PropertyCustodianState";
import {
  PropertyDescriptionState,
  propertyDescriptionStateDefault,
} from "./property-description/PropertyDescriptionState";
import {
  PropertyLocationState,
  propertyLocationStateDefault,
  updatePropertyLocationNav,
} from "./property-location/PropertyLocationState";
import {
  SaleInformationState,
  saleInformationStateDefault,
  updateSaleInformationNav,
} from "./sale-information/SaleInformationState";
import {
  VehicleInformationState,
  vehicleInformationStateDefault,
  updateVehicleInformationNav,
} from "./vehicle-information/VehicleInformationState";
import {
  ReportingAgencyState,
  reportingAgencyStateDefault,
  updateReportingAgencyNav,
} from "./reporting-agency/ReportingAgencyState";
import {
  PointOfContactState,
  pointOfContactStateDefault,
  updatePointOfContactNav,
} from "./point-of-contact/PointOfContactState";

interface IFleetContext {
  editFleetState: EditFleetState;
  updateEditFleetState: React.Dispatch<React.SetStateAction<any>>;
  saleInformationState: SaleInformationState;
  updateSaleInformationState: React.Dispatch<React.SetStateAction<any>>;
  itemInformationState: ItemInformationState;
  updateItemInformationState: React.Dispatch<React.SetStateAction<any>>;
  lotInformationState: LotInformationState;
  updateLotInformationState: React.Dispatch<React.SetStateAction<any>>;
  propertyCustodianState: PropertyCustodianState;
  updatePropertyCustodianState: React.Dispatch<React.SetStateAction<any>>;
  propertyDescriptionState: PropertyDescriptionState;
  updatePropertyDescriptionState: React.Dispatch<React.SetStateAction<any>>;
  propertyLocationState: PropertyLocationState;
  updatePropertyLocationState: React.Dispatch<React.SetStateAction<any>>;
  vehicleInformationState: VehicleInformationState;
  updateVehicleInformationState: React.Dispatch<React.SetStateAction<any>>;
  reportingAgencyState: ReportingAgencyState;
  updateReportingAgencyState: React.Dispatch<React.SetStateAction<any>>;
  pointOfContactState: PointOfContactState;
  updatePointOfContactState: React.Dispatch<React.SetStateAction<any>>;
}

export const FleetContext = createContext({} as IFleetContext);

export const FleetContextProvider = ({ children }) => {
  const [editFleetState, setEditFleetState] = useState<EditFleetState>(
    editFleetStateDefault
  );

  const [saleInformationState, setSaleInformationState] = useState<
    SaleInformationState
  >(saleInformationStateDefault);

  const [itemInformationState, setItemInformationState] = useState<
    ItemInformationState
  >(itemInformationStateDefault);

  const [lotInformationState, setLotInformationState] = useState<
    LotInformationState
  >(lotInformationStateDefault);

  const [propertyCustodianState, setPropertyCustodianState] = useState<
    PropertyCustodianState
  >(propertyCustodianStateDefault);

  const [propertyDescriptionState, setPropertyDescriptionState] = useState<
    PropertyDescriptionState
  >(propertyDescriptionStateDefault);

  const [propertyLocationState, setPropertyLocationState] = useState<
    PropertyLocationState
  >(propertyLocationStateDefault);

  const [vehicleInformationState, setVehicleInformationState] = useState<
    VehicleInformationState
  >(vehicleInformationStateDefault);

  const [reportingAgencyState, setReportingAgencyState] = useState<
    ReportingAgencyState
  >(reportingAgencyStateDefault);

  const [pointOfContactState, setPointOfContactState] = useState<
    PointOfContactState
  >(pointOfContactStateDefault);

  const value = {
    editFleetState,
    updateEditFleetState,
    itemInformationState,
    updateItemInformationState,
    lotInformationState,
    updateLotInformationState,
    propertyCustodianState,
    updatePropertyCustodianState,
    propertyDescriptionState,
    updatePropertyDescriptionState,
    propertyLocationState,
    updatePropertyLocationState,
    vehicleInformationState,
    updateVehicleInformationState,
    saleInformationState,
    updateSaleInformationState,
    reportingAgencyState,
    updateReportingAgencyState,
    pointOfContactState,
    updatePointOfContactState,
  };

  function updateSaleInformationState(newState: any) {
    setSaleInformationState((prevState: any) => {
      updateSaleInformationNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateEditFleetState(newState: any) {
    setEditFleetState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updateItemInformationState(newState: any) {
    setItemInformationState((prevState: any) => {
      updateItemInformationNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateLotInformationState(newState: any) {
    setLotInformationState((prevState: any) => {
      updateLotInformationNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updatePropertyCustodianState(newState: any) {
    setPropertyCustodianState((prevState: any) => {
      updatePropertyCustodianNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updatePropertyDescriptionState(newState: any) {
    setPropertyDescriptionState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  function updatePropertyLocationState(newState: any) {
    setPropertyLocationState((prevState: any) => {
      updatePropertyLocationNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateVehicleInformationState(newState: any) {
    setVehicleInformationState((prevState: any) => {
      updateVehicleInformationNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updateReportingAgencyState(newState: any) {
    setReportingAgencyState((prevState: any) => {
      updateReportingAgencyNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  function updatePointOfContactState(newState: any) {
    setPointOfContactState((prevState: any) => {
      updatePointOfContactNav(newState, prevState);
      return { ...prevState, ...newState };
    });
  }

  return (
    <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
  );
};
