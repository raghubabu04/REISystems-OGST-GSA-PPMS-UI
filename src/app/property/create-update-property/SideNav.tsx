import React, { useContext } from "react";
import { PPMSSideNav } from "../../../ui-kit/components/common/PPMS-side-nav";
import { HashLink as Link } from "react-router-hash-link";
import { GoIssueOpened } from "react-icons/go";
import { UserUtils } from "../../../utils/UserUtils";
import { PropertyContext } from "./PropertyContext";
import { SideNavLink } from "../../../ui-kit/components/common/PPMS-side-nav-link";

export interface SideNavProps {
  isIcnValid: boolean;
}

export interface SideNavState {
  checkoutLinks: any[];
}

export function SideNav(props: SideNavProps, state: SideNavState) {
  const {
    propertyInfoState,
    agencyInfoState,
    icnState,
    repAgencyAddressState,
    pocState,
    propertyLocationState,
    propCustState,
    fscState,
    unitOfIssueState,
    additionalInfoState,
    salesNotesState,
  } = useContext(PropertyContext);

  const icnSideNav = (
    <SideNavLink
      to="#header_icn"
      name="Item Control Number"
      invalid={icnState.icnIsInvalid}
      valid={icnState.icnIsValid}
      key="icn"
    />
  );
  const checkoutLinks = [icnSideNav];

  const checkoutLinksIcnValid = [
    icnSideNav,
    <SideNavLink
      to="#header_agencyInfo"
      name="Agency Information"
      invalid={agencyInfoState.agencyInfoInvalid}
      valid={agencyInfoState.agencyInfoValid}
      key="agencyInfo"
    />,
    <SideNavLink
      to="#header_reportingAgencyAddress"
      name="Reporting Agency Address"
      invalid={repAgencyAddressState.repAddressInvalid}
      valid={repAgencyAddressState.repAddressValid}
      key="reportingAgencyAddress"
    />,
    <SideNavLink
      to="#header_pointofContact"
      name="Point of Contact"
      invalid={pocState.pocIsInvalid}
      valid={pocState.pocIsValid}
      key="pointOfContact"
    />,
    <SideNavLink
      to="#header_propertyLocation"
      name="Property Location"
      invalid={propertyLocationState.propLocationIsInvalid}
      valid={propertyLocationState.propLocationIsValid}
      key="propertyLocation"
    />,
    <SideNavLink
      to="#header_propertyCustodian"
      name="Property Custodian"
      invalid={propCustState.propCustIsInvalid}
      valid={propCustState.propCustIsValid}
      key="propertyLocation"
    />,
    <SideNavLink
      to="#header_propertyInformation"
      name="Property Type/Reimbursement"
      invalid={propertyInfoState.propInfoInvalid}
      valid={propertyInfoState.propInfoValid}
      key="propertyInformation"
    />,
    <SideNavLink
      to="#header_federalSupplyClass"
      name="Federal Supply Class"
      invalid={fscState.fscInfoInvalid}
      valid={fscState.fscInfoValid}
      key="federalSupplyClass"
    />,
    <SideNavLink
      to="#header_quantityandCost"
      name="Quantity and Cost"
      invalid={unitOfIssueState.unitOfIssueInvalid}
      valid={unitOfIssueState.unitOfIssueIsValid}
      key="quantityAndCost"
    />,
    <SideNavLink
      to="#header_additionalInformation"
      name="Additional Information"
      invalid={additionalInfoState.additionalInfoInvalid}
      valid={additionalInfoState.additionalInfoValid}
      key="additionalInformation"
    />,
    <SideNavLink
      to="#header_uploadMultiplPicturesDocuments"
      name="Upload Images and Documents"
      valid={propertyInfoState.fileUploaded}
      key="uploadMultiplPicturesDocuments"
    />,
  ];

  function showSalesNotes() {
    if (
      UserUtils.getUserRoles().includes("CO") ||
      UserUtils.getUserRoles().includes("SFU") ||
      UserUtils.getUserRoles().includes("SG") ||
      UserUtils.getUserRoles().includes("SMS") ||
      UserUtils.getUserRoles().includes("SCO") ||
      UserUtils.getUserRoles().includes("SSA") ||
      UserUtils.getUserRoles().includes("FMS") ||
      UserUtils.getUserRoles().includes("FMS") ||
      UserUtils.getUserRoles().includes("CLO")
    ) {
      return true;
    }
  }

  const salesNotes = (
    <SideNavLink
      to={"#header_salesNotes"}
      name="Sales Notes"
      invalid={salesNotesState.salesNotesIsInvalid}
      valid={salesNotesState.salesNotesIsValid}
      key="salesNotes"
    />
  );

  let links = [...checkoutLinksIcnValid];
  if (showSalesNotes()) {
    links.splice(links.length + 1, 0, salesNotes);
  }
  return (
    <>
      <PPMSSideNav items={props.isIcnValid ? links : checkoutLinks} />
    </>
  );
}

export default SideNav;
