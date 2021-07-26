import React, { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import {
  nonReportedRecallReason,
  recallAdditionalReasons,
  recallReason,
} from "../../../app/property/create-update-property/constants/Constants";
import PPMSCardFooter from "../common/card/PPMS-card-footer";
import PPMSErrorMessage from "../common/form/PPMS-error-message";
import { PPMSInput } from "../common/input/PPMS-input";
import { PPMSTextArea } from "../common/input/PPMS-textarea";
import { PPMSButton } from "../common/PPMS-button";
import { PPMSModal } from "../common/PPMS-modal";
import { PPMSTooltip } from "../common/PPMS-tooltip";
import { PPMSSelect } from "../common/select/PPMS-select";

export interface completeTransferFooterProps {
  transferredQty?: number;
  errorMessage?: string;
  qtyerror?: boolean;
  onRecall?: any;
  recallReason?: string;
  additionalReason?: string;
  checkReason?: boolean;
  nonReported?: boolean;
}
export const CompleteTransferFooter = (props: completeTransferFooterProps) => {
  const [recallReasonValue, setRecallReasonValue] = useState(
    props.recallReason
  );
  const [buttonLabel, setButtonLabel] = useState("Recall");
  const [inputQty, setInputQty] = useState(props.transferredQty);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState(props.additionalReason);
  const [otherInfo, setOtherInfo] = useState("");
  const [checkReason, setCheckReason] = useState(props.checkReason);
  const [invalidReason, setInvalidReason] = useState(false);
  const [validationReason, setValidationReason] = useState("");
  const [isQtyChanged, setIsQtyChanged] = useState(false);
  const qtyChange = (event) => {
    setInputQty(event.target.value);
    setIsQtyChanged(true);
  };
  const recallReasonChange = (event) => {
    setRecallReasonValue(event.target.value);
    setCheckReason(true);
    setIsQtyChanged(false);
  };

  useEffect(() => {
    if (
      (recallReasonValue === "Shortage/Partial Recall" ||
        recallReasonValue === "Complete Recall") &&
      checkReason
    ) {
      if (!isQtyChanged) {
        setShowModal(true);
      }
      setButtonLabel("Recall");
    } else if (
      recallReasonValue === "Overage" &&
      inputQty > props.transferredQty
    ) {
      setButtonLabel("Updated Transfer Quantity");
      setReason("");
    } else {
      setButtonLabel("Recall");
    }
  }, [recallReasonValue, buttonLabel, inputQty]);

  const handleClose = () => {
    setReason(null);
    setShowModal(false);
  };

  const reasonChange = (event) => {
    setReason(event.target.value);
    setInvalidReason(false);
  };

  const otherInfoChange = (event) => {
    setOtherInfo(event.target.value);
  };

  const handleSave = () => {
    if (reason === "" || reason === null) {
      setInvalidReason(true);
      setValidationReason("Please select a reason.");
      setShowModal(true);
    } else if (reason === "Other") {
      setReason(`${reason}: ${otherInfo}`);
      setShowModal(false);
    } else {
      setShowModal(false);
    }
  };

  const onRecall = () => {
    props.onRecall(recallReasonValue, reason, inputQty);
  };

  return (
    <>
      <PPMSCardFooter>
        <div className="grid-container item-search-result-input">
          <div className="grid-row tablet:grid-gap-3">
            <div className={"grid-col-auto margin-top-05 cart-row"}>
              <PPMSInput
                isDisabled={false}
                id={"complete-qty-input"}
                name={"complete-qty-input"}
                isInvalid={false}
                isValid={false}
                isRequired={true}
                value={inputQty}
                onChange={qtyChange}
                inputType={"number"}
                className={"property-select"}
                min={0}
              />
              <div className={"grid-row grid-gap-4"}>
                <div className="grid-row-col-2">
                  <PPMSSelect
                    values={
                      props.nonReported ? nonReportedRecallReason : recallReason
                    }
                    isRequired={true}
                    placeholderValue={"Select Value"}
                    identifierKey={"value"}
                    identifierValue={"value"}
                    label={"Recall Reason"}
                    id={"recall reason"}
                    onChange={recallReasonChange}
                    selectedValue={recallReasonValue}
                  />
                </div>
                {props.nonReported ? (
                  <div className="grid-row-col-2">
                    <PPMSSelect
                      values={recallAdditionalReasons}
                      isRequired={true}
                      placeholderValue={"Select Value"}
                      identifierKey={"value"}
                      identifierValue={"value"}
                      label={"Recall Additional Reason"}
                      id={"recallAdditionalReason"}
                      onChange={reasonChange}
                      isInvalid={invalidReason}
                      disabled={false}
                      validationMessage={validationReason}
                      selectedValue={reason}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {reason ? (
                <PPMSTooltip
                  trigger={"focus"}
                  id={"other-info"}
                  placement={"right"}
                  tooltipContent={reason}
                  triggerSource={
                    <button
                      id={`other-info-button`}
                      type={"button"}
                      className={
                        "usa-button usa-button--unstyled other-info-button"
                      }
                      title="Additional Information"
                    >
                      <CgNotes />
                    </button>
                  }
                />
              ) : (
                <> </>
              )}
              <div className="grid-row-col-2">
                <PPMSButton
                  id={"complete-quantity"}
                  label={buttonLabel}
                  variant={"primary"}
                  onPress={onRecall}
                  isDisabled={false}
                  className={"property-select"}
                />
              </div>
            </div>
          </div>
          {reason === "Other" ? (
            <div>
              <PPMSTextArea
                isInvalid={false}
                isValid={false}
                id={"recall-other-reason"}
                isRequired={true}
                isDisabled={false}
                inputType={"text"}
                label={""}
                onChange={otherInfoChange}
                value={otherInfo}
                validationMessage={"Please do enter reason"}
                maxLength={50}
                defaultValue={reason}
              />
              <span>
                <strong>50</strong> max limit
              </span>
            </div>
          ) : (
            <> </>
          )}
        </div>
        <div className="grid-row tablet:grid-gap-3">
          {!props.qtyerror ? (
            <PPMSErrorMessage id={"quantity-error"}>
              {props.errorMessage}
            </PPMSErrorMessage>
          ) : (
            <></>
          )}
        </div>
      </PPMSCardFooter>
      {!props.nonReported ? (
        <div className="grid-row grid-gap-4">
          <PPMSModal
            show={showModal}
            handleClose={handleClose}
            handleSave={handleSave}
            title={"Additional Information"}
            centered={true}
            backdrop={"static"}
            label={"Save"}
            labelCancel={"Cancel"}
            body={
              <ModalContent
                reason={reason}
                otherInfoChange={otherInfoChange}
                reasonChange={reasonChange}
                otherInfo={otherInfo}
                invalidReason={invalidReason}
                validationReason={validationReason}
              />
            }
            id={"recall-reason-additional-modal"}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const ModalContent = ({
  reason,
  otherInfoChange,
  reasonChange,
  otherInfo,
  invalidReason,
  validationReason,
}) => {
  return (
    <div>
      <PPMSSelect
        values={recallAdditionalReasons}
        isRequired={true}
        placeholderValue={"Select Value"}
        identifierKey={"value"}
        identifierValue={"value"}
        label={"Recall Additional Reason"}
        id={"recall additional reason"}
        onChange={reasonChange}
        isInvalid={invalidReason}
        validationMessage={validationReason}
      />
      {reason === "Other" ? (
        <div>
          <PPMSTextArea
            isInvalid={false}
            isValid={false}
            id={"recall-other-reason"}
            isRequired={true}
            isDisabled={false}
            inputType={"text"}
            label={""}
            onChange={otherInfoChange}
            value={otherInfo}
            validationMessage={"Please do enter reason"}
            maxLength={50}
            defaultValue={reason}
          />
          <span>
            <strong>50</strong> max limit
          </span>
        </div>
      ) : (
        <> </>
      )}
    </div>
  );
};
