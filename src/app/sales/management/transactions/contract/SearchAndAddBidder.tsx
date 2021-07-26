import React, { StrictMode, useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ContractTransactionContext } from "./ContractTransactionContext";
import { UserApiService } from "../../../../../api-kit/user/user-api.service";
import {
  checkBidAmount,
  checkEmail,
} from "../../../../../ui-kit/components/validations/FieldValidations";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PageHelper, Paths } from "../../../../Router";

export interface SearchAndAddBidderProps {
  user?: any;
  userAccess?: string[];
  roles?: any;
  loggedIn?: boolean;
  permissions?: any[];
  aacs?: any[];
  authentication?: any;
  actions?: any;
  contractId?: any;
  saleId?;
  any;
  auctionId?: any;
  saveBidAmount?: any;
  searchDisable?: boolean;
}

const SearchAndAddBidder = (props: SearchAndAddBidderProps) => {
  const {
    user,
    contractId,
    saleId,
    auctionId,
    saveBidAmount,
    searchDisable,
  } = props;
  const {
    contractTransactionState,
    updateContractTransactionState,
  } = useContext(ContractTransactionContext);

  const [emailValidation, setEmailValidation] = useState({
    isInvalid: false,
    validationError: "",
  });

  const [bidAmountValidation, setBidAmountValidation] = useState({
    isInvalid: false,
    validationError: "",
  });

  const [bidderStatusValidation, setBidderStatusValidation] = useState({
    isInvalid: false,
    validationError: "",
  });
  const [emailId, setEmailId] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [bidderUsername, setBidderUsername] = useState("");
  const [bidderStatus, setBidderStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [showBidder, setShowBidder] = useState(false);
  const [contractDetails, setContractDetails] = useState(null);
  const [showBidderUserIds, setShowBidderUserIds] = useState(false);
  const [bidderUserIds, setBidderUserIds] = useState(false);
  let userService = new UserApiService();
  let saleApiService = new SalesApiService();
  const handleEmailChange = (event) => {
    setEmailId(event.target.value);
    let state = contractTransactionState;
    state.bidder.userId = 0;
    state.bidder.userName = "";
    updateContractTransactionState(state);
    if (checkEmail(event.target.value)) {
      setEmailValidation({ isInvalid: false, validationError: "" });
    } else {
      setEmailValidation({
        isInvalid: true,
        validationError: "Email is Invalid",
      });
      setShowBidder(false);
      setShowBidderUserIds(false);
    }
  };
  function getContractDetails() {
    saleApiService
      .getContractByContractId(contractId)
      .then((res) => {
        setContractDetails(res.data);
      })
      .catch((err) => {});
  }

  const searchEmail = () => {
    const { addToast } = props.actions;
    getContractDetails();
    if (!emailValidation?.isInvalid) {
      userService
        .getBidderUserIdsByEmailId(emailId)
        .then((response) => {
          setShowBidderUserIds(true);
          setBidderUserIds(response.data);
          if (response?.data?.length > 1) {
            let userIdOptions = response.data.map((userId) => {
              return {
                value: userId,
                id: userId,
                isSelected: false,
              };
            });
            updateContractTransactionState({
              bidderUserIdsOptions: userIdOptions,
            });
          } else if (response?.data?.length == 1) {
            setShowBidderUserIds(false);
            contractTransactionState.selectedUserId = response.data?.[0];
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
    contractTransactionState.bidder.bidAmount = "";
    contractTransactionState.bidder.bidderAdded = false;
    updateContractTransactionState(contractTransactionState);
  };
  const handleUserIdChange = () => {
    const { addToast } = props.actions;
    getContractDetails();
    if (null != contractTransactionState.selectedUserId) {
      userService
        .getBidderUserByUserId(contractTransactionState.selectedUserId)
        .then((response) => {
          setShowBidder(true);
          let bidderDetails = response?.data ? response?.data : null;
          setBidderName(
            `${
              bidderDetails?.bidderFirstName
                ? bidderDetails.bidderFirstName
                : null
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
          setBidderStatus(
            bidderDetails?.status ? bidderDetails?.status?.status : null
          );
          let state = contractTransactionState;
          state.bidder.userId = bidderDetails.bidderId
            ? bidderDetails.bidderId
            : "";
          state.bidder.userName = bidderDetails.userName
            ? bidderDetails.userName
            : "";

          if (checkBidderStatus(bidderDetails?.status?.status)) {
            setBidderStatusValidation({
              isInvalid: false,
              validationError: "",
            });
          } else {
            setBidderStatusValidation({
              isInvalid: true,
              validationError: "Bidder can not be added",
            });
            addToast({
              text: "Bidder can not be added",
              type: "error",
              heading: "Error",
            });
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
    contractTransactionState.bidder.bidAmount = "";
    contractTransactionState.bidder.bidderAdded = false;
    updateContractTransactionState(contractTransactionState);
  };
  function handleBidAmountChange(event) {
    const bidAmount = event.target.value;
    const contractState = contractTransactionState;
    contractState.bidder.bidAmount = bidAmount;
    updateContractTransactionState({
      contractState,
    });
    if (checkBidAmount(event.target.value)) {
      setBidAmountValidation({ isInvalid: false, validationError: "" });
    } else {
      setBidAmountValidation({
        isInvalid: true,
        validationError: "Bid must be between 0 and 99999999.00",
      });
    }
  }
  const cancelBidAmount = () => {
    let state = contractTransactionState;
    state.bidder.bidAmount = "";
    setEmailId("");
    setEmailValidation({ isInvalid: false, validationError: "" });
    setBidAmountValidation({ isInvalid: false, validationError: "" });
    setBidderName("");
    setBidderUsername("");
    setBidderStatus("");
    setShowBidder(false);
    setShowBidderUserIds(false);
    updateContractTransactionState(state);
  };
  useEffect(() => {
    setEmailId("");
    setBidderName("");
    setBidderUsername("");
    setRegistrationType("");
    setUserId("");
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
        bidderUsername={bidderUsername}
        bidderStatus={bidderStatus}
        contractTransactionState={contractTransactionState}
        handleBidAmountChange={handleBidAmountChange}
        saveBidAmount={saveBidAmount}
        cancelBidAmount={cancelBidAmount}
        bidAmountValidation={bidAmountValidation}
        showBidderUserIds={showBidderUserIds}
        bidderUserIds={bidderUserIds}
        handleUserIdChange={handleUserIdChange}
        updateContractTransactionState={updateContractTransactionState}
        bidderStatusValidation={bidderStatusValidation}
        searchDisabled={searchDisable}
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
  bidderUsername,
  bidderStatus,
  contractTransactionState,
  updateContractTransactionState,
  handleBidAmountChange,
  saveBidAmount,
  cancelBidAmount,
  bidAmountValidation,
  showBidderUserIds,
  bidderUserIds,
  handleUserIdChange,
  bidderStatusValidation,
  searchDisabled,
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
            isDisabled={searchDisabled}
          />
        </div>
      </div>
      <br />
      <div className={"grid-row grid-gap-2 award-information-content_margin"}>
        {showBidderUserIds && (
          <PPMSToggleRadio
            id={"userId"}
            options={contractTransactionState.bidderUserIdsOptions}
            isInline={true}
            isDisabled={false}
            name={"userId"}
            className={"user-id grid-col-4"}
            isLabelNotRequired={false}
            isSingleSelect={true}
            onChange={(value) => {
              let state = contractTransactionState;
              let selectedUserId = value
                .filter((item) => item.isSelected === true)
                .map((item) => {
                  return item.value;
                });
              state.selectedUserId = selectedUserId;
              updateContractTransactionState(state);
              handleUserIdChange();
            }}
            isRequired={false}
            isInvalid={false}
            validationMessage={""}
            formClass={"grid-row-12"}
            inLineWithOutRightMargin={true}
          />
        )}
      </div>
      <div className={"grid-row grid-gap-2"}>
        {showBidder ? (
          bidderName ? (
            <>
              <div className={"grid-col-4"}>
                <strong>Bidder Name</strong>
              </div>
              <div className={"grid-col-4"}>
                <strong>Bidder User Name</strong>
              </div>
              <div className={"grid-col-4"}>
                <strong>Bidder Status</strong>
              </div>
            </>
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
            <div className={"grid-col-4"}>{bidderName}</div>
            <div className={"grid-col-4"}>
              <PPMSButton
                id={"contract-transaction"}
                type={"button"}
                variant={"link"}
                className={"usa-link"}
                label={bidderUsername}
                onPress={() =>
                  PageHelper.openPage(Paths.viewBidder + `/${bidderUsername}`)
                }
              />
            </div>
            <div className={"grid-col-4"}>{bidderStatus}</div>
          </>
        ) : (
          <></>
        )}
      </div>
      {showBidder && (
        <>
          <div
            className={"grid-row grid-gap-2 award-information-content_margin"}
          >
            <div className={"grid-col-4"}>
              <PPMSInput
                id={`bid-amount`}
                inputType={"text"}
                isDisabled={bidderStatusValidation.isInvalid}
                label={"Bid Amount"}
                isRequired={true}
                maxLength={11}
                value={contractTransactionState.bidder?.bidAmount}
                onChange={handleBidAmountChange}
                isInvalid={bidAmountValidation.isInvalid}
                validationMessage={bidAmountValidation.validationError}
              />
            </div>
          </div>
          <div className={"grid-row grid-gap-2"}>
            <div className={"grid-col-4 award-information-content_margin"}>
              <PPMSButton
                id={"asve-add-bidder-amount"}
                type={"button"}
                variant={"primary"}
                label={"Save"}
                onPress={saveBidAmount}
                className={""}
                isDisabled={
                  contractTransactionState.bidder.bidderAdded ||
                  bidderStatusValidation.isInvalid
                }
              />
              <PPMSButton
                id={"cancel-bid-amount"}
                type={"button"}
                variant={"primary"}
                label={"Cancel"}
                onPress={cancelBidAmount}
                className={""}
              />
            </div>
          </div>
        </>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchAndAddBidder);
export const checkBidderStatus = (bidderStatus): boolean => {
  let allowedStatus = ["APPROVED"];
  let valid = false;
  if (allowedStatus.includes(bidderStatus.toUpperCase())) {
    valid = true;
  }
  return valid;
};
