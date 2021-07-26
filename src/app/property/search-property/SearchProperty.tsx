import React from "react";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {connect} from "react-redux";
import {cartActions} from "../../../_redux/_actions/cart.actions";
import PropertySearchList from "./PropertyList";
import {PPMSAlert} from "../../../ui-kit/components/common/PPMS-alert";
import {ToggleCategory} from "./ToggleCategory";
import {PropertyApiService} from "../../../api-kit/property/property-api-service";
import {CommonApiService} from "../../../api-kit/common/common-api.service";
import {AdvancedSearchProperty} from "./AdvancedSearchProperty";
import {history} from "../../../_redux/_helpers/history";
import {
  advancedSearchValues,
  condition,
  externalNUExcessOptions,
  internalExcessAndFGOptions,
  internalExcessOptions,
  onlyForeignGiftInternalExcessOptions,
  onlyForeignGiftOptions,
  regexForTCNandICN,
  yesOrNoOptions,
} from "../create-update-property/constants/Constants";
import {validateAAC, validateItemControlNumberWithMinSix,} from "./validations/AdvanceSearchFieldValidations";
import {UserUtils} from "../../../utils/UserUtils";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import moment from "moment";
import {PPMSToggleRadio} from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import {Paths} from "../../Router";
import {PPMSSelect} from "../../../ui-kit/components/common/select/PPMS-select";
import {PPMSInput} from "../../../ui-kit/components/common/input/PPMS-input";
import {AdvancedSearchForeignGift} from "../../foreign-gift/search-foreign-gift/AdvancedSearchForeignGift";

interface Props {
  getCartItems?: any;
  addToCart?: any;
  updateSearchCriteria?: any;
  cart?: any;
  location: any;
  router?: any;
}

interface State {
  currentPage: number;
  totalRows: number;
  togglearray: any;
  valueSearchArray: any;
  searchType: {
    type: string;
  };
  isSearchTypeUpdated: boolean;
  advancedSearchText: string;
  itemControlNumber: string;
  icnIsInvalid: boolean;
  icnIsValid: boolean;
  icnValidationMessage: string;
  aacId: string;
  aacIsInvalid: boolean;
  aacIsValid: boolean;
  aacValidationMessage: string;
  propertySearchTypeAdvanced: string;
  conditionCodeList: any[];
  niinCode: string;
  fscCodes: any[];
  fscCodeList: any[];
  fcsSelectedValues: any[];
  error: string;
  categories: any[];
  agencyBureaus: any[];
  states: any[];
  selectedStateList: any[];
  selectedStateValues: any[];
  rowsPerPage: number;
  categoryCodes: any[];
  items: any[];
  itemCount: 0;
  selectedCategories: string[];
  selectedCategoryCodes: [];
  selectedAgencyBureaus: any[];
  transferControlNumber: string;
  tcnIsInvalid: boolean;
  tcnIsValid: boolean;
  tcnValidationMessage: string;
  reimbursementRequired: string;
  cart: any;
  totalCartItems: 0;
  propertyTypeIsInvalid: boolean;
  propertyTypeIsValid: boolean;
  propertyTypeValidationMessage: string;
  selectedPropertyType: any;
  agencyBureauIsInvalid: boolean;
  agencyBureauIsValid: boolean;
  agencyBureauValidationMessage: string;
  showModal: boolean;
  modalMessage: string;
  internalExcessType?: any;
  internalExcessTypeOptions?: any;
  advancedCondition?: any;
  yesNoRadioOptions?: any;
  reportedDateType: any;
  dateReportedFrom: any;
  dateReportedTo: any;
  surplusDateType: any;
  srdDateFrom: any;
  srdDateTo: any;
  excessDateType: any;
  erdDateFrom: any;
  erdDateTo: any;
  historyPropertyTypeValue: any;

  //Foreign Gifts
  donorCountryList?: any[];
  donorCountrySelected?: any;
  administrationSelected?: any;
  vaultLocationSelected?: any;
  recipientName?: any;
  donorName?: any;
  fiscalYear?: any;
  adminList?: any[];
  administrationAdvanced?: any;
  searchTitle: any;

  administrationSearch?: any;

  clearAllAPIFunc?: Function;
}

class SearchProperty extends React.Component<Props, State> {
  query = this.props?.router?.location?.query;

  constructor(props: any) {
    super(props);
    this.state = {
      cart: this.props.cart,
      totalCartItems: 0,
      totalRows: 0,
      rowsPerPage: 50,
      items: [],
      itemCount: 0,
      currentPage: 1,
      togglearray: {},
      valueSearchArray: [],
      searchType: { type: "" },
      advancedSearchText: this.query["keyword"] ? this.query["keyword"] : "",
      itemControlNumber: "",
      icnIsInvalid: false,
      icnIsValid: false,
      icnValidationMessage: "",
      aacId: this.query["aacId"] ? this.query["aacId"] : "",
      aacIsInvalid: false,
      aacIsValid: false,
      aacValidationMessage: "",
      propertySearchTypeAdvanced: "ALL_WORDS",
      conditionCodeList: [],
      niinCode: this.query["niin"] ? this.query["niin"] : "",
      fscCodes: [],
      fscCodeList: [],
      fcsSelectedValues: [],
      isSearchTypeUpdated: false,
      error: "",
      categories: [],
      agencyBureaus: [],
      states: [],
      selectedStateList: [],
      selectedStateValues: [],
      categoryCodes: [],
      selectedCategories: [],
      selectedCategoryCodes: [],
      selectedAgencyBureaus: [],
      transferControlNumber: "",
      tcnIsInvalid: false,
      tcnIsValid: false,
      tcnValidationMessage: "",
      reimbursementRequired: "",
      propertyTypeIsInvalid: false,
      propertyTypeIsValid: false,
      propertyTypeValidationMessage: "",
      selectedPropertyType: "",
      agencyBureauIsInvalid: false,
      agencyBureauIsValid: false,
      agencyBureauValidationMessage: "",
      showModal: false,
      modalMessage: "",
      internalExcessType: this.setInternalExcessType(),
      internalExcessTypeOptions: this.setExcessOptions(),
      advancedCondition: condition,
      yesNoRadioOptions: yesOrNoOptions,
      reportedDateType: "",
      dateReportedFrom: "",
      dateReportedTo: "",
      surplusDateType: "",
      srdDateFrom: "",
      srdDateTo: "",
      excessDateType: "",
      erdDateFrom: "",
      erdDateTo: "",
      historyPropertyTypeValue: "all-history",

      //===============Foreign Gifts=========
      donorCountryList: [],
      donorCountrySelected: "",
      administrationSelected: "",
      vaultLocationSelected: "",
      recipientName: "",
      donorName: "",
      fiscalYear: "",
      adminList: [],
      administrationAdvanced: "",
      searchTitle: "Search Property",
      administrationSearch: "",
    };
    this.setStateForQueryParams();
    this.onChange = this.onChange.bind(this);
    this.handleMainSearch = this.handleMainSearch.bind(this);
    this.getData = this.getData.bind(this);
    this.handlePropertyListPageChange = this.handlePropertyListPageChange.bind(
      this
    );
    this.handleCheckboxToggleChange = this.handleCheckboxToggleChange.bind(
      this
    );
    this.handleAdvancedClearBtnClick = this.handleAdvancedClearBtnClick.bind(
      this
    );
  }
  private setExcessOptions() {
    let internalExcessTypeOptions: any;
    if (this.showInternalExcessAndFGRadio()) {
      internalExcessTypeOptions = internalExcessAndFGOptions;
    } else if (this.showOnlyExcessAndFGRadio()) {
      internalExcessTypeOptions = onlyForeignGiftInternalExcessOptions;
    } else if (this.showOnlyFGRadio()) {
      internalExcessTypeOptions = onlyForeignGiftOptions;
    } else if (this.showOnlyExternalNUOExcessOptions()) {
      internalExcessTypeOptions = externalNUExcessOptions;
    } else {
      internalExcessTypeOptions = internalExcessOptions;
    }
    return internalExcessTypeOptions;
  }
  private setInternalExcessType() {
    let internalExcessType = "";
    if (this.showInternalExcessAndFGRadio()) {
      internalExcessType = "all"
    } else if (
      this.showOnlyExcessAndFGRadio() ||
      this.showOnlyExternalNUOExcessOptions()
    ) {
      internalExcessType = "excess";
    } else if (this.showOnlyFGRadio()) {
      internalExcessType = "foreignGifts";
    } else {
      internalExcessType = "all";
    }

    return internalExcessType;
  }
  private showOnlyFGRadio() {
    return (
      UserUtils.getUserPermissions().toString().includes("FG") &&
      !UserUtils.getUserPermissions().toString().includes("SM") &&
      !UserUtils.getUserPermissions().toString().includes("AC")
    );
  }

  private showInternalExcessAndFGRadio() {
    return ((UserUtils.getUserPermissions().toString().includes("SP") ||
      UserUtils.getUserPermissions().toString().includes("FF")
    ) &&
      (UserUtils.getUserPermissions().toString().includes("IS") ||
        UserUtils.getUserPermissions().toString().includes("IF")));
  }

  private showOnlyExcessAndFGRadio() {
    return (
      UserUtils.getUserPermissions().toString().includes("SA") ||
      UserUtils.getUserPermissions().toString().includes("SP")
    );
  }
  private showOnlyExternalNUOExcessOptions() {
    return (
      UserUtils.getUserPermissions().toString().includes("NU") &&
      !UserUtils.getUserInfo().internalAgencyUser
    );
  }
  static getDerivedStateFromProps(props, state) {
    if (props.cart !== state.cart) {
      return { ...props, error: props.cart.error };
    }
  }

  private propertyApiService = new PropertyApiService();
  private commonApiService = new CommonApiService();

  componentDidMount() {
    this.populateSearchCriteria();
    //this.getData([], 1, 10) ;
    this.props.getCartItems();
    this.commonApiService.getFSCCodes().then((response) => {
      this.setState({ fscCodes: response.data });
      let fscCodes =
        this.query["fsc"]?.toString()?.trim()?.length !== 0
          ? this.query["fsc"]?.toString().split(",")
          : null;
      //populate fsc from query params
      if (fscCodes) {
        let filteredFscCode = response.data.filter((item) =>
          fscCodes.includes(item.code)
        );
        this.setState({
          fcsSelectedValues: filteredFscCode,
          fscCodeList: fscCodes,
        });
      }
    });
    this.commonApiService
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

        //pre-populate agency bureau using query params
        let agencyBureau = this.query["agency"]?.toString();
        if (agencyBureau) {
          let filteredAgency = agencyBureao.filter(
            (item) => item.id === agencyBureau
          );
          this.setState({
            selectedAgencyBureaus: filteredAgency,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.commonApiService
      .getStateList()
      .then((resp) => {
        let individualState = resp.data.map((item) => {
          return {
            value: item.stateCode,
            states: item.stateName,
            id: item.stateCode,
            isSelected: false,
          };
        });
        let states =
          this.query["states"]?.toString()?.trim()?.length !== 0
            ? this.query["states"]?.toString().split(",")
            : null;

        //populate state from query params
        if (states) {
          let stateList = individualState.filter((item) =>
            states.includes(item.value)
          );
          this.setState({
            selectedStateValues: stateList,
            selectedStateList: states,
          });
        }

        this.setState({
          states: individualState,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    this.commonApiService
      .getCountryList()
      .then((response) => {
        let donorCountryList = response.data.map((country) => {
          return {
            id: country.countryCode,
            value: country.countryName,
            isSelected: false,
          };
        });
        this.setState({
          donorCountryList: donorCountryList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    this.commonApiService
      .getAllPresidents()
      .then((response) => {
        let adminList = response.data.map((admin) => {
          return {
            id: admin.presidentCode,
            value: admin.presidentName,
            isSelected: false,
          };
        });
        this.setState({
          adminList: adminList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    let internalExsOptionsCleared = this.state.internalExcessTypeOptions;
    internalExsOptionsCleared.forEach((option) => {
      option.isSelected = option.id === "all";
    });
    this.setState({
      internalExcessType: "all",
      internalExcessTypeOptions: internalExsOptionsCleared,
    });
  }

  populateSearchCriteria = () => {
    let searchtype = this.query["searchType"]?.toString();

    if (searchtype) {
      let searchTypeId = advancedSearchValues.filter(
        (value) => value.caps === searchtype
      );
      this.setState({
        propertySearchTypeAdvanced: searchTypeId[0]?.caps,
      });
    }
    let internalType = this.query["internalExcessType"]?.toString();
    if (this.showOnlyFGRadio()) {
      internalType = "foreignGifts";
      this.setState({ clearAllAPIFunc: this.getAllForeignGiftsFromAPI });
    } else {
      this.setState({ clearAllAPIFunc: this.getAllPropertiesFromAPI });
    }
    if (internalType) {
      this.state.internalExcessTypeOptions.forEach((item) => {
        item.isSelected = item.id === internalType;
      });
    }
    this.setState({
      internalExcessType: internalType,
    });
    let icnValue = this.query["icn"]?.toString();
    if (icnValue) {
      let icnVal = icnValue.replace(regexForTCNandICN, "");
      if (icnVal.length === 14) {
        let formattedicnValue =
          icnVal.substring(0, 6) +
          "-" +
          icnVal.substring(6, 10) +
          "-" +
          icnVal.substring(10, 14);
        this.setState({
          itemControlNumber: formattedicnValue,
        });
      } else if (icnVal.length === 15) {
        let formattedicnValue =
          icnVal.substring(0, 6) +
          "-" +
          icnVal.substring(6, 10) +
          "-" +
          icnVal.substring(10, 14) +
          "-" +
          icnVal.substring(14, 15);
        this.setState({
          itemControlNumber: formattedicnValue,
        });
      }
    }

    let tcnValue = this.query["tcn"]?.toString();
    if (tcnValue) {
      let tcnVal = tcnValue.replace(regexForTCNandICN, "");
      let formattedtcnValue;
      if (tcnVal.length === 3 || tcnVal.length === 4) {
        formattedtcnValue =
          tcnVal.substring(0, 2) + "-" + tcnVal.substring(2, 4);
        this.setState({
          transferControlNumber: formattedtcnValue,
        });
      } else if (tcnVal.length >= 5) {
        formattedtcnValue =
          tcnVal.substring(0, 2) +
          "-" +
          tcnVal.substring(2, 4) +
          "-" +
          tcnVal.substring(4, 10);
        this.setState({
          transferControlNumber: formattedtcnValue,
        });
      }
    }
    if (
      this.state.internalExcessType === "foreignGifts" ||
      this.showOnlyExcessAndFGRadio() ||
      this.showOnlyFGRadio()
    )
      this.populateForeignGiftSearchCriteria();
    else {
      this.populatePropertySearchCriteria();
    }
  };

  onChange(selectedCategories) {
    this.setState({ selectedCategories: selectedCategories });
  }

  setStateForQueryParams = () => {
    let params = {};
    let query = this.props?.router?.location?.query;

    params["categoryCodeList"] = query["categories"]
      ? query["categories"].split(",").map(Number)
      : [];
    params["propertySearchTypeAdvanced"] = query["searchType"]
      ? query["searchType"]
      : this.state.propertySearchTypeAdvanced;
    params["itemControlNumber"] = query["icn"]
      ? query["icn"]
      : this.state.itemControlNumber;

    params["propertyType"] = query["propertyType"] ? query["propertyType"] : "";
    params["advancedSearchText"] = query["keyword"] ? query["keyword"] : "";

    params["internalExcessType"] = query["internalExcessType"]
      ? query["internalExcessType"]
      : this.state.internalExcessType;
    if (params["internalExcessType"] === "foreignGifts") {
      params["administration"] = query["administration"]
        ? query["administration"]
        : "";
      params["fiscalYear"] = query["fiscalYear"] ? query["fiscalYear"] : "";
      params["recipientName"] = query["recipientName"]
        ? query["recipientName"]
        : "";
      params["donorName"] = query["donorName"] ? query["donorName"] : "";
      params["countryCode"] = query["countryCode"] ? query["countryCode"] : "";
      params["vaultLocation"] = query["vaultLocation"]
        ? query["vaultLocation"]
        : "";
    } else {
      params["aacId"] = query["aacId"] ? query["aacId"] : this.state.aacId;
      params["agencyBureau"] = query["agency"] ? query["agency"] : "";
      params["conditionCodeList"] = query["condition"]
        ? query["condition"].split(",")
        : [];
      params["transferControlNumber"] = query["tcn"] ? query["tcn"] : "";
      params["states"] = query["states"] ? query["states"].split(",") : [];
      params["reimbursementRequired"] = query["reimbursement"]
        ? query["reimbursement"]
        : "";
      params["niinCode"] = query["niin"] ? query["niin"] : "";
      params["fscCodeList"] = query["fsc"] ? query["fsc"].split(",") : [];

      if (query["dateReported"]) {
        if (query["dateReported"] === "custom") {
          let dateReportedFrom =
            this.query["dateReportedFrom"] !== "" &&
              this.query["dateReportedFrom"] !== "null" // query string has it has as string null
              ? new Date(decodeURIComponent(this.query["dateReportedFrom"])) // to removed encoded chars
              : "";
          let dateReportedTo =
            this.query["dateReportedTo"] !== "" &&
              this.query["dateReportedTo"] !== "null"
              ? new Date(decodeURIComponent(this.query["dateReportedTo"]))
              : "";
          this.setState({
            reportedDateType: query["dateReported"],
            dateReportedFrom: dateReportedFrom,
            dateReportedTo: dateReportedTo,
          });
          params["dateReportedFrom"] = dateReportedFrom;
          params["dateReportedTo"] = dateReportedTo;
        } else {
          let reportedDate = this.calculateDateReportedToFrom(
            query["dateReported"]
          );
          this.setState({
            reportedDateType: reportedDate.type,
            dateReportedFrom: reportedDate.startDate,
            dateReportedTo: reportedDate.endDate,
          });
          params["dateReportedFrom"] = reportedDate.startDate;
          params["dateReportedTo"] = reportedDate.endDate;
        }
      }

      if (query["erd"]) {
        if (query["erd"] === "custom") {
          let erdDateFrom =
            this.query["excessReleaseDateFrom"] !== "" &&
              this.query["excessReleaseDateFrom"] !== "null"
              ? new Date(
                decodeURIComponent(this.query["excessReleaseDateFrom"])
              )
              : "";
          let erdDateTo =
            this.query["excessReleaseDateTo"] !== "" &&
              this.query["excessReleaseDateTo"] !== "null"
              ? new Date(decodeURIComponent(this.query["excessReleaseDateTo"]))
              : "";
          this.setState({
            excessDateType: query["erd"],
            erdDateFrom: erdDateFrom,
            erdDateTo: erdDateTo,
          });
          params["erdDateFrom"] = erdDateFrom;
          params["erdDateTo"] = erdDateTo;
        } else {
          let erdDate = this.calculateExcessReleaseDateToFrom(query["erd"]);
          this.setState({
            excessDateType: erdDate.type,
            erdDateFrom: erdDate.startDate,
            erdDateTo: erdDate.endDate,
          });
          params["erdDateFrom"] = erdDate.startDate;
          params["erdDateTo"] = erdDate.endDate;
        }
      }

      if (query["srd"]) {
        let srdDate = this.calculateSurplusDateToFrom(query["srd"]);
        if (query["srd"] === "custom") {
          let srdDateFrom =
            this.query["surplusReleaseDateFrom"] !== "" &&
              this.query["surplusReleaseDateFrom"] !== "null"
              ? new Date(
                decodeURIComponent(this.query["surplusReleaseDateFrom"])
              )
              : "";
          let srdDateTo =
            this.query["surplusReleaseDateTo"] !== "" &&
              this.query["surplusReleaseDateTo"] !== "null"
              ? new Date(decodeURIComponent(this.query["surplusReleaseDateTo"]))
              : "";
          this.setState({
            surplusDateType: srdDate,
            srdDateFrom: srdDateFrom,
            srdDateTo: srdDateTo,
          });
          params["srdDateFrom"] = srdDateFrom;
          params["srdDateTo"] = srdDateTo;
        } else {
          this.setState({
            surplusDateType: srdDate.type,
            srdDateFrom: srdDate.startDate,
            srdDateTo: srdDate.endDate,
          });
          params["srdDateFrom"] = srdDate.startDate;
          params["srdDateTo"] = srdDate.endDate;
        }
      }
    }
    if (query["page"] && query["size"]) {
      let pageParams = {
        page: query["page"] ? query["page"] : 1,
        size: query["size"] ? query["size"] : 50,
      };
      params["params"] = pageParams;
    } else {
      let pageParams = {
        page: 1,
        size: 50,
      };
      params["params"] = pageParams;
    }
    let queryString = this.generateQueryParamString(params);
    this.props.updateSearchCriteria(queryString);
    if (params["internalExcessType"] === "history") {
      this.getAllHistoryFromAPI(params);
    } else if (params["internalExcessType"] === "foreignGifts") {
      this.getAllForeignGiftsFromAPI(params);
    } else {
      this.getAllPropertiesFromAPI(params);
    }
  };

  handleAgencyBureau(selectedAgencyBureaus) {
    this.setState({
      selectedAgencyBureaus: selectedAgencyBureaus,
    });
  }

  handleStateChange(selectedStates) {
    let selectedStateList = [];
    let selectedStateValues = [];
    selectedStates.forEach((e) => {
      selectedStateList.push(e.id);
      selectedStateValues.push(e);
    });
    this.setState({
      selectedStateList: selectedStateList,
      selectedStateValues: selectedStateValues,
    });
  }

  handlePropertyType(donorCountrySelected) {
    this.setState({
      donorCountrySelected: donorCountrySelected.target.value,
    });
  }

  handleHistoryPropertyType(selectedHistoryPropertyType) {
    this.setState({
      historyPropertyTypeValue: selectedHistoryPropertyType.target.value,
    });
  }

  prepareParamsForSearch(
    categories?: any,
    page?: number,
    size?: number,
    internalExcessSelected?: string
  ) {
    let parameters = {
      dateReportedFrom: this.state.dateReportedFrom,
      dateReportedTo: this.state.dateReportedTo,
      srdDateFrom: this.state.srdDateFrom,
      srdDateTo: this.state.srdDateTo,
      erdDateFrom: this.state.erdDateFrom,
      erdDateTo: this.state.erdDateTo,
      categoryCodeList: categories.length !== 0 ? categories : [],
      propertySearchTypeAdvanced: this.state.propertySearchTypeAdvanced,
      aacId: this.state.aacId,
      itemControlNumber: this.state.itemControlNumber.replace(
        regexForTCNandICN,
        ""
      ),
      agencyBureau: this.state.selectedAgencyBureaus[0]
        ? this.state.selectedAgencyBureaus[0].id
        : "",
      propertyType: this.state.selectedPropertyType,
      advancedSearchText: this.state.advancedSearchText.trim(),
      conditionCodeList: this.state.conditionCodeList,
      transferControlNumber: this.state.transferControlNumber.replace(
        regexForTCNandICN,
        ""
      ),
      stateList: this.state.selectedStateList,
      reimbursementRequired: this.state.reimbursementRequired,
      niinCode: this.state.niinCode,
      fscCodeList: this.state.fscCodeList,
      internalExcessType: internalExcessSelected
        ? internalExcessSelected
        : "all",
      // Adding Params for Foreign Gifts
      administration: this.state.administrationSearch,
      vaultLocation: this.state.vaultLocationSelected,
      countryCode: this.state.donorCountrySelected,
      recipientName: this.state.recipientName,
      donorName: this.state.donorName,
      fiscalYear: this.state.fiscalYear,
      params: {
        page: page ? page : 1,
        size: size ? size : this.state.rowsPerPage,
      },
    };
    this.generateAndHandleQueryParams(parameters);
    return parameters;
  }

  generateAndHandleQueryParams = (params) => {
    let location = {
      pathname: Paths.searchProperty,
    };
    let queryString = this.generateQueryParamString(params);
    this.props.updateSearchCriteria(queryString);
    location["search"] = queryString;
    history.push(location);
  };

  generateQueryParamString = (params) => {
    let queryString = "";
    if (params?.params?.page && params?.params?.size) {
      queryString +=
        "page=" + params.params.page + "&size=" + params?.params?.size;
    }

    if (params?.propertySearchTypeAdvanced) {
      queryString += "&searchType=" + params?.propertySearchTypeAdvanced;
    }

    if (params?.aacId) {
      queryString += "&aacId=" + params?.aacId;
    }

    if (params?.categoryCodeList) {
      queryString += "&categories=" + params?.categoryCodeList;
    }

    if (params?.itemControlNumber) {
      queryString += "&icn=" + params?.itemControlNumber;
    }

    if (params?.agencyBureau) {
      queryString += "&agency=" + params?.agencyBureau;
    }

    if (params?.propertyType) {
      queryString += "&propertyType=" + params?.propertyType;
    }

    if (params?.advancedSearchText) {
      queryString += "&keyword=" + params?.advancedSearchText;
    }

    if (params?.conditionCodeList) {
      queryString += "&condition=" + params?.conditionCodeList?.join();
    }

    if (params?.transferControlNumber) {
      queryString += "&tcn=" + params?.transferControlNumber;
    }

    if (params?.stateList) {
      queryString += "&states=" + params?.stateList?.join();
    }

    if (params?.reimbursementRequired) {
      queryString += "&reimbursement=" + params?.reimbursementRequired;
    }

    if (params?.niinCode) {
      queryString += "&niin=" + params?.niinCode;
    }

    if (params?.fscCodeList) {
      queryString += "&fsc=" + params?.fscCodeList?.join();
    }

    if (params?.internalExcessType) {
      queryString += "&internalExcessType=" + params?.internalExcessType;
    }

    if (this.state?.reportedDateType) {
      queryString += "&dateReported=" + this.state.reportedDateType;
      if (this.state?.reportedDateType === "custom") {
        queryString += "&dateReportedFrom=" + this.state.dateReportedFrom;
        queryString += "&dateReportedTo=" + this.state.dateReportedTo;
      }
    }

    if (this.state?.surplusDateType) {
      if (this.state?.surplusDateType === "custom") {
        queryString += "&surplusReleaseDateFrom=" + this.state.srdDateFrom;
        queryString += "&surplusReleaseDateTo=" + this.state.srdDateTo;
      }
      queryString += "&srd=" + this.state.surplusDateType;
    }

    if (this.state?.excessDateType) {
      if (this.state?.excessDateType === "custom") {
        queryString += "&excessReleaseDateFrom=" + this.state.erdDateFrom;
        queryString += "&excessReleaseDateTo=" + this.state.erdDateTo;
      }
      queryString += "&erd=" + this.state.excessDateType;
    }

    return queryString;
  };

  getData(
    categories?: any,
    page?: number,
    size?: number,
    internalExcessSelected?: string
  ) {
    let param = this.prepareParamsForSearch(
      categories,
      page,
      size,
      internalExcessSelected
    );
    if (internalExcessSelected === "history") {
      this.getAllHistoryFromAPI(param);
    } else if (internalExcessSelected === "foreignGifts") {
      this.getAllForeignGiftsFromAPI(param);
    } else {
      this.getAllPropertiesFromAPI(param, categories);
    }
  }

  setCategoriesAndCount = (categoryList: any) => {
    let category = categoryList.map((item) => {
      return {
        value: item.categoryName + `(${item.count})`,
        categoryName: item.categoryName,
        id: item.categoryCode,
        isSelected: item.count !== 0,
        isDisabled: item.count === 0 && item.total === 0,
        count: item.count,
      };
    });
    let categoryCodes = categoryList.map((item) => {
      return item.categoryCode;
    });
    this.setState({
      categories: category,
      categoryCodes: categoryCodes,
      selectedCategoryCodes: categoryCodes,
    });
  };

  getAllPropertiesFromAPI = (param, categories?: any) => {
    let erdDateFromISO =
      param.erdDateFrom && param?.erdDateFrom !== ""
        ? moment(moment(param?.erdDateFrom).format("YYYY-MM-DD")).format(
          "YYYY-MM-DDT00:00:00.000"
        )
        : "";
    let erdDateToISO =
      param.erdDateTo && param.erdDateTo !== ""
        ? moment(moment(param?.erdDateTo).format("YYYY-MM-DD")).format(
          "YYYY-MM-DDT23:59:59.999"
        )
        : "";
    let srdDateFromISO =
      param.srdDateFrom && param?.srdDateFrom !== ""
        ? moment(moment(param?.srdDateFrom).format("YYYY-MM-DD")).format(
          "YYYY-MM-DDT00:00:00.000"
        )
        : "";
    let srdDateToISO =
      param.srdDateTo && param?.srdDateTo !== ""
        ? moment(moment(param?.srdDateTo).format("YYYY-MM-DD")).format(
          "YYYY-MM-DDT23:59:59.999"
        )
        : "";

    let paramUpdated = {
      ...param,
      srdDateFrom: srdDateFromISO,
      srdDateTo: srdDateToISO,
      erdDateFrom: erdDateFromISO,
      erdDateTo: erdDateToISO,
    };

    this.propertyApiService
      .searchPropertybyCategory(paramUpdated)
      .then((response) => {
        if (response?.data?.propertySearchResultList.length === 0) {
          this.setState({
            showModal: true,
            modalMessage: "No records found for your search.",
          });
        }
        let categoryCodeUpdated = response?.data?.propertySearchCategoryCountDTOList.filter(
          (item) => item.count > 0
        );
        let categoryCodeList = categoryCodeUpdated.map((item) => {
          return item.categoryCode;
        });
        this.setCategoriesAndCount(
          response.data?.propertySearchCategoryCountDTOList
        );
        this.setState({
          items: response?.data?.propertySearchResultList,
          currentPage:
            response?.data?.propertySearchResultList.length > 0
              ? response?.data?.currentPageNumber
              : 1,
          totalRows:
            response?.data?.propertySearchResultList.length > 0
              ? response?.data?.totalElements
              : 0,
          selectedCategoryCodes: categoryCodeList,
        });
      });
  };

  clearPropertySearchState() {
    this.setState({
      selectedCategories: [],
      advancedSearchText: "",
      selectedAgencyBureaus: [],
      aacId: "",
      itemControlNumber: "",
      selectedPropertyType: "",
      fcsSelectedValues: [],
      niinCode: "",
      conditionCodeList: [],
      transferControlNumber: "",
      selectedStateList: [],
      selectedStateValues: [],
      reportedDateType: "",
      dateReportedFrom: "",
      dateReportedTo: "",
      surplusDateType: "",
      srdDateFrom: "",
      srdDateTo: "",
      excessDateType: "",
      erdDateFrom: "",
      erdDateTo: "",
      fscCodeList: [],
      icnIsInvalid: false,
      icnIsValid: true,
      icnValidationMessage: "",
      reimbursementRequired: "",

      //To Clear Foreign Gift
      donorCountrySelected: "",
      administrationSelected: "",
      vaultLocationSelected: "",
      recipientName: "",
      donorName: "",
      fiscalYear: "",
      administrationAdvanced: "",
      administrationSearch: "",
    });
    let conditions = this.state.advancedCondition;
    conditions.forEach((condition) => {
      condition.isSelected = false;
    });
    let yesNoOptionsCleared = this.state.yesNoRadioOptions;
    yesNoOptionsCleared.forEach((option) => (option.isSelected = false));
    this.setState({
      advancedCondition: conditions,
      yesNoRadioOptions: yesNoOptionsCleared,
    });
  }

  getHistoryStatus() {
    if (this.state.historyPropertyTypeValue === "internal-transfer") {
      return "INTERNAL TRANSFER";
    } else if (this.state.historyPropertyTypeValue === "donated") {
      return "DONATED";
    } else if (this.state.historyPropertyTypeValue === "transferred") {
      return "TRANSFERRED";
    } else if (this.state.historyPropertyTypeValue === "waiver-returned") {
      return "WAIVER OR RETURNED";
    } else if (this.state.historyPropertyTypeValue === "returned") {
      return "RETURNED";
    } else if (
      this.state.historyPropertyTypeValue === "returned-after-internal-transfer"
    ) {
      return "RETURNED AFTER INTERNAL SCREENING";
    } else {
      return this.state.historyPropertyTypeValue;
    }
  }

  getAllHistoryFromAPI(params) {
    let historyStatus = this.getHistoryStatus();
    let paramUpdated = {
      ...params,
      status: historyStatus,
    };
    this.propertyApiService
      .searchHistoryPropertybyCategory(paramUpdated)
      .then((response) => {
        if (response?.data?.propertyHistorySearchResultList.length === 0) {
          this.setState({
            showModal: true,
            modalMessage: "No records found for your search.",
          });
        }
        let categoryCodeUpdated = response?.data?.propertySearchCategoryCountDTOList.filter(
          (item) => item.count > 0
        );
        let categoryCodeList = categoryCodeUpdated.map((item) => {
          return item.categoryCode;
        });
        this.setCategoriesAndCount(
          response.data?.propertySearchCategoryCountDTOList
        );
        this.setState({
          items: response?.data?.propertyHistorySearchResultList,
          currentPage:
            response?.data?.propertyHistorySearchResultList.length > 0
              ? response?.data?.currentPageNumber
              : 1,
          totalRows:
            response?.data?.propertyHistorySearchResultList.length > 0
              ? response?.data?.totalElements
              : 0,
          selectedCategoryCodes: categoryCodeList,
        });
      });
  }

  handleICN = (event) => {
    let icnValue = event.target.value;
    let validation = validateItemControlNumberWithMinSix(icnValue);
    let formattedicnValue;
    this.setState({
      itemControlNumber: icnValue,
      icnIsInvalid: validation.isInvalid,
      icnIsValid: !validation.isInvalid,
      icnValidationMessage: validation.validationError,
    });
    let icnVal = icnValue.replace(regexForTCNandICN, "");
    if (icnVal.length === 14) {
      formattedicnValue =
        icnVal.substring(0, 6) +
        "-" +
        icnVal.substring(6, 10) +
        "-" +
        icnVal.substring(10, 14);
      this.setState({
        itemControlNumber: formattedicnValue,
      });
    } else if (icnVal.length === 15) {
      formattedicnValue =
        icnVal.substring(0, 6) +
        "-" +
        icnVal.substring(6, 10) +
        "-" +
        icnVal.substring(10, 14) +
        "-" +
        icnVal.substring(14, 15);
      this.setState({
        itemControlNumber: formattedicnValue,
      });
    }
  };

  handleAAC = (event) => {
    let aacValue = event.target.value;
    let validation = validateAAC(aacValue);
    this.setState({
      aacId: aacValue,
      aacIsInvalid: validation.isInvalid,
      aacIsValid: !validation.isInvalid,
      aacValidationMessage: validation.validationError,
    });
  };

  calculateDateReportedToFrom = (reportedDateType) => {
    let reportedType = reportedDateType?.target?.value
      ? reportedDateType?.target?.value
      : reportedDateType;
    let m = moment();
    let startDate = "";
    let endDate = moment().endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    if (reportedType === "Today") {
      startDate = m.startOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (reportedType === "pastTwo") {
      startDate = m.add(-1, "day").startOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (reportedType === "pastWeek") {
      startDate = m.add(-7, "day").startOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (reportedType === "pastMonth") {
      startDate = m
        .add(-30, "day")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
    } else {
      startDate = "";
      endDate = "";
    }
    return {
      type: reportedType,
      startDate: startDate,
      endDate: endDate,
    };
  };

  handleDateReportSelect(reportedDateType) {
    let reportedDate = this.calculateDateReportedToFrom(reportedDateType);
    this.setState({
      reportedDateType: reportedDate.type,
      dateReportedFrom: reportedDate.startDate,
      dateReportedTo: reportedDate.endDate,
    });
  }
  handleDateReportedFromChange(reportedDateFrom) {
    if (reportedDateFrom !== "" && reportedDateFrom != null) {
      reportedDateFrom = moment(
        reportedDateFrom,
        "YYYY-MM-DD 00:00:01"
      ).toDate();
      reportedDateFrom.setHours(0, 0, 0, 0);
    }
    this.setState({
      dateReportedFrom: reportedDateFrom,
    });
  }

  handleDateReportedToChange(reportedDateTo) {
    if (reportedDateTo !== "" && reportedDateTo != null) {
      reportedDateTo = moment(reportedDateTo, "YYYY-MM-DD 23:59:59").toDate();
      reportedDateTo.setHours(23, 59, 59, 999);
    }
    this.setState({
      dateReportedTo: reportedDateTo,
    });
  }

  handleExcessReleaseDateFromChange(excessReleaseDateFrom) {
    if (excessReleaseDateFrom !== "" && excessReleaseDateFrom != null) {
      excessReleaseDateFrom = moment(
        excessReleaseDateFrom,
        "YYYY-MM-DD 00:00:01"
      ).toDate();
      excessReleaseDateFrom.setHours(0, 0, 0, 0);
    }
    this.setState({
      erdDateFrom: excessReleaseDateFrom,
    });
  }

  handleExcessReleaseDateToChange(excessReleaseDateTo) {
    if (excessReleaseDateTo !== "" && excessReleaseDateTo != null) {
      excessReleaseDateTo = moment(
        excessReleaseDateTo,
        "YYYY-MM-DD 23:59:59"
      ).toDate();
      excessReleaseDateTo.setHours(23, 59, 59, 999);
    }
    this.setState({
      erdDateTo: excessReleaseDateTo,
    });
  }

  handleSurplusReleaseDateFromChange(surplusReleaseDateFrom) {
    if (surplusReleaseDateFrom !== "" && surplusReleaseDateFrom != null) {
      surplusReleaseDateFrom = moment(
        surplusReleaseDateFrom,
        "YYYY-MM-DD 00:00:01"
      ).toDate();
      surplusReleaseDateFrom.setHours(0, 0, 0, 0);
    }
    this.setState({
      srdDateFrom: surplusReleaseDateFrom,
    });
  }

  handleSurplusReleaseDateToChange(surplusReleaseDateTo) {
    if (surplusReleaseDateTo !== "" && surplusReleaseDateTo != null) {
      surplusReleaseDateTo = moment(
        surplusReleaseDateTo,
        "YYYY-MM-DD 23:59:59"
      ).toDate();
      surplusReleaseDateTo.setHours(23, 59, 59, 999);
    }
    this.setState({
      srdDateTo: surplusReleaseDateTo,
    });
  }

  calculateSurplusDateToFrom = (surplusDateType) => {
    let surplusType = surplusDateType?.target?.value
      ? surplusDateType.target.value
      : surplusDateType;
    let m = moment();
    let endDate = "";
    let startDate = moment().startOf("day").format("YYYY-MM-DDTHH:mm:ss");
    if (surplusType === "Today") {
      endDate = m.endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (surplusType === "nextTwo") {
      endDate = m.add(1, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (surplusType === "nextWeek") {
      endDate = m.add(7, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (surplusType === "nextMonth") {
      endDate = m.add(30, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else {
      endDate = "";
      startDate = "";
    }
    return {
      type: surplusType,
      startDate: startDate,
      endDate: endDate,
    };
  };

  handleSurplusDateSelect(surplusDateType) {
    let surplusDate = this.calculateSurplusDateToFrom(surplusDateType);
    this.setState({
      surplusDateType: surplusDate.type,
      srdDateFrom: surplusDate.startDate,
      srdDateTo: surplusDate.endDate,
    });
  }

  calculateExcessReleaseDateToFrom = (excessDateType) => {
    let excessType = excessDateType.target?.value
      ? excessDateType.target.value
      : excessDateType;
    let m = moment();
    let endDate = "";
    let startDate = moment().startOf("day").format("YYYY-MM-DDTHH:mm:ss");
    if (excessType === "Today") {
      endDate = m.endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (excessType === "nextTwo") {
      endDate = m.add(1, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (excessType === "nextWeek") {
      endDate = m.add(7, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else if (excessType === "nextMonth") {
      endDate = m.add(30, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss");
    } else {
      endDate = "";
      startDate = "";
    }
    return {
      type: excessType,
      startDate: startDate,
      endDate: endDate,
    };
  };

  handleExcessDateSelect(excessDateType) {
    let excessDate = this.calculateExcessReleaseDateToFrom(excessDateType);
    this.setState({
      excessDateType: excessDate.type,
      erdDateFrom: excessDate.startDate,
      erdDateTo: excessDate.endDate,
    });
  }

  handleAdvancedSearchSelect = (event) => {
    let value = event.target.options[event.target.selectedIndex].text;
    const { searchType } = this.state;
    searchType.type = value;
    this.setState({
      isSearchTypeUpdated: true,
      searchType: searchType,
    });
    this.handleSearchTypeWithAllCaps();
  };

  handleSearchTypeWithAllCaps = () => {
    let propertySearchTypeAdvanced;
    advancedSearchValues.forEach((m) => {
      if (this.state.searchType.type !== "") {
        if (m.value === this.state.searchType.type) {
          propertySearchTypeAdvanced = m.caps;
        }
      } else {
        propertySearchTypeAdvanced = "ALL_WORDS";
      }
    });
    this.setState({
      propertySearchTypeAdvanced: propertySearchTypeAdvanced,
    });
  };
  handleAdvancedSearchOnChange = (event) => {
    let advancedSearchText = event.target.value;
    this.handleSearchTypeWithAllCaps();
    this.setState({
      advancedSearchText: advancedSearchText,
    });
  };
  handleChange = (event) => {
    let fscSelectedList = [];
    let fcsSelectedValues = [];
    event.forEach((e) => {
      fscSelectedList.push(e.code);
      fcsSelectedValues.push(e);
    });
    this.setState({
      fscCodeList: fscSelectedList,
      fcsSelectedValues: fcsSelectedValues,
    });
  };
  handleNIINChange = (event) => {
    this.setState({ niinCode: event.target.value.trim() });
  };
  handleConditionChange = (event) => {
    let ccl = [];
    event.forEach((e) => {
      if (e.isSelected) ccl.push(e.id);
    });
    this.setState({ conditionCodeList: ccl });
  };
  handleReimbursementRequiredChange = (event) => {
    let selectedValue = event.find((item) => item.isSelected === true);
    if (selectedValue.id === "Y") {
      this.setState({ reimbursementRequired: "Y" });
    } else if (selectedValue.id === "N") {
      this.setState({ reimbursementRequired: "N" });
    }
  };

  handleAdvancedClearBtnClick = () => {
    this.setState({
      selectedCategories: [],
      advancedSearchText: "",
      searchType: { type: "All Words" },
      selectedAgencyBureaus: [],
      aacId: "",
      itemControlNumber: "",
      selectedPropertyType: "",
      fcsSelectedValues: [],
      niinCode: "",
      conditionCodeList: [],
      transferControlNumber: "",
      selectedStateList: [],
      selectedStateValues: [],
      reportedDateType: "",
      dateReportedFrom: "",
      dateReportedTo: "",
      surplusDateType: "",
      srdDateFrom: "",
      srdDateTo: "",
      excessDateType: "",
      erdDateFrom: "",
      erdDateTo: "",
      fscCodeList: [],
      internalExcessType: "all",
      icnIsInvalid: false,
      icnIsValid: true,
      icnValidationMessage: "",
      reimbursementRequired: "",
      historyPropertyTypeValue: "all-history",

      //Clear Foreign Gifts Fields
      donorCountrySelected: "",
      administrationSelected: "",
      vaultLocationSelected: "",
      recipientName: "",
      donorName: "",
      fiscalYear: "",
      administrationAdvanced: "",
      administrationSearch: "",
    });
    let conditions = this.state.advancedCondition;
    conditions.forEach((condition) => {
      condition.isSelected = false;
    });
    let internalExsOptionsCleared = this.state.internalExcessTypeOptions;
    if (this.showOnlyFGRadio()) {
      this.setState({
        internalExcessType: "foreignGifts",
      });
      internalExsOptionsCleared.forEach((option) => {
        option.isSelected = option.id === "foreignGifts";
      });
    } else if (
      UserUtils.isUserSA() ||
      UserUtils.isUserSP() ||
      UserUtils.isUserFF() ||
      this.showOnlyExternalNUOExcessOptions()
    ) {
      this.setState({
        internalExcessType: "excess",
      });
      internalExsOptionsCleared.forEach((option) => {
        option.isSelected = option.id === "excess";
      });
    } else {
      internalExsOptionsCleared.forEach((option) => {
        option.isSelected = option.id === "all";
      });
    }
    let yesNoOptionsCleared = this.state.yesNoRadioOptions;
    yesNoOptionsCleared.forEach((option) => (option.isSelected = false));
    this.setState({
      advancedCondition: conditions,
      yesNoRadioOptions: yesNoOptionsCleared,
      internalExcessTypeOptions: internalExsOptionsCleared,
    });
    let param = {
      categoryCodeList: [],
      propertySearchTypeAdvanced: "",
      aacId: "",
      itemControlNumber: "",
      agencyBureau: "",
      propertyType: "",
      advancedSearchText: "",
      conditionCodeList: [],
      transferControlNumber: "",
      fcsSelectedValues: [],
      states: [],
      reimbursementRequired: "",
      niinCode: "",
      fscCodeList: [],
      internalExcessType: "all",
      reportedDateType: "",
      dateReportedFrom: "",
      dateReportedTo: "",
      surplusDateType: "",
      srdDateFrom: "",
      srdDateTo: "",
      excessDateType: "",
      erdDateFrom: "",
      erdDateTo: "",
      params: {
        page: 1,
        size: 50,
      },
    };
    let location = {
      pathname: Paths.searchProperty,
    };
    let queryString = this.generateQueryParamString(param);
    this.props.updateSearchCriteria(queryString);
    location["search"] = queryString;
    history.push(location);
    this.state.clearAllAPIFunc(param);
  };

  handleInternalExcessChange = (event) => {
    let internalExcessType = "all";
    event.forEach((e) => {
      if (e.isSelected) {
        internalExcessType = e.id;
        this.setState({
          internalExcessType: e.id,
        });
      }
    });
    if (internalExcessType === "foreignGifts") {
      this.setState({
        searchTitle: "Search Foreign Gift",
      });
    } else {
      this.setState({
        searchTitle: "Search Property",
      });
    }
    let params = this.prepareParamsForSearch(
      this.state.selectedCategories,
      1,
      this.state.rowsPerPage,
      internalExcessType
    );
    if (internalExcessType === "history") {
      this.clearPropertySearchState();
      this.getAllHistoryFromAPI(params);
    } else if (internalExcessType === "foreignGifts") {
      this.clearPropertySearchState();
      this.getAllForeignGiftsFromAPI(params);
    } else {
      this.setState({ historyPropertyTypeValue: "all-history" });
      this.getAllPropertiesFromAPI(params);
    }
  };

  handleCheckboxToggleChange = (categoryIds) => {
    if (categoryIds.length === 0) {
      categoryIds = [0]
    }
    let params = this.prepareParamsForSearch(
      categoryIds,
      1,
      50,
      this.state.internalExcessType
    );
    if (this.state.internalExcessType === "history") {
      let historyStatus = this.getHistoryStatus();
      let paramUpdated = {
        ...params,
        status: historyStatus,
      };
      this.propertyApiService
        .searchHistoryPropertybyCategory(paramUpdated)
        .then((response) => {
          if (response?.data?.propertyHistorySearchResultList.length === 0) {
            this.setState({
              showModal: true,
              modalMessage: "No records found for your search.",
            });
          }
          let categoryCodeUpdated = response?.data?.propertySearchCategoryCountDTOList.filter(
            (item) => item.count > 0
          );
          this.setCategoriesAndCount(
            response.data?.propertySearchCategoryCountDTOList
          );
          this.setState({
            items: response?.data?.propertyHistorySearchResultList,
            currentPage:
              response?.data?.propertyHistorySearchResultList.length > 0
                ? response?.data?.currentPageNumber
                : 1,
            totalRows:
              response?.data?.propertyHistorySearchResultList.length > 0
                ? response?.data?.totalElements
                : 0,
            selectedCategoryCodes:
              params.categoryCodeList.length > 0
                ? params.categoryCodeList
                : categoryCodeUpdated,
          });
        });
    } else if (this.state.internalExcessType === "foreignGifts") {
      this.propertyApiService
        .searchForeignGiftsByCategory(params)
        .then((response) => {
          if (response?.data?.foreignGiftsSearchResultList.length === 0) {
            this.setState({
              showModal: true,
              modalMessage: "No records found for your search.",
            });
          }
          let categoryCodeUpdated = response?.data?.propertySearchCategoryCountDTOList.filter(
            (item) => item.count > 0
          );
          this.setCategoriesAndCount(
            response.data?.propertySearchCategoryCountDTOList
          );
          this.setState({
            items: response?.data?.foreignGiftsSearchResultList,
            currentPage:
              response?.data?.foreignGiftsSearchResultList.length > 0
                ? response?.data?.currentPageNumber
                : 1,
            totalRows:
              response?.data?.foreignGiftsSearchResultList.length > 0
                ? response?.data?.totalElements
                : 0,
            selectedCategoryCodes:
              params.categoryCodeList.length > 0
                ? params.categoryCodeList
                : categoryCodeUpdated,
          });
        });
    } else {
      this.propertyApiService
        .searchPropertybyCategory(params)
        .then((response) => {
          if (response?.data?.propertySearchResultList.length === 0) {
            this.setState({
              showModal: true,
              modalMessage: "No records found for your search.",
            });
          }
          let categoryCodeUpdated = response?.data?.propertySearchCategoryCountDTOList.filter(
            (item) => item.count > 0
          );
          this.setCategoriesAndCount(
            response.data?.propertySearchCategoryCountDTOList
          );
          this.setState({
            items: response?.data?.propertySearchResultList,
            currentPage:
              response?.data?.propertySearchResultList.length > 0
                ? response?.data?.currentPageNumber
                : 1,
            totalRows:
              response?.data?.propertySearchResultList.length > 0
                ? response?.data?.totalElements
                : 0,
            selectedCategoryCodes:
              params.categoryCodeList.length > 0
                ? params.categoryCodeList
                : categoryCodeUpdated,
          });
        });
    }
  };

  handlePropertyListPageChange = (page, size) => {
    const selectedCategories = this.state.selectedCategoryCodes;
    this.setState({ rowsPerPage: size });
    this.forceUpdate();
    let params = this.prepareParamsForSearch(
      selectedCategories,
      page,
      size,
      this.state.internalExcessType
    );
    if (this.state.internalExcessType === "history") {
      this.getAllHistoryFromAPI(params);
    } else if (this.state.internalExcessType === "foreignGifts") {
      this.getAllForeignGiftsFromAPI(params);
    } else {
      this.getAllPropertiesFromAPI(params, selectedCategories);
    }
  };
  /*===========================Foreign Gift elated Changes================================*/

  handleDonorCountrySelect(selectedDonorCountry) {
    this.setState({
      donorCountrySelected: selectedDonorCountry.target.value,
    });
  }
  handleAdministrationSelect(administrationSelected) {
    this.state.adminList.forEach((admin) => {
      if (admin.id === administrationSelected.target.value) {
        this.setState({
          administrationSearch: admin.value,
        });
      }
    });
    this.setState({
      administrationSelected: administrationSelected.target.value,
    });
  }
  handleVaultLocationSelect(vaultLocationSelected) {
    this.setState({
      vaultLocationSelected: vaultLocationSelected.target.value,
    });
  }

  handleRecipientNameChange = (event) => {
    this.setState({ recipientName: event.target.value.trimLeft() });
  };
  handleDonorNameChange = (event) => {
    this.setState({ donorName: event.target.value.trimLeft() });
  };
  handleFiscalYearChange = (event) => {
    this.setState({ fiscalYear: event.target.value.trim() });
  };

  populatePropertySearchCriteria = () => {
    let propertyType = this.query["propertyType"]?.toString();
    if (propertyType) {
      this.setState({
        selectedPropertyType: propertyType,
      });
    }

    let conditions =
      this.query["condition"]?.toString()?.trim()?.length !== 0
        ? this.query["condition"]?.toString().split(",")
        : null;
    if (conditions) {
      this.state.advancedCondition.forEach((item) => {
        conditions.forEach((condition) => {
          if (item.id === condition) {
            item.isSelected = true;
          }
        });
      });
      this.setState({
        conditionCodeList: conditions,
      });
    }

    let reimbursement = this.query["reimbursement"]?.toString();
    if (reimbursement) {
      this.state.yesNoRadioOptions.forEach((item) => {
        if (item.id === reimbursement) {
          item.isSelected = true;
        }
      });
      this.setState({
        reimbursementRequired: reimbursement,
      });
    }

    let dateReportedType = this.query["dateReported"]?.toString();
    if (dateReportedType) {
      if (dateReportedType === "custom") {
        let dateReportedFrom =
          this.query["dateReportedFrom"] !== "" &&
            this.query["dateReportedFrom"] !== "null"
            ? new Date(decodeURIComponent(this.query["dateReportedFrom"]))
            : "";
        let dateReportedTo =
          this.query["dateReportedTo"] !== "" &&
            this.query["dateReportedTo"] !== "null"
            ? new Date(decodeURIComponent(this.query["dateReportedTo"]))
            : "";

        this.setState({
          reportedDateType: dateReportedType,
          dateReportedFrom: dateReportedFrom,
          dateReportedTo: dateReportedTo,
        });
      } else {
        let dateReported = this.calculateDateReportedToFrom(dateReportedType);
        this.setState({
          reportedDateType: dateReportedType,
          dateReportedFrom: dateReported.startDate,
          dateReportedTo: dateReported.endDate,
        });
      }
    }
    let erdDateType = this.query["erd"]?.toString();
    if (erdDateType) {
      if (erdDateType) {
        if (erdDateType === "custom") {
          let erdDateFrom =
            this.query["excessReleaseDateFrom"] !== "" &&
              this.query["excessReleaseDateFrom"] !== "null"
              ? new Date(
                decodeURIComponent(this.query["excessReleaseDateFrom"])
              )
              : "";
          let erdDateTo =
            this.query["excessReleaseDateTo"] !== ""
              ? new Date(decodeURIComponent(this.query["excessReleaseDateTo"]))
              : "";
          this.setState({
            excessDateType: erdDateType,
            erdDateFrom: erdDateFrom,
            erdDateTo: erdDateTo,
          });
        } else {
          let erdDate = this.calculateExcessReleaseDateToFrom(erdDateType);
          this.setState({
            excessDateType: erdDateType,
            erdDateFrom: erdDate.startDate,
            erdDateTo: erdDate.endDate,
          });
        }
      }
    }

    let srdDateType = this.query["srd"]?.toString();
    if (srdDateType) {
      if (srdDateType === "custom") {
        let srdDateFrom =
          this.query["surplusReleaseDateFrom"] !== "" &&
            this.query["surplusReleaseDateFrom"] !== "null"
            ? new Date(decodeURIComponent(this.query["surplusReleaseDateFrom"]))
            : "";
        let srdDateTo =
          this.query["surplusReleaseDateTo"] !== "" &&
            this.query["surplusReleaseDateTo"] !== "null"
            ? new Date(decodeURIComponent(this.query["surplusReleaseDateTo"]))
            : "";
        this.setState({
          surplusDateType: srdDateType,
          srdDateFrom: srdDateFrom,
          srdDateTo: srdDateTo,
        });
      } else {
        let srdDate = this.calculateExcessReleaseDateToFrom(srdDateType);
        this.setState({
          surplusDateType: srdDateType,
          srdDateFrom: srdDate.startDate,
          srdDateTo: srdDate.endDate,
        });
      }
    }
  };
  populateForeignGiftSearchCriteria = () => {
    let administration = this.query["administration"]?.toString();
    if (administration) {
      this.setState({
        administrationSelected: administration,
      });
    }
    let fiscalYear = this.query["fiscalYear"]?.toString();
    if (fiscalYear) {
      this.setState({
        fiscalYear: fiscalYear,
      });
    }
    let recipientName = this.query["recipientName"]?.toString();
    if (recipientName) {
      this.setState({
        recipientName: recipientName,
      });
    }
    let donorName = this.query["donorName"]?.toString();
    if (donorName) {
      this.setState({
        donorName: donorName,
      });
    }

    let countryCode = this.query["countryCode"]?.toString();
    if (countryCode) {
      this.setState({
        donorName: countryCode,
      });
    }
    let internalType = this.query["internalExcessType"]
      ? this.query["internalExcessType"].toString()
      : this.state.internalExcessType;
    if (internalType) {
      this.state.internalExcessTypeOptions.forEach((item) => {
        item.isSelected = item.id === internalType;
      });
    }

    this.setState({
      internalExcessType: internalType,
    });
    let vaultLocation = this.query["vaultLocation"]?.toString();
    if (vaultLocation) {
      this.setState({
        vaultLocationSelected: vaultLocation,
      });
    }
    let donorCountry = this.query["countryCode"]?.toString();
    if (vaultLocation) {
      this.setState({
        donorCountrySelected: donorCountry,
      });
    }
  };
  getAllForeignGiftsFromAPI = (param, categories?: any) => {
    let paramUpdated = {
      ...param,
    };

    this.propertyApiService
      .searchForeignGiftsByCategory(paramUpdated)
      .then((response) => {
        if (response?.data?.foreignGiftsSearchResultList.length === 0) {
          this.setState({
            showModal: true,
            modalMessage: "No records found for your search.",
          });
        }
        this.setCategoriesAndCount(
          response.data?.propertySearchCategoryCountDTOList
        );
        this.setState({
          items: response?.data?.foreignGiftsSearchResultList,
          currentPage:
            response?.data?.foreignGiftsSearchResultList.length > 0
              ? response?.data?.currentPageNumber
              : 1,
          totalRows:
            response?.data?.foreignGiftsSearchResultList.length > 0
              ? response?.data?.totalElements
              : 0,
          //selectedCategoryCodes: categoryCodeList,
        });
      });
  };
  /* ======================================================= When main search button is clicked =========================================== */
  handleMainSearch = (
    page?: number,
    size?: number,
    internalExcessSelected?: string
  ) => {
    const selectedCategories = this.state.selectedCategories.map(
      (item: any) => {
        return item.id;
      }
    );
    if (selectedCategories.length !== 0) {
      this.getData(selectedCategories, page, size, internalExcessSelected);
    } else {
      this.getData([], page, size, internalExcessSelected);
    }
  };
  handleClose = (event) => {
    this.setState({
      showModal: false,
    });
  };
  render() {
    return (
      <div className="grid-conatiner ui-ppms">
        {this.showOnlyFGRadio() ? (
          <h1>Search Foreign Gifts</h1>
        ) : (
          <h1>{this.state.searchTitle}</h1>
        )}
        <div
          className="grid-row grid-gap-4 temp-row tabs-conversion"
          style={{
            display:
              (UserUtils.getUserPermissions().toString().includes("IS") &&
                UserUtils.getUserPermissions().toString().includes("FF")) ||
                (UserUtils.getUserPermissions().toString().includes("NU") &&
                  UserUtils.getUserInfo().internalAgencyUser) ||
                UserUtils.getUserPermissions().toString().includes("AC") ||
                UserUtils.getUserPermissions().toString().includes("SM") ||
                UserUtils.getUserPermissions().toString().includes("FR") ||
                UserUtils.getUserPermissions().toString().includes("FG") ||
                UserUtils.getUserPermissions().toString().includes("SA") ||
                UserUtils.getUserPermissions().toString().includes("SP") ||
                (UserUtils.getUserPermissions().toString().includes("NU") &&
                  !UserUtils.getUserInfo().internalAgencyUser)
                ? "auto"
                : "none",
          }}
        >
          <PPMSToggleRadio
            id={"filter-by-internalExcessType"}
            options={this.state.internalExcessTypeOptions}
            isInline={true}
            isDisabled={false}
            name={"internalExcessType"}
            className={""}
            label={"Filter by:"}
            validationMessage={""}
            isSingleSelect={true}
            onChange={this.handleInternalExcessChange}
          />
        </div>
        {/*/}*/}

        <div className="grid-row grid-gap-4"></div>
        <div className="grid-row">
          <div className="ppms-select-position grid-col-2">
            <PPMSSelect
              id={"select-property-type"}
              title={"select-property-type"}
              label={null}
              values={advancedSearchValues}
              identifierKey={"caps"}
              identifierValue={"value"}
              isInvalid={false}
              isValid={false}
              isRequired={false}
              selectedValue={this.state.propertySearchTypeAdvanced}
              selectName={"searchtype"}
              validationMessage={""}
              onChange={this.handleAdvancedSearchSelect}
            />
          </div>
          <div className="grid-col-10">
            <PPMSInput
              title={"item name or property description"}
              isDisabled={false}
              placeHolder={"Search by Item Name or Property Description"}
              id={"advanced-search-id"}
              inputType={"text"}
              isInvalid={false}
              isValid={false}
              isRequired={false}
              value={this.state.advancedSearchText}
              onChange={this.handleAdvancedSearchOnChange}
              maxLength={50}
            />
          </div>
        </div>
        <br />
        <PPMSAlert
          id={"cart-danger-msg"}
          show={!!this.state.error}
          alertBody={this.state.error}
          alertClassName={"cart-error"}
          alertKey={"cart-error"}
          alertVariant={"danger"}
        />
        <div className="grid-row grid-gap-4">
          <div className="grid-col-12">
            {this.checkSearchType() ? (
              <AdvancedSearchForeignGift
                //advancedConditions={this.state.advancedCondition}
                yesNoRadioOptions={this.state.yesNoRadioOptions}
                icn={this.state.itemControlNumber}
                handleICN={this.handleICN.bind(this)}
                icnIsInvalid={false}
                icnIsValid={true}
                icnValidationMessage={this.state.icnValidationMessage}
                handleDonorCountrySelect={this.handleDonorCountrySelect.bind(
                  this
                )}
                donorCountrySelected={this.state.donorCountrySelected}
                handleAdministrationSelect={this.handleAdministrationSelect.bind(
                  this
                )}
                administrationSelected={this.state.administrationSelected}
                handleVaultLocationSelect={this.handleVaultLocationSelect.bind(
                  this
                )}
                vaultLocationSelected={this.state.vaultLocationSelected}
                recipientName={this.state.recipientName}
                donorName={this.state.donorName}
                fiscalYear={this.state.fiscalYear}
                handleRecipientNameChange={this.handleRecipientNameChange.bind(
                  this
                )}
                handleDonorNameChange={this.handleDonorNameChange.bind(this)}
                handleFiscalYearChange={this.handleFiscalYearChange.bind(this)}
                donorCountryList={this.state.donorCountryList}
                adminList={this.state.adminList}
              />
            ) : (
              <AdvancedSearchProperty
                advancedConditions={this.state.advancedCondition}
                yesNoRadioOptions={this.state.yesNoRadioOptions}
                handleAdvancedClearBtnClick={this.handleAdvancedClearBtnClick}
                handleConditionChange={this.handleConditionChange}
                handleReimbursementRequiredChange={
                  this.handleReimbursementRequiredChange
                }
                handleNIINChange={this.handleNIINChange}
                handleChange={this.handleChange}
                fscState={this.state.fscCodes}
                fcsSelectedValues={this.state.fcsSelectedValues}
                icn={this.state.itemControlNumber}
                handleICN={this.handleICN.bind(this)}
                icnIsInvalid={this.state.icnIsInvalid}
                icnIsValid={this.state.icnIsValid}
                icnValidationMessage={this.state.icnValidationMessage}
                tcn={this.state.transferControlNumber}
                tcnIsInvalid={this.state.tcnIsInvalid}
                tcnIsValid={this.state.tcnIsValid}
                tcnValidationMessage={this.state.tcnValidationMessage}
                aacId={this.state.aacId}
                handleAAC={this.handleAAC.bind(this)}
                aacIsInvalid={this.state.aacIsInvalid}
                aacIsValid={this.state.aacIsValid}
                aacValidationMessage={this.state.aacValidationMessage}
                agencyBureaus={this.state.agencyBureaus}
                selectedAgencyBureaus={this.state.selectedAgencyBureaus}
                handleAgencyBureau={this.handleAgencyBureau.bind(this)}
                states={this.state.states}
                selectedStateValues={this.state.selectedStateValues}
                handleStateChange={this.handleStateChange.bind(this)}
                propertyTypeIsInvalid={this.state.propertyTypeIsInvalid}
                propertyTypeIsValid={this.state.propertyTypeIsValid}
                propertyTypeValidationMessage={
                  this.state.propertyTypeValidationMessage
                }
                selectedPropertyType={this.state.selectedPropertyType}
                handlePropertyType={this.handlePropertyType.bind(this)}
                agencyBureauIsValid={this.state.agencyBureauIsValid}
                agencyBureauIsInvalid={this.state.agencyBureauIsInvalid}
                historyPropertyTypeValue={this.state.historyPropertyTypeValue}
                handleHistoryPropertyType={this.handleHistoryPropertyType.bind(
                  this
                )}
                niinCode={this.state.niinCode}
                agencyBureauValidationMessage={
                  this.state.agencyBureauValidationMessage
                }
                handleDateReportSelect={this.handleDateReportSelect.bind(this)}
                handleDateReportedFromChange={this.handleDateReportedFromChange.bind(
                  this
                )}
                handleDateReportedToChange={this.handleDateReportedToChange.bind(
                  this
                )}
                handleExcessReleaseDateFromChange={this.handleExcessReleaseDateFromChange.bind(
                  this
                )}
                handleExcessReleaseDateToChange={this.handleExcessReleaseDateToChange.bind(
                  this
                )}
                handleSurplusReleaseDateFromChange={this.handleSurplusReleaseDateFromChange.bind(
                  this
                )}
                handleSurplusReleaseDateToChange={this.handleSurplusReleaseDateToChange.bind(
                  this
                )}
                handleSurplusDateSelect={this.handleSurplusDateSelect.bind(
                  this
                )}
                handleExcessDateSelect={this.handleExcessDateSelect.bind(this)}
                reportedDateType={this.state.reportedDateType}
                dateReportedFrom={this.state.dateReportedFrom}
                dateReportedTo={this.state.dateReportedTo}
                surplusDateType={this.state.surplusDateType}
                excessDateType={this.state.excessDateType}
                excessReleaseDateFrom={this.state.erdDateFrom}
                excessReleaseDateTo={this.state.erdDateTo}
                surplusReleaseDateFrom={this.state.srdDateFrom}
                surplusReleaseDateTo={this.state.srdDateTo}
                disableAdvancedSearchAttributes={
                  this.state.internalExcessType === "history" ? true : false
                }
              />
            )}
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col text-center margin-top-2">
            <PPMSButton
              id={"property-main-search"}
              label={"Search"}
              onPress={(event) =>
                this.handleMainSearch(1, 50, this.state.internalExcessType)
              }
              variant={"primary"}
              size="lg"
            />
            <PPMSButton
              id={"Search"}
              label={"Clear All"}
              onPress={this.handleAdvancedClearBtnClick}
              variant={"secondary"}
              size="lg"
            />
          </div>
        </div>
        <div className="grid-row grid-gap-4">
          <div className="grid-col-3 pushToggleDown filter-cards usa-layout-docs__sidenav">
            <ToggleCategory
              options={this.state.categories}
              onSelect={this.handleCheckboxToggleChange}
            />
          </div>
          <div className="grid-col-9 ui-ppms usa-layout-docs__main">
            <PropertySearchList
              title={"Property List"}
              items={this.state.items}
              totalCartItems={this.props.cart.cart.total}
              handleAddToCart={this.props.addToCart}
              page={this.state.currentPage}
              rowsPerPage={this.state.rowsPerPage}
              totalRows={this.state.totalRows}
              onChangePage={(currentPage, pageSize) =>
                this.handlePropertyListPageChange(currentPage, pageSize)
              }
              propertyHistoryFlag={
                this.state.internalExcessType === "history" ? true : false
              }
              propertiesInCart={this.props.cart.cart.requests}
            />
          </div>
        </div>
        <PPMSModal
          body={this.state.modalMessage}
          id={"inactivate-internal-agency"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.handleClose}
          labelCancelVariant="hide"
          title={"Search Property"}
          label={"Ok"}
        />
      </div>
    );
  }

  private checkSearchType() {
    return (
      this.state.internalExcessType === "foreignGifts" &&
      (UserUtils.getUserPermissions().toString().includes("FR") ||
        UserUtils.getUserPermissions().toString().includes("FG") ||
        UserUtils.getUserPermissions().toString().includes("SM") ||
        UserUtils.getUserPermissions().toString().includes("NU") ||
        UserUtils.getUserPermissions().toString().includes("AC") ||
        UserUtils.getUserPermissions().toString().includes("AO") ||
        UserUtils.getUserPermissions().toString().includes("SA") ||
        UserUtils.getUserPermissions().toString().includes("FF"))
    );
  }
}
const mapStateToProps = (state) => ({ ...state, cart: state.cart });
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getCartItems: () => {
      dispatch(cartActions.getCartItems());
    },
    addToCart: (payload) => {
      dispatch(cartActions.addToCart(payload));
    },
    updateSearchCriteria: (paramString) => {
      dispatch(cartActions.updateSearchCriteria(paramString));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchProperty);
