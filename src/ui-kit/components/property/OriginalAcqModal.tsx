import React, { useState } from "react";
import { PageUtils } from "../../../utils/PageUtils";
import { PPMSInput } from "../common/input/PPMS-input";
import { PPMSTextArea } from "../common/input/PPMS-textarea";
import { PPMSModal } from "../common/PPMS-modal";

export interface OrgAcqProps {
  showOrgAcqModal: boolean;
  closeOrgAcqModal: any;
  originalAcqCost: any;
  saveOrgAcqCost: any;
}

export const OriginalAcqModal = (props: OrgAcqProps) => {
  const [newOAC, setNewOAC] = useState("");
  const [reasonOAC, setReasonOAC] = useState("");
  const onCancel = () => {
    props.closeOrgAcqModal();
    setNewOAC("");
    setReasonOAC("");
  };
  const onSave = () => {
    props.saveOrgAcqCost(newOAC, reasonOAC);
    props.closeOrgAcqModal();
  };
  const handleOACChange = (event) => {
    let originalAcqCost = event.target.value
      .replace(/([^.]*\.[^.]*)\./g, "$1")
      .replace(/(?:[.](?=.*[.])|[^\d.])+/g, "")
      .toString();

    originalAcqCost = originalAcqCost.replace(/^[0]+$/, "");

    if (/^\d+\.\d\d\d$/.test(originalAcqCost)) {
      originalAcqCost = Number(originalAcqCost).toFixed(2);
    }

    originalAcqCost =
      "$" +
      originalAcqCost
        .toString()
        // .replace(/([^.]*\.[^.]*)\./g, '$1')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace("$", "")
        .replace(/,/g, "");
    setNewOAC(originalAcqCost);
    console.log({ newOAC });
  };
  const handleOACReason = (event) => {
    setReasonOAC(event.target.value);
  };
  return (
    <PPMSModal
      show={props.showOrgAcqModal}
      handleClose={onCancel}
      handleSave={onSave}
      title={"Update Original Acquisition Cost"}
      centered={true}
      backdrop={"static"}
      label={"Save"}
      labelCancel={"Cancel"}
      body={
        <ModalOrgAcq
          originalAcqCost={props.originalAcqCost}
          handleOACChange={handleOACChange}
          handleOACReason={handleOACReason}
          newOAC={newOAC}
          reasonOAC={reasonOAC}
        />
      }
      id={"org-acq-edit"}
    />
  );
};
const ModalOrgAcq = ({
  originalAcqCost,
  handleOACChange,
  newOAC,
  handleOACReason,
  reasonOAC,
}) => {
  return (
    <div>
      <PPMSInput
        id={"current-oac"}
        label={"Current OAC"}
        value={PageUtils.getFormattedCurrency(originalAcqCost)}
        inputType={"text"}
        isDisabled={true}
        isRequired={true}
      />
      <PPMSInput
        id={"new-oac"}
        label={"New OAC"}
        value={newOAC}
        inputType={"text"}
        isDisabled={false}
        onChange={(event) => {
          handleOACChange(event);
        }}
        isRequired={true}
        placeHolder="$0.00"
        maxLength={20}
        minLength={2}
      />
      <PPMSTextArea
        isInvalid={false}
        isValid={false}
        id={"org-acq-reason"}
        isRequired={false}
        isDisabled={false}
        inputType={"text"}
        label={"Reason for Update"}
        onChange={(event) => {
          handleOACReason(event);
        }}
        value={reasonOAC}
        maxLength={30}
      />
      <span>
        <strong>{30}</strong> max length
      </span>
    </div>
  );
};
