import React, { useContext, useMemo } from "react";
import { PropertyContext } from "../PropertyContext";
import SurplusReleaseDate from "../additional-info-class/SurplusReleaseDate";
import moment from "moment";
import { joinIcn } from "../constants/Constants";
import {
  validateJustification,
  validateDateOnModal,
} from "../validations/ChangeRequestModalValidation";
import {
  ChangeRequestDTO,
  ChangeRequestStatus,
  ChangeRequestType,
} from "../../../models/ChangeRequestModel";
import { PPMSModal } from "../../../../ui-kit/components/common/PPMS-modal";
import { PropertyApiService } from "../../../../api-kit/property/property-api-service";
import { UserUtils } from "../../../../utils/UserUtils";
import { PPMSTextArea } from "../../../../ui-kit/components/common/input/PPMS-textarea";
import { connect } from "react-redux";
import { addToast } from "../../../../_redux/_actions/toast.actions";
import { bindActionCreators } from "redux";

export interface ChangeRequestModal {
  actions?: any;
}

export function ChangeRequestModal(props: ChangeRequestModal) {
  const {
    additionalInfoState,
    icnState,
    updateAdditionalInfoState,
  } = useContext(PropertyContext);

  let propertyService = new PropertyApiService();

  function handleSrdChangeRequestSave(event: any) {
    const data: ChangeRequestDTO = toJSON();
    const icn = joinIcn(icnState);
    let justificationValidation = validateJustification(
      additionalInfoState.requestedSurplusReleaseDateJustification
    );
    let validation = validateDateOnModal(
      additionalInfoState.requestedSurplusReleaseDate
    );
    if (justificationValidation.isInvalid || validation.isInvalid) {
      updateAdditionalInfoState({
        justificationSRDIsInvalid: justificationValidation.isInvalid,
        justificationSRDIsValid: !justificationValidation.isValid,
        justificationSRDErrorMsg: justificationValidation.validationError,
        srdOnModalIsInvalid: validation.isInvalid,
        srdOnModalIsValid: !validation.isInvalid,
        srdOnModalErrorMsg: validation.validationError,
      });
    } else {
      updateAdditionalInfoState({ disableSaveBtn: true });
      const { addToast } = props.actions;
      propertyService
        .saveChangeRequest(icn, data)
        .then((response: any) => {
          let surplusReleaseDate =
            UserUtils.hasPermission("SM") || UserUtils.hasPermission("APO")
              ? moment(response.data.newValue, "YYYY/MM/DD").toDate()
              : moment(response.data.prevValue, "YYYY/MM/DD").toDate();
          updateAdditionalInfoState({
            changeRequestId: response.data.changeRequestId,
            changeRequestIdSubmitted: true,
            surplusReleaseDate: surplusReleaseDate,
            modalShowSRD: false,
            disableSaveBtn: false,
          });
          addToast({
            text:
              UserUtils.hasPermission("SM") || UserUtils.hasPermission("APO")
                ? "SRD updated successfully"
                : "SRD Change Request submitted successfully",
            type: "success",
            heading: "Success",
          });
        })
        .catch(() => {
          console.log("error while saved");
          addToast({
            text: "Error Submitting SRD Change request",
            type: "error",
            heading: "Error",
          });
        });
    }
  }

  function handleSrdChangeRequestClose(event: any) {
    updateAdditionalInfoState({
      requestedSurplusReleaseDate: null,
      justificationSRDIsValid: false,
      justificationSRDIsInvalid: false,
      justificationSRDErrorMsg: "",
      srdOnModalIsInvalid: false,
      srdOnModalIsValid: false,
      srdOnModalErrorMsg: "",
      modalShowSRD: false,
      disableSaveBtn: false,
    });
  }

  function toJSON(): ChangeRequestDTO {
    return {
      changeRequestId: additionalInfoState.changeRequestId,
      prevValue:
        additionalInfoState.surplusReleaseDate !== null
          ? moment(
              additionalInfoState.surplusReleaseDate,
              "yyyy-MM-dd"
            ).toDate()
          : null,
      newValue:
        additionalInfoState.requestedSurplusReleaseDate !== null
          ? moment(
              additionalInfoState.requestedSurplusReleaseDate,
              "yyyy-MM-dd"
            ).toDate()
          : null,
      reasonForChange:
        additionalInfoState.requestedSurplusReleaseDateJustification,
      changeRequestType: ChangeRequestType.SURPLUS_RELEASE_DATE,
      changeRequestStatus:
        UserUtils.hasPermission("SM") || UserUtils.hasPermission("APO")
          ? ChangeRequestStatus.APPROVED
          : ChangeRequestStatus.PENDING,
    };
  }
  function handleOnChangeJustification(event: any) {
    let validation = validateJustification(event.target.value);

    updateAdditionalInfoState({
      justificationSRDIsInvalid: validation.isInvalid,
      justificationSRDIsValid: validation.isValid,
      justificationSRDErrorMsg: validation.validationError,
      requestedSurplusReleaseDateJustification: event.target.value,
    });
  }

  return useMemo(() => {
    return (
      <>
        <PPMSModal
          body={
            <>
              <div className={"change-request-modal"}>
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <SurplusReleaseDate
                      id={"requestedSurplusReleaseDate"}
                      startDate={
                        additionalInfoState.requestedSurplusReleaseDate
                      }
                      isInvalid={additionalInfoState.srdOnModalIsInvalid}
                      validationMsg={additionalInfoState.srdOnModalErrorMsg}
                      isRequired={true}
                      isValid={additionalInfoState.srdOnModalIsValid}
                    />
                  </div>
                </div>
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <PPMSTextArea
                      id={"requestedSurplusReleaseDateJustification"}
                      label={"Justification for Surplus Release Date"}
                      isDisabled={false}
                      inputType={"text"}
                      isRequired={UserUtils.hasPermission("APO") ? false : true}
                      isInvalid={additionalInfoState.justificationSRDIsInvalid}
                      validationMessage={
                        additionalInfoState.justificationSRDErrorMsg
                      }
                      isValid={additionalInfoState.justificationSRDIsValid}
                      maxLength={300}
                      onChange={handleOnChangeJustification}
                    />
                  </div>
                </div>
              </div>
            </>
          }
          id={"requestedSurplusReleaseDate"}
          show={additionalInfoState.modalShowSRD}
          title={
            UserUtils.hasPermission("SM") || UserUtils.hasPermission("APO")
              ? "Update Surplus Release Date"
              : "Request Change"
          }
          size={"lg"}
          centered={true}
          backdrop={"static"}
          handleClose={handleSrdChangeRequestClose}
          handleSave={handleSrdChangeRequestSave}
          disableSave={additionalInfoState.disableSaveBtn}
        />
      </>
    );
  }, [
    additionalInfoState,
    handleOnChangeJustification,
    handleSrdChangeRequestClose,
    handleSrdChangeRequestSave,
  ]);
}

// export default ChangeRequestModal;

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(ChangeRequestModal);
