import React, { useEffect, useMemo, useState } from "react";
import { PPMSTextEditor } from "../../../../ui-kit/components/common/PPMS-texteditor";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSSalesActionList } from "../../../../ui-kit/components/sales/PPMS-sales-action-list";
import { RefundNotesState, RefundNotesStateDefault } from "./RefundNotesState";
import { validateSalesNotes } from "../../../property/create-update-property/validations/propertyFieldValidations";

interface RefundNotesProps {
  actionHistorydata?: any;
  currentNotesData?: any;
  resetNotes?: boolean;
}

export function RefundNotesClass(props: RefundNotesProps) {
  const { resetNotes } = props;
  const [refundNotesState, setRefundNotesSate] = useState<RefundNotesState>(
    RefundNotesStateDefault
  );
  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [refundNotesState]);

  useEffect(() => {
    setRefundNotesSate({
      actionHistoryData: props.actionHistorydata,
    });
  }, [props.actionHistorydata]);

  useEffect(() => {
    setRefundNotesSate({
      refundNotes: "",
      refundNotesIsValid: false,
      refundNotesIsInvalid: false,
      refundNotesErrorMsg: "Refund Notes is Required.",
      validationMessage: "",
      isValid: true,
      isInvalid: false,
      triggerValidation: false,
      actionHistoryData: props.actionHistorydata,
    });
  }, [resetNotes]);

  function handleSalesNotesDescriptionChange() {
    let validation = validateSalesNotes(refundNotesState.refundNotes);
    let refundDetails: RefundNotesState = {
      refundNotesIsInvalid: validation.isInvalid,
      refundNotesErrorMsg: validation.validationError,
    };
    setRefundNotesSate(refundDetails);
  }

  function validateForm() {}

  const ModalActionHistoryContent = ({ data, listID, title }) => {
    return (
      <div className={"action-history-container"}>
        <PPMSSalesActionList data={data} listID={listID} />
      </div>
    );
  };

  function showActionHistoryForSalesNotes() {
    if (refundNotesState.actionHistoryData?.length > 0) {
      return (
        <>
          <br />
          <ModalActionHistoryContent
            data={refundNotesState.actionHistoryData}
            listID={"list-id"}
            title={"Refund Notes"}
          />
        </>
      );
    }
  }

  return useMemo(() => {
    return (
      <>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSTextEditor
              id={"refundNotes"}
              value={refundNotesState.refundNotes}
              onChange={(notesData: any) => {
                setRefundNotesSate({
                  ...refundNotesState,
                  refundNotes: notesData,
                });
                props.currentNotesData(notesData);
              }}
              onBlur={() => {}}
              label={"Notes"}
              isInvalid={refundNotesState.refundNotesIsInvalid}
              isValid={false}
              isRequired={false}
              validationMessage={refundNotesState.refundNotesErrorMsg}
              onBlurCheck={true}
            />
          </div>
        </div>
        {showActionHistoryForSalesNotes()}
      </>
    );
  }, [refundNotesState, refundNotesState.actionHistoryData]);
}
