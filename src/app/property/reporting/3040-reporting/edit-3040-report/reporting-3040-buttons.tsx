import React from "react";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

interface Reporting3040Buttons {
  saveFunction: any;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  approveEnabled: boolean;
  cancelFunction: any;
}

export function ReportingButtons(props: Reporting3040Buttons) {
  return (
    <>
      <div className="grid-row">
        <div className="grid-row-col">
          <PPMSButton
            variant={"primary"}
            type={"button"}
            value={""}
            label={"Save"}
            onPress={props.saveFunction}
            id={"reporting-3040-save"}
            className={"out-button"}
          />
        </div>
        <div className="grid-row-col">
        <PPMSButton
                variant={"primary"}
                type={"submit"}
                value={"submit"}
                label={props.approveEnabled ? "Approve":"Submit"}
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
