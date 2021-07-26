import React from "react";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import placeholderImage from "../../../assets/images/placeholder-img.jpg";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCardHeader from "../../../ui-kit/components/common/card/PPMS-card-header";
import PPMSCardMedia from "../../../ui-kit/components/common/card/PPMS-card-media";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import moment from "moment";
import { CgRemove } from "react-icons/cg";
import { formatSaleNumber } from "../../../ui-kit/utilities/FormatUtil";
import { Paths } from "../../Router";
import { Link } from "react-router-dom";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { SaleMethod } from "../manage-auctions/manage-auction-access/Constants";
import { UserUtils } from "../../../utils/UserUtils";
import { PPMSTooltip } from "../../../ui-kit/components/common/PPMS-tooltip";
import PlaceBid from "../auction/components/components/PlaceBid";
import BuyNow from "../auction/components/components/BuyNow";
import { isEmptyCheck } from "../../../ui-kit/components/validations/FieldValidations";

interface FavoritesListTileProps {
  favorites: any;
  listPage?: boolean;
  handleBuyNow: any;
  handlePlaceBid: any;
  pbsFSCCodes: any;
  handlePlaceBidAlert?: any;
}

interface FavoritesListTileState {
  favorites: any;
  showModal: boolean;
  showBidModal: boolean;
  auctionId: any;
  showBidInfoAlert: boolean;
  placeBidPopOverTitle?: string;
  placeBidPopOverContent?: string;
}

export class FavoritesListTile extends React.Component<
  FavoritesListTileProps,
  FavoritesListTileState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      favorites: props.favorites,
      auctionId: !isEmptyCheck(props.favorites?.auctionDto.id)
        ? props?.favorites?.auctionDto?.id
        : props?.favorites?.auctionDto?.auctionId,
      showModal: false,
      showBidModal: false,
      showBidInfoAlert: false,
      placeBidPopOverTitle: "",
      placeBidPopOverContent: "",
    };
    this.buyNow = this.buyNow.bind(this);
    this.bidNow = this.bidNow.bind(this);
    this.handleBuyNow = this.handleBuyNow.bind(this);
    this.handlePlaceBid = this.handlePlaceBid.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeBidModal = this.closeBidModal.bind(this);
  }

  private salesAPIService: SalesApiService = new SalesApiService();

  getFavoritesField = (label: string) => {
    let value: string = "";
    switch (label) {
      case "Location":
        value =
          this.state.favorites?.address?.city +
          ", " +
          this.state.favorites?.address?.state;
        break;
      case "Start Date":
        value = moment(this.state.favorites?.salesStartDate).format(
          "MM/DD/YYYY"
        );
        break;
      case "Sale Method":
        value = this.state.favorites?.saleMethod;
        break;
      case "Case #":
        value = this.state.favorites?.caseNumber;
        break;
      case "IFB #":
        value = this.state.favorites?.ifbNumber;
        break;
    }
    return (
      <li>
        <span>
          <strong>{label} </strong>
        </span>{" "}
        {value}
      </li>
    );
  };

  handleRemoveFromFavorites = () => {
    this.salesAPIService
      .removeFromFavorite(this.state.favorites.lotId)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  buyNow() {
    this.setState({
      showModal: true,
    });
  }
  bidNow() {
    this.setState({
      showBidModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }
  handleBuyNow(auctionId) {
    this.props.handleBuyNow(auctionId);
    this.closeModal();
  }
  closeBidModal() {
    this.setState({
      showBidModal: false,
    });
  }
  handlePlaceBid(value, bidType, auctionId) {
    this.props.handlePlaceBid(value.replace(/[[$]/g, ""), bidType, auctionId);
    this.closeBidModal();
  }

  isCitizenShipTooltipShown = () => {
    return (
      (!this.isDefaulted() && !this.props?.favorites?.citizenshipRequired) ||
      (this.props?.favorites?.citizenshipRequired && UserUtils.isUsCitizen())
    );
  };

  isDefaulted = () => {
    return this?.props?.favorites?.bidderUserStatus === "DEFAULT";
  };

  render() {
    return (
      <>
        <PPMSCardGroup className={"ppms-card-group icn-card"}>
          <PPMSCard layout="flagDefault">
            <PPMSCardHeader className={`usa-header-slim`}>
              <h3>
                <Link
                  to={{
                    pathname: `${Paths.previewAuctions}/${this.state.auctionId}`,
                  }}
                >
                  {formatSaleNumber(this.state.favorites?.saleNumber)}-{" "}
                  {this.state.favorites?.lotNumber}
                </Link>
              </h3>

              <div className={"auction-lot-name"}>
                <div>{this.state.favorites?.lotName}</div>
              </div>
            </PPMSCardHeader>
            <PPMSCardMedia className={`usa-card-media-slim`}>
              <img
                src={
                  this.state.favorites.presignedUrl
                    ? this.state.favorites.presignedUrl
                    : placeholderImage
                }
                alt="A placeholder"
              />
            </PPMSCardMedia>
            <PPMSCardBody className={`usa-body-slim`}>
              <div className="grid-row tablet:grid-gap-3">
                <ul className={"usa-list usa-list-icn-card ui-shade"}>
                  {this.getFavoritesField(`Location`)}
                  {this.getFavoritesField(`Start Date`)}
                  {
                    <li className={"favs-buttons text-right"}>
                      {this.props?.favorites?.auctionDto?.status ===
                      "Active" ? (
                        this.props?.favorites?.auctionDto?.saleMethod ===
                        "buynow" ? (
                          <PPMSButton
                            id={"buy-now"}
                            label={"Buy Now"}
                            variant={"primary"}
                            onPress={() => {
                              this.buyNow();
                            }}
                          />
                        ) : [
                            SaleMethod.INTERNET,
                            SaleMethod.VAS,
                            SaleMethod.ONLINE_AUCTION,
                          ].includes(
                            this.props?.favorites?.auctionDto?.saleMethod
                          ) ? (
                          this.isCitizenShipTooltipShown() ? (
                            <div>
                              <PPMSButton
                                id={"bid-now"}
                                label={"Place Bid"}
                                variant={"primary"}
                                onPress={() => {
                                  this.bidNow();
                                }}
                                isDisabled={
                                  this.props?.favorites?.auctionDto
                                    ?.documentRequired &&
                                  !this.props?.favorites?.auctionDto
                                    ?.bidderAddedToAuction
                                }
                              />
                            </div>
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
                                <button
                                  className="usa-button tooltipdisabled"
                                  type="button"
                                >
                                  Place Bid
                                </button>
                              }
                            />
                          )
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}

                      <div className={"grid-col-auto"}>
                        <PPMSButton
                          id={"favourite"}
                          label={" Remove from Favorites"}
                          variant={"primary"}
                          icon={<CgRemove />}
                          onPress={this.handleRemoveFromFavorites}
                        />
                      </div>
                    </li>
                  }
                </ul>
                {(this.state.favorites?.sellingAgency === "DOI" ||
                  this.state.favorites?.sellingAgency === "PBS") && (
                  <ul className={"usa-list usa-list-icn-card ui-shade"}>
                    {this.getFavoritesField(`Sale Method`)}
                    {this.getFavoritesField(`Case #`)}
                    {this.getFavoritesField(`IFB #`)}
                  </ul>
                )}
              </div>
              <div className="grid-row tablet:grid-gap-3">
                {this.props?.favorites?.auctionDto?.documentRequired &&
                !this.props?.favorites?.auctionDto?.bidderAddedToAuction &&
                this.props?.favorites?.auctionDto?.sellingAgency === "SLS" ? (
                  <PPMSAlert
                    show
                    alertClassName={"alert-place-bid-info"}
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
          </PPMSCard>
        </PPMSCardGroup>
        <div>
          <BuyNow
            showBuyModal={this.state.showModal}
            handleBuyNow={() => this.handleBuyNow(this.state.auctionId)}
            updateBuyModal={(value) => {
              this.setState({ showModal: value });
            }}
          />
        </div>
        <div>
          <PlaceBid
            auctionDetails={this.props?.favorites?.auctionDto}
            handlePlaceBid={(value, bidType) =>
              this.handlePlaceBid(value, bidType, this.state.auctionId)
            }
            showModal={this.state.showBidModal}
            updateShowBidModal={(value) => {
              this.setState({ showBidModal: value });
            }}
          />
        </div>
      </>
    );
  }
}
