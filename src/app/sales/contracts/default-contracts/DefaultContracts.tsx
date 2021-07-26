import React, {
  StrictMode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import {
  formatSaleNumber,
  getDateFrom,
  getDateTo,
  oneToThreeDigitFormatter,
} from "../../../../ui-kit/utilities/FormatUtil";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { MdEdit } from "react-icons/md";

import { addToast } from "../../../../_redux/_actions/toast.actions";
import { Link } from "react-router-dom";
import { DefaultContractsContext } from "./DefaultContractsContext";
import { PageHelper, Paths } from "../../../Router";
import IndeterminateCheckbox from "../../../../ui-kit/components/common/datatable/IndeterminateCheckbox";
import { UserUtils } from "../../../../utils/UserUtils";
import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";
interface DefaultContractsProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  bidderId: any;
  roles: any;
}

const DefaultContracts = (props: DefaultContractsProps) => {
  let salesAPIService = new SalesApiService();
  const { defaultContractsState, updateDefaultContractsState } = useContext(
    DefaultContractsContext
  );

  const { match } = props;

  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  useEffect(() => {
    getContracts([]);
  }, [match.params.userName, refresh]);

  const columns = [
    // Let's make a column for selection
    {
      id: "selection",
      width: "50",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <div>
          <IndeterminateCheckbox
            id={"select-all-rows"}
            name={`select-all-rows`}
            {...getToggleAllPageRowsSelectedProps()}
          />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => (
        <div>
          <IndeterminateCheckbox
            id={`${row.id}-checkbox`}
            name={`${row.id}-checkbox`}
            disabled={row.values.contractStatus.indexOf("Default") > -1}
            {...row.getToggleRowSelectedProps()}
          />
        </div>
      ),
    },
    {
      Header: "Sales Number",
      accessor: "salesNumber",
      id: "salesNumber",
      Cell: (data) => {
        return (
          <Link
            to={`${Paths.salesTransaction}${
              data.row.values.salesId ? "/" + data.row.values.salesId : ""
            }?zoneId=${UserUtils.getDefaultZones()}`}
            className={"sales-transaction"}
            key="sales-transaction-id"
          >
            {formatSaleNumber(data.value)}
          </Link>
        );
      },
      filter: "search",
    },
    {
      Header: "Sales Id",
      accessor: "salesId",
      id: "salesId",
    },
    {
      Header: "Contract Id",
      accessor: "contractId",
      id: "contractId",
    },
    {
      Header: "Contract-Lot",
      accessor: "contractNumber",
      id: "contractNumber",
      filter: "search",
      width: 220,
      Cell: (data) => {
        return (
          <Link
            to={
              Paths.contractTransaction +
              `/${data.row.original.salesId}/${
                data.row.original.contractId
              }?contractNumber=${data.row.values.contractNumber.split("-")[0]}`
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
      Header: "Payment Date",
      accessor: "paymentDate",
      filter: "search",
    },
    {
      Header: "Removal Date",
      accessor: "removalDate",
      filter: "search",
    },
    {
      Header: "Award Date",
      accessor: "awardDate",
      filter: "search",
    },
    {
      Header: "Award Amount",
      accessor: "awardAmount",
      filter: "search",
    },
    {
      Header: "Contract Status",
      accessor: "contractStatus",
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
                  filters.push({
                    id: column.id,
                    value:
                      column.id === "contractNumber"
                        ? column["filterValue"]?.split("-")[0] +
                          column["filterValue"]
                            ?.split("-")[1]
                            .replace(/^0+/, "")
                        : column.id === "salesNumber"
                        ? (column["value"] = column["filterValue"]?.replace(
                            /-/g,
                            ""
                          ))
                        : column["filterValue"],
                  });
                });
                getContracts(filters);
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
                filters.push({
                  id: "bidderUsername",
                  value: match.params.userName,
                });
                getContracts(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: (property) => {
        let contractInfo = property.row.values;
        return (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"Edit"}
              size={"sm"}
              icon={<MdEdit />}
              onPress={() => onClickAction(contractInfo, "edit")}
              id={"editContract"}
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

  let handleChangeTable = async (perPage, page) => {
    if (isEmptyCheck(match.params.userName)) return;
    let filter: any = defaultContractsState.other.filter;
    let data: any = {
      ...filter,
      bidderUsername: match.params.userName,
      contractStatus: "AWARDED",
      params: {
        page,
        size: perPage,
      },
    };

    if (defaultContractsState.other.page.sort) {
      data.params["sort"] = defaultContractsState.other.page.sort;
    }

    try {
      let getContractsListResponse = await salesAPIService.getContractsListByBidder(
        data
      );
      let filteredRows: any[] = getFilteredRows(getContractsListResponse);
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      defaultContractsState.data.filteredRows = filteredRows;
      defaultContractsState.other.loading = false;
      defaultContractsState.other.page.totalRows = totalElements;
      defaultContractsState.other.page.totalPages = totalPages;
      defaultContractsState.other.page.currentPage = page;
      defaultContractsState.other.page.perPage = perPage;
      defaultContractsState.other.filter = data;
      let state = defaultContractsState;
      updateDefaultContractsState(state);
    } catch (error) {
      console.error("DefaultContracts Page has error on handleChangeTable");
    }
  };

  const getFilteredRows = (getContractsListResponse: any): any[] => {
    let filteredRows = getContractsListResponse?.data?.contractSearchResultList
      ? getContractsListResponse.data.contractSearchResultList
      : [];
    filteredRows = filteredRows.map((row) => {
      let contractInfo: any = {};
      contractInfo.contractNumber = `${
        row.contractNumber
      }-${oneToThreeDigitFormatter(row.lotNumber)}`;
      contractInfo.salesId = row.salesId ? row.salesId : "";
      contractInfo.salesNumber = row.salesNumber ? row.salesNumber : "";
      contractInfo.contractId = row.contractId ? row.contractId : "";
      contractInfo.fscCode = row.fscCode ? row.fscCode : "";
      contractInfo.paymentDate = row.paymentDate ? row.paymentDate : "";
      contractInfo.removalDate = row.removalDate ? row.removalDate : "";
      contractInfo.awardDate = row.awardDate ? row.awardDate : "";
      contractInfo.awardAmount = row.awardAmount ? `$${row.awardAmount}` : "";
      contractInfo.contractStatus = row.contractStatus
        ? row.contractStatus
        : "";
      contractInfo.canEdit = row.canEdit ? row.canEdit : "";
      return contractInfo;
    });
    return filteredRows;
  };

  const getContracts = async (filters: any) => {
    if (isEmptyCheck(match.params.userName)) return;
    let contractNumber;
    let fscCode;
    let paymentDate;
    let removalDate;
    let salesNumber;
    let awardAmount;
    let awardDate;
    let contractStatus;

    filters?.forEach((filter) => {
      if (filter?.value) {
        switch (filter.id) {
          case "contractNumber":
            contractNumber = filter["value"]?.trim();
            break;
          case "fscCode":
            fscCode = filter["value"]?.trim();
            break;
          case "paymentDate":
            paymentDate = filter["value"]?.trim();
            break;
          case "removalDate":
            removalDate = filter["value"]?.trim();
            break;
          case "salesNumber":
            salesNumber = filter["value"]?.trim();
            break;
          case "awardAmount":
            awardAmount = filter["value"]?.trim();
            break;
          case "contractStatus":
            contractStatus = filter["value"]?.trim();
            break;
          case "awardDate":
            awardDate = filter["value"]?.trim();
            break;
        }
      }
    });

    let paymentDateFrom = paymentDate ? getDateFrom(paymentDate) : "";
    let paymentDateTo = paymentDate ? getDateTo(paymentDate) : "";
    let removalDateFrom = removalDate ? getDateFrom(removalDate) : "";
    let removalDateTo = removalDate ? getDateTo(removalDate) : "";
    let awardDateFrom = awardDate ? getDateFrom(awardDate) : "";
    let awardDateTo = awardDate ? getDateTo(awardDate) : "";

    let filter: any = {
      contractNumber,
      contractStatus,
      fscCode,
      paymentDateFrom,
      paymentDateTo,
      removalDateFrom,
      removalDateTo,
      awardDateFrom,
      awardDateTo,
      salesNumber,
      awardAmount,
      bidderUsername: match.params.userName,
    };
    let data: any = {
      ...filter,
      params: {
        page: 1,
        size: defaultContractsState?.other?.page?.perPage,
      },
    };

    if (defaultContractsState.other.page.sort) {
      data.params["sort"] = defaultContractsState.other.page.sort;
    }

    try {
      let getContractsListResponse = await salesAPIService.getContractsListByBidder(
        data
      );
      let filteredRows: any[] = getFilteredRows(getContractsListResponse);
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      defaultContractsState.data.filteredRows = filteredRows;
      defaultContractsState.other.loading = false;
      defaultContractsState.other.page.totalRows = totalElements;
      defaultContractsState.other.page.totalPages = totalPages;
      defaultContractsState.other.page.currentPage = 1;
      defaultContractsState.other.filter = filter;
      let state = defaultContractsState;
      updateDefaultContractsState(state);
    } catch (error) {
      console.error("DefaultContracts Page has error on getContracts API");
    }
  };

  const handleSort = async (sortBy) => {
    if (isEmptyCheck(match.params.userName)) return;
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;
    let filter: any = defaultContractsState.other.filter;
    let data: any = {
      ...filter,
      bidderUsername: match.params.userName,
      contractStatus: "AWARDED",
      params: {
        page: 1,
        size: defaultContractsState.other.page.perPage,
        sort: sort,
      },
    };
    try {
      let getContractsListResponse = await salesAPIService.getContractsListByBidder(
        data
      );
      let filteredRows: any[] = getFilteredRows(getContractsListResponse);
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      defaultContractsState.data.filteredRows = filteredRows;
      defaultContractsState.other.loading = false;
      defaultContractsState.other.page.totalRows = totalElements;
      defaultContractsState.other.page.totalPages = totalPages;
      defaultContractsState.other.page.currentPage = data.params.page;
      defaultContractsState.other.filter = data;

      let state = defaultContractsState;
      updateDefaultContractsState(state);
    } catch (error) {
      console.error("DefaultContracts Page has error on handleSort");
    }
  };

  const onClickAction = (contractInfo, action) => {
    let contractNumber = contractInfo.contractNumber.split("-")[0];
    let contractId = contractInfo.contractId;
    let salesId = contractInfo.salesId;
    updateDefaultContractsState({
      contractNumber,
      contractId,
    });
    PageHelper.openPage(
      Paths.contractTransaction +
        `/${salesId}/${contractId}?contractNumber=${contractNumber}`
    );
  };

  const defaultContracts = () => {
    salesAPIService
      .defaultContractAndBidder(selectedRowIds, props.bidderId)
      .then((response) => {
        if (response.status === 200) {
          setSelectedRowIds([]);
          setRefresh(true);
          updateDefaultContractsState({
            isAllPageRowsSelected: false,
            checkSelectedValue: true,
          });
          PageHelper.openPage(Paths.manageBidderStatusList);
          addToast({
            text: "Successfully marked bidder as default",
            type: "success",
            heading: "Success",
          });
        } else {
          addToast({
            text: `Error marking the bidder as default`,
            type: "error",
            heading: "Error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        addToast({
          text: `Error marking the bidder as default`,
          type: "error",
          heading: "Error",
        });
      });
  };

  const handleTogglePageRow = (props: any, { instance, row }) => {
    let checked = false;
    if (selectedRowIds.length > 0) {
      const { manualRowSelectedKey = "isSelected" } = instance;
      checked =
        row.original && row.original[manualRowSelectedKey]
          ? true
          : row.isSelected;
    }
    return [
      props,
      {
        onChange: (e) => {
          row.toggleRowSelected(e.target.checked);
          const notAuctionLotIds: any[] = instance.rows.filter((row: any) =>
            isEmptyCheck(row.original.auctionId)
          );
          //even if one of the checkbox in the page is selected set "isAllPageRowsSelected" to false
          const index: number = selectedRowIds.indexOf(row.original.auctionId);
          if (e.target.checked) {
            selectedRowIds.push(row.original.contractId);
          } else {
            if (index > -1) {
              selectedRowIds.splice(index, 1);
            }
          }
          const isAllPageRowsSelected: boolean =
            selectedRowIds.length === notAuctionLotIds.length;
          updateDefaultContractsState({
            isAllPageRowsSelected: isAllPageRowsSelected,
            checkSelectedValue: !isAllPageRowsSelected,
          });

          setSelectedRowIds(selectedRowIds);
        },
        style: {
          cursor: "pointer",
        },
        checked,
        title: "Toggle Row Selected",
        indeterminate: row.isSomeSelected,
      },
    ];
  };

  const handleToggleAllPageRows = (props, { instance }) => [
    props,
    {
      onChange: (e: any) => {
        var checked: boolean = e.target.checked;
        let contractIds: number[] = [];
        instance.rows.forEach((row: any) => {
          if (row.values.contractStatus.indexOf("Default") == -1) {
            row.toggleRowSelected(checked);
            contractIds.push(row.original.contractId);
          }
        });
        setSelectedRowIds(contractIds);
        updateDefaultContractsState({
          isAllPageRowsSelected: checked,
          checkSelectedValue: contractIds.length === 0,
        });
      },
      style: {
        cursor: "pointer",
      },
      checked: defaultContractsState.isAllPageRowsSelected,
      title: "Toggle All Current Page Rows Selected",
      indeterminate: false,
    },
  ];

  return useMemo(() => {
    return (
      <StrictMode>
        <PPMSDatatable
          title={""}
          data={
            defaultContractsState?.data?.filteredRows
              ? defaultContractsState.data.filteredRows
              : []
          }
          columns={columns}
          defaultSortField={"contractNumber"}
          onChange={(event, page) => {
            handleChangeTable(event, page);
          }}
          rowsPerPageOptions={
            defaultContractsState?.other?.page?.rowsPerPageOptions
          }
          totalRows={defaultContractsState?.other?.page?.totalRows}
          totalPages={defaultContractsState?.other?.page?.totalPages}
          rowsPerPage={defaultContractsState?.other?.page?.perPage}
          isPaginationEnabled={true}
          showFilters={true}
          serverSort={true}
          handleSort={(sortBy) => handleSort(sortBy)}
          loading={defaultContractsState.other.loading}
          hiddenColumns={["contractId", "salesId"]}
          currentPage={defaultContractsState?.other?.page?.currentPage - 1}
          bulkActions={
            UserUtils.isUserSCO() && (
              <>
                <br />
                <PPMSButton
                  variant={"primary"}
                  type={"button"}
                  value={"markAsDefault"}
                  label={"Mark as Default"}
                  className={"create-property out-button"}
                  isDisabled={defaultContractsState.checkSelectedValue}
                  onPress={() => defaultContracts()}
                  id={"mark-as-default"}
                />
              </>
            )
          }
          hideBulkActionsTitle={true}
          handleToggleAllPageRows={handleToggleAllPageRows}
          handleTogglePageRow={handleTogglePageRow}
        />
      </StrictMode>
    );
  }, [defaultContractsState, selectedRowIds]);
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DefaultContracts);
