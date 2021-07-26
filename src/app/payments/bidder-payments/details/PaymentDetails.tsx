import React, { StrictMode, useEffect, useState } from "react";
import CreateUpdate from "./create/CreateUpdate";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import BidderDetails from "../../common/BidderDetails";
import { PageHelper, Paths } from "../../../Router";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import queryString from "query-string";

interface PaymentDetailsProps {
  actions?: any;
  location?: any;
  match: any;
}

const PaymentDetails = (props: PaymentDetailsProps) => {
  const { match, location } = props;
  let type = null;
  let bidderId = null;
  let contractIds = [];
  if (
    match.params.type &&
    match.params.bidderId &&
    (match.params.type === "single" || match.params.type === "multi")
  ) {
    type = match.params.type;
    bidderId = match.params.bidderId;
  } else {
    PageHelper.openPage(Paths.home);
  }
  let search = location.search;
  let query = queryString.parse(search);
  if (query?.contractIds) {
    contractIds = query.contractIds?.toString().split(",");
  } else {
    PageHelper.openPage(Paths.bidderPayments);
  }

  const [bidderUser, updateBidderUser] = useState(null);
  const userAPIService = new UserApiService();
  const getBidderUserDetails = (bidderId) => {
    userAPIService
      .getBidderUserById(bidderId)
      .then((response) => {
        updateBidderUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getBidderUserDetails(bidderId);
  }, []);

  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <div className="grid-row header-row mb-3">
          <h1>{`${
            type === "multi" ? "Multiple" : "Single"
          } Contract Payment`}</h1>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
          <BidderDetails
            userName={bidderUser?.userName}
            name={`${
              bidderUser?.userFirstName ? bidderUser?.userFirstName : ""
            } ${bidderUser?.userMiddleName ? bidderUser?.userMiddleName : ""} ${
              bidderUser?.userLastName ? bidderUser?.userLastName : ""
            }`}
            address={bidderUser?.addressDTO?.addressLine1}
            city={bidderUser?.addressDTO?.city}
            state={bidderUser?.addressDTO?.state}
          />
          <CreateUpdate
            isSinglePayment={type === "multi"}
            contractIds={contractIds}
            bidderId={bidderId}
          />
        </div>
      </div>
      <br />
      <div className="grid-row grid-gap-2 next-prev-page">
        <div className="desktop:grid-col-12">
          <PPMSButton
            id={"lot-details"}
            type={"button"}
            variant={"link"}
            label={"< Bidder Payments"}
            onPress={() => PageHelper.openPage(`${Paths.bidderPayments}`)}
          />
        </div>
      </div>
    </StrictMode>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentDetails);
