import React, {StrictMode, useContext, useEffect, useState} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {MdEdit} from "react-icons/md";
import {FaEye} from "react-icons/fa";
import {PendingLotsListContext} from "./PendingLotsListContext";
import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PageHelper, Paths} from "../../Router";
import {formatSaleNumber,} from "../../../ui-kit/utilities/FormatUtil";

interface PendingLotsListProps {
  user?: any;
  roles?: any;
  match?: any;
  listType?: any;
}

const PendingLotsList = (props: PendingLotsListProps) => {
  const {user, roles, listType} = props;
  let salesAPIService = new SalesApiService();
  const email = user.emailAddress;
  const [hiddenColumns, updateHiddenColumns] = useState(["id"]);
  const [apiRows, setApiRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pendinglotsListState, updatePendingLotsListState } = useContext(PendingLotsListContext);
  useEffect(() => {
   
    setLoading(true);
    let filter = [];
    getCustodianLots(email, filter);
   
  }, []);

  const columns = [
    {
      Header: "Sale Number",
      accessor: "saleNumber",
      filter: "search",
      Cell: (props) => <span className="text-wrap">{props.value}</span>,
    },
    {
      Header: "Property Location",
      accessor: "propertyLocation",
      filter: "search",
    },
    {
      Header: "Custodian",
      accessor: "custodian",
      filter: "search",
    },
    {
      Header: "# of Lots",
      accessor: "lotsCount",
      filter: "search",
    },
    {
      Header: "# of Lots Approved",
      accessor: "lotsApprovedCount",
      filter: "search",
    },
    {
      Header: "SCO",
      accessor: "SCO",
      filter: "search",
    },
    {
      Header: "Alternate SCO",
      accessor: "alternateSCO",
      filter: "search",
    },
    {
      Header: "Sale Description",
      accessor: "saleDescription",
      filter: "search",
    },
    {
      Header: "Sale Start Date",
      accessor: "saleStartDate",
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
                  if (column.id === "salesNumber") {
                    filter["value"] = column["filterValue"]?.replace(/-/g, "");
                  } else {
                    filter["value"] = column["filterValue"];
                  }
                  filters.push(filter);
                });
                getCustodianLots(email, filters);
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
                getCustodianLots(email, filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: (property) => {
        let sale = property.row.original;
        return (
          <>
            <PPMSButton
              variant={"secondary"}
              label={"Review"}
              icon={<FaEye />}
              size={"sm"}
              onPress={() => {
                PageHelper.openPage(
                  `${Paths.salesLotReviewApproval}/${sale.saleId}/${sale.custodianId}`
                );
              }}
              id={"preview"}
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
  const getFilterId = (key) => {
    switch (key) {
      case "saleNumber":
        return "salesNumber";
      case "propertyLocation":
        return "salesLocation";
      case "custodian":
        return "custodian";
      case "lotsCount":
        return "lotCount";
      case "lotsApprovedCount":
        return "lotApprovedCount";
      case "SCO":
        return "sco";
      case "alternateSCO":
        return "alternateSco";
      case "saleDescription":
        return "salesDescription";
      case "saleStartDate":
        return "salesDate";
    }
  };
  const getCustodianLots = (email, filters) => {
    let params: any = {
      page: {
        page: pendinglotsListState?.other?.page.currentPage,
        size: pendinglotsListState?.other?.page?.perPage,
      },
      data: {},
    };
    params.data.salesStatus = 'Pending';
    filters?.forEach((filter) => {
      if (filter.value) {
        let id = getFilterId(filter.id);
        if (id) {
          params.data[id] = filter.value;
        }
      }
    });

    salesAPIService
      .getSalesByEmail(params, email)
      .then((response) => {
        let filteredRows =
          response && response.data && response.data.custodianSalesDTOS
            ? response.data.custodianSalesDTOS
            : [];
        if (roles.isPC) {
          updateHiddenColumns(["id", "custodian"]);
        }
        filteredRows = filteredRows.map((row) => {
          let sale = row.salesDTO?.salesNumberDetails;
          let custodian = row.lotCustodianDTO;
          let propertyLocation =
            row.lotCustodianDTO?.custodianInformation?.addressDTO;
          let obj: any = {};
          obj.saleId = sale?.id;
          obj.custodianId = custodian?.lotCustodianId;
          obj.custodian = `${custodian?.custodianInformation?.firstName}, ${custodian?.custodianInformation?.lastName}`;
          obj.email = email;
          obj.propertyLocation = `${
            propertyLocation.city && propertyLocation.city.trim() !== ""
              ? `${propertyLocation.city}, `
              : ""
          } ${
            propertyLocation.state && propertyLocation.state.trim() !== ""
              ? propertyLocation.state
              : ""
          }
          ${
            propertyLocation.zipCode && propertyLocation.zipCode.trim() !== ""
              ? propertyLocation.zipCode
              : ""
          }`;
          obj.saleNumber = formatSaleNumber(sale?.salesNumber);
          obj.lotsCount = custodian.lotIds?.length;
          obj.lotsApprovedCount = custodian?.lotApprovedCount;
          obj.SCO = `${sale?.sco?.firstName ? sale.sco.firstName : ""} ${
            sale?.sco?.lastName ? sale?.sco.lastName : ""
          }`;
          obj.alternateSCO = `${
            sale?.alternateSCO?.firstName ? sale?.alternateSCO.firstName : ""
          } ${sale?.alternateSCO?.lastName ? sale?.alternateSCO.lastName : ""}`;
          obj.saleDescription = sale?.salesDescription;
          obj.saleStartDate = sale?.salesDate;
          obj.saleStatus = sale?.salesStatus;
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
        let state = pendinglotsListState;
        pendinglotsListState.data.filteredRows = filteredRows.slice(
          0,
          pendinglotsListState?.other?.page?.perPage
        );
        pendinglotsListState.other.loading = false;
        pendinglotsListState.other.page.totalRows = totalElements;
        pendinglotsListState.other.page.totalPages = totalPages;
        setLoading(false);
        updatePendingLotsListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  const handleChangeTable = (perPage, page) => {
    let state = pendinglotsListState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    pendinglotsListState.data.filteredRows = apiData.slice(startIndex, endIndex);
    pendinglotsListState.other.page.totalRows = apiRows.length;
    pendinglotsListState.other.page.totalPages = Math.ceil(totalPages);
    pendinglotsListState.other.page.currentPage = page;
    pendinglotsListState.other.page.perPage = perPage;
    updatePendingLotsListState(state);
  };
  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
          <PPMSDatatable
            title={""}
            data={
              pendinglotsListState?.data?.filteredRows
                ? pendinglotsListState.data.filteredRows
                : []
            }
            columns={columns}
            defaultSortField={"Lot"}
            onChange={(event, page) => {
              handleChangeTable(event, page);
            }}
            rowsPerPageOptions={pendinglotsListState?.other?.page?.rowsPerPageOptions}
            totalRows={pendinglotsListState?.other?.page?.totalRows}
            totalPages={pendinglotsListState?.other?.page?.totalPages}
            rowsPerPage={pendinglotsListState?.other?.page?.perPage}
            isPaginationEnabled={true}
            showFilters={true}
            serverSort={false}
            loading={loading}
            hiddenColumns={hiddenColumns}
            currentPage={pendinglotsListState?.other?.page?.currentPage - 1}
          />
          <br></br>
        </div>
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
const mapDispatchToProps = (dispatch) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(saleAction.updateSaleInfo(saleId, saleNumber, saleAction, zone)),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PendingLotsList);
