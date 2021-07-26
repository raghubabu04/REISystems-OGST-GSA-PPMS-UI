/**@jsx jsx */
import React from "react";
import PPMSViewPOC from "../../property/view-property/PropertyViewPOC";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import PPDMSFileView from "../../property/view-property/PPDMSFileView";
import GiftInformation from "./GiftInformation";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { Link } from "react-router-dom";
import { Paths } from "../../Router";
import { connect } from "react-redux";
import { jsx } from "@emotion/core";
import { PPMSImageSlider } from "../../../ui-kit/components/image-carousel/PPMS-image-slider";
import { FaShoppingCart } from "react-icons/fa";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { PPMSLabel } from "../../../ui-kit/components/common/form/PPMS-label";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { FaExclamationTriangle } from "react-icons/fa";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSActionList } from "../../../ui-kit/components/PPMS-action-list";
import { getFormattedICN } from "../../property/create-update-property/validations/propertyFieldValidations";

interface PPMSForeignGiftViewProps {
  match: any;
  roles?: any;
}

interface PPMSForeignGiftViewState {
  imageFileList: any;
  docsFilesList: any;
  propertyData: any;
  imageList: any;
  imageNameList: any;
  renderChildren: boolean;
  quantity: number;
  addToCartDisabled: boolean;
  maxAvailable: number;
  cartCount: number;
  totalCartItems: number;
  propertyId: number;
  requestedItemId: number;
  userPermitted: boolean;
  printPreviewModeOn: boolean;
  showActionHistoryModal: boolean;
  internal: boolean;
  showAddToCartModal: boolean;
  actionHistoryData: any;
  isHistoryProperty: boolean;
  isNonReportedProperty: boolean;
}

class PPMSForeignGiftView extends React.Component<
  PPMSForeignGiftViewProps,
  PPMSForeignGiftViewState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      imageFileList: [],
      docsFilesList: [],
      propertyData: "",
      imageList: [],
      imageNameList: [],
      renderChildren: false,
      quantity: 0,
      addToCartDisabled: false,
      maxAvailable: 0,
      cartCount: 0,
      totalCartItems: 0,
      propertyId: 0,
      requestedItemId: 0,
      userPermitted: false,
      printPreviewModeOn: false,
      internal: false,
      showActionHistoryModal: false,
      showAddToCartModal: false,
      actionHistoryData: [],
      isHistoryProperty: false,
      isNonReportedProperty: false,
    };
  }
  private propertyAPIService: PropertyApiService = new PropertyApiService();
  private commonAPIService: CommonApiService = new CommonApiService();

  getCountry = () => {
    this.commonAPIService
      .getCountryList()
      .then((response: any) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  handlePrintPreview = async (event) => {
    await this.setState({
      printPreviewModeOn: true,
    });
    var printContents = document.getElementById("printDiv").innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    // now revert
    document.location.reload(false);
  };

  componentDidMount() {
    // this.props.getPriorityCodes();
    this.propertyAPIService
      .getProperty(this.props?.match?.params?.icn)
      .then((response: any) => {
        if (response?.data !== null) {
          this.propertyAPIService
            .getProperty(this.props?.match?.params?.icn)
            .then((response: any) => {
              this.setState({
                propertyData: response.data,
                maxAvailable: response.data.quantity,
                propertyId: response.data.propertyId,
                internal: response.data.isInternal,
              });
              if (response.data.propertyCreationSource === "NON_REPORT_PROP") {
                this.setState({
                  isNonReportedProperty: true,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              return error;
            });

          this.propertyAPIService
            .getUploadedItems(this.props?.match?.params?.icn, "ICN")
            .then((response: any) => {
              if (response.data && response.data.image) {
                let imageNameList = [];
                let imageList = [];
                let images = response.data.image.sort((a, b) =>
                  a.attachmentOrder > b.attachmentOrder ? 1 : -1
                );
                images.forEach((o) => {
                  imageNameList.push(o.name);
                  imageList.push(o.preSignedURI);
                });

                this.setState({
                  imageFileList: response.data.image,
                  imageNameList: imageNameList,
                  imageList: imageList,
                  renderChildren: true,
                });
              }
              if (response.data && response.data.documents) {
                this.setState({
                  docsFilesList: response.data.documents,
                });
              }
            })
            .catch((error: any) => {
              console.log(error);
            });

          this.propertyAPIService.getCartItems().then((response: any) => {
            this.setItemCartInfo(response);
          });

          this.setState({
            isHistoryProperty: false,
          });
        } else {
          this.propertyAPIService
            .getHistoryProperty(this.props?.match?.params?.icn)
            .then((response: any) => {
              if (response.data.propertyCreationSource === "NON_REPORT_PROP") {
                this.setState({
                  isNonReportedProperty: true,
                });
              }
              this.setState({
                propertyData: response.data,
                maxAvailable: response.data.quantity,
                propertyId: response.data.propertyId,
                internal: response.data.isInternal,
              });
            })
            .catch((error) => {
              console.log(error);
              return error;
            });

          this.propertyAPIService
            .getHistoryUploadedItems(this.props?.match?.params?.icn, "ICN")
            .then((response: any) => {
              if (response.data && response.data.image) {
                let imageNameList = [];
                let imageList = [];
                let images = response.data.image.sort((a, b) =>
                  a.attachmentOrder > b.attachmentOrder ? 1 : -1
                );
                images.forEach((o) => {
                  imageNameList.push(o.name);
                  imageList.push(o.preSignedURI);
                });

                this.setState({
                  imageFileList: response.data.image,
                  imageNameList: imageNameList,
                  imageList: imageList,
                  renderChildren: true,
                });
              }
              if (response.data && response.data.documents) {
                this.setState({
                  docsFilesList: response.data.documents,
                });
              }
            })
            .catch((error: any) => {
              console.log(error);
            });

          this.setState({
            isHistoryProperty: true,
            addToCartDisabled: true,
          });
        }
      });
    window.scrollTo(0, 0);
  }

  handleActionHistory = () => {
    this.setState({
      showActionHistoryModal: true,
    });
    this.callActionHistoryByObjectTypeAndId();
  };

  callActionHistoryByObjectTypeAndId() {
    const data = {
      params: {
        objectType: "ICN",
        objectId: this.state.propertyData.itemControlNumber,
      },
    };
    this.propertyAPIService
      .getActionHistoryForProperty(data)
      .then((response: any) => {
        this.setState({
          actionHistoryData: response.data,
          showAddToCartModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  canAddToCart = (isInternal) => {
    let isInDraftStatus = !this.state.propertyData.isSubmitted;
    // let isInSubmittedStatus = !isInDraftStatus;
    let isInExcessScreening =
      this.state.propertyData?.propertyStatus?.statusId === 60;
    let isInDOSApproval =
      this.state.propertyData?.propertyStatus?.statusId === 170;
    let isInRestricted =
      this.state.propertyData?.propertyStatus?.statusId === 180;
    let isInSaleApproval =
      this.state.propertyData?.propertyStatus?.statusId === 190;
    let isInWithDrawnStatus =
      this.state.propertyData.propertyStatus?.statusId === 30;

    if (
      this.props.roles?.isNU ||
      this.props.roles?.isAC ||
      this.props.roles?.isSM ||
      this.props.roles?.isFG
      //   this.props.roles?.isFR
    ) {
      // Is property in 'Draft' status or is withDrawn don't show Cart
      if (isInDraftStatus || isInWithDrawnStatus) {
        return false;
      }
      // Is property in 'ExcessScreening', 'DOSApproval', 'Restricted' or 'SaleApproval' status show Cart
      else if (
        isInExcessScreening ||
        isInDOSApproval ||
        isInRestricted ||
        isInSaleApproval
      ) {
        return true;
      }
    }
    return false;
  };

  setItemCartInfo(response) {
    let isInWithDrawnStatus =
      this.state.propertyData.propertyStatus?.statusId === 30;
    for (let item of response.data.requests) {
      for (let request of item.requestItems) {
        if (
          request.requestItem.itemControlNumber ===
          this.props?.match?.params?.icn
        ) {
          // should disable the add to cart button here
          this.setState({
            addToCartDisabled: true,
          });
        }
      }
    }
    if (isInWithDrawnStatus) {
      this.setState({
        addToCartDisabled: true,
      });
    }
    this.setState({
      totalCartItems: response.data.total,
    });
  }

  handleAddToCartClose = (event) => {
    this.setState({
      showAddToCartModal: false,
      showActionHistoryModal: false,
    });
  };

  handleAddToCart = () => {
    this.setState({
      addToCartDisabled: true,
      cartCount: 1,
      totalCartItems: this.state.totalCartItems + 1,
    });
    let payload = {
      propertyId: this.state.propertyId,
      cartCount: 1,
      propertyGroup: "foreignGift",
    };
    this.propertyAPIService
      .addToCart(payload)
      .then((response: any) => {})
      .catch((error: any) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className={"ui-ppms"}>
        <div className={""}>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className={"container"}>
                <div className="item-search-result data-sheet-header">
                  <h1>Property Data Sheet</h1>
                  {this.canAddToCart(this.state.internal) &&
                    !this.state.isHistoryProperty && (
                      <span className="item-search-result-add-cart property-data-view">
                        <Link to={Paths.viewCart}>
                          <FaShoppingCart />
                          View Cart ({this.state.totalCartItems})
                        </Link>
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className="grid-row tablet:grid-gap-2  ">
                <div className={"grid-col cart-row cart-tray"}>
                  {this.canAddToCart(this.state.internal) &&
                  !this.state.isHistoryProperty ? (
                    <PPMSButton
                      id={"add-to-cart"}
                      label="Add to Cart"
                      className={"add-to-cart out-button"}
                      onPress={this.handleAddToCart}
                      isDisabled={this.state.addToCartDisabled}
                    />
                  ) : (
                    <div className={"grid-col-2"} />
                  )}
                </div>
                <div className="grid-col-3 flex-top-tray">
                  {this.state?.propertyData?.propertyStatus?.statusName !==
                  "DRAFT" ? (
                    <PPMSButton
                      className={"out-button"}
                      type={"button"}
                      value={""}
                      label={"Action History"}
                      onPress={this.handleActionHistory}
                      id={"action-history"}
                    />
                  ) : (
                    <div></div>
                  )}
                  {this.canAddToCart(this.state.internal) ? (
                    <PPMSButton
                      className={"out-button"}
                      type={"button"}
                      value={""}
                      label={"Print"}
                      onPress={this.handlePrintPreview.bind(this)}
                      id={"print"}
                    />
                  ) : (
                    <div>
                      <PPMSLabel htmlFor={"Print"}>{""}</PPMSLabel>
                      <PPMSButton
                        className={"out-button"}
                        type={"button"}
                        value={""}
                        size={"lg"}
                        label={"Print"}
                        onPress={this.handlePrintPreview.bind(this)}
                        id={"print"}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className={"grid-row grid-gap-4 "}>
            <div className={"grid-col-4"}>
              {this.state.renderChildren ? (
                this.state.imageList.length > 0 ? (
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col"}>
                      <div className={"imageContainer propertyImageContainer"}>
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
              {this.state?.imageFileList.length !== 0 ||
              this.state?.docsFilesList.length !== 0 ? (
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col property-attachment-container"}>
                    <PPDMSFileView
                      images={this.state?.imageFileList}
                      files={this.state?.docsFilesList}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className={"grid-col-8 ppms-details-container"}>
              <GiftInformation
                propertyData={this.state?.propertyData}
                isNonReportedProperty={this.state.isNonReportedProperty}
                {...this.props}
              />
              <br />
            </div>
          </div>
        </div>

        <div className={"grid-col-12"}>
          <PPMSViewPOC
            propertyData={this.state?.propertyData}
            {...this.props}
          />
        </div>

        {this.state.printPreviewModeOn ? (
          // This div is exclusively for Print Preview purpose
          <div id="printDiv">
            <div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <h1>&nbsp;&nbsp;Property Data Sheet</h1>
                </div>
              </div>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <GiftInformation
                    propertyData={this.state?.propertyData}
                    isNonReportedProperty={this.state.isNonReportedProperty}
                    {...this.props}
                  />
                  <br />
                  <PPMSViewPOC
                    propertyData={this.state?.propertyData}
                    {...this.props}
                  />
                  <br />
                  <table className={"usa-table"}>
                    <tbody>
                      <div className="row">
                        {this.state.imageList.map((image, index) => (
                          <div className={"grid-col-3"}>
                            <img src={image} width={"92"} height={"69"} />
                          </div>
                        ))}
                      </div>
                    </tbody>
                  </table>
                  <br />
                  <PPDMSFileView files={this.state?.docsFilesList} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="printDiv" />
        )}
        <div className="grid-row grid-gap-4">
          <PPMSModal
            show={this.state.showAddToCartModal}
            handleClose={this.handleAddToCartClose}
            handleSave={this.handleAddToCartClose}
            title={
              this.state.showActionHistoryModal
                ? "Action History ICN: " +
                  getFormattedICN(this.state?.propertyData?.itemControlNumber)
                : "This Item Requires Reimbursement"
            }
            centered={true}
            backdrop={"static"}
            label={"Ok"}
            hideLabelCancel={true}
            hideLabel={this.state.showActionHistoryModal ? true : false}
            size={this.state.showActionHistoryModal ? "lg" : null}
            body={
              <ModalActionHistoryContent
                data={this.state.actionHistoryData}
                listID={"list-id"}
                title={
                  this.state.showActionHistoryModal
                    ? this.state.propertyData?.itemControlNumber
                    : "This Item Requires Reimbursement"
                }
              />
            }
            id={"addToCart-files"}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  authentication: state.authentication,
  roles: state.authentication.roles,
  priorityCodes: state.common.priorityCodes,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getPriorityCodes: () => {
      dispatch(commonActions.getPriorityCodes());
    },
  };
};

const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PPMSForeignGiftView);
