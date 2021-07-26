import React from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSSubmit } from "../../../../ui-kit/components/PPMS-submit";

interface WantListButtonProps {
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
}

export default function WantListButtons(props: WantListButtonProps) {
  return (
    <>
      <div className={"grid-col-auto"}>
        <PPMSSubmit
          variant={"primary"}
          id={"submit-button"}
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
