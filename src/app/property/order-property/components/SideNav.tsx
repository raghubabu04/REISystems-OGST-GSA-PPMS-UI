import React from "react";
import { PPMSSideNav } from "../../../../ui-kit/components/common/PPMS-side-nav";
import { Link } from "react-router-dom";
import { Paths } from "../../../Router";
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";
import { history } from "../../../../_redux/_helpers/history";
export interface SideNavProps {}

export interface SideNavState {}
class SideNav extends React.Component<SideNavProps, SideNavState> {
  constructor(props) {
    super(props);
  }
  currentPage = history.location.pathname;
  icons = {
    incomplete: <FaRegCircle />,
    complete: <FaRegCheckCircle />,
  };
  checkoutLinks = [
    <Link
      to={Paths.viewCart}
      className={`${
        Paths.viewCart === this.currentPage ? "usa-current" : ""
      } side-nav-links`}
      key="view-cart"
    >
      {this.icons.complete} Confirm Cart
    </Link>,
    <Link
      to={Paths.confirmInformation}
      className={`${
        Paths.confirmInformation === this.currentPage ? "usa-current" : ""
      } side-nav-links`}
      key="confirm-information"
    >
      {this.currentPage === Paths.confirmInformation ||
      this.currentPage === Paths.submission
        ? this.icons.complete
        : this.icons.incomplete}{" "}
      Confirm Information
    </Link>,
    <Link
      to={Paths.submission}
      className={`${
        Paths.submission === this.currentPage ? "usa-current" : ""
      } side-nav-links`}
      key="submission"
    >
      {this.currentPage === Paths.submission
        ? this.icons.complete
        : this.icons.incomplete}{" "}
      Submission
    </Link>,
  ];
  componentDidMount() {
    this.currentPage = history.location.pathname;
  }

  render() {
    return (
      <>
        <PPMSSideNav items={this.checkoutLinks} />
      </>
    );
  }
}

export default SideNav;
