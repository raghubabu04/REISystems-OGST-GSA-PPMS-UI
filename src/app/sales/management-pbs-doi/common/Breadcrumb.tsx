import React, { useState, useEffect } from "react";
import { PPMSBreadcrumb } from "../../../../ui-kit/components/common/breadcrumbs/PPMS-breadcrumb";
import { Paths } from "../../../Router";

interface BreadcrumbProps {
  pathname: string;
  zoneId?: any;
  saleId?: any;
  lotId?: any;
  contractNumber?: any;
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { pathname, zoneId, saleId, lotId, contractNumber } = props;
  const [items, updateItems] = useState([]);
  useEffect(() => {
    let paths = [];
    paths.push(home(false));
    switch (pathname) {
      case (pathname.match(/\/sales\/management-pbs-doi/) || {}).input:
        paths.push(salesManagement(true));
        break;
      case (pathname.match(/sales\/transaction-pbs-doi/) || {}).input:
        paths.push(salesManagement(false));
        paths.push(salesTransaction(zoneId, true));
        break;
      default:
        break;
    }
    updateItems(paths);
  }, []);
  return (
    <>
      <PPMSBreadcrumb items={items} />
    </>
  );
};

const home = (active) => {
  return {
    id: "home",
    href: "/",
    label: "Home",
    active: active,
  };
};

const salesManagement = (active) => {
  return {
    id: "sales-management-pbsdoi",
    href: "/sales/management-pbs-doi",
    label: "Sales Management",
    active: active,
  };
};

const salesTransaction = (zoneId, active) => {
  return {
    id: "sales-transaction",
    href: "/sales/transaction-pbs-doi?zoneId=" + zoneId,
    label: "Sales Transaction",
    active: active,
  };
};

export default Breadcrumb;
