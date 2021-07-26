import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";
import { PPMSSideNav } from "../../../../ui-kit/components/common/PPMS-side-nav";
export interface SideNavProps {}

export interface SideNavState {
  wantLists: any[];
}
class WantListSideNav extends React.Component<SideNavProps, SideNavState> {
  constructor(props) {
    super(props);
    this.state = {
      wantLists: [],
    };
  }
  wantList = [
    <Link
      to={"#header_item-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"item-information"}
      key="itemInformation"
    >
      <GoDash /> Item Information
    </Link>,
  ];

  render() {
    return (
      <>
        <PPMSSideNav items={this.wantList} />
      </>
    );
  }
}

export default WantListSideNav;
