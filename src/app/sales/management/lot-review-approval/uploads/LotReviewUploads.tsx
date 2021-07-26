import React, { useContext } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import PPMSErrorMessage from "../../../../../ui-kit/components/common/form/PPMS-error-message";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { UserUtils } from "../../../../../utils/UserUtils";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";
import LotReviewApproval from "../LotReviewApproval";
import { LotReviewFileUpload } from "./LotReviewFileUploads";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSTextArea } from "../../../../../ui-kit/components/common/input/PPMS-textarea";
import { useWatch } from "react-hook-form";

export interface UploadProps {
  icn?: string;
  lotId?: string;
  lotNumber?: string;
  contractStatus?: string;
  contractId?: string;
  contractNumber?: string;
  saleId?: string;
  saleNumber?: string;
  fileInfectedStatus?: any;
  inValid?: boolean;
  validationMessage?: string;
  fileUploaded?: boolean;
  selectFiles?: boolean;
  selectFilesLabel?: any;
  selectedFiles?: any;
  existingFiles?: any;
  actionDisabled?: boolean;
  maxImages?: number;
  maxDocuments?: number;
  context?: any;
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
  showDocumentTypeModal: boolean;
  fileTypeDescription: string;
  fileId: string;
  uploadDocumentsState: any
}
let interval;
const documentTypeOptions = [
  {
    id: "1",
    value: "Signed Purchaser's Receipt",
    isSelected: false,
  },
  {
    id: "2",
    value: "Other",
    isSelected: false,
  },
];

export class LotReviewUpload extends React.Component<UploadProps, UploadState> {
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
      editFlag: true,
      fileUploaded: false,
      showDocumentTypeModal: false,
      fileTypeDescription: "",
      fileId: null,
      uploadDocumentsState: props.context,
    };
  }
  updateAlert = (message) => {
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
    if (message?.errorType === "upload") {
      clearInterval(interval);
    }
  };

  handleSelect = (selectedTab) => {
    this.setState({ selectedTab });
  };
  private propertyAPIService: PropertyApiService = new PropertyApiService();
  private salesAPIService: SalesApiService = new SalesApiService();

  componentDidMount() {
    //this.getPropertyICNStatus();
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
      this.salesAPIService
        .getLotUploadedItems(this.props.lotId)
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
  manageFiles = (response) => {
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
    if (!this.props.selectFiles) {
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
    }

    this.setState({
      imageFilesList,
      docsFilesList,
      fileUploaded,
    });
  };
  updateFilesList = () => {
    if (this.props.icn) {
      this.propertyAPIService
        .getUploadedItems(this.props.icn, "ICN")
        .then((response: any) => {
          this.manageFiles(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else if (this.props.lotId && !this.props.icn) {
      this.salesAPIService
        .getLotUploadedItems(this.props.lotId)
        .then((response: any) => {
          this.manageFiles(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
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

  documentTypes = {
    options: documentTypeOptions,
    documentTypesKey: "id",
    documentTypesValue: "value",
    isRequired: true,
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
  copySelectedFiles = (files, type) => {
    this.props.selectedFiles(files, type);
  };
  updateDocumentTypes = (id, index) => {

    let docType = this.documentTypes.options[index];
    let docsFilesList = this.state.docsFilesList;
    let fileToEdit = docsFilesList.find((item) => item.id === id);

    let data;
    if (docType?.value === "Other") {
      data = [
        {
          id: fileToEdit.id,
          documentType: docType.value,
          documentTypeDescription: this.state.fileTypeDescription,
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
    this.salesAPIService
      .updateItems(data)
      .then((response) => {
        response.data.forEach((item) => {
          fileToEdit.documentType = item.uploadItem?.documentType;
          fileToEdit.documentTypeDescription =
            item.uploadItem?.documentTypeDescription;
      
        });
        this.setState({uploadDocumentsState: docsFilesList})
      })
      .catch((error) => {
        console.error("Error getting TCN documents from API", error);
      });
  };

  updateSelection = (id, index) => {
    if (index >= 0) {
      let docType = this.documentTypes.options[index];
      if (docType.value === "Other") {
        this.setState({
          showDocumentTypeModal: true,
          fileTypeDescription: "",
          fileId: id,
        });
      } else {
        this.setState({ fileId: id });
        this.updateDocumentTypes(id, index);
      }
    }
  };

  documentTypeModalBody = () => {
    return (
      <>
        <PPMSTextArea
          isInvalid={false}
          isValid={false}
          id={"document-type-body"}
          isRequired={true}
          isDisabled={false}
          inputType={"text"}
          maxLength={50}
          onChange={(event) => {
            this.setState({ fileTypeDescription: event.target.value });
          }}
        />
        <small>Maximum 50 characters</small>
      </>
    );
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
            <PPMSAlert
              alertBodyArray={this.state.message}
              alertClassName={"dropzone-alert"}
              alertKey={"dropzone-alert-document"}
              alertVariant={this.state.alertStatus}
              id={"dropzone-alert-document"}
              show={this.state.message.length > 0}
            />

            <LotReviewFileUpload
              icn={this.props.icn}
              lotId={this.props.lotId}
              lotNumber={this.props.lotNumber}
              saleId={this.props.saleId}
              saleNumber={this.props.saleNumber}
              filesLimit={
                this.props.maxDocuments ? this.props.maxDocuments : 10
              }
              type="documents"
              updateAlert={this.updateAlert}
              files={this.state.docsFilesList}
              maxFileSize={256}
              triggerDrop={this.triggerDrop}
              updateFilesList={this.updateFilesList}
              selectFiles={this.props.selectFiles}
              existingFiles={this.props.existingFiles?.documents}
              selectedFiles={(files) =>
                this.copySelectedFiles(files, "Document(s)")
              }
              selectFilesLabel={this.props.selectFilesLabel?.documents}
              actionDisabled={this.props.actionDisabled}
              documentTypes={this.documentTypes}
              documentTypesChange={(id, index) =>
                this.updateSelection(id, index)
              }
            />
          </div>
        </div>
        <div>
          {this.props.inValid && !this.state.fileUploaded && (
            <PPMSErrorMessage id={`errorMessage-upload`}>
              {this.props.validationMessage}
            </PPMSErrorMessage>
          )}
        </div>
        <PPMSModal
          id={"document-type"}
          body={this.documentTypeModalBody()}
          handleClose={() => {
            this.setState({ showDocumentTypeModal: false });
          }}
          handleSave={() => {
            this.updateDocumentTypes(
              this.state.fileId,
              this.documentTypes.options.length - 1
            );
            this.setState({ showDocumentTypeModal: false });
          }}
          show={this.state.showDocumentTypeModal}
          title={"Additional Information"}
        />
      </>
    );
  }
}
