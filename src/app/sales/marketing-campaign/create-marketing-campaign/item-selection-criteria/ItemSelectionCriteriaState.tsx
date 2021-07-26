export interface ItemSelectionCriteriaState {
  fscSelectedValues?: any;
  saleItemNumber?: any;
  bidAmountRangeFrom?: any;
  bidAmountRangeTo?: any;
  bidderNumFrom?: any;
  bidderNumTo?: any;
  bidderNumFromInvalid?: any;
  bidderNumFromInvalidMessage?: any;
  bidderNumToInvalid?: any;
  bidderNumToInvalidMessage?: any;
  auctionStart?: any;
  auctionEnd?: any;
  selectItem?: any;
  fscInvalid?: any;
  fscInvalidMessage?: any;
  fscOptions?: any;
  endingRangeInvalid?: any;
  endingRangeInvalidMessage?: any;
  startRangeInvalid?: any;
  startRangeInvalidMessage?: any;
  isDecimalPresentFrom: boolean;
  isDecimalPresentTo: boolean;
  isSaleOrLotInvalid: boolean;
  saleOrLotValidationErrorMessage: string;

}

export const ItemSelectionCriteriaStateDefault = {
  fscSelectedValues: [],
  saleItemNumber: "",
  bidAmountRangeFrom: "",
  bidAmountRangeTo: "",
  bidderNumFrom: "",
  bidderNumTo: "",
  auctionStart: "",
  auctionEnd: "",
  selectItem: "",
  fscInvalid: false,
  fscInvalidMessage: " ",
  fscOptions: [],
  startRangeInvalid: false,
  startRangeInvalidMessage: "",
  endingRangeInvalid: false,
  endingRangeInvalidMessage: "",
  bidderNumFromInvalid: false,
  bidderNumFromInvalidMessage: "",
  bidderNumToInvalid: false,
  bidderNumToInvalidMessage: "",
  isDecimalPresentFrom: false,
  isDecimalPresentTo: false,
  isSaleOrLotInvalid: false,
  saleOrLotValidationErrorMessage: ""
};
