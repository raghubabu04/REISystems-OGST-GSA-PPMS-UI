import { Environment } from "../../../../../environments/environment";

export const buildActions = (dispatch) => {
  return {
    resetEditFileName: () => dispatch({ editItems: new Map() }),
    updateAlert: (message) => dispatch({ error: message }),
    setLoadingRows: (rows) => dispatch({ loadingRows: rows }),
    fileListComplete: () => dispatch({ fileListComplete: true }),

    editFileName: (file) => {
      const item = file.id;
      let editItems = new Map();
      editItems.set(item, true);
      dispatch({ editItems });
    },

    downloadFile: (file) => {
      let url = `${Environment.COMMON_URL}/api/v1/downloadFile?path=${file.uri}&fileType=${file.itemType}&fileName=${file.name}`;

      fetch(url)
        .then((resp) => resp.blob())
        .then((blob) => {
          const iurl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = iurl;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(() =>
          dispatch({ error: [`issue downloading file ${file.name}`] })
        );
    },
    onClick: () => {}, //Does nothing in property!
  };
};
