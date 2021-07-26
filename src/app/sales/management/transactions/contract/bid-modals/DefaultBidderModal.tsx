import React, { useState } from "react";
import { PPMSModal } from "../../../../../../ui-kit/components/common/PPMS-modal";

interface DefaultBidderModalProps {
  showModal: boolean;
  handleSave: any;
  closeModal: any;
  bidId: number;
  bidderId: number;
}
const DefaultBidderModal = (props: DefaultBidderModalProps) => {
  const { showModal, handleSave, closeModal, bidId, bidderId } = props;
  return (
    <div>
      <PPMSModal
        id={"default-modal"}
        body={<>Are you sure you want to place the contract under default?</>}
        show={showModal}
        title={"Confirmation"}
        handleClose={closeModal}
        handleSave={() => {
          handleSave(bidderId);
        }}
        label={"Yes"}
        labelCancel={"No"}
      />
    </div>
  );
};
export default DefaultBidderModal;
