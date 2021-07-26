import React from "react";
import {MdEdit} from "react-icons/md";
import {users} from "../../../ui-kit/components/data/constants";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {UserApiService} from "../../../api-kit/user/user-api.service";
import {UserUtils} from "../../../utils/UserUtils";
import {PageHelper, Paths} from "../../Router";
import {formatPhone} from "../../../ui-kit/utilities/FormatUtil";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {bindActionCreators} from "redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {connect} from "react-redux";

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
  permissions: string[];
  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  userId: String;
  emailId: string;
}

class PropertyCustodianUserListPage extends React.Component<Props, State> {
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
      showModal: false,
      permissions: [],
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      userId: "",
      emailId: "",
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  private userApiService = new UserApiService();

  async componentDidMount() {
    const {perPage} = this.state;
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
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
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
      const aacCodes = userAccount.aacAndAgencyBureaus.map(
        (aacAndAgencyBureau) => {
          return " " + aacAndAgencyBureau.aac;
        }
      );
      userAccount.aac = aacCodes.toString();
      const agencyBureaus = userAccount.aacAndAgencyBureaus.map(
        (aacAndAgencyBureau) => {
          return " " + aacAndAgencyBureau.agencyBureau;
        }
      );
      userAccount.role = roles.toString();
      userAccount.formattedPhoneNumber = formatPhone(
        userAccount.phoneNumber + ""
      );
      userAccount.agencyBureau = agencyBureaus.toString();
      userAccount.aoFullName = `${
        userAccount.aoFirstName ? userAccount.aoFirstName : ""
      }  ${userAccount.aoLastName ? userAccount.aoLastName : ""}`;
      userAccount.granterFullName = `${
        userAccount.granterFirstName ? userAccount.granterFirstName : ""
      }  ${userAccount.granterLastName ? userAccount.granterLastName : ""}`;
      return userAccount;
    });
  };

  handleChange = async (perPage, page) => {
    this.setState({loading: true});
    const data = {
      params: {
        page: page,
        size: perPage,
      },
    };
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
          loading: false,
          filteredItems: response.data.userDetails,
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
    setTimeout(() => {
    }, 100);
  };

  handleButtonClick(event: any) {
    //TODO handle edit user button click
    console.log("edit");
    console.log(event);
  }

  onSearch(event: any) {
    this.setState({filterText: event.target.value});
    this.setState({filteredItems: this.filterData(event)});
  }

  onReset(event: any) {
    this.setState({filterText: ""});
    this.setState({filteredItems: users});
    this.setState({paginationResetDefaultPage: true});
  }

  filterData(event: any) {
    return users.filter(
      (item) =>
        item.firstName &&
        item.firstName.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }

  handleSave = (event) => {
    let data = {
      params: {
        emailId: this.state.emailId,
      },
      userStatus: {
        statusId: 20,
      },
    };
    this.userApiService.lockAndUnLockUser(data).then((resp) => {
      if (resp.status === 200) {
        this.setState({loading: true});
        const data = {
          params: {
            page: 1,
            size: this.state.perPage,
          },
        };
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
              loading: false,
              filteredItems: response.data.userDetails,
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
    });
    this.setState({
      showModal: false,
    });
  };

  handleClose = (event) => {
    this.setState({
      showModal: false,
    });
  };

  getManageUsersByFilters = (filters: any) => {
    let params: any = {};

    if (filters.userAccountId) {
      params.userAccountId = filters.userAccountId;
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

    if (filters.agencyBureau) {
      params.aacAndAgencyBureaus = filters.agencyBureau;
    }

    if (filters.aac) {
      params.primaryAACAndAgencyBureau = filters.aac;
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

    params.page = 1;
    params.size = this.state.perPage;

    const data = {params};
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
          loading: false,
          filteredItems: response.data.userDetails,
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


  columns = [
    {
      Header: "User Id",
      accessor: "userAccountId",
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
      Header: "Agency Bureau",
      accessor: "agencyBureau",
      disableSortBy: true,
    },
    {
      Header: "AAC",
      accessor: "aac",
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
    },
    {
      Header: "Actions",
      // accessor: "userStatus",
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
            icon={<MdEdit/>}
            onPress={() => {
              PageHelper.openPage(
                Paths.editUser + "/" + user.row.values.userAccountId
              );
            }}
            // isDisabled={this.disableButton(user)}
            isDisabled={false}
            id={"edit-" + user.row.values.userAccountId}
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableSortBy: true,
    },
  ];

  render() {
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Manage Property Custodian"}
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
          subHeaderComponent={""}
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
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({addToast}, dispatch),
  };
};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PropertyCustodianUserListPage);
