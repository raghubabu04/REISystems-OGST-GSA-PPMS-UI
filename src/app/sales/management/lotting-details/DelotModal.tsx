import * as React from "react";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
interface DelotModalProps {
  showDelotModal: boolean;
  handleSaveDelotModal: any;
  handleCloseDelotModal: any;
  property: any;
  handleWithdrawMethod?: any;
  withdrawReason?: any;
  isContract?: boolean;
  withdrawErrorMsg?: any;
  withdrawInvalid?: boolean;
}
export const DelotModal = (props: DelotModalProps) => {
  const {
    showDelotModal,
    handleSaveDelotModal,
    handleCloseDelotModal,
    property,
    handleWithdrawMethod,
    withdrawReason,
    isContract,
    withdrawErrorMsg,
    withdrawInvalid,
  } = props;
  return (
    <div>
      <PPMSModal
        show={showDelotModal}
        handleClose={handleCloseDelotModal}
        handleSave={() => handleSaveDelotModal(property)}
        title={"Delot Item"}
        centered={true}
        backdrop={"static"}
        label={"Yes"}
        labelCancel={"No"}
        body={
          <DelotModalContent
            handleWithdrawMethod={handleWithdrawMethod}
            withdrawReason={withdrawReason}
            isContract={isContract}
            withdrawErrorMsg={withdrawErrorMsg}
            withdrawInvalid={withdrawInvalid}
          />
        }
        id={"delete-files"}
      />
    </div>
  );
};

const DelotModalContent = ({
  handleWithdrawMethod,
  withdrawReason,
  isContract,
  withdrawErrorMsg,
  withdrawInvalid,
}) => {
  return (
    <div>
      <div>
        <p>Are you sure you want to Delot this Item ?</p>
      </div>
      {isContract && (
        <div className={"grid-row"}>
          <div className={"grid-col"}>
            <PPMSTextArea
              id={"withdrawalReason"}
              name={"withdrawalReason"}
              label={"Withdrawal Reason"}
              isRequired={true}
              isDisabled={false}
              inputType={"text"}
              value={withdrawReason}
              onChange={handleWithdrawMethod}
              validationMessage={withdrawErrorMsg}
              isInvalid={withdrawInvalid}
              isValid={!withdrawInvalid}
            />
          </div>
        </div>
      )}
    </div>
  );
};
