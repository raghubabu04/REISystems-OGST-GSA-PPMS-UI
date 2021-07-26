import React, { useState, useEffect } from "react";
import { PPMSBreadcrumb } from "../../../../ui-kit/components/common/breadcrumbs/PPMS-breadcrumb";
import { Paths } from "../../../Router";

interface BreadcrumbProps {
  pathname: string;
  zoneId: any;
  saleId?: any;
  lotId?: any;
  custodianId?: any;
  contractNumber?: any;
  contractId?: any;
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const {
    pathname,
    zoneId,
    saleId,
    lotId,
    custodianId,
    contractNumber,
    contractId,
  } = props;
  const [items, updateItems] = useState([]);
  useEffect(() => {
    let paths = [];
    paths.push(home(false));
    switch (pathname) {
      case (pathname.match(/\/sales\/management/) || {}).input:
        paths.push(salesManagement(true));
        break;
      case (pathname.match(/\/sales\/contractsManagement/) || {}).input:
        paths.push(contractsManagement(true));
        break;
      case (
        pathname.match(/\/sales\/lotting-details\/documents-selection\//) || {}
      ).input:
        paths.push(salesManagement(false));
        paths.push(lottingDetails(zoneId, saleId, false));
        paths.push(lottingDetailsDocs(zoneId, saleId, lotId, true));
        break;
      case (pathname.match(/sales\/transaction/) || {}).input:
        paths.push(salesManagement(false));
        paths.push(salesTransaction(zoneId, true));
        break;
      case (pathname.match(/sales\/documentation/) || {}).input:
        paths.push(salesManagement(false));
        paths.push(salesDocumentation(zoneId, true));
        break;
      case (pathname.match(/\/sales\/add-to-lot\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(addICNToLot(zoneId, saleId, true));
        break;
      case (pathname.match(/\/sales\/lot-auction-approval\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(lotAuctionList(saleId, true));
        break;
      case (pathname.match(/\/sales\/lot-review-approval\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(lotAuctionList(saleId, false));
        paths.push(lotReviewApproval(saleId, custodianId, lotId, zoneId, true));
        break;
      case (pathname.match(/\/sales\/contracts-list\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(ContractsList(saleId, true));
        break;
      case (pathname.match(/\/sales\/lotting-details\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(lottingDetails(zoneId, saleId, true));
        break;
      case (pathname.match(/\/sales\/custodian-location\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(custodianLocation(zoneId, saleId, true));
        break;
      case (pathname.match(/\/sales\/contract\/transaction\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(salesTransaction(zoneId, false));
        paths.push(ContractsList(saleId, false));
        paths.push(
          contractTransaction(zoneId, saleId, contractNumber, contractId, true)
        );
        break;
      case (pathname.match(/\/sales\/contract\/awardinfo\//) || {}).input:
        paths.push(salesManagement(false));
        paths.push(salesTransaction(zoneId, false));
        paths.push(ContractsList(saleId, false));
        paths.push(
          contractTransaction(zoneId, saleId, contractNumber, contractId, false)
        );
        paths.push(awardInformation(zoneId, saleId, contractNumber, true));
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
    id: "sales-management",
    href: "/sales/management",
    label: "Sales Management",
    active: active,
  };
};

const contractsManagement = (active) => {
  return {
    id: "contracts-management",
    href: "/sales/contracts",
    label: "Contracts Management",
    active: active,
  };
};

const salesTransaction = (zoneId, active) => {
  return {
    id: "sales-transaction",
    href: "/sales/transaction?zoneId=" + zoneId,
    label: "Sales Transaction",
    active: active,
  };
};

const salesDocumentation = (zoneId, active) => {
  return {
    id: "sales-documentation",
    href: "/sales/documentation?zoneId=" + zoneId,
    label: "Sales Documentation",
    active: active,
  };
};

const addICNToLot = (zoneId, saleId, active) => {
  return {
    id: "add-to-lot",
    href: "/sales/add-to-lot/" + saleId + "?zoneId=" + zoneId,
    label: "Add ICN To Lot",
    active: active,
  };
};
const lottingDetails = (zoneId, saleId, active) => {
  return {
    id: "lotting-details",
    href: "/sales/lotting-details/" + saleId + "?zoneId=" + zoneId,
    label: "Lotting Details",
    active: active,
  };
};

const lotAuctionList = (saleId, active) => {
  return {
    id: "lot-auction-approval",
    href: "/sales/lot-auction-approval/" + saleId,
    label: "Lot Auction Approval",
    active: active,
  };
};

const lotReviewApproval = (saleId, custodianId, zoneId, lotId, active) => {
  return {
    id: "lot-review-approval",
    href:
      "/sales/lot-review-approval/" +
      saleId +
      "/" +
      custodianId +
      "?lotId=" +
      lotId +
      "&zoneId=" +
      zoneId,
    label: "Lot Review Approval",
    active: active,
  };
};

const ContractsList = (saleId, active) => {
  return {
    id: "contracts-list",
    href: "/sales/contracts-list/" + saleId,
    label: "Contracts List",
    active: active,
  };
};

const lottingDetailsDocs = (zoneId, saleId, lotId, active) => {
  return {
    id: "lotting-details-documents-selection",
    href:
      "/sales/lotting-details/documents-selection/" +
      saleId +
      "?zoneId=" +
      zoneId +
      "&lotId=" +
      lotId,
    label: "Select Images/Documents",
    active: active,
  };
};

const custodianLocation = (zoneId, saleId, active) => {
  return {
    id: "custodian-location",
    href: "/sales/custodian-location/" + saleId + "?zoneId=" + zoneId,
    label: "Custodians/Locations",
    active: active,
  };
};

const contractTransaction = (
  zoneId,
  saleId,
  contractNumber,
  contractId,
  active
) => {
  return {
    id: "contract-transaction",
    href:
      "/sales/contract/transaction/" +
      saleId +
      "/" +
      contractId +
      "?contractNumber=" +
      contractNumber,
    label: "Contract Transaction",
    active: active,
  };
};
const awardInformation = (zoneId, saleId, contractNumber, active) => {
  return {
    id: "award-information",
    href:
      "/sales/contractTransaction/" +
      saleId +
      "?contractNumber=" +
      contractNumber,
    label: "Award Information",
    active: active,
  };
};
export default Breadcrumb;
