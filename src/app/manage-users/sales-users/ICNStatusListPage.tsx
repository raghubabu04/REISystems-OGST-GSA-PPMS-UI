import {cloneDeep} from "lodash";
import React from "react";
import {Tab, Tabs} from "react-bootstrap";
import {CgNotes, CgRemove} from "react-icons/cg";
import {FaInfoCircle} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {CommonApiService} from "../../../api-kit/common/common-api.service";
import {PropertyApiService} from "../../../api-kit/property/property-api-service";
import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import {isFormSubmitted} from "../../../service/validation.service";
import IndeterminateCheckbox from "../../../ui-kit/components/common/datatable/IndeterminateCheckbox";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSInput} from "../../../ui-kit/components/common/input/PPMS-input";
import {PPMSTextArea} from "../../../ui-kit/components/common/input/PPMS-textarea";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {PPMSPopover} from "../../../ui-kit/components/common/PPMS-popover";
import {PPMSSelect} from "../../../ui-kit/components/common/select/PPMS-select";
import {PPMSToggleRadio} from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import {isEmptyCheck} from "../../../ui-kit/components/validations/FieldValidations";
import {formatICN, formatSaleNumber,} from "../../../ui-kit/utilities/FormatUtil";
import {UserUtils} from "../../../utils/UserUtils";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {salesPropertyTypes} from "../../property/create-update-property/constants/Constants";
import {PageHelper, Paths} from "../../Router";
import {
  assignmentsValues,
  contactDTO,
  hazardousValues,
  icnAdditionalWithdrawalOptions,
  icnWithdrawalOptions,
  valueAddedValues,
} from "./constants/Constants";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import PPMSMultiSelect from "../../../ui-kit/components/PPMS-multi-select";
import {PPMSIncludeExclude} from "../../../ui-kit/components/common/toggle/PPMS-include-exclude";

const commonApiService = new CommonApiService();

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
  id: string;
  disabled: boolean;
  identifierKey?: string;
  identifierValue?: any;
}

interface State {
  filterText: string;
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  showModal: boolean;
  permissions: string[];
  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  userId: string;
  emailId: string;
  withdrawProperty: {};
  zoneList: Array<any>;
  nationwideZoneList: {};
  zoneRegions: Array<any>;
  selectZoneId: number;
  defaultZoneId: string;
  propertyListResults?: any;
  sort: string;
  currentPage: number;
  icnFilter: string;
  propertyNameFilter: string;
  qtyFilter: string;
  locationFilter: string;
  fscFilter: string;
  propTypeFilter: string;
  saleLotFilter: string;
  statusFilter: string;
  assignedItemsFilter: string;
  assignItems: {
    showAssignItemsModal: boolean;
    assignedICN: string;
    SCOMSUsersList: any[];
    SelectedSCOMSUser: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      phoneExtension: string;
      fax: string;
      addressDTO: {
        addressLine1: string;
        addressLine2: string;
        addressLine3: string;
        city: string;
        state: string;
        zipCode: string;
        zipExtn: string;
      };
    };
  };
  withdrawICNState: {
    showWithdrawConfirmationModal: boolean;
    withdrawingICN: string;
    withdrawConfirmation: string;
    withdrawConfirmationErrorMessage: string;
    withdrawConfirmationInvalid: boolean;
    withdrawalReason: string;
    withdrawalReasonCode: string;
    additionalWithdrawalReason: string;
    additionalWithdrawalReasonCode: string;
    withdrawalComment: string;
    withdrawalReasonInvalid: boolean;
    withdrawalReasonErrorMessage: string;
    withdrawalCommentInvalid: boolean;
    withdrawalCommentErrorMessage: string;
    withdrawalAdditionalReasonInvalid: boolean;
    withdrawalAdditionalReasonErrorMessage: string;
    availableQuantity: string;
    withdrawingICNs: any[];
  };
  reactivateICNState: {
    showReactivateConfirmationModal: boolean;
    reactivatingICNs: any[];
    reactivatingICN: string;
    reactivateConfirmation: string;
    reactivateConfirmationErrorMessage: string;
    reactivateConfirmationInvalid: boolean;
    availableQuantity: string;
  };
  icnWithdrawalOptions: any[];
  icnAdditionalWithdrawalOptions: any[];
  isAllPageRowsSelectedAvailable: boolean;
  isAllPageRowsSelectedWithdrawn: boolean;
  indeterminate: boolean;
  selectedRowIds: any[];
  selectedRowIdsWithdrawn: any[];
  tabSelected: string;

  selectedAgencyBureaus?: [];
  agencyBureaus?: any[];
  includeExclude?: string;
  isChecked?: boolean;
  assignment: string;
  valueAddedServices: string;
  email: string;
  emailIsInvalid: boolean;
  emailValidationMsg: string;
  hazardous?: string;
  hazardousValues?: any[];

  assignmentFilter: string;
  agencyFilter: any;
  includeFilter: string;
  valueAddedFilter: string;
  emailFilter: string;
  hazardousFilter: string;
}

export class ICNStatusListPage extends React.Component<Props, State> {
  salesApiService: any = new SalesApiService();
  userApiService: any = new UserApiService();
  constructor(props: any) {
    super(props);
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      showModal: false,
      permissions: [],
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      userId: "",
      emailId: "",
      withdrawProperty: {},
      zoneList: [],
      nationwideZoneList: {
        zoneId: "nationwide",
        zoneName: "Nationwide",
      },
      zoneRegions: [],
      selectZoneId: parseInt(UserUtils.getDefaultZones()),
      defaultZoneId: UserUtils.getDefaultZones(),
      currentPage: 1,
      icnFilter: "",
      propertyNameFilter: "",
      qtyFilter: "",
      locationFilter: "",
      fscFilter: "",
      propTypeFilter: "",
      saleLotFilter: "",
      statusFilter: "",
      assignedItemsFilter: "",
      assignItems: {
        showAssignItemsModal: false,
        assignedICN: "",
        SCOMSUsersList: [],
        SelectedSCOMSUser: contactDTO(),
      },
      sort: "icn,ASC",
      withdrawICNState: {
        showWithdrawConfirmationModal: false,
        withdrawingICN: "",
        withdrawConfirmation: "",
        withdrawConfirmationInvalid: false,
        withdrawConfirmationErrorMessage: "",
        withdrawalReason: "",
        withdrawalReasonCode: "",
        additionalWithdrawalReason: "",
        additionalWithdrawalReasonCode: "",
        withdrawalComment: "",
        withdrawalReasonInvalid: false,
        withdrawalReasonErrorMessage: "",
        withdrawalAdditionalReasonInvalid: false,
        withdrawalAdditionalReasonErrorMessage: "",
        withdrawalCommentInvalid: false,
        withdrawalCommentErrorMessage: "",
        availableQuantity: "",
        withdrawingICNs: [],
      },
      reactivateICNState: {
        showReactivateConfirmationModal: false,
        reactivatingICN: "",
        reactivatingICNs: [],
        reactivateConfirmation: "",
        reactivateConfirmationErrorMessage: "",
        reactivateConfirmationInvalid: false,
        availableQuantity: "",
      },
      icnWithdrawalOptions: icnWithdrawalOptions,
      icnAdditionalWithdrawalOptions: icnAdditionalWithdrawalOptions,
      isAllPageRowsSelectedAvailable: false,
      isAllPageRowsSelectedWithdrawn: false,
      indeterminate: false,
      selectedRowIds: [],
      selectedRowIdsWithdrawn: [],
      tabSelected: "available",

      selectedAgencyBureaus: [],
      agencyBureaus: [],
      includeExclude: "Include",
      isChecked: false,
      assignment: "",
      valueAddedServices: "",
      email: "",
      emailIsInvalid: false,
      emailValidationMsg: "",
      hazardous: "",
      hazardousValues: [],

      assignmentFilter: "",
      agencyFilter: "",
      includeFilter: "Include",
      valueAddedFilter: "",
      emailFilter: "",
      hazardousFilter: "",
    };
    this.handleSort = this.handleSort.bind(this);
    this.handleICNWithdraw = this.handleICNWithdraw.bind(this);
    this.handleICNReactivate = this.handleICNReactivate.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleWithdrawalReasonChange = this.handleWithdrawalReasonChange.bind(
      this
    );
    this.handleAdditionalWithdrawalReasonChange = this.handleAdditionalWithdrawalReasonChange.bind(
      this
    );
    this.handleToggleAllPageRows = this.handleToggleAllPageRows.bind(this);
    this.handleTogglePageRow = this.handleTogglePageRow.bind(this);
    this.handleAgencyBureau = this.handleAgencyBureau.bind(this);
  }
  private propertyApiService = new PropertyApiService();

  async componentDidMount() {
    const data = {
      params: {
        zoneIds: UserUtils.getUserZones().join(","),
      },
    };
    let defaultZoneId = UserUtils.getDefaultZones();
    let zoneRegions = [];
    this.getControlListDetails(data, defaultZoneId, zoneRegions);
    this.getICNSalesControls(parseInt(defaultZoneId), {});

    commonApiService
      .getAllAgencyBureaus()
      .then((resp) => {
        let agencyBureao = resp.data.map((item) => {
          return {
            value: item.longName.trim(),
            agencyBureau: item.code + "-" + item.longName.trim(),
            id: item.code,
            isSelected: false,
          };
        });
        this.setState({
          agencyBureaus: agencyBureao,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private getControlListDetails(
    data: { params: { zoneIds: string } },
    defaultZoneId: string,
    zoneRegions: any[]
  ) {
    commonApiService
      .getZoneSalesControlList(data)
      .then((response: any) => {
        let zoneArray = response.data;
        if (
          UserUtils.getUserRoles().includes("SCO") ||
          UserUtils.getUserRoles().includes("SMS") ||
          UserUtils.getUserRoles().includes("CO") ||
          UserUtils.getUserRoles().includes("SFU")
        ) {
          zoneArray.push(this.state.nationwideZoneList);
        }
        this.setState({ zoneList: zoneArray });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    commonApiService
      .getZoneRegions(defaultZoneId)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.regionCode);
        });
        this.setState({
          zoneRegions: zoneRegions,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  handleChange = async (perPage, page) => {
    let filters = {
      icn: this.state.icnFilter,
      propertyName: this.state.propertyNameFilter,
      qty: this.state.qtyFilter,
      location: this.state.locationFilter,
      fsc: this.state.fscFilter,
      propType: this.state.propTypeFilter,
      saleOrLot: this.state.saleLotFilter,
      status: this.state.statusFilter,
      assignedItems: this.state.assignedItemsFilter,
      params: {
        page: page,
        perPage: perPage,
        sort: this.state.sort,
      },
    };

    this.getICNSalesControls(this.state.selectZoneId, filters);
  };
  disableWithdrawButton(status: string) {
    return !(
      (UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("SCO") ||
        UserUtils.getUserRoles().includes("SSA") ||
        UserUtils.getUserRoles().includes("SMS") ||
        UserUtils.getUserRoles().includes("SG")) &&
      status === "Available"
    );
  }
  showActivateButton(status: string) {
    return (
      status === "Returned From Sales" || status === "Withdrawn From Sales"
    );
  }

  showWithdrawButton(status: string) {
    return status === "Available";
  }
  disableReactivateButton(status: string) {
    console.log(status);
    return !(
      (UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("SCO") ||
        UserUtils.getUserRoles().includes("SSA") ||
        UserUtils.getUserRoles().includes("SMS") ||
        UserUtils.getUserRoles().includes("SG")) &&
      (status === "Returned From Sales" || status === "Withdrawn From Sales")
    );
  }

  showAssignButton(status: string) {
    return status === "Available";
  }

  disableAssignButton(status: string) {
    return !(
      (UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("SG") ||
        UserUtils.getUserRoles().includes("SFU")) &&
      status === "Available"
    );
  }

  handleSort = (sortBy) => {
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;
    this.setState({ sort: sort });
    let filters = {
      icn: this.state.icnFilter,
      propertyName: this.state.propertyNameFilter,
      qty: this.state.qtyFilter,
      location: this.state.locationFilter,
      fsc: this.state.fscFilter,
      propType: this.state.propTypeFilter,
      saleOrLot: this.state.saleLotFilter,
      status: this.state.statusFilter,
      assignedItems: this.state.assignedItemsFilter,
      params: {
        page: 1,
        perPage: this.state.perPage,
        sort: sort,
      },
    };
    this.getICNSalesControls(this.state.selectZoneId, filters);
  };

  handleChangeForZones = ({ selectedIndex }) => {
    if (selectedIndex === 0)
      this.setState({
        zoneRegions: [],
        selectZoneId: -1,
        filteredItems: [],
      });
    else {
      const zoneID = this.state.zoneList[selectedIndex - 1]
        ? this.state.zoneList[selectedIndex - 1].zoneId
        : "";
      this.setState({
        selectZoneId: zoneID,
        defaultZoneId: zoneID,
      });
      if (zoneID === "nationwide") {
        this.setState({
          zoneRegions: [],
        });
        this.getICNSalesControls(zoneID, {});
      } else {
        let zoneRegions = [];
        commonApiService
          .getZoneRegions(zoneID)
          .then((response: any) => {
            response?.data.forEach((region) => {
              zoneRegions.push(region.regionCode);
            });
            this.setState({
              zoneRegions: zoneRegions,
              selectZoneId: parseInt(zoneID),
            });

            this.getICNSalesControls(zoneID, {});
          })
          .catch((error) => {
            console.log(error);
            return error;
          });
      }
    }
  };

  getICNSalesControlsByFilters(filter: {}) {
    this.getICNSalesControls(this.state.selectZoneId, filter);
  }
  handleWithdrawModalClose = () => {
    const { withdrawICNState } = this.state;
    withdrawICNState.showWithdrawConfirmationModal = false;
    withdrawICNState.withdrawingICN = "";
    withdrawICNState.withdrawConfirmation = "";
    withdrawICNState.withdrawConfirmationInvalid = false;
    withdrawICNState.withdrawConfirmationErrorMessage = "";
    withdrawICNState.withdrawalReason = "";
    withdrawICNState.withdrawalReasonCode = "";
    withdrawICNState.additionalWithdrawalReason = "";
    withdrawICNState.additionalWithdrawalReasonCode = "";
    withdrawICNState.withdrawalComment = "";
    withdrawICNState.withdrawalReasonInvalid = false;
    withdrawICNState.withdrawalReasonErrorMessage = "";
    withdrawICNState.withdrawalCommentInvalid = false;
    withdrawICNState.withdrawalCommentErrorMessage = "";
    withdrawICNState.availableQuantity = "";
    withdrawICNState.withdrawingICNs = [];

    this.setState({
      withdrawICNState: withdrawICNState,
      icnWithdrawalOptions: icnWithdrawalOptions,
      icnAdditionalWithdrawalOptions: [
        {
          id: "SS_NAP",
          value: "Security Sensitive/Not Appropriate",
          isSelected: false,
        },
        {
          id: "VR",
          value: "Vehicle Recall",
          isSelected: false,
        },
      ],
    });
    isFormSubmitted.next(false);
  };

  handleReactivateModalClose = () => {
    const { reactivateICNState } = this.state;
    reactivateICNState.showReactivateConfirmationModal = false;
    reactivateICNState.reactivatingICN = "";
    reactivateICNState.reactivateConfirmation = "";
    reactivateICNState.reactivateConfirmationErrorMessage = "";
    reactivateICNState.reactivateConfirmationInvalid = false;
    reactivateICNState.availableQuantity = "";

    this.setState({
      reactivateICNState: reactivateICNState,
    });
    isFormSubmitted.next(false);
  };

  handleReactivateModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { reactivateICNState } = this.state;
    const { addToast } = this.props.actions;
    if (reactivateICNState.reactivatingICNs.length === 0) {
      let payload = {
        itemControlNumber: reactivateICNState.reactivatingICN,
      };
      try {
        let reactivatePropertyResponse = await this.propertyApiService.reactivateSalesProperty(
          payload
        );
        if (reactivatePropertyResponse.status === 200) {
          let reactivatingICN = reactivateICNState.reactivatingICN;
          this.handleReactivateModalClose();
          addToast({
            text: `Property with ICN: ${formatICN(
              reactivatingICN
            )} is successfully reactivated!`,
            type: "success",
            heading: "Success",
          });
          const data = {
            params: {
              zoneIds: UserUtils.getUserZones().join(","),
            },
          };
          let defaultZoneId = UserUtils.getDefaultZones();
          let zoneRegions = [];
          this.getControlListDetails(data, defaultZoneId, zoneRegions);
          this.getICNSalesControls(parseInt(defaultZoneId), {
            status: "allWithdrawn",
          });
        } else {
          addToast({
            text: "Property Reactivation failed. Please try again.",
            type: "error",
            heading: "Error",
          });
          reactivateICNState.showReactivateConfirmationModal = false;
        }
        this.setState({ reactivateICNState });
      } catch (error) {
        addToast({
          text: error.data.debugMessage,
          type: "error",
          heading: "Error",
        });
        reactivateICNState.showReactivateConfirmationModal = false;
        this.setState({
          reactivateICNState,
        });
        this.handleReactivateModalClose();
      } finally {
        isFormSubmitted.next(false);
      }
    } else {
      let payload = reactivateICNState.reactivatingICNs;
      try {
        let reactivatePropertyResponse = await this.propertyApiService.reactivateBulkSalesProperty(
          payload
        );
        if (reactivatePropertyResponse.status === 200) {
          let reactivatingICN = reactivateICNState.reactivatingICN;
          this.handleReactivateModalClose();
          addToast({
            text: `Selected properties successfully reactivated!`,
            type: "success",
            heading: "Success",
          });
          const data = {
            params: {
              zoneIds: UserUtils.getUserZones().join(","),
            },
          };
          let defaultZoneId = UserUtils.getDefaultZones();
          let zoneRegions = [];
          this.getControlListDetails(data, defaultZoneId, zoneRegions);
          this.getICNSalesControls(parseInt(defaultZoneId), {
            status: "allWithdrawn",
          });
        } else {
          addToast({
            text: "Property Reactivation failed. Please try again.",
            type: "error",
            heading: "Error",
          });
          reactivateICNState.showReactivateConfirmationModal = false;
        }
        this.setState({ reactivateICNState });
      } catch (error) {
        addToast({
          text: error.data.debugMessage,
          type: "error",
          heading: "Error",
        });
        reactivateICNState.showReactivateConfirmationModal = false;
        this.setState({
          reactivateICNState,
        });
        this.handleReactivateModalClose();
      } finally {
        isFormSubmitted.next(false);
      }
    }
  };

  handleICNReactivate = (event: any) => {
    const { reactivateICNState } = this.state;
    reactivateICNState.reactivatingICNs = this.state.selectedRowIdsWithdrawn;
    reactivateICNState.reactivatingICN = event.currentTarget.value;
    reactivateICNState.showReactivateConfirmationModal = true;
    this.setState({
      reactivateICNState,
    });
  };

  handleWithDrawModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { withdrawICNState } = this.state;
    const { addToast } = this.props.actions;
    this.validateWithdrawReason(
      withdrawICNState.withdrawalReason,
      withdrawICNState.withdrawalReasonCode
    );
    if (withdrawICNState.withdrawalReasonCode === "NSS") {
      this.validateWithdrawalAdditionalReason(
        withdrawICNState.additionalWithdrawalReason,
        withdrawICNState.additionalWithdrawalReasonCode
      );
      if (
        withdrawICNState.withdrawalReasonInvalid ||
        withdrawICNState.withdrawalAdditionalReasonInvalid
      )
        return;
    }
    if (!withdrawICNState.withdrawalReasonInvalid) {
      if (withdrawICNState.withdrawalReasonCode) {
        this.validateWithdrawComment(
          withdrawICNState.withdrawalComment,
          withdrawICNState.withdrawalReasonCode
        );
      }
    }

    if (
      withdrawICNState.withdrawalReasonInvalid ||
      withdrawICNState.withdrawalCommentInvalid
    )
      return;

    if (withdrawICNState.withdrawingICNs.length === 0) {
      let payload = {
        itemControlNumber: withdrawICNState.withdrawingICN,
        withdrawnReason:
          withdrawICNState.withdrawalReasonCode === "NSS"
            ? withdrawICNState.withdrawalReason.concat(
                withdrawICNState.additionalWithdrawalReason
                  ? " due to  " + withdrawICNState.additionalWithdrawalReason
                  : ""
              )
            : withdrawICNState.withdrawalReason,
        withdrawnComment: withdrawICNState.withdrawalComment,
        withDrawnQuantity: parseInt(withdrawICNState.availableQuantity),
        withdrawnSource: "SalesICNAvailability",
      };
      try {
        let withdrawPropertyResponse = await this.propertyApiService.withdrawSalesProperty(
          payload
        );
        if (withdrawPropertyResponse.status === 200) {
          let withdrawnICN = withdrawICNState.withdrawingICN;
          this.handleWithdrawModalClose();
          addToast({
            text: `Property with ICN: ${formatICN(
              withdrawnICN
            )} is successfully withdrawn!`,
            type: "success",
            heading: "Success",
          });
          const data = {
            params: {
              zoneIds: UserUtils.getUserZones().join(","),
            },
          };
          let defaultZoneId = UserUtils.getDefaultZones();
          let zoneRegions = [];
          this.getControlListDetails(data, defaultZoneId, zoneRegions);
          this.getICNSalesControls(parseInt(defaultZoneId), {});
        } else {
          addToast({
            text: "Property withdrawal failed. Please try again.",
            type: "error",
            heading: "Error",
          });
          withdrawICNState.showWithdrawConfirmationModal = false;
          // this.setState({withdrawICNState,});
        }
        this.setState({ withdrawICNState });
      } catch (error) {
        addToast({
          text: error.data.debugMessage,
          type: "error",
          heading: "Error",
        });
        withdrawICNState.showWithdrawConfirmationModal = false;
        this.setState({
          withdrawICNState,
        });
        this.handleWithdrawModalClose();
      } finally {
        isFormSubmitted.next(false);
      }
    } else {
      let payload = {
        itemControlNumbers: withdrawICNState.withdrawingICNs,
        withdrawnReason:
          withdrawICNState.withdrawalReasonCode === "NSS"
            ? withdrawICNState.withdrawalReason.concat(
                withdrawICNState.additionalWithdrawalReason
                  ? " due to  " + withdrawICNState.additionalWithdrawalReason
                  : ""
              )
            : withdrawICNState.withdrawalReason,
        withdrawnComment: withdrawICNState.withdrawalComment,
        withDrawnQuantity: parseInt(withdrawICNState.availableQuantity),
        withdrawnSource: "SalesICNAvailability",
      };
      try {
        let withdrawPropertyResponse = await this.propertyApiService.withdrawBulkSalesProperty(
          payload
        );
        if (withdrawPropertyResponse.status === 200) {
          // let withdrawnICN = withdrawICNState.withdrawingICN;
          this.handleWithdrawModalClose();
          addToast({
            text: `Selected Properties successfully withdrawn!`,
            type: "success",
            heading: "Success",
          });
          const data = {
            params: {
              zoneIds: UserUtils.getUserZones().join(","),
            },
          };
          let defaultZoneId = UserUtils.getDefaultZones();
          let zoneRegions = [];
          this.getControlListDetails(data, defaultZoneId, zoneRegions);
          this.getICNSalesControls(parseInt(defaultZoneId), {});
        } else {
          addToast({
            text: "Property withdrawal failed. Please try again.",
            type: "error",
            heading: "Error",
          });
          withdrawICNState.showWithdrawConfirmationModal = false;
          // this.setState({withdrawICNState,});
        }
        this.setState({ withdrawICNState });
      } catch (error) {
        addToast({
          text: error.data.debugMessage,
          type: "error",
          heading: "Error",
        });
        withdrawICNState.showWithdrawConfirmationModal = false;
        this.setState({
          withdrawICNState,
        });
        this.handleWithdrawModalClose();
      } finally {
        isFormSubmitted.next(false);
      }
    }
  };

  validateWithdrawComment = (value: string, code: string) => {
    let withdrawalReasonCode = ["INA", "DUPLICATE", "AGENCY_USE", "FBR", "MRD"];
    const { withdrawICNState } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value) && withdrawalReasonCode.includes(code)) {
      validation.isInvalid = true;
      validation.validationError = "Withdrawal comment is required";
    } else if (value.length >= 500) {
      validation.isInvalid = true;
      validation.validationError =
        "Withdrawal comment must be 500 characters or less";
    }
    withdrawICNState.withdrawalComment = value;
    withdrawICNState.withdrawalCommentInvalid = validation.isInvalid;
    withdrawICNState.withdrawalCommentErrorMessage = validation.validationError;
    this.setState({
      withdrawICNState,
    });
    return validation;
  };

  validateWithdrawConfirm = (value: string) => {
    const { withdrawICNState } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      withdrawICNState.withdrawalReasonInvalid = true;
      withdrawICNState.withdrawalReasonErrorMessage =
        "Withdrawal reason is required";
    } else if (
      !isEmptyCheck(value) &&
      withdrawICNState.withdrawalReasonCode === "NSS" &&
      isEmptyCheck(withdrawICNState.additionalWithdrawalReason)
    ) {
      withdrawICNState.withdrawalAdditionalReasonInvalid = true;
      withdrawICNState.withdrawalAdditionalReasonErrorMessage =
        "Withdrawal reason is required";
    }
    this.setState({
      withdrawICNState,
    });
    return validation;
  };

  handleWithdrawalCommentChange = (event) => {
    let value = event.currentTarget.value;
    this.validateWithdrawComment(value, "");
  };
  handleICNWithdraw = (event: any) => {
    const { withdrawICNState } = this.state;

    withdrawICNState.withdrawingICNs = this.state.selectedRowIds;

    withdrawICNState.withdrawingICN = event.currentTarget.value;

    withdrawICNState.showWithdrawConfirmationModal = true;
    this.setState({
      withdrawICNState,
      icnWithdrawalOptions: icnWithdrawalOptions,
      icnAdditionalWithdrawalOptions: icnAdditionalWithdrawalOptions,
    });
  };

  handleWithdrawalReasonChange({ selectedIndex }) {
    const withdrawalReason = this.state.icnWithdrawalOptions[selectedIndex - 1]
      ? this.state.icnWithdrawalOptions[selectedIndex - 1].value
      : "";
    const withdrawalReasonCode = this.state.icnWithdrawalOptions[
      selectedIndex - 1
    ]
      ? this.state.icnWithdrawalOptions[selectedIndex - 1].id
      : "";
    this.validateWithdrawReason(withdrawalReason, withdrawalReasonCode);
    this.setState({
      icnAdditionalWithdrawalOptions: [
        {
          id: "SS_NAP",
          value: "Security Sensitive/Not Appropriate",
          isSelected: false,
        },
        {
          id: "VR",
          value: "Vehicle Recall",
          isSelected: false,
        },
      ],
    });
  }

  handleAdditionalWithdrawalReasonChange(values: any) {
    const { withdrawICNState } = this.state;
    let selectedValue = values.find((item) => item.isSelected === true);
    console.log("selectedValue ", selectedValue);

    if (selectedValue) {
      this.validateWithdrawalAdditionalReason(
        selectedValue.value,
        selectedValue.id
      );
    }
  }
  validateWithdrawReason = (value: string, code: string) => {
    const { withdrawICNState } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Withdrawal Reason is required";
    }
    if (!isEmptyCheck(value)) {
      withdrawICNState.withdrawalReason = value;
      withdrawICNState.withdrawalReasonCode = code;
    }
    withdrawICNState.withdrawalReasonInvalid = validation.isInvalid;
    withdrawICNState.withdrawalReasonErrorMessage = validation.validationError;
    this.setState({
      withdrawICNState,
    });
    return validation;
  };
  validateWithdrawalAdditionalReason = (value: string, code: string) => {
    const { withdrawICNState } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Additional Withdrawal Reason is required";
    } else {
      withdrawICNState.additionalWithdrawalReason = value;
      withdrawICNState.additionalWithdrawalReasonCode = code;
    }
    withdrawICNState.withdrawalAdditionalReasonInvalid = validation.isInvalid;
    withdrawICNState.withdrawalAdditionalReasonErrorMessage =
      validation.validationError;
    this.setState({
      withdrawICNState,
    });
    return validation;
  };
  getICNSalesControls = (zoneId: number, filters: any) => {
    let params: any = {};
    params.page = filters.params?.page ? filters.params.page : 1;
    params.size = filters.params?.perPage
      ? filters.params.perPage
      : this.state.perPage;
    params.zone = zoneId;
    params.sort = filters.params?.sort ? filters.params.sort : this.state.sort;

    if (filters.icn) {
      params.icn = filters.icn.replace(/-/g, "");
    }
    if (filters.propertyName) {
      params.propertyName = filters.propertyName;
    }
    if (filters.qty) {
      params.qty = filters.qty;
    }
    if (filters.location) {
      params.location = filters.location;
    }
    if (filters.fsc) {
      params.fsc = filters.fsc;
    }
    if (filters.propType) {
      params.propType = filters.propType;
    }
    if (filters.saleOrLot) {
      params.saleOrLot = filters.saleOrLot;
    }
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.assignedItems) {
      params.assignedItems = filters.assignedItems;
    }

    //Top filters
    if (this.state.assignmentFilter) {
      params.assignment = this.state.assignmentFilter;
    }
    if (this.state.agencyFilter) {
      params.agency = this.state.agencyFilter;
    }
    if (this.state.valueAddedFilter) {
      params.valueAdded = this.state.valueAddedFilter;
    }
    if (this.state.emailFilter) {
      params.email = this.state.emailFilter;
    }
    if (this.state.hazardousFilter) {
      params.hazardous = this.state.hazardousFilter;
    }
    params.include = this.state.includeFilter;

    this.setState({
      icnFilter: filters.icn,
      propertyNameFilter: filters.propertyName,
      qtyFilter: filters.qty,
      locationFilter: filters.location,
      fscFilter: filters.fsc,
      propTypeFilter: filters.propType,
      saleLotFilter: filters.saleOrLot,
      statusFilter: filters.status,
      assignedItemsFilter: filters.assignedItems,
    });

    this.salesApiService
      .getICNSalesControlsList(params)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.propertyDetails
            ? response.data.propertyDetails
            : [];

        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.icn = row.icn;
          obj.propertyName = row.propertyName;
          obj.qty = row.qty + " " + row.unitOfIssue + ".";
          obj.location = row.location;
          obj.fsc = row.fsc;
          obj.propType = row.propType;
          obj.saleOrLot = row.saleOrLot;
          obj.status = row.status;
          obj.assignedItems = row.gsaAssignedUserEmail ? "Yes" : "No";
          obj.withdrawnReason = row.withdrawnReason;
          obj.propertyGroup = row.propertyGroup;
          return obj;
        });

        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        //this.buildICNSalesDetails(filteredRows);
        this.setState({
          loading: false,
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: params.size,
          currentPage: params.page,
          sort: params.sort,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  renderStatusCell = (data) => {
    const name: string = data.row.values["status"];
    return (
      <>
        {name}
        {(name === "Withdrawn From Sales" ||
          name === "Returned From Sales") && (
          <PPMSPopover
            trigger={["hover"]}
            id={"icn-prop=type-description"}
            placement={"right"}
            popoverTitle={"Withdrawal Reason"}
            popoverContent={<>{data.row.original["withdrawnReason"]}</>}
            triggerSource={
              <button
                id={`prop-type-tooltip-button`}
                type={"button"}
                className={"usa-button  usa-button--unstyled"}
              >
                <CgNotes />
              </button>
            }
          />
        )}
      </>
    );
  };

  renderAssignedItemCell = (data) => {
    const name: string = data.row.values["assignedItems"];
    return <>{name}</>;
  };

  renderPocCell = (data) => {
    const name: string = data.row.values["propType"];
    //const tooltip = propertyTypes.find((p) => p.id == name)?.value;
    const tooltip = salesPropertyTypes.find((p) => p.id == name)?.value;
    return (
      <>
        {name}{" "}
        <PPMSPopover
          trigger={["click"]}
          id={"icn-prop=type-description"}
          placement={"right"}
          popoverTitle={"Property Type Desc"}
          popoverContent={<>{tooltip}</>}
          triggerSource={
            <button
              id={`prop-type-tooltip-button`}
              type={"button"}
              className={"usa-button  usa-button--unstyled"}
            >
              <FaInfoCircle />
            </button>
          }
        />
      </>
    );
  };

  handleTogglePageRow = (props: any, { instance, row }) => {
    const id: any = this.getId(row);
    const checked: boolean =
      this.state.tabSelected === "available"
        ? this.state.selectedRowIds.length > 0 &&
          this.state.selectedRowIds.indexOf(id) > -1
        : this.state.selectedRowIdsWithdrawn.length > 0 &&
          this.state.selectedRowIdsWithdrawn.indexOf(id) > -1;
    return [
      props,
      {
        onChange: (e) => {
          row.toggleRowSelected(e.target.checked);
          const filterValue =
            this.state.tabSelected === "available"
              ? "Available"
              : "Returned From Sales";
          const excessScreeningRows: any[] = instance.rows.filter(
            (row) => row.values.status === filterValue
          );

          //even if one of the checkbox in the page is selected set "isAllPageRowsSelected" to false
          const selectedRowIds: any[] =
            this.state.tabSelected === "available"
              ? this.state.selectedRowIds
              : this.state.selectedRowIdsWithdrawn;

          const index: number = selectedRowIds.indexOf(id);
          if (e.target.checked) {
            selectedRowIds.push(id);
          } else {
            if (index > -1) {
              selectedRowIds.splice(index, 1);
            }
          }

          if (this.state.tabSelected === "available") {
            this.setState({
              isAllPageRowsSelectedAvailable:
                selectedRowIds.length === excessScreeningRows.length,
              selectedRowIds: selectedRowIds,
            });
          } else {
            this.setState({
              isAllPageRowsSelectedWithdrawn:
                selectedRowIds.length === excessScreeningRows.length,
              selectedRowIdsWithdrawn: selectedRowIds,
            });
          }
        },
        style: {
          cursor: "pointer",
        },
        checked: checked,
        title: "Toggle Row Selected",
        indeterminate: row.isSomeSelected,
      },
    ];
  };

  renderICN = (row) => {
    const propertyGroup: string = row.original.propertyGroup;
    const icn: string = row.original.icn;
    const fgIcn = (
      <img className="fg-icon" src="/ppms-fg-icon.svg" alt="foreign gifts" />
    );
    return (
      <>
        {propertyGroup === "foreignGift" ? (
          <div className="text-wrap">
            <a href={"/viewForeignGift/" + icn}>
              {formatICN(icn)} {fgIcn}
            </a>
          </div>
        ) : (
          <div className="text-wrap">
            <a href={"/viewProperty/" + icn}>{formatICN(icn)}</a>
          </div>
        )}
      </>
    );
  };

  handleToggleAllPageRows = (props, { instance }) => [
    props,
    {
      onChange: (e: any) => {
        var checked: boolean = e.target.checked;
        const tabSelected: string = this.state.tabSelected;
        const filterValue =
          tabSelected === "available" ? "Available" : "Returned From Sales";
        const selectedRowIds: any[] = checked
          ? instance.rows
              .filter((row) => row.values.status === filterValue)
              .map((row) => this.getId(row))
          : [];
        if (tabSelected === "available") {
          this.setState({
            isAllPageRowsSelectedAvailable: checked,
            selectedRowIds: selectedRowIds,
          });
        } else if (tabSelected === "allWithdrawn") {
          this.setState({
            isAllPageRowsSelectedWithdrawn: checked,
            selectedRowIdsWithdrawn: selectedRowIds,
          });
        }
        instance.rows.forEach((row) => {
          if (
            (tabSelected === "available" &&
              row.values.status === "Available") ||
            (tabSelected === "allWithdrawn" &&
              row.values.status === "Returned From Sales")
          ) {
            row.toggleRowSelected(checked);
          }
        });
      },
      style: {
        cursor: "pointer",
      },
      checked:
        this.state.tabSelected === "available"
          ? this.state.isAllPageRowsSelectedAvailable
          : this.state.isAllPageRowsSelectedWithdrawn,
      title: "Toggle All Current Page Rows Selected",
      indeterminate: this.state.indeterminate,
    },
  ];

  columns = [
    {
      id: "selection",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <div className={"table-checkbox"}>
          <IndeterminateCheckbox
            id={`checkbox-all-${this.state.tabSelected}`}
            {...getToggleAllPageRowsSelectedProps()}
          />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => (
        <div className={"table-checkbox"}>
          <IndeterminateCheckbox
            id={`checkbox-${this.state.tabSelected}`}
            disabled={
              (this.state.tabSelected === "available" &&
                row.values.status !== "Available") ||
              (this.state.tabSelected === "allWithdrawn" &&
                !(
                  row.values.status === "Withdrawn From Sales" ||
                  row.values.status === "Returned From Sales"
                ))
            }
            {...row.getToggleRowSelectedProps()}
          />
        </div>
      ),
    },
    {
      Header: "ICN",
      accessor: "icn",
      Cell: ({ row }) => this.renderICN(row),
      filter: "search",
    },
    {
      Header: "Property Name",
      accessor: "propertyName",
      filter: "search",
    },
    {
      Header: "QTY",
      accessor: "qty",
      filter: "search",
    },
    {
      Header: "Location",
      accessor: "location",
      filter: "search",
    },
    {
      Header: "FSC",
      accessor: "fsc",
      filter: "search",
    },
    {
      Header: "Property Type",
      accessor: "propType",
      Cell: (data) => this.renderPocCell(data),
      filter: "search",
    },
    {
      Header: "Sale/Lot",
      accessor: "saleOrLot",
      Cell: (data) => {
        let saleorlot = "";
        if (data.value) {
          saleorlot = formatSaleNumber(data.value);
        }
        return <div className="text-wrap">{saleorlot}</div>;
      },
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (data) => this.renderStatusCell(data),
      filter: "search",
    },
    {
      Header: "Assigned Items",
      accessor: "assignedItems",
      Cell: (data) => this.renderAssignedItemCell(data),
      filter: "search",
    },
    {
      Header: "Actions",
      id: "actions",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer"></div>
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filter = {};
                columns.columns.forEach((column) => {
                  filter[column.id] = column["filterValue"];
                });
                if (
                  isEmptyCheck(filter["status"]) &&
                  this.state.tabSelected === "allWithdrawn"
                ) {
                  filter["status"] = "allWithdrawn";
                }
                this.getICNSalesControlsByFilters(filter);
              }}
              label={"Search"}
            />
            <PPMSButton
              id={"clear-filter"}
              onPress={() => {
                let filter = {};
                columns.columns.forEach((column) => {
                  filter[column.id] = "";
                  column.setFilter("");
                });
                filter =
                  this.state.tabSelected === "allWithdrawn"
                    ? {
                        status: "allWithdrawn",
                      }
                    : {};
                this.getICNSalesControlsByFilters(filter);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (icnSalesControlData) => (
        <>
        {icnSalesControlData.row.original.propertyGroup !== "foreignGift" ? (
          <PPMSButton
            variant={"secondary"}
            label={
              icnSalesControlData.row.values.saleOrLot === null ||
              (icnSalesControlData.row.values.saleOrLot != null &&
                (UserUtils.getUserRoles().includes("SCO") ||
                  UserUtils.getUserRoles().includes("SMS") ||
                  UserUtils.getUserRoles().includes("SG")))
                ? "Edit"
                : "View"
            }
            className={"manage-list-actions"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() =>
              icnSalesControlData.row.values.saleOrLot === null ||
              (icnSalesControlData.row.values.saleOrLot != null &&
                (UserUtils.getUserRoles().includes("SCO") ||
                  UserUtils.getUserRoles().includes("SMS") ||
                  UserUtils.getUserRoles().includes("SG")))
                ? PageHelper.openPage(
                    Paths.editPropertyReport +
                      "/" +
                      icnSalesControlData.row.values.icn
                  )
                : PageHelper.openPage(
                    Paths.viewProperty +
                      "/" +
                      icnSalesControlData.row.values.icn
                  )
            }
            id={"edit"}
          />
          ) :"" }
          {this.showWithdrawButton(icnSalesControlData.row.values.status) ? (
            <PPMSButton
              isDisabled={this.disableWithdrawButton(
                icnSalesControlData.row.values.status
              )}
              variant={"secondary"}
              label={"Withdraw"}
              className={"manage-list-actions withdraw"}
              size={"sm"}
              icon={<CgRemove />}
              value={icnSalesControlData.row.values.icn}
              onPress={(event) => {
                const { withdrawICNState } = this.state;
                withdrawICNState.availableQuantity = parseInt(
                  icnSalesControlData.row.values.qty
                ).toString();
                this.handleICNWithdraw(event);
                this.setState({
                  withdrawICNState,
                });
              }}
              id={"withdraw"}
            />
          ) : undefined}
          {this.showActivateButton(icnSalesControlData.row.values.status) ? (
            <PPMSButton
              isDisabled={this.disableReactivateButton(
                icnSalesControlData.row.values.status
              )}
              variant={"secondary"}
              label={"Reactivate"}
              className={"manage-list-actions withdraw"}
              size={"sm"}
              value={icnSalesControlData.row.values.icn}
              onPress={(event) => {
                const { reactivateICNState } = this.state;
                reactivateICNState.availableQuantity = parseInt(
                  icnSalesControlData.row.values.qty
                ).toString();
                this.handleICNReactivate(event);
                this.setState({
                  reactivateICNState,
                });
              }}
              id={"reactivate"}
            />
          ) : undefined}
          {this.showAssignButton(icnSalesControlData.row.values.status) ? (
            <PPMSButton
              isDisabled={this.disableAssignButton(
                icnSalesControlData.row.values.status
              )}
              variant={"secondary"}
              label={"Assign"}
              size={"sm"}
              className="manage-list-actions usa-link usa-button--unstyled withdraw"
              value={icnSalesControlData.row.values.icn}
              onPress={(event) => {
                const { assignItems } = this.state;
                assignItems.assignedICN = icnSalesControlData.row.values.icn;
                this.handleAssignItems(event);
                this.setState({ assignItems });
              }}
              id={"assign"}
            />
          ) : undefined}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  getUserList = (params) => {
    return new Promise((res, rej) => {
      this.userApiService
        .getSalesUsersByRoleAndZone(params)
        .then((response) => {
          let options = [];
          response.data.forEach((user) => {
            let roleListString = [];
            if (user.email !== user.emailAddress) {
              user.roles.forEach((role) => {
                roleListString.push(role.roleDescription);
              });
              let option = `${user.firstName} ${user.lastName}`;
              if (
                (params.roles === "SCO" &&
                  user.warrantLimit === "WLUNLIMITED") ||
                params.roles === "SMS"
              ) {
                options.push({
                  id: `${user.email}`,
                  value: option,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                });
              }
            }
          });
          res(options);
        })
        .catch((err) => {
          rej(err);
        });
    });
  };

  handleAssignItems = async (event) => {
    const { assignItems } = this.state;
    let paramsAlternateSCO = {
      zones: UserUtils.getUserZones().join(","),
      roles: "SCO",
    };
    let paramsMarketingSpecialist = {
      zones: UserUtils.getUserZones().join(","),
      roles: "SMS",
    };
    const scoUsersList1 = this.getUserList(paramsAlternateSCO);
    const msUsersList2 = this.getUserList(paramsMarketingSpecialist);

    Promise.all([scoUsersList1, msUsersList2])
      .then((lists) => {
        let finalResult2 = [];
        lists.map((list: []) => {
          finalResult2.push(...list);
        });
        this.state.assignItems.showAssignItemsModal = true;
        this.state.assignItems.SCOMSUsersList = finalResult2;
        this.setState({ assignItems });
      })
      .catch((err) => console.log(err));
  };

  handleAssignItemsModalClose = () => {
    const { assignItems } = this.state;
    assignItems.showAssignItemsModal = false;
    this.setState({ assignItems });
  };

  handleAssignItemsSave = () => {
    let { assignItems } = this.state;
    let { addToast } = this.props.actions;
    let payload = {
      itemControlNumber: assignItems.assignedICN,
      selectedEmail: assignItems.SelectedSCOMSUser.email,
    };
    console.log(payload, "payload");
    if (
      assignItems.SelectedSCOMSUser.email == "SCO/MS-select" ||
      assignItems.SelectedSCOMSUser.email == ""
    ) {
      addToast({
        text: "Please select a SCO/MS user",
        type: "error",
        heading: "Error",
      });
    } else {
      this.propertyApiService
        .updateAssignItemsUserEmail(payload)
        .then((res: any) => {
          addToast({
            text: `Unable to assign ${assignItems.assignedICN} to ${assignItems.SelectedSCOMSUser.email}`,
            type: "success",
            heading: "Success",
          });
          this.handleAssignItemsModalClose();
          const data = {
            params: {
              zoneIds: UserUtils.getUserZones().join(","),
            },
          };
          let selectZoneId = this.state.selectZoneId.toString();
          let zoneRegions = [];
          this.getControlListDetails(data, selectZoneId, zoneRegions);
          this.getICNSalesControls(parseInt(selectZoneId), {});
        })
        .catch((error) => {
          addToast({
            text: `Unable to assign ${assignItems.assignedICN} to ${assignItems.SelectedSCOMSUser.email}`,
            type: "error",
            heading: "Error",
          });
        });
    }
  };
  getId = (row: any) => {
    return row.original.icn ? row.original.icn : row.id;
  };

  handleTabSelect = (value) => {
    this.setState({
      tabSelected: value,
    });
    let filter = {
      status: value === "available" ? "" : value,
    };

    this.getICNSalesControls(parseInt(this.state.defaultZoneId), filter);
  };

  getColumns = () => {
    let cloned = cloneDeep(this.columns);
    if (this.state.tabSelected === "allWithdrawn") {
      cloned.splice(
        cloned.findIndex(({ Header }) => Header == "Sale/Lot"),
        1
      );
      return cloned;
    }
    return this.columns;
  };

  handleAgencyBureau(selectedAgencyBureaus) {
    this.setState({
      selectedAgencyBureaus: selectedAgencyBureaus,
    });
  }

  handleEmailBlur(email) {
    if (!email) {
      this.setState({
        emailIsInvalid: false,
        emailValidationMsg: "",
      });
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      this.setState({
        emailIsInvalid: true,
        emailValidationMsg: "Email Address is invalid.",
      });
    } else {
      this.setState({
        emailIsInvalid: false,
        emailValidationMsg: "",
      });
    }
  }

  handleTopApplyFilters() {
    let assignment = "";
    for (let options of assignmentsValues) {
      if (options.id === this.state.assignment) assignment = options.value;
    }
    let agencyCode = "";
    for (let agency of this.state.selectedAgencyBureaus) {
      agencyCode = agency["id"];
    }

    let filter = {
      icn: this.state.icnFilter,
      propertyName: this.state.propertyNameFilter,
      qty: this.state.qtyFilter,
      location: this.state.locationFilter,
      fsc: this.state.fscFilter,
      propType: this.state.propTypeFilter,
      saleOrLot: this.state.saleLotFilter,
      status: this.state.statusFilter,
    };

    this.setState(
      {
        assignmentFilter: assignment,
        agencyFilter: agencyCode,
        includeFilter: this.state.includeExclude,
        valueAddedFilter: this.state.valueAddedServices,
        emailFilter: this.state.email,
        hazardousFilter: this.state.hazardous,
      },
      () => this.getICNSalesControlsByFilters(filter)
    );
  }

  handleTopClear() {
    let filter = {
      icn: this.state.icnFilter,
      propertyName: this.state.propertyNameFilter,
      qty: this.state.qtyFilter,
      location: this.state.locationFilter,
      fsc: this.state.fscFilter,
      propType: this.state.propTypeFilter,
      saleOrLot: this.state.saleLotFilter,
      status: this.state.statusFilter,
    };

    this.setState(
      {
        assignment: "",
        selectedAgencyBureaus: [],
        includeExclude: "Include",
        valueAddedServices: "",
        email: "",
        hazardous: "",
        isChecked: false,
        emailIsInvalid: false,
        emailValidationMsg: "",

        assignmentFilter: "",
        agencyFilter: [],
        includeFilter: "Include",
        valueAddedFilter: "",
        emailFilter: "",
        hazardousFilter: "",
      },
      () => this.getICNSalesControlsByFilters(filter)
    );
  }

  filters() {
    return [
      {
        title: "Filters",
        content: (
          <>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-2"}>
                <PPMSSelect
                  id={"permissions"}
                  name={"permissions"}
                  selectName={"permissions"}
                  values={assignmentsValues}
                  onChange={(event) => {
                    this.setState({
                      assignment: event.target.value,
                    });
                  }}
                  identifierKey={"id"}
                  identifierValue={"value"}
                  selectedValue={this.state.assignment}
                  label={"By Permissions"}
                  isRequired={true}
                  disabled={false}
                />
                <br />
              </div>
              <div className={"grid-col-3"}>
                <PPMSMultiSelect
                  avoidHighlightFirstOption={true}
                  caseSensitiveSearch={false}
                  alphaNumericOrDigitSearch={true}
                  isPivotSorted={true}
                  emptyRecordMsg={"---- No Agency Bureau Found ----"}
                  chipVariant={"primary"}
                  label={"Agency / Bureau"}
                  id={"agencyBureau"}
                  options={this.state.agencyBureaus}
                  isRequired={false}
                  placeholder={"Select Agency Bureau"}
                  displayValue={"agencyBureau"}
                  selectedValues={this.state.selectedAgencyBureaus}
                  showCheckbox={false}
                  isObject={true}
                  onSelect={this.handleAgencyBureau}
                  onRemove={this.handleAgencyBureau}
                  singleSelect={false}
                  singleSelectAndTypeSearch={true}
                  selectionLimit={1}
                  closeOnSelect={true}
                  isInvalid={false}
                  isValid={true}
                />
                <PPMSIncludeExclude
                  isDisabled={false}
                  id={"Include-Exclude"}
                  name={"Include-Exclude"}
                  onChange={(check) => {
                    this.setState({
                      includeExclude: check ? "Exclude" : "Include",
                      isChecked: check,
                    });
                  }}
                  ariaLabel={"Include Selection"}
                  isChecked={this.state.isChecked}
                />
                <br />
              </div>
              <div className={"grid-col-2"}>
                <PPMSSelect
                  id={"valueAdded"}
                  name={"valueAdded"}
                  selectName={"valueAdded"}
                  values={valueAddedValues}
                  placeholderValue={"Not Selected"}
                  onChange={(event) => {
                    this.setState({
                      valueAddedServices: event.target.value,
                    });
                  }}
                  identifierKey={"id"}
                  identifierValue={"value"}
                  selectedValue={this.state.valueAddedServices}
                  label={"Value Added Services"}
                  isRequired={true}
                  disabled={false}
                />
              </div>
              <div className={"grid-col-3"}>
                <PPMSInput
                  id={"email"}
                  name={"email"}
                  label={"Email Address"}
                  isDisabled={false}
                  isRequired={true}
                  inputType={"text"}
                  placeHolder={"Email Address"}
                  value={this.state.email}
                  onChange={(event) => {
                    this.setState({
                      email: event.target.value,
                    });
                  }}
                  onBlur={(event) => this.handleEmailBlur(event.target.value)}
                  validationMessage={this.state.emailValidationMsg}
                  isInvalid={this.state.emailIsInvalid}
                />
              </div>
              <div className={"grid-col-2"}>
                <PPMSSelect
                  id={"hazardous"}
                  name={"hazardous"}
                  selectName={"hazardous"}
                  values={hazardousValues}
                  placeholderValue={"Not Selected"}
                  onChange={(event) => {
                    this.setState({
                      hazardous: event.target.value,
                    });
                  }}
                  identifierKey={"id"}
                  identifierValue={"value"}
                  selectedValue={this.state.hazardous}
                  label={"Hazardous"}
                  isRequired={true}
                  disabled={false}
                />
              </div>
            </div>
            <div className={"grid-row"}>
              <PPMSButton
                id={"apply-filter-top"}
                onPress={() => {
                  this.handleTopApplyFilters();
                }}
                label={"Search"}
                className={"create-property"}
                isDisabled={this.state.emailIsInvalid}
              />
              <PPMSButton
                id={"clear-filter-top"}
                onPress={() => {
                  this.handleTopClear();
                }}
                label={"Clear"}
                className={"create-property"}
                isDisabled={false}
              />
            </div>
          </>
        ),
        expanded: true,
        id: "filters",
        trigger: "common",
      },
    ];
  }

  render() {
    return (
      <>
        <div className="ui-ppms">
          <PPMSDatatable
            title={"ICN Management"}
            data={this.state.filteredItems}
            columns={this.getColumns()}
            defaultSortField={"icn"}
            loading={this.state.loading}
            rowsPerPageOptions={this.state.rowsPerPageOptions}
            totalRows={this.state.totalRows}
            totalPages={this.state.totalPages}
            rowsPerPage={this.state.perPage}
            isPaginationEnabled={true}
            onChange={this.handleChange}
            serverSort={true}
            handleSort={(sortBy) => this.handleSort(sortBy)}
            currentPage={this.state.currentPage - 1}
            showFilters={true}
            hiddenColumns={
              UserUtils.getUserRoles().includes("CO") ||
              UserUtils.getUserRoles().includes("SG") ||
              UserUtils.getUserRoles().includes("SFU")
                ? []
                : ["assignedItems"]
            }
            tabComponent={
              <>
                <br />
                <Tabs
                  defaultActiveKey="available"
                  id="open-sales-tab"
                  className="ppms-tabs"
                  onSelect={(value) => {
                    this.handleTabSelect(value);
                  }}
                >
                  <Tab eventKey="available" title="Items" />
                  <Tab eventKey="allWithdrawn" title="Withdrawn Items" />
                </Tabs>
              </>
            }
            subHeaderComponent={
              <>
                <div className={"grid-row grid-gap-2"}>
                  <div className={"grid-col-4"}>
                    <PPMSSelect
                      placeholderValue={"Select Zone"}
                      label={"Zone:"}
                      identifierKey={"zoneId"}
                      identifierValue={"zoneName"}
                      values={this.state.zoneList}
                      isRequired={true}
                      validationMessage={""}
                      selectedValue={this.state.defaultZoneId}
                      onChange={(event) =>
                        this.handleChangeForZones(event.target)
                      }
                    />
                  </div>
                  <div className={"grid-col-3"}>
                    <PPMSInput
                      isDisabled={true}
                      id={"regions"}
                      name={"regions"}
                      inputType={"text"}
                      label={"Region:"}
                      isRequired={true}
                      value={this.state.zoneRegions.toString()}
                      minLength={0}
                      maxLength={5}
                    />
                  </div>
                </div>
                <div className={"grid-col"}>
                  <div className="btn-create btn-create-sale-property">
                    <PPMSButton
                      variant={"primary"}
                      type={"button"}
                      value={"createProperty"}
                      label={"Create Property"}
                      className={"create-property out-button"}
                      onPress={() => {
                        PageHelper.openPage(Paths.createPropertyReport);
                      }}
                      id={"create-property"}
                    />
                  </div>
                </div>
                <br />
                <div className={"grid-row"}>
                  <PPMSAccordion bordered={true} items={this.filters()} />
                </div>
              </>
            }
            handleTogglePageRow={this.handleTogglePageRow}
            handleToggleAllPageRows={this.handleToggleAllPageRows}
          />
        </div>
        <PPMSModal
          show={this.state.withdrawICNState.showWithdrawConfirmationModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleWithdrawModalClose}
          handleSave={this.handleWithDrawModalSubmit}
          title={"Withdrawal Confirmation"}
          body={
            <WithdrawICNConfirmationModal
              state={this.state.withdrawICNState}
              icnWithdrawalOptions={this.state.icnWithdrawalOptions}
              icnAdditionalWithdrawalOptions={
                this.state.icnAdditionalWithdrawalOptions
              }
              handleWithdrawalReasonChange={this.handleWithdrawalReasonChange}
              handleAdditionalWithdrawalReasonChange={
                this.handleAdditionalWithdrawalReasonChange
              }
              handleWithdrawalCommentChange={this.handleWithdrawalCommentChange}
            />
          }
          id={"withdraw-confirmation"}
          label={"Submit"}
          labelCancel={"Cancel"}
        />
        <PPMSModal
          show={this.state.reactivateICNState.showReactivateConfirmationModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleReactivateModalClose}
          handleSave={this.handleReactivateModalSubmit}
          title={"Reactivate Confirmation"}
          body={`Do you want to reactivate the selected ICN(s)?`}
          id={"reactivate-confirmation"}
          label={"Submit"}
          labelCancel={"Cancel"}
        />
        <PPMSModal
          show={this.state.assignItems.showAssignItemsModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleAssignItemsModalClose}
          handleSave={this.handleAssignItemsSave}
          title={"Assign Items to SCO/MS"}
          body={
            <PPMSSelect
              id={"SCO/MS-select"}
              name={"SCO/MS-select"}
              selectName={"SCO/MS-select"}
              placeholderValue={"Select SCO/MS"}
              values={this.state.assignItems.SCOMSUsersList}
              onChange={(event) => {
                let value = event.target.options[event.target.selectedIndex].id;
                let { assignItems } = this.state;
                this.state.assignItems.SelectedSCOMSUser.email = value;
                this.setState({ assignItems });
              }}
              isValid={false}
              isInvalid={false}
              validationMessage={""}
              identifierKey={"id"}
              identifierValue={"value"}
              selectedValue={this.state.assignItems.SelectedSCOMSUser.email}
              label={"SCO/MS"}
              isRequired={true}
            />
          }
          id={"assign-items"}
          label={"Save"}
          labelCancel={"Cancel"}
        />
      </>
    );
  }
}

export const WithdrawICNConfirmationModal = ({
  state,
  icnWithdrawalOptions,
  icnAdditionalWithdrawalOptions,
  handleWithdrawalReasonChange,
  handleAdditionalWithdrawalReasonChange,
  handleWithdrawalCommentChange,
}) => {
  return (
    <div className={"reject-property-confirmation"}>
      <div className={"grid-row grid-gap"}>
        <div className={"grid-col-12"}>
          <PPMSSelect
            placeholderValue={"Select Withdrawal Reason"}
            label={"Withdrawal Reason:"}
            identifierKey={"value"}
            identifierValue={"value"}
            values={icnWithdrawalOptions}
            isRequired={true}
            isInvalid={state.withdrawalReasonInvalid}
            isValid={!state.withdrawalReasonInvalid}
            validationMessage={state.withdrawalReasonErrorMessage}
            onChange={(event) => handleWithdrawalReasonChange(event.target)}
            selectedValue={state.withdrawalReason}
          />
        </div>
        {state.withdrawalReasonCode === "NSS" ? (
          <div className={"grid-col-12"}>
            <PPMSToggleRadio
              id={"additionalWithdrawalReason"}
              options={icnAdditionalWithdrawalOptions}
              isInline={false}
              isDisabled={false}
              name={"additionalWithdrawalReason"}
              className={"Additional Withdrawal Reason"}
              label={"Additional Withdrawal Reason:"}
              validationMessage={state.withdrawalAdditionalReasonErrorMessage}
              isSingleSelect={true}
              isInvalid={state.withdrawalAdditionalReasonInvalid}
              onChange={handleAdditionalWithdrawalReasonChange}
              isRequired={state.withdrawalReasonCode === "NSS"}
            />
          </div>
        ) : undefined}
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSTextArea
            id={"withdrawComment"}
            name={"withdrawComment"}
            label={"Comment"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={state.withdrawalComment}
            onChange={handleWithdrawalCommentChange}
            validationMessage={state.withdrawalCommentErrorMessage}
            isInvalid={state.withdrawalCommentInvalid}
            isValid={!state.withdrawalCommentInvalid}
          />
        </div>
      </div>
    </div>
  );
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ICNStatusListPage);
