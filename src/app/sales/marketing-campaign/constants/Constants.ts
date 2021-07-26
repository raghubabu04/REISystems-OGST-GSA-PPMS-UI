export const campaignRunValues = [
  { value: "Everyday", id: "EVD" },
  { value: "Once a week", id: "OCW" },
];
export const bidderByMonthYear = [
  { value: "1 Month", id: "ONY" },
  { value: "3 Months", id: "THM" },
  { value: "6 Months", id: "ONM" },
  { value: "1 Year", id: "SXM" },
];
export const includeBidders = [
  {value: "All", id: "ALL"},
  {value: "Winning Bid", id: "WBD"},
  {value: "Top 5", id: "TP5"},
];

export const auctionStartDates = [
  {value: "Today", id: "STARTTDY"},
  {value: "1 Day", id: "STARTFDY"},
  {value: "2 Days", id: "STARTSDY"},
];

export const auctionEndDates = [
  {value: "Today", id: "ENDTDY"},
  {value: "1 Day", id: "ENDFDY"},
  {value: "2 Days", id: "ENDSDY"},
];

export const selectItemBasedOn = [
  {value: "Least Number of Bidders", id: "LNB"},
  {value: "Highest price", id: "HGP"},
];

export const sendEmailTo = [
  {value: "All", id: "EMAILALL"},
  {value: "Random 50%", id: "RND"},
];

export const filterCampaigns = [
  {
    value: "Show Campaigns",
    id: "show_campaigns",
    isSelected: true,
  },
  {
    value: "Active Campaigns",
    id: "active",
    isSelected: false,
  },
  {
    value: "Submitted Campaigns",
    id: "submitted",
    isSelected: false,
  },
  {
    value: "Draft Campaigns",
    id: "draft",
    isSelected: false,
  },
  {
    value: "Deleted Campaigns",
    id: "deleted",
    isSelected: false,
  },
  {
    value: "Completed Campaigns",
    id: "completed",
    isSelected: false,
  },
];
