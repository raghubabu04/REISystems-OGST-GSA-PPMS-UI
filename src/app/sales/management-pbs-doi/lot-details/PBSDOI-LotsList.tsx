import * as React from "react";
import { StrictMode, useContext } from "react";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { connect } from "react-redux";
import { LotsListPBSDOIContext } from "./PBSDOI-LotsListContext";
import SalesSideNavPBSDOI from "../common/SideNav";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../../Router";
import { Description } from "../common/Description";
import { Link } from "react-router-dom";
import { SalesApiService } from "../../../../api-kit/sales/sales-api-service";
import { MdDone, MdEdit } from "react-icons/md";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { CgRemove } from "react-icons/cg";
import { FaAddressCard, FaEye } from "react-icons/fa";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import queryString from "query-string";
import { PPMSPopover } from "../../../../ui-kit/components/common/PPMS-popover";

interface LotDetailsProps {
  actions?: any;
  location?: any;
  match: any;
  user: any;
  roles: any;
}

const PBSDOILotsList = (props: LotDetailsProps) => {
  const { actions, location, match, user, roles } = props;
  const { addToast } = props.actions;
  const { lotsListPBSDOIState, updateLotsListPBSDOIState } = useContext(
    LotsListPBSDOIContext
  );
  const [loading, setLoading] = React.useState(false);
  const [apiRows, setApiRows] = React.useState([]);
  let salesAPIService = new SalesApiService();
  let saleId = "";
  if (match?.params?.saleId) {
    saleId = match?.params?.saleId;
  }
  let search = location.search;
  let query = queryString.parse(search);
  let zoneId = null;
  if (query?.zoneId) {
    zoneId = query.zoneId;
  }

  let handleChangeTable = (perPage, page) => {
    let state = lotsListPBSDOIState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    lotsListPBSDOIState.data.filteredRows = apiData.slice(startIndex, endIndex);
    lotsListPBSDOIState.other.page.totalRows = apiRows.length;
    lotsListPBSDOIState.other.page.totalPages = Math.ceil(totalPages);
    lotsListPBSDOIState.other.page.currentPage = page;
    lotsListPBSDOIState.other.page.perPage = perPage;
    updateLotsListPBSDOIState(state);
  };

  let getLotsManagement = (saleId: number, filters: any) => {
    let params: any = {};
    params.page = lotsListPBSDOIState.other.page.currentPage;
    params.size = lotsListPBSDOIState?.other?.page?.perPage;
    filters?.forEach((filter) => {
      if (filter.value) {
        params[filter.id] = filter.value;
      }
    });
    salesAPIService
      .getLotsForSalePBSDOI(saleId, params)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.lots
            ? response.data.lots
            : [];
        filteredRows = filteredRows.map((row) => {
          let obj: any = {};
          obj.id = row.id;
          obj.lotNumber = row.lotNumber;
          obj.caseNumber = row.caseNumber;
          obj.propertyName = row.propertyName;
          obj.location = row.location;
          obj.saleStartDate = row.saleStartDate;
          obj.saleStatus = row.lotStatus;
          obj.address =
            row?.address?.addressLine1 +
            "," +
            row?.address?.city +
            "," +
            row?.address?.state +
            " " +
            row?.address?.zipCode;
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
        //this.buildICNSalesDetails(filteredRows);
        let state = lotsListPBSDOIState;
        lotsListPBSDOIState.data.filteredRows = filteredRows.slice(
          0,
          lotsListPBSDOIState?.other?.page?.perPage
        );
        lotsListPBSDOIState.other.loading = false;
        lotsListPBSDOIState.other.page.totalRows = totalElements;
        lotsListPBSDOIState.other.page.totalPages = totalPages;
        setLoading(false);
        updateLotsListPBSDOIState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const getSaleDetails = (saleId) => {
    salesAPIService
      .getSalesPBSDOI(saleId)
      .then((response) => {
        let state = lotsListPBSDOIState;
        state.other.salesNumber = response.data.salesNumber;
        state.other.salesMethod = response.data.salesMethod;
        updateLotsListPBSDOIState(state);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createANewLot = () => {
    let data = {
      salesId: saleId,
    };
    salesAPIService
      .saveLotProperty(data)
      .then((response) => {
        PageHelper.openPage(
          Paths.salesAddPropertyPBSDOI +
            "/" +
            saleId +
            "/" +
            response.data.lotId +
            "?zoneId=" +
            zoneId
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = (lotId) => {
    let state = lotsListPBSDOIState;
    state.other.showDeleteModal = true;
    state.data.lotId = lotId;
    updateLotsListPBSDOIState(state);
  };

  const handleDeleteClose = () => {
    let state = lotsListPBSDOIState;
    state.other.showDeleteModal = false;
    updateLotsListPBSDOIState(state);
  };

  const handleDeleteProperty = () => {
    salesAPIService
      .deletePropertyPBSDOI(lotsListPBSDOIState.data.lotId)
      .then((response) => {
        addToast({
          text: "Successfully deleted the lot/property",
          type: "success",
          heading: "Success",
        });
        getLotsManagement(parseInt(saleId), null);
      })
      .catch((error) => {
        console.log("Error for deleting lot/property", error);
        addToast({
          text: "Cannot delete lot/property",
          type: "error",
          heading: "Error",
        });
      });
    handleDeleteClose();
  };

  const locationInformation = (data) => {
    const name: string = data.row.values["location"];
    const tooltip = data?.row?.original?.address;
    return (
      <>
        {name}{" "}
        <PPMSPopover
          trigger={["click"]}
          id={"location-description"}
          placement={"right"}
          popoverTitle={"Address"}
          popoverContent={<>{tooltip}</>}
          triggerSource={
            <FaAddressCard className={`ppms-usa-contact-info-icon-lot`} />
          }
        />
      </>
    );
  };

  React.useEffect(() => {
    setLoading(true);
    getSaleDetails(saleId);
    getLotsManagement(parseInt(saleId), null);
  }, [
    lotsListPBSDOIState.other.page.currentPage,
    lotsListPBSDOIState.other.page.perPage,
  ]);

  const columns = [
    {
      Header: "Lot Number",
      accessor: "lotNumber",
      Cell: (data) => {
        let lotNumber = null;
        switch (data.row.values.lotNumber.length) {
          case 1:
            lotNumber = `00${data.row.values.lotNumber}`;
            break;
          case 2:
            lotNumber = `0${data.row.values.lotNumber}`;
            break;
          case 3:
            lotNumber = data.row.values.lotNumber;
            break;
          default:
            break;
        }
        return (
          <Link
            to={
              Paths.salesAddPropertyPBSDOI +
              "/" +
              saleId +
              "/" +
              data.row.original.id +
              "?zoneId=" +
              zoneId
            }
            className={"lot-details-pbsdoi"}
            key="lot-details-pbsdoi-id"
          >
            {lotNumber}
          </Link>
        );
      },
      filter: "search",
      width: 200,
    },
    {
      Header: "Case Number",
      accessor: "caseNumber",
      filter: "search",
    },
    {
      Header: "Property Name",
      accessor: "propertyName",
      filter: "search",
    },
    {
      Header: "Location",
      accessor: "location",
      Cell: (data) => locationInformation(data),
      filter: "search",
    },
    {
      Header: "Sale Status",
      accessor: "saleStatus",
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
                  filter["value"] = column["filterValue"];
                  filters.push(filter);
                });
                getLotsManagement(parseInt(saleId), filters);
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
                getLotsManagement(parseInt(saleId), filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      //Here add action buttons
      Cell: (property) => {
        let lotInfo = property.row.values;
        return (
          <>
            {!roles?.isCOI ? (
              lotInfo.saleStatus !== "Closed" ? (
                <PPMSButton
                  variant={"secondary"}
                  label={"Edit"}
                  size={"sm"}
                  icon={<MdEdit />}
                  onPress={() => {
                    PageHelper.openPage(
                      Paths.salesAddPropertyPBSDOI +
                        "/" +
                        saleId +
                        "/" +
                        property.row.original.id +
                        "?zoneId=" +
                        zoneId
                    );
                  }}
                  id={`edit-${property.row.original.id}`}
                />
              ) : (
                <></>
              )
            ) : (
              <> </>
            )}
            {lotInfo.saleStatus === "Closed" || roles?.isCOI ? (
              <PPMSButton
                variant={"secondary"}
                label={"View"}
                size={"sm"}
                icon={<FaEye />}
                onPress={() => {
                  PageHelper.openPage(
                    Paths.salesAddPropertyPBSDOI +
                      "/" +
                      saleId +
                      "/" +
                      property.row.original.id +
                      "?zoneId=" +
                      zoneId
                  );
                }}
                id={`view-${property.row.original.id}`}
              />
            ) : (
              <></>
            )}
            {roles?.isCOI ? (
              <></>
            ) : lotInfo.saleStatus === "Closed" ? (
              <></>
            ) : (
              <PPMSButton
                variant={"secondary"}
                label={"Finalize"}
                size={"sm"}
                icon={<MdDone />}
                onPress={() => {
                  PageHelper.openPage(
                    Paths.salesFinalizePBSDOI +
                      "/" +
                      saleId +
                      "/" +
                      property.row.original.id +
                      "?zoneId=" +
                      zoneId
                  );
                }}
                id={`finalize-${property.row.original.id}`}
              />
            )}
            {!roles?.isCOI ? (
              lotInfo.saleStatus === "Draft" ? (
                <PPMSButton
                  variant={"secondary"}
                  label={"Delete"}
                  size={"sm"}
                  icon={<CgRemove />}
                  onPress={() => {
                    onDelete(property.row.original.id);
                  }}
                  id={`delete-${property.row.original.id}`}
                />
              ) : (
                <> </>
              )
            ) : (
              <> </>
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
  return (
    <StrictMode>
      <div className={"ui-ppms grid-row grid-gap-4"}>
        <div className="grid-row header-row mb-3">
          <h1>LOT DETAILS</h1>
        </div>
        <div className="usa-layout-docs__sidenav desktop:grid-col-3">
          <div className={`sticky-wrapper sticky`}>
            <div className={"sticky-inner"}>
              <nav aria-label="Secondary navigation">
                <h3>Sales Management</h3>
                <SalesSideNavPBSDOI
                  saleId={saleId}
                  zoneId={zoneId}
                  currentPage={Paths.salesLotDetailsPBSDOI}
                />
              </nav>
            </div>
          </div>
        </div>
        <div className="ui-ppms usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs">
          <Description
            method={lotsListPBSDOIState.other.salesMethod}
            number={lotsListPBSDOIState.other.salesNumber}
            type={"list"}
            zoneId={zoneId}
            id={saleId}
          />
          {!roles.isCOI ? (
            <PPMSButton
              id={"add-property-pbsdoi"}
              type={"button"}
              variant={"primary"}
              label={"Add Property"}
              onPress={() => {
                createANewLot();
              }}
            />
          ) : (
            <></>
          )}
          <PPMSDatatable
            title={""}
            data={
              lotsListPBSDOIState?.data?.filteredRows
                ? lotsListPBSDOIState.data.filteredRows
                : []
            }
            columns={columns}
            defaultSortField={"lotNumber"}
            onChange={(event, page) => {
              handleChangeTable(event, page);
            }}
            rowsPerPageOptions={
              lotsListPBSDOIState?.other?.page?.rowsPerPageOptions
            }
            totalRows={lotsListPBSDOIState?.other?.page?.totalRows}
            totalPages={lotsListPBSDOIState?.other?.page?.totalPages}
            rowsPerPage={lotsListPBSDOIState?.other?.page?.perPage}
            isPaginationEnabled={true}
            showFilters={true}
            serverSort={false}
            // handleSort={(sortBy) => this.handleSort(sortBy)}
            loading={loading}
            hiddenColumns={["id"]}
            currentPage={lotsListPBSDOIState?.other?.page?.currentPage - 1}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-2 next-prev-page">
        <div className="desktop:grid-col-3" />
        <div className="desktop:grid-col-9">
          <PPMSButton
            id={"lotting-details"}
            type={"button"}
            variant={"link"}
            label={"< Sale Transaction"}
            onPress={() =>
              PageHelper.openPage(
                Paths.salesTransactionPBSDOI +
                  "/" +
                  saleId +
                  "?zoneId=" +
                  zoneId
              )
            }
          />
          {!roles.isCOI ? (
            <PPMSButton
              id={"create-property"}
              type={"button"}
              variant={"link"}
              className={"usa-link float-right"}
              label={"Add Property >"}
              onPress={() => {
                createANewLot();
              }}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <PPMSModal
          show={lotsListPBSDOIState.other.showDeleteModal}
          handleClose={handleDeleteClose}
          handleSave={handleDeleteProperty}
          title={"Delete Cart Item"}
          centered={true}
          backdrop={"static"}
          label={"Yes"}
          labelCancel={"No"}
          body={<ModalDeleteContent />}
          id={"delete-files"}
        />
      </div>
    </StrictMode>
  );
};

const ModalDeleteContent = () => {
  return (
    <div>
      <p>Are you sure you want to Delete this property?</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(PBSDOILotsList);
