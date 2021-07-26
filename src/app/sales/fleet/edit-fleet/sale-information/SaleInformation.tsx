import React, { useContext, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addToast } from "../../../../../_redux/_actions/toast.actions";
import { PPMSDatepicker } from "../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import { saleActions } from "../../../../../_redux/_actions/sale.actions";
import { commonActions } from "../../../../../_redux/_actions/common.actions";
import { FleetContext } from "../Fleet-context";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import {
  formatTime,
  validateFleetStartEndDate,
  validateStartEndTime,
} from "../validations/fleetValidations";
import { isFormSubmitted } from "../../../../../service/validation.service";
import { UserUtils } from "../../../../../utils/UserUtils";

interface SaleInformationProps {
  holiday?: any;
  getHolidays?: any;
}

function SaleInformation(props: SaleInformationProps) {
  const { saleInformationState, updateSaleInformationState } = useContext(
    FleetContext
  );

  const { holiday, getHolidays } = props;

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
  }, [saleInformationState]);

  function validateForm() {
    //date Validation
    let saleState = saleInformationState;
    if (!UserUtils.isUserFleetExt()) {
      let startDateValidation = validateFleetStartEndDate(
        saleInformationState.saleStartDate,
        saleInformationState.saleEndDate,
        true,
        false,
        "Sale Start Date",
        "sale",
        true,
        holiday?.holidays
      );
      saleState.saleStartDateIsInValid = startDateValidation.isInValid;
      saleState.saleStartDateIsValid = !startDateValidation.isInValid;
      saleState.saleStartDateValidationMessage =
        startDateValidation.validationError;

      let endDateValidation = validateFleetStartEndDate(
        saleInformationState.saleStartDate,
        saleInformationState.saleEndDate,
        false,
        saleInformationState.saleStartDateIsInValid,
        "Sale End Date",
        "sale",
        true,
        holiday?.holidays
      );
      saleState.saleEndDateIsInValid = endDateValidation.isInValid;
      saleState.saleEndDateIsValid = !endDateValidation.isInValid;
      saleState.saleEndDateValidationMessage =
        endDateValidation.validationError;

      let saleTimeValidation = validateStartEndTime(
        "Sale Time",
        saleInformationState.saleTime
      );
      saleState.saleTimeIsInValid = saleTimeValidation.isInvalid;
      saleState.saleTimeIsValid = !saleTimeValidation.isInvalid;
      saleState.saleTimeValidationMessage = saleTimeValidation.validationError;
    }

    if (saleInformationState.saleMethod.length === 0) {
      saleState.saleMethodIsInValid = true;
      saleState.saleMethodIsValid = false;
      saleState.saleMethodValidationMessage = "Sale Method is Required.";
    }
    updateSaleInformationState(saleState);
  }

  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };

  return (
    <>
      <div>
        <div className="grid-row grid-gap">
          <div className="grid-col-4">
            <PPMSDatepicker
              id={"fleetSaleStartDate"}
              format={"MM/DD/YYYY"}
              label={"Sale Start Date"}
              display={""}
              updateDate={(value) => {
                let validation = validateFleetStartEndDate(
                  value,
                  saleInformationState.saleEndDate,
                  true,
                  false,
                  "Sale Start Date",
                  "sale",
                  true,
                  holiday?.holidays
                );
                if(saleInformationState.saleMethod === "Sealed / Informal"){
                  saleInformationState.saleEndDate = value;
                }
                saleInformationState.saleStartDate = value;
                saleInformationState.saleStartDateIsInValid = validation.isInValid;
                saleInformationState.saleStartDateValidationMessage = validation.validationError;
                updateSaleInformationState(saleInformationState);
              }}
              startDate={
                moment(saleInformationState.saleStartDate).isValid()
                  ? moment(
                      new Date(saleInformationState.saleStartDate)
                    ).toDate()
                  : null
              }
              minDate={moment(new Date()).toDate()}
              maxDate={
                saleInformationState.saleEndDate ?
                (saleInformationState.saleMethod === "Auction"?
                moment(new Date(saleInformationState.saleEndDate)).subtract(1, "days").toDate()
                : moment(new Date(saleInformationState.saleEndDate)).toDate())
                : null
              }
              isRequired={true}
              isInvalid={saleInformationState.saleStartDateIsInValid}
              validationMessage={
                saleInformationState.saleStartDateValidationMessage
              }
              notShowFormat={true}
              isDisabled={
                !UserUtils.isUserFleetExt() &&
                (saleInformationState.auctionStatus === "Active" ||
                  saleInformationState.auctionStatus === "Preview")
                  ? true
                  : false
              }
              setHolidayYear={(year) => {
                getHolidaysByYear(year);
              }}
              holidayList={holiday?.holidays}
              excludeWeekends={true}
              excludeHolidays={true}
              className={"create-sale-due-dates"}
            />
          </div>
          <div className="grid-col-4">
            <PPMSDatepicker
              id={"fleeSaleEndDate"}
              format={"MM/DD/YYYY"}
              label={"Sale End Date"}
              
              
              display={""}
              updateDate={(value) => {
                let validation = validateFleetStartEndDate(
                  saleInformationState.saleStartDate,
                  value,
                  false,
                  saleInformationState.saleStartDateIsInValid,
                  "Sale End Date",
                  "sale",
                  true,
                  holiday?.holidays
                );
                updateSaleInformationState({
                  saleEndDate: value,
                  saleEndDateIsInValid: validation.isInValid,
                  saleEndDateValidationMessage: validation.validationError,
                });
              }}
              startDate={
                moment(saleInformationState.saleEndDate).isValid()
                  ? moment(new Date(saleInformationState.saleEndDate)).toDate()
                  : null
              }
              minDate={moment(
                new Date(saleInformationState.saleStartDate)
              ).toDate()}
              isRequired={true}
              isInvalid={saleInformationState.saleEndDateIsInValid}
              validationMessage={
                saleInformationState.saleEndDateValidationMessage
              }
              notShowFormat={true}
              isDisabled={true}
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
        <div className="grid-row grid-gap">
          <div className="grid-col-3">
            <PPMSInput
              id={"sale-time"}
              inputType={"text"}
              isDisabled={UserUtils.isUserFleetExt() || (saleInformationState.saleStatus !== "Lotted" ? true : false)}
              label={"Sale Time"}
              isRequired={true}
              onChange={(event) => {
                updateSaleInformationState({
                  saleTime: formatTime(event.target.value),
                  saleTimeIsInValid: false,
                  saleTimeIsValid: false,
                  saleTimeValidationMessage: "",
                });
              }}
              onBlur={(event) => {
                let validation = validateStartEndTime(
                  "Sale Time",
                  event.target.value
                );
                updateSaleInformationState({
                  saleTimeIsInValid: validation.isInvalid,
                  saleTimeIsValid: !validation.isInvalid,
                  saleTimeValidationMessage: validation.validationError,
                });
              }}
              value={saleInformationState.saleTime}
              validationMessage={saleInformationState.saleTimeValidationMessage}
              isInvalid={saleInformationState.saleTimeIsInValid}
              isValid={saleInformationState.saleTimeIsValid}
              maxLength={5}
            />
            <span className="usa-hint">Format: hh:mm CT</span>
          </div>
          <div className="grid-col-3 align-radio">
            <PPMSToggleRadio
              id={"am-pm"}
              isDisabled={UserUtils.isUserFleetExt() || (saleInformationState.saleStatus !== "Lotted" ? true : false)}
              name={"am-pm"}
              options={saleInformationState.saleTimeOptions}
              onChange={(value) => {
                //saleTimeAmPm
                let time = value
                  .filter((item) => item.isSelected === true)
                  .map((item) => {
                    return item.value;
                  });
                updateSaleInformationState({
                  saleTimeAmPm: time.toString(),
                });
              }}
              validationMessage={""}
              isInline={true}
            />
          </div>
        </div>
        <div className="grid-row grid-gap">
          <div className="grid-col-4">
            <PPMSSelect
              id={"fleet-sale-method"}
              identifierKey={"id"}
              identifierValue={"value"}
              name={"sale-method"}
              values={saleInformationState.saleMethodOptions}
              label={"Sale Method"}
              isRequired={true}
              placeholderValue={"Select"}
              selectedValue={saleInformationState.saleMethod}
              onChange={(event) => {
                let valid = event.target.value.length !== 0;
                updateSaleInformationState({
                  saleMethod: event.target.value,
                  saleMethodIsInValid: !valid,
                  saleMethodIsValid: valid,
                  saleMethodValidationMessage: valid
                    ? ""
                    : "Sale Method is Required.",
                });
              }}
              isInvalid={saleInformationState.saleMethodIsInValid}
              isValid={saleInformationState.saleMethodIsValid}
              validationMessage={
                saleInformationState.saleMethodValidationMessage
              }
              disabled={true}
              title={"sale-method"}
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

export default connect(mapStateToProps, mapDispatchToProps)(SaleInformation);
