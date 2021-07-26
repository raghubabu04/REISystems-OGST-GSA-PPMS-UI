import { saleConstants } from "../_constants/sale.constants";

const initState = {
  saleId: "",
  saleNumber: "",
  saleAction: "",
  zone: 0,
  contractNumber: "",
  contractId: "",
};
export function sale(state = initState, action) {
  switch (action.type) {
    case saleConstants.SAVE_SALE:
    case saleConstants.UPDATE_SALE:
    case saleConstants.VIEW_SALE:
      return {
        ...state,
        saleId: action.saleId,
        saleNumber: action.saleNumber,
        saleAction: action.saleAction,
        zone: action.zone,
        contractNumber: action.contractNumber,
        contractId: action.contractId,
      };
    case saleConstants.REMOVE_SALE:
      return {
        ...state,
        saleID: "",
        saleNumber: "",
        saleAction: "",
        zone: 0,
      };
    default:
      return {
        ...state,
      };
  }
}
