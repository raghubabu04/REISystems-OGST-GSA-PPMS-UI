import React from "react";
import {FilesUpload} from "./FilesUpload";
import {Tab, Tabs} from "react-bootstrap";
import {PPMSAlert} from "../../../../ui-kit/components/common/PPMS-alert";
import {UserUtils} from "../../../../utils/UserUtils";
import PPMSErrorMessage from "../../../../ui-kit/components/common/form/PPMS-error-message";
import {UserApiService} from "../../../../api-kit/user/user-api.service";

export interface UploadProps {
  fileInfectedStatus?: any;
  inValid?: boolean;
  validationMessage?: string;
  fileUploaded?: boolean;
  onFileUpload?: any;
  updateGroupEmailIds?: any;
  groupEmailId?: any;
  disableBtn?: any;
}

export interface UploadState {
  message: string[];
  alertStatus:
  | "info"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "dark"
  | "light";
  imageFilesList: any[];
  docsFilesList: any[];
  accordianExpanded: boolean;
  accordingDisplay: string;
  selectedTab: string;
  imgMsg: string[];
  imgStatus:
  | "info"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "dark"
  | "light";
  flag: boolean;
  editFlag: boolean;
  fileUploaded: boolean;
  groupEmailId: any;
}
let interval: NodeJS.Timeout;
export class Upload extends React.Component<UploadProps, UploadState> {
  constructor(props) {
    super(props);
    this.state = {
      message: ["Please upload Pictures and Documents."],
      alertStatus: "info",
      imageFilesList: [],
      docsFilesList: [],
      accordianExpanded: true,
      accordingDisplay: "show",
      selectedTab: "image",
      imgMsg: ["Please upload Pictures and Documents."],
      imgStatus: "info",
      flag: false,
      editFlag: false,
      fileUploaded: false,
      groupEmailId: "",
    };
  }
  updateAlert = (message) => {
    if (message.error.length !== 0) {
      if (this.state.selectedTab === "document") {
        this.setState({
          message: message.error,
          alertStatus: message.type,
        });
      } else {
        this.setState({
          imgMsg: message.error,
          imgStatus: message.type,
        });
      }
    }
    if (message?.errorType === "upload") {
      this.clearSessionInterval();
    }
  };

  handleSelect = (selectedTab) => {
    this.setState({ selectedTab });
  };
  private userApiService: UserApiService = new UserApiService();

  componentDidUpdate(prevProps: UploadProps, prevState: UploadState) {
    if (
      prevState.fileUploaded !== this.state.fileUploaded &&
      this.props.onFileUpload
    ) {
      this.props.onFileUpload(this.state);
    }
  }
  componentWillUnmount() {
    this.clearSessionInterval();
  }

  componentDidMount() {
    let payLoad = {
      id: null,
      agencyBureaus: "",
      stateCodes: "",
      recipientTypes: "",
      emailText: "",
      subjectLine: "",
      bidderType: "",
      bidderCity: "",
      bidderStateCode: "",
      saleNumber: "",
      lotNumber: "",
      emailCriteriaId: null,
      status: "Draft",
    };
    this.userApiService
      .sendGroupEmails(payLoad)
      .then((res) => {
        let id = res?.data?.id;
        let criteriaId = res?.data?.groupEmailCriteria?.groupEmailCriteriaId;
        this.props.updateGroupEmailIds(id, criteriaId);
        this.setState({
          groupEmailId: id,
        });
      })
      .catch((error) => console.log(error));
  }

  clearSessionInterval = () => {
    clearInterval(interval);
  };

  triggerDrop = () => {
    let imageFilesList = [];
    let docsFilesList = [];
    this.setState((prevState) => {
      return {
        ...prevState,
        fileUploaded: true,
      };
    });
    this.props.disableBtn(true);
    this.setState({
      imgMsg: [],
      imgStatus: "info",
    });
    interval = setInterval(() => {
      let files = imageFilesList.concat(docsFilesList);
      if (files.length !== 0) {
        let infectedFiles = files.filter(
          (file) => file.virusScanStatus === "INFECTED"
        );
        if (infectedFiles.length !== 0) {
          this.props.fileInfectedStatus(true);
        } else {
          this.props.fileInfectedStatus(false);
        }
        let filesProcessed = files.filter(
          (file) => file.virusScanStatus === "IN_PROGRESS"
        );
        if (filesProcessed.length === 0) {
          this.clearSessionInterval();
        }
      }
      this.userApiService
        .getGroupEmailUploadedItem(this.state.groupEmailId)
        .then((response: any) => {
          if (response.data && response.data.image) {
            imageFilesList = response.data.image;
          }
          if (response.data && response.data.documents) {
            docsFilesList = response.data.documents;
          }
          let concatFiles = imageFilesList.concat(docsFilesList);

          let cleanFiles = concatFiles.filter(
            (file) => file.virusScanStatus === "CLEAN"
          );
          if (cleanFiles.length === concatFiles.length) {
            this.clearSessionInterval();
            this.props.disableBtn(false);
          }

          this.setState({
            imageFilesList,
            docsFilesList,
          });
        })
        .catch((error: any) => {
          console.log(error);
          clearInterval(interval);
        });
    }, 10000);
  };

  updateFilesList = () => {
    if (
      this.props.groupEmailId !== null ||
      this.props.groupEmailId !== undefined
    ) {
      this.userApiService
        .getGroupEmailUploadedItem(this.state.groupEmailId)
        .then((response: any) => {
          let imageFilesList = [];
          let docsFilesList = [];
          let fileUploaded = false;
          if (response.data && response.data.image) {
            imageFilesList = response.data.image;
            this.checkUserAndEditDocumentFlag(imageFilesList);
          }
          if (response.data && response.data.documents) {
            docsFilesList = response.data.documents;
            this.checkUserAndEditDocumentFlag(docsFilesList);
          }
          if (imageFilesList.length > 0 || docsFilesList.length > 0) {
            fileUploaded = true;
          }

          let files = imageFilesList.concat(docsFilesList);
          if (files.length !== 0) {
            let infectedFiles = files.filter(
              (file) => file.virusScanStatus === "INFECTED"
            );
            if (infectedFiles.length !== 0) {
              this.props.fileInfectedStatus(true);
            } else {
              this.props.fileInfectedStatus(false);
            }
          } else {
            this.props.fileInfectedStatus(false);
          }

          this.setState({
            imageFilesList,
            docsFilesList,
            fileUploaded,
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  checkUserAndEditDocumentFlag = (files) => {
    let condition = this.state.editFlag;
    if (files.length !== 0) {
      files.forEach((file) => {
        if (condition === false) {
          if (UserUtils.isSystemAdminUser() || UserUtils.isUserApo()) {
            file.protected = false;
          } else {
            file.protected = true;
          }
        } else {
          file.protected = false;
        }
      });
    }
  };

  toggleAccordion = (event: any, accordianExpanded: boolean) => {
    event.preventDefault();
    this.setState({
      accordianExpanded: !accordianExpanded,
      accordingDisplay: accordianExpanded === true ? "hide" : "show",
    });
  };

  render() {
    return (
      <>
        <div className={"grid-row grid-gap-4"} />
        <div
          className={
            this.props.inValid && !this.state.fileUploaded
              ? "grid-row grid-gap-4 usa-form-group usa-form-group--error"
              : "grid-row grid-gap-4"
          }
        >
          <div className={"grid-col"}>
            <Tabs
              defaultActiveKey="image"
              id="file-upload-tab"
              onSelect={this.handleSelect}
            >
              <Tab eventKey="image" title="Image">
                <PPMSAlert
                  alertBodyArray={this.state.imgMsg}
                  alertClassName={"dropzone-alert"}
                  alertKey={"dropzone-alert-image"}
                  alertVariant={this.state.imgStatus}
                  id={"dropzone-alert-image"}
                  show={this.state.imgMsg.length > 0}
                />
                <FilesUpload
                  id={"image"}
                  filesLimit={999}
                  type="images"
                  updateAlert={this.updateAlert}
                  files={this.state.imageFilesList}
                  maxFileSize={10}
                  groupEmailId={this.state.groupEmailId}
                  triggerDrop={this.triggerDrop}
                  updateFilesList={this.updateFilesList}
                />
              </Tab>
              <Tab eventKey="document" title="Document">
                <PPMSAlert
                  alertBodyArray={this.state.message}
                  alertClassName={"dropzone-alert"}
                  alertKey={"dropzone-alert-document"}
                  alertVariant={this.state.alertStatus}
                  id={"dropzone-alert-document"}
                  show={this.state.message.length > 0}
                />
                <FilesUpload
                  id={"documents"}
                  filesLimit={999}
                  type="documents"
                  updateAlert={this.updateAlert}
                  files={this.state.docsFilesList}
                  maxFileSize={256}
                  groupEmailId={this.state.groupEmailId}
                  triggerDrop={this.triggerDrop}
                  updateFilesList={this.updateFilesList}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
        <div>
          {this.props.inValid && !this.state.fileUploaded && (
            <PPMSErrorMessage id={`errorMessage-upload`}>
              {this.props.validationMessage}
            </PPMSErrorMessage>
          )}
        </div>
      </>
    );
  }
}
