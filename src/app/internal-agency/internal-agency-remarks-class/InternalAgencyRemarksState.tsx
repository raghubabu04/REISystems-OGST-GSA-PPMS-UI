export interface InternalAgencyRemarksState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  remarks: string;
  remarksIsInvalid: boolean;
  remarksErrorMsg: string;
  remarksCharacterLeft: number;
}

export const InternalAgencyRemarksDefault = {
  accordianExpanded: true,
  accordingDisplay: "show",
  remarks: "",
  remarksIsInvalid: false,
  remarksErrorMsg: "Remarks is Required.",
  remarksCharacterLeft: 800,
};

export const InternalAgencyRemarksStateJson = (
  internalAgencyRemarksState: InternalAgencyRemarksState
) => [
  {
    remarks: internalAgencyRemarksState.remarks,
  },
];
