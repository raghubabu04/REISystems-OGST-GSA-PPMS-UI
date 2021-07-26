import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PPMSButton } from "./../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "./../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PageHelper, Paths } from "../../../app/Router";
import { Link } from "react-router-dom";
import { UserUtils } from "../../../utils/UserUtils";
import {
  formatCurrency,
  formatSaleNumber,
} from "../../../ui-kit/utilities/FormatUtil";
import { BidderApiService } from "../../../api-kit/auctions/bidder-api-service";
import PPMSCheckbox from "../../../ui-kit/components/common/form/PPMS-checkbox";
import { addToast } from "../../../_redux/_actions/toast.actions";
import moment from "moment";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";

interface OpenUnpaidDetailsProps {
  actions?: any;
  user?: any;
  roles?: any;
  bidderId?: any;
  updateBidderContractDetail?: any;
}

const OpenUnpaidDetails = (props: OpenUnpaidDetailsProps) => {
  const { bidderId, updateBidderContractDetail } = props;
  const { addToast } = props.actions;
  const [defaultZoneId, setdefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );
  let ids = [];
  const [checkSelectedValue, setCheckSelectedValue] = useState(true);
  const [page, updatePage] = useState({
    totalRows: 0,
    totalPages: 0,
    perPage: 50,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
    currentPage: 1,
    loading: false,
  });
  const [apiRows, setApiRows] = React.useState([]);
  const [contractDetails, updateContractDetails] = useState(null);
  // const bidderAPIService = new BidderApiService();
  const salesApiService = new SalesApiService();
  const getBidderContractDetails = (filters: any) => {
    let params: any = {};
    let searchCriteria: any = {};
    params.page = page.currentPage;
    params.size = page.perPage;
    filters?.forEach((filter) => {
      if (filter.value) {
        searchCriteria[filter.id] = filter.value;
      }
    });
    salesApiService
      .getBidderContractDetails(bidderId, params, searchCriteria)
      .then((response) => {
        updateBidderContractDetail(response.data);
        let filteredRows =
          response && response.data && response.data.bidderPaymentDTOList
            ? response.data.bidderPaymentDTOList
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.saleLotNumber = row.saleLotNumber;
          obj.lotName = row.lotName;
          obj.contractNumber = row.contractNumber;
          obj.contractId = row.contractId;
          obj.awardDate = row.awardDate;
          obj.paymentDueDate = row.paymentDueDate;
          obj.amountDue = row.amountDue;
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
        page.totalPages = totalPages;
        page.totalRows = totalElements;
        page.loading = false;
        updatePage(page);
        updateContractDetails(filteredRows.slice(0, page.perPage));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      id: "selection",
      width: "50",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <div>
          <PPMSCheckbox
            id={"select-all-rows"}
            name={`select-all-rows`}
            label={""}
            isInvalid={false}
            disabled={!props.roles.isCLO}
            {...getToggleAllPageRowsSelectedProps()}
          />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => {
        return (
          <div>
            <PPMSCheckbox
              id={`${row.id}-checkbox`}
              name={`${row.id}-checkbox`}
              label={""}
              isInvalid={false}
              disabled={!props.roles.isCLO}
              {...row.getToggleRowSelectedProps()}
            />
          </div>
        );
      },
    },
    {
      Header: "Sale/Lot Number",
      accessor: "saleLotNumber",
      Cell: (data) => {
        return (
          <Link
            to={`${Paths.salesTransaction}${
              data.row.values.id ? "/" + data.row.values.id : ""
            }?zoneId=${defaultZoneId}`}
            className={"sales-transaction"}
            key="sales-transaction-id"
          >
            {formatSaleNumber(data.value)}
          </Link>
        );
      },
      filter: "search",
      width: 200,
    },
    {
      Header: "Lot Name",
      accessor: "lotName",
      filter: "search",
    },
    {
      Header: "Contract No",
      accessor: "contractNumber",
      filter: "search",
    },
    {
      Header: "Award Date",
      accessor: "awardDate",
      Cell: (data) => {
        return data.value ? moment(data.value).format("MM/DD/YYYY @ hh:mmA CT") : "";
      },
      filter: "search",
    },
    {
      Header: "Payment Due Date",
      accessor: "paymentDueDate",
      Cell: (data) => {
        return data.value ? moment(data.value).format("MM/DD/YYYY @ hh:mmA CT") : "";
      },
      filter: "search",
    },
    {
      Header: "Amount Due",
      accessor: "amountDue",
      Cell: (data) => {
        return data.value ? formatCurrency.format(data.value) : "";
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
                  if (column.id === "saleLotNumber") {
                    filter["value"] = column["filterValue"]?.replace(/-/g, "");
                  } else if((column.id ==="paymentDueDate" || column.id === "awardDate") && column["filterValue"]){
                    filter["value"] = moment(column["filterValue"], "MM/DD/YYYY hh:mmA").format("YYYY-MM-DDThh:mm:ss");
                  } else {
                    filter["value"] = column["filterValue"];
                  }

                  filters.push(filter);
                });
                getBidderContractDetails(filters);
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
                getBidderContractDetails(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (property) => {
        let salesInfo = property.data[property.row.id];
        return (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"Pay"}
              size={"sm"}
              onPress={() => {
                PageHelper.openPage(
                  `${Paths.paymentDetails}/${bidderId}/single?contractIds=${salesInfo.contractId}`
                );
              }}
              id={"edit-" + salesInfo.salesNumber}
              isDisabled={!props.roles.isCLO}
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

  const handleChangeTable = (perPage, selectedPage) => {
    const startIndex: number = perPage * (selectedPage - 1);
    const endIndex: number = perPage * (selectedPage - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    updateContractDetails(apiData.slice(startIndex, endIndex));
    let prepPage = page;
    prepPage.totalRows = apiRows?.length;
    prepPage.totalPages = Math.ceil(totalPages);
    prepPage.perPage = perPage;
    prepPage.currentPage = selectedPage;
    updatePage(prepPage);
  };

  const checkSelectedValues = (selectedCheckboxRows) => {
    let selectedContracts = selectedCheckboxRows.filter(
      (row) => row.original.status === "Approved"
    ).length;
    if (
      selectedCheckboxRows.length != 0 &&
      selectedCheckboxRows.length === selectedContracts
    ) {
      setCheckSelectedValue(false);
    } else {
      setCheckSelectedValue(true);
    }
  };

  const setSelectedRows = (selectedFlatRows: any[]) => {
    checkSelectedValues(selectedFlatRows);
    const selectedRowIds = selectedFlatRows.map(
      (item) => item.original.contractId
    );
    ids = selectedRowIds;
  };
  const paySelectedContracts = () => {
    if (ids.length > 0) {
      PageHelper.openPage(
        `${Paths.paymentDetails}/${bidderId}/multi?contractIds=${ids.join(",")}`
      );
    } else {
      addToast({
        text: "Please select contract(s).",
        type: "warning",
        heading: "Warning",
      });
    }
  };

  useEffect(() => {
    page.loading = true;
    updatePage(page);
    let filters = [];
    getBidderContractDetails(filters);
  }, []);
  return (
    <div className="ui-ppms">
      <br />
      <PPMSButton
        variant={"outline-secondary"}
        type={"button"}
        label={"Pay All"}
        onPress={paySelectedContracts}
        isDisabled={!props.roles.isCLO}
        id={"cancel"}
      />
      <PPMSDatatable
        title={""}
        data={contractDetails ? contractDetails : []}
        columns={columns}
        defaultSortField={"userId"}
        onChange={(event, selectedPage) => {
          handleChangeTable(event, selectedPage);
        }}
        rowsPerPageOptions={page?.rowsPerPageOptions}
        totalRows={page?.totalRows}
        totalPages={page?.totalPages}
        rowsPerPage={page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={page.loading}
        setSelectedRows={setSelectedRows}
        // hiddenColumns={["id"]}
        currentPage={page?.currentPage - 1}
      />

      <div className={"grid-row-auto"}>
        <PPMSButton
          id={"back"}
          type={"button"}
          variant={"link"}
          label={"< Back To Bidder Payments"}
          onPress={() => PageHelper.openPage(`${Paths.bidderPayments}`)}
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

export default connect(mapStateToProps, mapDispatchToProps)(OpenUnpaidDetails);
