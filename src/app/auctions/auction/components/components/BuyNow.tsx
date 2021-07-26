import React from "react";
import {PPMSModal} from "../../../../../ui-kit/components/common/PPMS-modal";

interface BuyNowProps {
  showBuyModal: boolean;
  updateBuyModal: any;
  handleBuyNow: any;
}

const BuyNow = (props: BuyNowProps) => {
  const { showBuyModal, handleBuyNow, updateBuyModal } = props;
  const closeModal = () => {
    updateBuyModal(false);
  };
  const handleBuyNowModal = () => {
    handleBuyNow();
    closeModal();
  };
  return (
    <>
      <PPMSModal
        id={"buy-now-modal"}
        body={<>By clicking the 'Confirm Bid' button, you are entering into a binding contract with the federal
          government. Payment and removal should be made as soon as possible, but no later than 2 business days (for
          payment) and 10 business days (for removal) from the date and time of your award.</>}
        show={showBuyModal}
        title={"Confirmation"}
        handleClose={closeModal}
        handleSave={handleBuyNowModal}
        label={"Confirm Bid"}
        labelCancel={"Cancel"}
      />
    </>
  );
};

export default BuyNow;
