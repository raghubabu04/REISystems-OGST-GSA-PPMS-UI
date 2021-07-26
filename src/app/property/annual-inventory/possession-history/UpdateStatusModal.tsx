import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { PossessionHistoryContext } from "./PossessionHistoryContext";
import { statusCodeValues } from "./Constants";
import { InventoryApiService } from "../../../../api-kit/property/inventory-api-service";
import { UserUtils } from "../../../../utils/UserUtils";

export interface Props {
  toggleStatusModal: any;
  actions?: any;
  icn: string;
}

function UpdateStatusModal(props: Props) {
  const { possessionHistoryState, updatePossessionHistoryState } = useContext(
    PossessionHistoryContext
  );
  const inventoryApiService = new InventoryApiService();
  const { toggleStatusModal, icn } = props;

  useEffect(() => {
    updatePossessionHistoryState({
      statusCode: possessionHistoryState.displayStatusCode,
      statusSaveButtonDisabled: true,
    });
  }, []);

  const onCancel = (event) => {
    resetStatusInfo();
    toggleStatusModal(false);
  };

  function resetStatusInfo() {
    updatePossessionHistoryState({
      statusCode: "",
      statusComment: "",
      statusSaveButtonDisabled: true,
    });
  }

  function onSave(event) {
    const { addToast } = props.actions;

    let data = {
      status: possessionHistoryState.statusCode,
      comment: possessionHistoryState.statusComment,
      itemControlNumber: icn,
    };

    inventoryApiService
      .updateFirearmStatus(data)
      .then((res) => {
        updatePossessionHistoryState({
          displayStatusCode: possessionHistoryState.statusCode,
        });
        addToast({
          text: `Firearm status successfully updated.`,
          type: "success",
          heading: "Success",
        });
        toggleStatusModal(true);
        resetInfo();
      })
      .catch((err) => {
        addToast({
          text: `Firearm status failed to update.`,
          type: "error",
          heading: "Error",
        });
      });
  }

  function resetInfo() {
    updatePossessionHistoryState({
      statusComment: "",
    });
    //Transfer button only enabled for active status
    if (possessionHistoryState.statusCode !== "A") {
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
      possessionHistoryState.statusCode !== "A" &&
      !(UserUtils.isSystemAdminUser || UserUtils.isUserFireArmManager)
    ) {
      updatePossessionHistoryState({
        updateStatusButtonDisabled: true,
      });
    }
  }

  return (
    <PPMSModal
      body={
        <>
          <PPMSSelect
            id={"status"}
            name={"status"}
            selectName={"selectStatus"}
            values={statusCodeValues}
            onChange={(event) =>
              updatePossessionHistoryState({
                statusCode: event.target.value,
                statusSaveButtonDisabled: false,
              })
            }
            identifierKey={"id"}
            identifierValue={"value"}
            selectedValue={possessionHistoryState.statusCode}
            label={"Status"}
            isRequired={false}
          />
          <PPMSTextArea
            label={"Comments"}
            isInvalid={false}
            isValid={false}
            id={"updateStatusComment"}
            isRequired={false}
            isDisabled={false}
            inputType={"text"}
            maxLength={500}
            value={possessionHistoryState.statusComment}
            onChange={(event) =>
              updatePossessionHistoryState({
                statusComment: event.target.value,
                statusSaveButtonDisabled: false,
              })
            }
          />
        </>
      }
      id={"update-status"}
      show={true}
      handleClose={onCancel}
      handleSave={onSave}
      title={"Update Status"}
      label={"Save"}
      labelCancel={"Cancel"}
      disableSave={possessionHistoryState.statusSaveButtonDisabled}
      backdrop={"static"}
    />
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(UpdateStatusModal);
