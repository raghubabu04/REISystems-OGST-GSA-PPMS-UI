import React, { useEffect, useState } from "react";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";
import { advancedSearchValues } from "../../property/create-update-property/constants/Constants";
import { history } from "../../../_redux/_helpers/history";
import {
  AuctionPreviewState,
  defaultAuctionPreviewState,
} from "../preview/AuctionPreviewState";
import { SearchAuction } from "../preview/components/SearchAuction";
import {
  advancedSearchValuesMap,
  auctionTypeOptions,
  bidOptions,
  LotStatusId,
  populateZipCode,
} from "../preview/constants/AuctionPreviewConstant";
import moment from "moment";
import { Paths } from "../../Router";

export function AuctionsHomeSearchBar() {
  const [auctionPreviewState, setAuctionPreviewState] = useState<
    AuctionPreviewState
  >(defaultAuctionPreviewState);

  const commonApiService = new CommonApiService();

  useEffect(() => {
    updateAuctionReviewState({
      selectedCategoryOptions: [],
      selectedStateOptions: [],
    });
    requiredApiData();
  }, []);

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
      })
      .catch(() => {});
  }

  const handleSearch = () => {
    let data = prepareParamsForSearch();
    generateQueryParams(data);
  };
  function prepareParamsForSearch() {
    let parameters = {
      categoryCodeList: auctionPreviewState.selectedCategoryValues,
      auctionSearchTypeAdvanced: auctionPreviewState.advancedSearchType,
      advancedSearchText: auctionPreviewState.advancedSearchText.trim(),
      zipCode: auctionPreviewState.zipCode,
      radius: auctionPreviewState.selectedRadius,
      minPrice: auctionPreviewState.minimumValue,
      maxPrice: auctionPreviewState.maximumValue,
      saleNumber: auctionPreviewState.saleNumber,
      bidDeposit: auctionPreviewState.bidRequired,
      states: auctionPreviewState.selectedStateValues,
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
      auctionStatus: auctionPreviewState?.lotStatus,
      params: {
        page: 1,
        size: 50,
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

  function updateAuctionReviewState(newState: any) {
    setAuctionPreviewState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

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
    });
  }

  return (
    <div className="grid-conatiner ui-ppms auctionHomeSearch">
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
              handleSearch();
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
    </div>
  );
}
