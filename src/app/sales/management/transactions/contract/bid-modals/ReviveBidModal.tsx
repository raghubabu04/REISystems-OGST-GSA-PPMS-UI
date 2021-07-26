import React from "react";
import { PPMSModal } from "../../../../../../ui-kit/components/common/PPMS-modal";

interface ReviveBidModalProps {
  showModal: boolean;
  closeModal: any;
  saveModal: any;
  bidId: number;
  loading?: boolean;
}
const ReviveBidModal = (props: ReviveBidModalProps) => {
  const { showModal, closeModal, saveModal, bidId, loading } = props;
  return (
    <div>
      <PPMSModal
        show={showModal}
        handleClose={closeModal}
        handleSave={() => saveModal(bidId)}
        title={"Revive Bid"}
        centered={true}
        backdrop={"static"}
        saveIsLoading={loading}
        label={"Yes"}
        labelCancel={"No"}
        body={
          <div>
            <p>
              Are you sure you want to send the 'Bid Revival' email to the
              bidder?
            </p>
          </div>
        }
        id={"revive-bid"}
      />
    </div>
  );
};

export default ReviveBidModal;
