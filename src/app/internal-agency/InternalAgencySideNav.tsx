import React from "react";
import {PPMSSideNav} from "../../ui-kit/components/common/PPMS-side-nav";
import {HashLink as Link} from "react-router-hash-link";
import {GoDash} from "react-icons/go";

export default function InternalAgencySideNav() {
  const checkoutLinks = [
    <Link
      to={"#header_internalAgency"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="internalAgency"
    >
      <GoDash aria-label={"Internal Agency"}/> Internal Agency
    </Link>,
    <Link
      to={"#header_internalAgencyAddress"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="internalAgencyAddress"
    >
      <GoDash aria-label={"Internal Agency Address"}/> Internal Agency Address
    </Link>,
    <Link
      to={"#header_internalAgencyPOC"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="internalAgencyPOC"
    >
      <GoDash aria-label={"Point of Contact"}/> Point of Contact
    </Link>,
    <Link
      to={"#header_internalAgencyScreeningInfo"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="internalAgencyScreeningInfo"
    >
      <GoDash aria-label={"Screening Information"}/> Screening Information
    </Link>,
    <Link
      to={"#header_internalAgencyRemark"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="internalAgencyRemark"
    >
      <GoDash aria-label={"Remarks"}/> Remarks
    </Link>,
  ];

  return (
    <>
      <PPMSSideNav items={checkoutLinks} />
    </>
  );
}
