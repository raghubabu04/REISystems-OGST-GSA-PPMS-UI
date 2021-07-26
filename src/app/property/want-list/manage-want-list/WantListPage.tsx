import React from "react";
import { Paths, PageHelper } from "../../../Router";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { PropertyApiService } from "../../../../api-kit/property/property-api-service";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";
import moment from "moment";
import { UserUtils } from "../../../../utils/UserUtils";
import { MdEdit } from "react-icons/md";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { wantList } from "../../../common/constants/HeaderLinks";
import { CgRemove } from "react-icons/cg";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { WantListApiService } from "../../../../api-kit/property/wantList-api-service";
import { isFormSubmitted } from "../../../../service/validation.service";
import { formatICN } from "../validations/FieldValidations";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
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
  userDocType: string;
  attachmentTypeOptions: any[];
  sort: string;
  userPreferenceId: string;
  wantListResults?: any;
  showModal: boolean;
  isSaved: boolean;
  wantListId: string;
  wantListName: string;
}

class WantListPage extends React.Component<Props, State> {
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
      userDocType: "Excel",
      attachmentTypeOptions: [
        { id: "e", value: "Excel", isSelected: true },
        { id: "p", value: "PDF", isSelected: false },
      ],
      sort: "wantListName,ASC",
      userPreferenceId: "",
      showModal: false,
      isSaved: false,
      wantListId: "",
      wantListName: "",
    };
    this.handleDelete = this.handleDelete.bind(this);
  }
  private userApiService = new UserApiService();
  private propertyApiService = new PropertyApiService();
  private wantListApiService = new WantListApiService();

  async componentDidMount() {
    const { perPage } = this.state;
    this.setState({
      loading: true,
    });
    const data = {
      page: 1,
      size: perPage,
    };
    this.loadWishListOnPageLoad(data);
  }

  loadWishListOnPageLoad(data) {
    //Get User Document Type
    this.userApiService
      .getUserPreferences(UserUtils.getUserInfo().emailAddress)
      .then((response: any) => {
        if (response.data !== null) {
          if (response.data.wantListNotifyType === "PDF") {
            this.setState({
              attachmentTypeOptions: [
                { id: "e", value: "Excel", isSelected: false },
                { id: "p", value: "PDF", isSelected: true },
              ],
            });
          }
          this.setState({
            userPreferenceId: response.data.id,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    //Get Want Lists for table
    this.propertyApiService
      .getWantLists(data)
      .then((response: any) => {
        let filteredRows = [];
        for (let wantList of response.data.wantListDetails) {
          let row = {
            wantListId: wantList.wantListId,
            itemControlNumber: wantList.itemControlNumber,
            wantListName: wantList.wantListName,
            itemName: wantList.itemName,
            fscCodes: wantList.fscCodes,
            reimbursement: wantList.reimbursement,
            conditionCode: wantList.conditionCode,
            stateCodes: wantList.stateCodes,
            expiryDate: moment(wantList.expiryDate).format("MM/DD/YYYY"),
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
          wantListResults: response.data.wantListDetails,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  handleChange = async (perPage, page) => {
    //Refresh Want lists for table based on changes
    this.setState({ loading: true });
    const data = {
      page: page,
      size: perPage,
    };
    this.propertyApiService
      .getWantLists(data)
      .then((response: any) => {
        let filteredRows = [];
        for (let wantList of response.data.wantListDetails) {
          let fsc = wantList.fscCodes.replaceAll(",", ", ");
          let states = wantList.stateCodes.replaceAll(",", ", ");
          let row = {
            wantListId: wantList.wantListId,
            itemControlNumber: wantList.itemControlNumber
              ? formatICN(wantList.itemControlNumber).toUpperCase()
              : "",
            wantListName: wantList.wantListName,
            itemName: wantList.itemName,
            fscCodes: fsc,
            reimbursement: wantList.reimbursement,
            conditionCode: wantList.conditionCode,
            stateCodes: states,
            expiryDate: moment(wantList.expiryDate).format("MM/DD/YYYY"),
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
          wantListResults: response.data.wantListDetails,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  handleAttachmentTypeChange(event, state) {
    //Update document type for user
    event.forEach((e) => {
      if (e.isSelected) {
        let payload = {
          id: state.userPreferenceId,
          email: UserUtils.getUserInfo().emailAddress,
          wantListNotifyType: e.value,
        };
        this.userApiService
          .updateWantListDocumentType(payload)
          .then((response: any) => {
            //If record did not exist, get new id
            if (state.userPreferenceId === "") {
              this.userApiService
                .getUserPreferences(UserUtils.getUserInfo().emailAddress)
                .then((response: any) => {
                  this.setState({
                    userPreferenceId: response.data.id,
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  handleSort = (sortBy) => {};

  getWantList(data, perPage) {
    this.propertyApiService
      .getWantLists(data)
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
          filteredItems: response.data.wantListDetails,
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

  columns = [
    {
      Header: "Want List Name",
      accessor: "wantListName",
      disableSortBy: true,
    },
    {
      Header: "ICN",
      accessor: "itemControlNumber",
      disableSortBy: true,
    },
    {
      Header: "Item Name",
      accessor: "itemName",
      disableSortBy: true,
    },
    {
      Header: "FSC",
      accessor: "fscCodes",
      disableSortBy: true,
    },
    {
      Header: "Exclude Reimbursement Required Items",
      accessor: "reimbursement",
      disableSortBy: true,
    },
    {
      Header: "Minimum Condition Code",
      accessor: "conditionCode",
      disableSortBy: true,
    },
    {
      Header: "Location State",
      accessor: "stateCodes",
      disableSortBy: true,
    },
    {
      Header: "Expiration Date",
      accessor: "expiryDate",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      id: "editUser",
      accessor: "userStatus",
      ApplyFilter: () => {},
      Cell: (wantList) => (
        <>
          <PPMSButton
            variant={"secondary"}
            label={"Edit"}
            size={"sm"}
            className="manage-list-actions"
            icon={<MdEdit />}
            onPress={() => {
              isFormSubmitted.next(false);
              PageHelper.openPage(
                Paths.EditWantList + "/" + wantList.cell.row.original.wantListId
              );
            }}
            id={`edit-${wantList.row.values.wantListName}`}
            isDisabled={false}
          />

          <PPMSButton
            variant={"secondary"}
            label={"Delete"}
            size={"sm"}
            icon={<CgRemove />}
            onPress={() => {
              const wantListId = wantList.cell.row.original.wantListId;
              this.setState({
                showModal: true,
                wantListId: wantListId,
              });
            }}
            id={`delete-${wantList.row.values.wantListName}`}
            className={
              "manage-list-actions withdraw"
            }
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      disableSortBy: true,
    },
  ];

  editDisabled = () => {};

  delete = () => {
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
    const { addToast } = this.props.actions;
    const { perPage, currentPage } = this.state;
    const data = {
      page: currentPage,
      size: perPage,
    };
    this.wantListApiService
      .deleteWantListById(this.state.wantListId)
      .then((response) => {
        if (response.status === 200) {
          const { addToast } = this.props.actions;
          addToast({
            text: "Want list successfully deleted.",
            type: "success",
            heading: "Success",
          });
          this.getWantList(data, perPage);
        }
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  render() {
    return (
      <div className="ui-ppms">
        <PPMSDatatable
          title={"Want List Page"}
          data={this.state.filteredItems}
          columns={this.columns}
          defaultSortField={"wantListName"}
          loading={this.state.loading}
          rowsPerPageOptions={this.state.rowsPerPageOptions}
          totalRows={this.state.totalRows}
          totalPages={this.state.totalPages}
          rowsPerPage={this.state.perPage}
          isPaginationEnabled={true}
          onChange={this.handleChange}
          handleSort={(sortBy) => this.handleSort(sortBy)}
          subHeaderComponent={
            <div className={"grid-row"}>
              <div className={"grid-col-12"}>
                <div className="ui-ppms filter-bkgd">
                  <PPMSToggleRadio
                    id={"emailAttachmentType"}
                    options={this.state.attachmentTypeOptions}
                    isInline={true}
                    isDisabled={false}
                    name={"condition"}
                    className={"email-attachment-type"}
                    label={"Email Attachment Type:"}
                    validationMessage={""}
                    isSingleSelect={true}
                    onChange={(event) =>
                      this.handleAttachmentTypeChange(event, this.state)
                    }
                    isRequired={false}
                  />
                </div>
              </div>
              <div className={"grid-col"}>
                <div className="btn-create-want-list">
                  <PPMSButton
                    variant={"primary"}
                    type={"button"}
                    value={"createWantList"}
                    label={"Create Want List"}
                    className={"create-property out-button"}
                    onPress={() => {
                      PageHelper.openPage(Paths.createWantList);
                    }}
                    id={"createWantList"}
                  />
                </div>
              </div>
            </div>
          }
        />
        <PPMSModal
          body={"Are you sure you want to delete this Want List?"}
          id={"delete-want-list"}
          show={this.state.showModal}
          handleClose={this.handleClose}
          handleSave={this.delete}
          title={"Delete Want List"}
          label={"Yes"}
          labelCancel={"No"}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(WantListPage);
