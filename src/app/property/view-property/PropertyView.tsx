/**@jsx jsx */
import React from "react";
import PPMSViewLocation from "./PropertyViewLocation";
import PPMSViewPOC from "./PropertyViewPOC";
import PPMSViewCustodian from "./PropertyViewCustodian";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import PPDMSFileView from "./PPDMSFileView";
import PropertyInformation from "./PropertyInformation";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { Link } from "react-router-dom";
import { Paths } from "../../Router";
import { connect } from "react-redux";
import { jsx } from "@emotion/core";
import { PPMSImageSlider } from "../../../ui-kit/components/image-carousel/PPMS-image-slider";
import PPMSViewAdditionalInfo from "./PropertyViewAdditionalInfo";
import { FaShoppingCart } from "react-icons/fa";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { PPMSLabel } from "../../../ui-kit/components/common/form/PPMS-label";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { FaExclamationTriangle } from "react-icons/fa";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSActionList } from "../../../ui-kit/components/PPMS-action-list";
import { getFormattedICN } from "../create-update-property/validations/propertyFieldValidations";
import PPMSRequestInfo from "./PropertyRequestInformation";
import PPMSViewSalesInfo from "./SalesInfo";

interface PPMSViewProps {
  match: any;
  roles?: any;
  getPriorityCodes: any;
  priorityCodes?: any[];
}

interface PPMSViewState {
  imageFileList: any;
  docsFilesList: any;
  propertyData: any;
  imageList: any;
  imageNameList: any;
  renderChildren: boolean;
  cartType: string;
  quantity: number;
  addToCartDisabled: boolean;
  updateQuantityDisabled: boolean;
  isQuantityValid: boolean;
  verificationMessage: string;
  maxAvailable: number;
  cartCount: number;
  totalCartItems: number;
  propertyId: number;
  requestedItemId: number;
  userPermitted: boolean;
  printPreviewModeOn: boolean;
  showActionHistoryModal: boolean;
  internal: boolean;
  selectedPriority?: string;
  priorityId: string;
  showAddToCartModal: boolean;
  actionHistoryData: any;
  isHistoryProperty: boolean;
  isNonReportedProperty: boolean;
  isFSC1005or1010: boolean;
  propertyRequestData: any;
}

class PPMSView extends React.Component<PPMSViewProps, PPMSViewState> {
  constructor(props: any) {
    super(props);
    this.state = {
      imageFileList: [],
      docsFilesList: [],
      propertyData: "",
      imageList: [],
      imageNameList: [],
      renderChildren: false,
      cartType: "Add to Cart",
      quantity: 0,
      addToCartDisabled: false,
      updateQuantityDisabled: true,
      isQuantityValid: true,
      verificationMessage: "",
      maxAvailable: 0,
      cartCount: 0,
      totalCartItems: 0,
      propertyId: 0,
      requestedItemId: 0,
      userPermitted: false,
      printPreviewModeOn: false,
      internal: false,
      selectedPriority: "",
      priorityId: "",
      showActionHistoryModal: false,
      showAddToCartModal: false,
      actionHistoryData: [],
      isHistoryProperty: false,
      isNonReportedProperty: false,
      isFSC1005or1010: false,
      propertyRequestData: {},
    };
  }
  private propertyAPIService: PropertyApiService = new PropertyApiService();
  private commonAPIService: CommonApiService = new CommonApiService();

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
    this.props.getPriorityCodes();
    this.propertyAPIService
      .getProperty(this.props?.match?.params?.icn)
      .then((response: any) => {
        if (response?.data !== null) {
          this.propertyAPIService
            .getProperty(this.props?.match?.params?.icn)
            .then((response: any) => {
              if (
                response.data.fscCode === "1005" ||
                response.data.fscCode === "1010"
              ) {
                this.setState({
                  isFSC1005or1010: true,
                });
              }
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
                console.log("Jasmine response.data"+JSON.stringify(response.data))
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
            let priorityCode = this.getPriorityId(
              this.props?.match?.params?.icn,
              response.data.requests
            );
            this.setState({
              selectedPriority: "",
              priorityId: priorityCode,
            });
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
            cartType: "",
          });
        }
      });

    this.propertyAPIService
      .getPropertyRequestsICN(this.props?.match?.params?.icn)
      .then((response: any) => {
        if (response?.data !== null) {
          this.setState({
            propertyRequestData: response.data,
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });

    window.scrollTo(0, 0);
  }

  getPriorityId(itemControlNumber: any, propertiesInCart) {
    let priority = "";
    propertiesInCart?.forEach((tcn) => {
      let requestItems = tcn.requestItems;
      requestItems.forEach((requestItem) => {
        if (requestItem.requestItem.itemControlNumber === itemControlNumber) {
          priority = requestItem.requestItem.priorityCode;
          return priority;
        }
      });
    });
    return priority;
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

    if (
      this.props.roles?.isNU ||
      this.props.roles?.isSM ||
      this.props.roles?.isAC ||
      (this.props.roles?.isSA && this.props.roles?.isMU) ||
      (isInternal && this.props.roles?.isIF) ||
      (!isInternal && this.props.roles?.isSP)
    ) {

      // If Property is not in Internal Screening or Excess Screening do not show Add to Cart
      if (this.state.propertyData.propertyStatus?.statusId !== 40 && this.state.propertyData.propertyStatus?.statusId !== 60 ) {
        return false;
      }
      return true;

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
          this.setState({
            quantity: request.requestItem.cartCount,
            cartCount: request.requestItem.cartCount,
            requestedItemId: request.requestItem.requestedItemId,
          });
        }
      }
    }
    if (this.state.quantity > 0 && !isInWithDrawnStatus) {
      this.setState({
        cartType: "Update Quantity",
      });
    }
    this.setState({
      totalCartItems: response.data.total,
    });
  }

  handleOrderQuantity = (event) => {
    this.setState({
      isQuantityValid: true,
      verificationMessage: "",
      addToCartDisabled: false,
      updateQuantityDisabled: false,
    });
    let value = event.currentTarget.value;
    if (value.toString().length > 5) {
      value = value.toString().substring(0, 5);
    }
    if (value !== "") {
      value = Math.floor(value) <= 0 ? 0 : Math.floor(value);
    }
    if (value > this.state.maxAvailable) {
      this.setState({
        isQuantityValid: false,
        verificationMessage:
          "Quantity selected cannot be greater than available quantity.",
        addToCartDisabled: true,
        updateQuantityDisabled: true,
      });
    } else if (
      value > this.state.maxAvailable - this.state.cartCount &&
      this.state.cartType === "Add to Cart"
    ) {
      this.setState({
        isQuantityValid: false,
        verificationMessage:
          "Quantity selected and quantity in the cart cannot be greater than available quantity.",
        addToCartDisabled: true,
        updateQuantityDisabled: true,
      });
    }
    this.setState({
      quantity: value,
    });
  };

  handleAddToCartClose = (event) => {
    this.setState({
      showAddToCartModal: false,
      showActionHistoryModal: false,
    });
  };

  handleAddToCartOpen = () => {
    this.setState({
      showAddToCartModal: true,
    });
  };

  handleUpdateQuantityOpen = () => {
    this.setState({
      showAddToCartModal: true,
    });
  };

  handleAddToCart = () => {
    let quantity = this.state.quantity;
    if (this.state.isFSC1005or1010) {
      quantity = 1;
    }
    if (quantity === 0 || !quantity) {
      this.setState({
        isQuantityValid: false,
        verificationMessage: "Quantity selected should be greater than zero.",
      });
    } else {
      if (this.state.propertyData.reimbursementRequiredFlag === "Y") {
        this.handleAddToCartOpen();
      }
      let payload = {
        propertyId: this.state.propertyId,
        cartCount: quantity,
        priorityCode: this.state.selectedPriority,
      };
      this.propertyAPIService.addToCart(payload).then((response: any) => {
        //disable priority dropdown if priority is set
        var priorityCode = this.state.selectedPriority;
        if (priorityCode === null || priorityCode === "") {
          priorityCode = this.getPriorityId(
            this.props?.match?.params?.icn,
            response.data.requests
          );
        }

        this.setState({
          selectedPriority: "",
          priorityId: priorityCode,
          cartType: "Update Quantity",
        });
      });
      if (this.state.isFSC1005or1010) {
        this.setState({
          updateQuantityDisabled: true,
          cartCount: this.state.cartCount + quantity,
          totalCartItems: this.state.totalCartItems + quantity,
        });
      } else {
        this.setState({
          addToCartDisabled: true,
          updateQuantityDisabled: true,
          cartCount: this.state.cartCount + quantity,
          totalCartItems: this.state.totalCartItems + quantity,
        });
      }
    }
  };

  handleUpdateQuantity = () => {
    if (this.state.quantity === 0) {
      this.setState({
        isQuantityValid: false,
        verificationMessage: "Quantity selected should be greater than zero.",
      });
    } else if (this.state.propertyData.reimbursementRequiredFlag === "Y") {
      this.handleUpdateQuantityOpen();
    } else {
      let payload = {
        propertyId: this.state.propertyId,
        cartCount: this.state.quantity,
        requestedItemId: this.state.requestedItemId,
      };
      this.propertyAPIService.updateQuantity(payload);
    }
    this.setState({
      updateQuantityDisabled: true,
      cartCount: this.state.quantity,
      totalCartItems:
        this.state.totalCartItems - this.state.cartCount + this.state.quantity,
    });
  };

  handlePrioritySelect = (event) => {
    this.setState({
      selectedPriority: event.target.value,
    });
  };

  canSelectPriority = () => {
    if (
      this.state.quantity === 0 ||
      this.state.cartType === "Update Quantity"
    ) {
      return true;
    } else {
      return false;
    }
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
                          <FaShoppingCart/>
                          View Cart ({this.state.totalCartItems})
                        </Link>
                      </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className="grid-row tablet:grid-gap-2  ">
                <div className={"grid-col cart-row cart-tray"}>
                  {this.canAddToCart(this.state.internal) &&
                  !this.state.isHistoryProperty &&
                  !this.state.isFSC1005or1010 ? (
                    <PPMSInput
                      isDisabled={false}
                      label={"Quantity"}
                      className={"property-select"}
                      id={"order-quantity"}
                      inputType={"number"}
                      isInvalid={false}
                      isValid={false}
                      isRequired={false}
                      value={this.state.quantity}
                      onChange={this.handleOrderQuantity}
                    />
                  ) : (
                    ""
                  )}
                  {this.canAddToCart(this.state.internal) &&
                  !this.state.isHistoryProperty &&
                  !this.state.isFSC1005or1010 ? (
                    <PPMSSelect
                      placeholderValue={"Not Selected"}
                      selectName={"SelectPriority"}
                      selectClass={"property-select"}
                      label={"Select Priority"}
                      values={this.props.priorityCodes}
                      isRequired={false}
                      onChange={this.handlePrioritySelect}
                      identifierValue={"disasterName"}
                      identifierKey={"disasterCode"}
                      isInvalid={false}
                      isValid={false}
                      defaultValue={
                        this.state.selectedPriority !== ""
                          ? this.state.selectedPriority
                          : this.state.priorityId
                      }
                      selectedValue={
                        this.state.selectedPriority !== ""
                          ? this.state.selectedPriority
                          : this.state.priorityId
                      }
                      validationMessage={"Select"}
                      disabled={this.canSelectPriority()}
                      infoTipContent={
                        this.state.cartType === "Update Quantity"
                          ? "If you wish to add or change the Priority, delete the item from the cart and add it again from the 'Property Search' page."
                          : "If the Disaster code is not available in the drop down list, contact GSA help desk at testmail@gsa.gov"
                      }
                    />
                  ) : (
                    ""
                  )}
                  {this.canAddToCart(this.state.internal) &&
                  !this.state.isHistoryProperty &&
                  this.state.cartType === "Add to Cart" ? (
                    <PPMSButton
                      id={"add-to-cart"}
                      label={this.state.cartType}
                      className={"add-to-cart out-button"}
                      onPress={this.handleAddToCart}
                      isDisabled={this.state.addToCartDisabled}
                    />
                  ) : this.state.cartType === "Update Quantity" &&
                  !this.state.isFSC1005or1010 ? (
                    <PPMSButton
                      id={"update-quantity"}
                      label={this.state.cartType}
                      className={"update-quantity out-button"}
                      onPress={this.handleUpdateQuantity}
                      isDisabled={this.state.updateQuantityDisabled}
                    />
                  ) : (
                    ""
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
              <div className="grid-row tablet:grid-gap-2">
                {!this.state.isQuantityValid && (
                  <p className={"infected"}>{this.state.verificationMessage}</p>
                )}
              </div>
            </div>
          </div>
          <br/>
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
                      <i className="fas mr-2">{<FaExclamationTriangle/>}</i>
                    </p>
                    <p>Image Not Available</p>
                  </div>
                )
              ) : (
                <div/>
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
              <PropertyInformation
                propertyData={this.state?.propertyData}
                isNonReportedProperty={this.state.isNonReportedProperty}
                {...this.props}
              />
              <br/>
            </div>
          </div>

          <div className={"grid-row ppms-details-container  grid-gap-4"}>
            <div className={"grid-col-4"}>
              <PPMSViewLocation
                propertyData={this.state?.propertyData}
                isNonReportedProperty={this.state.isNonReportedProperty}
                {...this.props}
              />
            </div>
            <div className={"grid-col-4"}>
              <PPMSViewPOC
                propertyData={this.state?.propertyData}
                {...this.props}
              />
            </div>
            <div className={"grid-col-4"}>
              <PPMSViewCustodian
                propertyData={this.state?.propertyData}
                {...this.props}
              />
            </div>
            <div className={"grid-col-12"}>
              <PPMSViewAdditionalInfo
                propertyData={this.state?.propertyData}
                isNonReportedProperty={this.state.isNonReportedProperty}
                {...this.props}
              />
            </div>
            <div className={"grid-col-12"}>
              <PPMSViewSalesInfo
                propertyData={this.state?.propertyData}
                isNonReportedProperty={this.state.isNonReportedProperty}
                {...this.props}
              />
            </div>
            {this.state?.propertyRequestData?.shouldDisplayedUserLoggedIn && (
              <div className={"grid-col-12"}>
                <PPMSRequestInfo
                  propertyRequestData={this.state?.propertyRequestData}
                  {...this.props}
                />
              </div>
            )}
          </div>
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
                  <PropertyInformation
                    propertyData={this.state?.propertyData}
                    isNonReportedProperty={this.state.isNonReportedProperty}
                    {...this.props}
                  />
                  <br/>
                  <PPMSViewLocation
                    propertyData={this.state?.propertyData}
                    isNonReportedProperty={this.state.isNonReportedProperty}
                    {...this.props}
                  />
                  <br/>
                  <PPMSViewPOC
                    propertyData={this.state?.propertyData}
                    {...this.props}
                  />
                  <br/>
                  <PPMSViewCustodian
                    propertyData={this.state?.propertyData}
                    {...this.props}
                  />
                  <br/>
                  <PPMSViewAdditionalInfo
                    propertyData={this.state?.propertyData}
                    isNonReportedProperty={this.state.isNonReportedProperty}
                    {...this.props}
                  />
                  <br/>

                  <PPMSViewSalesInfo
                    propertyData={this.state?.propertyData}
                    isNonReportedProperty={this.state.isNonReportedProperty}
                    {...this.props}
                  />
                  <table className={"usa-table"}>
                    <tbody>
                    <div className="row">
                      {this.state.imageList.map((image, index) => (
                        <div className={"grid-col-3"}>
                          <img src={image} width={"92"} height={"69"}/>
                        </div>
                      ))}
                    </div>
                    </tbody>
                  </table>
                  <br/>
                  <PPDMSFileView files={this.state?.docsFilesList}/>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="printDiv"/>
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
              this.state.showActionHistoryModal ? (
                <ModalActionHistoryContent
                  data={this.state.actionHistoryData}
                  listID={"list-id"}
                  title={
                    this.state.showActionHistoryModal
                      ? this.state.propertyData?.itemControlNumber
                      : "This Item Requires Reimbursement"
                  }
                />
              ) : (
                <ModalAddToCartContent/>
              )
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

const ModalAddToCartContent = () => {
  return (
    <div>
      <p>
        You have selected an item that requires reimbursement of Fair Market
        Value. Do not checkout this item unless your agency is prepared to pay
        Fair Market Value. Please delete this item from your cart if you cannot
        pay Fair Market Value.
      </p>
    </div>
  );
};

const ModalActionHistoryContent = ({ data, listID, title }) => {
  return (
    <div className={"action-history-container"}>
      <PPMSActionList data={data} listID={listID} title={title} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PPMSView);
