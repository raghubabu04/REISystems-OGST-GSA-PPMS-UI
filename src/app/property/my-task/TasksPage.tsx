import React from "react";
import { MdEdit } from "react-icons/md";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { UserUtils } from "../../../utils/UserUtils";
import { formatICN } from "../../../ui-kit/utilities/FormatUtil";
import { PageHelper, Paths } from "../../Router";
import { taskStatusOptions } from "../create-update-property/constants/Constants";
import { PPMSSelect } from "../../../ui-kit/components/common/select/PPMS-select";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";

enum myTaskView {
  CHANGEREQUEST = "CHANGEREQUEST",
  ALLOCATION = "ALLOCATION",
  NONE = "NONE",
}

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}

interface State {
  filterText: string;
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRowsRequests: number;
  totalPages: number;
  perPage: number;
  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  defaultFilterValue: string;
  statusFilterValue: string;
  taskStatusOptions: any[];
  currentPage: any;
  currentView: string;
}

export class TasksPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRowsRequests: 0,
      totalPages: 0,
      perPage: 10,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      defaultFilterValue: taskStatusOptions[0].id,
      statusFilterValue: taskStatusOptions[0].id,
      taskStatusOptions: taskStatusOptions,
      currentPage: 1,
      currentView: myTaskView.NONE,
    };
    this.handleStatusDropdownChange = this.handleStatusDropdownChange.bind(
      this
    );
    this.handleSort = this.handleSort.bind(this);
  }

  propertyApiService = new PropertyApiService();
  userPermissions = UserUtils.getUserPermissions().toString();

  getTaskList = async (data) => {
    try {
      const getTaskListResponse: any = await this.propertyApiService.getTaskList(
        data
      );
      return getTaskListResponse;
    } catch (e) {
      console.error(
        `MyTaskListPage propertyApiService.getTaskList has an error ${e}`
      );
      return e;
    }
  };

  setTaskListData = (getTaskListResponse) => {
    const filteredRows =
      getTaskListResponse &&
      getTaskListResponse.data &&
      getTaskListResponse.data.changeRequestDTOs
        ? getTaskListResponse.data.changeRequestDTOs
        : [];
    const totalElements =
      getTaskListResponse &&
      getTaskListResponse.data &&
      getTaskListResponse.data.totalElements
        ? getTaskListResponse.data.totalElements
        : 0;
    const totalPages =
      getTaskListResponse &&
      getTaskListResponse.data &&
      getTaskListResponse.data.totalPages
        ? getTaskListResponse.data.totalPages
        : 0;
    this.setState({
      filteredItems: filteredRows,
      totalRowsRequests: totalElements,
      totalPages: totalPages,
      loading: false,
      currentPage: 1,
    });
  };

  async componentDidMount() {
    const { perPage, statusFilterValue } = this.state;
    this.setState({
      loading: true,
    });

    const dataGetTaskList = {
      params: {
        page: 1,
        size: perPage,
        statusFilterValue,
      },
    };

    // this.userPermissions === "AC" || this.userPermissions === "NU"
    //   ? this.setState({
    //       currentView: myTaskView.NONE,
    //     })
    //   : this.setState({
    //       currentView: myTaskView.NONE,
    //     });

    let [getTaskListResponse, getCountOfTasksResponse] = await Promise.all([
      this.getTaskList(dataGetTaskList),
    ]);

    this.setTaskListData(getTaskListResponse);
  }

  handleChange = async (perPage, page) => {
    this.setState({ loading: true });
    const data = {
      params: {
        page: page,
        size: perPage,
      },
    };

    this.propertyApiService
      .getTaskList(data)
      .then((response: any) => {
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.setState({
          loading: false,
          filteredItems: response.data.changeRequestDTOs,
          totalRowsRequests: totalElements,
          totalPages: totalPages,
          perPage: perPage,
          currentPage: page,
        });
      })
      .catch((error) => {
        console.error(
          "MyTaskListPage has an error on propertyApiService",
          error
        );
        return error;
      });
  };

  formatItemControlNumber = (numberString) => {
    let icn = formatICN(numberString);
    return icn;
  };
  columns = [
    {
      Header: "ICN",
      accessor: "itemControlNumber",
      Cell: (props) => (
        <a href={"/viewProperty/" + props.value}>{formatICN(props.value)}</a>
      ),
    },
    {
      Header: "Property Name",
      accessor: "itemName",
    },
    {
      Header: "Agency Bureau",
      accessor: "agencyBureau",
    },
    {
      Header: "Reporting Date",
      accessor: "submittedDate",
    },
    {
      Header: "Property Status",
      accessor: "propertyStatus",
    },
    {
      Header:
        this.userPermissions !== "AC"
          ? "Excess Release Date (ERD)"
          : "Surplus Release Date (SRD)",
      accessor: "previousValue",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      sortType: "number",
    },
    {
      Header: this.userPermissions !== "AC" ? "Proposed ERD" : "Proposed SRD",
      accessor: "newValue",
    },
    {
      Header: this.userPermissions !== "AC" ? "Approved ERD" : "Approved SRD",
      accessor: (row) => (row.status === "APPROVED" ? row.approvedDate : ""),
    },
    {
      Header: "Status",
      accessor: "status",
    },

    {
      Header: "Action",
      id: "edit-property",
      Cell: (property) => (
        <PPMSButton
          variant={"secondary"}
          label={"Approve/Deny"}
          size={"sm"}
          icon={<MdEdit />}
          onPress={() => {
            PageHelper.openPage(
              Paths.manageChangeRequest +
                "/" +
                property.data[property.row.id].changeRequestId
            );
          }}
          isDisabled={
            //disable "Approve/Deny" button if the property is WITHDRAWN or if the changeRequest is not PENDING
            property.data[property.row.id].propertyStatus == "WITHDRAWN" ||
            property.data[property.row.id].status !== "PENDING"
          }
          id={"edit"}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  handleStatusDropdownChange(event: any) {
    let startValue = event.target.options[event.target.selectedIndex].id;
    this.setState({
      defaultFilterValue: startValue,
    });

    this.refreshTaskListTableFromFilterChange(startValue);
  }

  async refreshTaskListTableFromFilterChange(status) {
    const { perPage } = this.state;
    this.setState({ loading: true, statusFilterValue: status });
    const data = {
      params: {
        page: 1,
        size: perPage,
        status: status,
      },
    };

    let getTaskListResponseUpdated = await this.getTaskList(data);
    this.setTaskListData(getTaskListResponseUpdated);
  }

  handleSort = (sortBy) => {
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;
    const data = {
      params: {
        page: 1,
        size: this.state.perPage,
        sort: sort,
      },
    };
    this.propertyApiService
      .getTaskList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.changeRequestDTOs
            ? response.data.changeRequestDTOs
            : [];
        this.setState({
          loading: false,
          filteredItems: filteredRows,
          currentPage: 1,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  render() {
    return (
      <>
        <div className={"ui-ppms"}>
          <h1>Change Requests</h1>

          <div>
            <PPMSDatatable
              title={""}
              data={this.state.filteredItems}
              columns={this.columns}
              defaultSortField={"submittedDate"}
              loading={this.state.loading}
              rowsPerPageOptions={this.state.rowsPerPageOptions}
              totalRows={this.state.totalRowsRequests}
              totalPages={this.state.totalPages}
              rowsPerPage={this.state.perPage}
              serverSort={true}
              isPaginationEnabled={true}
              onChange={this.handleChange}
              handleSort={(sortBy) => this.handleSort(sortBy)}
              currentPage={this.state.currentPage - 1}
              subHeaderComponent={
                <div className={"grid-row"}>
                  <div className={"grid-col-6"}>
                    <div className="filter-bkgd">
                      <PPMSSelect
                        id={"filter-by-taskStatus"}
                        selectName={"filterTasks"}
                        values={this.state.taskStatusOptions}
                        selectedValue={this.state.defaultFilterValue}
                        onChange={this.handleStatusDropdownChange}
                        isValid={false}
                        isInvalid={false}
                        validationMessage={""}
                        identifierKey={"id"}
                        identifierValue={"value"}
                        label={"Filter by:"}
                        isRequired={true}
                        selectClass={"inventory"}
                      />
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </>
    );
  }
}
