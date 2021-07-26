import React, { useContext, useEffect } from "react";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { Paths } from "../../../../Router";
import { formatCurrency, formatSaleNumber } from "../../../../../ui-kit/utilities/FormatUtil";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { BidderTransactionsContext } from "./BidderTransactionsContext";
import { UserUtils } from "../../../../../utils/UserUtils";

interface TransactionProps {
  registerId: any;
  actions?: any;
  user?: any;
  roles?: any;
}

const BidderTransactions = (props: TransactionProps) => {
  const { registerId } = props;
  const { bidderTransactionsState, updateBidderTransactionsState } = useContext(
    BidderTransactionsContext
  );

  const [loading, setLoading] = React.useState(false);
  const [apiRows, setApiRows] = React.useState([]);

  let salesApiService = new SalesApiService();

  let handleChangeTable = (perPage, page) => {
    let state = bidderTransactionsState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    bidderTransactionsState.data.filteredRows = apiData.slice(
      startIndex,
      endIndex
    );
    bidderTransactionsState.other.page.totalRows = apiRows.length;
    bidderTransactionsState.other.page.totalPages = Math.ceil(totalPages);
    bidderTransactionsState.other.page.currentPage = page;
    bidderTransactionsState.other.page.perPage = perPage;
    updateBidderTransactionsState(state);
  };

  let getBidderTransactions = (filters: any) => {
    let data = {
      params: {
        page: bidderTransactionsState.other.page.currentPage,
        size: bidderTransactionsState?.other?.page?.perPage,
      },
    };

    filters?.forEach((filter) => {
      if (filter.value) {
        data[filter.id] = filter.value;
      }
    });
    salesApiService
      .getBidderTransactions(data, registerId)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.bidderTransactionDTOS
            ? response.data.bidderTransactionDTOS
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.bidderName = row.bidderName;
          obj.saleNumber = row.saleNumber;
          obj.contractNo = row.contractNo;
          obj.awardDate = row.awardDate;
          obj.paymentDate = row.paymentDate;
          obj.awardAmount = formatCurrency.format(row.awardAmount);
          obj.amountPaid = formatCurrency.format(row.amountPaid);
          obj.paymentMethod = row.paymentMethod;
          obj.contractId = row.contractId;
          obj.saleId = row.saleId;
          obj.zoneId = row.zoneId;
          obj.userId = row.userId;
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
        let state = bidderTransactionsState;
        state.data.filteredRows = filteredRows.slice(
          0,
          state?.other?.page?.perPage
        );
        state.other.loading = false;
        state.other.page.totalRows = totalElements;
        state.other.page.totalPages = totalPages;
        setLoading(false);
        updateBidderTransactionsState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  useEffect(() => {
    setLoading(true);
    let filters = [];
    getBidderTransactions(filters);
  }, [
    bidderTransactionsState.other.page.currentPage,
    bidderTransactionsState.other.page.perPage,
  ]);
  const columns = [
    {
      Header: "Bidder User ID",
      accessor: "userId",
      filter: "search",
    },
    {
      Header: "Bidder Name",
      accessor: "bidderName",
      filter: "search",
    },
    {
      Header: "Sales/Lot Number",
      accessor: "saleNumber",
      Cell: (data) => {
        return (
          <Link
            to={`${Paths.salesTransaction}${
              "/" + data.row.original.saleId
            }?zoneId=${UserUtils.getDefaultZones()}`}
            className={"sales-transaction"}
            key="sales-transaction-id"
          >
            {formatSaleNumber(data.value)}
          </Link>
        );
      },
      filter: "search",
      width: 20,
    },
    {
      Header: "Contract Number",
      accessor: "contractNo",
      id: "contractNo",
      filter: "search",
      width: 220,
      Cell: (data) => {
        return (
          <Link
            to={
              Paths.contractTransaction +
              `/${data.row.original.saleId}/${
                data.row.original.contractId
              }?contractNumber=${data.row.values.contractNo.split("-")[0]}`
            }
            className={"sales-transaction"}
            key="sales-transaction-id"
          >
            {data.value}
          </Link>
        );
      },
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
      Header: "Award Amount",
      accessor: "awardAmount",
      filter: "search",
    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
      filter: "search",
    },
    {
      Header: "Payment Method",
      accessor: "paymentMethod",
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
                  filters.push(filter);
                });
                getBidderTransactions(filters);
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
                getBidderTransactions(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (bidder) => {
        return (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"View"}
              icon={<FaEye />}
              size={"sm"}
              onPress={() => {}}
              id={"view"}
            />
            <PPMSButton
              variant={"secondary"}
              label={"Review"}
              size={"sm"}
              icon={<MdEdit />}
              onPress={() => {}}
              id={`edit-${bidder.row.values.id}`}
            />
          </>
        );
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
          bidderTransactionsState.data.filteredRows
            ? bidderTransactionsState.data.filteredRows
            : []
        }
        columns={columns}
        defaultSortField={"userId"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={
          bidderTransactionsState?.other?.page?.rowsPerPageOptions
        }
        totalRows={bidderTransactionsState?.other?.page?.totalRows}
        totalPages={bidderTransactionsState?.other?.page?.totalPages}
        rowsPerPage={bidderTransactionsState?.other?.page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={loading}
        currentPage={bidderTransactionsState?.other?.page?.currentPage - 1}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(BidderTransactions);
