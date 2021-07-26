import React from "react";
import { MdEdit } from "react-icons/md";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import queryString from "query-string";
import { UserUtils } from "../../../utils/UserUtils";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { formatICN } from "../../../ui-kit/utilities/FormatUtil";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PageHelper, Paths } from "../../Router";
import {
  filterProperty,
  propertyWithdrawalReason,
} from "../create-update-property/constants/Constants";
import { BiBarcodeReader, BiUpload } from "react-icons/bi";
import { BarCodePrint } from "../create-update-property/common/BarcodePrint";
import { getFormattedICN } from "../create-update-property/validations/propertyFieldValidations";
import { CgRemove } from "react-icons/cg";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import { isFormSubmitted } from "../../../service/validation.service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import moment from "moment";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { WithdrawICNConfirmationModal } from "../../manage-users/sales-users/ICNStatusListPage";
import {
  icnAdditionalWithdrawalOptions,
  icnWithdrawalOptions,
} from "../../manage-users/sales-users/constants/Constants";
import { isEmptyCheck } from "../../../ui-kit/components/validations/FieldValidations";
import { Upload } from "../create-update-property/uploads/Upload";

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
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  showProperty?: any;
  showFilterValues?: any;
  defaultFilterValue?: any;

  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  withdrawProperty: {
    showConfirmationModal: boolean;
    showAvailableStatusModal: boolean;
    withdrawingICN: string;
    withdrawConfirmation: string;
    showWithdrawReason: boolean;
    withdrawalReason: string;
    withdrawalReasonCode?: string;
    withdrawalReasonInvalid: boolean;
    withdrawConfirmationInvalid: boolean;
    additionalWithdrawalReason?: string;
    additionalWithdrawalReasonCode?: string;
    withdrawalAdditionalReasonInvalid?: boolean;
    withdrawalAdditionalReasonErrorMessage?: string;
    withdrawalComment?: string;
    withdrawalCommentInvalid?: boolean;
    withdrawalCommentErrorMessage?: string;
    OtherReason: string;
    otherReasonInvalid: boolean;
    showOtherReason: boolean;
    showError: boolean;
    errorMessage: string;
    withDrawQuantity: string;
    availableQuantity: string;
  };
  currentPage: number;
  showBarcodeModal: boolean;
  selectedICN: string;
  withdrawOptions: any[];
  sort: string;
  // options for available status
  icnWithdrawalOptions: any[];
  icnAdditionalWithdrawalOptions: any[];
  showPropertyUploadModal: boolean;
  fileInfectedStatus: boolean;
  itemControlNumber: string;
  dateReportedFrom: string;
  dateReportedTo: string;
  erdDateFrom: string;
  erdDateTo: string;
  srdDateFrom: string;
  srdDateTo: string;
  agencyBureau: string;
  quantity: string;
  status: string;
  advancedSearchText: string;
  propertyListResults?: any;
}

class PropertyListPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    let search = props.location.search;
    let query = queryString.parse(search);
    let showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
    let showPropertyRadio;
    switch (showMyProperty) {
      case "all":
        showPropertyRadio = "Show All";
        break;
      case "myProperty":
        showPropertyRadio = "Show My Property";
        break;
      case "other":
        showPropertyRadio = "Show Others Property";
        break;
      default:
        showPropertyRadio = "Show All";
        break;
    }

    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      showProperty: showMyProperty,
      showFilterValues: filterProperty,
      defaultFilterValue: showPropertyRadio,
      withdrawProperty: {
        showConfirmationModal: false,
        showAvailableStatusModal: false,
        withdrawingICN: "",
        withdrawConfirmation: "",
        showWithdrawReason: false,
        withdrawalReason: "",
        withdrawalReasonCode: "",
        withdrawalReasonInvalid: false,
        withdrawConfirmationInvalid: false,
        OtherReason: "",
        otherReasonInvalid: false,
        showOtherReason: false,
        showError: false,
        errorMessage: "",
        withDrawQuantity: "",
        availableQuantity: "",
      },
      currentPage: 1,
      showBarcodeModal: false,
      showPropertyUploadModal: false,
      fileInfectedStatus: false,
      selectedICN: "",
      withdrawOptions: [
        { value: "Yes", id: "Y", isSelected: false, required: true },
        { value: "No", id: "N", isSelected: false, required: true },
      ],
      //for icn in available status
      icnWithdrawalOptions: icnWithdrawalOptions,
      icnAdditionalWithdrawalOptions: icnAdditionalWithdrawalOptions,
      sort: "itemControlNumber,ASC",

      itemControlNumber: "",
      dateReportedFrom: "",
      dateReportedTo: "",
      erdDateFrom: "",
      erdDateTo: "",
      srdDateFrom: "",
      srdDateTo: "",
      agencyBureau: "",
      quantity: "",
      status: "",
      advancedSearchText: "",
    };
    this.state.showFilterValues.forEach((item) => {
      if (item.value === showPropertyRadio) {
        item["isSelected"] = true;
      } else {
        item["isSelected"] = false;
      }
    });
    this.componentRef = React.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handlePropertyRadioChange = this.handlePropertyRadioChange.bind(this);
    this.handlePropertyWithdraw = this.handlePropertyWithdraw.bind(this);
    this.getPropertiesFromAPI = this.getPropertiesFromAPI.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleWithdrawalChangeForAvailableICN = this.handleWithdrawalChangeForAvailableICN.bind(
      this
    );
    this.handleAdditionalWithdrawalReasonChange = this.handleAdditionalWithdrawalReasonChange.bind(
      this
    );
    this.handleWithDrawModalSubmitForAvailableICN = this.handleWithDrawModalSubmitForAvailableICN.bind(
      this
    );
  }
  private propertyApiService = new PropertyApiService();

  componentRef;
  componentDidMount() {
    window.scrollTo(0, 0);
    let query = queryString.parse(this.props.location.search);
    let showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
    const { perPage } = this.state;
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo()
    ) {
      data.params["showProperty"] = showMyProperty;
    }

    if (
      !(
        UserUtils.isUserApo() ||
        UserUtils.isSystemAdminUser() ||
        UserUtils.getUserInfo().internalAgencyUser
      )
    ) {
      this.columns = this.columns.filter((x) => x.id !== "excessReleaseDate");
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

      let showPropertyRadio;
      switch (showMyProperty) {
        case "all":
          showPropertyRadio = "Show All";
          break;
        case "myProperty":
          showPropertyRadio = "Show My Property";
          break;
        case "other":
          showPropertyRadio = "Show Others Property";
          break;
        default:
          showPropertyRadio = "Show All";
          break;
      }

      this.state.showFilterValues.forEach((item) => {
        if (item.value === showPropertyRadio) {
          item["isSelected"] = true;
        } else {
          item["isSelected"] = false;
        }
      });

      if (!query["showProperty"]) {
        this.setState({
          defaultFilterValue: showPropertyRadio,
        });

        const { perPage } = this.state;
        let param = {
          itemControlNumber: this.state.itemControlNumber,
          dateReportedFrom: this.state.dateReportedFrom,
          dateReportedTo: this.state.dateReportedTo,
          erdDateFrom: this.state.erdDateFrom,
          erdDateTo: this.state.erdDateTo,
          srdDateFrom: this.state.srdDateFrom,
          srdDateTo: this.state.srdDateTo,
          agencyBureau: this.state.agencyBureau,
          quantity: this.state.quantity,
          status: this.state.status,
          isManagePropertySearch: "Y",
          propertySearchTypeAdvanced: "ALL_WORDS",
          advancedSearchText: this.state.advancedSearchText,
          params: {
            page: 1,
            size: perPage,
          },
        };
        if (
          UserUtils.isUserApo() ||
          UserUtils.isSystemAdminUser() ||
          UserUtils.isUserNuo()
        ) {
          param["showProperty"] = showMyProperty;
        }
        this.propertyApiService
          .searchPropertybyCategory(param)
          .then((response) => {
            let filteredRows = [];
            //transform data to match table expectations
            for (let property of response.data.propertySearchResultList) {
              let row = {
                agencyBureau: property.agencyBureau,
                excessReleaseDate: property.excessReleaseDate,
                itemControlNumber: property.itemControlNumber,
                itemName: property.itemName,
                propertyStatus: property.itemStatus,
                quantity: property.quantityAvailable,
                submittedDate: property.submittedDate,
                surplusReleaseDate: property.surplusReleaseDate,
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
              propertyListResults: response.data.propertySearchResultList,
            });
          });
      }
    }
  }

  // third call
  handleChange = async (perPage, page) => {
    let search = this.props.location.search;
    let query = queryString.parse(search);
    let showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
    this.setState({ loading: true });

    let param = {
      itemControlNumber: this.state.itemControlNumber,
      dateReportedFrom: this.state.dateReportedFrom,
      dateReportedTo: this.state.dateReportedTo,
      erdDateFrom: this.state.erdDateFrom,
      erdDateTo: this.state.erdDateTo,
      srdDateFrom: this.state.srdDateFrom,
      srdDateTo: this.state.srdDateTo,
      agencyBureau: this.state.agencyBureau,
      quantity: this.state.quantity,
      status: this.state.status,
      isManagePropertySearch: "Y",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: this.state.advancedSearchText,
      params: {
        page: page,
        size: perPage,
      },
    };
    if (this.state.sort) {
      param.params["sort"] = this.state.sort;
    }
    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo()
    ) {
      param["showProperty"] = showMyProperty;
    }

    this.propertyApiService.searchPropertybyCategory(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.propertySearchResultList) {
        let row = {
          agencyBureau: property.agencyBureau,
          excessReleaseDate: property.excessReleaseDate,
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName,
          propertyStatus: property.itemStatus,
          quantity: property.quantityAvailable,
          submittedDate: property.submittedDate,
          surplusReleaseDate: property.surplusReleaseDate,
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
        propertyListResults: response.data.propertySearchResultList,
      });
    });
  };
  openBarcodeModal = () => {
    this.setState({ showBarcodeModal: true });
  };

  closeBarcodeModal = () => {
    this.setState({ showBarcodeModal: false });
  };

  openPropertyDocUploadModal = () => {
    this.setState({ showPropertyUploadModal: true });
  };

  closePropertyDocUploadModal = () => {
    if (!this.state.fileInfectedStatus) {
      this.setState({ showPropertyUploadModal: false });
    }
  };

  getPropertiesFromAPI = (filters) => {
    let itemControlNumber;
    let itemName;
    let submittedDate;
    let excessReleaseDate;
    let surplusReleaseDate;
    let agencyBureau;
    let quantity;
    let propertyStatus;
    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].id) {
        case "itemControlNumber":
          itemControlNumber = filters[i]["value"];
          break;
        case "itemName":
          itemName = filters[i]["value"];
          break;
        case "submittedDate":
          submittedDate = filters[i]["value"];
          break;
        case "excessReleaseDate":
          excessReleaseDate = filters[i]["value"];
          break;
        case "surplusReleaseDate":
          surplusReleaseDate = filters[i]["value"];
          break;
        case "agencyBureau":
          agencyBureau = filters[i]["value"];
          break;
        case "quantity":
          quantity = filters[i]["value"];
          break;
        case "propertyStatus":
          propertyStatus = filters[i]["value"];
          break;
      }
    }

    let reportFrom;
    let reportTo;
    if (submittedDate) {
      reportFrom = moment(moment(submittedDate).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000"
      );
      reportTo = moment(moment(submittedDate).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT23:59:59.999"
      );
    }
    let srdFrom;
    let srdTo;
    if (surplusReleaseDate) {
      srdFrom = moment(moment(surplusReleaseDate).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000"
      );
      srdTo = moment(moment(surplusReleaseDate).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT23:59:59.999"
      );
    }
    let erdFrom;
    let erdTo;
    if (excessReleaseDate) {
      erdFrom = moment(moment(excessReleaseDate).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000"
      );
      erdTo = moment(moment(excessReleaseDate).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT23:59:59.999"
      );
    }

    //Allow for search input to use dashes and still work
    let ICN = itemControlNumber ? itemControlNumber.replace(/-/g, "") : "";

    let search = this.props.location.search;
    let query = queryString.parse(search);
    let showMyProperty = query["showProperty"] ? query["showProperty"] : "all";

    let param = {
      itemControlNumber: ICN,
      dateReportedFrom: reportFrom,
      dateReportedTo: reportTo,
      erdDateFrom: erdFrom,
      erdDateTo: erdTo,
      srdDateFrom: srdFrom,
      srdDateTo: srdTo,
      agencyBureau: agencyBureau,
      quantity: quantity,
      status: propertyStatus ? propertyStatus.toUpperCase() : "",
      isManagePropertySearch: "Y",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: itemName,
      params: {
        page: 1,
        size: this.state.perPage,
      },
    };

    if (this.state.sort) {
      param.params["sort"] = this.state.sort;
    }

    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo()
    ) {
      param["showProperty"] = showMyProperty;
    }
    this.setState({
      itemControlNumber: ICN,
      dateReportedFrom: reportFrom,
      dateReportedTo: reportTo,
      erdDateFrom: erdFrom,
      erdDateTo: erdTo,
      srdDateFrom: srdFrom,
      srdDateTo: srdTo,
      agencyBureau: agencyBureau,
      quantity: quantity,
      status: propertyStatus ? propertyStatus.toUpperCase() : "",
      advancedSearchText: itemName,
    });
    this.propertyApiService.searchPropertybyCategory(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.propertySearchResultList) {
        let row = {
          agencyBureau: property.agencyBureau,
          excessReleaseDate: property.excessReleaseDate,
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName,
          propertyStatus: property.itemStatus,
          quantity: property.quantityAvailable,
          submittedDate: property.submittedDate,
          surplusReleaseDate: property.surplusReleaseDate,
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
        propertyListResults: response.data.propertySearchResultList,
      });
    });
  };

  loadPropertyListOnPageLoad(data) {
    let param = {
      itemControlNumber: this.state.itemControlNumber,
      dateReportedFrom: this.state.dateReportedFrom,
      dateReportedTo: this.state.dateReportedTo,
      erdDateFrom: this.state.erdDateFrom,
      erdDateTo: this.state.erdDateTo,
      srdDateFrom: this.state.srdDateFrom,
      srdDateTo: this.state.srdDateTo,
      agencyBureau: this.state.agencyBureau,
      quantity: this.state.quantity,
      status: this.state.status,
      isManagePropertySearch: "Y",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: this.state.advancedSearchText,
      params: {
        page: data.params.page,
        size: data.params.size,
      },
    };
    if (this.state.sort) {
      param.params["sort"] = this.state.sort;
    }
    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo()
    ) {
      param["showProperty"] = data.params.showProperty;
    }

    this.propertyApiService.searchPropertybyCategory(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.propertySearchResultList) {
        let row = {
          agencyBureau: property.agencyBureau,
          excessReleaseDate: property.excessReleaseDate,
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName,
          propertyStatus: property.itemStatus,
          quantity: property.quantityAvailable,
          submittedDate: property.submittedDate,
          surplusReleaseDate: property.surplusReleaseDate,
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
        propertyListResults: response.data.propertySearchResultList,
      });
    });
  }

  handleButtonClick(property: any) {
    //TODO handle edit user button click
    console.log("edit" + property);
  }

  columns = [
    {
      Header: "ICN",
      accessor: "itemControlNumber",
      Cell: (props) => (
        <span className="text-wrap">
          <a href={"/viewProperty/" + props.value}>{formatICN(props.value)}</a>
        </span>
      ),
      width: 200,
      filter: "search",
    },
    {
      Header: "Property Name",
      accessor: "itemName",
      filter: "search",
    },
    {
      Header: "Reporting Date",
      accessor: "submittedDate",
      filter: "search",
    },
    {
      id: "excessReleaseDate",
      Header: "Excess Release Date",
      accessor: "excessReleaseDate",
      filter: "search",
    },
    {
      Header: "Surplus Release Date",
      accessor: "surplusReleaseDate",
      filter: "search",
      Cell: (props) => (props.value ? props.value : "N/A"),
    },
    {
      Header: "Agency Bureau",
      accessor: "agencyBureau",
      filter: "search",
    },
    {
      Header: "Available Qty",
      accessor: "quantity",
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "propertyStatus",
      filter: "search",
    },
    {
      Header: "Actions",
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
      Cell: (property) => (
        <>
          <PPMSButton
            variant={"secondary"}
            label={"Edit"}
            size={"sm"}
            className="manage-list-actions"
            icon={<MdEdit />}
            onPress={() => {
              const { addToast } = this.props.actions;
              this.propertyApiService
                .getStatus(
                  this.state?.propertyListResults[property?.row?.id]
                    ?.itemControlNumber
                )
                .then((response: any) => {
                  if (
                    response?.data?.editFlag ||
                    UserUtils.isUserApo() ||
                    UserUtils.isSystemAdminUser()
                  ) {
                    PageHelper.openPage(
                      Paths.editPropertyReport +
                        "/" +
                        property.row.values.itemControlNumber
                    );
                  } else {
                    addToast({
                      text: "Unable to edit property",
                      type: "error",
                      heading: "Error",
                    });
                  }
                })
                .catch((error) => {
                  addToast({
                    text: "Unable to edit property",
                    type: "error",
                    heading: "Error",
                  });
                  console.log(error);
                });
            }}
            id={`edit - ${property.row.values.itemControlNumber}`}
            isDisabled={
              this.editDisabled(
                property.row.values.itemControlNumber,
                property.row.values.propertyStatus,
                this.state?.propertyListResults[property?.row?.id].submittedBy
              ) ||
              (!(UserUtils.isUserApo() || UserUtils.isSystemAdminUser()) &&
                this.state?.propertyListResults &&
                !this.state?.propertyListResults[property?.row?.id]?.statusFlag
                  ?.editFlag) ||
              this.isPocOrCustodian(property)
            }
          />
          <PPMSButton
            variant={"secondary"}
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
            isDisabled={property.row.values.propertyStatus === "WITHDRAWN"}
          />
          {this.isPocOrCustodian(property) && (
            <PPMSButton
              variant={"secondary"}
              label={"Upload"}
              size={"sm"}
              className="manage-list-actions"
              icon={<BiUpload />}
              onPress={() => {
                this.setState({
                  selectedICN: property.row.values.itemControlNumber,
                });
                PageHelper.openPage(
                  Paths.propertyUpload +
                    "/" +
                    property.row.values.itemControlNumber.replaceAll("-", "")
                );
              }}
              id={`property-doc-button - ${property.row.values.itemControlNumber}`}
              isDisabled={false}
            />
          )}
          <PPMSButton
            variant={"secondary"}
            label={"Withdraw"}
            size={"sm"}
            className="manage-list-actions withdraw"
            icon={<CgRemove />}
            isDisabled={
              this.getWithdrawDisable(property) ||
              (!(
                UserUtils.isUserApo() ||
                UserUtils.isSystemAdminUser() ||
                this.isPocOrCustodian(property)
              ) &&
                this.state?.propertyListResults &&
                !this.state?.propertyListResults[property?.row?.id]?.statusFlag
                  ?.editFlag)
            }
            value={property.row.values.itemControlNumber}
            onPress={(event) => {
              const { withdrawProperty } = this.state;
              this.handlePropertyWithdraw(
                event,
                property.row.values.propertyStatus
              );
              withdrawProperty.availableQuantity = property.row.values.quantity;
              this.setState({
                withdrawProperty: withdrawProperty,
              });
            }}
            id={`withdraw - ${property.row.values.itemControlNumber}`}
          />
        </>
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
    let search = this.props.location.search;
    let query = queryString.parse(search);
    let showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
    if (order) sort = sortBy?.id + "," + order;
    this.setState({ loading: true, sort: sort });
    //Preserve search results while sorting
    let param = {
      itemControlNumber: this.state.itemControlNumber,
      dateReportedFrom: this.state.dateReportedFrom,
      dateReportedTo: this.state.dateReportedTo,
      erdDateFrom: this.state.erdDateFrom,
      erdDateTo: this.state.erdDateTo,
      srdDateFrom: this.state.srdDateFrom,
      srdDateTo: this.state.srdDateTo,
      agencyBureau: this.state.agencyBureau,
      quantity: this.state.quantity,
      status: this.state.status,
      isManagePropertySearch: "Y",
      propertySearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: this.state.advancedSearchText,
      params: {
        page: 1,
        size: this.state.perPage,
        sort: sort,
      },
    };
    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo()
    ) {
      param["showProperty"] = showMyProperty;
    }
    this.propertyApiService.searchPropertybyCategory(param).then((response) => {
      let filteredRows = [];
      //transform data to match table expectations
      for (let property of response.data.propertySearchResultList) {
        let row = {
          agencyBureau: property.agencyBureau,
          excessReleaseDate: property.excessReleaseDate,
          itemControlNumber: property.itemControlNumber,
          itemName: property.itemName,
          propertyStatus: property.itemStatus,
          quantity: property.quantityAvailable,
          submittedDate: property.submittedDate,
          surplusReleaseDate: property.surplusReleaseDate,
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
        propertyListResults: response.data.propertySearchResultList,
      });
    });
  };

  getShowPropertyParam(value: any) {
    switch (value) {
      case "Show All":
        return "all";
      case "Show My Property":
        return "myProperty";
      case "Show Others Property":
        return "other";
      default:
        return "all";
    }
  }

  handlePropertyRadioChange(event: any) {
    let startValue = event.target.options[event.target.selectedIndex].id;
    this.setState({
      defaultFilterValue: startValue,
    });

    this.refreshPropertyTableFromFilterChange(startValue);
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
    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo()
    ) {
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

  handlePropertyWithdraw = (event: any, status: string) => {
    const { withdrawProperty } = this.state;
    withdrawProperty.withdrawingICN = event.currentTarget.value;
    if (status === "Available") {
      withdrawProperty.showAvailableStatusModal = true;
    } else {
      withdrawProperty.showConfirmationModal = true;
    }
    this.setState({
      withdrawProperty: withdrawProperty,
    });
  };

  handleModalClose = () => {
    const { withdrawProperty } = this.state;
    withdrawProperty.showConfirmationModal = false;
    withdrawProperty.withdrawalReason = "";
    withdrawProperty.withdrawalComment = "";
    withdrawProperty.withdrawalReasonCode = "";
    withdrawProperty.withdrawingICN = "";
    withdrawProperty.withdrawConfirmation = "";
    withdrawProperty.withdrawalReasonInvalid = false;
    withdrawProperty.withdrawConfirmationInvalid = false;
    withdrawProperty.withDrawQuantity = "";
    withdrawProperty.OtherReason = "";
    withdrawProperty.otherReasonInvalid = false;
    withdrawProperty.errorMessage = "";
    withdrawProperty.showError = false;
    withdrawProperty.showOtherReason = false;
    withdrawProperty.showWithdrawReason = false;
    withdrawProperty.showAvailableStatusModal = false;
    withdrawProperty.additionalWithdrawalReason = "";
    withdrawProperty.additionalWithdrawalReasonCode = "";

    this.setState({
      withdrawProperty: withdrawProperty,
      withdrawOptions: [
        { value: "Yes", id: "Y", isSelected: false, required: true },
        { value: "No", id: "N", isSelected: false, required: true },
      ],
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

  handleModalSubmit = () => {
    isFormSubmitted.next(true);
    const { withdrawProperty } = this.state;
    const { addToast } = this.props.actions;
    let payload = {
      withDrawnQuantity: withdrawProperty.withDrawQuantity
        ? withdrawProperty.withDrawQuantity
        : withdrawProperty.availableQuantity,
      itemControlNumber: withdrawProperty.withdrawingICN,
      withdrawnReason:
        withdrawProperty.withdrawalReason === "Other"
          ? withdrawProperty.OtherReason
          : withdrawProperty.withdrawalReason,
    };
    if (withdrawProperty.showError !== true) {
      this.propertyApiService
        .withdrawProperty(payload)
        .then((response) => {
          if (response.status === 200) {
            let withdrawnICN = withdrawProperty.withdrawingICN;
            this.handleModalClose();
            addToast({
              text:
                "Property with ICN: " +
                withdrawnICN +
                " is successfully withdrawn!",
              type: "success",
              heading: "Success",
            });
            this.setState({ withdrawProperty });
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
            if (
              UserUtils.isUserApo() ||
              UserUtils.isSystemAdminUser() ||
              UserUtils.isUserNuo()
            ) {
              data.params["showProperty"] = showMyProperty;
            }
            this.loadPropertyListOnPageLoad(data);
          } else {
            withdrawProperty.showError = true;
            withdrawProperty.errorMessage =
              "Property Withdrawal failed. Please try again.";
            this.setState({
              withdrawProperty: withdrawProperty,
            });
          }
        })
        .catch((error) => {
          addToast({
            text: error?.data?.debugMessage,
            type: "error",
            heading: "Error",
          });
          withdrawProperty.showConfirmationModal = false;
          this.setState({
            withdrawProperty: withdrawProperty,
          });
        })
        .finally(() => {
          isFormSubmitted.next(false);
        });
    }
  };

  handleWithdrawQuantityOnChange = (e) => {
    const { withdrawProperty } = this.state;
    let validate = this.validateWithdrawQuantity(
      e.target.value,
      withdrawProperty.availableQuantity
    );

    withdrawProperty.withDrawQuantity = e.target.value
      .toString()
      ?.replace(/[^0-9]/g, "");
    withdrawProperty.withDrawQuantity = withdrawProperty.withDrawQuantity?.replace(
      /^[0]+$/,
      ""
    );
    if (validate) {
      withdrawProperty.errorMessage = validate.validationError;
      withdrawProperty.showError = validate.isInvalid;
    }
    this.setState({
      withdrawProperty: withdrawProperty,
    });
  };

  validateWithdrawQuantity = (value, availabe) => {
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (
      !/^\d+$/.test(value) ||
      parseInt(value) < 1 ||
      value.length === 0 ||
      isNaN(value) ||
      value > availabe
    ) {
      if (value.length === 0) {
        validation.isInvalid = true;
        validation.validationError = "Withdraw quantity is Required.";
      } else if (/^[^0-9]+$/.test(value) || isNaN(value)) {
        validation.isInvalid = true;
        validation.validationError =
          "Withdraw quantity can contain only numbers.";
      } else if (/^[0]*$/.test(value)) {
        validation.isInvalid = true;
        validation.validationError =
          "Withdraw quantity must be greater than zero.";
      } else if (value > availabe) {
        validation.isInvalid = true;
        validation.validationError =
          "Quantity selected cannot be greater than available quantity.";
      }
    }
    return validation;
  };

  isPocOrCustodian = (property) => {
    return (
      this.state?.propertyListResults[property?.row?.id].custodianEmail ===
        UserUtils.getUserInfo().emailAddress ||
      (this.state?.propertyListResults[property?.row?.id].pocEmail ===
        UserUtils.getUserInfo().emailAddress &&
        !(
          UserUtils.isUserApo() ||
          UserUtils.isSystemAdminUser() ||
          UserUtils.isUserNuo() ||
          UserUtils.isUserSaspAdmin()
        ) &&
        !(
          this.state?.propertyListResults[property?.row?.id].submittedBy ===
          UserUtils.getUserInfo().emailAddress
        ))
    );
  };

  handleWithdrawalReasonChange = (event) => {
    let value = event.target.options[event.target.selectedIndex].text;
    const { withdrawProperty } = this.state;
    withdrawProperty.withdrawalReason = value;
    withdrawProperty.otherReasonInvalid = false;
    withdrawProperty.OtherReason = "";
    if (value === "- Please select a reason for withdrawal -") {
      withdrawProperty.withdrawalReasonInvalid = true;
    } else {
      withdrawProperty.withdrawalReasonInvalid = false;
    }
    if (value === "Other") {
      withdrawProperty.showOtherReason = true;
    } else {
      withdrawProperty.showOtherReason = false;
    }
    this.setState({
      withdrawProperty: withdrawProperty,
    });
  };

  handleOtherReasonChange = (event) => {
    let value = event.currentTarget.value;
    const { withdrawProperty } = this.state;
    withdrawProperty.OtherReason = value;
    if (value.trim() !== "") {
      withdrawProperty.otherReasonInvalid = false;
    } else {
      withdrawProperty.otherReasonInvalid = true;
    }
    this.setState({
      withdrawProperty: withdrawProperty,
    });
  };

  editDisabled = (icn: string, propertyStatus: string, submittedBy: string) => {
    const userEmail = UserUtils.getUserInfo();
    const userAACs = UserUtils.getUserAACs();

    if (propertyStatus === "WITHDRAWN") {
      return true;
    } else if (
      //If Property is internal screening and user is not SM/APO/NUO Edit is disabled
      propertyStatus === "INTERNAL SCREENING" &&
      submittedBy !== userEmail.emailAddress &&
      !(
        UserUtils.isUserApo() ||
        UserUtils.isSystemAdminUser() ||
        UserUtils.isUserNuo()
      )
    ) {
      return true;
    } else if (
      propertyStatus === "EXCESS SCREENING" &&
      submittedBy === "SYSTEM"
    ) {
      userAACs.forEach((aac) => {
        if (aac === icn.substring(0, 6)) return false;
      });
    } else if (
      //If Property is excess screening and user is not SM/APO/NUO Edit is disabled
      propertyStatus === "EXCESS SCREENING" &&
      submittedBy !== userEmail.emailAddress &&
      !(UserUtils.isUserApo() || UserUtils.isSystemAdminUser())
    ) {
      return true;
    } else if (
      //If Property is excess screening or Awaiting GSA Sale and user is not SM/APO Edit is disabled
      propertyStatus === "AWAITING GSA SALE" &&
      !(UserUtils.isUserApo() || UserUtils.isSystemAdminUser())
    ) {
      return true;
    } else {
      return false;
    }
  };

  getWithdrawDisable = (property) => {
    if (this.isPocOrCustodian(property)) {
      return this.getPocWithdrawDisable(property);
    } else if (
      UserUtils.getUserPermissions().includes("RP") ||
      UserUtils.getUserPermissions().includes("SA")
    ) {
      return this.getRpOrSaWithdrawDisable(property);
    } else if (UserUtils.isUserNuo()) {
      return this.getNUOWithdrawDisable(property);
    } else if (UserUtils.isUserApo() || UserUtils.isSystemAdminUser()) {
      return this.getAPOOrSMWithdrawDisable(property);
    } else {
      return true;
    }
  };

  isPastSRD = (surplusReleaseDate) => {
    return (
      new Date(surplusReleaseDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0)
    );
  };

  propertyRequested = (property) => {
    return (
      this.state?.propertyListResults[property?.row?.id]?.statusFlag.requests
        ?.length !== 0
    );
  };

  getPocWithdrawDisable = (property) => {
    if (
      property?.row.values.propertyStatus.toLowerCase() ===
      "WITHDRAWN".toLowerCase()
    ) {
      return true;
    } else if (property?.row.values.propertyStatus === "Available") {
      return false;
    } else if (this.propertyRequested(property)) {
      return true;
    } else if (this.isPastSRD(property.row.values.surplusReleaseDate)) {
      return true;
    } else {
      return false;
    }
  };

  getRpOrSaWithdrawDisable = (property) => {
    if (
      property?.row.values.propertyStatus.toLowerCase() ===
      "DRAFT".toLowerCase()
    ) {
      return false;
    } else if (property?.row.values.propertyStatus === "Available") {
      return false;
    } else if (this.isPastSRD(property.row.values.surplusReleaseDate)) {
      return true;
    } else {
      return true;
    }
  };

  getAPOOrSMWithdrawDisable = (property) => {
    if (
      property?.row.values.propertyStatus.toLowerCase() ===
      "WITHDRAWN".toLowerCase()
    ) {
      return true;
    } else if (property?.row.values.propertyStatus === "Available") {
      return false;
    } else if (this.isPastSRD(property.row.values.surplusReleaseDate)) {
      return true;
    } else {
      return false;
    }
  };

  getNUOWithdrawDisable = (property) => {
    let erd = new Date(property.row.values.excessReleaseDate);
    let currentDate = new Date();
    erd.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (
      property?.row.values.propertyStatus.toLowerCase() ===
      "WITHDRAWN".toLowerCase()
    ) {
      return true;
    } else if (property?.row.values.propertyStatus === "Available") {
      return false;
    } else if (this.isPastSRD(property.row.values.surplusReleaseDate)) {
      return true;
    } else {
      return erd < currentDate;
    }
  };

  handleWithdrawalCommentChange = (event) => {
    let value = event.currentTarget.value;
    this.validateWithdrawComment(value, "");
  };

  handleAdditionalWithdrawalReasonChange(values: any) {
    let selectedValue = values.find((item) => item.isSelected === true);
    if (selectedValue) {
      this.validateWithdrawalAdditionalReason(
        selectedValue.value,
        selectedValue.id
      );
    }
  }

  validateWithdrawComment = (value: string, code: string) => {
    let withdrawalReasonCode = ["INA", "DUPLICATE", "AGENCY_USE", "FBR", "MRD"];
    const { withdrawProperty } = this.state;
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
    withdrawProperty.withdrawalComment = value;
    withdrawProperty.withdrawalCommentInvalid = validation.isInvalid;
    withdrawProperty.withdrawalCommentErrorMessage = validation.validationError;
    this.setState({
      withdrawProperty,
    });
    return validation;
  };

  validateWithdrawReason = (value: string, code: string) => {
    const { withdrawProperty } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Withdrawal Reason is required";
    }
    if (!isEmptyCheck(value)) {
      withdrawProperty.withdrawalReason = value;
      withdrawProperty.withdrawalReasonCode = code;
    }
    withdrawProperty.withdrawalReasonInvalid = validation.isInvalid;
    withdrawProperty.errorMessage = validation.validationError;
    this.setState({
      withdrawProperty,
    });
    return validation;
  };

  validateWithdrawalAdditionalReason = (value: string, code: string) => {
    const { withdrawProperty } = this.state;
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Additional Withdrawal Reason is required";
    } else {
      withdrawProperty.additionalWithdrawalReason = value;
      withdrawProperty.additionalWithdrawalReasonCode = code;
    }
    withdrawProperty.withdrawalAdditionalReasonInvalid = validation.isInvalid;
    withdrawProperty.withdrawalAdditionalReasonErrorMessage =
      validation.validationError;
    this.setState({
      withdrawProperty,
    });
    return validation;
  };

  handleWithdrawalChangeForAvailableICN({ selectedIndex }) {
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

  handleWithDrawModalSubmitForAvailableICN = async () => {
    isFormSubmitted.next(true);
    const { withdrawProperty } = this.state;
    const { addToast } = this.props.actions;
    this.validateWithdrawReason(
      withdrawProperty.withdrawalReason,
      withdrawProperty.withdrawalReasonCode
    );
    if (withdrawProperty.withdrawalReasonCode === "NSS") {
      this.validateWithdrawalAdditionalReason(
        withdrawProperty.additionalWithdrawalReason,
        withdrawProperty.additionalWithdrawalReasonCode
      );
      if (
        withdrawProperty.withdrawalReasonInvalid ||
        withdrawProperty.withdrawalAdditionalReasonInvalid
      )
        return;
    }
    if (!withdrawProperty.withdrawalReasonInvalid) {
      if (withdrawProperty.withdrawalReasonCode) {
        this.validateWithdrawComment(
          withdrawProperty.withdrawalComment,
          withdrawProperty.withdrawalReasonCode
        );
      }
    }

    if (
      withdrawProperty.withdrawalReasonInvalid ||
      withdrawProperty.withdrawalCommentInvalid
    )
      return;

    if (withdrawProperty.withdrawingICN.length !== 0) {
      let payload = {
        itemControlNumber: withdrawProperty.withdrawingICN,
        withdrawnReason:
          withdrawProperty.withdrawalReasonCode === "NSS"
            ? withdrawProperty.withdrawalReason.concat(
                withdrawProperty.additionalWithdrawalReason
                  ? " due to  " + withdrawProperty.additionalWithdrawalReason
                  : ""
              )
            : withdrawProperty.withdrawalReason,
        withdrawnComment: withdrawProperty.withdrawalComment,
        withDrawnQuantity: parseInt(withdrawProperty.availableQuantity),
        withdrawnSource: "SalesICNAvailability",
      };
      try {
        let withdrawPropertyResponse = await this.propertyApiService.withdrawSalesProperty(
          payload
        );
        if (withdrawPropertyResponse.status === 200) {
          let withdrawnICN = withdrawProperty.withdrawingICN;
          this.handleModalClose();
          addToast({
            text: `Property with ICN: ${formatICN(
              withdrawnICN
            )} is successfully withdrawn!`,
            type: "success",
            heading: "Success",
          });

          this.reload(withdrawProperty);
        } else {
          addToast({
            text: "Property withdrawal failed. Please try again.",
            type: "error",
            heading: "Error",
          });
          withdrawProperty.showAvailableStatusModal = false;
          // this.setState({withdrawICNState,});
        }
        this.setState({ withdrawProperty });
      } catch (error) {
        addToast({
          text: "Property withdrawal failed. Please try again.",
          type: "error",
          heading: "Error",
        });

        withdrawProperty.showAvailableStatusModal = false;
        this.setState({
          withdrawProperty,
        });
        this.handleModalClose();
      } finally {
        isFormSubmitted.next(false);
      }
    }
  };

  private reload(withdrawProperty) {
    this.setState({ withdrawProperty });
    let search = this.props.location.search;
    let query = queryString.parse(search);
    let showMyProperty = query["showProperty"] ? query["showProperty"] : "all";
    const { perPage } = this.state;
    const data = {
      params: {
        page: this.state.currentPage,
        size: perPage,
      },
    };
    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo()
    ) {
      data.params["showProperty"] = showMyProperty;
    }
    this.loadPropertyListOnPageLoad(data);
  }

  render() {
    let dataTable;
    if (
      UserUtils.isUserApo() ||
      UserUtils.isSystemAdminUser() ||
      UserUtils.isUserNuo() ||
      UserUtils.isUserSaspAdmin()
    ) {
      dataTable = (
        <div className="ui-ppms">
          <PPMSDatatable
            title={"Manage Property"}
            data={this.state.filteredItems}
            columns={this.columns}
            defaultSortField={"itemControlNumber"}
            loading={this.state.loading}
            serverSort={true}
            handleSort={(sortBy) => this.handleSort(sortBy)}
            rowsPerPageOptions={this.state.rowsPerPageOptions}
            totalRows={this.state.totalRows}
            totalPages={this.state.totalPages}
            rowsPerPage={this.state.perPage}
            isPaginationEnabled={true}
            onChange={this.handleChange}
            showFilters={true}
            currentPage={this.state.currentPage - 1}
            subHeaderComponent={
              <div className={"grid-row"}>
                <div className={"grid-col-12"}>
                  <div className="ui-ppms filter-bkgd">
                    <PPMSSelect
                      id={"filter-by-property"}
                      selectName={"filterProperty"}
                      values={this.state.showFilterValues}
                      selectedValue={this.state.defaultFilterValue}
                      onChange={this.handlePropertyRadioChange}
                      isValid={false}
                      isInvalid={false}
                      validationMessage={""}
                      identifierKey={"id"}
                      identifierValue={"value"}
                      label={"Filter by Ownership:"}
                      isRequired={false}
                      selectClass={"inventory"}
                    />
                  </div>
                </div>
                <div className={"grid-col"}>
                  <div className="btn-create">
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
              </div>
            }
          />
        </div>
      );
    } else {
      dataTable = (
        <div className="ui-ppms">
          <PPMSDatatable
            title={"Manage Property"}
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
                  <div className="btn-create-other-users">
                    {UserUtils.hasPermission("RP") && (
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
                    )}
                  </div>
                </div>
              </div>
            }
          />
        </div>
      );
    }

    return (
      <div>
        {dataTable}
        <PPMSModal
          show={this.state.withdrawProperty.showConfirmationModal}
          size={"lg"}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleModalClose}
          handleSave={this.handleModalSubmit}
          title={"Withdrawal Confirmation"}
          body={
            <ModelContent
              state={this.state.withdrawProperty}
              handleWithdrawQuantityOnChange={
                this.handleWithdrawQuantityOnChange
              }
              availableQuantity={this.state.withdrawProperty?.availableQuantity}
              withDrawQuantity={this.state.withdrawProperty?.withDrawQuantity}
              quantityErrorMessage={this.state.withdrawProperty?.errorMessage}
              quantityShowError={this.state.withdrawProperty?.showError}
              handleWithdrawalReasonChange={this.handleWithdrawalReasonChange}
              handleOtherReasonChange={this.handleOtherReasonChange}
            />
          }
          id={"withdraw-confirmation"}
        />
        <PPMSModal
          show={this.state.withdrawProperty.showAvailableStatusModal}
          centered={true}
          backdrop={"static"}
          handleClose={this.handleModalClose}
          handleSave={this.handleWithDrawModalSubmitForAvailableICN}
          title={"Withdrawal Confirmation"}
          body={
            <WithdrawICNConfirmationModal
              state={this.state.withdrawProperty}
              icnWithdrawalOptions={this.state.icnWithdrawalOptions}
              icnAdditionalWithdrawalOptions={
                this.state.icnAdditionalWithdrawalOptions
              }
              handleWithdrawalReasonChange={
                this.handleWithdrawalChangeForAvailableICN
              }
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
          show={this.state.showPropertyUploadModal}
          centered={true}
          size={"lg"}
          backdrop={"static"}
          handleClose={this.closePropertyDocUploadModal}
          handleSave={this.closePropertyDocUploadModal}
          title={"Property Image and Document Upload"}
          body={
            <Upload
              icn={this.state.selectedICN}
              fileInfectedStatus={(value: boolean) => {
                this.setState({
                  fileInfectedStatus: value,
                });
              }}
            />
          }
          id={"property-doc-upload"}
          customLabel={"Done"}
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
      </div>
    );
  }
}

const ModelContent = ({
  state,
  handleWithdrawQuantityOnChange,
  quantityErrorMessage,
  quantityShowError,
  handleWithdrawalReasonChange,
  handleOtherReasonChange,
  withDrawQuantity,
  availableQuantity,
}) => {
  return (
    <div className={"withdraw-property-confirmation"}>
      <div className={"grid-row grid-gap"}>
        <div className={"grid-col-6"}>
          <PPMSSelect
            placeholderValue={"Please select a reason for withdrawal"}
            selectName={"withdrawReason"}
            label={"Withdrawal Reason"}
            values={propertyWithdrawalReason}
            isRequired={false}
            onChange={handleWithdrawalReasonChange}
            identifierValue={"value"}
            identifierKey={"value"}
            isInvalid={state.withdrawalReasonInvalid}
            isValid={false}
            selectedValue={state.withdrawalReason}
            validationMessage={"Please select a reason for withdrawal."}
          />
        </div>
        <div className="grid-col-4">
          <PPMSInput
            isDisabled={false}
            label={"Withdrawal Quantity"}
            id={"withdraw-quantity-id"}
            inputType={"text"}
            isInvalid={quantityShowError}
            isValid={false}
            isRequired={true}
            onChange={handleWithdrawQuantityOnChange}
            validationMessage={quantityErrorMessage}
            defaultValue={
              withDrawQuantity ? withDrawQuantity : availableQuantity
            }
          />
        </div>
      </div>
      {state.showOtherReason && (
        <div className={"grid-row"}>
          <div className={"grid-col"}>
            <PPMSTextArea
              id={"withdrawalOtherReason"}
              name={"withdrawalOtherReason"}
              label={"Other Reason"}
              isRequired={false}
              isDisabled={false}
              inputType={"text"}
              value={state.OtherReason}
              onChange={handleOtherReasonChange}
              validationMessage={"Please enter the reason"}
              isInvalid={state.otherReasonInvalid}
              isValid={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PropertyListPage);
