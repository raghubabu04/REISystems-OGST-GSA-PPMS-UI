import React from "react";
import { FilesUpload } from "./FilesUpload";
import { Tab, Tabs } from "react-bootstrap";
import { PropertyApiService } from "../../../api-kit/property/property-api-service";
import { PPMSAlert } from "../../../ui-kit/components/common/PPMS-alert";
import { UserUtils } from "../../../utils/UserUtils";
import PPMSErrorMessage from "../../../ui-kit/components/common/form/PPMS-error-message";
import { SalesApiService } from "../../../api-kit/sales/sales-api-service";
import { RegisterFilesUpload } from "../../payments/registers/RegisterFilesUpload";

export interface ContractUploadProps {
  icn?: string;
  lotId?: string;
  lotNumber?: any;
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
  onlyDocuments?: boolean;
  objectType?: any;
  contractId?: any;
  salesNumber?: string;
  isRefundUpload?: boolean;
  registerId?: any;
}

export interface ContractUploadState {
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
export class ContractUpload extends React.Component<
  ContractUploadProps,
  ContractUploadState
> {
  constructor(props) {
    super(props);
    this.state = {
      message: ["Please upload Documents."],
      alertStatus: "info",
      imageFilesList: [],
      docsFilesList: [],
      accordianExpanded: true,
      accordingDisplay: "show",
      selectedTab: "image",
      imgMsg: [""],
      imgStatus: "info",
      flag: false,
      editFlag: true,
      fileUploaded: false,
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
  private salesAPIService: SalesApiService = new SalesApiService();

  componentDidMount() {
    this.updateFilesList();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (
      this.props.contractId !== prevProps.contractId ||
      this.props.registerId !== prevProps.registerId
    ) {
      this.updateFilesList();
    }
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

      if (this.props.objectType === "REGISTER") {
        this.salesAPIService
          .getRegisterUploads(this.props.registerId)
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
      } else if (this.props.objectType === "REFUND") {
        this.salesAPIService
          .getContractRefundUploadedItems(this.props.contractId)
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
      } else if (this.props.objectType === "CONTRACT") {
        this.salesAPIService
          .getContractUploadedItems(this.props.contractId)
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
      } else {
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
      }
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
    if (this.props.objectType == "REGISTER" && this.props.registerId) {
      this.salesAPIService
        .getRegisterUploads(this.props.registerId)
        .then((response: any) => {
          this.manageFiles(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else if (this.props.isRefundUpload && this.props.contractId) {
      this.salesAPIService
        .getContractRefundUploadedItems(this.props.contractId)
        .then((response: any) => {
          this.manageFiles(response);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else if (this.props.contractId) {
      this.salesAPIService
        .getContractUploadedItems(this.props.contractId)
        .then((response: any) => {
          this.manageFiles(response);
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
          <div className={"grid-col"}>
            <PPMSAlert
              alertBodyArray={this.state.message}
              alertClassName={"dropzone-alert"}
              alertKey={"dropzone-alert-document"}
              alertVariant={this.state.alertStatus}
              id={"dropzone-alert-document"}
              show={this.state.message.length > 0}
            />
            {this.props.registerId ? (
              <RegisterFilesUpload
                registerId={this.props.registerId}
                icn={this.props.icn}
                lotId={this.props.lotId}
                lotNumber={this.props.lotNumber}
                saleId={this.props.saleId}
                saleNumber={this.props.saleNumber}
                filesLimit={10}
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
                objectType={this.props.objectType}
              />
            ) : (
              <FilesUpload
                icn={this.props.icn}
                lotId={this.props.lotId}
                lotNumber={this.props.lotNumber}
                saleId={this.props.saleId}
                saleNumber={this.props.saleNumber}
                filesLimit={10}
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
                objectType={this.props.objectType}
                contractId={this.props.contractId}
              />
            )}
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
