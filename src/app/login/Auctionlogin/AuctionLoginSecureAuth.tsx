import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import queryString from "query-string";
import { connect } from "react-redux";
import { history } from "../../../_redux/_helpers/history";
import { userActions } from "../../../_redux/_actions/user.actions";
const LoginSecureAuth = (...props: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    let search =
      history.location.state &&
      history.location.state.from &&
      history.location.state.from.search
        ? history.location.state.from.search
        : "";
    let query = queryString.parse(search);
    if (!props[0].loggedIn && query["key"] && query["key"] != null) {
      let key: any = query["key"];
      dispatch(userActions.loginSecureAuth(key));
    }
  }, []);
  return <></>;
};
const mapStateToProps = (state) => ({
  authentication: state.authentication,
  loggedIn: state.authentication.loggedIn,
  user: state.authentication.user,
  permissions: state.authentication.permissions,
  aacs: state.authentication.aacs,
  roles: state.authentication.roles,
});
export default connect(mapStateToProps)(LoginSecureAuth);
