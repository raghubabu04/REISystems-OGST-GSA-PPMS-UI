import React from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSSubmit } from "../../../ui-kit/components/PPMS-submit";

interface UserProfileForSalesUserButtonsProps {
    isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  onCancelClick: () => void;
  id?: string;
  cancelId?: string
}

export default function UserProfileForSalesUserButtons(props: UserProfileForSalesUserButtonsProps) {
    return (
        <React.Fragment>
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
                      onPress={props.onCancelClick}
                      id={props.cancelId}
                    />
                </div>
            </React.Fragment>
        );
}