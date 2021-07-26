import React, { useEffect, useState } from "react";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { formatCurrencyWODecimal, formatSaleNumber, numPadding } from "../../../../../ui-kit/utilities/FormatUtil";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import PPMSLabel from "../../../../../ui-kit/components/common/form/PPMS-label";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import { STATIC_MESSAGES_CONFIRM } from "./constant/DescriptionConstants";
import { isEmptyCheck } from "../../../../property/want-list/validations/FieldValidations";
import { getUserInfo } from "../../../../../_redux/_helpers/auth-header";
import PPMSCheckbox from "../../../../../ui-kit/components/common/form/PPMS-checkbox";

interface PlaceBidProps {
  auctionDetails: any;
  handlePlaceBid: any;
  showModal: boolean;
  updateShowBidModal: any;
}

const PlaceBid = (props: PlaceBidProps) => {
  const {
    auctionDetails,
    handlePlaceBid,
    showModal,
    updateShowBidModal,
  } = props;
  const getBidTypeOptions = (type) => {
    return [
      {
        id: "flat-bid",
        value: "Flat Bid",
        isSelected: type === "Flat Bid",
        infoTip:
          "Place a bid greater than or equal to the current minimum bid. If your Flat Bid is less than another bidder's Automatic Bid, their bid will be displayed as the current winning bid.",
      },
      {
        id: "automatic-bid",
        value: "Automatic Bid",
        isSelected: type === "Automatic Bid",
        infoTip:
          "The computer will automatically bid the minimum bid increment for you up to your Automatic Bid amount. Your Automatic Bid amount is not shown to other bidders until it is reached through competitive bidding. You may change your Automatic Bid amount but not less than the next bid increment amount.",
      },
    ];
  };
  const [myBids, setMyBids] = useState(null);
  const [bidAmount, updateBidAmount] = useState(null);
  const [placedBid, setPlacedBid] = useState(false);
  const [bidTypeSelected, updateBidTypeSelected] = useState(null);
  const [bidInvalid, updateBidInvalid] = useState(false);
  const [bidInvalidMessage, updateBidInvalidMessage] = useState("");
  const [bidTypeOptions, updateBidTypeOptions] = useState(
    getBidTypeOptions(null)
  );
  const [category, updateCategory] = useState("-");
  const [bidderName, updateBidderName] = useState("");
  const [isTermsOfConditionAccepted, setIsTermsOfConditionAccepted] = useState(false);
  const [formattedSaleLotNumber, updateFormattedSaleLotNumber] = useState("");
  const [showTermsBody, setShowTermsBody] = useState(false);

  let auctionsAPIService = new AuctionsApiService();

  const closeBidModal = () => {
    updateShowBidModal(false);
    updateBidAmount(null);
    updateBidTypeOptions(getBidTypeOptions(null));
    updateBidTypeSelected(null);
    setPlacedBid(false);
    updateBidInvalid(false);
    updateBidInvalidMessage("");
  };
  const confirmBid = () => {
    handlePlaceBid(
      bidAmount?.toString()?.replace(/[[$,]/g, ""),
      bidTypeSelected
    );
    closeBidModal();
  };
  const placeBid = () => {
    setPlacedBid(true);
  };
  const commonAPIService = new CommonApiService();
  const getItemCategoryByCode = (categoryCode) => {
    if (categoryCode) {
      commonAPIService
        .getAuctionCategoryByCode(categoryCode)
        .then((response) => {
          updateCategory(response.data.categoryName);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return true;
  };

  const getMyBids = async () => {
    let auctionId = !isEmptyCheck(props.auctionDetails?.id)
      ? props.auctionDetails?.id
      : props.auctionDetails?.auctionId;
    console.log(auctionId);
    await auctionsAPIService
      .getMyBids(auctionId)
      .then((response) => {
        setMyBids(response?.data);
      })
      .catch((error) => {
        console.log("errors: ", error);
      });
  };

  const getBidderName = () => {
    let user = getUserInfo();
    let bidderName = user?.firstName + " " + user?.lastName;
    updateBidderName(bidderName);
  }

  const getShowTermsBody = () => {
    return auctionDetails?.citizenshipRequired? 
    (isEmptyCheck(myBids) ? true : false )
    : false
  }

  const getFormattedSaleLotNumber = () => {
    let formattedSaleNumber = formatSaleNumber(auctionDetails.salesNumber
                                              ? auctionDetails.salesNumber 
                                              : auctionDetails.saleNumber );
    let formattedLotNumber = numPadding(auctionDetails.lotNumber, 3);
    let formattedSaleLotNumber = formattedSaleNumber + "-" + formattedLotNumber;
    updateFormattedSaleLotNumber(formattedSaleLotNumber);
  }

  useEffect(() => {
    getItemCategoryByCode(auctionDetails?.categoryCode);
    getMyBids();
    getBidderName();
    getFormattedSaleLotNumber();
    if(!isEmptyCheck(myBids)) {
      setIsTermsOfConditionAccepted(true);
    }
  }, [auctionDetails?.sellingAgency]);
  const alertMessage = () => {
    return (
      <>
        <PPMSAlert
          show
          alertClassName={"alert-bid-info"}
          alertKey={"bid-info"}
          alertVariant={"info"}
          id={"bid-info"}
          alertBody={
            "Please ensure the accuracy of your email address, as we are providing winning bidders a Purchaser's Receipt via email upon submission of payment in full. Bids MUST be in whole numbers only. Do not include decimals or commas when entering your bid amount. (Example: Placing a bid for $1,000.00, should be typed as 1000 not 1,000.00)."
          }
        />
        {auctionDetails?.sellingAgency !== "PBS" && (
          <PPMSAlert
            show
            alertClassName={"alert-delay-warning"}
            alertKey={"delay-warning"}
            alertVariant={"warning"}
            id={"delay-warning"}
            alertBody={
              "WARNING: Due to browser delays and potential high volumes of bidding activity, it is not advised to wait until the final seconds to place bid. Your bid might not be placed in time and could be rejected."
            }
          />
        )}
        <br />
      </>
    );
  };
  const checkInvalid = (value, minBid, type) => {
    let checkValue = parseInt(value?.toString()?.replace(/[[$,]/g, ""));
    if (type === "Flat Bid" && checkValue < minBid) {
      updateBidInvalid(true);
      updateBidAmount("");
      updateBidInvalidMessage(
        "Your bid must be greater than or equal to the Minimum Bid."
      );
    } else if (type === "Flat Bid" && checkValue > 99000000) {
      updateBidInvalid(true);
      updateBidAmount("");
      updateBidInvalidMessage("Maximum bid amount reached for this sale.");
    } else if (
      type === "Flat Bid" &&
      myBids &&
      myBids[myBids.length - 1].proxyBid === checkValue
    ) {
      updateBidInvalid(true);
      updateBidAmount("");
      updateBidInvalidMessage(
        "You have already placed a bid with the same amount."
      );
    } else if (type === "Automatic Bid" && checkValue <= minBid) {
      updateBidInvalid(true);
      updateBidInvalidMessage(
        "Automatic Bid should be higher than Minimum Bid."
      );
    } else {
      updateBidInvalid(false);
      updateBidInvalidMessage("");
    }
  };
  const placeBidBody = () => {
    return (
      <>
        <div className={"grid-row"}>
          <div className={"grid-col"}>
            {auctionDetails?.canPlaceBid === false && (
              <>
                <PPMSAlert
                  show
                  alertClassName={"alert-bid-info"}
                  alertKey={"bid-info"}
                  alertVariant={"info"}
                  id={"bid-info"}
                  alertBody={`To bid on this auction, you must first submit a bid deposit of $${auctionDetails?.bidDeposit}. Please refer to the item description page for instructions on how to submit a bid deposit.`}
                />
              </>
            )}
            {auctionDetails?.canPlaceBid === true && (
              <>
                {alertMessage()}
                <div className={"usa-summary-box"}>
                  <div className={"usa-summary-box__body"}>
                    <h2 className={"usa-summary-box__heading lot-review-h2"}>
                      Auction Details
                    </h2>
                    <div className={"grid-row grid-gap-4"}>
                      <div className={"grid-col-auto"}>
                        <PPMSLabel htmlFor={"minimum-bid"}>
                          <strong>Minimum Bid</strong>
                        </PPMSLabel>
                        <p id={"minimum-bid"}>
                          {formatCurrencyWODecimal.format(
                            auctionDetails?.minBid
                          )}
                        </p>
                      </div>
                      <div className={"grid-col-auto"}>
                        <PPMSLabel htmlFor={"bid-increment"}>
                          <strong>Bid Increment</strong>
                        </PPMSLabel>
                        <p id={"bid-increment"}>
                          {formatCurrencyWODecimal.format(
                            auctionDetails?.bidIncrement
                          )}
                        </p>
                      </div>
                      <div className={"grid-col-auto"}>
                        <PPMSLabel htmlFor={"city-state-territory"}>
                          <strong>City, State or Territory</strong>
                        </PPMSLabel>
                        <p id={"city-state-territory"}>
                          {`${auctionDetails?.location?.city}, ${auctionDetails?.location?.state} ${auctionDetails?.location?.zipCode}`}
                        </p>
                      </div>
                      <div className={"grid-col-auto"}>
                        <PPMSLabel htmlFor={"product-type"}>
                          <strong>Product Type</strong>
                        </PPMSLabel>
                        <p id={"product-type"}>{category}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {auctionDetails?.sellingAgency === "PBS" && (
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col"}>
                      <PPMSToggleRadio
                        isDisabled={false}
                        id={"bid-type"}
                        name={"bid-type"}
                        options={bidTypeOptions}
                        validationMessage={""}
                        onChange={(value) => {
                          let selected = value.find(
                            (value) => value.isSelected === true
                          );
                          updateBidTypeSelected(selected.value);
                          updateBidTypeOptions(
                            getBidTypeOptions(selected.value)
                          );
                          checkInvalid(
                            bidAmount,
                            auctionDetails.minBid,
                            selected.value
                          );
                        }}
                        isInline={true}
                      />
                    </div>
                  </div>
                )}
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col-4"}>
                    <PPMSInput
                      id={"max-bid"}
                      label={`${auctionDetails?.sellingAgency === "PBS"
                          ? "Bid Amount"
                          : "Maximum Bid"
                        }`}
                      labelBold={true}
                      inputType={"text"}
                      isDisabled={
                        auctionDetails?.sellingAgency === "PBS" &&
                        !bidTypeSelected
                      }
                      isRequired={true}
                      value={bidAmount}
                      maxLength={8}
                      onChange={(event) => {
                        updateBidAmount(event.target.value?.replace(/\D/g, ""));
                      }}
                      onBlur={(event) => {
                        updateBidAmount(
                          event.target.value
                            ? formatCurrencyWODecimal.format(
                              event.target.value
                                ?.toString()
                                ?.replace(/[[$,]/g, "")
                            )
                            : null
                        );
                        checkInvalid(
                          event.target.value,
                          auctionDetails?.minBid,
                          bidTypeSelected ? bidTypeSelected : "Flat Bid"
                        );
                      }}
                      isInvalid={bidInvalid}
                      validationMessage={bidInvalidMessage}
                    />
                  </div>
                </div>
                {getShowTermsBody() ? (
                  <div>
                    {termsOfConditionBody()}
                    <PPMSCheckbox
                      id={`termsOfCondition`}
                      name={"termsOfCondition"}
                      label={<b>I accept the terms of this Export Controlled Certification.</b>}
                      isInvalid={false}
                      checked={isTermsOfConditionAccepted}
                      onChange={() => {
                        setIsTermsOfConditionAccepted(!isTermsOfConditionAccepted);
                      }}
                    />
                  </div>
                ) : ""}
              </>
            )}
          </div>
        </div>
      </>
    );
  };
  const confirmBidBody = () => {
    return (
      <>
        {alertMessage()}
        <div className={"ui-ppms"}>
          {bidTypeSelected && (
            <div className={"grid-row grid-gap-2"}>
              <div className={"grid-col-3"}>
                <strong>Bid Type :</strong>
              </div>
              <div className={"grid-col-3"}>{bidTypeSelected}</div>
            </div>
          )}
          <br />
          <div className={"grid-row grid-gap-2"}>
            <div className={"grid-col-3"}>
              <strong>Your Bid Amount :</strong>
            </div>
            <div className={"grid-col-3"}>{bidAmount ? bidAmount : "$0"}</div>
          </div>
          <div className={"grid-row grid-gap-2"}>
            <div className={"grid-col-12"}>{STATIC_MESSAGES_CONFIRM}</div>
          </div>
        </div>
      </>
    );
  };

  const termsOfConditionBody = () => {
    return (
      <>
        <p className="terms-and-conditions-title">U. S. EXPORT CONTROLLED CERTIFICATION</p>
        <p className="terms-and-conditions-body">
          I, {bidderName}, certify that I am aware that Sale {formattedSaleLotNumber} has US Export controlled Certification. The use, disposition, export and re-export of this property is subject to all applicable United States Laws and Regulations. These include the Arms Export Control Act of 1976, as amended (22 USC 2751, et seq.), the International Traffic in Arms Regulations (22 CFR Parts 120-130), and the Export Administration Regulations (15 CFR Parts 730-774), which among other things prohibit:
        </p>
        <ul>
          <li className="condition-list">
            a.	The making of false statements and concealment of any material information regarding the use, disposition, export or re-export of the property, and
          </li>
          <li className="condition-list">
            b.	 Any use, disposition, export or re-export of the property not authorized in accordance with their provisions.
          </li>
        </ul>
        <p className="terms-and-conditions-body">Criminal penalties for violation of these prohibitions may include significant fines and/or imprisonment.</p>
        <p className="terms-and-conditions-body">As purchaser I certify the following:</p>
        <ul>
          <li className="condition-list">a.	 I have read and understand the foregoing, and agree to comply with the restrictions outlined in the above references,</li>
          <li className="condition-list">b.   None of the items identified in the Invitation for Bids or contract as being subject to this certification will be directly or indirectly used or disposed of for military purposes, and</li>
          <li className="condition-list">c.	 I am a U.S. citizen.</li>
        </ul>
      </>
    );
  };

  return (
    <>
      <PPMSModal
        id={"place-bid-modal"}
        body={placedBid ? confirmBidBody() : placeBidBody()}
        size={"lg"}
        show={showModal}
        title={placedBid ? "Confirm Bid" : "Place Bid"}
        handleClose={closeBidModal}
        handleSave={placedBid ? confirmBid : placeBid}
        disableSave={
          auctionDetails?.sellingAgency === "PBS"
            ? !bidTypeSelected ||
            !bidAmount ||
            bidInvalid ||
            parseInt(bidAmount?.toString()?.replace(/\D/g, "")) <= 0 ||
            (parseInt(bidAmount?.toString()?.replace(/\D/g, "")) <
              auctionDetails.minBid &&
              bidTypeSelected === "Flat Bid") ||
            (parseInt(bidAmount?.toString()?.replace(/\D/g, "")) <=
              auctionDetails.minBid &&
              bidTypeSelected === "Automatic Bid")
            : auctionDetails?.citizenshipRequired
              ? (!bidAmount || (isEmptyCheck(myBids)? !isTermsOfConditionAccepted : false))
              : !bidAmount ||
              parseInt(bidAmount?.toString()?.replace(/\D/g, "")) <= 0
        }
        customLabel={placedBid ? "Confirm Bid" : "Place Bid"}
        isToolTipEnabledBtnDisabled={auctionDetails?.citizenshipRequired ? (isEmptyCheck(myBids)? !isTermsOfConditionAccepted : false) : false}
        toolTipContent={"Please accept Export Control Certification to proceed."}
      />
    </>
  );
};

export default PlaceBid;
