import { generateValidRequest } from "../../../../bidder-payments/details/common/constants/Utils";
import { currencyToNumber } from "../../../../../../ui-kit/utilities/FormatUtil";

export const generateRequest = (state, notes, contractIds, roles) => {
  if (!roles.isCLO) {
    return {
      contractPaymentDTO: { contractId: contractIds },
      currentNotes: notes,
    };
  }
  return {
    contractPaymentDTO: generateValidRequest(state, contractIds),
    currentNotes: notes,
    liquidatedDamageFee: currencyToNumber(
      state.data.contractFeeDetails.liquidatedDamageFee
    ),
  };
};
