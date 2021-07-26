import React from "react";
import { EmailVerification } from "./registration/EmailVerification";
import { VerifyUser } from "./registration/VerifyUser";
import { Registration } from "./registration/Registration";
import { RegistrationSuccessful } from "./registration/RegistrationSuccessful";
import Home from "../app/home/Home";
import UsersListPage from "./manage-users/UsersListPage";
import PropertyCustodianUserListPage from "./manage-users/property-custodian-users/PropertyCustodianUserListPage";
import PropertyListPage from "./property/manage-property/PropertyListPage";
import { MyTaskListPage } from "./property/my-task/MyTaskListPage";
import { InternalAgencyListPage } from "./internal-agency/InternalAgencyListPage";
import { InternalAgencyProvider } from "./internal-agency/InternalAgencyContext";
import EditInternalAgency from "../app/internal-agency/EditInternalAgency";
import { NuoRegistration } from "./manage-users/NuoRegistration";
import { EditUser } from "./manage-users/EditUser";
import AddInternalAgency from "../app/internal-agency/AddInternalAgency";
import Login from "../app/login/Login";
import { Redirect, Route, Switch } from "react-router";
import { history } from "../_redux/_helpers/history";
import PrivateRoute from "../_redux/_components/PrivateRoute";
import ViewProperty from "../app/property/view-property/PropertyView";
import ViewBidder from "../app/manage-users/bidders/view-bidder/BidderView";
import ForeignGiftView from "../app/foreign-gift/view-foreign-gift/ForeignGiftView";
import ViewCart from "./property/order-property/ViewCart";
import SearchProperty from "./property/search-property/SearchProperty";
import EditShippingInfo from "./property/order-property/components/ShippingDetails/EditShippingInformation";
import ConfirmInformation from "./property/order-property/ConfirmInformation";
import Submission from "./property/order-property/Submission";
import { ShoppingContextProvider } from "./property/order-property/components/ShoppingCartContext";
import { PropertyProvider } from "./property/create-update-property/PropertyContext";
import PropertyReportCreate from "./property/create-update-property/PropertyReportCreate";
import PropertyReportUpdate from "./property/create-update-property/PropertyReportUpdate";
import ManageChangeRequest from "./property/create-update-property/manage-change-request/ManageChangeRequest";
import { TasksPage } from "./property/my-task/TasksPage";
import { MarketingCampaignListPage } from "./sales/marketing-campaign/MarketingCampaignListPage";
import { MarketingCampaignProvider } from "./sales/marketing-campaign/create-marketing-campaign/MarketingCampaignContext";
import AddMarketingCampaign from "./sales/marketing-campaign/create-marketing-campaign/AddMarketingCampaign";
import TCNDetails from "./property/order-property/TCNDetails";
import MyRequests from "./property/my-requests/MyRequests";
import NotFound from "./common/error/NotFound";
import FormBuilderDemo from "../ui-kit/components/common/form-builder/FormBuilderDemo";
import { SampleClass } from "./sample/SampleClass";
import TCNAllocationDetails from "./property/allocate-property/TCNAllocationDetails";
import { AllocationContextProvider } from "./property/allocate-property/AllocationContext";
import EditMarketingCampaign from "./sales/marketing-campaign/EditMarketingCampaign";
import { ApproveTransferOrderDetails } from "./property/allocate-property/ApproveTransferOrderDetails";
import SearchAllocations from "./property/search-property-allocations/SearchAllocations";
import { FilterContextProvider } from "./property/FilterContext";
import { TcnWorkFlowType } from "./property/create-update-property/constants/Constants";
import { RequisitionTcnDetails } from "./property/allocate-property/RequisitionTcnDetails";
import { CompleteTransferDetails } from "./property/allocate-property/CompleteTransferDetails";
import { Accordion } from "../ui-kit/Accordion";
import ForeignGiftListPage from "./foreign-gift/manage-foreign-gift/ForeignGiftListPage";
import ForeignGiftsReportCreate from "./foreign-gift/create-update-foreign-gift/ForeignGiftsReportCreate";
import SalesUserListPage from "./manage-users/sales-users/SalesUserListPage";
import AddSalesUser from "./manage-users/sales-users/AddSalesUser";
import { SalesUserProvider } from "./manage-users/sales-users/SalesUserContext";
import { NonReportedTransferProvider } from "./property/create-non-reported-property/NonReportedTransferContext";
import AddNonReportedTransfer from "./property/create-non-reported-property/AddNonReportedTransfer";
import ForeignGiftsReportUpdate from "./foreign-gift/create-update-foreign-gift/ForeignGiftsReportUpdate";
import SalesTransaction from "./sales/management/transactions/SalesTransaction";
import { SalesTransactionContextProvider } from "./sales/management/transactions/SalesTransactionContext";
import { AddICNsToLotContextProvider } from "./sales/management/add-icns-to-lot/AddICNsToLotContext";
import AddICNsToLot from "./sales/management/add-icns-to-lot/AddICNsToLot";
import { LottingDetailsContextProvider } from "./sales/management/lotting-details/LottingDetailsContext";
import LottingDetails from "./sales/management/lotting-details/LottingDetails";
import ICNStatusListPage from "./manage-users/sales-users/ICNStatusListPage";
import EditSalesUser from "./manage-users/sales-users/EditSalesUser";
import { BidderProvider } from "./manage-users/bidders/BidderContext";
import { WantListProvider } from "./property/want-list/create-update-want-list/WantListContext";
import WantListPage from "./property/want-list/manage-want-list/WantListPage";
import SalesList from "./sales/management/SalesList";
import CreateWantList from "./property/want-list/create-update-want-list/CreateWantList";
import { EditWantList } from "./property/want-list/create-update-want-list/EditWantList";
import AddBidder from "./manage-users/bidders/AddBidder";
import AuctionLogin from "./login/Auctionlogin/AuctionLogin";
import LotFileSelection from "./sales/management/lotting-details/lotting-icn-files/LotFileSelection";
import { SalesListContextProvider } from "./sales/management/SalesListContext";
import CustodianLocation from "./sales/management/custodian/CustodianLocation";
import { CustodianLocationContextProvider } from "./sales/management/custodian/CustodianLocationContext";
import ManageBidderListPage from "./manage-users/bidders/ManageBidderListPage";
import { ManageLeaListPage } from "./manage-users/leas/manageLeaListPage";
import EditBidder from "./manage-users/bidders/EditBidder";
import { LotAuctionListContextProvider } from "./sales/management/lot-auction-approval/LotAuctionListContext";
import LotAuctionList from "./sales/management/lot-auction-approval/LotAuctionlist";
import PossessionHistory from "./property/annual-inventory/possession-history/PossessionHistory";
import LotReviewApproval from "./sales/management/lot-review-approval/LotReviewApproval";
import { LotReviewApprovalContextProvider } from "./sales/management/lot-review-approval/LotReviewApprovalContext";
import LotsList from "./custodian/management/LotsList";
import { LotsListContextProvider } from "./custodian/management/LotsListContext";
import SalesSearch from "./sales/search/SalesSearch";
import { SalesSearchContextProvider } from "./sales/search/SalesSearchContext";
import UandDuserProfile from "./user-profile/und-user-profile/UandDuserProfile";
import EditBidderProfile from "./user-profile/bidder-profile/EditBidderProfile";
import EditProfileForSalesUser from "./user-profile/SalesProfile/EditProfileForSalesUser";
import { UserProfileSalesProvider } from "./user-profile/SalesProfile/UserProfileForSalesContext";
import { UserUtils } from "../utils/UserUtils";
import MFAResetProfile from "./user-profile/mfaResetProfile/MFAResetProfile";
import AnnualInventory from "./property/annual-inventory/annualInventory";
import { ContractTransactionContextProvider } from "./sales/management/transactions/contract/ContractTransactionContext";
import ContractTransaction from "./sales/management/transactions/contract/ContractTransaction";
import { ContractDocumentationContextProvider } from "./sales/management/transactions/contract/ContractDocumentationContext";
import ContractDocumentation from "./sales/management/transactions/contract/ContractDocumentation";
import AuctionItem from "./auctions/auction/AuctionItemView";
import { SalesListPBSDOIContextProvider } from "./sales/management-pbs-doi/PBSDOI-SalesListContext";
import SalesListPBSDOI from "./sales/management-pbs-doi/PBSDOI-SalesList";
import BidderPayments from "./payments/bidder-payments/BidderPayments";
import { BidderPaymentsContextProvider } from "./payments/bidder-payments/BidderPaymentsContext";
import { BidderPaymentDetailsContextProvider } from "./payments/bidder-payments/details/BidderPaymentDetailsContext";
import { TransactionCreatePBSDOIContextProvider } from "./sales/management-pbs-doi/transaction/create/CreateContext";
import PBSDOITransaction from "./sales/management-pbs-doi/transaction/PBSDOI-Transaction";
import { TransactionUpdatePBSDOIContextProvider } from "./sales/management-pbs-doi/transaction/update/UpdateContext";
import PBSDOILotsList from "./sales/management-pbs-doi/lot-details/PBSDOI-LotsList";
import { LotsListPBSDOIContextProvider } from "./sales/management-pbs-doi/lot-details/PBSDOI-LotsListContext";
import PBSDOIPropertyDetails from "./sales/management-pbs-doi/lot-details/property/PBSDOI-PropertyDetails";
import { PropertyDetailsCreatePBSDOIContextProvider } from "./sales/management-pbs-doi/lot-details/property/create-update/CreateUpdateContext";
import PBSDOISaleDetails from "./sales/management-pbs-doi/lot-details/sale/PBSDOI-SaleDetails";
import { SaleDetailsCreatePBSDOIContextProvider } from "./sales/management-pbs-doi/lot-details/sale/create-update/CreateUpdateContext";
import { FinalizeSalePBSDOIContextProvider } from "./sales/management-pbs-doi/lot-details/finalize-sale/PBSDOI-FinalizeSaleContext";
import PBSDOIFinalizeSale from "./sales/management-pbs-doi/lot-details/finalize-sale/PBSDOI-FinalizeSale";
import { ContractsListContextProvider } from "./sales/contracts/contracts-list/ContractsListContext";
import ContractsList from "./sales/contracts/contracts-list/ContractsList";
import { ManageContractsContextProvider } from "./sales/contracts/manage-contracts/ManageContractsContext";
import ManageContracts from "./sales/contracts/manage-contracts/ManageContracts";
import SalesDocument from "./sales/management/sales-documents/SalesDocument";
import { SalesDocumentContextProvider } from "./sales/management/sales-documents/SalesDocumentContext";
import NasaItemList from "./nasa/NASAItemList";
import FavoritesList from "./auctions/my-favorites/FavoritesList";
import PropertyUpload from "./property/manage-property/PropertyUpload";
import { ForgotPassword } from "./login/ForgotPassword";
import AddGroupEmails from "./manage-users/group-emails/AddGroupEmails";
import { GroupEmailsProvider } from "./manage-users/group-emails/GroupEmailsContext";
import Reporting3040List from "./property/reporting/3040-reporting/3040-reporting-list";
import Edit3040Reporting from "./property/reporting/3040-reporting/edit-3040-report/edit-3040-reporting";
import { Reporting3040ContextProvider } from "./property/reporting/3040-reporting/edit-3040-report/reporting-3040-context";
import FeaturedItemsList from "./auctions/featured-items/FeaturedItemsListPage";
import AuctionsHome from "./home/AuctionsHome";
import AuctionsList from "./auctions/AuctionsList";
import SearchSalesOrLot from "./auctions/featured-items/manage-featuredList/SearchSalesOrLot";
import RealEstateHome from "./home/RealEstateHome";
import { ManageAuctionAccessContextProvider } from "./auctions/manage-auctions/manage-auction-access/ManageAuctionAccessContext";
import ManageAuctionsAccess from "./auctions/manage-auctions/manage-auction-access/ManageAuctionsAccess";
import MyMessages from "../app/home/MyMessages";
import { MyMessagesContextProvider } from "./home/MyMessagesContext";
import ManageAuctionList from "./sales/management/manage-auction/ManageAuctionList";
import BidBidderList from "./auctions/manage-auctions/manage-auction-access/list/ViewBidBidderList";
import { ManageAuctionListContextProvider } from "./sales/management/manage-auction/ManageAuctionListContext";
import AddUserAccountMaintenance from "./manage-users/AddUserAccountMaintenance";
import EditUserPage from "./manage-users/EditUserPage";
import EditUserAccountMaintenance from "./manage-users/EditUserAccountMaintenance";
import ManageBidderPage from "./auctions/manage-auctions/manage-auction-access/manage-auction/manage-bidders/ManageBidderPage";
import SwitchUserAccount from "./manage-users/SwitchUserAccount";
import { FleetContextProvider } from "./sales/fleet/edit-fleet/Fleet-context";
import EditFleet from "./sales/fleet/edit-fleet/EditFleet";
import { ManageBidsContextProvider } from "./sales/bids/ManageBidsContext";
import ManageBids from "./sales/bids/ManageBids";
import ManageFleetList from "./sales/fleet/manage-fleet/ManageFleet";
import UserLocked from "./common/error/UserLocked";
import ContractTransactionAwardInfo from "./sales/management/transactions/contract/ContractTransactionAwardInfo";
import SwitchBidderAccount from "./manage-users/bidders/SwitchBidderAccount";
import { ManageRegistersContextProvider } from "./payments/registers/ManageRegistersContext";
import ManageRegisters from "./payments/registers/ManageRegisters";
import { ContractManagementContextProvider } from "./payments/contract-payments/view/common/ContractManagementListContext";
import ContractChargeback from "./payments/contract-payments/view/ContractChargeback";
import LiquidatedDamages from "./payments/contract-payments/view/LiquidatedDamages";
import ContractRefundManagement from "./payments/contract-payments/view/ContractRefundManagement";
import { DefaultContractsContextProvider } from "./sales/contracts/default-contracts/DefaultContractsContext";
import DefaultBidder from "./manage-users/bidders/default-bidder/DefaultBidder";
import { SalePaymentProvider } from "./sales/sale-payment/PaymentContext";
import SalePayment from "./sales/sale-payment/SalePayment";
import FleetPaymentConfirmation from "./sales/sale-payment/payment/Payment-confirmation";
import MyBidsListPage from "./auctions/my-summary/MyBidsList";
import MyTradeListPage from "./auctions/my-summary/MyTradeListPage";
import { SummaryOfChanges } from "./manage-users/bidders/termsAndConditions/SummaryOfChanges";
import TermsAndConditions from "./manage-users/bidders/termsAndConditions/TermsAndCondtions";
import BidderPaymentDetails from "./payments/bidder-payments/details/BidderPaymentDetails";
import { PaymentDetailsContextProvider } from "./payments/bidder-payments/details/create/CreateUpdateContext";
import PaymentDetails from "./payments/bidder-payments/details/PaymentDetails";
import RegisterDetails from "./payments/registers/details/RegisterDetails";
import ContractRefundDetail from "./sales/contracts/contract-refund/ContractRefundDetail";
import { ContractFeeContextProvider } from "./sales/contracts/contract-refund/ContractFeeContext";
import PayTradeAwards from "./auctions/my-summary/PayTradeAwards";
import PaymentConfirmation from "./auctions/my-summary/PaymentConfirmation";
import { ContractDetailsContextProvider } from "./payments/contract-payments/details/common/ContractDetailsContext";
import ContractRefundDetails from "./payments/contract-payments/details/refund/ContractRefundDetails";
import ContractChargebackDetails from "./payments/contract-payments/details/chargebacks/ContractChargebackDetails";
import LiquidatedDamageDetails from "./payments/contract-payments/details/liquidated-damages/LiquidatedDamageDetails";

export const Paths = {
  accordionSample: "/accordionSample",
  addBidder: "/register/auction",
  addEditMarketingCampaign: "/sales/campaign/add",
  addInternalAgency: "/addInternalAgency",
  addSalesUser: "/sales/users/add",
  allocations: "/allocations",
  annualInventoryList: "/annualInventory",
  approveTransferOrderDetails: "/approve-transfer-order-details",
  approveTransferOrders: "/approve-transfer-orders",
  auctionCategories: "/api/v1/auction-categories",
  auctionLogin: "/auctions/login",
  realEstateAuctions: "/real-estate-auctions",
  auctions: "/auctions/home",
  myBids: "/myBids",
  myTrades: "/MyTradeListPage",
  payTradeAwards: "/PayTradeAwards",
  PaymentConfirmation: "/PaymentConfirmation",
  auctionsList: "/auctions/auctionsList",
  manageAuction: "/auctions/manage",
  bidderUserProfile: "/profile/edit",
  completedTransfer: "/completed-transfer",
  completeTransferDetails: "/complete-transfer-details",
  confirmInformation: "/confirmInformation",
  defaultBidder: "/bidder/default",
  contractList: "/sales/contracts/contractList",
  contractTransaction: "/sales/contract/transaction",
  contractTransactionAwardInfo: "/sales/contract/awardinfo",
  contractSales: "/sales/contract",
  contractDocumentation: "/sales/contract/documentation",
  createForeignGiftReport: "/createForeignGiftReport",
  createNonReportedTransfer: "/createNonReportedTransfer",
  createPropertyReport: "/createPropertyReport",
  createWantList: "/createWantList",
  custodianLotManagement: "/custodian/lot-management",
  editBidder: "/bidders/edit",
  editInternalAgency: "/editInternalAgency",
  editMarketingCampaign: "/sales/campaign/edit",
  editProfileOnSalesUser: "/user-profile/editSalesProfile",
  editPropertyReport: "/editPropertyReport",
  editShippingInfo: "/editShippingInfo",
  editUserAccount: "/user-account/edit",
  editUser: "/editUser",
  editUserPage: "/editUserPage",
  editUserFI: "/editUser",
  EditWantList: "/editWantList",
  emailVerification: "/emailVerification",
  error: "/error",
  excessPropertyReporting: "/excessPropertyReporting",
  foreignGiftList: "/foreignGiftList",
  forgotPassword: "/forgot-password",
  formBuilderDemo: "/demo",
  home: "/",
  internalAgencyList: "/internalAgencyList",
  lealist: "/leaList",
  login: "/login",
  manageBidderStatusList: "/bidders/manage",
  manageChangeRequest: "/manageChangeRequest",
  manageMarketingCampaign: "/sales/campaign/manage",
  mfaReset: "/userProfile/mfaResetProfile/MFAResetProfile",
  myRequests: "/requests",
  myTasks: "/myTasks",
  notFound: "/not-found",
  nuoRegistration: "/nuoRegistration",
  addUserAccountMaintenance: "/user-account/add",
  nuoRegistrationFI: "/nuoRegistration",
  PossessionHistory: "/PossessionHistory",
  ViewHistory: "/PossessionHistory",
  propertyList: "/propertyList",
  irregularPropertyList: "/propertyList?showProperty=irregular",
  propertyListWithoutImages: "/propertyList?showProperty=withoutImages",
  newPropertyList: "/propertyList?showProperty=new",
  switchUserAccount: "/user-account/switch",
  switchBidderAccount: "/bidder-account/switch",
  summaryOfChanges: "/bidder-version-number/summaryOfChanges",
  realEstate: "/auctions/real-estate",
  registrationSuccessful: "/registrationSuccessful",
  requisitionTcnDetails: "/requisition-details",
  requisitionTransferOrders: "/requisition-transfer-order",
  salesAddICNToLot: "/sales/add-to-lot",
  salesAddPropertyPBSDOI: "/sales/add-property-pbs-doi",
  salesContractsList: "/sales/contracts-list",
  salesCustodian: "/sales/custodian-location",
  salesDetailsPBSDOI: "/sales/details-pbs-doi",
  salesFinalizePBSDOI: "/sales/finalize-pbs-doi",
  salesICNStatusList: "/sales/properties",
  salesLotAuctionAprroval: "/sales/lot-auction-approval",
  salesLotDetailsPBSDOI: "/sales/lot-details-pbs-doi",
  salesLotReviewApproval: "/sales/lot-review-approval",
  salesLottingDetails: "/sales/lotting-details",
  salesLottingDetailsDocs: "/sales/lotting-details/documents-selection",
  salesManagement: "/sales/management",
  salesManagementPBSDOI: "/sales/management-pbs-doi",
  salesSearch: "/sales/search",
  contractsManagement: "/sales/contractsManagement",
  salesTransaction: "/sales/transaction",
  salesDocument: "/sales/documentation",
  salesTransactionPBSDOI: "/sales/transaction-pbs-doi",
  salesUsers: "/sales/users",
  propertyCustodianUser: "/propertyCustodian/users",
  sample: "/sample",
  searchProperty: "/searchProperty",
  submission: "/submission",
  termsANdConditions: "/termsAndConditions",
  tasks: "/tasks",
  tcnAllocationDetails: "/tcnAllocationDetails",
  tcnDetails: "/my-requests",
  updateForeignGiftReport: "/updateForeignGiftReport",
  userProfile: "/userProfile",
  userRegistration: "/userRegistration",
  usersList: "/usersList",
  verifyUser: "/verifyUser",
  viewBidder: "/viewBidder",
  viewCart: "/viewCart",
  viewForeignGift: "/viewForeignGift",
  viewProperty: "/viewProperty",
  wantList: "/wantList",
  previewAuctions: "/preview/auctions",
  realEstatePreviewAuctions: "/real-estate-preview/auctions",
  favorites: "/favorites",
  propertyUpload: "/upload",
  groupEmails: "/groupEmails",
  reporting3040List: "/3040-reporting",
  edit3040Report: "/edit-3040-report",
  manageFeaturedItems: "/featuredItems/manage",
  searchSaleOrLot: "/searchSaleOrLot",
  view3040Report: "/view-3040-report",
  manageAuctionAccess: "/auctions/manage-access",
  myMessages: "/auctions/my-messages",
  manageAuctionList: "/manageAuctionList",
  manageBids: "/manageBids",
  searchBidder: "/searchBidder",
  addBidAmount: "/addBidAmount",
  manageBidder: "/manageBidder",
  manageAuctionBidAccess: "/manageAuctionBidAccess",
  manageFleet: "/manageFleet",
  editFleet: "/edit-fleet",
  userLocked: "/userLocked",
  paymentRegisterManager: "/payments/register-details",
  manageRegisters: "/sales/manage-registers",
  paymentDetails: "/payments/payment-details",
  bidderPayments: "/payments/bidder-payments",
  bidderPaymentDetails: "/payments/bidder-payment-details",
  salePayment: "/salePayment",
  fleetPaymentConfirmation: "/fleet/paymentConfirmation",
  contractRefundList: "/my-tasks/contract-refund-management",
  contractChargebacksList: "/my-tasks/contract-chargebacks-management",
  liquidatedDamagesList: "/my-tasks/liquidated-damages-management",
};
/**
 * For Current Page CSS in NavBar - When you add things here, you need to edit page.tsx and page.constants.tsx as well
 */
export const home = [Paths.home];
export const propertyControls = [
  Paths.propertyList,
  Paths.createPropertyReport,
  Paths.editPropertyReport,
  Paths.searchProperty,
  Paths.confirmInformation,
  Paths.submission,
  Paths.myTasks,
  Paths.tasks,
  Paths.myRequests,
  Paths.tcnAllocationDetails,
  Paths.foreignGiftList,
  Paths.createForeignGiftReport,
  Paths.wantList,
  Paths.annualInventoryList,
  Paths.reporting3040List,
];
export const userControls = [
  Paths.usersList,
  Paths.nuoRegistration,
  Paths.salesUsers,
  Paths.addSalesUser,
  Paths.manageBidderStatusList,
  Paths.lealist,
  Paths.propertyCustodianUser,
];
export const internalFunctions = [
  Paths.internalAgencyList,
  Paths.addInternalAgency,
  Paths.createNonReportedTransfer,
];

export const salesControls = [
  Paths.salesLottingDetails,
  Paths.salesAddICNToLot,
  Paths.salesTransaction,
  Paths.salesDocument,
  Paths.salesICNStatusList,
  Paths.salesManagement,
  Paths.salesSearch,
  Paths.salesLotAuctionAprroval,
  Paths.salesContractsList,
  Paths.contractsManagement,
];

export const custodianControls = [Paths.custodianLotManagement];

export const marketingCampaignControls = [
  Paths.addEditMarketingCampaign,
  Paths.manageMarketingCampaign,
];
/**
 * For Right Side Navigation - Current CSS
 */
export const userProfile = [
  Paths.userProfile + "/" + UserUtils.getUserAccountId(),
  Paths.bidderUserProfile,
  Paths.editProfileOnSalesUser,
  Paths.mfaReset,
];

export const viewCart = [Paths.viewCart];

export const login = [Paths.login];

/**
 * -----------------
 */

export const Links = {
  public: [
    {
      path: Paths.login,
      render: (props) => <Login {...props} />,
    },
    {
      path: Paths.userLocked,
      render: (props) => <UserLocked {...props} />,
    },

    {
      path: Paths.auctionLogin,
      render: (props) => <AuctionLogin {...props} />,
    },
    {
      path: Paths.previewAuctions + "/:auctionId",
      render: (props) => <AuctionItem {...props} />,
    },
    {
      path: Paths.realEstatePreviewAuctions + "/:auctionId",
      render: (props) => <AuctionItem {...props} />,
    },
    {
      path: Paths.auctions,
      render: (props) => <AuctionsHome {...props} />,
    },
    {
      path: Paths.myBids,
      render: (props) => <MyBidsListPage {...props} />,
    },
    {
      path: Paths.myTrades,
      render: (props) => <MyTradeListPage {...props} />,
    },
    {
      path: Paths.payTradeAwards + "/:contractId",
      render: (props) => <PayTradeAwards {...props} />,
    },
    {
      path: Paths.PaymentConfirmation + "/:paymentId",
      render: (props) => <PaymentConfirmation {...props} />,
    },
    {
      path: Paths.realEstateAuctions + "/sale/:salesNumber",
      render: (props) => <RealEstateHome {...props} />,
    },
    {
      path: Paths.realEstateAuctions,
      render: (props) => <RealEstateHome {...props} />,
    },
    {
      path: Paths.myMessages,
      render: (props) => (
        <MyMessagesContextProvider>
          <MyMessages {...props} />
        </MyMessagesContextProvider>
      ),
    },
    {
      path: Paths.auctionsList,
      render: (props) => <AuctionsList {...props} />,
    },
    {
      path: Paths.auctionsList + "/sale/:saleNumber",
      render: (props) => <AuctionsList {...props} />,
    },
    {
      path: Paths.auctionsList + "/state/:stateCode/:auctionStatus",
      render: (props) => <AuctionsList {...props} />,
    },
    {
      path: Paths.auctionsList + "/status/:auctionStatus",
      render: (props) => <AuctionsList {...props} />,
    },
    {
      path: Paths.auctionsList + "/category/:categoryCode/:auctionStatus",
      render: (props) => <AuctionsList {...props} />,
    },
    {
      path: Paths.previewAuctions + "/:lotId/items",
      render: (props) => <NasaItemList {...props} />,
    },
    {
      path: Paths.favorites,
      render: (props) => <FavoritesList {...props} />,
    },
    {
      path: Paths.forgotPassword,
      render: (props) => <ForgotPassword {...props} />,
    },
    {
      path: Paths.addBidder,
      render: (props) => (
        <BidderProvider>
          <AddBidder {...props} />
        </BidderProvider>
      ),
    },
    {
      path: Paths.termsANdConditions,
      render: (props) => (
        <BidderProvider>
          <TermsAndConditions {...props} />
        </BidderProvider>
      ),
    },
    {
      path: Paths.emailVerification,
      render: (props) => <EmailVerification {...props} />,
    },
    {
      path: Paths.verifyUser,
      render: (props) => <VerifyUser {...props} />,
    },
    {
      path: Paths.userRegistration,
      render: (props) => <Registration {...props} />,
    },
    {
      path: Paths.registrationSuccessful,
      render: (props) => <RegistrationSuccessful {...props} />,
    },
    {
      path: Paths.error,
      render: (props) => <div {...props}>Error</div>,
    },
  ],
  private: [
    {
      path: Paths.addEditMarketingCampaign,
      render: (props) => (
        <MarketingCampaignProvider>
          <AddMarketingCampaign {...props} />
        </MarketingCampaignProvider>
      ),
      //roles: ["S1", "S4", "CO", "SG", "SFU", "CLO", "SMS", "SSA", "SCO", "FMS"],
      roles: ["CO", "SG", "SMS"],
    },
    // If new Permission are added to Home, Add the same for PropertyList aswell
    {
      path: Paths.home,
      render: (props) => <Home {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "COI",
        "RAI",
        "PC",
        "COI",
        "SAI",
        "FIA",
        "FIN",
        "FEX",
      ],
    },
    {
      path: Paths.switchUserAccount,
      render: (props) => <SwitchUserAccount {...props} />,
    },
    {
      path: Paths.switchBidderAccount,
      render: (props) => <SwitchBidderAccount {...props} />,
    },
    {
      path: Paths.summaryOfChanges,
      render: (props) => (
        <BidderProvider>
          <SummaryOfChanges {...props} />
        </BidderProvider>
      ),
    },
    {
      path: Paths.propertyList,
      render: (props) => <PropertyListPage {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "COI",
        "RAI",
        "PC",
        "COI",
      ],
    },
    {
      path: Paths.irregularPropertyList,
      render: (props) => <PropertyListPage {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "COI",
        "RAI",
        "PC",
        "COI",
      ],
    },
    {
      path: Paths.propertyListWithoutImages,
      render: (props) => <PropertyListPage {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "COI",
        "RAI",
        "PC",
        "COI",
      ],
    },
    {
      path: Paths.newPropertyList,
      render: (props) => <PropertyListPage {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "COI",
        "RAI",
        "PC",
        "COI",
      ],
    },
    {
      path: Paths.propertyUpload + "/:icn",
      render: (props) => <PropertyUpload {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "COI",
        "RAI",
        "PC",
        "COI",
      ],
    },
    {
      path: Paths.usersList,
      render: (props) => <UsersListPage {...props} />,
      roles: ["NU", "AC", "SM", ["SA", "MU"], "HD"],
    },
    {
      path: Paths.reporting3040List,
      render: (props) => <Reporting3040List {...props} />,
      roles: ["AC", "SM", "SA"],
    },
    {
      path: Paths.edit3040Report + "/:reportId",
      render: (props) => (
        <Reporting3040ContextProvider>
          <Edit3040Reporting {...props} />,
        </Reporting3040ContextProvider>
      ),
      roles: ["AC", "SM", "SA"],
    },
    {
      path: Paths.view3040Report + "/:reportId",
      render: (props) => (
        <Reporting3040ContextProvider>
          <Edit3040Reporting view={true} {...props} />,
        </Reporting3040ContextProvider>
      ),
      roles: ["AC", "SM", "SA"],
    },
    {
      path: Paths.editFleet + "/:fleetId",
      render: (props) => (
        <FleetContextProvider>
          <EditFleet {...props} />
        </FleetContextProvider>
      ),
      roles: ["FEX", "FIA", "FIN"],
    },
    {
      path: Paths.salePayment,
      render: (props) => (
        <SalePaymentProvider>
          <SalePayment {...props} />
        </SalePaymentProvider>
      ),
      roles: ["FEX", "FIA", "FIN"],
    },
    {
      path: Paths.fleetPaymentConfirmation + "/:paymentIds",
      render: (props) => <FleetPaymentConfirmation {...props} />,
    },
    {
      path: Paths.manageFleet,
      render: (props) => <ManageFleetList {...props} />,
      roles: ["FEX", "FIA", "FIN"],
    },
    {
      path: Paths.groupEmails,
      render: (props) => (
        <GroupEmailsProvider>
          <AddGroupEmails {...props} />,
        </GroupEmailsProvider>
      ),
      roles: ["SM", "AC", "NU", "CO", "SCO", "CLO", "SMS", "SG", ["SA", "MU"]],
    },
    {
      path: Paths.salesUsers,
      render: (props) => <SalesUserListPage {...props} />,
      roles: [
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SMS",
        "SSA",
        "SCO",
        "FMS",
        "SAI",
        "FIA",
      ],
    },
    {
      path: Paths.manageFeaturedItems,
      render: (props) => <FeaturedItemsList {...props} />,
      roles: ["CO", "SG", "SFU", "SCO", "RAI", "COI"],
    },

    {
      path: Paths.searchSaleOrLot,
      render: (props) => <SearchSalesOrLot {...props} />,
      roles: ["CO", "SG", "SFU", "SCO", "RAI", "COI"],
    },
    {
      path: Paths.propertyCustodianUser,
      render: (props) => <PropertyCustodianUserListPage {...props} />,
      roles: ["CO"],
    },
    {
      path: Paths.salesICNStatusList,
      render: (props) => <ICNStatusListPage {...props} />,
      roles: ["CO", "SG", "SFU", "CLO", "SMS", "SSA", "SCO", "FMS"],
    },
    {
      path: Paths.manageBidderStatusList,
      render: (props) => <ManageBidderListPage {...props} />,
      roles: [
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SMS",
        "SSA",
        "SCO",
        "FMS",
        "FIA",
        "FIN",
      ],
    },
    {
      path: Paths.viewBidder + "/:userName",
      render: (props) => <ViewBidder {...props} />,
      roles: ["CO", "SG", "SFU", "CLO", "SMS", "SSA", "SCO", "FMS"],
    },
    {
      path: Paths.editBidder + "/:userName",
      render: (props) => (
        <BidderProvider>
          <EditBidder {...props} />
        </BidderProvider>
      ),
      roles: ["CO"],
    },
    {
      path: Paths.foreignGiftList,
      render: (props) => <ForeignGiftListPage {...props} />,
      roles: ["FR", "FG", "SM"],
    },
    {
      path: Paths.searchProperty,
      render: (props) => <SearchProperty {...props} />,
      roles: [
        "NU",
        "AC",
        "SM",
        "SA",
        "IS",
        "IF",
        "SP",
        "FF",
        "VO",
        ["RP", "FF", "SP"],
        ["PA", "SP", "FF"],
        "FR",
        "FG",
      ],
    },
    {
      path: Paths.myTasks,
      render: (props) => <MyTaskListPage {...props} />,
      roles: ["NU", "AC", "RP", "AO", "SM", "PC", "CLO"],
    },
    {
      path: Paths.tasks,
      render: (props) => <TasksPage {...props} />,
      roles: ["NU", "AC", "RP", "AO", "SM"],
    },
    {
      path: Paths.createPropertyReport,
      render: (props) => (
        <PropertyProvider>
          <PropertyReportCreate {...props} />
        </PropertyProvider>
      ),
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "SA",
        "MU",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SMS",
        "SSA",
        "SCO",
        "FMS",
      ],
    },
    {
      path: Paths.createForeignGiftReport,
      render: (props) => (
        <PropertyProvider>
          <ForeignGiftsReportCreate {...props} />
        </PropertyProvider>
      ),
      roles: ["FR", "FG", "SM"],
    },
    {
      path: Paths.updateForeignGiftReport + "/:icn",
      render: (props) => (
        <PropertyProvider>
          <ForeignGiftsReportUpdate {...props} />
        </PropertyProvider>
      ),
      roles: ["FR", "FG", "SM"],
    },
    {
      path: Paths.myRequests,
      render: (props) => (
        <FilterContextProvider>
          <MyRequests workflow={TcnWorkFlowType.MY_REQUESTS} {...props} />
        </FilterContextProvider>
      ),
      roles: [
        "NU",
        "AC",
        "SM",
        "SA",
        "IF",
        "SP",
        ["PA", "SP", "FF"],
        ["RP", "FF", "SP"],
        ["FI", "FF"],
      ],
    },
    {
      path: Paths.internalAgencyList,
      render: (props) => <InternalAgencyListPage {...props} />,
      roles: ["SM"],
    },
    {
      path: Paths.manageMarketingCampaign,
      render: (props) => <MarketingCampaignListPage {...props} />,
      //roles: ["S1", "S4", "CO", "SG", "SFU", "CLO", "SMS", "SSA", "SCO", "FMS"],
      roles: ["CO", "SG", "SMS"],
    },
    {
      path: Paths.editMarketingCampaign + "/:campaignId",
      render: (props) => (
        <MarketingCampaignProvider>
          <EditMarketingCampaign {...props} />
        </MarketingCampaignProvider>
      ),
      roles: ["S1", "S4", "CO", "SG", "SFU", "CLO", "SMS", "SSA", "SCO", "FMS"],
    },
    {
      path: Paths.editInternalAgency + "/:agencyCode",
      render: (props) => (
        <InternalAgencyProvider>
          <EditInternalAgency {...props} />
        </InternalAgencyProvider>
      ),
      roles: ["SM"],
    },
    {
      path: Paths.editPropertyReport + "/:icn",
      render: (props) => (
        <PropertyProvider>
          <PropertyReportUpdate {...props} />
        </PropertyProvider>
      ),
      roles: [
        "RP",
        "NU",
        "AC",
        "SM",
        "SA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
      ],
    },
    {
      path: Paths.nuoRegistration,
      render: (props) => <NuoRegistration {...props} />,
      roles: ["NU", "AC", "SM", ["SA", "MU"]],
    },
    {
      path: Paths.addUserAccountMaintenance + "/:userId",
      render: (props) => <AddUserAccountMaintenance {...props} />,
      roles: ["NU", "AC", "SM", ["SA", "MU"]],
    },
    {
      path: Paths.nuoRegistrationFI + "/:FICheck",
      render: (props) => <NuoRegistration {...props} />,
      roles: ["FM", "SM", ["FI", "SA"], ["SA", "MU"]],
    },
    {
      path: Paths.addSalesUser,
      render: (props) => (
        <SalesUserProvider>
          <AddSalesUser {...props} />
        </SalesUserProvider>
      ),
      roles: ["CO", "SSA", "SAI", "FIA"],
    },
    {
      path: Paths.salesUsers + "/:userId",
      render: (props) => (
        <SalesUserProvider>
          <EditSalesUser {...props} />
        </SalesUserProvider>
      ),
      roles: ["CO", "SSA", "SAI", "FIA"],
    },
    {
      path: Paths.editUser + "/:userAccountId",
      render: (props) => <EditUser {...props} />,
      roles: ["NU", "AC", "SM", "SA", "CO", "HD"],
    },
    {
      path: Paths.editUserPage + "/:userId",
      render: (props) => <EditUserPage {...props} />,
      roles: ["NU", "AC", "SM", "SA", "CO", "HD"],
    },
    {
      path: Paths.editUserAccount + "/:userId" + "/:accountId",
      render: (props) => <EditUserAccountMaintenance {...props} />,
      roles: ["NU", "AC", "SM", "SA", "CO", "HD"],
    },
    {
      path: Paths.userProfile + "/:userAccountId",
      render: (props) => <UandDuserProfile {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "FMS",
        "FIA",
        "FIN",
      ],
    },
    {
      path: Paths.editProfileOnSalesUser,
      render: (props) => (
        <UserProfileSalesProvider>
          <EditProfileForSalesUser {...props} />
        </UserProfileSalesProvider>
      ),
      roles: [
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "RAI",
        "FIA",
        "FIN",
        "FEX",
        "SAI",
      ],
    },
    {
      path: Paths.mfaReset,
      render: (props) => <MFAResetProfile {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "FIA",
        "FIN",
        "FEX",
      ],
    },
    {
      path: Paths.bidderUserProfile + "/:userName",
      render: (props) => (
        <BidderProvider>
          <EditBidderProfile {...props} />
        </BidderProvider>
      ),
    },
    {
      path: Paths.editUserFI + "/:userAccountId" + "/:FICheck",
      render: (props) => <EditUser {...props} />,
      roles: ["FM", "SM", ["FI", "SA"], ["SA", "MU"]],
    },

    {
      path: Paths.addInternalAgency,
      render: (props) => (
        <InternalAgencyProvider>
          <AddInternalAgency {...props} />
        </InternalAgencyProvider>
      ),
      roles: ["SM"],
    },
    {
      path: Paths.createNonReportedTransfer,
      render: (props) => (
        <NonReportedTransferProvider>
          <AddNonReportedTransfer {...props} />
        </NonReportedTransferProvider>
      ),
      roles: ["SM", "AC"],
    },
    {
      path: Paths.wantList,
      render: (props) => <WantListPage {...props} />,
      roles: [
        "NU",
        "SM",
        "AC",
        ["SA", "MU"],
        "AO",
        "RP",
        "PA",
        "SP",
        "FF",
        "IF",
        "IS",
        "VO",
      ],
    },
    {
      path: Paths.EditWantList + "/:wantListId",
      render: (props) => (
        <WantListProvider>
          <EditWantList {...props} />
        </WantListProvider>
      ),
      roles: [
        "NU",
        "SM",
        "AC",
        ["SA", "MU"],
        "AO",
        "RP",
        "PA",
        "SP",
        "FF",
        "IF",
        "IS",
        "VO",
      ],
    },
    {
      path: Paths.lealist,
      render: (props) => <ManageLeaListPage {...props} />,
      roles: ["FM", "SM", ["FI", "SA"], ["SA", "MU"]],
    },
    {
      path: Paths.annualInventoryList,
      render: (props) => <AnnualInventory {...props} />,
      roles: ["FM", "SM", "FI", ["FI", "SA"], ["SA", "MU"]],
    },
    {
      path: Paths.PossessionHistory + "/:icn",
      render: (props) => <PossessionHistory {...props} />,
      roles: ["FM", "SM"],
    },
    {
      path: Paths.ViewHistory + "/:icn" + "/:FICheck",
      render: (props) => <PossessionHistory {...props} />,
      roles: ["FI", ["FI", "SA"], ["SA", "MU"]],
    },
    {
      path: Paths.manageChangeRequest + "/:changeRequestId",
      render: (props) => <ManageChangeRequest {...props} />,
      roles: ["NU", "AC"],
    },
    {
      path: Paths.viewProperty + "/:icn",
      render: (props) => <ViewProperty {...props} />,
      roles: [
        "RP",
        "SM",
        "NU",
        "AC",
        "AO",
        "SA",
        "MU",
        "IF",
        "IS",
        "S1",
        "S4",
        "PA",
        "SP",
        "FF",
        "FI",
        "VO",
        "FG",
        "FR",
        "FA",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SSA",
        "SMS",
        "SCO",
        "FMS",
        "COI",
        "RAI",
        "PC",
        "COI",
      ],
    },
    {
      path: Paths.viewForeignGift + "/:icn",
      render: (props) => <ForeignGiftView {...props} />,
      roles: [
        "FR",
        "FG",
        "SM",
        "NU",
        "AC",
        "SA",
        "FF",
        "SP",
        "CO",
        "SG",
        "SFU",
        "CLO",
        "SMS",
        "SSA",
        "SCO",
        "FMS",
      ],
    },
    {
      path: Paths.tcnAllocationDetails + "/:tcn",
      render: (props) => (
        <AllocationContextProvider>
          <TCNAllocationDetails {...props} />
        </AllocationContextProvider>
      ),
      roles: ["AC", "SM", "NU", "RP"],
    },
    {
      path: Paths.approveTransferOrderDetails + "/:tcn",
      render: (props) => (
        <AllocationContextProvider>
          <ApproveTransferOrderDetails {...props} />
        </AllocationContextProvider>
      ),
      roles: ["AC", "SM", "NU", "AO"],
    },
    {
      path: Paths.requisitionTcnDetails + "/:tcn",
      render: (props) => (
        <AllocationContextProvider>
          <RequisitionTcnDetails {...props} />
        </AllocationContextProvider>
      ),
      roles: ["AC", "SM"],
    },
    {
      path: Paths.completeTransferDetails + "/:tcn",
      render: (props) => (
        <AllocationContextProvider>
          <CompleteTransferDetails {...props} />
        </AllocationContextProvider>
      ),
      roles: ["AC", "SM"],
    },
    {
      path: Paths.viewCart,
      render: (props) => <ViewCart {...props} />,
      roles: [
        "SM",
        "SA",
        "AC",
        "NU",
        "SP",
        "IF",
        ["IF", "RP", "IS", "FF"],
        ["RP", "FF", "SP"],
        ["PA", "SP", "FF"],
        "FG",
      ],
    },
    {
      path: Paths.editShippingInfo,
      render: (props) => <EditShippingInfo {...props} />,
    },
    {
      path: Paths.confirmInformation,
      render: (props) => (
        <ShoppingContextProvider>
          <ConfirmInformation {...props} />
        </ShoppingContextProvider>
      ),
      roles: [
        "SM",
        "SA",
        "AC",
        "NU",
        "IF",
        "SP",
        ["IF", "RP", "IS", "FF"],
        ["RP", "FF", "SP"],
        ["PA", "SP", "FF"],
      ],
    },
    {
      path: Paths.submission,
      render: (props) => <Submission {...props} />,
      roles: [
        "SM",
        "SA",
        "AC",
        "NU",
        "IF",
        "SP",
        ["IF", "RP", "IS", "FF"],
        ["RP", "FF", "SP"],
        ["PA", "SP", "FF"],
        "FG",
        "FR",
      ],
    },
    {
      path: Paths.allocations,
      render: (props) => (
        <FilterContextProvider>
          <SearchAllocations
            workflow={TcnWorkFlowType.ALLOCATIONS}
            {...props}
          />
        </FilterContextProvider>
      ),
      roles: ["SM", "AC", "NU", "RP"],
    },
    {
      path: Paths.approveTransferOrders,
      render: (props) => (
        <FilterContextProvider>
          <SearchAllocations
            workflow={TcnWorkFlowType.APPROVE_TRANSFER_ORDERS}
            {...props}
          />
        </FilterContextProvider>
      ),
      roles: ["SM", "AO", "NU", ["FG", "AC"]],
    },
    {
      path: Paths.requisitionTransferOrders,
      render: (props) => (
        <FilterContextProvider>
          <SearchAllocations
            workflow={TcnWorkFlowType.REQUISITION_TRANSFER_ORDERS}
            {...props}
          />
        </FilterContextProvider>
      ),
      roles: ["SM", "AC"],
    },
    {
      path: Paths.completedTransfer,
      render: (props) => (
        <FilterContextProvider>
          <SearchAllocations
            workflow={TcnWorkFlowType.COMPLETED_TRASFER}
            {...props}
          />
        </FilterContextProvider>
      ),
      roles: ["SM", "AC"],
    },
    {
      path: Paths.tcnDetails + "/:tcn",
      render: (props) => (
        <ShoppingContextProvider>
          <TCNDetails {...props} />
        </ShoppingContextProvider>
      ),
      roles: ["NU", "AC", "SM", "SA", "IF", "SP", ["PA", "SP", "FF"]],
    },
    {
      path: Paths.salesTransaction + "/:saleId",
      render: (props) => (
        <SalesTransactionContextProvider>
          <SalesTransaction {...props} />
        </SalesTransactionContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO", "RAI"],
    },
    {
      path: Paths.salesTransaction,
      render: (props) => (
        <SalesTransactionContextProvider>
          <SalesTransaction {...props} />
        </SalesTransactionContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.salesDocument + "/:saleId",
      render: (props) => (
        <SalesDocumentContextProvider>
          <SalesDocument {...props} />
        </SalesDocumentContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.salesAddICNToLot + "/:saleId",
      render: (props) => (
        <AddICNsToLotContextProvider>
          <AddICNsToLot {...props} />
        </AddICNsToLotContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.salesLottingDetails + "/:saleId",
      render: (props) => (
        <LottingDetailsContextProvider>
          <LottingDetails {...props} />
        </LottingDetailsContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.salesLottingDetailsDocs + "/:saleId",
      render: (props) => (
        <LottingDetailsContextProvider>
          <LotFileSelection {...props} />
        </LottingDetailsContextProvider>
      ),
      roles: ["SCO", "SMS", "SG"],
    },
    {
      path: Paths.salesCustodian + "/:saleId",
      render: (props) => (
        <CustodianLocationContextProvider>
          <CustodianLocation {...props} />
        </CustodianLocationContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.salesLotAuctionAprroval + "/:saleId",
      render: (props) => (
        <LotAuctionListContextProvider>
          <LotAuctionList {...props} />
        </LotAuctionListContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.salesContractsList + "/:saleId",
      render: (props) => (
        <ContractsListContextProvider>
          <ContractsList {...props} />
        </ContractsListContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.salesLotReviewApproval + "/:saleId/:custodianId",
      render: (props) => (
        <LotReviewApprovalContextProvider>
          <LotReviewApproval {...props} />
        </LotReviewApprovalContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO", "PC", "AC", "SM", "NU"],
    },
    {
      path: Paths.createWantList,
      render: (props) => (
        <WantListProvider>
          <CreateWantList {...props} />
        </WantListProvider>
      ),
      roles: [
        "NU",
        "SM",
        "AC",
        ["SA", "MU"],
        "AO",
        "RP",
        "PA",
        "SP",
        "FF",
        "IF",
        "IS",
        "VO",
      ],
    },
    {
      path: Paths.salesManagement,
      render: (props) => (
        <SalesListContextProvider>
          <SalesList {...props} />
        </SalesListContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "SFU", "CLO", "SSA", "FMS", "CO"],
    },
    {
      path: Paths.salesManagementPBSDOI,
      render: (props) => (
        <SalesListPBSDOIContextProvider>
          <SalesListPBSDOI {...props} />
        </SalesListPBSDOIContextProvider>
      ),
      roles: ["RAI", "SAI", "COI"],
    },
    {
      path: Paths.salesTransactionPBSDOI,
      render: (props) => (
        <TransactionCreatePBSDOIContextProvider>
          <PBSDOITransaction {...props} />
        </TransactionCreatePBSDOIContextProvider>
      ),
      roles: ["RAI", "SAI", "COI"],
    },
    {
      path: Paths.salesTransactionPBSDOI + "/:saleId",
      render: (props) => (
        <TransactionUpdatePBSDOIContextProvider>
          <PBSDOITransaction {...props} />
        </TransactionUpdatePBSDOIContextProvider>
      ),
      roles: ["RAI", "SAI", "COI"],
    },
    {
      path: Paths.salesLotDetailsPBSDOI + "/:saleId",
      render: (props) => (
        <LotsListPBSDOIContextProvider>
          <PBSDOILotsList {...props} />
        </LotsListPBSDOIContextProvider>
      ),
      roles: ["RAI", "SAI", "COI"],
    },
    {
      path: Paths.salesAddPropertyPBSDOI + "/:saleId/:lotId",
      render: (props) => (
        <PropertyDetailsCreatePBSDOIContextProvider>
          <PBSDOIPropertyDetails {...props} />
        </PropertyDetailsCreatePBSDOIContextProvider>
      ),
      roles: ["RAI", "SAI", "COI"],
    },
    {
      path: Paths.salesDetailsPBSDOI + "/:saleId/:lotId",
      render: (props) => (
        <SaleDetailsCreatePBSDOIContextProvider>
          <PBSDOISaleDetails {...props} />
        </SaleDetailsCreatePBSDOIContextProvider>
      ),
      roles: ["RAI", "SAI", "COI"],
    },
    {
      path: Paths.salesFinalizePBSDOI + "/:saleId/:lotId",
      render: (props) => (
        <FinalizeSalePBSDOIContextProvider>
          <PBSDOIFinalizeSale {...props} />
        </FinalizeSalePBSDOIContextProvider>
      ),
      roles: ["RAI", "SAI", "COI"],
    },
    {
      path: Paths.paymentDetails + "/:bidderId/:type",
      render: (props) => (
        <PaymentDetailsContextProvider>
          <PaymentDetails {...props} />
        </PaymentDetailsContextProvider>
      ),
      roles: ["COZ"],
    },
    {
      path: Paths.salesSearch,
      render: (props) => (
        <SalesSearchContextProvider>
          <SalesSearch {...props} />
        </SalesSearchContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.contractsManagement,
      render: (props) => (
        <ManageContractsContextProvider>
          <ManageContracts {...props} />
        </ManageContractsContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO", "FIA", "FIN"],
    },
    {
      path: Paths.custodianLotManagement,
      render: (props) => (
        <LotsListContextProvider>
          <LotsList {...props} />
        </LotsListContextProvider>
      ),
      roles: ["PC", "SM", "NU", "AC"],
    },
    {
      path: Paths.contractList + "/:saleId",
      render: (props) => (
        <ContractsListContextProvider>
          <ContractsList {...props} />
        </ContractsListContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.defaultBidder + "/:userName",
      render: (props) => (
        <DefaultContractsContextProvider>
          <DefaultBidder {...props} />
        </DefaultContractsContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.contractTransaction + "/:saleId/:contractId",
      render: (props) => (
        <ContractTransactionContextProvider>
          <ContractTransaction {...props} />
        </ContractTransactionContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO", "FIA", "FIN"],
    },
    {
      path:
        Paths.contractTransactionAwardInfo + "/:saleId/:contractId/:auctionId",
      render: (props) => (
        <ContractTransactionContextProvider>
          <ContractTransactionAwardInfo {...props} />
        </ContractTransactionContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CLO", "CO", "FIA", "FIN"],
    },
    {
      path: Paths.contractDocumentation + "/:saleId",
      render: (props) => (
        <ContractDocumentationContextProvider>
          <ContractDocumentation {...props} />
        </ContractDocumentationContextProvider>
      ),
      roles: ["SCO", "SM", "SMS"],
    },

    {
      path: Paths.contractSales + "/:type/:contractNumber",
      render: (props) => (
        <ContractFeeContextProvider>
          <ContractRefundDetail {...props} />
        </ContractFeeContextProvider>
      ),
      roles: ["SCO"],
    },
    {
      path: Paths.manageAuctionAccess + "/:saleId/:saleNumber",
      render: (props) => (
        <ManageAuctionAccessContextProvider>
          <ManageAuctionsAccess {...props} />
        </ManageAuctionAccessContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "RAI", "SAI"],
    },
    {
      path: Paths.manageBidder + "/:auctionId",
      render: (props) => (
        <ManageAuctionAccessContextProvider>
          <ManageBidderPage {...props} />
        </ManageAuctionAccessContextProvider>
      ),
      roles: ["CO", "SCO", "RAI", "SAI", "SMS", "SG"],
    },
    {
      path: Paths.manageAuctionList,
      render: (props) => (
        <ManageAuctionListContextProvider>
          <ManageAuctionList {...props} />
        </ManageAuctionListContextProvider>
      ),
      roles: ["CO", "SCO", "RAI", "SAI", "SMS", "SG"],
    },
    {
      path: Paths.manageBids,
      render: (props) => (
        <ManageBidsContextProvider>
          <ManageBids {...props} />
        </ManageBidsContextProvider>
      ),
      roles: ["CO", "SCO", "RAI", "SAI", "SMS", "SG"],
    },
    {
      path: Paths.manageRegisters,
      render: (props) => (
        <ManageRegistersContextProvider>
          <ManageRegisters {...props} />
        </ManageRegistersContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "CLO"],
    },
    {
      path: Paths.contractRefundList,
      render: (props) => (
        <ContractManagementContextProvider>
          <ContractRefundManagement {...props} />
        </ContractManagementContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "CLO"],
    },
    {
      path: Paths.contractChargebacksList,
      render: (props) => (
        <ContractManagementContextProvider>
          <ContractChargeback {...props} />
        </ContractManagementContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "CLO"],
    },
    {
      path: Paths.liquidatedDamagesList,
      render: (props) => (
        <ContractManagementContextProvider>
          <LiquidatedDamages {...props} />
        </ContractManagementContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "CLO"],
    },
    {
      path: Paths.contractRefundList + "/:contractNumber",
      render: (props) => (
        <ContractDetailsContextProvider>
          <ContractRefundDetails {...props} />
        </ContractDetailsContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "CLO"],
    },
    {
      path: Paths.contractChargebacksList + "/:contractNumber",
      render: (props) => (
        <ContractDetailsContextProvider>
          <ContractChargebackDetails {...props} />
        </ContractDetailsContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "CLO"],
    },
    {
      path: Paths.liquidatedDamagesList + "/:contractNumber",
      render: (props) => (
        <ContractDetailsContextProvider>
          <LiquidatedDamageDetails {...props} />
        </ContractDetailsContextProvider>
      ),
      roles: ["SCO", "SMS", "SG", "CO", "CLO"],
    },
    // {
    //   path: Paths.searchBidder,
    //   render: (props) => (
    //     <SearchBidderContextProvider>
    //       <SearchBidder {...props} />
    //     </SearchBidderContextProvider>

    //   ),
    //   roles: ["CO", "SCO", "RAI", "SAI", "SMS", "SG"],
    // },
    // {
    //   path: Paths.addBidAmount,
    //   render: (props) => (
    //     // <AddBidAmountContextProvider>
    //     //   <AddBidAmount {...props} />
    //     // </AddBidAmountContextProvider>

    //   ),
    //   roles: ["CO", "SCO", "RAI", "SAI", "SMS", "SG"],
    // },
    {
      path: Paths.manageAuctionBidAccess + "/:auctionId",
      render: (props) => (
        <ManageAuctionAccessContextProvider>
          <BidBidderList {...props} />
        </ManageAuctionAccessContextProvider>
      ),
      roles: ["CO", "SCO", "RAI", "SAI", "SMS", "SG"],
    },
    {
      path: Paths.paymentRegisterManager + "/:registerId",
      render: (props) => <RegisterDetails {...props} />,
      roles: ["SCO", "SMS", "SG", "CLO", "CO"],
    },
    {
      path: Paths.bidderPayments,
      render: (props) => (
        <BidderPaymentsContextProvider>
          <BidderPayments {...props} />
        </BidderPaymentsContextProvider>
      ),
      roles: ["CLO", "SCO", "SG", "SMS", "CO"],
    },
    {
      path: Paths.bidderPaymentDetails + "/:bidderId",
      render: (props) => (
        <BidderPaymentDetailsContextProvider>
          <BidderPaymentDetails {...props} />
        </BidderPaymentDetailsContextProvider>
      ),
      roles: ["CLO", "SCO", "SG", "SMS", "CO"],
    },
  ],
  errors: [
    { path: Paths.notFound, render: (props) => <NotFound {...props} /> },
  ],
  dev: [
    {
      path: Paths.sample,
      render: (props) => <SampleClass {...props} />,
    },
    {
      path: Paths.formBuilderDemo,
      render: (props) => <FormBuilderDemo {...props} />,
    },
    {
      path: Paths.accordionSample,
      render: (props) => <Accordion {...props} />,
    },
  ],
};
export const Router = (props) => {
  const publicRoutes = Links.public.map((item, i) => (
    <Route exact path={item.path} render={item.render} key={i + "-public"} />
  ));
  const privateRoutes = Links.private.map((item, i) => (
    <PrivateRoute
      exact
      path={item.path}
      component={item.render}
      key={i + "-private"}
      roles={item?.roles}
    />
  ));
  const notFound = Links.errors.map((item, i) => (
    <Route exact path={item.path} render={item.render} key={i + "-eror"} />
  ));
  const devRoutes = Links.dev.map((item, i) => (
    <Route exact path={item.path} render={item.render} key={i + "-dev"} />
  ));
  const routes = [].concat(
    publicRoutes,
    privateRoutes,
    devRoutes,
    notFound,
    <Redirect from="*" to="/not-found" key={"redirect"} />
  );

  return <Switch>{routes}</Switch>;
};

export class PageHelper {
  static openPage(page: string): void {
    history.push(page);
  }
}
