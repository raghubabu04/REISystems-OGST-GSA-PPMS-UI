import React from "react";

import { BsFillXCircleFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { GoIssueOpened } from "react-icons/go";

import { HashLink as Link } from "react-router-hash-link";

interface SideNavLinkProps {
  to: string;
  name: string;
  key?: string;
  invalid?: boolean;
  valid?: boolean;
}

export const SideNavLink = (props: SideNavLinkProps): React.ReactElement => {
  return (
    <Link
      to={props.to}
      scroll={(element) => element.scrollIntoView({ behavior: "smooth" })}
      className={"side-nav-links"}
      key={props.key}
    >
      {props.invalid ? (
        <BsFillXCircleFill />
      ) : props.valid ? (
        <FaCheckCircle />
      ) : (
        <GoIssueOpened />
      )}{" "}
      {props.name}
    </Link>
  );
};
