import React, { useContext, useMemo } from "react";
import { PropertyContext } from "../PropertyContext";
import moment from "moment";
import { joinIcn } from "../constants/Constants";
import ExcessReleaseDate from "../additional-info-class/ExcessReleaseDate";
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

export interface ChangeRequestModalERD {
  actions?: any;
}

export function ChangeRequestModalERD(props: ChangeRequestModalERD) {
  const {
    additionalInfoState,
    icnState,
    updateAdditionalInfoState,
  } = useContext(PropertyContext);

  let propertyService = new PropertyApiService();

  function handleErdChangeRequestClose(event: any) {
    updateAdditionalInfoState({
      requestedExcessReleaseDate: null,
      justificationERDIsInvalid: false,
      justificationERDIsValid: false,
      justificationERDErrorMsg: "",
      erdOnModalIsInvalid: false,
      erdOnModalIsValid: false,
      erdOnModalErrorMsg: "",
      modalShowERD: false,
      disableSaveBtn: false,
    });
  }

  function toJSONERD(): ChangeRequestDTO {
    return {
      changeRequestId: additionalInfoState.changeRequestERDId,
      prevValue:
        additionalInfoState.excessReleaseDate !== null
          ? moment(additionalInfoState.excessReleaseDate, "yyyy-MM-dd").toDate()
          : null,

      newValue:
        additionalInfoState.requestedExcessReleaseDate !== null
          ? moment(
              additionalInfoState.requestedExcessReleaseDate,
              "yyyy-MM-dd"
            ).toDate()
          : null,
      reasonForChange:
        additionalInfoState.requestedExcessReleaseDateJustification,
      changeRequestType: ChangeRequestType.EXCESS_RELEASE_DATE,
      changeRequestStatus:
        UserUtils.hasPermission("SM") || UserUtils.hasPermission("NU")
          ? ChangeRequestStatus.APPROVED
          : ChangeRequestStatus.PENDING,
    };
  }

  function handleOnChangeJustificationErd(event: any) {
    let validation = validateJustification(event.target.value);

    updateAdditionalInfoState({
      justificationERDIsInvalid: validation.isInvalid,
      justificationERDIsValid: validation.isValid,
      justificationERDErrorMsg: validation.validationError,
      requestedExcessReleaseDateJustification: event.target.value,
    });
  }

  async function handleErdChangeRequestSave(event: any) {
    const data: ChangeRequestDTO = toJSONERD();
    const icn = joinIcn(icnState);
    let justificationValidation = validateJustification(
      additionalInfoState.requestedExcessReleaseDateJustification
    );
    let validation = validateDateOnModal(
      additionalInfoState.requestedExcessReleaseDate
    );

    if (justificationValidation.isInvalid || validation.isInvalid) {
      updateAdditionalInfoState({
        justificationERDIsInvalid: justificationValidation.isInvalid,
        justificationERDIsValid: !justificationValidation.isInvalid,
        justificationERDErrorMsg: justificationValidation.validationError,
        erdOnModalIsInvalid: validation.isInvalid,
        erdOnModalIsValid: !validation.isInvalid,
        erdOnModalErrorMsg: validation.validationError,
      });
    } else {
      updateAdditionalInfoState({ disableSaveBtn: true });

      const { addToast } = props.actions;
      try {
        let erdResponse = await propertyService.saveChangeRequest(icn, data);
        let excessReleaseDate =
          UserUtils.hasPermission("SM") || UserUtils.hasPermission("NU")
            ? moment(erdResponse.data.newValue, "YYYY/MM/DD").toDate()
            : moment(erdResponse.data.prevValue, "YYYY/MM/DD").toDate();
        updateAdditionalInfoState({
          changeRequestERDId: erdResponse.data.changeRequestERDId,
          changeRequestERDIdSubmitted: true,
          requestedExcessReleaseDateJustification:
            erdResponse.data.requestedExcessReleaseDateJustification,
          excessReleaseDate: excessReleaseDate,
          modalShowERD: false,
          disableSaveBtn: false,
        });
        addToast({
          text:
            UserUtils.hasPermission("SM") || UserUtils.hasPermission("APO") || UserUtils.hasPermission("NU")
              ? "ERD updated successfully"
              : "ERD Change Request submitted successfully",
          type: "success",
          heading: "Success",
        });

        if (UserUtils.hasPermission("SM") || UserUtils.hasPermission("NU")) {
          let propertyResponse = await propertyService.getProperty(icn);
          let surplusReleaseDate = moment(
            propertyResponse.data.surplusReleaseDate,
            "YYYY/MM/DD"
          ).toDate();
          updateAdditionalInfoState({
            surplusReleaseDate: surplusReleaseDate,
          });
        }
      } catch (err) {
        console.log("Error saving ERD request");
        addToast({
          text: "Error saving ERD Change Request",
          type: "error",
          heading: "Error",
        });
      }
    }
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
                    <ExcessReleaseDate
                      id={"requestedExcessReleaseDate"}
                      startDate={additionalInfoState.requestedExcessReleaseDate}
                      endDate={
                        UserUtils.hasPermission("SM")
                          ? moment(new Date()).add(2100, "years").toDate()
                          : additionalInfoState.excessReleaseDate
                      }
                      isRequired={true}
                      isInvalid={additionalInfoState.erdOnModalIsInvalid}
                      isValid={additionalInfoState.erdOnModalIsValid}
                      validationMsg={additionalInfoState.erdOnModalErrorMsg}
                      message={
                        "You can request the Excess Release Date to be from reported date until your agency's default Excess (Internal screening) release date."
                      }
                    />
                  </div>
                </div>
                <div className={"grid-row grid-gap-4"}>
                  <div className={"grid-col"}>
                    <PPMSTextArea
                      id={"requestedExcessReleaseDateJustification"}
                      label={"Justification for Excess Release Date"}
                      isDisabled={false}
                      inputType={"text"}
                      isRequired={true}
                      isInvalid={additionalInfoState.justificationERDIsInvalid}
                      isValid={additionalInfoState.justificationERDIsValid}
                      validationMessage={
                        additionalInfoState.justificationERDErrorMsg
                      }
                      maxLength={300}
                      onChange={handleOnChangeJustificationErd}
                    />
                  </div>
                </div>
              </div>
            </>
          }
          id={"requestedExcessReleaseDate"}
          show={additionalInfoState.modalShowERD}
          title={
            UserUtils.hasPermission("SM") || UserUtils.hasPermission("NU")
              ? "Update Excess Release Date"
              : "Request Change"
          }
          size={"lg"}
          centered={true}
          backdrop={"static"}
          handleClose={handleErdChangeRequestClose}
          handleSave={handleErdChangeRequestSave}
          disableSave={additionalInfoState.disableSaveBtn}
        />
      </>
    );
  }, [
    additionalInfoState,
    handleOnChangeJustificationErd,
    handleErdChangeRequestClose,
    handleErdChangeRequestSave,
  ]);
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(ChangeRequestModalERD);
