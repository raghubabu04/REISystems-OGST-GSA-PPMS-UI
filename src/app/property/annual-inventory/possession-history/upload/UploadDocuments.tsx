import React from "react";
import { FilesUpload } from "./FilesUpload";
import { Tab, Tabs } from "react-bootstrap";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";
import { UserUtils } from "../../../../../utils/UserUtils";
import { InventoryApiService } from "../../../../../api-kit/property/inventory-api-service";
import { documentTypeOptions, documentTypes } from "../Constants";
import PPMSErrorMessage from "../../../../../ui-kit/components/common/form/PPMS-error-message";

export interface UploadDocumentsProps {
  match?: any;
  icn: string;
  fileInfectedStatus?: any;
  fileUploaded?: boolean;
  selectFiles?: boolean;
  inValid?: boolean;
  validationMessage?: string;
  selectFilesLabel?: any;
  selectedFiles?: any;
  existingFiles?: any;
  actionDisabled?: boolean;
  onFileUpload?: any;
}

export interface UploadDocumentsState {
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
  docsFilesList: any[];
  imageFilesList: any[];
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
  accordianExpanded: boolean;
  accordingDisplay: string;
  selectedTab: string;
  flag: boolean;
  editFlag: boolean;
  fileTypeDescription: string;
  fileId: any;
  fileUploaded: boolean;
}
let interval;
export class UploadDocuments extends React.Component<
  UploadDocumentsProps,
  UploadDocumentsState
> {
  constructor(props) {
    super(props);
    this.state = {
      message: ["Please upload Pictures and Documents."],
      alertStatus: "info",
      docsFilesList: [],
      imageFilesList: [],
      accordianExpanded: true,
      accordingDisplay: "show",
      selectedTab: "image",
      flag: false,
      editFlag: false,
      fileTypeDescription: "",
      fileId: "",
      fileUploaded: false,
      imgMsg: ["Please upload Pictures and Documents."],
      imgStatus: "info",
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
  private inventoryApiService: InventoryApiService = new InventoryApiService();

  componentDidUpdate(
    prevProps: UploadDocumentsProps,
    prevState: UploadDocumentsState
  ) {
    if (
      prevState.fileUploaded != this.state.fileUploaded &&
      this.props.onFileUpload
    ) {
      this.props.onFileUpload(this.state);
    }
  }

  componentDidMount() {
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

      this.inventoryApiService
        .getPossessionUploadedItems(this.props.icn, "ICN")
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
    this.inventoryApiService
      .getPossessionUploadedItems(this.props.icn, "ICN")
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

  onChangeDocumentDescription = (value) => {
    this.setState({
      fileTypeDescription: value,
    });
  };

  updateDocumentTypes = (id, index) => {
    const documentTypes = {
      options: documentTypeOptions,
      documentTypesKey: "id",
      documentTypesValue: "value",
      isRequired: true,
    };

    let docType = documentTypes.options[index];
    let docsFilesList = this.state.docsFilesList;
    let fileToEdit = docsFilesList.find((item) => item.id === id);
    let data;
    if (docType?.value === "Other") {
      data = [
        {
          id: fileToEdit.id,
          documentType: docType.value,
          documentTypeDescription: "",
        },
      ];
    } else {
      data = [
        {
          id: fileToEdit.id,
          documentType: docType.value,
          documentTypeDescription: "",
        },
      ];
    }
    this.inventoryApiService
      .updatePossessionItems(data)
      .then((response) => {
        response.data.forEach((item) => {
          fileToEdit.documentType = item.uploadItemHistory?.documentType;
          fileToEdit.documentTypeDescription =
            item.uploadItemHistory?.documentTypeDescription;
        });
        this.setState({
          docsFilesList,
        });
      })
      .catch((error) => {
        console.error("Error getting ICN documents from API", error);
      });
  };

  checkUserAndEditDocumentFlag = (files) => {
    let condition = this.state.editFlag;
    if (files.length !== 0) {
      files.forEach((file) => {
        if (condition === false) {
          if (
            UserUtils.isSystemAdminUser() ||
            UserUtils.isUserFireArmManager() ||
            UserUtils.isUserSaspWithFI() ||
            UserUtils.isUserFF()
          ) {
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

  updateSelection = (id, index) => {
    if (index >= 0) {
      this.setState({
        fileId: id,
      });
      this.updateDocumentTypes(id, index);
    }
  };

  copySelectedFiles = (files, type) => {
    this.props.selectedFiles(files, type);
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
          {" "}
          <div className={"grid-col"}>
            <Tabs
              defaultActiveKey="image"
              id="file-upload-tab"
              onSelect={this.handleSelect}
            >
              <Tab eventKey="image" title="Image">
                {this.props.selectFiles ? (
                  <></>
                ) : (
                  <PPMSAlert
                    alertBodyArray={this.state.imgMsg}
                    alertClassName={"dropzone-alert"}
                    alertKey={"dropzone-alert-image"}
                    alertVariant={this.state.imgStatus}
                    id={"dropzone-alert-image"}
                    show={this.state.imgMsg.length > 0}
                  />
                )}
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
                {this.props.selectFiles ? (
                  <></>
                ) : (
                  <PPMSAlert
                    alertBodyArray={this.state.message}
                    alertClassName={"dropzone-alert"}
                    alertKey={"dropzone-alert-document"}
                    alertVariant={this.state.alertStatus}
                    id={"dropzone-alert-document"}
                    show={this.state.message.length > 0}
                  />
                )}
                <FilesUpload
                  id={"documents"}
                  icn={this.props.icn}
                  filesLimit={25}
                  type="documents"
                  updateAlert={this.updateAlert}
                  files={this.state.docsFilesList}
                  maxFileSize={256}
                  triggerDrop={this.triggerDrop}
                  updateFilesList={this.updateFilesList}
                  documentTypes={documentTypes}
                  documentTypesChange={(id, index) =>
                    this.updateSelection(id, index)
                  }
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
