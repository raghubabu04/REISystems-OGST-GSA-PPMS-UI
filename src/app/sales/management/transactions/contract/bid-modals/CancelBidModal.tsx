import React, { useState } from "react";
import { PPMSInput } from "../../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSModal } from "../../../../../../ui-kit/components/common/PPMS-modal";
import { formatCurrencyWODecimal } from "../../../../../../ui-kit/utilities/FormatUtil";

interface CancelBidModalProps {
  showModal: boolean;
  handleSaveModal: any;
  handleCloseModal: any;
  bidId: number;
  bidderName: string;
  bidAmount: string;
}
const CancelBidModal = (props: CancelBidModalProps) => {
  const {
    showModal,
    handleSaveModal,
    handleCloseModal,
    bidId,
    bidderName,
    bidAmount,
  } = props;
  const [cancelReason, setCancelReason] = useState("");
  const handleCancelReason = (value) => {
    setCancelReason(value);
  };
  return (
    <div>
      <PPMSModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={() => handleSaveModal(bidId, cancelReason)}
        title={"Cancel Bid"}
        centered={true}
        backdrop={"static"}
        labelCancel={"Cancel"}
        label={"Save"}
        body={
          <CancelBidModalContent
            bidderName={bidderName}
            bidAmount={bidAmount}
            cancelReason={cancelReason}
            handleCancelReason={handleCancelReason}
          />
        }
        id={"cancel-bid-modal"}
      />
    </div>
  );
};

const CancelBidModalContent = ({
  bidderName,
  bidAmount,
  cancelReason,
  handleCancelReason,
}) => {
  return (
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
              <p id={"bid-amount"}>
                {formatCurrencyWODecimal.format(bidAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <PPMSInput
            labelBold={true}
            label={"Reason for Bid Cancellation : "}
            id={"reason"}
            maxLength={50}
            isRequired={true}
            inputType={"text"}
            isDisabled={false}
            onChange={(event) => {
              handleCancelReason(event.target.value);
            }}
            value={cancelReason}
          />
        </div>
      </div>
    </>
  );
};

export default CancelBidModal;
