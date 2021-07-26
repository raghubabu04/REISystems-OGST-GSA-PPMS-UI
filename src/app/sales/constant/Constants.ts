export const salesSearchValues = [
  { value: "All Words", caps: "ALL_WORDS", id: "All" },
  { value: "Exact Phrase", caps: "EXACT_PHRASE", id: "Exact" },
  { value: "Any Word", caps: "ANY_WORD", id: "Any" },
];

/*Advance Search ICN and TCN constants*/
export const regexForTCNandICN = /[^a-zA-Z0-9. ]/g;

export const salesAttributeOptions = [
  {
    value: "Item attributes",
    id: "Item",
    isSelected: true,
  },
  {
    value: "Sales/Lot attributes",
    id: "Sale",
    isSelected: false,
  },
  {
    value: "Contract attributes",
    id: "Contract",
    isSelected: false,
  },
  {
    value: "Bidder attributes",
    id: "Bidder",
    isSelected: false,
  },
];

export const internetVASContent = {
  closingRules: {
    header: "Closing Rules",
    content:
      'This auction will end in one of these ways:<br />At the auction close time if no bids (proxy or flat) are placed within the inactivity period, or the auction is not subject to a inactivity period. <br />After the inactivity period has passed without any bids (proxy or flat) being placed.<br />Note: "N/A" or a blank indicates that the value is not available for this auction.',
  },
  howToBid: {
    header: "How To Bid",
    content: [
      {
        header: "Placing a Bid",
        content:
          "GSA Auctions only accepts minimum and maximum bids. A maximum bid is the maximum amount you are willing to pay for an item. Maximum bids are also referred to as proxy bids. When you place your maximum bid, GSA Auctions will use as much of your bid as needed to make you the current winner of the auction or to meet the auction's reserve price. The minimum bid you can place is either the starting price of the auction, or the current high bid plus the bid increment.<br />GSA Auctions only accepts bids in whole dollar amounts. Bids in partial dollar amounts, $150.25 for example, will not be accepted by the GSA Auctions system.",
      },
      {
        header: "Reserve Price",
        content:
          "The reserve price is the minimum price that GSA Auctions is willing to accept for an item. If your maximum bid equals or exceeds the reserve price, your bid will be placed at the reserve price.<br />How Are Tie Bids Resolved in GSA Auctions? If a bidder places a bid with the same proxy bid amount as another bidder, the previous (first) bidder will have the current high bid since their bid was placed first. Both bids are recorded with the same amount, displaying the first bidder with the same amount as current high bid, until another bidder bids higher.",
      },
      {
        header: "Competing Proxy Limits",
        content:
          "When two proxy bids compete, the greater of the two proxy limits always wins. If the greater proxy limit exceeds the lesser proxy limit by the bid increment, then a bid equal to the lesser proxy limit plus the bid increment will be placed. If the greater proxy limit does not exceed the lesser proxy limit by the bid increment, then the greater proxy limit's maximum bid will be placed.",
      },
      {
        header: "Increasing Your Maximum Bid",
        content:
          "You can increase your maximum bid if you are currently the winner in an auction. To increase your maximum bid, enter an amount greater than your current maximum bid. Increasing your bid will not increase your current high bid.",
      },
      {
        header: "Decreasing Your Maximum Bid",
        content:
          "You can decrease your maximum bid if you are currently the winner in an auction. To decrease your maximum bid, enter an amount less than your current maximum bid. You cannot decrease your bid below the minimum bid price.",
      },
    ],
  },
  maximumBidProxyBid: {
    header: "Maximum Bid/Proxy Bid",
    content:
      "Your maximum bid or proxy bid, submits bids on your behalf. You specify the maximum price you are willing to pay. If you are outbid, the system submits a replacement bid at a higher price to keep you in the auction. It will bid as much as your maximum bid but no more.<br />Your maximum price is not shown to any other bidders.<br />If the system reaches your maximum bid limit, it stops bidding for you. Submit another bid if you want to continue bidding.",
  },
  winningTrading: {
    winningTrading: {
      header: "Winning & Trading",
      content:
        "The highest bid at the close of the auction wins.<br />If your bid is lower than the reserve price, you will not win the auction.",
    },
    reductionBidIncrementNotes: {
      header: "Reduction of Bid Increment Notes",
      content:
        "The reduction of bid increment happens when there is no bid activity within a specified time for an auction. The system will decrease the incremental bid amount by a percentage upto a limit based on template codes designed for this purpose. All auctions are not subject to the reduction of bid increment rule. Here's an example: A bid increment is set at $25.00 for an auction. A No-Bid-Period has been set for 2 days at a reduction rate of 10 percent and a reduction limit of $20.00. After 2 full days of inactivity for the auction, the bid increment will be reduced by 10 percent now making the current bid increment $22.00. 10 percent of $25.00 = $2.50 rounded to the nearest dollar $3.00. The reduction is repeated for multiple inactivity periods until the reduction limit is reached or auction closes.",
    },
  },
};

export const voidContractOption = [
  {
    id: "delotAll",
    value: "Delot All ICNs",
    isSelected: false,
  },
  {
    id: "transferLot",
    value: "Transfer Lot",
    isSelected: false,
  },
];

export const yesOrNoOptions = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: false },
];

export const assignmentsValues = [
  {
    id: "A",
    value: "All Zone Sales",
    isSelected: false,
  },
  {
    id: "M",
    value: "Assigned to Me",
    isSelected: false,
  },
  {
    id: "O",
    value: "Assigned to Others",
    isSelected: false,
  },
];

export const vehicleColorToneValues = [
  { value: "Light", id: "LIGHT", isSelected: true },
  { value: "Medium", id: "MEDIUM", isSelected: false },
  { value: "Dark", id: "DARK", isSelected: false },
  { value: "Other", id: "OTHER", isSelected: false }
];

export const vehicleColorValues = [
  { id: "BG", value: "Blue-Green/Turquoise", isSelected: false },
  { id: "BK", value: "Black", isSelected: false },
  { id: "BL", value: "Blue", isSelected: false },
  { id: "BR", value: "Brown", isSelected: false },
  { id: "GD", value: "Gold/Bronze", isSelected: false },
  { id: "MR", value: "Burgandy", isSelected: false },
  { id: "GY", value: "Gray", isSelected: false },
  { id: "GR", value: "Green", isSelected: false },
  { id: "OR", value: "Orange", isSelected: false },
  { id: "RE", value: "Red", isSelected: false },
  { id: "SI", value: "Silver", isSelected: false },
  { id: "WH", value: "White", isSelected: false },
  { id: "YE", value: "Yellow", isSelected: false },
  { id: "OT", value: "Other", isSelected: false }
];
