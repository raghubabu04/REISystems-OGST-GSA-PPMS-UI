import {stateFlags} from "./SalesUploadTypes";
import {SalesApiService} from "../../../../../api-kit/sales/sales-api-service";

//TODO: Files position for the top element is almost certainly based on 0 is equal to false.8

const processFileLists = (list, sfiles, pfiles) => {
  let newList = [];
  list.forEach((id) => {
    let s = sfiles.filter((file) => file && file?.id === id)[0];
    let p = pfiles.filter((file) => file && file?.id === id)[0];
    let f;
    if (s && p) {
      f = Object.assign({}, s, p);
    } else if (!s) f = Object.assign({}, p);
    else f = Object.assign({}, s);
    if (f.localOrder !== undefined) {
      let i = f.localOrder;
      while (newList[i] !== undefined) i++;
      newList[i] = f;
    } else if (f.attachmentOrder !== undefined) {
      let i = f.attachmentOrder;
      while (newList[i] !== undefined) i++;
      newList[i] = f;
    } else {
      let i = newList.length;
      newList[i] = f;
    }
  });
  return newList;
};

export const updateFiles = (updateList) => {
  const api = new SalesApiService();
  let data = updateList.map((file) => {
    return {
      id: file.id,
      attachmentOrder: file.attachmentOrder,
      name: file.name,
    };
  });
  api.updateFile(data).catch((e) => console.error(e));
};

export const processFiles = (state, updates, payload) => {
  if (!Array.isArray(payload.files)) {
    updates.error = ["Operation failed, please try again"];
    return updates;
  }
  if (!state.files) {
    throw Error("Unexpected state, files are not there");
  }

  let newFlag = payload.flags && payload.flags?.includes(stateFlags.newFiles);
  let fullFlag = payload.flags && payload.flags?.includes(stateFlags.fullFile);
  updates.error = state.error;
  if (newFlag) {
    if (payload.error === undefined)
      updates.error = ["Please upload documents."];
    else updates.error = ["Please upload documents."].concat(payload.error);
  } else if (fullFlag) {
    if (
      payload.files.find((f) => f.virusScanStatus === "IN_PROGRESS") ===
      undefined
    ) {
      updates.error[0] = "Please upload documents.";
    } else {
      updates.error[0] = "Checking files for viruses, please wait.";
    }
  } else if (payload.error) updates.error(updates.error.concat(payload.error));

  let list = fullFlag
    ? payload.files.map((file) => file.id)
    : state.files.map((file) => file.id);
  let newFiles = processFileLists(list, state.files, payload.files);

  payload.files.forEach((file) => {
    if (newFiles.find((f) => f?.id === file.id) === undefined) {
      let o = state.files.find((f) => f.id === file.id);
      if (o) file = Object.assign({}, o, file);
      newFiles.push(file);
    }
  });

  let finList = [];
  let updateList = [];
  newFiles
    .filter((f) => f !== undefined && !f.deleted)
    .forEach((file) => {
      let index = finList.length;
      finList.push(file);
      if (
        index !== file.attachmentOrder ||
        file.attachmentOrder === undefined ||
        file.localOrder !== undefined ||
        file.renamed === true
      ) {
        file.attachmentOrder = index;
        file.localOrder = undefined;
        file.renamed = false;
        updateList.push(file);
      }
    });

  updates.files = finList;
  if (updateList.length > 0) updateFiles(updateList);
  updates.loadingRows = "";
  //    updates.loadingRows = payload.files.map((file, index) => { return `${index}-load-Row` }); ???"?"
  return updates;
};
