import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";
import { Links } from "../../app/Router";
import queryString from "query-string";
import LoginSecureAuth from "../../app/login/LoginSecureAuth";

const PrivateRouteComponent = ({
  component: Component,
  authentication,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      //checking for user is authenticated and page authorized
       !checkSecureAuthKey(props) ? (authentication.loggedIn ? (
        isAccessablePath(authentication, rest) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/not-found", state: { from: props.location } }}
          />
        )
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )) : <LoginSecureAuth {...props}/>
    }
  />
);

const checkSecureAuthKey= (props) => {
  let query = queryString.parse(props?.location?.search);
  return query["key"] && query["key"] != null;
}

//Returns true if all the elements in permissons are included in item array, false otherwise.
const includesAll = (item, permissons) =>
  item.every((v) => permissons.includes(v));
//this method checks role based access to the path
const isAccessablePath = (authentication, rest) => {
  const publicLinks = [Links.public];
  const privateLinks = [Links.private];
  if (authentication.isBidder) {
    return true;
  }
  if (rest.roles && authentication.permissions) {
    const roles = [...rest?.roles];
    const permissons = [...authentication?.permissions];
    //checks page accessibility for given user roles
    return roles.some((item) => {
      if (Array.isArray(item)) {
        return includesAll(item, permissons);
      } else {
        return permissons.includes(item);
      }
    });
  } else if (
    publicLinks[0].filter((link: any) => link.path === rest.location.pathname)
      .length > 0 ||
    (privateLinks[0].filter((link: any) => link.path === rest.location.pathname)
      .length > 0 &&
      authentication.loggedIn)
  ) {
    //returns true always for public links
    return true;
  }
};

const mapStateToProps = (state, ownProps) => ({
  authentication: state.authentication,
});
const PrivateRoute = connect(mapStateToProps)(PrivateRouteComponent);

export default PrivateRoute;
