import React, { useContext, useEffect, useState } from "react";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";
import { FilesUpload } from "./FilesUpload";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSTextArea } from "../../../../../ui-kit/components/common/input/PPMS-textarea";
import { PropertyApiService } from "../../../../../api-kit/property/property-api-service";
import { documentTypeOptions } from "../../../allocate-property/Constants";
import { useStore } from "react-redux";
import {
  FilePermissions,
  getDocFilePermissions,
  updateFilePermissions,
} from "./FilePermissions";

const DocumentTypeModalBody = ({ onChangeDocumentDescription }) => {
  return (
    <PPMSTextArea
      isInvalid={false}
      isValid={false}
      id={"document-type-body"}
      isRequired={true}
      isDisabled={false}
      inputType={"text"}
      maxLength={30}
      onChange={(event) => {
        onChangeDocumentDescription(event.target.value);
      }}
    />
  );
};

interface UploadDocumentProps {
  tcn?: string;
  context?: any;
  tcnInfo?: any;
  tcnDetails?: any;
  completeTransfer?: boolean;
  [key: string]: any;
}

export function UploadDocument(props: UploadDocumentProps) {
  const propertyApiService = new PropertyApiService();
  const { uploadDocumentsState, updateUploadDocumentsState } = useContext(
    props.context
  );
  const [fileTypeDescription, setFileTypeDescription] = useState<string>("");
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const [fileId, setFileId] = useState();

  const store = useStore().getState();
  const user = store.authentication.user;
  const permissions = getDocFilePermissions(
    props.tcnInfo,
    store,
    props.tcnDetails
  );
  let interval;

  function updateAlert(message) {
    updateUploadDocumentsState({
      message: message.error,
      alertStatus: message.type,
    });
    if (message?.errorType === "upload") {
      clearInterval(interval);
    }
  }

  function triggerDrop() {
    let docsFilesList = [];
    interval = setInterval(() => {
      if (docsFilesList.length !== 0) {
        let filesProcessed = docsFilesList.filter(
          (docsFile) => docsFile.virusScanStatus === "IN_PROGRESS"
        );
        if (filesProcessed.length === 0) {
          clearInterval(interval);
        }
      }

      propertyApiService
        .getUploadedItems(props.tcn, "TCN")
        .then((response: any) => {
          if (response.data && response.data.documents) {
            docsFilesList = response.data.documents;
          }
          updateUploadDocumentsState({
            docsFilesList,
          });
        })
        .catch((error: any) => {
          clearInterval(interval);
          console.log(error);
        });
    }, 10000);
  }

  useEffect(() => {
    triggerDrop();
  }, []);

  const documentTypes = {
    options: documentTypeOptions,
    documentTypesKey: "id",
    documentTypesValue: "value",
    isRequired: true,
  };

  function updateFilesList() {
    propertyApiService
      .getUploadedItems(props.tcn, "TCN")
      .then((response: any) => {
        let docsFilesList = [];
        if (response.data && response.data.documents) {
          docsFilesList = response.data.documents;
        }
        updateUploadDocumentsState({
          docsFilesList,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const updateDocumentTypes = (id, index) => {
    let docType = documentTypes.options[index];
    let docsFilesList = uploadDocumentsState.docsFilesList;
    let fileToEdit = docsFilesList.find((item) => item.id === id);
    let data;
    if (docType?.value === "Other") {
      data = [
        {
          id: fileToEdit.id,
          documentType: docType.value,
          documentTypeDescription: fileTypeDescription,
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
    propertyApiService
      .updateItems(data)
      .then((response) => {
        response.data.forEach((item) => {
          fileToEdit.documentType = item.uploadItem?.documentType;
          fileToEdit.documentTypeDescription =
            item.uploadItem?.documentTypeDescription;
        });
        updateUploadDocumentsState({
          docsFilesList,
        });
      })
      .catch((error) => {
        console.error("Error getting TCN documents from API", error);
      });
  };

  const updateSelection = (id, index) => {
    if (index >= 0) {
      setFileId(id);
      let docType = documentTypes.options[index];
      if (docType.value === "Other") {
        setShowDocumentTypeModal(true);
        setFileTypeDescription("");
      } else {
        updateDocumentTypes(id, index);
      }
    }
  };

  const onChangeDocumentDescription = (value) => {
    setFileTypeDescription(value);
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentTypeModal(false);
  };
  updateFilePermissions(
    uploadDocumentsState?.docsFilesList || [],
    permissions,
    user
  );
  return (
    <>
      <div className={"usa-card__body"}>
        <PPMSAlert
          alertBodyArray={uploadDocumentsState?.message}
          alertClassName={"dropzone-alert"}
          alertKey={"dropzone-alert-document"}
          alertVariant={uploadDocumentsState?.alertStatus}
          id={"dropzone-alert-document"}
          show={uploadDocumentsState?.message?.length > 0}
        />
        <PPMSAlert
          alertBodyArray={["Please upload documents."]}
          alertClassName={"dropzone-file-alert"}
          alertKey={"dropzone-file-alert-document"}
          alertVariant={"info"}
          id={"dropzone-alert-document"}
          show={uploadDocumentsState?.docsFilesList?.length === 0}
        />
        <FilesUpload
          tcn={props.tcn.toString()}
          filesLimit={10}
          type="documents"
          updateAlert={updateAlert}
          files={uploadDocumentsState?.docsFilesList}
          maxFileSize={256}
          triggerDrop={triggerDrop}
          updateFilesList={updateFilesList}
          documentTypes={documentTypes}
          documentTypesChange={(id, index) => updateSelection(id, index)}
          downLoadDisabled={!permissions.includes(FilePermissions.Download)}
          uploadDisabled={!permissions.includes(FilePermissions.Upload)}
          completeTransfer={props.completeTransfer}
        />
      </div>
      <PPMSModal
        id={"document-type"}
        body={
          <>
            <DocumentTypeModalBody
              onChangeDocumentDescription={onChangeDocumentDescription}
            />
            <small>Maximum 30 characters</small>
          </>
        }
        handleClose={handleCloseDocumentModal}
        handleSave={() => {
          updateDocumentTypes(fileId, documentTypes.options.length - 1);
          setShowDocumentTypeModal(false);
        }}
        show={showDocumentTypeModal}
        title={"Additional Information"}
      />
    </>
  );
}
