import React, { useEffect, useState } from "react";
import { PPMSSideNav } from "../../../../ui-kit/components/common/PPMS-side-nav";
import { GoDash } from "react-icons/go";
import { HashLink as Link } from "react-router-hash-link";
import { Paths } from "../../../Router";

export interface SideNavProps {
  saleId?: any;
  zoneId: any;
  currentPage: string;
}

const SalesSideNav = (props: SideNavProps) => {
  const { saleId, zoneId, currentPage } = props;
  let salesTransaction = (
    <Link
      to={`${Paths.salesTransaction}${
        saleId ? "/" + saleId : ""
      }?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`sales-transaction ${
        currentPage === Paths.salesTransaction ? "usa-current" : ""
      }`}
      key="sales-transaction-id"
    >
      <GoDash aria-label={"Sales Transaction"} /> Sales Transaction
    </Link>
  );
  let salesDocument = (
    <Link
      to={`${Paths.salesDocument}${
        saleId ? "/" + saleId : ""
      }?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`sales-documentation ${
        currentPage === Paths.salesDocument ? "usa-current" : ""
      }`}
      key="sales-documentation-id"
    >
      <GoDash aria-label={"Sales Documentation"} /> Sales Documentation
    </Link>
  );
  let addICNToLot = (
    <Link
      to={`${Paths.salesAddICNToLot}/${saleId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`add-icns-to-lot ${
        currentPage === Paths.salesAddICNToLot ? "usa-current" : ""
      }`}
      key="add-icns-to-lot-id"
    >
      <GoDash aria-label={"Add ICNs to Lot(s)"} /> Add ICNs to Lot(s)
    </Link>
  );

  let lottingDetails = (
    <Link
      to={`${Paths.salesLottingDetails}/${saleId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`lotting-details ${
        currentPage === Paths.salesLottingDetails ? "usa-current" : ""
      }`}
      key="lotting-details-id"
    >
      <GoDash aria-label={"Lotting Details"} /> Lotting Details
    </Link>
  );

  let custodians = (
    <Link
      to={`${Paths.salesCustodian}/${saleId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`custodian-locations ${
        currentPage === Paths.salesCustodian ? "usa-current" : ""
      }`}
      key="custodian-locations-id"
    >
      <GoDash aria-label={"Custodians/Locations"} /> Custodians/Locations
    </Link>
  );
  let lotAuction = (
    <Link
      to={`${Paths.salesLotAuctionAprroval}/${saleId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`lot-auction-approval ${
        currentPage === Paths.salesLotAuctionAprroval ? "usa-current" : ""
      }`}
      key="lot-auction-approval-id"
    >
      <GoDash aria-label={"Lot Auction Review"} /> Lot Auction Review
    </Link>
  );
  let contractsList = (
    <Link
      to={`${Paths.salesContractsList}/${saleId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`contracts-list ${
        currentPage === Paths.salesContractsList ? "usa-current" : ""
      }`}
      key="contracts-list-id"
    >
      <GoDash aria-label={"Contracts List"} /> Contracts List
    </Link>
  );
  const [sideNavList, updateSideNavList] = useState([salesTransaction]);
  useEffect(() => {
    let navList = [];
    navList.push(salesTransaction);
    if (saleId) {
      navList.push(salesDocument);
      navList.push(addICNToLot);
      navList.push(lottingDetails);
      navList.push(custodians);
      navList.push(lotAuction);
      navList.push(contractsList);
    }
    updateSideNavList(navList);
  }, []);
  return (
    <>
      <PPMSSideNav items={sideNavList} />
    </>
  );
};

export default SalesSideNav;
