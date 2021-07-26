import {processFiles} from './processFiles';
import {
  SalesUploadState,
  SalesUploadProps,
  salesStateUpdates,
  stateStatus,
  iLocalFileDTO,
  iFileDTO
} from './SalesUploadTypes';

export const getDefaultState = (props: SalesUploadProps): SalesUploadState => {

  const validCampaign = ((props.campaignId || '').length === 0);

  return <SalesUploadState>{
    campaignId: (validCampaign) ? props?.campaignId : null,
    error: (props.disabled) ? ["Before uploading Sales Documents, a valid campaign name must be provided. ",] : ["Please upload documents.",],
    accordionExpanded: true,
    accordingDisplay: "show",
    pending: [],
    fileListComplete: false,
    files: [],
    editItems: new Map(),
    loadingRows: [],
    alertStatus: stateStatus.info,
    src: "",
    checkedItems: new Map(),
    onFilesUpdated: props.onFilesUpdated,
  };
}


const evalError = (error: any): string[] => {
  if (error === undefined) return [];
  if (typeof error === 'object') {
    if (Array.isArray(error)) {
      return error.map(v => v.toString());
    }
    if (error instanceof Error) return [error.message];
    if (Array.isArray(error.error)) {
      if (error.error.length > 0) return error.error;
      else return null;
    }
    return error.toString();
  }

  if (typeof error === 'string') {
    return [error];
  }
  return [error.toString()];
}

const localFilesToPostFiles = (local: iLocalFileDTO[]): iFileDTO[] =>{

  let fileDTOs = local.map(file => {
    return {
      id: file.id,
      itemType: file.itemType,
      name: file.name,
      description: file.description,
      size: file.size,
      uri: file.uri,
      attachmentOrder: file.attachmentOrder,
      virusScanStatus: file.virusScanStatus,
      deleted: false,
    };
  })
  return fileDTOs;
}

const testCampaignId = (stateID, payloadID) => {
  if ((stateID || '') === '') {
    return payloadID;
  } else if (stateID === payloadID) {
    return null;
  } else {
    throw new Error(`Campaign ID set to ${stateID} state update trying to set it to ${payloadID}`);
  }
}

export const dispatcher = (state: SalesUploadState, payload: salesStateUpdates): SalesUploadState => {
  try {
    console.info('StateUpdate',{payload});
    let updates: salesStateUpdates |null = {};
    Object.keys(payload).forEach(key => {
      if(key === 'reset') updates = null;
      if(updates === null) return;
      if(key === 'campaignId') {
        let campId = testCampaignId(state.campaignId, payload.campaignId);
        if (campId !== null) updates.campaignId = campId;
        return;
      }
      if(key === 'props') {
        let campId = testCampaignId(state.campaignId, payload.props?.campaignId);
        if (campId !== null) updates.campaignId = campId;
        updates.error = payload.props.disabled ? ["Before uploading Sales Documents, a valid campaign name must be provided. "] : ["Please upload documents."];
        return;
      }
      if(key === 'error') {
        // let err = evalError(payload.error);
        // if(err != null) updates.error;
        console.error('error identified: ' + updates.error);
        return;
      }
      if(key === 'files') {
        updates = processFiles(state, updates, payload);
        return;
      }
      updates[key] = payload[key];
    });//end of foreach.
    const newState = updates === null? payload.reset : Object.assign({}, state, updates);
    if(newState.error != state.error) console.log('error updated:' + newState.error);
    if(payload.files){
     newState.onFilesUpdated(localFilesToPostFiles(newState.files));
    }
    if (!Array.isArray(newState.error)) {

      newState.error = [newState.error];
    }
    return newState;
  } catch (e) {
    return Object.assign({}, state, {error: [`failed to set campaign state: ${e.message}`]});

  }
}

