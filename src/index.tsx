import "react-app-polyfill/ie11";
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { history } from "./_redux/_helpers/history";
import { store } from "./_redux/_helpers/store";
import { ConnectedRouter } from "connected-react-router";
import PPMSFooter from "./ui-kit/components/PPMS-footer";
import HeaderNav from "./app/common/HeaderNav";
import "./styles/bootstrap.css";
import "uswds/dist/css/uswds.min.css";
import "./styles/ppms.css";
import { App } from "./app/App";
import Loader from "./_redux/_components/Loader";
import PPMSScrollToTop from "./ui-kit/components/common/PPMS-scroll-to-top";

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <HeaderNav />
      <PPMSScrollToTop />
      <App />
      <PPMSFooter />
      <Loader />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("main-content")
);
