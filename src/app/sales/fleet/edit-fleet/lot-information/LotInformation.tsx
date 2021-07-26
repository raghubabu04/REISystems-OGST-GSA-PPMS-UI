import React, { useEffect, useContext, useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FleetContext } from "../Fleet-context";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { isFormSubmitted } from "../../../../../service/validation.service";
import { PPMSDatepicker } from "../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import {
  validateStartEndTime,
  validateFleetStartEndDate,
  formatTime,
  validateStartEndTimeCombination,
} from "../validations/fleetValidations";
import moment from "moment";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { saleActions } from "../../../../../_redux/_actions/sale.actions";
import { commonActions } from "../../../../../_redux/_actions/common.actions";

interface LotInformationProps {
  holiday?: any;
  getHolidays?: any;
}

function LotInformation(props: LotInformationProps) {
  const { lotInformationState, updateLotInformationState } = useContext(
    FleetContext
  );

  const { holiday, getHolidays } = props;

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        validateForm();
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [lotInformationState]);

  function validateForm() {
    let validation = validateFleetStartEndDate(
      lotInformationState.inspectionStartDate,
      lotInformationState.inspectionEndDate,
      true,
      false,
      "Inspection Start Date",
      "inspection",
      true,
      holiday?.holidays
    );

    updateLotInformationState({
      inspectionStartDateisInvalid: validation.isInValid,
      inspectionStartDateValidationMessage: validation.validationError,
    });

    if (
      lotInformationState.inspectionStartTime &&
      lotInformationState.inspectionEndDate
    ) {
      let combineValidation = validateStartEndTimeCombination(
        lotInformationState.inspectionStartTime,
        lotInformationState.inspectionEndTime,
        lotInformationState.amPmStartTime,
        lotInformationState.amPmEndTime,
        lotInformationState.inspectionStartDate,
        lotInformationState.inspectionEndDate,
        "Inspection Start Time",
        "inspection",
        true
      );
      updateLotInformationState({
        inspectionStartTimeisInvalid: combineValidation.isInValid,
        inspectionStartTimeIsValid: !combineValidation.isInValid,
        inspectionStartTimeValidationMessage: combineValidation.validationError,
        inspectionEndTimeisInvalid: false,
        inspectionEndTimeIsValid: false,
        inspectionEndTimeValidationMessage: "",
      });
    }

    if (lotInformationState.inspectionStartTime.length === 0) {
      updateLotInformationState({
        inspectionStartTimeisInvalid: true,
        inspectionStartTimeIsValid: false,
        inspectionStartTimeValidationMessage:
          "Inspection Start Time is Required.",
      });
    }
    if (lotInformationState.inspectionEndTime.length === 0) {
      updateLotInformationState({
        inspectionEndTimeisInvalid: true,
        inspectionEndTimeIsValid: false,
        inspectionEndTimeValidationMessage: "Inspection End Time is Required.",
      });
    }
  }

  return (
    <>
      <div className={""}>
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col"}>
            <PPMSDatepicker
              id={"fleetInspectionStartDate"}
              format={"MM/DD/YYYY"}
              label={"Inspection Start Date"}
              display={""}
              updateDate={(value) => {
                let validation = validateFleetStartEndDate(
                  value,
                  lotInformationState.inspectionEndDate,
                  true,
                  false,
                  "Inspection Start Date",
                  "inspection",
                  true,
                  holiday?.holidays
                );

                let combineValidation = validateStartEndTimeCombination(
                  lotInformationState.inspectionStartTime,
                  lotInformationState.inspectionEndTime,
                  lotInformationState.amPmStartTime,
                  lotInformationState.amPmEndTime,
                  value,
                  lotInformationState.inspectionEndDate,
                  "Inspection Start Time",
                  "inspection",
                  true
                );

                updateLotInformationState({
                  inspectionStartDate: value,
                  inspectionStartDateisInvalid: validation.isInValid,
                  inspectionStartDateValidationMessage:
                    validation.validationError,
                  inspectionStartTimeisInvalid: combineValidation.isInValid,
                  inspectionStartTimeIsValid: !combineValidation.isInValid,
                  inspectionStartTimeValidationMessage:
                    combineValidation.validationError,
                  inspectionEndTimeisInvalid: false,
                  inspectionEndTimeIsValid: false,
                  inspectionEndTimeValidationMessage: "",
                });

                //Recheck second date comparison
                let validation2 = validateFleetStartEndDate(
                  value,
                  lotInformationState.inspectionEndDate,
                  false,
                  lotInformationState.inspectionStartDateisInvalid,
                  "Inspection End Date",
                  "inspection",
                  true,
                  holiday?.holidays
                );

                updateLotInformationState({
                  inspectionEndDateisInvalid: validation.isInValid,
                  inspectionEndDateValidationMessage:
                    validation.validationError,
                });
              }}
              startDate={
                moment(lotInformationState.inspectionStartDate).isValid()
                  ? moment(
                      new Date(lotInformationState.inspectionStartDate)
                    ).toDate()
                  : null
              }
              minDate={moment(new Date()).toDate()}
              maxDate={null}
              isRequired={true}
              isInvalid={lotInformationState.inspectionStartDateisInvalid}
              validationMessage={
                lotInformationState.inspectionStartDateValidationMessage
              }
              notShowFormat={true}
              isDisabled={false}
              setHolidayYear={(year) => {
                getHolidaysByYear(year);
              }}
              holidayList={holiday?.holidays}
              excludeWeekends={true}
              excludeHolidays={true}
              className={"create-sale-due-dates"}
            />
          </div>
          <div className={"grid-col"}>
            <PPMSDatepicker
              id={"fleeInspectionEndDate"}
              format={"MM/DD/YYYY"}
              label={"Inspection End Date"}
              display={""}
              updateDate={(value) => {
                let validation = validateFleetStartEndDate(
                  lotInformationState.inspectionStartDate,
                  value,
                  false,
                  lotInformationState.inspectionStartDateisInvalid,
                  "Inspection End Date",
                  "inspection",
                  true,
                  holiday?.holidays
                );

                let combineValidation = validateStartEndTimeCombination(
                  lotInformationState.inspectionStartTime,
                  lotInformationState.inspectionEndTime,
                  lotInformationState.amPmStartTime,
                  lotInformationState.amPmEndTime,
                  lotInformationState.inspectionStartDate,
                  value,
                  "Inspection End Time",
                  "inspection",
                  true
                );

                updateLotInformationState({
                  inspectionEndDate: value,
                  inspectionEndDateisInvalid: validation.isInValid,
                  inspectionEndDateValidationMessage:
                    validation.validationError,
                  inspectionStartTimeisInvalid: false,
                  inspectionStartTimeIsValid: false,
                  inspectionStartTimeValidationMessage: "",
                  inspectionEndTimeisInvalid: combineValidation.isInValid,
                  inspectionEndTimeIsValid: !combineValidation.isInValid,
                  inspectionEndTimeValidationMessage:
                    combineValidation.validationError,
                });

                //Recheck first date comparison
                let validation2 = validateFleetStartEndDate(
                  lotInformationState.inspectionStartDate,
                  value,
                  true,
                  false,
                  "Inspection Start Date",
                  "inspection",
                  true,
                  holiday?.holidays
                );

                updateLotInformationState({
                  inspectionStartDateisInvalid: validation2.isInValid,
                  inspectionStartDateValidationMessage:
                    validation2.validationError,
                });
              }}
              startDate={
                moment(lotInformationState.inspectionEndDate).isValid()
                  ? moment(
                      new Date(lotInformationState.inspectionEndDate)
                    ).toDate()
                  : null
              }
              minDate={moment(
                new Date(lotInformationState.inspectionStartDate)
              ).toDate()}
              isRequired={true}
              isInvalid={lotInformationState.inspectionEndDateisInvalid}
              validationMessage={
                lotInformationState.inspectionEndDateValidationMessage
              }
              notShowFormat={true}
              isDisabled={false}
              setHolidayYear={(year) => {
                getHolidaysByYear(year);
              }}
              holidayList={holiday?.holidays}
              excludeWeekends={true}
              excludeHolidays={true}
              className={"create-sale-due-dates"}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className="grid-col-4">
            <PPMSInput
              id={"inspect-start-time"}
              inputType={"text"}
              isDisabled={false}
              label={"Inspection Start Time"}
              isRequired={true}
              onChange={(event) => {
                updateLotInformationState({
                  inspectionStartTime: formatTime(event.target.value),
                  inspectionStartTimeisInvalid: false,
                  inspectionStartTimeIsValid: false,
                  inspectionStartTimeValidationMessage: "",
                });
              }}
              onBlur={(event) => {
                let validation = validateStartEndTime(
                  "Inspection Start Time",
                  event.target.value
                );
                if (!validation.isInvalid) {
                  let combineValidation = validateStartEndTimeCombination(
                    event.target.value,
                    lotInformationState.inspectionEndTime,
                    lotInformationState.amPmStartTime,
                    lotInformationState.amPmEndTime,
                    lotInformationState.inspectionStartDate,
                    lotInformationState.inspectionEndDate,
                    "Inspection Start Time",
                    "inspection",
                    true
                  );
                  validation.isInvalid = combineValidation.isInValid;
                  validation.validationError =
                    combineValidation.validationError;
                  updateLotInformationState({
                    inspectionStartTimeisInvalid: validation.isInvalid,
                    inspectionStartTimeIsValid: !validation.isInvalid,
                    inspectionStartTimeValidationMessage:
                      validation.validationError,
                    inspectionEndTimeisInvalid: false,
                    inspectionEndTimeIsValid: false,
                    inspectionEndTimeValidationMessage: "",
                  });
                } else {
                  updateLotInformationState({
                    inspectionStartTimeisInvalid: validation.isInvalid,
                    inspectionStartTimeIsValid: !validation.isInvalid,
                    inspectionStartTimeValidationMessage:
                      validation.validationError,
                  });
                }
              }}
              value={lotInformationState.inspectionStartTime}
              validationMessage={
                lotInformationState.inspectionStartTimeValidationMessage
              }
              isInvalid={lotInformationState.inspectionStartTimeisInvalid}
              isValid={lotInformationState.inspectionStartTimeIsValid}
              maxLength={5}
            />
            <span className="usa-hint">Format: hh:mm</span>
          </div>
          <div className="grid-col-3 align-radio">
            <PPMSToggleRadio
              id={"start-time-am-pm"}
              isDisabled={false}
              name={"start-time-am-pm"}
              options={lotInformationState.startTime}
              onChange={(value) => {
                let state = lotInformationState;
                let time = value
                  .filter((item) => item.isSelected === true)
                  .map((item) => {
                    return item.value;
                  });
                state.amPmStartTime = time.toString();
                let combineValidation = validateStartEndTimeCombination(
                  lotInformationState.inspectionStartTime,
                  lotInformationState.inspectionEndTime,
                  time.toString(),
                  lotInformationState.amPmEndTime,
                  lotInformationState.inspectionStartDate,
                  lotInformationState.inspectionEndDate,
                  "Inspection Start Time",
                  "inspection",
                  true
                );
                state.inspectionStartTimeisInvalid =
                  combineValidation.isInValid;
                state.inspectionStartTimeIsValid = !combineValidation.isInValid;
                state.inspectionStartTimeValidationMessage =
                  combineValidation.validationError;
                state.inspectionEndTimeisInvalid = false;
                state.inspectionEndTimeIsValid = false;
                state.inspectionEndTimeValidationMessage = "";
                updateLotInformationState(state);
              }}
              validationMessage={""}
              isInline={true}
            />
          </div>
        </div>
        <div className={"grid-row grid-gap-4"}>
          <div className="grid-col-4">
            <PPMSInput
              id={"inspect-end-time"}
              inputType={"text"}
              isDisabled={false}
              label={"Inspection End Time"}
              isRequired={true}
              onChange={(event) => {
                updateLotInformationState({
                  inspectionEndTime: formatTime(event.target.value),
                  inspectionEndTimeisInvalid: false,
                  inspectionEndTimeIsValid: false,
                  inspectionEndTimeValidationMessage: "",
                });
              }}
              onBlur={(event) => {
                let validation = validateStartEndTime(
                  "Inspection End Time",
                  event.target.value
                );
                if (!validation.isInvalid) {
                  let combineValidation = validateStartEndTimeCombination(
                    lotInformationState.inspectionStartTime,
                    event.target.value,
                    lotInformationState.amPmStartTime,
                    lotInformationState.amPmEndTime,
                    lotInformationState.inspectionStartDate,
                    lotInformationState.inspectionEndDate,
                    "Inspection End Time",
                    "inspection",
                    false
                  );
                  validation.isInvalid = combineValidation.isInValid;
                  validation.validationError =
                    combineValidation.validationError;
                  updateLotInformationState({
                    inspectionEndTimeisInvalid: validation.isInvalid,
                    inspectionEndTimeIsValid: !validation.isInvalid,
                    inspectionEndTimeValidationMessage:
                      validation.validationError,
                    inspectionStartTimeisInvalid: false,
                    inspectionStartTimeIsValid: false,
                    inspectionStartTimeValidationMessage: "",
                  });
                } else {
                  updateLotInformationState({
                    inspectionEndTimeisInvalid: validation.isInvalid,
                    inspectionEndTimeIsValid: !validation.isInvalid,
                    inspectionEndTimeValidationMessage:
                      validation.validationError,
                  });
                }
              }}
              value={lotInformationState.inspectionEndTime}
              validationMessage={
                lotInformationState.inspectionEndTimeValidationMessage
              }
              isInvalid={lotInformationState.inspectionEndTimeisInvalid}
              isValid={lotInformationState.inspectionEndTimeIsValid}
              maxLength={5}
            />
            <span className="usa-hint">Format: hh:mm</span>
          </div>
          <div className="grid-col-3 align-radio">
            <PPMSToggleRadio
              id={"end-time-am-pm"}
              isDisabled={false}
              name={"end-time-am-pm"}
              options={lotInformationState.endTime}
              onChange={(value) => {
                let state = lotInformationState;
                let time = value
                  .filter((item) => item.isSelected === true)
                  .map((item) => {
                    return item.value;
                  });
                let combineValidation = validateStartEndTimeCombination(
                  lotInformationState.inspectionStartTime,
                  lotInformationState.inspectionEndTime,
                  lotInformationState.amPmStartTime,
                  time.toString(),
                  lotInformationState.inspectionStartDate,
                  lotInformationState.inspectionEndDate,
                  "Inspection End Time",
                  "inspection",
                  false
                );
                state.inspectionEndTimeisInvalid = combineValidation.isInValid;
                state.inspectionEndTimeIsValid = !combineValidation.isInValid;
                state.inspectionEndTimeValidationMessage =
                  combineValidation.validationError;
                state.inspectionStartTimeValidationMessage = "";
                state.inspectionStartTimeIsValid = false;
                state.inspectionStartTimeisInvalid = false;
                state.amPmEndTime = time.toString();
                updateLotInformationState(state);
              }}
              validationMessage={""}
              isInline={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  sale: state.sale,
  holiday: state.common.holiday,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ addToast }, dispatch),
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(
        saleActions.updateSaleInfo(saleId, saleNumber, saleAction, zone)
      ),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LotInformation);
