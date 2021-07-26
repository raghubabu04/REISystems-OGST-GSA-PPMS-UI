import React from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";

interface BidderButtonProps {
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
  submitLabel?: string;
}

export default function BidderButtons(props: BidderButtonProps) {
  return (
    <>
      <div className={"grid-col-auto"}>
        <PPMSButton
          variant={"primary"}
          type={"submit"}
          label={props.submitLabel ? props.submitLabel : "Submit"}
          isDisabled={props.isSubmitDisabled}
          id={"bidder-registration-submit"}
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
