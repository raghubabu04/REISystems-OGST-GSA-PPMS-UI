import React from "react";

export const bidderDetails = {
  auctionDescriptionAndBiddingRules: {
    header: "Auction Description and Bidding Rules",
    content:
      "This is an English auction. At the close of the auction, the user with the highest bid wins the auction, as long as that bid is at or above the auction's reserve price. The reserve price is the lowest priceaccepted for the item. Once you submit a bid, you cannot cancel it, but you can replace it with a higher bid. When you submit a new higher bid, it replaces your previous one.",
  },
  auctionProperties: {
    header: "Auction Properties",
    currentHighBid: {
      id: "currentHighBid",
      label: "Current High Bid",
      infoTipContent:
        "The bid price that is currently the high bid. This is the price you must beat to make a current high bid.",
    },
    bidIncrement: {
      id: "bidIncrement",
      label: "Bid Increment",
      infoTipContent:
        "The bid increment is the amount by which the current high bid must be increased by in order to place a bid.",
    },
    reservePrice: {
      id: "reservePrice",
      label: "Reserve Price",
      infoTipContent:
        "The reserve price is the minimum price that GSA Auctions is willing to accept for an item. If your maximum bid equals or exceeds the reserve price, your bid will be placed at the reserve price.",
    },
    reserveAmount: {
      id: "reserveAmount",
      label: "Reserve Amount",
      infoTipContent:
        "The reserve price is the minimum price a seller is willing to accept for the item. This value is in not shown to the bidder. Note: if your maximum bid price is greater than or equalto the reserve price, the system will automatically place a bid at the reserve price on your behalf.",
    },
    bidDepositRequired: {
      id: "bidDepositRequired",
      label: "Bid Deposit Required",
      infoTipContent:
        "",
    },
    inactivityPeriod: {
      id: "inactivityPeriod",
      label: "Inactivity Period",
      infoTipContent:
        "The amount of time in minutes that must pass without any bidding activity for the auction to close. If the inactivity period is N/A, then the auction will close at the specified auction close date and time.",
    },
    runLength: {
      id: "runLength",
      label: "Run Length",
      infoTipContent: "The number of days the auction is scheduled to run.",
    },
    inactivityPeriodforReductionOfBidIncrement: {
      id: "inactivityPeriodforReductionOfBidIncrement",
      label: "Inactivity Period for Reduction of Bid Increment",
      infoTipContent:
        "The number of days the auction has no bidding activity before the bid increment is modified.",
    },
    reductionOfBidIncrement: {
      id: "reductionOfBidIncrement",
      label: "Reduction of Bid Increment",
      infoTipContent:
        "The percentage to reduce the bid increment following the inactivity period for the auction or previous reduction in bid increment.",
    },
    reductionOfBidIncrementLimit: {
      id: "reductionOfBidIncrementLimit",
      label: "Reduction of Bid Increment Limit",
      infoTipContent:
        "The minimum the bid increment can be reduced to following the inactivity period for the auction or previous reduction in bid increment.",
    },
    startTime: {
      id: "startTime",
      label: "Start Time",
      infoTipContent: "Starting time of auction.",
    },
    closingTime: {
      id: "closingTime",
      label: "Closing Time",
      infoTipContent:
        "This auction will close at the Close Time or possibly later. See auction start and close times on the Bidding Rules page.",
    },
    status: {
      id: "status",
      label: "Status",
      infoTipContent: "Current status of auction.",
    },
  },
  closingRules: {
    header: "Closing Rules:",
    content: "This auction will end in one of these ways:",
    list1:
      "At the auction close time if no bids (proxy or flat) are placed within the inactivity period, or the auction is not subject to a inactivity period.",
    list2:
      "After the inactivity period has passed without any bids (proxy or flat) being placed.",
    note:
      'Note: "N/A" or a blank indicates that the value is not available for this auction.',
  },

  bidBtnInfo: {
    header: "Bid Button Info",
      liveAuctionBid: {
        id: "liveAuctionBtnInfo",
        label: "Information",
        infoTipContent:
          "Public auctions are conducted in a conventional Live Auction setting with an auctioneer calling bids at a specific date and time. Bidders register, submit the bid deposit, and bid openly against each other until the highest bidders survives without challenge.",
      },
      sealedBid: {
        id: "sealedBidBtnInfo",
        label: "Information",
        infoTipContent:
          "Bidders mail in bids and bid deposits to the specified GSA regional office prior to the designated bid opening date and time. All bids are kept in a secure location and are secret until they are all publicly opened at the same time on the sealed bid opening date. No bids may be modified or withdrawn after the designated sealed bid opening date and time. The highest bid received is reviewed for acceptance or rejection shortly after the sealed bids are opened.",
      }
  },
};

export const internetVASContent = {
  closingRules: {
    header: 'Closing Rules',
    content:
      '<p>This auction will end in one of these ways:</p><p>At the auction close time if no bids (proxy or flat) are placed within the inactivity period, or the auction is not subject to a inactivity period. After the inactivity period has passed without any bids (proxy or flat) being placed.</p><strong>Note:</strong> "N/A" or a blank indicates that the value is not available for this auction.</p>',
  },
  howToBid: {
    header: 'How To Bid',
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

export const bidding_history_notes = [
  <div>
    <span>
      Note: When "Compatible" bidding occurs (two or more bids of the same
      amount are submitted), the "high bid" is determined by GSA Auctions
      system's evaluation, based on the time of submission and/or by proxy.
      <br />
      <br />
      To enhance bidder privacy, and protect GSA Auctions users from fraudulent
      emails, GSA Auctions has changed how User IDs are displayed on the bid
      history page. Only you can view your User ID, all other members will see
      anonymous user IDs, such as Bidder*.
      <br />
      <br />
      As of February 14, 2009 bidders will be assigned the actual bidder number
      for the sale/lot based on when they placed their bid, if you are the first
      bidder for this sale you will see Bidder#1, if you are the second bidder
      you will see Bidder#2.
      <br />
      <br />
    </span>
  </div>,
];
export const PBS_STATIC_TEXT = [
  <div>
    <span>
      <h3>Closing Rules</h3>
      <div className="bid-details-content">
        <p>This auction will end in one of these ways:</p>
        <p>At the auction close time if no bids (proxy or flat) are placed within the inactivity period, or the auction is not subject to a inactivity period. After the inactivity period has passed without any bids (proxy or flat) being placed.</p>
      </div>
      <div className="bid-details-content">
      <p><strong>Note:</strong> "N/A" or a blank indicates that the value is not available for this auction.</p>
      </div>
      
      <h3>How To Bid</h3>
      <div className="bid-details-content">
        <strong>Placing a Bid</strong>
        <p>Auctions for real property accept flat or automatic bids.</p>
      </div>
      <div className="bid-details-content">
        <strong>Flat bid</strong> 
        <p>A flat bid is for an amount at least the current bid plus the posted minimum Bid Increment. If the bid is greater than another bidders automatic bid, the system will consider this flat bid as the current (high) bid. If the bid is less than or equal to another bidders automatic bid, the system will record the bid but it will not be considered the current (high) bid.</p>
      </div>
      <div className="bid-details-content">
        <strong>Automatic bid</strong> 
        <p>An automatic bid is an amount that you set above the posted minimum bid. Realestatesales.gov will use as much of your bid as needed to make you the current winner of the auction or to meet the auction reserve price. The system will automatically apply the minimum Bid Increment up to the total amount bid to make you the current winner of the auction or to meet the auctions reserve price. Your automatic bid amount is not shown to other bidders until it is reached through competitive bidding. You may change your bid amount but not less than the next bid increment amount.</p>
      
        <p>GSA Auctions only accepts bids in whole dollar amounts.Bids in partial dollar amounts, $150.25 for example, will not be accepted by the GSA Auctions system.</p>
      </div>
      <div className="bid-details-content">
        <strong>Reserve Price</strong>
        <p>The reserve price is the minimum price that GSA Auctions is willing to accept for an item. If your maximum bid equals or exceeds the reserve price, your bid will be placed at the reserve price.</p>
      </div>
      <div className="bid-details-content">
        <strong>Tie Bids</strong>
        <p>If a bidder places a bid with the same automatic bid amount as another bidder, the previous (first) bidder will have the high bid since their bid was placed first. Both bids are recorded with the same amount, displaying the first bidder with the same amount as high bidder, until another bidder bids higher.</p>
      </div>
      <div className="bid-details-content">
        <strong>Competing Automatic Bids</strong>
        <p>When two automatic bids compete, the greater of the two automatic bids always wins. If the greater automatic bid exceeds the lesser automatic bid by the bid increment, then a bid equal to the lesser automatic bid plus the bid increment will be placed. If the greater automatic bid does not exceed the lesser automatic bid by the bid increment, then the greater automatic bids total bid amount will be placed.</p>
      </div>
      <div className="bid-details-content">
        <strong>Changing Your Automatic Bid</strong>
        <p>You can increase your automatic bid if you are currently the winner in an auction. To increase your automatic bid, enter an amount greater than your current automatic bid. Increasing your bid will not increase your current high bid.</p>
      
        <p>You can decrease your automatic bid if you are currently the winner in an auction. To decrease your automatic bid, enter an amount less than your current automatic bid. You cannot decrease your bid below the minimum bid price. Changing your automatic bid may affect the indicated time remaining.</p>
      </div>
      
      <h3>Winning the auction</h3>
      <div className="bid-details-content">
        <p>The highest bid at the close of the auction will be considered for award of the sale. The Government reserves the right to reject any and all bids for any reason.</p>
      </div>
      <div className="bid-details-content">
        <strong>Changes to the Bid Increment</strong>
        <p>Real property auctions will typically maintain the bid increment throughout the sale. However, in some sales the bid increment may be decreased or increased based on bidder activity. Announcements will be made on-line prior to any such change. Bidders should check the sale frequently for announced changes.</p>
      </div>
      <div className="bid-details-content">
        <strong>Changes to the Bidding Interval</strong>
        <p>Real property auctions close by announcing the sale end date and time and a bidding interval (usually 24-hours) whereby the highest bid received must survive the full bid interval period before the auction closes. However, the bid interval may be decreased or increased or eliminated at any time based on bidder activity. Announcements will be made on-line prior to any such change. Bidders should check the sale frequently for announced changes.</p>
      </div>
      
    </span>
  </div>
];

