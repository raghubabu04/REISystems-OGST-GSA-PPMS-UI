import { saleConstants } from "../_constants/sale.constants";

export const saleActions = {
  updateSaleInfo,
};
function updateSaleInfo(saleId, saleNumber, saleAction, zone, contractNumber?:string, contractId?:string, ) {
  return (dispatch) => {
    dispatch(success(saleId, saleNumber, saleAction, zone, contractNumber, contractId));
  };
  function success(saleId, saleNumber, saleAction, zone, contractNumber, contractId) {
    return {
      type: saleConstants.UPDATE_SALE,
      saleId,
      saleNumber,
      saleAction,
      zone,
      contractNumber,
      contractId
    };
  }
}
