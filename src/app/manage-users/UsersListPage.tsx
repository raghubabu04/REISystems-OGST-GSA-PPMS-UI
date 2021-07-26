import React from "react";
import { MdEdit, MdLock, MdLockOpen, MdRemoveCircleOutline, MdRefresh} from "react-icons/md";
import { users } from "../../ui-kit/components/data/constants";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { UserApiService } from "../../api-kit/user/user-api.service";
import { UserUtils } from "../../utils/UserUtils";
import { PageHelper, Paths } from "../Router";
import { formatPhone } from "../../ui-kit/utilities/FormatUtil";
import PPMSDatatable from "../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSModal } from "../../ui-kit/components/common/PPMS-modal";
import { bindActionCreators } from "redux";
import { addToast } from "../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { PPMSSelect } from "../../ui-kit/components/common/select/PPMS-select";
import { apoUserFilterOptions } from "./Constants";
import queryString from "query-string";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
}

interface State {
  filterText: string;
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  showModal: boolean;
  showModalDeactivate: boolean;
  showModalActivate: boolean;
  statusId: number;
  permissions: string[];
  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  userId: string;
  emailId: string;
  sort: string;
  showAPOFilterValues?: any;
  myTerritory?: boolean;
  defaultFilterValue?: any;
  currentPage: number;
  userListResults?: any;
  firstName?: string;
  lastName?: string;
  email?: string;
  aacOrAgencyBureau?: string;
  granterFullName?: string;
  role?: string;
  lastLoginDate?: string;
}

class UsersListPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    let search = props.location.search;
    let query = queryString.parse(search);
    let showMyUsers = query["myTerritory"] ? query["myTerritory"] : "all";
    let showUserRadio;
    switch (showMyUsers) {
      case "all":
        showUserRadio = "Show all users";
        break;
      case "myTerritory":
        showUserRadio = "Show users under my Territory";
        break;
      default:
        showUserRadio = "Show users under my Territory";
        break;
    }
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      showModal: false,
      showModalDeactivate: false,
      showModalActivate: false,
      statusId: 0,
      permissions: [],
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      myTerritory: true,
      showAPOFilterValues: apoUserFilterOptions,
      defaultFilterValue: showUserRadio,
      currentPage: 1,
      sort: "lastName,ASC",
      firstName: "",
      lastName: "",
      email: "",
      aacOrAgencyBureau: "",
      granterFullName: "",
      role: "",
      lastLoginDate: "",
      userId: "",
      emailId: "",
    };
    this.state.showAPOFilterValues.forEach((item) => {
      item["isSelected"] = item.value === showUserRadio;
    });

    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.addFilterFields = this.addFilterFields.bind(this);
  }

  private userApiService = new UserApiService();

  async componentDidMount() {
    let query = queryString.parse(this.props.location.search);
    let newUsers = query["newUsers"] ? true : false;
    if (UserUtils.isUserApo()) {
      PageHelper.openPage(Paths.usersList + "?myTerritory=" + "true");
    }
    const { perPage } = this.state;
    this.setState({
      loading: true,
      permissions: UserUtils.getUserPermissions(),
    });
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    if (UserUtils.isUserApo()) {
      data.params["myTerritory"] = true;
      data.params["newUsers"] = newUsers;
    }
    this.loadUserListOnPageLoad(data);
  }

  /**
   * This method constructs role,aacCode,agencyBureau in userdetails
   * @param filteredRows
   */
  buildUserDetails = (filteredRows) => {
    return filteredRows.map((userAccount) => {
      const roles = userAccount.permissions.map((permission) => {
        return " " + permission;
      });

      const userAccountId = userAccount.userAccountIds.map((userAccountId) => {
        return " " + userAccountId;
      });

      userAccount.role = roles.toString();
      userAccount.accountId = userAccountId.toString();
      userAccount.formattedPhoneNumber = formatPhone(
        userAccount.phoneNumber + ""
      );
      userAccount.aacAndAgencyBureau = `${
        userAccount.primaryAACAndAgencyBureau.aac
          ? userAccount.primaryAACAndAgencyBureau.aac
          : ""
      }
        - ${userAccount.primaryAACAndAgencyBureau.agencyBureau}`;

      userAccount.aoFullName = `${
        userAccount.aoFirstName ? userAccount.aoFirstName : ""
      }  ${userAccount.aoLastName ? userAccount.aoLastName : ""}`;
      userAccount.granterFullName = `${
        userAccount.granterFirstName ? userAccount.granterFirstName : ""
      }  ${userAccount.granterLastName ? userAccount.granterLastName : ""}`;
      return userAccount;
    });
  };

  addFilterFields = (data) => {
    if (this.state.userId) data.params["userAccountId"] = this.state.userId;
    if (this.state.firstName) data.params["firstName"] = this.state.firstName;
    if (this.state.lastName) data.params["lastName"] = this.state.lastName;
    if (this.state.email) data.params["email"] = this.state.email;
    if (this.state.aacOrAgencyBureau)
      data.params["aacAndAgencyBureau"] = this.state.aacOrAgencyBureau;
    if (this.state.granterFullName)
      data.params["granterName"] = this.state.granterFullName;
    if (this.state.role) data.params["permissions"] = this.state.role;
    if (this.state.lastLoginDate)
      data.params["lastLogin"] = this.state.lastLoginDate;
    if (UserUtils.isUserApo()) {
      data.params["myTerritory"] = this.state.myTerritory;
    }
    return data;
  };

  handleChange = async (perPage, page) => {
    this.setState({ loading: true });
    let query = queryString.parse(this.props.location.search);
    let newUsers = query["newUsers"] ? true : false;
    const data = {
      params: {
        page: page,
        size: perPage,
      },
    };
    if (UserUtils.isUserApo()) {
      data.params["myTerritory"] = this.state.myTerritory;
      data.params["newUsers"] = newUsers;
    }
    if (this.state.sort) {
      data.params["sort"] = this.state.sort;
    }
    this.addFilterFields(data);
    this.loadUserListOnPageLoad(data);
    this.setState({ perPage: perPage, currentPage: page });
  };

  handleSort = (sortBy) => {
    this.setState({ loading: true });
    let query = queryString.parse(this.props.location.search);
    let newUsers = query["newUsers"] ? true : false;
    let sort = "";
    let order;
    if (sortBy) !sortBy.desc ? (order = "ASC") : (order = "DESC");
    if (order) sort = sortBy?.id + "," + order;
    this.setState({ sort: sort });
    const data = {
      params: {
        page: 1,
        size: this.state.perPage,
        sort: sort,
      },
    };
    if (UserUtils.isUserApo()) {
      data.params["myTerritory"] = true;
      data.params["newUsers"] = newUsers;
    }
    this.addFilterFields(data);
    this.loadUserListOnPageLoad(data);
  };

  onSearch(event: any) {
    this.setState({ filterText: event.target.value });
    this.setState({ filteredItems: this.filterData(event) });
  }

  onReset() {
    this.setState({ filterText: "" });
    this.setState({ filteredItems: users });
    this.setState({ paginationResetDefaultPage: true });
  }

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (nextProps.location.search !== this.props.location.search) {
      let search = nextProps.location.search;
      let query = queryString.parse(search);
      let showMyUsers = query["myTerritory"] ? query["myTerritory"] : "all";

      let showUserRadio;
      switch (showMyUsers) {
        case "all":
          showUserRadio = "Show all users";
          break;
        case "myTerritory":
          showUserRadio = "Show users under my Territory";
          break;
        default:
          showUserRadio = "Show users under my Territory";
          break;
      }

      this.state.showAPOFilterValues.forEach((item) => {
        item["isSelected"] = item.value === showUserRadio;
      });

      if (!query["myTerritory"]) {
        this.setState({
          defaultFilterValue: showUserRadio,
        });
      }
    }
  }

  filterData(event: any) {
    return users.filter(
      (item) =>
        item.firstName &&
        item.firstName.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }

  handleActivateAndDeactivate = () => {
    let id = this.state.statusId;
    let data = {
      params: {
        emailId: this.state.emailId,
      },
      userStatus: {
        statusId: id,
      },
    };
    const { addToast } = this.props.actions;
    this.userApiService
      .lockAndUnLockUser(data)
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({ loading: true });
          const innerData = {
            params: {
              page: 1,
              size: this.state.perPage,
            },
          };
          this.loadUserListOnPageLoad(innerData);
          if(id === 10){
            addToast({
              text: "User has been successfully Activated",
              type: "success",
              heading: "Success",
            });
          } else if(id === 20){
            addToast({
              text: "User has been successfully deactivated",
              type: "success",
              heading: "Success",
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        if(id === 10){
          addToast({
            text: "Unable to Activate User",
            type: "error",
            heading: "Error",
          });
        } else if(id === 20){
          addToast({
            text: "Unable to deactivate User",
            type: "error",
            heading: "Error",
          });
        }
        return error;
      });
    this.setState({
      showModalActivate: false,
      showModalDeactivate: false,
    })
  }

  handleSave = () => {
    let data = {
      params: {
        emailId: this.state.emailId,
      },
      userStatus: {
        statusId: 20,
      },
    };
    const { addToast } = this.props.actions;
    this.userApiService
      .lockAndUnLockUser(data)
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({ loading: true });
          const innerData = {
            params: {
              page: 1,
              size: this.state.perPage,
            },
          };
          this.loadUserListOnPageLoad(innerData);
          addToast({
            text: "User Locked Successfully!",
            type: "success",
            heading: "Success",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: "Unable to Lock User",
          type: "error",
          heading: "Error",
        });
        return error;
      });
    this.setState({
      showModal: false,
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
      showModalDeactivate: false,
      showModalActivate: false,
    });
  };

  showResetPassword = (user) => {
    if (
      !user.data[user.row.id].email?.toLowerCase().includes("gsa.gov") &&
      user.data[user.row.id].userStatus === "ACTIVE"
    ) {
      return (
        <>
          <PPMSButton
            variant={"secondary"}
            label={"Reset Password"}
            size={"sm"}
            className={"manage-list-actions"}
            icon={<MdRefresh />}
            onPress={() => {
              const { addToast } = this.props.actions;
              this.userApiService
                .resetPasswordAndNotify(user.data[user.row.id].email)
                .then((resp) => {
                  if (resp.status === 200) {
                    addToast({
                      text: "Password Reset Successfully",
                      type: "success",
                      heading: "Success",
                    });
                  }
                });
            }}
            isDisabled={false}
            id={"reset-password-" + user.data[user.row.id].userId}
          />
        </>
      );
    }
  };

  getManageUsersByFilters = (filters: any) => {
    let params: any = {};

    if (filters.accountId) {
      params.accountId = filters.accountId;
    }

    if (filters.firstName) {
      params.firstName = filters.firstName;
    }

    if (filters.lastName) {
      params.lastName = filters.lastName;
    }

    if (filters.email) {
      params.email = filters.email;
    }

    if (filters.aacAndAgencyBureau) {
      params.aacOrAgencyBureau = filters.aacAndAgencyBureau;
    }

    if (filters.granterFullName) {
      params.granterName = filters.granterFullName;
    }

    if (filters.role) {
      params.permissions = filters.role;
    }

    if (filters.lastLogin) {
      params.lastLogin = filters.lastLogin;
    }

    if (this.state.sort) {
      params.sort = this.state.sort;
    }

    params.page = 1;
    params.size = this.state.perPage;

    const data = { params };
    this.setState({
      userId: params.userAccountId ? params.userAccountId : "",
      firstName: params.firstName ? params.firstName : "",
      lastName: params.lastName ? params.lastName : "",
      email: params.email ? params.email : "",
      aacOrAgencyBureau: params.aacAndAgencyBureau
        ? params.aacAndAgencyBureau
        : "",
      granterFullName: params.granterName ? params.granterName : "",
      role: params.permissions ? params.permissions : "",
      lastLoginDate: params.lastLogin ? params.lastLogin : "",
    });
    this.loadUserListOnPageLoad(data);
  };

  showLockUnlockButtons = (user) => {
    if (!UserUtils.isUserHelpDesk()) {
      if (!user.data[user.row.id].email?.toLowerCase().includes("gsa.gov")) {
        return (
          <>
            {user.data[user.row.id].userStatus === "ACTIVE" ? (
              <PPMSButton
                variant={"secondary"}
                label={"Lock"}
                size={"sm"}
                className={"manage-list-actions"}
                icon={<MdLock />}
                onPress={() => {
                  this.setState({
                    showModal: true,
                    emailId: user.data[user.row.id].email,
                  });
                }}
                id={"lock-" + user.data[user.row.id].userId}
              />
            ) : (
              <PPMSButton
                variant={"secondary"}
                label={"Unlock"}
                size={"sm"}
                className={"manage-list-actions"}
                icon={<MdLockOpen />}
                onPress={() => {
                  let data = {
                    params: {
                      emailId: user.data[user.row.id].email,
                    },
                    userStatus: {
                      statusId: 10,
                    },
                  };
                  const { addToast } = this.props.actions;
                  this.userApiService
                    .lockAndUnLockUser(data)
                    .then((resp) => {
                      if (resp.status === 200) {
                        this.setState({ loading: true });
                        const innerData = {
                          params: {
                            page: 1,
                            size: this.state.perPage,
                          },
                        };
                        this.loadUserListOnPageLoad(innerData);
                        addToast({
                          text: "User Unlocked Successfully!",
                          type: "success",
                          heading: "Success",
                        });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      addToast({
                        text: "Unable to Unlock User",
                        type: "error",
                        heading: "Error",
                      });
                      return error;
                    });
                }}
                isDisabled={false}
                id={"unlock-" + user.data[user.row.id].userId}
              />
            )}
          </>
        );
      } else {
        if(UserUtils.isSystemAdminUser() || UserUtils.isUserApo()) {
          return (
            <>
              {user.data[user.row.id].userStatus === "ACTIVE" ? (
                <PPMSButton
                  variant={"secondary"}
                  label={"Deactivate"}
                  size={"sm"}
                  className={"manage-list-actions"}
                  icon={<MdRemoveCircleOutline/>}
                  onPress={() => {
                    this.setState({
                      showModalDeactivate: true,
                      emailId: user.data[user.row.id].email,
                      statusId: 20,
                    });
                  }}
                  id={"deactivate-" + user.data[user.row.id].userId}
                />
              ) : (
                <PPMSButton
                  variant={"secondary"}
                  label={"Activate"}
                  size={"sm"}
                  className={"manage-list-actions"}
                  icon={<MdRemoveCircleOutline/>}
                  onPress={() => {
                    this.setState({
                      showModalActivate: true,
                      emailId: user.data[user.row.id].email,
                      statusId: 10,
                    })
                  }}
                  isDisabled={false}
                  id={"activate-" + user.data[user.row.id].userId}
                />
              )}
            </>
          );
        }
      }
    }
  };

  setShowUserParam(filterValue): boolean {
    let value = filterValue === "show-users-under-my-territory";
    this.setState({
      myTerritory: value,
    });
    return value;
  }

  handleAPOUserRadioChange(event: any) {
    let startValue = event.target.options[event.target.selectedIndex].id;
    this.setState({
      defaultFilterValue: startValue,
    });
    this.refreshUserTableFromFilterChange(startValue);
  }

  refreshUserTableFromFilterChange(filterValue) {
    let showUser = this.setShowUserParam(filterValue);

    PageHelper.openPage(Paths.usersList + "?myTerritory=" + showUser);
    const { perPage } = this.state;
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    if (UserUtils.isUserApo()) {
      data.params["myTerritory"] = showUser;
    }
    this.loadUserListOnPageLoad(data);
  }

  loadUserListOnPageLoad(data) {
    this.userApiService
      .getUserList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.userDetails
            ? response.data.userDetails
            : [];
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.buildUserDetails(filteredRows);
        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
          perPage: this.state.perPage,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  showAPOFilter() {
    if (UserUtils.isUserApo()) {
      return (
        <>
          <div className={"grid-col-3"}>
            <div className="ui-ppms">
              <PPMSSelect
                id={"filter-by-user"}
                selectName={"apoUserFilterOptions"}
                values={this.state.showAPOFilterValues}
                selectedValue={this.state.defaultFilterValue}
                onChange={this.handleAPOUserRadioChange.bind(this)}
                isValid={false}
                isInvalid={false}
                validationMessage={""}
                identifierKey={"id"}
                identifierValue={"value"}
                label={"Filter by Territory:"}
                isRequired={false}
                selectClass={"inventory"}
              />
            </div>
          </div>
        </>
      );
    }
  }

  showAddUserButton() {
    if (UserUtils.isUserApo()) {
      return (
        <>
          <PPMSButton
            variant={"primary"}
            type={"button"}
            value={"addApoUser"}
            label={"Add User"}
            onPress={() => {
              PageHelper.openPage(Paths.nuoRegistration);
            }}
            id={"add-user"}
            className={"out-button btn-create"}
          />
        </>
      );
    } else if (!UserUtils.isUserHelpDesk()) {
      return (
        <>
          <PPMSButton
            variant={"primary"}
            type={"button"}
            value={"addUNDUser"}
            label={"Add User"}
            onPress={() => {
              PageHelper.openPage(Paths.nuoRegistration);
            }}
            id={"add-user"}
            className={"out-button btn-create"}
          />
        </>
      );
    }
  }

  columns = [
    {
      Header: "User Id",
      accessor: "accountId",
    },
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "AAC/Agency Bureau",
      accessor: "aacAndAgencyBureau",
      disableSortBy: true,
    },
    {
      Header: "Granter Name",
      accessor: "granterFullName",
    },
    {
      Header: "Role",
      accessor: "role",
      disableSortBy: true,
    },
    {
      Header: "Last Login Date",
      accessor: "lastLogin",
      disableSortBy: true,
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
                let filter = {};
                columns.columns.forEach((column) => {
                  filter[column.id] = column["filterValue"];
                });
                this.getManageUsersByFilters(filter);
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
                this.getManageUsersByFilters(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (user) => (
        <>
          <PPMSButton
            variant={"secondary"}
            label={"Edit"}
            size={"sm"}
            className={"manage-list-actions"}
            icon={<MdEdit />}
            onPress={() => {
              PageHelper.openPage(
                Paths.editUserPage + "/" + user.data[user.row.id].userId
              );
            }}
            isDisabled={false}
            id={"edit-" + user.data[user.row.id].userId}
          />
          {this.showLockUnlockButtons(user)}
          {this.showResetPassword(user)}
          
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableSortBy: true,
    },
  ];

  render() {
    const {statusId} = this.state;
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Manage Users"}
          data={this.state.filteredItems}
          columns={this.columns}
          serverSort={true}
          defaultSortField={"lastName"}
          loading={this.state.loading}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          isPaginationEnabled={true}
          onChange={this.handleChange}
          handleSort={(sortBy) => this.handleSort(sortBy)}
          showFilters={true}
          currentPage={this.state.currentPage - 1}
          subHeaderComponent={
            <div className={"grid-row"}>
              {this.showAPOFilter()}

              <div className="grid-col-12">{this.showAddUserButton()}</div>
            </div>
          }
        />
        <PPMSModal
          body={"Are you sure you want to lock this user?"}
          id={"lock-user"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.handleSave.bind(this)}
          title={"Lock User"}
          label={"Yes"}
          labelCancel={"Cancel"}
        />

        <PPMSModal
          body={statusId === 20 ?
            "Are you sure you want to deactivate this user?" :
            "Are you sure you want to activate this user?"
          }
          id={"activate-deactivate-user"}
          show={statusId === 20 ?
            this.state.showModalDeactivate :
            this.state.showModalActivate
          }
          handleClose={this.handleClose}
          handleSave={this.handleActivateAndDeactivate}
          title={statusId === 20 ?
            "Deactivate User" :
            "Activate User"
          }
          label={"Yes"}
          labelCancel={"Cancel"}
        />

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = () => ({});
export default connect(mapStateToProps, mapDispatchToProps)(UsersListPage);
