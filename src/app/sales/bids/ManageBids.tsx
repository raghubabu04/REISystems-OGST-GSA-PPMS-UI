import React, { StrictMode, useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import { Link } from "react-router-dom";
import { Paths } from "../../../app/Router";
import Moment from "moment";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { ManageBidsContext } from "./ManageBidsContext";
import { formatLotNumber } from "../../sales/management-pbs-doi/lot-details/property/common/constants/Utils";
import { FaExclamationTriangle } from "react-icons/fa";
import { GoInfo } from "react-icons/go";
import { ManageBidsSideNav } from "./ManageBidsSideNav";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { Form } from "react-bootstrap";
import { ManageBidsDefaultState } from "./ManageBidsState";
import IcnClass from "../../property/create-update-property/icn-class/IcnClass";
import { PPMSForm } from "../../../ui-kit/components/common/form/PPMS-form";
import { ItemSelectionCriteriaClass } from "../marketing-campaign/create-marketing-campaign/item-selection-criteria/ItemSelectionCriteriaClass";
import { CampaignDetailsClass } from "../marketing-campaign/create-marketing-campaign/campaign/CampaignDetailsClass";
import { isFormSubmitted } from "../../../service/validation.service";
import SearchBidder from "./SearchBidder";
import AddBidAmount from "./AddBidAmount";
export interface ManageBidsProps {
  user?: any;
  userAccess?: string[];
  roles?: any;
  loggedIn?: boolean;
  permissions?: any[];
  aacs?: any[];
  authentication?: any;
  actions?: any;
}

export function ManageBidsState(props: ManageBidsProps) {
  const { updateManageBidsState, manageBidsState } = useContext(
    ManageBidsContext
  );
  const { addToast } = props.actions;
}

const ManageBids = (props: ManageBidsProps) => {
  const { user } = props;
  const { manageBidsState, updateManageBidsState } = useContext(
    ManageBidsContext
  );

  useEffect(() => {
  }, []);

  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>Record Bids</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Manage Bids</h3>
                <ManageBidsSideNav></ManageBidsSideNav>
              </nav>
            </div>
          </div>
        </div>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">

            <PPMSAccordion
              items={[
                {
                  title: "Search Bidder",
                  content: <SearchBidder />,
                  expanded: true,
                  id: "searchBidder",
                  className: "searchBidder",
                },
              ]}
            />

            <PPMSAccordion
              items={[
                {
                  title: "Add Bid Amount",
                  content: <AddBidAmount />,
                  expanded: true,
                  id: "addBidAmount",
                  className: "addBidAmount",
                },
              ]}
            />

        </div>
      </div>
    </StrictMode>
  );
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  sale: state.sale,
});

function handleSubmit(event) {
  isFormSubmitted.next(true);
  event.preventDefault();
}

export default connect(mapStateToProps, null)(ManageBids);
function updateManageBidsState(arg0: { accordion: any }) {
  // throw new Error("Function not implemented.");
}
