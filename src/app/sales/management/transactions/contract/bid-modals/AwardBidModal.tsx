import React from "react";
import { PPMSModal } from "../../../../../../ui-kit/components/common/PPMS-modal";
interface AwardModalProps {
  showModal: boolean;
  closeModal: any;
  saveModal: any;
  bidId: number;
  buyerDocumentationRequired: boolean;
  loading?: boolean;
}
const AwardBidModal = (props: AwardModalProps) => {
  const {
    showModal,
    closeModal,
    saveModal,
    bidId,
    buyerDocumentationRequired,
    loading,
  } = props;
  return (
    <div>
      <PPMSModal
        show={showModal}
        handleClose={closeModal}
        handleSave={() => saveModal(bidId)}
        title={"Award"}
        centered={true}
        backdrop={"static"}
        label={"Yes"}
        labelCancel={"No"}
        saveIsLoading={loading}
        body={
          buyerDocumentationRequired ? (
            <div>
              <p>
                This will send the award notification to the bidder. Please
                ensure that you have received the required documentation.
              </p>
            </div>
          ) : (
            <div>
              <p>
                Are you sure you want to send the 'Award' email to the bidder?
              </p>
            </div>
          )
        }
        id={"revive-bid"}
      />
    </div>
  );
};

export default AwardBidModal;
