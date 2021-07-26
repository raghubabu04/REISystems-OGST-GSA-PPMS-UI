import React from "react";
import {PPMSButton} from "../../../../ui-kit/components/common/PPMS-button";
import {PPMSSubmit} from "../../../../ui-kit/components/PPMS-submit";

interface MarketingCampaignButtonProps {
  saveFunction: () => void;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
  cancelId?: string;
  saveId?: string
}

export default function MarketingCampaignButtons(
  props: MarketingCampaignButtonProps
) {
  return (
    <>
      <div className={"grid-col-auto"}>
        <PPMSButton
          variant={"primary"}
          type={"button"}
          value={""}
          label={"Save"}
          onPress={props.saveFunction}
          id={props.saveId}
          isDisabled={props.isSubmitDisabled}
        />
      </div>
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
          id={props.cancelId}
        />
      </div>
    </>
  );
}
