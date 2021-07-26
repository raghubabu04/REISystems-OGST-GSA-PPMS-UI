import React from "react";
import {PPMSButton} from "../../ui-kit/components/common/PPMS-button";
import {PPMSSubmit} from "../../ui-kit/components/PPMS-submit";

interface InternalAgencyButtonProps {
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
  id?: string;
  cancelId?: string
}

export default function InternalAgencyButtons(
  props: InternalAgencyButtonProps
) {
  return (
    <>
      <div className={"grid-col-auto"}>
        <PPMSSubmit
          variant={"primary"}
          disabled={props.isSubmitDisabled}
          isLoading={props.isSubmitLoading}
          id={props.id}
        />
      </div>
      <div className={"grid-col-auto"}>
        <PPMSButton
          variant={"primary"}
          type={"reset"}
          label={"Cancel"}
          onPress={props.cancelFunction}
          id={props.cancelId}
        />
      </div>
    </>
  );
}
