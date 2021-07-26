import React from "react";
import Dropzone from "react-dropzone";
import { FormCheck, Tab, Nav } from "react-bootstrap";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import placeholderImage from "../../../../assets/images/placeholder-img.jpg";

import {
  FaCloudUploadAlt,
  FaEdit,
  FaDownload,
  FaFileCsv,
  FaFileWord,
  FaFilePdf,
  FaFileImage,
  FaFileExcel,
  FaFileAlt,
  FaFile,
} from "react-icons/fa";
import { TiTick, TiCancel } from "react-icons/ti";
import {
  MdDeleteForever,
  MdFlip,
  MdRotate90DegreesCcw,
  MdRotateLeft,
  MdRotateRight,
} from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp, IoMdColorWand } from "react-icons/io";
import PropTypes from "prop-types";
import { PPMSInput } from "../input/PPMS-input";
import { PPMSButton } from "../PPMS-button";
import { PPMSImageEdit } from "./PPMS-image-edit";
import { PPMSModal } from "../PPMS-modal";
import { RiCrop2Line } from "react-icons/ri";
import { PPMSSpinner } from "../PPMS-spinner";
import { PPMSTooltip } from "../PPMS-tooltip";
import { PPMSSelect } from "../select/PPMS-select";
import { documentInfoTip } from "../../../../app/property/allocate-property/Constants";
import { CgNotes } from "react-icons/cg";
import {
  checkFileType,
  checkXLSFileType,
  constructDuplicateFileMsg,
} from "./PPMS-dropzone-files";
import moment from "moment";
import { ImBoxAdd } from "react-icons/im";
export interface PPMSDropZoneProps {
  files?: any[];
  type: any;
  uploadDisabled?: boolean;
  downloadDisabled?: boolean;
  checkedItems?: Map<any, any>;
  editItems?: Map<any, any>;
  editIconClick?: any;
  onDownClick?: any;
  onUpClick?: any;
  checkboxClick?: any;
  onClick?: any;
  downloadFile?: any;
  onDrop?: any;
  src?: string;
  rotateSrc?: string;
  editImage?: any;
  onCropSave?: any;
  onRotateSave?: any;
  onFlipSave?: any;
  onCropCancel?: any;
  handleFileDelete?: any;
  title: string;
  saveIconClick: any;
  resetEditFileName: any;
  filesLimit: number;
  updateAlert: any;
  maxFileSize: number;
  setLoadingRows: any;
  loadingRows: any[];
  triggerDrop: any;
  updateImage?: any;
  cancelUpdateImage?: any;
  loadingImage?: boolean;
  documentTypes?: any;
  documentTypesChange?: any;
  disabled?: boolean;
  modifiedDate?: string;
  selectFiles?: boolean;
  existingFiles?: any;
  resetCheckbox?: any;
  selectFilesLabel?: any;
  selectedFiles?: any;
  id?: any;
  actionDisabled?: boolean;
  isUniqueXLSFileType?: boolean;
  completeTransfer?: boolean;
  disabledAttachmentList?: any[];
  customInfoTip?: string;
  isLotReview?: boolean;
}
export interface PPMSDropZoneState {
  showModal: boolean;
  showDeleteModal: boolean;
  editImageId: string;
  src: string;
  croppedImageUrl: any;
  crop: {};
  tempName: string;
  loadingRows: any[];
  fileName: string;
  fileType: string;
  rotateDegree: number;
  activeTab: string;
  filesToDelete: any[];
  selectedFiles: any[];
  newFileList: any[];
}
export class PPMSDropZone extends React.Component<
  PPMSDropZoneProps,
  PPMSDropZoneState
> {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showDeleteModal: false,
      editImageId: "",
      tempName: "",
      src: this.props.src,
      croppedImageUrl: "",
      crop: {
        unit: "%",
        height: "60",
        width: "80",
      },
      loadingRows: this.props.loadingRows,
      fileName: "",
      fileType: "",
      rotateDegree: 0,
      activeTab: "crop",
      filesToDelete: [],
      selectedFiles: [],
      newFileList: [],
    };
    this.editImage = this.editImage.bind(this);
  }
  private imageRef;
  private fileUrl;
  getIcon(name) {
    let extension = name?.split(".")?.pop() || "";
    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
        return <FaFileImage className={"image-icons"} title={"Image"} />;
      case "pdf":
        return <FaFilePdf className={"image-icons"} title={"PDF"} />;
      case "xlsx":
      case "xls":
        return <FaFileExcel className={"image-icons"} title={"XLS"} />;
      case "csv":
        return <FaFileCsv className={"image-icons"} title={"CSV"} />;
      case "doc":
      case "docx":
        return <FaFileWord className={"image-icons"} title={"Document"} />;
      case "rtf":
      case "txt":
        return <FaFileAlt className={"image-icons"} title={"Text File"} />;
      default:
        return <FaFile className={"image-icons"} title={"File"} />;
    }
  }
  onDrop = (files) => {
    let existingFiles = files.filter((o) =>
      this.props.files.some((i) => i.name === o.name && i.type === o.type)
    );
    files = files.filter(
      (o) =>
        !this.props.files.some((i) => i.name === o.name && i.type === o.type)
    );

    let message = { error: [], type: "danger" };
    if (existingFiles && existingFiles.length !== 0) {
      let duplicateErrMsg = constructDuplicateFileMsg(existingFiles);
      message.error.push(duplicateErrMsg.error);
    }

    if (this.props.title === "Documents" && this.props.isUniqueXLSFileType) {
      let result = checkXLSFileType(files);
      if (result.error !== "") {
        message.error.push(result.error);
      }
      files = result.files;
    } else if (this.props.title === "Documents") {
      let result = checkFileType(files);
      if (result.error !== "") {
        message.error.push(result.error);
      }
      files = result.files;
    }
    let maxFilesValidationResult = this.maxSelectFile(files);
    if (maxFilesValidationResult.error === "") {
      let loadingRows = files.map((file, index) => (
        <LoadingRow id={index + "-loading-row"} key={index + "-loading-row"} />
      ));
      this.props.setLoadingRows(loadingRows);

      files.forEach((file, index) => {
        if (file.type.split("/")[0] === "image") {
          PPMSImageEdit.createResizedImage(
            file,
            800,
            600,
            file.type,
            100,
            0,
            (file) => {
              this.props.onDrop(file, index);
            },
            "blob"
          );
        } else {
          this.props.onDrop(file, index);
        }
      });
      this.props.triggerDrop();
    } else {
      message.error.push(maxFilesValidationResult.error);
    }
    this.props.updateAlert(message);
  };
  maxSelectFile = (files) => {
    if (files.length > this.props.filesLimit - this.props.files.length) {
      let allowableCntUpload =
        this.props.filesLimit - this.props.files.length > 0
          ? this.props.filesLimit - this.props.files.length
          : 0;
      let message =
        "Max file upload limit is " +
        this.props.filesLimit +
        ". Remaining files that can be uploaded is " +
        allowableCntUpload +
        ".";
      if (allowableCntUpload === 0) {
        message = "Max file upload limit reached.";
      }
      return { error: message };
    }
    return { error: "" };
  };
  onUpClick = (clickedFile) => {
    let attachmentOrder = clickedFile.attachmentOrder;

    let fileAboveClickedFile = this.props.files.filter(
      (item) => item.attachmentOrder === attachmentOrder - 1
    );
    let aboveFile = fileAboveClickedFile[0];
    this.props.onUpClick(clickedFile, aboveFile);
  };
  onDownClick = (clickedFile) => {
    let attachmentOrder = clickedFile.attachmentOrder;

    let fileBelowClickedFile = this.props.files.filter(
      (item) => item.attachmentOrder === attachmentOrder + 1
    );
    let belowFile = fileBelowClickedFile[0];
    this.props.onDownClick(clickedFile, belowFile);
  };
  handleDocumentTypeChange = ({ value, selectedIndex, selectedText }, file) => {
    this.props.documentTypesChange(file.id, selectedIndex - 1);
  };
  handleFileDelete = async (event) => {
    await this.props.handleFileDelete(
      this.state.newFileList,
      this.state.filesToDelete
    );
    this.handleDeleteClose(event);
  };

  downloadFile = (file) => {
    this.props.downloadFile(file);
  };

  saveIconClick = (file) => {
    this.props.saveIconClick(file.id, this.state.tempName);
  };

  editIconClick = (file) => {
    let extCroppedFileName = file.name;
    let lastIndex = file.name.lastIndexOf(".");
    if (lastIndex !== -1) extCroppedFileName = file.name.substr(0, lastIndex);

    this.setState({
      tempName: extCroppedFileName,
    });
    this.props.editIconClick(file);
  };
  resetEditFileName = (file) => {
    this.props.resetEditFileName(file.id, this.state.tempName);
  };
  editNameChange = (event) => {
    this.setState({
      tempName: event.target.value,
    });
  };

  onDropRejected = (files) => {
    let message = { error: [], type: "danger" };
    files.forEach(({ file, errors }) => {
      let errorMessage = [];
      errors.forEach((error) => {
        switch (error.code) {
          case "file-too-small":
            errorMessage.push("File is smaller than 1 byte.");
            break;
          case "file-too-large":
            errorMessage.push(
              "File is larger than " + this.props.maxFileSize + "MB."
            );
            break;
          default:
            errorMessage.push(error.message);
        }
      });
      message.error.push(file.name + " - " + errorMessage.join(", "));
    });
    this.props.updateAlert(message);
  };

  /**
   * Image Manipulation
   */
  editImage = (file) => {
    this.setState({
      showModal: true,
      editImageId: file.id,
      fileName: file.name,
      fileType: file.type,
    });
    this.props.editImage(file);
  };
  handleSave = (fileId) => {
    this.setState({
      showModal: false,
      src: "",
      rotateDegree: 0,
      activeTab: "crop",
      crop: {
        unit: "%",
        height: "60",
        width: "80",
      },
    });
    this.props.updateImage(fileId);
  };
  handleClose = (fileUrl) => {
    if (fileUrl) {
      window.URL.revokeObjectURL(fileUrl);
    }
    this.setState({
      showModal: false,
      src: "",
      rotateDegree: 0,
      activeTab: "crop",
      crop: {
        unit: "%",
        height: "60",
        width: "80",
      },
    });
    this.props.cancelUpdateImage();
  };
  onImageLoaded = (image) => {
    this.imageRef = image;
  };
  onCropChange = (crop) => {
    this.setState({ crop });
  };
  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };
  onRotateLeft = () => {
    this.setState({
      rotateDegree: (this.state.rotateDegree + 270) % 360,
    });
    let image = new Image();
    let props = this.props;
    let state = this.state;
    image.src = this.props.rotateSrc;
    image.onload = function () {
      let resizedDataUrl = PPMSImageEdit.resizeAndRotateImage(
        image,
        800,
        600,
        state.fileType,
        100,
        (state.rotateDegree + 270) % 360
      );
      props.onRotateSave(resizedDataUrl);
    };
  };
  onRotateRight = () => {
    this.setState({
      rotateDegree: (this.state.rotateDegree + 90) % 360,
    });
    let image = new Image();
    let props = this.props;
    let state = this.state;
    image.src = this.props.rotateSrc;
    image.onload = function () {
      let resizedDataUrl = PPMSImageEdit.resizeAndRotateImage(
        image,
        800,
        600,
        state.fileType,
        100,
        (state.rotateDegree + 90) % 360
      );
      props.onRotateSave(resizedDataUrl);
    };
  };
  onFlipVertical = () => {
    let image = new Image();
    let props = this.props;
    let state = this.state;
    image.src = this.props.src;
    image.onload = function () {
      let resizedDataUrl = PPMSImageEdit.resizeAndRotateImage(
        image,
        800,
        600,
        state.fileType,
        100,
        0,
        "vertical"
      );
      props.onFlipSave(resizedDataUrl);
    };
  };
  onFlipHorizontal = () => {
    let image = new Image();
    let props = this.props;
    let state = this.state;
    image.src = this.props.src;
    image.onload = function () {
      let resizedDataUrl = PPMSImageEdit.resizeAndRotateImage(
        image,
        800,
        600,
        state.fileType,
        100,
        0,
        "horizontal"
      );
      props.onFlipSave(resizedDataUrl);
    };
  };
  onCropSave = (event) => {
    this.props.onCropSave(this.state.croppedImageUrl);
    this.setState({
      crop: {
        unit: "%",
      },
    });
  };
  onCropCancel = (event) => {
    this.setState({
      crop: {
        unit: "%",
        height: "60",
        width: "80",
      },
    });
    this.props.onCropCancel(event);
  };
  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }
  getCroppedImg(image, crop, fileName) {
    image.setAttribute("crossorigin", "anonymous");
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      800,
      600
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: any) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, this.props.type);
    });
  }
  onTabSelect = (event) => {
    this.setState({
      activeTab: event.toString(),
      rotateDegree: 0,
    });
  };
  handleDeleteClose = (event) => {
    this.setState({
      showDeleteModal: false,
    });
  };
  handleDeleteOpen = (event) => {
    const { files, checkedItems } = this.props;
    let filesToDelete = [];
    let newFileList = [];
    for (let i = 0; i < files.length; i++) {
      if (checkedItems.get("Checkbox-" + files[i].id) === true) {
        filesToDelete.push(files[i]);
      } else {
        newFileList.push(files[i]);
      }
    }
    if (filesToDelete.length > 0) {
      this.setState({
        filesToDelete: filesToDelete,
        newFileList: newFileList,
        showDeleteModal: true,
      });
    }
  };

  handleSelectFile = (event) => {
    const { files, checkedItems } = this.props;
    let filesSelected = [];
    let newFileList = [];
    for (let i = 0; i < files.length; i++) {
      if (checkedItems.get("Checkbox-" + files[i].id) === true) {
        filesSelected.push(files[i]);
      } else {
        newFileList.push(files[i]);
      }
    }
    this.props.selectedFiles(filesSelected);
    this.props.resetCheckbox(event);
  };

  isSystemGeneratedForms = (
    documentType: string,
    documentDescription: string = ""
  ) => {
    let systemGeneratedFormNameArr = [
      "SF122Form",
      "SF122AForm",
      "SF123Form",
      "SF123AForm",
      "InternalTransferForm",
    ];
    return (
      documentType === "System Generated" ||
      systemGeneratedFormNameArr.includes(documentDescription) ||
      (this.props.completeTransfer &&
        ["Conditional Transfer Document", "Donee Letter of Intent"].includes(
          documentType
        ))
    );
  };

  isDisabledCheckbox = (file, props) => {
    if (
      (!props.selectFiles &&
        (file.virusScanStatus === "IN_PROGRESS" ||
          file.protected ||
          this.isSystemGeneratedForms(file.documentType, file.description))) ||
      (props.selectFiles &&
        props.existingFiles.filter((foundFile) => {
          return foundFile.name === file.name && foundFile.size === file.size;
        }).length > 0)
    ) {
      return true;
    }
    return false;
  };

  getDocumentTypeDropDown = (props, file, index) => {
    return (
      <>
        <div className="upload-item-cell document-type-upload">
          <PPMSSelect
            infoTipContent={
              this.props.customInfoTip
                ? this.props.customInfoTip
                : documentInfoTip
            }
            values={this.transformOptions(
              this.props.documentTypes?.options,
              file
            )}
            selectedValue={
              //Follow transformed id naming for 508 id uniqueness
              file.documentType
                ? file.name +
                  "-option-" +
                  this.props.documentTypes?.options.find(
                    (type) => type.value === file.documentType
                  ).id
                : null
            }
            isRequired={this.props.documentTypes?.isRequired}
            placeholderValue={"Select Value"}
            defaultValue={file.documentType}
            label={"Document Type"}
            id={`${index}-document-type`}
            identifierKey={this.props.documentTypes?.documentTypesKey}
            identifierValue={this.props.documentTypes?.documentTypesValue}
            onChange={(event) =>
              this.handleDocumentTypeChange(event.target, file)
            }
            disabled={
              this.isGivenIndexDisabled(file, this.props)
                ? true
                : this.props.actionDisabled
                ? this.props.actionDisabled
                : file.virusScanStatus !== "CLEAN" || this.props.uploadDisabled
            }
            isInvalid={file.virusScanStatus === "CLEAN" && !file.documentType}
            validationMessage={`Please select a value`}
            ariaLabel={"Document Type Selection"}
          />
        </div>
        {file.documentTypeDescription && (
          <div className="upload-item-cell">
            <PPMSTooltip
              trigger={"focus"}
              id={"other-info"}
              placement={"right"}
              tooltipContent={file.documentTypeDescription}
              triggerSource={
                <button
                  id={`other-info-button`}
                  type={"button"}
                  className={
                    "usa-button usa-button--unstyled other-info-button"
                  }
                  title="Additional Information"
                >
                  <CgNotes />
                </button>
              }
            />
          </div>
        )}{" "}
      </>
    );
  };
  isDisabledButton = (map, value) => {
    for (let [k, v] of map) {
      if (v === value) {
        return false;
      }
    }
    return true;
  };

  isGivenIndexDisabled(file, props) {
    //If file is contained in optional props list of disabled files, edit/delete disabled is true
    if (
      props.disabledAttachmentList &&
      props.disabledAttachmentList.length !== 0 &&
      props.disabledAttachmentList.includes(file.attachmentOrder)
    ) {
      return true;
    }
    return false;
  }

  isAnyFileDisabled(props) {
    if (
      props.disabledAttachmentList &&
      props.disabledAttachmentList.length !== 0
    ) {
      return true;
    }
    return false;
  }

  transformOptions(options, file) {
    let newOptionList = [];
    for (let option of options) {
      let newOption = {};
      newOption["id"] = file.name + "-option-" + option.id;
      newOption["value"] = option.value;
      newOption["isSelected"] = option.isSelected;
      newOptionList.push(newOption);
    }
    return newOptionList;
  }

  render() {
    let max = this.props.files?.length - 1;
    let isFileUploadInProgress = false;
    const files = this.props.files
      .sort((a, b) => a.attachmentOrder - b.attachmentOrder)
      .map((file, index) => {
        return (
          <div key={file.id}>
            <div>
              <div className="upload-item-container">
                <div className="upload-item-cell">
                  {
                    <Checkbox
                      name={"Checkbox-" + file.id}
                      id={"Checkbox-" + file.id}
                      checked={this.props.checkedItems.get(
                        "Checkbox-" + file.id
                      )}
                      onChange={this.props.checkboxClick}
                      disabled={
                        this.isGivenIndexDisabled(file, this.props)
                          ? true
                          : this.props.actionDisabled
                          ? this.props.actionDisabled
                          : this.isDisabledCheckbox(file, this.props)
                      }
                    />
                  }
                </div>
                {this.props.title.toLowerCase() === "images" && (
                  <div className="upload-item-cell">
                    <div className={"thumb"} key={file.name}>
                      <div className={"thumbInner justify-content-center"}>
                        <img
                          src={
                            file.preSignedURI
                              ? file.preSignedURI
                              : placeholderImage
                          }
                          alt={file.name}
                          title={file.name}
                          className={"ppms-img"}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="upload-item-cell image-item-prop">
                  <div className="image-name-row">
                    <EditFileComponent
                      name={file.name}
                      placeholder={file.name}
                      tempName={this.state.tempName}
                      id={file.id}
                      type={this.props.title.toLowerCase()}
                      editItems={this.props.editItems}
                      onChange={this.editNameChange}
                      getIcon={this.getIcon}
                      saveIconClick={() => {
                        this.saveIconClick(file);
                      }}
                      resetEditFileName={() => {
                        this.resetEditFileName(file);
                      }}
                      isDisabled={
                        this.props.actionDisabled
                          ? this.props.actionDisabled
                          : this.isSystemGeneratedForms(
                              file.documentType,
                              file.description
                            )
                      }
                    />

                    {this.props.editItems.get(file.id) === undefined &&
                    !this.props.selectFiles &&
                    !this.isGivenIndexDisabled(file, this.props) ? (
                      <PPMSTooltip
                        trigger={"focus"}
                        id={"edit-name-tip"}
                        placement={"top"}
                        tooltipContent={"Edit Name"}
                        triggerSource={
                          <button
                            className="usa-button usa-button--unstyled edit-image"
                            type="button"
                            id={file.name}
                            onClick={() => this.editIconClick(file)}
                            disabled={
                              this.props.actionDisabled
                                ? this.props.actionDisabled
                                : file.virusScanStatus === "IN_PROGRESS" ||
                                  file.virusScanStatus === "INFECTED" ||
                                  file.protected ||
                                  this.isSystemGeneratedForms(
                                    file.documentType,
                                    file.description
                                  )
                            }
                          >
                            <FaEdit
                              className={"image-icons"}
                              title={"Edit Name"}
                            />
                          </button>
                        }
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div>
                    <span className="upload-item-size">
                      {Math.round(file.size / 1000)} KB
                    </span>
                    &nbsp;
                    <span
                      className={
                        file.virusScanStatus === "INFECTED" ? "infected" : ""
                      }
                    >
                      {file.virusScanStatus}
                    </span>
                  </div>
                  <div>
                    <PPMSTooltip
                      trigger={"focus"}
                      id={"download-image"}
                      placement={"top"}
                      tooltipContent={`Download ${
                        this.props.title.toLowerCase() === "images"
                          ? "Image"
                          : "Document"
                      }`}
                      triggerSource={
                        <button
                          className="usa-button usa-button--unstyled"
                          type="button"
                          id={"download-file-" + index}
                          onClick={() => this.downloadFile(file)}
                          disabled={
                            !this.props.downloadDisabled ||
                            !this.props.actionDisabled
                              ? file.virusScanStatus === "IN_PROGRESS" ||
                                file.virusScanStatus === "INFECTED"
                              : this.props.actionDisabled
                          }
                        >
                          <FaDownload className={"image-icons"} /> Download
                        </button>
                      }
                    />
                    {this.props.title.toLowerCase() === "images" &&
                      !this.props.selectFiles && (
                        <PPMSTooltip
                          trigger={"focus"}
                          id={"edit-image"}
                          placement={"top"}
                          tooltipContent={"Edit Image"}
                          triggerSource={
                            <button
                              className="usa-button usa-button--unstyled"
                              type="button"
                              id={"edit-image-" + index}
                              onClick={() => this.editImage(file)}
                              disabled={
                                this.isGivenIndexDisabled(file, this.props)
                                  ? true
                                  : this.props.actionDisabled
                                  ? this.props.actionDisabled
                                  : file.virusScanStatus === "IN_PROGRESS" ||
                                    file.virusScanStatus === "INFECTED" ||
                                    file.protected
                              }
                            >
                              <IoMdColorWand className={"image-icons"} />
                              Edit Image
                            </button>
                          }
                        />
                      )}
                  </div>
                </div>
                {this.props.documentTypes &&
                !this.isSystemGeneratedForms(
                  file.documentType,
                  file.description
                ) ? (
                  this.getDocumentTypeDropDown(this.props, file, index)
                ) : (
                  <></>
                )}

                {this.isSystemGeneratedForms(
                  file.documentType,
                  file.description
                ) && (
                  <>
                    <div
                      data-testid="formGroup"
                      id={"document-type-system-" + index}
                      className="usa-form-group"
                    >
                      <label
                        data-testid={"document-label-type-system-" + index}
                        className="usa-label"
                      >
                        Document Type
                      </label>
                      <div className="system-document">{file.documentType}</div>
                    </div>
                  </>
                )}
                {file.modifiedDate && (
                  <>
                    <div className="upload-item-cell image-item-prop margin-left-2">
                      <div className="top upload-item-size">Modified Date</div>
                      <div className="bottom">
                        <div className="upload-item-size">
                          {moment(moment(file.modifiedDate).toDate())
                            .local()
                            .format("MM-DD-YYYY HH:mm:ss")}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {!this.props.selectFiles && (
                  <div className="upload-item-cell swap-buttons">
                    {index !== max && (
                      <PPMSTooltip
                        trigger={"focus"}
                        id={"arrow-down-tip"}
                        placement={"top"}
                        tooltipContent={"Move Down"}
                        triggerSource={
                          <button
                            className="usa-button usa-button--unstyled"
                            type="button"
                            id={"arrow-down-" + index}
                            onClick={() => this.onDownClick(file)}
                            disabled={
                              this.isAnyFileDisabled(this.props)
                                ? true
                                : this.props.actionDisabled
                                ? this.props.actionDisabled
                                : file.virusScanStatus === "IN_PROGRESS" ||
                                  file.virusScanStatus === "INFECTED" ||
                                  file.protected
                            }
                            aria-label={`Move-down-arrow-${index}`}
                          >
                            <IoIosArrowDown className={"image-icons"} />
                          </button>
                        }
                      />
                    )}
                    {index !== 0 && (
                      <PPMSTooltip
                        trigger={"focus"}
                        id={"arrow-up-tip"}
                        placement={"top"}
                        tooltipContent={"Move Up"}
                        triggerSource={
                          <button
                            className="usa-button usa-button--unstyled"
                            type="button"
                            id={"arrow-up-" + index}
                            onClick={() => this.onUpClick(file)}
                            disabled={
                              this.isAnyFileDisabled(this.props)
                                ? true
                                : this.props.actionDisabled
                                ? this.props.actionDisabled
                                : file.virusScanStatus === "IN_PROGRESS" ||
                                  file.virusScanStatus === "INFECTED" ||
                                  file.protected
                            }
                            aria-label={`Move-up-arrow-${index}`}
                          >
                            <IoIosArrowUp className={"image-icons"} />
                          </button>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      });

    let inProgressFile = this.props.files.find(
      (f) => f.virusScanStatus === "IN_PROGRESS"
    );
    if (inProgressFile) isFileUploadInProgress = true;

    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <div
              id={`${this.props.id}-${"upload-table"}`}
              className="upload-table"
            >
              <div>
                {this.props.files.length === 0 && (
                  <div role="row" className="upload-table-row">
                    <div role="cell" className="text-center">
                      <br />
                      No Files
                      <br />
                    </div>
                  </div>
                )}
                {files}
                {this.props.loadingRows}
                {this.props.files.length !== 0 && !this.props.selectFiles && (
                  <div role="row" className={"delete-row"}>
                    <div role="cell">
                      <PPMSButton
                        variant={"danger"}
                        icon={<MdDeleteForever className={"image-icons"} />}
                        size={"sm"}
                        id={"delete-"}
                        type={"button"}
                        label={"Delete"}
                        onPress={this.handleDeleteOpen}
                        isDisabled={this.props.actionDisabled}
                      />
                    </div>
                    <div />
                  </div>
                )}
                {this.props.selectFiles && this.props.files.length > 0 && (
                  <div>
                    <br />
                    <div role="row" className={"select-row"}>
                      <div role="cell">
                        <PPMSButton
                          variant={"primary"}
                          className={""}
                          icon={<ImBoxAdd className={"image-icons"} />}
                          id={"relect-row-"}
                          type={"button"}
                          label={this.props.selectFilesLabel}
                          onPress={this.handleSelectFile}
                          isDisabled={
                            this.props.actionDisabled
                              ? this.props.actionDisabled
                              : this.isDisabledButton(
                                  this.props.checkedItems,
                                  true
                                )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {this.props.selectFiles ? (
          <></>
        ) : (
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col"}>
              <Dropzone
                onDrop={(files) => this.onDrop(files)}
                accept={this.props.type}
                minSize={1}
                maxSize={this.props.maxFileSize * 1000000}
                onDropRejected={this.onDropRejected}
                disabled={
                  this.props.actionDisabled
                    ? this.props.actionDisabled
                    : isFileUploadInProgress || this.props.disabled
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <section className="file-container-no-drag">
                    <div
                      {...getRootProps({
                        className: "usa-file-input usa-file-input-property",
                      })}
                    >
                      <div className="usa-file-input__target usa-file-input__target-property">
                        <div
                          className="usa-file-input__instructions"
                          aria-hidden="true"
                        >
                          <span className="usa-file-input__drag-text">
                            <FaCloudUploadAlt className={"image-icons"} />
                            &nbsp;Drag and drop files here, or{" "}
                          </span>
                          <span className="usa-file-input__choose">
                            <PPMSButton
                              variant={"link"}
                              id={`${this.props.id}-${"file-browse"}`}
                              type={"button"}
                              label={"browse"}
                              onPress={() => {
                                console.error("clicked");
                              }}
                              isDisabled={
                                this.props.actionDisabled
                                  ? this.props.actionDisabled
                                  : isFileUploadInProgress ||
                                    this.props.disabled
                              }
                            />
                          </span>
                        </div>
                        <div className="usa-file-input__box" />
                        <input
                          {...getInputProps()}
                          id={this.props.title.toLowerCase() + "-upload"}
                          className="usa-file-input__input"
                          type="file"
                          name="input-multiple"
                          title="file upload"
                          multiple={true}
                        />
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>
        )}
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSModal
              show={this.state.showModal}
              handleClose={() => {
                this.handleClose(this.fileUrl);
              }}
              handleSave={() => {
                this.handleSave(this.state.editImageId);
              }}
              title={"Edit Image"}
              size={"lg"}
              centered={true}
              backdrop={"static"}
              body={
                this.props.loadingImage ? (
                  <h5>
                    <PPMSSpinner
                      animation={"border"}
                      variant={"primary"}
                      loadingText={"Loading..."}
                    />{" "}
                    Loading...
                  </h5>
                ) : (
                  <ModalContent
                    state={this.state}
                    props={this.props}
                    onCropChange={this.onCropChange}
                    onCropComplete={this.onCropComplete}
                    onImageLoaded={this.onImageLoaded}
                    onRotateLeft={this.onRotateLeft}
                    onRotateRight={this.onRotateRight}
                    onFlipHorizontal={this.onFlipHorizontal}
                    onFlipVertical={this.onFlipVertical}
                    onCropSave={this.onCropSave}
                    onCropCancel={this.onCropCancel}
                    onTabSelect={this.onTabSelect}
                  />
                )
              }
              id={"edit-image"}
            />
          </div>
          <div className={"grid-col"}>
            <PPMSModal
              show={this.state.showDeleteModal}
              handleClose={this.handleDeleteClose}
              handleSave={this.handleFileDelete}
              title={"Delete Files"}
              centered={true}
              backdrop={"static"}
              label={"Yes"}
              labelCancel={"No"}
              body={
                <ModalDeleteContent state={this.state} props={this.props} />
              }
              id={"delete-files"}
            />
          </div>
        </div>
      </>
    );
  }
}
const EditFileComponent = ({
  name,
  placeholder,
  tempName,
  id,
  type,
  editItems,
  onChange,
  getIcon,
  saveIconClick,
  resetEditFileName,
  isDisabled = false,
}) => {
  let reducedLenName = placeholder;
  if (placeholder && placeholder.length > 30) {
    reducedLenName = placeholder.substring(0, 25) + " ...";
  }
  return editItems.get(id) === true ? (
    <table id={id + "-editFile"} className="editFileCol">
      <tbody>
        <tr>
          {type !== "images" && <td>{getIcon(name)}</td>}
          <td>
            {" "}
            <PPMSInput
              name={tempName}
              id={id}
              message={""}
              validationMessage={""}
              isInvalid={false}
              isValid={false}
              isRequired={false}
              onChange={onChange}
              label={""}
              value={tempName}
              inputType={"text"}
              isDisabled={isDisabled}
            />
          </td>
          <td>
            <PPMSButton
              variant={"link"}
              icon={<TiTick className={"image-icons"} />}
              id={id + "-save"}
              type={"button"}
              label={""}
              onPress={saveIconClick}
            />
            <PPMSButton
              variant={"link"}
              icon={<TiCancel className={"image-icons"} />}
              id={id + "-cancel"}
              label={""}
              type={"button"}
              onPress={resetEditFileName}
            />
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
    <>
      <div className="editFileCol">
        {type !== "images" && <div>{getIcon(name)}</div>}

        <div className="file-name" title={placeholder}>
          {reducedLenName}
        </div>
      </div>
    </>
  );
};

const Checkbox = ({ name, checked = false, onChange, id, disabled }) => (
  <FormCheck
    name={name}
    checked={checked}
    onChange={onChange}
    id={id}
    disabled={disabled}
    aria-label={`File-Upload-${name}`}
  />
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
const LoadingRow = (id, key) => {
  return (
    <>
      <tr role="row" className="upload-table-row" id={id} key={key}>
        <td role="cell" className="text-center" colSpan={8}>
          <PPMSSpinner
            size={"sm"}
            animation={"border"}
            variant={"primary"}
            loadingText={"Uploading..."}
          />{" "}
          Uploading...
        </td>
      </tr>
    </>
  );
};
const ModalDeleteContent = ({ state, props }) => {
  const list = state.filesToDelete.map((file, index) => (
    <li
      key={"files-to-delete-" + index}
      id={"files-to-delete-" + index}
      className={"filename-word-break"}
    >
      {file.name}
    </li>
  ));
  return (
    <div>
      <p>Are you sure you want to delete these selected file(s)?</p>
      <ol>{list}</ol>
    </div>
  );
};
const ModalContent = ({
  state,
  props,
  onImageLoaded,
  onCropComplete,
  onCropChange,
  onRotateLeft,
  onRotateRight,
  onFlipVertical,
  onFlipHorizontal,
  onCropSave,
  onCropCancel,
  onTabSelect,
}) => {
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="crop">
            <Nav
              as={"ul"}
              className="usa-button-group usa-button-group--segmented"
            >
              <Nav.Item as={"li"} className="usa-button-group__item">
                <Nav.Link
                  eventKey="crop"
                  as={"button"}
                  className={`usa-button ${
                    state.activeTab !== "crop" ? "usa-button--outline" : ""
                  }`}
                  onSelect={onTabSelect}
                >
                  <RiCrop2Line className={"image-icons"} /> Crop Image
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as={"li"} className="usa-button-group__item">
                <Nav.Link
                  eventKey="rotate"
                  as={"button"}
                  className={`usa-button ${
                    state.activeTab !== "rotate" ? "usa-button--outline" : ""
                  }`}
                  onSelect={onTabSelect}
                >
                  <MdRotate90DegreesCcw className={"image-icons"} /> Rotate
                  Image
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as={"li"} className="usa-button-group__item">
                <Nav.Link
                  eventKey="flip"
                  as={"button"}
                  className={`usa-button ${
                    state.activeTab !== "flip" ? "usa-button--outline" : ""
                  }`}
                  onSelect={onTabSelect}
                >
                  <MdFlip className={"image-icons"} /> Flip Image
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="crop">
                <div className={"grid-row grid-gap-4"}>
                  <div className={"ppms-image-edit grid-row grid-gap-4"}>
                    <ReactCrop
                      src={props.src}
                      crop={state.crop}
                      imageAlt={"Crop Image"}
                      ruleOfThirds
                      onImageLoaded={onImageLoaded}
                      onComplete={onCropComplete}
                      onChange={onCropChange}
                    />
                  </div>
                </div>
                <div className={"grid-row grid-gap-4"}>
                  <div className={"d-flex justify-content-center grid-col"}>
                    <ul className="usa-button-group usa-button-group--segmented">
                      <li className="usa-button-group__item">
                        <PPMSButton
                          variant={"outline-primary"}
                          icon={<TiTick className={"image-icons"} />}
                          id={"crop-save"}
                          type={"button"}
                          label={" Apply Crop"}
                          onPress={onCropSave}
                        />
                      </li>
                      <li className="usa-button-group__item">
                        <PPMSButton
                          variant={"outline-primary"}
                          icon={<TiCancel className={"image-icons"} />}
                          id={"crop-cancel"}
                          type={"button"}
                          label={" Cancel Crop"}
                          onPress={onCropCancel}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="rotate">
                <div className={"grid-row grid-gap-4"}>
                  <div className={"ppms-image-edit grid-col"}>
                    <img
                      alt="Rotate"
                      style={{ maxWidth: "100%" }}
                      src={props.src}
                    />
                  </div>
                </div>
                <div className={"grid-row grid-gap-4"}>
                  <div className={"d-flex justify-content-center grid-col"}>
                    <ul className="usa-button-group usa-button-group--segmented">
                      <li className="usa-button-group__item">
                        <PPMSButton
                          variant={"outline-primary"}
                          icon={<MdRotateLeft className={"image-icons"} />}
                          id={"rotate-90-left"}
                          type={"button"}
                          label={" Rotate Left"}
                          onPress={onRotateLeft}
                        />
                      </li>
                      <li className="usa-button-group__item">
                        <PPMSButton
                          variant={"outline-primary"}
                          icon={<MdRotateRight className={"image-icons"} />}
                          id={"rotate-90-right"}
                          type={"button"}
                          label={" Rotate Right"}
                          onPress={onRotateRight}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="flip">
                <div className={"grid-row grid-gap-4"}>
                  <div className={"ppms-image-edit grid-col"}>
                    <img
                      alt="Flip"
                      style={{ maxWidth: "100%" }}
                      src={props.src}
                    />
                  </div>
                </div>
                <div className={"grid-row grid-gap-4"}>
                  <div className={"d-flex justify-content-center grid-col"}>
                    <ul className="usa-button-group usa-button-group--segmented">
                      <li className="usa-button-group__item">
                        <PPMSButton
                          variant={"outline-primary"}
                          icon={<MdFlip className={"image-icons"} />}
                          id={"flip-vertical"}
                          label={" Flip Vertical"}
                          onPress={onFlipVertical}
                        />
                      </li>
                      <li className="usa-button-group__item">
                        <PPMSButton
                          variant={"outline-primary"}
                          icon={
                            <MdFlip
                              className={"image-icons image-icons-rotate"}
                            />
                          }
                          id={"flip-horizontal"}
                          label={" Flip Horizontal"}
                          onPress={onFlipHorizontal}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </>
  );
};
