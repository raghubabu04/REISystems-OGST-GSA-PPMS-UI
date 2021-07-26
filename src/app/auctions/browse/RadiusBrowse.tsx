import React, { StrictMode, useContext, useEffect, useState } from "react";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PageHelper, Paths } from "../../Router";
import {
  populateZipCode,
  radiusOptions,
} from "../preview/constants/AuctionPreviewConstant";
import { RadiusSearchContext } from "./RadiusBrowseContext";

interface RadiusBrowseProps {}

export const BrowseByRadius = (props: RadiusBrowseProps) => {
  const auctionsApiService = new AuctionsApiService();
  const commonApiService = new CommonApiService();

  const { radiusSearchState, updateRadiusSearchState } = useContext(
    RadiusSearchContext
  );

  useEffect(() => {}, []);

  const onChangeZipCode = (event) => {
    updateRadiusSearchState({
      zipCode: event.target.value.replace(/\D+/g, ""),
    });
  };

  const onChangeRadius = (event) => {
    updateRadiusSearchState({
      selectedRadius: event.target.value,
    });
  };

  const onChangeSearchText = (event) => {
    updateRadiusSearchState({
      advancedSearchText: event.target.value,
    });
  };

  const resetZipCodeError = () => {
    updateRadiusSearchState({
      zipCodeIsInvalid: false,
      zipCodeErrorMsg: "",
      isSelectedRadiusEnabled: true,
    });
  };

  const zipCodeEmptyError = () => {
    updateRadiusSearchState({
      zipCodeIsInvalid: true,
      zipCodeErrorMsg: "Please enter a zipcode",
    });
  };

  const zipCodeInvalidError = () => {
    updateRadiusSearchState({
      zipCodeIsInvalid: true,
      zipCodeErrorMsg: "Please enter a valid zipcode",
    });
  };

  const updateSearchZipCode = async (zipCode: string) => {
    updateRadiusSearchState({
      zipCode: zipCode,
    });
    resetZipCodeError();

    let searchTypeQuery =
      radiusSearchState.searchType === ""
        ? ""
        : `&searchType=${radiusSearchState.searchType}`;
    let searchTextQuery =
      radiusSearchState.advancedSearchText === ""
        ? ""
        : `&searchText=${radiusSearchState.advancedSearchText}`;
    let statusQuery =
      radiusSearchState.status === ""
        ? ""
        : `status=${radiusSearchState.status}`;

    let radiusQuery =
      radiusSearchState.selectedRadius === ""
        ? ""
        : `&radius=${radiusSearchState.selectedRadius}`;
    let path =
      Paths.auctionsList +
      `?${statusQuery}${searchTypeQuery}${searchTextQuery}&zipCode=${radiusSearchState.zipCode}${radiusQuery}`;

    PageHelper.openPage(path);
  };

  const onBlurZipCode = async () => {
    let zipCode = populateZipCode(radiusSearchState.zipCode);

    updateRadiusSearchState({
      zipCode,
    });

    if (zipCode) {
      let getZipCodeResponse = await commonApiService.getZipCode(zipCode);

      if (getZipCodeResponse?.data?.length === 0) {
        zipCodeInvalidError();
      } else {
        resetZipCodeError();
      }
    } else {
      zipCodeEmptyError();
    }
  };

  const handleSearch = async () => {
    let zipCode = populateZipCode(radiusSearchState.zipCode);

    updateRadiusSearchState({
      zipCode,
    });

    if (zipCode) {
      let getZipCodeResponse = await commonApiService.getZipCode(zipCode);

      getZipCodeResponse?.data?.length !== 0
        ? updateSearchZipCode(zipCode)
        : zipCodeInvalidError();
    } else {
      zipCodeEmptyError();
    }
  };

  return (
    <>
      <div className="grid-row grid-gap-4">
        <div className="desktop:grid-col-12">
          <div className={"grid-row grid-gap-6 radiusBrowse"}>
            <div className="grid-col-5">
              <PPMSInput
                title={"name or description"}
                isDisabled={false}
                label={"Search For"}
                placeHolder={"Search by Lot Name or Description"}
                id={"advanced-auction-search-radius-id"}
                inputType={"text"}
                isInvalid={false}
                isValid={false}
                isRequired={true}
                labelBold={true}
                value={radiusSearchState.advancedSearchText}
                onChange={onChangeSearchText}
                maxLength={40}
              />
            </div>
          </div>
          <div className={"grid-row grid-gap-6 radiusBrowse"}>
            <div className="grid-col-2 ">
              <PPMSInput
                title={"zip code"}
                isDisabled={false}
                label={"Near Zip Code"}
                id={"auction-zip-code-radius"}
                inputType={"text"}
                isInvalid={radiusSearchState.zipCodeIsInvalid}
                isValid={!radiusSearchState.zipCodeIsInvalid}
                isRequired={true}
                value={radiusSearchState.zipCode}
                labelBold={true}
                placeHolder={"e.g 75063"}
                maxLength={5}
                minLength={5}
                onChange={onChangeZipCode}
                onBlur={onBlurZipCode}
                validationMessage={radiusSearchState.zipCodeErrorMsg}
              />
            </div>
            <div className="grid-col-3">
              <PPMSSelect
                placeholderValue={"--Select Radius--"}
                isRequired={true}
                isValid={true}
                isInvalid={false}
                validationMessage={""}
                disabled={!radiusSearchState.isSelectedRadiusEnabled}
                label={"Radius"}
                labelBold={true}
                identifierKey="id"
                identifierValue="value"
                selectedValue={radiusSearchState.selectedRadius}
                onChange={onChangeRadius}
                values={radiusOptions}
              />
            </div>
          </div>
          <div className={"grid-row grid-gap-6 radiusBrowse"}>
            <div className="grid-col-2">
              <PPMSButton
                id={"auction-radius-search"}
                label={"Search"}
                onPress={() => {
                  handleSearch();
                }}
                className={"radiusSearchBtn"}
                variant={"primary"}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
