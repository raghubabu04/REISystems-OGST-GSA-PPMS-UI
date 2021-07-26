/**@jsx jsx */
import React from "react";
import PPMSViewPOC from "../../property/view-property/PropertyViewPOC";
import PPMSViewCustodian from "../../property/view-property/PropertyViewCustodian";
import PPDMSFileView from "../../property/view-property/PPDMSFileView";
import {jsx} from "@emotion/core";
import {PPMSImageSlider} from "../../../ui-kit/components/image-carousel/PPMS-image-slider";
import {FaExclamationTriangle} from "react-icons/fa";
import AuctionItemInformation from "./components/AuctionItemInformation";
import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import {PageHelper, Paths} from "../../Router";
import {UserUtils} from "../../../utils/UserUtils";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import PPMSMapView from "../../../ui-kit/components/map/PPMSMapView";
import PPMSVideoView from "../../property/view-property/PPMSVideoView";
import {AuctionsApiService} from "../../../api-kit/auctions/auctions-api-service";
import PaymentInquiries from "../../property/view-property/PaymentInquiriesView";
import moment from "moment";
import {commonActions} from "../../../_redux/_actions/common.actions";

interface AuctionItemProps {
  auction: any;
  match?: any;
  roles?: any;
  actions?: any;
  pbsFSCCodes?: any;
  authentication?: any;
  holiday?: any;
  getHolidays: (year) => any;
}

interface AuctionItemState {
  imageFileList: any;
  auctionLoadReady: boolean;
  docsFilesList: any;
  auctionData: {
    saleLotNumber: any;
    salesDescription: any;
    propertyCustodian: any;
    propertyPOC: any;
    propertyLocation: any;
    biddingDetailsData: any;
    auctionDescriptionDTO: any;
    regionAddressDetails: any;
    lotAgencyBureau: any;
    sellingAgency: any;
    salesRegionDetail: any;
  };
  propertyUrls: any;
  imageList: any;
  imageNameList: any;
  renderChildren: boolean;
  userPermitted: boolean;
  addedToFavourite?: boolean;
  auctionDetails?: any;
  isFleetAuction: boolean;
  myBids: any;
}

class AuctionItem extends React.Component<AuctionItemProps, AuctionItemState> {
  constructor(props: any) {
    super(props);
    this.state = {
      imageFileList: [],
      auctionLoadReady: false,
      docsFilesList: [],
      auctionData: {
        saleLotNumber: "",
        salesDescription: "",
        propertyCustodian: "",
        propertyPOC: "",
        propertyLocation: "",
        biddingDetailsData: {},
        auctionDescriptionDTO: "",
        regionAddressDetails: "",
        lotAgencyBureau: "",
        sellingAgency: "",
        salesRegionDetail: "",
      },
      propertyUrls: [],
      imageList: [],
      imageNameList: [],
      renderChildren: false,
      userPermitted: false,
      addedToFavourite: false,
      auctionDetails: {},
      isFleetAuction: false,
      myBids: [],
    };
    this.handleBuyNow = this.handleBuyNow.bind(this);
    this.handlePlaceBid = this.handlePlaceBid.bind(this);
    this.loadDefaults = this.loadDefaults.bind(this);
  }

  private salesAPIService: SalesApiService = new SalesApiService();
  private auctionsAPIService: AuctionsApiService = new AuctionsApiService();

  handleFavourite = (event) => {
    let userInfo = UserUtils.getUserInfo();
    const { addToast } = this.props.actions;
    if (!(userInfo && userInfo.bidderUser)) {
      PageHelper.openPage(Paths.auctionLogin);
    } else if (this.state.addedToFavourite) {
      this.salesAPIService
        .removeFromFavorite(this.state.auctionDetails.lotId)
        .then(() => {
          addToast({
            text: `Removed from favorite`,
            type: "success",
            heading: "Success",
          });
          this.setState({
            addedToFavourite: false,
          });
        })
        .catch((error) => {
          console.log(error);
          addToast({
            text: `Error Removing from favorite`,
            type: "error",
            heading: "Error",
          });
        });
    } else {
      this.salesAPIService
        .addToFavourites(this.state.auctionDetails.lotId)
        .then((response) => {
          addToast({
            text: `Added to favorite`,
            type: "success",
            heading: "Success",
          });
          this.setState({
            addedToFavourite: true,
          });
        })
        .catch((error) => {
          console.log(error);
          addToast({
            text: `Error Adding to favorite`,
            type: "error",
            heading: "Error",
          });
        });
    }
  };
  loadDefaults(auctionId) {
    this.auctionsAPIService
      .getAuction(auctionId)
      .then((responseAuction) => {
        if (responseAuction?.data?.sellingAgency === "FLEET") {
          this.setState({
            isFleetAuction: true,
          });
        }
        this.setState({
          auctionDetails: responseAuction?.data,
          auctionLoadReady: true,
        });
        this.auctionsAPIService
          .getMyBids(auctionId)
          .then((response) => {
            this.setState({myBids: response?.data});
          })
          .catch((error) => {
            console.log("errors: ", error);
          });
        this.salesAPIService
          .getAuctionItem(responseAuction?.data?.lotId)
          .then((response: any) => {
            if (response?.data !== null) {
              if (
                response.data.imagesAndDocs &&
                response.data.imagesAndDocs.image
              ) {
                let imageNameList = [];
                let imageList = [];

                let images = response.data.imagesAndDocs.image.sort((a, b) =>
                  a.attachmentOrder > b.attachmentOrder ? 1 : -1
                );
                images.forEach((o) => {
                  imageNameList.push(o.name);
                  imageList.push(o.preSignedURI);
                });
                let lotPropertyUrls = response.data.lotPropertyUrls?.sort(
                  (a, b) => (a.sequenceNo > b.sequenceNo ? 1 : -1)
                );

                let propertyUrls: string[] = [];
                lotPropertyUrls?.forEach((o) => {
                  propertyUrls.push(o.url);
                });
                this.setState({
                  imageFileList: response.data.imagesAndDocs.image,
                  imageNameList: imageNameList,
                  imageList: imageList,
                  propertyUrls: propertyUrls,
                  renderChildren: true,
                });
              }
              if (
                response.data.imagesAndDocs &&
                response.data.imagesAndDocs.documents
              ) {
                this.setState({
                  docsFilesList: response.data.imagesAndDocs.documents,
                });
              }
              this.setState(
                {
                  auctionData: {
                    saleLotNumber: response.data.saleLotNumber,
                    salesDescription: response.data.salesDescription,
                    propertyCustodian: response.data.custodianContact,
                    propertyPOC: response.data.pointOfContact,
                    propertyLocation: response.data.propertyLocation,
                    biddingDetailsData: response.data.biddingDetailsDTO,
                    auctionDescriptionDTO: response.data.auctionDescriptionDTO,
                    regionAddressDetails: response.data.regionAddressDetails,
                    lotAgencyBureau: response.data.lotAgencyBureau,
                    sellingAgency: response.data.sellingAgency,
                    salesRegionDetail: response.data.salesRegionDetail,
                  },
                  addedToFavourite: response.data.isAddedToFavorites,
                },
                () => this.fleetDurationCheck()
              );
            }
          })
          .catch((error: any) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getHolidaysByYear = (year) => {
    if (year !== this.props.holiday?.year) {
      this.props.getHolidays(year);
    }
  };

  getAllDatesBetweenTwoDates = (startDate, endDate) => {
    let date = [];
    while (moment(startDate) <= moment(endDate)) {
      date.push(startDate);
      startDate = moment(startDate).add(1, "days").format("MM-DD-YYYY");
    }
    return date;
  };

  calculateRunLength = (startDate, endDate, removeHolidaysLength) => {
    let startingOfStartDate = moment(startDate).startOf("day");
    let startingOfendDate = moment(endDate).startOf("day");

    let adjust = 1;

    if (
      startingOfStartDate.dayOfYear() === startingOfendDate.dayOfYear() &&
      startingOfStartDate.year() === startingOfendDate.year()
    ) {
      return 0;
    }

    if (startingOfendDate.isBefore(startingOfStartDate)) {
      const temp = startingOfStartDate;
      startingOfStartDate = startingOfendDate;
      startingOfendDate = temp;
    }

    if (startingOfStartDate.day() === 6) {
      startingOfStartDate.day(8);
    } else if (startingOfStartDate.day() === 0) {
      startingOfStartDate.day(1);
    }

    if (startingOfendDate.day() === 6) {
      startingOfendDate.day(5);
    } else if (startingOfendDate.day() === 0) {
      startingOfendDate.day(-2);
    }

    const startDateWeek = startingOfStartDate.week();
    let endDayWeek = startingOfendDate.week();

    if (startDateWeek !== endDayWeek) {
      if (endDayWeek < startDateWeek) {
        endDayWeek += startDateWeek;
      }
      adjust += -2 * (endDayWeek - startDateWeek);
    }
    return (
      startingOfendDate.diff(startingOfStartDate, "days") +
      adjust -
      1 -
      removeHolidaysLength
    );
  };

  fleetDurationCheck() {
    if (this.state.auctionData.sellingAgency === "FMS") {
      const { auctionData } = this.state;
      let startDate = auctionData.biddingDetailsData.salesStart.substring(
        0,
        10
      );
      let endDate = auctionData.biddingDetailsData.salesEnd.substring(0, 10);
      const year = auctionData.biddingDetailsData.salesStart.substring(6, 10);
      if (year !== new Date().getFullYear()) {
        this.getHolidaysByYear(year);
      }

      let formattedStartDate = moment(moment(startDate).format("MM-DD-YYYY"));
      let formattedEndDate = moment(moment(endDate).format("MM-DD-YYYY"));
      let daysBetween = this.getAllDatesBetweenTwoDates(formattedStartDate, formattedEndDate);
      let holidaysList = this.props.holiday.holidays.map((nonWorking) =>
        moment(nonWorking).format("MM-DD-YYYY")
      );

      const removeHolidays = daysBetween.filter((x) => {
        return holidaysList.indexOf(x) < 0;
      });

      let runLength = this.calculateRunLength(
        startDate,
        endDate,
        daysBetween.length - removeHolidays.length
      );

      if (auctionData.biddingDetailsData.templateCodes === null) {
        let templateCodes = {
          duration: formattedEndDate.diff(formattedStartDate, "days"),
        };
        auctionData.biddingDetailsData.templateCodes = templateCodes;
      } else {
        auctionData.biddingDetailsData.templateCodes.duration = formattedEndDate.diff(
          formattedStartDate,
          "days"
        );
      }
      auctionData.biddingDetailsData.templateCodes.runningLength = runLength;
      this.setState({
        auctionData,
      });
    }
  };

  auctionInterval;
  componentDidMount() {
    this.loadDefaults(this.props?.match?.params?.auctionId);
    this.auctionInterval = setInterval(() => {
      if (this.state.auctionDetails.status === "Active") {
        this.loadDefaults(this.props?.match?.params?.auctionId);
      }
    }, 5000);

    window.scrollTo(0, 0);
  }
  componentWillUnmount() {
    clearInterval(this.auctionInterval);
  }

  handleBuyNow() {
    let auctionId = this.props?.match?.params?.auctionId;
    const { addToast } = this.props.actions;
    this.auctionsAPIService
      .buyNow(auctionId)
      .then(() => {
        this.loadDefaults(this.props?.match?.params?.auctionId);
        let pageRoute = Paths.payTradeAwards + "/" + this.state?.auctionDetails?.contractId;
        PageHelper.openPage(pageRoute);
        addToast({
          text: `Item bought successfully.`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.error(error);
        addToast({
          text: `Error buying item.`,
          type: "error",
          heading: "Error",
        });
      });
  }
  handlePlaceBid(value, bidType) {
    let bidTypeCheck =
      bidType === "Flat Bid" ? "F" : bidType === "Automatic Bid" ? "A" : null;
    let data = {
      bidAmount: value,
      bidType: bidTypeCheck,
    };
    const { addToast } = this.props.actions;
    this.auctionsAPIService
      .placeBid(data, this.props?.match?.params?.auctionId)
      .then((response) => {
        addToast({
          text: `Bid Placed Successfully.`,
          type: "success",
          heading: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: `Error placing bid.`,
          type: "error",
          heading: "Error",
        });
      });
  }
  render() {
    return (
      <div className={"ui-ppms"}>
        <div className={""}>
          <br />
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col-8 ppms-details-container"}>
              <AuctionItemInformation
                auctionData={this.state?.auctionData}
                auctionDetails={this.state?.auctionDetails}
                handleFavourite={this.handleFavourite}
                addedToFavourite={this.state.addedToFavourite}
                handleBuyNow={this.handleBuyNow}
                handlePlaceBid={(value, bidType) =>
                  this.handlePlaceBid(value, bidType)
                }
                {...this.props}
                auctionId={this.props?.match?.params?.auctionId}
                isLoggedIn={this.props.authentication.loggedIn}
                isFleetAuction={this.state.isFleetAuction}
              />
              <br />
            </div>
            <div className={"grid-col-4"}>
              {this.state.renderChildren ? (
                this.state.imageList.length > 0 ? (
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col"}>
                      <div
                        className={
                          "imageContainer propertyImageContainer auctionView"
                        }
                      >
                        <PPMSImageSlider
                          images={this.state?.imageList}
                          names={this.state?.imageNameList}
                          height="600"
                          width="800"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={"image-not-available"}>
                    <p>
                      <i className="fas mr-2">{<FaExclamationTriangle />}</i>
                    </p>
                    <p>Image Not Available</p>
                  </div>
                )
              ) : (
                <div />
              )}
              {this.state?.imageFileList?.length !== 0 ||
              this.state?.docsFilesList?.length !== 0 ? (
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col property-attachment-container"}>
                    <PPDMSFileView
                      images={this.state?.imageFileList}
                      files={this.state?.docsFilesList}
                    />
                  </div>
                </div>
              ) : null}
              {this.state?.propertyUrls?.length !== 0 ? (
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col ppms-videos-container"}>
                    <PPMSVideoView propertyUrls={this.state?.propertyUrls} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className={"grid-row grid-gap-4 auctionViewSupporting"}>
            <div className={"grid-col-4"}>
              <PPMSMapView
                id="auctionMapView"
                header="Property Location"
                location={this.state?.auctionDetails?.location}
              />
            </div>
            <div className={"grid-col-8"}>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col-6"}>
                  <PPMSViewPOC
                    propertyData={this.state?.auctionData}
                    {...this.props}
                  />
                </div>
                <div className={"grid-col-6"}>
                  <PPMSViewCustodian
                    propertyData={this.state?.auctionData}
                    {...this.props}
                  />
                </div>
                <div className={"grid-col-6"}>
                  {(this.state?.auctionData?.sellingAgency === "PBS" ||
                    this.state?.auctionData?.sellingAgency === "DOI") && (
                    <PaymentInquiries
                      propertyData={this.state?.auctionData?.salesRegionDetail}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
  };
};

const mapStateToProps = (state) => ({
  pbsFSCCodes: state.common.pbsFSCCodes,
  authentication: state.authentication,
  holiday: state?.common?.holiday,
});
export default connect(mapStateToProps, mapDispatchToProps)(AuctionItem);
