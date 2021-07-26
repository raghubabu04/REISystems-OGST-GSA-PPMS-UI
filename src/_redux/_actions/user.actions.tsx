import React from "react";
import { userConstants } from "../_constants/user.constants";
import { getUserAACs, getUserInfo, getUserPermissions, } from "../_helpers/auth-header";
import { history } from "../_helpers/history";
import { AuthApiService } from "../../api-kit/auth/auth-api.service";
import { PageHelper, Paths } from "../../app/Router";
import { getRoles, getZones } from "../_helpers/roles";
import { Environment } from "../../environments/environment";
import { UserUtils } from "../../utils/UserUtils";
import { UserApiService } from "../../api-kit/user/user-api.service";

export const userActions = {
  login,
  switchAccount,
  loginSecureAuth,
  logout,
  extendSession,
  defaultUser,
};
const pingInterval = Environment.PING_INTERVAL
  ? Environment.PING_INTERVAL
  : 780000;

let interval;

function success(user, permissions, aacs, roles, zones) {
  return {
    type: userConstants.LOGIN_SUCCESS,
    user,
    permissions,
    aacs,
    roles,
    zones,
  };
}

function locked(user, permissions, aacs, roles, zones) {
  return {
    type: userConstants.LOGIN_LOCKED,
    user,
    permissions,
    aacs,
    roles,
    zones,
  };
}

function failure(error) {
  return { type: userConstants.LOGIN_FAILURE, error };
}

function login(res: any) {
  const authApiService = new AuthApiService();
  const userApiService = new UserApiService();
  return (dispatch) => {
    const user = res.user;
    dispatch(request({ user }));
    authApiService
      .getOktaAuthenticationToken(res.session.token)
      .then((res: any) => {
        if (res.data.jwtToken) {
          let jwtToken = res.data.jwtToken;
          localStorage.setItem("usertoken", jwtToken);
          const user = getUserInfo();
          const permissions = getUserPermissions();
          const aacs = getUserAACs();
          const roles = getRoles();
          const zones = getZones();
          if (user.userStatus !== "LOCKED") {
            dispatch(success(user, permissions, aacs, roles, zones));
            extendSessionInterval(dispatch);
            if (user?.userType === "UND" && user?.userAccounts?.length === 0) {
              history.push(Paths.switchUserAccount);
            } else if (user?.userType === "BIDDERS") {
              userApiService
                .getBidderVersionNumber()
                .then((res: any) => {
                  if (user?.bidderAccountsSize > 1) {
                    if (user?.bidderVersionNumber === "" || user?.bidderVersionNumber === null || res?.data.toString() !== user?.bidderVersionNumber) {
                      history.push(Paths.summaryOfChanges);
                    } else {
                      history.push(Paths.switchBidderAccount);
                    }
                  } else {
                    if (user?.bidderVersionNumber === "" || user?.bidderVersionNumber === null || res?.data.toString() !== user?.bidderVersionNumber) {
                      history.push(Paths.summaryOfChanges);
                    } else {
                      history.push(Paths.home);
                    }
                  }
                })
                .catch((error: any) => {
                  console.log(error);
                })
            } else {
              history.push(Paths.home);
            }
          } else {
            dispatch(locked(user, permissions, aacs, roles, zones));
            localStorage.setItem("usertoken", "");
          }
        }
      })
      .catch((error) => {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        dispatch(failure(error.toString()));
        clearInterval(interval);
        localStorage.setItem("usertoken", "");
      });
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
}

function switchAccount(accountId) {
  const authApiService = new AuthApiService();
  return (dispatch) => {
    authApiService
      .getUpdatedOktaAuthenticationToken(accountId)
      .then((response: any) => {
        if (response.data.jwtToken) {
          let jwtToken = response.data.jwtToken;
          localStorage.setItem("usertoken", jwtToken);
          const user = getUserInfo();
          const permissions = getUserPermissions();
          const aacs = getUserAACs();
          const roles = getRoles();
          const zones = getZones();
          if (user.userStatus !== "LOCKED") {
            dispatch(success(user, permissions, aacs, roles, zones));
            extendSessionInterval(dispatch);
            PageHelper.openPage(Paths.home);
          } else {
            dispatch(locked(user, permissions, aacs, roles, zones));
            localStorage.setItem("usertoken", "");
          }
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        clearInterval(interval);
        localStorage.setItem("usertoken", "");
      });
  };
}

function defaultUser() {
  return { type: userConstants.LOGIN_DEFAULT };
}

const loginSuccess = (success, user, permissions, aacs, roles) => (
  dispatch
) => {
  dispatch(success(user, permissions, aacs, roles));
  return Promise.resolve();
};

function loginSecureAuth(key: any) {
  const authApiService = new AuthApiService();
  return (dispatch) => {
    const checkKey = key ? key : null;
    if (checkKey) {
      dispatch(request({}));
      authApiService
        .getUserSessionByKey(checkKey)
        .then((res: any) => {
          if (res.data.jwtToken) {
            let jwtToken = res.data.jwtToken;
            const userInfo = JSON.parse(UserUtils.parseJwt(jwtToken).usertoken);
            if (userInfo.userStatus === "LOCKED") {
              PageHelper.openPage(Paths.userLocked);
            } else {
              localStorage.setItem("usertoken", jwtToken);
              const user = getUserInfo();
              const permissions = getUserPermissions();
              const aacs = getUserAACs();
              const roles = getRoles();
              dispatch(
                loginSuccess(success, user, permissions, aacs, roles)
              ).then(() => {
                if (user?.userType === "UND" && user?.userAccounts?.length === 0) {
                  history.push(Paths.switchUserAccount);
                }
                if (user?.userType === "BIDDERS" && user?.bidderAccountsSize > 1) {
                  history.push(Paths.switchBidderAccount);
                } else {
                  history.push(Paths.home);
                }
              });
              extendSessionInterval(dispatch);
            }
          } else {
            clearInterval(interval);
            localStorage.setItem("usertoken", "");
            PageHelper.openPage(Paths.login);
          }
        })
        .catch((error) => {
          dispatch(failure(error.toString()));
          clearInterval(interval);
          localStorage.setItem("usertoken", "");
          PageHelper.openPage(Paths.login);
        });
    } else {
      dispatch(failure("Key Not Found."));
    }
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }

  function success(user, permissions, aacs, roles) {
    return {
      type: userConstants.LOGIN_SUCCESS,
      user,
      permissions,
      aacs,
      roles,
    };
  }

  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  localStorage.setItem("usertoken", "");
  if (
    history.location &&
    history.location.state &&
    history.location.state.from
  ) {
    const state = { ...history.location.state };
    delete state.from;
    history.replace({ ...history.location, state });
  }
  //TODO call backend service to destroy token if needed
  clearInterval(interval);
  return { type: userConstants.LOGOUT };
}

function extendSession() {
  const authApiService = new AuthApiService();
  return (dispatch) => {
    const user = getUserInfo();
    dispatch(request({ user }));
    authApiService
      .extendSession()
      .then((res: any) => {
        if (res.data.jwtToken) {
          let jwtToken = res.data.jwtToken;
          localStorage.setItem("usertoken", jwtToken);
          const user = getUserInfo();
          const permissions = getUserPermissions();
          const aacs = getUserAACs();
          const roles = getRoles();
          const zones = getZones();
          dispatch(success(user, permissions, aacs, roles, zones));
        }
      })
      .catch((error) => {
        dispatch(failure(error.toString()));
        clearInterval(interval);
        localStorage.setItem("usertoken", "");
      });
  };

  function request(user) {
    return { type: userConstants.SESSION_EXTEND_REQUEST };
  }

  function success(user, permissions, aacs, roles, zones) {
    return {
      type: userConstants.SESSION_EXTEND_SUCCESS,
      user,
      permissions,
      aacs,
      roles,
      zones,
    };
  }

  function failure(error) {
    return { type: userConstants.SESSION_EXTEND_FAILURE, error };
  }
}

function extendSessionInterval(dispatch) {
  interval = setInterval(() => {
    if (localStorage.getItem("userToken") !== "") {
      if (!document.hidden) {
        dispatch(userActions.extendSession());
      }
    } else {
      dispatch(userActions.logout());
      PageHelper.openPage(Paths.login);
      window.location.reload();
    }
  }, pingInterval);
}
