export interface BidderExperianVerificationState {

  creditCardNumber?: string;
  isCreditCardInvalid?: boolean;
  creditCardValidationMessage?: string;
  experianConsent: boolean;
  experianConsentValidationMessage?: string;
}

export const bidderExperianVerificationDefault: BidderExperianVerificationState = {

  creditCardNumber: "",
  isCreditCardInvalid: false,
  creditCardValidationMessage: "",
  experianConsent: false,
  experianConsentValidationMessage: "",
}

export const BidderExperianVerificationStateJson = (
  bidderExperianVerification: BidderExperianVerificationState
) => [
  {
    consentForExperian: bidderExperianVerification.experianConsent,
    creditCardNumber:bidderExperianVerification.creditCardNumber
  },
];
