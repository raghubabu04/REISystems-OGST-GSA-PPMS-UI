import React from "react";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

export const WithdrawForeignGiftsConfirmationModal = ({
  state,
  handleWithdrawConfirmChange,
  withdrawOptions,
  handleWithdrawalReasonChange,
}) => {
  return (
    <div className={"withdraw-property-confirmation"}>
      <div className={"grid-row grid-gap"}>
        <div className={"grid-col-12"}>
          <PPMSToggleRadio
            id={"withdrawForeignGiftsConfirmationOption"}
            options={withdrawOptions}
            isInline={false}
            isDisabled={false}
            name={"withdrawForeignGiftsConfirmationOption"}
            label={"Please confirm if you want to withdraw the foreign gift?"}
            validationMessage={state.withdrawConfirmationErrorMessage}
            onChange={handleWithdrawConfirmChange}
            isRequired={true}
            isInvalid={state.withdrawConfirmationInvalid}
          />
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSTextArea
            id={"withdrawalReason"}
            name={"withdrawalReason"}
            label={"Withdrawal Reason"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={state.withdrawalReason}
            onChange={handleWithdrawalReasonChange}
            validationMessage={state.withdrawalReasonErrorMessage}
            isInvalid={state.withdrawalReasonInvalid}
            isValid={false}
          />
        </div>
      </div>
    </div>
  );
};
