import PropTypes from "prop-types";
import React from "react";
import { UserUtils } from "../../utils/UserUtils";
import { PageHelper } from "../Router";
import { userActions } from "../../_redux/_actions/user.actions";
import { connect } from "react-redux";
import { cartActions } from "../../_redux/_actions/cart.actions";
import { addToast } from "../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { alertActions } from "../../_redux/_actions/alert.actions";
import { hideLoader, showLoader } from "../../_redux/_actions/loader.actions";
import { isEmptyCheck } from "../user-profile/SalesProfile/profile-sales-validations/UserProfileForAddEditSalesUserValidations";
import RealEstate from "../auctions/real-estate/RealEstate";

interface State {
  userAccess: string[];
  manageUsers: boolean;
  createProperty: boolean;
  authentication: any;
  loggedIn: boolean;
  permissions: any[];
  user: any;
  aacs: any[];
  roles: any;
}
interface Props {
  authentication?: any;
  loggedIn?: boolean;
  permissions?: any[];
  user?: any;
  aacs?: any[];
  roles?: any;
  getCartItems?: any;
  actions?: any;
  alertSuccess?: any;
  alertWarning?: any;
  alertError?: any;
  alertInfo?: any;
  loading?: boolean;
  showLoader?: any;
  hideLoader?: any;
  match: any;
  salesNumber?: any;
}

class RealEstateHome extends React.Component<Props, State> {
  static propTypes: {
    actions: PropTypes.Validator<
      PropTypes.InferProps<{
        addToast: PropTypes.Validator<(...args: any[]) => any>;
      }>
    >;
  };
  constructor(props: any) {
    super(props);
    this.state = {
      userAccess: [""],
      //All links set to false by default
      manageUsers: false,
      createProperty: false,
      authentication: this.props.authentication,
      loggedIn: this.props.loggedIn,
      permissions: this.props.permissions,
      user: this.props.user,
      aacs: this.props.aacs,
      roles: this.props.roles,
    };
  }
  handleClick = () => {
    /**
     * Example Toast Messages Variant
     */
    const { addToast } = this.props.actions;
    addToast({ text: "Warning message!", type: "warning", heading: "Warning" });
    addToast({ text: "Error message!", type: "error", heading: "Error" });
    addToast({ text: "Success message", type: "success", heading: "Success" });
    addToast({ text: "Info message", type: "info", heading: "Info" });
  };
  handleClickAlert = () => {
    /**
     * Example Alert Messages
     */
    this.props.alertSuccess("Hello");
  };
  componentDidMount() {
    //Grab permission level
    const userInfo = UserUtils.getUserInfo();
    const userPermissions = UserUtils.getUserPermissions();
    if (
      userPermissions.includes("SM") ||
      userPermissions.includes("NU") ||
      (userPermissions.includes("SA") && userPermissions.includes("MU")) ||
      (userInfo && userInfo.apoUser)
    ) {
      this.setState({
        manageUsers: true,
      });
    }

    if (userPermissions.includes("RP")) {
      this.setState({
        createProperty: true,
      });
    }

    let joined = this.state.userAccess;
    //Loops through each permission in the userToken
    for (let permission of userPermissions) {
      joined = joined.concat(permission);
    }
    this.setState({
      userAccess: joined,
    });
    this.props.getCartItems();
  }

  handlePageChange = (path) => {
    PageHelper.openPage(path);
  };

  render() {
    const firstName = this.state?.user?.firstName
      ? this.state?.user?.firstName
      : "";
    const lastName = this.state?.user?.lastName
      ? this.state?.user?.lastName
      : "";
    let userName;
    if (isEmptyCheck(firstName) && isEmptyCheck(lastName)) {
      userName = "USER";
    } else {
      userName = `${firstName} ${lastName}`;
    }

    return (
      <>
        <div className="ui-ppms">
          <p className={"dashboard-welcome-message auction-welcome"}>
            Welcome, <b>{userName}</b>
          </p>
        </div>
        <br />
        <RealEstate salesNumber={this.props?.match?.params?.salesNumber} />
      </>
    );
  }
}
RealEstateHome.propTypes = {
  actions: PropTypes.shape({
    addToast: PropTypes.func.isRequired,
  }).isRequired,
};
const mapStateToProps = (state) => ({
  authentication: state.authentication,
  loggedIn: state.authentication.loggedIn,
  user: state.authentication.user,
  permissions: state.authentication.permissions,
  aacs: state.authentication.aacs,
  roles: state.authentication.roles,
  loading: state.loader.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    loginUser: (resp) => dispatch(userActions.login(resp)),
    logoutUser: () => dispatch(userActions.logout()),
    getCartItems: () => dispatch(cartActions.getCartItems()),
    alertSuccess: (message) => dispatch(alertActions.success(message)),
    alertWarning: (message) => dispatch(alertActions.warning(message)),
    alertError: (message) => dispatch(alertActions.error(message)),
    alertInfo: (message) => dispatch(alertActions.info(message)),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RealEstateHome);
