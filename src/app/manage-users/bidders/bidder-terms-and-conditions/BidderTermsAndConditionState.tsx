export interface BidderTermsAndConditionsState {
  activeKey: string;
  isAllTermsAndConditionAccepted: boolean;
  agreementOptions: any[];
}
export const bidderTermsAndConditionsStateDefault: BidderTermsAndConditionsState = {
  activeKey: "bidder-information-registration",
  isAllTermsAndConditionAccepted: false,
  agreementOptions: [
    {
      value: "I accept the Terms and Conditions",
      id: "bidder-agreement-id",
      isSelected: false,
    },
  ],
};
