import React from "react";
import { FilesUpload } from "./FilesUpload";
import { Tab, Tabs } from "react-bootstrap";
import { NonReptApiService } from "../../../../api-kit/property/non-rept-api-service";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { UserUtils } from "../../../../utils/UserUtils";

export interface UploadProps {
  icn: string;
  fileInfectedStatus?: any;
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
}
let interval;
export class Upload extends React.Component<UploadProps, UploadState> {
  constructor(props) {
    super(props);
    this.state = {
      message: ["Please upload property Documents."],
      alertStatus: "info",
      docsFilesList: [],
      accordianExpanded: true,
      accordingDisplay: "show",
      selectedTab: "image",
      flag: false,
      editFlag: false,
    };
  }
  updateAlert = (message) => {
    this.setState({
      message: message.error,
      alertStatus: message.type,
    });
    if (message?.errorType === "upload") {
      clearInterval(interval);
    }
  };

  handleSelect = (selectedTab) => {
    this.setState({ selectedTab });
  };
  private nonReportService: NonReptApiService = new NonReptApiService();

  componentDidMount() {
    // this.updateFilesList();
    this.deleteFileForUser();
  }
  triggerDrop = () => {

    let imageFilesList = [];
    let docsFilesList = [];
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
     
      this.nonReportService
        .getUploadedItemsForUser()
        .then((response: any) => {
          if (response.data && response.data.image) {
            imageFilesList = response.data.image;
          }
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
    }, 1000);
  };

  updateFilesList = () => {
 
    this.nonReportService
      .getUploadedItemsForUser()
      .then((response: any) => {
        let docsFilesList = [];
        if (response.data && response.data.documents) {
          docsFilesList = response.data.documents;
          this.checkUserAndEditDocumentFlag(docsFilesList);
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
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  // getPropertyICNStatus = () => {
  //   this.nonReportService
  //     .getPropertyByICNRequest(this.props.icn)
  //     .then((res: any) => {
  //       this.setState({
  //         editFlag: res?.data?.editDocumentsFlag,
  //       });
  //     })
  //     .catch((error) => console.log(error));
  // };

  deleteFileForUser(): void {
    this.nonReportService
      .deleteFileForUser()
      .then((response: any) => {})
      .catch((error: any) => {
        console.log(error);
      });
  }

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
              icn={this.props.icn}
              filesLimit={10}
              type="documents"
              updateAlert={this.updateAlert}
              files={this.state.docsFilesList}
              maxFileSize={256}
              triggerDrop={this.triggerDrop}
              updateFilesList={this.updateFilesList}
            />
          </div>
        </div>
      </>
    );
  }
}
