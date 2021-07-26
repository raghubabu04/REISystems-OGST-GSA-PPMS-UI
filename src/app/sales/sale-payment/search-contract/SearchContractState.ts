export interface SearchContractState {
  contractNumber: string;
  contractNumberIsInValid: boolean;
  contractNumberIsValid: boolean;
  contractNumberValidationMessage: string;
  last4Vin: string;
  last4VinIsInValid: boolean;
  last4VinIsValid: boolean;
  last4VinValidationMessage: string;
  isSearchValid: boolean;
  vinNumber: string;
  searchVinNumber: string;
  searchContractNumber: string;
  searchContractId: string;
}

export const defaultSearchContractState: SearchContractState = {
  contractNumber: "",
  contractNumberIsInValid: false,
  contractNumberIsValid: false,
  last4Vin: "",
  last4VinIsInValid: false,
  last4VinIsValid: false,
  isSearchValid: false,
  contractNumberValidationMessage: "",
  last4VinValidationMessage: "",
  vinNumber: "",
  searchVinNumber: "",
  searchContractNumber: "",
  searchContractId: "",
};
