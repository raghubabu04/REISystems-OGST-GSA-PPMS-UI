import React, { StrictMode } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import ManageBidderList from "../list/ManageBiddersList";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

interface ManageAuctionProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
}

const ManageAuction = (props: ManageAuctionProps) => {
  const renderActionButtons = () => {
    return (
      <PPMSButton
        variant={"secondary"}
        label={"Manage Bidders"}
        size={"sm"}
        onPress={() => {}}
        id={"manage-bidders"}
      />
    );
  };

  return (
    <StrictMode>
      <ManageBidderList renderActionButtons={renderActionButtons} {...props} />
    </StrictMode>
  );
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(saleAction.updateSaleInfo(saleId, saleNumber, saleAction, zone)),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAuction);
