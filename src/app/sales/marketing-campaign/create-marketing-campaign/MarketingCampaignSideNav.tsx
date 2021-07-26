import React from "react";
import {HashLink as Link} from "react-router-hash-link";
import {GoDash} from "react-icons/go";
import {PPMSSideNav} from "../../../../ui-kit/components/common/PPMS-side-nav";

export interface SideNavProps {
}

export interface SideNavState {
  campaignMarketingLists: any[];
}

class MarketingCampaignSideNav extends React.Component<SideNavProps,
  SideNavState> {
  constructor(props) {
    super(props);
    this.state = {
      campaignMarketingLists: [],
    };
  }
  campaignMarketingLists = [
    <Link
      to={"#header_campaign-details-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"campaign-details"}
      key="campaign-details-id"
    >
      <GoDash aria-label={"Campaign Details"}/> Campaign Details
    </Link>,
    <Link
      to={"#header_item-selection-criteria-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"item-selection-criteria"}
      key="itemsSelection"
    >
      <GoDash aria-label={"Item Selection Criteria"}/> Item Selection Criteria
    </Link>,
    <Link
      to={"#header_bidder-selection-criteria-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"bidder-selection-criteria"}
      key="bidderSection"
    >
      <GoDash aria-label={"Bidder Selection Criteria"}/> Bidder Selection Criteria
    </Link>,
    <Link
      to={"#header_email-selection-criteria-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"email-selection-criteria"}
      key="emailSelection"
    >
      <GoDash aria-label={"Email Selection Criteria"}/> Email Selection Criteria
    </Link>,
    <Link
      to={"#header_upload-selection-criteria-id"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"upload-selection-criteria"}
      key="uploadSelection"
    >
      <GoDash aria-label={"Upload Documents"}/> Upload Documents
    </Link>,
  ];

  render() {
    return (
      <>
        <PPMSSideNav items={this.campaignMarketingLists} />
      </>
    );
  }
}

export default MarketingCampaignSideNav;
