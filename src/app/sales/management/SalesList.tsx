import React, { useContext, useEffect, useState } from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../Router";
import Breadcrumb from "./common/Breadcrumb";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import { SalesListContext } from "./SalesListContext";
import { UserUtils } from "../../../utils/UserUtils";
import { MdEdit } from "react-icons/md";
import { CommonApiService } from "../../../api-kit/common/common-api.service";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { Tab, Tabs } from "react-bootstrap";
import { saleActions } from "../../../_redux/_actions/sale.actions";
import { FaEye } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { formatSaleNumber } from "../../../ui-kit/utilities/FormatUtil";
import { assignmentsValues } from "../constant/Constants";
import { Link } from "react-router-dom";

interface SalesListProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
}

const SalesList = (props: SalesListProps) => {
  const { user, location, updateSaleInfo } = props;
  let salesAPIService = new SalesApiService();
  const commonApiService = new CommonApiService();
  const { salesListState, updateSalesListState } = useContext(SalesListContext);
  const [defaultZoneId, setdefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );
  const [loading, setLoading] = useState(false);
  const [apiRows, setApiRows] = useState([]);
  const [assignmentsFilter, setAssignmentsFilter] = useState("A");
  const [assignmentsFilterApplied, setAssignmentsFilterApplied] = useState("A");
  const [searchByEmail, setSearchByEmail] = useState("");

  const onClickAction = (salesInfo, action) => {
    updateSaleInfo(
      salesInfo.id,
      salesInfo.salesNumber,
      action,
      parseInt(salesInfo.salesNumber.substr(0, 1))
    );

    PageHelper.openPage(
      Paths.salesTransaction +
        `/${salesInfo.id}?zoneId=${parseInt(defaultZoneId)}`
    );
  };
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
            to={`${Paths.salesTransaction}${
              data.row.values.id ? "/" + data.row.values.id : ""
            }?zoneId=${defaultZoneId}`}
            className={"sales-transaction"}
            key="sales-transaction-id"
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
      Header: "Sale Items",
      accessor: "icnCount",
      filter: "search",
    },
    {
      Header: "Sco Email",
      accessor: "scoEmail",
      id: "scoEmail",
    },
    {
      Header: "SCO",
      accessor: "sco",
      filter: "search",
    },
    {
      Header: "Alt. SCO",
      accessor: "alternateSco",
      filter: "search",
    },
    {
      Header: "Alt. SCO Email",
      accessor: "alternateScoEmail",
      id: "alternateScoEmail",
    },
    {
      Header: "Marketing Spl",
      accessor: "marketingSplEmail",
      id: "marketingSplEmail",
    },
    {
      Header: "Sales Description",
      accessor: "salesDescription",
      filter: "search",
    },
    {
      Header: "Start Date",
      accessor: "salesDate",
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "salesStatus",
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
                let state = salesListState;
                salesListState.other.page.currentPage = 1;
                updateSalesListState(state);

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
                if (salesListState.data.selectedTab === "completed") {
                  filters.push({
                    id: "salesStatus",
                    value: salesListState.data.selectedTab,
                  });
                }
                getSalesManagement(user.defaultZone, filters);
              }}
              label={"Search"}
            />
            <PPMSButton
              id={"clear-filter"}
              onPress={() => {
                let state = salesListState;
                salesListState.other.page.currentPage = 1;
                updateSalesListState(state);

                let filters = [];
                columns.columns.forEach((column) => {
                  column.setFilter("");
                });
                if (salesListState.data.selectedTab === "completed") {
                  filters.push({
                    id: "salesStatus",
                    value: salesListState.data.selectedTab,
                  });
                }
                getSalesManagement(user.defaultZone, filters);
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
            {props.roles.isSCO &&
              (salesInfo.scoEmail === user.emailAddress ||
                salesInfo.alternateScoEmail === user.emailAddress) && (
                <PPMSButton
                  variant={"secondary"}
                  label={"Edit"}
                  size={"sm"}
                  className={"manage-list-actions"}
                  icon={<MdEdit />}
                  onPress={() => onClickAction(salesInfo, "edit")}
                  id={"edit-" + salesInfo.salesNumber}
                />
              )}
            {(props.roles.isSMS ||
              props.roles.isSG ||
              props.roles.isCO ||
              props.roles.isCLO ||
              (salesInfo.scoEmail !== user.emailAddress &&
                salesInfo.alternateScoEmail !== user.emailAddress)) && (
              <PPMSButton
                variant={"secondary"}
                label={"View"}
                icon={<FaEye />}
                size={"sm"}
                className={"manage-list-actions"}
                onPress={() => onClickAction(salesInfo, "view")}
                id={"view-" + salesInfo.salesNumber}
              />
            )}
            {(props.roles.isSMS ||
              props.roles.isSG ||
              props.roles.isCO ||
              props.roles.isCLO ||
              props.roles.isSCO) && (
              <PPMSButton
                variant={"secondary"}
                label={"Lotting"}
                icon={<FiPackage />}
                size={"sm"}
                className={"manage-list-actions"}
                value={""}
                onPress={() => {
                  updateSaleInfo(
                    salesInfo.id,
                    salesInfo.salesNumber,
                    null,
                    parseInt(salesInfo.salesNumber.substr(0, 1))
                  );
                  PageHelper.openPage(
                    Paths.salesAddICNToLot +
                      "/" +
                      salesInfo.id +
                      `?zoneId=${defaultZoneId}`
                  );
                }}
                id={"withdraw-" + salesInfo.salesNumber}
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
  function handleChange({ selectedIndex }) {
    let state = salesListState;
    if (selectedIndex === 0) {
      state.zone.zoneRegions = [];
      state.zone.isZoneEmpty = true;
      state.zone.validationMessage = "Please select a zone.";
    } else {
      state.zone.isAddAllDisabled = false;
      const zoneID = salesListState.zone.zoneList[selectedIndex - 1]
        ? salesListState.zone.zoneList[selectedIndex - 1].zoneId
        : "";
      setdefaultZoneId(zoneID);
      let zoneRegions = [];
      commonApiService
        .getZoneRegions(zoneID)
        .then((response: any) => {
          response?.data.forEach((region) => {
            zoneRegions.push(region.regionCode);
          });
          let state = salesListState;
          state.zone.selectedZone = zoneID;
          state.zone.zoneRegions = zoneRegions;
          state.zone.isZoneEmpty = false;
          state.zone.validationMessage = "";
          let filters = [];
          if (salesListState.data.selectedTab === "completed") {
            filters.push({
              id: "salesStatus",
              value: salesListState.data.selectedTab,
            });
          }
          getSalesManagement(zoneID, filters);
          updateSalesListState(state);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
    updateSaleInfo(null, null, null, parseInt(state.zone.selectedZone));
    updateSalesListState(state);
  }

  let handleChangeTable = (perPage, page) => {
    let state = salesListState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    salesListState.data.filteredRows = apiData.slice(startIndex, endIndex);
    salesListState.other.page.totalRows = apiRows.length;
    salesListState.other.page.totalPages = Math.ceil(totalPages);
    salesListState.other.page.currentPage = page;
    salesListState.other.page.perPage = perPage;
    updateSalesListState(state);
  };

  let getSalesManagement = (zoneId: number, filters: any) => {
    let params: any = {};
    params.page = salesListState.other.page.currentPage;
    params.size = salesListState?.other?.page?.perPage;
    params.zone = zoneId;

    filters?.forEach((filter) => {
      if (filter.value) {
        params[filter.id] = filter.value;
      }
    });

    if (!params.hasOwnProperty("assignmentsFilter")) {
      params["assignmentsFilter"] = assignmentsFilterApplied;
    }

    salesAPIService
      .getTransactionList(params)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.sales
            ? response.data.sales
            : [];
        filteredRows = filteredRows.map((row) => {
          let rowDetails = row.salesNumberDetails;
          let obj: any = {};
          obj.id = rowDetails.id;
          obj.salesNumber = rowDetails.salesNumber;
          obj.lotCount = rowDetails.lotCount;
          obj.icnCount = rowDetails.icnCount;
          obj.sco = rowDetails.sco?.firstName + " " + rowDetails.sco?.lastName;
          obj.scoEmail = rowDetails.sco?.email;
          obj.alternateSco = rowDetails?.alternateSCO
            ? rowDetails.alternateSCO?.firstName +
              " " +
              rowDetails.alternateSCO?.lastName
            : "";
          obj.alternateScoEmail = rowDetails?.alternateSCO?.email;
          obj.marketingSplEmail = rowDetails?.marketingSpecialist?.email;
          obj.salesDescription = rowDetails.salesDescription;
          obj.salesDate = rowDetails.salesDate;
          obj.salesStatus = rowDetails.salesStatus;
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
        let state = salesListState;
        salesListState.data.filteredRows = filteredRows.slice(
          0,
          salesListState?.other?.page?.perPage
        );
        salesListState.other.loading = false;
        salesListState.other.page.totalRows = totalElements;
        salesListState.other.page.totalPages = totalPages;
        setLoading(false);
        updateSalesListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    handleTabSelect(salesListState.data.selectedTab);
    const data = {
      params: {
        zoneIds: UserUtils.getUserZones().join(","),
      },
    };
    commonApiService
      .getZoneSalesControlList(data)
      .then((response: any) => {
        let state = salesListState;
        state.zone.zoneList = response?.data;
        updateSalesListState(state);
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
        let state = salesListState;
        state.zone.zoneRegions = zoneRegions;
        updateSalesListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }, [
    salesListState.other.page.currentPage,
    salesListState.other.page.perPage,
  ]);

  const handleTabSelect = (value) => {
    let state = salesListState;
    if (state.data.selectedTab !== value) {
      state.other.page.currentPage = 1;
    }
    state.data.selectedTab = value;
    updateSalesListState(state);
    let filter = [
      { id: "salesStatus", value: `${value === "open" ? "" : value}` },
    ];
    getSalesManagement(parseInt(defaultZoneId), filter);
  };

  const applyFilters = () => {
    let state = salesListState;
    salesListState.other.page.currentPage = 1;
    updateSalesListState(state);

    let filters = [];
    for (let options of assignmentsValues) {
      if (options.id === assignmentsFilter) {
        filters.push({ id: "assignmentsFilter", value: options.id });
        setAssignmentsFilterApplied(options.id);
        if (assignmentsFilter === "M") {
          setSearchByEmail("");
        }
      }
    }
    if (searchByEmail) {
      filters.push({ id: "filterByEmail", value: searchByEmail });
    }
    if (salesListState.data.selectedTab === "completed") {
      filters.push({
        id: "salesStatus",
        value: salesListState.data.selectedTab,
      });
    }
    getSalesManagement(parseInt(defaultZoneId), filters);
  };

  const clearFilters = () => {
    let state = salesListState;
    salesListState.other.page.currentPage = 1;
    updateSalesListState(state);

    setAssignmentsFilter("");
    setSearchByEmail("");
    setAssignmentsFilterApplied("");
    let filters = [];
    if (salesListState.data.selectedTab === "completed") {
      filters.push({
        id: "salesStatus",
        value: salesListState.data.selectedTab,
      });
    }
    getSalesManagement(parseInt(defaultZoneId), filters);
  };

  const filters = () => {
    return [
      {
        title: "Filters",
        content: (
          <>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-2"}>
                <PPMSSelect
                  id={"assigneds-filter"}
                  title={"assigneds-filter"}
                  label={"By Assignments"}
                  identifierKey={"id"}
                  identifierValue={"value"}
                  isRequired={true}
                  values={assignmentsValues}
                  selectedValue={assignmentsFilter}
                  onChange={(event) => setAssignmentsFilter(event.target.value)}
                />
                <br />
              </div>
              <div className={"grid-col-3"}>
                <PPMSInput
                  id={"userEmail"}
                  name={"userEmail"}
                  label={"By Email"}
                  isDisabled={assignmentsFilter === "M" ? true : false}
                  isRequired={true}
                  inputType={"text"}
                  placeHolder={"Email Address"}
                  value={searchByEmail}
                  onChange={(event) => setSearchByEmail(event.target.value)}
                />
              </div>
            </div>
            <div className={"grid-row"}>
              <PPMSButton
                id={"apply-filter-top"}
                onPress={() => applyFilters()}
                label={"Apply Filter"}
                className={"create-property"}
              />
              <PPMSButton
                id={"clear-filter-top"}
                onPress={() => clearFilters()}
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
  };

  return (
    <div className="ui-ppms grid-row grid-gap-4">
      <Breadcrumb pathname={location.pathname} zoneId={defaultZoneId}/>
      <PPMSDatatable
        title={"Sales Management"}
        data={
          salesListState?.data?.filteredRows
            ? salesListState.data.filteredRows
            : []
        }
        columns={columns}
        defaultSortField={"itemControlNumber"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={salesListState?.other?.page?.rowsPerPageOptions}
        totalRows={salesListState?.other?.page?.totalRows}
        totalPages={salesListState?.other?.page?.totalPages}
        rowsPerPage={salesListState?.other?.page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        // handleSort={(sortBy) => this.handleSort(sortBy)}
        loading={loading}
        hiddenColumns={[
          "id",
          "scoEmail",
          "alternateScoEmail",
          "marketingSplEmail",
        ]}
        currentPage={salesListState?.other?.page?.currentPage - 1}
        tabComponent={
          <>
            <br />
            <Tabs
              defaultActiveKey="open"
              id="open-sales-tab"
              className="ppms-tabs"
              onSelect={(value) => {
                handleTabSelect(value);
              }}
            >
              <Tab eventKey="open" title="Open/Pending Sales" />
              <Tab eventKey="completed" title="Completed Sales" />
            </Tabs>
          </>
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
                    values={salesListState.zone.zoneList}
                    isRequired={true}
                    isInvalid={salesListState.zone.isZoneEmpty}
                    validationMessage={salesListState.zone.validationMessage}
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
                    value={salesListState.zone.zoneRegions.toString()}
                    minLength={0}
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
            <br />
            {props.roles.isSCO && (
              <div className="grid-col">
                <div className="btn-create sales-mang">
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"createSale"}
                    label={"Create a Sale"}
                    className={"create-sale out-button"}
                    onPress={() => {
                      updateSaleInfo(null, null, null, parseInt(defaultZoneId));
                      PageHelper.openPage(
                        Paths.salesTransaction +
                          `?zoneId=${parseInt(defaultZoneId)}`
                      );
                    }}
                    id={"create-sale"}
                  />
                </div>
              </div>
            )}
            <div className={"grid-col-12"}>
              <div className={"margin-top-3 col-md-auto"}>
                <div className={"grid-row grid-gap-8"}>
                  {<PPMSAccordion bordered={true} items={filters()} />}
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
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
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(
        saleActions.updateSaleInfo(saleId, saleNumber, saleAction, zone)
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesList);
