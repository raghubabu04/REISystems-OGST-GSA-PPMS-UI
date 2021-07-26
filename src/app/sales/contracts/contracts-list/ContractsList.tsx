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
  formatCurrency,
  getDateFrom,
  getDateTo,
  oneToThreeDigitFormatter,
} from "../../../../ui-kit/utilities/FormatUtil";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";

import { addToast } from "../../../../_redux/_actions/toast.actions";
import queryString from "query-string";
import { PageHelper, Paths } from "../../../Router";
import { Link } from "react-router-dom";
import { saleActions } from "../../../../_redux/_actions/sale.actions";
import { ContractsListContext } from "./ContractsListContext";
import Breadcrumb from "../../management/common/Breadcrumb";
import SalesSideNav from "../../management/common/SideNav";
import SaleNumberDetails from "../../management/common/SaleNumberDetails";

interface ContractsListProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
  lotId?: any;
}

const ContractList = (props: ContractsListProps) => {
  const { match, location, updateSaleInfo, roles, user } = props;
  let salesAPIService = new SalesApiService();
  const { contractsListState, updateContractsListState } = useContext(
    ContractsListContext
  );

  const [loading, setLoading] = useState(false);
  const [salesDetails, setSalesDetails] = useState(false);
  const [contractNum, setContractNum] = useState(false);
  let search = location.search;
  let query = queryString.parse(search);

  let saleId = null;

  if (match.params.saleId) {
    saleId = match.params.saleId;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getSaleDetails();
    setLoading(true);
    getContracts([{}]);
  }, []);

  const columns = [
    {
      Header: "Contract Number",
      accessor: "contractNumber",
      id: "contractNumber",
      filter: "search",      
      Cell: (data) => {
        return (
          <Link
            to={
              Paths.contractTransaction +
              `/${saleId}/${data.row.original.contractId}?contractNumber=${
                data.row.values.contractNumber
              }`
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
      Header: "FSC",
      accessor: "fscCode",
      filter: "search",
      
    },
    {
      Header: "Award amount",
      accessor: "awardAmount",
      Cell: (data:any) => {
        var awardAmount = formatCurrency.format(data.row.values["awardAmount"]);
        return <div style={{ textAlign: "right" }}>{awardAmount}</div>
      },
      filter: "search",
    },
    {
      Header: "Lot Name",
      accessor: "lotName",
      filter: "search",
    },
    {
      Header: "Payment Due Date",
      accessor: "paymentDate",
      filter: "search",
    },
    {
      Header: "Removal Due Date",
      accessor: "removalDate",
      filter: "search",
    },
    {
      Header: "Bidder Email",
      accessor: "bidderEmail",
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "contractStatus",
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
                  if (column.id === "contractNumber") {
                    filter["value"] =
                      column["filterValue"]?.split("-")[0];
                  } else {
                    filter["value"] = column["filterValue"];
                  }
                  filters.push(filter);
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
              className="manage-list-actions"
              isDisabled={contractsListState.actionDisabled}
            />
            <PPMSButton
              variant={"secondary"}
              label={"View"}
              icon={<FaEye />}
              size={"sm"}
              onPress={() => onClickAction(contractInfo, "view")}
              id={"viewContract"}
              className="manage-list-actions"
              isDisabled={!contractsListState.actionDisabled}
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
    let filter: any = contractsListState.other.filter;
    let data: any = {
      ...filter,
      params: {
        page,
        size: perPage,
      },
    };

    if (contractsListState.other.page.sort) {
      data.params["sort"] = contractsListState.other.page.sort;
    }

    try {
      let getContractsListResponse = await salesAPIService.getContractsListBySalesId(
        data
      );
      let filteredRows = getContractsListResponse?.data
        ?.contractSearchResultList
        ? getContractsListResponse.data.contractSearchResultList
        : [];
      filteredRows = filteredRows.map((row) => {
        let contractInfo: any = {};
        contractInfo.contractNumber = row.contractNumber? row.contractNumber:"";
        contractInfo.awardAmount=row.lotName? row.awardAmount:"";
        contractInfo.lotName=row.lotName? row.lotName:"";
        contractInfo.contractId = row.contractId ? row.contractId : "";
        contractInfo.fscCode = row.fscCode ? row.fscCode : "";
        contractInfo.paymentDate = row.paymentDate ? row.paymentDate : "";
        contractInfo.removalDate = row.removalDate ? row.removalDate : "";
        contractInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        contractInfo.contractStatus = row.contractStatus
          ? row.contractStatus
          : "";
        contractInfo.canEdit = row.canEdit ? row.canEdit : "";
        return contractInfo;
      });
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      contractsListState.data.filteredRows = filteredRows;
      contractsListState.other.loading = false;
      contractsListState.other.page.totalRows = totalElements;
      contractsListState.other.page.totalPages = totalPages;
      contractsListState.other.page.currentPage = page;
      contractsListState.other.page.perPage = perPage;
      contractsListState.other.filter = data;
      setLoading(false);
      let state = contractsListState;
      updateContractsListState(state);
    } catch (error) {
      console.error("ContractList Page has error on handleChangeTable");
    }
  };

  const getContracts = async (filters: any) => {
    let contractNumber;
    let contractStatus;
    let bidderEmail;
    let fscCode;
    let paymentDate;
    let removalDate;
    let lotName;
    let awardAmount

    filters?.forEach((filter) => {
      if (filter?.value) {
        switch (filter.id) {
          case "contractNumber":
            contractNumber = filter["value"]?.trim();
            break;
          case "contractStatus":
            contractStatus = filter["value"]?.trim();
            break;
          case "bidderEmail":
            bidderEmail = filter["value"]?.trim();
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
          case "awardAmount":
            awardAmount = filter["value"]?.trim();
            break;
          case "lotName":
            lotName = filter["value"]?.trim();
            break;
        }
      }
    });

    let paymentDateFrom = paymentDate ? getDateFrom(paymentDate) : "";
    let paymentDateTo = paymentDate ? getDateTo(paymentDate) : "";
    let removalDateFrom = removalDate ? getDateFrom(removalDate) : "";
    let removalDateTo = removalDate ? getDateTo(removalDate) : "";

    let filter: any = {
      contractNumber,
      contractStatus,
      bidderEmail,
      fscCode,
      paymentDateFrom,
      paymentDateTo,
      removalDateFrom,
      removalDateTo,
      awardAmount,
      lotName,
      salesId: saleId,
    };

    let data: any = {
      ...filter,
      params: {
        page: 1,
        size: contractsListState?.other?.page?.perPage,
      },
    };

    if (contractsListState.other.page.sort) {
      data.params["sort"] = contractsListState.other.page.sort;
    }

    try {
      let getContractsListResponse = await salesAPIService.getContractsListBySalesId(
        data
      );
      let filteredRows = getContractsListResponse?.data
        ?.contractSearchResultList
        ? getContractsListResponse.data.contractSearchResultList
        : [];
      filteredRows = filteredRows.map((row) => {
        let contractInfo: any = {};
        contractInfo.contractNumber = row.contractNumber? row.contractNumber:"";
        contractInfo.awardAmount=row.lotName? row.awardAmount:"";
        contractInfo.lotName=row.lotName? row.lotName:"";
        contractInfo.contractId = row.contractId ? row.contractId : "";
        contractInfo.fscCode = row.fscCode ? row.fscCode : "";
        contractInfo.paymentDate = row.paymentDate ? row.paymentDate : "";
        contractInfo.removalDate = row.removalDate ? row.removalDate : "";
        contractInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        contractInfo.contractStatus = row.contractStatus
          ? row.contractStatus
          : "";
        contractInfo.canEdit = row.canEdit ? row.canEdit : "";
        return contractInfo;
      });
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      contractsListState.data.filteredRows = filteredRows;
      contractsListState.other.loading = false;
      contractsListState.other.page.totalRows = totalElements;
      contractsListState.other.page.totalPages = totalPages;
      contractsListState.other.page.currentPage = 1;
      contractsListState.other.filter = filter;
      setLoading(false);
      let state = contractsListState;
      updateContractsListState(state);
    } catch (error) {
      console.error("ContractList Page has error on getContracts API");
    }
  };
  function getSaleDetails() {
    salesAPIService
      .getSaleDetails(saleId)
      .then((res) => {
        let details = res.data.salesNumberDetails;
        setSalesDetails(details);
        let todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);
        if (
          details.sco.email === user.emailAddress ||
          details?.alternateSCO?.email === user.emailAddress ||
          roles.isSG
        ) {
          updateContractsListState({
            actionDisabled: false,
          });
        } else {
          updateContractsListState({
            actionDisabled: true,
          });
        }
      })
      .catch((err) => {});
  }
  const handleSort = async (sortBy) => {
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;
    let filter: any = contractsListState.other.filter;
    let data: any = {
      ...filter,
      params: {
        page: 1,
        size: contractsListState.other.page.perPage,
        sort: sort,
      },
    };
    try {
      let getContractsListResponse = await salesAPIService.getContractsListBySalesId(
        data
      );
      let filteredRows = getContractsListResponse?.data
        ?.contractSearchResultList
        ? getContractsListResponse.data.contractSearchResultList
        : [];
      filteredRows = filteredRows.map((row) => {
        let contractInfo: any = {};
        contractInfo.contractNumber = row.contractNumber? row.contractNumber:"";
        contractInfo.awardAmount=row.lotName? row.awardAmount:"";
        contractInfo.lotName=row.lotName? row.lotName:"";
        contractInfo.contractId = row.contractId ? row.contractId : "";
        contractInfo.fscCode = row.fscCode ? row.fscCode : "";
        contractInfo.paymentDate = row.paymentDate ? row.paymentDate : "";
        contractInfo.removalDate = row.removalDate ? row.removalDate : "";
        contractInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        contractInfo.contractStatus = row.contractStatus
          ? row.contractStatus
          : "";
        contractInfo.canEdit = row.canEdit ? row.canEdit : "";
        return contractInfo;
      });
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      contractsListState.data.filteredRows = filteredRows;
      contractsListState.other.loading = false;
      contractsListState.other.page.totalRows = totalElements;
      contractsListState.other.page.totalPages = totalPages;
      contractsListState.other.page.currentPage = data.params.page;
      contractsListState.other.filter = data;
      setLoading(false);
      let state = contractsListState;
      updateContractsListState(state);
    } catch (error) {
      console.error("ContractList Page has error on handleSort");
    }
  };

  const renderSelectButtons = () => {
    return <div></div>;
  };

  const onClickAction = (contractInfo, action) => {
    let contractNumber = contractInfo.contractNumber;
    let contractId = "";
    setContractNum(contractNumber);
    contractsListState.data.filteredRows.map((contract) => {
      if (contract.contractNumber === contractInfo.contractNumber)
        contractId = contract.contractId;
      return;
    });

    updateSaleInfo(
      saleId,
      props.sale.saleNumber,
      action,
      parseInt(props.sale?.saleNumber?.substr(0, 1)),
      contractNumber,
      contractId
    );
    updateContractsListState({
      saleId: saleId,
      contractNumber,
      contractId,
      actionDisabled: action === "Edit" ? false : true,
    });
    PageHelper.openPage(
      Paths.contractTransaction +
        `/${saleId}/${contractId}?contractNumber=${contractNumber}`
    );
  };

  return useMemo(() => {
    return (
      <StrictMode>
        <div className={"ui-ppms grid-row grid-gap-4"}>
          <Breadcrumb
            pathname={location.pathname}
            zoneId={query}
            saleId={saleId}
            contractNumber={contractNum}
          />
          <div className="grid-row header-row mb-3">
            <h1>Contracts List</h1>
          </div>
          <div className="usa-layout-docs__sidenav desktop:grid-col-3">
            <div className={`sticky-wrapper sticky`}>
              <div className={"sticky-inner"}>
                <nav aria-label="Secondary navigation">
                  <h3>Sales Management</h3>
                  <SalesSideNav
                    saleId={saleId}
                    zoneId={query.zoneId}
                    currentPage={Paths.salesContractsList}
                  />
                </nav>
              </div>
            </div>
          </div>
          <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
            <SaleNumberDetails saleId={saleId} zoneId={query.zoneId} />
            {renderSelectButtons()}
            <PPMSDatatable
              title={""}
              data={
                contractsListState?.data?.filteredRows
                  ? contractsListState.data.filteredRows
                  : []
              }
              columns={columns}
              defaultSortField={"contractNumber"}
              onChange={(event, page) => {
                handleChangeTable(event, page);
              }}
              rowsPerPageOptions={
                contractsListState?.other?.page?.rowsPerPageOptions
              }
              totalRows={contractsListState?.other?.page?.totalRows}
              totalPages={contractsListState?.other?.page?.totalPages}
              rowsPerPage={contractsListState?.other?.page?.perPage}
              isPaginationEnabled={true}
              showFilters={true}
              serverSort={true}
              handleSort={(sortBy) => handleSort(sortBy)}
              loading={contractsListState.other.loading}
              hiddenColumns={["id"]}
              currentPage={contractsListState?.other?.page?.currentPage - 1}
            />
            <br></br>
            {renderSelectButtons()}
          </div>
        </div>
      </StrictMode>
    );
  }, [contractsListState]);
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  zones: state.authentication.zones,
  roles: state.authentication.roles,
  sale: state.sale,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (
      saleId,
      saleNumber,
      saleAction,
      zone,
      contractNumber,
      contractId
    ) =>
      dispatch(
        saleActions.updateSaleInfo(
          saleId,
          saleNumber,
          saleAction,
          zone,
          contractNumber,
          contractId
        )
      ),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ContractList);
