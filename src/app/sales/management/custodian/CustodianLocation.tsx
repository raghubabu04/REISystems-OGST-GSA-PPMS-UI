import React, { StrictMode, useContext, useEffect, useState } from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../../Router";
import SaleNumberDetails from "../common/SaleNumberDetails";
import SalesSideNav from "../common/SideNav";
import queryString from "query-string";
import { CustodianLocationContext } from "./CustodianLocationContext";
import CustodianLocationModal from "./CustodianLocationModal";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PPMSCustodian from "../../../../ui-kit/components/sales/PPMSCustodian";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { Link } from "react-router-dom";
import PPMSPagination from "../../../../ui-kit/components/common/pagination/PPMS-pagination";
import Breadcrumb from "../common/Breadcrumb";
import moment from "moment";
import { filter, isEmpty } from "lodash";
import { commonActions } from "../../../../_redux/_actions/common.actions";
import { selectAllOption } from "./Constants";
import { UserUtils } from "../../../../utils/UserUtils";
import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";
import { CustodianLocationFilter } from "./CustodianLocationFilter";
import { regexForTCNandICN } from "../../../property/create-update-property/constants/Constants";
import LottingDetails from "../lotting-details/LottingDetails";

interface CustodianProps {
  match?: any;
  location?: any;
  history?: any;
  actions?: any;
  agencyBureaus: any;
  getHolidays?: any;
  holiday?: any;
  user?: any;
  roles?: any;
  onApply: any;
  onClear: any;
}
const CustodianLocation = (props: CustodianProps) => {
  const {
    match,
    location,
    agencyBureaus,
    getHolidays,
    holiday,
    user,
    roles,
  } = props;
  const { custodianLocationState, updateCustodianLocationState } = useContext(
    CustodianLocationContext
  );
  let salesService = new SalesApiService();
  let search = location.search;
  let query = queryString.parse(search);
  let saleId = null;
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }

  const [saleDate, setSaleDate] = useState(new Date(Date.now()).toString());
  const { addToast } = props.actions;
  const [viewLot, updateViewLot] = useState("");
  const [editCustodianCheck, updateEditCustodianCheck] = useState(false);
  const [showICNListModal, updateShowICNListModal] = useState(false);

  useEffect(() => {
    getHolidays(moment().year());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (agencyBureaus && agencyBureaus.length > 0) {
      getLotsForCustodian();
    }
    getLotCustodiansForSale(
      custodianLocationState.other.page.currentPage,
      custodianLocationState.other.page.pageSize
    );
    salesService
      .getSaleDetails(saleId)
      .then((res) => {
        let state = custodianLocationState;
        let details = res.data.salesNumberDetails;
        let todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);
        if (
          (details.sco.email === user.emailAddress ||
            details?.alternateSCO?.email === user.emailAddress ||
            details?.marketingSpecialist?.email === user.emailAddress ||
            roles.isSG) &&
          details.salesStatus !== "Closed"
        ) {
          state.other.actionDisabled = false;
        }

        state.other.salesDetails = details;
        setSaleDate(details.salesDate);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [agencyBureaus]);

  const columns = [
    {
      Header: "Lot Number",
      accessor: "lotNumber",
      Cell: (lotNumber) => {
        return (
          <>
            <strong>Lot {lotNumber.value}</strong>
          </>
        );
      },
      filter: "search",
    },
    {
      Header: "Total Items",
      accessor: "noOfItems",
      Cell: (items) => {
        return <>{items.value} Item(s)</>;
      },
      filter: "search",
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: (property) => (
        <>
          <PPMSButton
            id={`view-icns-in-lot-${property.row.original.lotId}`}
            label={"View ICNs"}
            className="viewicnCLS"
            onPress={() => {
              getListOfICNs(
                property.row.original,
                custodianLocationState.icnList.page.currentPage,
                custodianLocationState.icnList.page.pageSize
              );
            }}
            type={"button"}
            variant={"link"}
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  const getAvailableLots = () => {
    let lotArray = custodianLocationState.other?.lotOptions?.map((lot) => {
      return lot.value;
    });
    return lotArray;
  };

  const getLotCustodiansForSale = (currentPage, pageSize) => {
    let data = {
      param: {
        page: currentPage,
        size: custodianLocationState.other.page.pageSize,
      },
      body: { salesId: saleId },
    };
    salesService
      .getLotCustodiansForSale(data)
      .then((response) => {
        let state = custodianLocationState;
        state.data.listOfCustodians = response.data.lotCustodianDTOList;
        state.other.page.totalRows = response.data.totalElements;
        updateCustodianLocationState(state);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const disableSubmitToCustodian = (custodian) => {
    if (
      !isEmpty(custodian?.errors) ||
      isEmpty(custodian?.instructions) ||
      custodian?.lotDTOs?.[0]?.propertyResultMap?.propertyGroup ===
        "foreignGift"
    ) {
      return true;
    }
  };

  const getEmptyFieldValues = () => {
    let state = custodianLocationState;
    state.data.custodian.custodianInformation.email = "";
    state.data.custodian.custodianInformation.firstName = "";
    state.data.custodian.custodianInformation.lastName = "";
    state.data.custodian.custodianInformation.ccEmail = "";
    state.data.custodian.custodianInformation.agencyBureauCd = "";
    state.data.custodian.custodianInformation.phone = "";
    state.data.custodian.custodianInformation.phoneExtension = "";
    state.data.custodian.custodianInformation.addressDTO.addressLine1 = "";
    state.data.custodian.custodianInformation.addressDTO.addressLine2 = "";
    state.data.custodian.custodianInformation.addressDTO.addressLine3 = "";
    state.data.custodian.custodianInformation.addressDTO.city = "";
    state.data.custodian.custodianInformation.addressDTO.state = "";
    state.data.custodian.custodianInformation.addressDTO.zipCode = "";
    state.data.custodian.custodianInformation.addressDTO.zipExtn = "";
    state.data.custodian.notes = "";
    state.other.lotsList = [];
    selectAllOption[0].isSelected = false;
    state.validation.agencyBureauIsInvalid = false;
    state.validation.userCCEmailIsInvalid = false;
    state.validation.userEmailIsInvalid = false;
    state.validation.userPhoneIsInvalid = false;
    state.validation.userFirstNameIsInvalid = false;
    state.validation.userLastNameIsInvalid = false;
    state.validation.userCCEmailDisable = true;
    state.validation.userEmailDisable = true;
    state.validation.addressLine1isInvalid = false;
    state.validation.cityisInvalid = false;
    state.validation.stateisInvalid = false;
    state.validation.zipcodeisInvalid = false;
    state.validation.saveBtnDisabled = true;
    state.validation.assignBtnDisabled = true;
    state.other.locationDisableOnly = true;
    state.other.emailNew = false;
    updateCustodianLocationState(state);
  };
  const handleICNListPageChange = (currentPage, pageSize) => {
    let state = custodianLocationState;
    state.icnList.page.currentPage = currentPage;
    state.icnList.page.pageSize = pageSize;
    updateCustodianLocationState(state);
    getListOfICNs(
      custodianLocationState.icnList.selectedLot,
      currentPage,
      pageSize
    );
  };

  const getListOfICNs = (lot, page, size) => {
    let data = {
      lotId: lot.lotId,
      params: {
        page: page,
        size: custodianLocationState.icnList.page.pageSize,
      },
    };
    salesService
      .getICNListByLotId(data)
      .then((response) => {
        let state = custodianLocationState;
        state.icnList.data = response.data.icnList;
        state.icnList.page.totalRows = response.data.totalElements;
        state.icnList.selectedLot = lot;
        updateCustodianLocationState(state);
        updateViewLot(lot.lotNumber);
        updateShowICNListModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const createLotOptions = (data: any[], isSelected) => {
    let options = [];
    if (data) {
      options = data.map((item, index) => {
        return {
          id: `lot-${item.lotId}`,
          lotId: item.lotId.toString(),
          value: item.lotNumber.toString(),
          isSelected: isSelected,
        };
      });
    }
    return options;
  };
  const agencyBureausList = (agencyBureaus) => {
    let agencyBureausList = [];
    if (agencyBureaus) {
      agencyBureausList = agencyBureaus.map((item) => {
        return {
          value: item.longName.trim(),
          agencyBureau: item.code + "-" + item.longName.trim(),
          id: item.code,
          isSelected: false,
        };
      });
    }
    return agencyBureausList;
  };
  const getLotsForCustodian = () => {
    let state = custodianLocationState;
    let params = {
      assigned: true,
    };
    salesService
      .getLotsForCustodianBySale(saleId, params)
      .then((response) => {
        let options = createLotOptions(response.data, false);
        let agencyBureau = agencyBureausList(agencyBureaus);
        state.other.lotOptions = options;
        state.other.agencyBureaus = agencyBureau;
        state.validation.addCustodianBtnDisable = options.length < 1;
        state.validation.addCustodianBtnLoading = false;
        state.data.custodian.salesId = saleId;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        updateCustodianLocationState(state);
      });
  };

  const editCustodian = (custodian) => {
    updateEditCustodianCheck(true);
    let lotOptions = createLotOptions(custodian.lotDTOs, true);
    let lotOptionsFinal = custodianLocationState.other.lotOptions
      .concat(lotOptions)
      .sort((a, b) => (a.lotId > b.lotId ? 1 : -1));
    let state = custodianLocationState;
    state.other.edit = true;
    state.data.custodian.lotCustodianId = custodian.lotCustodianId;
    state.data.custodian.lotIds = custodian.lotIds;
    state.other.editLots = custodian.lotIds;
    state.data.custodian.custodianInformation = custodian.custodianInformation;
    state.data.custodian.notes = custodian.notes;
    state.other.lotOptions = lotOptionsFinal;
    state.other.custodianModal = true;
    state.validation.userEmailDisable = false;
    state.validation.userCCEmailDisable = false;
    state.other.locationDisableOnly = false;
    state.validation.saveBtnDisabled = false;
    state.validation.assignBtnDisabled = true;
    updateCustodianLocationState(state);
  };

  const resetState = (close) => {
    if (close === true) {
      handleClose();
    } else {
      getLotsForCustodian();
      getEmptyFieldValues();
      getLotCustodiansForSale(
        custodianLocationState.other.page.currentPage,
        custodianLocationState.other.page.pageSize
      );
      updateEditCustodianCheck(false);
      if (custodianLocationState.other.lotOptions.length < 1) {
        handleClose();
      }
    }
  };

  const handleSave = (close, type) => {
    let state = custodianLocationState;
    let data = state.data.custodian;
    if (isEmpty(data.custodianInformation.email)) {
      state.validation.userEmailIsInvalid = true;
    } else if (isEmpty(data.custodianInformation.firstName)) {
      state.validation.userFirstNameIsInvalid = true;
      state.validation.userFirstNameValidationMessage =
        "First name is required";
    } else if (isEmpty(data.custodianInformation.lastName)) {
      state.validation.userLastNameIsInvalid = true;
      state.validation.userLastNameValidationMessage = "Last name is required";
    } else if (isEmpty(data.custodianInformation.phone.toString())) {
      state.validation.userPhoneIsInvalid = true;
      state.validation.userPhoneValidationMessage = "Phone is required";
    } else if (isEmpty(data.custodianInformation.agencyBureauCd.toString())) {
      state.validation.agencyBureauIsInvalid = true;
      state.validation.agencyBureauValidationMessage = "Agency is required";
    } else if (isEmpty(data.custodianInformation.addressDTO.addressLine1)) {
      state.validation.addressLine1isInvalid = true;
      state.validation.addressLine1ValidationMessage =
        "Address line 1 is required";
    } else if (isEmpty(data.custodianInformation.addressDTO.city)) {
      state.validation.cityisInvalid = true;
      state.validation.cityValidationMessage = "City is required";
    } else if (isEmpty(data.custodianInformation.addressDTO.state)) {
      state.validation.stateisInvalid = true;
    }

    updateCustodianLocationState(state);
    if (
      state.validation.userCCEmailIsInvalid ||
      state.validation.userEmailIsInvalid ||
      state.validation.userFirstNameIsInvalid ||
      state.validation.userLastNameIsInvalid ||
      state.validation.userPhoneIsInvalid ||
      state.validation.agencyBureauIsInvalid ||
      state.validation.addressLine1isInvalid ||
      state.validation.cityisInvalid ||
      state.validation.stateisInvalid ||
      state.validation.zipcodeisInvalid
    ) {
      addToast({
        text: "Error confirming request, check validation(s)",
        type: "error",
        heading: "Error",
      });
    } else {
      if (type === "save") {
        salesService
          .saveLotCustodian(data)
          .then((response) => {
            addToast({
              text:
                "Property Custodian and Location Details successfully saved.",
              type: "success",
              heading: "Success",
            });
            resetState(close);
          })
          .catch((error) => {
            console.log(error);
            addToast({
              text: "Error confirming request",
              type: "error",
              heading: "Error",
            });
          });
      } else if (type === "update") {
        salesService
          .updateLotCustodian(data)
          .then(() => {
            addToast({
              text:
                "Property Custodian and Location Details successfully saved.",
              type: "success",
              heading: "Success",
            });
            resetState(close);
          })
          .catch((error) => {
            console.error(error);
            addToast({
              text: "Error confirming request",
              type: "error",
              heading: "Error",
            });
          });
      }
    }
  };

  const handleSaveInspection = (
    lotCustodianId,
    inspectionInstruction,
    inspectionFrom,
    inspectionTo,
    inspectionFromTime,
    inspectionFromAmPm,
    inspectionToTime,
    inspectionToAmPm
  ) => {
    if (!isEmpty(inspectionFromTime) && isEmpty(inspectionToTime)) {
      addToast({
        text: "Please enter inspection to time",
        type: "error",
        heading: "Error",
      });
    } else {
      let data = {
        salesId: saleId,
        lotCustodianId: lotCustodianId,
        instructions: inspectionInstruction,
        inspectionFromDate: moment(inspectionFrom).format("MM/DD/YYYY"),
        inspectionToDate: moment(inspectionTo).format("MM/DD/YYYY"),
        inspectionFromTime:
          inspectionFromTime.substr(0, 5) + inspectionFromAmPm,
        inspectionToTime: inspectionToTime.substr(0, 5) + inspectionToAmPm,
      };
      salesService
        .saveInspection(data)
        .then((response) => {
          if (!isEmpty(response?.data?.errors)) {
            addToast({
              text: "Please fill in the lot details",
              type: "warning",
              heading: "Warning",
            });
          }
          addToast({
            text: "Successfully saved the inspection details",
            type: "success",
            heading: "Success",
          });
          getLotCustodiansForSale(
            custodianLocationState.other.page.currentPage,
            custodianLocationState.other.page.pageSize
          );
        })
        .catch((error) => {
          console.log(error);
          addToast({
            text: "Error confirming request",
            type: "error",
            heading: "Error",
          });
        });
    }
  };

  const closeICNListModal = () => {
    updateShowICNListModal(false);
  };

  const handlePageChange = (currentPage, pageSize) => {
    let state = custodianLocationState;
    state.other.page.currentPage = currentPage;
    state.other.page.pageSize = pageSize;
    updateCustodianLocationState(state);
    getLotCustodiansForSale(currentPage, pageSize);
  };

  const handleClose = () => {
    let state = custodianLocationState;
    state.other.custodianModal = false;
    updateCustodianLocationState(state);
    updateEditCustodianCheck(false);
    getLotsForCustodian();
    getEmptyFieldValues();
    getLotCustodiansForSale(
      custodianLocationState.other.page.currentPage,
      custodianLocationState.other.page.pageSize
    );
  };

  const submitToCustodian = (custodian) => {
    salesService
      .submitToCustodian(custodian.lotCustodianId)
      .then((response) => {
        addToast({
          text: "Successfully submitted to custodian",
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.error(error);
        addToast({
          text: "Error confirming request",
          type: "error",
          heading: "Error",
        });
      });
  };

  const custodianToastMessage = () => {
    addToast({
      text: "Error confirming request",
      type: "error",
      heading: "Error",
    });
  };

  const handleNoResultsModalClose = () => {
    let state = custodianLocationState;
    state.other.showNoResultsModal = false;
    updateCustodianLocationState(state);
  };

  function handleLotNumberChange(event) {
    let other = custodianLocationState.other;
    other.lotNumber = event.target.value;
    updateCustodianLocationState({
      other,
    });
  }

  function handleICN(event) {
    let other = custodianLocationState.other;
    let icnValue = event.target.value;
    let icnVal = icnValue.replaceAll(regexForTCNandICN, "").trim();

    other.itemControlNumber = icnVal;
    updateCustodianLocationState({
      other,
    });
  }

  function handleEmailAddressChange(event) {
    let other = custodianLocationState.other;
    other.emailAddress = event.target.value;
    updateCustodianLocationState({
      other,
    });
  }

  function applyFilters() {
    let other = custodianLocationState.other;

    let filters = {
      lotNumber: other.lotNumber,
      itemControlNumber: other.itemControlNumber,
      emailAddress: other.emailAddress,
    };
    applyFilter(filters);
  }

  function clearFilters() {
    updateCustodianLocationState({
      lotNumber: NaN,
      itemControlNumber: "",
      emailAddress: "",
    });
    clearFilter();
  }

  function applyFilter(filters) {
    let data = {
      param: {
        page: custodianLocationState.other.page.currentPage,
        size: custodianLocationState.other.page.pageSize,
      },
      body: {
        salesId: saleId,

        //Filters
        lotNumber: filters.lotNumber,
        email: filters.emailAddress,
        icn: filters.itemControlNumber,
      },
    };
    salesService
      .getLotCustodiansForSale(data)
      .then((response) => {
        let state = custodianLocationState;
        state.data.listOfCustodians = response.data.lotCustodianDTOList;
        state.other.page.totalRows = response.data.totalElements;
        if (response.data.totalElements === 0) {
          state.other.showNoResultsModal = true;
          state.other.modalMessage = "No Custodian found for your search.";
          updateCustodianLocationState(state);
        }
        updateCustodianLocationState(state);
      })
      .catch((error) => {
        console.log(error);
      });

    updateCustodianLocationState({
      lotNumber: filters.lotNumber,
      icn: filters.itemControlNumber,
      email: filters.emailAddress,
    });
  }

  function clearFilter() {
    custodianLocationState.other.lotNumber = NaN;
    custodianLocationState.other.emailAddress = "";
    custodianLocationState.other.itemControlNumber = "";

    updateCustodianLocationState(custodianLocationState);

    getLotCustodiansForSale(
      custodianLocationState.other.page.currentPage,
      custodianLocationState.other.page.pageSize
    );
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
          <h1>Custodians/Locations</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={query.zoneId}
                  currentPage={Paths.salesCustodian}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <SaleNumberDetails
            saleId={saleId}
            zoneId={query.zoneId}
            availableLots={getAvailableLots()}
            showAvailableLots={true}
          />
          <div className="item-search-result-wrapper">
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                <PPMSButton
                  id={"add-custodian-location-button"}
                  label={"Add Custodian/Location"}
                  variant="outline-primary"
                  className={"out-button"}
                  onPress={() => {
                    let state = custodianLocationState;
                    state.other.custodianModal = true;
                    updateCustodianLocationState(state);
                  }}
                  isDisabled={
                    custodianLocationState.other.actionDisabled
                      ? custodianLocationState.other.actionDisabled
                      : custodianLocationState.validation.addCustodianBtnDisable
                  }
                  isLoading={
                    custodianLocationState.validation.addCustodianBtnLoading
                  }
                />
              </div>
            </div>
            <br />
            <div className="item-search-result">
              <div className="grid-row grid-gap-2">
                <div className="grid-col-12">
                  <CustodianLocationFilter
                    handleLotNumberChange={handleLotNumberChange.bind(this)}
                    lotNumber={custodianLocationState.other.lotNumber}
                    handleICN={handleICN.bind(this)}
                    icn={custodianLocationState.other.itemControlNumber}
                    icnIsInvalid={custodianLocationState.other.icnIsInvalid}
                    icnIsValid={custodianLocationState.other.icnIsValid}
                    icnValidationMessage={
                      custodianLocationState.other.icnValidationMessage
                    }
                    emailAddress={custodianLocationState.other.emailAddress}
                    handleEmailAddressChange={handleEmailAddressChange.bind(
                      this
                    )}
                    applyFilter={applyFilters}
                    clearFilter={clearFilters}
                    onApply={applyFilter}
                    onClear={clearFilter}
                  />
                </div>
              </div>
              <PPMSModal
                body={custodianLocationState.other.modalMessage}
                id={"no-matching-custodian"}
                show={custodianLocationState.other.showNoResultsModal}
                handleClose={handleNoResultsModalClose}
                handleSave={handleNoResultsModalClose}
                labelCancelVariant="hide"
                title={"Search Custodian"}
                label={"Ok"}
              />
            </div>
            <br />
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                <PPMSPagination
                  page={custodianLocationState.other.page.currentPage}
                  pageSize={custodianLocationState.other.page.pageSize}
                  totalRows={custodianLocationState.other.page.totalRows}
                  onChangePage={(currentPage, pageSize) => {
                    handlePageChange(currentPage, pageSize);
                  }}
                />
              </div>
            </div>
            <br />
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                {custodianLocationState.data.listOfCustodians.map(
                  (custodian, index) => (
                    <PPMSCustodian
                      key={`custodian-key-${index}`}
                      columns={columns}
                      custodian={custodian}
                      index={index}
                      addToast={custodianToastMessage}
                      saleDate={saleDate}
                      agencyBureau={
                        custodianLocationState.other?.agencyBureaus?.filter(
                          (agencyBureau) => {
                            return (
                              agencyBureau?.id ===
                              custodian?.custodianInformation?.agencyBureauCd
                            );
                          }
                        )[0]
                      }
                      handleSaveInspection={handleSaveInspection}
                      editCustodian={editCustodian}
                      setHolidayYear={(year) => getHolidaysByYear(year)}
                      holidayList={holiday?.holidays}
                      actionDisabled={
                        custodianLocationState.other.actionDisabled
                      }
                      submitCustodian={submitToCustodian}
                      submitToCustodianDisabled={disableSubmitToCustodian}
                    />
                  )
                )}
              </div>
            </div>
            <br />
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                <PPMSPagination
                  page={custodianLocationState.other.page.currentPage}
                  pageSize={custodianLocationState.other.page.pageSize}
                  totalRows={custodianLocationState.other.page.totalRows}
                  onChangePage={(currentPage, pageSize) => {
                    handlePageChange(currentPage, pageSize);
                  }}
                />
              </div>
            </div>
            <br />
            <div className="grid-row grid-gap-2 next-prev-page">
              <div className="grid-col-3">
                <PPMSButton
                  id={"lotting-details-back"}
                  variant={"link"}
                  label={"< Lotting Details"}
                  className={"delete-property"}
                  type={"button"}
                  onPress={() => {
                    PageHelper.openPage(
                      Paths.salesLottingDetails +
                        "/" +
                        saleId +
                        "?zoneId=" +
                        query.zoneId
                    );
                  }}
                />
              </div>
              <div className="grid-col-9">
                <PPMSButton
                  id={"lot-auction-button"}
                  label={"Lot Auction Approval >"}
                  variant={"link"}
                  className={"delete-property float-right"}
                  type={"button"}
                  onPress={() => {
                    PageHelper.openPage(
                      Paths.salesLotAuctionAprroval +
                        "/" +
                        saleId +
                        "?zoneId=" +
                        query.zoneId
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="grid-row grid-gap-4">
        <CustodianLocationModal
          showModal={custodianLocationState.other.custodianModal}
          handleClose={handleClose}
          custodianState={custodianLocationState}
          handleSave={handleSave}
          getEmptyFieldValues={getEmptyFieldValues}
          editCustodian={editCustodianCheck}
        />
      </div>
      <ICNListModal
        show={showICNListModal}
        body={
          <ICNListModalBody
            pageSize={custodianLocationState.icnList.page.pageSize}
            currentPage={custodianLocationState.icnList.page.currentPage}
            icnList={custodianLocationState.icnList.data}
            handleICNListPageChange={handleICNListPageChange}
            totalRows={custodianLocationState.icnList.page.totalRows}
          />
        }
        close={closeICNListModal}
        lotNumber={viewLot}
      />
    </StrictMode>
  );
};

const ICNListModal = ({ show, body, close, lotNumber }) => {
  return (
    <PPMSModal
      id={`icnList`}
      show={show}
      title={`Lot ${lotNumber} : Item Control Numbers`}
      handleClose={close}
      hideLabel={true}
      labelCancel={"Close"}
      handleSave={() => {}}
      body={body}
      size="lg"
      centered
    />
  );
};

const ICNListModalBody = ({
  currentPage,
  pageSize,
  totalRows,
  handleICNListPageChange,
  icnList,
}) => {
  return (
    <>
      <PPMSPagination
        page={currentPage}
        pageSize={pageSize}
        totalRows={totalRows}
        onChangePage={(currentPage, pageSize) => {
          handleICNListPageChange(currentPage, pageSize);
        }}
      />
      <ol>
        {icnList.map((icn) => {
          return (
            <li>
              <Link to={`${Paths.viewProperty}/${icn}`}>
                <h3>
                  {icn.length <= 14
                    ? icn.replace(/(.{6})(.{4})(.{4})/, "$1-$2-$3")
                    : icn.replace(/(.{6})(.{4})(.{4})(.+)/, "$1-$2-$3-$4")}
                </h3>
              </Link>
            </li>
          );
        })}
      </ol>
      <PPMSPagination
        page={currentPage}
        pageSize={pageSize}
        totalRows={totalRows}
        onChangePage={(currentPage, pageSize) => {
          handleICNListPageChange(currentPage, pageSize);
        }}
      />
    </>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
  };
};

const mapStateToProps = (state) => ({
  agencyBureaus: state.common.agencyBureaus,
  holiday: state.common.holiday,
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps, mapDispatchToProps)(CustodianLocation);
