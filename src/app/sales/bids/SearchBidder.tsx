import React, { StrictMode, useContext, useState } from "react";
import { connect } from "react-redux";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { UserApiService } from "../../../api-kit/user/user-api.service";
import { checkEmail } from "../../../ui-kit/components/validations/FieldValidations";
import { ManageBidsContext } from "./ManageBidsContext";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import {PPMSToggleRadio} from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import {PageHelper, Paths} from "../../Router";
export interface SearchBidderProps {
  user?: any;
  userAccess?: string[];
  roles?: any;
  loggedIn?: boolean;
  permissions?: any[];
  aacs?: any[];
  authentication?: any;
  actions?: any;
}

const SearchBidder = (props: SearchBidderProps) => {
  const { user } = props;

  const { manageBidsState, updateManageBidsState } = useContext(
    ManageBidsContext
  );
  const [emailValidation, setEmailValidation] = useState({
    isInvalid: false,
    validationError: "",
  });
  const [emailId, setEmailId] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [bidderUsername, setBidderUsername] = useState("");
  const [bidderAddress, setBidderAddress] = useState("");
  const [bidderStatus, setBidderStatus] = useState("");
  const [bidderId, setBidderId] = useState("");
  const [showBidder, setShowBidder] = useState(false);
  const [showBidderUserIds, setShowBidderUserIds] = useState(false);
  const [bidderUserIds, setBidderUserIds] = useState(false);
  let auctionsAPIService = new AuctionsApiService();
  let userService = new UserApiService();

  const handleEmailChange = (event) => {
    setEmailId(event.target.value);
    let state = manageBidsState;
    state.data.bidderId = 0;
    state.data.userName = "";
    state.data.saleLotBidAmountList = [];
    updateManageBidsState(state);
    if (checkEmail(event.target.value)) {
      setEmailValidation({ isInvalid: false, validationError: "" });
    } else {
      setEmailValidation({
        isInvalid: true,
        validationError: "Email is Invalid",
      });
      setShowBidder(false);
      setBidderUserIds(null);
      setShowBidderUserIds(false);
    }
  };

  const handleUserIdChange = () => {
    const { addToast } = props.actions;
      userService
        .getBidderUserByUserId(manageBidsState.data.selectedUserId)
        .then((response) => {

          setShowBidder(true);
          let bidderDetails = response?.data? response?.data : null;
          setBidderId(bidderDetails.bidderId ? bidderDetails.bidderId : null);
          setBidderName(
            `${
              bidderDetails?.bidderFirstName ? bidderDetails.bidderFirstName : null
            } ${bidderDetails.bidderLastName}`
          );
          setRegistrationType(
            bidderDetails?.registrationType?.registrationType
              ? bidderDetails?.registrationType?.registrationType
              : null
          );
          setBidderUsername(
            bidderDetails?.userName ? bidderDetails?.userName : null
          );
          setBidderAddress(
            bidderDetails?.address?.addressLine1 +
              "" +
              bidderDetails?.address?.addressLine2 +
              " , " +
              bidderDetails?.address?.city +
              " , " +
              bidderDetails?.address?.stateCode +
              "-" +
              bidderDetails?.address?.zip
          );
          setBidderStatus(bidderDetails?.status ? bidderDetails?.status?.status : null);
          let state = manageBidsState;
          state.data.bidderId = bidderDetails.bidderId;
          state.data.userName = bidderDetails.userName
            ? bidderDetails.userName
            : "";
        })
        .catch((error) => {
          setBidderName(null);
          setShowBidder(false);
          addToast({
            text: `Bidder not found`,
            type: "error",
            heading: "Error",
          });
          console.log(error);
        });
  };
  const searchEmail = () => {
    const { addToast } = props.actions;
    if (!emailValidation?.isInvalid) {
      userService
        .getBidderUserIdsByEmailId(emailId)
        .then((response) => {

          setBidderUserIds(response.data);
          if(response?.data?.length > 1){
            setShowBidderUserIds(true);
            let userIdOptions = response.data.map((userId) => {
              return {
                value: userId,
                id: userId,
                isSelected: false,
              };
            });
            manageBidsState.data.bidderUserIdsOptions = userIdOptions;
            updateManageBidsState({
              manageBidsState,
            })
          }else if(response?.data?.length == 1){
            setShowBidderUserIds(false);
            manageBidsState.data.selectedUserId = response.data?.[0];
            handleUserIdChange();
          }
        })
        .catch((error) => {
          setBidderName(null);
          setShowBidder(false);
          addToast({
            text: `Bidder not found`,
            type: "error",
            heading: "Error",
          });
          console.log(error);
        });
    }
  };
  React.useEffect(() => {
    setEmailId("");
    setBidderName("");
    setBidderUsername("");
    setRegistrationType("");
    setBidderId("");
    setBidderStatus("");
    setShowBidder(false);
    setEmailValidation({ isInvalid: false, validationError: "" });
  }, []);

  return (
    <StrictMode>
      <SearchBidderContent
        email={emailId}
        searchEmail={searchEmail}
        emailValidation={emailValidation}
        handleEmailChange={handleEmailChange}
        showBidder={showBidder}
        bidderName={bidderName}
        bidderAddress={bidderAddress}
        bidderRegistrationType={registrationType}
        bidderUsername={bidderUsername}
        bidderStatus={bidderStatus}
        showBidderUserIds={showBidderUserIds}
        managetBidStatus={manageBidsState}
        updateManageBidsState={updateManageBidsState}
        handleUserIdChange={handleUserIdChange}
      />
    </StrictMode>
  );
};

const SearchBidderContent = ({
  handleEmailChange,
  searchEmail,
  email,
  emailValidation,
  showBidder,
  bidderName,
  bidderAddress,
  bidderRegistrationType,
  bidderUsername,
  bidderStatus,
  showBidderUserIds,
  managetBidStatus,
  updateManageBidsState,
  handleUserIdChange

}) => {
  return (
    <div>
      <div className={"grid-row grid-gap-2"}>
        <div className={"grid-col-2 addBidder"}>
          <strong>Bidder Email : </strong>
        </div>
        <div className={"grid-col-6 "}>
          <PPMSInput
            title={"Bidder Email"}
            isDisabled={false}
            id={"bidder-email"}
            inputType={"text"}
            isInvalid={emailValidation.isInvalid}
            validationMessage={emailValidation.validationError}
            isRequired={true}
            value={email}
            maxLength={64}
            onChange={handleEmailChange}
          />
        </div>
        <div className={"grid-col-4 addBidder"}>
          <PPMSButton
            id={"search-bidder-email"}
            type={"button"}
            variant={"primary"}
            label={"Search"}
            onPress={searchEmail}
            className={""}
          />
        </div>
      </div>
      <br />
      <div className={"grid-row grid-gap-2 award-information-content_margin"}>
        {showBidderUserIds &&
        <PPMSToggleRadio
          id={"userId"}
          options={managetBidStatus.data.bidderUserIdsOptions}
          isInline={true}
          isDisabled={false}
          name={"userId"}
          className={"user-id grid-col-4"}
          isLabelNotRequired={false}
          validationMessage={""}
          isSingleSelect={true}
          onChange={(value) => {
            let state = managetBidStatus;
            let selectedUserId = value
              .filter((item) => item.isSelected === true)
              .map((item) => {
                return item.value;
              })
            state.data.selectedUserId = selectedUserId;
            updateManageBidsState(state);
            handleUserIdChange();
          }}
          isRequired={false}
          formClass={"grid-row-12"}
          inLineWithOutRightMargin={true}
        />
        }
      </div>
      <div className={"grid-row grid-gap-2"}>
        {showBidder ? (
          bidderName ? (
            bidderRegistrationType === "Company" ? (
              <>
                <div className={"grid-col-2"}>
                  <strong>Company Name</strong>
                </div>
                <div className={"grid-col-4"}>
                  <strong>Company Address</strong>
                </div>
                <div className={"grid-col-2"}>
                  <strong>Company Registration Type</strong>
                </div>
                <div className={"grid-col-2"}>
                  <strong>Company Username</strong>
                </div>
                <div className={"grid-col-2"}>
                  <strong>Company Status</strong>
                </div>
              </>
            ) : (
              <>
                <div className={"grid-col-2"}>
                  <strong>Bidder Name</strong>
                </div>
                <div className={"grid-col-4"}>
                  <strong>Bidder Address</strong>
                </div>
                <div className={"grid-col-2"}>
                  <strong>Bidder Registration Type</strong>
                </div>
                <div className={"grid-col-2"}>
                  <strong>Bidder Username</strong>
                </div>
                <div className={"grid-col-2"}>
                  <strong>Bidder Status</strong>
                </div>
              </>
            )
          ) : (
            <div>No Record Founds</div>
          )
        ) : (
          <div></div>
        )}
      </div>
      <div className={"grid-row grid-gap-2"}>
        {showBidder ? (
          <>
            <div className={"grid-col-2"}>{bidderName}</div>
            <div className={"grid-col-4"}>{bidderAddress}</div>
            <div className={"grid-col-2"}>{bidderRegistrationType}</div>
            <div className={"grid-col-2"}>
              <PPMSButton
                id={"contract-transaction"}
                type={"button"}
                variant={"link"}
                className={"usa-link"}
                label={bidderUsername}
                onPress={() =>
                  PageHelper.openPage(
                    Paths.viewBidder +
                    `/${bidderUsername}`
                  )
                }
              />
            </div>
            <div className={"grid-col-2"}>{bidderStatus}</div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBidder);
