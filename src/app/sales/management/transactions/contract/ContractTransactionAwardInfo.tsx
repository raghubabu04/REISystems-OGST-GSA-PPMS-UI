import React, {
  Fragment,
  StrictMode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Breadcrumb from "../../common/Breadcrumb";
import SalesSideNav from "../../common/SideNav";
import { UserUtils } from "../../../../../utils/UserUtils";
import { saleActions } from "../../../../../_redux/_actions/sale.actions";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import * as queryString from "querystring";
import { PageHelper, Paths } from "../../../../Router";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import ReviveBidModal from "./bid-modals/ReviveBidModal";
import AwardBidModal from "./bid-modals/AwardBidModal";
import DefaultBidderModal from "./bid-modals/DefaultBidderModal";
import ModifyBid from "./bid-modals/ModifyBid";
import { formatCurrency } from "../../../../../ui-kit/utilities/FormatUtil";
import CancelBidModal from "./bid-modals/CancelBidModal";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import ContractNumberDetails from "./common/ContractNumberDetails";
import {
  AwardStatus,
  BidStatus,
} from "../../../../auctions/manage-auctions/manage-auction-access/Constants";
import { BidderStatus } from "../../../../auctions/manage-auctions/manage-auction-access/Constants";
import { PPMSPopover } from "../../../../../ui-kit/components/common/PPMS-popover";
import { BsFillFlagFill } from "react-icons/bs";
import { NON_INTERNATE_SALES_METHOD } from "../constants/Constants";
import SearchAndAddBidder from "./SearchAndAddBidder";
import { ContractTransactionContext } from "./ContractTransactionContext";
import { checkBidAmount } from "../../../../../ui-kit/components/validations/FieldValidations";
import SearchBidder from "../../../bids/SearchBidder";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { ContractStatus } from "../../../contracts/contract-refund/Constants";

interface ContractTransactionAwardInfo {
  location?: any;
  match;
  actions?: any;
  roles?: any;
  user?: any;
}

const ContractTransactionAwardInfo = (props: ContractTransactionAwardInfo) => {
  let auctionApiService = new AuctionsApiService();
  let saleApiService = new SalesApiService();
  const {
    contractTransactionState,
    updateContractTransactionState,
  } = useContext(ContractTransactionContext);
  const { location, match, roles, user } = props;
  const { addToast } = props.actions;
  const [topBidders, updateTopBidders] = useState([]);
  const [defaultZoneId, setDefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );
  const [showReviveModal, setShowReviveModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [auctionBidId, setAuctionBidId] = useState(null);
  const [bidderName, setBidderName] = useState("");
  const [bidAmount, setBidAmount] = useState(null);
  const [bidderId, setBidderId] = useState(null);
  const [alternateAwardAmount, setAlternateAwardAmount] = useState(null);
  const [reason, updateReason] = useState("");
  const [saleDetails, setSaleDetails] = useState(null);
  const [contractDetails, setContractDetails] = useState(null);
  const [awardStatus, setAwardStatus] = useState("");
  const [awardedBidderStatus, setAwardedBidderStatus] = useState("");
  const [reviveLoading, setReviveLoading] = useState(false);
  const [awardLoading, setAwardLoading] = useState(false);
  const [buttonsDisabled, updateButtonsDisabled] = useState(true);
  const [
    buyerDocumentationRequired,
    updatebuyerDocumentationRequired,
  ] = useState();
  const [canEdit, setCanEdit] = useState(false);

  let saleId = "";
  let contractId = "";
  let auctionId = "";
  let contractNumber = "";
  if (match?.params?.saleId) {
    saleId = match?.params?.saleId;
  }
  if (match?.params?.contractId) {
    contractId = match?.params?.contractId;
  }
  if (match?.params?.auctionId) {
    auctionId = match?.params?.auctionId;
  }
  let search = location.search;
  let query = queryString.parse(search);

  const getTopBidders = () => {
    auctionApiService
      .getTopBidders(auctionId)
      .then((response) => {
        let top3bidders = response.data;
        let awardedBidder = top3bidders.filter(
          (row) => row.awardStatus == "Awarded"
        );
        if (awardedBidder.length != 0) {
          setAwardStatus(awardedBidder[0].awardStatus);
          setAwardedBidderStatus(awardedBidder[0].bidderStatus);
        }
        updateTopBidders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function getSaleDetails() {
    saleApiService
      .getSaleDetails(saleId)
      .then((res) => {
        let details = res.data.salesNumberDetails;
        setSaleDetails(details);
        if (
          details.sco.email === user.emailAddress ||
          details?.alternateSCO?.email === user.emailAddress ||
          roles.isSG
        ) {
          updateButtonsDisabled(false);
        } else {
          updateButtonsDisabled(true);
        }
      })
      .catch((err) => {});
  }

  function getContractDetails() {
    saleApiService
      .getContractByContractId(contractId)
      .then((res) => {
        setContractDetails(res.data);
        let contractDTO = res.data.contractDTO;
        if (
          contractDTO?.useAlternateSco === true &&
          contractDTO?.contractAlternateScoContact?.email === user.emailAddress
        ) {
          setCanEdit(true);
          // contractDetails.other.actionDisabled = true;
        } else if (
          contractDTO?.useAlternateSco === false &&
          (contractDTO?.contractScoContact?.email === user.emailAddress ||
            contractDTO?.contractAlternateScoContact?.email ===
              user.emailAddress)
        ) {
          setCanEdit(true);
          // contractDetails.other.actionDisabled = false;
        }
      })
      .catch((err) => {});
  }

  function getBuyerDocumentationRequired() {
    auctionApiService.getAuction(auctionId).then((response) => {
      let auctionDTO = response.data;
      let buyerDocumentationRequired = auctionDTO.buyerDocumentationRequired;
      updatebuyerDocumentationRequired(buyerDocumentationRequired);
    });
  }

  useEffect(() => {
    getTopBidders();
    getSaleDetails();
    getContractDetails();
    getBuyerDocumentationRequired();
  }, []);

  const handleCloseReviveModal = () => {
    setShowReviveModal(false);
    setReviveLoading(false);
  };

  const handleCloseAwardModal = () => {
    setShowAwardModal(false);
    setAwardLoading(false);
  };

  const handleCloseModifyModal = () => {
    setShowModifyModal(false);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleSaveDefaultModal = () => {
    let data = [];
    data.push(contractDetails.contractDTO.contractId);
    saleApiService
      .defaultContractAndBidder(data, bidderId)
      .then((response) => {
        setShowDefaultModal(false);
        if (response.status === 200) {
          addToast({
            text: "Successfully Defaulted Contract",
            type: "success",
            heading: "Success",
          });

          PageHelper.openPage(
            Paths.contractSales +
              "/refund/" +
              contractDetails.contractDTO.contractNumber
          );
        } else {
          addToast({
            text: `Error defaulting the Bidder`,
            type: "error",
            heading: "Error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: `Error defaulting the Bidder`,
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleCloseDefaultModal = () => {
    setShowDefaultModal(false);
  };

  const handleSaveCancelModal = (bidId, reason) => {
    let data = {
      id: bidId,
      contractNumber: contractDetails.contractDTO.contractNumber,
      contractId: contractDetails.contractDTO.contractId,
      reasonForCancellation: reason,
    };
    auctionApiService
      .cancelBidAwardInformation(data)
      .then((response) => {
        addToast({
          text: `Successfully cancelled the bid`,
          type: "success",
          heading: "Success",
        });
        handleCloseCancelModal();
        getTopBidders();

        if (
          contractDetails.contractDTO.contractStatus === ContractStatus.PAID
        ) {
          PageHelper.openPage(
            Paths.contractSales +
              "/refund/" +
              contractDetails.contractDTO.contractNumber
          );
        }
      })
      .catch((error) => {
        addToast({
          text: "Error confirming request",
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleSaveReviveModal = (bidId) => {
    setReviveLoading(true);
    auctionApiService
      .reviveBid(bidId, contractId)
      .then(() => {
        addToast({
          text: `Successfully revived the bid`,
          type: "success",
          heading: "Success",
        });
        handleCloseReviveModal();
        getTopBidders();
        getContractDetails();
      })
      .catch(() => {
        addToast({
          text: "Error confirming request",
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleSaveAwardModal = (bidId) => {
    setAwardLoading(true);
    auctionApiService
      .awardBid(bidId, contractId)
      .then(() => {
        addToast({
          text: `Successfully awarded the bid`,
          type: "success",
          heading: "Success",
        });
        handleCloseAwardModal();
        getTopBidders();
      })
      .catch(() => {
        addToast({
          text: "Error confirming request",
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleSaveModifyModal = (data) => {
    auctionApiService
      .modifyBid(data, contractId)
      .then(() => {
        setShowDefaultModal(false);
        addToast({
          text: `Successfully modified the bid`,
          type: "success",
          heading: "Success",
        });
        if (contractDetails.contractDTO.contractStatus === "Paid") {
          PageHelper.openPage(
            Paths.contractSales +
              "/refund/" +
              contractDetails.contractDTO.contractNumber
          );
        }
      })
      .catch(() => {
        addToast({
          text: "Error confirming request",
          type: "error",
          heading: "Error",
        });
      })
      .finally(() => {
        handleCloseModifyModal();
      });
  };

  const getActionButton = (bidDetails) => {
    const {
      bidderName,
      bidderEmailAddress,
      bidAmount,
      alternateAwardAmount,
      reason,
      awardNotificationSent,
      id,
      bidderId,
      bidderStatus,
    } = bidDetails;
    const bidAwardStatus = bidDetails.awardStatus;
    const isAwarded = awardStatus == AwardStatus.AWARDED ? true : false;

    const getCancelButton = () => {
      return (
        <PPMSButton
          variant={"primary"}
          type={"button"}
          size={"sm"}
          value={"cancelAwardNotification"}
          label={"Cancel"}
          isDisabled={!canEdit}
          onPress={() => {
            setAuctionBidId(id);
            setBidAmount(bidAmount);
            setBidderName(bidderName);
            setShowCancelModal(true);
            setAwardStatus("Cancelled");
          }}
          id={"button-cancel"}
        />
      );
    };
    const getReviveBidButton = () => {
      let isDisabled =
        awardStatus == AwardStatus.AWARDED &&
        awardedBidderStatus != BidderStatus.DEFAULTED;
      return (
        <PPMSButton
          variant={"primary"}
          size={"sm"}
          type={"button"}
          value={"reviveBid"}
          label={"Revive Bid"}
          onPress={() => {
            setAuctionBidId(id);
            setShowReviveModal(true);
          }}
          isDisabled={!canEdit || isDisabled}
          id={"button-revive-bid"}
        />
      );
    };
    const getAwardButton = () => {
      let isDisabled =
        (bidAwardStatus != AwardStatus.PENDING_AWRAD &&
          bidAwardStatus != AwardStatus.PENDING_DOCUMENTATION) ||
        awardStatus == AwardStatus.AWARDED;
      return (
        <PPMSButton
          variant={"primary"}
          type={"button"}
          size={"sm"}
          value={"award"}
          label={"Award"}
          onPress={() => {
            setAuctionBidId(id);
            setShowAwardModal(true);
          }}
          isDisabled={!canEdit || isDisabled}
          id={"button-award"}
        />
      );
    };
    const getDefaultButton = () => {
      {
        return (
          <PPMSButton
            variant={"primary"}
            type={"button"}
            size={"sm"}
            value={"default"}
            label={"Default"}
            onPress={() => {
              setBidderId(bidderId);
              setShowDefaultModal(true);
            }}
            isDisabled={!canEdit || buttonsDisabled}
            id={"button-default"}
          />
        );
      }
    };
    const getModifyButton = () => {
      let isDisabled =
        awardStatus == AwardStatus.AWARDED &&
        bidAwardStatus != BidStatus.AWARDED;
      return (
        <PPMSButton
          variant={"primary"}
          type={"button"}
          size={"sm"}
          value={"modifyBid"}
          label={"Modify Bid"}
          onPress={() => {
            setAuctionBidId(id);
            setBidAmount(bidAmount);
            setBidderName(bidderName);
            setAlternateAwardAmount(alternateAwardAmount);
            updateReason(reason);
            setShowModifyModal(true);
          }}
          isDisabled={!canEdit || isDisabled}
          id={"button-modify-bid"}
        />
      );
    };
    const getButtonsForAwardedStatus = () => {
      return (
        <div>
          {getCancelButton()}
          {getModifyButton()}
          {getDefaultButton()}
        </div>
      );
    };
    const getButtonsForNonAwardedStatus = () => {
      return (
        <div>
          {getReviveBidButton()}
          {getModifyButton()}
          {getAwardButton()}
        </div>
      );
    };
    return (
      <div>
        {bidAwardStatus == BidStatus.AWARDED
          ? getButtonsForAwardedStatus()
          : getButtonsForNonAwardedStatus()}
      </div>
    );
  };
  function getBidDetails() {
    return topBidders.map((bidDetails, index) => {
      const {
        bidderName,
        bidderEmailAddress,
        bidAmount,
        alternateAwardAmount,
        reason,
        awardNotificationSent,
        awardStatus,
        id,
        bidderId,
        bidderStatus,
        bidderUserName,
      } = bidDetails;
      let iconStyles = {
        color: "#f05454",
        fontSize: "1.3em",
        cursor: "pointer",
      };
      return (
        <tr>
          <td>
            {bidderStatus === "DEFAULT" ? (
              <>
                <span className="redColor">{bidderName}</span>
                <PPMSPopover
                  trigger={["hover"]}
                  id={"icn-prop=type-description"}
                  placement={"right"}
                  popoverTitle={"Note"}
                  popoverContent={<>{"Defaulted"}</>}
                  triggerSource={
                    <button
                      id={`prop-type-tooltip-button`}
                      type={"button"}
                      className={"usa-button  usa-button--unstyled"}
                    >
                      <BsFillFlagFill style={iconStyles} />
                    </button>
                  }
                />
              </>
            ) : (
              bidderName
            )}
          </td>
          <td>
            <PPMSButton
              id={"contract-transaction"}
              type={"button"}
              variant={"link"}
              className={"usa-link"}
              label={bidderUserName}
              onPress={() =>
                PageHelper.openPage(Paths.viewBidder + `/${bidderUserName}`)
              }
            />
          </td>
          <td>{formatCurrency.format(bidAmount)}</td>
          <td>{formatCurrency.format(alternateAwardAmount)}</td>
          <td>{awardStatus}</td>
          <td>
            <Fragment>{getActionButton(bidDetails)}</Fragment>
            {/* {awardStatus === "Awarded" && (
              <PPMSButton
                variant={"primary"}
                type={"button"}
                size={"sm"}
                value={"default"}
                label={"Default"}
                onPress={() => {
                  setShowDefaultModal(true);
                }}
                isDisabled={!canEdit || buttonsDisabled}
                id={"button-default"}
              />
            )} */}
          </td>
        </tr>
      );
    });
  }

  const saveBidAmount = () => {
    const { addToast } = props.actions;
    let state = contractTransactionState;
    let auctionsAPIService = new AuctionsApiService();
    let data = {
      userId: state.bidder.userId,
      userName: state.bidder.userName,
      saleNumber: contractDetails.contractDTO.salesNumber,
      lotNumber: contractDetails.lotDTO.lotNumber,
      lotId: contractDetails.lotDTO.lotId,
      bidAmount: contractTransactionState.bidder.bidAmount,
      auctionId: auctionId,
    };

    if (checkBidAmount(contractTransactionState.bidder.bidAmount)) {
      auctionsAPIService
        .placeOffLineBid(data)
        .then((response) => {
          addToast({
            text: `Bidder Added Successfully.`,
            type: "success",
            heading: "Success",
          });
          getTopBidders();
          getContractDetails();
          state.bidder.bidderAdded = true;
          if (response?.data?.isUseAlternateSCO === "true") {
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          addToast({
            text: `` + error?.data?.message,
            type: "error",
            heading: "Error",
          });
        });
    }

    updateContractTransactionState(state);
  };

  return (
    <StrictMode>
      <div className={"award-information grid-row ui-ppms"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={defaultZoneId}
          saleId={saleId}
          lotId={"lotId"}
          contractId={contractId}
          contractNumber={contractDetails?.contractDTO?.contractNumber}
        />
        <div className="grid-row header-row mb-3">
          <h1>Award Information</h1>
        </div>
        <br />
        <br />
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={defaultZoneId}
                  currentPage={Paths.contractTransactionAwardInfo}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <ContractNumberDetails
            contractDetails={contractDetails}
            zoneId={query?.zoneId}
            salesMethod={saleDetails?.salesMethod}
          />
          {NON_INTERNATE_SALES_METHOD.includes(saleDetails?.salesMethod) && (
            /**/
            <PPMSAccordion
              items={[
                {
                  title: "Search Bidder",
                  content: (
                    <SearchAndAddBidder
                      saleId={saleId}
                      contractId={contractId}
                      auctionId={auctionId}
                      saveBidAmount={saveBidAmount}
                      searchDisable={!canEdit}
                    />
                  ),
                  expanded: true,
                  id: "searchBidder",
                  className: "searchBidder",
                },
              ]}
            />
          )}

          {topBidders?.length > 0 && (
            <BidderListToAward bidDetails={getBidDetails()} />
          )}
          <div className="desktop:grid-col-9">
            <PPMSButton
              id={"contract-transaction"}
              type={"button"}
              variant={"link"}
              className={"usa-link"}
              label={"< Back to Contract Transaction"}
              onPress={() =>
                PageHelper.openPage(
                  Paths.contractTransaction +
                    `/${saleId}/${contractId}?contractNumber=${contractDetails?.contractDTO?.contractNumber}`
                )
              }
            />
          </div>
        </div>
        <div>
          <ReviveBidModal
            showModal={showReviveModal}
            saveModal={handleSaveReviveModal}
            closeModal={handleCloseReviveModal}
            bidId={auctionBidId}
            loading={reviveLoading}
          />
        </div>
        <div>
          <AwardBidModal
            showModal={showAwardModal}
            saveModal={handleSaveAwardModal}
            closeModal={handleCloseAwardModal}
            bidId={auctionBidId}
            buyerDocumentationRequired={buyerDocumentationRequired}
            loading={awardLoading}
          />
        </div>
        <div>
          <ModifyBid
            showModal={showModifyModal}
            saveModal={handleSaveModifyModal}
            closeModal={handleCloseModifyModal}
            bidId={auctionBidId}
            bidderName={bidderName}
            bidAmount={bidAmount}
          />
        </div>
        <div>
          <CancelBidModal
            showModal={showCancelModal}
            handleSaveModal={handleSaveCancelModal}
            handleCloseModal={handleCloseCancelModal}
            bidId={auctionBidId}
            bidderName={bidderName}
            bidAmount={bidAmount}
          />
        </div>
        <div>
          <DefaultBidderModal
            showModal={showDefaultModal}
            handleSave={handleSaveDefaultModal}
            closeModal={handleCloseDefaultModal}
            bidId={auctionBidId}
            bidderId={bidderId}
          />
        </div>
      </div>
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
    updateSaleInfo: (
      saleId,
      saleNumber,
      saleAction,
      zone,
      contractNumber,
      contractId
    ) =>
      dispatch(
        saleActions.updateSaleInfo(
          saleId,
          saleNumber,
          saleAction,
          zone,
          contractNumber,
          contractId
        )
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractTransactionAwardInfo);

function BidderListToAward(props: { bidDetails: any[] }) {
  return useMemo(() => {
    return (
      <table className="usa-table">
        <thead>
          <tr>
            <th> Bidder Name</th>
            <th> Bidder User Name</th>
            <th> Bid Amount</th>
            <th> Alternate Award Amount</th>
            <th> Award Status</th>
            <th> Actions</th>
          </tr>
        </thead>
        <tbody>{props.bidDetails}</tbody>
      </table>
    );
  }, [props.bidDetails]);
}
