import React, {
  StrictMode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import DefaultContracts from "../../../sales/contracts/default-contracts/DefaultContracts";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { DefaultContractsContext } from "../../../sales/contracts/default-contracts/DefaultContractsContext";
import BidderInformationView from "../view-bidder/BidderInformationView";

interface DefaultBidderProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  roles: any;
}

const DefaultBidder = (props: DefaultBidderProps) => {
  let userAPIService: UserApiService = new UserApiService();

  const { defaultContractsState, updateDefaultContractsState } = useContext(
    DefaultContractsContext
  );

  useEffect(() => {
    userAPIService
      .getBidderUser(props.match.params.userName)
      .then((response: any) => {
        updateDefaultContractsState({
          bidderData: response.data.bidderUser,
          userData: response.data,
          bidderEmail: response.data.emailAddress,
          bidderUsername: props.match.params.userName,
          bidderId: response.data.bidderUser.bidderId,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }, []);

  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <div className="grid-row header-row mb-3">
          <h1>Default Bidder</h1>
          <div className={"grid-col-12 ppms-details-container"}>
            <BidderInformationView
              bidderData={defaultContractsState.bidderData}
              userData={defaultContractsState.userData}
              emailAddress={defaultContractsState.bidderEmail}
              {...props}
            />
          </div>

          <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
            <DefaultContracts
              bidderId={defaultContractsState.bidderId}
              bidderUsername={props.match.params.userName}
              {...props}
            />
            <br></br>
          </div>
        </div>
      </div>
    </StrictMode>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DefaultBidder);
