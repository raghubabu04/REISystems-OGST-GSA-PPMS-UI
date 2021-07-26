import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../_redux/_actions/toast.actions";
import { BidderPaymentsContext } from "./BidderPaymentsContext";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { AuctionsApiService } from "../../../api-kit/auctions/auctions-api-service";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useEffect } from "react";
import PPMSAccordion from "../../../ui-kit/components/common/accordion/PPMS-accordion";
import moment from "moment";
import { PPMSDatepicker } from "../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { PageHelper, Paths } from "../../Router";
import { AnnualInventoryState } from "../../property/annual-inventory/AnnualInventoryState";
import { commonActions } from "../../../_redux/_actions/common.actions";
import { Link } from "react-router-dom";

interface BidderPaymentsProps {
  actions?: any;
  location?: any;
  user: any;
  match: any;
  roles: any;
  getHolidays?: any;
  holiday?: any;
}

const BidderPayments = (props: BidderPaymentsProps) => {
  const { holiday, getHolidays, actions, location, user, match, roles } = props;
  const { bidderPaymentsState, updateBidderPaymentsState } = useContext(
    BidderPaymentsContext
  );

  const [loading, setLoading] = React.useState(false);
  const [apiRows, setApiRows] = React.useState([]);

  //for search criteria filter
  const [searchBySaleNo, setSearchBySaleNo] = useState("");
  const [searchByBidderEmail, setSearchByBidderEmail] = useState("");
  const [searchByContractNo, setSearchByContractNo] = useState("");
  const [awardTo, setAwardTo] = useState("");
  const [awardFrom, setAwardFrom] = useState("");
  let auctionsApiService = new AuctionsApiService();

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };
  let handleChangeTable = (perPage, page) => {
    let state = bidderPaymentsState;
    const startIndex: number = perPage * (page - 1);
    const endIndex: number = perPage * (page - 1) + perPage;
    const apiData = JSON.parse(JSON.stringify(apiRows));
    const totalPages: number = apiRows.length ? apiRows.length / perPage : 1;
    bidderPaymentsState.data.filteredRows = apiData.slice(startIndex, endIndex);
    bidderPaymentsState.other.page.totalRows = apiRows.length;
    bidderPaymentsState.other.page.totalPages = Math.ceil(totalPages);
    bidderPaymentsState.other.page.currentPage = page;
    bidderPaymentsState.other.page.perPage = perPage;
    updateBidderPaymentsState(state);
  };

  const onClickAction = (bidderInfo) => {
    PageHelper.openPage(`${Paths.bidderPaymentDetails}/${bidderInfo.bidderId}`);
  };

  let getBidderPayments = (filters: any) => {
    let data = {
      params: {
        page: bidderPaymentsState.other.page.currentPage,
        size: bidderPaymentsState?.other?.page?.perPage,
      },
    };

    filters?.forEach((filter) => {
      if (filter.value) {
        data[filter.id] = filter.value;
      }
    });
    auctionsApiService
      .getBidderPayments(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.bidderDTOList
            ? response.data.bidderDTOList
            : [];
        filteredRows = filteredRows.map((row) => {
          let address = row.addressDTO;
          let obj: any = {};
          obj.bidderId = row.userId;
          obj.firstName = row.firstName;
          obj.lastName = row.lastName;
          obj.userName = row.userName;
          obj.address = address
            ? `${address?.addressLine1}, ${address?.addressLine2}`
            : "-";
          obj.city = address
            ? `${address?.city},${address?.stateCode} ${address?.zip}`
            : "-";
          obj.numberOfOpenContracts = row.noOfOpenContract;
          obj.bidderStatus = row.bidderStatus;
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
        let state = bidderPaymentsState;
        state.data.filteredRows = filteredRows.slice(
          0,
          state?.other?.page?.perPage
        );
        state.other.loading = false;
        state.other.page.totalRows = totalElements;
        state.other.page.totalPages = totalPages;
        setLoading(false);
        updateBidderPaymentsState(state);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  useEffect(() => {
    setLoading(true);
    let filters = [];
    getBidderPayments(filters);
    getHolidays(moment().year());
  }, [
    bidderPaymentsState.other.page.currentPage,
    bidderPaymentsState.other.page.perPage,
  ]);

  const columns = [
    {
      Header: "User ID",
      accessor: "userName",
      Cell: (data) => {
        return (
          <Link
            to={`${Paths.viewBidder}${
              data.row.original.userName ? "/" + data.row.original.userName : ""
            }`}
            className={"bidder-payment-details"}
            key="bidder-payment-details"
          >
            {data.value}
          </Link>
        );
      },
      filter: "search",
    },
    {
      Header: "First Name",
      accessor: "firstName",
      filter: "search",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
      filter: "search",
    },
    {
      Header: "Address",
      accessor: "address",
      filter: "search",
    },
    {
      Header: "City/State",
      accessor: "city",
      filter: "search",
    },
    {
      Header: "Number Of Open Contracts",
      accessor: "numberOfOpenContracts",
      filter: "search",
    },
    {
      Header: "Bidder Status",
      accessor: "bidderStatus",
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
                getBidderPayments(filters);
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
                getBidderPayments(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      Cell: (bidder) => {
        return (
          <>
            {!roles.isCLO ? (
              <PPMSButton
                variant={"secondary"}
                label={"View"}
                icon={<FaEye />}
                size={"sm"}
                onPress={() => onClickAction(bidder.row.original)}
                id={"view"}
                className="manage-list-actions"
              />
            ) : (
              <PPMSButton
                variant={"secondary"}
                label={"Pay"}
                size={"sm"}
                icon={<MdEdit />}
                className="manage-list-actions"
                onPress={() => onClickAction(bidder.row.original)}
                id={`edit-${bidder.row.values.id}`}
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
  const applyFilters = () => {
    let state = bidderPaymentsState;
    state.other.page.currentPage = 1;
    updateBidderPaymentsState(state);
    let filters = [];
    if (searchBySaleNo != "") {
      filters.push({ id: "saleNumber", value: searchBySaleNo });
    }
    if (searchByBidderEmail != "") {
      filters.push({ id: "bidderEmail", value: searchByBidderEmail });
    }
    if (searchByContractNo != "") {
      filters.push({ id: "contractNumber", value: searchByContractNo });
    }
    if (awardTo != "") {
      filters.push({ id: "awardTo", value: awardTo });
    }
    if (awardFrom != "") {
      filters.push({ id: "awardFrom", value: awardFrom });
    }
    getBidderPayments(filters);
  };

  const clearFilters = () => {
    let state = bidderPaymentsState;
    bidderPaymentsState.other.page.currentPage = 1;
    updateBidderPaymentsState(state);

    setSearchBySaleNo("");
    setSearchByBidderEmail("");
    setSearchByContractNo("");
    setAwardTo(null);
    setAwardFrom(null);
    let filters = [];
    getBidderPayments(filters);
  };

  const filters = () => {
    return [
      {
        title: "Filters",
        content: (
          <>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-2"}>
                <PPMSInput
                  id={"saleNo"}
                  name={"bySaleNo"}
                  label={"By Sale/Lot Number"}
                  isRequired={true}
                  isDisabled={false}
                  inputType={"text"}
                  placeHolder={"Sale no"}
                  value={searchBySaleNo}
                  onChange={(event) => setSearchBySaleNo(event.target.value)}
                />
                <br />
              </div>
              <div className={"grid-col-2"}>
                <PPMSInput
                  id={"contractNo"}
                  name={"contractNo"}
                  label={"By Contract Number"}
                  isDisabled={false}
                  isRequired={true}
                  inputType={"text"}
                  placeHolder={"Contract No"}
                  value={searchByContractNo}
                  onChange={(event) =>
                    setSearchByContractNo(event.target.value)
                  }
                />
              </div>
              <div className={"grid-col-2"}>
                <PPMSInput
                  id={"bidderEmail"}
                  name={"bidderEmail"}
                  label={"By Bidder Email"}
                  isDisabled={false}
                  isRequired={true}
                  inputType={"text"}
                  placeHolder={"Bidder Email"}
                  value={searchByBidderEmail}
                  onChange={(event) =>
                    setSearchByBidderEmail(event.target.value)
                  }
                />
              </div>

              <div className="grid-col-3 position-absolute award-to">
                <PPMSDatepicker
                  id={"award_to"}
                  format={"MM/DD/YYYY"}
                  label={"Awards To"}
                  display={""}
                  startDate={
                    awardTo ? moment(new Date(awardTo)).toDate() : null
                  }
                  minDate={moment(new Date(awardFrom)).toDate()}
                  updateDate={(value) => {
                    setAwardTo(
                      value
                        ? moment(value, "MM/DD/YYYY").format(
                            "YYYY-MM-DDT23:59:59.999"
                          )
                        : ""
                    );
                  }}
                  // isRequired={true}
                  isRequired={false}
                  notShowFormat={true}
                  isDisabled={false}
                  setHolidayYear={(year) => getHolidaysByYear(year)}
                  holidayList={holiday?.holidays}
                  excludeWeekends={true}
                  excludeHolidays={true}
                />
              </div>
              <div className={"grid-col-3 position-absolute award-from"}>
                <PPMSDatepicker
                  id={"award_from"}
                  format={"MM/DD/YYYY"}
                  label={"Award From"}
                  display={""}
                  startDate={
                    awardFrom ? moment(new Date(awardFrom)).toDate() : null
                  }
                  updateDate={(value) => {
                    setAwardFrom(
                      value
                        ? moment(value, "MM/DD/YYYY").format(
                            "YYYY-MM-DDT00:00:00.000"
                          )
                        : ""
                    );
                  }}
                  // isRequired={true}
                  isRequired={false}
                  notShowFormat={true}
                  isDisabled={false}
                  setHolidayYear={(year) => getHolidaysByYear(year)}
                  holidayList={holiday?.holidays}
                  excludeWeekends={true}
                  excludeHolidays={true}
                />
              </div>
            </div>

            <div className={"grid-row"}>
              <PPMSButton
                id={"apply-filter-top"}
                onPress={() => applyFilters()}
                label={"Apply Filter"}
                className={"create-property"}
              />
              <PPMSButton
                id={"clear-filter-top"}
                onPress={() => clearFilters()}
                label={"Clear"}
                className={"create-property"}
                isDisabled={false}
              />
            </div>
          </>
        ),
        expanded: true,
        id: "filters",
        trigger: "common",
      },
    ];
  };

  return (
    <div className="ui-ppms">
      <PPMSDatatable
        title={"Bidder/Payments"}
        data={
          bidderPaymentsState.data.filteredRows
            ? bidderPaymentsState.data.filteredRows
            : []
        }
        columns={columns}
        defaultSortField={"userId"}
        onChange={(event, page) => {
          handleChangeTable(event, page);
        }}
        rowsPerPageOptions={
          bidderPaymentsState?.other?.page?.rowsPerPageOptions
        }
        totalRows={bidderPaymentsState?.other?.page?.totalRows}
        totalPages={bidderPaymentsState?.other?.page?.totalPages}
        rowsPerPage={bidderPaymentsState?.other?.page?.perPage}
        isPaginationEnabled={true}
        showFilters={true}
        serverSort={false}
        loading={loading}
        currentPage={bidderPaymentsState?.other?.page?.currentPage - 1}
        subHeaderComponent={
          <div className={"grid-col-12"}>
            <div className={"margin-top-3 col-md-auto"}>
              <div className={"grid-row grid-gap-8"}>
                {<PPMSAccordion bordered={true} items={filters()} />}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
  };
};

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
});

export default connect(mapStateToProps, mapDispatchToProps)(BidderPayments);
