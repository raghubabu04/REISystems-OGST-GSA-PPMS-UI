import React, { useEffect, useState } from "react";
import { PPMSSideNav } from "../../../../ui-kit/components/common/PPMS-side-nav";
import { GoDash } from "react-icons/go";
import { HashLink as Link } from "react-router-hash-link";
import { Paths } from "../../../Router";
export interface SideNavProps {
  saleId?: any;
  lotId?: any;
  zoneId?: any;
  currentPage: string;
}

const SalesSideNavPBSDOI = (props: SideNavProps) => {
  const { saleId, currentPage, lotId, zoneId } = props;
  let salesTransaction = (
    <Link
      to={`${
        saleId
          ? Paths.salesTransactionPBSDOI + "/" + saleId
          : Paths.salesTransactionPBSDOI
      }?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`sales-transaction-pbs-doi ${
        currentPage === Paths.salesTransactionPBSDOI ? "usa-current" : ""
      }`}
      key="sales-transaction-pbs-doi"
    >
      <GoDash /> Sales Transaction
    </Link>
  );

  let lotDetails = (
    <Link
      to={`${Paths.salesLotDetailsPBSDOI}/${saleId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`lot-details-pbs-doi ${
        currentPage === Paths.salesLotDetailsPBSDOI ||
        currentPage === Paths.salesAddPropertyPBSDOI ||
        currentPage === Paths.salesDetailsPBSDOI ||
        currentPage === Paths.salesFinalizePBSDOI
          ? "usa-current"
          : ""
      }`}
      key="lot-details-pbs-doi"
    >
      <GoDash /> Lot Details
    </Link>
  );

  let addProperty = (
    <Link
      to={`${Paths.salesAddPropertyPBSDOI}/${saleId}/${lotId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`add-property-pbs-doi ${
        currentPage === Paths.salesAddPropertyPBSDOI ? "usa-current" : ""
      }`}
      key="add-property-pbs-doi"
    >
      <GoDash /> Add Property
    </Link>
  );
  let saleDetails = (
    <Link
      to={`${Paths.salesDetailsPBSDOI}/${saleId}/${lotId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`sale-details-pbs-doi ${
        currentPage === Paths.salesDetailsPBSDOI ? "usa-current" : ""
      }`}
      key="sale-details-pbs-doi"
    >
      <GoDash /> Sale Details
    </Link>
  );
  let finalizeSale = (
    <Link
      to={`${Paths.salesFinalizePBSDOI}/${saleId}/${lotId}?zoneId=${zoneId}`}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={`finalize-sale-pbs-doi ${
        currentPage === Paths.salesFinalizePBSDOI ? "usa-current" : ""
      }`}
      key="finalize-sale-pbs-doi"
    >
      <GoDash /> Finalize Sale
    </Link>
  );
  const [sideNavList, updateSideNavList] = useState([salesTransaction]);
  useEffect(() => {
    let navList = [];
    let subNavList = [];
    navList.push(salesTransaction);
    if (saleId) {
      navList.push(lotDetails);
      if (lotId) {
        subNavList.push(addProperty);
        subNavList.push(saleDetails);
        subNavList.push(finalizeSale);
        navList.push(subNavList);
      }
    }
    updateSideNavList(navList);
  }, [lotId]);
  return (
    <>
      <PPMSSideNav items={sideNavList} />
    </>
  );
};

export default SalesSideNavPBSDOI;
