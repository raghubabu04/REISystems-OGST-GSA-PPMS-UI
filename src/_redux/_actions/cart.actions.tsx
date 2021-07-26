import {
  cartConstants,
  cartErrorConstants,
} from "../_constants/cart.constants";
import { PropertyApiService } from "../../api-kit/property/property-api-service";
import { history } from "../_helpers/history";
import { Paths } from "../../app/Router";
import { addToast } from "./toast.actions";
import { UserUtils } from "../../utils/UserUtils";
import { UserApiService } from "../../api-kit/user/user-api.service";
import { formatExtension, formatPhone } from "../../ui-kit/utilities/FormatUtil";

export const cartActions = {
  getCartItems,
  addToCart,
  updateQuantity,
  deleteProperty,
  deleteTCNInCart,
  addShipping,
  submitOrder,
  submitDirectRequisition,
  updateSearchCriteria,
  getTCNDetails,
  deleteRequestedProperty,
  updatedRequestedItemQuantity,
};

function getCartItems() {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request());
    propertyApiService
      .getCartItems()
      .then((response: any) => {
        let cart = response.data;
        dispatch(success(cart));
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };
  function request() {
    return { type: cartConstants.GET_CART_ITEMS_REQUEST };
  }
  function success(cart) {
    return { type: cartConstants.GET_CART_ITEMS_SUCCESS, cart };
  }
  function failure() {
    return {
      type: cartConstants.GET_CART_ITEMS_FAIL,
      error: cartErrorConstants.GET_CART_ITEMS_FAIL,
    };
  }
}
function addToCart(payload: any) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .addToCart(payload)
      .then((response) => {
        let cart = response.data;
        dispatch(success(cart, payload));
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure(payload));
      });
  };
  function request(cart) {
    return {
      type: cartConstants.ADD_TO_CART_REQUEST,
      cart,
    };
  }
  function success(cart, payload) {
    return {
      type: cartConstants.ADD_TO_CART_SUCCESS,
      cart,
      successData: payload,
    };
  }
  function failure(payload) {
    return {
      type: cartConstants.ADD_TO_CART_FAIL,
      error: cartErrorConstants.ADD_TO_CART_FAIL,
      errorData: payload,
    };
  }
}

function deleteProperty(id, isCartEmpty, isCheckoutEmpty) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .deleteCartItem(id)
      .then((response) => {
        let cart = response.data;
        dispatch(success(cart));
        if (isCheckoutEmpty) {
          if (isCartEmpty) {
            history.push(Paths.searchProperty);
          } else {
            history.push(Paths.viewCart);
          }
        } else if (isCartEmpty) {
          history.push(Paths.searchProperty);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };

  function request(cart) {
    return {
      type: cartConstants.DELETE_PROPERTY_REQUEST,
      cart,
    };
  }
  function success(cart) {
    return {
      type: cartConstants.DELETE_PROPERTY_SUCCESS,
      cart,
    };
  }
  function failure() {
    return {
      type: cartConstants.DELETE_PROPERTY_FAIL,
      error: cartErrorConstants.DELETE_PROPERTY_FAIL,
    };
  }
}

function deleteRequestedProperty(id, tcn) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .deleteCartItem(id)
      .then(() => {
        dispatch(cartActions.getTCNDetails(tcn));
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };

  function request(cart) {
    return {
      type: cartConstants.DELETE_PROPERTY_REQUEST,
      cart,
    };
  }
  function failure() {
    return {
      type: cartConstants.DELETE_PROPERTY_FAIL,
      error: cartErrorConstants.DELETE_PROPERTY_FAIL,
    };
  }
}

function deleteTCNInCart(id, isCartEmpty, isCheckoutEmpty) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .deleteTCN(id)
      .then((response) => {
        let cart = response.data;
        dispatch(success(cart));
        if (isCheckoutEmpty) {
          if (isCartEmpty) {
            history.push(Paths.searchProperty);
          } else {
            history.push(Paths.viewCart);
          }
        } else if (isCartEmpty) {
          history.push(Paths.searchProperty);
        } else {
          history.push(Paths.viewCart);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };
  function request(cart) {
    return {
      type: cartConstants.DELETE_PROPERTY_REQUEST,
      cart,
    };
  }
  function success(cart) {
    return {
      type: cartConstants.DELETE_PROPERTY_SUCCESS,
      cart,
    };
  }
  function failure() {
    return {
      type: cartConstants.DELETE_PROPERTY_FAIL,
      error: cartErrorConstants.DELETE_TCN_FAIL,
    };
  }
}

function updateQuantity(payload) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .updateQuantity(payload)
      .then((response) => {
        let cart = response.data;
        dispatch(success(cart));
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };
  function request(cart) {
    return {
      type: cartConstants.UPDATE_QUANTITY_REQUEST,
      cart,
    };
  }
  function success(cart) {
    return {
      type: cartConstants.UPDATE_QUANTITY_SUCCESS,
      cart,
    };
  }
  function failure() {
    return {
      type: cartConstants.UPDATE_QUANTITY_FAIL,
      error: cartErrorConstants.UPDATE_QUANTITY_FAIL,
    };
  }
}

function updatedRequestedItemQuantity(payload, tcn) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .updateQuantity(payload)
      .then(() => {
        dispatch(cartActions.getTCNDetails(tcn));
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };
  function request(cart) {
    return {
      type: cartConstants.UPDATE_QUANTITY_REQUEST,
      cart,
    };
  }

  function failure() {
    return {
      type: cartConstants.UPDATE_QUANTITY_FAIL,
      error: cartErrorConstants.UPDATE_QUANTITY_FAIL,
    };
  }
}

function updateSearchCriteria(queryParamString) {
  return (dispatch) => {
    dispatch(request());
    dispatch(success(queryParamString));
    function request() {
      return { type: cartConstants.SEARCH_CRITERIA_REQUEST };
    }
    function success(searchQueryString) {
      return { type: cartConstants.SEARCH_CRITERIA_SUCCESS, searchQueryString };
    }
  };
}

function addShipping(data) {
  return {
    type: cartConstants.ADD_SHIPPING,
    data,
  };
}

function submitOrder(data) {
  const propertyApiService = new PropertyApiService();
  const userApiService = new UserApiService();
  const perm = UserUtils.getUserPermissions();

  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .checkoutCart(data)
      .then((response) => {
        let data = response.data;
        let doneeData;
        if (data.request.leaUserId) {
          const leadata = {
            params: {
              userAccountId: data.request.leaUserId,
            },
          };
    
          userApiService.getUser(leadata).then((res: any) => {
            if (res.data !== null && res.status === 200) {
              let leaInfo = res.data?.leaInformationDTO;

               doneeData = {
                doneeleaUserId: leadata.params.userAccountId,
                doneeTileEmail: res.data?.emailAddress,
                doneeTileFirstName: res.data?.firstName,
                doneeTileMiddleName: res.data?.middleName,
                doneeTileLastName: res.data?.lastName,
                doneeTilePhoneNumber: res.data?.phoneNumber
                  ? formatPhone(res.data?.phoneNumber + "")
                  : "",
                doneeTilePhoneExt: res.data?.phoneExt
                  ? formatExtension(res.data?.phoneExt + "")
                  : "",
                doneeTileOrg: leaInfo?.doneeOrganizationName,
                doneeTileTitle: leaInfo?.title,
              }    
              data.doneeinfo = doneeData;
              dispatch(success(data));
              history.push(Paths.submission);       
            }
            else
            {
              data.doneeinfo = doneeData;
              dispatch(success(data));
              history.push(Paths.submission);
            }
          })
          .catch((error) => {
            console.log(error);
            dispatch(failure());
          });
        }   
        else
        {
          data.doneeinfo = doneeData;
          dispatch(success(data));
          history.push(Paths.submission);
        }    
      })
      .catch((error) => {
        console.log(error);
        dispatch(failure());
      });
  };
  function request(cart) {
    return {
      type: cartConstants.SUBMIT_ORDER_REQUEST,
      cart,
    };
  }
  function success(confirmedRequest) {
    return {
      type: cartConstants.SUBMIT_ORDER_SUCCESS,
      confirmedRequest,
    };
  }
  function failure() {
    return {
      type: cartConstants.SUBMIT_ORDER_FAIL,
      error: cartErrorConstants.SUBMIT_ORDER_FAIL,
    };
  }
}

function submitDirectRequisition(data) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request({}));
    propertyApiService
      .directRequisition(data)
      .then((response) => {
        let data = response.data;
        dispatch(success(data));
        history.push(Paths.submission);
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          addToast({
            text: "Request cannot be submitted.",
            type: "error",
            heading: "Error",
          })
        );
        dispatch(failure());
      });
  };
  function request(cart) {
    return {
      type: cartConstants.SUBMIT_DIRECT_REQUISITION_REQUEST,
      cart,
    };
  }
  function success(confirmedRequest) {
    console.log(confirmedRequest);
    return {
      type: cartConstants.SUBMIT_DIRECT_REQUISITION_SUCCESS,
      confirmedRequest,
    };
  }
  function failure() {
    return {
      type: cartConstants.SUBMIT_DIRECT_REQUISITION_FAIL,
      error: cartErrorConstants.SUBMIT_DIRECT_REQUISITION_FAIL,
    };
  }
}

function getTCNDetails(tcn) {
  const propertyApiService = new PropertyApiService();
  return (dispatch) => {
    dispatch(request(tcn));
    propertyApiService
      .getTCNDetails(tcn)
      .then((response: any) => {
        let tcnDetails = response.data;
        dispatch(success(tcnDetails));
        if (tcnDetails.transferControlNumber === null) {
          history.push(Paths.myRequests);
        }
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
