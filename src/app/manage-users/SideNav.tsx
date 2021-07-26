import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";
import { PPMSSideNav } from "../../ui-kit/components/common/PPMS-side-nav";
export interface SideNavProps {
  showAOInfo: boolean;
  showNUOInfo: boolean;
  showFIInfo: boolean;
  showPermissions: boolean;
  showDocuments?: boolean;
}

export interface SideNavState {}
class SideNav extends React.Component<SideNavProps, SideNavState> {
  userListForNUO = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"permission"}
      key="permission"
    >
      <GoDash /> Permission
    </Link>,
  ];

  userList = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_nuo"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"nuo-contact-information"}
      key="nuo"
    >
      <GoDash /> NUO Contact Information
    </Link>,
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"permission"}
      key="permission"
    >
      <GoDash /> Permission
    </Link>,
  ];

  userListForNUOShowAO = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"permission"}
      key="permission"
    >
      <GoDash /> Permission
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash /> Approving Official Information
    </Link>,
  ];

  userListShowAO = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_nuo"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"nuo-contact-information"}
      key="nuo"
    >
      <GoDash /> NUO Contact Information
    </Link>,
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"permission"}
      key="permission"
    >
      <GoDash /> Permission
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash /> Approving Official Information
    </Link>,
  ];

  userListShowAOandFI = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"permission"}
      key="permission"
    >
      <GoDash /> Permission
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash /> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash /> Approving Official Information
    </Link>,
  ];

  userListShowAOandFIandDocuments = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_permission"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"permission"}
      key="permission"
    >
      <GoDash /> Permission
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash /> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash /> Approving Official Information
    </Link>,
    <Link
      to={"#header_documents"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"upload-documents"}
      key="documents"
    >
      <GoDash /> Upload Documents
    </Link>,
  ];

  userListSASPFI = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash /> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash /> Approving Official Information
    </Link>,
  ];

  userListSASPFIwithDocuments = [
    <Link
      to={"#header_aac"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"aac-agency-info"}
      key="aac"
    >
      <GoDash /> Agency / Bureau Information
    </Link>,
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_fi"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"fi-info-for-sm-sa-ao"}
      key="fi"
    >
      <GoDash /> Donee organization
    </Link>,
    <Link
      to={"#header_ao"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"ao-info-for-sm-nuo"}
      key="ao"
    >
      <GoDash /> Approving Official Information
    </Link>,
    <Link
      to={"#header_documents"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"upload-documents"}
      key="documents"
    >
      <GoDash /> Upload Documents
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
      !this.props.showFIInfo
    ) {
      itemsList = this.userListShowAO;
    } else if (
      this.props.showAOInfo &&
      !this.props.showNUOInfo &&
      !this.props.showFIInfo
    ) {
      itemsList = this.userListForNUOShowAO;
    } else if (
      !this.props.showAOInfo &&
      this.props.showNUOInfo &&
      !this.props.showFIInfo
    ) {
      itemsList = this.userList;
    } else if (this.props.showFIInfo && this.props.showDocuments) {
      itemsList = this.userListShowAOandFIandDocuments;
    } else if (this.props.showFIInfo) {
      itemsList = this.userListShowAOandFI;
    } else {
      itemsList = this.userListForNUO;
    }
    return (
      <>
        <PPMSSideNav items={itemsList} />
      </>
    );
  }
}

export default SideNav;
