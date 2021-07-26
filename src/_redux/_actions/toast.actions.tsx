import createToast from "../_helpers/createToast";
import { ADD_TOAST, REMOVE_TOAST } from "../_constants/toast.constants";

export function addToast(options = {}) {
  const toast = createToast(options);
  return (dispatch) => {
    dispatch(addToastValue(toast));
    const id = toast.id;
    if(!toast.toastActive){
    setTimeout(function () {
      dispatch(removeToast(id));
    }, 10000);
  }
  };
}
function addToastValue(toast) {
  return {
    payload: toast,
    type: ADD_TOAST,
  };
}

export function removeToast(id) {
  return {
    payload: id,
    type: REMOVE_TOAST,
  };
}
