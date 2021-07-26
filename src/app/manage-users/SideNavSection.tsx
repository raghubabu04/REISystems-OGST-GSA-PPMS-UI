import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";
import { PPMSSideNav } from "../../ui-kit/components/common/PPMS-side-nav";
export interface SideNavProps {}

export interface SideNavState {}
class SideNav extends React.Component<SideNavProps, SideNavState> {
  userList = [
    <Link
      to={"#header_user"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-information"}
      key="user"
    >
      <GoDash /> User Information
    </Link>,
    <Link
      to={"#header_user-accounts"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"user-accounts"}
      key="user-accounts"
    >
      <GoDash /> User Accounts
    </Link>,
  ];
  render() {
    return (
      <>
        <PPMSSideNav items={this.userList} />
      </>
    );
  }
}

export default SideNav;
