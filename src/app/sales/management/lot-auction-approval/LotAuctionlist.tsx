import React, { StrictMode, useContext, useEffect, useState } from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import Breadcrumb from "../common/Breadcrumb";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { LotAuctionListContext } from "./LotAuctionListContext";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import SalesSideNav from "../common/SideNav";
import SaleNumberDetails from "../common/SaleNumberDetails";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import queryString from "query-string";
import { TransferLotModal } from "./TransferLotModal";
import { formatSaleNumber } from "../../../../ui-kit/utilities/FormatUtil";
import { PageHelper, Paths } from "../../../Router";
import { isEmpty } from "lodash";
import PPMSCheckbox from "../../../../ui-kit/components/common/form/PPMS-checkbox";
import { AuctionsApiService } from "../../../../api-kit/auctions/auctions-api-service";
import IndeterminateCheckbox from "../../../../ui-kit/components/common/datatable/IndeterminateCheckbox";
import { isEmptyCheck } from "../../../../ui-kit/components/validations/FieldValidations";

interface LotAuctionListProps {
  match: any;
  user: any;
  location: any;
  actions?: any;
  updateSaleInfo?: any;
  sale?: any;
  roles: any;
}

const LotAuctionList = (props: LotAuctionListProps) => {
  const { match, user, location, updateSaleInfo } = props;
  let salesAPIService = new SalesApiService();
  let auctionsAPIService = new AuctionsApiService();
  const { lotAuctionListState, updateLotAuctionListState } = useContext(
    LotAuctionListContext
  );

  const [loading, setLoading] = useState(false);
  const [apiRows, setApiRows] = useState([]);
  const [selectedLotIds, setSelectedLotIds] = useState([]);

  let search = location.search;
  let query = queryString.parse(search);
  const { addToast } = props.actions;
  let saleId = null;
  if (match.params.saleId) {
    saleId = match.params.saleId;
  }
  let zoneId = null;
  if (query?.zoneId) {
    zoneId = query.zoneId;
  }

  const handleTogglePageRow = (props: any, { instance, row }) => {
    let checked = false;
    if (selectedLotIds.length > 0) {
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
          if (e.target.checked) {
            selectedLotIds.push(row.original.lotId);
          } else {
            //even if one of the checkbox in the page is selected set "isAllPageRowsSelected" to false
            const index: number = selectedLotIds.indexOf(row.original.lotId);
            if (index > -1) {
              selectedLotIds.splice(index, 1);
            }
          }
          const noAuctionLotIds: any[] = instance.rows.filter((row: any) =>
            isEmptyCheck(row.original.auctionId)
          );
          const isAllPageRowsSelected: boolean =
            selectedLotIds.length === noAuctionLotIds.length;
          updateLotAuctionListState({
            isAllPageRowsSelected: isAllPageRowsSelected,
            checkSelectedValue: !isAllPageRowsSelected,
          });

          setSelectedLotIds(selectedLotIds);
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
        let lotIds: number[] = [];
        instance.rows.forEach((row: any) => {
          if (isEmptyCheck(row.original.auctionId)) {
            row.toggleRowSelected(checked);
            lotIds.push(row.original.lotId);
          }
        });
        setSelectedLotIds(lotIds);
        updateLotAuctionListState({
          isAllPageRowsSelected: checked,
          checkSelectedValue: lotIds.length === 0,
        });
      },
      style: {
        cursor: "pointer",
      },
      checked: lotAuctionListState.isAllPageRowsSelected,
      title: "Toggle All Current Page Rows Selected",
      indeterminate: false,
    },
  ];

  const columns = React.useMemo(
    () => [
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
        Cell: ({ row }) => {
          return (
            <div>
              <IndeterminateCheckbox
                id={`${row.id}-checkbox`}
                name={`${row.id}-checkbox`}
                disabled={!isEmptyCheck(row.original.auctionId)}
                {...row.getToggleRowSelectedProps()}
              />
            </div>
          );
        },
      },
      {
        Header: "Property Custodian",
        accessor: "propertyCustodian",
        id: "propertyCustodian",
        width: "200",
      },
      {
        Header: "Lot",
        accessor: "lotNumber",
        filter: "search",
        width: "100",
      },
      {
        Header: "ICNs",
        accessor: "icnCount",
        filter: "search",
        width: "75",
      },
      {
        Header: "Status",
        accessor: "status",
        filter: "search",
        width: "150",
      },
      {
        Header: "Actions",
        width: "100",
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
                      filter["value"] = column["filterValue"]?.replace(
                        /-/g,
                        ""
                      );
                    } else {
                      filter["value"] = column["filterValue"];
                    }
                    filters.push(filter);
                  });
                  getLotAuctions(saleId, filters);
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
                  getLotAuctions(saleId, filters);
                }}
                label={"Clear"}
              />
            </>
          );
        },
        //Here add action buttons
        Cell: (property) => {
          let salesInfo = property.row.original;
          return (
            <>
              <PPMSButton
                variant={"secondary"}
                label={"Edit Lot Details"}
                size={"sm"}
                icon={<MdEdit />}
                onPress={() => {
                  PageHelper.openPage(
                    `${Paths.salesLottingDetails}/${saleId}?lotId=${salesInfo.lotId}&zoneId=${query?.zoneId}`
                  );
                }}
                id={"upload"}
              />
              <PPMSButton
                variant={"secondary"}
                label={"View/Edit Lot Approval"}
                icon={<FaEye />}
                size={"sm"}
                onPress={() => {
                  PageHelper.openPage(
                    `${Paths.salesLotReviewApproval}/${saleId}/${salesInfo.custodianId}?lotId=${salesInfo.lotId}&zoneId=${query?.zoneId}`
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
    ],
    []
  );

  let handleChangeTable = (perPage, page) => {
    let state = lotAuctionListState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    lotAuctionListState.data.filteredRows = apiData.slice(startIndex, endIndex);
    lotAuctionListState.other.page.totalRows = apiRows.length;
    lotAuctionListState.other.page.totalPages = Math.ceil(totalPages);
    lotAuctionListState.other.page.currentPage = page;
    lotAuctionListState.other.page.perPage = perPage;
    updateLotAuctionListState(state);
  };
  let getLotAuctions = (saleId: number, filters: any) => {
    let params: any = {};
    params.page = lotAuctionListState.other.page.currentPage;
    params.size = lotAuctionListState?.other?.page?.perPage;
    params.saleId = saleId;
    filters?.forEach((filter) => {
      if (filter.value) {
        params[filter.id] = filter.value;
      }
    });
    salesAPIService
      .getLotAuctionList(params)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.lotDTOS
            ? response.data.lotDTOS
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.propertyCustodian =
            (row.custodianFirstName ? row.custodianFirstName + "," : "") +
            (row.custodianLastName ? row.custodianLastName : "");
          obj.lotNumber = row.lotNumber;
          obj.lotId = row.lotId;
          obj.custodianId = row.custodianId;
          obj.icnCount = row.noOfItems;
          obj.status = row.lotStatus;
          obj.auctionId = row.auctionId;
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
        let state = lotAuctionListState;
        lotAuctionListState.data.filteredRows = filteredRows.slice(
          0,
          lotAuctionListState?.other?.page?.perPage
        );
        lotAuctionListState.other.loading = false;
        lotAuctionListState.other.page.totalRows = totalElements;
        lotAuctionListState.other.page.totalPages = totalPages;
        setLoading(false);
        updateLotAuctionListState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    let filter = [{}];
    getLotAuctions(saleId, filter);
    salesAPIService
      .getSaleDetails(saleId)
      .then((res) => {
        let salesDetails = res.data.salesNumberDetails;
        let state = lotAuctionListState;
        state.data.salesDetails = salesDetails;
        updateLotAuctionListState(state);
      })
      .catch((error) => {});
  }, [
    lotAuctionListState.other.page.currentPage,
    lotAuctionListState.other.page.perPage,
  ]);

  const onPressUploadSelected = () => {
    let state = lotAuctionListState;
    state.other.disableUploadButton = true;
    updateLotAuctionListState(state);
    auctionsAPIService
      .uploadSelectedLots(selectedLotIds, zoneId)
      .then((res) => {
        let filter = [{}];
        getLotAuctions(saleId, filter);
        state.isAllPageRowsSelected = false;
        state.checkSelectedValue = true;
        setSelectedLotIds([]);
        updateLotAuctionListState(state);
        addToast({
          text: `Selected lots uploaded successfully`,
          type: "success",
          heading: "Success",
        });
      })
      .catch((error) => {
        state.isAllPageRowsSelected = false;
        state.checkSelectedValue = true;
        updateLotAuctionListState(state);
        console.log(error);
      });
  };
  const renderSelectButtons = () => {
    return (
      <div>
        <PPMSButton
          id={"upload-selected"}
          onPress={onPressUploadSelected}
          label={"Upload Selected"}
          isDisabled={lotAuctionListState.checkSelectedValue}
        />
        <PPMSButton
          id={"transfer-selected-tot"}
          onPress={onPressTransferSelected}
          label={"Transfer Selected Lot"}
          isDisabled={false}
        />
      </div>
    );
  };

  const onPressTransferSelected = () => {
    let state = lotAuctionListState;
    if (isEmpty(selectedLotIds)) {
      addToast({
        text: `No lots selected`,
        type: "error",
        heading: "Error",
      });
    } else {
      if (
        new Date(Date.now()) >
          new Date(lotAuctionListState.data.salesDetails.salesDate) ||
        new Date(Date.now()) ==
          new Date(lotAuctionListState.data.salesDetails.salesDate)
      ) {
        addToast({
          text: `Lot cannot be transferred to another lot as Sale Start Date is ${lotAuctionListState.data.salesDetails.salesDate}`,
          type: "error",
          heading: "Error",
        });
      } else {
        state.other.showTransferLotModal = true;
        updateLotAuctionListState(state);
      }
    }
  };
  const handleCloseTransferLotModal = () => {
    let state = lotAuctionListState;
    state.other.showTransferLotModal = false;
    updateLotAuctionListState(state);
  };

  const handleSaveTransferLotModal = () => {};

  const handleTransferLot = () => {
    let data = {
      lotIds: selectedLotIds,
      oldSaleId: saleId,
      newSaleNumber: lotAuctionListState.data.newSaleNumber.replaceAll("-", ""),
    };
    salesAPIService
      .transferLot(data)
      .then((response) => {
        addToast({
          text: `Successfully transferred the lot to ${formatSaleNumber(
            lotAuctionListState.data.newSaleNumber.replaceAll("-", "")
          )}`,
          type: "success",
          heading: "Success",
        });
        let filter = [{}];
        getLotAuctions(saleId, filter);
      })
      .catch((error) => {
        addToast({
          text: "Error confirming request",
          type: "error",
          heading: "Error",
        });
      });
  };

  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <Breadcrumb
          pathname={location.pathname}
          zoneId={query}
          saleId={saleId}
        />
        <div className="grid-row header-row mb-3">
          <h1>LOT AUCTION REVIEW</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNav
                  saleId={saleId}
                  zoneId={query.zoneId}
                  currentPage={Paths.salesLotAuctionAprroval}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <SaleNumberDetails saleId={saleId} zoneId={query.zoneId} />
          {renderSelectButtons()}
          <DataTable
            data={lotAuctionListState?.data}
            columns={columns}
            page={lotAuctionListState?.other?.page}
            loading={loading}
            handleChangeTable={handleChangeTable}
            handleToggleAllPageRows={handleToggleAllPageRows}
            handleTogglePageRow={handleTogglePageRow}
          />
          <br></br>
          {renderSelectButtons()}
        </div>
      </div>
      <div>
        <TransferLotModal
          showTransferLotModal={lotAuctionListState.other.showTransferLotModal}
          handleCloseTransferLotModal={handleCloseTransferLotModal}
          handleSaveTransferLotModal={handleSaveTransferLotModal}
          handleTransferLot={handleTransferLot}
          defaultZoneId={query.zoneId}
        />
      </div>
    </StrictMode>
  );
};
const DataTable = ({
  data,
  columns,
  page,
  loading,
  handleChangeTable,
  handleToggleAllPageRows,
  handleTogglePageRow,
}) => {
  return (
    <>
      {" "}
      <PPMSDatatable
        title={""}
        data={React.useMemo(() => {
          return data?.filteredRows ? data.filteredRows : [];
        }, [data.filteredRows])}
        columns={columns}
        defaultSortField={"Lot"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={page?.rowsPerPageOptions}
        totalRows={page?.totalRows}
        totalPages={page?.totalPages}
        rowsPerPage={page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={loading}
        hiddenColumns={["id"]}
        currentPage={page?.currentPage - 1}
        handleToggleAllPageRows={handleToggleAllPageRows}
        handleTogglePageRow={handleTogglePageRow}
      />
    </>
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
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(saleAction.updateSaleInfo(saleId, saleNumber, saleAction, zone)),
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LotAuctionList);
