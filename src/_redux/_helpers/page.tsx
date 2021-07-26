import { history } from "./history";
import {
  home,
  internalFunctions,
  propertyControls,
  marketingCampaignControls,
  userControls,
  salesControls,
  userProfile,
  viewCart,
  login,
} from "../../app/Router";
import { Page, TertiaryPage } from "../_constants/page.constants";
export function getCurrentPage(length) {
  let currentPage = [];
  let route = history.location.pathname;
  if (home.includes(route)) {
    currentPage = checkCurrentPage(Page.home, length);
  } else if (propertyControls.includes(route)) {
    currentPage = checkCurrentPage(Page.propertyControls, length);
  } else if (marketingCampaignControls.includes(route)) {
    currentPage = checkCurrentPage(Page.marketingControls, length);
  } else if (userControls.includes(route)) {
    currentPage = checkCurrentPage(Page.userControls, length);
  } else if (salesControls.includes(route)) {
    currentPage = checkCurrentPage(Page.salesControls, length);
  } else if (internalFunctions.includes(route)) {
    currentPage = checkCurrentPage(Page.internalFunctions, length);
  } else {
    currentPage = checkCurrentPage("default", length);
  }
  return currentPage;
}

export function getCurrentTertiaryPage(length) {
  let currentPage = [];
  let route = history.location.pathname;
  if (userProfile.includes(route)) {
    currentPage = checkCurrentTertiaryPage(TertiaryPage.userProfile, length);
  } else if (viewCart.includes(route)) {
    currentPage = checkCurrentTertiaryPage(TertiaryPage.viewCart, length);
  } else if (login.includes(route)) {
    currentPage = checkCurrentTertiaryPage(TertiaryPage.login, length);
  } else {
    currentPage = checkCurrentTertiaryPage("default", length);
  }
  return currentPage;
}

function checkCurrentPage(currentPage, length) {
  let array = new Array(length).fill(false);
  switch (currentPage) {
    case Page.home:
      array[0] = true;
      break;
    case Page.propertyControls:
      array[1] = true;
      break;
    case Page.userControls:
      array[2] = true;
      break;
    case Page.salesControls:
      array[3] = true;
      break;
    case Page.marketingControls:
      array[4] = true;
      break;
    case Page.internalFunctions:
      array[5] = true;
      break;
    default:
      break;
  }
  return array;
}

function checkCurrentTertiaryPage(currentPage, length) {
  let array = new Array(length).fill(false);
  switch (currentPage) {
    case TertiaryPage.viewCart:
      array[0] = true;
      break;
    case TertiaryPage.userProfile:
      array[1] = true;
      break;
    case TertiaryPage.login:
      array[2] = true;
      break;
    default:
      break;
  }
  return array;
}
