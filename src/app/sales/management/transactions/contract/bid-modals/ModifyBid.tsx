import React, { useEffect, useState } from "react";
import { PPMSModal } from "../../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSInput } from "../../../../../../ui-kit/components/common/input/PPMS-input";
import {
  currencyToNumber,
  formatCurrency,
} from "../../../../../../ui-kit/utilities/FormatUtil";

interface ModifyBidProps {
  showModal: boolean;
  closeModal: any;
  saveModal: any;
  bidId: number;
  bidderName: string;
  bidAmount: number;
}

const ModifyBid = (props: ModifyBidProps) => {
  const {
    showModal,
    closeModal,
    saveModal,
    bidId,
    bidderName,
    bidAmount,
  } = props;
  const [isSaveDisabled, setSaveDisabled] = useState(true);
  const [reason, updateReason] = useState("");
  const [alternateAmount, updateAlternateAmount] = useState(null);
  const closeModalPre = () => {
    updateReason("");
    updateAlternateAmount(null);
    closeModal();
  };
  return (
    <div>
      <PPMSModal
        show={showModal}
        handleClose={closeModalPre}
        handleSave={() => {
          let data = {
            bidId: bidId,
            body: {
              alternateAwardAmount: currencyToNumber(alternateAmount),
              reason: reason,
            },
          };
          saveModal(data);
          updateAlternateAmount(null);
          updateReason("");
        }}
        title={"Adjust Award Amount"}
        centered={true}
        backdrop={"static"}
        disableSave={isSaveDisabled}
        body={
          <>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col"}>
                <div className={"grid-row"}>
                  <div className={"grid-col-12"}>
                    <strong>Bidder Name</strong>
                  </div>
                  <div className={"grid-col-12"}>
                    <p>{bidderName}</p>
                  </div>
                </div>
              </div>
              <div className={"grid-col"}>
                <div className={"grid-row"}>
                  <div className={"grid-col-12"}>
                    <strong>Bid Amount</strong>
                  </div>
                  <div className={"grid-col-12"}>
                    <p id={"bid-amount"}>{formatCurrency.format(bidAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={"grid-row grid-gap-4"}>
              <div className={"grid-col-12"}>
                <PPMSInput
                  id={"alternate-award-amount"}
                  labelBold={true}
                  label={"Alternate Award Amount"}
                  inputType={"text"}
                  value={alternateAmount}
                  isRequired={true}
                  maxLength={8}
                  isDisabled={false}
                  onChange={(event) => {
                    let number = currencyToNumber(event.target.value);
                    let value = number && number >= 0 ? number : "";
                    updateAlternateAmount(value.toString());
                  }}
                  onBlur={(event) => {
                    let value = currencyToNumber(event.target.value);
                    if (value && value >= 0 && reason.length > 0) {
                      setSaveDisabled(false);
                    }
                    updateAlternateAmount(formatCurrency.format(value));
                  }}
                />
              </div>
              <div className={"grid-col-12"}>
                <PPMSInput
                  labelBold={true}
                  label={"Reason"}
                  id={"reason"}
                  maxLength={50}
                  isRequired={true}
                  inputType={"text"}
                  isDisabled={false}
                  onChange={(event) => {
                    updateReason(event.target.value);
                  }}
                  onBlur={(event) => {
                    if (
                      event.target.value.length > 0 &&
                      currencyToNumber(alternateAmount) >= 0
                    ) {
                      setSaveDisabled(false);
                    }
                  }}
                />
              </div>
            </div>
          </>
        }
        id={"adjust-award-amount"}
      />
    </div>
  );
};

export default ModifyBid;
