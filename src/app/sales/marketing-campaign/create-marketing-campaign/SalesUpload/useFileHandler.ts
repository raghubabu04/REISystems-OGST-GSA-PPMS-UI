import * as React from "react";
import { buildActions } from "./SalesUpload.actions";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { CommonApiService } from "../../../../../api-kit/common/common-api.service";
import {
  salesUploadDipspatcher,
  salesUploadDispatch,
  SalesUploadState,
  campaignIdStatus,
  iFileDTO,
} from "./SalesUploadTypes";
import { useStore } from "react-redux";
import { ApiHandler } from "./fileOperations";

interface intervalGroup {
  [key: string]: NodeJS.Timer;
}

const intervals: intervalGroup = {
  virus: null,
  periodic: null,
};
const resetInterval = (key) => {
  clearInterval(intervals[key]);
  intervals[key] = null;
};

export const useFileHandler = (
  props,
  salesAPI: SalesApiService,
  commonAPI: CommonApiService,
  dispatcher,
  getDefaultState
) => {
  const [state, dispatch]: [
    SalesUploadState,
    salesUploadDispatch
  ] = React.useReducer<salesUploadDipspatcher, SalesUploadState>(
    dispatcher,
    props,
    getDefaultState
  );

  const [apiHandler] = React.useState(
    new ApiHandler(salesAPI, commonAPI, dispatch)
  );
  const [actions] = React.useState(buildActions(dispatch));
  const [campFetchStatus, setCampFetchStatus] = React.useState<
    campaignIdStatus
  >(campaignIdStatus.idle);

  const store = useStore().getState();
  const key = store.router.location.key;
  const [lastKey, setLastKey] = React.useState(0);
  const [pending, setPending] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * Returns value of the current property id.
   * If it is non-existent it will try to call a parent, if that fails, it returns false;
   * If it cannot currently get it because it is already trying, it will return null;
   */
  const getCampaignId = React.useCallback(async () => {
    if ((state.campaignId || "") !== "") return;

    await props
      .campProvider()
      .then((campId) => {
        dispatch({ campaignId: campId });
        if (campId === null) {
          setCampFetchStatus(campaignIdStatus.failed);
          return false;
        }
        setCampFetchStatus(campaignIdStatus.done);
        return campId;
      })
      .catch(() => {
        setCampFetchStatus(campaignIdStatus.failed);
        dispatch({
          error: ["System Error: No campaignId or campaign provider"],
        });
        return false;
      });
  }, [campFetchStatus, props, state.campaignId]);

  const setFlagToDelete = (event) => {
    const item = event.target.name;
    const isChecked = event.target.checked;
    let checked = state.checkedItems;
    checked.set(item, isChecked);
    dispatch({ checkedItems: checked });
  };

  const handleFiles = React.useCallback(
    async (files: iFileDTO[]) => {
      await apiHandler.filePostHandler(state, files).catch((e) => dispatch(e));
    },
    [state]
  );

  const checkFiles = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      let continueChecks = await apiHandler.handleCheckFiles(state);
      if (!continueChecks) {
        resetInterval("virus");
        if (intervals.periodic === null) {
          intervals.periodic = setInterval(checkFiles, 30 * 1000);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [state]);

  const fileDelete = (newFileList, filesToDelete) => {
    apiHandler
      .handleFileDelete(newFileList, filesToDelete)
      .catch((e) => dispatch(e));
  };

  const saveIconClick = (fileId, tempName) => {
    apiHandler
      .updateFile([{ id: fileId, name: tempName }])
      .catch((e) => dispatch({ error: e }));
    dispatch({
      files: [{ id: fileId, name: tempName, renamed: true }],
      editItems: new Map(),
      checkedItems: new Map(),
    });
  };

  const addFile = (file) => {
    setPending([...pending, file]);
  };

  React.useEffect(() => {
    if (pending.length === 0) return;
    if ((state.campaignId || "") !== "") {
      if (pending.length > 0) {
        handleFiles(pending).catch((e) => dispatch(e));
        setPending([]);
      }
    } else if (
      ![campaignIdStatus.fetching, campaignIdStatus.idle].includes(
        campFetchStatus
      )
    ) {
      setPending([]);
      dispatch({ error: ["file upload failed"] });
    }
  }, [state.campaignId, campFetchStatus]);

  const triggerDrop = () => {
    if ((state.campaignId || "") !== "") {
      handleFiles(pending).catch((e) => dispatch(e));
      setPending([]);
    } else {
      getCampaignId().catch((e) => dispatch(e));
    }
  };

  const onUpClick = (clickedFile) => {
    let index1 = clickedFile.attachmentOrder;
    let index2 = index1 - 1;
    updatePositions(index1, index2);
  };
  const onDownClick = (clickedFile) => {
    let index1 = clickedFile.attachmentOrder;
    let index2 = index1 + 1;
    updatePositions(index1, index2);
  };

  const updatePositions = (index1, index2) => {
    let files = [
      Object.assign({}, state.files[index1], { localOrder: index2 }),
      Object.assign({}, state.files[index2], { localOrder: index1 }),
    ];
    dispatch({ files: files });
  };

  React.useEffect(() => {
    if (intervals.virus || state.files.length === 0) return;
    let a = state.files.find(
      (file) => !["CLEAN", "INFECTED"].includes(file?.virusScanStatus)
    );
    if (a !== undefined) {
      intervals.virus = setInterval(checkFiles, 10 * 1000);
    }
  }, [state.files, intervals.virus]);

  React.useEffect(() => {
    if (!(state.fileListComplete || state.campaignId === "")) {
      setTimeout(checkFiles, 2000);
    }
  }, [state.campaignId, state.fileListComplete]);

  React.useEffect(() => {
    if (key !== lastKey) {
      setPending([]);
      setCampFetchStatus(campaignIdStatus.idle);
      setLastKey(key);
      resetInterval("virus");
      resetInterval("periodic");

      dispatch({ reset: getDefaultState(props) });
      setTimeout(checkFiles, 2000);
    } else {
      dispatch({ props });
    }
  }, [props.disabled, props.campaignId, key]);

  return {
    state,
    dispatch,
    triggerDrop,
    actions,
    fileDelete,
    addFile,
    setFlagToDelete,
    saveIconClick,
    onUpClick,
    onDownClick,
  };
};
