export interface ManageBidsState {
  data: {
    saleLotBidAmountList: {
      saleNumber: string;
      lotNumber: string;
      bidAmount: string;
    }[];
    bidderId: number;
    userName: string;
    bidderUserIdsOptions?: any[];
    selectedUserId?: string
  };
}

export const ManageBidsDefaultState: ManageBidsState = {
  data: {
    saleLotBidAmountList: [],
    bidderId: 0,
    userName: "",
    bidderUserIdsOptions: [],
    selectedUserId: ""
  },

};
