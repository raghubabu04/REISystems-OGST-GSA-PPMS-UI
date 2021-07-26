import React from "react";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSDropZone } from "../../../../ui-kit/components/common/upload/PPMS-dropzone";
import { PropertyApiService } from "../../../../api-kit/property/property-api-service";
import { Environment } from "../../../../environments/environment";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import { UserUtils } from "../../../../utils/UserUtils";

export interface PropertyRecordFileUploadProps {
  type: any;
  filesLimit: number;
  updateAlert: any;
  files: any[];
  maxFileSize: number;
  triggerDrop: any;
  updateFilesList: any;
  setFileUpload?: any;
  id?: any;
  groupEmailId?: any;
}

export interface PropertyRecordFileUploadState {
  files: any[];
  type: any;
  filesSelectedToDelete: any[];
  checkedItems: Map<any, any>;
  editItems: Map<any, any>;
  loadingRows: any[];
  src: string;
  rotateSrc: string;
  originalSrc: string;
  loadingImage: boolean;
  totalSize: number;
  maxFileSize: number;
}

export class FilesUpload extends React.Component<
  PropertyRecordFileUploadProps,
  PropertyRecordFileUploadState
> {
  constructor(props) {
    super(props);
    this.state = {
      files: this.props.files,
      filesSelectedToDelete: [],
      checkedItems: new Map(),
      editItems: new Map(),
      loadingRows: [],
      src: "",
      originalSrc: "",
      rotateSrc: "",
      loadingImage: false,
      type:
        this.props.type === "images"
          ? this.images
          : this.props.type === "documents"
            ? this.documents
            : [],
      totalSize: 0,
      maxFileSize: 10000
    };
  }

  componentDidUpdate(
    prevProps: Readonly<PropertyRecordFileUploadProps>,
    prevState: Readonly<PropertyRecordFileUploadState>,
    snapshot?: any
  ): void {
    if (this.props.files !== prevProps.files) {
      this.setState({
        files: this.props.files,
      });
      this.props.files.forEach((file) => {
        file["placeholder"] = file.name;
        file["priority"] = file.attachmentOrder;
        file["downloadUrl"] = file.uri;
        file["type"] = file.type || file.itemType;
      });
    }
  }

  private userApiService: UserApiService = new UserApiService();
  private commonAPIService: CommonApiService = new CommonApiService();
  images = ["image/png", "image/jpg", "image/jpeg"];
  documents = "";

  onDrop = (file, index) => {
    file.attachmentOrder = this.state.files.length + (index + 1);
    let data = {
      groupEmailId: this.props.groupEmailId,
      name: file.name,
      itemType: file.type,
      attachmentOrder: file.attachmentOrder,
      size: file.size,
      createdBy: UserUtils.getLoggedInUserEmail(),
    };
    let totalSize = this.state.totalSize + Math.round(file.size / 1000);
    if (totalSize < this.state.maxFileSize) {
      this.setState({
        totalSize: totalSize
      })
      this.userApiService
        .uploadGroupEmailItem(data)
        .then((response: any) => {
          let request = new FormData();
          request.append("file", file);
          request.append("databaseId", response.data.id);
          request.append("controlNumber", `${this.props.groupEmailId}`);
          request.append("type", "GROUP");
          this.commonAPIService
            .uploadFile(request)
            .then((resp: any) => {
              file.id = response.data.id;
              file.virusScanStatus = response.data.virusScanStatus;
              file.uri = response.data.uri;
              file.tempName = file.name;
              let files = this.state.files.concat(file);
              this.setState({ files });
            })
            .catch((error: any) => {
              let deleteAPIPayload = [response.data.id];
              this.userApiService
                .deleteGroupEmailItem(deleteAPIPayload)
                .then((response) => {
                  console.log("File Upload Failed.");
                });
              this.updateAlert({
                error: ["Unable to upload the file. Please try again."],
                type: "danger",
                errorType: "upload",
              });
            });
        })
        .catch((error: any) => {
          this.updateAlert({
            error: ["Unable to upload the file. Please try again."],
            type: "danger",
            errorType: "upload",
          });
        })
        .finally(() => {
          let loadingRows = this.state.loadingRows.filter(
            (row) => row.key !== index + "-loading-row"
          );
          this.setState({
            loadingRows: loadingRows,
          });
        });
    } else {
      this.updateAlert({
        error: ["Total file size cannot exceed 10Mb."],
        type: "danger",
        errorType: "maxFile",
      });
      this.setState({
        loadingRows: []
      });
    }


  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.files !== this.state.files) {
      this.setState({ files: nextProps.files });
    }
  }
  onUpClick = (clickedFile, aboveFile) => {
    let clickedAttachmentOrder = clickedFile.attachmentOrder;
    let apiPayload = [
      { id: clickedFile.id, attachmentOrder: clickedAttachmentOrder - 1 },
      { id: aboveFile.id, attachmentOrder: clickedAttachmentOrder },
    ];
    this.userApiService
      .updateGroupEmailItems(apiPayload)
      .then((response) => {
        let updatedFiles = response.data;
        clickedFile.attachmentOrder = updatedFiles.find(
          (f) => f.uploadItemId === clickedFile.id
        ).uploadItem.attachmentOrder;
        aboveFile.attachmentOrder = updatedFiles.find(
          (f) => f.uploadItemId === aboveFile.id
        ).uploadItem.attachmentOrder;
        let files = this.state.files;
        files.concat(clickedFile);
        files.concat(aboveFile);
        this.setState({ files });
      })
      .catch((error) => {
        this.updateAlert({
          error: ["Unable to rearrange file order. Please try again."],
          type: "danger",
        });
      });
  };
  onDownClick = (clickedFile, belowFile) => {
    let clickedAttachmentOrder = clickedFile.attachmentOrder;
    let apiPayload = [
      { id: clickedFile.id, attachmentOrder: clickedAttachmentOrder + 1 },
      { id: belowFile.id, attachmentOrder: clickedAttachmentOrder },
    ];
    this.userApiService
      .updateGroupEmailItems(apiPayload)
      .then((response) => {
        let updatedFiles = response.data;
        clickedFile.attachmentOrder = updatedFiles.find(
          (f) => f.uploadItemId === clickedFile.id
        ).uploadItem.attachmentOrder;
        belowFile.attachmentOrder = updatedFiles.find(
          (f) => f.uploadItemId === belowFile.id
        ).uploadItem.attachmentOrder;
        let files = this.state.files;
        files.concat(clickedFile);
        files.concat(belowFile);
        this.setState({ files });
      })
      .catch((error) => {
        this.updateAlert({
          error: ["Unable to rearrange file order. Please try again."],
          type: "danger",
        });
      });
  };

  onClick = (event) => { };

  handleFileDelete = async (newFileList, filesToDelete) => {
    let deleteAPIPayload = [];
    let deletedFileSize = 0;
    filesToDelete.forEach((file) => { deleteAPIPayload.push(file.id); deletedFileSize += Math.round(file.size / 1000) })
    this.setState({
      totalSize: this.state.totalSize >= deletedFileSize ? this.state.totalSize - deletedFileSize : 0
    })
    this.userApiService
      .deleteGroupEmailItem(deleteAPIPayload)
      .then((response) => {
        if (newFileList.length !== 0) {
          let updateAPIPayload = [];
          newFileList.forEach((file, index) => {
            file.attachmentOrder = index + 1;
            let updateItem = {
              id: file.id,
              attachmentOrder: file.attachmentOrder,
            };
            updateAPIPayload.push(updateItem);
          });
          this.userApiService
            .updateGroupEmailItems(updateAPIPayload)
            .then((response) => {
              this.setState({
                files: newFileList,
                filesSelectedToDelete: [],
                checkedItems: new Map(),
                editItems: new Map(),
              });
              this.updateAlert({
                error: [],
                type: "",
              });
              this.props.updateFilesList();
            })
            .catch((error) => {
              this.updateAlert({
                error: ["Unable to delete file(s). Please try again."],
                type: "danger",
              });
            });
        } else {
          this.setState({
            files: newFileList,
            filesSelectedToDelete: [],
            checkedItems: new Map(),
            editItems: new Map(),
          });
          this.props.updateFilesList();
        }
      })
      .catch((error) => {
        this.updateAlert({
          error: ["Unable to delete the file. Please try again"],
          type: "danger",
        });
      });
  };

  setFlagToDelete = (event) => {
    const item = event.target.name;
    const isChecked = event.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  };

  editFileName = (file) => {
    const item = file.id;
    let newEditItem = new Map();
    this.setState({
      editItems: newEditItem.set(item, true),
    });
  };
  downloadFile = (file) => {
    let url =
      Environment.COMMON_URL +
      "/api/v1/downloadFile?path=" +
      file.uri +
      "&fileType=" +
      file.itemType +
      "&fileName=" +
      file.name;
    window.location.href = url;
  };
  saveIconClick = async (fileId, tempName) => {
    if (tempName.length > 64) {
      this.updateAlert({
        error: ["File name too long"],
        type: "danger",
      });
      return;
    }
    const { files } = this.state;
    let fileToEdit = files.find((f) => f.id === fileId);
    if (fileToEdit) {
      let extnIndex = fileToEdit.name.lastIndexOf(".");
      if (extnIndex !== -1) {
        let extn = fileToEdit.name.substring(extnIndex, fileToEdit.name.length);
        fileToEdit.name = tempName + extn;
      }
    }
    let data = {
      id: fileToEdit.id,
      name: fileToEdit.name,
    };
    this.userApiService
      .updateGroupEmailItems([data])
      .then((response) => {
        let updatedFile = response.data.find(
          (f) => f.uploadItemId === fileToEdit.id
        );
        fileToEdit.name = updatedFile.uploadItem.name;
        this.setState({
          files: files,
          editItems: new Map(),
        });
      })
      .catch((error) => {
        this.updateAlert({
          error: ["Unable to rename the file. Please try again."],
          type: "danger",
        });
      });
  };
  resetEditFileName = () => {
    this.setState({
      editItems: new Map(),
    });
  };
  updateAlert = (message) => {
    this.props.updateAlert(message);
  };
  setLoadingRows = (loadingRows) => {
    this.setState({ loadingRows: loadingRows });
  };

  /**
   * Image Manipulation Calls
   */

  editImage = (file) => {
    this.setState({
      loadingImage: true,
    });
    let param = {
      path: file.uri,
      fileType: file.itemType,
      fileName: file.name,
    };
    this.commonAPIService
      .downloadFile(param)
      .then((response) => {
        let blob = new Blob([response.data]);
        this.setState({
          rotateSrc: window.URL.createObjectURL(blob),
          src: window.URL.createObjectURL(blob),
          originalSrc: window.URL.createObjectURL(blob),
        });
      })
      .catch((error) => { })
      .then(() => {
        this.setState({
          loadingImage: false,
        });
      });
  };
  onCropSave = (url) => {
    this.setState({
      src: url,
      rotateSrc: url,
    });
  };
  onRotateSave = (url) => {
    this.setState({
      src: url,
      originalSrc: url,
    });
  };
  onFlipSave = (url) => {
    this.setState({
      src: url,
      originalSrc: url,
      rotateSrc: url,
    });
  };
  onCropCancel = (event) => {
    this.setState({
      src: this.state.originalSrc,
    });
  };

  async createFile(src, type, fileName) {
    let response = await fetch(this.state.src);
    let data = await response.blob();
    let metadata = {
      type: type,
    };
    return new File([data], fileName, metadata);
  }

  updateImage = async (fileId) => {
    const { files } = this.state;
    let fileToUpdate = files.find((f) => f.id === fileId);
    if (fileToUpdate) {
      let file = await this.createFile(
        this.state.src,
        fileToUpdate.type,
        fileToUpdate.name
      );
      let userApiService = new PropertyApiService();
      let commonAPIService = new CommonApiService();
      let updateData = {
        size: file.size.toString(),
        name: fileToUpdate.name,
        description: fileToUpdate.description,
        attachmentOrder: fileToUpdate.attachmentOrder,
        itemType: fileToUpdate.type,
        id: fileToUpdate.id,
        uri: fileToUpdate.uri,
      };
      userApiService
        .updateFile(updateData)
        .then((response: any) => {
          let data = new FormData();
          data.append("file", file);
          data.append("databaseId", fileToUpdate.id);
          commonAPIService
            .uploadFile(data)
            .then((resp: any) => {
              fileToUpdate.preSignedURI = response.data.preSignedURL;
              fileToUpdate.size = file.size;
              this.setState({
                files: files,
              });
            })
            .catch((error: any) => {
              this.updateAlert({
                error: ["Unable to upload edited file. Please try again."],
                type: "danger",
              });
            })
            .then(() => {
              this.cancelUpdateImage();
              this.props.updateFilesList();
            });
        })
        .catch((error) => { });
    }
  };
  cancelUpdateImage = () => {
    window.URL.revokeObjectURL(this.state.src);
    window.URL.revokeObjectURL(this.state.rotateSrc);
    window.URL.revokeObjectURL(this.state.originalSrc);
    this.setState({
      rotateSrc: "",
      src: "",
      originalSrc: "",
    });
  };
  render() {
    return (
      <>
        <PPMSDropZone
          id={this.props.id}
          files={this.state.files}
          filesLimit={this.props.filesLimit}
          updateAlert={this.updateAlert}
          type={this.state.type}
          triggerDrop={this.props.triggerDrop}
          title={
            this.props.type === "images"
              ? "Images"
              : this.props.type === "documents"
                ? "Documents"
                : ""
          }
          onDrop={this.onDrop}
          checkboxClick={this.setFlagToDelete}
          editIconClick={this.editFileName}
          downloadFile={this.downloadFile}
          src={this.state.src}
          rotateSrc={this.state.rotateSrc}
          onCropSave={this.onCropSave}
          onRotateSave={this.onRotateSave}
          onFlipSave={this.onFlipSave}
          onCropCancel={this.onCropCancel}
          editImage={this.editImage}
          loadingImage={this.state.loadingImage}
          handleFileDelete={this.handleFileDelete}
          onUpClick={this.onUpClick}
          onDownClick={this.onDownClick}
          onClick={this.onClick}
          saveIconClick={this.saveIconClick}
          resetEditFileName={this.resetEditFileName}
          checkedItems={this.state.checkedItems}
          editItems={this.state.editItems}
          maxFileSize={this.props.maxFileSize}
          loadingRows={this.state.loadingRows}
          setLoadingRows={this.setLoadingRows}
          updateImage={this.updateImage}
          cancelUpdateImage={this.cancelUpdateImage}
        />
      </>
    );
  }
}
