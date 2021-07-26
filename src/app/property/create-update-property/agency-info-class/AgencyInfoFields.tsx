import { AgencyInfoState } from "./AgencyInfoState";

export const agencyInfoFields = (state: AgencyInfoState) => [
  {
    id: "agency-bureau",
    name: "agencyBureau",
    label: "Agency Bureau",
    value: state.agencyBureau,
    inputType: "text",
    isDisabled: true,
    isRequired: true,
  },
];
