import React from "react";
import {PPMSButton} from "../../ui-kit/components/common/PPMS-button";

import {MdDelete, MdEdit} from "react-icons/md";
import {CommonApiService} from "../../api-kit/common/common-api.service";
import {PPMSModal} from "../../ui-kit/components/common/PPMS-modal";
import {UserApiService} from "../../api-kit/user/user-api.service";
import {PageHelper, Paths} from "../Router";
import {isFormSubmitted} from "../../service/validation.service";
import PPMSTableInfoCell, {InfoField,} from "../../ui-kit/components/PPMS-table-info-cell";
import PPMSDatatable from "../../ui-kit/components/common/datatable/PPMS-datatable";

interface InternalAgencyProps {
  match: any;
  location: any;
  history: any;
  context: any;
}

interface InternalAgencyState {
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
  agencyIdCode: string;
  showActiveStatusModal: boolean;

  rowsPerPageOptions: [number, number, number, number, number];
  successMessage: string;
}
export class InternalAgencyListPage extends React.Component<
  InternalAgencyProps,
  InternalAgencyState
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
      agencyIdCode: "",
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      successMessage: this.props.location.successMessage,
      showActiveStatusModal: false,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  columns = [
    {
      Header: "Agency Code",
      accessor: "agencyCode",
    },
    {
      Header: "Agency",
      accessor: "agencyAbbreviation",
    },
    {
      Header: "POC",
      accessor: "agencyContact.name",

      Cell: (agency) => this.renderPocCell(agency),
    },
    {
      Header: "Internal Screening Days",
      accessor: "screeningDays",
    },
    {
      Header: "Local Screening Days",
      accessor: "localScreeningDays",
    },
    {
      Header: "Active Status",
      accessor: "isActive",
      Cell: (agency) => this.renderActiveStatusCell(agency),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      Header: "Begin Date",
      accessor: "beginDate",
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: (agency) => (
        <>
          <PPMSButton
            variant={"secondary"}
            label={"Edit"}
            size={"sm"}
            icon={<MdEdit />}
            onPress={() => {
              isFormSubmitted.next(false);
              PageHelper.openPage(
                Paths.editInternalAgency + "/" + agency.row.values.agencyCode
              );
            }}
            id={"edit-" + agency.row.values.agencyCode}
            className={"manage-list-actions"}
          />
          <PPMSButton
            variant={"danger"}
            isDisabled={this.getDeleteDisable(agency.row.values.isActive)}
            label={"Delete"}
            size={"sm"}
            icon={<MdDelete />}
            onPress={() => {
              const agencyCode = [...this.state.filteredItems];
              const agencyCodeIndex = agencyCode.findIndex(
                (o) => o.agencyCode === agency.row.values.agencyCode
              );
              this.setState({
                showModal: true,
                agencyIdCode: agencyCode[agencyCodeIndex].agencyCode,
              });
            }}
            id={"delete-" + agency.row.values.agencyCode}
            className={
              "manage-list-actions usa-button  usa-button--sm usa-button--base"
            }
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  private commonApiService = new CommonApiService();
  private userApiService = new UserApiService();

  async componentDidMount() {
    const { perPage } = this.state;
    this.setState({
      loading: true,
      isSaved: true,
    });
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    this.getListofInternalAgency(data);
  }
  getListofInternalAgency(data) {
    this.commonApiService
      .getInternalAgencyList(data)
      .then((response: any) => {
        let filteredRows =
          response && response.data && response.data.internalAgencyDTO
            ? response.data.internalAgencyDTO
            : [];
        let totalElements =
          response && response.data && response.data.totalElements
            ? response.data.totalElements
            : 0;

        this.setState({
          filteredItems: filteredRows,
          totalRows: totalElements,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }
  handleSave = (event) => {
    this.setState({
      isSaved: true,
      showModal: false,
    });
    this.handleDelete(this.state.agencyIdCode);
  };
  handleClose = (event) => {
    this.setState({
      showModal: false,
    });
  };
  renderPocCell = (agency) => {
    const name: string = agency.row.values["agencyContact.name"];
    const row = agency.data.find(
      (record: any) => record?.agencyContact?.name === name
    );
    const fields: InfoField[] = [
      { key: "phone", value: row?.agencyContact?.phone },
      { key: "fax", value: row?.agencyContact?.fax },
      { key: "email", value: row?.agencyContact?.email },
    ];

    return (
      <PPMSTableInfoCell
        popOverTitle={"Point of Contact"}
        cellValue={name}
        fields={fields}
      />
    );
  };
  handleDelete(agency: any) {
    const { perPage } = this.state;
    const agencyCode = {
      agencyCode: agency,
    };
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    if (this.state.isSaved === true) {
      this.commonApiService.deleteInternalAgency(agencyCode).then((res) => {
        this.getListofInternalAgency(data);
      });
    }
  }

  getDeleteDisable(agency: string) {
    if (agency === "No") return true;
    return false;
  }
  handleChange = async (perPage, page) => {
    this.setState({loading: true});
    const data = {
      params: {
        page: page,
        size: perPage,
      },
    };
    this.callCommonApiOnChange(data);
  };
  callCommonApiOnChange = (data) => {
    this.commonApiService
      .getInternalAgencyList(data)
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
          filteredItems: response.data.internalAgencyDTO,
          totalRows: totalElements,
          totalPages: totalPages,
          perPage: data.size,
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  handleButtonClick(event: any) {
    console.log(event);
  }
  handleSort = (sortBy) => {
    // instead of setTimeout this is where to handle the API call.
    setTimeout(() => {}, 100);
  };

  //PPDMS-2829 Active/Inactive agency on "Manage Internal Agency" Page
  renderActiveStatusCell(agency: any) {
    return (
      <>
        {agency.row.values.isActive}
        <PPMSButton
          variant={"secondary"}
          label={agency.row.values.isActive == "Yes" ? "Inactive" : "Active"}
          size={"sm"}
          onPress={() => {
            const agencyCode = [...this.state.filteredItems];
            const agencyCodeIndex = agencyCode.findIndex(
              (o) => o.agencyCode === agency.row.values.agencyCode
            );
            this.setState({
              showActiveStatusModal: true,
              agencyIdCode: agencyCode[agencyCodeIndex].agencyCode,
            });
          }}
          id={"Agency Active Status Button-" + agency.row.values.agencyCode}
          className={"internal-agency-active-status-button"}
        />
      </>
    );
  }

  handleActiveStatusModalSave = (event) => {
    this.setState({
      showActiveStatusModal: false,
      isSaved: true,
    });
    this.handleInternalAgencyStatus(this.state.agencyIdCode);
  };

  handleActiveStatusModalClose = (event) => {
    this.setState({
      showActiveStatusModal: false,
    });
  };

  handleInternalAgencyStatus(agency: any) {
    const { perPage } = this.state;
    const agencyCode = {
      agencyCode: agency,
    };
    const data = {
      params: {
        page: 1,
        size: perPage,
      },
    };
    if (this.state.isSaved === true) {
      this.commonApiService
        .changeInternalAgencyStatus(agencyCode)
        .then((res) => {
          this.getListofInternalAgency(data);
        });
    }
  }

  render() {
    return (
      <div className={"ui-ppms"}>
        <PPMSDatatable
          title={"Manage Internal Agency"}
          data={this.state.filteredItems}
          columns={this.columns}
          defaultSortField={"agencyCode"}
          loading={this.state.loading}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          isPaginationEnabled={true}
          onChange={this.handleChange}
          handleSort={(sortBy) => this.handleSort(sortBy)}
          subHeaderComponent={
            <div className="grid-col-12">
              <PPMSButton
                variant={"primary"}
                type={"button"}
                value={"createInternalAgency"}
                label={"Create Internal Agency"}
                onPress={() => {
                  PageHelper.openPage(Paths.addInternalAgency);
                }}
                id={"create-internal-agency"}
                className={"out-button btn-create"}
              />
            </div>
          }
        />
        <PPMSModal
          body={"Are you sure you want to delete this Internal Agency?"}
          id={"inactivate-internal-agency"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.handleSave}
          title={"Delete Internal Agency"}
          label={"Yes"}
          labelCancel={"No"}
        />
        <PPMSModal
          body={
            "Are you sure you want to change the status of this Internal Agency?"
          }
          id={"internal-agency-active-status"}
          show={this.state.showActiveStatusModal}
          handleClose={this.handleActiveStatusModalClose}
          handleSave={this.handleActiveStatusModalSave}
          title={"Change Status of Internal Agency"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </div>
    );
  }
}
