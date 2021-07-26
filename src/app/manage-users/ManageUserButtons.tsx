import React from "react";
import { PPMSButton } from "../../ui-kit/components/common/PPMS-button";
import { PPMSSubmit } from "../../ui-kit/components/PPMS-submit";

interface ManageUserButtonsProps {
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
}

export default function ManageUserButtons(
  props: ManageUserButtonsProps
) {
  return (
    <>
      <div className={"grid-col-auto"}>
        <PPMSSubmit
          variant={"primary"}
          disabled={props.isSubmitDisabled}
          isLoading={props.isSubmitLoading}
        />
      </div>
      <div className={"grid-col-auto"}>
        <PPMSButton
          variant={"primary"}
          type={"reset"}
          label={"Cancel"}
          onPress={props.cancelFunction}
          id={"cancel"}
        />
      </div>
    </>
  );
}
