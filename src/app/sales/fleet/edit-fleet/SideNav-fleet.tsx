import React, { useContext } from "react";
import { PPMSSideNav } from "../../../../ui-kit/components/common/PPMS-side-nav";
import { SideNavLink } from "../../../../ui-kit/components/common/PPMS-side-nav-link";
import { FleetContext } from "./Fleet-context";

interface SideNavProps {}

export function SideNavFleet(props: SideNavProps) {
  const {
    editFleetState,
    saleInformationState,
    lotInformationState,
    itemInformationState,
    propertyLocationState,
    propertyCustodianState,
    vehicleInformationState,
    reportingAgencyState,
    pointOfContactState,
  } = useContext(FleetContext);

  const fleetItems = [
    <SideNavLink
      to="#header_fleetSaleInformation"
      name="Sale Information"
      key="fleetSaleInformation"
      invalid={saleInformationState.saleInformationIsInvalid}
      valid={saleInformationState.saleInformationIsValid}
    />,
    <SideNavLink
      to="#header_fleetItemInformation"
      name="Item Information"
      key="fleetItemInformation"
      invalid={itemInformationState.itemInformationIsInvalid}
      valid={itemInformationState.itemInformationIsValid}
    />,
    <SideNavLink
      to="#header_fleetLotInformation"
      name="Lot Information"
      key="fleetLotInformation"
      invalid={lotInformationState.lotInformationIsInvalid}
      valid={lotInformationState.lotInformationIsValid}
    />,
    <SideNavLink
      to="#header_fleetPropertyLocation"
      name="Property Location"
      key="fleetPropertyLocation"
      invalid={propertyLocationState.propertyLocationIsInvalid}
      valid={propertyLocationState.propertyLocationIsValid}
    />,
    <SideNavLink
      to="#header_fleetPropertyCustodian"
      name="Property Custodian"
      key="fleetPropertyCustodian"
      invalid={propertyCustodianState.propertyCustodianIsInvalid}
      valid={propertyCustodianState.propertyCustodianIsValid}
    />,
    <SideNavLink
      to="#header_fleetReportingAgency"
      name="Reporting Agency"
      key="fleetReportingAgency"
      invalid={reportingAgencyState.reportingAgencyIsInvalid}
      valid={reportingAgencyState.reportingAgencyIsValid}
    />,
    <SideNavLink
      to="#header_fleetPointOfContact"
      name="Point Of Contact"
      key="fleetPointOfContact"
      invalid={pointOfContactState.pointOfContactIsInvalid}
      valid={pointOfContactState.pointOfContactIsValid}
    />,
    <SideNavLink
      to="#header_fleetVehicleInformation"
      name="Vehicle Information"
      key="fleetVehicleInformation"
      invalid={vehicleInformationState.vehicleInformationIsInvalid}
      valid={vehicleInformationState.vehicleInformationIsValid}
    />,
    <SideNavLink
      to="#header_uploadMultiplPicturesDocuments"
      name="Upload Images and Documents"
      key="uploadMultiplPicturesDocuments"
    />,
  ];

  return (
    <>
      <PPMSSideNav items={fleetItems} />
    </>
  );
}
