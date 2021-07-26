import React from "react";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSToggleRadio } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

export const RejectForeignGiftsConfirmationModal = ({
  state,
  handleRejectConfirmChange,
  rejectOptions,
  handleRejectReasonChange,
}) => {
  return (
    <div className={"reject-property-confirmation"}>
      <div className={"grid-row grid-gap"}>
        <div className={"grid-col-12"}>
          <PPMSToggleRadio
            id={"rejectForeignGiftsConfirmationOption"}
            options={rejectOptions}
            isInline={false}
            isDisabled={false}
            name={"rejectForeignGiftsConfirmationOption"}
            label={
              state.sourceName === "Reject"
                ? "Please confirm if you want to reject the record?"
                : state.sourceName === "Destroy"
                ? "Please confirm if you want to mark this foreign gift as destroyed"
                : "Do you want to recall the Foreign Gifts?"
            }
            validationMessage={state.rejectConfirmationErrorMessage}
            onChange={handleRejectConfirmChange}
            isRequired={true}
            isInvalid={state.withdrawConfirmationInvalid}
          />
        </div>
      </div>
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSTextArea
            id={"rejectReason"}
            name={"rejectReason"}
            label={state.sourceName + " Reason"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            value={state.rejectReason}
            onChange={handleRejectReasonChange}
            validationMessage={state.rejectReasonErrorMessage}
            isInvalid={state.rejectReasonInvalid}
            isValid={false}
          />
        </div>
      </div>
    </div>
  );
};
