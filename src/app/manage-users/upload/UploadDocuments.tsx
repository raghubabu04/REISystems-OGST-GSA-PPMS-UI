import React from "react";
import { FilesUpload } from "./FilesUpload";
import { Tab, Tabs } from "react-bootstrap";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { UserUtils } from "../../../utils/UserUtils";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { InventoryApiService } from "../../../api-kit/property/inventory-api-service";
import { PPMSModal } from "../../../ui-kit/components/common/PPMS-modal";
import { PPMSTextArea } from "../../../ui-kit/components/common/input/PPMS-textarea";
import { documentTypeOptions, documentTypes } from "../Constants";
import { LEAApiService } from "../../../api-kit/property/lea-api-service";
import moment from "moment";

export interface UploadDocumentsProps {
  match?: any;
  userId: string;
  fileInfectedStatus?: any;
  fileUploaded?: boolean;
  disabledAttachmentList?: any[];
  downloadDisabled?: boolean;
  actionDisabled?: boolean;
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
  accordianExpanded: boolean;
  accordingDisplay: string;
  selectedTab: string;
  flag: boolean;
  editFlag: boolean;
  fileTypeDescription: string;
  fileId: any;
  fileUploaded: boolean;
  disabledAttachmentList: any[];
}
let interval;
export class UploadDocuments extends React.Component<
  UploadDocumentsProps,
  UploadDocumentsState
> {
  constructor(props) {
    super(props);
    this.state = {
      message: ["Please upload Documents."],
      alertStatus: "info",
      docsFilesList: [],
      accordianExpanded: true,
      accordingDisplay: "show",
      selectedTab: "image",
      flag: false,
      editFlag: false,
      fileTypeDescription: "",

      fileId: "",
      fileUploaded: false,
      disabledAttachmentList: [],
    };
  }
  updateAlert = (message) => {
    if (this.state.selectedTab === "document") {
      this.setState({
        message: message.error,
        alertStatus: message.type,
      });
    }
    if (message?.errorType === "upload") {
      clearInterval(interval);
    }
  };
  0;

  handleSelect = (selectedTab) => {
    this.setState({ selectedTab });
  };
  private leaApiService: LEAApiService = new LEAApiService();

  componentDidMount() {
    this.updateFilesList();
  }

  triggerDrop = () => {
    let docsFilesList = [];
    this.setState((prevState) => {
      return {
        ...prevState,
        fileUploaded: true,
      };
    });
    interval = setInterval(() => {
      if (docsFilesList.length !== 0) {
        let infectedFiles = docsFilesList.filter(
          (file) => file.virusScanStatus === "INFECTED"
        );
        if (infectedFiles.length !== 0) {
          this.props.fileInfectedStatus(true);
        } else {
          this.props.fileInfectedStatus(false);
        }
        let filesProcessed = docsFilesList.filter(
          (file) => file.virusScanStatus === "IN_PROGRESS"
        );
        if (filesProcessed.length === 0) {
          clearInterval(interval);
        }
      }

      this.leaApiService
        .getFilesForLEA(this.props.userId)
        .then((response: any) => {
          if (response.data && response.data.documents) {
            docsFilesList = response.data.documents;
          }
          this.setState({
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
    this.leaApiService
      .getFilesForLEA(this.props.userId)
      .then((response: any) => {
        this.checkDisabledFiles(response.data.documents);
        let docsFilesList = [];
        let fileUploaded = false;
        if (response.data && response.data.documents) {
          docsFilesList = response.data.documents;
          this.checkUserAndEditDocumentFlag(docsFilesList);
        }
        if (docsFilesList.length > 0) {
          fileUploaded = true;
        }
        if (docsFilesList.length !== 0) {
          let infectedFiles = docsFilesList.filter(
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
          docsFilesList,
          fileUploaded,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  checkDisabledFiles(files) {
    let disabledList = [];
    for (let file of files) {
      //If user is not SM or Weapons APO AND either
      //User did not create this file
      //Or file is from before this year...
      //THEN user can not edit or delete the file
      if (
        !(UserUtils.isSystemAdminUser() || UserUtils.isUserFireArmManager()) &&
        (file.createdBy !== UserUtils.getUserInfo().emailAddress ||
          moment(file.createdDate).year() < moment().year())
      ) {
        disabledList.push(file.attachmentOrder);
      }
    }
    this.setState({
      disabledAttachmentList: disabledList,
    });
  }

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
    this.leaApiService
      .updateFilesForLEA(data)
      .then((response) => {
        response.data.forEach((item) => {
          fileToEdit.documentType = item.uploadItem.documentType;
          fileToEdit.documentTypeDescription =
            item.uploadItem.documentTypeDescription;
        });
        this.setState({
          docsFilesList,
        });
      })
      .catch((error) => {
        console.error("Error getting LEA documents from API", error);
      });
  };

  checkUserAndEditDocumentFlag = (files) => {
    let condition = this.state.editFlag;
    if (files.length !== 0) {
      files.forEach((file) => {
        if (condition === false) {
          if (UserUtils.isSystemAdminUser() || UserUtils.isUserApo()) {
            file.protected = false;
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

  render() {
    return (
      <>
        <div className={"grid-row grid-gap-4"} />
        <div
          className={
            !this.state.fileUploaded
              ? "grid-row grid-gap-4 usa-form-group usa-form-group--error"
              : "grid-row grid-gap-4"
          }
        ></div>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSAlert
              alertBodyArray={this.state.message}
              alertClassName={"dropzone-alert"}
              alertKey={"dropzone-alert-document"}
              alertVariant={this.state.alertStatus}
              id={"dropzone-alert-document"}
              show={this.state.message.length > 0}
            />

            <FilesUpload
              id={"lea-documents"}
              userId={this.props.userId}
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
              disabledAttachmentList={this.state.disabledAttachmentList}
              actionDisabled={this.props.actionDisabled}
              downloadDisabled={this.props.downloadDisabled}
            />
          </div>
        </div>
      </>
    );
  }
}
