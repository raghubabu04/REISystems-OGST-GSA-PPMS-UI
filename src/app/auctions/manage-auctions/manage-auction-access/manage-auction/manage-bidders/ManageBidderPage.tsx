import React, { StrictMode, useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import ManageBiddersListPage from "./ManageBiddersListPage";

interface props {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
}

const ManageBidderPage = (props: props) => {
  return (
    <StrictMode>
      <ManageBiddersListPage {...props} />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBidderPage);
