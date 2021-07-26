import React from "react";
import {userActions} from "../../../_redux/_actions/user.actions";
import {connect} from "react-redux";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {UserUtils} from "../../../utils/UserUtils";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {UserApiService} from "../../../api-kit/user/user-api.service";

interface State {
  filteredItems: any[];
}

interface Props {
  switchAccount: (accountId) => void;
}

export class SwitchBidderAccount extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { filteredItems: [] };

    this.handleSwitchAccount = this.handleSwitchAccount.bind(this);
  }

  private userApiService = new UserApiService();

  async componentDidMount() {
    this.userApiService.getBidderAccountsList().then((response: any) => {
      let filteredRows = [];
      for (let account of response.data) {
        let row = {
          bidderId: account.bidderId,
          userAccountId: account.userName,
          registrationType: account.registrationType,
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
      Header: "Registration Type",
      accessor: "registrationType",
    },
    {
      Header: "Actions",
      Cell: (account) =>
        account.row.original?.userAccountId !== UserUtils.getBidderUserName() && (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"Select Account"}
              size={"sm"}
              onPress={() =>
                this.handleSwitchAccount(account?.row?.original?.bidderId)
              }
              isDisabled={false}
              id={"select-account-" + account.row.original?.bidderId}
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
    if (UserUtils.getUserTypeFromToken() === "BIDDERS") {
      return (
        <>
          <div className="ui-ppms">
            <h1>Select Bidder Account</h1>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchBidderAccount);
