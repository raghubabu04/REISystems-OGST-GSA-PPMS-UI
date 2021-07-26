import React, { useEffect, useState } from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import { connect } from "react-redux";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import moment from "moment";
import { formatICN, formatTCN } from "../../../ui-kit/utilities/FormatUtil";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { getRoles } from "../../../_redux/_helpers/roles";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSState } from "../../../ui-kit/components/PPMS-state";
import { UserUtils } from "../../../utils/UserUtils";
import { BsEyeFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { isEmptyCheck } from "../../../ui-kit/components/validations/FieldValidations";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { PPMSPopover } from "../../../ui-kit/components/common/PPMS-popover";
import { FaInfoCircle } from "react-icons/fa";
import { PageHelper, Paths } from "../../Router";
import { InventoryApiService } from "../../../api-kit/property/inventory-api-service";
import TransferLEAModal from "./possession-history/TransferLEAModal";
import { PossessionHistoryContextProvider } from "./possession-history/PossessionHistoryContext";
import {
  ItemStatusCodeValues,
  statusCodeValuesFullList,
} from "./possession-history/Constants";
import { PPMSDatepicker } from "../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import {
  AnnualInventoryState,
  AnnualInventoryStateDefault,
} from "./AnnualInventoryState";
import { bindActionCreators } from "redux";
import { PPMSToggleRadio } from "../../../ui-kit/components/common/toggle/PPMS-toggle";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

function AnnualInventory(props: Props) {
  const [annualInventory, setAnnualInventoryState] = useState<
    AnnualInventoryState
  >(AnnualInventoryStateDefault);
  const [startInventoryDisable, setStartInventoryDisable] = useState<boolean>(
    false
  );
  const inventoryApiService = new InventoryApiService();
  const commonApiService = new CommonApiService();
  const { addToast } = props.actions;

  function updateAnnualInventoryCycle(newState: any) {
    setAnnualInventoryState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  }

  useEffect(() => {
    const { annualInventoryCycle } = annualInventory;

    if (UserUtils.isSystemAdminUser() || UserUtils.isUserFireArmManager()) {
      annualInventoryCycle.hideAnnualInventoryButton = false;
    }
    //Get State List
    commonApiService.getStateList().then((response: any) => {
      updateAnnualInventoryCycle({
        stateCodeList: response.data,
      });
      setRoleChanges();
    });
    inventoryApiService.findActiveInventory().then((response) => {
      if (
        response.data.startDate === null ||
        response.data.startDate === "" ||
        response.data.startDate === " "
      ) {
        updateAnnualInventoryCycle({
          disableManageInventory: true,
        });
      } else {
        let isAterStart = moment(moment(new Date(Date.now())).toDate()).isAfter(
          moment(response.data.startDate).startOf("day").toDate()
        );
        let isBeforeEnd = moment(
          moment(new Date(Date.now())).toDate()
        ).isBefore(moment(response.data.endDate).endOf("day").toDate());
        let inActive;
        if (isAterStart && isBeforeEnd) {
          inActive = false;
        } else {
          inActive = true;
        }
        updateAnnualInventoryCycle({
          disableManageInventory: inActive,
        });
      }
    });
    //Get initial list from API
    getAnnualInventory([]);
  }, []);

  function setRoleChanges() {
    //Check for State SASP
    if (getRoles()["isFI"] && getRoles()["isSA"]) {
      updateAnnualInventoryCycle({
        isStateSasp: true,
        stateCodeFilter: UserUtils.getUserStateCode().toString(),
        canViewTopfilters: true,
      });
      handleStateChange(UserUtils.getUserStateCode());
    } else if (
      //Top filters are viewable by:
      // SM, Firearm Manager, State SASP, Admin SASP
      (getRoles()["isMU"] && getRoles()["isSA"]) ||
      getRoles()["isSM"] ||
      getRoles()["isFM"]
    ) {
      updateAnnualInventoryCycle({
        canViewTopfilters: true,
      });
    }
  }

  function getAnnualInventory(filters) {
    updateAnnualInventoryCycle({
      loading: true,
    });
    let firearmSerialNo;
    let itemName;
    let inventoryDate;
    let ownershipChangeDate;
    let icn;
    let tcn;
    let inventory;
    let itemStatus;
    if (filters.length === 0) {
      itemStatus = annualInventory.itemStatusFilter;
    }
    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].id) {
        case "specialDescriptionCode":
          firearmSerialNo = filters[i]["value"];
          break;
        case "itemName":
          itemName = filters[i]["value"];
          break;
        case "lastInventoryDate":
          inventoryDate = filters[i]["value"];
          break;
        case "ownershipChangeDate":
          ownershipChangeDate = filters[i]["value"];
          break;
        case "itemControlNumber":
          icn = filters[i]["value"];
          break;
        case "transferControlNumber":
          tcn = filters[i]["value"];
          break;
        case "inventory":
          inventory = filters[i]["value"];
          break;
        case "itemStatus":
          itemStatus = filters[i]["value"]
            ? filters[i]["value"].toUpperCase()
            : "";
          break;
      }
    }

    let lastInventoryDateFrom;
    let lastInventoryDateTo;
    if (inventoryDate) {
      lastInventoryDateFrom = moment(
        moment(inventoryDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT00:00:00.000");
      lastInventoryDateTo = moment(
        moment(inventoryDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT23:59:59.999");
    }
    let ownershipChangeDateFrom;
    let ownershipChangeDateTo;
    if (ownershipChangeDate) {
      ownershipChangeDateFrom = moment(
        moment(ownershipChangeDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT00:00:00.000");
      ownershipChangeDateTo = moment(
        moment(ownershipChangeDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT23:59:59.999");
    }
    //Allow for search input to use dashes and still work
    let itemControlNumber = icn ? icn.replace(/-/g, "") : "";
    let transferControlNumber = tcn ? tcn.replace(/-/g, "") : "";

    let data = {
      specialDescriptionCode: firearmSerialNo,
      itemName: itemName,
      lastInventoryDateTo: lastInventoryDateTo,
      lastInventoryDateFrom: lastInventoryDateFrom,
      ownershipChangeDateTo: ownershipChangeDateTo,
      ownershipChangeDateFrom: ownershipChangeDateFrom,
      itemControlNumber: itemControlNumber,
      transferControlNumber: transferControlNumber,
      inventory: inventory,
      itemStatus: itemStatus,
      stateCode: annualInventory.stateCodeFilter,
      leaEmail: annualInventory.leaEmailFilter,
      organizationName: annualInventory.organizationNameFilter,
      params: {
        page: 1,
        size: annualInventory.perPage,
      },
    };

    if (annualInventory.sort) {
      data.params["sort"] = annualInventory.sort;
    }

    updateAnnualInventoryCycle({
      firearmSerialNoFilter: firearmSerialNo,
      itemNameFilter: itemName,
      lastInventoryDateToFilter: lastInventoryDateTo,
      lastInventoryDateFromFilter: lastInventoryDateFrom,
      ownershipChangeDateToFilter: ownershipChangeDateTo,
      ownershipChangeDateFromFilter: ownershipChangeDateFrom,
      icnFilter: itemControlNumber,
      tcnFilter: tcn,
      inventoryFilter: inventory,
      itemStatusFilter: itemStatus,
    });

    makeApiCall(data);
  }

  async function handleChange(perPage, page) {
    updateAnnualInventoryCycle({
      loading: true,
    });
    let data = {
      specialDescriptionCode: annualInventory.firearmSerialNoFilter,
      itemName: annualInventory.itemNameFilter,
      lastInventoryDateTo: annualInventory.lastInventoryDateToFilter,
      lastInventoryDateFrom: annualInventory.lastInventoryDateFromFilter,
      ownershipChangeDateTo: annualInventory.ownershipChangeDateToFilter,
      ownershipChangeDateFrom: annualInventory.ownershipChangeDateFromFilter,
      itemControlNumber: annualInventory.icnFilter,
      transferControlNumber: annualInventory.tcnFilter,
      inventory: annualInventory.inventoryFilter,
      itemStatus: annualInventory.itemStatusFilter,
      stateCode: annualInventory.stateCodeFilter,
      leaEmail: annualInventory.leaEmailFilter,
      organizationName: annualInventory.organizationNameFilter,
      params: {
        page: page,
        size: perPage,
      },
    };

    if (annualInventory.sort) {
      data.params["sort"] = annualInventory.sort;
    }

    updateAnnualInventoryCycle({
      currentPage: page,
      perPage: perPage,
    });

    makeApiCall(data);
  }

  function handleSort(sortBy) {
    updateAnnualInventoryCycle({
      loading: true,
    });
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;

    updateAnnualInventoryCycle({ sort: sort });
    //Preserve search results while sorting
    let data = {
      specialDescriptionCode: annualInventory.firearmSerialNoFilter,
      itemName: annualInventory.itemNameFilter,
      lastInventoryDateTo: annualInventory.lastInventoryDateToFilter,
      lastInventoryDateFrom: annualInventory.lastInventoryDateFromFilter,
      ownershipChangeDateTo: annualInventory.ownershipChangeDateToFilter,
      ownershipChangeDateFrom: annualInventory.ownershipChangeDateFromFilter,
      itemControlNumber: annualInventory.icnFilter,
      transferControlNumber: annualInventory.tcnFilter,
      inventory: annualInventory.inventoryFilter,
      itemStatus: annualInventory.itemStatusFilter,
      stateCode: annualInventory.stateCodeFilter,
      leaEmail: annualInventory.leaEmailFilter,
      organizationName: annualInventory.organizationNameFilter,
      params: {
        page: 1,
        size: annualInventory.perPage,
        sort: sort,
      },
    };

    makeApiCall(data);
  }

  function makeApiCall(data) {
    inventoryApiService
      .getAnnualInventoryList(data)
      .then((response: any) => {
        let filteredRows = [];
        for (let inventory of response.data.annualInventorySearchResultList) {
          //Get full status name from id value
          let fullStatusName;
          for (const [key, object] of Object.entries(
            statusCodeValuesFullList
          )) {
            if (inventory.itemStatus === object["id"]) {
              fullStatusName = object["value"];
            }
          }
          let row = {
            specialDescriptionCode: inventory.specialDescriptionCode,
            itemName: inventory.itemName,
            lastInventoryDate: inventory.lastInventoryDate
              ? moment(inventory.lastInventoryDate).format("MM/DD/YYYY")
              : "",
            ownershipChangeDate: inventory.ownershipChangeDate
              ? moment(inventory.ownershipChangeDate).format("MM/DD/YYYY")
              : "",
            itemControlNumber: inventory.itemControlNumber
              ? formatICN(inventory.itemControlNumber).toUpperCase()
              : "",
            transferControlNumber: inventory.transferControlNumber
              ? formatTCN(inventory.transferControlNumber).toUpperCase()
              : "",
            inventory: inventory.inventory,
            comment: inventory.comment,
            itemStatus: fullStatusName,
          };
          filteredRows.push(row);
        }
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        updateAnnualInventoryCycle({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        updateAnnualInventoryCycle({ loading: false });
      });
  }

  function handleStateChange(state) {
    updateAnnualInventoryCycle({
      stateCodeValue: state,
    });
  }

  function handleEmailBlur(email) {
    if (!email) {
      updateAnnualInventoryCycle({
        leaEmailIsInvalid: false,
        leaEmailValidationMsg: "",
        topApplyBtnIsDisabled: false,
      });
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      updateAnnualInventoryCycle({
        leaEmailIsInvalid: true,
        leaEmailValidationMsg: "Email Address is invalid.",
        topApplyBtnIsDisabled: true,
      });
    } else {
      updateAnnualInventoryCycle({
        leaEmailIsInvalid: false,
        leaEmailValidationMsg: "",
        topApplyBtnIsDisabled: false,
      });
    }
  }

  function handleOrganizationNameBlur(orgName) {
    if (!orgName) {
      updateAnnualInventoryCycle({
        orgNameIsInvalid: false,
        orgNameValidationMsg: "",
        topApplyBtnIsDisabled: false,
      });
    } else {
      updateAnnualInventoryCycle({
        orgNameIsInvalid: false,
        orgNameValidationMsg: "",
        topApplyBtnIsDisabled: false,
      });
    }
  }

  function handleTopClear() {
    //Clear Values From Top Section
    updateAnnualInventoryCycle({
      leaEmailIsInvalid: false,
      leaEmailValidationMsg: "",
      topApplyBtnIsDisabled: false,
      leaEmailFilter: "",
      leaEmailValue: "",
      itemStatusFilter: "A",
      itemStatusValue: "A",
      organizationNameFilter: "",
      organizationNameValue: "",
    });
    if (!annualInventory.isStateSasp) {
      updateAnnualInventoryCycle({
        stateCodeFilter: "",
        stateCodeValue: "",
      });
    }

    //Make API Call without any top filters
    //Preserve bottom filters
    let data = {
      specialDescriptionCode: annualInventory.firearmSerialNoFilter,
      itemName: annualInventory.itemNameFilter,
      lastInventoryDateTo: annualInventory.lastInventoryDateToFilter,
      lastInventoryDateFrom: annualInventory.lastInventoryDateFromFilter,
      ownershipChangeDateTo: annualInventory.ownershipChangeDateToFilter,
      ownershipChangeDateFrom: annualInventory.ownershipChangeDateFromFilter,
      itemControlNumber: annualInventory.icnFilter,
      transferControlNumber: annualInventory.tcnFilter,
      inventory: annualInventory.inventoryFilter,
      itemStatus: "A",
      leaEmail: "",
      organizationName: "",
      params: {
        page: 1,
        size: annualInventory.perPage,
      },
    };

    if (annualInventory.isStateSasp) {
      data["stateCode"] = annualInventory.stateCodeFilter;
    } else {
      data["stateCode"] = "";
    }

    if (annualInventory.sort) {
      data.params["sort"] = annualInventory.sort;
    }
    makeApiCall(data);
  }

  function validateManageInventory() {
    const { manageInventory } = annualInventory;
    let validation = false;
    if (manageInventory.inventory === "Y") {
      return true;
    }
    if (manageInventory.comment) {
      validation = true;
    } else {
      manageInventory.commentIsInvalid = true;
      updateAnnualInventoryCycle({ manageInventory });
    }
    return validation;
  }

  function saveManageInventory() {
    const { manageInventory } = annualInventory;
    if (validateManageInventory()) {
      let data = {
        icn: manageInventory.itemControlNumber.replaceAll("-", ""),
        inventory: manageInventory.inventory,
        comment: manageInventory.comment,
      };

      inventoryApiService
        .updateAnnualInventory(data)
        .then((response) => {
          defaultManageInventory();
          handleTopApplyFilters();
          let allCompleted = true;
          for (let item of annualInventory.filteredItems) {
            if (
              item.itemControlNumber.replaceAll("-", "") !== data.icn &&
              !item.inventory
            ) {
              allCompleted = false;
            }
          }
          if (allCompleted) {
            addToast({
              text: "Annual Inventory has been successfully completed",
              type: "success",
              heading: "Success",
            });
          }
        })
        .catch(() => {});
    }
  }

  function saveAnnualInventory(event) {
    event.preventDefault();
    const { annualInventoryCycle } = annualInventory;
    const { addToast } = props.actions;
    setStartInventoryDisable(true);
    if (
      moment(annualInventoryCycle.cycleEndDate).startOf("day").toDate() <=
      moment(annualInventoryCycle.cycleStartDate).startOf("day").toDate()
    ) {
      annualInventoryCycle.endDateInvalid = true;
      updateAnnualInventoryCycle(annualInventoryCycle);
      return;
    } else {
      annualInventoryCycle.endDateInvalid = false;
      updateAnnualInventoryCycle(annualInventoryCycle);
    }
    let data = {
      startDate: annualInventoryCycle.cycleStartDate,
      endDate: annualInventoryCycle.cycleEndDate,
    };
    inventoryApiService
      .saveAnnualInventoryCycle(data)
      .then((response: any) => {
        inventoryApiService.findActiveInventory().then((response: any) => {
          const { annualInventoryCycle } = annualInventory;
          setStartInventoryDisable(false);
          if (
            response.data.startDate === null ||
            response.data.startDate === "" ||
            response.data.startDate === " "
          ) {
            updateAnnualInventoryCycle({
              disableManageInventory: true,
            });
          } else {
            let isAterStart = moment(
              moment(new Date(Date.now())).toDate()
            ).isAfter(moment(response.data.startDate).startOf("day").toDate());
            let isBeforeEnd = moment(
              moment(new Date(Date.now())).toDate()
            ).isBefore(moment(response.data.endDate).endOf("day").toDate());
            let inActive;
            if (isAterStart && isBeforeEnd) {
              inActive = false;
            } else {
              inActive = true;
            }
            updateAnnualInventoryCycle({
              disableManageInventory: inActive,
            });
          }
        });
        defaultAnnualInventoryCycle();
        handleTopApplyFilters();
        addToast({
          text: "Annual Inventory Cycle has been setup",
          type: "success",
          heading: "Success",
        });
      })
      .catch(() => {
        setStartInventoryDisable(false);
      });
  }

  function handleDownloadInventory() {
    //If any top level filter applied.
    let email = annualInventory.leaEmailValue
      ? annualInventory.leaEmailValue.replace(/\s/g, "")
      : "";

    //Clear Values From Top Section
    let data = {
      specialDescriptionCode: annualInventory.firearmSerialNoFilter,
      itemName: annualInventory.itemNameFilter,
      lastInventoryDateTo: annualInventory.lastInventoryDateToFilter,
      lastInventoryDateFrom: annualInventory.lastInventoryDateFromFilter,
      ownershipChangeDateTo: annualInventory.ownershipChangeDateToFilter,
      ownershipChangeDateFrom: annualInventory.ownershipChangeDateFromFilter,
      itemControlNumber: annualInventory.icnFilter,
      transferControlNumber: annualInventory.tcnFilter,
      inventory: annualInventory.inventoryFilter,
      itemStatus: annualInventory.itemStatusFilter,
      leaEmail: email,
      stateCode: annualInventory.stateCodeValue,
      organizationName: annualInventory.organizationNameValue,
      params: {
        page: 1,
        size: annualInventory.perPage,
      },
    };
    updateAnnualInventoryCycle({
      leaEmailFilter: email,
      stateCodeFilter: annualInventory.stateCodeValue,
      organizationNameFilter: annualInventory.organizationNameValue,
    });
    if (annualInventory.sort) {
      data.params["sort"] = annualInventory.sort;
    }

    inventoryApiService.downloadAnnualInventoryFile(data).then((response) => {
      let blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(blob);
      var a = document.createElement("a");
      a.setAttribute("download", "AnnualInventory.xlsx");
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(link);
    });
  }

  function defaultManageInventory() {
    const { manageInventory } = annualInventory;
    manageInventory.itemControlNumber = "";
    manageInventory.manageInventoryModal = false;
    manageInventory.inventory = "";
    manageInventory.comment = "";
    manageInventory.commentIsInvalid = false;
    updateAnnualInventoryCycle({ manageInventory });
  }

  function defaultAnnualInventoryCycle() {
    const { annualInventoryCycle } = annualInventory;
    annualInventoryCycle.manageAnnualInventoryModal = false;
    updateAnnualInventoryCycle({ annualInventoryCycle });
  }

  function handleTopApplyFilters() {
    //Trim any white space/tabs/etc off of the email that got included with a copy/paste
    let email = annualInventory.leaEmailValue
      ? annualInventory.leaEmailValue.replace(/\s/g, "")
      : "";

    //Make API Call with top filters
    //Preserve bottom filters
    let data = {
      specialDescriptionCode: annualInventory.firearmSerialNoFilter,
      itemName: annualInventory.itemNameFilter,
      lastInventoryDateTo: annualInventory.lastInventoryDateToFilter,
      lastInventoryDateFrom: annualInventory.lastInventoryDateFromFilter,
      ownershipChangeDateTo: annualInventory.ownershipChangeDateToFilter,
      ownershipChangeDateFrom: annualInventory.ownershipChangeDateFromFilter,
      itemControlNumber: annualInventory.icnFilter,
      transferControlNumber: annualInventory.tcnFilter,
      inventory: annualInventory.inventoryFilter,
      itemStatus: annualInventory.itemStatusFilter,
      leaEmail: email,
      stateCode: annualInventory.stateCodeValue,
      organizationName: annualInventory.organizationNameValue,
      params: {
        page: 1,
        size: annualInventory.perPage,
      },
    };

    if (annualInventory.sort) {
      data.params["sort"] = annualInventory.sort;
    }

    updateAnnualInventoryCycle({
      leaEmailFilter: email,
      stateCodeFilter: annualInventory.stateCodeValue,
      itemStatusFilter: annualInventory.itemStatusValue,
      organizationNameFilter: annualInventory.organizationNameValue,
    });

    makeApiCall(data);
  }

  const columns = [
    {
      Header: "Firearm Serial NO.",
      accessor: "specialDescriptionCode",
    },
    {
      Header: "Item Name",
      accessor: "itemName",
    },
    {
      Header: "Last Inventory date",
      accessor: "lastInventoryDate",
    },
    {
      Header: "Ownership Change date",
      accessor: "ownershipChangeDate",
    },
    {
      Header: "ICN",
      accessor: "itemControlNumber",
    },
    {
      Header: "TCN",
      accessor: "transferControlNumber",
    },
    {
      Header: "COMMENT",
      accessor: "comment",
    },
    {
      Header: "Inventory",
      accessor: "inventory",
      Cell: (inventory) => (
        <>
          {inventory.row.values.inventory === "N" && (
            <div className="grid-row inventory-infotip">
              <PPMSPopover
                trigger={["hover"]}
                id={"Inventory-InfoTip"}
                placement={"top"}
                popoverTitle={"Comment"}
                popoverContent={inventory.row.values.comment}
                className={"usa-label form-label usa-label-float float-right"}
                triggerSource={
                  <button
                    id={"comment-tooltip-button"}
                    type={"button"}
                    className={"usa-button  usa-button--unstyled"}
                  >
                    <FaInfoCircle />
                  </button>
                }
              />
            </div>
          )}
          {annualInventory.disableManageInventory === true &&
            inventory.row.values.inventory && (
              <div className="grid-row">
                <PPMSToggleRadio
                  isInline={true}
                  name={`dropAfterInternalScreening${inventory.row.values.itemControlNumber}`}
                  isRequired={true}
                  isDisabled={true}
                  options={[
                    {
                      id: `Y-${inventory.row.values.itemControlNumber}`,
                      value: "Yes",
                      isSelected: inventory.row.values.inventory
                        ? inventory.row.values.inventory === "Y"
                          ? true
                          : false
                        : false,
                    },
                    {
                      id: `N-${inventory.row.values.itemControlNumber}`,
                      value: "No",
                      isSelected: inventory.row.values.inventory
                        ? inventory.row.values.inventory === "N"
                          ? true
                          : false
                        : false,
                    },
                  ]}
                  validationMessage={""}
                  formClass={"inventory-comment"}
                  onChange={() => {}}
                  id={`${inventory.row.values.itemControlNumber}-manage-inventory`}
                />
              </div>
            )}

          {annualInventory.disableManageInventory === false && (
            <div className="grid-row">
              <PPMSToggleRadio
                isInline={true}
                name={`dropAfterInternalScreening${inventory.row.values.itemControlNumber}`}
                isRequired={true}
                isDisabled={annualInventory.disableManageInventory}
                options={[
                  {
                    id: `Y-${inventory.row.values.itemControlNumber}`,
                    value: "Yes",
                    isSelected: inventory.row.values.inventory
                      ? inventory.row.values.inventory === "Y"
                        ? true
                        : false
                      : false,
                  },
                  {
                    id: `N-${inventory.row.values.itemControlNumber}`,
                    value: "No",
                    isSelected: inventory.row.values.inventory
                      ? inventory.row.values.inventory === "N"
                        ? true
                        : false
                      : false,
                  },
                ]}
                validationMessage={""}
                onChange={(items) => {
                  let value = "No";
                  const selectedItem = items.filter(
                    (item) => item.isSelected === true
                  );
                  if (selectedItem.length > 0) {
                    value = selectedItem[0].value;
                  }
                  if (value === "No") {
                    const { manageInventory } = annualInventory;
                    manageInventory.itemControlNumber =
                      inventory.row.values.itemControlNumber;
                    manageInventory.inventory = "N";
                    manageInventory.manageInventoryModal = true;
                    updateAnnualInventoryCycle({
                      manageInventory: manageInventory,
                    });
                  } else {
                    const { manageInventory } = annualInventory;
                    manageInventory.itemControlNumber =
                      inventory.row.values.itemControlNumber;
                    manageInventory.inventory = "Y";
                    updateAnnualInventoryCycle({
                      manageInventory: manageInventory,
                    });
                    saveManageInventory();
                  }
                }}
                formClass={"inventory-comment"}
                id={`${inventory.row.values.itemControlNumber}-manage-inventory`}
              />
            </div>
          )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      width: 250,
    },
    {
      Header: "Item Status",
      accessor: "itemStatus",
    },
    {
      Header: "Actions",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer"></div>
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  let filter = {};
                  filter["id"] = column.id;
                  filter["value"] = column["filterValue"];
                  filters.push(filter);
                });
                getAnnualInventory(filters);
              }}
              label={"Search"}
            />
            <PPMSButton
              id={"clear-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  column.setFilter("");
                });
                getAnnualInventory(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      id: "actions",
      Cell: (inventory) => (
        <>
          {(UserUtils.isSystemAdminUser() ||
            UserUtils.isUserFireArmManager()) && (
            <PPMSButton
              variant={"secondary"}
              label={"Transfer LEA"}
              size={"sm"}
              className="manage-list-actions usa-link usa-button--unstyled withdraw"
              icon={<BiTransfer />}
              onPress={() => {
                updateAnnualInventoryCycle({
                  showTransferModal: true,
                  transferModalIcn: inventory.row.values.itemControlNumber.replaceAll(
                    "-",
                    ""
                  ),
                  transferModalItemName: inventory.row.values.itemName,
                  transferModalSerialNumber:
                    inventory.row.values.specialDescriptionCode,
                  transferModalTcn: inventory.row.values.transferControlNumber.replaceAll(
                    "-",
                    ""
                  ),
                  transferModalItemStatus: "A",
                });
              }}
              id={`transferLea - ${inventory.row.values.specialDescriptionCode}`}
              isDisabled={
                inventory.row.values.itemStatus !==
                "Active Firearm is in the possession of the LEA"
              }
            />
          )}
          {(UserUtils.isUserSaspWithFI() ||
            UserUtils.isUserSaspAdmin ||
            UserUtils.isUserFF()) &&
            !(
              UserUtils.isSystemAdminUser() || UserUtils.isUserFireArmManager()
            ) &&
            inventory.row.values.itemStatus ===
              "Active Firearm is in the possession of the LEA" && (
              <PPMSButton
                variant={"secondary"}
                label={"View History"}
                size={"sm"}
                className="manage-list-actions"
                icon={<BsEyeFill />}
                onPress={() => {
                  PageHelper.openPage(
                    Paths.ViewHistory +
                      "/" +
                      inventory.row.values.itemControlNumber.replaceAll(
                        "-",
                        ""
                      ) +
                      "/" +
                      true
                  );
                }}
                id={`viewHistory- ${inventory.row.values.specialDescriptionCode}`}
                isDisabled={false}
              />
            )}

          {(UserUtils.isSystemAdminUser() ||
            UserUtils.isUserFireArmManager()) && (
            <PPMSButton
              variant={"secondary"}
              label={"Possession History"}
              size={"sm"}
              className="manage-list-actions"
              icon={<MdEdit />}
              isDisabled={false}
              onPress={() => {
                PageHelper.openPage(
                  Paths.PossessionHistory +
                    "/" +
                    inventory.row.values.itemControlNumber.replaceAll("-", "")
                );
              }}
              id={`possessionHistory - ${inventory.row.values.specialDescriptionCode}`}
            />
          )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  function filters() {
    return [
      {
        title: "Filters",
        content: (
          <>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-2"}>
                <PPMSState
                  id={`state`}
                  label={"By State"}
                  required={false}
                  selectedState={annualInventory.stateCodeValue}
                  updateLocationState={(value: any, validation: any) => {
                    handleStateChange(value);
                  }}
                  disabled={annualInventory.isStateSasp}
                  name={`state`}
                />
                <br />
              </div>
              <div className={"grid-col-3"}>
                <PPMSInput
                  id={"leaEmail"}
                  name={"leaEmail"}
                  label={"By LEA Email"}
                  isDisabled={false}
                  inputType={"text"}
                  placeHolder={"Email Address"}
                  value={annualInventory.leaEmailValue}
                  onChange={(event) => {
                    let email = event.target.value.toString();
                    updateAnnualInventoryCycle({
                      leaEmailValue: email,
                    });
                  }}
                  onBlur={(event) => handleEmailBlur(event.target.value)}
                  validationMessage={annualInventory.leaEmailValidationMsg}
                  isInvalid={annualInventory.leaEmailIsInvalid}
                />
              </div>
              {(UserUtils.isSystemAdminUser() ||
                UserUtils.isUserFireArmManager()) && (
                <div className={"grid-col-4"}>
                  <PPMSSelect
                    id={"status"}
                    name={"status"}
                    selectName={"staticSelectStatus"}
                    values={ItemStatusCodeValues}
                    onChange={(event) => {
                      let status = event.target.value.toString();
                      updateAnnualInventoryCycle({
                        itemStatusValue: status,
                        itemStatusFilter: status,
                      });
                    }}
                    identifierKey={"id"}
                    identifierValue={"value"}
                    selectedValue={annualInventory.itemStatusValue}
                    label={"By Item Status"}
                    isRequired={false}
                    disabled={false}
                  />
                </div>
              )}
            </div>

            <div className={"grid-row"}>
              <div className="grid-col-4">
                <PPMSInput
                  id={"organizationName"}
                  name={"organizationName"}
                  label={"By Organization Name"}
                  isDisabled={false}
                  inputType={"text"}
                  placeHolder={"Organization Name"}
                  value={annualInventory.organizationNameValue}
                  onChange={(event) => {
                    let organizationName = event.target.value.toString();
                    updateAnnualInventoryCycle({
                      organizationNameValue: organizationName,
                    });
                  }}
                  onBlur={(event) =>
                    handleOrganizationNameBlur(event.target.value)
                  }
                  validationMessage={annualInventory.orgNameValidationMsg}
                  isInvalid={annualInventory.orgNameIsInvalid}
                />
              </div>
            </div>
            <br />
            <div className={"grid-row"}>
              <PPMSButton
                id={"apply-filter-top"}
                onPress={() => {
                  handleTopApplyFilters();
                }}
                label={"Apply Filter"}
                className={"create-property"}
                isDisabled={annualInventory.topApplyBtnIsDisabled}
              />
              <PPMSButton
                id={"clear-filter-top"}
                onPress={() => {
                  handleTopClear();
                }}
                label={"Clear"}
                className={"create-property"}
                isDisabled={false}
              />
            </div>
          </>
        ),
        expanded: true,
        id: "filters",
        trigger: "common",
      },
    ];
  }

  return (
    <div className="ui-ppms">
      <PPMSDatatable
        title={"Annual Inventory"}
        data={annualInventory.filteredItems}
        columns={columns}
        defaultSortField={"specialDescriptionCode"}
        loading={annualInventory.loading}
        serverSort={true}
        handleSort={(sortBy) => handleSort(sortBy)}
        rowsPerPageOptions={annualInventory.rowsPerPageOptions}
        totalRows={annualInventory.totalRows}
        totalPages={annualInventory.totalPages}
        rowsPerPage={annualInventory.perPage}
        isPaginationEnabled={true}
        onChange={handleChange}
        showFilters={true}
        hiddenColumns={["comment"]}
        currentPage={annualInventory.currentPage - 1}
        subHeaderComponent={
          <>
            {annualInventory.showTransferModal && (
              <div className="grid-row">
                <PossessionHistoryContextProvider>
                  <TransferLEAModal
                    toggleTransferModal={(triggerApi: boolean) => {
                      updateAnnualInventoryCycle({ showTransferModal: false });
                      if (triggerApi) {
                        handleTopApplyFilters();
                      }
                    }}
                    icn={annualInventory.transferModalIcn}
                    tcn={annualInventory.transferModalTcn}
                    serialNumber={annualInventory.transferModalSerialNumber}
                    itemName={annualInventory.transferModalItemName}
                    itemStatus={annualInventory.transferModalItemStatus}
                  />
                </PossessionHistoryContextProvider>
              </div>
            )}
            <div className={"grid-row"}>
              {annualInventory.canViewTopfilters && (
                <PPMSAccordion bordered={true} items={filters()} />
              )}
            </div>
            <br />
            <div className={"grid-row"}>
              <PPMSButton
                variant={"primary"}
                type={"button"}
                value={"downloadList"}
                label={"Download List"}
                className={"create-property"}
                onPress={() => handleDownloadInventory()}
                id={"download-list-btn"}
              />
              {!annualInventory.annualInventoryCycle
                .hideAnnualInventoryButton && (
                <PPMSButton
                  variant={"primary"}
                  type={"button"}
                  value={"AnnualInventoryCycle"}
                  label={"Annual Inventory Cycle"}
                  className={"create-property"}
                  onPress={() => {
                    const { annualInventoryCycle } = annualInventory;
                    inventoryApiService
                      .findActiveInventory()
                      .then((response: any) => {
                        if (
                          response.data.startDate === null ||
                          response.data.startDate === "" ||
                          response.data.startDate === " "
                        ) {
                          annualInventoryCycle.manageAnnualInventoryModal = true;
                          annualInventoryCycle.cycleStartDate = "";
                          annualInventoryCycle.cycleEndDate = "";
                          annualInventoryCycle.enableStartDate = true;
                          updateAnnualInventoryCycle({
                            annualInventoryCycle: annualInventoryCycle,
                          });
                        } else {
                          annualInventoryCycle.manageAnnualInventoryModal = true;
                          annualInventoryCycle.cycleStartDate =
                            response.data.startDate;
                          annualInventoryCycle.cycleEndDate =
                            response.data.endDate;
                          annualInventoryCycle.enableStartDate = false;
                          updateAnnualInventoryCycle({
                            annualInventoryCycle: annualInventoryCycle,
                          });
                        }
                      });
                  }}
                  id={"annual-inventory-cycle-btn"}
                />
              )}
            </div>
          </>
        }
      />
      <PPMSModal
        show={annualInventory.annualInventoryCycle.manageAnnualInventoryModal}
        size={"lg"}
        centered={true}
        backdrop={"static"}
        handleClose={() => {
          defaultAnnualInventoryCycle();
        }}
        handleSaveType={"button"}
        handleSave={saveAnnualInventory}
        saveIsLoading={startInventoryDisable}
        customLabel={"Start Annual Inventory"}
        disableSave={
          isEmptyCheck(annualInventory.annualInventoryCycle.cycleEndDate) ||
          isEmptyCheck(annualInventory.annualInventoryCycle.cycleStartDate) ||
          moment(annualInventory.annualInventoryCycle.cycleEndDate)
            .startOf("day")
            .toDate() <
            moment(annualInventory.annualInventoryCycle.cycleStartDate)
              .startOf("day")
              .toDate()
        }
        title={"Annual Inventory Cycle"}
        body={
          <AnnualInventoryCycleContent
            startDate={annualInventory.annualInventoryCycle.cycleStartDate}
            endDate={annualInventory.annualInventoryCycle.cycleEndDate}
            enableStartDate={
              annualInventory.annualInventoryCycle.enableStartDate
            }
            handleStartDate={(date) => {
              const { annualInventoryCycle } = annualInventory;
              annualInventoryCycle.cycleStartDate = date;
              updateAnnualInventoryCycle({ annualInventoryCycle });
            }}
            handleEndDate={(date) => {
              const { annualInventoryCycle } = annualInventory;
              annualInventoryCycle.cycleEndDate = date;
              annualInventoryCycle.endDateInvalid = isEmptyCheck(
                annualInventoryCycle.cycleEndDate
              )
                ? false
                : moment(annualInventoryCycle.cycleStartDate).toDate() >=
                  moment(annualInventoryCycle.cycleEndDate).toDate()
                ? true
                : false;
              updateAnnualInventoryCycle({ annualInventoryCycle });
            }}
            endDateInvalid={annualInventory.annualInventoryCycle.endDateInvalid}
          />
        }
        id={"annual-inventory-cycle"}
      />
      <PPMSModal
        show={annualInventory.manageInventory.manageInventoryModal}
        size={"lg"}
        centered={true}
        backdrop={"static"}
        handleClose={() => {
          defaultManageInventory();
          handleTopApplyFilters();
        }}
        handleSaveType={"button"}
        handleSave={() => saveManageInventory()}
        title={"Manage Inventory"}
        body={
          <ManageInventoryModelContent
            state={annualInventory.manageInventory}
            handleComment={(event) => {
              const { manageInventory } = annualInventory;
              manageInventory.comment = event.target.value;
              if (isEmptyCheck(event.target.value)) {
                manageInventory.commentIsInvalid = true;
              } else {
                manageInventory.commentIsInvalid = false;
              }
              updateAnnualInventoryCycle({ manageInventory });
            }}
            commentIsInvalid={annualInventory.manageInventory.commentIsInvalid}
          />
        }
        id={"manage-inventory"}
      />
    </div>
  );
}

const ManageInventoryModelContent = ({
  state,
  handleComment,
  commentIsInvalid,
}) => {
  return (
    <div className={"withdraw-property-confirmation"}>
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSTextArea
            id={"inventory-comment"}
            name={"comment"}
            label={"Comment"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={state.comment}
            onChange={handleComment}
            validationMessage={"Comment is Required."}
            isInvalid={commentIsInvalid}
            isValid={!commentIsInvalid}
          />
        </div>
      </div>
    </div>
  );
};

const AnnualInventoryCycleContent = ({
  handleStartDate,
  handleEndDate,
  startDate,
  endDate,
  enableStartDate,
  endDateInvalid,
}) => {
  return (
    <div>
      <div className={"grid-row grid-gap"}>
        <div className={"grid-col-6"}>
          <PPMSDatepicker
            id={"startDate"}
            format={"MM/DD/YYYY"}
            startDate={startDate}
            updateDate={handleStartDate}
            display={"bottom-end"}
            label={"Start Date"}
            placeholder={"Start Date"}
            isDisabled={!enableStartDate}
            minDate={moment(new Date(Date.now())).toDate()}
            isRequired={true}
            validationMessage={"Please enter valid Start Date"}
          />
        </div>

        <div className={"grid-col-6"}>
          <PPMSDatepicker
            id={"endDate"}
            format={"MM/DD/YYYY"}
            startDate={endDate}
            updateDate={handleEndDate}
            display={"bottom-end"}
            label={"End Date"}
            placeholder={"End Date"}
            minDate={
              moment(startDate).toDate() > moment(new Date(Date.now())).toDate()
                ? moment(startDate).add(1, "days").toDate()
                : moment(new Date(Date.now())).toDate()
            }
            isRequired={true}
            isDisabled={isEmptyCheck(startDate)}
            isInvalid={endDateInvalid}
            validationMessage={"End date should be greater than Start date"}
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(AnnualInventory);
