export interface RefundNotesState {
  refundNotes?: string;
  refundNotesIsValid?: boolean;
  refundNotesIsInvalid?: boolean;
  refundNotesErrorMsg?: string;
  validationMessage?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  triggerValidation?: boolean;
  actionHistoryData?: any;
}

export const RefundNotesStateDefault: RefundNotesState = {
  refundNotes: "",
  refundNotesIsValid: false,
  refundNotesIsInvalid: false,
  refundNotesErrorMsg: "Refund Notes is Required.",
  validationMessage: "",
  isValid: true,
  isInvalid: false,
  triggerValidation: false,
  actionHistoryData: [],
};
