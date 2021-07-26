import React from "react";
import { PPMSButton } from "../../../ui-kit/components/common/PPMS-button";
import { PPMSSubmit } from "../../../ui-kit/components/PPMS-submit";

interface PropertyReportButtonProps {
  saveFunction: () => void;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  cancelFunction: () => void;
  workflow?: any;
  saveId?: string;
  cancelId?: string;
  approveId?: string;
  isSaveAndReportDisplayed: boolean;
  saveAndReportAgainId?: string;
  saveAndReportAgain?: any;
}

export default function PropertyReportButtons(
  props: PropertyReportButtonProps
) {
  return (
    <>
      <div className={"margin-right-auto col-md-auto"}>
        <ul className="usa-button-group usa-button-group--segmented">
          <li className="usa-button-group__item ">
            <PPMSButton
              variant={"primary"}
              type={"button"}
              value={""}
              label={"Save"}
              onPress={props.saveFunction}
              id={props.saveId}
              className={"out-button"}
            />
          </li>
          {props.workflow === "APPROVE_FOREIGN_GIFT" ? (
            <li className="usa-button-group__item">
              <PPMSButton
                variant={"primary"}
                type={"submit"}
                value={"submit"}
                label={"Approve"}
                isDisabled={props.isSubmitDisabled}
                isLoading={props.isSubmitLoading}
                id={props.approveId}
              />
            </li>
          ) : (
            <li className="usa-button-group__item">
              <PPMSButton
                variant={"primary"}
                type={"submit"}
                label={"Submit"}
                className={"out-button"}
                isDisabled={props.isSubmitDisabled}
                isLoading={props.isSubmitLoading}
                id={"property-submit"}
              />
            </li>
          )}
          <li className="usa-button-group__item">
            <PPMSButton
              variant={"primary"}
              type={"reset"}
              label={"Cancel"}
              onPress={props.cancelFunction}
              id={props.cancelId}
              className={"out-button"}
            />
          </li>
        </ul>
      </div>
      {props.isSaveAndReportDisplayed ? (
      <div className="grid-col align-self-right submit-report-padding">
        <PPMSButton
          variant={"primary"}
          type={"submit"}
          label={"Submit/Report Similar"}
          onPress={props.saveAndReportAgain}
          id={props.saveAndReportAgainId}
          className={"out-button"}
        />
      </div>
      ) : ""}
    </>
  );
}
