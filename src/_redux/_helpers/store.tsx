import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";
import rootReducer from "../_reducers";
import { history } from "./history";
import { composeWithDevTools } from "redux-devtools-extension";

const loggerMiddleware = createLogger();
//TODO Replace import of composeWithDevTools with https://github.com/zalmoxisus/redux-devtools-extension/blob/master/README.md#14-using-in-production
export const store = createStore(
  rootReducer(history),
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(history),
      loggerMiddleware
    )
  )
);
