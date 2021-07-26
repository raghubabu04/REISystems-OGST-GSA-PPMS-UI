import React, { useEffect, useState } from "react";
import { ToggleCategory } from "../../property/search-property/ToggleCategory";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import PPMSPagination from "../../../ui-kit/components/common/pagination/PPMS-pagination";
import { AuctionPreviewTile } from "./AuctionPreviewTile";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { SearchAuction } from "./components/SearchAuction";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { history } from "../../../_redux/_helpers/history";
import {
  AuctionPreviewState,
  defaultAuctionPreviewState,
} from "./AuctionPreviewState";
import { advancedSearchValues } from "../../property/create-update-property/constants/Constants";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";

import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";

import { cartActions } from "../../../_redux/_actions/cart.actions";
import moment from "moment";
import _, { size } from "lodash";
import {
  advancedSearchValuesMap,
  auctionTypeOptions,
  bidOptions,
  LotStatusId,
  populateZipCode,
} from "./constants/AuctionPreviewConstant";
import { Paths } from "../../Router";
import { boolean } from "yup";
export interface ActionReviewProps {
  location?: any;
  router?: any;
  saleNumber?: any;
  updateSearchCriteria?: any;
  stateCode?: any;
  categoryCode?: any;
  auctionStatus?: any;
}

function AuctionPreview(props: ActionReviewProps) {
  const [categories, setCategories] = useState<any[]>([]);

  const [categorySelectionChanged, setCategorySelectionChanged] = useState<
    boolean
  >(false);

  const [auctionPreviewState, setAuctionPreviewState] = useState<
    AuctionPreviewState
  >(defaultAuctionPreviewState);

  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  const [page, setPage] = useState<number>(1);

  const [searchModal, setSearchModal] = useState<boolean>(false);

  const [totalRows, setTotalRows] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(50);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [auctions, setAuctions] = useState<Array<any>>([]);

  const query = props?.router?.location?.query;

  function updateAuctionReviewState(newState: any) {
    setAuctionPreviewState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  const auctionsApiService = new AuctionsApiService();

  const commonApiService = new CommonApiService();

  let whichPageText: string = "Auctions";

  const getAuctions = async (data: any) => {
    setIsLoading(true);
    let apiResponse = await auctionsApiService.previewAuctions(data);
    let auctions = apiResponse?.data?.auctionDTOList;
    let auctionsLength = auctions?.length;

    if (auctionsLength === 0) {
      setSearchModal(true);
      setRowsPerPage(50);
    }
    setRowsPerPage(data?.params?.size);
    setAuctions(auctions);
    setCurrentPage(apiResponse?.data?.currentPageNumber);
    setPage(apiResponse?.data?.currentPageNumber);
    setTotalRows(
      apiResponse?.data?.totalElements > 0
        ? apiResponse?.data?.totalElements
        : 0
    );
    setIsLoading(false);
    let categories: any[] = apiResponse.data.lotAuctionsCategoryCountDTOList.map(
      (item: any) => {
        return {
          value: item.categoryName + `(${item.total})`,
          categoryName: item.categoryName.trim(),
          id: item.categoryCode,
          isSelected: item.isSelected,
          isDisabled: item.count === 0 && item.total === 0,
          count: item.count,
        };
      }
    );
    setCategories(categories);
  };

  useEffect(() => {
    if (Object.keys(query).length === 0) {
      let data = prepareParamsForSearch(
        auctionPreviewState.selectedCategoryValues,
        page,
        rowsPerPage
      );
      getAuctions(data);
    } else {
      let data = payLoadByQueryParameters();
      getAuctions(data);
    }
    requiredApiData();
  }, []);

  function payLoadByQueryParameters() {
    let stateCodes = [];
    let categoryCodes = [];
    if (Object.keys(query).length !== 0) {
      stateCodes = query["states"]
        ? query["states"]?.toString()?.trim()?.length !== 0
          ? query["states"]?.toString().split(",")
          : []
        : [];
      categoryCodes = query["categoryCodes"]
        ? query["categoryCodes"]?.toString()?.trim()?.length !== 0
          ? query["categoryCodes"]?.toString().split(",")
          : []
        : [];
    }
    let page = query["page"] ? query["page"].toString() : 1;
    let size = query["size"] ? query["size"].toString() : 50;
    let auctionSearchTypeAdvanced = query["searchType"]
      ? query["searchType"].toString()
      : "";
    let advancedSearchText = query["searchText"]
      ? decodeURI(query["searchText"].toString())
      : "";
    let zipCode = query["zipCode"] ? query["zipCode"].toString() : "";
    let radius = query["radius"] ? query["radius"].toString() : "";
    let minPrice = query["minPrice"] ? query["minPrice"].toString() : "";
    let maxPrice = query["maxPrice"] ? query["maxPrice"].toString() : "";
    let status = query["status"]
      ? query["status"].toString()
      : LotStatusId.ALL_AUCTIONS;
    let bidDeposit = query["bidDeposit"]
      ? query["bidDeposit"].toString() === "true"
      : null;
    let saleNumber = query["saleNumber"] ? query["saleNumber"].toString() : "";
    let auctionEndDateFrom = query["auctionEndDateFrom"]
      ? query["auctionEndDateFrom"].toString()
      : "";
    let auctionEndDateTo = query["auctionEndDateTo"]
      ? query["auctionEndDateTo"].toString()
      : "";
    let auctionStatus = query["status"] ? query["status"].toString() : "all";
    bidOptions.forEach((item) => {
      if (bidDeposit) {
        if (bidDeposit && item.id === "Y") {
          item.isSelected = true;
        } else if (!bidDeposit && item.id === "N") {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
      } else {
        item.isSelected = false;
      }
    });

    auctionTypeOptions.forEach((item) => {
      if (item.id === status) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    updateAuctionReviewState({
      searchType: auctionSearchTypeAdvanced,
      advancedSearchType: advancedSearchValuesMap.get(
        auctionSearchTypeAdvanced
      ),
      advancedSearchText: advancedSearchText,
      zipCode: zipCode,
      selectedRadius: radius,
      minimumValue: minPrice,
      maximumValue: maxPrice,
      bidDeposit: bidDeposit,
      saleNumber: saleNumber,
      fromDate: auctionEndDateFrom,
      toDate: auctionEndDateTo,
      selectedCategoryValues: categoryCodes,
      selectedStateValues: stateCodes,
      lotStatus: auctionStatus,
      bidOptions: bidOptions,
      auctionTypeOptions: auctionTypeOptions,
      toggleExpanded: true,
    });
    setPage(page);
    setCurrentPage(page);
    setRowsPerPage(size);

    let parameters = {
      categoryCodeList: categoryCodes,
      auctionSearchTypeAdvanced: auctionSearchTypeAdvanced,
      advancedSearchText: advancedSearchText.trim(),
      zipCode: zipCode,
      radius: radius,
      minPrice: minPrice,
      maxPrice: maxPrice,
      bidDeposit: bidDeposit,
      saleNumber: saleNumber,
      states: stateCodes,
      auctionEndDateFrom: moment(auctionEndDateFrom).startOf("day").toDate(),
      auctionEndDateTo: moment(auctionEndDateTo).endOf("day").toDate(),
      auctionStatus: auctionStatus,
      params: {
        page: page,
        size: size,
      },
    };

    return parameters;
  }

  function generateQueryParams(params) {
    let location = {
      pathname: Paths.auctionsList,
    };
    let queryString = generateQueryParamString(params);
    location["search"] = queryString;
    history.push(location);
  }

  function generateQueryParamString(params) {
    let queryString = "";
    if (params?.params?.page && params?.params?.size) {
      queryString +=
        "page=" + params.params.page + "&size=" + params?.params?.size;
    }

    if (params?.auctionSearchTypeAdvanced) {
      queryString += "&searchType=" + params?.auctionSearchTypeAdvanced;
    }

    if (params?.advancedSearchText) {
      queryString += "&searchText=" + params?.advancedSearchText;
    }

    if (params?.auctionStatus) {
      queryString += "&status=" + params?.auctionStatus;
    }

    if (params?.zipCode) {
      queryString += "&zipCode=" + params?.zipCode;
    }

    if (params?.radius) {
      queryString += "&radius=" + params?.radius;
    }

    if (params?.minPrice) {
      queryString += "&minPrice=" + params?.minPrice;
    }

    if (params?.maxPrice) {
      queryString += "&maxPrice=" + params?.maxPrice;
    }

    if (params?.bidDeposit) {
      queryString += "&bidDeposit=" + params?.bidDeposit;
    }

    if (params?.saleNumber) {
      queryString += "&saleNumber=" + params?.saleNumber;
    }
    if (params?.categoryCodeList) {
      if (params?.categoryCodeList.length !== 0) {
        queryString += "&categoryCodes=" + params?.categoryCodeList;
      }
    }
    if (params?.states) {
      if (params?.states.length !== 0) {
        queryString += "&states=" + params?.states;
      }
    }

    if (params?.auctionEndDateFrom) {
      queryString += "&auctionEndDateFrom=" + params?.auctionEndDateFrom;
    }

    if (params?.auctionEndDateTo) {
      queryString += "&auctionEndDateTo=" + params?.auctionEndDateTo;
    }
    return queryString;
  }

  function requiredApiData() {
    commonApiService
      .getAuctionCategories()
      .then((response) => {
        let individualCategory = response.data.map((item) => {
          return {
            categoryCode: item.categoryCode,
            categoryName: item.categoryName,
            isSelected: false,
          };
        });
        updateAuctionReviewState({
          catergoryOptions: individualCategory,
        });
        if (Object.keys(query).length !== 0) {
          let categoryCodes =
            query["categoryCodes"]?.toString()?.trim()?.length !== 0
              ? query["categoryCodes"]?.toString().split(",")
              : [];
          if (categoryCodes) {
            let selectedCategoryList = individualCategory.filter((item) =>
              categoryCodes.includes(item.categoryCode.toString())
            );
            updateAuctionReviewState({
              selectedCategoryOptions: selectedCategoryList,
              selectedCategoryValues: categoryCodes,
            });
          }
        }
      })
      .catch(() => {});

    commonApiService
      .getStateList()
      .then((resp) => {
        let individualState = resp.data.map((item) => {
          return {
            value: item.stateCode,
            state: item.stateName,
            id: item.stateCode,
            isSelected: false,
          };
        });
        updateAuctionReviewState({
          stateOptions: individualState,
        });
        if (Object.keys(query).length !== 0) {
          let stateCodes =
            query["states"]?.toString()?.trim()?.length !== 0 &&
            Object.keys(query).length !== 0
              ? query["states"]?.toString().split(",")
              : [];
          if (stateCodes) {
            let selectedStateList = individualState.filter((item) =>
              stateCodes.includes(item.value)
            );
            updateAuctionReviewState({
              selectedStateOptions: selectedStateList,
              selectedStateValues: stateCodes,
            });
          }
        }
      })
      .catch(() => {});
  }

  const handleAllocationsPageChange = async (
    page?: number,
    pageSize?: number
  ) => {
    let data = prepareParamsForSearch(
      selectedCategories,
      // auctionPreviewState.selectedCategoryValues,
      page,
      pageSize
    );
    getAuctions(data);
  };

  function handleAdvancedSearchSelect(event) {
    let value = event.target.options[event.target.selectedIndex].text;
    updateAuctionReviewState({
      searchType: value,
      advancedSearchType: advancedSearchValuesMap.get(value),
    });
  }

  function handleBidDeposit(event) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateAuctionReviewState({
          bidRequired: e.id === "Y" ? true : false,
        });
      }
    });
  }

  function handleRadius(event) {
    updateAuctionReviewState({
      selectedRadius: event.target.value,
    });
  }

  function handleCategory(selectedCategory) {
    let selectedCategoryOptions = [];
    let selectedCategoryValues = [];
    selectedCategory.forEach((e) => {
      selectedCategoryOptions.push(e);
      selectedCategoryValues.push(e.categoryCode);
    });
    updateAuctionReviewState({
      selectedCategoryOptions: selectedCategoryOptions,
      selectedCategoryValues: selectedCategoryValues,
    });
  }

  function handleState(selectedStates) {
    let selectedStateOptions = [];
    let selectedStateValues = [];
    selectedStates.forEach((e) => {
      selectedStateOptions.push(e);
      selectedStateValues.push(e.id);
    });
    updateAuctionReviewState({
      selectedStateOptions: selectedStateOptions,
      selectedStateValues: selectedStateValues,
    });
  }

  function handleAuctionType(event) {
    event.forEach((item) => {
      if (item.isSelected) {
        if (item.id === LotStatusId.CLOSED_AUCTION) {
          updateAuctionReviewState({
            lotStatus: item.id,
          });
        } else {
          updateAuctionReviewState({
            lotStatus: item.id,
            toDate: "",
            fromDate: "",
          });
        }
      }
    });
  }

  function onBlurZipCode() {
    let zipCode = populateZipCode(auctionPreviewState.zipCode);

    updateAuctionReviewState({
      zipCode: zipCode,
      selectedRadius: zipCode ? auctionPreviewState.selectedRadius : "",
    });
    if (zipCode) {
      commonApiService.getZipCode(zipCode).then((res) => {
        if (res?.data.length !== 0) {
          updateAuctionReviewState({
            showAlert: false,
            alertBody: "",
          });
        } else {
          updateAuctionReviewState({
            showAlert: true,
            alertBody: "Please enter a valid zipcode",
          });
        }
      });
    } else {
      updateAuctionReviewState({
        showAlert: false,
        alertBody: "",
      });
    }
  }

  function updateToDate(value) {
    updateAuctionReviewState({
      toDate: value,
    });
  }

  function updateFromDate(value) {
    updateAuctionReviewState({
      fromDate: value,
    });
  }

  const handleSearch = (page, size, noProps) => {
    if (!auctionPreviewState.showAlert) {
      if (auctionPreviewState.selectedCategoryValues.length === 0) {
        getAuctionData([], page, size, noProps);
        generateQueryParams(prepareParamsForSearch([], page, size, true));
      } else {
        getAuctionData(
          auctionPreviewState.selectedCategoryValues,
          page,
          size,
          noProps
        );
        generateQueryParams(
          prepareParamsForSearch(
            auctionPreviewState.selectedCategoryValues,
            page,
            size,
            true
          )
        );
      }
    }
  };

  function getAuctionData(
    categories?: any,
    page?: number,
    size?: number,
    noProps = false
  ) {
    let param = prepareParamsForSearch(categories, page, size, noProps);
    getAuctions(param);
  }

  function prepareParamsForSearch(
    categories?: any,
    page?: number,
    size?: number,
    noProps = false
  ) {
    let parameters = {
      categoryCodeList: noProps
        ? categories
        : categories.length === 0
        ? props.categoryCode
          ? [props.categoryCode]
          : categories
        : categories,
      auctionSearchTypeAdvanced: auctionPreviewState.advancedSearchType,
      advancedSearchText: auctionPreviewState.advancedSearchText.trim(),
      zipCode: auctionPreviewState.zipCode,
      radius: auctionPreviewState.selectedRadius,
      minPrice: auctionPreviewState.minimumValue,
      maxPrice: auctionPreviewState.maximumValue,
      saleNumber: auctionPreviewState.saleNumber
        ? auctionPreviewState.saleNumber
        : props.saleNumber
        ? props.saleNumber
        : "",
      bidDeposit: auctionPreviewState.bidRequired,
      states: noProps
        ? auctionPreviewState.selectedStateValues
        : auctionPreviewState.selectedStateValues.length === 0
        ? props.stateCode
          ? [props.stateCode]
          : auctionPreviewState.selectedStateValues
        : auctionPreviewState.selectedStateValues,
      auctionEndDateFrom: auctionPreviewState.fromDate
        ? moment(auctionPreviewState.fromDate, "MM/DD/YYYY").format(
            "YYYY-MM-DDT00:00:00.000"
          )
        : "",
      auctionEndDateTo: auctionPreviewState.toDate
        ? moment(auctionPreviewState.toDate, "MM/DD/YYYY").format(
            "YYYY-MM-DDT23:59:59.999"
          )
        : "",
      auctionStatus: noProps
        ? auctionPreviewState?.lotStatus
        : props.auctionStatus
        ? props.auctionStatus
        : "",
      params: {
        page: page ? page : 1,
        size: size ? size : rowsPerPage,
      },
    };
    return parameters;
  }

  function clearParamsForSearch() {
    let location = {
      pathname: Paths.auctionsList,
    };
    props.updateSearchCriteria("");
    location["search"] = "";
    history.push(location);

    let parameters = {
      categoryCodeList: [],
      auctionSearchTypeAdvanced: "ALL_WORDS",
      advancedSearchText: "",
      zipCode: "",
      radius: "",
      minPrice: "",
      maxPrice: "",
      saleNumber: "",
      bidDeposit: "",
      states: [],
      auctionEndDateFrom: "",
      auctionEndDateTo: "",
      auctionStatus: LotStatusId.ALL_AUCTIONS,
      params: {
        page: 1,
        size: 50,
      },
    };
    return parameters;
  }

  function handleClearAll() {
    bidOptions.forEach((e) => {
      e.isSelected = false;
    });
    auctionTypeOptions.forEach((e) => {
      if (e.id === LotStatusId.ALL_AUCTIONS) {
        e.isSelected = true;
      } else {
        e.isSelected = false;
      }
    });
    updateAuctionReviewState({
      bidOptions: bidOptions,
      auctionTypeOptions: auctionTypeOptions,
      advancedSearchType: "ALL_WORDS",
      lotStatus: LotStatusId.ALL_AUCTIONS,
      searchType: "all",
      advancedSearchText: "",
      selectedCategoryOptions: [],
      selectedCategoryValues: [],
      selectedStateOptions: [],
      selectedStateValues: [],
      zipCode: "",
      showAlert: false,
      alertBody: "",
      selectedRadius: "",
      toDate: "",
      fromDate: "",
      minimumValue: "",
      maximumValue: "",
      saleNumber: "",
      bidRequired: null,
      searchModal: false,
      page: 1,
      totalRows: 0,
      rowsPerPage: 50,
      currentPage: 1,
    });
    setCurrentPage(1);
    setPage(1);
    setRowsPerPage(50);
    setCategorySelectionChanged(false);
    let param = clearParamsForSearch();
    getAuctions(param);
  }

  const handleCheckboxToggleChange = (categoryIds: any[]) => {
    setCategorySelectionChanged(true);
    setSelectedCategories(categoryIds);
    getAuctionData(categoryIds, page, rowsPerPage, false);
  };

  const pluralizeResults = (count: number, noun: string, suffix = "s") =>
    `${count} ${noun}${count !== 1 && count !== 0 ? suffix : ""}`;

  return (
    <div className="grid-conatiner ui-ppms">
      <div className="grid-row grid-gap-4 temp-row tabs-conversion">
        <PPMSToggleRadio
          id={"filter-by-auctionType"}
          options={auctionPreviewState.auctionTypeOptions}
          isInline={true}
          isDisabled={false}
          name={"auctionType"}
          className={""}
          label={"Filter by:"}
          validationMessage={""}
          isSingleSelect={true}
          onChange={handleAuctionType}
        />
      </div>

      <div className="grid-row grid-gap-4" />
      <div className="grid-row">
        <div className="ppms-select-position grid-col-2">
          <PPMSSelect
            id={"select-type"}
            title={"select-type"}
            label={null}
            values={advancedSearchValues}
            identifierKey={"caps"}
            identifierValue={"value"}
            isInvalid={false}
            isValid={false}
            isRequired={false}
            selectedValue={auctionPreviewState.advancedSearchType}
            selectName={"searchType"}
            validationMessage={""}
            onChange={handleAdvancedSearchSelect}
          />
        </div>
        <div className="grid-col-10">
          <PPMSInput
            title={"name or description"}
            isDisabled={false}
            placeHolder={"Search by Lot Name or Description"}
            id={"advanced-auction-search-id"}
            inputType={"text"}
            isInvalid={false}
            isValid={false}
            isRequired={false}
            value={auctionPreviewState.advancedSearchText}
            onChange={(event) =>
              updateAuctionReviewState({
                advancedSearchText: event.target.value,
              })
            }
            maxLength={40}
          />
        </div>
      </div>
      <br />
      <PPMSAlert
        id={"cart-danger-msg"}
        show={auctionPreviewState.showAlert}
        alertBody={auctionPreviewState.alertBody}
        alertClassName={"cart-error"}
        alertKey={"cart-error"}
        alertVariant={"danger"}
      />
      <div className="grid-row grid-gap-4">
        <div className="grid-col-12">
          <SearchAuction
            catergoryOptions={auctionPreviewState.catergoryOptions}
            selectedCategoryOptions={
              auctionPreviewState.selectedCategoryOptions
            }
            toggleExpanded={auctionPreviewState.toggleExpanded}
            handleToggleExpanded={() => {
              updateAuctionReviewState({
                toggleExpanded: !auctionPreviewState.toggleExpanded,
              });
            }}
            stateOptions={auctionPreviewState.stateOptions}
            selectedStateOptions={auctionPreviewState.selectedStateOptions}
            zipCode={auctionPreviewState.zipCode}
            selectedRadius={auctionPreviewState.selectedRadius}
            minimumValue={auctionPreviewState.minimumValue}
            maximumValue={auctionPreviewState.maximumValue}
            saleNumber={auctionPreviewState.saleNumber}
            bidOptions={auctionPreviewState.bidOptions}
            handleCategory={handleCategory}
            handleState={handleState}
            onChangeZipCode={(event) => {
              updateAuctionReviewState({
                zipCode: event.target.value.replace(/\D+/g, ""),
              });
            }}
            onBlurZipCode={onBlurZipCode}
            handleRadius={handleRadius}
            onChangeMinValue={(event) => {
              updateAuctionReviewState({
                minimumValue: event.target.value.replace(/\D+/g, ""),
              });
            }}
            onBlurMinValue={() => {}}
            onChangeMaxValue={(event) => {
              updateAuctionReviewState({
                maximumValue: event.target.value.replace(/\D+/g, ""),
              });
            }}
            onBlurMaxValue={() => {}}
            onChangeSaleNumber={(event) => {
              updateAuctionReviewState({
                saleNumber: event.target.value.replaceAll("-", ""),
              });
            }}
            onBlurSaleNumber={() => {}}
            handleBidDeposit={handleBidDeposit}
            lotStatus={auctionPreviewState.lotStatus}
            toDate={auctionPreviewState.toDate}
            updateToDate={updateToDate}
            fromDate={auctionPreviewState.fromDate}
            updateFromDate={updateFromDate}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col text-center margin-top-2">
          <PPMSButton
            id={"auction-main-search"}
            label={"Search"}
            onPress={() => {
              handleSearch(1, 50, true);
            }}
            variant={"primary"}
            size="lg"
          />
          <PPMSButton
            id={"auction-clear"}
            label={"Clear All"}
            onPress={() => {
              handleClearAll();
            }}
            variant={"secondary"}
            size="lg"
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className="grid-col-3 pushToggleDown filter-cards usa-layout-docs__sidenav">
          <ToggleCategory
            title={"Browse by Category"}
            options={categories}
            onSelect={handleCheckboxToggleChange}
          />
        </div>
        <div className="desktop:grid-col-9 usa-layout-docs__main">
          <div className="grid-conatiner">
            <div className="grid-row grid-gap-4">
              <div className="grid-col-12">
                <div className="item-search-result">
                  <h2 className="item-search-result-header h-red">
                    {whichPageText} List -{" "}
                    {pluralizeResults(totalRows, "Result")}
                  </h2>
                  {totalRows !== 0 && (
                    <PPMSPagination
                      page={currentPage}
                      pageSize={rowsPerPage}
                      totalRows={totalRows}
                      onChangePage={(currentPage: number, pageSize: number) => {
                        handleAllocationsPageChange(currentPage, pageSize);
                      }}
                    />
                  )}
                </div>
                {isLoading
                  ? null
                  : auctions.map((item) => {
                      return (
                        <div className="item-search-result-wrapper">
                          <AuctionPreviewTile auction={item} listPage={true} />
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PPMSModal
        body={"No records found for this search."}
        id={"modal-auctions"}
        show={searchModal}
        handleClose={() => {
          setSearchModal(false);
        }}
        handleSave={() => {
          setSearchModal(false);
        }}
        labelCancelVariant="hide"
        title={"Search Auctions"}
        label={"Ok"}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    updateSearchCriteria: (paramString) => {
      dispatch(cartActions.updateSearchCriteria(paramString));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuctionPreview);
