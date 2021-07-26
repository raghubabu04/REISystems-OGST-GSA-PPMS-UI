import React from "react";
import {HashLink as Link} from "react-router-hash-link";
import {GoDash} from "react-icons/go";
import {PPMSSideNav} from "../../../ui-kit/components/common/PPMS-side-nav";
import {UserUtils} from "../../../utils/UserUtils";

export interface GroupEmailsSideNavProps{}

export interface GroupEmailsSideNavState {
  groupEmailsLists: any[]
}
class GroupEmailsSideNav extends React.Component<GroupEmailsSideNavProps, GroupEmailsSideNavState> {
  constructor(props) {
    super(props);
    this.state = {
      groupEmailsLists: []
    }
  }

  groupEmailsLists = [
    <Link
      to={"#header_email-criteria-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="emailCriteria"
    >
      <GoDash aria-label={"Email Criteria"}/> Email Criteria
    </Link>,
    <Link
      to={"#header_email-content-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="emailContent"
    >
      <GoDash aria-label={"Email Content"}/> Email Content
    </Link>,
    <Link
      to={"#header_documents"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"upload-documents"}
      key="documents"
    >
      <GoDash /> Upload Attachments
    </Link>,
  ];

  groupEmailsListsSasp = [
    <Link
      to={"#header_email-content-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="emailContent"
    >
      <GoDash aria-label={"Email Content"}/> Email Content
    </Link>,
    <Link
      to={"#header_documents"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"upload-documents"}
      key="documents"
    >
      <GoDash /> Upload Attachments
    </Link>,
  ]
  render() {
    let itemsList;
    if(UserUtils.getUserPermissions().includes("SM") || UserUtils.getUserPermissions().includes("NU") || UserUtils.getUserPermissions().includes("AC")){
      itemsList = this.groupEmailsLists
    } else if(UserUtils.getUserPermissions().includes("SA")) {
      itemsList = this.groupEmailsListsSasp
    } else if(UserUtils.getUserTypeFromToken() == 'SLS' && (UserUtils.getUserRoles().includes("CLO") || UserUtils.getUserRoles().includes("SG") || UserUtils.getUserRoles().includes("SCO") || UserUtils.getUserRoles().includes("CO") || UserUtils.getUserRoles().includes("SMS"))){
      itemsList = this.groupEmailsLists
    }
    return (
      <>
        <PPMSSideNav items={itemsList}/>
      </>
    );
  }
}

export default GroupEmailsSideNav;
