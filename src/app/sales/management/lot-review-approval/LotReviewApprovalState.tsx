export interface LotReviewApprovalState {
  data: {
    custodian: any;
    lots: any;
  };
  other: { agencyBureaus: any; lots: any };
}

export const LotReviewApprovalDefaultState: LotReviewApprovalState = {
  data: {
    custodian: {},
    lots: [],
  },
  other: {
    agencyBureaus: [],
    lots: {
      page: {
        currentPage: 1,
        totalRows: 0,
        pageSize: 10,
      },
    },
  },
};
