import React from "react";
import {MdEdit, MdLock, MdLockOpen} from "react-icons/md";
import {bindActionCreators} from "redux";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {formatPhone} from "../../../ui-kit/utilities/FormatUtil";
import {users} from "../../../ui-kit/components/data/constants";
import {UserUtils} from "../../../utils/UserUtils";
import {connect} from "react-redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import _ from "lodash";
import {PageHelper, Paths} from "../../Router";
import {BsFillFlagFill} from "react-icons/bs";
import {PPMSPopover} from "../../../ui-kit/components/common/PPMS-popover";

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
  permissions: string[];
  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  userId: String;
  emailId: string;
  sort: string;
  disableBtn: boolean;
  bidderUserName: string;
}

class ManageBidderListPage extends React.Component<Props, State> {
  getLabel(user): string | Element {
    if (
      ((UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("FIA") ||
        UserUtils.getUserRoles().includes("FIN")) &&
        user.row.values.status.toUpperCase() === "ACTIVE") ||
      ((UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("FIA") ||
        UserUtils.getUserRoles().includes("FIN")) &&
        user.row.values.status.toUpperCase() === "LOCKED")
    ) {
      return "Edit";
    } else if (
      (UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("FIA") ||
        UserUtils.getUserRoles().includes("FIN")) &&
      user.row.values.status.toUpperCase() === "PENDING"
    ) {
      return "Review";
    } else {
      return "View";
    }
  }

  isDisabled(user) {
    const status = user.data[user.row.id].status;
    return !(status.toUpperCase() === "ACTIVE");
  }

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
      permissions: [],
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      userId: "",
      emailId: "",
      sort: "userName,ASC",
      disableBtn: false,
      bidderUserName: "",
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  handleButtonClick(event: any) {
    console.log("edit");
    console.log(event);
  }

  onSearch(event: any) {
    this.setState({ filterText: event.target.value });
    this.setState({ filteredItems: this.filterData(event) });
  }

  onReset() {
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

  showLockUnlockButtons(user: any) {
    const status = user.data[user.row.id].status;
    const userName = user.data[user.row.id].userName;
    if (
      (UserUtils.getUserRoles().includes("CO") ||
        UserUtils.getUserRoles().includes("FIA") ||
        UserUtils.getUserRoles().includes("FIN")) &&
      !(user.data[user.row.id].status.toUpperCase() === "PENDING")
    ) {
      return (
        <>
          {status.toUpperCase() === "ACTIVE" ? (
            <PPMSButton
              variant={"secondary"}
              isDisabled={this.state.disableBtn}
              label={"Lock"}
              className={"manage-list-actions"}
              size={"sm"}
              icon={<MdLock />}
              onPress={() => {
                this.setState({
                  showModal: true,
                  emailId: user?.row?.values?.email,
                  bidderUserName: userName,
                });
              }}
              id={"lock-" + userName}
            />
          ) : (
            <PPMSButton
              variant={"secondary"}
              isDisabled={this.state.disableBtn}
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
                  bidderUserName: this.state.bidderUserName,
                };
                this.setState({ disableBtn: true });
                this.userApiService
                  .lockAndUnLockBidderUser(data)
                  .then((resp) => {
                    if (resp.status === 200) {
                      this.setState({ loading: true, disableBtn: false });
                      const data = {
                        params: {
                          page: this.state.currentPage,
                          size: this.state.perPage,
                          sort: this.state.sort,
                        },
                      };
                      this.userApiService
                        .getManageBiddersList(data)
                        .then((response: any) => {
                          addToast({
                            text: "Unlocked User Successfully!",
                            type: "success",
                            heading: "Success",
                          });
                          let filteredRows =
                            response &&
                            response.data &&
                            response.data.manageBiddersList
                              ? response.data.manageBiddersList
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
                          this.setState({
                            loading: false,
                            filteredItems: filteredRows,
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
              id={"unlock-" + userName}
            />
          )}
        </>
      );
    }
  }

  handleSave = () => {
    const { addToast } = this.props.actions;
    let data = {
      params: {
        emailId: this.state.emailId,
      },
      userStatus: {
        statusId: 20,
      },
      bidderUserName: this.state.bidderUserName,
    };
    this.setState({ disableBtn: true });
    this.userApiService
      .lockAndUnLockBidderUser(data)
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({ loading: true, disableBtn: false });
          const data = {
            params: {
              page: this.state.currentPage,
              size: this.state.perPage,
              sort: this.state.sort,
            },
          };
          this.userApiService
            .getManageBiddersList(data)
            .then((response: any) => {
              addToast({
                text: "Locked User Successfully!",
                type: "success",
                heading: "Success",
              });
              let filteredRows =
                response && response.data && response.data.manageBiddersList
                  ? response.data.manageBiddersList
                  : [];
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
                filteredItems: filteredRows,
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
        this.setState({ disableBtn: false });
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
    });
  };

  getManageBiddersByFilters = (filters: any) => {
    const data = {
      firstName: filters.firstName,
      lastName: filters.lastName,
      email: filters.email,
      userName: filters.userName,
      phoneNumber: filters.phoneNumber
        ? filters.phoneNumber.replace(/[^\d]/gi, "")
        : filters.phoneNumber,
      registrationType: filters.registrationType,
      status: filters.status,
      params: {
        page: 1,
        size: this.state.perPage,
      },
    };
    this.fetchBidderAPICall(data);
  };

  getFetchEditButtonPage(user) {
    if (this.getLabel(user) === "Review" || this.getLabel(user) === "Edit") {
      PageHelper.openPage(Paths.editBidder + "/" + user.row.values.userName);
    } else {
      PageHelper.openPage(Paths.viewBidder + "/" + user.row.values.userName);
    }
  }

  fetchBidderAPICall(data) {
    this.userApiService
      .getManageBiddersList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.manageBiddersList
            ? response.data.manageBiddersList
            : [];
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
        return error;
      });
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
    this.fetchBidderAPICall(data);
  }

  handleChange = async (perPage, page) => {
    this.setState({ loading: true, currentPage: page });
    const data = {
      params: {
        page: page,
        size: perPage,
        sort: this.state.sort,
      },
    };
    this.fetchBidderAPICall(data);
  };

  showResetPasswordButton = (user) => {
    if (
      !user.data[user.row.id].email?.toLowerCase().includes("gsa.gov") &&
      UserUtils.getUserRoles().includes("CO") &&
      user.data[user.row.id].status.toUpperCase() === "ACTIVE"
    ) {
      return (
        <>
          <PPMSButton
            variant={"secondary"}
            label={"Reset Password"}
            className={"manage-list-actions"}
            size={"sm"}
            onPress={() => {
              const { addToast } = this.props.actions;
              this.userApiService
                .resetPasswordAndNotify(user?.row?.values?.email)
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
            id={"reset-password-" + user?.row?.values?.userId}
          />
        </>
      );
    }
  };

  showMarkAsDefaultButton = (user) => {
    let roles: string[] = UserUtils.getUserRoles();
    if (
      roles.includes("SCO") &&
      user.data[user.row.id].status.toUpperCase() === "ACTIVE"
    ) {
      return (
        <PPMSButton
          variant={"secondary"}
          label={"Mark as Default"}
          size={"sm"}
          onPress={() => this.onClickAction(user.row.values)}
          id={"markAsDefault-" + user.row.values.salesNumber}
        />
      );
    }
  };

  handleSort = (sortBy) => {
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) {
      sort = sortBy?.id + "," + order;
    }
    this.setState({
      sort: sort,
    });
    let params: any = {
      page: 1,
      size: this.state.perPage,
    };
    if (sort) {
      params.sort = sort;
    }
    setTimeout(() => {
      this.fetchBidderAPICall({ params });
    }, 100);
  };

  columns = [
    {
      Header: "User Name",
      accessor: "userName",
      Cell: (user) => {
        let iconStyles = {
          color: "#f05454",
          fontSize: "1.3em",
          cursor: "pointer",
        };
        return (
          <>
            {user.row.values.status === "Default" ? (
              <>
                <button
                  className="manageRed"
                  onClick={() => {
                    this.getFetchEditButtonPage(user);
                  }}
                >
                  <span className="redColor">{user.value}</span>
                </button>
                <PPMSPopover
                  trigger={["hover"]}
                  id={"icn-prop=type-description"}
                  placement={"right"}
                  popoverTitle={"Note"}
                  popoverContent={<>{"Defaulted"}</>}
                  triggerSource={
                    <button
                      id={`prop-type-tooltip-button`}
                      type={"button"}
                      className={"usa-button  usa-button--unstyled"}
                    >
                      <BsFillFlagFill style={iconStyles} />
                    </button>
                  }
                />
              </>
            ) : (
              <a
                href={Paths.viewBidder + "/" + user.row.values.userName}
                // onClick={() => {
                //   this.getFetchEditButtonPage(user);
                // }}
              >
                {user.value}
              </a>
            )}
          </>
        );
      },
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
      Header: "Phone Number",
      accessor: "phoneNumber",
      Cell: (phone) => {
        return <>{formatPhone(phone.value ? phone.value + "" : "")} </>;
      },
    },
    {
      Header: "Registration Type",
      accessor: "registrationType",
      Cell: (user) => {
        return <>{_.capitalize(user.value)}</>;
      },
    },
    {
      Header: "User Status",
      accessor: "status",
      Cell: (user) => {
        return <>{_.capitalize(user.value)}</>;
      },
    },
    {
      Header: "Actions",
      width: "200",
      ApplyFilter: (columns) => {
        return (
          <>
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filter = {};
                columns.columns.forEach((column) => {
                  filter[column.id] = column["filterValue"];
                });
                this.getManageBiddersByFilters(filter);
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
                this.getManageBiddersByFilters(filters);
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
            label={this.getLabel(user)}
            className={"manage-list-actions"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() => {
              this.getFetchEditButtonPage(user);
            }}
            isDisabled={false}
            id={"edit-" + user.row.values.userName}
          />
          {this.showResetPasswordButton(user)}
          {this.showLockUnlockButtons(user)}
          {this.showMarkAsDefaultButton(user)}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableSortBy: true,
    },
  ];

  onClickAction = (userInfo) => {
    PageHelper.openPage(Paths.defaultBidder + `/${userInfo.userName}`);
  };

  render() {
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Manage Bidders"}
          data={this.state.filteredItems}
          columns={this.columns}
          defaultSortField={"userName"}
          loading={this.state.loading}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          isPaginationEnabled={true}
          onChange={this.handleChange}
          handleSort={(sortBy) => this.handleSort(sortBy)}
          showFilters={true}
          serverSort={true}
        />
        <PPMSModal
          body={"Are you sure you want to lock this user?"}
          id={"lock-user"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.handleSave.bind(this)}
          title={"Lock Bidder User"}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageBidderListPage);
