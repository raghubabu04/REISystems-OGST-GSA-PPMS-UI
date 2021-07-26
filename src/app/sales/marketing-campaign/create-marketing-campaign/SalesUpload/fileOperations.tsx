import {
  iFileDTO,
  iLocalFileDTO,
  SalesUploadState,
  stateFlags,
} from "./SalesUploadTypes";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";

export class ApiHandler {
  constructor(salesAPI, commonAPI, dispatch) {
    this.api = salesAPI;
    this.capi = commonAPI;
    this.dispatch = dispatch;
  }

  api: SalesApiService;
  capi: CommonApiService;
  dispatch;

  private processFile = async (file, state: SalesUploadState) => {
    let data = {
      marketingCampaignId: state.campaignId,
      name: file.name,
      description: file.description,
      itemType: file.type,
      attachmentOrder: state.files.length,
      size: file.size,
    };

    const response = await this.api
      .uploadFile(data)
      .then((res) => res)
      .catch((e) => e);
    if (response instanceof Error) {
      return new Error("Unknown reason, please try again.");
    }

    let request = new FormData();
    request.append("file", file);
    request.append("databaseId", response.data.id);
    file.id = response.data.id;
    request.append("type", "Campaign");
    request.append("marketingCampaignId", state.campaignId);
    const comResponse = await this.capi
      .uploadFile(request)
      .then((res) => res)
      .catch((e) => e);

    if (comResponse instanceof Error) {
      return comResponse;
    } else if (!comResponse.data) {
      return new Error("No data in the response");
    }
    file.virusScanStatus = comResponse.data?.virusScanStatus;
    file.uri = comResponse.data.uri;
    file.tempName = file.name;
    return file;
  };

  private verifyUnique = (file, testFiles: iLocalFileDTO[]) => {
    for (let testFile of testFiles) {
      if (file.name === testFile.name) return false;
    }
    return true;
  };

  public filePostHandler = async (
    state: SalesUploadState,
    files: iFileDTO[]
  ) => {
    let error = "";
    if ((state.campaignId || "") === "") return;
    let newFiles: iLocalFileDTO[] = [];
    for (let i = 0; i < files.length; i++) {
      let file: iLocalFileDTO = files[i];
      let result;
      if (!this.verifyUnique(file, [].concat(state.files, newFiles))) {
        result = new Error("File with same name already exists.");
      } else result = await this.processFile(file, state);
      if (result instanceof Error) {
        file.failed = true;
        file.deleted = true;
        error = "Upload failed: " + result.message;
        if (file.databaseId)
          this.api
            .deleteFiles([file.databaseId])
            .catch((e) => this.dispatch(e));
      }
      if (!file.deleted) newFiles.push(file);
    }
    if (error !== "") {
      this.dispatch({
        files: newFiles,
        error: [error],
        flags: [stateFlags.newFiles],
      });
    } else this.dispatch({ files: newFiles, flags: [stateFlags.newFiles] });
  };

  public handleCheckFiles = async (state) => {
    if (!state.campaignId) {
      return true;
    }
    const resp = await this.api
      .getUploadedItems(state.campaignId)
      .then((res) => res)
      .catch((e) => e);
    if (resp instanceof Error) {
      this.dispatch({ error: resp });
      return true;
    }
    if (!resp.data?.document) {
      this.dispatch({ files: [], flags: [stateFlags.fullFile] });
      return true;
    }
    const fileData = resp.data.document;
    let remainFiles = false;
    let newFiles = [];
    fileData.forEach((theFile) => {
      let file = Object.assign({}, theFile);
      let addData = state.files.find((f) => f.id === file.id);
      if (addData !== undefined) {
        file = Object.assign({}, addData, file);
      }
      if (file.virusScanStatus === "IN_PROGRESS") {
        remainFiles = true;
      }
      newFiles.push(file);
    });
    this.dispatch({
      files: newFiles,
      flags: [stateFlags.fullFile],
      fileListComplete: true,
    });

    return remainFiles;
  };

  public handleFileDelete = async (newFileList, filesToDelete) => {
    let deleteAPIPayload = [];
    let fileUpdate = [];
    filesToDelete.forEach((file) => {
      deleteAPIPayload.push(file.id);
      fileUpdate.push({ id: file.id, deleted: true });
    });
    this.api
      .deleteFiles(deleteAPIPayload)
      .then()
      .catch(() => this.dispatch({ error: "error deleting files" }));

    this.dispatch({
      files: fileUpdate,
      checkedItems: new Map(),
      editItems: new Map(),
    });
  };

  public updateFile = (data) => {
    return this.api.updateFile(data);
  };
}
