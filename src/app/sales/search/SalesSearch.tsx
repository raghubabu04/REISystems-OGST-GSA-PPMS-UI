import React, { useContext, useEffect } from "react";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { saleActions } from "../../../_redux/_actions/sale.actions";
import { bindActionCreators } from "redux";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { SalesSearchContext } from "./SalesSearchContext";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import {
  regexForTCNandICN,
  salesAttributeOptions,
  salesSearchValues,
} from "../constant/Constants";
import { AdvancedSearchSales } from "./AdvancedSearchSales";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import {
  salesNumberFormatted,
  validateBidderEmail,
  validateItemControlNumber,
} from "./validation/AdvancedSearchValidation";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import SalesListing from "./SalesListing";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { UserApiService } from "../../../api-kit/user/user-api.service";

interface SalesSearchProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
}

const SalesSearch = (props: SalesSearchProps) => {
  let salesApiService = new SalesApiService();
  let userService = new UserApiService();
  const { salesSearchState, updateSalesSearchState } = useContext(
    SalesSearchContext
  );

  useEffect(() => {
    // getZones("all");
    getICNDetailsByZone(salesSearchState.currentPage, salesSearchState.perPage);
    clearSalesAttribute();
  }, []);

  const clearAllSearchResults = async () => {
    clearSalesAttribute();
    updateSalesSearchState({
      icnDetailsList: [],
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      currentPage: 1,
      rowsPerPageOptions: [50, 100, 150, 200],
      defaultZoneId: "all",
      salesAttribute: salesSearchState.salesAttribute,
      itemControlNumber: "",
      icnIsInvalid: false,
      icnIsValid: false,
      icnValidationMessage: "",

      searchType: {
        type: "ALL_WORDS",
      },
      isSearchTypeUpdated: false,
      salesSearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: "",
      vin: "",
      tag: "",
      sales: "",
      lot: "",
      isLotInvalid: false,
      lotValidationMessage: "",
      bidder: {},
      contract: "",
      bidderEmailIsInvalid: false,
      bidderEmailIsValid: false,
      bidderEmailValidationMessage: "",
      bidderEmail: "",
      bidderfName: "",
      bidderlName: "",
      bidderNumber: "",
      showModal: false,
      modalMessage: "",
      selectZoneOptions: [
        {
          value: "All Zones",
          zones: "1,2,3,4,5",
          id: "all",
          isSelected: true,
        },
        {
          value: "Mid Atlantic Zone",
          zones: "1",
          id: "mid",
          isSelected: false,
        },
        {
          value: "Southeast – Great Lakes Zone",
          zones: "2",
          id: "southeast",
          isSelected: false,
        },
        {
          value: "Southwest – Central Zone",
          zones: "3",
          id: "southwest",
          isSelected: false,
        },
        {
          value: "Pacific Rim Zone",
          zones: "4",
          id: "pacific",
          isSelected: false,
        },
        {
          value: "National Capitol Zone",
          zones: "5",
          id: "national",
          isSelected: false,
        },
      ],
    });
    //
    let searchItemCriteria = {};
    let searchLotCriteria = {};
    let searchContractCriteria = {};
    let searchBidderCriteria = {};
    let data = {
      searchType: salesSearchState.salesAttribute,
      zoneId: "all",
      salesSearchLotCriteria: { ...searchLotCriteria },
      salesSearchItemCriteria: { ...searchItemCriteria },
      salesSearchContractCriteria: { ...searchContractCriteria },
      salesSearchBidderCriteria: { ...searchBidderCriteria },
      params: {
        page: 1,
        size: 50,
      },
    };

    try {
      if (salesSearchState.salesAttribute === "Bidder") {
        const getManageBiddersListData = {
          firstName: "",
          lastName: "",
          email: "",
          bidderNumber: "",
          userName: "",
          params: {
            page: 1,
            size: 50,
          },
        };

        let apiRes = await userService.getManageBiddersList(
          getManageBiddersListData
        );

        let filteredRows = apiRes?.data?.manageBiddersList
          ? apiRes.data.manageBiddersList
          : [];
        let totalElements = apiRes?.data?.totalElements
          ? apiRes.data.totalElements
          : 0;
        let totalPages = apiRes?.data?.totalPages ? apiRes.data.totalPages : 0;

        updateSalesSearchState({
          icnDetailsList: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.params.size,
          currentPage: data.params.page,
        });
      } else {
        let apiRes = await salesApiService.searchSalesByCategory(data);
        let propertyDetails = apiRes?.data?.searchResultItemDtoList
          ? apiRes.data.searchResultItemDtoList
          : [];

        let totalElements = apiRes?.data?.totalElements
          ? apiRes.data.totalElements
          : 0;
        let totalPages = apiRes?.data?.totalPages ? apiRes.data.totalPages : 0;
        updateSalesSearchState({
          icnDetailsList: propertyDetails,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.params.size,
          currentPage: data.params.page,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // get icn details by zone
  const getICNDetailsByZone = async (page: number, size: number) => {
    let searchItemCriteria = {};
    let searchLotCriteria = {};
    let searchContractCriteria = {};
    let searchBidderCriteria = {};
    if (salesSearchState.salesAttribute === "Item") {
      let formattedICN = "";
      if (salesSearchState.itemControlNumber !== "") {
        formattedICN = salesSearchState.itemControlNumber.replace(/-/g, "");
      }
      searchItemCriteria = {
        keyword: salesSearchState.advancedSearchText,
        keywordType: salesSearchState.searchType.type,
        icn: formattedICN,
        vin: salesSearchState.vin,
        tagNumber: salesSearchState.tag,
      };
    }
    if (salesSearchState.salesAttribute === "Sale") {
      let formattedSales;
      if (salesSearchState.sales !== "") {
        formattedSales = salesSearchState.sales.replace(/-/g, "");
      }
      searchLotCriteria = {
        saleNumber: formattedSales,
        lotNumber: salesSearchState.lot,
      };
    }
    if (salesSearchState.salesAttribute === "Contract") {
      searchContractCriteria = {
        contractNumber: salesSearchState.contract,
      };
    }

    if (salesSearchState.salesAttribute === "Bidder") {
      searchBidderCriteria = {
        bidderEmail: salesSearchState.bidderEmail,
        bidderFirstName: salesSearchState.bidderfName,
        bidderLastName: salesSearchState.bidderlName,
        handleBidderNumber: salesSearchState.bidderNumber,
      };
    }

    let data = {
      searchType: salesSearchState.salesAttribute,
      zoneId:
        salesSearchState.salesAttribute !== "Bidder"
          ? salesSearchState.zoneList[0].id === "all"
            ? salesSearchState.defaultZoneId
            : salesSearchState.zoneList[0].zones
          : "",
      salesSearchLotCriteria: { ...searchLotCriteria },
      salesSearchItemCriteria: { ...searchItemCriteria },
      salesSearchContractCriteria: { ...searchContractCriteria },
      salesSearchBidderCriteria: { ...searchBidderCriteria },
      params: {
        page: page,
        size: size,
      },
    };

    try {
      if (salesSearchState.salesAttribute === "Bidder") {
        const getManageBiddersListData = {
          firstName: salesSearchState.bidderfName,
          lastName: salesSearchState.bidderlName,
          email: salesSearchState.bidderEmail,
          bidderNumber: salesSearchState.bidderNumber,
          userName: salesSearchState?.bidder?.bidderUsername,
          params: {
            page: page,
            size: size,
          },
        };

        let apiRes = await userService.getManageBiddersList(
          getManageBiddersListData
        );

        let filteredRows = apiRes?.data?.manageBiddersList
          ? apiRes.data.manageBiddersList
          : [];
        let totalElements = apiRes?.data?.totalElements
          ? apiRes.data.totalElements
          : 0;
        let totalPages = apiRes?.data?.totalPages ? apiRes.data.totalPages : 0;

        console.log("apiRes", apiRes);

        updateSalesSearchState({
          icnDetailsList: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.params.size,
          currentPage: data.params.page,
        });
      } else {
        let apiRes = await salesApiService.searchSalesByCategory(data);
        if (apiRes?.data?.searchResultItemDtoList.length === 0) {
          updateSalesSearchState({
            showModal: true,
            modalMessage: "No results found.",
          });
        }
        let propertyDetails = apiRes?.data?.searchResultItemDtoList
          ? apiRes.data.searchResultItemDtoList
          : [];

        let totalElements = apiRes?.data?.totalElements
          ? apiRes.data.totalElements
          : 0;
        let totalPages = apiRes?.data?.totalPages ? apiRes.data.totalPages : 0;
        updateSalesSearchState({
          icnDetailsList: propertyDetails,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.params.size,
          currentPage: data.params.page,
        });
      }
    } catch (error) {
      console.error("Main Search Button API has error: ", error);
    }
  };

  // when zone value is changed, update the state and set isSelected is true.
  const handleChangeForZones = (value: any) => {
    if (value.value !== null || value.value !== undefined) {
      let zoneType = value.value;
      if (zoneType === "all") {
        getZones("all");
      } else if (zoneType === "mid") {
        getZones("mid");
      } else if (zoneType === "southeast") {
        getZones("southeast");
      } else if (zoneType === "southwest") {
        getZones("southwest");
      } else if (zoneType === "pacific") {
        getZones("pacific");
      } else if (zoneType === "national") {
        getZones("national");
      } else {
        getZones("all");
      }
    }
  };
  // get zone id based on zoneId parameter from selectZoneOptions.
  const getZones = (zoneId: string) => {
    let zone = salesSearchState.selectZoneOptions.filter(
      (option) => option.id === zoneId
    );
    setIsSelectTrue(zone);
    let data = {
      searchType: salesSearchState.salesAttribute,
      zoneId: zone[0].id !== "all" ? zone[0].zones : zone[0].id,
      salesSearchLotCriteria: {
        lotNumber: salesSearchState.lot,
        saleNumber: salesSearchState.sales,
      },
      salesSearchItemCriteria: {
        icn: salesSearchState.itemControlNumber,
        keyword: salesSearchState.advancedSearchText,
        keywordType: salesSearchState.searchType.type,
        tagNumber: salesSearchState.tag,
        vin: salesSearchState.vin,
      },
      salesSearchContractCriteria: {
        contractNumber: salesSearchState.contract,
      },
      params: {
        page: 1,
        size: 50,
      },
    };

    salesApiService
      .searchSalesByCategory(data)
      .then((icn) => {
        if (icn?.data?.searchResultItemDtoList.length === 0) {
          updateSalesSearchState({
            showModal: true,
            modalMessage: "No results found.",
          });
        }
        let propertyDetails =
          icn && icn.data && icn.data.searchResultItemDtoList
            ? icn.data.searchResultItemDtoList
            : [];

        let totalElements =
          icn && icn.data && icn.data.totalElements
            ? icn.data.totalElements
            : 0;
        let totalPages =
          icn && icn.data && icn.data.totalPages ? icn.data.totalPages : 0;
        updateSalesSearchState({
          icnDetailsList: propertyDetails,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.params.size,
          currentPage: data.params.page,
          zoneList: zone,
          defaultZoneId: zone[0].id,
        });
      })
      .catch((error) => console.log(error));
  };
  // set isSelected true for the selected zone, set others to false
  const setIsSelectTrue = (zone: any) => {
    salesSearchState.selectZoneOptions.filter((option) =>
      option.id === zone[0].id
        ? (option.isSelected = true)
        : (option.isSelected = false)
    );
  };
  // set isSelected to true if attribute is selected and clear other values
  const handleSalesAttributes = async (value: any) => {
    let salesAttribute: any;
    salesAttributeOptions.forEach((option) => {
      if (option.isSelected) {
        salesAttribute = option;
      }
    });
    handleAdvancedClearBtnClick();
    updateSalesSearchState({ salesAttribute: salesAttribute.id });
    let data = {
      searchType: salesAttribute.id,
      zoneId:
        salesAttribute.id !== "Bidder"
          ? salesSearchState.zoneList[0].id === "all"
            ? salesSearchState.defaultZoneId
            : salesSearchState.zoneList[0].zones
          : "",
      salesSearchLotCriteria: {},
      salesSearchItemCriteria: {},
      salesSearchContractCriteria: {},
      salesSearchBidderCritiera: {},
      params: {
        page: 1,
        size: 50,
      },
    };

    const getManageBiddersListData = {
      firstName: salesSearchState.bidderfName,
      lastName: salesSearchState.bidderlName,
      email: salesSearchState.bidderEmail,
      bidderNumber: salesSearchState.bidderNumber,
      params: {
        page: 1,
        size: 50,
      },
    };

    try {
      if (salesAttribute.id === "Bidder") {
        let apiRes = await userService.getManageBiddersList(
          getManageBiddersListData
        );

        let filteredRows = apiRes?.data?.manageBiddersList
          ? apiRes.data.manageBiddersList
          : [];
        let totalElements = apiRes?.data?.totalElements
          ? apiRes.data.totalElements
          : 0;
        let totalPages = apiRes?.data?.totalPages ? apiRes.data.totalPages : 0;

        updateSalesSearchState({
          icnDetailsList: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.params.size,
          currentPage: data.params.page,
        });
      } else {
        let apiRes = await salesApiService.searchSalesByCategory(data);
        if (
          apiRes?.data?.searchResultItemDtoList === null ||
          apiRes?.data?.searchResultItemDtoList.length === 0
        ) {
          updateSalesSearchState({
            showModal: true,
            modalMessage: "No results found.",
          });
        }
        let propertyDetails = apiRes?.data?.searchResultItemDtoList
          ? apiRes.data.searchResultItemDtoList
          : [];

        let totalElements = apiRes?.data?.totalElements
          ? apiRes.data.totalElements
          : 0;
        let totalPages = apiRes?.data?.totalPages ? apiRes.data.totalPages : 0;
        updateSalesSearchState({
          icnDetailsList: propertyDetails,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.params.size,
          currentPage: data.params.page,
        });
      }
    } catch (error) {
      console.error("API call on handleSalesAttributes has an error", error);
    }
  };

  // when clear all or filter by clicked, set filter by to default attribute "item".
  const clearSalesAttribute = () => {
    salesAttributeOptions.forEach((option) => {
      if (option.id === "Item") {
        option.isSelected = true;
      } else {
        option.isSelected = false;
      }
    });
  };
  // set all state value to default.
  const handleAdvancedClearBtnClick = () => {
    updateSalesSearchState({
      icnIsInvalid: false,
      icnIsValid: false,
      icnValidationMessage: "",
      itemControlNumber: "",
      advancedSearchText: "",
      vin: "",
      tag: "",
      sales: "",
      lot: "",
      contract: "",
      bidderEmailIsInvalid: false,
      bidderEmailIsValid: false,
      bidderEmailValidationMessage: "",
      bidderEmail: "",
      bidderfName: "",
      bidderlName: "",
      bidderNumber: "",
      bidder: {
        bidderId: 0,
        userName: "",
        bidderName: "",
        bidderUsername: "",
        registrationType: "",
        bidderAddress: "",
        bidderStatus: "",
        bidderUserIdsOptions: [],
        selectedUserId: "",
        bidderUserIds: [],
        showBidderUserIds: false,
        showBidder: false,
      },
    });
  };
  // Main search function
  const handleMainSearch = (event) => {
    getICNDetailsByZone(salesSearchState.currentPage, salesSearchState.perPage);
  };

  const handleBidderNumber = (event) => {
    let bidderNumber = event.target.value;
    const bNumberRegex = regexForTCNandICN;
    let bidderNumberInput = bidderNumber.replace(bNumberRegex, "");
    updateSalesSearchState({
      bidderNumber: bidderNumberInput.toUpperCase(),
    });
  };

  const handleBidderLName = (event) => {
    let lName = event.target.value;
    const lNameRegex = regexForTCNandICN;
    let lNameVal = lName.replace(lNameRegex, "");
    updateSalesSearchState({
      bidderlName: lNameVal,
    });
  };

  const handleBidderFName = (event) => {
    let fName = event.target.value;
    const fNameRegex = regexForTCNandICN;
    let fNameVal = fName.replace(fNameRegex, "");
    updateSalesSearchState({
      bidderfName: fNameVal,
    });
  };

  const handleBidderEmail = (event) => {
    let emailAddress = event.target.value;
    let validation = validateBidderEmail(emailAddress);
    updateSalesSearchState({
      bidderEmail: emailAddress,
      bidderEmailIsInvalid: validation.isInvalid,
      bidderEmailIsValid: !validation.isInvalid,
      bidderEmailValidationMessage: validation.validationError,
    });
  };
  const handleUserIdChange = async (values) => {
    const { addToast } = props.actions;
    let selectedUserId = values
      .filter((item) => item.isSelected === true)
      .map((item) => {
        return item.value;
      });
    salesSearchState.bidder.selectedUserId = selectedUserId;
    updateSalesSearchState(salesSearchState);

    try {
      let getBidderUserByUserIdRes = await userService.getBidderUserByUserId(
        selectedUserId
      );
      salesSearchState.bidder.showBidder = true;
      let bidderDetails = getBidderUserByUserIdRes?.data
        ? getBidderUserByUserIdRes?.data
        : null;
      salesSearchState.bidder.bidderId = bidderDetails.bidderId
        ? bidderDetails.bidderId
        : null;
      salesSearchState.bidder.bidderName = `${
        bidderDetails?.bidderFirstName ? bidderDetails.bidderFirstName : null
      } ${bidderDetails.bidderLastName}`;

      salesSearchState.bidder.registrationType = bidderDetails?.registrationType
        ?.registrationType
        ? bidderDetails?.registrationType?.registrationType
        : null;

      salesSearchState.bidder.bidderUsername = bidderDetails?.userName
        ? bidderDetails?.userName
        : null;
      salesSearchState.bidder.bidderAddress =
        bidderDetails?.address?.addressLine1 +
        "" +
        bidderDetails?.address?.addressLine2 +
        " , " +
        bidderDetails?.address?.city +
        " , " +
        bidderDetails?.address?.stateCode +
        "-" +
        bidderDetails?.address?.zip;
      salesSearchState.bidder.bidderStatus = bidderDetails?.status
        ? bidderDetails?.status?.status
        : null;
      updateSalesSearchState(salesSearchState);
    } catch (error) {
      salesSearchState.bidder.userName = null;
      salesSearchState.bidder.showBidder = false;
      updateSalesSearchState(salesSearchState);
      addToast({
        text: `Bidder not found`,
        type: "error",
        heading: "Error",
      });
      console.log(error);
    }
  };

  const searchEmail = async () => {
    const { addToast } = props.actions;
    if (
      !salesSearchState?.bidderEmailIsInvalid &&
      salesSearchState.bidderEmail !== ""
    ) {
      try {
        let getBidderUserIdsByEmailIdRes = await userService.getBidderUserIdsByEmailId(
          salesSearchState.bidderEmail
        );

        salesSearchState.bidder.bidderUserIds =
          getBidderUserIdsByEmailIdRes.data;
        //setBidderUserIds(response.data);
        if (getBidderUserIdsByEmailIdRes?.data?.length > 1) {
          salesSearchState.bidder.showBidderUserIds = true;
          let userIdOptions = getBidderUserIdsByEmailIdRes.data.map(
            (userId) => {
              return {
                value: userId,
                id: userId,
                isSelected: false,
              };
            }
          );
          salesSearchState.bidder.bidderUserIdsOptions = userIdOptions;
          updateSalesSearchState(salesSearchState);
        } else if (getBidderUserIdsByEmailIdRes?.data?.length == 1) {
          salesSearchState.bidder.showBidderUserIds = false;
          salesSearchState.bidder.selectedUserId =
            getBidderUserIdsByEmailIdRes.data?.[0];
          updateSalesSearchState(salesSearchState);
        }
      } catch (error) {
        salesSearchState.bidder.userName = null;
        salesSearchState.bidder.showBidder = false;
        updateSalesSearchState(salesSearchState);
        addToast({
          text: `Bidder not found`,
          type: "error",
          heading: "Error",
        });
        console.log(error);
      }
    }
  };
  const handleContract = (event) => {
    let contract = event.target.value;
    const contractRegex = regexForTCNandICN;
    let contractVal = contract.replace(contractRegex, "");
    updateSalesSearchState({
      contract: contractVal.toUpperCase(),
    });
  };

  const handleSales = (event) => {
    let salesValue = event.target.value;
    let lotVal = salesValue.replace(regexForTCNandICN, "");
    let formattedicnValue;
    if (salesValue.length === 0) {
      updateSalesSearchState({
        lot: "",
      });
    }
    updateSalesSearchState({
      sales: lotVal.toUpperCase(),
    });
    formattedicnValue = salesNumberFormatted(lotVal);
    if (formattedicnValue !== "") {
      updateSalesSearchState({
        sales: formattedicnValue.toUpperCase(),
      });
    }
  };

  const handleLot = (event) => {
    let lot = event.target.value;
    let lotVal = lot.replace(regexForTCNandICN, "");
    let validation = {
      isInvalid: false,
      validationMessage: "",
    };
    if (!/[^0. ]+/g.test(lotVal)) {
      validation.isInvalid = true;
      validation.validationMessage = "Lot number cannot be zero";
    }
    updateSalesSearchState({
      lot: lotVal.toUpperCase(),
      isLotInvalid: validation.isInvalid,
      lotValidationMessage: validation.validationMessage,
    });
  };

  const handleVIN = (event) => {
    let vin = event.target.value;
    let vinVal = vin.replace(regexForTCNandICN, "");
    updateSalesSearchState({
      vin: vinVal.toUpperCase(),
    });
  };

  const handleTag = (event) => {
    let tag = event.target.value;
    let tagVal = tag.replace(regexForTCNandICN, "");
    updateSalesSearchState({
      tag: tagVal.toUpperCase(),
    });
  };

  const handleICN = (event) => {
    let icnValue = event.target.value;
    let validation = validateItemControlNumber(icnValue);
    let formattedicnValue;
    let icnVal = icnValue.replace(regexForTCNandICN, "");
    updateSalesSearchState({
      itemControlNumber: icnVal.toUpperCase(),
      icnIsInvalid: validation.isInvalid,
      icnIsValid: !validation.isInvalid,
      icnValidationMessage: validation.validationError,
    });
    if (icnVal.length === 14) {
      formattedicnValue =
        icnVal.substring(0, 6) +
        "-" +
        icnVal.substring(6, 10) +
        "-" +
        icnVal.substring(10, 14);
      updateSalesSearchState({
        itemControlNumber: formattedicnValue.toUpperCase(),
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
      updateSalesSearchState({
        itemControlNumber: formattedicnValue.toUpperCase(),
      });
    }
  };

  // set searchType value in state when searchType is changed(All Words, Exact Words, Any Words)
  const handleAdvancedSearchSelect = (event) => {
    let value = event.target.options[event.target.selectedIndex].id;
    updateSalesSearchState({
      searchType: {
        type: value,
      },
      isSearchTypeUpdated: true,
    });
    handleSearchTypeWithAllCaps();
  };
  const handleSearchTypeWithAllCaps = () => {
    let salesSearchTypeAdvanced;
    salesSearchValues.forEach((m) => {
      if (salesSearchState.searchType.type !== "") {
        if (m.value === salesSearchState.searchType.type) {
          salesSearchTypeAdvanced = m.caps;
        }
      } else {
        salesSearchTypeAdvanced = "ALL_WORDS";
      }
    });
    updateSalesSearchState({
      salesSearchTypeAdvanced: salesSearchTypeAdvanced,
    });
  };

  // set advancedSearchText when user types in the search bar
  const handleAdvancedSearchOnChange = (event) => {
    let advancedSearchText = event.target.value;
    handleSearchTypeWithAllCaps();
    updateSalesSearchState({
      advancedSearchText: advancedSearchText,
    });
  };

  // On page change
  const onChangePage = (page: any, pageSize: any) => {
    getICNDetailsByZone(page, pageSize);
    updateSalesSearchState({
      currentPage: page,
      perPage: pageSize,
    });
  };
  const handleClose = (event) => {
    updateSalesSearchState({
      showModal: false,
    });
  };

  const getSalesAttributeOptions = () => {
    salesAttributeOptions.forEach((salesAttributeOption) => {
      salesAttributeOption.isSelected =
        salesSearchState.salesAttribute === salesAttributeOption.id;
    });
    return salesAttributeOptions;
  };

  return (
    <div className={"ui-ppms"}>
      <h1>Sales Search</h1>
      <div className="grid-row grid-gap-2">
        <div className="grid-col-12 tabs-conversion tab-less-than">
          <PPMSToggleRadio
            id={"filter-by-salesAttributeType"}
            options={getSalesAttributeOptions()}
            isInline={false}
            isDisabled={false}
            name={"salesAttributeType"}
            className={""}
            validationMessage={""}
            isSingleSelect={true}
            isRequired={true}
            onChange={(event) => handleSalesAttributes(event)}
          />
        </div>
      </div>
      {salesSearchState.salesAttribute === "Item" && (
        <div className="grid-row">
          <div className="ppms-select-position grid-col-2">
            <PPMSSelect
              id={"select-sales-type"}
              title={"select-sales-type"}
              label={null}
              values={salesSearchValues}
              identifierKey={"caps"}
              identifierValue={"value"}
              isInvalid={false}
              isValid={false}
              isRequired={false}
              disabled={false}
              selectedValue={salesSearchState.salesSearchTypeAdvanced}
              selectName={"searchtype"}
              validationMessage={""}
              onChange={handleAdvancedSearchSelect}
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
              value={salesSearchState.advancedSearchText}
              onChange={handleAdvancedSearchOnChange}
              maxLength={50}
            />
          </div>
        </div>
      )}
      {salesSearchState.salesAttribute !== "Bidder" && (
        <div className={"grid-row grid-gap-2"}>
          <div className={"grid-col-4 head-filter"}>
            <PPMSSelect
              label={"ZONE:"}
              identifierKey={"id"}
              identifierValue={"value"}
              values={salesSearchState.selectZoneOptions}
              isRequired={true}
              validationMessage={""}
              selectedValue={salesSearchState.defaultZoneId}
              onChange={(event) => handleChangeForZones(event.target)}
            />
          </div>
        </div>
      )}
      <div className="grid-row">
        <div className="grid-col-12">
          <div className="salesSearchAccordion">
            <AdvancedSearchSales
              attributeName={salesSearchState.salesAttribute}
              // ICN
              handleICN={(event) => handleICN(event)}
              icn={salesSearchState.itemControlNumber}
              icnIsInvalid={salesSearchState.icnIsInvalid}
              icnIsValid={!salesSearchState.icnIsValid}
              icnValidationMessage={salesSearchState.icnValidationMessage}
              // VIN
              vin={salesSearchState.vin}
              handleVIN={(event) => handleVIN(event)}
              // Tag
              tag={salesSearchState.tag}
              handleTag={(event) => handleTag(event)}
              // sales
              sales={salesSearchState.sales}
              handleSales={(event) => handleSales(event)}
              // lot
              lot={salesSearchState.lot}
              isLotInvalid={salesSearchState.isLotInvalid}
              lotValidationMessage={salesSearchState.lotValidationMessage}
              handleLot={(event) => handleLot(event)}
              // contract
              contract={salesSearchState.contract}
              handleContract={(event) => handleContract(event)}
              // bidder email
              bidderEmailIsInvalid={salesSearchState.bidderEmailIsInvalid}
              bidderEmailIsValid={salesSearchState.bidderEmailIsValid}
              bidderEmailValidationMessage={
                salesSearchState.bidderEmailValidationMessage
              }
              bidderEmail={salesSearchState.bidderEmail}
              handleBidderEmail={(event) => handleBidderEmail(event)}
              // bidder first name
              bidderfName={salesSearchState.bidderfName}
              handleBidderFName={(event) => handleBidderFName(event)}
              // bidder last name
              bidderlName={salesSearchState.bidderlName}
              handleBidderLName={(event) => handleBidderLName(event)}
              // bidder number
              bidderNumber={salesSearchState.bidderNumber}
              handleBidderNumber={(event) => handleBidderNumber(event)}
              bidderNumberIsInvalid={salesSearchState.bidderNumberIsInvalid}
              bidderNumberIsValid={salesSearchState.bidderNumberIsValid}
              bidderNumberValidationMessage={
                salesSearchState.bidderNumberValidationMessage
              }
              salesSearchState={salesSearchState}
              updateSalesSearchState={updateSalesSearchState}
              handleUserIdChange={(event) => handleUserIdChange(event)}
              searchEmail={() => searchEmail()}
            />
          </div>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col text-center margin-top-2">
          <PPMSButton
            id={"property-main-search"}
            label={"Search"}
            onPress={(event) => handleMainSearch(event)}
            variant={"primary"}
            size="lg"
          />
          <PPMSButton
            id={"Search"}
            label={"Clear All"}
            onPress={clearAllSearchResults}
            variant={"secondary"}
            size="lg"
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12">
          <SalesListing
            salesAttribute={salesSearchState.salesAttribute}
            items={salesSearchState.icnDetailsList}
            title={"Sales listing"}
            page={salesSearchState.currentPage}
            totalRows={salesSearchState.totalRows}
            totalPages={salesSearchState.totalPages}
            rowsPerPage={salesSearchState.perPage}
            rowsPerPageOptions={salesSearchState.rowsPerPageOptions}
            onChangePage={(page, size) => onChangePage(page, size)}
          />
        </div>
      </div>
      <PPMSModal
        body={salesSearchState.modalMessage}
        id={"sales-search-icn-modal"}
        show={salesSearchState.showModal}
        handleClose={(event) => handleClose(event)}
        handleSave={(event) => handleClose(event)}
        labelCancelVariant="hide"
        title={"Sales Search"}
        label={"Ok"}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(
        saleActions.updateSaleInfo(saleId, saleNumber, saleAction, zone)
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesSearch);
