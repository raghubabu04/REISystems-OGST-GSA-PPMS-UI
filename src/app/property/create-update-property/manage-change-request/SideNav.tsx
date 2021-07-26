import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";
import { PPMSSideNav } from "../../../../ui-kit/components/common/PPMS-side-nav";

export interface SideNavProps {}

export interface SideNavState {}

class SideNav extends React.Component<SideNavProps, SideNavState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkoutLinks = [
    <Link
      to={"#header_changeRequest"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"side-nav-links"}
      key="changeRequest"
    >
      <GoDash /> Change Request
    </Link>,
    <Link
      to={"#header_review"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"side-nav-links"}
      key="review"
    >
      <GoDash /> Review
    </Link>,
  ];

  render() {
    return (
      <>
        <PPMSSideNav items={this.checkoutLinks} />
      </>
    );
  }
}

export default SideNav;
