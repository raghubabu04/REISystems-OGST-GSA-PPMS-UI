import { isEmptyCheck } from "../validations/propertyFieldValidations";

export interface AgencyInfoState {
  accordianExpanded: boolean;
  accordingDisplay: string;
  agencyBureau: string;
  aac: string;
  selectedAgencyAddressContact: string;
  aacValues: Array<string>;
  isInternalAgency: boolean;
  agencyInfoInvalid: boolean;
  agencyInfoValid: boolean;
}

export const AgencyInfoStateDefault = {
  accordianExpanded: true,
  accordingDisplay: "show",
  agencyBureau: "",
  aac: "",
  selectedAgencyAddressContact: "",

  isInternalAgency: false,
  aacValues: [],
  agencyInfoInvalid: false,
  agencyInfoValid: false,
};

const eFields = ["agencyBureau"];

export function updateAgencyInfoNav(
  newState: AgencyInfoState,
  prevState: AgencyInfoState
): void {
  const agencyInfoEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.agencyInfoInvalid = agencyInfoEmpty;
  newState.agencyInfoValid = !agencyInfoEmpty;
}
