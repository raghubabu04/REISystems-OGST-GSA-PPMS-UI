import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { history } from "../_redux/_helpers/history";
import { Router } from "./Router";
import { alertActions } from "../_redux/_actions/alert.actions";
import SessionTimeout from "./login/SessionTimeout";
import Toasts from "../_redux/_components/Toasts";
import Common from "./common/Common";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen(() => {
      dispatch(alertActions.clear());
    });
  }, [dispatch]);
  return (
    <section className="grid-container-widescreen">
      <>
        <SessionTimeout />
        <Router />
        <Toasts />
        <Common />
      </>
    </section>
  );
}

export { App };
