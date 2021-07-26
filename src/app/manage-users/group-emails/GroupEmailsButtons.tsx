import React from "react";
import {PPMSSubmit} from "../../../ui-kit/components/PPMS-submit";
import {PPMSButton} from "../../../ui-kit/components/common/PPMS-button";

interface GroupEmailsButtonsProps {
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
}

export default function GroupEmailsButtons(
  props: GroupEmailsButtonsProps
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
