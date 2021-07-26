export interface TermsAndConditionsState {
  currentVersionNumber: string;
  listOfVersionNumber: string[];
  isNextClicked: boolean;
}

export const termsAndConditionsStateDefault: TermsAndConditionsState = {
  currentVersionNumber: "",
  listOfVersionNumber: [],
  isNextClicked: false
}
