import React, { StrictMode, useContext, useEffect, useState } from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import {
  formatCurrency,
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
import queryString from "query-string";
import { PageHelper, Paths } from "../../../Router";
import { Link } from "react-router-dom";
import { saleActions } from "../../../../_redux/_actions/sale.actions";
import { UserUtils } from "../../../../utils/UserUtils";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { ManageContractsContext } from "./ManageContractsContext";
import Breadcrumb from "../../management/common/Breadcrumb";
import { zoneValues } from "./Constants";

interface ContractsListProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
}

const ContractsSearch = (props: ContractsListProps) => {
  const { location, updateSaleInfo, roles } = props;
  const { manageContractsState, updateManageContractsState } = useContext(
    ManageContractsContext
  );
  const [defaultZoneId, setDefaultZoneId] = useState(
    UserUtils.getDefaultZones()
  );
  const [loading, setLoading] = useState(false);
  const salesAPIService = new SalesApiService();
  const commonApiService = new CommonApiService();

  let search = location.search;
  let query = queryString.parse(search);
  let zone = [];
  zone.push(query?.zoneId);

  useEffect(() => {
    getZone();
    setLoading(true);
    getContracts([{}]);
  }, []);

  useEffect(() => {
    getContracts([{}]);
  }, [manageContractsState.zone.selectedZone]);

  const columns = [
    {
      Header: "Contract Number",
      accessor: "contractNumber",
      id: "contractNumber",
      filter: "search",
      width: 220,
      Cell: (data) => {
        return (
          <Link
            to={
              Paths.contractTransaction +
              `/${data.row.values.salesId}/${
                data.row.original.contractId
              }?contractNumber=${data.row.values.contractNumber}`
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
      Header: "Sale/Lot Number",
      accessor: "salesOrLotNumber",
      filter: "search",
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
      Header: "Sco Email",
      accessor: "scoEmail",
      id: "scoEmail",
    },
    {
      Header: "Alt. SCO Email",
      accessor: "alternateScoEmail",
      id: "alternateScoEmail",
    },
     
    {
      Header: "Sales Id",
      accessor: "salesId",
      id: "salesId",
    }, 
    {
      Header: "Sales Number",
      accessor: "salesNumber",
      id: "salesNumber",
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
            {contractInfo.canEdit ? (
              <PPMSButton
                variant={"secondary"}
                label={"Edit"}
                size={"sm"}
                icon={<MdEdit />}
                onPress={() => onClickAction(contractInfo, "edit")}
                id={"editContract"}
              />
            ) : (
              <PPMSButton
                variant={"secondary"}
                label={"View"}
                icon={<MdEdit />}
                size={"sm"}
                onPress={() => onClickAction(contractInfo, "view")}
                id={"viewContract"}
              />
            )}
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
    let filter: any = manageContractsState.other.filter;
    let data: any = {
      ...filter,
      params: {
        page,
        size: perPage,
      },
    };

    if (manageContractsState.other.page.sort) {
      data.params["sort"] = manageContractsState.other.page.sort;
    }

    try {
      let getContractsListResponse = await salesAPIService.searchContracts(
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
        contractInfo.salesOrLotNumber = formatSaleNumber(row.salesNumber? row.salesOrLotNumber:"");
        contractInfo.lotName=row.lotName? row.lotName:"";
        contractInfo.contractId = row.contractId ? row.contractId : "";
        contractInfo.fscCode = row.fscCode ? row.fscCode : "";
        contractInfo.paymentDate = row.paymentDate ? row.paymentDate : "";
        contractInfo.removalDate = row.removalDate ? row.removalDate : "";
        contractInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        contractInfo.contractStatus = row.contractStatus
          ? row.contractStatus
          : "";
        contractInfo.scoEmail = row.scoEmail ? row.scoEmail : "";
        contractInfo.alternateScoEmail = row.alternateScoEmail
          ? row.alternateScoEmail
          : "";
        contractInfo.salesNumber = row.salesNumber ? row.salesNumber : "";
        contractInfo.canEdit = row.canEdit ? row.canEdit : "";
        contractInfo.salesId = row.salesId ? row.salesId : "";
        return contractInfo;
      });
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      manageContractsState.data.filteredRows = filteredRows;
      manageContractsState.other.loading = false;
      manageContractsState.other.page.totalRows = totalElements;
      manageContractsState.other.page.totalPages = totalPages;
      manageContractsState.other.page.currentPage = page;
      manageContractsState.other.page.perPage = perPage;
      manageContractsState.other.filter = data;
      setLoading(false);
      let state = manageContractsState;
      updateManageContractsState(state);
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
    let salesOrLotNumber;
    let lotName;
    let awardAmount;

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
          case "salesOrLotNumber":
            salesOrLotNumber = filter["value"]?.trim().replaceAll("-", "");
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
      salesOrLotNumber,
      lotName,
      zoneId: (!roles.isFIN && !roles.isFIA)?(manageContractsState.zone.selectedZone
        ? manageContractsState.zone.selectedZone
        : defaultZoneId)
        :null,
      fleetZones: (roles.isFIN || roles.isFIA)?
      (manageContractsState.zone.selectedZone === "0" 
      ? [12,13,14,15] : [manageContractsState.zone.selectedZone])
      :null,
    };

    let data: any = {
      ...filter,
      params: {
        page: 1,
        size: manageContractsState?.other?.page?.perPage,
      },
    };

    if (manageContractsState.other.page.sort) {
      data.params["sort"] = manageContractsState.other.page.sort;
    }

    try {
      let getContractsListResponse = await salesAPIService.searchContracts(
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
        contractInfo.salesOrLotNumber=formatSaleNumber(row.salesNumber? row.salesOrLotNumber:"");
        contractInfo.lotName=row.lotName? row.lotName:"";
        contractInfo.contractId = row.contractId ? row.contractId : "";
        contractInfo.fscCode = row.fscCode ? row.fscCode : "";
        contractInfo.paymentDate = row.paymentDate ? row.paymentDate : "";
        contractInfo.removalDate = row.removalDate ? row.removalDate : "";
        contractInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        contractInfo.contractStatus = row.contractStatus
          ? row.contractStatus
          : "";
        contractInfo.scoEmail = row.scoEmail ? row.scoEmail : "";
        contractInfo.alternateScoEmail = row.alternateScoEmail
          ? row.alternateScoEmail
          : "";
        contractInfo.salesNumber = row.salesNumber ? row.salesNumber : "";
        contractInfo.canEdit = row.canEdit ? row.canEdit : "";
        contractInfo.salesId = row.salesId ? row.salesId : "";
        return contractInfo;
      });
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      manageContractsState.data.filteredRows = filteredRows;
      manageContractsState.other.loading = false;
      manageContractsState.other.page.totalRows = totalElements;
      manageContractsState.other.page.totalPages = totalPages;
      manageContractsState.other.page.currentPage = 1;
      manageContractsState.other.filter = filter;
      setLoading(false);
      let state = manageContractsState;
      updateManageContractsState(state);
    } catch (error) {
      console.error("ContractList Page has error on getContracts API");
    }
  };

  const handleSort = async (sortBy) => {
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;
    let filter: any = manageContractsState.other.filter;
    filter.zoneId = (!roles.isFIN && !roles.isFIA)?(manageContractsState.zone.selectedZone
      ? manageContractsState.zone.selectedZone
      : defaultZoneId)
      :null;
    filter.fleetZones = (roles.isFIN || roles.isFIA)?
      (manageContractsState.zone.selectedZone === "0" 
      ? [12,13,14,15] : [manageContractsState.zone.selectedZone])
      :null;
    let data: any = {
      ...filter,
      params: {
        page: 1,
        size: manageContractsState.other.page.perPage,
        sort: sort,
      },
    };

    try {
      let getContractsListResponse = await salesAPIService.searchContracts(
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
        contractInfo.salesOrLotNumber=formatSaleNumber(row.salesNumber? row.salesOrLotNumber:"");
        contractInfo.lotName=row.lotName? row.lotName:"";
        contractInfo.contractId = row.contractId ? row.contractId : "";
        contractInfo.fscCode = row.fscCode ? row.fscCode : "";
        contractInfo.paymentDate = row.paymentDate ? row.paymentDate : "";
        contractInfo.removalDate = row.removalDate ? row.removalDate : "";
        contractInfo.bidderEmail = row.bidderEmail ? row.bidderEmail : "";
        contractInfo.contractStatus = row.contractStatus
          ? row.contractStatus
          : "";
        contractInfo.scoEmail = row.scoEmail ? row.scoEmail : "";
        contractInfo.alternateScoEmail = row.alternateScoEmail
          ? row.alternateScoEmail
          : "";
        contractInfo.salesNumber = row.salesNumber ? row.salesNumber : "";
        contractInfo.canEdit = row.canEdit ? row.canEdit : "";
        contractInfo.salesId = row.salesId ? row.salesId : "";
        return contractInfo;
      });
      let totalElements = getContractsListResponse?.data?.totalElements
        ? getContractsListResponse.data.totalElements
        : 0;
      let totalPages = getContractsListResponse?.data?.totalPages
        ? getContractsListResponse.data.totalPages
        : 0;
      manageContractsState.data.filteredRows = filteredRows;
      manageContractsState.other.loading = false;
      manageContractsState.other.page.totalRows = totalElements;
      manageContractsState.other.page.totalPages = totalPages;
      manageContractsState.other.page.currentPage = data.params.page;
      manageContractsState.other.filter = data;
      setLoading(false);
      let state = manageContractsState;
      updateManageContractsState(state);
    } catch (error) {
      console.error("ContractList Page has error on handleSort");
    }
  };

  const handleZoneChange = async ({ selectedIndex }) => {
    let state = manageContractsState;
    if(!roles.isFIA && !roles.isFIN){
    if (selectedIndex === 0) {
      state.zone.zoneRegions = [];
      state.zone.isZoneEmpty = true;
      state.zone.validationMessage = "Please select a zone.";
      setDefaultZoneId("0");
      manageContractsState.zone.selectedZone = "0";
      updateManageContractsState(state);
    } else {
      state.zone.isAddAllDisabled = false;
      const zoneID = manageContractsState.zone.zoneList[selectedIndex - 1]
        ? manageContractsState.zone.zoneList[selectedIndex - 1].zoneId
        : "";
      setDefaultZoneId(zoneID);
      let zoneRegions = [];

      try {
        const zoneRegionsRes = await commonApiService.getZoneRegions(zoneID);
        zoneRegionsRes?.data.forEach((region) => {
          zoneRegions.push(region.regionCode);
        });
        let state = manageContractsState;
        state.zone.selectedZone = zoneID;
        state.zone.zoneRegions = zoneRegions;
        state.zone.isZoneEmpty = false;
        state.zone.validationMessage = "";
        updateManageContractsState(state);
      } catch (error) {
        console.log(error);
        return error;
      }
    }
    updateSaleInfo(null, null, null, parseInt(state.zone.selectedZone));
   }else{
    let data = {};
    let state = manageContractsState;
    if (selectedIndex === 0) {
      data = {
        zoneIds: "12,13,14,15",
      };
    } else {
      data = {
        zoneIds: selectedIndex + 11,
      };
    }
    let zoneRegions = [];
    commonApiService
      .getRegionsForZones(data)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.toString().split("-")[0].trim());
        }); 
        if(selectedIndex === 0){
          state.zone.selectedZone = "0";
        }else{    
        state.zone.selectedZone =  selectedIndex + 11;
        }
        state.zone.zoneRegions = zoneRegions;
        state.zone.isZoneEmpty = false;
        state.zone.validationMessage = "";
        updateManageContractsState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
      updateSaleInfo(null, null, null, parseInt(state.zone.selectedZone));
   }
   updateManageContractsState(state);
  };

  const getZone = async () => {
    if (!roles.isFIA && !roles.isFIN) {
    const data = {
      params: {
        zoneIds: UserUtils.getUserZones().join(","),
      },
    };

    let zoneIdRegions = UserUtils.getDefaultZones();
    let zoneRegions = [];

    try {
      const zoneSalesControlListRes = await commonApiService.getZoneSalesControlList(
        data
      );
      let state = manageContractsState;
      state.zone.zoneList = zoneSalesControlListRes?.data;

      const zoneRegionsRes = await commonApiService.getZoneRegions(
        zoneIdRegions
      );
      zoneRegionsRes?.data.forEach((region) => {
        zoneRegions.push(region.regionCode);
      });
      state.zone.zoneRegions = zoneRegions;

      updateManageContractsState(state);
    } catch (error) {
      console.log(error);
      return error;
    }
   }else{
    let zoneData = {
      zoneIds: "12,13,14,15",
    };
    let zoneRegions = [];

    commonApiService
      .getRegionsForZones(zoneData)
      .then((response: any) => {
        response?.data.forEach((region) => {
          zoneRegions.push(region.toString().split("-")[0].trim());
        });
        let state = manageContractsState;
        state.zone.selectedZone = "0";
        console.log("state.zone.fleetZoneList[0]; " + state.zone.fleetZoneList[0]);
        state.zone.zoneRegions = zoneRegions;
        state.zone.isZoneEmpty = false;
        state.zone.validationMessage = "";
        updateManageContractsState(state);
      })
      .catch((error) => {
        console.log(error);
      });
   }
  };

  const onClickAction = (contractInfo, action) => {
    let contractNumber = contractInfo.contractNumber;
    let contractId = "";
    let salesId = contractInfo?.salesId;
    manageContractsState.data.filteredRows.map((contract) => {
      if (contract.contractNumber === contractInfo.contractNumber)
        contractId = contract.contractId;
      return;
    });
    updateSaleInfo(
      salesId,
      contractInfo.saleNumber,
      action,
      parseInt(contractInfo?.salesNumber.substr(0, 1)),
      contractNumber,
      contractId
    );
    updateManageContractsState({
      contractNumber,
      contractId,
    });
    PageHelper.openPage(
      Paths.contractTransaction +
        `/${salesId}/${contractId}?contractNumber=${contractNumber}`
    );
  };

  return (
    <StrictMode>
      <div className="ui-ppms">
        <Breadcrumb pathname={location.pathname} zoneId={defaultZoneId} />
        <PPMSDatatable
          title={"Contracts Management"}
          data={
            manageContractsState?.data?.filteredRows
              ? manageContractsState.data.filteredRows
              : []
          }
          columns={columns}
          defaultSortField={"contractNumber"}
          onChange={(event, page) => {
            handleChangeTable(event, page);
          }}
          rowsPerPageOptions={
            manageContractsState?.other?.page?.rowsPerPageOptions
          }
          totalRows={manageContractsState?.other?.page?.totalRows}
          totalPages={manageContractsState?.other?.page?.totalPages}
          rowsPerPage={manageContractsState?.other?.page?.perPage}
          isPaginationEnabled={true}
          showFilters={true}
          serverSort={true}
          handleSort={(sortBy) => handleSort(sortBy)}
          loading={loading}
          hiddenColumns={[
            "id",
            "scoEmail",
            "alternateScoEmail",
            "salesNumber",
            "salesId",
            "canEdit",
          ]}
          currentPage={manageContractsState?.other?.page?.currentPage - 1}
          subHeaderComponent={
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                <div className={"grid-row grid-gap-2"}>
                  <div className={"grid-col-4"}>
                    <PPMSSelect
                      id={"select-zone"}
                      title={"select-zones"}
                      placeholderValue={(roles.isFIA || roles.isFIN)?
                         "All Zones" : "Select Zone"}
                      label={"Zone"}
                      identifierKey={"zoneId"}
                      identifierValue={"zoneName"}
                      values={(roles.isFIA || roles.isFIN)?
                        zoneValues : manageContractsState.zone.zoneList
                      }
                      isRequired={true}
                      isInvalid={manageContractsState.zone.isZoneEmpty}
                      validationMessage={
                        manageContractsState.zone.validationMessage
                      }
                      selectedValue={defaultZoneId}
                      onChange={(event) => handleZoneChange(event.target)}
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
                      value={manageContractsState.zone.zoneRegions.toString()}
                      minLength={0}
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </StrictMode>
  );
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
export default connect(mapStateToProps, mapDispatchToProps)(ContractsSearch);
