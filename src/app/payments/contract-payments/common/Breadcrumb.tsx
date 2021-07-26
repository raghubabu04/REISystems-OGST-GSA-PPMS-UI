import React, { useEffect, useState } from "react";
import { PPMSBreadcrumb } from "../../../../ui-kit/components/common/breadcrumbs/PPMS-breadcrumb";

interface BreadcrumbRefundsProps {
  pathname?: any;
}
const Breadcrumb = (props: BreadcrumbRefundsProps) => {
  const { pathname } = props;
  const [items, updateItems] = useState([]);
  useEffect(() => {
    let paths = [];
    paths.push(home(false));
    switch (pathname) {
      case (pathname.match(/\/myTasks/) || {}).input:
        paths.push(myTasks(true));
        break;
      case (pathname.match(/\/my-tasks\/contract-refund-management/) || {})
        .input:
        paths.push(myTasks(false));
        paths.push(ContractRefundsManagement(true));
        break;
      case (pathname.match(/\/my-tasks\/contract-chargebacks-management/) || {})
        .input:
        paths.push(myTasks(false));
        paths.push(ContractChargebacksManagement(true));
        break;
      case (pathname.match(/my-tasks\/liquidated-damages-management/) || {})
        .input:
        paths.push(myTasks(false));
        paths.push(LiquidatedDamagesManagement(true));
        break;
      case (pathname.match(/my-tasks\/chargebacks\/process-chargeback/) || {})
        .input:
        paths.push(myTasks(false));
        paths.push(ContractChargebacksManagement(false));
        paths.push(ProcessChargeback(true));
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

const myTasks = (active) => {
  return {
    id: "myTasks",
    href: "/myTasks",
    label: "My Tasks",
    active: active,
  };
};

const ContractRefundsManagement = (active) => {
  return {
    id: "contractRefundMangement",
    href: "/my-tasks/contract-refund-management",
    label: "Contract Refunds",
    active: active,
  };
};

const ContractChargebacksManagement = (active) => {
  return {
    id: "contractChargebackMangement",
    href: "/my-tasks/contract-chargebacks-management",
    label: "Contract Chargebacks",
    active: active,
  };
};

const LiquidatedDamagesManagement = (active) => {
  return {
    id: "liquidatedDamangesMangement",
    href: "/my-tasks/liquidated-damages-management",
    label: "Liquidated Damages",
    active: active,
  };
};
const ProcessChargeback = (active) => {
  return {
    id: "processChargeback",
    href: "/my-tasks/chargebacks/process-chargeback",
    label: "Process Chargeback",
    active: active,
  };
};

export default Breadcrumb;
