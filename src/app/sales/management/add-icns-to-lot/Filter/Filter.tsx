import React, { useEffect, useContext } from "react";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import PPMSCardGroup from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import {
  agencyFilter,
  propertyTypeFilter,
  fscFilter,
  hazardousFilter,
  aacFilter,
  assignmentFilter,
  emailAddressFilter,
  searchByRangeFilter,
  conditionFilter,
  stateCodeFilter,
  regionFilter,
  addedServiceFilter,
} from "../constants/FilterConstants";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { FilterContext } from "./FilterContext";
import { validateAAC } from "../../../../property/search-property/validations/AdvanceSearchFieldValidations";
import { regexForTCNandICN } from "../../../../property/create-update-property/constants/Constants";
interface FilterProps {
  roles?: any;
  location?: Location;
  router?: any;
  onApply: any;
  onClear: any;
  zone?: any;
}

export default function Filter(props: FilterProps) {
  const { searchCriteria, updateSearchCriteria } = useContext(FilterContext);
  const commonApiService = new CommonApiService();

  useEffect(() => {
    commonApiService
      .getFSCCodes()
      .then((response) => {
        updateSearchCriteria({
          fscCodes: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
        updateSearchCriteria({
          agencyBureaus: agencyBureao,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    commonApiService.getStateList().then((response: any) => {
      updateSearchCriteria({
        stateCode: response.data,
      });
    });
    commonApiService.getZoneRegions(props.zone).then((response) => {
      let regionValues = [];
      response.data.forEach((r) => {
        let regionData = {
          id: r.regionCode,
          value: r.regionDescription,
        };
        regionValues.push(regionData);
      });
      updateSearchCriteria({
        regionValues: regionValues,
      });
    });
  }, []);

  function handleSelectionChange(event: any) {
    const value: string = event.target.options[event.target.selectedIndex].id;
    const key: string = event.target.name;
    updateSearchCriteria({
      [key]: event.target.selectedIndex !== 0 ? value : "",
    });
  }

  function handleAssignmentChange(event: any) {
    updateSearchCriteria({
      assignment: event.target.options[event.target.selectedIndex].value,
    });
  }

  function handleAAC(event) {
    let aacValue = event.target.value;
    let validation = validateAAC(aacValue);
    updateSearchCriteria({
      aac: aacValue,
    });
  }

  function handleFSCChange(event) {
    let fscSelectedList = [];
    let fcsSelectedValues = [];
    event.forEach((e) => {
      fscSelectedList.push(e.code);
      fcsSelectedValues.push(e);
    });
    updateSearchCriteria({
      fscCodeList: fscSelectedList,
      fcsSelectedValues: fcsSelectedValues,
    });
  }

  function handleStateCodeChange(event) {
    let stateSelectList = [];
    let stateSelectedValues = [];
    event.forEach((e) => {
      stateSelectList.push(e.stateCode);
      stateSelectedValues.push(e);
    });
    updateSearchCriteria({
      stateCodeList: stateSelectList,
      stateCodeSelectedValues: stateSelectedValues,
    });
  }

  function handleAgencyBureau(selectedAgencyBureaus) {
    updateSearchCriteria({
      selectedAgencyBureaus: selectedAgencyBureaus,
    });
  }

  function handleIncludeChange(check) {
    updateSearchCriteria({
      includeExclude: check ? "Exclude" : "Include",
      isChecked: check,
    });
  }

  function handleEmailChange(event) {
    updateSearchCriteria({
      email: event.target.value,
    });
  }

  function handleChange(event: any) {
    const key: string = event.target.name;
    let value: string = event.target.value;
    if (key === "itemControlNumber") {
      value = value.replaceAll(regexForTCNandICN, "").trim();
    } else {
      value = value.trimLeft();
    }
    updateSearchCriteria({
      [key]: value,
    });
  }

  function applyFilter() {
    let fscCodeList = [];
    searchCriteria.fcsSelectedValues.forEach((fsc) =>
      fscCodeList.push(fsc.code)
    );
    let stateCodeList = [];
    searchCriteria.stateCodeSelectedValues.forEach((s) =>
      stateCodeList.push(s.stateCode)
    );
    let filters = {
      agency: searchCriteria.selectedAgencyBureaus,
      include: searchCriteria.includeExclude,
      propertyType: searchCriteria.propertyType,
      fsc: fscCodeList,
      hazardous: searchCriteria.hazardous,
      aac: searchCriteria.aac,
      assignment: searchCriteria.assignment,
      email: searchCriteria.email,
      startingIcn: searchCriteria.startingIcn,
      endingIcn: searchCriteria.endingIcn,
      condition: searchCriteria.condition,
      stateCode: stateCodeList,
      region: searchCriteria.region,
      addedService: searchCriteria.addedService,
    };
    props.onApply(filters);
  }

  function clearFilter() {
    updateSearchCriteria({
      selectedAgencyBureaus: [],
      includeExclude: "Include",
      isChecked: false,
      propertyType: "",
      fcsSelectedValues: [],
      hazardous: "",
      aac: "",
      assignment: "Assigned to Me",
      email: "",
      startingIcn: "",
      endingIcn: "",
      condition: "",
      stateCodeList: [],
      stateCodeSelectedValues: [],
      region: "",
      addedService: "",
    });
    props.onClear();
  }

  return (
    <>
      <h2>Filters:</h2>
      <div className="grid-row">
        <div className="tablet:grid-col mt-2">
          <PPMSButton
            id={"allocation-main-search-apply-top"}
            label={"Apply Filter"}
            onPress={applyFilter}
            variant={"primary"}
            size="lg"
          />
        </div>
        <div className="tablet:grid-col mt-2">
          <PPMSButton
            id={"allocation-main-search-clear-top"}
            label={"Clear Filter"}
            onPress={clearFilter}
            variant={"primary"}
            size="lg"
          />
        </div>
      </div>
      <br/>

      <PPMSCardGroup className={"ppms-card-group"}>
        {assignmentFilter(searchCriteria, handleAssignmentChange)}
        {emailAddressFilter(searchCriteria, handleEmailChange)}
        {searchByRangeFilter(searchCriteria, handleChange)}
        {aacFilter(searchCriteria, handleAAC)}
        {agencyFilter(
          searchCriteria,
          handleAgencyBureau,
          searchCriteria.isChecked,
          handleIncludeChange
        )}
        {propertyTypeFilter(searchCriteria, handleSelectionChange)}
        {fscFilter(searchCriteria, handleFSCChange)}
        {hazardousFilter(searchCriteria, handleSelectionChange)}
        {conditionFilter(searchCriteria, handleSelectionChange)}
        {stateCodeFilter(searchCriteria, handleStateCodeChange)}
        {regionFilter(searchCriteria, handleSelectionChange)}
        {addedServiceFilter(searchCriteria, handleSelectionChange)}
      </PPMSCardGroup>

      <div className="grid-row">
        <div className="tablet:grid-col mt-2">
          <PPMSButton
            id={"allocation-main-search-apply"}
            label={"Apply Filter"}
            onPress={applyFilter}
            variant={"primary"}
            size="lg"
          />
        </div>
        <div className="tablet:grid-col mt-2">
          <PPMSButton
            id={"allocation-main-search-clear"}
            label={"Clear Filter"}
            onPress={clearFilter}
            variant={"primary"}
            size="lg"
          />
        </div>
      </div>
    </>
  );
}
