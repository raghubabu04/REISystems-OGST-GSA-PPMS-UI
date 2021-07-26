import { cartConstants } from "../_constants/cart.constants";

const initState = {
  cart: {},
  tcnDetails: {},
};

export function cart(state = initState, action) {
  switch (action.type) {
    case cartConstants.GET_CART_ITEMS_REQUEST:
    case cartConstants.ADD_TO_CART_REQUEST:
    case cartConstants.UPDATE_QUANTITY_REQUEST:
    case cartConstants.DELETE_PROPERTY_REQUEST:
    case cartConstants.SEARCH_CRITERIA_REQUEST:
    case cartConstants.GET_TCN_ITEMS_REQUEST:
      return {
        ...state,
      };
    case cartConstants.GET_CART_ITEMS_SUCCESS:
    case cartConstants.UPDATE_QUANTITY_SUCCESS:
    case cartConstants.DELETE_PROPERTY_SUCCESS:
      return {
        ...state,
        cart: action.cart,
        error: "",
      };
    case cartConstants.ADD_TO_CART_SUCCESS:
      return {
        ...state,
        cart: action.cart,
        successData: action.successData,
        error: "",
      };
    case cartConstants.GET_CART_ITEMS_FAIL:
      return {
        ...state,
        cart: {},
        error: action.error,
      };
    case cartConstants.SEARCH_CRITERIA_SUCCESS:
      return {
        ...state,
        searchCriteria: action.searchQueryString,
      };
    case cartConstants.UPDATE_QUANTITY_FAIL:
    case cartConstants.DELETE_PROPERTY_FAIL:
      return {
        ...state,
        error: action.error,
      };
    case cartConstants.ADD_TO_CART_FAIL:
      return {
        ...state,
        error: action.error,
        errorData: action.errorData,
      };
    case cartConstants.ADD_SHIPPING:
      return {
        ...state,
        shippingAddress: action.shippingAddress,
        shippingAttn: action.shippingAttn,
      };
    case cartConstants.SUBMIT_ORDER_SUCCESS:
    case cartConstants.SUBMIT_DIRECT_REQUISITION_SUCCESS:
      return {
        ...state,
        confirmedRequest: action.confirmedRequest,
      };
    case cartConstants.GET_TCN_ITEMS_SUCCESS:
      return {
        ...state,
        tcnDetails: action.tcnDetails,
        error: "",
      };
    default:
      return state;
  }
}
