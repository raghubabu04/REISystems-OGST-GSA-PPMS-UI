import React from "react";
import {BidderRemarksActionList} from "./BidderRemarksActionList";

export function validateBidderRemarksNotes(remarksNotes) {
  let validation = {
    isInvalid: false,
    validationError: "",
    remarksNotes
  };

  remarksNotes = remarksNotes?.replace(/(<([^>]+)>)/g, "");
  remarksNotes = remarksNotes?.replace("'", ".");
  remarksNotes = remarksNotes?.replace(/&nbsp;/gi, " ");
  remarksNotes = remarksNotes?.replace(/&amp;/gi, "&");
  validation.remarksNotes = remarksNotes;

  if (remarksNotes?.length > 1 && remarksNotes?.length < 25) {
    validation.isInvalid = true;
    validation.validationError = "Remarks must be 25 characters or longer";
    return validation;
  }

  if (remarksNotes?.length > 500) {
    validation.isInvalid = true;
    validation.validationError =
      "Remarks must be shorter than 500 characters";
    return validation;
  }
  return validation;
}

export const ModalActionHistoryContent = ({data, listID, title}) => {
  return (
    <div className={"action-history-container"}>
      <BidderRemarksActionList data={data} listID={listID} title={title}/>
    </div>
  );
};
