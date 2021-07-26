export const ForeignGiftsStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  WITHDRAWN: "WITHDRAWN",
  RECALLED: "RECALLED",
  SOLD: "SOLD",
  EXCESS_SCREENING: "EXCESS SCREENING",
  REJECTED: "REJECTED",
  AWAITING_DOS_APPROVAL: "AWAITING DOS APPROVAL",
  DESTROYED: "DESTROYED",
  TRANSFERRED: "TRANSFERRED",
  DONATED: "DONATED",
  SALE_APPROVAL: "SALE APPROVAL",
  AVAILABLE: "AVAILABLE",
  RESTRICTED: "RESTRICTED",
  LOTTED: "LOTTED"
};

export const restrictedItemOptions = [
  { value: "Yes", id: "restrictedYes", isSelected: false },
  { value: "No", id: "restrictedNo", isSelected: false },
];
export const vaultLocationOptions = [
  { value: "Franconia", id: "franconia", isSelected: false },
  { value: "DOE", id: "doe", isSelected: false },
];

export const withdrawlForeignGiftsConfirmationOption = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: false },
];

export const rejectForeignGiftsConfirmationOption = [
  { value: "Yes", id: "Y", isSelected: false },
  { value: "No", id: "N", isSelected: false },
];
