export interface BidderAccountPreferencesState {
  notifyAuctionWin: boolean;
  notifyItemOutbid: boolean;
  accountPreferencesOptions: any;
}

export const bidderAccountPreferencesStateDefault: BidderAccountPreferencesState = {
  notifyAuctionWin: false,
  notifyItemOutbid: false,
  accountPreferencesOptions: [
    {
      value: "Notify me when I don't win an auction",
      id: "notifyAuctionWin",
      isSelected: false,
    },
    {
      value: "Notify me when I am outbid for an item",
      id: "notifyItemOutbid",
      isSelected: false,
    }
  ],
}

export const BidderAccountPreferencesStateJson = (
  bidderAccountPreferencesState: BidderAccountPreferencesState
) => [
  {
    notifyAuctionWin: bidderAccountPreferencesState.notifyAuctionWin,
    notifyItemOutbid: bidderAccountPreferencesState.notifyItemOutbid
  },
];
