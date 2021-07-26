import React, { StrictMode, useContext, useEffect, useState } from "react";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import * as queryString from "querystring";
import Breadcrumb from "../../common/Breadcrumb";
import SalesSideNav from "../../common/SideNav";
import { PPMSForm } from "../../../../../ui-kit/components/common/form/PPMS-form";
import ContractTransactionButtons from "./ContractTransactionButton";
import PPMSAccordion from "../../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { bindActionCreators } from "redux";
import { saleActions } from "../../../../../_redux/_actions/sale.actions";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { ContractTransactionContext } from "./ContractTransactionContext";
import { PPMSCardGroup } from "../../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardBody from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import ContractDetails from "./ContractDetails";
import ContractHistory from "./ContractHistory";
import AwardInformationButtons from "./AwardInformationButtons";
import AwardInformationDetails from "./AwardInformation";
import PPMSLot from "../../../../../ui-kit/components/sales/PPMSLot";
import { formatICN } from "../../../../../ui-kit/utilities/FormatUtil";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { PageHelper, Paths } from "../../../../Router";
import { Upload } from "../../../uploads/Upload";
import { UserUtils } from "../../../../../utils/UserUtils";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { ModalActionHistoryContent } from "../SalesTransaction";
import { DelotModal } from "../../lotting-details/DelotModal";
import { isEmptyCheck } from "../../../../../ui-kit/components/validations/FieldValidations";
import { VoidContractModal } from "./VoidContractModal";
import { AuctionsApiService } from "../../../../../api-kit/auctions/auctions-api-service";
import PaymentInformation from "./payment/PaymentInformation";
import RemovalInformation from "./RemovalInformation";
interface ContractTransactionProps {
  user?: any;
  roles?: any;
  actions?: any;
  location?: any;
  updateSaleInfo?: any;
  sale?: any;
  match: any;
  salesNumber?: any;
  contractNumber?: any;
  lotId?: any;
  zones?: any;
  salesId?: any;
  contractId?: any;
}

const ContractTransaction = (props: ContractTransactionProps) => {
  const {
    contractTransactionState,
    updateContractTransactionState,
  } = useContext(ContractTransactionContext);
  const { addToast } = props.actions;
  const { updateSaleInfo, user, sale, match, roles, location } = props;
  const [templateCodes, setTemplateCodes] = useState([]);
  const [saleNumber, updateSaleNumber] = useState("");
  const saleService = new SalesApiService();
  const [defaultZoneId, setdefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );
  let auctionsAPIService = new AuctionsApiService();
  let zone = [];
  let search = location.search;
  let query = queryString.parse(search);
  let contractNumbers = [];
  if (query["?contractNumber"] != null) {
    contractNumbers.push(query["?contractNumber"]);
  }
  let ids = [];
  let lotId = "";
  let saleId;
  let contractId;
  if (match?.params?.saleId) {
    saleId = match?.params?.saleId;
  }
  if (match?.params?.contractId) {
    contractId = match?.params?.contractId;
  }
  useEffect(() => {
    getAllContent();
  }, []);

  const getAwardInformation = (lotId) => {
    auctionsAPIService
      .getAwardInformation(lotId)
      .then((response) => {
        let state = contractTransactionState;
        state.awardData = response?.data;
        updateContractTransactionState(state);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSaleInformation = (saleId) => {
    saleService
      .getSalesInformation(saleId)
      .then((response) => {
        let state = contractTransactionState;
        state.salesNumberDetails = response?.data.salesNumberDetails;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllContent = () => {
    getSaleDetails();
  };

  const getContract = () => {
    let state = contractTransactionState;
    let data = {
      salesId: saleId,
      lotId: state.lotData.lotId,
      contractNumber: contractNumbers[0],
    };
    saleService
      .getContractByContractId(contractId)
      .then((res) => {
        saleId = res.data.lotDTO.salesId;
        lotId = res.data.lotDTO.lotId;
        state.contractData = res?.data?.contractDTO;
        state.lotData = res?.data?.lotDTO;
        updateContractTransactionState(state);
        getAwardInformation(lotId);
        getSaleInformation(saleId);
        if (
          state?.contractData?.useAlternateSco === true &&
          state?.contractData?.contractAlternateScoContact?.email !==
            user.emailAddress
        ) {
          state.other.actionDisabled = true;
        } else if (
          state?.contractData?.useAlternateSco === false &&
          (state?.contractData?.contractScoContact?.email ===
            user.emailAddress ||
            state?.contractData?.contractAlternateScoContact?.email ===
              user.emailAddress)
        ) {
          state.other.actionDisabled = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getTemplateCodes = () => {
    saleService
      .getTemplateCodes(defaultZoneId)
      .then((res) => {
        setTemplateCodes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function delotOnPress(property) {
    let state = contractTransactionState;
    state.other.property = property;
    state.other.showDelotModal = true;
    updateContractTransactionState(state);
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
            className="manage-list-actions"
            onPress={(event) => {
              delotOnPress(property);
            }}
            id={`remove-${property.row.values.icn}`}
            isDisabled={
              contractTransactionState.other.actionDisabled
                ? contractTransactionState.other.actionDisabled
                : contractTransactionState.lotData?.lotNumber &&
                  !contractTransactionState.contractData.contractNumber
                ? true
                : false
            }
          />
          <PPMSSelect
            id={"sale-method"}
            identifierKey={"id"}
            identifierValue={"value"}
            selectClass={"lot-action-dropdown"}
            placeholderTextOnlyValue={true}
            name={"sale-method"}
            values={contractTransactionState.constants.lotOptions.filter(
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
              let targetLot = contractTransactionState.constants.lotOptionsData.filter(
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
              contractTransactionState.other.actionDisabled
                ? contractTransactionState.other.actionDisabled
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
  const voidContract = (contractId) => {};

  const cancelContract = (contractId) => {};
  const defaultContract = (contractId) => {};
  const editAward = (contractId) => {
    PageHelper.openPage(
      Paths.contractTransactionAwardInfo +
        `/${saleId}?contractId=${contractTransactionState?.contractData?.contractId}`
    );
  };
  function getSaleDetails() {
    saleService
      .getSaleDetails(saleId)
      .then((res) => {
        let state = contractTransactionState;
        let details = res.data.salesNumberDetails;
        let todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);
        if (
          details.sco.email === user.emailAddress ||
          details?.alternateSCO?.email === user.emailAddress ||
          roles.isSG
        ) {
          state.other.actionDisabled = false;
        }
        console.log(details);
        state.data.salesDetails = details;
        updateContractTransactionState(state);
        updateSaleNumber(details.salesNumber);
        getContract();
        getTemplateCodes();
      })
      .catch((err) => {});
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
      lotDescription: value.lotDescription,
      lotDescriptionType: value.lotDescriptionType,
    };
    saleService
      .saveLotDetails(data)
      .then(() => {
        getContract();
      })
      .catch((error) => {
        console.log(error);
      });
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
  const selectImagesDocs = (lotId, zoneId, lotNumber) => {
    PageHelper.openPage(
      Paths.salesLottingDetailsDocs +
        "/" +
        contractTransactionState?.lotData.salesId +
        "?lotId=" +
        lotId +
        "&zoneId=" +
        zoneId +
        "&lotNumber=" +
        lotNumber +
        "&page=" +
        contractTransactionState.other.page.currentPage
    );
  };
  const fileUpload = (lotId, lotNumber, saleId, saleNumber, actionDisabled) => {
    console.log("Sales Id " + saleId);
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

  const handleContractTransactionActionHistory = () => {
    const data = {
      params: {
        objectType: "CONTRACT",
        objectId: contractNumbers[0].replace(/[^a-zA-Z0-9 ]/g, ""),
      },
    };
    saleService
      .getActionHistoryForSalesObject(data)
      .then((response: any) => {
        updateContractTransactionState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  function handleClose() {
    updateContractTransactionState({
      showActionHistoryModal: false,
    });
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
    saleService.getLotList(params).then((response) => {
      let options = createLotList(response.data);
      let state = contractTransactionState;
      state.constants.lotOptionsData = response.data;
      state.constants.lotOptions = options;
      updateContractTransactionState(state);
    });
  }
  function getLotsForSales(currentPage, pageSize) {
    let params = {
      salesId: saleId,
      zone: zone,
      page: currentPage,
      size: contractTransactionState.other.page.pageSize,
    };
    saleService
      .getLotsForSale(params)
      .then((response) => {
        let state = contractTransactionState;
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
        updateContractTransactionState(state);
        createLotListHelper();
        getAllContent();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleSalesTransactionActionHistory = () => {
    let state = contractTransactionState;
    const data = {
      params: {
        objectType: "SALES",
      },
    };
    saleService
      .getActionHistoryForSalesObject(data)
      .then((response: any) => {
        updateContractTransactionState({
          actionHistoryData: response.data,
          showActionHistoryModal: true,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const onViewDocumentAction = () => {
    updateSaleInfo(
      props.sale?.saleId,
      props.sale?.saleNumber,
      "view",
      parseInt(props.sale?.saleNumber?.substr(0, 1)),
      props.sale?.contractNumber,
      props.sale?.contractId
    );
    PageHelper.openPage(
      Paths.contractDocumentation +
        `/${saleId}?contractId=${contractTransactionState?.contractData?.contractId}`
    );
  };

  const handleCloseDelotModal = () => {
    let state = contractTransactionState;
    state.other.showDelotModal = false;
    state.withdrawReason = "";
    state.withdrawErrorMsg = "";
    state.withdrawInvalid = false;
    updateContractTransactionState(state);
  };
  const onVoidContractAction = () => {
    let canBeVoid = false;
    let state = contractTransactionState;
    auctionsAPIService
      .checkIfContractCanBeVoid(contractTransactionState.lotData.lotId)
      .then((response) => {
        canBeVoid = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    if (
      [
        "Default for non payments",
        "Default for non removal",
        "Awarded",
      ].includes(contractTransactionState.contractData.contractStatus) ||
      canBeVoid
    ) {
      addToast({
        text: "Contract cannot be Void, as Contract is Awarded",
        type: "error",
        heading: "Error",
      });
    } else {
      state.other.showVoidContractModal = true;
      updateContractTransactionState(state);
    }
  };
  const handleCloseVoidContractModal = () => {
    let state = contractTransactionState;
    state.other.showVoidContractModal = false;
    state.voidType = "";
    updateContractTransactionState(state);
  };
  const handleDelotAllICNSVoidContractModal = () => {
    handleCloseVoidContractModal();
  };

  function delotICNS(actionType: string) {
    let state = contractTransactionState;
    ids.push(state.lotData.lotId);
    let lotNumber = state.lotData.lotNumber;
    let data = {
      salesId: state.data.salesDetails.id,
      lotId: state.lotData.lotId,
      actionType: actionType,
      contractId: state.contractData.contractId,
      delotReason: state.delotAllNote,
    };
    saleService
      .delotAllICNS(data)
      .then((lotNumber) => {
        getAllContent();
        let message = "";
        message = `Successfully removed all the ICN(s) from Lot ${contractTransactionState.lotData.lotNumber}.`;
        addToast({
          text: message,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
        let message = `ICNS could not removed from Lot.`;
        addToast({
          text: message,
          type: "error",
          heading: "Error",
        });
      });
  }

  function transferLotWithContract(actionType: string) {
    let state = contractTransactionState;
    let lotNumber = state.lotData.lotNumber;
    let newSaleNumber = state.data.newSaleNumber;
    let data = {
      lotId: state.lotData.lotId,
      contractId: state.contractData.contractId,
      oldSaleId: saleId,
      newSaleNumber: newSaleNumber.replaceAll("-", ""),
    };
    saleService
      .transferLotWithContract(data)
      .then(() => {
        getAllContent();
        let message = "";
        message = `Lot moved to Sale # ${newSaleNumber}.`;
        addToast({
          text: message,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        console.log(error);
        let message = `Lot  could not be moved to Sale ${newSaleNumber}.`;
        addToast({
          text: message,
          type: "error",
          heading: "Error",
        });
      });
  }
  const handleSaveVoidContractModal = (event) => {
    let validation = validateDelotReason(contractTransactionState.delotAllNote);
    updateContractTransactionState({
      delotAllErrorMsg: validation.validationError,
      delotAllInvalid: validation.isInvalid,
    });
    if (!validation.isInvalid) {
      delotICNS("remove");
      handleCloseVoidContractModal();
    }
  };
  const handleTransferLot = (event) => {
    transferLotWithContract("move");
    handleCloseVoidContractModal();
  };
  function updateICN(action, lotId, lot, row) {
    let data = {
      lotId: lotId,
      salesId: lot.salesId,
      propertyDataResponse: row.original,
      withdrawReason: contractTransactionState.withdrawReason,
      action: action,
    };
    saleService
      .addICNToLot(data)
      .then((lotNumber) => {
        getLotsForSales(
          contractTransactionState.other.page.currentPage,
          contractTransactionState.other.page.pageSize
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
  const handleSaveDelotModal = (property) => {
    let validation = validateWithdraw(contractTransactionState.withdrawReason);
    updateContractTransactionState({
      withdrawErrorMsg: validation.validationError,
      withdrawInvalid: validation.isInvalid,
    });
    if (!validation.isInvalid) {
      updateICN("remove", property.lot.lotId, property.lot, property.row);
      handleCloseDelotModal();
    }
  };

  const handleWithdrawReason = (event) => {
    let validation = validateWithdraw(event.target.value);
    updateContractTransactionState({
      withdrawReason: event.target.value,
      withdrawErrorMsg: validation.validationError,
      withdrawInvalid: validation.isInvalid,
    });
  };

  const validateWithdraw = (value) => {
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Justification/comment is required";
    }
    return validation;
  };
  const validateDelotReason = (value) => {
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (isEmptyCheck(value)) {
      validation.isInvalid = true;
      validation.validationError = "Delot reason is required";
    }
    return validation;
  };

  const handleEditAwardInformation = () => {
    PageHelper.openPage(
      `${Paths.contractTransactionAwardInfo}/${saleId}/${contractTransactionState.contractData.contractId}/${contractTransactionState.awardData.auctionId}?zoneId=${defaultZoneId}`
    );
  };
  return (
    <StrictMode>
      <div className={"add-marketing-campaign grid-row ui-ppms"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={zone}
          saleId={saleId}
          lotId={lotId}
        />
        <div className="grid-row header-row mb-3">
          <h1>Contract Transaction</h1>
        </div>
        <br />
        {!(roles.isFIN || roles.isFIA) &&
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={defaultZoneId}
                  currentPage={Paths.contractTransaction}
                />
              </nav>
            </div>
          </div>
        </div>
        }
        <div className={"usa-layout-docs__sidenav desktop:grid-col-9"}>
          <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
            <PPMSForm
              noValidate
              large={false}
              search={true}
              onSubmit={() => {}}
              className={"usa-accordion--bordered desktop:grid-col-12"}
            >
              <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
                <PPMSCard>
                  <PPMSCardBody className="sale-number-details">
                    <ContractDetails
                      saleId={saleId}
                      contractNumber={
                        contractTransactionState?.contractData?.contractNumber
                      }
                      contractStatus={
                        contractTransactionState?.contractData?.contractStatus
                      }
                      bidderEmail={
                        contractTransactionState?.contractData?.bidderEmail
                      }
                      fscCode={contractTransactionState?.contractData?.fscCode}
                      paymentDate={
                        contractTransactionState?.contractData?.paymentDate
                      }
                      removalDate={
                        contractTransactionState?.contractData?.removalDate
                      }
                      salesNumber={
                        contractTransactionState?.contractData?.salesNumber
                      }
                      contractId={
                        contractTransactionState?.contractData?.contractId
                      }
                      lotNumber={contractTransactionState?.lotData.lotNumber}
                      defaultZoneId={defaultZoneId}
                      showCurrentItems={true}
                      showAvailableLots={true}
                      isPropertyCustodian={true}
                    />
                  </PPMSCardBody>
                  {!(roles.isFIN || roles.isFIA) &&
                  <PPMSCardBody className="sale-number-details-2">
                    <div className="tablet:grid-row">
                      <div className={"grid-row flex-justify"}>
                        <ContractTransactionButtons
                          voidContract={onVoidContractAction}
                          cancelFunction={() => {}}
                          viewDocument={onViewDocumentAction}
                          showActionHistory={true}
                          roles={roles}
                          salesId={contractTransactionState.saleNumber}
                          userEmail={user.emailAddress}
                          isSubmitDisabled
                          isSubmitLoading
                          viewDocumentVariant={"primary"}
                          contractNumber={sale.contractNumber}
                          contractId={sale.contractId}
                          actionDisable={
                            contractTransactionState.other.actionDisabled
                          }
                        />
                      </div>
                    </div>
                  </PPMSCardBody>
                  }
                </PPMSCard>
              </PPMSCardGroup>
              <div className={"grid-row-auto flex-justify"}>
                <ContractHistory
                  contractHistoryFunction={
                    handleContractTransactionActionHistory
                  }
                  saleId={saleId}
                  showAvailableLots={true}
                  isPropertyCustodian={true}
                  updatedAt={contractTransactionState?.contractData?.updatedAt}
                  createdBy={contractTransactionState?.contractData?.createdBy}
                  updatedBy={contractTransactionState?.contractData?.updatedBy}
                  updatedByName={
                    contractTransactionState?.contractData?.updatedBy
                  }
                />
              </div>
              <br />
              <PPMSAccordion
                items={[
                  {
                    title: "Lot Details",
                    content: (
                      <PPMSLot
                        key={`lot-${contractTransactionState.lotData}`}
                        lot={contractTransactionState.lotData}
                        salesDetails={
                          contractTransactionState.data.salesDetails
                        }
                        templateCodes={templateCodes}
                        changeLotDetails={(value) => {
                          saveLotDetails(
                            contractTransactionState.lotData,
                            value
                          );
                        }}
                        propTypeInfo={getPropertyTypeInfo(
                          contractTransactionState.lotData.propType
                        )}
                        conditionCodeInfo={getConditionCodeInfo(
                          contractTransactionState.lotData.conditionCode
                        )}
                        data={
                          contractTransactionState.lotData.propertyDetails
                            ? contractTransactionState.lotData.propertyDetails
                            : []
                        }
                        columns={columns}
                        index={0}
                        updateLotDescription={({ propertyDescription }) => {
                          let state = contractTransactionState;
                          state.lotData.lotDescription = propertyDescription;
                          updateContractTransactionState(state);
                        }}
                        lotDescriptionType={
                          contractTransactionState.constants.lotDescriptionType
                        }
                        isLotDescriptionDisabled={
                          contractTransactionState.constants
                            .isLotDescriptionDisabled
                        }
                        selectImagesDocs={(lotId) =>
                          selectImagesDocs(
                            lotId,
                            zone,
                            contractTransactionState.lotData.lotNumber
                          )
                        }
                        changeLotDescriptionType={(value) => {
                          let state = contractTransactionState;
                          let foundLot = state.lotData;
                          if (value === 0) {
                            foundLot.lotDescription = foundLot.propertyDetails
                              ?.propertyDescription
                              ? foundLot.propertyDetails?.propertyDescription
                              : "";
                            foundLot.lotDescriptionType = "ICN";
                          } else {
                            foundLot.lotDescriptionType = "CUS";
                          }
                          updateContractTransactionState(state);
                        }}
                        cancelDescription={() =>
                          getLotsForSales(
                            contractTransactionState.other.page.currentPage,
                            contractTransactionState.other.page.pageSize
                          )
                        }
                        uploadDocuments={fileUpload(
                          contractTransactionState?.lotData?.lotId,
                          contractTransactionState?.lotData?.lotNumber,
                          contractTransactionState?.data?.salesDetails?.id,
                          contractTransactionState?.data?.salesDetails
                            ?.salesNumber,
                          contractTransactionState?.other?.actionDisabled
                        )}
                        actionsData={{
                          actionDisabled:
                            contractTransactionState.other.actionDisabled,
                          lotNameDisabled:
                            contractTransactionState.other.actionDisabled,
                          templateDisabled:
                            contractTransactionState.other.actionDisabled,
                          startingbidDisabled:
                            contractTransactionState.other.actionDisabled,
                        }}
                        hideAuctionAccordion = {(roles.isFIN || roles.isFIA)}
                      />
                    ),
                    expanded: false,
                    id: "gsa-poc-detail-id",
                    className: "gsa-poc-detail",
                  },
                ]}
              />

              <div
                className={
                  "ui-ppms usa-layout-docs__main desktop:grid-col-auto usa-prose usa-layout-docs"
                }
              >
                <div className="grid-row">
                  <h2 className="lot-review-h2 full">Award Information</h2>
                </div>
                <div className="tablet:grid-row">
                  <div className={"grid-row grid-gap-2 flex-justify"}>
                    <AwardInformationDetails
                      saleId={saleId}
                      awardDetails={contractTransactionState.awardData}
                      showCurrentItems={true}
                      showAvailableLots={true}
                      isPropertyCustodian={true}
                    />
                  </div>
                </div>
                <br />
                <div className="tablet:grid-row">
                  <div className={"grid-row grid-gap-2 flex-justify"}>
                    <AwardInformationButtons
                      voidFunction1={() => voidContract(saleId)}
                      actionHistoryFunction={
                        handleSalesTransactionActionHistory
                      }
                      cancelFunction={() => cancelContract(saleId)}
                      showActionHistory={true}
                      roles={roles}
                      salesId={contractTransactionState.saleNumber}
                      userEmail={user.emailAddress}
                      isSubmitDisabled
                      isSubmitLoading
                      clearFunction={() => editAward(saleId)}
                      handleEditAwardInformation={handleEditAwardInformation}
                      auctionId={contractTransactionState.awardData.auctionId}
                    />
                  </div>
                </div>
              </div>
              <br />

              <PaymentInformation
                canEdit={contractTransactionState?.other?.actionDisabled}
              />
              <br />
              <RemovalInformation
                canEdit={contractTransactionState?.other?.actionDisabled}
              />
              <br />
              <div className="grid-row grid-gap-4">
                <PPMSModal
                  body={
                    <ModalActionHistoryContent
                      data={contractTransactionState.actionHistoryData}
                      listID={"list-id"}
                      title={contractNumbers[0]}
                    />
                  }
                  id={"show-action-history"}
                  show={contractTransactionState.showActionHistoryModal}
                  handleClose={handleClose}
                  handleSave={""}
                  title={"Action History Contract: " + contractNumbers[0]}
                  centered={true}
                  backdrop={"static"}
                  label={"Ok"}
                  hideLabelCancel={true}
                  hideLabel={contractTransactionState.showActionHistoryModal}
                  size={
                    contractTransactionState.showActionHistoryModal
                      ? "lg"
                      : null
                  }
                />
              </div>
            </PPMSForm>
          </div>
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <DelotModal
          showDelotModal={contractTransactionState.other.showDelotModal}
          handleCloseDelotModal={handleCloseDelotModal}
          handleSaveDelotModal={handleSaveDelotModal}
          property={contractTransactionState.other.property}
          handleWithdrawMethod={handleWithdrawReason}
          withdrawReason={contractTransactionState.withdrawReason}
          isContract={true}
          withdrawErrorMsg={contractTransactionState.withdrawErrorMsg}
          withdrawInvalid={contractTransactionState.withdrawInvalid}
        />
      </div>
      <div className="grid-row grid-gap-4">
        <VoidContractModal
          handleTransferLot={handleTransferLot}
          showVoidContractModal={
            contractTransactionState.other.showVoidContractModal
          }
          handleCloseVoidContractModal={handleCloseVoidContractModal}
          handleDelotAllICNSVoidContractModal={
            handleDelotAllICNSVoidContractModal
          }
          handleSaveVoidContractModal={handleSaveVoidContractModal}
          defaultZoneId={defaultZoneId}
          delotAllErrorMsg={contractTransactionState.delotAllErrorMsg}
          delotAllInvalid={contractTransactionState.delotAllInvalid}
        />
      </div>
    </StrictMode>
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
    updateSaleInfo: (
      saleId,
      saleNumber,
      saleAction,
      zone,
      contractNumber,
      contractId
    ) =>
      dispatch(
        saleActions.updateSaleInfo(
          saleId,
          saleNumber,
          saleAction,
          zone,
          contractNumber,
          contractId
        )
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractTransaction);
