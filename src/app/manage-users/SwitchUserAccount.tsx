import React from "react";
import { userActions } from "../../_redux/_actions/user.actions";
import { connect } from "react-redux";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { UserUtils } from "../../utils/UserUtils";
import PPMSDatatable from "../../ui-kit/components/common/datatable/PPMS-datatable";
import { UserApiService } from "../../api-kit/user/user-api.service";

interface State {
  filteredItems: any[];
}

interface Props {
  switchAccount: (accountId) => void;
}

export class SwitchUserAccount extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { filteredItems: [] };

    this.handleSwitchAccount = this.handleSwitchAccount.bind(this);
  }

  private userApiService = new UserApiService();

  async componentDidMount() {
    this.userApiService.getAccountsList().then((response: any) => {
      let filteredRows = [];
      for (let account of response.data) {
        let row = {
          id: account.id,
          userAccountId: account.accountId,
          aac: account.aacCodes.toString(),
          agencyBureau: account.agencyBureauCodes.toString(),
          permissions: account.permissions.toString(),
          approvingOfficial:
            account.approvingOfficial.aoFirstName +
            " " +
            account.approvingOfficial.aoLastName,
        };
        filteredRows.push(row);
      }
      this.setState({
        filteredItems: filteredRows,
      });
    });
  }

  handleSwitchAccount = (accountId: any) => {
    this.props.switchAccount(accountId);
  };

  columns = [
    {
      Header: "Account Id",
      accessor: "userAccountId",
    },
    {
      Header: "AAC Code",
      accessor: "aac",
    },
    {
      Header: "Agency / Bureau",
      accessor: "agencyBureau",
    },
    {
      Header: "Permissions",
      accessor: "permissions",
    },
    {
      Header: "Approving Official",
      accessor: "approvingOfficial",
    },
    {
      Header: "Actions",
      Cell: (account) =>
        account.row.values.userAccountId !== UserUtils.getUserAccountId() && (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"Select Account"}
              size={"sm"}
              onPress={() =>
                this.handleSwitchAccount(account?.row?.original?.id)
              }
              isDisabled={false}
              id={"select-account-" + account.row.values.userAccountId}
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
    if (UserUtils.getUserTypeFromToken() === "UND") {
      return (
        <>
          <div className="ui-ppms">
            <h1>Switch Account</h1>
            <div className="short-table">
              <PPMSDatatable
                title={"Switch Account"}
                data={this.state.filteredItems}
                columns={this.columns}
                defaultSortField={"userAccountId"}
                isPaginationEnabled={false}
                loading={false}
                totalRows={this.state.filteredItems.length}
              />
            </div>
          </div>
        </>
      );
    }
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    switchAccount: (accountId) =>
      dispatch(userActions.switchAccount(accountId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SwitchUserAccount);
