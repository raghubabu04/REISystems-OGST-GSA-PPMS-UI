import React from "react";
import { PPMSSideNav } from "../../../../../ui-kit/components/common/PPMS-side-nav";
import { HashLink as Link } from "react-router-hash-link";
import { GoDash } from "react-icons/go";

interface SideNav3040Props {}

function SideNav3040Reporting(props: SideNav3040Props) {
  const reportingLinks = [
    <Link
      to={"#header_receipts-3040-report"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      key="receipts-3040-report"

    >
      <GoDash /> Receipts
    </Link>,
    <Link
      to={"#header_donations-3040-report"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      key="donations-3040-report"
    >
      <GoDash /> Donations
    </Link>,
    <Link
      to={"#header_transfers-3040-report"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      key="transfers-3040-report"
    >
      <GoDash /> Transfers
    </Link>,
    <Link
      to={"#header_comments-3040-report"}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      key="comments-3040-report"
    >
      <GoDash /> Comments
    </Link>,
  ];

  return (
    <>
      <PPMSSideNav items={reportingLinks} />
    </>
  );
}

export default SideNav3040Reporting;
