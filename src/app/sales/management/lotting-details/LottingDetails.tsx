import React, { StrictMode, useContext, useEffect, useState } from "react";
import SalesSideNav from "../common/SideNav";
import { LottingDetailsContext } from "./LottingDetailsContext";
import PPMSPagination from "../../../../ui-kit/components/common/pagination/PPMS-pagination";
import PPMSLot from "../../../../ui-kit/components/sales/PPMSLot";
import { formatICN } from "../../../../ui-kit/utilities/FormatUtil";
import { connect } from "react-redux";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import SaleNumberDetails from "../common/SaleNumberDetails";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import Breadcrumb from "../common/Breadcrumb";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PageHelper, Paths } from "../../../Router";
import queryString from "query-string";
import { Upload } from "../../uploads/Upload";
import PPMSAlert from "../../../../ui-kit/components/common/alert/PPMS-alert";
import { DelotModal } from "./DelotModal";
import { LottingTransactionFilter } from "./LottingTransactionFilter";
import {
  validateAAC,
  validateItemControlNumberWithMinSix,
} from "../../../property/search-property/validations/AdvanceSearchFieldValidations";
import { regexForTCNandICN } from "../../../property/create-update-property/constants/Constants";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { propertyInfoFields } from "../../../property/create-update-property/property-info-class/PropertyInfoFields";
import { MdRemoveCircleOutline } from "react-icons/md";

interface LottingDetailsProps {
  match: any;
  location: any;
  actions?: any;
  user?: any;
  roles?: any;
  onApply: any;
  onClear: any;
}
const LottingDetails = (props: LottingDetailsProps) => {
  const { lottingDetailsState, updateLottingDetailsState } = useContext(
    LottingDetailsContext
  );
  const { match, location, user, roles } = props;
  const { addToast } = props.actions;
  const [saleNumber, updateSaleNumber] = useState("");
  const [templateCodes, setTemplateCodes] = useState([]);
  const [toggleAllAccordions, setToggleAllAccordions] = useState(false);
  let salesAPIService = new SalesApiService();
  let commonApiService = new CommonApiService();

  let search = location.search;
  let query = queryString.parse(search);
  let saleId = null;
  let zone = [];
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }
  if (query?.zoneId) {
    zone.push(query.zoneId);
  }
  useEffect(() => {
    getSaleDetails();
    getTemplateCodes();
    let state = lottingDetailsState;
    getLotsForSales(
      query?.page ? query.page : lottingDetailsState.other.page.currentPage,
      lottingDetailsState.other.page.pageSize
    );
    createLotListHelper();
    state.data.salesId = saleId;
    updateLottingDetailsState(state);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    commonApiService
      .getFSCCodes()
      .then((response: any) => {
        let other = lottingDetailsState.other;
        let fscCodes = response.data;
        other.fscCodes = fscCodes;
        updateLottingDetailsState({
          other,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    commonApiService
      .getAllAgencyBureaus()
      .then((resp) => {
        let other = lottingDetailsState.other;

        let agencyBureau = resp.data.map((item) => {
          return {
            value: item.longName.trim(),
            agencyBureau: item.code + "-" + item.longName.trim(),
            id: item.code,
            isSelected: false,
          };
        });
        other.agencyBureaus = agencyBureau;
        updateLottingDetailsState({
          other,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getTemplateCodes = () => {
    salesAPIService
      .getTemplateCodes(zone)
      .then((res) => {
        setTemplateCodes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function getSaleDetails() {
    salesAPIService
      .getSaleDetails(saleId)
      .then((res) => {
        let state = lottingDetailsState;
        let details = res.data.salesNumberDetails;
        let todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);
        if (
          (details.sco.email === user.emailAddress ||
            details?.alternateSCO?.email === user.emailAddress ||
            details?.marketingSpecialist?.email === user.emailAddress ||
            roles.isSG) &&
          todaysDate <= new Date(details?.salesDate)
        ) {
          state.edit_properties.actionDisabled = false;
          state.edit_properties.lotNameDisabled = false;
          state.edit_properties.startingbidDisabled = false;
          state.edit_properties.reservepriceDisabled = false;
          state.edit_properties.templateDisabled = false;
          state.edit_properties.lotdescriptionDisabled = false;
          state.edit_properties.imageDisabled = false;
        }
        if (
          details.salesStatus === "Active" ||
          details.salesStatus === "Closed"
        ) {
          state.edit_properties.templateDisabled = true;
          state.edit_properties.startingbidDisabled = true;
          if (details.salesStatus === "Active" && roles.isCO) {
            state.edit_properties.reservepriceDisabled = false;
          } else {
            state.edit_properties.reservepriceDisabled = true;
          }
          if (details.salesStatus === "Closed") {
            state.edit_properties.lotNameDisabled = true;
            state.edit_properties.lotdescriptionDisabled = true;
            state.edit_properties.imageDisabled = true;
          }
        }
        state.data.salesDetails = details;
        updateLottingDetailsState(state);
        updateSaleNumber(details.salesNumber);
      })
      .catch((err) => {});
  }
  function createLotList(list) {
    let options = [];
    list.forEach((lot) => {
      options.push({
        id: lot.lotId,
        value: `Move to Lot ${lot.lotNumber}`,
      });
    });
    options.push({
      id: "add-a-new-lot",
      value: `Move to new Lot`,
    });
    return options;
  }
  function createLotListHelper() {
    let params = { salesId: saleId };
    salesAPIService.getLotList(params).then((response) => {
      let options = createLotList(response.data);
      let state = lottingDetailsState;
      state.constants.lotOptionsData = response.data;
      state.constants.lotOptions = options;
      updateLottingDetailsState(state);
    });
  }

  function handlePageChange(currentPage, pageSize) {
    let state = lottingDetailsState;
    state.other.page.currentPage = currentPage;
    state.other.page.pageSize = pageSize;
    updateLottingDetailsState(state);
    getLotsForSales(currentPage, pageSize);
    setToggleAllAccordions(false);
  }
  function getLotsForSales(currentPage, pageSize) {
    let params = {
      salesId: saleId,
      zone: query.zoneId,
      page: currentPage,
      size: lottingDetailsState.other.page.pageSize,
      lotId: query.lotId ? query.lotId : null,

      //Filters
      agency: lottingDetailsState.filters.agency,
      include: lottingDetailsState.filters.include,
      icn: lottingDetailsState.filters.icn,
      multiFSCList: lottingDetailsState.filters.fsc,
      propType: lottingDetailsState.filters.propType,
      lotName: lottingDetailsState.filters.lotName,
    };
    salesAPIService
      .getLotsForSale(params)
      .then((response) => {
        let state = lottingDetailsState;
        state.data.lots = response.data.lots;
        state.data.totalIcnCount = response.data.totalIcnCount;
        state.data.totalLotCount = response.data.totalLotCount;
        state.errors.invalidLots = response.data.invalidLotNumbers;
        let totalProperties = 0;
        state.data.lots.forEach((lot) => {
          totalProperties += lot?.propertyDetails?.length;
          if (lot.lotDescriptionType === "ICN") {
            lot.lotDescription = lot.propertyDetails[0]?.propertyDescription;
          }
        });
        state.other.totalProperties = totalProperties;
        state.other.page.totalRows = response.data.totalElements;
        updateLottingDetailsState(state);
        createLotListHelper();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function applyFilter(filters) {
    let params = {
      salesId: saleId,
      zone: query.zoneId,
      page: 1,
      size: lottingDetailsState.other.page.pageSize,
      lotId: query.lotId ? query.lotId : null,

      //Filters
      agency: filters.agency[0] ? filters.agency[0].id : "",
      include: filters.include,
      multiFSCList: filters.fsc.join(),
      propType: filters.selectedPropertyType,
      icn: filters.itemControlNumber,
      lotName: filters.lotName,
    };
    salesAPIService
      .getLotsForSale(params)
      .then((response) => {
        let state = lottingDetailsState;
        state.data.lots = response.data.lots;
        state.data.totalIcnCount = response.data.totalIcnCount;
        state.data.totalLotCount = response.data.totalLotCount;
        state.errors.invalidLots = response.data.invalidLotNumbers;
        if (response.data.totalLotCount === 0) {
          state.other.showNoResultsModal = true;
          state.other.modalMessage = "No Lots found for your search.";
          updateLottingDetailsState(state);
        }

        let totalProperties = 0;
        state.data.lots.forEach((lot) => {
          totalProperties += lot?.propertyDetails?.length;
          if (lot.lotDescriptionType === "ICN") {
            lot.lotDescription = lot.propertyDetails[0]?.propertyDescription;
          }
        });
        state.other.totalProperties = totalProperties;
        state.other.page.totalRows = response.data.totalElements;
        updateLottingDetailsState(state);
        createLotListHelper();
      })
      .catch((errors) => {
        console.log(errors);
      });

    updateLottingDetailsState({
      agency: filters.agency[0] ? filters.agency[0].id : "",
      include: filters.include,
      fsc: filters.fsc.join(),
      propType: filters.propertyType,
      icn: filters.itemControlNumber,
      lotName: filters.lotName,
    });
  }

  function clearFilter() {
    lottingDetailsState.other.selectedAgencyBureaus = [];
    lottingDetailsState.other.includeExclude = "";
    lottingDetailsState.other.selectedPropertyType = "";
    lottingDetailsState.other.fcsSelectedValues = [];
    lottingDetailsState.other.itemControlNumber = "";
    lottingDetailsState.other.lotName = "";

    updateLottingDetailsState(lottingDetailsState);

    let params = {
      salesId: saleId,
      zone: query.zoneId,
      page: 1,
      size: lottingDetailsState.other.page.pageSize,
      lotId: query.lotId ? query.lotId : null,

      //Filters
      agency: "",
      include: "Include",
      multiFSCList: "",
      propType: "",
      icn: "",
      lotName: "",
    };
    salesAPIService
      .getLotsForSale(params)
      .then((response) => {
        let state = lottingDetailsState;
        state.data.lots = response.data.lots;
        state.data.totalIcnCount = response.data.totalIcnCount;
        state.data.totalLotCount = response.data.totalLotCount;
        state.errors.invalidLots = response.data.invalidLotNumbers;
        let totalProperties = 0;
        state.data.lots.forEach((lot) => {
          totalProperties += lot?.propertyDetails?.length;
          if (lot.lotDescriptionType === "ICN") {
            lot.lotDescription = lot.propertyDetails[0]?.propertyDescription;
          }
        });
        state.other.totalProperties = totalProperties;
        state.other.page.totalRows = response.data.totalElements;
        updateLottingDetailsState(state);
        createLotListHelper();
      })
      .catch((errors) => {
        console.log(errors);
      });
    //Retrieve list of FSC codes to add back removed selected FSC
    commonApiService
      .getFSCCodes()
      .then((response: any) => {
        let other = lottingDetailsState.other;
        let fscCodes = response.data;
        other.fscCodes = fscCodes;
      })
      .catch((error) => {
        console.log(error);
      });
    //Retrieve list of Agency Bureaus to add back removed selected Agency Bureau
    commonApiService
      .getAllAgencyBureaus()
      .then((resp) => {
        let other = lottingDetailsState.other;

        let agencyBureau = resp.data.map((item) => {
          return {
            value: item.longName.trim(),
            agencyBureau: item.code + "-" + item.longName.trim(),
            id: item.code,
            isSelected: false,
          };
        });
        other.agencyBureaus = agencyBureau;
      })
      .catch((error) => {
        console.log(error);
      });
    updateLottingDetailsState({
      lottingDetailsState,
    });
  }

  function updateICN(action, lotId, lot, row) {
    let data = {
      lotId: lotId,
      salesId: lot.salesId,
      propertyDataResponse: row.original,
      action: action,
    };
    salesAPIService
      .addICNToLot(data)
      .then((lotNumber) => {
        getLotsForSales(
          lottingDetailsState.other.page.currentPage,
          lottingDetailsState.other.page.pageSize
        );
        let message = "";
        if (action === "remove") {
          message = `ICN ${formatICN(
            row.values.icn
          )} removed successfully from Lot ${lotNumber.data}.`;
        } else if (action === "move") {
          message = `ICN ${formatICN(row.values.icn)} moved from Lot ${
            lot.lotNumber
          } to Lot ${
            lotNumber.data
          }.You need to update photos/attachments as necessary.`;
        }
        addToast({
          text: message,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
        let message = "";
        if (action === "remove") {
          message = `ICN ${formatICN(
            row.values.icn
          )} could not removed from Lot.`;
        } else if (action === "move") {
          message = `ICN ${formatICN(
            row.values.icn
          )} could not be moved from Lot ${lot.lotNumber}.`;
        }
        addToast({
          text: message,
          type: "error",
          heading: "Error",
        });
      });
  }
  function saveLotDetails(lot, value) {
    let data: any = {
      lotId: lot.lotId,
      lotName: value.lotName,
      templateCode: value.templateCode,
      reservePrice: value.reservePrice,
      startingBid: value.startingBid,
      propType: value.propertyType,
      citizenshipRequired: value.citizenshipRequired,
      exportControlRequired: value.exportControlRequired,
      documentRequired: value.documentRequired,
      lotDescription: value.lotDescription.replace(/(<([/p>]+)>)/gi, ""),
      lotDescriptionType: value.lotDescriptionType,
    };

    salesAPIService
      .saveLotDetails(data)
      .then(() => {
        getLotsForSales(
          lottingDetailsState.other.page.currentPage,
          lottingDetailsState.other.page.pageSize
        );
        addToast({
          text: `Lot Details saved successfully`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: `Lot Details could not be saved successfully`,
          type: "error",
          heading: "Error",
        });
      });
  }

  const columns = [
    {
      Header: "ICN",
      accessor: "icn",
      Cell: (property) => (
        <a href={"/viewProperty/" + property.value}>
          {formatICN(property.value)}
        </a>
      ),
      filter: "search",
    },
    {
      Header: "Item Name",
      accessor: "propertyName",
      filter: "search",
    },
    {
      Header: "QTY.",
      accessor: "qty",
      Cell: (property) => {
        return (
          <>
            {property.value} {property.data[0].unitOfIssue}
          </>
        );
      },
      filter: "search",
    },
    {
      Header: "FMV",
      accessor: "fairMarketValue",
      Cell: (property) => {
        return (
          <>
            {property.value
              ? `$${property.value
                  .toString()
                  .split(/(?=(?:\\\\d{3})+(?:\\\\.|$))/g)
                  .join(",")}`
              : "-"}
          </>
        );
      },
      filter: "search",
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: (property) => (
        <>
          <PPMSButton
            variant={"primary"}
            label={"Delot"}
            size={"sm"}
            icon={<MdRemoveCircleOutline />}
            className="manage-list-actions"
            onPress={(event) => {
              delotOnPress(property);
            }}
            id={`remove-${property.row.values.icn}`}
            isDisabled={
              lottingDetailsState.edit_properties.actionDisabled
                ? lottingDetailsState.edit_properties.actionDisabled
                : !!property.lot?.contractNumber
            }
          />
          <PPMSSelect
            id={"sale-method"}
            identifierKey={"id"}
            identifierValue={"value"}
            selectClass={"lot-action-dropdown"}
            placeholderTextOnlyValue={true}
            name={"sale-method"}
            values={lottingDetailsState.constants.lotOptions.filter(
              (option) => {
                return option.id !== property.lot.lotId;
              }
            )}
            isRequired={true}
            placeholderValue={"Change Lot"}
            onChange={(event) => {
              if (property.lot.propertyDetails.length <= 1) {
                addToast({
                  text: `The ICN cannot be moved to another lot as there is only 1 ICN in this lot. You may delete the ICN by clicking on 'Delot' button and add to the Lot if needed.`,
                  type: "error",
                  heading: "Error",
                });
                event.target.value = "";
                return;
              }
              let value = event.target.options[event.target.selectedIndex].id;
              let lotId = null;
              if (value !== "add-a-new-lot") {
                lotId = parseInt(value);
              }
              let targetLot = lottingDetailsState.constants.lotOptionsData.filter(
                (lot) => {
                  return lot.lotId === lotId;
                }
              )[0];
              if (
                property.lot.propType !== targetLot?.propType &&
                targetLot?.propType
              ) {
                addToast({
                  text: `Selected Lot has ICN(s) of different property type, select another Lot to add ICN ${formatICN(
                    property.row.values.icn
                  )}.`,
                  type: "error",
                  heading: "Error",
                });
              } else {
                updateICN("move", lotId, property.lot, property.row);
              }
            }}
            disabled={
              lottingDetailsState.edit_properties.actionDisabled
                ? lottingDetailsState.edit_properties.actionDisabled
                : false
            }
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  function delotOnPress(property) {
    let state = lottingDetailsState;
    state.other.property = property;
    state.other.showDelotModal = true;
    updateLottingDetailsState(state);
  }
  function getPropertyTypeInfo(propType) {
    switch (propType) {
      case "A":
        return "Excess (Surplus)";
      case "B":
        return "Exchange Sale";
      case "C":
        return "Other Reimbursable Property";
      case "G":
        return "Surplus Reimbursable";
      default:
        return "";
    }
  }

  function getConditionCodeInfo(conditionCode) {
    switch (conditionCode) {
      case "N":
        return "New or Unused";
      case "U":
        return "Usable";
      case "R":
        return "Repairable";
      case "X":
        return "Salvage";
      case "S":
        return "Scrap";
      default:
        return "";
    }
  }

  function addNewSalesLot() {
    let params = {
      salesId: lottingDetailsState.data.salesId,
    };
    salesAPIService
      .addNewLot(params)
      .then((response) => {
        addToast({
          text: `Successfully added new lot`,
          type: "success",
          heading: "Success",
        });
        PageHelper.openPage(
          Paths.salesAddICNToLot +
            "/" +
            lottingDetailsState.data.salesId +
            "?zoneId=" +
            query.zoneId +
            "&newLot=" +
            response.data[response.data.length - 1].lotId
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const selectImagesDocs = (lotId, zoneId, lotNumber) => {
    PageHelper.openPage(
      Paths.salesLottingDetailsDocs +
        "/" +
        lottingDetailsState.data.salesId +
        "?lotId=" +
        lotId +
        "&zoneId=" +
        zoneId +
        "&lotNumber=" +
        lotNumber +
        "&page=" +
        lottingDetailsState.other.page.currentPage
    );
  };

  const handleNoResultsModalClose = () => {
    let state = lottingDetailsState;
    state.other.showNoResultsModal = false;
    updateLottingDetailsState(state);
  };

  const handleCloseDelotModal = () => {
    let state = lottingDetailsState;
    state.other.showDelotModal = false;
    updateLottingDetailsState(state);
  };

  const handleSaveDelotModal = (property) => {
    updateICN("remove", property.lot.lotId, property.lot, property.row);
    handleCloseDelotModal();
  };

  function handleChange(event) {
    let fscSelectedList = [];
    let fcsSelectedValues = [];
    event.forEach((e) => {
      fscSelectedList.push(e.code);
      fcsSelectedValues.push(e);
    });
    updateLottingDetailsState({
      fscCodeList: fscSelectedList,
      fcsSelectedValues: fcsSelectedValues,
    });
  }

  function handleICN(event) {
    let other = lottingDetailsState.other;
    let icnValue = event.target.value;
    let icnVal = icnValue.replaceAll(regexForTCNandICN, "").trim();

    other.itemControlNumber = icnVal;
    updateLottingDetailsState({
      other,
    });
  }

  function handleAAC(event) {
    let aacValue = event.target.value;
    let validation = validateAAC(aacValue);
    updateLottingDetailsState({
      aacId: aacValue,
      aacIsInvalid: validation.isInvalid,
      aacIsValid: !validation.isInvalid,
      aacValidationMessage: validation.validationError,
    });
  }

  function handleAgencyBureau(selectedAgencyBureaus) {
    let other = lottingDetailsState.other;
    other.selectedAgencyBureaus = selectedAgencyBureaus;
    updateLottingDetailsState({
      other,
    });

    updateLottingDetailsState({
      selectedAgencyBureaus: selectedAgencyBureaus,
    });
  }

  function handlePropertyType(event) {
    let other = lottingDetailsState.other;
    other.selectedPropertyType = event.target.value;

    updateLottingDetailsState({
      other,
    });
  }

  function handleIncludeChange(check) {
    let other = lottingDetailsState.other;
    other.includeExclude = check ? "Exclude" : "Include";
    other.isChecked = check;
    updateLottingDetailsState({
      other,
    });
  }

  function handleLotNameChange(event) {
    let other = lottingDetailsState.other;
    other.lotName = event.target.value;
    updateLottingDetailsState({
      other,
    });
  }

  function applyFilters() {
    let other = lottingDetailsState.other;

    let fscCodeList = [];
    other.fcsSelectedValues.forEach((fsc) => fscCodeList.push(fsc.code));
    let filters = {
      agency: other.selectedAgencyBureaus,
      include: other.includeExclude,
      selectedPropertyType: other.selectedPropertyType,
      fsc: fscCodeList,
      itemControlNumber: other.itemControlNumber,
      lotName: other.lotName,
    };
    applyFilter(filters);
  }

  function clearFilters() {
    updateLottingDetailsState({
      selectedAgencyBureaus: [],
      includeExclude: "Include",
      isChecked: false,
      selectedPropertyType: "",
      fcsSelectedValues: [],
      itemControlNumber: "",
      lotName: "",
    });
    clearFilter();
  }

  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={query.zoneId}
          saleId={saleId}
        />
        <div className="grid-row header-row mb-3">
          <h1>Lotting Details</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={query.zoneId}
                  currentPage={Paths.salesLottingDetails}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          {lottingDetailsState.data.salesId !== 0 && (
            <SaleNumberDetails
              saleId={saleId}
              showCurrentItems={true}
              zoneId={query.zoneId}
              totalICNs={lottingDetailsState.data.totalIcnCount}
              totalValidLots={lottingDetailsState.data.totalLotCount}
            />
          )}
          {lottingDetailsState.errors?.invalidLots?.length > 0 && (
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                <PPMSAlert type={"warning"}>
                  Lotting details have not been provided for Lot(s){" "}
                  <strong>
                    {lottingDetailsState.errors?.invalidLots?.join(", ")}
                  </strong>
                  .
                </PPMSAlert>
              </div>
            </div>
          )}
          <br />
          <div className="item-search-result">
            <div className="grid-row grid-gap-2">
              <div className="grid-col-12">
                <LottingTransactionFilter
                  handleLotNameChange={handleLotNameChange.bind(this)}
                  handleChange={handleChange.bind(this)}
                  fscState={lottingDetailsState.other.fscCodes}
                  fcsSelectedValues={
                    lottingDetailsState.other.fcsSelectedValues
                  }
                  lotName={lottingDetailsState.other.lotName}
                  icn={lottingDetailsState.other.itemControlNumber}
                  handleICN={handleICN.bind(this)}
                  icnIsInvalid={lottingDetailsState.other.icnIsInvalid}
                  icnIsValid={lottingDetailsState.other.icnIsValid}
                  icnValidationMessage={
                    lottingDetailsState.other.icnValidationMessage
                  }
                  aacId={lottingDetailsState.other.aacId}
                  handleAAC={handleAAC.bind(this)}
                  aacIsInvalid={lottingDetailsState.other.aacIsInvalid}
                  aacIsValid={lottingDetailsState.other.aacIsValid}
                  aacValidationMessage={
                    lottingDetailsState.other.aacValidationMessage
                  }
                  agencyBureaus={lottingDetailsState.other.agencyBureaus}
                  selectedAgencyBureaus={
                    lottingDetailsState.other.selectedAgencyBureaus
                  }
                  handleAgencyBureau={handleAgencyBureau.bind(this)}
                  propertyTypeIsInvalid={
                    lottingDetailsState.other.propertyTypeIsInvalid
                  }
                  propertyTypeIsValid={
                    lottingDetailsState.other.propertyTypeIsValid
                  }
                  propertyTypeValidationMessage={
                    lottingDetailsState.other.propertyTypeValidationMessage
                  }
                  selectedPropertyType={
                    lottingDetailsState.other.selectedPropertyType
                  }
                  handlePropertyType={handlePropertyType.bind(this)}
                  agencyBureauIsValid={
                    lottingDetailsState.other.agencyBureauIsValid
                  }
                  agencyBureauIsInvalid={
                    lottingDetailsState.other.agencyBureauIsInvalid
                  }
                  agencyBureauValidationMessage={
                    lottingDetailsState.other.agencyBureauValidationMessage
                  }
                  handleIncludeChange={handleIncludeChange.bind(this)}
                  isChecked={lottingDetailsState.other.isChecked}
                  applyFilter={applyFilters}
                  clearFilter={clearFilters}
                  onApply={applyFilter}
                  onClear={clearFilter}
                />
              </div>
            </div>
            <PPMSModal
              body={lottingDetailsState.other.modalMessage}
              id={"no-matching-lots"}
              show={lottingDetailsState.other.showNoResultsModal}
              handleClose={handleNoResultsModalClose}
              handleSave={handleNoResultsModalClose}
              labelCancelVariant="hide"
              title={"Search Lots"}
              label={"Ok"}
            />
          </div>
          <div className="item-search-result">
            <PPMSPagination
              page={lottingDetailsState.other.page.currentPage}
              pageSize={lottingDetailsState.other.page.pageSize}
              totalRows={lottingDetailsState.other.page.totalRows}
              onChangePage={(currentPage, pageSize) => {
                handlePageChange(currentPage, pageSize);
              }}
            />
          </div>
          <div className="item-search-result-wrapper">
            <a
              className="lot-details-toggle"
              onClick={() => {
                setToggleAllAccordions(!toggleAllAccordions);
              }}
              id={`toggle-accordion`}
            >
              {toggleAllAccordions ? "Collapse All" : "Expand All"}
            </a>
            {lottingDetailsState.data.lots.map((lot, index) => (
              <PPMSLot
                key={`lot-${index}-${saleId}`}
                toggleAllAccordions={toggleAllAccordions}
                lot={lot}
                salesDetails={lottingDetailsState.data.salesDetails}
                templateCodes={templateCodes}
                changeLotDetails={(value) => {
                  saveLotDetails(lot, value);
                }}
                propTypeInfo={getPropertyTypeInfo(lot.propType)}
                conditionCodeInfo={getConditionCodeInfo(lot.conditionCode)}
                data={lot.propertyDetails ? lot.propertyDetails : []}
                columns={columns}
                index={index}
                updateLotDescription={({ propertyDescription }) => {
                  let state = lottingDetailsState;
                  state.data.lots.filter((findLot) => {
                    return findLot.lotId === lot.lotId;
                  })[0].lotDescription = propertyDescription;
                  updateLottingDetailsState(state);
                }}
                lotDescriptionType={
                  lottingDetailsState.constants.lotDescriptionType
                }
                isLotDescriptionDisabled={
                  lottingDetailsState.constants.isLotDescriptionDisabled
                }
                selectImagesDocs={(lotId) =>
                  selectImagesDocs(lotId, query.zoneId, lot.lotNumber)
                }
                changeLotDescriptionType={(value) => {
                  let state = lottingDetailsState;
                  let foundLot = state.data.lots.filter((findLot) => {
                    return findLot.lotId === lot.lotId;
                  })[0];
                  if (value === 0) {
                    foundLot.lotDescription = foundLot.propertyDetails[0]
                      ?.propertyDescription
                      ? foundLot.propertyDetails[0]?.propertyDescription
                      : "";
                    foundLot.lotDescriptionType = "ICN";
                  } else {
                    foundLot.lotDescriptionType = "CUS";
                  }

                  updateLottingDetailsState(state);
                }}
                cancelDescription={() =>
                  getLotsForSales(
                    lottingDetailsState.other.page.currentPage,
                    lottingDetailsState.other.page.pageSize
                  )
                }
                uploadDocuments={fileUpload(
                  lot.lotId,
                  lot.lotNumber,
                  saleId,
                  saleNumber,
                  lottingDetailsState.edit_properties.actionDisabled
                )}
                actionsData={lottingDetailsState.edit_properties}
                hideAuctionAccordion = {false}
              />
            ))}
          </div>
          <div className="item-search-result">
            <PPMSPagination
              page={lottingDetailsState.other.page.currentPage}
              pageSize={lottingDetailsState.other.page.pageSize}
              totalRows={lottingDetailsState.other.page.totalRows}
              onChangePage={(currentPage, pageSize) => {
                handlePageChange(currentPage, pageSize);
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid-row grid-gap-2">
        <div className="desktop:grid-col-3" />
        <div className="desktop:grid-col-9">
          <PPMSButton
            id={"add-new-lot-link"}
            label={"Add New Lot"}
            className={"out-button"}
            onPress={addNewSalesLot}
            isDisabled={lottingDetailsState.edit_properties.actionDisabled}
          />
        </div>
      </div>

      <div className="grid-row grid-gap-2 next-prev-page">
        <div className="desktop:grid-col-3" />
        <div className="desktop:grid-col-9">
          <PPMSButton
            id={"lotting-details"}
            type={"button"}
            variant={"link"}
            label={"< Add ICN's to Lot(s)"}
            onPress={() =>
              PageHelper.openPage(
                Paths.salesAddICNToLot +
                  "/" +
                  saleId +
                  "?zoneId=" +
                  query.zoneId
              )
            }
          />
          <PPMSButton
            id={"custodian-locations"}
            type={"button"}
            variant={"link"}
            className={"usa-link float-right"}
            label={"Add Custodians/Locations >"}
            onPress={() => {
              if (lottingDetailsState.errors?.invalidLots?.length > 0) {
                addToast({
                  text: `Lotting details have not been provided for Lot(s) ${lottingDetailsState.errors.invalidLots.join()}.`,
                  type: "warning",
                  heading: "Warning",
                });
              }
              PageHelper.openPage(
                Paths.salesCustodian + "/" + saleId + "?zoneId=" + query.zoneId
              );
            }}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <DelotModal
          showDelotModal={lottingDetailsState.other.showDelotModal}
          handleCloseDelotModal={handleCloseDelotModal}
          handleSaveDelotModal={handleSaveDelotModal}
          property={lottingDetailsState.other.property}
        />
      </div>
    </StrictMode>
  );
};
const fileUpload = (lotId, lotNumber, saleId, saleNumber, actionDisabled) => {
  return (
    <>
      <br />
      <Upload
        lotId={lotId}
        saleId={saleId}
        lotNumber={lotNumber}
        saleNumber={saleNumber}
        actionDisabled={actionDisabled}
        fileInfectedStatus={() => {}}
      />
    </>
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
export default connect(mapStateToProps, mapDispatchToProps)(LottingDetails);
