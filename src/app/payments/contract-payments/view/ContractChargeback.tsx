import React, { StrictMode, useContext } from "react";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { connect } from "react-redux";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import ContractManagementList from "./common/ContractManagementList";
import { ContractManagementContext } from "./common/ContractManagementListContext";
import { PageHelper, Paths } from "../../../Router";

interface ContractChargebackProps {
  user?: any;
  roles?: any;
  location?: any;
}
const ContractChargeback = (props: ContractChargebackProps) => {
  const { contractManagementState, updateContractManagementState } = useContext(
    ContractManagementContext
  );
  const { user, roles, location } = props;
  let filter = { id: "isChargeback", value: true };
  const renderActionButtons = (contract: any) => {
    return (
      <>
        {!roles.isCLO ? (
          <PPMSButton
            variant={"secondary"}
            label={"View Chargeback"}
            icon={<FaEye />}
            size={"sm"}
            onPress={() => {
              PageHelper.openPage(
                `${Paths.contractChargebacksList}/${contract.row.original.contractNumber}`
              );
            }}
            id={"view"}
          />
        ) : (
          <PPMSButton
            variant={"secondary"}
            label={"Process Chargebacks"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() => {
              PageHelper.openPage(
                `${Paths.contractChargebacksList}/${contract.row.original.contractNumber}`
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
          title={"Contract Chargebacks Management"}
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

export default connect(mapStateToProps, null)(ContractChargeback);
