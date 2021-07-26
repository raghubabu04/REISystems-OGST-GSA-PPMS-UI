import React, {ReactElement, StrictMode, useContext, useMemo, useState} from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { addToast } from "../../../../../_redux/_actions/toast.actions";

import ViewBidAuctionList from "../list/ViewBidAuctionList";

interface ViewBidsProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
  saleId: number;
}

const ViewBids = (props: ViewBidsProps) => {
  const { addToast } = props.actions;
  return useMemo(() => {
    return (
      <StrictMode>
        <ViewBidAuctionList
          {...props}
        />
        <div className="grid-row grid-gap-4">
        </div>
      </StrictMode>
    );
  }, []);
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewBids);
