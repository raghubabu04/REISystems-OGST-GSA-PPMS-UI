import React, { useEffect } from "react";
import { connect } from "react-redux";
import { commonActions } from "../../_redux/_actions/common.actions";
import moment from "moment";

interface CommonProps {
  getAllAgencyBureaus: () => {};
  getPBSFSCCodes: () => {};
  getDOIFSCCodes: () => {};
  getHolidays: (year) => {};
  showManageProperties: () => {};
  authentication: any;
}

const Common = (props: CommonProps) => {
  const {
    getAllAgencyBureaus,
    getPBSFSCCodes,
    getDOIFSCCodes,
    getHolidays,
    showManageProperties,
    authentication,
  } = props;
  useEffect(() => {
    if (authentication.loggedIn) {
      getAllAgencyBureaus();
      getPBSFSCCodes();
      getDOIFSCCodes();
      getHolidays(moment().year());
      showManageProperties();
    }
  }, [authentication.loggedIn]);
  return <></>;
};

const mapStateToProps = (state) => ({
  agencyBureaus: state.common.agencyBureaus,
  authentication: state.authentication,
  showManageProperties: state.common.showManageProperties,
});
const mapDispatchToProps = (dispatch) => {
  return {
    getAllAgencyBureaus: () => dispatch(commonActions.getAllAgencyBureaus()),
    getPBSFSCCodes: () => dispatch(commonActions.getPBSFSCCodes()),
    getDOIFSCCodes: () => dispatch(commonActions.getDOIFSCCodes()),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
    showManageProperties: () => dispatch(commonActions.showManageProperties()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Common);
