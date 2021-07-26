export interface Donations3040State {
  publicProfit: {
    conversation: string;
    tableConversation: string;
    education: string;
    publicHealth: string;
    assistanceToHomeless: string;
    assistanceToOlderAmericans: string;
    other: string;
    economicDevelopment: string;
    parksAndRecreation: string;
    publicSafety: string;
    FamiliesOrIndividuals: string;
    twoOrMore: string;
  };
  nonProfit: {
    education: string;
    publicHealth: string;
    assistanceToHomeless: string;
    assistanceToOlderAmericans: string;
    familiesOrIndividuals: string;
  };
  donationSummary: string;
}

export const donations3040StateDefault: Donations3040State = {
  publicProfit: {
    conversation: "",
    tableConversation: "",
    education: "",
    publicHealth: "",
    assistanceToHomeless: "",
    assistanceToOlderAmericans: "",
    other: "",
    economicDevelopment: "",
    parksAndRecreation: "",
    publicSafety: "",
    FamiliesOrIndividuals: "",
    twoOrMore: "",
  },
  nonProfit: {
    education: "",
    publicHealth: "",
    assistanceToHomeless: "",
    assistanceToOlderAmericans: "",
    familiesOrIndividuals: "",
  },
  donationSummary: "",
};
