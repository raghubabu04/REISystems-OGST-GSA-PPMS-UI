export interface Receipts3040State {
  federalAgencyAmount: string;
  fromOtherStates: string;
  fromOverSeas: string;
  pocAdjust: string;
  receiptsSummary: string;
}

export const receipts3040StateDefault: Receipts3040State = {
  federalAgencyAmount: "",
  fromOtherStates: "",
  fromOverSeas: "",
  pocAdjust: "",
  receiptsSummary: "",
};
