import React, { useMemo, useState } from "react";
import { PPMSTextArea } from "../../../../../ui-kit/components/common/input/PPMS-textarea";

import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { isEmptyCheck } from "../../../../../ui-kit/components/validations/FieldValidations";

import { terminateAuctionReasonOptions } from "../Constants";

interface AddBidderModalProps {
  lotNumbers: string[];
  showModal: boolean;
  handleTermination: any;
  handleCancelTermination: any;
}

const TerminateAuctionModal = (props: AddBidderModalProps) => {
  const { showModal, handleCancelTermination, handleTermination } = props;

  const [terminationReason, setTerminationReason] = useState<String>("");

  const [otherReasonText, setOtherReasonText] = useState<String>("");

  const [otherReasonTextDisplay, setOtherReasonTextDisplay] = useState<String>(
    "ppms-display-none"
  );

  const [terminationReasonInvalid, setTerminationReasonInvalid] = useState(
    false
  );

  const [otherReasonTextInValid, setOtherReasonTextInValid] = useState(false);

  const [options, setOptions] = useState(terminateAuctionReasonOptions);

  function handleSaveModal(): void {
    if (!isEmptyCheck(terminationReason)) {
      if (terminationReason === "other" && isEmptyCheck(otherReasonText))
        setOtherReasonTextInValid(true);
      else handleTermination(terminationReason, otherReasonText);
    } else {
      setTerminationReasonInvalid(true);
    }
  }

  function handleCloseModal(): void {
    terminateAuctionReasonOptions.forEach((option) => {
      option.isSelected = false;
    });
    setOptions(terminateAuctionReasonOptions);
    handleCancelTermination();
    setTerminationReasonInvalid(false);
    setOtherReasonTextDisplay("ppms-display-none");
  }

  function handleTerminationReasonChange(items): void {
    const selectedItem = items.filter((item) => item.isSelected === true);
    if (selectedItem.length > 0) {
      let value = selectedItem[0].id;
      if (value === "other") {
        setOtherReasonTextDisplay("ppms-display-block");
      }
      setTerminationReason(value);
      setTerminationReasonInvalid(false);
    }
  }

  function handleOtherReasonTextChange(event: any) {
    let value = event.currentTarget.value;
    setOtherReasonText(value);
    setOtherReasonTextInValid(false);
  }

  return (
    <div>
      <PPMSModal
        show={showModal}
        handleClose={() => handleCloseModal()}
        handleSave={() => handleSaveModal()}
        title={"Provide Termination Reason"}
        centered={true}
        backdrop={"static"}
        label={"Submit"}
        labelCancel={"Cancel"}
        body={
          <TerminationReasonModalContent
            lotNumbers={props.lotNumbers}
            terminationReasonInvalid={terminationReasonInvalid}
            terminateAuctionReasonOptions={options}
            otherReasonText={otherReasonText}
            otherReasonTextDisplay={otherReasonTextDisplay}
            otherReasonTextIsValid={otherReasonTextInValid}
            handleTerminationReasonChange={handleTerminationReasonChange}
            handleOtherReasonTextChange={handleOtherReasonTextChange}
          />
        }
        id={"terminate-auction-modal-window"}
        size={"lg"}
      />
    </div>
  );
};

const TerminationReasonModalContent = ({
  lotNumbers,
  terminateAuctionReasonOptions,
  terminationReasonInvalid,
  otherReasonText,
  otherReasonTextIsValid,
  otherReasonTextDisplay,
  handleTerminationReasonChange,
  handleOtherReasonTextChange,
}) => {
  return (
    <div>
      <div className="grid-conatiner ui-ppms">
        <div className={"grid-row grid-gap"}>
          <div className={"grid-col-12"}>
            <PPMSToggleRadio
              id={"termiateLotReason"}
              options={terminateAuctionReasonOptions}
              isInline={false}
              isDisabled={false}
              name={"termiateLotReason"}
              className={"termiateLotReason"}
              label={`Terminations of lots : ${lotNumbers}`}
              validationMessage={
                "Please select atleaset one termination reason"
              }
              onChange={handleTerminationReasonChange}
              isInvalid={terminationReasonInvalid}
              isRequired={true}
            />
          </div>
        </div>
        <div className={"grid-row"}>
          <div className={"grid-col"}>
            <PPMSTextArea
              id={"otherReasonText"}
              name={"otherReasonText"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={otherReasonText}
              onChange={handleOtherReasonTextChange}
              className={otherReasonTextDisplay}
              validationMessage={"Please enter a valid reason"}
              isInvalid={otherReasonTextIsValid}
              isValid={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TerminateAuctionModal;
