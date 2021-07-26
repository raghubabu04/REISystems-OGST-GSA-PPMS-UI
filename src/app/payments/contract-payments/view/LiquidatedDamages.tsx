import React, { StrictMode } from "react";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { connect } from "react-redux";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import ContractManagementList from "./common/ContractManagementList";
import { PageHelper, Paths } from "../../../Router";

interface LiquidatedDamagesProps {
  user?: any;
  roles?: any;
  location?: any;
}
const LiquidatedDamages = (props: LiquidatedDamagesProps) => {
  const { user, roles, location } = props;
  let filter = { id: "refundReason", value: ["Default for non payment"] };
  const renderActionButtons = (contract: any) => {
    return (
      <>
        {!roles.isCLO ? (
          <PPMSButton
            variant={"secondary"}
            label={"View Liquidated Damages"}
            icon={<FaEye />}
            size={"sm"}
            onPress={() => {
              PageHelper.openPage(
                `${Paths.liquidatedDamagesList}/${contract.row.original.contractNumber}`
              );
            }}
            id={"view"}
          />
        ) : (
          <PPMSButton
            variant={"secondary"}
            label={"Process Liquidated Damages"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() => {
              PageHelper.openPage(
                `${Paths.liquidatedDamagesList}/${contract.row.original.contractNumber}`
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
          title={"Liquidated Damages Management"}
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

export default connect(mapStateToProps, null)(LiquidatedDamages);
