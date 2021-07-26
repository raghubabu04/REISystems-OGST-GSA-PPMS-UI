import {userConstants} from "../_constants/user.constants";
import {getUserAACs as aacs, getUserInfo as user, getUserPermissions as permissions} from "../_helpers/auth-header";
import {getRoles as roles, getZones} from "../_helpers/roles";

const initialState = user()
  ? {
    loggedIn: true,
    isBidder: user().bidderUser,
    user: user(),
    aacs: aacs(),
    roles: roles(),
    zones: getZones(),
      permissions: permissions(),
      userStatus: "ACTIVE",
    invalidUser: false
    }
  : { loggedIn: false, isBidder: false,user: {}, aacs: {}, roles: { isVisitor: true }, userStatus: "ACTIVE", invalidUser: false };

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        isBidder:action?.user?.bidderUser,
        loggedIn: false,
        user: action.user,
        permissions: action.permissions,
        aacs: action.aacs,
        roles: action.roles,
        zones: action?.zones
      };
    case userConstants.LOGIN_SUCCESS:
    case userConstants.SESSION_EXTEND_SUCCESS:
      return {
        loggedIn: true,
        isBidder: action?.user?.bidderUser,
        user: action.user,
        permissions: action.permissions,
        aacs: action.aacs,
        roles: action.roles,
        zones: action?.zones,
        userStatus: "ACTIVE",
      };
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        isBidder: action?.user?.bidderUser,
        user: {},
        permissions: [],
        aacs: [],
        zones: [],
        roles: {},
        userStatus: "ACTIVE",
        invalidUser: true
      };
    case userConstants.LOGOUT:
      return {
        loggedIn: false,
        isBidder:action?.user?.bidderUser,
        user: {},
        permissions: [],
        aacs: [],
        zones: [],
        roles: {},
        userStatus: "ACTIVE"
      };
    case userConstants.LOGIN_LOCKED:
      return {
        loggedIn: false,
        isBidder:action?.user?.bidderUser,
        user: {},
        permissions: [],
        aacs: [],
        zones: [],
        roles: {},
        userStatus:"LOCKED",
      };
    default:
      return state;
  }
}
