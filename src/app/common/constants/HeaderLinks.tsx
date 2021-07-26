import React from "react";

import {
  FaCog,
  FaFolderPlus,
  FaHome,
  FaLuggageCart,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";

import { Paths } from "../../Router";
import { CgProfile } from "react-icons/cg";
import { UserUtils } from "../../../utils/UserUtils";

export const isOpen = () => {
  return [false, false, false, false, false, false, false, false, false];
};
export const isOpenTertiary = () => {
  return [false, false, false];
};
export const headerLinkLength = 6;
export const tertiaryLinkLength = 3;
export const title = "Personal Property Management System";
export const auctionsTitle = "GSA Auctions";
/**
 * -------- Account Links --------
 **/
export const login = {
  link: Paths.login,
  label: "Login",
  key: "login",
  icon: <FaSignInAlt role="img" aria-hidden={true} aria-label={"login"} />,
};

export const logout = {
  link: Paths.login,
  label: "Logout",
  key: "logout",
  icon: <FaSignOutAlt role="img" aria-hidden={true} aria-label={"logout"} />,
};

export const viewCart = {
  link: Paths.viewCart,
  label: "View Cart",
  key: "view-cart",
  icon: (
    <FaShoppingCart role="img" aria-hidden={true} aria-label={"view-cart"} />
  ),
};

/**
 * Links on the Right Side of Nav Bar
 */

export const tertiaryGroup = (roles: any, cartTotal: any, user: any) => {
  let tertiaryGroup = [];
  /**
   * Links Inside User Profile
   */
  let userProfiles = [];
  if (UserUtils.getUserTypeFromToken() === "UND") {
    if (UserUtils.getUserAccountId())
      pushItem(userProfiles, {
        link: Paths.userProfile + "/" + UserUtils.getUserAccountId(),
        label: "Profile",
        key: "child-profile",
        icon: "",
      });
    if (UserUtils.getUserInfo().userAccountsSize > 1)
      pushItem(userProfiles, {
        link: Paths.switchUserAccount,
        label: "Switch Account",
        key: "switch-user-account",
        icon: "",
      });
  } else if (
    UserUtils.getUserTypeFromToken() === "BIDDERS" &&
    UserUtils.getBidderUserName() !== null
  ) {
    if (UserUtils.getBidderUserName())
      pushItem(userProfiles, {
        link: Paths.bidderUserProfile + "/" + UserUtils.getBidderUserName(),
        label: "Profile",
        key: "child-profile",
        icon: "",
      });
    if (UserUtils.getUserInfo().bidderAccountsSize > 1)
      pushItem(userProfiles, {
        link: Paths.switchBidderAccount,
        label: "Switch Account",
        key: "switch-bidder-account",
        icon: "",
      });
    pushItem(userProfiles, {
      link: "",
      label: "Update Email",
      key: "update-email",
      icon: "",
    });
  } else if (UserUtils.getUserTypeFromToken() === "SLS") {
    pushItem(userProfiles, {
      link: Paths.editProfileOnSalesUser,
      label: "Profile",
      key: "child-profile",
      icon: "",
    });
  }

  if (
    !UserUtils.getLoggedInUserEmailAddress().toLowerCase().includes("gsa.gov")
  ) {
    if (UserUtils.getUserAccountId())
      pushItem(userProfiles, {
        link: Paths.mfaReset,
        label: "MFA Reset",
        key: "mfa-reset",
        icon: "",
      });
    pushItem(userProfiles, {
      link: "",
      label: "Password Reset",
      key: "reset-password",
      icon: "",
    });
  }

  if (
    cartTotal > 0 &&
    (roles.isRP ||
      roles.isSA ||
      roles.isNU ||
      roles.isSM ||
      roles.isSP ||
      roles.isAC ||
      roles.isPA ||
      (roles.isSA && roles.isMU))
  ) {
    pushItem(tertiaryGroup, viewCart);
  } else {
    pushItem(tertiaryGroup, {});
  }
  if (
    UserUtils.getUserTypeFromToken() !== "BIDDERS" ||
    (UserUtils.getUserTypeFromToken() === "BIDDERS" &&
      UserUtils.getBidderUserName() !== null)
  ) {
    pushItem(tertiaryGroup, getUserProfile(getProfile(userProfiles), user));
  }
  pushItem(tertiaryGroup, logout);
  return tertiaryGroup;
};

function pushItem(array, item) {
  if (array.indexOf(item) === -1) {
    array.push(item);
  }
}

export function getHeaderTitle(): string {
  const location = window.location.pathname;
  return location.indexOf("auctions") == -1 ? title : auctionsTitle;
}

export const generateLinks = (
  roles: any,
  loggedIn: boolean,
  user?: any,
  cartTotal?: any,
  showManageProperties?: boolean,
  t?: string
) => {
  let navBarItems = [];
  if (t == title) {
    pushItem(navBarItems, home);
  } else if (t == auctionsTitle) {
    pushItem(navBarItems, auctionsHome);
  }

  /**
   * Links Inside Property Functions
   */
  let propertyLinks = [];
  let searchAndRequest = [];
  let manageProperty = [];
  let reporting = [];
  let myTask = [];
  let foreignGifts = [];
  let firearms = [];

  /**
   * Links Inside User Functions
   */
  let userMaintenance = [];

  /**
   * Links Inside Sales Functions
   */
  let saleLinks = [];

  let payment = [];

  let salesFunctionMaintenance = [];
  let paymentsFunction = [];

  /**
   * Links for manage campaign
   */

  let marketingCampaign = [];

  /**
   * Links for my summary
   */

  let mySummmaryChild = [];

  /**
   * Links Inside Internal Functions
   */
  let internalFunctionsChild = [];
  if (roles) {
    if (showManageProperties) {
      pushItem(manageProperty, propertyList);
    }
    if (
      roles.isRP ||
      roles.isNU ||
      roles.isSM ||
      roles.isSA ||
      roles.isAC ||
      (roles.isSA && roles.isMU)
    ) {
      pushItem(manageProperty, propertyList);
      pushItem(manageProperty, createPropertyReport);
    }

    if (roles.isSM || roles.isAC || roles.isSA) {
      pushItem(reporting, reporting3040List);
    }

    if (
      roles.isIF ||
      roles.isIS ||
      roles.isSP ||
      roles.isFF ||
      roles.isNU ||
      roles.isSM ||
      roles.isAC ||
      roles.isVO ||
      (roles.isSA && roles.isMU) ||
      roles.isFG
    ) {
      pushItem(searchAndRequest, searchProperty);
    }

    if (
      roles.isSM ||
      roles.isAC ||
      roles.isNU ||
      roles.isFI ||
      roles.isFF ||
      (roles.isSA && roles.isMU) ||
      (roles.isIS && roles.isIF) ||
      (roles.isSP && roles.isFF)
    ) {
      pushItem(searchAndRequest, myRequests);
    }
    if (
      roles.isNU ||
      roles.isSM ||
      roles.isVO ||
      roles.isFF ||
      roles.isIS ||
      roles.isAC ||
      roles.isSA ||
      roles.isIF ||
      roles.isSP ||
      roles.isAO ||
      roles.isPA ||
      (roles.isSA && roles.isFF && roles.isSP) ||
      (roles.isSA && roles.isMU) ||
      (roles.isIS && roles.isRP) ||
      (roles.isPA && roles.isSP && roles.isFF) ||
      (roles.isRP && roles.isFF && roles.isSP) ||
      (roles.isRP && roles.isIF && roles.isIS)
    ) {
      pushItem(searchAndRequest, wantList);
    }
    if (
      roles.isNU ||
      roles.isSM ||
      (roles.isSA && roles.isMU) ||
      roles.isAC ||
      roles.isHD
    ) {
      pushItem(userMaintenance, manageUsers);
    }
    if (
      roles.isSM ||
      roles.isAC ||
      roles.isNU ||
      (roles.isSA && roles.isMU) ||
      roles.isCO ||
      roles.isSCO ||
      roles.isSMS ||
      roles.isSG ||
      roles.isCLO
    ) {
      pushItem(userMaintenance, groupEmails);
    }
    if (roles.isFR || roles.isFG || roles.isSM) {
      pushItem(foreignGifts, foreignGiftList);
      pushItem(foreignGifts, createForeignGiftReport);
    }

    if (roles.isFEX || roles.isFIA || roles.isFIN) {
      pushItem(salesFunctionMaintenance, fleetSaleManagement);
    }

    if (roles.isFEX || roles.isFIA || roles.isFIN) {
      pushItem(payment, salePayment);
    }

    if (
      roles.isCO ||
      roles.isSG ||
      roles.isSFU ||
      roles.isCLO ||
      roles.isSMS ||
      roles.isSSA ||
      roles.isSCO ||
      roles.isFMS
    ) {
      pushItem(userMaintenance, manageBidderStatusPage);
      pushItem(userMaintenance, manageSalesUsers);
      pushItem(salesFunctionMaintenance, icnStatusPage);
      pushItem(salesFunctionMaintenance, salesManagement);
    }
    if (roles.isCO || roles.isSG || roles.isSMS) {
      pushItem(marketingCampaign, manageCampaignMenu);
      pushItem(marketingCampaign, addEditCampaign);
    }
    if (roles.isSAI || roles.isFIA) {
      pushItem(userMaintenance, manageSalesUsers);
    }
    if (roles.isFIA || roles.isFIN) {
      pushItem(userMaintenance, manageBidderStatusPage);
    }
    if (roles.isCO) {
      pushItem(userMaintenance, managePropertyCustodianUsers);
    }
    // Added condition for displaying internal Functions for Central Office , SCO, SAles Manager
    if (
      roles.isCO ||
      roles.isSFU ||
      roles.isSCO ||
      roles.isSG ||
      roles.isRAI ||
      roles.isCOI
    ) {
      pushItem(internalFunctionsChild, manageFeatured);
    }

    if (
      roles.isSMS ||
      roles.isSG ||
      roles.isSCO ||
      roles.isRAI ||
      roles.isSAI ||
      roles.isCO
    ) {
      pushItem(internalFunctionsChild, manageAuctionList);
    }

    // Added condition for displaying internal Functions for Central Office , SCO, SAles Manager
    if (
      roles.isCO ||
      roles.isSFU ||
      roles.isSCO ||
      roles.isSG ||
      roles.isRAI ||
      roles.isCOI
    ) {
      pushItem(internalFunctionsChild, SearchSalesOrLot);
    }

    // Added condition for SCO and Fleet Internal users to see Contract Management List page
    if (roles.isCO || roles.isSMS || roles.isSG || roles.isCLO || roles.isSCO || roles.isFIA || roles.isFIN) {
      pushItem(salesFunctionMaintenance, contractsSearch);
    }
    

    // Added condition for SCO, Marketing Spec, Manager, Collection Officer, Central Office users to see sales search
    if (roles.isCO || roles.isSMS || roles.isSG || roles.isCLO || roles.isSCO) {
      pushItem(salesFunctionMaintenance, salesSearch);
    }

    // Added condition for SCO, Marketing Spec, Manager, Collection Officer, Central Office users to see manage bids
    if (roles.isCO || roles.isSMS || roles.isSG || roles.isCLO || roles.isSCO) {
      pushItem(salesFunctionMaintenance, manageBids);
    }

    if (roles.isRAI || roles.isSAI || roles.isCOI) {
      pushItem(salesFunctionMaintenance, salesManagementPBSDOI);
    }

    // Added this first if condition to not show myTask page to VO permission users
    if (!roles.isVO) {
      if (
        user?.internalAgencyUser ||
        roles.isNU ||
        roles.isAC ||
        roles.isSM ||
        roles.isAO ||
        roles.isPC
      ) {
        pushItem(myTask, myTasks);
      }
    }

    if (
      roles.isSM ||
      roles.isFM ||
      (roles.isSA && roles.isMU) ||
      (roles.isSA && roles.isFI)
    ) {
      pushItem(firearms, leaList);
    }

    if (
      roles.isSM ||
      roles.isFM ||
      roles.isFI ||
      (roles.isSA && roles.isMU) ||
      (roles.isSA && roles.isFI)
    ) {
      pushItem(firearms, annualInventoryList);
    }

    if (roles.isSM) {
      pushItem(internalFunctionsChild, manageInternalAgency);
      pushItem(internalFunctionsChild, createNonReportedTransfer);
    }

    if (roles.isCLO || roles.isSCO || roles.isSMS || roles.isCO || roles.isSG) {
      pushItem(internalFunctionsChild, myTasks);
    }
    if (roles.isAC) {
      pushItem(internalFunctionsChild, createNonReportedTransfer);
    }

    if (roles.isSG || roles.isCO || roles.isSCO || roles.isSMS || roles.isCLO) {
      pushItem(paymentsFunction, bidderPayments);
    }

    if (roles.isSG || roles.isCO || roles.isSCO || roles.isSMS || roles.isCLO) {
      pushItem(paymentsFunction, manageRegisters);
    }

    //sales related options
    if (roles.isS1 || roles.isS4) {
      pushItem(marketingCampaign, manageCampaignMenu);
      pushItem(marketingCampaign, addEditCampaign);
    }
    if (searchAndRequest.length > 0)
      pushItem(propertyLinks, getSearchAndRequestProperty(searchAndRequest));
    if (manageProperty.length > 0)
      pushItem(propertyLinks, getManageProperty(manageProperty));
    if (myTask.length > 0) pushItem(propertyLinks, getMyTasks(myTask));
    if (reporting.length > 0) pushItem(propertyLinks, getReporting(reporting));
    if (foreignGifts.length > 0)
      pushItem(propertyLinks, getForeignGifts(foreignGifts));
    if (firearms.length > 0) pushItem(propertyLinks, getFirearms(firearms));

    if (propertyLinks.length > 0) {
      pushItem(navBarItems, getPropertyFunctions(propertyLinks));
    } else {
      pushItem(navBarItems, {});
    }

    if (userMaintenance.length > 0) {
      pushItem(
        navBarItems,
        getUserFunctions(getUserMaintenance(userMaintenance))
      );
    } else {
      pushItem(navBarItems, {});
    }

    if (salesFunctionMaintenance.length > 0) {
      pushItem(
        saleLinks,
        getSalesFunctionsMaintenance(salesFunctionMaintenance)
      );
    }
    if (paymentsFunction.length > 0) {
      pushItem(saleLinks, getPaymentsFunction(paymentsFunction));
    }

    if (payment.length > 0) {
      pushItem(saleLinks, getSalePayment(payment));
    }

    if (saleLinks.length > 0) {
      pushItem(navBarItems, getSalesFunctions(saleLinks));
    } else {
      pushItem(navBarItems, {});
    }

    if (marketingCampaign.length > 0) {
      pushItem(
        navBarItems,
        getMarketingCampaignFunctions(getMarketingCampaign(marketingCampaign))
      );
    } else {
      pushItem(navBarItems, {});
    }

    if (internalFunctionsChild.length > 0) {
      pushItem(
        navBarItems,
        getInternalFunctions(getInternalFunctionsChild(internalFunctionsChild))
      );
    } else {
      pushItem(navBarItems, {});
    }
    if (
      UserUtils.getUserTypeFromToken() === "BIDDERS" &&
      UserUtils.getBidderUserName() !== null
    ) {
      pushItem(mySummmaryChild, myBids);
      pushItem(mySummmaryChild, myTrades);
      //pushItem(mySummmaryChild, payTradeAwards);
    }
  }
  if (
    UserUtils.getUserTypeFromToken() === "BIDDERS" &&
    UserUtils.getBidderUserName() !== null
  ) {
    pushItem(navBarItems, getAuctionsPreviewPage());
    pushItem(navBarItems, getAuctionsRealEstatePreviewPage());
    if (mySummmaryChild.length > 0) {
      pushItem(
        navBarItems,
        getMySummary(getMySummaryChildLinks(mySummmaryChild))
      );
    } else {
      pushItem(navBarItems, {});
    }
    pushItem(navBarItems, getMyFavorites());
    pushItem(navBarItems, getMyMessages());
  }
  return {
    topMenuItems: topMenuItems,
    bottomMenuItems: loggedIn
      ? tertiaryGroup(roles, cartTotal, user)
      : [{}, {}, login],
    navBarItems: navBarItems,
  };
};

/**
 * -------- Property Links --------
 **/
export const myTasks = {
  link: Paths.myTasks,
  label: "My Tasks",
  key: "my-task",
  icon: "",
};

export const wantList = {
  link: Paths.wantList,
  label: "Want List",
  key: "want-list",
  icon: "",
};

export const propertyList = {
  link: Paths.propertyList,
  label: "Manage Property",
  key: "manage-property",
  icon: "",
};

export const foreignGiftList = {
  link: Paths.foreignGiftList,
  label: "Manage Foreign Gift",
  key: "manage-foreign-gift",
  icon: "",
};
export const createForeignGiftReport = {
  link: Paths.createForeignGiftReport,
  label: "Create Foreign Gift",
  key: "create-foreign-gift",
  icon: "",
};

export const searchProperty = {
  link: Paths.searchProperty,
  label: "Search Property",
  key: "search-property",
  icon: "",
};

export const createPropertyReport = {
  link: Paths.createPropertyReport,
  label: "Create Property",
  key: "create-property",
  icon: "",
};

export const reporting3040List = {
  link: Paths.reporting3040List,
  label: "3040 Reporting",
  key: "3040-reporting-list",
  icon: "",
};

export function getSearchAndRequestProperty(links) {
  return {
    link: links,
    label: "Search & Request Property",
    key: "search-and-request-property",
    icon: "",
  };
}

export function getManageProperty(links) {
  return {
    link: links,
    label: "Manage Property",
    key: "manage-property",
    icon: "",
  };
}

export function getProfile(links) {
  return {
    link: links,
    label: "Manage Account",
    key: "user-profile",
    icon: "",
  };
}

export function getUserProfile(links, user) {
  return {
    link: [links],
    label: `${user.firstName} ${user.lastName}`,
    key: "profile",
    icon: <CgProfile role="img" aria-hidden={true} aria-label={"profile"} />,
  };
}

export function getMyTasks(links) {
  return {
    link: links,
    label: "My Tasks",
    key: "my-tasks",
    icon: "",
  };
}

export function getForeignGifts(links) {
  return {
    link: links,
    label: "Foreign Gifts",
    key: "foreign-gifts",
    icon: "",
  };
}

export function getFirearms(links) {
  if (links.length > 0)
    return {
      link: links,
      label: "Firearms",
      key: "firearms",
      icon: "",
    };
  return null;
}

export function getPropertyFunctions(propertyFunctionsLinks) {
  return {
    link: propertyFunctionsLinks,
    label: "Property Functions",
    key: "property-functions",
    icon: (
      <FaFolderPlus
        role="img"
        className={"navbar-icon"}
        aria-hidden={true}
        aria-label={"property-functions"}
      />
    ),
  };
}

export const myRequests = {
  link: Paths.myRequests,
  label: "Property Requests",
  key: "my-requests",
  icon: "",
};
/**
 * -------- Campaign Functions Links --------
 **/

export const manageCampaignMenu = {
  link: Paths.manageMarketingCampaign,
  label: "Manage Campaign",
  key: "nav-manage-campaign",
  icon: "",
};

export const addEditCampaign = {
  link: Paths.addEditMarketingCampaign,
  label: "Create Campaign",
  key: "add-edit-campaign",
  icon: "",
};

export function getMarketingCampaign(links) {
  return {
    link: links,
    label: "Campaign",
    key: "campaign-management",
    icon: "",
  };
}

export function getMarketingCampaignFunctions(links) {
  return {
    link: [links],
    label: "Campaign Functions",
    key: "manage-campaign",
    icon: (
      <FaFolderPlus
        role="img"
        className={"navbar-icon"}
        aria-hidden={true}
        aria-label={"marketing-campaign"}
      />
    ),
  };
}

export const manageBidderStatusPage = {
  link: Paths.manageBidderStatusList,
  label: "Manage Bidders",
  key: "manage-bidder",
  icon: "",
};

/**
 * -------- User Links --------
 **/

export const manageUsers = {
  link: Paths.usersList,
  label: "Manage Users",
  key: "manage-users",
  icon: "",
};

export const groupEmails = {
  link: Paths.groupEmails,
  label: "Group Emails",
  key: "group-emails",
  icon: "",
};

export const manageSalesUsers = {
  link: Paths.salesUsers,
  label: "Manage Sales Users",
  key: "manage-sales-users",
  icon: "",
};

export const managePropertyCustodianUsers = {
  link: Paths.propertyCustodianUser,
  label: "Manage Property Custodian",
  key: "manage-property-custodian",
  icon: "",
};

export const leaList = {
  link: Paths.lealist,
  label: "Manage LEAS",
  key: "lea-list",
  icon: "",
};

export const annualInventoryList = {
  link: Paths.annualInventoryList,
  label: "Annual Inventory",
  key: "annualInventory",
  icon: "",
};

export function getUserMaintenance(links) {
  return {
    link: links,
    label: "User Maintenance",
    key: "user-maintenance",
    icon: "",
  };
}

export function getUserFunctions(links) {
  return {
    link: [links],
    label: "User Functions",
    key: "user-functions",
    icon: (
      <FaUserCog
        role="img"
        className={"navbar-icon"}
        aria-hidden={true}
        aria-label={"user-functions"}
      />
    ),
  };
}

/**
 * -------- Sales Function Links --------
 **/

export const icnStatusPage = {
  link: Paths.salesICNStatusList,
  label: "ICN Management",
  key: "icn-management",
  icon: "",
};

export const salesManagement = {
  link: Paths.salesManagement,
  label: "Sales Management",
  key: "sales-management",
  icon: "",
};

export const contractsSearch = {
  link: Paths.contractsManagement,
  label: "Contracts Management",
  key: "contracts-search",
  icon: "",
};


export const manageFeatured = {
  link: Paths.manageFeaturedItems,
  label: "Manage Featured Items",
  key: "manage-featured",
  icon: "",
};

export const SearchSalesOrLot = {
  link: Paths.searchSaleOrLot,
  label: "Search and Add Featured Item",
  key: "search-and-add-featured-item",
  icon: "",
};

export const manageAuctionList = {
  link: Paths.manageAuctionList,
  label: "Manage Auctions",
  key: "manage-auction-list",
  icon: "",
};

export const salesSearch = {
  link: Paths.salesSearch,
  label: "Sales Search",
  key: "sales-search",
  icon: "",
};

export const manageBids = {
  link: Paths.manageBids,
  label: "Record Bids",
  key: "manage-bids",
  icon: "",
};

export const salesManagementPBSDOI = {
  link: Paths.salesManagementPBSDOI,
  label: "Sales Management",
  key: "sales-management-pbsdoi",
  icon: "",
};

export const salePayment = {
  link: Paths.salePayment,
  label: "Sale Payment",
  key: "sales-payment",
  icon: "",
};

export function getSalesFunctionsMaintenance(links) {
  return {
    link: links,
    label: "Sales",
    key: "",
    icon: "",
  };
}

export function getPaymentsFunction(links) {
  return {
    link: links,
    label: "Payments",
    key: "",
    icon: "",
  };
}

export function getSalePayment(links) {
  return {
    link: links,
    label: "Payment",
    key: "",
    icon: "",
  };
}

export function getSalesFunctions(links) {
  return {
    link: links,
    label: "Sales Functions",
    key: "sales-functions",
    icon: (
      <FaLuggageCart
        role="img"
        className={"navbar-icon"}
        aria-hidden={true}
        aria-label={"sales-functions"}
      />
    ),
  };
}

/**
 * -------- Internal Functions Links --------
 **/

export const manageInternalAgency = {
  link: Paths.internalAgencyList,
  label: "Manage Internal Agency",
  key: "manage-internal-agency",
  icon: "",
};

export const fleetSaleManagement = {
  link: Paths.manageFleet,
  label: "Sales Management",
  key: "fleet-sales-management",
  icon: "",
};

export const createNonReportedTransfer = {
  link: Paths.createNonReportedTransfer,
  label: "Create Non-Reported Transfer",
  key: "Create-non-reported-transfer",
  icon: "",
};

export const bidderPayments = {
  link: Paths.bidderPayments,
  label: "Bidder/Payments",
  key: "bidder-payments",
  icon: "",
};

export const manageRegisters = {
  link: Paths.manageRegisters,
  label: "Manage Registers",
  key: "manage-registers",
  icon: "",
};

export function getInternalFunctionsChild(links) {
  return {
    link: links,
    label: "Internal Functions",
    key: "manage-internal-functions",
    icon: "",
  };
}

export function getMySummaryChildLinks(links) {
  return {
    link: links,
    label: "Summary",
    key: "Summary",
    icon: "",
  };
}

export function getMySummary(links) {
  return {
    link: [links],
    label: "My Summary",
    key: "my-summary",
    icon: (
      <FaFolderPlus
        role="img"
        className={"navbar-icon"}
        aria-hidden={true}
        aria-label={"my-summary"}
      />
    ),
  };
}

export function getInternalFunctions(links) {
  return {
    link: [links],
    label: "Internal Functions",
    key: "internal-functions",
    icon: (
      <FaCog
        role="img"
        className={"navbar-icon"}
        aria-hidden={true}
        aria-label={"internal-functions"}
      />
    ),
  };
}

/**
 * ---------- Reporting links ------------
 */

export function getReporting(links) {
  if (links.length > 0)
    return {
      link: links,
      label: "Reporting",
      key: "reporting",
      icon: "",
    };
  return null;
}

/**
 * ---------- Bidder links ------------
 */
export function getMyFavorites() {
  return {
    link: Paths.favorites,
    label: "My Favorites",
    key: "my-favorites",
    icon: (
      <FaFolderPlus
        role="img"
        className={"navbar-icon"}
        aria-hidden={true}
        aria-label={"my-favorites"}
      />
    ),
  };
}

export function getAuctionsPreviewPage() {
  return {
    link: Paths.auctions,
    label: "Auctions",
    key: "auctions",
    // icon: (
    //   <FaFolderPlus
    //     role="img"
    //     className={"navbar-icon"}
    //     aria-hidden={true}
    //     aria-label={"my-favorites"}
    //   />
    // ),
  };
}

export function getAuctionsRealEstatePreviewPage() {
  return {
    link: Paths.realEstateAuctions,
    label: "Real Estate",
    key: "realEstateAuctions",
    // icon: (
    //   <FaFolderPlus
    //     role="img"
    //     className={"navbar-icon"}
    //     aria-hidden={true}
    //     aria-label={"my-favorites"}
    //   />
    // ),
  };
}

export function getMyMessages() {
  return {
    link: Paths.myMessages,
    label: "My Messages",
    key: "my-messages",
    // icon: (
    //   <FaFolderPlus
    //     role="img"
    //     className={"navbar-icon"}
    //     aria-hidden={true}
    //     aria-label={"my-favorites"}
    //   />
    // ),
  };
}

/**
 * -------- my summary Links --------
 **/

export const myBids = {
  link: Paths.myBids,
  label: "My Bids",
  key: "my-bids",
  icon: "",
};

const myTrades = {
  link: Paths.myTrades,
  label: "My Trades",
  key: "my-trades",
  icon: "",
};
const payTradeAwards = {
  link: Paths.payTradeAwards,
  label: "Pay Trades",
  key: "pay-trades",
  icon: "",
};

/**
 * -------- Public Links --------
 **/

export const topMenuItems = [
  {
    link: Paths.home,
    label: "Program Links",
    key: "program-links",
    icon: "",
  },
  {
    link: Paths.home,
    label: "User Guides",
    key: "user-guides",
    icon: "",
  },
  {
    link: Paths.home,
    label: "Contact Links",
    key: "contact-links",
    icon: "",
  },
  {
    link: Paths.home,
    label: "PPMS HelpDesk",
    key: "ppms-helpdesk",
    icon: "",
  },
  {
    link: Paths.home,
    label: "FAQs",
    key: "faqs",
    icon: "",
  },
];

export const home = {
  link: Paths.home,
  label: "Home",
  key: "home",
  icon: (
    <FaHome
      role="img"
      className={"navbar-icon"}
      aria-hidden={true}
      aria-label={"home"}
    />
  ),
};

export const auctionsHome = {
  link: Paths.auctions,
  label: "Home",
  key: "home",
  icon: (
    <FaHome
      role="img"
      className={"navbar-icon"}
      aria-hidden={true}
      aria-label={"home"}
    />
  ),
};
