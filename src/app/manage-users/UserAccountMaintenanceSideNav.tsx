import React from "react";
import {HashLink as Link} from "react-router-hash-link";
import {PPMSSideNav} from "../../ui-kit/components/common/PPMS-side-nav";
import {GoDash} from "react-icons/all";

export interface SideNavProps {
  showAOInfo: boolean;
  showNUOInfo: boolean;
  showFIInfo: boolean;
  showPermissions: boolean;
  showDocuments?: boolean;
  showNUOwithPermissionSelected?: boolean;
  showAOInfoWithPermissionsSelected?: boolean;
  hideSectionsForSMandAPO?: boolean;
}

export interface SideNavState {
}

export class UserAccountMaintenanceSideNav extends React.Component<SideNavProps, SideNavState> {
  //on page load we are showing default permission section for logged in user
  showDefaultPermissionsSection = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
  ];

  userListForNUOWithPermissionSelected = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
  ];

  // userList = [
  //   <Link
  //     to={"#header_permission"}
  //     scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
  //     className={"permission"}
  //     key="permission"
  //   >
  //     <GoDash/> Permission
  //   </Link>,
  // ];

  // this shows the section for all other permissions except some special permissions such as SM,AC,FI,SP,NU
  showSectionForAllOtherPermissions = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_nuo"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"nuo-contact-information"}
      key="nuo"
    >
      <GoDash/> NUO Contact Information
    </Link>,
  ]

  userListForNUOShowAO = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
  ];

  // this shows only the sections when SP permission is selected
  showSectionsWhenSPselected = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_nuo"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"nuo-contact-information"}
      key="nuo"
    >
      <GoDash/> NUO Contact Information
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
  ];

  // this shows only the sections when SP permission is selected with AC or SM
  showSectionsWhenSMorACandSPselected = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
  ];

  // this shows section only when FI permission is selected
  showSectionsForFI = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_nuo"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"nuo-contact-information"}
      key="nuo"
    >
      <GoDash/> NUO Contact Information
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash/> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
  ];

  // this shows only the sections when FI permission is selected with AC or SM
  showSectionWhenSMorACandFIselected = [
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash/> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
  ];

  userListShowAOandFIandDocuments = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"user-information"}
      key="user"
    >
      <GoDash/> User Information
    </Link>,
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"permission"}
      key="permission"
    >
      <GoDash/> Permission
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash/> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
    <Link
      to={"#header_documents"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"upload-documents"}
      key="documents"
    >
      <GoDash/> Upload Documents
    </Link>,
  ];

  userListSASPFI = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"user-information"}
      key="user"
    >
      <GoDash/> User Information
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash/> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
  ];

  userListSASPFIwithDocuments = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash/> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"user-information"}
      key="user"
    >
      <GoDash/> User Information
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash/> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash/> Approving Official Information
    </Link>,
    <Link
      to={"#header_documents"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"upload-documents"}
      key="documents"
    >
      <GoDash/> Upload Documents
    </Link>,
  ];

  render() {
    let itemsList;
    if (!this.props.showPermissions && this.props.showDocuments) {
      itemsList = this.userListSASPFIwithDocuments;
    } else if (!this.props.showPermissions) {
      itemsList = this.userListSASPFI;
    } else if (
      this.props.showAOInfo &&
      this.props.showNUOInfo &&
      !this.props.showFIInfo && this.props.hideSectionsForSMandAPO
    ) {
      // this condition shows only the sections when SP permission is selected
      itemsList = this.showSectionsWhenSPselected;
    } else if (
      this.props.showAOInfo &&
      this.props.showNUOInfo &&
      !this.props.showFIInfo
    ) {
      // this condition shows only the sections when SP permission is selected with AC or SM
      itemsList = this.showSectionsWhenSMorACandSPselected;
    } else if (
      this.props.showAOInfo &&
      !this.props.showNUOInfo &&
      !this.props.showFIInfo
    ) {
      itemsList = this.userListForNUOShowAO;
    } else if (
      !this.props.showAOInfo &&
      this.props.showNUOInfo &&
      !this.props.showFIInfo && !this.props.showAOInfoWithPermissionsSelected
    ) {
      //itemsList = this.userList;
      itemsList = this.showDefaultPermissionsSection;
    } else if (
      !this.props.showAOInfo &&
      this.props.showNUOInfo &&
      !this.props.showFIInfo && this.props.showAOInfoWithPermissionsSelected && this.props.hideSectionsForSMandAPO
    ) {
      // this condition shows the section for all other permissions except some special permissions such as SM,AC,FI,SP,NU
      itemsList = this.showSectionForAllOtherPermissions;
    } else if (this.props.showFIInfo && this.props.showDocuments) {
      itemsList = this.userListShowAOandFIandDocuments;
    } else if (this.props.showFIInfo && this.props.hideSectionsForSMandAPO) {
      // this condition shows section only when FI permission is selected
      itemsList = this.showSectionsForFI;
    } else if (this.props.showFIInfo) {
      // this condition shows only the sections when FI permission is selected with AC or SM
      itemsList = this.showSectionWhenSMorACandFIselected;
    } else if (this.props.showNUOwithPermissionSelected && this.props.hideSectionsForSMandAPO) {
      itemsList = this.userListForNUOWithPermissionSelected;
    } else {
      //on page load we are showing default permission section for logged in user
      itemsList = this.showDefaultPermissionsSection;
    }
    return (
      <>
        <PPMSSideNav items={itemsList}/>
      </>
    );
  }
}
