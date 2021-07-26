import React from "react";
import { Link } from "react-router-dom";
import { PPMSProperty } from "../../../ui-kit/components/property/PPMS-property";
import { Paths } from "../../Router";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import { connect } from "react-redux";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import PPMSTitle from "../../../ui-kit/components/common/header/components/PPMS-title";
import { FaShoppingCart, FaExclamationTriangle } from "react-icons/fa";
import { cartActions } from "../../../_redux/_actions/cart.actions";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";

interface PropertySearchListProps {
  title: string;
  items: any[];
  quantity?: number;
  addCartType?: "Add to Cart" | "Update Quantity";
  recallItemType?: "Recall Item";
  handleAddToCart?: any;
  defaultSortField?: string;
  loading?: boolean;
  rowsPerPageOptions?: any[];
  page?: number;
  totalRows?: number;
  totalPages?: number;
  rowsPerPage?: number;
  isPaginationEnabled?: boolean;
  totalCartItems?: number;
  onChangePage?: any;
  propertiesInCart?: any[];
  roles?: any;
  priorityCodes?: any[];
  getPriorityCodes: any;
  updateQuantity?: any;
  propertyHistoryFlag?: boolean;
  actions: any;
}
interface PropertySearchListState {
  unitOfIssueList?: any;
  isAnyItemNotAvailable: boolean;
}

export const recallRecords = [
  {
    id: "internal",
    value: "Recall for Internal Screening",
    isSelected: false,
  },
  {
    id: "external",
    value: "Recall for External Screening",
    isSelected: false,
  },
];
class PropertySearchList extends React.Component<
  PropertySearchListProps,
  PropertySearchListState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      unitOfIssueList: [],
      isAnyItemNotAvailable: false,
    };
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }
  private commonApiService = new CommonApiService();
  private propertyApiService = new PropertyApiService();

  handleAddToCart = (event) => {
    this.props.handleAddToCart(event);
  };

  handleUpdateQuantity = (event) => {
    this.props.updateQuantity(event);
  };

  componentDidMount() {
    this.commonApiService
      .getUnitList()
      .then((unit) => {
        this.setState({
          unitOfIssueList: unit.data,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    this.props.getPriorityCodes();
    this.getCartItemsForUser();
  }

  getCartItemsForUser() {
    const propertyApiService = new PropertyApiService();
    propertyApiService
      .getCartItems()
      .then((response) => {
        for (let item of response.data.requests) {
          for (let property of item.requestItems) {
            this.checkAvailability(property);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkAvailability(property) {
    const propertyApiService = new PropertyApiService();
    let cartItem = {
      itemControlNumber: property.requestItem.itemControlNumber,
      requestedItemId: property.requestItem.requestedItemId,
    };
    propertyApiService
      .checkAvailability(cartItem)
      .then((response) => {
        if (response.data.status === "Not Available") {
          this.setState({
            isAnyItemNotAvailable: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  savePriority(payload, propertyId) {
    this.propertyApiService
      .savePropertyPriority(payload, propertyId)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        <SearchResults
          title={this.props.title}
          items={this.props.items}
          addCartType={this.props.addCartType}
          quantity={this.props.quantity}
          handleAddToCart={this.props.handleAddToCart}
          defaultSortField={this.props.defaultSortField}
          loading={this.props.loading}
          rowsPerPageOptions={this.props.rowsPerPageOptions}
          page={this.props.page}
          totalRows={this.props.totalRows}
          totalPages={this.props.totalPages}
          rowsPerPage={this.props.rowsPerPage}
          isPaginationEnabled={this.props.isPaginationEnabled}
          totalCartItems={this.props.totalCartItems}
          onChangePage={this.props.onChangePage}
          propertiesInCart={this.props.propertiesInCart}
          roles={this.props.roles}
          unitOfIssueList={this.state.unitOfIssueList}
          priorityCodes={this.props.priorityCodes}
          savePriority={(payload, propertyId) =>
            this.savePriority(payload, propertyId)
          }
          handleUpdateQuantity={this.props.updateQuantity}
          propertyHistoryFlag={this.props.propertyHistoryFlag}
          actions={this.props.actions}
          isAnyItemUnavailable={this.state.isAnyItemNotAvailable}
        />
      </div>
    );
  }
}
function SearchResults({
  title = "",
  addCartType,
  items = [],
  quantity = 0,
  handleAddToCart,
  handleUpdateQuantity,
  defaultSortField = "",
  loading = false,
  rowsPerPageOptions,
  page = 1,
  totalRows = 0,
  totalPages = 0,
  rowsPerPage = 10,
  isPaginationEnabled = true,
  totalCartItems = 0,
  onChangePage,
  propertiesInCart = [],
  roles,
  unitOfIssueList,
  priorityCodes,
  savePriority,
  propertyHistoryFlag,
  actions,
  isAnyItemUnavailable,
}) {
  return (
    <>
      <div className="item-search-result">
        <PPMSTitle>
          <h2 className="h-red">{title} <span> - {items && items.length} Results</span></h2>
          {canAddToCart() && (
            <span className="item-search-result-add-cart">
              <Link to={Paths.viewCart}>
                <FaShoppingCart title={"View Cart"} />
                View Cart ({totalCartItems})
              </Link>
              {isAnyItemUnavailable === true && (
                <button
                  id={"tcn-warning"}
                  type={"button"}
                  className={"usa-button  usa-button--unstyled"}
                  title="toast warning"
                  onMouseEnter={() => {
                    const { addToast } = actions;
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
          )}
        </PPMSTitle>
      </div>
      <div className="item-search-result">
        <PPMSPagination
          page={page}
          pageSize={rowsPerPage}
          totalRows={totalRows}
          onChangePage={onChangePage}
        />
      </div>
      <div className="item-search-result-wrapper">
        {items.map((item, index) => (
          <PPMSProperty
            key={item.propertyId}
            propertyId={item.propertyId}
            icn={item.itemControlNumber}
            itemName={item.itemName}
            location={
              item.propertyLocationDTO
                ? propertyLocation(item.propertyLocationDTO)
                : ""
            }
            itemStatus={item.itemStatus}
            federalSupplyClass={item.fscCode}
            fairMarketValue={item.fairMarketValue}
            conditionCode={item.conditionCode}
            originalAcquisitionCost={item.originalAcquisitionCost}
            unitOfIssueValue={unitOfIssueList?.map((u) => {
              if (u?.code === item?.unitOfIssue) {
                return u.description;
              }
            })}
            reimbursementRequired={item.reimbursementRequired}
            categoryName={item.categoryName}
            agencyBureau={item.agencyBureau}
            date_release={item.excessReleaseDate}
            categoryCode={item.categoryCode}
            qty_available={item.quantityAvailable}
            qty_requested={item.quantityRequested}
            qtyTransferred={item.quantityTransferred}
            quantity={getCartCount(item.itemControlNumber, propertiesInCart)}
            thumb_image={item.presignedUrl}
            addCartType={addCartType ? addCartType : "Add to Cart"}
            handleAddToCart={handleAddToCart}
            cartCount={getCartCount(item.itemControlNumber, propertiesInCart)}
            priorityId={getPriorityId(item.itemControlNumber, propertiesInCart)}
            requestedItemId={getRequestItemId(
              item.itemControlNumber,
              propertiesInCart
            )}
            surplusReleaseDate={item.surplusReleaseDate}
            priorityCodes={priorityCodes}
            savePriority={savePriority}
            roles={roles}
            priorityLabel={"Select Priority"}
            internal={item.internal}
            fscDescription={item.fscDescription}
            handleUpdateQuantity={handleUpdateQuantity}
            propertyHistoryFlag={propertyHistoryFlag}
            qty_req_by_me={item.quantityReqByMe}
            recallRecords={recallRecords}
            creationSource={item.creationSource}
            vaultLocation={item.vaultLocation}
            vaultShelfNumber={item.vaultShelfNumber}
            administration={item.administration}
            donorName={item.donorName}
            recipientName={item.recipientName}
            donorCountry={item.donorCountry}
            fiscalYear={item.fiscalYear}
          />
        ))}
      </div>
      <div className="item-search-result">
        <PPMSPagination
          page={page}
          pageSize={rowsPerPage}
          totalRows={totalRows}
          onChangePage={onChangePage}
        />
      </div>
    </>
  );
  function propertyLocation(location: any) {
    let city = location.city ? location.city + ", " : "";
    let state = location.stateCode ? location.stateCode + " " : "";
    let zip1 = location.zip ? location.zip : "";
    let zip2 = location.zip2 ? "-" + location.zip2 : "";

    return city + state + zip1 + zip2;
  }
  function getCartCount(itemControlNumber: any, propertiesInCart) {
    let cartCount = 0;
    propertiesInCart?.forEach((tcn) => {
      let requestItems = tcn.requestItems;
      requestItems.forEach((requestItem) => {
        if (requestItem.requestItem.itemControlNumber === itemControlNumber) {
          cartCount = requestItem.requestItem.cartCount;
        }
      });
    });
    return cartCount;
  }
  function getPriorityId(itemControlNumber: any, propertiesInCart) {
    let priority = "";
    propertiesInCart?.forEach((tcn) => {
      let requestItems = tcn.requestItems;
      requestItems.forEach((requestItem) => {
        if (requestItem.requestItem.itemControlNumber === itemControlNumber) {
          priority = requestItem.requestItem.priorityCode;
        }
      });
    });
    return priority;
  }
  function getRequestItemId(itemControlNumber: any, propertiesInCart) {
    let requestItemId = "";
    propertiesInCart?.forEach((tcn) => {
      let requestItems = tcn.requestItems;
      requestItems.forEach((requestItem) => {
        if (requestItem.requestItem.itemControlNumber === itemControlNumber) {
          requestItemId = requestItem.requestItem.requestedItemId;
        }
      });
    });
    return requestItemId;
  }
  function canAddToCart() {
    if (
      roles?.isNU ||
      roles?.isSM ||
      roles?.isAC ||
      roles?.isFG ||
      (roles?.isSA && roles?.isMU) ||
      roles?.isIF ||
      roles?.isSP
    ) {
      return true;
    }
    return false;
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  roles: state.authentication.roles,
  priorityCodes: state.common.priorityCodes,
});

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getPriorityCodes: () => {
      dispatch(commonActions.getPriorityCodes());
    },
    updateQuantity: (payload) => {
      dispatch(cartActions.updateQuantity(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertySearchList);
