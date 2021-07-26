import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Paths } from "../../Router";
import Moment from "moment";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { formatLotNumber } from "../management-pbs-doi/lot-details/property/common/constants/Utils";
import { FaExclamationTriangle, FaTrashAlt } from "react-icons/fa";
import { GoInfo } from "react-icons/go";
import { ManageBidsSideNav } from "./ManageBidsSideNav";
import { Form } from "react-bootstrap";
import { StrictMode } from "react";
import { PPMSForm } from "../../../ui-kit/components/common/form/PPMS-form";
import { isFormSubmitted } from "../../../service/validation.service";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import PPMSURLLinks from "../../../ui-kit/components/PPMS-url-links";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import PPMSBidAmount from "../../../ui-kit/components/sales/PPMSBidAmount";
import { ManageBidsState } from "./ManageBids";
import { ManageBidsContext } from "./ManageBidsContext";
import { useState } from "react";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
export interface AddBidAmountProps {
  user?: any;
  bidDetail?: any;
  userAccess?: string[];
  roles?: any;
  loggedIn?: boolean;
  permissions?: any[];
  aacs?: any[];
  authentication?: any;
  actions?: any;
}

const AddBidAmount = (props: AddBidAmountProps) => {
  const [formValidation, setFormValidation] = useState({
    isInvalid: false,
    validationError: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const { user } = props;
  let auctionsAPIService = new AuctionsApiService();
  const { manageBidsState, updateManageBidsState } = useContext(
    ManageBidsContext
  );

  useEffect(() => {
    setShowMessage(false);
    setFormValidation({ isInvalid: false, validationError: "" });
  }, []);

  const saveBidAmount = () => {
    const { addToast } = props.actions;
    let state = manageBidsState;
    let auctionsAPIService = new AuctionsApiService();
    let bids = manageBidsState.data.saleLotBidAmountList.filter(
      (item) => item.saleNumber && item.lotNumber && item.bidAmount
    );
    let data = {
      bidderId: state.data.bidderId,
      userName: state.data.userName,
      saleLotBidAmountList: bids,
    };
    auctionsAPIService
      .addBidAmount(data)
      .then((response) => {
        setFormValidation({
          isInvalid: false,
          validationError: "",
        });
        addToast({
          text: `Bid Amount Saved Successfully.`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: `` + error.data.message,
          type: "error",
          heading: "Error",
        });
      });
    state.data.saleLotBidAmountList = [];
    updateManageBidsState(state);
  };
  const cancelBidAmount = () => {
    let state = manageBidsState;
    state.data.saleLotBidAmountList = [];
    updateManageBidsState(state);
    setFormValidation({
      isInvalid: false,
      validationError: "",
    });
  };

  function handleSubmit(event) {
    isFormSubmitted.next(true);
    event.preventDefault();
  }

  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <div className="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <h3></h3>

          <PPMSBidAmount
            labelBold={true}
            addLabel={" Add More"}
            minLinks={3}
            maxLinks={6}
            links={manageBidsState.data.saleLotBidAmountList}
            updateLinks={(values) => {
              let state = manageBidsState;
              state.data.saleLotBidAmountList = values;
              updateManageBidsState(state);
            }}
            disable={false}
          />
          <div className={"grid-col-4 addBidder"}>
            <table>
              <tr>
                <td>
                  <PPMSButton
                    id={"save-add-bidder-amount"}
                    type={"button"}
                    variant={"primary"}
                    label={"Save"}
                    onPress={saveBidAmount}
                    className={""}
                  />
                </td>
                <td>
                  <PPMSButton
                    id={"search-bidder-email"}
                    type={"button"}
                    variant={"primary"}
                    label={"Cancel"}
                    onPress={cancelBidAmount}
                    className={""}
                  />
                </td>
                <td>
                  <div className={"grid-row grid-gap-2"}>
                    {showMessage ? (
                      <></>
                    ) : (
                      <div> {formValidation.validationError}</div>
                    )}
                  </div>
                </td>
              </tr>
              <tr></tr>
            </table>
          </div>
        </div>
      </div>
    </StrictMode>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  sale: state.sale,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBidAmount);
