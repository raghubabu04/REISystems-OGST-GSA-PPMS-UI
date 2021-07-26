import React from "react";
import {MdEdit, MdLock, MdLockOpen, MdRemoveCircleOutline} from "react-icons/md";
import {users} from "../../../ui-kit/components/data/constants";
import {connect} from "react-redux";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import {UserUtils} from "../../../utils/UserUtils";
import {PageHelper, Paths} from "../../Router";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {bindActionCreators} from "redux";
import {addToast} from "../../../_redux/_actions/toast.actions";

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
  currentPage: number;
  showModal: boolean;
  showModalForDeactivatingGSAUsers: boolean;
  showModalForActivatingGSAUsers: boolean;
  permissions: string[];
  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  userId: String;
  emailId: string;
  statusId: number;
}

class SalesUserListPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 50,
      currentPage: 0,
      showModal: false,
      showModalForDeactivatingGSAUsers: false,
      showModalForActivatingGSAUsers: false,
      permissions: [],
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      userId: "",
      emailId: "",
      statusId: 0,
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  private userApiService = new UserApiService();

  async componentDidMount() {
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
    this.userApiService
      .getSalesUserList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.salesUserDetails
            ? response.data.salesUserDetails
            : [];
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.buildSalesUserDetails(filteredRows);
        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  /**
   * This method constructs role,zones salesuserdetails
   * @param filteredRows
   */
  buildSalesUserDetails = (filteredRows) => {
    return filteredRows.map((salesUserAccount) => {
      const roles = salesUserAccount.roles.map((role) => {
        return " " + role.roleName;
      });
      salesUserAccount.roles = roles.toString();
      salesUserAccount.zones = salesUserAccount.zones.toString();
      return salesUserAccount;
    });
  };

  handleChange = async (perPage, page) => {
    this.setState({ loading: true, currentPage: page });
    const data = {
      params: {
        page: page,
        size: perPage,
      },
    };
    this.userApiService
      .getSalesUserList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.salesUserDetails
            ? response.data.salesUserDetails
            : [];
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.buildSalesUserDetails(filteredRows);
        this.setState({
          loading: false,
          filteredItems: response.data.salesUserDetails,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: perPage,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  handleSort = (sortBy) => {
    // instead of setTimeout this is where to handle the API call.
    setTimeout(() => {}, 100);
  };

  handleButtonClick(event: any) {
    //TODO handle edit user button click
    console.log("edit");
    console.log(event);
  }

  onSearch(event: any) {
    this.setState({ filterText: event.target.value });
    this.setState({ filteredItems: this.filterData(event) });
  }

  onReset(event: any) {
    this.setState({ filterText: "" });
    this.setState({ filteredItems: users });
    this.setState({ paginationResetDefaultPage: true });
  }

  filterData(event: any) {
    return users.filter(
      (item) =>
        item.firstName &&
        item.firstName.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }

  getSalesUsersByFilters = (filters: any) => {
    let params: any = {};

    if (filters.userId) {
      params.userId = filters.userId;
    }

    if (filters.firstName) {
      params.fName = filters.firstName;
    }

    if (filters.lastName) {
      params.lName = filters.lastName;
    }

    if (filters.email) {
      params.email = filters.email;
    }

    if (filters.zones) {
      params.zones = filters.zones;
    }

    if (filters.roles) {
      params.roles = filters.roles;
    }

    if (filters.lastLoginDate) {
      params.lastLogin = filters.lastLoginDate;
    }

    if (filters.lastUserEdit) {
      params.lastEdit = filters.lastUserEdit;
    }

    params.page = 1;
    params.size = this.state.perPage;

    const data = { params };
    this.userApiService
      .getSalesUserList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.salesUserDetails
            ? response.data.salesUserDetails
            : [];
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.buildSalesUserDetails(filteredRows);
        this.setState({
          loading: false,
          filteredItems: response.data.salesUserDetails,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: this.state.perPage,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  handleActivateAndDeactivate = () => {
    const { addToast } = this.props.actions;
    let data;
    if(this.state.statusId === 10){
      data = {
        params: {
          emailId: this.state.emailId,
        },
        userStatus: {
          statusId: 10,
        },
      };
    } else if(this.state.statusId === 20) {
      data = {
        params: {
          emailId: this.state.emailId,
        },
        userStatus: {
          statusId: 20,
        },
      }
    }
    this.userApiService
      .lockAndUnLockSalesUser(data)
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({ loading: true });
          const data = {
            params: {
              page: this.state.currentPage,
              size: this.state.perPage,
            },
          };
          this.userApiService
            .getSalesUserList(data)
            .then((response: any) => {
              if(this.state.statusId === 10){
                addToast({
                  text: "User has been successfully Activated!",
                  type: "success",
                  heading: "Success",
                });
              } else if(this.state.statusId === 20){
                addToast({
                  text: "User has been successfully Deactivated!",
                  type: "success",
                  heading: "Success",
                });
              }
              let filteredRows =
                response &&
                response.data &&
                response.data.salesUserDetails
                  ? response.data.salesUserDetails
                  : [];
              let totalElements =
                response &&
                response.data &&
                response.data.totalElements
                  ? response.data.totalElements
                  : 0;
              let totalPages =
                response &&
                response.data &&
                response.data.totalPages
                  ? response.data.totalPages
                  : 0;
              this.buildSalesUserDetails(filteredRows);
              this.setState({
                loading: false,
                filteredItems: response.data.salesUserDetails,
                totalRows: totalElements,
                totalPages: totalPages,
                perPage: this.state.perPage,
              });
            })
            .catch((error) => {
              console.log(error);
              return error;
            });
        }
      })
      .catch((error) => {
        console.log(error);
        if(this.state.statusId === 10){
          addToast({
            text: "Unable to Activate User",
            type: "error",
            heading: "Error",
          });
        } else if(this.state.statusId === 20) {
          addToast({
            text: "Unable to Deactivate User",
            type: "error",
            heading: "Error",
          });
        }
        return error;
      });
    this.setState({
      showModalForActivatingGSAUsers: false,
      showModalForDeactivatingGSAUsers: false,
    })
  }

  handleSave = (event) => {
    const { addToast } = this.props.actions;
    let data = {
      params: {
        emailId: this.state.emailId,
      },
      userStatus: {
        statusId: 20,
      },
    };
    this.userApiService
      .lockAndUnLockSalesUser(data)
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({ loading: true });
          const data = {
            params: {
              page: this.state.currentPage,
              size: this.state.perPage,
            },
          };
          this.userApiService
            .getSalesUserList(data)
            .then((response: any) => {
              addToast({
                text: "Locked User Successfully!",
                type: "success",
                heading: "Success",
              });
              let filteredRows =
                response && response.data && response.data.salesUserDetails
                  ? response.data.salesUserDetails
                  : [];
              let totalElements =
                response && response.data && response.data.totalElements
                  ? response.data.totalElements
                  : 0;
              let totalPages =
                response && response.data && response.data.totalPages
                  ? response.data.totalPages
                  : 0;
              this.buildSalesUserDetails(filteredRows);
              this.setState({
                loading: false,
                filteredItems: response.data.salesUserDetails,
                totalRows: totalElements,
                totalPages: totalPages,
                perPage: this.state.perPage,
              });
            })
            .catch((error) => {
              console.log(error);
              return error;
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

  handleClose = (event) => {
    this.setState({
      showModal: false,
      showModalForActivatingGSAUsers: false,
      showModalForDeactivatingGSAUsers: false,
    });
  };

  showEditButton = (user) => {
    if (
      !(UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("SSA") ||
        UserUtils.getUserRoles().includes("SAI") ||
        UserUtils.getUserRoles().includes("FIA")
      )
    ) {
      return true;
    } else if (
      (UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("SSA") ||
        UserUtils.getUserRoles().includes("SAI") ||
      UserUtils.getUserRoles().includes("FIA")) &&
      user.data[user.row.id].status === "LOCKED"
    ) {
      if(user?.data[user?.row?.id].email?.toLowerCase().includes("gsa.gov")){
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  showActivateDeactivateButtonsForGSAUsers = (user) => {
    if(UserUtils.getUserRoles().includes("CO") ||
      UserUtils.isUserFleetAdmin() ||
      UserUtils.isUserPBSorDOIAdmin()) {
      if (user?.row?.values?.email?.toLowerCase().includes("gsa.gov")) {
        return (
          <>
            {user.data[user.row.id].status === "ACTIVE" ? (
              <PPMSButton
                isDisabled={false}
                variant={"secondary"}
                label={"Deactivate"}
                size={"sm"}
                icon={<MdRemoveCircleOutline/>}
                onPress={() => {
                  this.setState({
                    showModalForDeactivatingGSAUsers: true,
                    emailId: user?.row?.values?.email,
                    statusId: 20,
                  });
                }}
                id={"button-deactivate-" + user.row.values.userId}
              />
            ) : (
              <PPMSButton
                variant={"secondary"}
                isDisabled={false}
                label={"Activate"}
                size={"sm"}
                icon={<MdRemoveCircleOutline/>}
                onPress={() => {
                  this.setState({
                    showModalForActivatingGSAUsers: true,
                    emailId: user?.row?.values?.email,
                    statusId: 10,
                  });
                }}
                id={"button-activate-" + user.row.values.userId}
              />
            )}
          </>
        );
      }
    }
  };

  showLockUnlockButtons = (user) => {
    if (!user?.row?.values?.email?.toLowerCase().includes("gsa.gov")) {
      return (
        <>
          {user.data[user.row.id].status === "ACTIVE" ? (
            <PPMSButton
              isDisabled={
                !UserUtils.getUserRoles().includes("CO") &&
                !UserUtils.getUserRoles().includes("SAI") &&
                !UserUtils.getUserRoles().includes("FIA")
              }
              variant={"secondary"}
              label={"Lock"}
              className={"manage-list-actions"}
              size={"sm"}
              icon={<MdLock />}
              onPress={() => {
                this.setState({
                  showModal: true,
                  emailId: user?.row?.values?.email,
                });
              }}
              id={"button-lock-" + user.row.values.userId}
            />
          ) : (
            <PPMSButton
              variant={"secondary"}
              isDisabled={
                !UserUtils.getUserRoles().includes("CO") &&
                !UserUtils.getUserRoles().includes("SAI") &&
                !UserUtils.getUserRoles().includes("FIA")
              }
              label={"Unlock"}
              className={"manage-list-actions"}
              size={"sm"}
              icon={<MdLockOpen />}
              onPress={() => {
                const { addToast } = this.props.actions;
                let data = {
                  params: {
                    emailId: user?.row?.values?.email,
                  },
                  userStatus: {
                    statusId: 10,
                  },
                };
                this.userApiService
                  .lockAndUnLockSalesUser(data)
                  .then((resp) => {
                    if (resp.status === 200) {
                      this.setState({ loading: true });
                      const data = {
                        params: {
                          page: this.state.currentPage,
                          size: this.state.perPage,
                        },
                      };
                      this.userApiService
                        .getSalesUserList(data)
                        .then((response: any) => {
                          addToast({
                            text: "Unlocked User Successfully!",
                            type: "success",
                            heading: "Success",
                          });
                          let filteredRows =
                            response &&
                            response.data &&
                            response.data.salesUserDetails
                              ? response.data.salesUserDetails
                              : [];
                          let totalElements =
                            response &&
                            response.data &&
                            response.data.totalElements
                              ? response.data.totalElements
                              : 0;
                          let totalPages =
                            response &&
                            response.data &&
                            response.data.totalPages
                              ? response.data.totalPages
                              : 0;
                          this.buildSalesUserDetails(filteredRows);
                          this.setState({
                            loading: false,
                            filteredItems: response.data.salesUserDetails,
                            totalRows: totalElements,
                            totalPages: totalPages,
                            perPage: this.state.perPage,
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          return error;
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
              id={"button-unlock-" + user.row.values.userId}
            />
          )}
        </>
      );
    }
  };

  columns = [
    {
      Header: "User Id",
      accessor: "userId",
      width: 200,
    },
    {
      Header: "First Name",
      accessor: "firstName",
      width: 200,
    },
    {
      Header: "Last Name",
      accessor: "lastName",
      width: 200,
    },
    {
      Header: "Email",
      accessor: "email",
      width: 200,
    },
    {
      Header: "Zone(s)",
      accessor: "zones",
      width: 150,
    },
    {
      Header: "User Role(s)",
      accessor: "roles",
      width: 150,
    },
    {
      Header: "Last Login Date",
      accessor: "lastLoginDate",
      width: 150,
    },
    {
      Header: "Last User Edit",
      accessor: "lastUserEdit",
      width: 200,
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
                this.getSalesUsersByFilters(filter);
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
                this.getSalesUsersByFilters(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (user) => (
        <>
          <PPMSButton
            isDisabled={this.showEditButton(user)}
            variant={"secondary"}
            label={"Edit"}
            className={"manage-list-actions"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() => {
              PageHelper.openPage(
                Paths.salesUsers + "/" + user.row.values.userId
              );
            }}
            id={"button-edit-" + user.row.values.userId}
          />
          {this.showLockUnlockButtons(user)}
          {this.showActivateDeactivateButtonsForGSAUsers(user)}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  render() {
    const {statusId} = this.state;
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Manage Sales Users"}
          data={this.state.filteredItems}
          columns={this.columns}
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
          subHeaderComponent={
            <div className="grid-col-12">
              <PPMSButton
                isDisabled={
                  !(
                    UserUtils.getUserRoles().includes("CO") ||
                    UserUtils.getUserRoles().includes("SSA") ||
                    UserUtils.getUserRoles().includes("SAI") ||
                    UserUtils.getUserRoles().includes("FIA")
                  )
                }
                variant={"primary"}
                type={"button"}
                value={"addSalesUser"}
                label={"Add Sales User"}
                onPress={() => {
                  PageHelper.openPage(Paths.addSalesUser);
                }}
                id={"add-sales-user"}
                className={"out-button btn-create"}
              />
            </div>
          }
        />
        <PPMSModal
          body={"Are you sure you want to lock this user?"}
          id={"lock-user"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.handleSave.bind(this)}
          title={"Lock Sales User"}
          label={"Yes"}
          labelCancel={"Cancel"}
        />
        <PPMSModal
          body={ statusId === 10 ?
            "Are you sure you want to activate this user?" :
            "Are you sure you want to deactivate this user?"
          }
          id={"activate-deactivate-user"}
          show={ statusId === 10 ?
            this.state.showModalForActivatingGSAUsers :
            this.state.showModalForDeactivatingGSAUsers
          }
          handleClose={this.handleClose}
          handleSave={this.handleActivateAndDeactivate}
          title={ statusId === 10 ?
            "Activate Sales User":
            "Deactivate Sales User"
          }
          label={"Yes"}
          labelCancel={"Cancel"}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(SalesUserListPage);
