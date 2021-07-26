import React, { useState, useContext, useEffect } from "react";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PossessionHistoryContext } from "./PossessionHistoryContext";
import TransferLEAModal from "./TransferLEAModal";
import UpdateStatusModal from "./UpdateStatusModal";
import { PPMSFirearmDetails } from "../../../../ui-kit/components/common/PPMS-FirearmDetails";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { statusCodeValues } from "./Constants";
import { UserUtils } from "../../../../utils/UserUtils";

interface props {
  icn?: string;
  tcn?: string;
  itemName?: string;
  fireArmSerialNumber?: string;
  itemStatus?: string;
  triggerHistoryApi?: any;
  apiCall?: any;
  match?: any;
}

export const PossessionRecordCard = (props: props) => {
  const { possessionHistoryState, updatePossessionHistoryState } = useContext(
    PossessionHistoryContext
  );

  useEffect(() => {
    updatePossessionHistoryState({
      displayStatusCode: props.itemStatus,
    });

    //Transfer button only available for "Active" status

    if (props.itemStatus !== "A") {
      updatePossessionHistoryState({
        transerButtonDisabled: true,
      });
    } else {
      updatePossessionHistoryState({
        transerButtonDisabled: false,
        updateStatusButtonDisabled: false,
      });
    }

    if (
      props.itemStatus !== "A" &&
      !(UserUtils.isSystemAdminUser || UserUtils.isUserFireArmManager)
    ) {
      updatePossessionHistoryState({
        updateStatusButtonDisabled: true,
      });
    }
  }, [props.itemStatus]);

  const [showStatusModal, setStatusModal] = useState(false);
  const [showTransferModal, setTransferModal] = useState(false);

  const openStatusModal = () => {
    setStatusModal(true);
  };
  const closeStatusModal = (triggerEvent: boolean) => {
    setStatusModal(false);
    if (triggerEvent) {
      props.triggerHistoryApi();
    }
  };
  const openTransferModal = () => {
    setTransferModal(true);
  };
  const closeTransferModal = (triggerApi: boolean) => {
    setTransferModal(false);
    if (triggerApi) {
      props.apiCall();
    }
  };

  return (
    <>
      {showStatusModal && (
        <UpdateStatusModal
          toggleStatusModal={closeStatusModal}
          icn={props.icn}
        />
      )}
      {showTransferModal && (
        <div className="grid-row">
          <TransferLEAModal
            toggleTransferModal={closeTransferModal}
            icn={props.icn}
            tcn={props.tcn}
            serialNumber={props.fireArmSerialNumber}
            itemName={props.itemName}
            itemStatus={possessionHistoryState.displayStatusCode}
          />
        </div>
      )}

      <div className="tablet:grid-col">
        <div className="tablet:grid-row">
          <PPMSFirearmDetails
            icn={props.icn}
            itemName={props.itemName}
            serialNumber={props.fireArmSerialNumber}
            tcn={props.tcn}
          ></PPMSFirearmDetails>
        </div>
      </div>

      <div className="tablet:grid-col-12">
        {(UserUtils.isSystemAdminUser() ||
          UserUtils.isUserFireArmManager()) && (
          <div className="grid-row">
            <div className="grid-col-4">
              <PPMSSelect
                id={"status"}
                name={"status"}
                placeholderValue={"Status"}
                selectName={"staticSelectStatus"}
                values={statusCodeValues}
                onChange={(event) => {}}
                identifierKey={"id"}
                identifierValue={"value"}
                selectedValue={possessionHistoryState.displayStatusCode}
                label={"Status"}
                isRequired={true}
                disabled={true}
              />
            </div>
            <div className="grid-col-2 possession-status">
              <PPMSButton
                variant={"primary"}
                type={"button"}
                value={"updateStatus"}
                label={"Update Status"}
                className={"create-property"}
                onPress={openStatusModal}
                id={"update-status-btn"}
                isDisabled={possessionHistoryState.updateStatusButtonDisabled}
              />
            </div>

            <div className="grid-col-2 possession-status">
              <PPMSButton
                variant={"primary"}
                type={"button"}
                value={"transferLEA"}
                label={"Transfer LEA"}
                className={"create-property"}
                onPress={openTransferModal}
                id={"transfer-lea-btn"}
                isDisabled={possessionHistoryState.transerButtonDisabled}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
