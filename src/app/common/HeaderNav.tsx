import React from "react";
import { connect } from "react-redux";
import PPMSMegaHeader from "../../ui-kit/components/common/header/PPMS-mega-header";
import {
  generateLinks,
  getHeaderTitle,
  headerLinkLength,
  home,
  isOpen,
  isOpenTertiary,
  login,
  tertiaryLinkLength,
  title,
  topMenuItems,
} from "./constants/HeaderLinks";
import { userActions } from "../../_redux/_actions/user.actions";
import {
  getCurrentPage,
  getCurrentTertiaryPage,
} from "../../_redux/_helpers/page";
import { PageHelper, Paths } from "../Router";

export interface Props {
  authentication?: any;
  loggedIn?: boolean;
  permissions?: boolean;
  user?: any;
  aacs?: any[];
  roles?: any;
  currentPage?: any[];
  currentTertiaryPage?: any[];
  cartTotal: number;
  showManageProperties: boolean;
  logoutUser: () => void;
}
export interface State {
  authentication: any;
  loggedIn: boolean;
  headerLinks: any;
  permissions: any;
  user: any;
  aacs: any[];
  roles: any;
  currentPage: any[];
  currentTertiaryPage: any[];
  cartTotal: number;
  showManageProperties: boolean;
}

class HeaderNav extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      authentication: this.props.authentication,
      loggedIn: this.props.loggedIn,
      permissions: this.props.permissions,
      user: this.props.user,
      aacs: this.props.aacs,
      roles: this.props.roles,
      headerLinks: generateLinks(
        this.props.roles,
        this.props.loggedIn,
        this.props.user,
        this.props.cartTotal,
        this.props.showManageProperties,
        getHeaderTitle()
      ),
      currentPage: getCurrentPage(headerLinkLength),
      currentTertiaryPage: getCurrentTertiaryPage(tertiaryLinkLength),
      cartTotal: this.props.cartTotal,
      showManageProperties: this.props.showManageProperties,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.loggedIn !== state.loggedIn ||
      props.cartTotal !== state.cartTotal ||
      props.user !== state.user ||
      props.showManageProperties !== state.showManageProperties
    ) {
      let links = {
        topMenuItems: topMenuItems,
        bottomMenuItems: [login],
        navBarItems: [home],
      };
      if (props.loggedIn) {
        links = generateLinks(
          props.roles,
          props.loggedIn,
          props?.user,
          props?.cartTotal,
          props?.showManageProperties,
          getHeaderTitle()
        );
      }
      return {
        authentication: props.authentication,
        loggedIn: props.loggedIn,
        permissions: props.permissions,
        user: props.user,
        roles: props.roles,
        headerLinks: links,
        isOpen: [false, false, false, false, false, false],
        isOpenTertiary: [false, false, false],
        currentPage: getCurrentPage(headerLinkLength),
        currentTertiaryPage: getCurrentTertiaryPage(tertiaryLinkLength),
        cartTotal: props.cartTotal,
        showManageProperties: props.showManageProperties,
      };
    }
    if (
      props.currentPage !== state.currentPage ||
      props.currentTertiaryPage !== state.currentTertiaryPage
    ) {
      return {
        ...state,
        currentPage: getCurrentPage(headerLinkLength),
        currentTertiaryPage: getCurrentTertiaryPage(tertiaryLinkLength),
      };
    }
    return null;
  }
  onLogout = () => {
    this.props.logoutUser();
    PageHelper.openPage(Paths.home);
    window.location.reload();
  };

  render() {
    return (
      <>
        <PPMSMegaHeader
          title={getHeaderTitle()}
          headerLinks={this.state.headerLinks}
          isOpen={isOpen()}
          isOpenTertiary={isOpenTertiary()}
          isCurrent={this.state.currentPage}
          isTertiaryCurrent={this.state.currentTertiaryPage}
          user={
            this.state.user && this.state.user.emailAddress
              ? this.state.user.emailAddress
              : ""
          }
          onLogout={this.onLogout}
        />
      </>
    );
  }
}

/**
 * To Update State of Header NavBar to match that with Store. Roles check can be used throughout the application like props.isSM or state.isSM.
 * @param state
 */
const mapStateToProps = (state) => ({
  authentication: state.authentication,
  loggedIn: state.authentication.loggedIn,
  user: state.authentication.user,
  permissions: state.authentication.permissions,
  aacs: state.authentication.aacs,
  roles: state.authentication.roles,
  currentPage: getCurrentPage(headerLinkLength),
  currentTertiaryPage: getCurrentTertiaryPage(tertiaryLinkLength),
  cartTotal: state.cart?.cart?.total,
  showManageProperties: state.common.showManageProperties,
});

/**
 * Dispatch calls the global methods - in this case loginUser and logoutUser.  It can be called using props.loginUser().
 * @param dispatch
 * @param ownProps
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginUser: (resp) => dispatch(userActions.login(resp)),
    logoutUser: () => dispatch(userActions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNav);
