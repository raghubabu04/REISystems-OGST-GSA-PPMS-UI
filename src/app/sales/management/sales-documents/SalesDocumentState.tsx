export interface SalesDocumentState {
  salesNumber: string;
  docsFilesList: any;
  fileInfectedStatus: boolean;
}
export const DefaultSalesDocumentState: SalesDocumentState = {
  salesNumber: "",
  docsFilesList: [],
  fileInfectedStatus: false,
};
