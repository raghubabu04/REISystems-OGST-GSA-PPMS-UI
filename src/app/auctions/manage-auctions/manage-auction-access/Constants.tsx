import moment from "moment";

export interface LotTerminationDTO {
  lotIds: number[];
  terminationReason: string;
  otherReasonText: string;
}

export interface LotExtensionDTO {
  lotIds: number[];
  extensionHours: number;
}

export enum TerminateAuctionReason {
  MISDESCRIPTION = "misdescription",
  REPORTING_ERROR = "reporting_error",
  WITHDRAWN = "withdrawn_from_sale",
  UNAVAILABLE = "unavailable",
  OTHER = "other",
}

export enum BidderStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  DELETED = "Deleted",
  DEFAULTED = "DEFAULT",
}

export enum AuctionStatus {
  ACTIVE = "Active",
  PREVIEW = "Preview",
  CLOSED = "Closed",
}

export enum SaleMethod {
  INTERNET = "internet",
  VAS = "vas",
  ONLINE_AUCTION = "Online Auction",
  LIVE_SALE = "live sale",
  SEALED_INFORMAL = "Sealed / Informal",
}
export enum BidStatus {
  ACTIVE = "Active",
  CLOSED = "Closed",
  PREVIEW = "Preview",
  AWARDED = "Awarded",
}

export enum AwardStatus {
  AWARDED = "Awarded",
  CLOSED = "Closed",
  PENDING_AWRAD = "Award Pending",
  PENDING_DOCUMENTATION = "Pending Documentation",
}

export const terminateAuctionReasonOptions = [
  {
    value: "Misdescription",
    id: TerminateAuctionReason.MISDESCRIPTION,
    isSelected: false,
  },
  {
    value: "Reporting",
    id: TerminateAuctionReason.REPORTING_ERROR,
    isSelected: false,
  },
  {
    value: "Withdrawn form sale by the owning agency",
    id: TerminateAuctionReason.WITHDRAWN,
    isSelected: false,
  },
  {
    value: "No longer available",
    id: TerminateAuctionReason.UNAVAILABLE,
    isSelected: false,
  },
  {
    value: "Other Reason",
    id: TerminateAuctionReason.OTHER,
    isSelected: false,
  },
];

export const formattedDate = (date: string) => {
  return date
    ? moment(moment(date, "YYYY-MM-DDTHH:mm"))
        .format("MM/DD/YYYY hh:mm A")
        .toString()
    : null;
};
