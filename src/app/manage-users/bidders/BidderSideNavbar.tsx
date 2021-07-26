import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";
import { PPMSSideNav } from "../../../ui-kit/components/common/PPMS-side-nav";

export interface SideNavProps {
  isConfirmLoginEnabled?: boolean;
  isAllAgreementsEnabled?: boolean;
  isIndividualSelected?: boolean;
  isPhysicalAddressEnabled?:boolean;
  isEditBidder?: boolean;
  isEditBidderWithSecondary?: boolean;
  isPrimaryAddressPoBox?:any;
}

export interface SideNavState {
  bidderRegistrationLink: any[];
}

class BidderSideNavBar extends React.Component<SideNavProps, SideNavState> {
  constructor(props) {
    super(props);
    this.state = {
      bidderRegistrationLink: [],
    };
  }
  bidderRegistrationLink = [
    <Link
      to={"#header-login-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"login-information"}
      key="login-information-id"
    >
      <GoDash /> Login Information
    </Link>,
  ];
  bidderLoginInformationValid = [
    <Link
      to={"#header-login-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"login-information"}
      key="login-information-id"
    >
      <GoDash /> Login Information
    </Link>,

    <Link
      to={"#terms-and-conditions-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"terms-and-conditions"}
      key="terms-and-conditions-id"
    >
      <GoDash /> Terms and Conditions
    </Link>,
  ];
  bidderTermsConditionsValid = [
    <Link
      to={"#header-login-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"login-information"}
      key="login-information-id"
    >
      <GoDash /> Login Information
    </Link>,
    <Link
      to={"#terms-and-conditions-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"terms-and-conditions"}
      key="terms-and-conditions-id"
    >
      <GoDash /> Terms and Conditions
    </Link>,
    <Link
      to={"#personal-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"personal-information"}
      key="personal-information-id"
    >
      <GoDash /> Personal Information
    </Link>,
    <Link
      to={"#primary-address-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"primary-address-information"}
      key="primary-address-information-id"
    >
      <GoDash /> Primary Address Information
    </Link>,
    <Link
      to={"#secondary-address-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"secondary-address-information"}
      key="secondary-address-information-id"
    >
      <GoDash /> Physical Address
    </Link>,
    <Link
      to={"#contact-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"contact-information"}
      key="contact-information-id"
    >
      <GoDash /> Contact Information
    </Link>,
    <Link
      to={"#account-preferences-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"account-preferences"}
      key="account-preferences-id"
    >
      <GoDash/> Account Preferences
    </Link>,
  ];
  bidderTermsConditionsValidAndIndividualSelected = [
    <Link
      to={"#header-login-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"login-information"}
      key="login-information-id"
    >
      <GoDash /> Login Information
    </Link>,
    <Link
      to={"#terms-and-conditions-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"terms-and-conditions"}
      key="terms-and-conditions-id"
    >
      <GoDash /> Terms and Conditions
    </Link>,
    <Link
      to={"#personal-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"personal-information"}
      key="personal-information-id"
    >
      <GoDash /> Personal Information
    </Link>,
    <Link
      to={"#primary-address-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"primary-address-information"}
      key="primary-address-information-id"
    >
      <GoDash /> Primary Address Information
    </Link>,
    <Link
      to={"#secondary-address-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"secondary-address-information"}
      key="secondary-address-information-id"
    >
      <GoDash /> Physical Address
    </Link>,
    <Link
      to={"#contact-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"contact-information"}
      key="contact-information-id"
    >
      <GoDash /> Contact Information
    </Link>,
    <Link
      to={"#experian-verification-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"experian-verification"}
      key="experian-verification-id"
    >
      <GoDash /> Experian Verification
    </Link>,
    <Link
      to={"#account-preferences-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"account-preferences"}
      key="account-preferences-id"
    >
      <GoDash/> Account Preferences
    </Link>,
  ];

  bidderEdit = [
    <Link
      to={"#edit-login-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-login-information"}
      key="edit-login-information-id"
    >
      <GoDash /> Login Information
    </Link>,
    <Link
      to={"#edit-personal-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-personal-information"}
      key="edit-personal-information"
    >
      <GoDash /> Personal Information
    </Link>,
    <Link
      to={"#edit-primary-address-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-primary-address-information"}
      key="edit-primary-address-information"
    >
      <GoDash /> Primary Address Information
    </Link>,
    <Link
      to={"#edit-contact-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-contact-information"}
      key="edit-contact-information"
    >
      <GoDash /> Contact Information
    </Link>,
    <Link
      to={"#edit-account-preferences-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-account-preferences"}
      key="edit-account-preferences"
    >
      <GoDash /> Account Preferences
    </Link>,
  ];

  bidderEditWithSecondary = [
    <Link
      to={"#edit-login-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-login-information"}
      key="edit-login-information-id"
    >
      <GoDash /> Login Information
    </Link>,
    <Link
      to={"#edit-personal-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-personal-information"}
      key="edit-personal-information"
    >
      <GoDash /> Personal Information
    </Link>,
    <Link
      to={"#edit-primary-address-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-primary-address-information"}
      key="edit-primary-address-information"
    >
      <GoDash /> Primary Address Information
    </Link>,
    <Link
      to={"#edit-secondary-address-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-secondary-address-information"}
      key="edit-secondary-address-information"
    >
      <GoDash /> Physical Address
    </Link>,
    <Link
      to={"#edit-contact-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-contact-information"}
      key="edit-contact-information"
    >
      <GoDash /> Contact Information
    </Link>,
    <Link
      to={"#edit-account-preferences-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"edit-account-preferences"}
      key="edit-account-preferences"
    >
      <GoDash /> Account Preferences
    </Link>,
  ];

  render() {
    let itemsList;
    if (
      this.props.isConfirmLoginEnabled &&
      this.props.isAllAgreementsEnabled &&
      this.props.isIndividualSelected
    ) {
      itemsList = this.bidderTermsConditionsValidAndIndividualSelected;
    } else if (
      this.props.isConfirmLoginEnabled &&
      this.props.isAllAgreementsEnabled &&
      !this.props.isIndividualSelected
    ) {
      itemsList = this.bidderTermsConditionsValid;
    } else if (this.props.isConfirmLoginEnabled) {
      itemsList = this.bidderLoginInformationValid;
    } else if (this.props.isEditBidder && !(this.props.isPrimaryAddressPoBox || this.props.isPrimaryAddressPoBox)) {
      itemsList = this.bidderEdit;
    } else if (this.props.isEditBidder && (this.props.isEditBidderWithSecondary || this.props.isPrimaryAddressPoBox)) {
      itemsList = this.bidderEditWithSecondary;
    } else {
      itemsList = this.bidderRegistrationLink;
    }
    return (
      <>
        <PPMSSideNav items={itemsList} />
      </>
    );
  }
}

export default BidderSideNavBar;
