import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { UserUtils } from "../../../../../utils/UserUtils";
import { ContractManagementContext } from "./ContractManagementListContext";
import PPMSDatatable from "../../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import { formatCurrency, formatDateTime } from "../../../../../ui-kit/utilities/FormatUtil";
import Breadcrumb from "../../common/Breadcrumb";
import { Paths } from "../../../../Router";
import { Link } from "react-router-dom";
import moment from "moment";
interface ContractManagementProps {
  actions?: any;
  location?: any;
  user?: any;
  match?: any;
  roles?: any;
  zoneList?: any;
  renderActionButtons?: any;
  title?: string;
  listFilter?: any;
}

const ContractManagementList = (props: ContractManagementProps) => {
  const {
    location,
    renderActionButtons,
    title,
    listFilter,
  } = props;
  const { contractManagementState, updateContractManagementState } = useContext(
    ContractManagementContext
  );
  const [defaultZoneId, setdefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );

  const [loading, setLoading] = React.useState(false);
  const [apiRows, setApiRows] = React.useState([]);
  let salesApiService = new SalesApiService();
  let commonApiService = new CommonApiService();

  function handleChange({ selectedIndex }) {
    let state = contractManagementState;
    if (selectedIndex === 0) {
      state.zone.zoneRegions = [];
      state.zone.isZoneEmpty = true;
      state.zone.validationMessage = "Please select a zone.";
    } else {
      state.zone.isAddAllDisabled = false;
      const zoneID = contractManagementState.zone.zoneList[selectedIndex - 1]
        ? contractManagementState.zone.zoneList[selectedIndex - 1].zoneId
        : "";
      setdefaultZoneId(zoneID);
      let zoneRegions = [];
      commonApiService
        .getZoneRegions(zoneID)
        .then((response: any) => {
          response?.data.forEach((region) => {
            zoneRegions.push(region.regionCode);
          });
          let state = contractManagementState;
          state.zone.selectedZone = zoneID;
          state.zone.zoneRegions = zoneRegions;
          state.zone.isZoneEmpty = false;
          state.zone.validationMessage = "";
          let filters = [];
          let filter = {};
          filter["id"] = "zoneId";
          filter["value"] = parseInt(zoneID);
          filters.push(filter);
          filters.push(listFilter);
          getContractRefundDetails(filters);
          updateContractManagementState(state);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
    updateContractManagementState(state);
  }

  let handleChangeTable = (perPage, page) => {
    let state = contractManagementState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    contractManagementState.data.filteredRows = apiData.slice(
      startIndex,
      endIndex
    );
    contractManagementState.other.page.totalRows = apiRows.length;
    contractManagementState.other.page.totalPages = Math.ceil(totalPages);
    contractManagementState.other.page.currentPage = page;
    contractManagementState.other.page.perPage = perPage;
    updateContractManagementState(state);
  };

  let getContractRefundDetails = (filters: any) => {
    let data = {
      params: {
        page: contractManagementState.other.page.currentPage,
        size: contractManagementState?.other?.page?.perPage,
      },
    };
    filters?.forEach((filter) => {
      if (filter.value) {
        data[filter.id] = filter.value;
      }
    });
    salesApiService
      .getContractRefundDetails(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.contractRefundDTOList
            ? response.data.contractRefundDTOList
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.contractNumber = row.contractNumber;
          obj.bidderUsername = row.bidderUsername;
          obj.bidderEmail = row.bidderEmail;
          obj.awardAmount = formatCurrency.format(row.awardAmount);
          obj.amountPaid = formatCurrency.format(row.amountPaid);
          obj.paymentDate = row.paymentDate
            ? formatDateTime(row.paymentDate)
            : "";
          obj.status = row.status;
          obj.contractId = row.id;
          obj.saleId = row.saleId
          return obj;
        });
        setApiRows(filteredRows);
        console.log({ apiRows, filteredRows });
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        let state = contractManagementState;
        state.data.filteredRows = filteredRows.slice(
          0,
          state?.other?.page?.perPage
        );
        state.other.loading = false;
        state.other.page.totalRows = totalElements;
        state.other.page.totalPages = totalPages;
        setLoading(false);
        updateContractManagementState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const columns = [
    {
      Header: "Contract",
      accessor: "contractNumber",
      filter: "search",
      width: 220,
      Cell: (data) => {
        return (
          <Link
            to={
              Paths.contractTransaction +
              `/${data.row.original.saleId}/${data.row.original.contractId}?contractNumber=${
                data.row.values.contractNumber.split("-")[0]
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
      Header: "Bidder User Name",
      accessor: "bidderUsername",
      filter: "search",
    },
    {
      Header: "Bidder Email",
      accessor: "bidderEmail",
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
      Header: "Payment Date",
      accessor: "paymentDate",
      filter: "search",
    },
    {
      Header: "Status",
      accessor: "status",
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
                  if(column.id ==="paymentDate"){
                    filter["value"] = moment(column["filterValue"], "MM/DD/YYYY hh:mmA").format("YYYY-MM-DDThh:mm:ss");
                  }
                  filters.push(filter);
                  let zoneFilter = {};
                  zoneFilter["id"] = "zoneId";
                  zoneFilter["value"] = parseInt(defaultZoneId);
                  filters.push(zoneFilter);
                  filters.push(listFilter);
                });
                getContractRefundDetails(filters);
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
                let filter = {};
                filter["id"] = "zoneId";
                filter["value"] = parseInt(defaultZoneId);
                filters.push(filter);
                filters.push(listFilter);
                getContractRefundDetails(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (contract) => {
        return <>{renderActionButtons ? renderActionButtons(contract) : ""}</>;
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];
  useEffect(() => {
    setLoading(true);
    let filters = [];
    const data = {
      params: {
        zoneIds: UserUtils.getUserZones().join(","),
      },
    };
    commonApiService
      .getZoneSalesControlList(data)
      .then((response: any) => {
        let state = contractManagementState;
        state.zone.zoneList = response?.data;
        updateContractManagementState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    let zoneIdRegions = UserUtils.getDefaultZones();
    let zoneRegions = [];

    commonApiService
      .getZoneRegions(zoneIdRegions)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.regionCode);
        });
        let state = contractManagementState;
        state.zone.zoneRegions = zoneRegions;
        updateContractManagementState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    let filter = {};
    filter["id"] = "zoneId";
    filter["value"] = parseInt(zoneIdRegions);
    filters.push(filter);
    filters.push(listFilter);
    getContractRefundDetails(filters);
  }, [
    contractManagementState.other.page.currentPage,
    contractManagementState.other.page.perPage,
  ]);
  return (
    <div className="ui-ppms">
      <Breadcrumb pathname={location} />
      <PPMSDatatable
        title={title}
        data={
          contractManagementState.data.filteredRows
            ? contractManagementState.data.filteredRows
            : []
        }
        subHeaderComponent={
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <div className={"grid-row grid-gap-2"}>
                <div className={"grid-col-4"}>
                  <PPMSSelect
                    id={"select-zone"}
                    title={"select-zones"}
                    placeholderValue={"Select Zone"}
                    label={"Zone"}
                    identifierKey={"zoneId"}
                    identifierValue={"zoneName"}
                    values={contractManagementState.zone.zoneList}
                    isRequired={true}
                    isInvalid={contractManagementState.zone.isZoneEmpty}
                    validationMessage={
                      contractManagementState.zone.validationMessage
                    }
                    selectedValue={defaultZoneId}
                    onChange={(event) => handleChange(event.target)}
                  />
                </div>
                <div className={"grid-col-3"}>
                  <PPMSInput
                    isDisabled={true}
                    id={"regions"}
                    name={"regions"}
                    inputType={"text"}
                    label={"Regions"}
                    isRequired={true}
                    value={contractManagementState.zone.zoneRegions.toString()}
                    minLength={0}
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
          </div>
        }
        columns={columns}
        defaultSortField={"userId"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={
          contractManagementState?.other?.page?.rowsPerPageOptions
        }
        totalRows={contractManagementState?.other?.page?.totalRows}
        totalPages={contractManagementState?.other?.page?.totalPages}
        rowsPerPage={contractManagementState?.other?.page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={loading}
        hiddenColumns={["id"]}
        currentPage={contractManagementState?.other?.page?.currentPage - 1}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractManagementList);
