import React from "react";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";

import {MdContentCopy, MdDelete, MdEdit} from "react-icons/md";
import {PPMSModal} from "../../../ui-kit/components/common/PPMS-modal";
import {PageHelper, Paths} from "../../Router";
import {SalesApiService} from "../../../api-kit/sales/sales-api-service";
import {isFormSubmitted} from "../../../service/validation.service";
import PPMSDatatable from "../../../ui-kit/components/common/datatable/PPMS-datatable";
import {PPMSSelect} from "../../../ui-kit/components/common/select/PPMS-select";
import {filterCampaigns} from "./constants/Constants";

interface MarketingCampaignProps {
  match: any;
  location: any;
  history: any;
  context: any;
}

interface MarketingCampaignState {
  filterText: string;
  paginationResetDefaultPage: boolean;
  filteredItems: any[];
  loading: boolean;
  totalRows: number;
  totalPages: number;
  perPage: number;
  body: string;
  showModal: boolean;
  show: boolean;
  isSaved: boolean;
  campaignId: string;
  currentPage: number;
  filterCampaigns: any;
  defaultFilterValue: string;
  campaignStatus: string;

  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
  sortOrder?: any;
}
export class MarketingCampaignListPage extends React.Component<
  MarketingCampaignProps,
  MarketingCampaignState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      filterText: "",
      paginationResetDefaultPage: false,
      filteredItems: [],
      loading: false,
      totalRows: 0,
      totalPages: 0,
      perPage: 10,
      body: "",
      showModal: false,
      show: false,
      isSaved: false,
      campaignId: "",
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      currentPage: 1,
      filterCampaigns: filterCampaigns,
      defaultFilterValue: "show_campaigns",
      campaignStatus: "",
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  editMarketingCampaign(campaignId) {
    let campaignDetails = {};
    this.salesApiService.getCampaignDetailsById(campaignId).then((response) => {
      response.data.campaignStatus = "DRAFT";
      campaignDetails = response.data;
      this.salesApiService
        .saveMarketingCampaign(campaignDetails)
        .then((success) => {
          PageHelper.openPage(Paths.editMarketingCampaign + "/" + campaignId);
        })
        .catch((error) => {
          console.log("error occurred during DRAFT status update: " + error);
        });
    });
  }

  copyMarketingCampaign(campaignId) {
    this.salesApiService
      .copyMarketingCampaign(campaignId)
      .then((response) => {
        this.editMarketingCampaign(response.data.campaignId);
      })
      .catch((error) => {
        console.log("error occurred during DRAFT status update: " + error);
      });
  }

  getDeleteDisabled = (status: string) => {
    return status.toUpperCase() === "DELETED";
  };

  private salesApiService = new SalesApiService();
  columns = [
    {
      Header: "Campaign Name",
      accessor: "campaignName",
    },
    {
      Header: "Start Date",
      accessor: "campaignStartDate",
      sortType: "customDate",
    },
    {
      Header: "End Date",
      accessor: "campaignEndDate",
    },
    {
      Header: "Created By",
      accessor: "campaignCreatedBy",
    },
    {
      Header: "Last Modified",
      accessor: "campaignLastModifiedBy",
    },
    {
      Header: "Status",
      accessor: "campaignStatus",
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: (campaign) => (
        <div>
          <PPMSButton
            variant={"secondary"}
            label={"Edit"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() => {
              isFormSubmitted.next(false);
              PageHelper.openPage(
                Paths.editMarketingCampaign +
                "/" +
                campaign.cell.row.original.campaignId
              );
            }}
            id={"marketing-campaign-edit-" + campaign.cell.row.original.campaignId}
            className={"manage-list-actions"}
          />
          <PPMSButton
            variant={"secondary"}
            label={"Copy"}
            size={"sm"}
            icon={<MdContentCopy />}
            onPress={() => {
              isFormSubmitted.next(false);
              this.copyMarketingCampaign(campaign.cell.row.original.campaignId);
            }}
            id={"marketing-campaign-copy-" + campaign.cell.row.original.campaignId}
            className={"manage-list-actions"}
          />

          <PPMSButton
            variant={"secondary"}
            label={"Delete"}
            size={"sm"}
            icon={<MdDelete />}
            isDisabled={this.getDeleteDisabled(
              campaign.cell.row.original.campaignStatus
            )}
            onPress={() => {
              const campaignId = campaign.cell.row.original.campaignId;
              this.setState({
                showModal: true,
                campaignId: campaignId,
              });
            }}
            id={"marketing-campaign-delete-" + campaign.cell.row.original.campaignId}
            className={
              "manage-list-actions"
            }
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  async componentDidMount() {
    this.setState({
      loading: true,
      isSaved: true,
    });
  }

  handleSave = () => {
    this.setState({
      isSaved: true,
      showModal: false,
    });
    this.handleDelete();
  };
  handleClose = (event) => {
    this.setState({
      showModal: false,
    });
  };
  handleDelete() {
    const { perPage, currentPage, campaignStatus } = this.state;
    const data = {
      params: {
        page: currentPage,
        size: perPage,
        campaignStatus: campaignStatus,
      },
    };
    this.salesApiService
      .deleteMarketingCampaign(this.state.campaignId)
      .then((response) => {
        if (response.status === 204) {
          this.getListOfMarketingCampaign(data, perPage);
        }
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  handleChange = async (perPage, page) => {
    this.setState({
      loading: true,
    });
    const data = {
      params: {
        page: page,
        size: perPage,
        sort: this.state.sortOrder,
      },
    };
    if (this.state.campaignStatus) {
      data["params"]["campaignStatus"] = this.state.campaignStatus;
    }
    this.salesApiService
      .getListOfCampaigns(data)
      .then((response: any) => {
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.setState({
          loading: false,
          filteredItems: response.data.campaignListDTO,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: perPage,
          currentPage: page,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  handleSort = (sortBy) => {
    let sort;
    let order;
    sortBy ? (!sortBy.desc ? (order = "ASC") : (order = "DESC")) : (sort = "");
    if (order) sort = sortBy?.id + "," + order;
    this.setState({
      sortOrder: sort,
    });
    const data = {
      params: {
        page: 1,
        size: this.state.perPage,
        sort: sort,
      },
    };
    if (this.state.campaignStatus) {
      data["params"]["campaignStatus"] = this.state.campaignStatus;
    }
    this.salesApiService
      .getListOfCampaigns(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.campaignListDTO
            ? response.data.campaignListDTO
            : [];
        this.setState({
          loading: false,
          filteredItems: filteredRows,
          currentPage: 1,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  getListOfMarketingCampaign(data, perPage) {
    this.salesApiService
      .getListOfCampaigns(data)
      .then((response: any) => {
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;
        let totalPages =
          response && response.data && response.data.totalPages
            ? response.data.totalPages
            : 0;
        this.setState({
          loading: false,
          filteredItems: response.data.campaignListDTO,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: perPage,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  handleButtonClick(event: any) {
    console.log(event);
  }

  handlePropertyRadioChange = (event: any) => {
    let startValue = event.target.options[event.target.selectedIndex].id;
    this.setState({
      defaultFilterValue: startValue,
    });

    this.refreshPropertyTableFromFilterChange(startValue);
  };

  refreshPropertyTableFromFilterChange(startValue: string) {
    if (startValue === "show_campaigns") {
      startValue = "";
    }
    this.setState({
      loading: true,
      campaignStatus: startValue,
      currentPage: 1,
    });
    const { perPage } = this.state;
    const data = {
      params: {
        page: 1,
        size: perPage,
        campaignStatus: startValue,
      },
    };
    this.getListOfMarketingCampaign(data, perPage);
  }

  render() {
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          key={"salesppms" + (this.state.campaignStatus || "")}
          title={"Marketing Campaign"}
          data={this.state.filteredItems}
          columns={this.columns}
          currentPage={this.state.currentPage - 1}
          defaultSortField={"campaignStartDate"}
          loading={this.state.loading}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          serverSort={true}
          isPaginationEnabled={true}
          onChange={this.handleChange}
          handleSort={(sortBy) => this.handleSort(sortBy)}
          sortDesc={false}
          subHeaderComponent={
            <div className={"grid-row"}>
              <div className={"grid-col-6"}>
                <div className="filter-bkgd">
                  <PPMSSelect
                    id={"filter-by-campaigns"}
                    selectName={"filterCampaigns"}
                    values={this.state.filterCampaigns}
                    selectedValue={this.state.defaultFilterValue}
                    onChange={this.handlePropertyRadioChange}
                    isValid={false}
                    isInvalid={false}
                    validationMessage={""}
                    identifierKey={"id"}
                    identifierValue={"value"}
                    label={"Filter by Campaign Status:"}
                    isRequired={false}
                    selectClass={"inventory"}
                  />
                </div>
              </div>
              <div className={"grid-col-12"}>
                <div className={""}>
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"addCampaign"}
                    label={"Create Campaign"}
                    onPress={() =>
                      PageHelper.openPage(Paths.addEditMarketingCampaign)
                    }
                    id={"create-Marketing-Campaign"}
                    className={"out-button btn-create"}
                  />
                </div>
              </div>
            </div>
          }
        />
        <PPMSModal
          body={"Are you sure you want to delete this Marketing Campaign?"}
          id={"delete-marketing-campaign"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.handleSave}
          title={"Delete Marketing Campaign"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </div>
    );
  }
}
