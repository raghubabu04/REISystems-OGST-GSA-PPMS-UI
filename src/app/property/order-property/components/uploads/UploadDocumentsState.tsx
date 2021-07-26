export interface UploadDocumentsState {
  docsFilesList: any[];
  alertStatus:
    | "info"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "dark"
    | "light";
  message: string[];
}

export const UploadDocumentsStateDefault: UploadDocumentsState = {
  docsFilesList: [],
  alertStatus: "info",
  message: [],
};
