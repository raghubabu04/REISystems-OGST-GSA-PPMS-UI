import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import queryString from "query-string";
import {userActions} from "../../_redux/_actions/user.actions";

const LoginSecureAuth = (...props: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    let search =
      props[0]?.location?.search
        ? props[0].location?.search
        : "";
    let query = queryString.parse(search);
    if (query["key"] && query["key"] != null) {
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
