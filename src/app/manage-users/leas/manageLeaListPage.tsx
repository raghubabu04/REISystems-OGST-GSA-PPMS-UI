import React from "react";
import {MdEdit} from "react-icons/md";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {PageHelper, Paths} from "../../Router";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import moment from "moment";
import {connect} from "react-redux";
import {UserApiService} from "../../../api-kit/user/user-api.service";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

interface State {
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  rowsPerPageOptions: [number, number, number, number, number];
  sort: string;
  userIdFilter: string;
  leaFirstNameFilter: string;
  leaLastNameFilter: string;
  leaEmailFilter: string;
  organizationFilter: string;
  stateFilter: string;
  itemsIssuedFilter: string;
  inventoryDateFilterTo: string;
  inventoryDateFilterFrom: string;
  certifiedDateFilterTo: string;
  certifiedDateFilterFrom: string;
}

export class ManageLeaListPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      currentPage: 1,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      sort: "userId,ASC",
      userIdFilter: "",
      leaFirstNameFilter: "",
      leaLastNameFilter: "",
      leaEmailFilter: "",
      organizationFilter: "",
      stateFilter: "",
      itemsIssuedFilter: "",
      inventoryDateFilterTo: "",
      inventoryDateFilterFrom: "",
      certifiedDateFilterTo: "",
      certifiedDateFilterFrom: "",
    };
  }
  private userApiService = new UserApiService();

  async componentDidMount() {
    //Get initial list from API
    this.getLEASFromAPI([]);
  }

  getLEASFromAPI = (filters) => {
    this.setState({
      loading: true,
    });
    let userId;
    let leaFirstName;
    let leaLastName;
    let leaEmail;
    let organization;
    let state;
    let itemsIssued;
    let inventoryDate;
    let certifiedDate;
    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].id) {
        case "userId":
          userId = filters[i]["value"];
          break;
        case "leaFirstName":
          leaFirstName = filters[i]["value"];
          break;
        case "leaLastName":
          leaLastName = filters[i]["value"];
          break;
        case "leaEmail":
          leaEmail = filters[i]["value"];
          break;
        case "organization":
          organization = filters[i]["value"];
          break;
        case "state":
          state = filters[i]["value"];
          break;
        case "itemsIssued":
          itemsIssued = filters[i]["value"];
          break;
        case "inventoryDate":
          inventoryDate = filters[i]["value"];
          break;
        case "certifiedDate":
          certifiedDate = filters[i]["value"];
          break;
      }
    }
    let inventoryDateFrom;
    let inventoryDateTo;
    if (inventoryDate) {
      inventoryDateFrom = moment(
        moment(inventoryDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT00:00:00.000");
      inventoryDateTo = moment(
        moment(inventoryDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT23:59:59.999");
    }

    let certifiedDateFrom;
    let certifiedDateTo;
    if (certifiedDate) {
      certifiedDateFrom = moment(
        moment(certifiedDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT00:00:00.000");
      certifiedDateTo = moment(
        moment(certifiedDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT23:59:59.999");
    }

    let data = {
      userId: userId,
      leaFirstName: leaFirstName,
      leaLastName: leaLastName,
      leaEmail: leaEmail,
      organization: organization,
      state: state,
      itemsIssued: itemsIssued,
      inventoryDateTo: inventoryDateTo,
      inventoryDateFrom: inventoryDateFrom,
      certifiedDateTo: certifiedDateTo,
      certifiedDateFrom: certifiedDateFrom,
      params: {
        page: 1,
        size: this.state.perPage,
      },
    };

    if (this.state.sort) {
      data.params["sort"] = this.state.sort;
    }

    this.setState({
      userIdFilter: userId,
      leaFirstNameFilter: leaFirstName,
      leaLastNameFilter: leaLastName,
      leaEmailFilter: leaEmail,
      organizationFilter: organization,
      stateFilter: state,
      itemsIssuedFilter: itemsIssued,
      inventoryDateFilterTo: inventoryDate,
      inventoryDateFilterFrom: inventoryDate,
      certifiedDateFilterTo: certifiedDate,
      certifiedDateFilterFrom: certifiedDate,
    });

    this.userApiService
      .getLeaList(data)
      .then((response: any) => {
        let filteredRows = [];
        for (let lea of response.data.leaUserDetails) {
          let row = {
            userId: lea.userId,
            leaFirstName: lea.leaFirstName,
            leaLastName: lea.leaLastName,
            leaEmail: lea.leaEmail,
            organization: lea.organization,
            state: lea.state,
            itemsIssued: lea.itemsIssued,
            inventoryDate:
              moment(lea.inventoryDate).format("MM/DD/YYYY") !== "Invalid date"
                ? moment(lea.inventoryDate).format("MM/DD/YYYY")
                : "",
            certifiedDate:
              moment(lea.certifiedDate).format("MM/DD/YYYY") !== "Invalid date"
                ? moment(lea.certifiedDate).format("MM/DD/YYYY")
                : "",
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
        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  handleChange = async (perPage, page) => {
    this.setState({
      loading: true,
    });
    let data = {
      userId: this.state.userIdFilter,
      leaFirstName: this.state.leaFirstNameFilter,
      leaLastName: this.state.leaLastNameFilter,
      leaEmail: this.state.leaEmailFilter,
      organization: this.state.organizationFilter,
      state: this.state.stateFilter,
      itemsIssued: this.state.itemsIssuedFilter,
      inventoryDateTo: this.state.inventoryDateFilterTo,
      inventoryDateFrom: this.state.inventoryDateFilterFrom,
      certifiedDateTo: this.state.certifiedDateFilterTo,
      certifiedDateFrom: this.state.certifiedDateFilterFrom,
      params: {
        page: page,
        size: perPage,
      },
    };

    if (this.state.sort) {
      data.params["sort"] = this.state.sort;
    }

    this.userApiService
      .getLeaList(data)
      .then((response: any) => {
        let filteredRows = [];
        for (let lea of response.data.leaUserDetails) {
          let row = {
            userId: lea.userId,
            leaFirstName: lea.leaFirstName,
            leaLastName: lea.leaLastName,
            leaEmail: lea.leaEmail,
            organization: lea.organization,
            state: lea.state,
            itemsIssued: lea.itemsIssued,
            inventoryDate:
              moment(lea.inventoryDate).format("MM/DD/YYYY") !== "Invalid date"
                ? moment(lea.inventoryDate).format("MM/DD/YYYY")
                : "",
            certifiedDate:
              moment(lea.certifiedDate).format("MM/DD/YYYY") !== "Invalid date"
                ? moment(lea.certifiedDate).format("MM/DD/YYYY")
                : "",
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
        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
          currentPage: page,
          perPage: perPage,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  handleDownloadLea() {
    this.setState({
      loading: true,
    });
    let data = {
      userId: this.state.userIdFilter,
      leaFirstName: this.state.leaFirstNameFilter,
      leaLastName: this.state.leaLastNameFilter,
      leaEmail: this.state.leaEmailFilter,
      organization: this.state.organizationFilter,
      state: this.state.stateFilter,
      itemsIssued: this.state.itemsIssuedFilter,
      inventoryDateTo: this.state.inventoryDateFilterTo ? moment(moment(this.state.inventoryDateFilterTo).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      inventoryDateFrom: this.state.inventoryDateFilterFrom ? moment(moment(this.state.inventoryDateFilterFrom).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      certifiedDateTo: this.state.certifiedDateFilterTo ? moment(moment(this.state.certifiedDateFilterTo).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      certifiedDateFrom: this.state.certifiedDateFilterFrom ?  moment(moment(this.state.certifiedDateFilterFrom).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      params: {
          sort: this.state.sort,
      },
    };
    this.userApiService.downloadLeaUsersFile(data).then((response) => {
      let blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(blob);
      var a = document.createElement("a");
      a.setAttribute("download", "LeaUsers.xlsx");
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(link);
    });
  }

  handleSort = (sortBy) => {
    this.setState({
      loading: true,
    });
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;

    this.setState({ sort: sort });
    //Preserve search results while sorting
    let data = {
      userId: this.state.userIdFilter,
      leaFirstName: this.state.leaFirstNameFilter,
      leaLastName: this.state.leaLastNameFilter,
      leaEmail: this.state.leaEmailFilter,
      organization: this.state.organizationFilter,
      state: this.state.stateFilter,
      itemsIssued: this.state.itemsIssuedFilter,
      inventoryDateTo: this.state.inventoryDateFilterTo ? moment(moment(this.state.inventoryDateFilterTo).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      inventoryDateFrom: this.state.inventoryDateFilterFrom ? moment(moment(this.state.inventoryDateFilterFrom).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      certifiedDateTo: this.state.certifiedDateFilterTo ? moment(moment(this.state.certifiedDateFilterTo).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      certifiedDateFrom: this.state.certifiedDateFilterFrom ?  moment(moment(this.state.certifiedDateFilterFrom).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT00:00:00.000") : "",
      params: {
        page: 1,
        size: this.state.perPage,
        sort: sort,
      },
    };

    this.userApiService
      .getLeaList(data)
      .then((response: any) => {
        let filteredRows = [];
        for (let lea of response.data.leaUserDetails) {
          let row = {
            userId: lea.userId,
            leaFirstName: lea.leaFirstName,
            leaLastName: lea.leaLastName,
            leaEmail: lea.leaEmail,
            organization: lea.organization,
            state: lea.state,
            itemsIssued: lea.itemsIssued,
            inventoryDate:
              moment(lea.inventoryDate).format("MM/DD/YYYY") !== "Invalid date"
                ? moment(lea.inventoryDate).format("MM/DD/YYYY")
                : "",
            certifiedDate:
              moment(lea.certifiedDate).format("MM/DD/YYYY") !== "Invalid date"
                ? moment(lea.certifiedDate).format("MM/DD/YYYY")
                : "",
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
        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  columns = [
    {
      Header: "User Id",
      accessor: "userId",
    },
    {
      Header: "LEA First Name",
      accessor: "leaFirstName",
    },
    {
      Header: "LEA Last Name",
      accessor: "leaLastName",
    },
    {
      Header: "LEA Email",
      accessor: "leaEmail",
    },
    {
      Header: "Organization",
      accessor: "organization",
    },
    {
      Header: "State",
      accessor: "state",
    },
    {
      Header: "Items Issued",
      accessor: "itemsIssued",
    },
    {
      Header: "Last Inventory Date",
      accessor: "inventoryDate",
    },
    {
      Header: "LEA Certified Date",
      accessor: "certifiedDate",
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
                this.getLEASFromAPI(filters);
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
                this.getLEASFromAPI(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      id: "actions",
      Cell: (lea) => (
        <>
          <PPMSButton
            variant={"secondary"}
            label={"Edit/Upload Documents"}
            size={"sm"}
            className="manage-list-actions"
            icon={<MdEdit />}
            onPress={() => {
              PageHelper.openPage(
                Paths.editUser + "/" + lea.row.values.userId + "/" + true
              );
            }}
            id={`edit - ${lea.row.values.userId}`}
            isDisabled={false}
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  render() {
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Manage LEAS"}
          data={this.state.filteredItems}
          columns={this.columns}
          defaultSortField={"UserId"}
          loading={this.state.loading}
          serverSort={true}
          handleSort={(sortBy) => this.handleSort(sortBy)}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          isPaginationEnabled={true}
          onChange={this.handleChange}
          showFilters={true}
          currentPage={this.state.currentPage - 1}
          subHeaderComponent={
            <div className={"grid-row"}>
              <div className={"grid-col"}>
                <div className="btn-download-lea">
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"downloadList"}
                    label={"Download List"}
                    className={"create-property"}
                    onPress={() => this.handleDownloadLea()}
                    id={"download-list-btn"}
                  />
                </div>
              </div>
              <div className={"grid-col"}>
                <div className="btn-create-lea">
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"createLea"}
                    label={"Create New LEA"}
                    className={"create-property out-button"}
                    onPress={() => {
                      PageHelper.openPage(Paths.nuoRegistrationFI + "/" + true);
                    }}
                    id={"create-lea"}
                  />
                </div>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ManageLeaListPage);
