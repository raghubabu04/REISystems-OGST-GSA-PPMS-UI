import React from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";

interface FleetButtonsProps {
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: any;
}

export function FleetButtons(props: FleetButtonsProps) {
  return (
    <>
      <div className="grid-row grid-gap-4">
        <div className="grid-row-col">
          <PPMSButton
            variant={"primary"}
            type={"submit"}
            value={"submit"}
            label={"Submit"}
            isDisabled={props.isSubmitDisabled}
            isLoading={props.isSubmitLoading}
            id={"reporting-3040-submit"}
          />
        </div>
        <div className="grid-row-col ">
          <PPMSButton
            variant={"primary"}
            type={"reset"}
            label={"Cancel"}
            onPress={props.cancelFunction}
            id={"reporting-3040-cancel"}
            className={"out-button"}
          />
        </div>
      </div>
    </>
  );
}
