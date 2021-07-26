import React, { useState } from "react";
import { PPMSTextArea } from "../common/input/PPMS-textarea";
import { PPMSModal } from "../common/PPMS-modal";

export interface Props {
  requestedItemId?: any;
  icn?: string;
  icnStatus?: any;
  denyIcnAllocation?: any;
  showDenyAllocationModal: boolean;
  handleDenyAllocationClose?: any;
  setShowDenyAllocation: any;
  enableAllocateButton: any;
}

export const DenyAllocationModal = (props: Props) => {
  const [denyAllocationReason, setDenyAllocationReason] = useState("");
  const [savedReason, setSavedReason] = useState("");
  const [lengthReason, setLengthReason] = useState(100);

  const handleDenyReasonTextChange = (event) => {
    event.preventDefault();
    let reasonLength: number = 0;
    const reasonMaxLength: number = 100;
    reasonLength = reasonMaxLength - event.target.value.length;
    setLengthReason(reasonLength);
    setDenyAllocationReason(event.target.value);
  };

  const onCickSave = () => {
    setSavedReason(denyAllocationReason);
    props.denyIcnAllocation(denyAllocationReason);
    props.enableAllocateButton(false);
  };

  const onClickCancel = () => {
    props.handleDenyAllocationClose();
    setLengthReason(100 - savedReason.length + 1);
    setDenyAllocationReason(savedReason);
  };

  return (
    <PPMSModal
      show={props.showDenyAllocationModal}
      handleClose={onClickCancel}
      handleSave={onCickSave}
      title={"Denial Reason"}
      centered={true}
      backdrop={"static"}
      label={"Save"}
      labelCancel={"Cancel"}
      body={
        <ModalDenyAllocation
          handleDenyReasonTextChange={handleDenyReasonTextChange}
          denyAllocationReason={denyAllocationReason}
          lengthReason={lengthReason}
        />
      }
      id={"delete-files"}
    />
  );
};

const ModalDenyAllocation = ({
  handleDenyReasonTextChange,
  denyAllocationReason,
  lengthReason,
}) => {
  return (
    <div>
      <div>
        <PPMSTextArea
          isInvalid={false}
          isValid={false}
          id={"deny-icn-allocation"}
          isRequired={true}
          isDisabled={false}
          inputType={"text"}
          label={"Reason for Denial"}
          onChange={handleDenyReasonTextChange}
          value={denyAllocationReason}
          validationMessage={"Please do enter reason"}
          maxLength={100}
        />
        <span>
          <strong>{lengthReason}</strong> Characters left
        </span>
      </div>
    </div>
  );
};
