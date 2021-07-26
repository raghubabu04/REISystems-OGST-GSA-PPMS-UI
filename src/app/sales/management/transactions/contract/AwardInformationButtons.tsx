import React from "react";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";

interface AwardInformationButtonsProps {
  voidFunction1?: () => void;
  defaultFunction?: () => void;
  cancelFunction?: () => void;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  isDeleteDisabled?: boolean;
  showActionHistory?: boolean;
  clearFunction?: () => void;
  actionHistoryFunction: () => void;
  clearDisabled?: boolean;
  saveSubmitBtnLabel?: string;
  action?: string;
  salesId?: any;
  roles?: any;
  salesSCO?: any;
  userEmail?: any;
  alternateSCO?: any;
  handleEditAwardInformation?: any;
  auctionId?: any;
}

export default function AwardInformationButtons(
  props: AwardInformationButtonsProps
) {
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"d-flex justify-content-center grid-col"}>
          <ul className="usa-button-group usa-button-group--segmented">
            <li className="usa-button-group__item">
              <PPMSButton
                type={"button"}
                className={""}
                label={"Edit/View Award Information"}
                onPress={props.handleEditAwardInformation}
                id={"cancel"}
                isDisabled={props.auctionId ? false : true}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
