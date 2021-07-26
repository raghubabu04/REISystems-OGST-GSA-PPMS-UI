import React, { useEffect, useContext, useState } from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { TCNRequestorDetails } from "./components/TCNRequestorDetails";
import { Paths, PageHelper } from "../../Router";
import { cartActions } from "../../../_redux/_actions/cart.actions";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { ShoppingContext } from "./components/ShoppingCartContext";
import { history } from "../../../_redux/_helpers/history";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PPMSProperty } from "../../../ui-kit/components/property/PPMS-property";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import PPMSCardGroup from "../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../ui-kit/components/common/card/PPMS-card-body";
import PPMSCardFooter from "../../../ui-kit/components/common/card/PPMS-card-footer";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import {
  cartConstants,
  cartErrorConstants,
} from "../../../_redux/_constants/cart.constants";
import { PPMSTooltip } from "../../../ui-kit/components/common/PPMS-tooltip";
import { CgNotes } from "react-icons/cg";
import { PropertyGroupType } from "../create-update-property/constants/Constants";

interface TCNDetailsProps {
  match: any;
  location: any;
  history: any;
  context: any;
  user?: number;
  departName?: string;
  itemName?: string;
  icn?: any;
  cart?: any;
  roles?: any;
  aacs?: any;
  primaryAAC?: string;
  unitOfIssue?: any;
  updateQuantity?: any;
  deleteProperty?: any;
  priorityCodes?: any[];
  tcnDetails?: any;
  tcnData?: any;
  actions?: any;
}

function TCNDetails(props: TCNDetailsProps) {
  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    ShoppingContext
  );
  const [showPriorityModal, setShowPriorityModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const propertyApiService = new PropertyApiService();
  const tcn = props.match.params.tcn;
  if (tcn === "" || tcn.length !== 10) {
    history.push(Paths.searchProperty);
  }
  const [icnRowsPerPage, setIcnRowsPerPage] = useState<number>(10);
  const [icnTotalRows, setIcnTotalRows] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(getTCNDetails2(tcn, currentPage, icnRowsPerPage));
  }, [currentPage, icnRowsPerPage, tcn, icnTotalRows]);

  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(cartActions.getTCNDetails(tcn));
    dispatch(commonActions.getUnitOfIssues());
    dispatch(commonActions.getPriorityCodes());
  }, [dispatch, tcn]);

  const handleICNPageChange = (page, size) => {
    setIcnTotalRows(props?.cart?.tcnDetails?.totalElements);
    setIcnRowsPerPage(size);
    setCurrentPage(page);
  };

  function getTCNDetails2(tcn, currentPage, icnRowsPerPage) {
    const propertyApiService = new PropertyApiService();
    return (dispatch) => {
      dispatch(request(tcn));
      propertyApiService
        .getTCNDetails(tcn, {
          page: currentPage,
          size: icnRowsPerPage,
        })
        .then((response: any) => {
          let tcnDetails = response.data;
          dispatch(success(tcnDetails));
          if (tcnDetails.transferControlNumber === null) {
            history.push(Paths.myRequests);
          }
          setIcnTotalRows(props.cart.tcnDetails.totalElements);
        })
        .catch((error) => {
          console.log(error);
          dispatch(failure());
        });
    };
    function request(request) {
      return { type: cartConstants.GET_TCN_ITEMS_REQUEST, request };
    }
    function success(tcnDetails) {
      return { type: cartConstants.GET_TCN_ITEMS_SUCCESS, tcnDetails };
    }
    function failure() {
      return {
        type: cartConstants.GET_TCN_ITEMS_FAIL,
        error: cartErrorConstants.GET_TCN_ITEMS_FAIL,
      };
    }
  }

  let items = props?.cart?.tcnDetails?.requestItems;

  //ICN details
  let tcnItems = items
    ? items.map((item: any, index) => {
        const requestItem = item;
        return (
          <>
            <PPMSProperty
              key={requestItem.requestItem.propertyId}
              propertyId={requestItem.requestItem.propertyId}
              icn={requestItem.requestItem.itemControlNumber}
              itemName={requestItem.requestItem.itemName}
              location={requestItem.requestItem.location}
              itemStatus={requestItem.requestItem.itemStatus}
              federalSupplyClass={requestItem.requestItem.federalSupplyClass}
              fscDescription={
                requestItem.requestItem.federalSupplyClassDescription
              }
              fairMarketValue={requestItem.requestItem.fairMarketValue}
              conditionCode={requestItem.requestItem.conditionCode}
              originalAcquisitionCost={
                requestItem.requestItem.originalAcquisitionCost
              }
              unitOfIssueValue={props.unitOfIssue?.map((u) => {
                if (u?.code === requestItem.requestItem.unitOfIssue) {
                  return u.description;
                }
              })}
              reimbursementRequired={
                requestItem.requestItem.reimbursementRequired
              }
              categoryName={requestItem.requestItem.categoryName}
              agencyBureau={requestItem.requestItem.agencyBureau}
              date_release={requestItem.requestItem.releaseDate}
              categoryCode={requestItem.requestItem.categoryCode}
              qty_available={requestItem.requestItem.quantityAvailable}
              qty_requested={requestItem.requestItem.quantityRequested}
              quantity={requestItem.requestItem.cartCount}
              thumb_image={requestItem.requestItem.presignedUrl}
              isdisabled={props.cart.tcnDetails.tcnStatus !== "Requested"}
              handleDeleteProperty={(id) => {
                dispatch(cartActions.deleteRequestedProperty(id, tcn));
              }}
              addCartType={
                props.cart.tcnDetails.tcnStatus !== "Requested"
                  ? ""
                  : "Update Quantity"
              }
              //addCartType="Update Quantity"
              handleUpdateQuantity={(payload) => {
                updateQuantity(payload);
              }}
              requestedItemId={requestItem.requestItem.requestedItemId}
              surplusReleaseDate={requestItem.requestItem.surplusReleaseDate}
              tcnStatus={props?.cart?.tcnDetails?.tcnStatus}
              qty_req_by_me={requestItem.requestItem.quantityReqByMe}
              propertyGroup={item.requestItem.propertyGroup}
              fiscalYear={requestItem?.requestItem?.giftInfoDTO?.fiscalYear}
              administration={
                requestItem?.requestItem?.giftInfoDTO?.administration
              }
              recipientName={
                requestItem?.requestItem?.recipientDTO?.lastName != null &&
                requestItem?.requestItem?.recipientDTO?.firstName != null
                  ? requestItem?.requestItem?.recipientDTO?.lastName +
                    ", " +
                    requestItem?.requestItem?.recipientDTO?.firstName
                  : ""
              }
              donorCountry={
                requestItem?.requestItem?.donorInfoDTO?.donorCountry
              }
              donorName={
                requestItem?.requestItem?.donorInfoDTO?.lastName != null &&
                requestItem?.requestItem?.donorInfoDTO?.firstName != null
                  ? requestItem.requestItem.donorInfoDTO.lastName +
                    ", " +
                    requestItem.requestItem?.donorInfoDTO?.firstName
                  : ""
              }
              vaultLocation={
                requestItem?.requestItem?.giftInfoDTO?.vaultLocation
              }
              vaultShelfNumber={
                requestItem?.requestItem?.giftInfoDTO?.vaultShelfNumber
              }
              creationSource={
                item.requestItem.propertyGroup ===
                PropertyGroupType.FOREIGN_GIFT
                  ? PropertyGroupType.FOREIGN_GIFT
                  : ""
              }
            />
          </>
        );
      })
    : [];

  //User Profile and approving agency details
  let shippingData = props?.cart?.tcnDetails?.userProfileAndShippingDetails;
  let uploadedItems = props?.cart?.tcnDetails?.allUploadedItems;

  let shippingDetailsTag = shippingData ? (
    <TCNRequestorDetails
      tcn={tcn.toString()}
      response={props?.cart?.tcnDetails}
      updateShipping={(shippingDetails) =>
        dispatch(cartActions.addShipping(shippingDetails))
      }
      aacs={props.aacs}
      primaryAAC={props.primaryAAC}
      documentList={
        uploadedItems?.documents.length > 0 ? uploadedItems?.documents : []
      }
      tcnStatus={props.cart.tcnDetails.tcnStatus}
    />
  ) : (
    []
  );

  function getFormattedTCN(transferControlNumber: string) {
    return (
      transferControlNumber.substring(0, 2) +
      "-" +
      transferControlNumber.substring(2, 4) +
      "-" +
      transferControlNumber.substring(4)
    );
  }

  function deleteTCN(tcn) {
    const { addToast } = props.actions;
    propertyApiService
      .deleteTCN(tcn)
      .then((response) => {
        if (response.status === 200) {
          history.push(Paths.myRequests);
          addToast({
            text: `TCN: ${tcn} successfully deleted!`,
            type: "success",
            heading: "Success",
          });
        }
      })
      .catch((error) => {
        addToast({
          text: "Error deleting the TCN. Please try again.",
          type: "error",
          heading: "Error",
        });
        console.log(error);
      });
  }

  function updateQuantity(payload) {
    const { addToast } = props.actions;
    propertyApiService
      .updateQuantity(payload)
      .then((response) => {
        if (response.status === 200) {
          // history.push(Paths.myRequests);
          addToast({
            text: `Quantity Updated Successfully`,
            type: "success",
            heading: "Success",
          });
          dispatch(cartActions.getTCNDetails(tcn));
        }
      })
      .catch((error) => {
        addToast({
          text: "Unable to update Quantity.",
          type: "error",
          heading: "Error",
        });
        console.log(error);
      });
  }

  function handleDeleteModal(tcn: any) {
    setShowDeleteModal(true);
  }
  function handleDeleteClose() {
    setShowDeleteModal(false);
  }
  function handleDeleteProperty() {
    deleteTCN(tcn);
    setShowDeleteModal(false);
  }

  function handlePriorityModalOpen(event: any, tcn: any, justification: any) {
    updateShippingDetailsState({
      justification: justification,
    });
    setShowPriorityModal(true);
    event.stopPropagation();
  }
  function handlePriorirtyClose() {
    setShowPriorityModal(false);
  }
  function handleSavePriority() {
    const propertyApiService = new PropertyApiService();
    const payload = {
      priorityCode: props?.cart?.tcnDetails?.priority,
      justification: shippingDetailsState.justification,
    };
    propertyApiService
      .savePropertyPriority(payload, tcn)
      .then((response) => {
        dispatch(cartActions.getTCNDetails(tcn));
        setShowPriorityModal(false);
      })
      .catch((error) => {
        console.log(error);
        setShowPriorityModal(false);
      });
  }
  return (
    <>
      <div className="">
        <main
          className="usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs ui-ppms"
          id="tcn-details-page"
        >
          <h1>TCN Details</h1> <br></br>
          <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
            <PPMSCard>
              <PPMSCardBody className="non-tcn-main-row tcn-header-row card-header-height widget-header">
                <div className="grid-row tablet:grid-gap-2">
                  <div className="tablet:grid-col">
                    <strong>TCN: {getFormattedTCN(tcn)}</strong>
                  </div>
                  <div className="tablet:grid-col tcn-header-status">
                    <strong>TCN status: </strong>
                    {props?.cart?.tcnDetails?.tcnStatus}
                  </div>
                </div>
              </PPMSCardBody>
              <PPMSCardBody>
                <div className="grid-row tcn-body-row">
                  <div className={"tablet:grid-col"}>
                    {props?.cart?.tcnDetails?.requestItems?.[0].requestItem
                      .propertyGroup === PropertyGroupType.FOREIGN_GIFT ? (
                      <ul className={"usa-list usa-list--unstyled wide-list"}>
                        <li>
                          <strong>Vault Location: </strong>
                          <span className={"tcn-data-point"}>
                            {
                              props?.cart?.tcnDetails?.requestItems?.[0]
                                .requestItem.location
                            }
                          </span>
                        </li>
                      </ul>
                    ) : (
                      <ul className={"usa-list usa-list--unstyled wide-list"}>
                        <li>
                          <strong>Location: </strong>
                          <span className={"tcn-data-point"}>
                            {props?.cart?.tcnDetails?.location}
                          </span>
                        </li>

                        {props?.cart?.tcnDetails?.priority && (
                          <li>
                            <strong>Priority: </strong>
                            <span className={"tcn-data-point"}>
                              {props?.cart?.tcnDetails?.priority}{" "}
                              {props?.cart?.tcnDetails?.justification && (
                                <PPMSTooltip
                                  trigger={"focus"}
                                  id={"other-info"}
                                  placement={"right"}
                                  tooltipContent={
                                    props?.cart?.tcnDetails?.justification
                                  }
                                  triggerSource={
                                    <button
                                      id={`other-info-button`}
                                      type={"button"}
                                      className={
                                        "usa-button usa-button--unstyled"
                                      }
                                      title="Additional Information"
                                    >
                                      <CgNotes />
                                    </button>
                                  }
                                />
                              )}
                            </span>
                          </li>
                        )}
                        <li>
                          <strong>
                            {props?.cart?.tcnDetails?.excessReleaseDate
                              ? "Excess Release Date: "
                              : "Surplus Release Date: "}
                          </strong>
                          <span className={"tcn-data-point"}>
                            {props?.cart?.tcnDetails?.excessReleaseDate
                              ? props?.cart?.tcnDetails?.excessReleaseDate
                              : props?.cart?.tcnDetails?.surplusReleaseDate}
                          </span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </PPMSCardBody>
              <PPMSCardFooter>
                <div className="grid-row">
                  <div className={"grid-col"}>
                    <div className={"my-request-actions"}>
                      {props?.cart?.tcnDetails?.requestItems?.[0].requestItem
                        .propertyGroup !== PropertyGroupType.FOREIGN_GIFT &&
                        (props.roles.isSM ||
                          props.roles.isAC ||
                          props?.cart?.tcnDetails?.tcnStatus === "Requested") &&
                        props?.cart?.tcnDetails?.priority !== "" && (
                          <PPMSButton
                            id={tcn + "-updatePriority"}
                            label={"Update Justification"}
                            type={"button"}
                            onPress={(event) =>
                              handlePriorityModalOpen(
                                event,
                                tcn,
                                props?.cart?.tcnDetails?.justification
                              )
                            }
                          />
                        )}
                      {props?.cart?.tcnDetails?.tcnStatus === "Requested" && (
                        <PPMSButton
                          id={"delete-property"}
                          label={"Delete TCN"}
                          className={"delete-property d-inline"}
                          variant={"primary"}
                          onPress={() => handleDeleteModal(tcn)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </PPMSCardFooter>
            </PPMSCard>
          </PPMSCardGroup>
          <div className={"grid-row margin-bottom-2em"}>
            <div className={"grid-col"}>{shippingDetailsTag}</div>
          </div>
          <PPMSPagination
            page={1}
            pageSize={icnRowsPerPage}
            totalRows={icnTotalRows}
            onChangePage={(currentPage, pageSize) => {
              handleICNPageChange(currentPage, pageSize);
            }}
          />
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>{tcnItems}</div>
              </div>
            </div>
          </div>
        </main>
        <div className="grid-row grid-gap-4">
          <div className={"grid-col ui-ppms"}>
            <PPMSButton
              id={"myrequest-results"}
              type={"button"}
              className={"out-button"}
              label={"Back to Property Request(s)"}
              onPress={() => PageHelper.openPage(Paths.myRequests)}
            />
          </div>
        </div>
      </div>
      <PPMSModal
        show={showDeleteModal}
        handleClose={handleDeleteClose}
        handleSave={handleDeleteProperty}
        title={"Delete TCN"}
        centered={true}
        backdrop={"static"}
        label={"Yes"}
        labelCancel={"No"}
        body={<ModalDeleteContent />}
        id={"delete-files"}
      />
      <PPMSModal
        show={showPriorityModal}
        handleClose={handlePriorirtyClose}
        handleSave={handleSavePriority}
        title={"Priority"}
        centered={true}
        backdrop={"static"}
        label={"Save"}
        labelCancel={"Cancel"}
        body={
          <ModelPriorityContent priority={props?.cart?.tcnDetails?.priority} />
        }
        id={"priority-value"}
      />
    </>
  );
}
//Priority Modal and actions
const ModelPriorityContent = (props) => {
  const { shippingDetailsState, updateShippingDetailsState } = useContext(
    ShoppingContext
  );
  return (
    <div>
      <PPMSInput
        inputType={"text"}
        id={"tcnPriorityModel"}
        name={"priority-for-tcn"}
        label={"Priority"}
        value={props?.priority}
        isRequired={false}
        validationMessage={""}
        isDisabled={true}
      />
      <PPMSTextArea
        id={"justification"}
        name={"justification-for-tcn"}
        label={"Justification"}
        isDisabled={false}
        isRequired={false}
        inputType={"text"}
        maxLength={100}
        value={
          shippingDetailsState.justification
            ? shippingDetailsState.justification
            : ""
        }
        onChange={(event) =>
          updateShippingDetailsState({
            justification: event.target.value,
          })
        }
        validationMessage={"Please enter the reason"}
        isInvalid={false}
        isValid={false}
      />
    </div>
  );
};

const ModalDeleteContent = () => {
  return (
    <div>
      <p>
        Are you sure you want to Delete TCN? This will remove all items on this
        TCN from your cart.
      </p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  unitOfIssue: state.common.unitOfIssue,
  cart: state.cart,
  tcnDetails: state.tcnDetails,
  roles: state.authentication.roles,
  aacs: state.authentication.aacs,
  primaryAAC: state.authentication?.user?.userAccounts[0]?.primaryAAC,
  priorityCodes: state.common.priorityCodes,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getTCNDetails: (request) => {
      dispatch(cartActions.getTCNDetails(request));
    },

    addShipping: (data) => {
      dispatch(cartActions.addShipping(data));
    },
    updateQuantity: (payload) => {
      dispatch(cartActions.updateQuantity(payload));
    },
    deleteRequestedProperty: (id, tcn) => {
      dispatch(cartActions.deleteRequestedProperty(id, tcn));
    },
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TCNDetails);
