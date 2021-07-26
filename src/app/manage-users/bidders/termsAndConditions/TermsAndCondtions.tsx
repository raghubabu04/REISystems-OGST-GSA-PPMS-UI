import React, { useContext, useEffect } from "react";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import PPMSAccordion from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { getUserInfo } from "../../../../_redux/_helpers/auth-header";
import { PageHelper, Paths } from "../../../Router";
import BidderTermsAndConditions from "../bidder-terms-and-conditions/BidderTermsAndCondition";
import { BidderContext } from "../BidderContext";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface TermsAndConditionsProps {
  match?: any;
  roles?: any;
  actions?: any;
  pbsFSCCodes?: any;
  authentication?: any;
  currentVersionNumber?: string;
  userName?: string;
  isAllTermsAndConditionAccepted?: boolean;
  bidderAccountsSize?: any;
  disableCheckbox?: any;
}
function TermsAndConditions(props: TermsAndConditionsProps) {

  const { addToast } = props.actions;
  const userApiService = new UserApiService();

  useEffect(() => {
    let data = {
      params: {
        userName: props.userName,
        currentVersionNumber: props.currentVersionNumber
      }
    }

    if (props.isAllTermsAndConditionAccepted) {
      userApiService.updateBidderVersionNumber(data).then((res) => {
        props.disableCheckbox(true);
        if (props.bidderAccountsSize > 1) {
          PageHelper.openPage(Paths.switchBidderAccount)
        } else {
          PageHelper.openPage(Paths.home)
        }
        addToast({
          text: "Successfully updated bidder",
          type: "success",
          heading: "Success",
        });
      }).catch((error) => {
        console.log(error);
        addToast({
          text: "Error occured while updating bidder",
          type: "error",
          heading: "Error",
        });
      })

    }
  }, [props.isAllTermsAndConditionAccepted])

  return (
    <>
      <div className={"grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>Terms and Conditions</h1>
        </div>
        <BidderTermsAndConditions />
      </div>
    </>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({
  roles: state.authentication.roles,
});
export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions);
