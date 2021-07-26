import {
  saleFleetMethod,
  saleMethod,
  time,
} from "../../../management/transactions/constants/Constants";
import { isEmptyCheck } from "../validations/fleetValidations";

export interface SaleInformationState {
  saleStartDate: string;
  saleStartDateIsInValid: boolean;
  saleStartDateIsValid: boolean;
  saleStartDateValidationMessage: string;
  saleEndDate: string;
  saleEndDateIsInValid: boolean;
  saleEndDateIsValid: boolean;
  saleEndDateValidationMessage: string;
  saleMethod: string;
  saleMethodIsInValid: boolean;
  saleMethodIsValid: boolean;
  saleMethodValidationMessage: string;
  saleTime: string;
  saleTimeValidationMessage: string;
  saleTimeIsInValid: boolean;
  saleTimeIsValid: boolean;
  saleTimeOptions: any[];
  saleMethodOptions: any[];
  saleTimeAmPm: string;
  saleStatus: string;
  saleInformationIsInvalid: boolean;
  saleInformationIsValid: boolean;
  auctionStatus: string;
}

export const saleInformationStateDefault: SaleInformationState = {
  saleStartDate: "",
  saleStartDateIsInValid: false,
  saleStartDateIsValid: false,
  saleStartDateValidationMessage: "",
  saleEndDate: "",
  saleEndDateIsInValid: false,
  saleEndDateIsValid: false,
  saleEndDateValidationMessage: "",
  saleMethod: "",
  saleMethodIsInValid: false,
  saleMethodIsValid: false,
  saleMethodValidationMessage: "",
  saleTime: "",
  saleTimeValidationMessage: "",
  saleTimeIsInValid: false,
  saleTimeIsValid: false,
  saleTimeOptions: time(),
  saleMethodOptions: saleFleetMethod,
  saleTimeAmPm: "AM",
  saleStatus: "",
  saleInformationIsInvalid: false,
  saleInformationIsValid: false,
  auctionStatus: "",
};

const vFields = [
  "saleStartDateIsInValid",
  "saleEndDateIsInValid",
  "saleTimeIsInValid",
  "saleMethodIsInValid",
];

const eFields = ["saleStartDate", "saleEndDate", "saleTime",  "saleMethod"];

export function updateSaleInformationNav(
  newState: SaleInformationState,
  prevState: SaleInformationState
): void {
  const saleInformationIsInvalid: boolean = vFields.some((f) => {
    return newState[f] !== undefined ? newState[f] : prevState[f];
  });
  const saleInformationIsEmpty: boolean = eFields.some((f) => {
    return newState[f] !== undefined
      ? isEmptyCheck(newState[f])
      : isEmptyCheck(prevState[f]);
  });
  newState.saleInformationIsInvalid = saleInformationIsInvalid;
  newState.saleInformationIsValid =
    !saleInformationIsInvalid && !saleInformationIsEmpty;
}
