import { property } from "lodash";
import * as React from "react";
import { useContext } from "react";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PageHelper, Paths } from "../../../Router";
import { LotAuctionListContext } from "./LotAuctionListContext";
interface TransferLotModalProps {
  showTransferLotModal: boolean;
  handleSaveTransferLotModal: any;
  handleCloseTransferLotModal: any;
  handleTransferLot?: any;
  defaultZoneId?: any;
}
export const TransferLotModal = (props: TransferLotModalProps) => {
  const {
    showTransferLotModal,
    handleSaveTransferLotModal,
    handleCloseTransferLotModal,
    handleTransferLot,
    defaultZoneId,
  } = props;
  const { lotAuctionListState, updateLotAuctionListState } = useContext(
    LotAuctionListContext
  );
  const handleValueChange = (event) => {
    let state = lotAuctionListState;
    state.data.newSaleNumber = event.target.value;
    updateLotAuctionListState(state);
  };
  return (
    <div>
      <PPMSModal
        show={showTransferLotModal}
        handleClose={handleCloseTransferLotModal}
        handleSave={() => handleSaveTransferLotModal(property)}
        title={"Transfer Lot"}
        centered={true}
        backdrop={"static"}
        labelCancel={"Cancel"}
        label={"Yes"}
        hideLabel={true}
        body={
          <TransferLotModalContent
            handleValueChange={handleValueChange}
            handleTransferLot={handleTransferLot}
            defaultZoneId={defaultZoneId}
            lotAuctionListState={lotAuctionListState}
            handleCloseTransferLotModal={handleCloseTransferLotModal}
          />
        }
        id={"delete-files"}
      />
    </div>
  );
};

const TransferLotModalContent = ({
  handleTransferLot,
  defaultZoneId,
  lotAuctionListState,
  handleValueChange,
  handleCloseTransferLotModal,
}) => {
  return (
    <div>
      <div className={"grid-row"}>
        <div className={"grid-row"}>
          <PPMSInput
            id={"transfer-sale-number"}
            inputType={"text"}
            value={lotAuctionListState.data.newSaleNumber}
            onChange={handleValueChange}
            isDisabled={false}
            label={"Existing Sale Number"}
          />
          {/* </div>
        <div className={"grid-col-4"}> */}
          <PPMSButton
            id={"transfer-lot"}
            label={"Transfer Lot"}
            onPress={() => {
              handleTransferLot();
              handleCloseTransferLotModal();
            }}
            type={"button"}
            className={"transfer-lot"}
            variant={"primary"}
          />
        </div>
      </div>
      <br />
      <div className={"grid-row"}>
        <div className={"grid-row "}>
          <b>OR</b>
        </div>
      </div>
      <br />
      <div className={"grid-row"}>
        <div className={"grid-col"}>
          <PPMSButton
            id={"create-new-sale"}
            label={"Create a new sale"}
            onPress={() => {
              handleCloseTransferLotModal();
              PageHelper.openPage(
                Paths.salesTransaction + `?zoneId=${parseInt(defaultZoneId)}`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
