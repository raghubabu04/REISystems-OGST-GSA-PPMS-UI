import React, { StrictMode, useContext } from "react";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { connect } from "react-redux";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../../Router";
import ContractManagementList from "./common/ContractManagementList";
import { ContractManagementContext } from "./common/ContractManagementListContext";
interface ContractRefundManagementProps {
  user?: any;
  roles?: any;
  location?: any;
}
const ContractRefundManagement = (props: ContractRefundManagementProps) => {
  const { contractManagementState, updateContractManagementState } = useContext(
    ContractManagementContext
  );
  const { user, roles, location } = props;
  let filter = {
    id: "refundReason",
    value: ["Default for non removal", "ADR", "Cancellation"],
  };
  const renderActionButtons = (contract: any) => {
    return (
      <>
        {!roles.isCLO ? (
          <PPMSButton
            variant={"secondary"}
            label={"View Refunds"}
            icon={<FaEye />}
            size={"sm"}
            onPress={() => {
                PageHelper.openPage(
                  `${Paths.contractRefundList}/${contract.row.original.contractNumber}`
                );
            }}
            id={"view"}
          />
        ) : (
          <PPMSButton
            variant={"secondary"}
            label={"Process Refunds"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() => {
              PageHelper.openPage(
                `${Paths.contractRefundList}/${contract.row.original.contractNumber}`
              );
            }}
            id={`edit-${contract.row.original.id}`}
          />
        )}
      </>
    );
  };

  return (
    <div>
      <StrictMode>
        <ContractManagementList
          renderActionButtons={renderActionButtons}
          title={"Contract Refund Management"}
          listFilter={filter}
          location={location.pathname}
        />
      </StrictMode>
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps, null)(ContractRefundManagement);
