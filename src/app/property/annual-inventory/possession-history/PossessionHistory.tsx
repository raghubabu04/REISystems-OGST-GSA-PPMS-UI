import React from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { BsEyeFill } from "react-icons/bs";
import { PossessionRecordCard } from "./PossessionRecordCard";
import { PossessionHistoryContextProvider } from "./PossessionHistoryContext";
import PPMSAccordion from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { InventoryApiService } from "../../../../api-kit/property/inventory-api-service";
import { UploadDocuments } from "./upload/UploadDocuments";
import moment from "moment";
import { statusCodeValuesFullList } from "./Constants";
import { PageHelper, Paths } from "../../../Router";
import { PPMSTooltip } from "../../../../ui-kit/components/common/PPMS-tooltip";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions?: any;
  editPress?: any;
}

interface State {
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  rowsPerPageOptions: [number, number, number, number, number];
  sort: string;
  toggleAccordion: boolean;
  stateCodeList: any[];
  leaEmailValidationMsg: string;
  leaEmailIsInvalid: boolean;
  fileInfectedStatus?: boolean;
  itemControlNumber: string;
  itemName: string;
  fireArmSerialNumber: string;
  tcn: string;
  pocFilter: string;
  emailFilter: string;
  organizationNameFilter: string;
  itemStatusFilter: string;
  receivedDateToFilter: string;
  receivedDateFromFilter: string;
  transferredDateToFilter: string;
  transferredDateFromFilter: string;
  firearmDoneeId: string;
  itemStatus: string;
}

export class PossessionHistory extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 10,
      currentPage: 1,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      sort: "receivedDate,ASC",

      itemStatusFilter: "",
      toggleAccordion: true,
      stateCodeList: [],
      leaEmailValidationMsg: "",
      leaEmailIsInvalid: false,
      fileInfectedStatus: false,
      itemControlNumber: "",
      itemName: "",
      fireArmSerialNumber: "",
      tcn: "",
      pocFilter: "",
      emailFilter: "",
      organizationNameFilter: "",
      receivedDateToFilter: "",
      receivedDateFromFilter: "",
      transferredDateToFilter: "",
      transferredDateFromFilter: "",
      firearmDoneeId: "",
      itemStatus: "",
    };
  }

  private inventoryApiService = new InventoryApiService();

  async componentDidMount() {
    console.log(this.props.match.params.icn);
    let inventoryApiService = new InventoryApiService();

    inventoryApiService
      .getFireArmByICN(this.props.match.params.icn)
      .then((res) => {
        this.setState({
          itemControlNumber: res?.data.itemControlNumber,
          tcn: res?.data.transferControlNumber,
          itemName: res?.data.itemName,
          fireArmSerialNumber: res?.data.firearmSerialNumber,
          firearmDoneeId: res?.data.firearmDoneeId,
          itemStatus: res?.data.itemStatus,
        });
        this.getPossessionHistory([]);
      })
      .catch((err) => {});
  }

  handleSort = (sortBy) => {
    this.setState({
      loading: true,
    });
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "DESC") : (order = "ASC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;

    this.setState({ sort: sort });
    //Preserve search results while sorting
    let data = {
      firearmDoneeId: this.state.firearmDoneeId,
      poc: this.state.pocFilter,
      email: this.state.emailFilter,
      organizationName: this.state.organizationNameFilter,
      itemStatus: this.state.itemStatusFilter,
      receivedDateTo: this.state.receivedDateToFilter,
      receivedDateFrom: this.state.receivedDateFromFilter,
      transferredDateTo: this.state.transferredDateToFilter,
      transferredDateFrom: this.state.transferredDateFromFilter,
      params: {
        page: 1,
        size: this.state.perPage,
        sort: sort,
      },
    };
    this.makeApiCall(data);
  };

  possessionHistoryDownload() {
    let data = {
      firearmDoneeId: this.state.firearmDoneeId,
      poc: this.state.pocFilter,
      email: this.state.emailFilter,
      organizationName: this.state.organizationNameFilter,
      itemStatus: this.state.itemStatusFilter,
      receivedDateTo: this.state.receivedDateToFilter
        ? moment(
            moment(this.state.receivedDateToFilter).format("YYYY-MM-DD")
          ).format("YYYY-MM-DDT23:59:59.999")
        : "",

      receivedDateFrom: this.state.receivedDateFromFilter
        ? moment(
            moment(this.state.receivedDateFromFilter).format("YYYY-MM-DD")
          ).format("YYYY-MM-DDT00:00:00.000")
        : "",
      transferredDateTo: this.state.transferredDateToFilter
        ? moment(
            moment(this.state.transferredDateToFilter).format("YYYY-MM-DD")
          ).format("YYYY-MM-DDT23:59:59.999")
        : "",
      transferredDateFrom: this.state.transferredDateFromFilter
        ? moment(
            moment(this.state.transferredDateFromFilter).format("YYYY-MM-DD")
          ).format("YYYY-MM-DDT00:00:00.000")
        : "",

      params: {
        page: 1,
        size: this.state.perPage,
      },
    };
    if (this.state.sort) {
      data.params["sort"] = this.state.sort;
    }
    this.inventoryApiService
      .downloadPossessionHistory(data)
      .then((response) => {
        let blob = new Blob([response.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob);
        var a = document.createElement("a");
        a.setAttribute("download", "PossessionHistory.xlsx");
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(link);
      });
  }

  historyUpdateAPiCall() {
    let data = {
      firearmDoneeId: this.state.firearmDoneeId,
      poc: this.state.pocFilter,
      email: this.state.emailFilter,
      organizationName: this.state.organizationNameFilter,
      itemStatus: this.state.itemStatusFilter,
      receivedDateFrom: this.state.receivedDateFromFilter,
      receivedDateTo: this.state.receivedDateToFilter,
      transferredDateFrom: this.state.transferredDateFromFilter,
      transferredTo: this.state.transferredDateToFilter,
      params: {
        page: 1,
        size: this.state.perPage,
        sort: this.state.sort,
      },
    };

    this.makeApiCall(data);
  }

  getPossessionHistory = (filters) => {
    this.setState({
      loading: true,
    });
    let poc;
    let email;
    let organizationName;
    let itemStatus;
    let receivedDate;
    let transferredDate;
    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].id) {
        case "poc":
          poc = filters[i]["value"];
          break;
        case "email":
          email = filters[i]["value"];
          break;
        case "organizationName":
          organizationName = filters[i]["value"];
          break;
        case "receivedDate":
          receivedDate = filters[i]["value"];
          break;
        case "transferredDate":
          transferredDate = filters[i]["value"];
          break;
        case "itemStatus":
          itemStatus = filters[i]["value"]
            ? filters[i]["value"].toUpperCase()
            : "";
          break;
      }
    }
    let receivedDateFrom;
    let receivedDateTo;
    if (receivedDate) {
      receivedDateFrom = moment(
        moment(receivedDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT00:00:00.000");
      receivedDateTo = moment(moment(receivedDate).format("YYYY-MM-DD")).format(
        "YYYY-MM-DDT23:59:59.999"
      );
    }

    let transferredDateFrom;
    let transferredDateTo;
    if (transferredDate) {
      transferredDateFrom = moment(
        moment(transferredDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT00:00:00.000");
      transferredDateTo = moment(
        moment(transferredDate).format("YYYY-MM-DD")
      ).format("YYYY-MM-DDT23:59:59.999");
    }

    let data = {
      firearmDoneeId: this.state.firearmDoneeId,
      poc: poc,
      email: email,
      organizationName: organizationName,
      itemStatus: itemStatus,
      receivedDateFrom: receivedDateFrom,
      receivedDateTo: receivedDateTo,
      transferredDateFrom: transferredDateFrom,
      transferredDateTo: transferredDateTo,
      params: {
        page: 1,
        size: this.state.perPage,
      },
    };

    if (this.state.sort) {
      data.params["sort"] = this.state.sort;
    }

    this.setState({
      pocFilter: poc,
      emailFilter: email,
      itemStatusFilter: itemStatus,
      organizationNameFilter: organizationName,
      receivedDateFromFilter: receivedDateFrom,
      receivedDateToFilter: receivedDateTo,
      transferredDateFromFilter: transferredDateFrom,
      transferredDateToFilter: transferredDateTo,
    });

    this.makeApiCall(data);
  };

  makeApiCall(data) {
    this.inventoryApiService
      .getPossessionHistoryList(data)
      .then((response) => {
        let filteredRows = [];
        for (let possession of response.data
          .possessionHistorySearchResultList) {
          //Get full status name from id value
          let fullStatusName;
          for (const [key, object] of Object.entries(
            statusCodeValuesFullList
          )) {
            if (possession.itemStatus === object["id"]) {
              fullStatusName = object["value"];
            }
          }
          let row = {
            poc: possession.poc,
            email: possession.email,
            itemStatus: fullStatusName,
            organizationName: possession.organizationName,
            receivedDate: possession.receivedDate
              ? moment(possession.receivedDate).format("MM/DD/YYYY")
              : "",
            transferredDate: possession.transferredDate
              ? moment(possession.transferredDate).format("MM/DD/YYYY")
              : "",
            transferComments: possession.transferComments,
          };
          filteredRows.push(row);
        }

        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          totalPages: totalPages,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  columns = [
    {
      Header: "Point Of Contact",
      accessor: "poc",
    },
    {
      Header: "Email Address",
      accessor: "email",
    },
    {
      Header: "Organization Name",
      accessor: "organizationName",
    },
    {
      Header: "Firearm Status",
      accessor: "itemStatus",
    },
    {
      Header: "Received Date",
      accessor: "receivedDate",
    },
    {
      Header: "Ownership Change Date",
      accessor: "transferredDate",
    },
    {
      Header: "Transfer Comments",
      accessor: "transferComments",
    },
    {
      Header: "Actions",
      ApplyFilter: (columns) => {
        return (
          <>
            <div id="spacer"></div>
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
                this.getPossessionHistory(filters);
              }}
              label={"Apply Filter"}
            />
            <PPMSButton
              id={"clear-filter"}
              onPress={() => {
                let filters = [];
                columns.columns.forEach((column) => {
                  column.setFilter("");
                });
                this.getPossessionHistory(filters);
              }}
              label={"Clear"}
            />
          </>
        );
      },
      id: "actions",
      Cell: (history) => (
        <>
          {" "}
          {history.row.values.transferComments !== null &&
            history.row.values.transferComments.trim() !== "" && (
              <PPMSTooltip
                trigger={"focus"}
                id={"transfer-comments"}
                placement={"bottom"}
                tooltipContent={history.row.values.transferComments}
                triggerSource={
                  <button className="usa-button" type="button">
                    Comments
                  </button>
                }
              />
            )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableFilters: true,
    },
  ];

  render() {
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Possession History"}
          data={this.state.filteredItems}
          columns={this.columns}
          defaultSortField={"receivedDate"}
          loading={this.state.loading}
          serverSort={true}
          handleSort={(sortBy) => this.handleSort(sortBy)}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          isPaginationEnabled={true}
          onChange={() => {}}
          showFilters={true}
          hiddenColumns={["transferComments"]}
          currentPage={this.state.currentPage - 1}
          subHeaderComponent={
            <>
              <div className="tablet:grid-col grid-gap">
                <div className="tablet:grid-row">
                  <PossessionHistoryContextProvider>
                    <PossessionRecordCard
                      icn={this.state.itemControlNumber}
                      tcn={this.state.tcn}
                      fireArmSerialNumber={this.state.fireArmSerialNumber}
                      itemName={this.state.itemName}
                      itemStatus={this.state.itemStatus}
                      triggerHistoryApi={() => {
                        this.historyUpdateAPiCall();
                      }}
                      apiCall={() => {
                        this.historyUpdateAPiCall();
                      }}
                    />
                  </PossessionHistoryContextProvider>
                </div>
                <br />
                <div className="tablet:grid-row">
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"downloadList"}
                    label={"Download List"}
                    className={"create-property"}
                    onPress={() => this.possessionHistoryDownload()}
                    id={"download-list-btn"}
                  />
                </div>
              </div>
            </>
          }
        />
        <div>
          <br />
          <PPMSAccordion
            items={[
              {
                title: "Upload Images and Documents",
                content: (
                  <UploadDocuments
                    icn={this.props.match.params.icn}
                    fileInfectedStatus={(value) =>
                      this.setState({
                        fileInfectedStatus: value,
                      })
                    }
                  />
                ),
                expanded: true,
                id: "",
              },
            ]}
          />
        </div>
        <div className="tablet:grid-row">
          <PPMSButton
            variant={"primary"}
            type={"button"}
            value={"Back to Annual Inventory"}
            label={"Back to Annual Inventory"}
            className={""}
            onPress={() => {
              PageHelper.openPage(Paths.annualInventoryList);
            }}
            id={"back-to-annual-inventory"}
          />
        </div>
      </div>
    );
  }
}

export default PossessionHistory;
