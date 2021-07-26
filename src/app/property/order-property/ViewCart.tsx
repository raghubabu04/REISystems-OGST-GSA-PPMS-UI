import React from "react";
import { cartActions } from "../../../_redux/_actions/cart.actions";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { connect } from "react-redux";
import { PageHelper, Paths } from "../../Router";
import { FaShoppingCart, FaExclamationTriangle } from "react-icons/fa";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSPropertyGroup } from "../../../ui-kit/components/property/PPMS-property-group";
import { history } from "../../../_redux/_helpers/history";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import PPMSTitle from "../../../ui-kit/components/common/header/components/PPMS-title";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import {UserUtils} from "../../../utils/UserUtils";
import {PPMSSpinner} from "../../../ui-kit/components/common/PPMS-spinner";
interface ViewCartProps {
  user?: number;
  departName?: string;
  itemName?: string;
  icn?: any;
  match?: any;
  location?: any;
  history?: any;
  context?: any;
  quantity?: any;
  cart?: any;
  updateQuantity?: any;
  deleteProperty?: any;
  deleteTCNInCart?: any;
  roles?: any;
  unitOfIssue?: any;
  priorityCodes?: any[];
  getCartItems?: any;
  getPriorityCodes?: any;
  actions: any;
  loading: boolean;
}
interface ViewCartState {
  priorityDataInternal?: any;
  revealModal?: boolean;
  justification: string;
  isAnyItemNotAvailable: boolean;
  itemAvailability: any;
  loading?: boolean;
}
export class ViewCart extends React.Component<ViewCartProps, ViewCartState> {
  constructor(props: ViewCartProps) {
    super(props);
    this.state = {
      priorityDataInternal: null,
      revealModal: false,
      justification: "",
      isAnyItemNotAvailable: false,
      itemAvailability: [],
      loading: false
    };
    this.checkout = this.checkout.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    this.props.getCartItems();
    this.props.getPriorityCodes();
    this.checkCart();
  }

  checkCart() {
    //RecieveProps does not consistently pick up cart details so we re-call for them here
    const propertyApiService = new PropertyApiService();
    propertyApiService
      .getCartItems()
      .then((response) => {
        for (let item of response.data.requests) {
          for (let property of item.requestItems) {
            this.checkAvailability(property, item.transferControlNumber);
          }
        }
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        console.log(error);
      });
  }

  checkAvailability(property, transferControlNumber) {
    const propertyApiService = new PropertyApiService();
    let cartItem = {
      itemControlNumber: property.requestItem.itemControlNumber,
      requestedItemId: property.requestItem.requestedItemId,
    };
    propertyApiService
      .checkAvailability(cartItem)
      .then((response) => {
        if (response.data.status === "Not Available") {
          let notAvailable = this.state.itemAvailability;
          notAvailable.push(transferControlNumber);
          this.setState({
            isAnyItemNotAvailable: true,
            itemAvailability: notAvailable,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkout(tcn, event) {
    if (this.state.itemAvailability.includes(tcn)) {
      const { addToast } = this.props.actions;
      addToast({
        text:
          "Some properties are no longer available. Please remove the items from your cart.",
        type: "error",
        heading: "Error",
      });
    } else {
        event?.stopPropagation();
        history.push({
          pathname: Paths.confirmInformation,
          search: "tcn=" + tcn,
        });
    }
  }

  savePriority(event) {
    const propertyApiService = new PropertyApiService();
    const payload = {
      priorityCode: this.state.priorityDataInternal.priorityId,
      justification: this.state.justification,
    };
    propertyApiService
      .savePropertyPriority(payload, this.state.priorityDataInternal.tcn)
      .then((response) => {
        this.setState({
          revealModal: false,
        });
        this.props.getCartItems();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  isCartEmpty() {
    if (this.props?.cart?.cart?.requests?.length <= 1) {
      if (this.props?.cart?.cart?.requests?.length === 1) {
        return this.props?.cart?.cart?.requests[0]?.requestItems?.length <= 1;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  inputPropertyTextArea = (event) => {
    this.setState({
      justification: event.target.value,
    });
  };

  showPriorityModal(event, priorityData) {
    this.setState({
      revealModal: true,
      priorityDataInternal: priorityData,
      justification: priorityData.justification,
    });
    event?.stopPropagation();
  }
  render() {
    if(this.state.loading){
      return (
        <>
          <div className="loader-container">
            <div className="loader">
              <PPMSSpinner
                animation={"border"}
                variant={"primary"}
                loadingText={"Loading..."}
              />
            </div>
          </div>
        </>
      );
    }else{
      return (
        <>
          <div className="">
            <div className="ui-ppms">
              <div className="grid-row grid-gap">
                <main
                  className="usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs"
                  id="view-cart-page"
                >
                  <h1>View Cart</h1>
                  <h2 className={"ui-ppms"}>
                    <PPMSTitle className={"side-nav-links"}>
                      <div className={"accordion-custom"}>
                      <span className="item-search-result-add-cart">
                        <FaShoppingCart /> {this.props.cart.cart.total} item(s)
                        {this.state.isAnyItemNotAvailable === true && (
                          <button
                            id={"tcn-warning"}
                            type={"button"}
                            className={"usa-button  usa-button--unstyled"}
                            title="toast warning"
                            onMouseEnter={() => {
                              const { addToast } = this.props.actions;
                              addToast({
                                text:
                                  "Some properties are no longer available. Please remove the items from your cart.",
                                type: "error",
                                heading: "Error",
                              });
                            }}
                          >
                            <FaExclamationTriangle />
                          </button>
                        )}
                      </span>
                      </div>
                    </PPMSTitle>
                  </h2>
                  <div className={"grid-row grid-gap-4"}>
                    <div className={"grid-col"}>
                      <PPMSPropertyGroup
                        handleUpdateQuantity={(payload) =>
                          this.props.updateQuantity(payload)
                        }
                        handleDeleteProperty={(id) =>
                          this.props.deleteProperty(id, this.isCartEmpty(), false)
                        }
                        handleDeleteTCN={(icn) =>
                          this.props.deleteTCNInCart(
                            icn,
                            this.isCartEmpty(),
                            false
                          )
                        }
                        requests={this.props.cart.cart.requests}
                        actionType={"Update Quantity"}
                        checkout={this.checkout}
                        showCheckout={true}
                        roles={this.props.roles}
                        unitOfIssue={this.props.unitOfIssue}
                        priorityCodes={this.props.priorityCodes}
                        priorityLabel={"Update Priority"}
                        savePriority={(event) => this.savePriority(event)}
                        showPriorityModal={(event, priorityData) => {
                          this.showPriorityModal(event, priorityData);
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="grid-row grid-gap-4">
                    <div className={"grid-col "}>
                      <PPMSButton
                        id={"search-results"}
                        type={"button"}
                        className={"out-button"}
                        label={"Back to Search Result(s)"}
                        onPress={() =>
                          PageHelper.openPage(
                            Paths.searchProperty +
                            "?" +
                            this.props.cart.searchCriteria
                          )
                        }
                      />
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>

          <div className="grid-row grid-gap-4">
            <PPMSModal
              show={this.state.revealModal}
              handleClose={(event) => {
                this.setState({
                  revealModal: false,
                });
              }}
              handleSave={(event) => {
                this.savePriority(event);
              }}
              title={"Priority"}
              centered={true}
              backdrop={"static"}
              label={"Save"}
              labelCancel={"Cancel"}
              body={
                <ModelContent
                  props={this.props}
                  state={this.state}
                  priorityData={this.state.priorityDataInternal}
                  handleInputPropertyTextArea={this.inputPropertyTextArea}
                />
              }
              id={""}
            />
          </div>
        </>
      );
    }

  }
}

const ModelContent = ({
  props,
  state,
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
        value={state.justification}
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
  priorityCodes: state.common.priorityCodes,
  searchCriteria: state.searchCriteria,
});

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getCartItems: () => {
      dispatch(cartActions.getCartItems());
    },
    updateQuantity: (payload) => {
      dispatch(cartActions.updateQuantity(payload));
    },
    deleteProperty: (id, isCartEmpty, isCheckoutEmpty) => {
      dispatch(cartActions.deleteProperty(id, isCartEmpty, isCheckoutEmpty));
    },
    deleteTCNInCart: (id, isCartEmpty, isCheckoutEmpty) => {
      dispatch(cartActions.deleteTCNInCart(id, isCartEmpty, isCheckoutEmpty));
    },
    getPriorityCodes: () => {
      dispatch(commonActions.getPriorityCodes());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewCart);
