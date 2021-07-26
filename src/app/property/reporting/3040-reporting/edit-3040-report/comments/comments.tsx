import React, {useContext} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {addToast} from "../../../../../../_redux/_actions/toast.actions";
import {PPMSTextEditor} from "../../../../../../ui-kit/components/common/PPMS-texteditor";
import {Reporting3040Context} from "../reporting-3040-context";
import {UserUtils} from "../../../../../../utils/UserUtils";
import {ReportStatus, validateComments,} from "../constants-3040";

interface Comments3040Props {
}

function Comments3040(props: Comments3040Props) {
  const {
    editReporting3040State,
    comments3040State,
    donations3040State,
    transfers3040State,
    receipts3040State,
    updateComments3040State,
  } = useContext(Reporting3040Context);

  function validateGsaComments() {
    let validation = validateComments(
      comments3040State.gsaComments,
      false,
      "Gsa comments"
    );

    updateComments3040State({
      gsaCommentsIsInValid: validation.isInvalid,
      gsaCommentsIsValid: !validation.isInvalid,
      gsaCommentsValidationMessage: validation.validationError,
    });
  }

  function validateSaspComments() {
    let validation = validateComments(
      comments3040State.saspComments,
      donations3040State.publicProfit.other.length !== 0 ||
        transfers3040State.nonMisc.otherNegative.length !== 0 ||
        receipts3040State.pocAdjust.length !== 0,
      "SASP comments"
    );
    updateComments3040State({
      saspCommentsIsInValid: validation.isInvalid,
      saspCommentsIsValid: !validation.isInvalid,
      saspCommentsValidationMessage: validation.validationError,
    });
  }

  return (
    <>
      <PPMSTextEditor
        id={"sasp-comments"}
        value={comments3040State.saspComments}
        onChange={(data: any) => {
          updateComments3040State({
            saspComments: data,
            saspCommentsIsInValid: false,
            saspCommentsIsValid: true,
          });
        }}
        onBlur={validateSaspComments}
        label={"SASP Comments"}
        isInvalid={comments3040State.saspCommentsIsInValid}
        isValid={comments3040State.saspCommentsIsValid}
        isRequired={true}
        isDisabled={!UserUtils.isUserSA() || editReporting3040State.viewEnabled}
        validationMessage={comments3040State.saspCommentsValidationMessage}
        onBlurCheck={true}
      />

      {!UserUtils.isUserSA() ||
      editReporting3040State.reportStatus === ReportStatus.APPROVED ? (
        <PPMSTextEditor
          id={"gsa-comments"}
          value={comments3040State.gsaComments}
          onChange={(data: any) => {
            updateComments3040State({
              gsaComments: data,
              gsaCommentsIsInValid: false,
              gsaCommentsIsValid: true,
            });
          }}
          onBlur={validateGsaComments}
          label={"GSA Comments"}
          isInvalid={comments3040State.gsaCommentsIsInValid}
          isValid={comments3040State.gsaCommentsIsValid}
          isRequired={false}
          isDisabled={
            !(UserUtils.isSystemAdminUser() || UserUtils.isUserApo()) ||
            editReporting3040State.viewEnabled
          }
          validationMessage={comments3040State.gsaCommentsValidationMessage}
          onBlurCheck={true}
        />
      ) : (
        ""
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(Comments3040);
