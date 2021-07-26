import React from "react";
import {HashLink as Link} from "react-router-hash-link";
import {GoDash} from "react-icons/go";
import {PPMSSideNav} from "../../../ui-kit/components/common/PPMS-side-nav";

export default function SalesUserSideNav() {
  const links = [
    <Link
      to={"#header_typeOfUser"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="typeOfUser"
    >
      <GoDash aria-label={"Type of User"}/> Type of User
    </Link>,
    <Link
      to={"#header_userInformation"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="userInformation"
    >
      <GoDash aria-label={"User Information"}/> User Information
    </Link>,
    <Link
      to={"#header_userRoles"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="userRoles"
    >
      <GoDash aria-label={"User Roles"}/> User Roles
    </Link>,
    <Link
      to={"#header_userZones"}
      scroll={(element) => element.scrollIntoView({behavior: "smooth"})}
      className={"side-nav-links"}
      key="userZones"
    >
      <GoDash aria-label={"Zone Information"}/> Zone Information
    </Link>,

  ];

  return (
    <>
      <PPMSSideNav items={links}/>
    </>
  );
}
