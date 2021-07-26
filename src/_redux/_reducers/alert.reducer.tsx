import { alertConstants } from "../_constants/alert.constants";

export function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: "usa-alert--success",
        message: action.message,
      };
    case alertConstants.ERROR:
      return {
        type: "usa-alert--error",
        message: action.message,
      };
    case alertConstants.WARNING:
      return {
        type: "usa-alert--warning",
        message: action.message,
      };
    case alertConstants.INFO:
      return {
        type: "usa-alert--info",
        message: action.message,
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state;
  }
}
