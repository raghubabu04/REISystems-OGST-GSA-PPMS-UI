import { HIDE_LOADER, SHOW_LOADER } from "../_constants/loader.constants";

export const showLoader = () => (dispatch) => {
  dispatch({
    type: SHOW_LOADER,
  });
};

export const hideLoader = () => (dispatch) => {
  dispatch({
    type: HIDE_LOADER,
  });
};
