import React from "react";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardBody from "../../../../ui-kit/components/common/card/PPMS-card-body";
import { Tab, Tabs } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import BiddingDetails from "./components/BiddingDetails";
import AuctionDescriptionDetails from "./components/AuctionDescriptionDetails";
import BiddingHistory from "./components/BiddingHistory";
import PlaceBid from "./components/PlaceBid";
import BuyNow from "./components/BuyNow";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import moment from "moment";
import { PPMSPopover } from "../../../../ui-kit/components/common/PPMS-popover";
import { bidderDetails } from "./components/constant/AuctionConstants";
import { formatCurrency } from "../../../../ui-kit/utilities/FormatUtil";
import { PageHelper, Paths } from "../../../Router";
import { UserUtils } from "../../../../utils/UserUtils";
import { PPMSTooltip } from "../../../../ui-kit/components/common/PPMS-tooltip";
import { SaleMethod } from "../../manage-auctions/manage-auction-access/Constants";

interface AuctionItemInformationProps {
  match?: any;
  auctionData: any;
  addedToFavourite?: boolean;
  handleFavourite?: any;
  handleBuyNow?: any;
  handlePlaceBid?: any;
  auctionDetails?: any;
  auctionId?: number;
  pbsFSCCodes?: any;
  handlePlaceBidAlert?: any;
  isLoggedIn?: boolean;
  authentication?: any;
  isFleetAuction: boolean;
}
interface AuctionItemInformationState {
  showModal: boolean;
  showBidModal: boolean;
  showBidInfoAlert?: boolean;
  placeBidPopOverContent?: string;
  timeComponent?: any;
}

export default class AuctionItemInformation extends React.Component<
  AuctionItemInformationProps,
  AuctionItemInformationState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
      showBidModal: false,
      timeComponent: "",
    };
    this.buyNow = this.buyNow.bind(this);
    this.bidNow = this.bidNow.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleBuyNow = this.handleBuyNow.bind(this);
    this.handlePlaceBid = this.handlePlaceBid.bind(this);
    this.closeBidModal = this.closeBidModal.bind(this);
    this.formatTime = this.formatTime.bind(this);
  }
  auctionInterval;
  componentDidMount() {
    this.auctionInterval = setInterval(() => {
      this.setState({
        timeComponent: this.getTimeComponent(
          this.props?.auctionDetails?.status,
          this.props?.auctionDetails?.startDate,
          this.props?.auctionDetails?.endDate
        ),
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.auctionInterval);
  }

  toolTipComponent = (bidBtnInfoContent, btnLabel) => {
    return (
      <div>
        <PPMSButton
          className={"liveSealedButton"}
          id={"bid-now"}
          label={btnLabel}
          variant={"primary"}
          onPress={() => {}}
        />
        <PPMSPopover
          trigger={["click"]}
          id={bidBtnInfoContent.id + "InfoTip"}
          placement={"top"}
          popoverTitle={""}
          popoverContent={bidBtnInfoContent.infoTipContent}
          className={"usa-label form-label"}
          triggerSource={
            <button
              className="liveSealedBtn-wrapper usa-button  usa-button--unstyled"
              title="additional information"
            >
              <FaInfoCircle />
            </button>
          }
        />
      </div>
    );
  };

  getDescriptions() {
    let category: string[] = ["200", "310", "320", "210", "220"];
    let fsc: string[] = ["3610", "6525", "6625", "6720", "7730"];
    let fsg: string[] = ["58", "59", "70", "210", "220"];
    let conditionCode: string[] = ["X", "S"];
    let auctionData = this.props?.auctionData;
    let descriptionDTO = this.props?.auctionData?.auctionDescriptionDTO;
    let descriptions = [];
    if (descriptionDTO) {
      if (
        descriptionDTO?.fsc === "2331" &&
        (null === descriptionDTO?.make || "" === descriptionDTO?.make) &&
        (null === descriptionDTO?.model || "" === descriptionDTO?.model) &&
        (null === descriptionDTO?.odometer ||
          "" === descriptionDTO?.odometer ||
          0 === descriptionDTO?.odometer)
      ) {
        descriptions.push("FSC_2331_NO_MAKE_MODEL_FLAG");
      }

      if (
        descriptionDTO?.fsc === "2331" &&
        (descriptionDTO?.make ||
          descriptionDTO?.model ||
          descriptionDTO?.odometer)
      ) {
        descriptions.push("FSC_2331_WITH_MAKE_MODEL_FLAG");
      }
      if (descriptionDTO?.fsc === "2331" && "TT" === descriptionDTO?.bodyType) {
        descriptions.push("FSC_2331_WITH_BODY_TYPE_TRAILER_FLAG");
      }
      if (descriptionDTO?.fsc === "2331" && "MH" === descriptionDTO?.bodyType) {
        descriptions.push("FSC_2331_WITH_BODY_TYPE_MOBILE_HOME_FLAG");
      }
      if (descriptionDTO?.fsc === "2311") {
        descriptions.push("FSC_2311_FLAG");
      }
      if (
        descriptionDTO?.fsc === "2312" &&
        "S" === descriptionDTO?.conditionCode
      ) {
        descriptions.push("FSC_2312_AND_CONDITION_CODE_S_FLAG");
      }
      if (
        descriptionDTO?.fsc === "2312" &&
        "X" === descriptionDTO?.c8uonditionCode
      ) {
        descriptions.push("FSC_2312_AND_CONDITION_CODE_X_FLAG");
      }

      if (
        category?.includes(descriptionDTO?.category?.toString()) &&
        "FMU" != descriptionDTO.sellingAgency &&
        descriptionDTO?.fsc != "2331"
      ) {
        descriptions.push("NOT_FLEET_SALES_NOT_FSC_2331_FLAG");
      }
      if (
        category?.includes(descriptionDTO?.category?.toString()) &&
        "FMU" === descriptionDTO?.sellingAgency &&
        descriptionDTO?.fsc != "2331"
      ) {
        descriptions.push("FLEET_SALES_NOT_FSC_2331_FLAG");
      }
      if (
        ("DOI" === descriptionDTO?.sellingAgency ||
          "PBS" === descriptionDTO?.sellingAgency) &&
        (descriptionDTO?.salesMethod == "Live Auction" ||
          descriptionDTO?.salesMethod == "Sealed Bid")
      ) {
        descriptions.push("PDS_DOI_SALE_METHOD_NOTE_FLAG");
      }
      if (descriptionDTO?.bidDepositAmount) {
        descriptions.push("BID_DEPOSIT_REQUIRED_FLAG");
      }
      //Adding Item Descriptions
      if (descriptionDTO?.itemDescription != null) {
        descriptions.push("ITEM_DESCRIPTION_FLAG");
        //descriptions.push(descriptionDTO?.itemDescription?.toString());
      }
      if ("DOI" === descriptionDTO?.sellingAgency) {
        descriptions.push("DOI_ONLY_TERMS_AND_CONDITION_FLAG");
      }
      if (
        "DOI" === descriptionDTO?.sellingAgency ||
        "PBS" === descriptionDTO?.sellingAgency
      ) {
        descriptions.push("DOI_AND_PBS_FLAG");
      }
      if (
        (fsc.includes(descriptionDTO?.fsc) ||
          fsg.includes(descriptionDTO?.fsg)) &&
        conditionCode.includes(descriptionDTO?.conditionCode)
      ) {
        descriptions.push(
          "FSC_3610_6525_6625_6720_7730_FSG_58_59_70_CONDITION_X_S_FLAG"
        );
      }

      if ("999" === descriptionDTO?.category) {
        descriptions.push("CATEGORY_999_FLAG");
      }
      let inspectionInstructions = descriptionDTO?.inspectionInstructions
        ? descriptionDTO?.inspectionInstructions[0]?.toString()
        : "";

      if (inspectionInstructions?.startsWith("USMS")) {
        descriptions.push("USMS_LOGO");
      }
      if (
        inspectionInstructions?.startsWith("USMS") &&
        descriptionDTO?.aac === "1531F8"
      ) {
        descriptions.push("SPECIAL_INSTRUCTION_IS_USMS_AND_AAC_1531F8_FLAG");
      }

      // section 4
      if (descriptionDTO.sellingAgency === "SLS") {
        descriptions.push("PPMS_SALES_INSPECTION_STATEMENT");
      } else if (descriptionDTO.sellingAgency === "FMU") {
        descriptions.push("FLEET_SALES_INSPECION_STATEMENTS");
      }

      //section 5
      // sub div - 4.26
      // if fsc is 2300 and bodyType is either TRAILER or PARK MODEL then display same pdf

      if (
        descriptionDTO?.fsc === 2330 &&
        (descriptionDTO?.bodyType?.toUpperCase() === "TRAILER" ||
          descriptionDTO?.bodyType?.toUpperCase() === "PARK MODEL")
      ) {
        descriptions.push("TRAILER_PARKMODEL_NOTICE_2330");
      }

      // sub div - 4.28, sub div - 4.30
      //if fsc is 2300 and bodyType is either TRAILER or PARK MODEL or MOBILE HOME then display the following line in RED and also brochure
      // else if fsc not in 2300 or 2331 and bodyType is MOBILE HOME then display the other line
      if (
        descriptionDTO?.fsc === 2330 &&
        (descriptionDTO?.bodyType?.toUpperCase() === "TRAILER" ||
          descriptionDTO?.bodyType?.toUpperCase() === "PARK MODEL" ||
          descriptionDTO?.bodyType?.toUpperCase() === "MOBILE HOME")
      ) {
        descriptions.push("TRAILER_PARKMODEL_MOBILEHOME_NOTICE_2330");
      } else if (
        descriptionDTO?.bodyType?.toUpperCase() === "MOBILE HOME" &&
        !(descriptionDTO?.fsc === 2330 || descriptionDTO?.fsc === 2331)
      ) {
        descriptions.push("MOBILEHOME_NOT_2330_2331");
      }

      // sub div - 4.31 warnings
      // if usms = y then print warning
      if (descriptionDTO?.specialDescription?.startsWith("USMS")) {
        descriptions.push("USMS_WARNING");
      }

      // PBS Sale
      if (descriptionDTO?.sellingAgency === "PBS") {
        descriptions.push("PBS_STATIC_TEXT");
      }

      // NASA item list link
      if (this.props.auctionData?.lotAgencyBureau?.startsWith(80)) {
        descriptions.push("NASA_ITEM_LIST");
      }

      //Section 6 Inspection and Removal Information
      if (
        descriptionDTO?.sellingAgency !== "PBS" &&
        descriptionDTO?.sellingAgency !== "DOI"
      ) {
        descriptions.push("INSPECTION_AND_REMOVAL_INFORMATION_FLAG");
      }

      //Section 7 Inspection Customized messages
      if (
        (descriptionDTO?.fsc === "2330" || descriptionDTO?.fsc === "2331") &&
        ("TRAILER" === descriptionDTO?.bodyType ||
          "PARK MODEL" === descriptionDTO?.bodyType ||
          "MOBILE HOME" === descriptionDTO?.bodyType)
      ) {
        descriptions.push("INSPECTION_CUSTOMIZED_MESSAGES_FLAG");
      }
      //Section 8 Static Message
      descriptions.push("STATIC_MESSAGES_FLAG");

      if (
        descriptionDTO.documentRequired &&
        !this.props?.auctionDetails?.bidderAddedToAuction
      ) {
        descriptions.push("DOCUMENT_REQUIRED_FLAG");
      }
    }

    return descriptions;
  }
  buyNow() {
    if (this.props.isLoggedIn) {
      this.setState({
        showModal: true,
      });
    } else {
      PageHelper.openPage(Paths.login);
    }
  }
  bidNow() {
    if (this.props.isLoggedIn) {
      this.setState({
        showBidModal: true,
      });
    } else {
      PageHelper.openPage(Paths.login);
    }
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }
  handleBuyNow() {
    this.props.handleBuyNow();
    this.closeModal();
  }
  handlePlaceBidAlert() {
    this.props.handleBuyNow();
    this.closeModal();
  }
  closeBidModal() {
    this.setState({
      showBidModal: false,
    });
  }
  handlePlaceBid(value, bidType) {
    this.props.handlePlaceBid(value.replace(/[[$]/g, ""), bidType);
    this.closeBidModal();
  }

  isCitizenShipTooltipShown = () => {
    return (
      !this.props.isLoggedIn ||
      (this.props.isLoggedIn &&
        !this.isDefaulted() &&
        (!this.props?.auctionDetails?.citizenshipRequired ||
          (this.props?.auctionDetails?.citizenshipRequired &&
            UserUtils.isUsCitizen())))
    );
  };

  isDefaulted = () => {
    return this.props?.auctionDetails?.bidderUserStatus === "DEFAULT";
  };

  private formatTime(millis) {
    let cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000,
      d = Math.floor(millis / cd),
      h = Math.floor((millis - d * cd) / ch),
      m = Math.floor((millis - d * cd - h * ch) / 60000),
      s = Math.floor((millis % 60000) / 1000),
      pad = function (n) {
        return n < 10 ? "0" + n : n;
      };
    if (m === 60) {
      h++;
      m = 0;
    }
    if (h === 24) {
      d++;
      h = 0;
    }
    return (
      <>
        {d !== 0 && (
          <>
            <strong>{pad(d)}d</strong>{" "}
          </>
        )}
        {h !== 0 && (
          <>
            <strong>{pad(h)}h</strong>{" "}
          </>
        )}
        {m !== 0 && (
          <>
            <strong>{pad(m)}m</strong>{" "}
          </>
        )}
        <strong>{pad(s)}s</strong>
      </>
    );
  }
  private getTimeComponent = (status, startDate, endDate) => {
    let formattedStartDateTimeInCT = `${moment(
      moment(startDate, "YYYY-MM-DDTHH:mm")
    ).format("MM/DD/YYYY hh:mm A")} CT`;
    if (status === "Preview") {
      return (
        <>
          <div className="grid-col-3">
            <div>
              <strong>Starting Time</strong>
            </div>
            {formattedStartDateTimeInCT}
            <label className="time-component-red">*</label>
          </div>
          <div className="grid-col-3">
            <div>
              <strong>Time Remaining</strong>
            </div>
            <span className="time-component-red">Not Yet Started</span>
          </div>
        </>
      );
    } else if (status == "Active") {
      let formattedEndDateTimeInCT;
      let timeRemaining;
      if (endDate === null) {
        timeRemaining = "TBD";

        return (
          <ul className={"usa-list"}>
            <li>
              <span>Starting Time</span>
              {formattedStartDateTimeInCT}
              <label className="time-component-red">*</label>
            </li>
            <li>
              <span>Time Remaining</span>
              <span className="time-component-red">{timeRemaining}</span>
            </li>
          </ul>
        );
      } else {
        const currentDateTimeInCT = moment(new Date())
          .tz("America/Resolute")
          .format("YYYY-MM-DD HH:mm:ss");
        let timeDifference = moment(endDate).diff(currentDateTimeInCT);
        timeRemaining = this.formatTime(timeDifference);
        if (timeDifference < 0) {
          return;
        } else {
          formattedEndDateTimeInCT = (
            <>
              {`${moment(moment(endDate, "YYYY-MM-DDTHH:mm"))
                .format("MM/DD/YYYY hh:mm A")
                .toString()} CT`}
            </>
          );
          return (
            <>
              <div className="grid-col-3">
                <div>
                  <strong>Closing Time:</strong>
                </div>
                {formattedEndDateTimeInCT}
                <label className="time-component-red">*</label>
              </div>

              <div className="grid-col-3">
                <div>
                  <strong>Time Remaining:</strong>
                </div>
                <span className="time-component-red">{timeRemaining}</span>
              </div>
            </>
          );
        }
      }
    }
  };

  private getBidButtonComponent = (
    sellingAgency,
    status,
    saleMethod,
    canPlaceBid
  ) => {
    let bidButtonComponent;
    if (status === "Active") {
      if (saleMethod === "buynow" && canPlaceBid) {
        bidButtonComponent = (
          <PPMSButton
            id={"buy-now"}
            label={"Buy Now"}
            variant={"primary"}
            onPress={() => {
              this.buyNow();
            }}
          />
        );
      } else if (
        ([
          SaleMethod.INTERNET,
          SaleMethod.VAS,
          SaleMethod.ONLINE_AUCTION,
        ].includes(saleMethod) ||
          (this.props.isFleetAuction && saleMethod !== SaleMethod.SEALED_INFORMAL)) &&
        canPlaceBid
      ) {
        bidButtonComponent = this.isCitizenShipTooltipShown() ? (
          <PPMSButton
            id={"bid-now"}
            label={"Place Bid"}
            variant={"primary"}
            onPress={() => {
              this.bidNow();
            }}
            isDisabled={
              this.props?.auctionData?.auctionDescriptionDTO
                ?.documentRequired &&
              !this.props?.auctionDetails?.bidderAddedToAuction
            }
          />
        ) : (
          <PPMSTooltip
            trigger={"click"}
            id={"place-bid-button"}
            placement={"right"}
            tooltipContent={
              this.isDefaulted()
                ? "Your account has been placed into default for failure to Pay and /or Remove an item that was awarded to you.  In accordance with the Online Terms and Conditions that you accepted upon registration, all debts with the government from items sold through GSA must be cleared before bidders can be accepted to bid on this website"
                : "In order to participate, you must be a U.S.Citizen. Based on your registration status, you are not eligible to participate in this auction."
            }
            triggerSource={
              <button className="usa-button tooltipdisabled" type="button">
                Place Bid
              </button>
            }
          />
        );
      }
      if (saleMethod === "Live Auction" && sellingAgency === "PBS") {
        bidButtonComponent = this.toolTipComponent(
          bidderDetails.bidBtnInfo.liveAuctionBid,
          "Live Auction"
        );
      } else if (saleMethod === "Sealed Bid" && sellingAgency === "PBS") {
        bidButtonComponent = this.toolTipComponent(
          bidderDetails.bidBtnInfo.sealedBid,
          "Sealed Bid"
        );
      }
    }
    return bidButtonComponent;
  };
  render() {
    return (
      <div className="PPMSViewInfo text-adjustment">
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard className={"ppms-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaInfoCircle />}</i> Item
              Information
            </PPMSCardHeader>
            <PPMSCardBody className={"card-height"}>
              <div className="grid-row">
                <ul className={"usa-list ui-shade"}>
                  <li>
                    <span>
                      <b>Item Name : </b>{" "}
                    </span>
                    {this.props?.auctionData?.salesDescription}
                  </li>
                  <li>
                    <span>
                      <b> Sale Number :</b>
                    </span>
                    {this.props?.auctionData?.saleLotNumber}
                  </li>
                  <li>
                    <span>
                      <b>City, State :</b>
                    </span>
                    {this.props?.auctionData?.propertyLocation?.city
                      ? this.props?.auctionData?.propertyLocation?.city
                      : ""}
                    {this.props?.auctionData?.propertyLocation?.state
                      ? ", " + this.props?.auctionData?.propertyLocation?.state
                      : ""}
                  </li>
                </ul>
              </div>
              <div className={"grid-row grid-gap-4 auctionViewActions"}>
                <div className={"grid-col-12"}>
                  <>
                    <div className={"grid-row grid-gap-1"}>
                      <div className={"grid-col-auto"}>
                        {this.getBidButtonComponent(
                          this.props?.auctionDetails?.sellingAgency,
                          this.props?.auctionDetails?.status,
                          this.props?.auctionDetails?.saleMethod,
                          this.props?.auctionDetails?.canPlaceBid
                        )}
                      </div>

                      <div className={"grid-col-auto"}>
                        <PPMSButton
                          id={"favorite"}
                          label={
                            this.props.addedToFavourite
                              ? "Remove from Favorites"
                              : "Add to Favorite"
                          }
                          variant={"primary"}
                          onPress={this.props.handleFavourite}
                        />
                      </div>
                    </div>
                  </>
                </div>
                <div className={"grid-col-12"}>
                  <br></br>
                  <div className={"grid-row"}>
                    {this.state.timeComponent}

                    <div className="grid-col-3">
                      <div>
                        <strong>Current Bid:</strong>
                      </div>
                      {this.props?.auctionDetails?.currentBid
                        ? formatCurrency.format(
                            this.props.auctionDetails.currentBid
                          )
                        : formatCurrency.format(
                            this.props.auctionDetails.minBid
                          )}
                    </div>
                    <div className="grid-col-3">
                      <div>
                        <strong>Bidders:</strong>
                      </div>
                      {this.props?.auctionDetails?.numberOfBidders}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-row">
                {this.props?.auctionData?.auctionDescriptionDTO
                  ?.documentRequired &&
                !this.props?.auctionDetails?.bidderAddedToAuction &&
                this.props?.auctionData?.sellingAgency === "PPMS" ? (
                  <PPMSAlert
                    show
                    alertClassName={"alert-auction-place-bid-info"}
                    alertKey={"place-bid"}
                    alertVariant={"info"}
                    id={"place-bid"}
                    alertBody={
                      "To bid on this auction, you must first submit documentation to confirm bidder eligibility. " +
                      "Please refer to the item description page for the documentation requirements."
                    }
                  />
                ) : undefined}
              </div>
            </PPMSCardBody>
            <Tabs
              defaultActiveKey={"bidder-information-registration"}
              id="bidder-information-registration-tab"
              className="auction-details"
            >
              <Tab
                eventKey="bidder-information-registration"
                title="Description"
              >
                <div className="bidder-wrapper grid-container">
                  <AuctionDescriptionDetails
                    descriptions={this.getDescriptions()}
                    pocContact={this.props?.auctionData?.propertyPOC}
                    regionAddressDetails={
                      this.props?.auctionData?.regionAddressDetails
                    }
                    auctionDescriptionDTO={
                      this.props?.auctionData?.auctionDescriptionDTO
                    }
                    auctionDetails={this.props?.auctionDetails}
                    {...this.props}
                  />
                </div>
              </Tab>
              <Tab eventKey="bidding" title="Bidding Details" disabled={false}>
                <div className="bidder-wrapper  grid-container">
                  <BiddingDetails
                    biddingDetailsData={
                      this.props.auctionData.biddingDetailsData
                    }
                    auctionDetails={this.props?.auctionDetails}
                    isFleetAuction={this.props.isFleetAuction}
                  />
                </div>
              </Tab>
              <Tab
                eventKey="bidding-history"
                title="Bidding History"
                disabled={false}
              >
                <div className="bidder-wrapper  grid-container">
                  <BiddingHistory
                    auctionId={this?.props?.auctionId}
                    authentication={this.props.authentication}
                  />
                </div>
              </Tab>
            </Tabs>
          </PPMSCard>
        </PPMSCardGroup>
        <div>
          <BuyNow
            showBuyModal={this.state.showModal}
            handleBuyNow={this.handleBuyNow}
            updateBuyModal={(value) => {
              this.setState({ showModal: value });
            }}
          />
        </div>
        <div>
          <PlaceBid
            auctionDetails={this.props?.auctionDetails}
            handlePlaceBid={this.handlePlaceBid}
            showModal={this.state.showBidModal}
            updateShowBidModal={(value) => {
              this.setState({ showBidModal: value });
            }}
          />
        </div>
      </div>
    );
  }
}
