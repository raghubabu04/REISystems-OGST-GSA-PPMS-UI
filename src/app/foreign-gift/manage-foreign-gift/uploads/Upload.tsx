import React from "react";
import { FilesUpload } from "./FilesUpload";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { UserUtils } from "../../../../utils/UserUtils";
import { VirusScanStatus } from "../constants/Constants";
import { ForeignGiftsApiService } from "../../../../api-kit/foreign-gift/foreign-gifts-api-service";

interface UploadProps {
  fileInfectedStatus?: any;
  isUploadCancelled?: any;
  enableDOSApprovelSubmit?: any;
  disableDOSApprovelSubmit?: any;
}
interface UploadState {
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

  private foreignGiftsApiService: ForeignGiftsApiService = new ForeignGiftsApiService();

  componentDidMount() {
    this.deleteFileForUser();
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isUploadCancelled !== prevProps.isUploadCancelled) {
      clearInterval(interval);
      this.deleteFileForUser();
    }
  }

  triggerDrop = () => {
    this.props.disableDOSApprovelSubmit();
    let imageFilesList = [];
    let docsFilesList = [];
    interval = setInterval(() => {
      let files = imageFilesList.concat(docsFilesList);
      if (files.length !== 0) {
        let infectedFiles = files.filter(
          (file) => file.virusScanStatus === VirusScanStatus.INFECTED
        );
        this.props.fileInfectedStatus(infectedFiles.length !== 0);
        let filesProcessed = files.filter(
          (file) => file.virusScanStatus === VirusScanStatus.IN_PROGRESS
        );
        if (filesProcessed.length === 0) {
          this.props.enableDOSApprovelSubmit(true);
          clearInterval(interval);
        }
      }
      try {
        this.foreignGiftsApiService
          .getUploadedItemsForUser()
          .then((response: any) => {
            if (response.data && response.data.documents) {
              docsFilesList = response.data.documents;
              //Enable Modal Submit Button when files are clean
              if (docsFilesList.length !== 0) {
                let docsFilesListProcessed = docsFilesList.filter(
                  (docsFilesList) =>
                    docsFilesList.virusScanStatus !== VirusScanStatus.CLEAN
                );
                if (docsFilesListProcessed.length === 0) {
                  this.props.enableDOSApprovelSubmit(true);
                }
              }
            }
            this.setState({
              docsFilesList,
            });
          });
      } catch (error) {
        console.log(error);
        clearInterval(interval);
      }
    }, 5000);
  };

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

  updateFilesList = () => {
    try {
      this.foreignGiftsApiService
        .getUploadedItemsForUser()
        .then((response: any) => {
          let docsFilesList = [];
          if (response.data && response.data.documents) {
            docsFilesList = response.data.documents;
            this.checkUserAndEditDocumentFlag(docsFilesList);
          }
          if (docsFilesList.length !== 0) {
            let infectedFiles = docsFilesList.filter(
              (file) => file.virusScanStatus === VirusScanStatus.INFECTED
            );
            this.props.fileInfectedStatus(infectedFiles.length !== 0);
          } else {
            this.props.fileInfectedStatus(false);
          }
          this.setState({
            docsFilesList,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  deleteFileForUser(): void {
    this.foreignGiftsApiService
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
          if (UserUtils.isSystemAdminUser() || UserUtils.isUserFg()) {
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
              filesLimit={1}
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
