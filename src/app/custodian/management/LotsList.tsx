import React, {StrictMode, useContext, useEffect, useState} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import {addToast} from "../../../_redux/_actions/toast.actions";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";
import {MdEdit} from "react-icons/md";
import {FaEye} from "react-icons/fa";
import {LotsListContext} from "./LotsListContext";
import PendingLotsList from "./PendingLotsList"; 
import {PendingLotsListContextProvider} from "./PendingLotsListContext"; 

import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PageHelper, Paths} from "../../Router";
import {formatSaleNumber,} from "../../../ui-kit/utilities/FormatUtil";

interface LotsListProps {
  user: any;
  roles: any;
  match: any;
}

const LotsList = (props: LotsListProps) => {
  const {user, roles} = props;
  let salesAPIService = new SalesApiService();
  const email = user.emailAddress;
  const [hiddenColumns, updateHiddenColumns] = useState(["id"]);
  const [apiRows, setApiRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lotsListState, updateLotsListState } = useContext(LotsListContext);
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
        page: lotsListState.other.page.currentPage,
        size: lotsListState?.other?.page?.perPage,
      },
      data: {},
    };
    params.data.salesStatus = 'completed';
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
        let state = lotsListState;
        lotsListState.data.filteredRows = filteredRows.slice(
          0,
          lotsListState?.other?.page?.perPage
        );
        lotsListState.other.loading = false;
        lotsListState.other.page.totalRows = totalElements;
        lotsListState.other.page.totalPages = totalPages;
        setLoading(false);
        updateLotsListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  const handleChangeTable = (perPage, page) => {
    let state = lotsListState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    lotsListState.data.filteredRows = apiData.slice(startIndex, endIndex);
    lotsListState.other.page.totalRows = apiRows.length;
    lotsListState.other.page.totalPages = Math.ceil(totalPages);
    lotsListState.other.page.currentPage = page;
    lotsListState.other.page.perPage = perPage;
    updateLotsListState(state);
  };
  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <div className="grid-row header-row mb-3">
          <h1>Lot Management</h1>
        </div>
        </div>
        <Tabs
          defaultActiveKey={"completed-review"}
          id="review-details-tabs"
          variant="tabs"
          className="ppms-tabs"
        >
          <Tab eventKey="completed-review" title="Completed Review">
            <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
              <PPMSDatatable
                title={""}
                data={
                  lotsListState?.data?.filteredRows
                    ? lotsListState.data.filteredRows
                    : []
                }
                columns={columns}
                defaultSortField={"Lot"}
                onChange={(event, page) => {
                  handleChangeTable(event, page);
                }}
                rowsPerPageOptions={lotsListState?.other?.page?.rowsPerPageOptions}
                totalRows={lotsListState?.other?.page?.totalRows}
                totalPages={lotsListState?.other?.page?.totalPages}
                rowsPerPage={lotsListState?.other?.page?.perPage}
                isPaginationEnabled={true}
                showFilters={true}
                serverSort={false}
                loading={loading}
                hiddenColumns={hiddenColumns}
                currentPage={lotsListState?.other?.page?.currentPage - 1}
              />
              <br></br>
            </div>
          </Tab>
          <Tab eventKey="pending-review" title="Pending Review">
            <div className="ui-ppms usa-layout-docs__main desktop:grid-col-12 usa-prose usa-layout-docs">
              <PendingLotsListContextProvider>
                <PendingLotsList {...props} />
              </PendingLotsListContextProvider>
              <br></br>
            </div>
          </Tab>
        </Tabs>
       
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
export default connect(mapStateToProps, mapDispatchToProps)(LotsList);
