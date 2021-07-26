import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addToast} from "../../../../../_redux/_actions/toast.actions";
import {BidderPaymentDetailsContext} from "../BidderPaymentDetailsContext";
import {SalesApiService} from "../../../../../api-kit/sales/sales-api-service";
import {PPMSButton} from "../../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import {Link} from "react-router-dom";
import { formatCurrency, formatDateTime } from "../../../../../ui-kit/utilities/FormatUtil";
import {PageHelper, Paths} from "../../../../Router";
import moment from "moment";

interface BidderPaymentHistoryProps {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
  user?: any;
  roles?: any;
}

const BidderPaymentHistory = (props: BidderPaymentHistoryProps) => {
  const {match} = props;
  const {
    bidderPaymentDetailsState,
    updateBidderPaymentDetailsState,
  } = useContext(BidderPaymentDetailsContext);

  const [loading, setLoading] = React.useState(false);
  const [apiRows, setApiRows] = React.useState([]);

  let salesApiService = new SalesApiService();
  let bidderId = null;
  if (match.params.bidderId) {
    bidderId = match.params.bidderId;
  }

  let handleChangeTable = (perPage, page) => {
    let state = bidderPaymentDetailsState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    bidderPaymentDetailsState.data.filteredRows = apiData.slice(
      startIndex,
      endIndex
    );
    bidderPaymentDetailsState.other.page.totalRows = apiRows.length;
    bidderPaymentDetailsState.other.page.totalPages = Math.ceil(totalPages);
    bidderPaymentDetailsState.other.page.currentPage = page;
    bidderPaymentDetailsState.other.page.perPage = perPage;
    updateBidderPaymentDetailsState(state);
  };

  let getBidderPayments = (filters: any) => {
    let data = {
      params: {
        page: bidderPaymentDetailsState.other.page.currentPage,
        size: bidderPaymentDetailsState?.other?.page?.perPage,
      },
    };

    filters?.forEach((filter) => {
      if (filter.value) {
        data[filter.id] = filter.value;
      }
    });
    salesApiService
      .getBidderPaymentHistory(data, bidderId)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.bidderPaymentHistoryDTOList
            ? response.data.bidderPaymentHistoryDTOList
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.saleLotNumber = row.saleLotNumber;
          obj.amountPaid = row.amountPaid;
          obj.awardDate = row.awardDate ? formatDateTime(row.awardDate) : "";
          obj.contractNumber = row.contractNumber;
          obj.lotName = row.lotName;
          obj.paymentDate = row.paymentDate
            ? formatDateTime(row.paymentDate)
            : "";
          obj.registerNumber = row.registerNumber;
          obj.registerId = row.registerId;
          obj.contractId = row.contractId;
          return obj;
        });
        setApiRows(filteredRows);
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        let state = bidderPaymentDetailsState;
        state.data.filteredRows = filteredRows.slice(
          0,
          state?.other?.page?.perPage
        );
        state.other.loading = false;
        state.other.page.totalRows = totalElements;
        state.other.page.totalPages = totalPages;
        setLoading(false);
        updateBidderPaymentDetailsState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  useEffect(() => {
    setLoading(true);
    let filters = [];
    getBidderPayments(filters);
  }, [
    bidderPaymentDetailsState.other.page.currentPage,
    bidderPaymentDetailsState.other.page.perPage,
  ]);

  const columns = [
    {
      Header: "Sale/Lot Number",
      accessor: "saleLotNumber",
      filter: "search",
    },
    {
      Header: "Lot Name",
      accessor: "lotName",
      filter: "search",
    },
    {
      Header: "Contract Number",
      accessor: "contractNumber",
      filter: "search",
    },
    {
      Header: "Award Date",
      accessor: "awardDate",
      filter: "search",
    },
    {
      Header: "Payment Date",
      accessor: "paymentDate",
      filter: "search",
    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
      filter: "search",
      Cell: (data) => {
        return data.value ? formatCurrency.format(data.value) : "";
      },
    },
    {
      Header: "Register Number",
      accessor: "registerNumber",
      Cell: (data) => {
        return (
          <Link
            to={`${Paths.paymentRegisterManager}${
              data.row.original.registerId
                ? "/" + data.row.original.registerId
                : ""
            }`}
            className={"bidder-payment-history"}
            key="bidder-payment-history"
          >
            {data.value}
          </Link>
        );
      },
      filter: "search",
    },
    {
      Header: "Actions",
      id: "actions",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer" />
            <PPMSButton
              id={"apply-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  let filter = {};
                  filter["id"] = column.id;
                  filter["value"] = column["filterValue"];
                  if((column.id ==="paymentDate" || column.id === "awardDate") && column["filterValue"]){
                    filter["value"] = moment(column["filterValue"], "MM/DD/YYYY hh:mmA").format("YYYY-MM-DDThh:mm:ss");
                  }
                  filters.push(filter);
                });
                getBidderPayments(filters);
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
                getBidderPayments(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (row) => {
        return <></>;
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  return (
    <div className="ui-ppms">
      <PPMSDatatable
        title={""}
        data={
          bidderPaymentDetailsState.data.filteredRows
            ? bidderPaymentDetailsState.data.filteredRows
            : []
        }
        columns={columns}
        defaultSortField={"bidderId"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={
          bidderPaymentDetailsState?.other?.page?.rowsPerPageOptions
        }
        totalRows={bidderPaymentDetailsState?.other?.page?.totalRows}
        totalPages={bidderPaymentDetailsState?.other?.page?.totalPages}
        rowsPerPage={bidderPaymentDetailsState?.other?.page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={loading}
        currentPage={bidderPaymentDetailsState?.other?.page?.currentPage - 1}
      />

      <div className={"grid-row-auto"}>
        <PPMSButton
          id={"back"}
          type={"button"}
          variant={"link"}
          label={"< Back To Bidder/Payment"}
          onPress={() => PageHelper.openPage(Paths.bidderPayments)}
          className="back-to-manage-auction usa-button "
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BidderPaymentHistory);
