import React, { useContext } from "react";
import { PPMSSideNav } from "../../ui-kit/components/common/PPMS-side-nav";
import { PropertyContext } from "../property/create-update-property/PropertyContext";
import { SideNavLink } from "../../ui-kit/components/common/PPMS-side-nav-link";
export interface SideNavProps {
  isIcnValid: boolean;
}
export interface SideNavState {
  checkoutLinks: any[];
}

export function ForeignGiftSideNav(props: SideNavProps, state: SideNavState) {
  const {
    propertyInfoState,
    icnState,
    repAgencyAddressState,
    pocState,
    donorInfoState,
    recipientInfoState,
    giftInformationState,
    appraisalInformationState,
    appraisalAgencyInformationState,
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
      to="#header_donorInfo"
      name="Donor Information"
      invalid={donorInfoState.donorInfoInvalid}
      valid={donorInfoState.donorInfoValid}
      key="donorInfo"
    />,
    <SideNavLink
      to="#header_recipientInfo"
      name="Recipient Information"
      invalid={recipientInfoState.recipientInfoInvalid}
      valid={recipientInfoState.recipientInfoValid}
      key="recipientInfo"
    />,
    <SideNavLink
      to="#header_giftInfo"
      name="Gift Information"
      invalid={giftInformationState.giftInfoInvalid}
      valid={giftInformationState.giftInfoValid}
      key="giftInfo"
    />,
    <SideNavLink
      to="#header_appraisalInfo"
      name="Appraisal Information"
      invalid={appraisalInformationState.appraisalInfoInvalid}
      valid={appraisalInformationState.appraisalInfoValid}
      key="appraisalInfo"
    />,
    <SideNavLink
      to="#header_appraisalAgencyInformation"
      name="Appraisal Agency Information"
      invalid={appraisalAgencyInformationState.appraisalAgencyInfoInvalid}
      valid={appraisalAgencyInformationState.appraisalAgencyInfoValid}
      key="appraisalAgencyInformation"
    />,
    <SideNavLink
      to="#header_uploadMultiplPicturesDocuments"
      name="Upload Images and Documents"
      invalid={
        appraisalAgencyInformationState.appraisalToUpload &&
        !propertyInfoState.fileUploaded
      }
      valid={propertyInfoState.fileUploaded}
      key="uploadMultiplPicturesDocuments"
    />,
  ];

  return (
    <>
      <PPMSSideNav
        items={props.isIcnValid ? checkoutLinksIcnValid : checkoutLinks}
      />
    </>
  );
}
