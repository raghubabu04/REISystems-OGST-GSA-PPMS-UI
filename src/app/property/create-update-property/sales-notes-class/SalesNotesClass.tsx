import React, { useContext, useEffect, useMemo } from "react";
import { PPMSTextEditor } from "../../../../ui-kit/components/common/PPMS-texteditor";
import { validateSalesNotes } from "../validations/propertyFieldValidations";
import { PropertyContext } from "../PropertyContext";
import { isFormSubmitted } from "../../../../service/validation.service";
import { PPMSSalesActionList } from "../../../../ui-kit/components/sales/PPMS-sales-action-list";

interface SalesNotesProps {
  propertyId?: number;
}

export function SalesNotesClass(props: SalesNotesProps) {
  const {
    salesNotesState,
    updateSalesNotesState,
    propertyReportState,
  } = useContext(PropertyContext);

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
  }, [salesNotesState]);

  function handleSalesNotesDescriptionChange() {
    let validation = validateSalesNotes(salesNotesState.salesNotes);
    updateSalesNotesState({
      salesNotesIsInvalid: validation.isInvalid,
      salesNotesErrorMsg: validation.validationError,
    });
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
    if (salesNotesState.actionHistoryData.length > 0) {
      return (
        <>
          <br />
          <ModalActionHistoryContent
            data={salesNotesState.actionHistoryData}
            listID={"list-id"}
            title={propertyReportState.propertyData?.itemControlNumber}
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
              id={"salesNotes"}
              value={salesNotesState.salesNotes}
              onChange={(notesData: any) => {
                updateSalesNotesState({ salesNotes: notesData });
              }}
              onBlur={handleSalesNotesDescriptionChange}
              label={"Sales Notes"}
              isInvalid={salesNotesState.salesNotesIsInvalid}
              isValid={false}
              isRequired={false}
              validationMessage={salesNotesState.salesNotesErrorMsg}
              onBlurCheck={true}
            />
          </div>
        </div>
        {showActionHistoryForSalesNotes()}
      </>
    );
  }, [salesNotesState, salesNotesState.actionHistoryData]);
}
