import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { FilterState, FilterStateDefaults } from "./FilterState";
import { FilterContext } from "./FilterContext";
import { history } from "../../_redux/_helpers/history";
import { UserUtils } from "../../utils/UserUtils";
import PPMSCardGroup from "../../ui-kit/components/common/card/PPMS-card-group";
import { useEffect } from "react";
import { Paths } from "../Router";
import { isEmptyCheck } from "../../ui-kit/components/validations/FieldValidations";
import {
  getFilters,
  ErdSrdFilters,
  TcnFilters,
  UserFilters,
  transferRequestsFilter,
} from "./FilterConstants";
import {
  regexForTCNandICN,
  TcnWorkFlowType,
  erdSrdDateType,
} from "./create-update-property/constants/Constants";
import moment from "moment";
interface FilterProps {
  roles?: any;
  location?: Location;
  router?: any;
  workflow: TcnWorkFlowType;
}

export default function Filter(props: FilterProps) {
  const [filter, setFilter] = useState<FilterState>({});
  const [surplusReleaseDateFrom, setSurplusReleaseDateFrom] = useState<any>("");
  const [surplusReleaseDateTo, setSurplusReleaseDateTo] = useState<any>("");
  const [transferRequestsCode, setTransferRequestsCode] = useState<any>("all");
  const firstUpdate = useRef(true);

  function isUserSmNuAoAc(): boolean {
    //AC is the Permission for APO
    const roles = ["SM", "NU", "AO", "AC"];
    const userPermissions: string[] = UserUtils.getUserPermissions();
    return roles.some((i) => userPermissions.includes(i));
  }

  function isUserSmNuSaspAdminAc(): boolean {
    if (UserUtils.isUserSaspAdmin()) return true;
    //AC is the Permission for APO
    const roles = ["SM", "NU", "AC"];
    const userPermissions: string[] = UserUtils.getUserPermissions();
    return roles.some((i) => userPermissions.includes(i));
  }

  function showUserFilter(): boolean {
    let isUserSmNuAoAcResult = isUserSmNuAoAc();
    return isUserSmNuAoAcResult && transferRequestsCode === "all";
  }

  function showSRDFilter(): boolean {
    if (props.workflow === TcnWorkFlowType.REQUISITION_TRANSFER_ORDERS)
      return true;
  }

  function showTransferRequests(): boolean {
    let isUserSmNuSaspAdminAcResult = isUserSmNuSaspAdminAc();
    return (
      props.workflow === TcnWorkFlowType.MY_REQUESTS &&
      (isUserSmNuSaspAdminAcResult || UserUtils.isUserSasp())
    );
  }

  function updateFilter(newState: FilterState) {
    setFilter((prevState: FilterState) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  }

  function handleChange(event: any) {
    const key: string = event.target.name;
    let value: string = event.target.value;
    if (key === "transferControlNumber" || key === "itemControlNumber") {
      value = value.replaceAll(regexForTCNandICN, "").trim();
    } else {
      value = value.trimLeft();
    }
    updateFilter({
      [key]: value,
    });
  }

  function handleSelectionChange(event: any) {
    const value: string = event.target.options[event.target.selectedIndex].id;
    const key: string = event.target.name;
    updateFilter({
      [key]: value !== "empty" ? value : "",
    });
  }

  function handleTCNStatusChange(event: any) {
    let value: string = event.target.options[event.target.selectedIndex].value;
    updateFilter({
      requestStatus: [value],
    });
  }

  function handleTransferRequestsChange(event: any) {
    event.forEach((e) => {
      if (e.isSelected) {
        updateFilter({
          transferRequests: e.id,
        });
        setTransferRequestsCode(e.id);
        return;
      }
    });
  }

  function handleEmailChange(value: string) {
    updateFilter({
      apoEmail: value,
    });
  }

  function handleStateChange(value: string) {
    updateFilter({
      state: value,
    });
  }

  const getExcessSurplusFromToDateByType = (type: string) => {
    let m = moment();
    let endDate = "";
    let startDate = moment().startOf("day").toISOString();
    switch (type) {
      case "Today":
        endDate = m.endOf("day").toISOString();
        break;
      case "nextTwo":
        endDate = m.add(1, "day").endOf("day").toISOString();
        break;
      case "nextWeek":
        endDate = m.add(7, "day").endOf("day").toISOString();
        break;
      case "nextMonth":
        endDate = m.add(30, "day").endOf("day").toISOString();
        break;
      default:
        endDate = "";
        startDate = "";
    }
    return {
      startDate,
      endDate,
    };
  };

  const calculateSurplusDateToFrom = (surplusDateType) => {
    setSurplusReleaseDateFrom("");
    setSurplusReleaseDateTo("");
    let surplusType = surplusDateType?.target?.value
      ? surplusDateType.target.value
      : surplusDateType;
    let getFromToDateByTypeResponse = getExcessSurplusFromToDateByType(
      surplusType
    );
    let endDate = getFromToDateByTypeResponse.endDate;
    let startDate = getFromToDateByTypeResponse.startDate;

    return {
      type: surplusType,
      startDate: startDate,
      endDate: endDate,
    };
  };

  const handleSurplusDateSelect = (surplusDateType) => {
    let surplusDate = calculateSurplusDateToFrom(surplusDateType);
    updateFilter({
      surplusDateType: surplusDate.type,
      srdDateFrom: surplusDate.startDate,
      srdDateTo: surplusDate.endDate,
    });
  };

  const handleSurplusReleaseDateFromChange = (surplusReleaseDateFrom) => {
    let date = moment(surplusReleaseDateFrom).format("YYYY-MM-DD");
    if (surplusReleaseDateFrom !== "" && surplusReleaseDateFrom !== null) {
      surplusReleaseDateFrom = moment(
        surplusReleaseDateFrom,
        "YYYY-MM-DD 00:00:01"
      ).toDate();
      surplusReleaseDateFrom.setHours(0, 0, 0, 0);
    }
    setSurplusReleaseDateFrom(surplusReleaseDateFrom);
    let dateISO = moment(date).format("YYYY-MM-DDT00:00:00.000");
    updateFilter({
      srdDateFrom: dateISO,
    });
  };

  const handleSurplusReleaseDateToChange = (surplusReleaseDateTo) => {
    let date = moment(surplusReleaseDateTo).format("YYYY-MM-DD");
    if (surplusReleaseDateTo !== "" && surplusReleaseDateTo !== null) {
      surplusReleaseDateTo = moment(
        surplusReleaseDateTo,
        "YYYY-MM-DD 23:59:59"
      ).toDate();
      surplusReleaseDateTo.setHours(23, 59, 59, 999);
    }
    setSurplusReleaseDateTo(surplusReleaseDateTo);
    let dateISO = moment(date).format("YYYY-MM-DDT23:59:59.999");
    updateFilter({
      srdDateTo: dateISO,
    });
  };

  const { updateSearchCriteria, setHasQueryParamsToTrue } = useContext(
    FilterContext
  );

  function getPathName() {
    let pathname: string = "";
    switch (props.workflow) {
      case TcnWorkFlowType.ALLOCATIONS:
        pathname = Paths.allocations;
        break;
      case TcnWorkFlowType.APPROVE_TRANSFER_ORDERS:
        pathname = Paths.approveTransferOrders;
        break;
      case TcnWorkFlowType.REQUISITION_TRANSFER_ORDERS:
        pathname = Paths.requisitionTransferOrders;
        break;
      case TcnWorkFlowType.MY_REQUESTS:
        pathname = Paths.myRequests;
        break;
      case TcnWorkFlowType.COMPLETED_TRASFER:
        pathname = Paths.completedTransfer;
        break;
      default:
        break;
    }
    return pathname;
  }

  function applyFilter() {
    let location = {
      pathname: getPathName(),
    };

    let queryString: string = "";
    for (var key in filter) {
      if (queryString !== "") {
        queryString += "&";
      }
      queryString += key + "=" + filter[key];
    }

    location["search"] = queryString;
    history.push(location);
  }

  function clearFilter() {
    let location = {
      pathname: getPathName(),
    };

    location["search"] = "";
    history.push(location);
  }

  function getFilterFromQueryParams(): FilterState {
    let f: FilterState = { ...FilterStateDefaults };
    let urlParams = new URLSearchParams(props.location.search);
    for (const entry of urlParams.entries()) {
      const key: string = entry[0];
      const value: string = entry[1];

      if (key === "requestStatus") {
        if (value && !isEmptyCheck(value)) {
          f[key] = value.split(",");
        }
      } else if (key === "srdDateFrom") {
        f[key] = value;
        setSurplusReleaseDateFrom(new Date(value));
      } else if (key === "srdDateTo") {
        f[key] = value;
        setSurplusReleaseDateTo(new Date(value));
      } else if (key === "transferRequests") {
        f[key] = value;
      } else {
        f[key] =
          key === "transferControlNumber" ? value.replaceAll("-", "") : value;
      }
    }
    return f;
  }

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (props.workflow === TcnWorkFlowType.MY_REQUESTS) applyFilter();
  }, [transferRequestsCode]);

  useEffect(() => {
    let f: FilterState = getFilterFromQueryParams();
    updateFilter(f);
    updateSearchCriteria(f);
    setHasQueryParamsToTrue();
  }, [props.location]);

  function IcnFilters() {
    let icnFilters: Array<{ label: string; fields: any }> = [
      {
        label: "Priority",
        fields: [
          {
            selectedPriority: filter.priority,
            onChange: handleSelectionChange,
            inputType: "priority",
          },
        ],
      },
    ];

    if (
      props.workflow === TcnWorkFlowType.ALLOCATIONS ||
      props.workflow === TcnWorkFlowType.APPROVE_TRANSFER_ORDERS
    ) {
      icnFilters.push(
        {
          label: "State",
          fields: [
            {
              id: "state",
              required: false,
              isInvalid: false,
              isValid: true,
              placeHolderValue: "Not Selected",
              selectedState: filter.state,
              updateLocationState: handleStateChange,
              name: "state",
              inputType: "state",
            },
          ],
        },
        {
          label: "Region",
          fields: [
            {
              selectedRegion: filter.region,
              onChange: handleSelectionChange,
              inputType: "region",
            },
          ],
        }
      );
    }
    return getFilters(icnFilters);
  }

  return (
    <>
      <h2>Filters:</h2>

      <PPMSCardGroup className={"ppms-card-group"}>
        {showTransferRequests()
          ? transferRequestsFilter(
              filter,
              props.workflow,
              handleTransferRequestsChange
            )
          : ""}
        {showUserFilter()
          ? UserFilters(filter, handleChange, handleEmailChange)
          : ""}
        {TcnFilters(
          filter,
          props.workflow,
          handleChange,
          handleTCNStatusChange
        )}
        {!UserUtils.isUserOnlyFG() && IcnFilters()}
        {showSRDFilter()
          ? ErdSrdFilters(
              erdSrdDateType.SRD,
              filter.surplusDateType,
              surplusReleaseDateFrom,
              surplusReleaseDateTo,
              handleSurplusDateSelect,
              handleSurplusReleaseDateFromChange,
              handleSurplusReleaseDateToChange
            )
          : ""}
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
