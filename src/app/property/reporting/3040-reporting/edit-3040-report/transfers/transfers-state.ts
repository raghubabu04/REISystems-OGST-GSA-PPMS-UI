export interface Transfers3040State {
  misc: {
    transferToOther: string;
    returnToFederal: string;
    transfersToSASP: string;
    sbaTransfers: string;
    seaTransfers: string;
    sbaVOSBtransfers: string;
    transfersToVeteran: string;
    sbaDisasterTransfers: string;
  };
  nonMisc: {
    sold: string;
    abandoned: string;
    otherNegative: string;
  };
  transferSummary: string;
}

export const transfers3040StateDefault: Transfers3040State = {
  misc: {
    transferToOther: "",
    returnToFederal: "",
    transfersToSASP: "",
    sbaTransfers: "",
    seaTransfers: "",
    sbaVOSBtransfers: "",
    transfersToVeteran: "",
    sbaDisasterTransfers: "",
  },
  nonMisc: {
    sold: "",
    abandoned: "",
    otherNegative: "",
  },
  transferSummary: "",
};
