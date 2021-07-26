import React from "react";
import PPMSCardGroup from "../../../../ui-kit/components/common/card/PPMS-card-group";
import PPMSCard from "../../../../ui-kit/components/common/card/PPMS-card";
import PPMSCardHeader from "../../../../ui-kit/components/common/card/PPMS-card-header";
import {FaInfoCircle} from "react-icons/fa";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import {SalesApiService} from "../../../../api-kit/sales/sales-api-service";
import {Environment} from "../../../../environments/environment";
import {formatCurrency} from "../../../../ui-kit/utilities/FormatUtil";

interface BidderPurchaseHistoryProps {
  match: any;
  bidderPurchaseHistoryData: any;
  location?: any;
}

interface BidderPurchaseHistoryState {
  bidderPurchaseHistoryData: any;
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  rowsPerPageOptions: [number, number, number, number, number];
}

export default class BidderPurchaseHistory extends React.Component<BidderPurchaseHistoryProps,
  BidderPurchaseHistoryState> {
  targetRef;

  constructor(props: any) {
    super(props);
    this.state = {
      bidderPurchaseHistoryData: {},
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 30,
      currentPage: 0,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
    };
    this.targetRef = React.createRef();
  }

  scrollToTarget = () => {
    setTimeout(() => {
      this.targetRef.scrollIntoView({behavior: "smooth"});
    }, 1000);
  };

  componentDidMount() {
    if (this.props.location.state) {
      this.scrollToTarget();
    }
    const data = {
      params: {
        page: 1,
        size: this.state.perPage,
      },
    };
    this.salesAPIService
      .getBidderPurchaseHistory(this.props.match.params.userName, data)
      .then((response: any) => {
      let filteredRows =
        response && response.data && response.data.bidderPurchaseHistoryDTOList
          ? response.data.bidderPurchaseHistoryDTOList
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

  private salesAPIService: SalesApiService = new SalesApiService();

  formatSaleNumber(saleLotNumber) {
    let formattedSaleNumber;

    formattedSaleNumber =
      saleLotNumber.substring(0, 1) +
      "-" +
      saleLotNumber.substring(1, 2) +
      "-" +
      saleLotNumber.substring(2, 5) +
      "-" +
      saleLotNumber.substring(5, 6) +
      "-" +
      saleLotNumber.substring(6, 8) +
      "-" +
      saleLotNumber.substring(8, 11);
    if (saleLotNumber.length > 11) {
      formattedSaleNumber =
        formattedSaleNumber + "-" + saleLotNumber.substring(11, saleLotNumber.length);
    }
    return formattedSaleNumber;
  }

  dowloadBidderPurchaseHistory = () => {
    this.salesAPIService.downloadBidderPurchaseHistory(this.props.match.params.userName)
      .then((response: any) => {
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  handleChange = async (perPage, page) => {
    this.setState({loading: true, currentPage: page});
    const data = {
      params: {
        page: page,
        size: perPage,
      },
    };
    this.salesAPIService
      .getBidderPurchaseHistory(this.props.match.params.userName, data)
      .then((response: any) => {
        let filteredRows =
        response && response.data && response.data.bidderPurchaseHistoryDTOList
          ? response.data.bidderPurchaseHistoryDTOList
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
        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
        });
      });
  };

  handleSort = (sortBy) => {
    // instead of setTimeout this is where to handle the API call.
    setTimeout(() => {
    }, 100);
  };

  columns = [
    {
      Header: "Sale/Lot Number",
      accessor: "saleLotNumber",
    },
    {
      Header: "Contract Number",
      accessor: "contractNumber",
    },
    {
      Header: "Contract Status",
      accessor: "contractStatus",
    },
    {
      Header: "Award Date",
      accessor: "awardDate",
    },
    {
      Header: "Award Amount",
      accessor: "awardAmount",
      alignItem: 'right',
      Cell: (data: any) => {
        var awardAmount = formatCurrency.format(data.row.values["awardAmount"]);
        return <div style={{textAlign: "right"}}>{awardAmount}</div>
      },
    },
    {
      Header: "Amount Due",
      accessor: "amountDue",
      alignItem: 'right',
      Cell: (data: any) => {
        var amountDue = formatCurrency.format(data.row.values["amountDue"]);
        return <div style={{textAlign: "right"}}>{amountDue}</div>
      },
    },
    {
      Header: "Liquidated Damages Paid",
      accessor: "liquidatedDamagesPaid",
    },
  ];

  showDownloadButton = () => {
    if (this.state.filteredItems.length > 0) {
      let URL = Environment.SALES_URL + "/api/v1/sales/purchase-history/" + this.props.match.params.userName + "/download";
      return (
        <>
          <div className={"grid-col-auto bidder-purchase-download"}>
            <a href={URL} className="usa-button">Download</a>
          </div>
        </>
      )
    }
  }

  render() {
    return (
      <div
        className="BidderPurchaseHistory"
        ref={(ref) => {
          this.targetRef = ref;
        }}
      >
        <PPMSCardGroup
          className={"ppms-card-group ui-ppms"}
          id="bidder-purchase-history"
        >
          <PPMSCard className={"ppms-widget ppms-sub-widget"}>
            <PPMSCardHeader className="non-tcn-main-row card-header-height widget-header">
              <i className="fas head-icon">{<FaInfoCircle/>}</i> Bidder Purchase
              History
            </PPMSCardHeader>
            {this.showDownloadButton()}
            <div className="ui-ppms">
              <PPMSDatatable
                title={""}
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
                showFilters={false}
              />
            </div>
          </PPMSCard>
        </PPMSCardGroup>
      </div>
    );
  }
}
