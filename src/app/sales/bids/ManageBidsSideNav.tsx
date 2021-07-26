import React, { useContext } from "react";
import {HashLink as Link} from "react-router-hash-link";
import { PPMSSideNav } from "../../../ui-kit/components/common/PPMS-side-nav";
import { SideNavLink } from "../../../ui-kit/components/common/PPMS-side-nav-link";
import { ManageBidsContext } from "./ManageBidsContext";
export interface SideNavProps {
}
export interface SideNavState {
  checkoutLinks: any[];
}

export function ManageBidsSideNav(props: SideNavProps, state: SideNavState) {
  const {
    manageBidsState,
  } = useContext(ManageBidsContext);

  
  const checkoutLinks = [
    <Link 
      to={'#header_searchBidder'}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={'searchBidder'}
      key="searchBidder">
       Search Bidder
    </Link>,
    <Link 
      to='#header_addBidAmount'
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className="addBidAmount"
      key="addBidAmount">
       Add Bid Amount
    </Link> 
  ];

  return (
    <>
      <PPMSSideNav items={checkoutLinks} />
    </>
  );
}
