export abstract class NonReportingTransferModel {
  property: {
    itemControlNumber: string;
    aacId: string;
    agencyBureau: string;
    reportingAgencyAddress: {
      city: string;
      stateCode: string;
    };
    propertyPOC: {
      email: string;
    };
    itemName: string;
    quantity: string;
    unitOfIssue: string;
    originalAcquisitionCost: string;
    totalAcquisitionCost: string;
    fscCode: string;
    sourceCode: string;
    conditionCode: string;
    salesCenter: string;
    actionCode: string;
    propertyCreationSource: string;
  };
  gainingAgency: {
    agencyBureauCd: string;
    transferControlNumber: string;
    requestedAACId: string;
    requestedAgencyBureauCd: string;
    requestedBy: {
      email: string;
    };
    shippingAddress: {
      city: string;
      stateCode: string;
    };
    region: string;
    reason: string;
    requestedItemList: [
      {
        requestedQuantity: string;
        priorityCode: string;
      }
    ];
  };
  propertyType: string;
}

export class NonPropertyTransferDto extends NonReportingTransferModel {
  static asNonReportedTansfer(
    dto: NonReportingTransferModel
  ): NonPropertyTransferDto {
    return Object.assign(new NonPropertyTransferDto(), dto);
  }
}
