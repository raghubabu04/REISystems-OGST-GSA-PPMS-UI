import React from "react";
import { Link } from "react-router-dom";
import placeholderImage from "../../../assets/images/placeholder-img.jpg";
import PPMSCardFooter from "../common/card/PPMS-card-footer";
import { PPMSButton } from "../common/PPMS-button";
import PPMSCardHeader from "../common/card/PPMS-card-header";
import PPMSCardMedia from "../common/card/PPMS-card-media";
import PPMSCardBody from "../common/card/PPMS-card-body";
import PPMSCard from "../common/card/PPMS-card";
import {
  condition,
  PropertyGroupType,
  TcnStatus,
} from "../../../app/property/create-update-property/constants/Constants";
import { PPMSModal } from "../common/PPMS-modal";
import { PageUtils } from "../../../utils/PageUtils";
import PPMSCardGroup from "../common/card/PPMS-card-group";
import { Paths } from "../../../app/Router";
import { PPMSSelect } from "../common/select/PPMS-select";
import { PPMSInput } from "../common/input/PPMS-input";
import PPMSErrorMessage from "../common/form/PPMS-error-message";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { DenyAllocationModal } from "./DenyAllocation";
import { OriginalAcqModal } from "./OriginalAcqModal";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { TiEdit } from "react-icons/ti";
import { PPMSUnderlineText } from "../common/PPMS-underline-text";
import { PPMSTextArea } from "../common/input/PPMS-textarea";
import { CompleteTransferFooter } from "./CompleteTransferFooter";
import { FooterForAllAppReq } from "./FooterAllAppReq";
import AddToLot from "./AddToLot";
import { AiFillCheckCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { formatICN } from "../../utilities/FormatUtil";
import { BsFillFlagFill } from "react-icons/bs";
import { Pointer } from "highcharts";
import { UserUtils } from "../../../utils/UserUtils";

interface PPMSPropertyProps {
  propertyId?: string;
  icn?: string;
  itemName?: string;
  thumb_image?: string;
  qty_available?: number;
  qty_reported?: number;
  qty_requested?: number;
  categoryCode?: number;
  location?: any;
  itemStatus?: string;
  federalSupplyClass?: string;
  fairMarketValue?: number;
  conditionCode?: string;
  originalAcquisitionCost?: number;
  unitOfIssueValue?: string;
  reimbursementRequired?: string;
  categoryName?: string;
  agencyBureau?: string;
  date_release?: string;
  quantity?: number;
  custodian?: string;
  addToLot?: boolean;
  isAddToLotDisabled?: boolean;
  propertyType?: string;
  propertyTypeDescription?: string;
  address?: string;
  handleAddToLot?: () => void;
  addCartType?:
    | "Add to Cart"
    | "Update Quantity"
    | "Confirm_Cart"
    | "Submission"
    | "";
  selectPropType?: "Select Property";
  handleAddToCart?: any;
  inputPropertTextArea?: any;
  handleUpdateQuantity?: any;
  handleOrderQuantity?: any;
  handleDeleteProperty?: any;
  cartItemId?: string;
  cartCount?: number;
  roles?: any;
  requestedItemId?: any;
  surplusReleaseDate?: string;
  priorityCodes?: any[];
  savePriority?: any;
  priorityUpdated?: boolean;
  successData?: any;
  priorityLabel?: any;
  priorityId?: string;
  justification?: string;
  internal?: boolean;
  isdisabled?: boolean;
  fscDescription?: string;
  tcnStatus?: string;
  qtyAllocated?: number;
  qtyAvailableForAllocation?: number;
  qtyTransferred?: number;
  demilitarizationCode?: string;
  allocation?: boolean;
  handleAllocate?: any;
  icnStatus?: any;
  denyIcnAllocation?: any;
  approveTransferOrders?: boolean;
  tcn?: string;
  handleApproveQuantityBtn?: any;
  handleApprovalQuantityChange?: any;
  qtyApproved?: number;
  saveOrgAcqCost?: any;
  permissionOAC?: boolean;
  initialOrgAcqCost?: number;
  reasonOAC?: string;
  icnApproveStatus?: any;
  qtyAvailableForApproval?: number;
  requisition?: boolean;
  qtyAvailableForTransfer?: number;
  disableAllIcns?: boolean;
  resetDenyAllIcns?: () => void;
  handleTransferQtyBtn?: any;
  completeTransfer?: boolean;
  updateApproveAll?: boolean;
  recall?: any;
  reason?: string;
  additionalReason?: string;
  icnTransferStatus?: string;
  propertyHistoryFlag?: boolean;
  qty_req_by_me?: number;
  recallRecords?: any;
  creationSource?: string;
  vaultLocation?: string;
  administration?: string;
  donorName?: string;
  recipientName?: string;
  donorCountry?: string;
  fiscalYear?: string;
  propertyGroup?: string;
  vaultShelfNumber?: string;
  isForeignGift?: boolean;
  actionDisabled?: boolean;
  displayFlagIcon?: boolean;
  isDonee?: boolean;
  zip?: string;
}
interface PPMSPropertyState {
  addedToCart: boolean;
  quantity: number;
  addToCartDisabled: boolean;
  isQuantityValid: boolean;
  verificationMessage: string;
  updateQuantityDisabled: boolean;
  allocateQuantityDisabled: boolean;
  showDeleteModal: boolean;
  showPriorityModal: boolean;
  showAddToCartModal: boolean;
  showDenyAllocationModal: boolean;
  denyAllocationReason: string;
  propertyToDelete: string;
  conditionCodeValue: string;
  unitOfIssue: "";
  justification: string;
  unitIssueList: [];
  selectedPriority: string;
  priorityUpdated: boolean;
  qtyAllocated: number;
  qtyApproved: number;
  showOrgAcqModal: boolean;
  stateList: [];
  approveQuantityDisabled?: boolean;
  approveQuantity?: number;
  showTransferOrderDenyModal?: boolean;
  showTransferOrderDenialReasonBtn?: boolean;
  approveTransferOrderDenialReason?: string;
  isApproveQtyField: boolean;
  transferQtyDisabled: boolean;
  isTransferQtyField: boolean;
  qtyTransferred: number;
  isApproveAll: boolean;
  recallHistoryOption: string;
  isNonReportedProperty: boolean;
  isForeignGift?: boolean;
  vaultLocation?: string;
  vaultShelfNumber?: string;
  isFSC1005or1010: boolean;
  isQuantityUpdated: boolean;
  updateRequestedByMe: number;
  updateTotalQuantityRequested: number;
  previousQuantity: number;
}

export class PPMSProperty extends React.Component<
  PPMSPropertyProps,
  PPMSPropertyState
> {
  constructor(props: any) {
    super(props);
    this.handleAllocateOrUpdateQuantity = this.handleAllocateOrUpdateQuantity.bind(
      this
    );
    this.handleApproveOrUpdateQuantity = this.handleApproveOrUpdateQuantity.bind(
      this
    );
    this.state = {
      isQuantityUpdated: false,
      updateRequestedByMe: null,
      updateTotalQuantityRequested: null,
      previousQuantity: null,
      selectedPriority: "",
      justification: this.props.justification ? this.props.justification : "",
      quantity: this.props.quantity ? this.props.quantity : 1,
      addToCartDisabled: false,
      isQuantityValid: true,
      verificationMessage: "",
      updateQuantityDisabled: true,

      allocateQuantityDisabled:
        this.props.creationSource !== "foreignGift"
          ? this.props.qtyAllocated
            ? true
            : this.props.icnStatus === "Denied"
          : false,
      qtyAllocated:
        this.props.qtyAllocated !== null
          ? this.props.qtyAllocated
          : this.props.qty_requested,
      qtyApproved:
        this.props.qtyApproved !== null
          ? this.props.qtyApproved
          : this.props.tcnStatus === TcnStatus.ALLOCATION_CONFIRMED &&
            this.props.requisition
          ? 0
          : this.props.qtyAvailableForApproval,
      qtyTransferred:
        this.props.qtyTransferred !== null
          ? this.props.qtyTransferred
          : this.props.tcnStatus === TcnStatus.ALLOCATION_CONFIRMED &&
            this.props.requisition
          ? this.props.qtyAllocated
          : this.props.qtyApproved,
      denyAllocationReason: "",
      showDeleteModal: false,
      showPriorityModal: false,
      showAddToCartModal: false,
      showDenyAllocationModal: false,
      propertyToDelete: "",
      conditionCodeValue: "",
      unitOfIssue: "",
      unitIssueList: [],
      addedToCart: false,
      priorityUpdated: true,
      showOrgAcqModal: false,
      stateList: [],
      approveQuantityDisabled:
        this.props.creationSource !== "foreignGift"
          ? this.props.qtyApproved !== null || this.props.qtyApproved === 0
            ? true
            : this.props.icnApproveStatus === "AO Denied"
          : this.props.qtyApproved
          ? true
          : false,
      approveQuantity: this.props.qtyAllocated,
      showTransferOrderDenialReasonBtn: false,
      showTransferOrderDenyModal: false,
      isApproveQtyField: true,
      transferQtyDisabled: this.props.qtyTransferred
        ? true
        : this.props.icnStatus === "Denied" ||
          this.props.icnApproveStatus === "AO Denied" ||
          this.props.icnTransferStatus === "Transfer Denied" ||
          this.props.icnTransferStatus === "Donation Denied",
      isTransferQtyField: true,
      isApproveAll: true,
      recallHistoryOption: "",
      isNonReportedProperty: false,
      isForeignGift:
        this.props.creationSource === PropertyGroupType.FOREIGN_GIFT,
      vaultLocation: this.props.vaultLocation,
      vaultShelfNumber: this.props.vaultShelfNumber
        ? this.props.vaultShelfNumber
        : "",
      isFSC1005or1010: this.props.isDonee ? this.props.isDonee : false,
    };
  }
  propertyApiService = new PropertyApiService();
  commonApiService = new CommonApiService();

  componentDidMount() {
    if (
      this.props.federalSupplyClass === "1005" ||
      this.props.federalSupplyClass === "1010"
    ) {
      this.setState({
        isFSC1005or1010: true,
      });
    }
    condition.forEach((item) => {
      if (item.id === this.props?.conditionCode) {
        this.setState({
          conditionCodeValue: item.value,
        });
      }
    });
    if (this.props?.creationSource === "NonReportProp") {
      this.setState({
        isNonReportedProperty: true,
      });
    }
    this.setState({
      previousQuantity: this.props.quantity,
    });
  }

  handleOrderQuantity = (event) => {
    this.setState({
      isQuantityValid: true,
      verificationMessage: "",
      addToCartDisabled: false,
      updateQuantityDisabled: false,
    });
    let value = event.currentTarget.value;
    if (value.toString().length > 5) {
      value = value.toString().substring(0, 5);
    }
    if (value !== "") {
      value = Math.floor(value) <= 0 ? 0 : Math.floor(value);
    }
    if (value > this.props.qty_available) {
      this.setState({
        isQuantityValid: false,
        verificationMessage:
          "Quantity selected cannot be greater than available quantity.",
        addToCartDisabled: true,
        updateQuantityDisabled: true,
      });
    }
    this.setState({
      quantity: value,
    });
  };

  handleDenyICNApproval = () => {
    this.props.denyIcnAllocation(
      this.state.approveTransferOrderDenialReason,
      this.props.requestedItemId,
      `Approval successfully denied for ICN# ${this.props.icn}`,
      `Approval couldn't be denied for ICN ${this.props.icn}.`,
      "Approval"
    );
    this.setState({
      qtyApproved: 0,
      showTransferOrderDenyModal: false,
      approveQuantityDisabled:
        this.props.creationSource !== "foreignGift" ? true : false,
    });
  };

  handleApproveTransferOrderDenialReasonSaveBtn = () => {
    this.setState({ showTransferOrderDenyModal: false });
    this.handleDenyICNApproval();
  };

  handleApproveTransferOrderDenialreasonChange = (event) => {
    let reason = event?.target?.value;
    if (reason != null || reason != undefined) {
      this.setState({
        approveTransferOrderDenialReason: reason,
      });
    }
  };

  handleApproveQuantityChange = (event) => {
    this.setState({
      isApproveQtyField: true,
      verificationMessage: "",
      approveQuantityDisabled: false,
      isApproveAll: false,
    });
    let current_approve_qty = event.currentTarget.value;
    if (current_approve_qty.toString().length > 5) {
      current_approve_qty = current_approve_qty.toString().substring(0, 5);
    }
    if (current_approve_qty !== "") {
      current_approve_qty =
        Math.floor(current_approve_qty) <= 0
          ? 0
          : Math.floor(current_approve_qty);
    }
    if (current_approve_qty === 0) {
      this.setState({
        isApproveQtyField: false,
        verificationMessage: "Quantity selected should be greater than zero.",
        approveQuantityDisabled: true,
      });
    }
    if (
      current_approve_qty >
      this.props.qtyApproved + this.props.qtyAvailableForApproval
    ) {
      this.setState({
        isApproveQtyField: false,
        verificationMessage: "Cannot approve more than allocated quantity",
        approveQuantityDisabled: true,
      });
    }
    this.setState({
      qtyApproved: current_approve_qty,
    });
  };

  handleTransferQuantityChange = (event) => {
    this.setState({
      isTransferQtyField: true,
      transferQtyDisabled: false,
      verificationMessage: "",
    });
    let current_transfer_qty = event.currentTarget.value;
    if (this.props.creationSource === "foreignGift") {
      current_transfer_qty = 1;
    }
    if (current_transfer_qty.toString().length > 5) {
      current_transfer_qty = current_transfer_qty.toString().substring(0, 5);
    }
    if (current_transfer_qty !== "") {
      current_transfer_qty =
        Math.floor(current_transfer_qty) <= 0
          ? 0
          : Math.floor(current_transfer_qty);
    }
    if (current_transfer_qty === 0) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage: "Quantity selected should be greater than zero.",
        transferQtyDisabled: true,
      });
    }
    if (
      current_transfer_qty >
      this.props.qtyAvailableForTransfer + this.props.qtyTransferred
    ) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage:
          "Cannot approve more than quantity available for transfer",
        transferQtyDisabled: true,
      });
    }
    this.setState({
      qtyTransferred: current_transfer_qty,
    });
  };

  handleAllocationQuantity = (event) => {
    this.setState({
      isQuantityValid: true,
      verificationMessage: "",
      allocateQuantityDisabled: false,
    });
    let value = event.currentTarget.value;
    if (value.toString().length > 5) {
      value = value.toString().substring(0, 5);
    }
    if (value !== "") {
      value = Math.floor(value) <= 0 ? 0 : Math.floor(value);
    }
    if (this.props.qtyAllocated) {
      if (
        value >
        this.props.qtyAvailableForAllocation + this.props.qtyAllocated
      ) {
        this.setState({
          isQuantityValid: false,
          verificationMessage:
            "Quantity selected cannot be greater than available quantity",
          allocateQuantityDisabled: true,
        });
      }
    } else if (value > this.props.qtyAvailableForAllocation) {
      this.setState({
        isQuantityValid: false,
        verificationMessage:
          "Quantity selected cannot be greater than available quantity",
        allocateQuantityDisabled: true,
      });
    }
    this.setState({
      qtyAllocated: value,
    });
  };
  handleAllocationQuantityForFG = (allQty: number) => {
    this.setState({
      isQuantityValid: true,
      verificationMessage: "",
      allocateQuantityDisabled: false,
    });
    if (this.props.qtyAllocated) {
      this.setState({
        qtyAllocated: allQty,
      });
    }
  };
  handleAddToCart = () => {
    if (this.state.quantity === 0 || !this.state.quantity) {
      this.setState({
        isQuantityValid: false,
        verificationMessage: "Quantity selected should be greater than zero.",
      });
    } else {
      if (this.props.reimbursementRequired === "Y") {
        this.handleAddToCartOpen();
        this.handleAddToCartOpen();
      }
      let payload = {
        propertyId: this.props.propertyId,
        cartCount: this.state.quantity,
        priorityCode: this.state.selectedPriority,
        propertyGroup: this.props.creationSource,
      };
      this.props.handleAddToCart(payload); //api call happens here

      this.setState({
        isQuantityUpdated: true,
        updateRequestedByMe: this.props.qty_req_by_me + this.state.quantity,
        updateTotalQuantityRequested:
          this.props.qty_requested + this.state.quantity,
        previousQuantity: this.state.quantity,
      });
    }
    this.setState({
      updateQuantityDisabled: true,
    });
  };

  handleAllocateOrUpdateQuantity = () => {
    let allQty = this.state.qtyAllocated;
    if (this.state.isForeignGift || this.state.isFSC1005or1010) {
      allQty = 1;
    }
    if (allQty === 0 || !allQty) {
      this.setState({
        isQuantityValid: false,
        verificationMessage: "Quantity selected should be greater than zero.",
      });
    } else if (
      this.props.qtyAllocated === null &&
      (allQty > this.props.qtyAvailableForAllocation ||
        allQty > this.props.qtyAvailableForAllocation + this.props.qtyAllocated)
    ) {
      this.setState({
        isQuantityValid: false,
        verificationMessage:
          "Quantity selected cannot be greater than available quantity",
        allocateQuantityDisabled: true,
      });
    } else {
      this.props.handleAllocate(this.props.icn, allQty);
    }
    this.setState({
      allocateQuantityDisabled: true,
    });
  };

  handleApproveOrUpdateQuantity = () => {
    let allApprQty = this.state.qtyApproved;
    if (this.state.isForeignGift || this.state.isFSC1005or1010) {
      allApprQty = 1;
    }
    if (allApprQty === 0 || !allApprQty) {
      this.setState({
        isApproveQtyField: false,
        verificationMessage: "Quantity selected should be greater than zero.",
      });
    } else {
      this.props.handleApproveQuantityBtn(
        allApprQty,
        this.props.requestedItemId
      );
    }
    this.setState({
      approveQuantityDisabled: true,
    });
    this.props.resetDenyAllIcns();
  };

  handleTransferOrUpdateQty = () => {
    let allTraQty = this.state.qtyTransferred;
    if (this.state.isForeignGift || this.state.isFSC1005or1010) {
      allTraQty = 1;
    }
    if (allTraQty === 0 || !allTraQty) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage: "Quantity selected should be greater than zero.",
      });
    } else {
      this.props.handleTransferQtyBtn(allTraQty, this.props.requestedItemId);
    }
    this.setState({
      transferQtyDisabled: true,
    });
  };

  handleUpdateQuantity = () => {
    if (this.state.quantity === 0) {
      this.setState({
        isQuantityValid: false,
        verificationMessage: "Quantity selected should be greater than zero.",
      });
    } else if (this.props.reimbursementRequired === "Y") {
      this.handleUpdateQuantityOpen();
    } else {
      let payload = {
        propertyId: this.props.propertyId,
        cartCount: this.state.quantity,
        requestedItemId: this.props.requestedItemId,
      };
      this.props.handleUpdateQuantity(payload);

      let newUpdatedRequestedByMe: number;
      let newTotalQuantityRequested: number;
      if (this.state.updateRequestedByMe) {
        newUpdatedRequestedByMe =
          this.state.updateRequestedByMe +
          (this.state.quantity - this.state.previousQuantity);
        newTotalQuantityRequested =
          this.state.updateTotalQuantityRequested +
          (this.state.quantity - this.state.previousQuantity);
      } else {
        newUpdatedRequestedByMe =
          this.props.qty_req_by_me +
          (this.state.quantity - this.state.previousQuantity);
        newTotalQuantityRequested =
          this.props.qty_requested +
          (this.state.quantity - this.state.previousQuantity);
      }
      this.setState({
        isQuantityUpdated: true,
        updateRequestedByMe: newUpdatedRequestedByMe,
        updateTotalQuantityRequested: newTotalQuantityRequested,
        previousQuantity: this.state.quantity,
      });
    }
    this.setState({
      updateQuantityDisabled: true,
    });
  };
  handleDeleteProperty = () => {
    this.props.handleDeleteProperty(this.props.requestedItemId);
    this.handleDeleteClose();
  };
  handleDeleteClose = () => {
    this.setState({
      showDeleteModal: false,
    });
  };
  handleDeleteOpen = (id) => {
    this.setState({
      showDeleteModal: true,
      propertyToDelete: id,
    });
  };
  handleAddToCartClose = () => {
    this.setState({
      showAddToCartModal: false,
    });
  };
  handleAddToSave = () => {
    let payload = {
      propertyId: this.props.propertyId,
      cartCount: this.state.quantity,
      requestedItemId: this.props.requestedItemId,
    };
    this.props.handleUpdateQuantity(payload);
    this.setState({
      showAddToCartModal: false,
    });
  };
  handleAddToCartOpen = () => {
    this.setState({
      showAddToCartModal: true,
    });
  };
  handleUpdateQuantityClose = (event) => {
    this.setState({
      showAddToCartModal: false,
    });
  };
  handleUpdateQuantityOpen = () => {
    this.setState({
      showAddToCartModal: true,
    });
  };

  handleSelectPriority = (event) => {
    this.setState({
      selectedPriority: event.currentTarget.value,
    });
  };

  handleDenyReasonTextChange = (event) => {
    this.setState({
      denyAllocationReason: event.target.value,
    });
  };

  setShowDenyAllocation = () => {
    this.setState({
      showDenyAllocationModal: true,
    });
  };

  setShowDenyApproval = () => {
    this.setState({
      showTransferOrderDenyModal: true,
    });
  };

  setCloseDenyAllocation = () => {
    this.setState({
      showDenyAllocationModal: false,
    });
  };

  setShowOrgAcq = () => {
    this.setState({
      showOrgAcqModal: true,
    });
  };

  setCloseOrgAcq = () => {
    this.setState({
      showOrgAcqModal: false,
    });
  };

  handleDenyICNAllocation = () => {
    if (!this.props.requisition) {
      this.props.denyIcnAllocation(
        this.state.denyAllocationReason,
        this.props.requestedItemId,
        `Allocation successfully denied for ICN# ${this.props.icn}`,
        `Allocation couldn't be denied for ICN ${this.props.icn}.`,
        "Allocation"
      );
      this.setState({
        qtyAllocated: 0,
        allocateQuantityDisabled:
          this.props.creationSource !== "foreignGift" ? true : false,
      });
    } else {
      this.props.denyIcnAllocation(
        this.state.denyAllocationReason,
        this.props.requestedItemId,
        `Transferred successfully denied for ICN# ${this.props.icn}`,
        `Transferred couldn't be denied for ICN ${this.props.icn}.`,
        "Requisition"
      );
      this.setState({
        qtyTransferred: 0,
        transferQtyDisabled:
          this.props.creationSource !== "foreignGift" ? true : false,
      });
      this.setState({ showDenyAllocationModal: false });
    }
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      quantity: newProps.quantity ? newProps.quantity : 1,
    });
    if (newProps.qtyApproved !== this.props.qtyApproved) {
      this.setState({ qtyApproved: newProps.qtyApproved });
    }
    if (newProps.creationSource === "NonReportProp") {
      this.setState({
        isNonReportedProperty: true,
      });
    }
  }
  canAddToCart = (isInternal) => {
    if (
      this.props.roles?.isNU ||
      this.props.roles?.isSM ||
      this.props.roles?.isAC ||
      this.props.roles?.isFG ||
      (this.props.roles?.isSA && this.props.roles?.isMU) ||
      (isInternal && this.props.roles?.isIF) ||
      (!isInternal && this.props.roles?.isSP) ||
      this.props.addCartType !== "Add to Cart"
    ) {
      return true;
    }
    return false;
  };

  canSelectPriority = () => {
    if (this.props.cartCount > 0) {
      return true;
    } else {
      if (this.state.quantity === 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  getToolTipContent = () => {
    if (this.props.cartCount === 0) {
      return "If the Disaster code is not available in the drop down list, contact GSA help desk at testmail@gsa.gov";
    } else {
      return "If you wish to add or change the Priority, delete the item from the cart and add it again from the 'Property Search' page.";
    }
  };

  setInfoTipContentOAC = () => {
    if (this.props.initialOrgAcqCost && this.props.reasonOAC) {
      return (
        "OAC updated from " +
        PageUtils.getFormattedCurrency(this.props.initialOrgAcqCost) +
        " to " +
        PageUtils.getFormattedCurrency(this.props.originalAcquisitionCost) +
        "." +
        " Reason: " +
        this.props.reasonOAC +
        "."
      );
    } else if (this.props.initialOrgAcqCost) {
      return (
        "OAC updated from " +
        PageUtils.getFormattedCurrency(this.props.initialOrgAcqCost) +
        "to" +
        PageUtils.getFormattedCurrency(this.props.originalAcquisitionCost) +
        "."
      );
    } else {
      return "Information of Updated OAC.";
    }
  };

  getApproveTrasnferDenyReasonModalBody = () => {
    return (
      <>
        <PPMSTextArea
          id={"approve-transfer-order-deny-reason-text"}
          isRequired={false}
          isDisabled={false}
          inputType={"text"}
          label={"Reason for Denial"}
          onChange={this.handleApproveTransferOrderDenialreasonChange}
          defaultValue={""}
          validationMessage={"Please do enter reason"}
          maxLength={100}
          isInvalid={false}
          isValid={true}
        />
        <small>Maximum 100 characters</small>
      </>
    );
  };

  onRecall = (recallReason, reason, inputQty) => {
    if (inputQty === null) {
      inputQty = 0;
    }
    inputQty = parseInt(inputQty);
    if (inputQty <= 0 || inputQty === null) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage: "Quantity should be greater than zero.",
      });
    } else if (recallReason === "" || recallReason === null) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage: "Reason should be selected.",
      });
    } else if (
      recallReason === "Shortage/Partial Recall" &&
      inputQty >= this.props.qtyTransferred
    ) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage:
          "Quantity should be less than the transferred quantity when reason is Shortage/Partial Recall.",
      });
    } else if (
      recallReason === "Complete Recall" &&
      inputQty !== this.props.qtyTransferred
    ) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage:
          "Quantity should be equal to transferred quantity when reason is Complete Recall.",
      });
    } else if (
      recallReason === "Overage" &&
      inputQty <= this.props.qtyTransferred
    ) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage:
          "Quantity should be more than transferred quantity when reason is Overage.",
      });
    } else if (
      (recallReason === "Shortage/Partial Recall" ||
        recallReason === "Complete Recall") &&
      (reason === null || reason === "")
    ) {
      this.setState({
        isTransferQtyField: false,
        verificationMessage: "Additional reason should be given.",
      });
    } else {
      this.setState({
        isTransferQtyField: true,
      });
      this.props.recall(
        this.props.requestedItemId,
        inputQty,
        recallReason,
        reason
      );
    }
  };

  recallHistory = () => {
    let option =
      this.props.itemStatus === "RETURNED AFTER INTERNAL SCREENING"
        ? "internal"
        : this.props.itemStatus === "RETURNED" &&
          new Date(Date.now()) > new Date(this.props.date_release)
        ? this.state.recallHistoryOption
        : "external";
    let params = {
      icn: this.props.icn,
      option: option,
    };
    this.propertyApiService
      .recallHistory(params)
      .then((res) => {
        addToast({
          text: "Recalled the ICN successfully",
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: "Error in recalling the ICN",
          type: "error",
          heading: "Error",
        });
      });
  };

  render() {
    let iconStyles = {
      color: "#f05454",
      fontSize: "1.3em",
      cursor: "pointer",
    };
    return (
      <>
        <PPMSCardGroup className={"ppms-card-group icn-card"}>
          <PPMSCard layout="flagDefault">
            <PPMSCardHeader
              className={
                this.props.addToLot ? `usa-header-slim flex-justify` : ``
              }
            >
              <h3>
                <Link
                  to={
                    this.state.isForeignGift
                      ? `${Paths.viewForeignGift}/${this.props.icn}`
                      : `${Paths.viewProperty}/${this.props.icn}`
                  }
                >
                  {this.props.addCartType !== ""
                    ? this.props.icn.length <= 14
                      ? this.props.icn.replace(/(.{6})(.{4})(.{4})/, "$1-$2-$3")
                      : this.props.icn.replace(
                          /(.{6})(.{4})(.{4})(.+)/,
                          "$1-$2-$3-$4"
                        )
                    : this.props.icn.length <= 14
                    ? this.props.icn.replace(/(.{6})(.{4})(.{4})/, "$1-$2-$3")
                    : this.props.icn.replace(
                        /(.{6})(.{4})(.{4})(.+)/,
                        "$1-$2-$3-$4"
                      )}
                </Link>
              </h3>

              <div className={"grid-row grid-gap-2"}>
                {this.props.itemName && (
                  <div className={"item-name"}>
                    {this.state.isForeignGift
                      ? `${this.props.vaultLocation} ${this.props.vaultShelfNumber}`
                      : this.props.itemName}
                  </div>
                )}
                {this.props.displayFlagIcon &&
                (this.props.tcnStatus === "Pending Allocation" ||
                  this.props.tcnStatus === "Requested") ? (
                  <Link
                    to={{
                      pathname: `${Paths.viewProperty}/${this.props.icn}`,
                      state: { fromAllocationPage: true },
                    }}
                  >
                    <BsFillFlagFill style={iconStyles} />
                  </Link>
                ) : (
                  ""
                )}
              </div>
              {this.props.addToLot && (
                <>
                  <div className={"grid-row grid-gap-2"}>
                    {this.props.custodian && (
                      <div className={"custodian"}>
                        Custodian: {this.props.custodian}
                      </div>
                    )}
                  </div>
                  <div className={"grid-row grid-gap-2"}>
                    <PPMSButton
                      id={this.props.icn + "-add-to-lot"}
                      label={""}
                      icon={
                        this.props.isAddToLotDisabled ? (
                          <AiFillCheckCircle />
                        ) : (
                          <AiOutlinePlusCircle />
                        )
                      }
                      className={`close ${
                        this.props.actionDisabled ? "close-disabled" : ""
                      }`}
                      onPress={this.props.handleAddToLot}
                      variant={"secondary"}
                      isDisabled={
                        this.props.actionDisabled
                          ? this.props.actionDisabled
                          : this.props.isAddToLotDisabled
                      }
                    />
                  </div>
                </>
              )}
            </PPMSCardHeader>
            <PPMSCardMedia
              className={this.props.addToLot ? `usa-card-media-slim` : ``}
            >
              <img
                src={
                  this.props.thumb_image
                    ? this.props.thumb_image
                    : placeholderImage
                }
                alt="A placeholder"
              />
            </PPMSCardMedia>
            <PPMSCardBody
              className={this.props.addToLot ? `usa-body-slim` : ``}
            >
              {this.props.addToLot ? (
                <AddToLot
                  typeDescription={this.props.propertyTypeDescription}
                  location={this.props.location}
                  fsc={this.props.federalSupplyClass}
                  type={this.props.propertyType}
                  quantity={this.props.quantity}
                  unitOfIssue={this.props.unitOfIssueValue}
                  condition={this.props.conditionCode}
                  address={this.props.address}
                  icn={this.props.icn}
                  zip={this.props.zip}
                />
              ) : this.state.isForeignGift ? (
                <>
                  <div className="grid-row tablet:grid-gap-3">
                    <ul className={"usa-list usa-list-icn-card ui-shade"}>
                      <li>
                        <span>Item Name</span>
                        {this.props.itemName}
                      </li>
                      <li>
                        <span>Fiscal Year</span>
                        {this.props.fiscalYear}
                      </li>
                      <li>
                        <span>Item Status</span>
                        {this.props.itemStatus}
                      </li>
                      <li>
                        <span>Administration</span>
                        {this.props.administration}
                      </li>
                      <li>
                        <span>Recipient Name</span>
                        {this.props.recipientName}
                      </li>
                    </ul>
                  </div>

                  <div className="grid-row tablet:grid-gap-3">
                    <ul className={"usa-list usa-list-icn-card"}>
                      <li>
                        <span>Donor Country</span>
                        {this.props.donorCountry}
                      </li>
                      <li>
                        <span>Donor Name</span>
                        {this.props.donorName}
                      </li>
                      <li>
                        <span>Fair Market Value</span>
                        {this.props.fairMarketValue
                          ? PageUtils.getFormattedCurrency(
                              this.props.fairMarketValue
                            )
                          : PageUtils.getFormattedCurrency(0)}
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid-row tablet:grid-gap-3">
                    <ul className={"usa-list usa-list-icn-card ui-shade"}>
                      <li>
                        <span>Location </span>
                        {this.props.location}
                      </li>
                      <li>
                        <span>Federal Supply Class </span>
                        {this.props.federalSupplyClass}
                      </li>
                      {this.props.allocation === true ||
                      this.props.approveTransferOrders === true ||
                      this.props.requisition === true ||
                      this.props.completeTransfer === true ? null : (
                        <li>
                          <span>Condition </span>
                          {this.state.conditionCodeValue}
                        </li>
                      )}
                      {this.props.allocation === true ||
                      this.props.approveTransferOrders === true ||
                      this.props.requisition === true ||
                      this.props.completeTransfer === true ? (
                        <li>
                          <span>Demilitarization Code </span>
                          {this.props.demilitarizationCode}
                        </li>
                      ) : (
                        <li>
                          <span>Item status </span>
                          {this.props.itemStatus}
                        </li>
                      )}
                      {this.props.date_release && (
                        <li>
                          <span>Excess release date </span>
                          {this.props.date_release}
                        </li>
                      )}
                      {this.props.surplusReleaseDate && (
                        <li>
                          <span>Surplus release date </span>
                          {this.props.surplusReleaseDate}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="grid-row tablet:grid-gap-3">
                    <ul className={"usa-list usa-list-icn-card"}>
                      {this.props.reimbursementRequired === "Y" ? (
                        <li>
                          <span>Reimbursement required </span>
                          {this.props.fairMarketValue
                            ? PageUtils.getFormattedCurrency(
                                this.props.fairMarketValue
                              )
                            : PageUtils.getFormattedCurrency(0)}
                        </li>
                      ) : null}
                      <li>
                        <span>Unit of issue </span>
                        {this.props.unitOfIssueValue}
                      </li>
                      {
                        <li>
                          <span>
                            Original acquisition cost{" "}
                            {this.props.permissionOAC &&
                            (this.props.approveTransferOrders ||
                              this.props.requisition ||
                              this.props.completeTransfer ||
                              UserUtils.isSystemAdminUser() ||
                              UserUtils.isUserFireArmManager()) ? (
                              <button
                                className="usa-button--unstyled"
                                type="button"
                                id={"inf-org-acq"}
                                onClick={() => this.setShowOrgAcq()}
                              >
                                <TiEdit title={"Edit Acquisition Cost"} />
                              </button>
                            ) : null}
                          </span>
                          {this.props.permissionOAC &&
                          (this.props.approveTransferOrders ||
                            this.props.requisition ||
                            this.props.completeTransfer) ? (
                            this.props.originalAcquisitionCost &&
                            this.props.initialOrgAcqCost ? (
                              <>
                                <PPMSUnderlineText
                                  id={"org-edit-acq-cost"}
                                  infoTipContent={this.setInfoTipContentOAC()}
                                  value={PageUtils.getFormattedCurrency(
                                    this.props.originalAcquisitionCost
                                  )}
                                />
                              </>
                            ) : (
                              PageUtils.getFormattedCurrency(
                                this.props.originalAcquisitionCost
                              )
                            )
                          ) : this.props.originalAcquisitionCost ? (
                            PageUtils.getFormattedCurrency(
                              this.props.originalAcquisitionCost
                            )
                          ) : (
                            PageUtils.getFormattedCurrency(0)
                          )}
                        </li>
                      }
                      {this.props.allocation === true ||
                      this.props.approveTransferOrders === true ||
                      this.props.requisition === true ||
                      this.props.completeTransfer === true ? (
                        <>
                          <li>
                            <span>Quantity Reported </span>
                            {this.state.isNonReportedProperty
                              ? 0
                              : this.props.qty_reported}
                          </li>
                          <li>
                            <span>Quantity Requested by Requester </span>
                            {this.props.qty_requested}
                          </li>
                          {this.props.approveTransferOrders === true ? (
                            <li>
                              <span>Quantity Available for Approval </span>
                              {this.props.qtyAvailableForApproval}
                            </li>
                          ) : this.props.requisition === true ||
                            this.props.completeTransfer === true ? (
                            <li>
                              <span>Quantity Available for Transfer </span>
                              {this.props.qtyAvailableForTransfer}
                            </li>
                          ) : (
                            <li>
                              <span>Quantity Available for Allocation </span>
                              {this.props.qtyAvailableForAllocation}
                            </li>
                          )}
                          {this.props.qtyAllocated === null ? (
                            <> </>
                          ) : (
                            <li>
                              <span>Quantity Allocated </span>
                              {this.props.qtyAllocated}
                            </li>
                          )}
                          {this.props.qtyTransferred == null ? null : (
                            <li>
                              <span>Quantity Transferred </span>
                              {this.props.qtyTransferred}
                            </li>
                          )}
                        </>
                      ) : this.props.addCartType !== "Submission" ? (
                        <>
                          {!this.state.isNonReportedProperty && (
                            <li>
                              <span>Quantity available </span>
                              {this.props.qty_available}
                            </li>
                          )}
                          {this.state.isNonReportedProperty && (
                            <li>
                              <span>Quantity</span>
                              {this.props.qty_available}
                            </li>
                          )}
                          {!this.state.isNonReportedProperty ? (
                            !this.state.isQuantityUpdated ? (
                              <li>
                                <span>Quantity requested by Me </span>
                                {this.props.qty_req_by_me}
                              </li>
                            ) : (
                              <li>
                                <span>Quantity requested by Me </span>
                                {this.state.updateRequestedByMe}
                              </li>
                            )
                          ) : (
                            <></>
                          )}

                          {!this.state.isNonReportedProperty ? (
                            !this.state.isQuantityUpdated ? (
                              <li>
                                <span>Total quantity requested </span>
                                {this.props.qty_requested}
                              </li>
                            ) : (
                              <li>
                                <span>Total quantity requested </span>
                                {this.state.updateTotalQuantityRequested}
                              </li>
                            )
                          ) : (
                            <></>
                          )}

                          {this.props.propertyHistoryFlag === true &&
                          this.props.qtyTransferred !== null &&
                          !this.state.isNonReportedProperty ? (
                            <li>
                              <span>Quantity Transferred </span>
                              {this.props.qtyTransferred}
                            </li>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        <li>
                          <span>Quantity requested by User </span>
                          {this.props.qty_req_by_me}
                        </li>
                      )}

                      {(this.props.approveTransferOrders === true ||
                        this.props.requisition === true ||
                        this.props.completeTransfer === true) &&
                      this.props.qtyApproved !== null ? (
                        <li>
                          <span>Quantity Approved </span>
                          {this.props.qtyApproved}
                        </li>
                      ) : null}
                      {(this.props.approveTransferOrders === true ||
                        this.props.requisition === true ||
                        this.props.completeTransfer === true) &&
                      this.props.qtyApproved === null ? (
                        <li>
                          <span>Quantity Approved </span>
                          {0}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </>
              )}
            </PPMSCardBody>
            {this.props.addToLot !== true &&
            this.props.allocation !== true &&
            this.props.approveTransferOrders !== true &&
            this.props.requisition !== true &&
            this.props.completeTransfer !== true &&
            this.props.propertyHistoryFlag !== true ? (
              <PPMSCardFooter>
                <div className="grid-container item-search-result-input">
                  <div className="grid-row tablet:grid-gap-3">
                    {this.props.addCartType === "Confirm_Cart" ? (
                      <p>
                        <strong>QTY. </strong>
                        {this.state.quantity}
                      </p>
                    ) : (
                      <>
                        <div className={"grid-col-auto margin-top-4 cart-row"}>
                          {!this.state.isForeignGift &&
                            this.canAddToCart(this.props?.internal) &&
                            this.props?.addCartType !== "" &&
                            this.props?.addCartType !== "Submission" &&
                            !this.state.isFSC1005or1010 && (
                              <PPMSInput
                                isDisabled={this.props?.isdisabled === true}
                                className={"property-select"}
                                id={"order-quantity"}
                                inputType={"number"}
                                isInvalid={false}
                                isValid={false}
                                isRequired={true}
                                value={this.state.quantity}
                                onChange={this.handleOrderQuantity}
                                label={"QTY."}
                              />
                            )}

                          {!this.state.isForeignGift &&
                            !this.state.isFSC1005or1010 &&
                            this.canAddToCart(this.props?.internal) &&
                            this.props.priorityLabel === "Select Priority" && (
                              <PPMSSelect
                                placeholderValue={"Not Selected"}
                                selectName={"SelectPriority"}
                                selectClass={"property-select"}
                                label={"Select Priority"}
                                values={this.props.priorityCodes}
                                isRequired={false}
                                onChange={this.handleSelectPriority}
                                identifierValue={"disasterName"}
                                identifierKey={"disasterCode"}
                                isInvalid={false}
                                isValid={false}
                                defaultValue={
                                  this.state.selectedPriority
                                    ? this.state.selectedPriority
                                    : this.props.priorityId
                                }
                                selectedValue={
                                  this.state.selectedPriority
                                    ? this.state.selectedPriority
                                    : this.props.priorityId
                                }
                                validationMessage={"Select"}
                                disabled={this.canSelectPriority()}
                                infoTipContent={this.getToolTipContent()}
                              />
                            )}

                          {this.props.addCartType === "Add to Cart" &&
                          this.canAddToCart(this.props?.internal) &&
                          this.props.cartCount === 0 &&
                          this.props.itemStatus !== "TRANSFERRED" ? (
                            <PPMSButton
                              id={"add-to-cart"}
                              label={this.props.addCartType}
                              className={"add-to-cart"}
                              onPress={this.handleAddToCart}
                              isDisabled={this.state.addToCartDisabled}
                            />
                          ) : (this.state.isForeignGift ||
                              this.state.isFSC1005or1010) &&
                            (this.props.cartCount > 0 ||
                              this.props.addCartType === "Update Quantity") ? (
                            <></>
                          ) : this.props.cartCount > 0 ||
                            (this.props.addCartType === "Update Quantity" &&
                              !this.state.isFSC1005or1010) ? (
                            <PPMSButton
                              id={"update-quantity"}
                              label={"Update Quantity"}
                              className={"update-quantity"}
                              onPress={this.handleUpdateQuantity}
                              isDisabled={this.state.updateQuantityDisabled}
                            />
                          ) : (
                            <></>
                          )}

                          {this.showDelete(this.props) && (
                            <PPMSButton
                              id={"delete-property"}
                              label={"Delete Item"}
                              className={"delete-property d-inline"}
                              variant={"link"}
                              onPress={() =>
                                this.handleDeleteOpen(this.props.cartItemId)
                              }
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="grid-row tablet:grid-gap-3">
                    {!this.state.isQuantityValid && (
                      <PPMSErrorMessage id={"quantity-error"}>
                        {this.state.verificationMessage}
                      </PPMSErrorMessage>
                    )}
                  </div>
                </div>
              </PPMSCardFooter>
            ) : this.props.addToLot !== true &&
              this.props.approveTransferOrders !== true &&
              this.props.requisition !== true &&
              this.props.completeTransfer !== true &&
              this.props.propertyHistoryFlag !== true ? (
              <FooterForAllAppReq
                page={"allocation"}
                inputQty={this.state.qtyAllocated}
                qtyAllocated={this.props.qtyAllocated}
                handleAllocateOrUpdateQuantity={
                  this.handleAllocateOrUpdateQuantity
                }
                handleQuantityChange={(e) => this.handleAllocationQuantity(e)}
                handleDenyICN={this.handleDenyICNAllocation}
                setShowDeny={this.setShowDenyAllocation}
                isQuantityValid={this.state.isQuantityValid}
                verificationMessage={this.state.verificationMessage}
                qtyButtonDisabled={this.state.allocateQuantityDisabled}
                icnStatus={this.props.icnStatus}
                max={this.props.qty_available}
                isForeignGift={this.state.isForeignGift}
                tcnStatus={this.props.tcnStatus}
                isDonee={this.state.isFSC1005or1010}
              />
            ) : this.props.addToLot !== true &&
              this.props.requisition !== true &&
              this.props.completeTransfer !== true &&
              this.props.propertyHistoryFlag !== true ? (
              this.props.tcnStatus !== TcnStatus.INTERNAL_TRANSFER ? (
                <>
                  <FooterForAllAppReq
                    page={"approval"}
                    inputQty={this.state.qtyApproved}
                    qtyAllocated={this.props.qtyAllocated}
                    qtyApproved={this.props.qtyApproved}
                    handleAllocateOrUpdateQuantity={
                      this.handleApproveOrUpdateQuantity
                    }
                    handleQuantityChange={(e) =>
                      this.handleApproveQuantityChange(e)
                    }
                    handleDenyICN={this.handleDenyICNApproval}
                    setShowDeny={this.setShowDenyApproval}
                    isQuantityValid={this.state.isApproveQtyField}
                    verificationMessage={this.state.verificationMessage}
                    qtyButtonDisabled={this.state.approveQuantityDisabled}
                    icnStatus={this.props.icnStatus}
                    icnApproveStatus={this.props.icnApproveStatus}
                    disableAllIcns={this.props.disableAllIcns}
                    max={this.props.qtyAllocated}
                    approveAll={this.props.updateApproveAll}
                    isApproveAll={this.state.isApproveAll}
                    isForeignGift={this.state.isForeignGift}
                    isDonee={this.state.isFSC1005or1010}
                  />
                </>
              ) : (
                <></>
              )
            ) : this.props.addToLot !== true &&
              this.props.propertyHistoryFlag !== true ? (
              this.props.completeTransfer !== true ? (
                <>
                  <FooterForAllAppReq
                    page={"requisition"}
                    inputQty={this.state.qtyTransferred}
                    qtyAllocated={this.props.qtyAllocated}
                    qtyApproved={this.props.qtyApproved}
                    qtyTransferred={this.props.qtyTransferred}
                    handleAllocateOrUpdateQuantity={
                      this.handleTransferOrUpdateQty
                    }
                    handleQuantityChange={(e) =>
                      this.handleTransferQuantityChange(e)
                    }
                    isQuantityValid={this.state.isTransferQtyField}
                    verificationMessage={this.state.verificationMessage}
                    qtyButtonDisabled={this.state.transferQtyDisabled}
                    icnStatus={this.props.icnStatus}
                    icnApproveStatus={this.props.icnApproveStatus}
                    max={
                      this.props.qtyAvailableForTransfer +
                      this.props.qtyTransferred
                    }
                    handleDenyICN={this.handleDenyICNAllocation}
                    setShowDeny={this.setShowDenyAllocation}
                    icnTransferStatus={this.props.icnTransferStatus}
                    isForeignGift={this.state.isForeignGift}
                    tcnStatus={this.props.tcnStatus}
                    isDonee={this.state.isFSC1005or1010}
                  />
                </>
              ) : (
                !this.state.isForeignGift &&
                !this.state.isFSC1005or1010 && (
                  <CompleteTransferFooter
                    transferredQty={
                      this.state.isNonReportedProperty
                        ? this.props.qty_requested
                        : this.props.qtyTransferred
                    }
                    onRecall={this.onRecall}
                    qtyerror={this.state.isTransferQtyField}
                    errorMessage={this.state.verificationMessage}
                    recallReason={this.props.reason}
                    additionalReason={this.props.additionalReason}
                    nonReported={this.state.isNonReportedProperty}
                  />
                )
              )
            ) : (
              ""
            )}
          </PPMSCard>
        </PPMSCardGroup>
        <div className="grid-row grid-gap-4">
          <PPMSModal
            show={this.state.showDeleteModal}
            handleClose={this.handleDeleteClose}
            handleSave={this.handleDeleteProperty}
            title={"Delete Cart Item"}
            centered={true}
            backdrop={"static"}
            label={"Yes"}
            labelCancel={"No"}
            body={<ModalDeleteContent state={this.state} props={this.props} />}
            id={"delete-files"}
          />
        </div>
        <div className="grid-row grid-gap-4">
          <PPMSModal
            show={this.state.showTransferOrderDenyModal}
            handleClose={(event) => {
              this.setState({
                showTransferOrderDenyModal: false,
              });
            }}
            handleSave={this.handleApproveTransferOrderDenialReasonSaveBtn}
            title={"Denial Reason"}
            centered={true}
            backdrop={"static"}
            label={"Save"}
            labelCancel={"Cancel"}
            disableSave={
              this.state.approveTransferOrderDenialReason == undefined ||
              this.state.approveTransferOrderDenialReason?.length == 0
            }
            body={this.getApproveTrasnferDenyReasonModalBody()}
            id={"approve-transfer-order-deny-modal"}
          />
        </div>
        <div className="grid-row grid-gap-4">
          <PPMSModal
            show={this.state.showAddToCartModal}
            handleClose={this.handleAddToCartClose}
            handleSave={this.handleAddToSave}
            title={"This Item Requires Reimbursement"}
            centered={true}
            backdrop={"static"}
            label={"Ok"}
            hideLabelCancel={true}
            body={
              <ModalAddToCartContent state={this.state} props={this.props} />
            }
            id={"addToCart-files"}
          />
        </div>
        <div className="grid-row grid-gap-4">
          <DenyAllocationModal
            showDenyAllocationModal={this.state.showDenyAllocationModal}
            requestedItemId={this.props.requestedItemId}
            denyIcnAllocation={(reason) => {
              if (this.props.requisition !== true) {
                this.props.denyIcnAllocation(
                  reason,
                  this.props.requestedItemId,
                  `Denial reason succesfully updated for ICN# ${this.props.icn}`,
                  `Error while updating Denial Reason for ICN# ${this.props.icn}`,
                  "Allocation"
                );
              } else {
                this.props.denyIcnAllocation(
                  reason,
                  this.props.requestedItemId,
                  `Denial reason succesfully updated for ICN# ${this.props.icn}`,
                  `Error while updating Denial Reason for ICN# ${this.props.icn}`,
                  "Requisition"
                );
              }
              this.setCloseDenyAllocation();
              this.setState({ qtyAllocated: 0, qtyTransferred: 0 });
            }}
            handleDenyAllocationClose={this.setCloseDenyAllocation}
            setShowDenyAllocation={this.setShowDenyAllocation}
            enableAllocateButton={(enable) => {
              this.setState({
                allocateQuantityDisabled: !enable,
                transferQtyDisabled: !enable,
              });
            }}
          />
        </div>
        <div className="grid-row grid-gap-4">
          <OriginalAcqModal
            showOrgAcqModal={this.state.showOrgAcqModal}
            closeOrgAcqModal={this.setCloseOrgAcq}
            originalAcqCost={this.props.originalAcquisitionCost}
            saveOrgAcqCost={(newOAC, reason) => {
              this.props.saveOrgAcqCost(newOAC, reason, this.props.icn);
            }}
          />
        </div>
      </>
    );
  }
  private showDelete(props) {
    if (props.tcnStatus) {
      return props.tcnStatus === "Requested";
    } else {
      return props.addCartType === "Update Quantity";
    }
  }
}

const ModalDeleteContent = ({ state, props }) => {
  return (
    <div>
      <p>
        Do you want to delete this item : <b>{formatICN(props.icn)} </b>?
      </p>
    </div>
  );
};

const ModalAddToCartContent = ({ state, props }) => {
  return (
    <div>
      <p>
        You have selected an item that requires reimbursement of Fair Market
        Value. Do not checkout this item unless your agency is prepared to pay
        Fair Market Value. Please delete this item from your cart if you cannot
        pay Fair Market Value.
      </p>
    </div>
  );
};
