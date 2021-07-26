import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { UserUtils } from "../../../utils/UserUtils";
import { ManageRegistersContext } from "./ManageRegistersContext";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import moment from "moment";
import { PageHelper, Paths } from "../../Router";
import { formatDateTime } from "../../../ui-kit/utilities/FormatUtil";

interface ManageRegistersProps {
  actions?: any;
  location?: any;
  user: any;
  match: any;
  roles: any;
  zoneList: any;
}

const ManageRegisters = (props: ManageRegistersProps) => {
  const { actions, location, user, match, roles } = props;
  const { manageRegistersState, updateManageRegistersState } = useContext(
    ManageRegistersContext
  );
  const [defaultZoneId, setdefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );

  const [loading, setLoading] = React.useState(false);
  const [apiRows, setApiRows] = React.useState([]);
  let salesApiService = new SalesApiService();
  let commonApiService = new CommonApiService();

  function handleChange({ selectedIndex }) {
    let state = manageRegistersState;
    if (selectedIndex === 0) {
      state.zone.zoneRegions = [];
      state.zone.isZoneEmpty = true;
      state.zone.validationMessage = "Please select a zone.";
    } else {
      state.zone.isAddAllDisabled = false;
      const zoneID = manageRegistersState.zone.zoneList[selectedIndex - 1]
        ? manageRegistersState.zone.zoneList[selectedIndex - 1].zoneId
        : "";
      setdefaultZoneId(zoneID);
      let zoneRegions = [];
      commonApiService
        .getZoneRegions(zoneID)
        .then((response: any) => {
          response?.data.forEach((region) => {
            zoneRegions.push(region.regionCode);
          });
          let state = manageRegistersState;
          state.zone.selectedZone = zoneID;
          state.zone.zoneRegions = zoneRegions;
          state.zone.isZoneEmpty = false;
          state.zone.validationMessage = "";
          let filters = [];
          let filter = {};
          filter["id"] = "zoneId";
          filter["value"] = parseInt(defaultZoneId);
          filters.push(filter);
          getManangeRegistersList(filters);
          updateManageRegistersState(state);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
    updateManageRegistersState(state);
  }

  let handleChangeTable = (perPage, page) => {
    let state = manageRegistersState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    manageRegistersState.data.filteredRows = apiData.slice(
      startIndex,
      endIndex
    );
    manageRegistersState.other.page.totalRows = apiRows.length;
    manageRegistersState.other.page.totalPages = Math.ceil(totalPages);
    manageRegistersState.other.page.currentPage = page;
    manageRegistersState.other.page.perPage = perPage;
    updateManageRegistersState(state);
  };

  let getManangeRegistersList = (filters: any) => {
    let data = {
      params: {
        page: manageRegistersState.other.page.currentPage,
        size: manageRegistersState?.other?.page?.perPage,
      },
    };
    filters?.forEach((filter) => {
      if (filter.value) {
        data[filter.id] = filter.value;
      }
    });
    salesApiService
      .getManangeRegistersList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.registerDTOList
            ? response.data.registerDTOList
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.registerNumber = row.registerNumber;
          obj.salesNumber = row.salesNumber;
          obj.salesDescription = row.salesDescription;
          obj.startDate = row.startDate ? formatDateTime(row.startDate) : "";
          obj.type = row.type;
          obj.status = row.status;
          obj.closeDate = row.closeDate;
          obj.registerId = row.id;
          obj.closeBy = row.closeBy;
          obj.totalAmount = row.totalAmount;
          return obj;
        });
        setApiRows(filteredRows);
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        let state = manageRegistersState;
        state.data.filteredRows = filteredRows.slice(
          0,
          state?.other?.page?.perPage
        );
        state.other.loading = false;
        state.other.page.totalRows = totalElements;
        state.other.page.totalPages = totalPages;
        updateManageRegistersState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      })
      .finally(()=>{
        setLoading(false);
      })
  };

  const columns = [
    {
      Header: "Register Number",
      accessor: "registerNumber",
      filter: "search",
    },
    {
      Header: "Sales Number",
      accessor: "salesNumber",
      filter: "search",
    },
    {
      Header: "Sales Description",
      accessor: "salesDescription",
      filter: "search",
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      filter: "search",
    },
    {
      Header: "Register Type",
      accessor: "type",
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "status",
      filter: "search",
    },
    {
      Header: "Close Date",
      accessor: "closeDate",
      filter: "search",
    },
    {
      Header: "Closed By",
      accessor: "closeBy",
      filter: "search",
    },
    {
      Header: "Total Amount",
      accessor: "totalAmount",
      filter: "search",
    },
    {
      Header: "Actions",
      id: "actions",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer" />
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  let filter = {};
                  filter["id"] = column.id;
                  filter["value"] = column["filterValue"];
                  filters.push(filter);
                  let zoneFilter = {};
                  zoneFilter["id"] = "zoneId";
                  zoneFilter["value"] = parseInt(defaultZoneId);
                  filters.push(zoneFilter);
                });
                getManangeRegistersList(filters);
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
                let filter = {};
                filter["id"] = "zoneId";
                filter["value"] = parseInt(defaultZoneId);
                filters.push(filter);
                getManangeRegistersList(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (register) => {
        return (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"View"}
              icon={<FaEye />}
              size={"sm"}
              onPress={() => {
                PageHelper.openPage(
                  `${Paths.paymentRegisterManager}/${register.row.original.registerId}`
                );
              }}
              id={"view"}
            />
            {roles.isCLO && (
              <PPMSButton
                variant={"secondary"}
                label={
                  register.row.values.status === "Open" ||
                  register.row.values.status === " Reopen"
                    ? " Close Register"
                    : " Reopen Register"
                }
                size={"sm"}
                icon={<MdEdit />}
                onPress={() => {
                  PageHelper.openPage(
                    `${Paths.paymentRegisterManager}/${register.row.original.registerId}`
                  );
                }}
                id={`edit-${register.row.values.id}`}
              />
            )}
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];
  useEffect(() => {
    setLoading(true);
    let filters = [];
    const data = {
      params: {
        zoneIds: UserUtils.getUserZones().join(","),
      },
    };
    commonApiService
      .getZoneSalesControlList(data)
      .then((response: any) => {
        let state = manageRegistersState;
        state.zone.zoneList = response?.data;
        updateManageRegistersState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    let zoneIdRegions = UserUtils.getDefaultZones();
    let zoneRegions = [];

    commonApiService
      .getZoneRegions(zoneIdRegions)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.regionCode);
        });
        let state = manageRegistersState;
        state.zone.zoneRegions = zoneRegions;
        updateManageRegistersState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    let filter = {};
    filter["id"] = "zoneId";
    filter["value"] = parseInt(zoneIdRegions);
    filters.push(filter);
    getManangeRegistersList(filters);
  }, [
    manageRegistersState.other.page.currentPage,
    manageRegistersState.other.page.perPage,
  ]);
  return (
    <div className="ui-ppms">
      <PPMSDatatable
        title={"Manage Registers"}
        data={
          manageRegistersState.data.filteredRows
            ? manageRegistersState.data.filteredRows
            : []
        }
        subHeaderComponent={
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <div className={"grid-row grid-gap-2"}>
                <div className={"grid-col-4"}>
                  <PPMSSelect
                    id={"select-zone"}
                    title={"select-zones"}
                    placeholderValue={"Select Zone"}
                    label={"Zone"}
                    identifierKey={"zoneId"}
                    identifierValue={"zoneName"}
                    values={manageRegistersState.zone.zoneList}
                    isRequired={true}
                    isInvalid={manageRegistersState.zone.isZoneEmpty}
                    validationMessage={
                      manageRegistersState.zone.validationMessage
                    }
                    selectedValue={defaultZoneId}
                    onChange={(event) => handleChange(event.target)}
                  />
                </div>
                <div className={"grid-col-3"}>
                  <PPMSInput
                    isDisabled={true}
                    id={"regions"}
                    name={"regions"}
                    inputType={"text"}
                    label={"Regions"}
                    isRequired={true}
                    value={manageRegistersState.zone.zoneRegions.toString()}
                    minLength={0}
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
          </div>
        }
        columns={columns}
        defaultSortField={"userId"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={
          manageRegistersState?.other?.page?.rowsPerPageOptions
        }
        totalRows={manageRegistersState?.other?.page?.totalRows}
        totalPages={manageRegistersState?.other?.page?.totalPages}
        rowsPerPage={manageRegistersState?.other?.page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={loading}
        hiddenColumns={["id"]}
        currentPage={manageRegistersState?.other?.page?.currentPage - 1}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageRegisters);
