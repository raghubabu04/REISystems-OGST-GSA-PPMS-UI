import React from "react";
import {users} from "../../../ui-kit/components/data/constants";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {bindActionCreators} from "redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {connect} from "react-redux";
import {Tab, Tabs} from "react-bootstrap";
import {BidderApiService} from "../../../api-kit/auctions/bidder-api-service";

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
  allData: any[];
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
  saleLotNumber: string;
  emailId: string;
  sort: string;
  currentPage: number;
  userListResults?: any;
  saleLotDescription?: string;
  closingDate?: string;
  bidAmount?: string;
  bidDate?: string;
  bidStatus?: string;
  selectedTab?: string;
  lotName?:string;
}

class MyBidsListPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      allData: [],
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
      currentPage: 1,
      sort: "",
      saleLotDescription: "",
      closingDate: "",
      bidAmount: "",
      bidDate: "",
      bidStatus: "",
      saleLotNumber: "",
      emailId: "",
      selectedTab: "active",
      lotName:"",
    };

    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.addFilterFields = this.addFilterFields.bind(this);
  }

  private bidderApiService = new BidderApiService();

  async componentDidMount() {
    const { perPage } = this.state;
    const data = {
      page: 1,
      size: perPage,
      bidStatus: this.state.selectedTab,
    };
    this.loadMyBidsListOnPageLoad(data);
  }

  addFilterFields = (data) => {
    if (this.state.saleLotNumber)
      data.params["saleLotNumber"] = this.state.saleLotNumber;
    if (this.state.saleLotDescription)
      data.params["saleLotDescription"] = this.state.saleLotDescription;
    if (this.state.lotName)
      data.params["lotName"] = this.state.lotName;
    if (this.state.closingDate)
      data.params["closingDate"] = this.state.closingDate;
    if (this.state.bidAmount) data.params["bidAmount"] = this.state.bidAmount;
    if (this.state.bidDate) data.params["bidDate"] = this.state.bidDate;
    if (this.state.bidStatus) data.params["bidStatus"] = this.state.bidStatus;
    return data;
  };

  handleChange = async (perPage, page) => {
    if (this.state.selectedTab === "active") {
      const data = {
        page: page,
        size: perPage,
        bidStatus: "active"
      };
      this.addFilterFields(data);
      this.loadMyBidsListOnPageLoad(data);
      this.setState({perPage: perPage, currentPage: page});
    } else {
      const data = {
        page: page,
        size: perPage,
      };
      this.addFilterFields(data);
      this.loadMyBidsListOnPageLoad(data);
      this.setState({perPage: perPage, currentPage: page});
    }
  };

  handleSort = () => {
    if (this.state.selectedTab === "active") {
      const data = {
        page: 1,
        size: this.state.perPage,
        bidStatus: "active"
      };
      this.addFilterFields(data);
      this.loadMyBidsListOnPageLoad(data);
    } else {
      const data = {
        page: 1,
        size: this.state.perPage,
      };
      this.addFilterFields(data);
      this.loadMyBidsListOnPageLoad(data);
    }
  };

  onSearch(event: any) {
    this.setState({ filterText: event.target.value });
  }

  onReset() {
    this.setState({ filterText: "" });
    this.setState({ filteredItems: users });
    this.setState({ paginationResetDefaultPage: true });
  }

  getManageBidsByFilters = (filters: any) => {
    let params: any = {};

    if (filters.saleLotNumber) {
      let saleLotNumber = filters.saleLotNumber.replaceAll("-", "");
      params.saleLotNumber = saleLotNumber;
    }

    if (filters.saleDescription) {
      params.saleDescription = filters.saleDescription;
    }
    if (filters.lotName) {
      params.lotName = filters.lotName;
    }

    if (filters.closingDate) {
      params.closingDate = filters.closingDate;
    }

    if (filters.bidAmount) {
      params.bidAmount = filters.bidAmount;
    }

    if (filters.bidDate) {
      params.bidDate = filters.bidDate;
    }

    if (filters.bidStatus) {
      params.bidStatus = filters.bidStatus;
    }

    params.page = 1;
    params.size = this.state.perPage;

    this.loadMyBidsListOnPageLoad(params);
  };

  handleTabSelect = (value) => {
    if (value === "active") {
      this.setState({
        selectedTab: "active",
      });
      const {perPage} = this.state;
      const data = {
        page: 1,
        size: perPage,
        bidStatus: "active",
      };
      this.loadMyBidsListOnPageLoad(data);
    } else {
      const {perPage} = this.state;
      this.setState({
        selectedTab: "",
      });
      const data = {
        page: 1,
        size: perPage,
      };
      this.loadMyBidsListOnPageLoad(data);
    }
  };

  formatSaleNumber(saleNumber) {
    let formattedSaleNumber;

    formattedSaleNumber =
      saleNumber.substring(0, 1) +
      "-" +
      saleNumber.substring(1, 2) +
      "-" +
      saleNumber.substring(2, 5) +
      "-" +
      saleNumber.substring(5, 6) +
      "-" +
      saleNumber.substring(6, 8) +
      "-" +
      saleNumber.substring(8, 11);
    if (saleNumber.length > 11) {
      formattedSaleNumber =
        formattedSaleNumber + "-" + saleNumber.substring(11, saleNumber.length);
    }
    return formattedSaleNumber;
  }

  formattSaleDescription(saleDescription) {
    let formattedSaleDescription;
    saleDescription = saleDescription.replace(/(<([^>]+)>)/g, "");
    saleDescription = saleDescription.replace("'", ".");
    saleDescription = saleDescription.replace(/&nbsp;/gi, " ");
    return formattedSaleDescription = saleDescription;
  }

  loadMyBidsListOnPageLoad(data) {
    this.bidderApiService
      .getMyBidsForUser(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.myBidsDTOS
            ? response.data.myBidsDTOS
            : [];
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        filteredRows.forEach((row) => {
          row.saleLotNumber = this.formatSaleNumber(row.saleLotNumber);
        });
        filteredRows.forEach((row) => {
          row.saleDescription = this.formattSaleDescription(row.saleDescription);
        });
        filteredRows.forEach((row) => {
          row.lotName = row.lotName;
        });
        this.setState({
          filteredItems: filteredRows,
          allData: filteredRows,
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

  columns = [
    {
      Header: "Sale/Lot number",
      accessor: "saleLotNumber",
    },
    {
      Header: "Lot Name",
      accessor: "lotName",
    },
    {
      Header: "Closing Date",
      accessor: "closingDate",
    },
    {
      Header: "Bid Amount",
      accessor: "bidAmount",
    },
    {
      Header: "Bid Date",
      accessor: "bidDate",
    },
    {
      Header: "Bid Status",
      accessor: "bidStatus",
    },
    {
      Header: "Actions",
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
                this.getManageBidsByFilters(filter);
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
                this.getManageBidsByFilters(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
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
          title={"My Bids"}
          data={this.state.filteredItems}
          columns={this.columns}
          serverSort={true}
          defaultSortField={"bidDate"}
          loading={this.state.loading}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          isPaginationEnabled={true}
          onChange={this.handleChange}
          handleSort={this.handleSort}
          showFilters={true}
          currentPage={this.state.currentPage - 1}
          tabComponent={
            <>
              <br />
              <Tabs
                defaultActiveKey="active"
                id="active-my-bid-tab"
                className="ppms-tabs"
                onSelect={(value) => {
                  this.handleTabSelect(value);
                }}
              >
                <Tab eventKey="active" title="Active Bids"/>
                <Tab eventKey="all" title="All Bids"/>
              </Tabs>
            </>
          }
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
export default connect(mapStateToProps, mapDispatchToProps)(MyBidsListPage);
