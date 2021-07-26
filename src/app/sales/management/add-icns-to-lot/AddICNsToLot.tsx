import React, { StrictMode, useContext, useEffect } from "react";
import SalesSideNav from "../common/SideNav";
import { AddICNsToLotContext } from "./AddICNsToLotContext";
import { PPMSProperty } from "../../../../ui-kit/components/property/PPMS-property";
import PPMSPagination from "../../../../ui-kit/components/common/pagination/PPMS-pagination";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PageHelper, Paths } from "../../../Router";
import SaleNumberDetails from "../common/SaleNumberDetails";
import { connect } from "react-redux";
import { formatICN } from "../../../../ui-kit/utilities/FormatUtil";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import {
  condition,
  salesPropertyTypes,
} from "../../../property/create-update-property/constants/Constants";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import Breadcrumb from "../common/Breadcrumb";
import queryString from "query-string";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import Filter from "./Filter/Filter";
import { SalesFilterContextProvider } from "./Filter/FilterContext";
interface AddICNsToLotProps {
  match: any;
  actions?: any;
  location?: any;
  user?: any;
  roles?: any;
}

const AddICNsToLot = (props: AddICNsToLotProps) => {
  const { addToast } = props.actions;
  const { match, location, user, roles } = props;
  const { addICNsToLotState, updateAddICNsToLotState } = useContext(
    AddICNsToLotContext
  );
  let salesService = new SalesApiService();
  let commonAPI = new CommonApiService();
  let search = location.search;
  let query = queryString.parse(search);
  let saleId = null;
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }
  let zone = [];
  zone.push(query?.zoneId);

  function salesDetails() {
    salesService
      .getSaleDetails(saleId)
      .then((res) => {
        let details = res.data.salesNumberDetails;
        let state = addICNsToLotState;
        let todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);
        if (
          (details.sco.email == user.emailAddress ||
            details?.alternateSCO?.email == user.emailAddress ||
            details?.marketingSpecialist?.email == user.emailAddress ||
            roles.isSG) &&
          todaysDate <= new Date(details?.salesDate)
        ) {
          state.other.actionDisabled = false;
        }
        state.data.salesDetails = details;
        updateAddICNsToLotState(state);
      })
      .catch((err) => {});
  }

  function addToLot(item) {
    if (addICNsToLotState.data.propertyList.length >= 1000) {
      addToast({
        text: `This Lot has reached the maximum number of ICNs that can be added to it. You may select a new lot and add the ICN to it.`,
        type: "error",
        heading: "Error",
      });
      return;
    }
    let data = {
      salesId: parseInt(addICNsToLotState.data.salesId.toString()),
      lotId:
        addICNsToLotState.data.selectedLot !== "add-a-new-lot"
          ? addICNsToLotState.data.selectedLot
          : null,
      propertyDataResponse: item,
      action: "add",
    };

    let targetLot = addICNsToLotState.constants.lotOptionsData.filter((lot) => {
      return lot.lotId === addICNsToLotState.data.selectedLot;
    })[0];
    if (item.propType !== targetLot?.propType && targetLot?.propType) {
      addToast({
        text: `Selected Lot has ICN(s) of different property type, select another Lot to add ICN ${formatICN(
          item.icn
        )}.`,
        type: "error",
        heading: "Error",
      });
    } else {
      salesService
        .addICNToLot(data)
        .then((lotNumber) => {
          getICNList(
            addICNsToLotState.other.page.currentPage,
            addICNsToLotState.other.page.pageSize
          );
          addToast({
            text: `ICN ${formatICN(item.icn)} added to Lot ${lotNumber.data}.`,
            type: "success",
            heading: "Success",
          });
        })
        .catch((error) => {
          console.log(error?.data?.message);
          addToast({
            text: `${error?.data?.message}`,
            type: "error",
            heading: "Error",
          });
        });
    }
  }
  function createLotList(list) {
    let options = [];

    list.forEach((lot) => {
      options.push({
        id: lot.lotId,
        value: `Lot ${lot.lotNumber} - ${lot.noOfItems} items`,
      });
    });
    //options.push({ id: "add-a-new-lot", value: "Add a new Lot" });
    return options;
  }
  function addNewLot() {
    if (addICNsToLotState.constants.lotOptions.length >= 999) {
      addToast({
        text: `This Sale has reached the maximum number of Lots that can be added to it. You may create a new Sale and add the lot to it.`,
        type: "error",
        heading: "error",
      });
      return;
    }
    let params = {
      salesId: addICNsToLotState.data.salesId,
    };
    salesService
      .addNewLot(params)
      .then((response) => {
        let options = createLotList(response.data);
        let state = addICNsToLotState;
        state.constants.lotOptions = options;
        state.data.selectedLot = options[options.length - 1].id;
        updateAddICNsToLotState(state);
        addToast({
          text: `Successfully added new ${options[options.length - 1].value}.`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handlePageChange(currentPage, pageSize) {
    let state = addICNsToLotState;
    state.other.page.currentPage = currentPage;
    state.other.page.pageSize = pageSize;
    updateAddICNsToLotState(state);
    getICNList(currentPage, pageSize);
  }
  function getCondition(code) {
    let conditionValue = "";
    condition.forEach((condition) => {
      if (condition.id === code) {
        conditionValue = condition.value;
      }
    });
    return conditionValue;
  }
  async function getZoneRegions() {
    let zone = [];
    zone.push(query?.zoneId);
    const regions = Promise.all(
      zone.map((zone) => {
        return commonAPI.getZoneRegions(zone).then((response) => {
          return response.data.map((region) => {
            return region.regionCode;
          });
        });
      })
    );

    return await Promise.all([regions]);
  }
  function createLotListHelper() {
    let params = { salesId: saleId };
    salesService.getLotList(params).then((response) => {
      let options = createLotList(response.data);
      let state = addICNsToLotState;
      let radioOptions = state.constants.addLotOptions.filter((item) => {
        return item.isSelected == true;
      });
      state.constants.lotOptions = options;
      state.constants.lotOptionsData = response.data;
      state.data.selectedLot = query?.newLot
        ? query.newLot
        : radioOptions.length > 0
        ? radioOptions[0].id === "add-to-new-lot"
          ? "add-a-new-lot"
          : state.data.selectedLot
        : options[0].id;
      updateAddICNsToLotState(state);
    });
  }
  function getICNList(currentPage, pageSize) {
    getZoneRegions().then((regions) => {
      let params = {
        zone: query.zoneId,
        regions: regions.join(),
        page: currentPage,
        size: addICNsToLotState.other.page.pageSize,
        status: "Available",

        //Filters
        aac: addICNsToLotState.aac,
        agency: addICNsToLotState.agency,
        include: addICNsToLotState.include,
        hazardous: addICNsToLotState.hazardous,
        condition: addICNsToLotState.condition,
        stateCode: addICNsToLotState.stateCode,
        region: addICNsToLotState.region,
        addedService: addICNsToLotState.addedService,
        multiFSCList: addICNsToLotState.fsc,
        propType: addICNsToLotState.propType,
        assignment: addICNsToLotState.assignment,
        email: addICNsToLotState.email,
        startingIcn: addICNsToLotState.startingIcn,
        endingIcn: addICNsToLotState.endingIcn,
      };
      salesService
        .getICNSalesControlsList(params)
        .then((response) => {
          let state = addICNsToLotState;
          let propertyDetails = response.data.propertyDetails;
          propertyDetails.forEach((propertyDetail) => {
            if (propertyDetail.saleOrLot) {
              propertyDetail["isDisabled"] = true;
            } else {
              propertyDetail["isDisabled"] = false;
            }
          });
          state.data.propertyList = propertyDetails;
          state.other.page.totalRows = response.data.totalElements;
          updateAddICNsToLotState(state);
          createLotListHelper();
        })
        .catch((errors) => {
          console.log(errors);
        });
    });
  }

  function applyFilters(filters) {
    getZoneRegions().then((regions) => {
      let params = {
        zone: query.zoneId,
        regions: regions.join(),
        page: 1,
        size: addICNsToLotState.other.page.pageSize,
        status: "Available",

        //Filters
        agency: filters.agency[0] ? filters.agency[0].id : "",
        include: filters.include,
        hazardous: filters.hazardous,
        multiFSCList: filters.fsc.join(),
        propType: filters.propertyType,
        aac: filters.aac,
        assignment: filters.assignment,
        email: filters.email,
        startingIcn: filters.startingIcn,
        endingIcn: filters.endingIcn,
        condition: filters.condition,
        stateCode: filters.stateCode.join(),
        region: filters.region,
        addedService: filters.addedService,
      };
      salesService
        .getICNSalesControlsList(params)
        .then((response) => {
          let state = addICNsToLotState;
          let propertyDetails = response.data.propertyDetails;
          propertyDetails.forEach((propertyDetail) => {
            if (propertyDetail.saleOrLot) {
              propertyDetail["isDisabled"] = true;
            } else {
              propertyDetail["isDisabled"] = false;
            }
          });
          state.data.propertyList = propertyDetails;
          state.other.page.totalRows = response.data.totalElements;
          state.agency = filters.agency[0] ? filters.agency[0].id : "";
          state.include = filters.include;
          state.hazardous = filters.hazardous;
          state.fsc = filters.fsc.join();
          state.propType = filters.propertyType;
          state.aac = filters.aac;
          state.assignment = filters.assignment;
          state.email = filters.email;
          state.startingIcn = filters.startingIcn;
          state.endingIcn = filters.endingIcn;
          state.condition = filters.condition;
          state.stateCode = filters.stateCode.join();
          state.region = filters.region;
          state.addedService = filters.addedService;
          updateAddICNsToLotState(state);
          createLotListHelper();
        })
        .catch((errors) => {
          console.log(errors);
        });
    });
    updateAddICNsToLotState({
      agency: filters.agency[0] ? filters.agency[0].id : "",
      include: filters.include,
      hazardous: filters.hazardous,
      fsc: filters.fsc.join(),
      propType: filters.propertyType,
      aac: filters.aac,
      assignment: filters.assignment,
      email: filters.email,
      startingIcn: filters.startingIcn,
      endingIcn: filters.endingIcn,
      condition: filters.condition,
      stateCode: filters.stateCode.join(),
      region: filters.region,
      addedService: filters.addedService,
    });
  }

  function clearFilters() {
    getZoneRegions().then((regions) => {
      let params = {
        zone: query.zoneId,
        regions: regions.join(),
        page: 1,
        size: addICNsToLotState.other.page.pageSize,
        status: "Available",

        //Filters
        agency: "",
        include: "Include",
        hazardous: "",
        multiFSCList: "",
        propType: "",
        aac: "",
        assignment: "Assigned to Me",
        email: "",
        startingIcn: "",
        endingIcn: "",
        condition: "",
        stateCode: "",
        region: "",
        addedService: "",
      };
      salesService
        .getICNSalesControlsList(params)
        .then((response) => {
          let state = addICNsToLotState;
          let propertyDetails = response.data.propertyDetails;
          propertyDetails.forEach((propertyDetail) => {
            if (propertyDetail.saleOrLot) {
              propertyDetail["isDisabled"] = true;
            } else {
              propertyDetail["isDisabled"] = false;
            }
          });
          state.data.propertyList = propertyDetails;
          state.other.page.totalRows = response.data.totalElements;
          updateAddICNsToLotState(state);
          createLotListHelper();
        })
        .catch((errors) => {
          console.log(errors);
        });
    });
    updateAddICNsToLotState({
      agency: "",
      include: "",
      hazardous: "",
      fsc: "",
      propType: "",
      aac: "",
      assignment: "",
      email: "",
      startingIcn: "",
      endingIcn: "",
      condition: "",
      stateCode: "",
      region: "",
      addedService: "",
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    salesDetails();
    let state = addICNsToLotState;
    getICNList(
      addICNsToLotState.other.page.currentPage,
      addICNsToLotState.other.page.pageSize
    );
    state.data.salesId = saleId;
    state.constants.addLotOptions = [
      {
        id: "add-to-new-lot",
        value: "Add to New Lot",
        isSelected: false,
      },
      { id: "add-to-same-lot", value: "Add to Same Lot", isSelected: false },
      {
        id: "add-to-existing-lot",
        value: "Add to Existing Lot",
        isSelected: false,
      },
    ];
    updateAddICNsToLotState(state);
  }, []);

  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <Breadcrumb pathname={location.pathname} zoneId={query.zoneId} />
        <div className="grid-row header-row mb-3">
          <h1>Add Item Control Numbers</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={query.zoneId}
                  currentPage={Paths.salesAddICNToLot}
                />
              </nav>
              <div className="filter-cards usa-layout-docs__sidenav">
                <SalesFilterContextProvider>
                  <Filter
                    zone={zone}
                    onApply={applyFilters}
                    onClear={clearFilters}
                  />
                </SalesFilterContextProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          {addICNsToLotState.data.salesId !== 0 && (
            <SaleNumberDetails saleId={saleId} zoneId={query.zoneId} />
          )}

          {addICNsToLotState.data.propertyList.length !== 0 ? (
            <div className={"display-flex flex-row margin-bottom-2"}>
              <div className={"add-to-lot-dropdown"}>
                <PPMSToggleRadio
                  isDisabled={
                    addICNsToLotState.other.actionDisabled
                      ? addICNsToLotState.other.actionDisabled
                      : false
                  }
                  id={"add-to-lot-options"}
                  name={"add-to-lot-options"}
                  options={addICNsToLotState.constants.addLotOptions}
                  validationMessage={""}
                  onChange={(value) => {
                    let state = addICNsToLotState;
                    if (
                      value.filter(function (value) {
                        return (
                          value.id === "add-to-existing-lot" &&
                          value.isSelected === true
                        );
                      }).length > 0
                    ) {
                      createLotListHelper();
                      state.other.isLotDropdownDisabled = false;
                      state.data.selectedLot = state.constants.lotOptions[0].id;
                    } else if (
                      value.filter(function (value) {
                        return (
                          value.id === "add-to-same-lot" &&
                          value.isSelected === true
                        );
                      }).length > 0
                    ) {
                      state.other.isLotDropdownDisabled = true;
                      state.data.selectedLot = "add-to-same-lot";
                      addNewLot();
                    } else {
                      state.other.isLotDropdownDisabled = true;
                      state.data.selectedLot = "add-a-new-lot";
                    }
                    updateAddICNsToLotState(state);
                  }}
                  isInline={false}
                />
              </div>
              <div className={"grid-col-2 flex-row"}>
                
                
                  <PPMSSelect
                    id={"sale-lots"}
                    identifierKey={"id"}
                    identifierValue={"value"}
                    name={"sale-lots"}
                    values={addICNsToLotState.constants.lotOptions}
                    isRequired={true}
                    selectedValue={addICNsToLotState.data.selectedLot}
                    onChange={(event) => {
                      let value =
                        event.target.options[event.target.selectedIndex].id;
                      let state = addICNsToLotState;
                      state.data.selectedLot = value;
                      updateAddICNsToLotState(state);
                    }}
                    disabled={
                      addICNsToLotState.other.actionDisabled
                        ? addICNsToLotState.other.actionDisabled
                        : addICNsToLotState.other.isLotDropdownDisabled
                    }
                  />
                
              </div>
            </div>
          ) : (
            <div className={"display-flex flex-row margin-bottom-2"}>
              <p>No ICNs Found</p>
            </div>
          )}
          <div className="item-search-result">
            <PPMSPagination
              page={addICNsToLotState.other.page.currentPage}
              pageSize={addICNsToLotState.other.page.pageSize}
              totalRows={addICNsToLotState.other.page.totalRows}
              onChangePage={(currentPage, pageSize) => {
                handlePageChange(currentPage, pageSize);
              }}
            />
          </div>
          <div className="item-search-result-wrapper">
            {addICNsToLotState.data.propertyList.map((item, index) => (
              <PPMSProperty
                key={`icn-${index}`}
                propertyId={`icn-${index}`}
                icn={item.icn}
                itemName={item.propertyName}
                location={item.location}
                federalSupplyClass={item.fsc}
                conditionCode={getCondition(item.condition)}
                unitOfIssueValue={item.unitOfIssue}
                categoryCode={item.categoryCode}
                thumb_image={item.preSignedUrl}
                custodian={item.propertyCustodian}
                addToLot={true}
                isAddToLotDisabled={item.isDisabled}
                propertyType={item.propType}
                propertyTypeDescription={
                  salesPropertyTypes.find((p) => p.id == item.propType)?.value
                }
                quantity={item.qty}
                handleAddToLot={() => addToLot(item)}
                propertyHistoryFlag={false}
                address={item.address}
                zip={item.zip}
                actionDisabled={addICNsToLotState.other.actionDisabled}
              />
            ))}
          </div>
          <div className="item-search-result">
            <PPMSPagination
              page={addICNsToLotState.other.page.currentPage}
              pageSize={addICNsToLotState.other.page.pageSize}
              totalRows={addICNsToLotState.other.page.totalRows}
              onChangePage={(currentPage, pageSize) => {
                handlePageChange(currentPage, pageSize);
              }}
            />
          </div>
          <div className="grid-row grid-gap-2 next-prev-page">
            <div className="desktop:grid-col-6">
              <PPMSButton
                id={"sales-documentation"}
                type={"button"}
                variant={"link"}
                className={"usa-link delete-property"}
                label={"< Sales Documentation"}
                onPress={() =>
                  PageHelper.openPage(
                    Paths.salesDocument +
                      "/" +
                      saleId +
                      "?zoneId=" +
                      query.zoneId
                  )
                }
              />
            </div>
            <div className="desktop:grid-col-6">
              <PPMSButton
                id={"lotting-details"}
                type={"button"}
                variant={"link"}
                className={"usa-link float-right delete-property"}
                label={"Lotting Details >"}
                onPress={() =>
                  PageHelper.openPage(
                    Paths.salesLottingDetails +
                      "/" +
                      saleId +
                      "?zoneId=" +
                      query.zoneId
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </StrictMode>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddICNsToLot);
