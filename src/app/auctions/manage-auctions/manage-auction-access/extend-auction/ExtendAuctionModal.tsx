import React, { useMemo, useState } from "react";

import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";

import { isEmptyCheck } from "../../../../../ui-kit/components/validations/FieldValidations";

interface AddBidderModalProps {
  selectedLotSaleNumber: string;
  showModal: boolean;
  handleExtension: any;
  handleCancelExtension: any;
}

const ExtendAuctionModal = (props: AddBidderModalProps) => {
  const { showModal, handleCancelExtension, handleExtension } = props;

  const [extensionHours, setExtensionHours] = useState<string>("");

  function handleSaveModal(): void {
    if (!isEmptyCheck(extensionHours)) {
      handleExtension(extensionHours);
    }
  }

  function handleExtensionHoursChange(event: any) {
    let value = event.currentTarget.value;
    if (value > 0) setExtensionHours(value);
  }

  function handleCloseModal(): void {
    setExtensionHours("");
    handleCancelExtension();
  }

  return (
    <div>
      <PPMSModal
        show={showModal}
        handleClose={() => handleCloseModal()}
        handleSave={() => handleSaveModal()}
        title={"Extend Sales/Lot Number"}
        centered={true}
        backdrop={"static"}
        label={"Submit"}
        labelCancel={"Cancel"}
        body={
          <ExtensionModalContent
            selectedLotSaleNumber={props.selectedLotSaleNumber}
            extensionHours={extensionHours}
            handleExtensionHoursChange={handleExtensionHoursChange}
          />
        }
        id={"extend-modal-window"}
        size={"lg"}
      />
    </div>
  );
};

const ExtensionModalContent = ({
  selectedLotSaleNumber,
  extensionHours,
  handleExtensionHoursChange,
}) => {
  const extHoursInput = () => {
    return (
      <input
        type="number"
        value={extensionHours}
        onChange={(e) => handleExtensionHoursChange(e)}
        style={{ width: "100px" }}
        aria-label="goto-page-input"
      />
    );
  };

  const extHoursLabel = () => {
    if (!isEmptyCheck(selectedLotSaleNumber)) {
      return `Extend Sales/Lot Number ${selectedLotSaleNumber} by`;
    } else {
      return `Extend all selected Sales/Loted by`;
    }
  };

  return (
    <div>
      <div className="grid-conatiner ui-ppms">
        <div className={"grid-row grid-gap"}>
          <div className={"grid-col-12"}>
            <span>
              {extHoursLabel()} {extHoursInput()} hours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExtendAuctionModal;
