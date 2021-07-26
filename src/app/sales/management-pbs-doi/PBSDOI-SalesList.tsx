import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {SalesListPBSDOIContext} from "./PBSDOI-SalesListContext";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSInput} from "../../../ui-kit/components/common/input/PPMS-input";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {PPMSSelect} from "../../../ui-kit/components/common/select/PPMS-select";
import {PageHelper, Paths} from "../../Router";
import {UserUtils} from "../../../utils/UserUtils";
import {CommonApiService} from "../../../api-kit/common/common-api.service";
import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import {formatSaleNumber} from "../../../ui-kit/utilities/FormatUtil";
import {Link} from "react-router-dom";
import {MdEdit} from "react-icons/md";
import {FaEye} from "react-icons/fa";
import {saleMethodPBSDOI} from "./common/Constants";
import Breadcrumb from "./common/Breadcrumb";

interface SalesListProps {
  actions?: any;
  location?: any;
  user: any;
  match: any;
  roles: any;
}

const PBSDOISalesList = (props: SalesListProps) => {
  const { actions, location, user, match, roles } = props;
  const { salesListPBSDOIState, updateSalesListPBSDOIState } = useContext(
    SalesListPBSDOIContext
  );
  const [defaultZoneId, setdefaultZoneId] = React.useState(
    UserUtils.getDefaultZones()
  );
  const [defaultZoneName, setDefaultZoneName] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [apiRows, setApiRows] = React.useState([]);
  let salesAPIService = new SalesApiService();
  const commonApiService = new CommonApiService();

  let handleChangeTable = (perPage, page) => {
    let state = salesListPBSDOIState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    salesListPBSDOIState.data.filteredRows = apiData.slice(
      startIndex,
      endIndex
    );
    salesListPBSDOIState.other.page.totalRows = apiRows.length;
    salesListPBSDOIState.other.page.totalPages = Math.ceil(totalPages);
    salesListPBSDOIState.other.page.currentPage = page;
    salesListPBSDOIState.other.page.perPage = perPage;
    updateSalesListPBSDOIState(state);
  };

  let getSalesManagement = (zoneId: string, filters: any) => {
    let params: any = {};
    params.page = salesListPBSDOIState.other.page.currentPage;
    params.size = salesListPBSDOIState?.other?.page?.perPage;
    params.zone = zoneId;
    filters?.forEach((filter) => {
      if (filter.value) {
        params[filter.id] = filter.value;
      }
    });
    salesAPIService
      .getSaleTransactionsForPBSDOI(params)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.sales
            ? response.data.sales
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.id = row.id;
          obj.salesNumber = row.salesNumber;
          obj.lotCount = row.lotCount;
          obj.status = row.status;
          obj.sco = row.sco
            ? row.sco?.firstName + " " + row.sco?.lastName
            : row.realtySpecialist?.firstName +
              " " +
              row.realtySpecialist?.lastName;
          saleMethodPBSDOI.forEach((item) => {
            if (item.id === row.salesMethod) {
              obj.saleMethod = item.value;
            }
          });

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
        //this.buildICNSalesDetails(filteredRows);
        let state = salesListPBSDOIState;
        salesListPBSDOIState.data.filteredRows = filteredRows.slice(
          0,
          salesListPBSDOIState?.other?.page?.perPage
        );
        salesListPBSDOIState.other.loading = false;
        salesListPBSDOIState.other.page.totalRows = totalElements;
        salesListPBSDOIState.other.page.totalPages = totalPages;
        setLoading(false);
        updateSalesListPBSDOIState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  function handleChange({ selectedIndex }) {
    let state = salesListPBSDOIState;
    if (selectedIndex === 0) {
      state.zone.zoneRegions = [];
      state.zone.isZoneEmpty = true;
      state.zone.validationMessage = "Please select a zone.";
    } else {
      state.zone.isAddAllDisabled = false;
      const zoneID = salesListPBSDOIState.zone.zoneList[selectedIndex - 1]
        ? salesListPBSDOIState.zone.zoneList[selectedIndex - 1].zoneId
        : "";
      const zoneName = salesListPBSDOIState.zone.zoneList[selectedIndex - 1]
        ? salesListPBSDOIState.zone.zoneList[selectedIndex - 1].zoneName
        : "";
      setdefaultZoneId(zoneID);
      setDefaultZoneName(zoneName);
      let zoneRegions = [];
      commonApiService
        .getZoneRegions(zoneID)
        .then((response: any) => {
          response?.data.forEach((region) => {
            zoneRegions.push(region.regionCode);
          });
          let state = salesListPBSDOIState;
          state.zone.selectedZone = zoneID;
          state.zone.zoneRegions = zoneRegions;
          state.zone.isZoneEmpty = false;
          state.zone.validationMessage = "";
          getSalesManagement(zoneName, null);
          updateSalesListPBSDOIState(state);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
    updateSalesListPBSDOIState(state);
  }

  async function getZonesInfo(data) {
    await commonApiService
      .getZoneSalesControlList(data)
      .then((response: any) => {
        let state = salesListPBSDOIState;
        state.zone.zoneList = response?.data;
        updateSalesListPBSDOIState(state);
        response.data.map((item) => {
          if (item.zoneId.toString() === defaultZoneId) {
            setDefaultZoneName(item.zoneName);
            getSalesManagement(item.zoneName, null);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    let zoneIdRegions = UserUtils.getDefaultZones();
    let zoneRegions = [];

    await commonApiService
      .getZoneRegions(zoneIdRegions)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.regionCode);
        });
        let state = salesListPBSDOIState;
        state.zone.zoneRegions = zoneRegions;
        updateSalesListPBSDOIState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  useEffect(() => {
    setLoading(true);
    const data = {
      params: {
        zoneIds: UserUtils.getUserZones().join(","),
      },
    };
    getZonesInfo(data);
  }, [
    salesListPBSDOIState.other.page.currentPage,
    salesListPBSDOIState.other.page.perPage,
  ]);

  const columns = [
    {
      Header: "Sales Id",
      accessor: "id",
      id: "id",
    },
    {
      Header: "Sales Number",
      accessor: "salesNumber",
      Cell: (data) => {
        return (
          <Link
            to={`${Paths.salesTransactionPBSDOI}${
              data.row.values.id ? "/" + data.row.values.id : ""
            }?zoneId=${defaultZoneId}`}
            className={"sales-transaction-pbsdoi"}
            key="sales-transaction-pbsdoi-id"
          >
            {formatSaleNumber(data.value)}
          </Link>
        );
      },
      filter: "search",
      width: 200,
    },
    {
      Header: "# of Lots",
      accessor: "lotCount",
      filter: "search",
    },
    {
      Header: "Sales Method",
      accessor: "saleMethod",
      filter: "search",
    },
    {
      Header: "Realty Specialist/SCO",
      accessor: "sco",
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
                  if (column.id === "salesNumber") {
                    filter["value"] = column["filterValue"]?.replace(/-/g, "");
                  } else {
                    filter["value"] = column["filterValue"];
                  }
                  filters.push(filter);
                });
                salesListPBSDOIState.zone.zoneList.forEach((item) => {
                  if (item.zoneId.toString() === defaultZoneId) {
                    setDefaultZoneName(item.zoneName);
                    getSalesManagement(item.zoneName, filters);
                  }
                });
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
                salesListPBSDOIState.zone.zoneList.forEach((item) => {
                  if (item.zoneId.toString() === defaultZoneId) {
                    setDefaultZoneName(item.zoneName);
                    getSalesManagement(item.zoneName, null);
                  }
                });
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: (property) => {
        let salesInfo = property.row.values;
        return (
          <>
            {!roles.isCOI ? (
              property.row.original.status === "Closed" ? (
                <></>
              ) : (
                <PPMSButton
                  variant={"secondary"}
                  label={"Edit"}
                  size={"sm"}
                  icon={<MdEdit />}
                  onPress={() => {
                    PageHelper.openPage(
                      `${Paths.salesTransactionPBSDOI}${
                        property.row.values.id
                          ? "/" + property.row.values.id
                          : ""
                      }?zoneId=${defaultZoneId}`
                    );
                  }}
                  id={`edit-${property.row.values.id}`}
                />
              )
            ) : (
              <></>
            )}
            {roles.isCOI || property.row.original.status === "Closed" ? (
              <PPMSButton
                variant={"secondary"}
                label={"View"}
                icon={<FaEye />}
                size={"sm"}
                onPress={() => {
                  PageHelper.openPage(
                    `${Paths.salesTransactionPBSDOI}${
                      property.row.values.id ? "/" + property.row.values.id : ""
                    }?zoneId=${defaultZoneId}`
                  );
                }}
                id={"view"}
              />
            ) : (
              <></>
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
  return (
    <div className="ui-ppms">
      <Breadcrumb pathname={location.pathname} zoneId={defaultZoneId} />
      <PPMSDatatable
        title={"Sales Management"}
        data={
          salesListPBSDOIState?.data?.filteredRows
            ? salesListPBSDOIState.data.filteredRows
            : []
        }
        columns={columns}
        defaultSortField={"itemControlNumber"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={
          salesListPBSDOIState?.other?.page?.rowsPerPageOptions
        }
        totalRows={salesListPBSDOIState?.other?.page?.totalRows}
        totalPages={salesListPBSDOIState?.other?.page?.totalPages}
        rowsPerPage={salesListPBSDOIState?.other?.page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        // handleSort={(sortBy) => this.handleSort(sortBy)}
        loading={loading}
        hiddenColumns={["id"]}
        currentPage={salesListPBSDOIState?.other?.page?.currentPage - 1}
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
                    values={salesListPBSDOIState.zone.zoneList}
                    isRequired={true}
                    isInvalid={salesListPBSDOIState.zone.isZoneEmpty}
                    validationMessage={
                      salesListPBSDOIState.zone.validationMessage
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
                    value={salesListPBSDOIState.zone.zoneRegions.toString()}
                    minLength={0}
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
            <div className="grid-col">
              <div className="btn-create sales-mang">
                {!roles.isCOI ? (
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"createSale"}
                    label={"Create a Sale"}
                    className={"create-sale out-button"}
                    onPress={() => {
                      PageHelper.openPage(
                        Paths.salesTransactionPBSDOI +
                          `?zoneId=${defaultZoneId}`
                      );
                    }}
                    id={"create-sale"}
                  />
                ) : (
                  <> </>
                )}
              </div>
            </div>
          </div>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(PBSDOISalesList);
