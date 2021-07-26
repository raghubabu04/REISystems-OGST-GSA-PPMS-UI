import { HIDE_LOADER, SHOW_LOADER } from "../_constants/loader.constants";

const initialState = {
  loading: false,
};
const loader = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, loading: true };

    case HIDE_LOADER:
      return { ...state, loading: false };

    default:
      return state;
  }
};
export default loader;
