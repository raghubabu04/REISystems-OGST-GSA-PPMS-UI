import React from "react";
import { FilesUpload } from "./FilesUpload";
import { Tab, Tabs } from "react-bootstrap";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";
import { UserUtils } from "../../../../../utils/UserUtils";
import PPMSErrorMessage from "../../../../../ui-kit/components/common/form/PPMS-error-message";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";

export interface UploadProps {
  icn?: string;
  lotId?: string;
  lotNumber?: string;
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
  showAlert?: boolean;
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
  docsFilesList: any[];
  accordianExpanded: boolean;
  accordingDisplay: string;
  selectedTab: string;
  flag: boolean;
  editFlag: boolean;
  fileUploaded: boolean;
}
let interval;
export class Upload extends React.Component<UploadProps, UploadState> {
  constructor(props) {
    super(props);
    this.state = {
      message: ["Please upload documents."],
      alertStatus: "info",
      docsFilesList: [],
      accordianExpanded: true,
      accordingDisplay: "show",
      selectedTab: "document",
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
      console.log(message);
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
    this.getSalesUploadedFiles(this.props.saleId);
    this.updateFilesList();
  }

  componentWillUnmount() {
    this.clearSessionInterval();
  }

  clearSessionInterval = () => {
    clearInterval(interval);
  };

  triggerDrop = () => {
    let docsFilesList = [];
    this.setState((prevState) => {
      return {
        ...prevState,
        fileUploaded: true,
      };
    });
    interval = setInterval(() => {
      let files = docsFilesList;
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
      this.salesAPIService
        .getSalesUploadedItems(this.props.saleId)
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
          this.clearSessionInterval();
        });
    }, 10000);
  };

  getSalesUploadedFiles = (salesId: string) => {
    let docsFilesList = [];
    this.salesAPIService
      .getSalesUploadedItems(salesId)
      .then((response: any) => {
        if (response.data && response.data.documents) {
          docsFilesList = response.data.documents;
        }
        this.setState({
          docsFilesList: docsFilesList,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  manageFiles = (response) => {
    let docsFilesList = [];
    let fileUploaded = false;
    if (response.data && response.data.documents) {
      docsFilesList = response.data.documents;
    }
    if (docsFilesList.length > 0) {
      fileUploaded = true;
    }

    let files = docsFilesList;
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
      docsFilesList,
      fileUploaded,
    });
  };
  updateFilesList = () => {
    if (this.props.saleId) {
      this.salesAPIService
        .getSalesUploadedItems(this.props.saleId)
        .then((response: any) => {
          console.log("Updating...");
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
      </>
    );
  }
}
