import * as React from "react";
import {useEffect} from "react";
import {PPMSAlert} from "../../../../../ui-kit/components/common/PPMS-alert";
import {PPMSDropZone} from "../../../../../ui-kit/components/common/upload/PPMS-dropzone";
import {useFileHandler} from "./useFileHandler";
import {SalesApiService} from "../../../../../api-kit/sales/sales-api-service";
import {CommonApiService} from "../../../../../api-kit/common/common-api.service";
import {dispatcher, getDefaultState} from "./salesUpload.state";
import {SalesUploadProps} from "./SalesUploadTypes";

export const SalesUpload = (props: SalesUploadProps) => {
  const fileHandler = useFileHandler(
    props,
    new SalesApiService(),
    new CommonApiService(),
    dispatcher,
    getDefaultState
  );
  const {
    state,
    actions,
    triggerDrop,
    addFile,
    saveIconClick,
    onUpClick,
    onDownClick,
    setFlagToDelete,
    fileDelete,
  } = fileHandler;
  // file upload is getting successful when I comment useeffect. There are no methods for isButtonDisabled() and isButtonEnabled().
  // useEffect(() => {
  //   state?.files.forEach((file) => {
  //     if (file.virusScanStatus === "IN_PROGRESS") {
  //       props.isButtonDisabled();
  //     } else {
  //       props.isButtonEnabled();
  //     }
  //   });
  // }, [state?.files]);
  return (
    <>
      <div className={"grid-row grid-gap-4"} />
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSAlert
            alertBodyArray={state.error}
            alertClassName={"dropzone-alert"}
            alertKey={"dropzone-alert-document"}
            alertVariant={state.alertStatus}
            id={"dropzone-alert-document"}
            show={state.error.length > 0}
          />
          <PPMSDropZone
            files={state?.files}
            filesLimit={5}
            title="document"
            triggerDrop={triggerDrop}
            type={[
              ".pdf",
              ".doc",
              ".docx",
              ".xlsx",
              ".xls",
              ".rtf",
              ".cvs",
              ".txt",
            ]}
            onDrop={addFile}
            maxFileSize={256}
            downloadFile={actions.downloadFile}
            disabled={props.disabled}
            saveIconClick={saveIconClick}
            resetEditFileName={actions.resetEditFileName}
            updateAlert={actions.updateAlert}
            setLoadingRows={actions.setLoadingRows}
            loadingRows={state.loadingRows}
            checkboxClick={setFlagToDelete}
            editIconClick={actions.editFileName}
            src={state.src}
            handleFileDelete={fileDelete}
            onUpClick={onUpClick}
            onDownClick={onDownClick}
            onClick={actions.onClick}
            checkedItems={state.checkedItems}
            editItems={state.editItems}
          />
        </div>
      </div>
    </>
  );
};
