import React from "react";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import { PPMSDropZone } from "../../../../ui-kit/components/common/upload/PPMS-dropzone";
import { Environment } from "../../../../environments/environment";
import { ForeignGiftsApiService } from "../../../../api-kit/foreign-gift/foreign-gifts-api-service";

export interface PropertyRecordFileUploadProps {
  type: any;
  filesLimit: number;
  updateAlert: any;
  files: any[];
  maxFileSize: number;
  triggerDrop: any;
  updateFilesList: any;
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
      type: this.props.type === "documents" ? this.documents : [],
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

  private foreignGiftsApiService: ForeignGiftsApiService = new ForeignGiftsApiService();
  private commonAPIService: CommonApiService = new CommonApiService();
  documents = "";

  onDrop = (file, index) => {
    file.attachmentOrder = this.state.files.length + (index + 1);
    let data = {
      controlNumber: "ICN",
      name: file.name,
      description: file.description,
      itemType: file.type,
      attachmentOrder: file.attachmentOrder,
      size: file.size,
      fileGroup: "DOSApproval",
    };
    this.foreignGiftsApiService
      .uploadFile(data)
      .then((response: any) => {
        let request = new FormData();
        request.append("file", file);
        request.append("databaseId", response.data.id);
        request.append("controlNumber", response.data.description);
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
    this.foreignGiftsApiService
      .updateItems(apiPayload)
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
    this.foreignGiftsApiService
      .updateItems(apiPayload)
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

  onClick = (event) => {};

  handleFileDelete = async (newFileList, filesToDelete) => {
    let deleteAPIPayload = [];
    filesToDelete.forEach((file) => deleteAPIPayload.push(file.id));
    this.foreignGiftsApiService
      .deleteFiles(deleteAPIPayload)
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
          this.foreignGiftsApiService
            .updateItems(updateAPIPayload)
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
    const { files } = this.state;
    let fileToEdit = files.find((f) => f.id === fileId);
    if (fileToEdit) {
      let extnIndex = fileToEdit.name.lastIndexOf(".");
      if (extnIndex !== -1) {
        let extn = fileToEdit.name.substring(extnIndex, fileToEdit.name.length);
        fileToEdit.name = tempName + extn;
      }
    }
    let duplicateFile = files.find(
      (f) => f.id !== fileId && f.name === fileToEdit.name
    );
    if (duplicateFile === undefined) {
      let data = {
        id: fileToEdit.id,
        name: fileToEdit.name,
      };
      this.foreignGiftsApiService
        .updateItems([data])
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
    } else {
      this.updateAlert({
        error: ["Filename already exists!"],
        type: "danger",
      });
    }
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
      .catch((error) => {})
      .then(() => {
        this.setState({
          loadingImage: false,
        });
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
          isUniqueXLSFileType={true}
        />
      </>
    );
  }
}
