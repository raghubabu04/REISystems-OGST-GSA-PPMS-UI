import React from "react";
import {PPMSButton} from "../../../../ui-kit/components/common/PPMS-button";
import {CgRemove} from "react-icons/cg";

interface SalesTransactionButtonProps {
  saveFunction: () => void;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  isDeleteDisabled?: boolean;
  showActionHistory?: boolean;
  cancelFunction?: () => void;
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
  saveId: string;
  clearId: string;
}

export default function SalesTransactionButtons(
  props: SalesTransactionButtonProps
) {
  const { action } = props;
  return (
    <>
      <div className={"grid-col-auto"}>
        {props.roles.isSCO &&
          (props.salesSCO === props.userEmail ||
            props.alternateSCO === props.userEmail) && (
            <PPMSButton
              variant={"primary"}
              type={"button"}
              label={props.saveSubmitBtnLabel}
              onPress={props.saveFunction}
              id={props.saveId}
              isDisabled={
                props.saveSubmitBtnLabel === "Save"
                  ? false
                  : props.isSubmitDisabled
              }
            />
          )}
        {props.salesId &&
          props.roles.isSCO &&
          (props.salesSCO === props.userEmail ||
            props.alternateSCO === props.userEmail) && (
            <PPMSButton
              id={"delete-property"}
              label={"Delete"}
              className={"delete-property d-inline"}
              variant={"link"}
              icon={<CgRemove />}
              onPress={props.cancelFunction}
              //isDisabled={props.isDeleteDisabled}
            />
          )}
      </div>
      <div className={"grid-col-auto"}>
        {props.salesId && props.showActionHistory && (
          <PPMSButton
            className={"out-button"}
            type={"button"}
            value={""}
            label={"Action History"}
            onPress={props.actionHistoryFunction}
            id={"action-history-sales"}
          />
        )}
        {!props.salesId && props.roles.isSCO && (
          <PPMSButton
            variant={"primary"}
            type={"reset"}
            label={"Clear Form"}
            onPress={props.clearFunction}
            id={props.clearId}
            // isDisabled={props.clearDisabled}
          />
        )}
      </div>
    </>
  );
}
