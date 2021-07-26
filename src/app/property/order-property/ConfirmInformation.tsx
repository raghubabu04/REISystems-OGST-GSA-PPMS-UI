import React, { useEffect, useContext, useState } from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { ShippingDetailsClass } from "./components/ShippingDetails/ShippingDetails";
import { PageHelper, Paths } from "../../Router";
import { cartActions } from "../../../_redux/_actions/cart.actions";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { ShoppingContext } from "./components/ShoppingCartContext";
import { history } from "../../../_redux/_helpers/history";
import { PPMSPropertyGroup } from "../../../ui-kit/components/property/PPMS-property-group";
import queryString from "query-string";
import { FaShoppingCart, FaClipboardCheck } from "react-icons/fa";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import PPMSTitle from "../../../ui-kit/components/common/header/components/PPMS-title";
import { UploadDocument } from "../order-property/components/uploads/UploadDocument";
import { PPMSCardBody } from "../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCard } from "../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardGroup } from "../../../ui-kit/components/common/card/PPMS-card-group";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { FaFileAlt } from "react-icons/fa";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PropertyGroupType } from "../create-update-property/constants/Constants";
import { isEmptyCheck } from "../../../ui-kit/components/validations/FieldValidations";
interface ConfirmInformationProps {
  user?: any;
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
  documentList: any;
  actions?: any;
  deleteTCNInCart?: any;
}

function ConfirmInformation(props: ConfirmInformationProps) {
  const [priorityDataInternal, setPriorityDataInternal] = useState(null);
  const [revealModal, setRevealModal] = useState(false);
  const [justification, setJustification] = useState("");
  const { shippingDetailsState } = useContext(ShoppingContext);
  const { uploadDocumentsState, updateUploadDocumentsState } = useContext(
    ShoppingContext
  );
  const propertyApiService = new PropertyApiService();
  let search = history.location.search;
  let query = queryString.parse(search);
  const tcn = query["tcn"] ? query["tcn"] : "";
  const { addToast } = props.actions;
  if (tcn === "" || tcn.length !== 10) {
    history.push(Paths.searchProperty);
  }
  const requestOfCart = props?.cart?.cart?.requests?.find(
    (request) => request.transferControlNumber === tcn
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(cartActions.getCartItems());
    dispatch(commonActions.getUnitOfIssues());
    dispatch(commonActions.getPriorityCodes());
    updateFilesList();
  }, [dispatch]);

  const isForeignGift =
    requestOfCart?.propertyGroup === PropertyGroupType.FOREIGN_GIFT;
  const fireArmFSC = ["1005", "1010"];
  function submitOrder() {
    if (!shippingDetailsState.isExistingAPO) {
      alert(
        "The AO entered in the 'Agency Approval' section does not exist in the system and will not be able to approve the TCN. As an APO/SM, the TCN can be requisitioned from the 'Requisitions' screen."
      );
    }
    let checkFile = [];
    uploadDocumentsState?.docsFilesList.forEach((file) => {
      if (file.documentType === null) {
        checkFile.push(file.name);
      }
    });
    if (checkFile.length !== 0) {
      const { addToast } = props.actions;
      return addToast({
        text: "Error, please select document type",
        type: "error",
        heading: "Error",
      });
    }
    let shippingAddress = {
      line1: shippingDetailsState.shippingDetailsAddressLine1,
      line2: shippingDetailsState.shippingDetailsAddressLine2,
      line3: shippingDetailsState.shippingDetailsAddressLine3,
      city: shippingDetailsState.shippingDetailsCity,
      stateCode: shippingDetailsState.shippingDetailsState,
      zip: shippingDetailsState.shippingDetailsZipcode,
      instructions: shippingDetailsState.shippingDetailsInstructions,
    };

    let shippingAttn = shippingDetailsState.shippingDetailsAttn;
    let request = {
      cartRequestId: shippingDetailsState.cartId,
      shippingAddress: shippingAddress,
      shippingAttn: shippingAttn,
      transferControlNumber: tcn.toString(),
      aacId: shippingDetailsState.activityAddressCode,
      propertyGroup: isForeignGift ? "foreignGift" : "property",
    };
    dispatch(cartActions.submitOrder(request));
  }

  function submitDirectRequisition() {
    let shippingAddress = {
      line1: shippingDetailsState.shippingDetailsAddressLine1,
      line2: shippingDetailsState.shippingDetailsAddressLine2,
      line3: shippingDetailsState.shippingDetailsAddressLine3,
      city: shippingDetailsState.shippingDetailsCity,
      stateCode: shippingDetailsState.shippingDetailsState,
      zip: shippingDetailsState.shippingDetailsZipcode,
      instructions: shippingDetailsState.shippingDetailsInstructions,
    };

    let shippingAttn = shippingDetailsState.shippingDetailsAttn;
    let request = {
      shippingAddress: shippingAddress,
      shippingAttn: shippingAttn,
      transferControlNumber: tcn.toString(),
      aacId: shippingDetailsState.activityAddressCode,
    };
    dispatch(cartActions.submitDirectRequisition(request));
  }

  const savePriority = async (payload, propertyId) => {
    try {
      await propertyApiService.savePropertyPriority(payload, propertyId);
      dispatch(cartActions.getCartItems());
      addToast({
        text: "Justification has been saved.",
        type: "success",
        heading: "Success",
      });
      setRevealModal(false);
    } catch (error) {
      addToast({
        text: "Error saving the justification. Please try again.",
        type: "error",
        heading: "Error",
      });
      setRevealModal(false);
      console.error(
        "ConfirmInformation has error on propertyApiService.savePropertyPriority:",
        error
      );
    }
  };

  const handleSave = () => {
    let priorityCode = priorityDataInternal.priorityId;
    let propertyId = priorityDataInternal.tcn;
    savePriority({ priorityCode, justification }, propertyId);
  };

  function showPriorityModal(event, priorityData) {
    setRevealModal(true);
    setPriorityDataInternal(priorityData);
    setJustification(priorityData.justification);
  }

  function inputPropertyTextArea(event) {
    setJustification(event.target.value);
  }

  function isCheckoutEmpty() {
    let count = requestOfCart?.requestItems?.length;
    return !(count && count > 1);
  }

  function isCartEmpty() {
    if (isCheckoutEmpty()) {
      if (props?.cart?.cart?.requests?.length <= 1) {
        return true;
      }
    }
    return false;
  }

  function updateFilesList() {
    propertyApiService
      .getUploadedItems(tcn, "TCN")
      .then((response: any) => {
        let docsFilesList = [];
        if (response.data && response.data.documents) {
          docsFilesList = response.data.documents;
        }
        updateUploadDocumentsState({
          docsFilesList,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="ui-ppms">
        <div className="">
          <div className="grid-row grid-gap">
            <main
              className="usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs"
              id="confirm-information-page"
            >
              <h1>View Cart</h1>
              <h2 className={"ui-ppms"}>
                <PPMSTitle>
                  <FaClipboardCheck /> Confirm Information{" "}
                  {requestOfCart?.tcnTotalItems && (
                    <>- {requestOfCart?.tcnTotalItems} item(s)</>
                  )}
                </PPMSTitle>
              </h2>
              <div className={"grid-row grid-gap-4"}>
                <div className={"grid-col"}>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col"}>
                      <PPMSPropertyGroup
                        handleUpdateQuantity={(payload) =>
                          props.updateQuantity(payload)
                        }
                        handleDeleteProperty={(id) =>
                          props.deleteProperty(
                            id,
                            isCartEmpty(),
                            isCheckoutEmpty()
                          )
                        }
                        handleDeleteTCN={(icn) =>
                          props.deleteTCNInCart(icn, isCartEmpty(), false)
                        }
                        requests={requestOfCart ? [requestOfCart] : []}
                        actionType={"Update Quantity"}
                        expand={true}
                        showCheckout={true}
                        roles={props.roles}
                        unitOfIssue={props.unitOfIssue}
                        priorityCodes={props.priorityCodes}
                        priorityLabel={"Update Priority"}
                        savePriority={(payload, propertyId) =>
                          savePriority(payload, propertyId)
                        }
                        showPriorityModal={(event, priorityData) => {
                          showPriorityModal(event, priorityData);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className={"grid-row margin-bottom-2em"}>
                <div className={"grid-col"}>
                  <ShippingDetailsClass
                    tcn={tcn.toString()}
                    updateShipping={(shippingDetails) =>
                      dispatch(cartActions.addShipping(shippingDetails))
                    }
                    aacs={props.aacs}
                    primaryAAC={props.primaryAAC}
                  />
                </div>
              </div>
              <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
                <PPMSCard className="ppms-widget">
                  <PPMSCardBody className="non-tcn-main-row card-header-height widget-header">
                    <div>
                      <strong>
                        <i className="fas head-icon">{<FaFileAlt />}</i> TCN
                        Documents
                      </strong>
                    </div>
                  </PPMSCardBody>
                  <PPMSCardBody>
                    <UploadDocument
                      tcn={tcn.toString()}
                      context={ShoppingContext}
                    />
                  </PPMSCardBody>
                </PPMSCard>
              </PPMSCardGroup>
              <div className="grid-row grid-gap-4 flex-justify">
                <div className={"grid-col-auto"}>
                  <PPMSButton
                    id={"back-to-cart"}
                    type={"button"}
                    variant={"outline-primary"}
                    label={"< Back to Cart"}
                    onPress={() => PageHelper.openPage(Paths.viewCart)}
                    className="out-button"
                  />
                </div>
                <div className="grid-col-auto">
                  {(props?.roles?.isSM || props?.roles?.isAC) &&
                    shippingDetailsState.userEmail !==
                      props?.user?.emailAddress &&
                    !fireArmFSC.includes(requestOfCart?.requestItems[0]?.requestItem?.federalSupplyClass) && (
                      <PPMSButton
                        id={tcn + "-direct-requisition"}
                        label={"Direct Requisition"}
                        type={"button"}
                        className={"out-button"}
                        onPress={() => {
                          submitDirectRequisition();
                        }}
                      />
                    )}
                  <PPMSButton
                    icon={<FaShoppingCart />}
                    id={"final-checkout"}
                    label={" Checkout"}
                    className="out-button"
                    type={"button"}
                    isDisabled={
                      !shippingDetailsState.validation
                        .activityAddressCodeIsInvalid &&
                      shippingDetailsState.showLeaInfoByRequestor &&
                      shippingDetailsState.showLeaInfo
                        ? isEmptyCheck(shippingDetailsState.doneeTileEmail)
                          ? true
                          : false
                        : false
                    }
                    onPress={submitOrder}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <PPMSModal
          show={revealModal}
          handleClose={(event) => {
            setRevealModal(false);
          }}
          handleSave={handleSave}
          title={"Priority"}
          centered={true}
          backdrop={"static"}
          label={"Save"}
          labelCancel={"Cancel"}
          body={
            <ModelContent
              props={props}
              justification={justification}
              priorityData={priorityDataInternal}
              handleInputPropertyTextArea={inputPropertyTextArea}
            />
          }
          id={""}
        />
      </div>
    </>
  );
}

const ModelContent = ({
  props,
  justification,
  priorityData,
  handleInputPropertyTextArea,
}) => {
  return (
    <div>
      <PPMSSelect
        selectName={"SelectPriority"}
        label={"Priority"}
        values={props.priorityCodes}
        isRequired={false}
        identifierValue={"disasterName"}
        identifierKey={"disasterCode"}
        isInvalid={false}
        onChange={(event) => {
          //do nothing here
        }}
        selectedValue={priorityData.priorityId}
        isValid={false}
        defaultValue={priorityData.priorityId}
        validationMessage={"Select"}
        disabled={true}
      />
      <PPMSTextArea
        id={"justification"}
        name={"justification-for-property"}
        label={"Justification"}
        isDisabled={false}
        isRequired={false}
        inputType={"text"}
        maxLength={100}
        value={justification}
        onChange={(e) => handleInputPropertyTextArea(e)}
        validationMessage={"Please enter the reason"}
        isInvalid={false}
        isValid={false}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  unitOfIssue: state.common.unitOfIssue,
  cart: state.cart,
  roles: state.authentication.roles,
  aacs: state.authentication.aacs,
  user: state.authentication.user,
  primaryAAC: state.authentication?.user?.userAccounts[0]?.primaryAAC,
  priorityCodes: state.common.priorityCodes,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getCartItems: () => {
      dispatch(cartActions.getCartItems());
    },
    submitOrder: (request) => {
      dispatch(cartActions.submitOrder(request));
    },
    addShipping: (data) => {
      dispatch(cartActions.addShipping(data));
    },
    updateQuantity: (payload) => {
      dispatch(cartActions.updateQuantity(payload));
    },
    deleteTCNInCart: (id, isCartEmpty, isCheckoutEmpty) => {
      dispatch(cartActions.deleteTCNInCart(id, isCartEmpty, isCheckoutEmpty));
    },
    deleteProperty: (id, isCartEmpty, isCheckoutEmpty) => {
      dispatch(cartActions.deleteProperty(id, isCartEmpty, isCheckoutEmpty));
    },
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmInformation);
