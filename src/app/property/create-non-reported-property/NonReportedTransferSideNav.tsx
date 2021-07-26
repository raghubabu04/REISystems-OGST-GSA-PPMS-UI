import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";
import { PPMSSideNav } from "../../../ui-kit/components/common/PPMS-side-nav";
export interface SideNavProps {}

export interface SideNavState {
  nonReportedTransferLists: any[];
}
class NonReportedTransferSideNav extends React.Component<SideNavProps, SideNavState> {
  constructor(props) {
    super(props);
    this.state = {
      nonReportedTransferLists: [],
    };
  }
  nonReportedTransferList = [
    <Link
      to={"#header_property-type-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"property-type"}
      key="propertyType"
    >
      <GoDash /> Property Type
    </Link>,
    <Link
      to={"#header_reporting-agency-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"reporting-agency"}
      key="reportingAgency"
    >
      <GoDash /> Reporting Agency
    </Link>,
    <Link
      to={"#header_gaining-agency-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"gaining-agency"}
      key="gainingAgency"
    >
      <GoDash /> Gaining Agency
    </Link>,
    <Link
      to={"#header_item-information-id"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"item-information"}
      key="itemInformation"
    >
      <GoDash /> Item Information
    </Link>,
    <Link	
    to={"#header_upload-selection-criteria-id"}	
    scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}	
    className={"upload-selection-criteria"}	
    key="uploadSelection"	
  >	
    <GoDash /> Upload Documents	
  </Link>,
  ];

  render() {
    return (
      <>
        <PPMSSideNav items={this.nonReportedTransferList} />
      </>
    );
  }
}

export default NonReportedTransferSideNav;
