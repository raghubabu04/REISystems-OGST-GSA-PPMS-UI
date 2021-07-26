import React, {useEffect, useState} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from "moment";
import {MdEdit, MdFileDownload} from "react-icons/md";
import {FaCalendar} from "react-icons/fa";
import {AiOutlineWarning} from "react-icons/ai";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSButton} from "../../../../ui-kit/components/common/PPMS-button";
import {PPMSPopover} from "../../../../ui-kit/components/common/PPMS-popover";
import {addToast} from "../../../../_redux/_actions/toast.actions";
import {PropertyApiService} from "../../../../api-kit/property/property-api-service";
import {Reporting3040defaultState, Reporting3040State,} from "./3040-reporting-state";
import {UserUtils} from "../../../../utils/UserUtils";
import {PageHelper, Paths} from "../../../Router";
import {PPMSAccordion} from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import {CommonApiService} from "../../../../api-kit/common/common-api.service";
import {PPMSSelect} from "../../../../ui-kit/components/common/select/PPMS-select";
import {PPMSToggleRadio} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import {formatInventoryValue, report3040RadioGroup,} from "./edit-3040-report/constants-3040";

interface Reporting3040Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

const Reporting3040List = (props: Reporting3040Props) => {
  const [reportingList, setReportingListState] = useState<Reporting3040State>(
    Reporting3040defaultState
  );

  const [selectedReport, setSelectedReport] = useState(report3040RadioGroup);

  const [selectedRegion, setSelectedRegion] = useState("");

  const [selectedReportFilter, setSelectedReportFilter] = useState(
    "allReports"
  );

  const updateReportingList = (newState: any) => {
    setReportingListState((prevState: any) => {
      return { ...prevState, ...newState };
    });
  };

  const propertyApiService = new PropertyApiService();
  const commonApiService = new CommonApiService();

  useEffect(() => {
    commonApiService
      .getRegionCodes()
      .then((response: any) => {
        let regionValues = response.data;
        updateReportingList({
          regionValues: regionValues,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const makeApiCall = (data) => {
    propertyApiService
      .reporting3040List(data)
      .then((response: any) => {
        let filteredRows = [];
        for (let reportlist of response.data.state3040ReportResultList) {
          let row = {
            reportId: reportlist.id,
            beginningInventory: reportlist.beginningInventory,
            itemName: reportlist.itemName,
            financialYear: reportlist.financialYear,
            startDate: reportlist.startDate
              ? moment(reportlist.startDate).format("MM/DD/YYYY")
              : "",
            reportedDate: reportlist.reportedDate
              ? moment(reportlist.reportedDate).format("MM/DD/YYYY")
              : "",
            endDate: reportlist.endDate
              ? moment(reportlist.endDate).format("MM/DD/YYYY")
              : "",
            state: reportlist.state,
            totalDeduction: reportlist.totalDeductions,
            status: reportlist.status,
            totalReceipts: reportlist.totalReceipts,
            warning: reportlist.warning,
            quarter: reportlist.quarter,
            endingInventory: reportlist.endingInventory,
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
        updateReportingList({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
        });
      })
      .catch((error) => {
        updateReportingList({ loading: false });
      });
  };

  const filters = () => {
    return [
      {
        title: "Filters",
        content: (
          <>
            <div className={"grid-row grid-gap-2"}>
              <div className={"grid-col-2"}>
                <PPMSSelect
                  placeholderValue={"All Regions"}
                  selectName={"region"}
                  id={"assigned-filter"}
                  title={"assigned-filter"}
                  label={"Filter By Region"}
                  identifierValue={"regionDescription"}
                  identifierKey={"regionCode"}
                  selectedValue={selectedRegion}
                  isRequired={true}
                  values={reportingList.regionValues}
                  onChange={(event) => setSelectedRegion(event.target.value)}
                />
                <br />
              </div>
              <div className={"grid-col-4"}>
                <PPMSToggleRadio
                  id={"dashboardRadio"}
                  options={selectedReport}
                  isInline={true}
                  isDisabled={false}
                  isRequired={true}
                  name={"dashboardRadio"}
                  label={"Filter By"}
                  validationMessage={"Error!"}
                  onChange={(event) => {
                    event.forEach((e) => {
                      if (e.isSelected) {
                        setSelectedReportFilter(e.id);
                      }
                    });
                  }}
                />
              </div>
            </div>
            <div className={"grid-row grid-gap-2"}>
              <PPMSButton
                id={"apply-filter-top"}
                onPress={() => handleTopApplyFilters()}
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

  const getReportingList = async (filters: any) => {
    updateReportingList({
      loading: true,
    });
    let financialYear;
    let quarter;
    let state;
    let beginningInventory;
    let totalReceipts;
    let totalDeductions;
    let endingInventory;
    let reportedDateTo;
    let reportedDateFrom;
    let status;

    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].id) {
        case "financialYear":
          financialYear = filters[i]["value"];
          break;
        case "quarter":
          quarter = filters[i]["value"];
          break;
        case "state":
          state = filters[i]["value"];
          break;
        case "beginningInventory":
          beginningInventory = filters[i]["value"];
          break;
        case "totalReceipts":
          totalReceipts = filters[i]["value"];
          break;
        case "totalDeduction":
          totalDeductions = filters[i]["value"];
          break;
        case "endingInventory":
          endingInventory = filters[i]["value"];
          break;
        case "reportedDate":
          reportedDateFrom = filters[i]["value"] ?
          moment(filters[i]["value"], "MM/DD/YYYY").format(
            "YYYY-MM-DDT00:00:00.000"
          ): ""
          reportedDateTo = filters[i]["value"] ?
          moment(filters[i]["value"], "MM/DD/YYYY").format(
            "YYYY-MM-DDT23:59:59.999"
          ): ""
          break;
        case "status":
          status = filters[i]["value"] ? filters[i]["value"].toUpperCase() : "";
          break;
      }
    }

    let data = {
      financialYear: financialYear ? financialYear : "",
      quarter: quarter ? quarter : "",
      state: state ? state : "",
      beginningInventory: beginningInventory ? beginningInventory : "",
      totalReceipts: totalReceipts ? totalReceipts : "",
      totalDeductions: totalDeductions
        ? totalDeductions.replace(/,+/g, "")
        : "",
      endingInventory: endingInventory ? endingInventory : "",
      reportedDateFrom: reportedDateFrom ? reportedDateFrom : "",
      reportedDateTo: reportedDateTo ? reportedDateTo : "",
      status: status ? status : "",
      params: {
        page: 1,
        size: reportingList.perPage,
      },
    };

    if (reportingList.sort) {
      data.params["sort"] = reportingList.sort;
    }

    updateReportingList({
      financialyearFilter: financialYear,
      quarterFilter: quarter,
      stateFilter: state,
      beginningInventoryFilter: beginningInventory,
      totalReceiptsFilter: totalReceipts,
      totalDeductionFilter: totalDeductions,
      endingInventoryFilter: endingInventory,
      statusFilter: status,
      reportedDateFromFilter: reportedDateFrom,
      reportedDateToFilter: reportedDateTo,
    });

    makeApiCall(data);
  };

  const handleTopApplyFilters = (defaultFilter: boolean = false) => {
    //Make API Call with top filters
    //Preserve bottom filters
    let data = {
      financialYear: reportingList.financialyearFilter
        ? reportingList.financialyearFilter
        : "",
      quarter: reportingList.quarterFilter ? reportingList.quarterFilter : "",
      state: reportingList.stateFilter ? reportingList.stateFilter : "",
      beginningInventory: reportingList.beginningInventoryFilter
        ? reportingList.beginningInventoryFilter
        : "",
      totalReceipts: reportingList.totalReceiptsFilter
        ? reportingList.totalReceiptsFilter
        : "",
      totalDeductions: reportingList.totalDeductionFilter
        ? reportingList.totalDeductionFilter
        : "",
      endingInventory: reportingList.endingInventoryFilter
        ? reportingList.endingInventoryFilter
        : "",
      reportedDateFrom:reportingList.reportedDateFromFilter
        ? reportingList.reportedDateFromFilter
        : "",
      reportedDateTo:reportingList.reportedDateToFilter
        ? reportingList.reportedDateToFilter
        : "",
      status: defaultFilter ? "allReports" : selectedReportFilter,
      region: defaultFilter ? "" : selectedRegion,
      params: {
        page: 1,
        size: reportingList.perPage,
      },
    };

    if (reportingList.sort) {
      data.params["sort"] = reportingList.sort;
    }

    makeApiCall(data);
  };

  const clearFilters = () => {
    report3040RadioGroup.forEach((e) => {
      if (e.id === "allReports") {
        e.isSelected = true;
      } else {
        e.isSelected = false;
      }
    });
    setSelectedRegion("");
    setSelectedReport(report3040RadioGroup);
    setSelectedReportFilter("allReports");
    handleTopApplyFilters(true);
  };

  const handleDownload3040Report = (reportingInfo) => {
    updateReportingList({
      loading: true,
    });
    let data = {
      financialYear: reportingInfo.financialYear,
      quarter: reportingInfo.quarter,
      state: reportingInfo.state,
    };
    propertyApiService
      .download3040ReportFile(data)
      .then((response) => {
        let blob = new Blob([response.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob);
        var a = document.createElement("a");
        a.setAttribute("download", "3040Report.xlsx");
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(link);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const warningAndDateIcon = (data) => {
    const name: string = data.row.values["quarter"];
    const tooltip1 = `${data?.row?.original?.startDate} - ${data?.row?.original?.endDate}`;
    const tooltip2 = `Report past due for the financial year ${data?.row?.original?.quarter}, ${data?.row?.original?.financialYear}`;
    return (
      <div className="badge">
        {name}{" "}
        <PPMSPopover
          trigger={["hover", "focus"]}
          id={"location-description1"}
          placement={"right"}
          popoverTitle={""}
          popoverContent={<>{tooltip1}</>}
          triggerSource={
            <FaCalendar style={{ color: '#005EA2'}} className={`ppms-usa-calendar-icon-lot`} />
          }
        />
        {data?.row?.original?.warning ? (
          <PPMSPopover
            trigger={["hover", "focus"]}
            id={"location-description2"}
            placement={"right"}
            popoverTitle={""}
            popoverContent={<>{tooltip2}</>}
            triggerSource={<AiOutlineWarning style={{ color: '#A83232'}} />}
          />
        ) : null}
      </div>
    );
  };

  const columns = [
    {
      Header: "id",
      accessor: "reportId",
    },
    {
      Header: "FY",
      accessor: "financialYear",
      filter: "search",
    },
    {
      Header: "Quarter",
      accessor: "quarter",
      filter: "search",
      Cell: (data) => warningAndDateIcon(data),
    },
    {
      Header: "State",
      accessor: "state",
      filter: "search",
    },
    {
      Header: "Beginning Inventory",
      accessor: "beginningInventory",
      Cell: (props) => formatInventoryValue(props.value),
      filter: "search",
    },
    {
      Header: "Total Receipts",
      accessor: "totalReceipts",
      Cell: (props) => formatInventoryValue(props.value),
      filter: "search",
    },
    {
      Header: "Total Deduction",
      accessor: "totalDeduction",
      Cell: (props) => formatInventoryValue(props.value),
      filter: "search",
    },
    {
      Header: "Ending Inventory",
      accessor: "endingInventory",
      Cell: (props) => formatInventoryValue(props.value),
      filter: "search",
    },
    {
      Header: "Reported Date",
      accessor: "reportedDate",
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "status",
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
                });
                getReportingList(filters);
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
                getReportingList(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },

      Cell: (property) => {
        let reportingListInfo = property.row.values;
        return (
          <>
            {UserUtils.isUserSA() ? (
              <PPMSButton
                variant={"secondary"}
                label={
                  reportingListInfo.status === "Approved" ||
                  reportingListInfo.status === "Pending Approval"
                    ? "View"
                    : "Edit"
                }
                size={"sm"}
                icon={<MdEdit />}
                onPress={() => {
                  if (
                    reportingListInfo.status === "Approved" ||
                    reportingListInfo.status === "Pending Approval"
                  ) {
                    PageHelper.openPage(
                      Paths.view3040Report + "/" + reportingListInfo.reportId
                    );
                  } else {
                    PageHelper.openPage(
                      Paths.edit3040Report + "/" + reportingListInfo.reportId
                    );
                  }
                }}
                id={`edit3040Report-${reportingListInfo.reportId}`}
              />
            ) : (
              <PPMSButton
                variant={"secondary"}
                label={"Edit"}
                icon={<MdEdit />}
                size={"sm"}
                onPress={() =>
                  PageHelper.openPage(
                    Paths.edit3040Report + "/" + reportingListInfo.reportId
                  )
                }
                id={`edit3040Report-${reportingListInfo.reportId}`}
              />
            )}
            {(UserUtils.isUserApo() ||
              UserUtils.getUserPermissions().includes("SM")) &&
            reportingListInfo.status === "Approved" ? (
              <PPMSButton
                variant={"secondary"}
                type={"button"}
                size={"sm"}
                value={"downloadReport"}
                label={"Download"}
                className={"create-property"}
                onPress={() => handleDownload3040Report(reportingListInfo)}
                id={"download-report-btn"}
                icon={<MdFileDownload />}
              />
            ) : (
              ""
            )}
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: false, // change to false
    },
  ];

  const handleSort = (sortBy) => {
    updateReportingList({
      loading: true,
    });

    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;

    updateReportingList({ sort: sort });
    //Preserve search results while sorting

    let data = {
      financialYear: reportingList.financialYear,
      quarter: reportingList.quarter,
      state: reportingList.state,
      beginningInventory: reportingList.beginningInventory,
      totalReceipts: reportingList.totalReceipts,
      totalDeductions: reportingList.totalDeduction,
      endingInventory: reportingList.endingInventory,
      status: reportingList.status,
      params: {
        page: 1,
        size: reportingList.perPage,
        sort: sort,
      },
    };
    makeApiCall(data);
  };

  const handleChange = async (perPage, page) => {
    updateReportingList({
      loading: true,
    });

    let data = {
      financialYear: reportingList.financialYear,
      quarter: reportingList.quarter,
      beginningInventory: reportingList.beginningInventory,
      totalReceipts: reportingList.totalReceipts,
      totalDeductions: reportingList.totalDeduction,
      endingInventory: reportingList.endingInventory,
      reportedDate: reportingList.reportedDate,
      status: reportingList.status,
      state: null,
      params: {
        page: page,
        size: perPage,
      },
    };

    if (reportingList.sort) {
      data.params["sort"] = reportingList.sort;
    }

    updateReportingList({
      currentPage: page,
      perPage: perPage,
    });

    makeApiCall(data);
  };

  return (
    <>
      <div className="ui-ppms">
        <PPMSDatatable
          title={"3040 Reporting"}
          columns={columns}
          showFilters={true}
          data={reportingList.filteredItems}
          defaultSortField={""}
          serverSort={true}
          currentPage={reportingList.currentPage - 1}
          handleSort={(sortBy) => handleSort(sortBy)}
          hiddenColumns={
            UserUtils.isUserSA() ? ["state", "reportId"] : ["reportId"]
          }
          loading={reportingList.loading}
          rowsPerPageOptions={reportingList.rowsPerPageOptions}
          totalRows={reportingList.totalRows}
          totalPages={reportingList.totalPages}
          rowsPerPage={reportingList.perPage}
          isPaginationEnabled={true}
          onChange={handleChange}
          subHeaderComponent={
            <div className={"grid-row"}>
              {(UserUtils.isSystemAdminUser() || UserUtils.isUserApo()) && (
                <PPMSAccordion bordered={false} items={filters()} />
              )}
            </div>
          }
        />
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Reporting3040List);
