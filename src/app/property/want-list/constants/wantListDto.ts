export abstract class WantListModel {
    wantListId: string;
    wantListName: string;
    createdBy: string;
    itemControlNumber: string;
    fscCodes: string;
    itemName: string;
    itemSearchOption: string;
    reimbursement: string;
    conditionCode: string;
    stateCodes: string;
    expiryDate: Date;
}


export class WantListDTO extends WantListModel {
  static asNonReportedTansfer(dto: WantListModel): WantListDTO {
    return Object.assign(new WantListDTO(), dto);
  }
}
