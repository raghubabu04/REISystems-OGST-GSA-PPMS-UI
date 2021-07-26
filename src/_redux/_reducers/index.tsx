import { combineReducers } from "redux";
import { authentication } from "./authentication.reducer";
import { alert } from "./alert.reducer";
import { connectRouter } from "connected-react-router";
import { cart } from "./cart.reducer";
import { common } from "./common.reducer";
import { sale } from "./sale.reducer";
import toasts from "./toasts.reducer";
import loader from "./loader.reducer";

const rootReducer = (history) =>
  combineReducers({
    authentication,
    cart,
    sale,
    alert,
    toasts,
    loader,
    common,
    router: connectRouter(history),
  });

export default rootReducer;
