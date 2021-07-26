import React from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSSubmit } from "../../../ui-kit/components/PPMS-submit";

interface NonReportedTransferButtonsProps {
  submitReport: any;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
}

export default function NonReportedTransferButtons(
  props: NonReportedTransferButtonsProps
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
      <div className={"grid-col-auto"}>
        <PPMSButton
          variant={"primary"}
          type={"button"}
          value={""}
          label={"Submit & Report Again"}
          onPress={props.submitReport}
          id={"save"}
          isDisabled={props.isSubmitDisabled}
        />
      </div>
    </>
  );
}
