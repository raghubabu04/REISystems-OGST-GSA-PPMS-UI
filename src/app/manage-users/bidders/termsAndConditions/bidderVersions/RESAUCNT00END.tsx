import React, { useEffect } from "react";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../../../Router";

interface Props {
  isNextClicked?: any;
}
export function RESAUCNT00END(props: Props) {
  function onClickNext() {
    props.isNextClicked(true);
  }
  function onClickCancel() {
    PageHelper.openPage(Paths.login);
    window.location.reload();
  }
  return (
    <div className="terms-and-conditions-btn">
      <div className="grid-row grid-gap-1">
        <div className={"grid-col-auto"}>
          <PPMSButton
            variant={"primary"}
            type={"reset"}
            label={"Cancel"}
            onPress={onClickCancel}
            id={"cancel"}
          />
        </div>

        <div className={"grid-col-auto"}>
          <PPMSButton
            variant={"primary"}
            type={"button"}
            label={"Continue"}
            isDisabled={false}
            onPress={onClickNext}
            id={"bidder-terms-conditions-continue"}
          />
        </div>
      </div>
    </div>
  )
}
