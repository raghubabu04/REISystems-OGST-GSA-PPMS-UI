import * as React from "react";
import { PPMSModal } from "../../../../../ui-kit/components/common/PPMS-modal";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PageHelper, Paths } from "../../../../Router";
import { useContext } from "react";
import { ContractTransactionContext } from "./ContractTransactionContext";
import { PPMSTextArea } from "../../../../../ui-kit/components/common/input/PPMS-textarea";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
interface VoidContractModalProps {
  showVoidContractModal: boolean;
  handleSaveVoidContractModal: any;
  handleDelotAllICNSVoidContractModal: any;
  handleCloseVoidContractModal: any;
  handleTransferLot?: any;
  defaultZoneId?: any;
  voidContractOptions?: [];
  delotAllErrorMsg?: string;
  delotAllInvalid?: boolean;
}
export const VoidContractModal = (props: VoidContractModalProps) => {
  const {
    showVoidContractModal,
    handleSaveVoidContractModal,
    handleCloseVoidContractModal,
    handleTransferLot,
    defaultZoneId,
    delotAllErrorMsg,
    delotAllInvalid,
  } = props;
  const {
    contractTransactionState,
    updateContractTransactionState,
  } = useContext(ContractTransactionContext);
  const salesApiService = new SalesApiService();
  const handleValueChange = (event) => {
    let state = contractTransactionState;
    state.data.newSaleNumber = event.target.value;
    updateContractTransactionState(state);
  };
  const handleNotesValueChange = (event) => {
    let state = contractTransactionState;
    state.delotAllNote = event.target.value;
    updateContractTransactionState(state);
  };
  const handleVoidContractOptionChange = (event, action: string) => {
    updateContractTransactionState({
      voidType: action,
      delotAllNote: "",
    });
  };
  const handleSave = (event) => {
    if (this.state.isEmailValid) {
      const payload = {
        lotId: contractTransactionState.lotId,
        delotAllNote: contractTransactionState.delotAllNote,
      };

      salesApiService
        .delotAllICNS(payload)
        .then((resp) => {
          if (resp.status === 200) {
            this.props.afterSaveAction(true);
          } else this.props.afterSaveAction(false);
        })
        .catch((error) => {
          this.props.afterSaveAction(false);
        });
    }
  };
  return (
    <div>
      {console.log("Delot All ", contractTransactionState.voidType)}
      <PPMSModal
        labelVariant={"primary"}
        hideLabel={contractTransactionState.voidType != "delotAll"}
        hideLabelCancel={contractTransactionState.voidType != "delotAll"}
        show={showVoidContractModal}
        handleClose={handleCloseVoidContractModal}
        handleSave={() => handleSaveVoidContractModal()}
        label={"Confirm"}
        title={"Void Contract"}
        labelCancel={"Cancel"}
        centered={true}
        backdrop={"static"}
        body={
          <VoidContractModalContent
            handleValueChange={handleValueChange}
            handleNotesValueChange={handleNotesValueChange}
            handleTransferLot={handleTransferLot}
            defaultZoneId={defaultZoneId}
            contractTransactionState={contractTransactionState}
            handleCloseVoidContractModal={handleCloseVoidContractModal}
            handleVoidContractOptionChange={handleVoidContractOptionChange}
            delotAllErrorMsg={delotAllErrorMsg}
            delotAllInvalid={delotAllInvalid}
          />
        }
        id={"void-contract"}
      />
    </div>
  );
};
const VoidContractModalContent = ({
  handleTransferLot,
  defaultZoneId,
  contractTransactionState,
  handleValueChange,
  handleNotesValueChange,
  handleCloseVoidContractModal,
  handleVoidContractOptionChange,
  delotAllErrorMsg,
  delotAllInvalid,
}) => {
  return (
    <div>
      <div className={"grid-row"}>
        <div className={"grid-col-auto"}>
          <PPMSButton
            id={"delot-all-icns"}
            label={"Delot All ICNs"}
            onPress={(event) =>
              handleVoidContractOptionChange(event, "delotAll")
            }
            type={"button"}
            className={"delot-all-icns"}
            variant={"primary"}
          />
        </div>
        <div className={"grid-col-auto"}>
          <PPMSButton
            id={"transfer-lot"}
            label={"Transfer Lot"}
            onPress={(event) =>
              handleVoidContractOptionChange(event, "transferLot")
            }
            type={"button"}
            className={"transfer-lot-contract"}
            variant={"primary"}
          />
        </div>
      </div>
      <br />
      {contractTransactionState.voidType === "delotAll" && (
        <div className={"grid-row"}>
          <div className={"desktop:grid-col-8"}>
            <PPMSTextArea
              id={"deloting-notes"}
              isRequired={contractTransactionState.voidType === "delotAll"}
              isDisabled={false}
              inputType={"text"}
              label={"Deloting Reason:"}
              onChange={(value) => {
                handleNotesValueChange(value, "notes");
              }}
              maxLength={500}
              value={contractTransactionState.delotAllNote}
              className={"textarea-sales"}
              onBlur={(event) => {}}
              validationMessage={delotAllErrorMsg}
              isInvalid={delotAllInvalid}
              isValid={!delotAllInvalid}
            />
          </div>
        </div>
      )}
      {contractTransactionState.voidType === "transferLot" && (
        <div>
          <div className={"grid-row"}>
            <div className={"grid-row"}>
              <PPMSInput
                id={"transfer-sale-number"}
                inputType={"text"}
                value={contractTransactionState.data.newSaleNumber}
                onChange={handleValueChange}
                isDisabled={false}
                label={"Existing Sale Number"}
              />
              <PPMSButton
                id={"transfer-lot"}
                label={"Transfer Lot"}
                onPress={() => {
                  handleTransferLot();
                  handleCloseVoidContractModal();
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
                  handleCloseVoidContractModal();
                  PageHelper.openPage(
                    Paths.salesTransaction +
                      `?zoneId=${parseInt(defaultZoneId)}`
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
