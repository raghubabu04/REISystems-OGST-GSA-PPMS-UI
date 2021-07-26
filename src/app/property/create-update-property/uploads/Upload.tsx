import React from "react";
import {FilesUpload} from "./FilesUpload";
import {Tab, Tabs} from "react-bootstrap";
import {PropertyApiService} from "../../../../api-kit/property/property-api-service";
import {PPMSAlert} from "../../../../ui-kit/components/common/PPMS-alert";
import {UserUtils} from "../../../../utils/UserUtils";
import PPMSErrorMessage from "../../../../ui-kit/components/common/form/PPMS-error-message";

export interface UploadProps {
  icn: string;
  fileInfectedStatus?: any;
  inValid?: boolean;
  validationMessage?: string;
  fileUploaded?: boolean;
  onFileUpload?: any;
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
}
let interval;
export class Upload extends React.Component<UploadProps, UploadState> {
  constructor(props) {
    super(props);
    this.state = {
      message: ["Please upload property Pictures and Documents."],
      alertStatus: "info",
      imageFilesList: [],
      docsFilesList: [],
      accordianExpanded: true,
      accordingDisplay: "show",
      selectedTab: "image",
      imgMsg: ["Please upload property Pictures and Documents."],
      imgStatus: "info",
      flag: false,
      editFlag: false,
      fileUploaded: false,
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
      clearInterval(interval);
    }
  };

  handleSelect = (selectedTab) => {
    this.setState({ selectedTab });
  };
  private propertyAPIService: PropertyApiService = new PropertyApiService();

  componentDidUpdate(prevProps: UploadProps, prevState: UploadState) {
    if (
      prevState.fileUploaded !== this.state.fileUploaded &&
      this.props.onFileUpload
    ) {
      this.props.onFileUpload(this.state);
    }
  }

  componentDidMount() {
    this.getPropertyICNStatus();
    this.updateFilesList();
  }
  triggerDrop = () => {
    let imageFilesList = [];
    let docsFilesList = [];
    this.setState((prevState) => {
      return {
        ...prevState,
        fileUploaded: true,
      };
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
          clearInterval(interval);
        }
      }
      this.propertyAPIService
        .getUploadedItems(this.props.icn, "ICN")
        .then((response: any) => {
          if (response.data && response.data.image) {
            imageFilesList = response.data.image;
          }
          if (response.data && response.data.documents) {
            docsFilesList = response.data.documents;
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
    this.propertyAPIService
      .getUploadedItems(this.props.icn, "ICN")
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
  };
  getPropertyICNStatus = () => {
    this.propertyAPIService
      .getPropertyByICNRequest(this.props.icn)
      .then((res: any) => {
        this.setState({
          editFlag: res?.data?.editDocumentsFlag,
        });
      })
      .catch((error) => console.log(error));
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
                  icn={this.props.icn}
                  filesLimit={25}
                  type="images"
                  updateAlert={this.updateAlert}
                  files={this.state.imageFilesList}
                  maxFileSize={256}
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
                  icn={this.props.icn}
                  filesLimit={10}
                  type="documents"
                  updateAlert={this.updateAlert}
                  files={this.state.docsFilesList}
                  maxFileSize={256}
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
