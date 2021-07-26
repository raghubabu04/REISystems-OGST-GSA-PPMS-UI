import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import PPMSGovBanner from "./PPMS-gov-banner";
import PPMSNavDropDownButton from "./components/PPMS-nav-drop-down-button";
import PPMSMegaMenu from "./components/PPMS-mega-menu";
import PPMSExtendedNav from "./components/PPMS-extended-nav";
import PPMSTitle from "./components/PPMS-title";
import { PPMSHeaderWrapper } from "./components/PPMS-header-wrapper";
import { PPMSNavMenuButton } from "./components/PPMS-nav-menu-button";
import { PPMSModal } from "../PPMS-modal";
import { PPMSPassword } from "../../PPMS-password";
import { PPMSInput } from "../../common/input/PPMS-input";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { userActions } from "../../../../_redux/_actions/user.actions";
import { PPMSEmailConfirm } from "../../PPMS-email-confirm";
import { BidderUserDTO } from "../../../../app/models/BidderUser";
import { UserUtils } from "../../../../utils/UserUtils";

export interface PPMSMegaHeaderProps {
  expanded?: boolean;
  isOpen: boolean[];
  isOpenTertiary?: boolean[];
  isCurrent: boolean[];
  isTertiaryCurrent: boolean[];
  onSubmit?: any;
  onLogout?: any;
  title: string;
  headerLinks: any;
  user?: string;
}

export interface PPMSMegaHeaderState {
  isOpen: boolean[];
  isOpenTertiary: boolean[];
  isCurrent: boolean[];
  isTertiaryCurrent: boolean[];
  expanded: boolean;
  hover: boolean;
  showModal: boolean;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  oldPasswordErrorMessage: string;
  oldPasswordIsInvalid: boolean;
  oldPasswordIsValid: boolean;
  showUpdateEmailModal: boolean;
  oldEmail: string;
  newEmail: string;
  confirmNewEmail: string;
  oldEmailIsInvalid: boolean;
  newEmailIsInvalid: boolean;
  confirmNewEmailIsInvalid: boolean;
  oldEmailValidationMessage: string;
  newEmailValidationMessage: string;
  confirmNewEmailValidationMessage: string;
}

export default class PPMSMegaHeader extends React.Component<
  PPMSMegaHeaderProps,
  PPMSMegaHeaderState
> {
  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.expanded,
      isOpen: this.props.isOpen,
      isOpenTertiary: this.props.isOpenTertiary,
      isCurrent: this.props.isCurrent,
      isTertiaryCurrent: this.props.isTertiaryCurrent,
      hover: false,
      showModal: false,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      oldPasswordErrorMessage: "",
      oldPasswordIsInvalid: false,
      oldPasswordIsValid: false,
      showUpdateEmailModal: false,
      oldEmail: "",
      newEmail: "",
      confirmNewEmail: "",
      oldEmailIsInvalid: false,
      newEmailIsInvalid: false,
      confirmNewEmailIsInvalid: false,
      oldEmailValidationMessage: "",
      newEmailValidationMessage: "",
      confirmNewEmailValidationMessage: "",
    };

    this.modalOpen = this.modalOpen.bind(this);
  }

  private userApiService = new UserApiService();

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  }

  handleClickOutside = (event) => {
    const domNode = ReactDOM.findDOMNode(this);
    const refNode = event.target.className;
    let idx = event.target.dataset.index;
    let index = idx ? parseInt(idx) : null;
    let isOpen = this.state.isOpen;
    let isOpenTertiary = this.state.isOpenTertiary;
    if (!domNode || !domNode.contains(event.target)) {
      isOpen.forEach(function (part, i) {
        if (i !== index) {
          isOpen[i] = false;
        }
      });
      isOpenTertiary.forEach(function (part, i) {
        if (i !== index) {
          isOpenTertiary[i] = false;
        }
      });
      this.setState({
        isOpen,
        isOpenTertiary,
      });
    }
    if (this.state.expanded && refNode === "usa-overlay is-visible") {
      this.setState({ expanded: !this.state.expanded });
    }
  };
  onClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  onLogout = () => {
    this.props.onLogout();
  };

  handleClose = () => {
    this.setState({
      oldPasswordIsInvalid: false,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      oldEmailIsInvalid: false,
      oldEmail: "",
      newEmail: "",
      confirmNewEmail: "",
      newEmailIsInvalid: false,
      confirmNewEmailIsInvalid: false,
      newEmailValidationMessage: "",
      confirmNewEmailValidationMessage: "",
      showUpdateEmailModal: false,
      showModal: false,
    });
  };

  handleChange = (event) => {
    let value = event.target.value;
    if (value.trim().length === 0) {
      this.setState({
        oldPassword: value,
        oldPasswordIsInvalid: true,
        oldPasswordIsValid: false,
        oldPasswordErrorMessage: "Old Password is Required.",
      });
    } else {
      this.setState({
        oldPasswordIsInvalid: false,
        oldPasswordIsValid: true,
      });
    }
  };
  handleOnsubmitPassword = () => {
    const data = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
    };
    this.userApiService
      .resetPasswordForNonGSAOktaUsers(data)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ showModal: false });
          userActions.logout();
          this.onLogout();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 500) {
          this.setState({
            oldPassword: data.oldPassword,
            oldPasswordIsInvalid: true,
            oldPasswordIsValid: false,
            oldPasswordErrorMessage: "Old Password is Incorrect.",
          });
        }
        return error;
      });
  };

  handleOldEmailBlur = ({ value }) => {
    this.setState({
      oldEmail: value.trim(),
    });
    if (value.trim().length === 0) {
      this.setState({
        oldEmailIsInvalid: true,
        oldEmailValidationMessage: "Old Email is Required",
      });
    } else if (value?.trim()?.length > 0) {
      if (value?.trim() !== UserUtils.getLoggedInUserEmail()) {
        this.setState({
          oldEmailIsInvalid: true,
          oldEmailValidationMessage: "Old Email entered is not correct",
        });
      }
    }
  };

  handleOldEmailChange = ({ value }) => {
    this.setState({
      oldEmail: value.trim(),
    });
    if (value.trim().length === 0) {
      this.setState({
        oldEmailIsInvalid: true,
        oldEmailValidationMessage: "Old Email is Required",
      });
    } else {
      this.setState({
        oldEmailIsInvalid: false,
        oldEmailValidationMessage: "",
      });
    }
  };

  handleOnSubmitEmail = () => {
    if (
      this.state.newEmailValidationMessage?.length > 0 ||
      this.state.confirmNewEmailValidationMessage?.length > 0 ||
      this.state.oldEmailValidationMessage?.length > 0
    ) {
      this.setState({
        oldEmailIsInvalid: this.state.oldEmailIsInvalid,
        oldEmailValidationMessage: this.state.oldEmailValidationMessage,
        newEmailIsInvalid: this.state.newEmailIsInvalid,
        newEmailValidationMessage: this.state.newEmailValidationMessage,
        confirmNewEmailIsInvalid: this.state.confirmNewEmailIsInvalid,
        confirmNewEmailValidationMessage: this.state
          .confirmNewEmailValidationMessage,
      });
    } else if (this.state.oldEmail === this.state.newEmail) {
      this.setState({
        newEmailIsInvalid: true,
        newEmailValidationMessage: "New email must be different from old email",
      });
    } else {
      const data: BidderUserDTO = ({
        id: UserUtils.getUserId(),
        emailAddress: this.state.newEmail,
      } as unknown) as BidderUserDTO;

      this.userApiService
        .editBidderUser(data, UserUtils.getBidderUserName())
        .then((response) => {
          this.setState({ showUpdateEmailModal: false });
          userActions.logout();
          this.onLogout();
        })
        .catch((error) => {});
    }
  };

  modalOpen = (key) => {
    if (key === "reset-password") {
      this.setState({
        showModal: true,
        oldPasswordIsInvalid: false,
      });
    }
    if (key === "update-email") {
      this.setState({
        showUpdateEmailModal: true,
      });
    }
  };

  toggleOpen = (index, key) => {
    let isOpenTertiary = this.state.isOpenTertiary;
    let isOpen = this.state.isOpen;
    isOpenTertiary.forEach(function (part, i) {
      if (i !== index) {
        isOpenTertiary[i] = false;
      }
    });
    isOpen.forEach(function (part, i) {
      if (i !== index) {
        isOpen[i] = false;
      }
    });
    if (key === "profile") {
      isOpenTertiary[index] = !this.state.isOpenTertiary[index];
      isOpen[index] = false;
    } else {
      isOpen[index] = !this.state.isOpen[index];
      isOpenTertiary[index] = false;
    }
    this.setState({
      isOpen,
      isOpenTertiary,
    });
  };
  getTopMenuItems = () => {
    return this.props.headerLinks.topMenuItems.map((item: any, index) => (
      <Link to={item.link.toString()} key={item.key} id={item.key}>
        {item.icon} {item.label}
      </Link>
    ));
  };

  getLinks = (navBarItems, currentItems, openItems, type) => {
    const itemsMenu = [];
    navBarItems.forEach((item: any, idx) => {
      const navItems = [];
      if (Array.isArray(item.link)) {
        const navItemsList = [];
        item.link?.forEach((item: any, index) => {
          const navChild = [];
          navChild.push(
            <strong key={"menu-label-" + index}>{item.label}</strong>
          );
          item.link?.forEach((item: any) => {
            navChild.push(
              <>
                <Link
                  to={item.link}
                  id={item.key + "-link-" + index}
                  key={item.key + "-link-" + index}
                  onClick={() => {
                    let isOpen = this.state.isOpen;
                    this.props.isOpen.forEach(function (part, i) {
                      isOpen[i] = false;
                    });
                    this.modalOpen(item.key);
                    this.setState({ isOpen: isOpen });
                  }}
                  data-index={index}
                >
                  {item.icon} {item.label}
                </Link>
              </>
            );
          });
          navItemsList.push(navChild);
        });
        const bigNavItem = (
          <>
            <PPMSNavDropDownButton
              onToggle={() => this.toggleOpen(idx, item.key)}
              menuId={item.key + "-dropdown-" + idx}
              isOpen={openItems[idx]}
              icon={item.icon}
              label={item.label}
              isCurrent={currentItems[idx]}
              key={item.key + "-dropdown-" + idx}
              id={item.key + "-dropdown-" + idx}
              index={idx}
            />
            <PPMSMegaMenu
              key={item.key + "-mega-menu-" + idx}
              items={navItemsList}
              isOpen={openItems[idx]}
              id={item.key + "-mega-menu-" + idx}
              type={type}
            />
          </>
        );
        navItems.push(bigNavItem);
      } else {
        if (item.link) {
          navItems.push(
            <>
              {item.label.toLowerCase() === "logout" ? (
                <Link
                  to={item.link.toString()}
                  key={item.key}
                  onClick={this.onLogout}
                  id={item.key}
                  className={"usa-nav__link"}
                >
                  {item.icon} {item.label}
                </Link>
              ) : (
                <Link
                  to={item.link}
                  key={item.key + "-link-"}
                  id={item.key + "-nav-link-" + idx}
                  className={`usa-nav__link ${
                    currentItems[idx] ? "usa-current" : ""
                  }`}
                  data-index={idx}
                >
                  <span data-index={idx}>
                    {item.icon} {item.label}
                  </span>
                </Link>
              )}
            </>
          );
        }
      }
      itemsMenu.push(navItems);
    });
    return itemsMenu;
  };

  render() {
    return (
      <>
        <PPMSGovBanner />
        <div
          className={`usa-overlay ${this.state.expanded ? "is-visible" : ""}`}
        />
        <PPMSHeaderWrapper extended={true}>
          <div className="usa-navbar">
            <PPMSTitle>
              {this.props.title}
              <i>
                <sup>SM</sup>
              </i>
            </PPMSTitle>
            <PPMSNavMenuButton
              id={"nav-menu-button"}
              onClick={this.onClick}
              label="Menu"
            />
          </div>
          <PPMSExtendedNav
            key={"extended-nav"}
            id={"extended-nav"}
            primaryItems={this.getLinks(
              this.props.headerLinks.navBarItems,
              this.props.isCurrent,
              this.state.isOpen,
              "primary"
            )}
            secondaryItems={this.getTopMenuItems()}
            tertiaryItems={this.getLinks(
              this.props.headerLinks.bottomMenuItems,
              this.props.isTertiaryCurrent,
              this.state.isOpenTertiary,
              "tertiary"
            )}
            mobileExpanded={this.state.expanded}
            onToggleMobileNav={this.onClick}
            user={this.props.user}
          />
        </PPMSHeaderWrapper>
        <PPMSModal
          body={
            <div className={"modal-adjustment"}>
              <PPMSInput
                label={"Old Password"}
                id={"oldPassword"}
                inputType={"password"}
                name={"oldPassword"}
                maxLength={36}
                onChange={(event) => {
                  this.setState({
                    oldPassword: event.target.value,
                    oldPasswordIsInvalid: false,
                  });
                }}
                onBlur={(event) => {
                  this.handleChange(event);
                }}
                value={this.state.oldPassword}
                isDisabled={false}
                isRequired={true}
                isInvalid={this.state.oldPasswordIsInvalid}
                isValid={this.state.oldPasswordIsValid}
                validationMessage={this.state.oldPasswordErrorMessage}
              />
              <PPMSPassword
                showPasswordMeter={true}
                id={"registration-password"}
                password={this.state.newPassword}
                label={"New Password"}
                updatePassword={(value: any) => {
                  this.setState({ newPassword: value });
                }}
                confirmPassword={this.state.confirmNewPassword}
                updateConfirmPassword={(value: any) => {
                  this.setState({ confirmNewPassword: value });
                }}
              />
            </div>
          }
          id={"reset-password"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.handleOnsubmitPassword}
          title={"Reset Password"}
          label={"Submit"}
          labelCancel={"Cancel"}
        />
        <PPMSModal
          body={
            <div className={"modal-adjustment"}>
              <PPMSInput
                className={"oldEmail"}
                isDisabled={false}
                id={"oldEmail"}
                name={"oldEmail"}
                isInvalid={this.state.oldEmailIsInvalid}
                isValid={!this.state.oldEmailIsInvalid}
                label={"Old Email Address"}
                onChange={(event) => this.handleOldEmailChange(event.target)}
                onBlur={(event) => this.handleOldEmailBlur(event.target)}
                placeHolder={"email@domain.gov"}
                isRequired={true}
                inputType={"email"}
                validationMessage={this.state.oldEmailValidationMessage}
                value={this.state.oldEmail}
                minLength={5}
                maxLength={50}
              />
              <PPMSEmailConfirm
                showEmailConfirm={true}
                confirmEmail={this.state.confirmNewEmail}
                isEmailInvalid={this.state.newEmailIsInvalid}
                isEmailValid={!this.state.newEmailIsInvalid}
                emailValidationMessage={this.state.newEmailValidationMessage}
                emailLabel={"New Email Address"}
                confirmEmailLabel={"Confirm New Email Address"}
                email={this.state.newEmail}
                id={"new-email-confirm"}
                required={true}
                updateEmail={(value: any, validation: any) => {
                  this.setState({
                    newEmail: value,
                    newEmailIsInvalid: validation.isInvalid,
                    newEmailValidationMessage: validation.validationError,
                  });
                }}
                isConfirmEmailInvalid={
                  this.state.confirmNewEmailIsInvalid ||
                  this.state.confirmNewEmailValidationMessage?.length > 0
                }
                confirmEmailValidationMessage={
                  this.state.confirmNewEmailValidationMessage
                }
                updateConfirmEmail={(value: any, validation: any) => {
                  this.setState({
                    confirmNewEmail: value,
                    confirmNewEmailIsInvalid: validation.isInvalid,
                    confirmNewEmailValidationMessage:
                      validation.validationError,
                  });
                }}
              />
            </div>
          }
          id={"update-email"}
          show={this.state.showUpdateEmailModal}
          handleClose={this.handleClose}
          handleSave={this.handleOnSubmitEmail}
          title={"Update Email"}
          label={"Submit"}
          labelCancel={"Cancel"}
        />
      </>
    );
  }
}
