import React, { useEffect, useState } from "react";
import { MdEdit, MdSend } from "react-icons/md";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import queryString from "query-string";
import { UserUtils } from "../../../utils/UserUtils";
import {
  formatICN,
  getDateFrom,
  getDateTo,
} from "../../../ui-kit/utilities/FormatUtil";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PageHelper, Paths } from "../../Router";
import { filterProperty } from "../../property/create-update-property/constants/Constants";
import { BiBarcodeReader } from "react-icons/bi";
import { BarCodePrint } from "../../property/create-update-property/common/BarcodePrint";
import { getFormattedICN } from "../../property/create-update-property/validations/propertyFieldValidations";
import { CgRemove } from "react-icons/cg";
import { isFormSubmitted } from "../../../service/validation.service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import moment from "moment";
import { ForeignGiftsApiService } from "../../../api-kit/foreign-gift/foreign-gifts-api-service";
import {
  ForeignGiftsStatus,
  rejectForeignGiftsConfirmationOption,
  withdrawlForeignGiftsConfirmationOption,
} from "../create-update-foreign-gift/constants/Constants";
import { PageUtils } from "../../../utils/PageUtils";
import IndeterminateCheckbox from "../../../ui-kit/components/common/datatable/IndeterminateCheckbox";

import { isEmptyCheck } from "../../../ui-kit/components/validations/FieldValidations";
import { Upload } from "./uploads/Upload";
import { PrintLablesModal } from "./modals/PrintLablesModal";
import { WithdrawForeignGiftsConfirmationModal } from "./modals/WithdrawForeignGiftsConfirmationModal";
import { RejectForeignGiftsConfirmationModal } from "./modals/RejectForeignGiftsConfirmationModal";
import printJS from "print-js";
// import { subString } from "lodash";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

interface State {
  filterText: string;
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  selectedRowIds: any[];
  selectedRowPend: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  showProperty?: any;
  showFilterValues?: any;
  defaultFilterValue?: any;
  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  isAllPageRowsSelected: boolean;
  indeterminate: boolean;
  withdrawForeignGift: {
    showWithdrawConfirmationModal: boolean;
    withdrawingICN: string;
    withdrawConfirmation: string;
    withdrawConfirmationErrorMessage: string;
    withdrawConfirmationInvalid: boolean;
    withdrawalReason: string;
    withdrawalReasonInvalid: boolean;
    withdrawalReasonErrorMessage: string;
  };
  deleteForeignGift: {
    showDeleteConfirmationModal: boolean;
    deleteICN: string;
    deleteConfirmation: string;
    deleteConfirmationInvalid: boolean;
    showError: boolean;
    errorMessage: string;
  };
  rejectForeignGift: {
    showRejectConfirmationModal: boolean;
    rejectICN: string;
    rejectConfirmation: string;
    rejectConfirmationInvalid: boolean;
    rejectConfirmationErrorMessage: string;
    rejectReason: string;
    rejectReasonInvalid: boolean;
    rejectReasonErrorMessage: string;
    sourceName: string;
  };
  sendToSaleForeignGift: {
    showSendToSaleConfirmationModal: boolean;
    sendToSaleICN: string;
    sendToSaleConfirmation: string;
    sendToSaleConfirmationInvalid: boolean;
    showError: boolean;
    errorMessage: string;
  };

  currentPage: number;
  showBarcodeModal: boolean;
  selectedICN: string;
  withdrawOptions: any[];
  rejectOptions: any[];
  sort: string;
  itemControlNumber: string;
  dateReportedFrom: string;
  dateReportedTo: string;
  agencyBureau: string;
  status: string;
  fiscalYear: string;
  administration: string;
  recipientName: string;
  fairMarketValue: string;
  createdBy: string;
  advancedSearchText: string;
  propertyListResults?: any;
  firstSearch: boolean;
  showErrorUploadDOSApprovalModal: boolean;
  errorFile: any;
  vaultLocation?: string;
  vaultShelfNumber?: string;
  recipientWantsToBuy?: string;
  showUploadDOSApprovalModal: boolean;
  fileInfectedStatus: boolean;
  isUploadCancelled: boolean;
  isUploadDOSApprovalEnabled: boolean;

  printLabels: {
    showMultiplePrintModal: boolean;
    printLabelsICNs: any[];
  };

  printAcceptanceLetters: {
    showMultiplePrintModal: boolean;
    printAcceptanceLettersICNs: any[];
  };
}

class ForeignGiftListPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    let search = props.location.search;
    let query = queryString.parse(search);
    let showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      selectedRowIds: [],
      selectedRowPend: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      isAllPageRowsSelected: false,
      indeterminate: false,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      showProperty: showMyProperty,
      showFilterValues: filterProperty,

      withdrawForeignGift: {
        showWithdrawConfirmationModal: false,
        withdrawingICN: "",
        withdrawConfirmation: "",
        withdrawConfirmationInvalid: false,
        withdrawConfirmationErrorMessage: "",
        withdrawalReason: "",
        withdrawalReasonInvalid: false,
        withdrawalReasonErrorMessage: "",
      },
      deleteForeignGift: {
        showDeleteConfirmationModal: false,
        deleteICN: "",
        deleteConfirmation: "",
        deleteConfirmationInvalid: false,
        showError: false,
        errorMessage: "",
      },
      rejectForeignGift: {
        showRejectConfirmationModal: false,
        rejectICN: "",
        rejectConfirmation: "",
        rejectConfirmationInvalid: false,
        rejectConfirmationErrorMessage: "",
        rejectReason: "",
        rejectReasonInvalid: false,
        rejectReasonErrorMessage: "",
        sourceName: "",
      },
      sendToSaleForeignGift: {
        showSendToSaleConfirmationModal: false,
        sendToSaleICN: "",
        sendToSaleConfirmation: "",
        sendToSaleConfirmationInvalid: false,
        showError: false,
        errorMessage: "",
      },

      currentPage: 1,
      showBarcodeModal: false,
      selectedICN: "",
      withdrawOptions: withdrawlForeignGiftsConfirmationOption,
      rejectOptions: rejectForeignGiftsConfirmationOption,
      sort: "itemControlNumber,ASC",
      itemControlNumber: "",
      dateReportedFrom: "",
      dateReportedTo: "",
      agencyBureau: "",
      status: "",
      fiscalYear: "",
      administration: "",
      recipientName: "",
      fairMarketValue: "",
      createdBy: "",
      advancedSearchText: "",
      firstSearch: true,
      showErrorUploadDOSApprovalModal: false,
      vaultLocation: "",
      vaultShelfNumber: "",
      recipientWantsToBuy: "",
      showUploadDOSApprovalModal: false,
      errorFile: null,
      fileInfectedStatus: false,
      isUploadCancelled: false,
      isUploadDOSApprovalEnabled: false,

      printLabels: {
        showMultiplePrintModal: false,
        printLabelsICNs: [],
      },

      printAcceptanceLetters: {
        showMultiplePrintModal: false,
        printAcceptanceLettersICNs: [],
      },
    };
    this.componentRef = React.createRef();
    this.handlePropertyRadioChange = this.handlePropertyRadioChange.bind(this);
    this.handlePropertyWithdraw = this.handlePropertyWithdraw.bind(this);
    this.getPropertiesFromAPI = this.getPropertiesFromAPI.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleToggleAllPageRows = this.handleToggleAllPageRows.bind(this);
    this.handleTogglePageRow = this.handleTogglePageRow.bind(this);
    this.handleSendToDOSApproval = this.handleSendToDOSApproval.bind(this);
    this.handleUploadDoSApproval = this.handleUploadDoSApproval.bind(this);
    this.enableDOSApprovelSubmit = this.enableDOSApprovelSubmit.bind(this);
    this.handleMultiplePrintLabels = this.handleMultiplePrintLabels.bind(this);
    this.handlePrintLabelsDownload = this.handlePrintLabelsDownload.bind(this);
    this.handleMultiplePrintAcceptanceLetters = this.handleMultiplePrintAcceptanceLetters.bind(
      this
    );
    this.handlePrintAcceptanceLettersDownload = this.handlePrintAcceptanceLettersDownload.bind(
      this
    );
  }
  private propertyApiService = new PropertyApiService();
  private foreignGiftsApiService = new ForeignGiftsApiService();

  componentRef;

  async componentDidMount() {
    PageHelper.openPage(`${Paths.foreignGiftList}?showProperty=all`);
    let showMyProperty = "all";
    const { perPage } = this.state;
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
      data.params["showProperty"] = showMyProperty;
    }
    this.loadPropertyListOnPageLoad(data);
  }

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (nextProps.location.search !== this.props.location.search) {
      let search = nextProps.location.search;
      let query = queryString.parse(search);
      let showMyProperty = query["showProperty"]
        ? query["showProperty"]
        : "all";
      if (!query["showProperty"]) {
        const { perPage } = this.state;
        let param = {
          itemControlNumber: this.state.itemControlNumber,
          dateReportedFrom: this.state.dateReportedFrom,
          dateReportedTo: this.state.dateReportedTo,
          agencyBureau: this.state.agencyBureau,
          status: this.state.status,
          fiscalYear: this.state.fiscalYear,
          administration: this.state.administration,
          recipientName: this.state.recipientName?.trim(),
          fairMarketValue: this.state.fairMarketValue,
          searchType: "MANAGE",
          propertySearchTypeAdvanced: "ALL_WORDS",
          advancedSearchText: this.state.advancedSearchText,
          vaultLocation: this.state.vaultLocation,
          vaultShelfNumber: this.state.vaultShelfNumber,
          recipientWantsToBuy: this.state.recipientWantsToBuy,
          params: {
            page: 1,
            size: perPage,
          },
        };
        if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
          param["showProperty"] = showMyProperty;
        }
        this.foreignGiftsApiService
          .searchForeignGifts(param)
          .then((response) => {
            let filteredRows = [];
            //transform data to match table expectations
            for (let property of response.data.foreignGiftsSearchResultList) {
              let row = {
                fiscalYear: property.fiscalYear ? property.fiscalYear : "",
                itemControlNumber: property.itemControlNumber,
                itemName: property.itemName
                  ? property.itemName.toUpperCase()
                  : "",
                propertyStatus: property.itemStatus,
                submittedDate: property.submittedDate,
                administration: property.administration,
                recipientName: property.recipientName,
                fairMarketValue: property.fairMarketValue,
                createdBy: property.createdBy,
                vaultLocation: property.vaultLocation,
                vaultShelfNumber: property.vaultShelfNumber,
                recipientWantsToBuy: property.recipientWantsToBuy,
              };
              filteredRows.push(row);
            }

            let totalElements =
              response && response.data && response.data.totalElements
                ? response.data.totalElements
                : 0;

            this.setState({
              filteredItems: filteredRows,
              totalRows: totalElements,
              totalPages: response.data.totalPages,
              loading: false,
              currentPage: param.params.page,
              propertyListResults: response.data.foreignGiftsSearchResultList,
            });
          });
      }
    }
  }

  handleChange = async (perPage, page) => {
    let showMyProperty;
    if (this.state.firstSearch) {
      showMyProperty = "all";
      this.setState({
        firstSearch: false,
      });
    } else {
      let search = this.props.location.search;
      let query = queryString.parse(search);
      showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
      this.setState({ loading: true });
    }

    let param = {
      itemControlNumber: this.state.itemControlNumber.trim(),
      dateReportedFrom: this.state.dateReportedFrom,
      dateReportedTo: this.state.dateReportedTo,
      agencyBureau: this.state.agencyBureau,
      status: this.state.status,
      fiscalYear: this.state.fiscalYear.trim(),
      administration: this.state.administration.trim(),
      recipientName: this.state.recipientName.trim(),
      fairMarketValue: this.state.fairMarketValue,
      searchType: "MANAGE",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: this.state.advancedSearchText,
      vaultLocation: this.state.vaultLocation,
      vaultShelfNumber: this.state.vaultShelfNumber,
      recipientWantsToBuy: this.state.recipientWantsToBuy,
      params: {
        page: page,
        size: perPage,
      },
    };
    if (this.state.sort) {
      param.params["sort"] = this.state.sort;
    }
    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
      param["showProperty"] = showMyProperty;
    }

    this.foreignGiftsApiService.searchForeignGifts(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.foreignGiftsSearchResultList) {
        let row = {
          fiscalYear: property.fiscalYear ? property.fiscalYear : "",
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName ? property.itemName.toUpperCase() : "",
          propertyStatus: property.itemStatus,
          submittedDate: property.submittedDate,
          administration: property.administration,
          recipientName: property.recipientName,
          fairMarketValue: PageUtils.getFormattedCurrency(
            property.fairMarketValue
          ),
          createdBy: property.createdBy,
          vaultLocation: property.vaultLocation,
          vaultShelfNumber: property.vaultShelfNumber,
          recipientWantsToBuy: property.recipientWantsToBuy,
        };
        filteredRows.push(row);
      }

      let totalElements =
        response && response.data && response.data.totalElements
          ? response.data.totalElements
          : 0;

      this.setState({
        filteredItems: filteredRows,
        totalRows: totalElements,
        totalPages: response.data.totalPages,
        loading: false,
        currentPage: page,
        perPage: perPage,
        propertyListResults: response.data.foreignGiftsSearchResultList,
      });
    });
  };
  openBarcodeModal = () => {
    this.setState({ showBarcodeModal: true });
  };

  closeBarcodeModal = () => {
    this.setState({ showBarcodeModal: false });
  };

  getPropertiesFromAPI = (filters) => {
    let itemControlNumber;
    let itemName;
    let submittedDate;
    let agencyBureau;
    let fiscalYear;
    let administration;
    let fairMarketValue;
    let recipientName;
    let propertyStatus;
    let vaultLocation;
    let vaultShelfNumber;
    let recipientWantsToBuy;

    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].id) {
        case "itemControlNumber":
          itemControlNumber = filters[i]["value"]?.trim();
          break;
        case "itemName":
          itemName = filters[i]["value"]?.trim();
          break;
        case "submittedDate":
          submittedDate = filters[i]["value"]?.trim();
          break;
        case "fiscalYear":
          fiscalYear = filters[i]["value"]?.trim();
          break;
        case "administration":
          administration = filters[i]["value"]?.trim();
          break;
        case "recipientName":
          recipientName = filters[i]["value"]?.trim();
          break;
        case "fairMarketValue":
          fairMarketValue = filters[i]["value"];
          break;
        case "propertyStatus":
          propertyStatus = filters[i]["value"]?.trim();
          break;
        case "vaultLocation":
          vaultLocation = filters[i]["value"]?.trim();
          break;
        case "vaultShelfNumber":
          vaultShelfNumber = filters[i]["value"]?.trim();
          break;
        case "recipientWantsToBuy":
          recipientWantsToBuy = filters[i]["value"]?.trim();
          break;
      }
    }

    let reportFrom;
    let reportTo;
    if (submittedDate) {
      reportFrom = getDateFrom(submittedDate);
      reportTo = getDateTo(submittedDate);
    }
    //Allow for search input to use dashes and still work
    let ICN = itemControlNumber ? itemControlNumber.replace(/-/g, "") : "";

    let search = this.props.location.search;
    let query = queryString.parse(search);
    let showProperty = query["showProperty"] ? query["showProperty"] : "all";

    let param = {
      itemControlNumber: ICN,
      dateReportedFrom: reportFrom,
      dateReportedTo: reportTo,
      agencyBureau: agencyBureau,
      fiscalYear: fiscalYear,
      administration: administration,
      recipientName: recipientName,
      fairMarketValue: fairMarketValue,
      status: propertyStatus ? propertyStatus.toUpperCase() : "",
      searchType: "MANAGE",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: itemName,
      vaultLocation: vaultLocation,
      vaultShelfNumber: vaultShelfNumber,
      recipientWantsToBuy: recipientWantsToBuy,
      params: {
        page: 1,
        size: this.state.perPage,
      },
    };

    if (this.state.sort) {
      param.params["sort"] = this.state.sort;
    }

    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
      param["showProperty"] = showProperty;
    }
    this.setState({
      itemControlNumber: ICN,
      dateReportedFrom: reportFrom,
      dateReportedTo: reportTo,
      agencyBureau: agencyBureau,
      status: propertyStatus ? propertyStatus.toUpperCase() : "",
      fiscalYear: fiscalYear,
      administration: administration,
      recipientName: recipientName,
      fairMarketValue: fairMarketValue,
      advancedSearchText: itemName,
      vaultLocation: vaultLocation,
      vaultShelfNumber: vaultShelfNumber,
      recipientWantsToBuy: recipientWantsToBuy,
    });
    this.foreignGiftsApiService.searchForeignGifts(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.foreignGiftsSearchResultList) {
        let row = {
          fiscalYear: property.fiscalYear ? property.fiscalYear : "",
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName ? property.itemName.toUpperCase() : "",
          propertyStatus: property.itemStatus,
          submittedDate: property.submittedDate,
          administration: property.administration,
          recipientName: property.recipientName,
          fairMarketValue: PageUtils.getFormattedCurrency(
            property.fairMarketValue
          ),
          createdBy: property.createdBy,
          vaultLocation: property.vaultLocation,
          vaultShelfNumber: property.vaultShelfNumber,
          recipientWantsToBuy: property.recipientWantsToBuy,
        };
        filteredRows.push(row);
      }

      let totalElements =
        response && response.data && response.data.totalElements
          ? response.data.totalElements
          : 0;

      this.setState({
        filteredItems: filteredRows,
        totalRows: totalElements,
        totalPages: response.data.totalPages,
        loading: false,
        currentPage: param.params.page,
        propertyListResults: response.data.foreignGiftsSearchResultList,
      });
    });
  };

  loadPropertyListOnPageLoad(data) {
    let param = {
      itemControlNumber: this.state.itemControlNumber,
      dateReportedFrom: this.state.dateReportedFrom,
      dateReportedTo: this.state.dateReportedTo,
      agencyBureau: this.state.agencyBureau,
      status: this.state.status,

      fiscalYear: this.state.fiscalYear,
      administration: this.state.administration,
      recipientName: this.state.recipientName,
      fairMarketValue: this.state.fairMarketValue,
      searchType: "MANAGE",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: this.state.advancedSearchText,
      vaultLocation: this.state.vaultLocation,
      vaultShelfNumber: this.state.vaultShelfNumber,
      recipientWantsToBuy: this.state.recipientWantsToBuy,
      params: {
        page: data.params.page,
        size: data.params.size,
      },
    };
    if (this.state.sort) {
      param.params["sort"] = this.state.sort;
    }
    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
      param["showProperty"] = data.params.showProperty;
    }

    this.foreignGiftsApiService.searchForeignGifts(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.foreignGiftsSearchResultList) {
        let row = {
          fiscalYear: property.fiscalYear ? property.fiscalYear : "",
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName ? property.itemName.toUpperCase() : "",
          propertyStatus: property.itemStatus,
          submittedDate: property.submittedDate,
          fairMarketValue: PageUtils.getFormattedCurrency(
            property.fairMarketValue
          ),
          administration: property.administration,
          recipientName: property.recipientName,
          createdBy: property.createdBy,
          vaultLocation: property.vaultLocation,
          vaultShelfNumber: property.vaultShelfNumber,
          recipientWantsToBuy: property.recipientWantsToBuy,
        };
        filteredRows.push(row);
      }

      let totalElements =
        response && response.data && response.data.totalElements
          ? response.data.totalElements
          : 0;

      this.setState({
        filteredItems: filteredRows,
        totalRows: totalElements,
        totalPages: response.data.totalPages,
        loading: false,
        currentPage: 1,
        perPage: data.params.size,
        propertyListResults: response.data.foreignGiftsSearchResultList,
        isAllPageRowsSelected: false,
      });
    });
  }

  handleTogglePageRow = (props: any, { instance, row }) => {
    const { manualRowSelectedKey = "isSelected" } = instance;
    let checked = false;

    if (row.original && row.original[manualRowSelectedKey]) {
      checked = true;
    } else {
      checked = row.isSelected;
    }
    return [
      props,
      {
        onChange: (e) => {
          row.toggleRowSelected(e.target.checked);
          const excessScreeningRows: any[] = instance.rows.filter(
            (row) => row.values.propertyStatus === "EXCESS SCREENING"
          );
          //even if one of the checkbox in the page is selected set "isAllPageRowsSelected" to false
          const selectedRowIds: any[] = Object.keys(
            instance.state.selectedRowIds
          );
          const index: number = selectedRowIds.indexOf(row.id);
          if (e.target.checked) {
            selectedRowIds.push(row.id);
          } else {
            if (index > -1) {
              selectedRowIds.splice(index, 1);
            }
          }
          this.setState({
            isAllPageRowsSelected:
              selectedRowIds.length === excessScreeningRows.length,
          });
        },
        style: {
          cursor: "pointer",
        },
        checked,
        title: "Toggle Row Selected",
        indeterminate: row.isSomeSelected,
      },
    ];
  };

  handleToggleAllPageRows = (props, { instance }) => [
    props,
    {
      onChange: (e: any) => {
        var checked: boolean = e.target.checked;
        instance.rows.forEach((row) => {
          if (row.values.propertyStatus !== "DESTROYED")
            row.toggleRowSelected(checked);
          this.setState({
            isAllPageRowsSelected: checked,
          });
        });
      },
      style: {
        cursor: "pointer",
      },
      checked: this.state.isAllPageRowsSelected,
      title: "Toggle All Current Page Rows Selected",
      indeterminate: this.state.indeterminate,
    },
  ];

  columns = [
    // Let's make a column for selection
    {
      id: "selection",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <div>
          <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => (
        <div>
          <IndeterminateCheckbox
            disabled={row.values.propertyStatus === "DESTROYED"}
            {...row.getToggleRowSelectedProps()}
          />
        </div>
      ),
    },

    {
      Header: "ICN",
      accessor: "itemControlNumber",
      Cell: (props) => (
        <a href={"/viewForeignGift/" + props.value}>{formatICN(props.value)}</a>
      ),
      filter: "search",
    },
    {
      Header: "Property Name",
      accessor: "itemName",
      filter: "search",
    },
    {
      id: "vaultLocation",
      Header: "Vault location",
      accessor: "vaultLocation",
      filter: "search",
    },
    {
      Header: "Shelf Number",
      accessor: "vaultShelfNumber",
      filter: "search",
    },
    {
      Header: "Administration",
      accessor: "administration",
      filter: "search",
      Cell: (props) => (props.value ? props.value : ""),
    },
    {
      Header: "Fair Market Value",
      accessor: "fairMarketValue",
      filter: "search",
    },
    {
      Header: "Interested to Buy",
      accessor: "recipientWantsToBuy",
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "propertyStatus",
      filter: "search",
    },
    {
      Header: "Actions",
      accessor: "createdBy",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer"></div>
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  let filter = {};
                  filter["id"] = column.id;
                  filter["value"] = column["filterValue"];
                  filters.push(filter);
                });
                this.getPropertiesFromAPI(filters);
              }}
              label={"Search"}
            />
            <PPMSButton
              id={"clear-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  column.setFilter("");
                });
                this.getPropertiesFromAPI(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      id: "actions",
      Cell: (property) =>
        property.row.values.propertyStatus !== ForeignGiftsStatus.DESTROYED ? (
          <>
            <PPMSButton
              variant={!this.showEditReview(property) ? "primary" : "hide"}
              label={
                UserUtils.isUserFr() ||
                property.row.values.propertyStatus === ForeignGiftsStatus.DRAFT
                  ? "Edit"
                  : "Review"
              }
              size={"sm"}
              className="manage-list-actions"
              icon={<MdEdit />}
              onPress={() => {
                const { addToast } = this.props.actions;
                const icn = property?.row?.values.itemControlNumber;
                this.propertyApiService
                  .getStatus(icn)
                  .then((response: any) => {
                    if (response?.data?.editFlag) {
                      PageHelper.openPage(
                        Paths.updateForeignGiftReport + "/" + icn
                      );
                    } else {
                      addToast({
                        text: "Unable to edit foreign gift.",
                        type: "error",
                        heading: "Error",
                      });
                    }
                  })
                  .catch((error) => {
                    addToast({
                      text: "Unable to edit foreign gift.",
                      type: "error",
                      heading: "Error",
                    });
                    console.log(error);
                  });
              }}
              id={`edit - ${property.row.values.itemControlNumber}`}
              isDisabled={this.getEditDisable(
                property.row.values.propertyStatus,
                property.data[property.row.id].createdBy
              )}
            />

            <PPMSButton
              variant={"primary"}
              label={"Barcode"}
              size={"sm"}
              className="manage-list-actions"
              icon={<BiBarcodeReader />}
              onPress={() => {
                this.setState({
                  selectedICN: property.row.values.itemControlNumber,
                });
                this.openBarcodeModal();
              }}
              id={`generate-barcode-button - ${property.row.values.itemControlNumber}`}
              isDisabled={this.getBarcodeDisable(
                property.row.values.propertyStatus
              )}
            />

            <PPMSButton
              variant={
                this.showWithdrawActionButton(property) ? "secondary" : "hide"
              }
              label={"Withdraw"}
              size={"sm"}
              className="manage-list-actions"
              icon={<CgRemove />}
              isDisabled={this.getWithdrawDisable(
                property.row.values.propertyStatus
              )}
              value={property.row.values.itemControlNumber}
              onPress={(event) => {
                const { withdrawForeignGift } = this.state;
                this.handlePropertyWithdraw(event);
                this.setState({
                  withdrawForeignGift: withdrawForeignGift,
                });
              }}
              id={`withdraw - ${property.row.values.itemControlNumber}`}
            />
            <PPMSButton
              variant={
                this.showDeleteActionButton(property) ? "secondary" : "hide"
              }
              label={"Delete"}
              size={"sm"}
              className="manage-list-actions"
              icon={<CgRemove />}
              isDisabled={this.getDeleteDisable(
                property.row.values.propertyStatus
              )}
              value={property.row.values.itemControlNumber}
              onPress={(event) => {
                const { deleteForeignGift } = this.state;
                this.handlePropertyDelete(event);
                this.setState({
                  deleteForeignGift,
                });
              }}
              id={`delete - ${property.row.values.itemControlNumber}`}
            />
            <PPMSButton
              variant={
                this.showRejectActionButton(property) ? "secondary" : "hide"
              }
              label={"Reject"}
              size={"sm"}
              className="manage-list-actions"
              icon={<CgRemove />}
              isDisabled={this.getRejectDisable(
                property.row.values.propertyStatus
              )}
              value={property.row.values.itemControlNumber}
              onPress={(event) => {
                const { rejectForeignGift } = this.state;
                this.handlePropertyReject(event);
                this.setState({
                  rejectForeignGift,
                });
              }}
              id={`reject - ${property.row.values.itemControlNumber}`}
            />
            <PPMSButton
              variant={
                this.showDestroyActionButton(property) ? "secondary" : "hide"
              }
              label={"Destroy"}
              size={"sm"}
              className="manage-list-actions"
              icon={<CgRemove />}
              isDisabled={this.getRejectDisable(
                property.row.values.propertyStatus
              )}
              value={property.row.values.itemControlNumber}
              onPress={(event) => {
                const { rejectForeignGift } = this.state;
                this.handlePropertyReject(event);
                this.setState({
                  rejectForeignGift,
                });
              }}
              id={`destroy - ${property.row.values.itemControlNumber}`}
            />
            <PPMSButton
              variant={
                this.showRecallActionButton(property) ? "secondary" : "hide"
              }
              label={"Recall"}
              size={"sm"}
              className="manage-list-actions"
              icon={<CgRemove />}
              isDisabled={this.getRecallDisable(
                property.row.values.propertyStatus
              )}
              value={property.row.values.itemControlNumber}
              onPress={(event) => {
                const { rejectForeignGift } = this.state;
                this.handlePropertyReject(event);
                this.setState({
                  rejectForeignGift,
                });
              }}
              id={`recall - ${property.row.values.itemControlNumber}`}
            />
            <PPMSButton
              variant={
                this.showSendToSaleActionButton(property) ? "secondary" : "hide"
              }
              label={"Send to Sale"}
              size={"sm"}
              className={"manage-list-actions"}
              icon={<MdSend />}
              isDisabled={false}
              value={property.row.values.itemControlNumber}
              onPress={(event) => {
                const { sendToSaleForeignGift } = this.state;
                this.handleForeignGiftSendToSale(event);
                this.setState({
                  sendToSaleForeignGift,
                });
              }}
              id={`send-to-sale-${property.row.values.itemControlNumber}`}
            />
          </>
        ) : (
          <div></div>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];
  handleSort = (sortBy) => {
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    let showMyProperty;
    if (this.state.firstSearch) {
      showMyProperty = "all";
    } else {
      let search = this.props.location.search;
      let query = queryString.parse(search);
      showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
      this.setState({ loading: true });
    }
    if (order) sort = sortBy?.id + "," + order;

    this.setState({ sort: sort });
    //Preserve search results while sorting
    let param = {
      itemControlNumber: this.state.itemControlNumber,
      dateReportedFrom: this.state.dateReportedFrom,
      dateReportedTo: this.state.dateReportedTo,
      status: this.state.status,
      fiscalYear: this.state.fiscalYear,
      administration: this.state.administration,
      recipientName: this.state.recipientName,
      fairMarketValue: this.state.fairMarketValue,
      searchType: "MANAGE",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: this.state.advancedSearchText,
      vaultLocation: this.state.vaultLocation,
      vaultShelfNumber: this.state.vaultShelfNumber,
      recipientWantsToBuy: this.state.recipientWantsToBuy,
      params: {
        page: 1,
        size: this.state.perPage,
        sort: sort,
      },
    };
    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
      param["showProperty"] = showMyProperty;
    }
    this.foreignGiftsApiService.searchForeignGifts(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.foreignGiftsSearchResultList) {
        let row = {
          recipientName: property.recipientName,
          fiscalYear: property.fiscalYear ? property.fiscalYear : "",
          administration: property.administration,
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName ? property.itemName.toUpperCase() : "",
          propertyStatus: property.itemStatus,
          fairMarketValue: PageUtils.getFormattedCurrency(
            property.fairMarketValue
          ),
          submittedDate: property.submittedDate,
          createdBy: property.createdBy,
          vaultLocation: property.vaultLocation,
          vaultShelfNumber: property.vaultShelfNumber,
          recipientWantsToBuy: property.recipientWantsToBuy,
        };
        filteredRows.push(row);
      }

      let totalElements =
        response && response.data && response.data.totalElements
          ? response.data.totalElements
          : 0;

      this.setState({
        filteredItems: filteredRows,
        totalRows: totalElements,
        totalPages: response.data.totalPages,
        loading: false,
        currentPage: param.params.page,
        propertyListResults: response.data.foreignGiftsSearchResultList,
      });
    });
  };

  handlePropertyRadioChange(event: any) {
    let startValue = event.target.options[event.target.selectedIndex].id;
    this.setState({
      defaultFilterValue: startValue,
    });

    this.refreshPropertyTableFromFilterChange(startValue);
  }

  handleSendToDOSApproval() {
    isFormSubmitted.next(true);
    const data = this.state.selectedRowIds;
    const { addToast } = this.props.actions;

    let canBeSentToDoSApproval = true;

    if (data) {
      for (let id of data) {
        let obj = this.state.filteredItems.find(
          (item) => item.itemControlNumber === id
        );
        if (obj.propertyStatus !== ForeignGiftsStatus.EXCESS_SCREENING) {
          addToast({
            text:
              "Only Foreign Gift of Excess Screening status can be sent to DOS for approval. Please select again.",
            type: "error",
            heading: "Error",
          });
          canBeSentToDoSApproval = false;
          break;
        }
      }
    }
    if (data.length > 0 && canBeSentToDoSApproval) {
      try {
        this.foreignGiftsApiService.approvedByDOS(data).then((response) => {
          addToast({
            text: "Foreign Gifts have been sent to DOS for approval",
            type: "success",
            heading: "Success",
          });

          let search = this.props.location.search;
          let query = queryString.parse(search);
          let showMyProperty = query["showProperty"]
            ? query["showProperty"]
            : "all";
          const { perPage } = this.state;
          const data = {
            params: {
              page: this.state.currentPage,
              size: perPage,
            },
          };
          if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
            data.params["showProperty"] = showMyProperty;
          }
          this.loadPropertyListOnPageLoad(data);
          this.downloadDOSApprovalSheet();
        });
      } catch (error) {
        addToast({
          text:
            "Foreign Gift failed to be sent to DOS for approval. Please try again.",
          type: "error",
          heading: "Error",
        });
        console.log(error);
      } finally {
        isFormSubmitted.next(false);
      }
    } else if (canBeSentToDoSApproval) {
      addToast({
        text: "Foreign Gifts not selected for DOS approval",
        type: "error",
        heading: "Error",
      });
    }
  }

  handleUploadDoSApproval() {
    this.setState({
      showUploadDOSApprovalModal: true,
      isUploadCancelled: false,
      isUploadDOSApprovalEnabled: false,
    });
  }

  handleMultiplePrintLabels = () => {
    const ICNs = this.state.selectedRowIds;
    const { addToast } = this.props.actions;
    const { printLabels } = this.state;
    let ICNInfo = [];

    if (ICNs.length > 0) {
      try {
        ICNs.map(async (ICN, index) => {
          let response = await this.propertyApiService.getProperty(ICN);
          let ICNToPrint = {
            itemControlNumber: response?.data?.itemControlNumber,
            fairMarketValue: response?.data?.giftInfo?.fairMarketValue
              ? response?.data?.giftInfo?.fairMarketValue
              : "",
            vaultLocation: response?.data?.giftInfo?.vaultLocation
              ? response?.data?.giftInfo?.vaultLocation
              : "",
            vaultShelfNumber: response?.data?.giftInfo?.vaultShelfNumber
              ? response?.data?.giftInfo?.vaultShelfNumber
              : "",
            itemName: response?.data?.itemName ? response?.data?.itemName : "",
            donorInfo:
              (response?.data?.donorInfo?.donorTitle
                ? response?.data?.donorInfo?.donorTitle
                : "") +
              " " +
              (response?.data?.donorInfo?.firstName
                ? response?.data?.donorInfo?.firstName
                : "") +
              " " +
              (response?.data?.donorInfo?.lastName
                ? response?.data?.donorInfo?.lastName
                : ""),
            recipientInfo:
              (response?.data?.recipientInfo?.recipientTitle
                ? response?.data?.recipientInfo.recipientTitle
                : "") +
              " " +
              (response?.data?.recipientInfo?.firstName
                ? response?.data?.recipientInfo.firstName
                : "") +
              " " +
              (response?.data?.recipientInfo?.lastName
                ? response?.data?.recipientInfo.lastName
                : ""),
            dateReceivedByRecipient: response?.data?.giftInfo
              ?.dateReceivedByRecipient
              ? response?.data?.giftInfo.dateReceivedByRecipient
              : "",
            administration: response?.data?.giftInfo?.administration
              ? response?.data?.giftInfo?.administration
              : "",
          };
          ICNInfo[index] = ICNToPrint;
          printLabels.printLabelsICNs = ICNInfo;
          printLabels.showMultiplePrintModal = true;
          this.setState({ printLabels });
        });
      } catch (error) {
        addToast({
          text: "Foreign Gift failed to be printed. Please try again.",
          type: "error",
          heading: "Error",
        });
        console.log(error);
      } finally {
        // isFormSubmitted.next(false);
      }
    } else {
      addToast({
        text: "Foreign Gifts not selected for print lables",
        type: "error",
        heading: "Error",
      });
      return;
    }
  };

  handlePrintLablesModalClose = () => {
    const { printLabels } = this.state;
    printLabels.showMultiplePrintModal = false;
    printLabels.printLabelsICNs = [];
    this.setState({ printLabels });
  };

  handlePrintLabelsDownload = () => {
    const data = this.state.selectedRowIds;
    this.foreignGiftsApiService.downloadLabels(data).then((response) => {
      let blob = new Blob([response.data], {
        type: "application/pdf",
      });
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(blob);
      var a = document.createElement("a");
      a.setAttribute("download", "Labels.pdf");
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(link);
    });
  };

  handleMultiplePrintAcceptanceLetters = () => {
    const data = this.state.selectedRowIds;
    const { addToast } = this.props.actions;
    this.foreignGiftsApiService.downloadAcceptanceLetters(data).then((response) => {
      let blob = new Blob([response.data], {
        type: "application/pdf",
      });
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(blob);
      const checkForAAC = data.every((val, index, arr) => val.substring(0,5) === arr[0].substring(0,5))
      if(!checkForAAC){
        addToast({
          text:"All items on the acceptance letter must have the same AAC.",
          type: "error",
          heading: "Error",
        });
      } else {
        printJS(link)
      }
      URL.revokeObjectURL(link);
    });
  };

  handlePrintAcceptanceLettersModalClose = () => {
    const { printAcceptanceLetters } = this.state;
    printAcceptanceLetters.showMultiplePrintModal = false;
    printAcceptanceLetters.printAcceptanceLettersICNs = [];
    this.setState({ printAcceptanceLetters });
  };

  handlePrintAcceptanceLettersDownload = () => {
    const data = this.state.selectedRowIds;
    this.foreignGiftsApiService
      .downloadAcceptanceLetters(data)
      .then((response) => {
        let blob = new Blob([response.data], {
          type: "application/pdf",
        });
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob);
        var a = document.createElement("a");
        a.setAttribute("download", "AcceptanceLetter.pdf");
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(link);
      });
  };

  handleForeignGiftSendToSale = (event: any) => {
    const { sendToSaleForeignGift } = this.state;
    sendToSaleForeignGift.sendToSaleICN = event.currentTarget.value;
    sendToSaleForeignGift.showSendToSaleConfirmationModal = true;
    this.setState({
      sendToSaleForeignGift,
    });
  };

  handleSendToSaleModalClose = () => {
    const { sendToSaleForeignGift } = this.state;
    sendToSaleForeignGift.showSendToSaleConfirmationModal = false;
    sendToSaleForeignGift.sendToSaleICN = "";
    sendToSaleForeignGift.sendToSaleConfirmation = "";
    sendToSaleForeignGift.sendToSaleConfirmationInvalid = false;
    sendToSaleForeignGift.showError = false;
    sendToSaleForeignGift.errorMessage = "";
    this.setState({
      sendToSaleForeignGift,
    });
    isFormSubmitted.next(false);
  };

  handleSendToSaleModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { sendToSaleForeignGift } = this.state;
    const { addToast } = this.props.actions;

    let payload = {
      itemControlNumber: sendToSaleForeignGift.sendToSaleICN,
    };
    let sendToSaleICN = sendToSaleForeignGift.sendToSaleICN;

    try {
      let sendToSaleForeignGiftResponse = await this.foreignGiftsApiService.sendToSale(
        payload
      );

      if (sendToSaleForeignGiftResponse.status === 200) {
        this.handleSendToSaleModalClose();
        addToast({
          text: `Foreign Gift with ICN: ${formatICN(
            sendToSaleICN
          )}  has been sent to sale successfully`,
          type: "success",
          heading: "Success",
        });
        this.setState({ sendToSaleForeignGift });
        let search = this.props.location.search;
        let query = queryString.parse(search);
        let showMyProperty = query["showProperty"]
          ? query["showProperty"]
          : "all";
        const { perPage } = this.state;
        const data = {
          params: {
            page: this.state.currentPage,
            size: perPage,
          },
        };
        if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
          data.params["showProperty"] = showMyProperty;
        }
        this.loadPropertyListOnPageLoad(data);
      } else {
        addToast({
          text: "Foreign Gift failed to be sent to sale. Please try again.",
          type: "error",
          heading: "Error",
        });
        sendToSaleForeignGift.showSendToSaleConfirmationModal = false;
        this.setState({
          sendToSaleForeignGift,
        });

        this.handleSendToSaleModalClose();
      }
    } catch (error) {
      addToast({
        text: "Foreign Gift failed to be sent to sale. Please try again.",
        type: "error",
        heading: "Error",
      });
      sendToSaleForeignGift.showSendToSaleConfirmationModal = false;
      this.setState({
        sendToSaleForeignGift,
      });

      this.handleSendToSaleModalClose();
    } finally {
      isFormSubmitted.next(false);
    }

    sendToSaleForeignGift.showSendToSaleConfirmationModal = false;
    this.setState({
      sendToSaleForeignGift,
    });
  };

  downloadDOSApprovalSheet() {
    this.foreignGiftsApiService.downloadFile().then((response) => {
      let blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(blob);
      var a = document.createElement("a");
      a.setAttribute("download", "DOS Approval Sheet.xlsx");
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(link);
    });
  }

  refreshPropertyTableFromFilterChange(filterValue) {
    let showProperty = this.setShowPropertyParam(filterValue);

    PageHelper.openPage(Paths.propertyList + "?showProperty=" + showProperty);
    const { perPage } = this.state;
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
      data.params["showProperty"] = showProperty;
    }
    this.loadPropertyListOnPageLoad(data);
  }

  setShowPropertyParam(filterValue): string {
    switch (filterValue) {
      case "show-all-property":
        return "all";
      case "show-my-property":
        return "myProperty";
      case "show-others-property":
        return "other";
      default:
        return "all";
    }
  }

  handlePropertyWithdraw = (event: any) => {
    const { withdrawForeignGift } = this.state;
    withdrawForeignGift.withdrawingICN = event.currentTarget.value;
    withdrawForeignGift.showWithdrawConfirmationModal = true;
    this.setState({
      withdrawForeignGift,
    });
  };

  handlePropertyDelete = (event: any) => {
    const { deleteForeignGift } = this.state;
    deleteForeignGift.deleteICN = event.currentTarget.value;
    deleteForeignGift.showDeleteConfirmationModal = true;
    this.setState({
      deleteForeignGift,
    });
  };

  handlePropertyReject = (event: any) => {
    const { rejectForeignGift } = this.state;
    rejectForeignGift.rejectICN = event.currentTarget.value;
    if (event.currentTarget.id.startsWith("destroy")) {
      rejectForeignGift.sourceName = "Destroy";
    } else if (event.currentTarget.id.startsWith("reject")) {
      rejectForeignGift.sourceName = "Reject";
    } else if (event.currentTarget.id.startsWith("recall")) {
      rejectForeignGift.sourceName = "Recall";
    }
    rejectForeignGift.showRejectConfirmationModal = true;
    this.setState({
      rejectForeignGift,
      rejectOptions: [
        { value: "Yes", id: "Y", isSelected: false },
        { value: "No", id: "N", isSelected: false },
      ],
    });
  };
  handleWithdrawRejectModalClose = () => {
    const { withdrawForeignGift, rejectForeignGift } = this.state;
    withdrawForeignGift.showWithdrawConfirmationModal = false;
    withdrawForeignGift.withdrawingICN = "";
    withdrawForeignGift.withdrawConfirmation = "";
    withdrawForeignGift.withdrawConfirmationErrorMessage = "";
    withdrawForeignGift.withdrawConfirmationInvalid = false;

    withdrawForeignGift.withdrawalReason = "";
    withdrawForeignGift.withdrawalReasonInvalid = false;
    withdrawForeignGift.withdrawalReasonErrorMessage = "";

    rejectForeignGift.showRejectConfirmationModal = false;
    rejectForeignGift.rejectICN = "";
    rejectForeignGift.rejectConfirmation = "";
    rejectForeignGift.rejectConfirmationInvalid = false;
    rejectForeignGift.rejectConfirmationErrorMessage = "";

    rejectForeignGift.rejectReason = "";
    rejectForeignGift.rejectReasonInvalid = false;
    rejectForeignGift.rejectReasonErrorMessage = "";

    this.setState({
      withdrawForeignGift,
      rejectForeignGift,
      withdrawOptions: [
        { value: "Yes", id: "Y", isSelected: false },
        { value: "No", id: "N", isSelected: false },
      ],
      rejectOptions: [
        { value: "Yes", id: "Y", isSelected: false },
        { value: "No", id: "N", isSelected: false },
      ],
    });
    isFormSubmitted.next(false);
  };

  handleDeleteModalClose = () => {
    const { deleteForeignGift } = this.state;
    deleteForeignGift.showDeleteConfirmationModal = false;
    deleteForeignGift.deleteICN = "";
    deleteForeignGift.deleteConfirmation = "";
    deleteForeignGift.deleteConfirmationInvalid = false;
    deleteForeignGift.showError = false;
    deleteForeignGift.errorMessage = "";
    this.setState({
      deleteForeignGift,
    });
    isFormSubmitted.next(false);
  };

  handleWithDrawModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { withdrawForeignGift } = this.state;
    const { addToast } = this.props.actions;
    let payload = {
      itemControlNumber: withdrawForeignGift.withdrawingICN,
      withdrawnReason: withdrawForeignGift.withdrawalReason,
      withDrawnQuantity: "",
    };
    this.validateWithdrawConfirm(withdrawForeignGift.withdrawConfirmation);
    if (!withdrawForeignGift.withdrawConfirmationInvalid) {
      if (withdrawForeignGift.withdrawConfirmation === "No") {
        this.handleWithdrawRejectModalClose();
        return;
      } else if (withdrawForeignGift.withdrawConfirmation === "Yes") {
        this.validateWithdrawReason(withdrawForeignGift.withdrawalReason);
      }
    }

    if (
      withdrawForeignGift.withdrawConfirmationInvalid ||
      withdrawForeignGift.withdrawalReasonInvalid
    )
      return;

    try {
      let withdrawPropertyResponse = await this.propertyApiService.withdrawProperty(
        payload
      );
      if (withdrawPropertyResponse.status === 200) {
        let withdrawnICN = withdrawForeignGift.withdrawingICN;
        this.handleWithdrawRejectModalClose();
        addToast({
          text: `Foreign Gift with ICN: ${formatICN(
            withdrawnICN
          )} is successfully withdrawn!`,
          type: "success",
          heading: "Success",
        });
        this.setState({ withdrawForeignGift });
        let search = this.props.location.search;
        let query = queryString.parse(search);
        let showMyProperty = query["showProperty"]
          ? query["showProperty"]
          : "all";
        const { perPage } = this.state;
        const data = {
          params: {
            page: this.state.currentPage,
            size: perPage,
          },
        };
        if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
          data.params["showProperty"] = showMyProperty;
        }
        this.loadPropertyListOnPageLoad(data);
      } else {
        addToast({
          text: "Foreign Gift withdrawal failed. Please try again.",
          type: "error",
          heading: "Error",
        });
        withdrawForeignGift.showWithdrawConfirmationModal = false;
        this.setState({
          withdrawForeignGift: withdrawForeignGift,
        });
      }
    } catch (error) {
      addToast({
        text: error.data.debugMessage,
        type: "error",
        heading: "Error",
      });
      withdrawForeignGift.showWithdrawConfirmationModal = false;
      this.setState({
        withdrawForeignGift: withdrawForeignGift,
      });
      this.handleWithdrawRejectModalClose();
    } finally {
      isFormSubmitted.next(false);
    }
  };

  handleDeleteModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { deleteForeignGift } = this.state;
    const { addToast } = this.props.actions;
    let deleteICN = deleteForeignGift.deleteICN;
    if (deleteForeignGift.showError !== true) {
      try {
        let deleteForeignGiftResponse = await this.propertyApiService.deletePropertyReport(
          deleteICN
        );
        if (deleteForeignGiftResponse.data.status === "Deleted") {
          this.handleDeleteModalClose();
          addToast({
            text: `Foreign Gift with ICN: ${formatICN(
              deleteICN
            )} is successfully deleted!`,
            type: "success",
            heading: "Success",
          });
          this.setState({ deleteForeignGift });
          let search = this.props.location.search;
          let query = queryString.parse(search);
          let showMyProperty = query["showProperty"]
            ? query["showProperty"]
            : "all";
          const { perPage } = this.state;
          const data = {
            params: {
              page: this.state.currentPage,
              size: perPage,
            },
          };
          if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
            data.params["showProperty"] = showMyProperty;
          }
          this.loadPropertyListOnPageLoad(data);
        } else {
          deleteForeignGift.showError = true;
          deleteForeignGift.errorMessage =
            "Delete Foreign Gift failed. Please try again.";
          addToast({
            text: deleteForeignGift.errorMessage,
            type: "error",
            heading: "Error",
          });
          console.error(
            "ForeignGiftListPage has error on handleDeleteModalSubmit"
          );
          this.handleDeleteModalClose();
        }
      } catch (error) {
        deleteForeignGift.showError = true;
        deleteForeignGift.errorMessage =
          "Delete Foreign Gift failed. Please try again.";
        addToast({
          text: deleteForeignGift.errorMessage,
          type: "error",
          heading: "Error",
        });
        console.error(
          "ForeignGiftListPage has error on handleDeleteModalSubmit",
          error
        );
        this.handleDeleteModalClose();
      } finally {
        isFormSubmitted.next(false);
      }
    }
    deleteForeignGift.showDeleteConfirmationModal = false;
    this.setState({
      deleteForeignGift,
    });
  };

  handleRejectModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { rejectForeignGift } = this.state;
    const { addToast } = this.props.actions;
    let rejectICN = rejectForeignGift.rejectICN;

    let payload = {
      itemControlNumber: rejectForeignGift.rejectICN,
      rejectReason: rejectForeignGift.rejectReason,
    };

    this.validateRejectConfirm(
      rejectForeignGift.rejectConfirmation,
      rejectForeignGift.sourceName
    );
    if (!rejectForeignGift.rejectConfirmationInvalid) {
      if (rejectForeignGift.rejectConfirmation === "No") {
        this.handleWithdrawRejectModalClose();
        return;
      } else if (rejectForeignGift.rejectConfirmation === "Yes") {
        this.validateRejectReason(
          rejectForeignGift.rejectReason,
          rejectForeignGift.sourceName
        );
      }
    }

    if (
      rejectForeignGift.rejectConfirmationInvalid ||
      rejectForeignGift.rejectReasonInvalid
    )
      return;

    try {
      let rejectForeignGiftResponse;
      let actionType = "";
      if (rejectForeignGift.sourceName === "Reject") {
        actionType = "is successfully rejected";
        rejectForeignGiftResponse = await this.propertyApiService.rejectForeignGiftReport(
          payload
        );
      } else if (rejectForeignGift.sourceName === "Destroy") {
        actionType = "has been marked as destroyed successfully";
        rejectForeignGiftResponse = await this.propertyApiService.destroyForeignGiftReport(
          payload
        );
      } else if (rejectForeignGift.sourceName === "Recall") {
        actionType = "is successfully recalled";
        rejectForeignGiftResponse = await this.propertyApiService.recallForeignGiftReport(
          payload
        );
      }
      if (rejectForeignGiftResponse.status === 200) {
        this.handleWithdrawRejectModalClose();
        addToast({
          text: `Foreign Gift with ICN: ${formatICN(rejectICN)}  ${actionType}`,
          type: "success",
          heading: "Success",
        });
        this.setState({ rejectForeignGift });
        let search = this.props.location.search;
        let query = queryString.parse(search);
        let showMyProperty = query["showProperty"]
          ? query["showProperty"]
          : "all";
        const { perPage } = this.state;
        const data = {
          params: {
            page: this.state.currentPage,
            size: perPage,
          },
        };
        if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
          data.params["showProperty"] = showMyProperty;
        }
        this.loadPropertyListOnPageLoad(data);
      } else {
        addToast({
          text:
            rejectForeignGift.sourceName === "Reject"
              ? "Foreign Gift failed to reject. Please try again."
              : rejectForeignGift.sourceName === "Destroy"
              ? "Foreign Gift failed to destroy. Please try again."
              : "Foreign Gift failed to be recalled. Please try again.",
          type: "error",
          heading: "Error",
        });
        rejectForeignGift.showRejectConfirmationModal = false;
        this.setState({
          rejectForeignGift,
        });
        this.handleWithdrawRejectModalClose();
      }
    } catch (error) {
      addToast({
        text:
          rejectForeignGift.sourceName === "Reject"
            ? "Foreign Gift failed to reject. Please try again."
            : rejectForeignGift.sourceName === "Destroy"
            ? "Foreign Gift failed to destroy. Please try again."
            : "Foreign Gift failed to be recalled. Please try again.",
        type: "error",
        heading: "Error",
      });
      rejectForeignGift.showRejectConfirmationModal = false;
      this.setState({
        rejectForeignGift,
      });

      this.handleWithdrawRejectModalClose();
    } finally {
      isFormSubmitted.next(false);
    }

    rejectForeignGift.showRejectConfirmationModal = false;
    this.setState({
      rejectForeignGift,
    });
  };

  handleWithdrawReasonChange = (event) => {
    let value = event.currentTarget.value;
    this.validateWithdrawReason(value);
  };

  validateWithdrawReason = (value: string) => {
    const { withdrawForeignGift } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Withdrawal reason is required";
    } else if (value.length >= 500) {
      validation.isInvalid = true;
      validation.validationError =
        "Withdrawal reason must be 500 characters or less";
    }
    withdrawForeignGift.withdrawalReason = value;
    withdrawForeignGift.withdrawalReasonInvalid = validation.isInvalid;
    withdrawForeignGift.withdrawalReasonErrorMessage =
      validation.validationError;
    this.setState({
      withdrawForeignGift,
    });
    return validation;
  };

  handleWithdrawConfirmChange = (event: any) => {
    event.forEach((e) => {
      if (e.isSelected) {
        this.validateWithdrawConfirm(e.value);
      }
    });
  };
  validateWithdrawConfirm = (value: string) => {
    const { withdrawForeignGift } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Withdrawal confirmation is required";
    }
    withdrawForeignGift.withdrawConfirmation = value;
    withdrawForeignGift.withdrawConfirmationInvalid = validation.isInvalid;
    withdrawForeignGift.withdrawConfirmationErrorMessage =
      validation.validationError;

    this.setState({
      withdrawForeignGift,
    });
    return validation;
  };

  handleRejectReasonChange = (event) => {
    let value = event.currentTarget.value;
    this.validateRejectReason(value, this.state.rejectForeignGift.sourceName);
  };

  validateRejectReason = (value: string, name: string) => {
    const { rejectForeignGift } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = name + " " + "reason is required";
    } else if (value.length >= 500) {
      validation.isInvalid = true;
      validation.validationError =
        name + " " + "reason must be 500 characters or less";
    }
    rejectForeignGift.rejectReason = value;
    rejectForeignGift.rejectReasonInvalid = validation.isInvalid;
    rejectForeignGift.rejectReasonErrorMessage = validation.validationError;
    this.setState({
      rejectForeignGift,
    });
    return validation;
  };
  handleRejectConfirmChange = (event: any, sourceName: string) => {
    event.forEach((e) => {
      if (e.isSelected) {
        this.validateRejectConfirm(e.value, sourceName);
      }
    });
  };
  validateRejectConfirm = (value: string, name: string) => {
    const { rejectForeignGift } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      if (name === "Reject" || name === "Destroy") {
        validation.validationError = name + " " + "confirmation is required";
      } else {
        validation.validationError = "Recall should be Yes or No";
      }
    }
    rejectForeignGift.rejectConfirmation = value;
    rejectForeignGift.rejectConfirmationInvalid = validation.isInvalid;
    rejectForeignGift.rejectConfirmationErrorMessage =
      validation.validationError;

    this.setState({
      rejectForeignGift,
    });
    return validation;
  };

  handleErrorModalClose = () => {
    this.setState({
      showErrorUploadDOSApprovalModal: false,
    });
    isFormSubmitted.next(false);
  };

  handleErrorModalDownload = () => {
    let blob = this.state.errorFile;
    var url = window.URL || window.webkitURL;
    var link = url.createObjectURL(blob);
    var a = document.createElement("a");
    a.setAttribute("download", "DOS Error Approval Sheet.xlsx");
    a.setAttribute("href", link);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(link);
    this.setState({
      showErrorUploadDOSApprovalModal: false,
    });
    isFormSubmitted.next(false);
  };

  handleSendDoSApprovalModalClose = () => {
    this.setState({
      showUploadDOSApprovalModal: false,
      isUploadCancelled: true,
    });
    isFormSubmitted.next(false);
  };

  updateUploadDOSApprovalFileStatus = (value: boolean) => {
    this.setState({
      fileInfectedStatus: value,
    });
  };

  enableDOSApprovelSubmit = (value: boolean) => {
    this.setState({
      isUploadDOSApprovalEnabled: value,
    });
  };

  disableDOSApprovelSubmit = () => {
    this.setState({
      isUploadDOSApprovalEnabled: false,
    });
  };

  handleSendDoSApprovalModalSubmit = async () => {
    isFormSubmitted.next(true);
    const { addToast } = this.props.actions;
    this.foreignGiftsApiService.processUploadedFile().then((response) => {
      if (response.data.size !== 0) {
        let blob = new Blob([response.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        this.setState({
          showErrorUploadDOSApprovalModal: true,
          errorFile: blob,
        });
      }
      try {
        this.setState({
          showUploadDOSApprovalModal: false,
        });
        response.data.size === 0 &&
          addToast({
            text: "DOS Approval upload is successful.",
            type: "success",
            heading: "Success",
          });
        let search = this.props.location.search;
        let query = queryString.parse(search);
        let showMyProperty = query["showProperty"]
          ? query["showProperty"]
          : "all";
        const { perPage } = this.state;
        const data = {
          params: {
            page: this.state.currentPage,
            size: perPage,
          },
        };
        if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
          data.params["showProperty"] = showMyProperty;
        }
        this.loadPropertyListOnPageLoad(data);
      } catch (error) {
        addToast({
          text: error.data.debugMessage,
          type: "error",
          heading: "Error",
        });
        this.handleSendDoSApprovalModalClose();
      } finally {
        isFormSubmitted.next(false);
      }
    });
  };

  getEditDisable = (propertyStatus: string, submittedBy: string) => {
    if (
      [ForeignGiftsStatus.SOLD, ForeignGiftsStatus.WITHDRAWN].includes(
        propertyStatus.toUpperCase()
      )
    ) {
      return true;
    }
    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
      if (
        [ForeignGiftsStatus.REJECTED].includes(propertyStatus.toUpperCase()) &&
        submittedBy !== UserUtils.getUserInfo().emailAddress
      ) {
        return true;
      } else {
        return false;
      }
    } else if (
      UserUtils.isUserFr() &&
      [
        ForeignGiftsStatus.EXCESS_SCREENING,
        ForeignGiftsStatus.AWAITING_DOS_APPROVAL,
        ForeignGiftsStatus.SALE_APPROVAL,
        ForeignGiftsStatus.LOTTED,
        ForeignGiftsStatus.AVAILABLE,
        ForeignGiftsStatus.RECALLED,
      ].includes(propertyStatus.toUpperCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  getWithdrawDisable = (propertyStatus: string) => {
    if (
      UserUtils.isUserFr() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserFg()
    ) {
      if ([ForeignGiftsStatus.SOLD].includes(propertyStatus.toUpperCase())) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  getDeleteDisable = (propertyStatus: string) => {
    if (
      UserUtils.isUserFr() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserFg()
    ) {
      if ([ForeignGiftsStatus.SOLD].includes(propertyStatus.toUpperCase())) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  getRejectDisable = (propertyStatus: string) => {
    if (UserUtils.isUserFg() || UserUtils.isSystemAdminUser()) {
      if ([ForeignGiftsStatus.SOLD].includes(propertyStatus.toUpperCase())) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  getSelectedRowIds = (selectedFlatRows: any[]): any[] => {
    return selectedFlatRows.map((d) =>
      d.original.itemControlNumber ? d.original.itemControlNumber : d.id
    );
  };

  getPendStatus = (selectedFlatRows: any[]): any[] => {
    return selectedFlatRows.map((val) =>
      val.original.propertyStatus ? val.original.propertyStatus : ''
    );
  }

  setSelectedRows = (selectedFlatRows: any[]) => {
    const selectedRowIds = this.getSelectedRowIds(selectedFlatRows);
    const selectedPendCase = this.getPendStatus(selectedFlatRows);
    this.setState({ selectedRowIds: selectedRowIds, selectedRowPend: selectedPendCase });
  };

  getRecallDisable = (propertyStatus: string) => {
    if (UserUtils.isUserFg() || UserUtils.isSystemAdminUser()) {
      if (
        ![ForeignGiftsStatus.TRANSFERRED, ForeignGiftsStatus.DONATED].includes(
          propertyStatus.toUpperCase()
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  getBarcodeDisable = (propertyStatus: string) => {
    if ([ForeignGiftsStatus.SOLD].includes(propertyStatus.toUpperCase())) {
      return true;
    } else {
      return false;
    }
  };
  showDestroyActionButton(property) {
    const fgDestroyStatus = [
      "EXCESS SCREENING",
      "AWAITING DOS APPROVAL",
      "SEND TO SALE",
      "SALE APPROVAL",
      "RESTRICTED",
    ];
    return (
      ((UserUtils.hasPermission("FG") && UserUtils.hasPermission("AC")) ||
        UserUtils.isSystemAdminUser()) &&
      fgDestroyStatus.includes(property.row.values.propertyStatus.toUpperCase())
    );
  }
  showRejectActionButton(property) {
    return (
      (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) &&
      property.row.values.propertyStatus === ForeignGiftsStatus.PENDING
    );
  }

  showDeleteActionButton(property) {
    return property.row.values.propertyStatus === ForeignGiftsStatus.DRAFT;
  }

  showWithdrawActionButton(property) {
    return (
      [ForeignGiftsStatus.PENDING].includes(
        property.row.values.propertyStatus
      ) &&
      UserUtils.getUserInfo().emailAddress === property.row.values.actions &&
      UserUtils.isUserFr()
    );
  }
  showRecallActionButton(property) {
    const fgDestroyStatus = ["DONATED", "TRANSFERRED"];
    return (
      ((UserUtils.hasPermission("FG") && UserUtils.hasPermission("AC")) ||
        UserUtils.isSystemAdminUser()) &&
      fgDestroyStatus.includes(property.row.values.propertyStatus)
    );
  }
  showSendToSaleActionButton(property) {
    return (
      (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) &&
      (property.row.values.propertyStatus ===
        ForeignGiftsStatus.SALE_APPROVAL ||
        (property.row.values.recipientWantsToBuy === "Yes" &&
          ForeignGiftsStatus.EXCESS_SCREENING ===
            property.row.values.propertyStatus))
    );
  }

  showEditReview(property) {
    const fgDestroyStatus = ["DONATED", "TRANSFERRED"];
    return fgDestroyStatus.includes(property.row.values.propertyStatus);
  }
  render() {
    let dataTable;
    if (
      UserUtils.isUserFr() ||
      UserUtils.isUserFg() ||
      UserUtils.isSystemAdminUser()
    ) {
      dataTable = (
        <div className="ui-ppms">
          <PPMSDatatable
            title={"Manage Foreign Gift"}
            data={this.state.filteredItems}
            columns={this.columns}
            serverSort={true}
            showFilters={true}
            currentPage={this.state.currentPage - 1}
            handleSort={(sortBy) => this.handleSort(sortBy)}
            defaultSortField={"itemControlNumber"}
            loading={this.state.loading}
            rowsPerPageOptions={this.state.rowsPerPageOptions}
            totalRows={this.state.totalRows}
            totalPages={this.state.totalPages}
            rowsPerPage={this.state.perPage}
            isPaginationEnabled={true}
            onChange={this.handleChange}
            subHeaderComponent={
              <div className={"grid-row"}>
                <div className={"grid-col"}>
                  <div className="btn-create-foreign-gifts">
                    {(UserUtils.isUserFr() ||
                      UserUtils.isUserFg() ||
                      UserUtils.isSystemAdminUser()) && (
                      <PPMSButton
                        variant={"primary"}
                        type={"button"}
                        value={"createForeignGift"}
                        label={"Create Foreign Gift"}
                        className={"create-property out-button"}
                        onPress={() => {
                          PageHelper.openPage(Paths.createForeignGiftReport);
                        }}
                        id={"create-foreign-gift"}
                      />
                    )}
                  </div>
                </div>
              </div>
            }
            bulkActions={
              (UserUtils.isUserFg() || UserUtils.isSystemAdminUser()) && (
                <>
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"sendToDOSApproval"}
                    label={"Send to DOS Approval"}
                    className={"create-property out-button"}
                    onPress={this.handleSendToDOSApproval}
                    id={"send-dos-approval"}
                  />
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"uploadDoSApproval"}
                    label={"Upload DOS Approval"}
                    className={"create-property out-button"}
                    onPress={this.handleUploadDoSApproval}
                    id={"upload-dos-approval"}
                  />
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"printLabels"}
                    label={"Print Labels"}
                    className={"create-property out-button"}
                    onPress={this.handleMultiplePrintLabels}
                    id={"print-lables"}
                  />
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"printAcceptanceLetters"}
                    label={"Print Acceptance Letter(s)"}
                    className={"create-property out-button"}
                    onPress={this.handleMultiplePrintAcceptanceLetters}
                    id={"print-acceptanceletters"}
                    isDisabled={!this.state.selectedRowPend.some(ele => ele === 'PENDING')}
                  />
                </>
              )
            }
            setSelectedRows={this.setSelectedRows}
            handleTogglePageRow={this.handleTogglePageRow}
            handleToggleAllPageRows={this.handleToggleAllPageRows}
            hiddenColumns={UserUtils.isUserFr() ? ["selection"] : []}
          />
        </div>
      );
    }

    return (
      <div>
        {dataTable}
        <PPMSModal
          show={this.state.withdrawForeignGift.showWithdrawConfirmationModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleWithdrawRejectModalClose}
          handleSave={this.handleWithDrawModalSubmit}
          title={"Withdrawal Confirmation"}
          body={
            <WithdrawForeignGiftsConfirmationModal
              state={this.state.withdrawForeignGift}
              handleWithdrawConfirmChange={this.handleWithdrawConfirmChange}
              withdrawOptions={this.state.withdrawOptions}
              handleWithdrawalReasonChange={this.handleWithdrawReasonChange}
            />
          }
          id={"withdraw-confirmation"}
          label={"Submit"}
          labelCancel={"Cancel"}
        />
        <PPMSModal
          show={this.state.deleteForeignGift.showDeleteConfirmationModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleDeleteModalClose}
          handleSave={this.handleDeleteModalSubmit}
          title={"Delete Confirmation"}
          body={"Do you want to delete the Foreign Gifts?"}
          id={"delete-confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />
        <PPMSModal
          show={this.state.rejectForeignGift.showRejectConfirmationModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleWithdrawRejectModalClose}
          handleSave={this.handleRejectModalSubmit}
          title={this.state.rejectForeignGift.sourceName + " Confirmation"}
          body={
            <RejectForeignGiftsConfirmationModal
              state={this.state.rejectForeignGift}
              handleRejectConfirmChange={this.handleRejectConfirmChange}
              rejectOptions={this.state.rejectOptions}
              handleRejectReasonChange={this.handleRejectReasonChange}
            />
          }
          id={"reject-confirmation"}
          label={"Submit"}
          labelCancel={"Cancel"}
        />
        <PPMSModal
          body={
            <BarCodePrint
              ref={(el) => (this.componentRef = el)}
              icn={getFormattedICN(this.state.selectedICN)}
            />
          }
          id={"barcode-modal"}
          show={this.state.showBarcodeModal}
          label={"Print"}
          labelCancel={"Cancel"}
          title={`ICN - ${getFormattedICN(this.state.selectedICN)}`}
          handleClose={this.closeBarcodeModal}
          handleSave={() => {}}
        />

        <PPMSModal
          show={this.state.showErrorUploadDOSApprovalModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleErrorModalClose}
          handleSave={this.handleErrorModalDownload}
          title={"Upload File Error"}
          body={"Do you want to download error file ?"}
          id={"error-confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />

        <PPMSModal
          show={this.state.showUploadDOSApprovalModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleSendDoSApprovalModalClose}
          handleSave={this.handleSendDoSApprovalModalSubmit}
          title={"Upload DOS Approval"}
          body={
            <Upload
              fileInfectedStatus={(value) =>
                this.updateUploadDOSApprovalFileStatus(value)
              }
              isUploadCancelled={this.state.isUploadCancelled}
              enableDOSApprovelSubmit={this.enableDOSApprovelSubmit}
              disableDOSApprovelSubmit={this.disableDOSApprovelSubmit}
            />
          }
          id={"upload-dos-approval-confirmation"}
          label={"Submit"}
          labelCancel={"Cancel"}
          disableSave={!this.state.isUploadDOSApprovalEnabled}
          size={"lg"}
        />
        <PrintLablesModal
          show={this.state.printLabels.showMultiplePrintModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handlePrintLablesModalClose}
          handleDownload={this.handlePrintLabelsDownload}
          title={"Labels print and download"}
          body={
            <PrintLabelsContent ICNs={this.state.printLabels.printLabelsICNs} />
          }
          id={"print-lables"}
        />
        <PPMSModal
          show={
            this.state.sendToSaleForeignGift.showSendToSaleConfirmationModal
          }
          centered={true}
          backdrop={"static"}
          handleClose={this.handleSendToSaleModalClose}
          handleSave={this.handleSendToSaleModalSubmit}
          title={"Send to Sale Confirmation"}
          body={"Do you want to send the Foreign Gift to sale?"}
          id={"send-to-sale-confirmation"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </div>
    );
  }
}

const PrintLabelsContent = (props) => {
  const [printLabelsICNs, setPrintLabelsICNs] = useState(props.ICNs);

  let i = 0;
  let j = printLabelsICNs.length;
  let chunks = [];
  let chunkSize = 6;

  while (i < j) {
    chunks.push(printLabelsICNs.slice(i, i + chunkSize));
    i = i + chunkSize;
  }
  let totalChunks = chunks.length;

  useEffect(() => {
    setPrintLabelsICNs(props.ICNs);
  }, [props.ICNs]);

  return (
    <>
      <div className="ui-ppms ui-fix">
        {" "}
        {chunks.map((chunk, chunkIndex) => (
          <div className={"grid-row page-break"}>
            {chunk &&
              chunk.map(
                (ICN, index) =>
                  index < 6 && (
                    <div className={"grid-col-6"} key={ICN.itemControlNumber}>
                      <div className={"grid-row"}>
                        ICN: {ICN.itemControlNumber} Value:{" "}
                        {ICN.fairMarketValue ? " $" + ICN.fairMarketValue : ""}
                      </div>
                      <div className={"grid-row"}>
                        Vault Location: {ICN.vaultLocation} Shelf No:{" "}
                        {ICN.vaultShelfNumber}
                      </div>
                      <div>Item Name: {ICN.itemName}</div>
                      <div className={"grid-row"}>Donor: {ICN.donorInfo}</div>
                      <div className={"grid-row"}>
                        Recipient: {ICN.recipientInfo}
                      </div>
                      <div className={"grid-row"}>
                        Date Received:{" "}
                        {moment(ICN.dateReceivedByRecipient).format(
                          "MM/DD/YYYY"
                        ) !== "Invalid date"
                          ? moment(ICN.dateReceivedByRecipient).format(
                              "MM/DD/YYYY"
                            )
                          : ""}
                        , Admin: {ICN.administration}
                      </div>
                      {chunkIndex === totalChunks - 1 &&
                        (index === 4 || index === 5) && (
                          <div className={"grid-row barcodePrint"}>
                            <BarCodePrint
                              icn={getFormattedICN(ICN.itemControlNumber)}
                            />
                          </div>
                        )}
                      {chunkIndex === totalChunks - 1 &&
                        index !== 4 &&
                        index !== 5 && (
                          <div
                            className={"grid-row barcodePrint"}
                            style={{ marginBottom: 100 }}
                          >
                            <BarCodePrint
                              icn={getFormattedICN(ICN.itemControlNumber)}
                            />
                          </div>
                        )}
                      {chunkIndex !== totalChunks - 1 &&
                        index !== 4 &&
                        index !== 5 && (
                          <div
                            className={"grid-row barcodePrint"}
                            style={{ marginBottom: 100 }}
                          >
                            <BarCodePrint
                              icn={getFormattedICN(ICN.itemControlNumber)}
                            />
                          </div>
                        )}
                      {chunkIndex !== totalChunks - 1 &&
                        (index === 4 || index === 5) && (
                          <div
                            className={"grid-row barcodePrint"}
                            style={{ marginBottom: 100 }}
                          >
                            <BarCodePrint
                              icn={getFormattedICN(ICN.itemControlNumber)}
                            />
                          </div>
                        )}
                    </div>
                  )
              )}
          </div>
        ))}
      </div>
    </>
  );
};

const PrintAcceptanceLettersContent = (props) => {
  const [printAcceptanceLettersICNs, setPrintAcceptanceLettersICNs] = useState(
    props.ICNs
  );

  let i = 0;
  let j = printAcceptanceLettersICNs.length;
  let chunks = [];
  let chunkSize = 3;

  while (i < j) {
    chunks.push(printAcceptanceLettersICNs.slice(i, i + chunkSize));
    i = i + chunkSize;
  }
  let totalChunks = chunks.length;

  useEffect(() => {
    setPrintAcceptanceLettersICNs(props.ICNs);
  }, [props.ICNs]);

  return (
    <>
      <div className="ui-ppms ui-fix">
        {" "}
        {chunks.map((chunk, chunkIndex) => (
          <div className={"grid-row page-break"}>
            {chunk &&
              chunk.map(
                (ICN, index) =>
                  index < 3 && (
                    <div className={"grid-col-6"} key={ICN.itemControlNumber}>
                      <div className={"grid-row"}>
                        ICN: {ICN.itemControlNumber} Value:{" "}
                      </div>
                      <div>Item Name: {ICN.itemName}</div>
                      <div>Item Description: {ICN.itemDescription}</div>
                      <div>Item Quantity: {ICN.itemQuantity}</div>
                      <div>Item Unit Price: {ICN.itemUnitPrice}</div>
                      <div className={"grid-row"}>Donor: {ICN.donorInfo}</div>
                      <div className={"grid-row"}>
                        Recipient: {ICN.recipientInfo}
                      </div>
                      <div className={"grid-row"}>
                        Date Received:{" "}
                        {moment(ICN.dateReceivedByRecipient).format(
                          "MM/DD/YYYY"
                        ) !== "Invalid date"
                          ? moment(ICN.dateReceivedByRecipient).format(
                              "MM/DD/YYYY"
                            )
                          : ""}
                        , Admin: {ICN.administration}
                      </div>
                    </div>
                  )
              )}
          </div>
        ))}
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForeignGiftListPage);
