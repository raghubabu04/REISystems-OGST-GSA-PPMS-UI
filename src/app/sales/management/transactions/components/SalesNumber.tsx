import React, { useContext, useEffect, useState } from "react";
import { PPMSInput } from "../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSSelect } from "../../../../../ui-kit/components/common/select/PPMS-select";
import { SalesTransactionContext } from "../SalesTransactionContext";
import { connect } from "react-redux";
import { contactDTO, pointOfContactSelected } from "../constants/Constants";
import moment from "moment";
import { PPMSButton } from "../../../../../ui-kit/components/common/PPMS-button";
import { PPMSDatepicker } from "../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { isEmpty } from "lodash";
import { PPMSToggleRadio } from "../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { SalesApiService } from "../../../../../api-kit/sales/sales-api-service";
import { saleActions } from "../../../../../_redux/_actions/sale.actions";
import { commonActions } from "../../../../../_redux/_actions/common.actions";
import {
  formatSaleNumber,
  formatTime,
  getFiscalYearEndDate,
  timeToNumber,
} from "../../../../../ui-kit/utilities/FormatUtil";
import { validateTimeByZone } from "../../../../../ui-kit/components/validations/FieldValidations";
import { PPMSAlert } from "../../../../../ui-kit/components/common/PPMS-alert";

interface salesNumberProps {
  user: any;
  holiday?: any;
  getHolidays?: any;
  setPOCDetails?: any;
  zone?: any;
  templateCodes: string[];
}

const SalesNumber = (props: salesNumberProps) => {
  const {
    user,
    holiday,
    getHolidays,
    zone,
    setPOCDetails,
    templateCodes,
  } = props;

  const { salesTransactionState, updateSalesTransactionState } = useContext(
    SalesTransactionContext
  );
  const [validTime, setValidTime] = useState(true);
  const saleService = new SalesApiService();
  useEffect(() => {
    getHolidays(moment().year());
  }, []);

  function createPOCList(value) {
    let state = salesTransactionState;
    let options = salesTransactionState.constants.pointOfContact;
    let pocASCO = { value: "Alternate SCO", id: "POC-ASCO" };
    let pocMS = { value: "Marketing Specialist", id: "POC-MS" };
    switch (value) {
      case pointOfContactSelected.ASCO: {
        if (!containsObject(pocASCO, options)) {
          options.push(pocASCO);
        }
        break;
      }
      case pointOfContactSelected.MS: {
        if (!containsObject(pocMS, options)) {
          options.push(pocMS);
        }
        break;
      }
      case pointOfContactSelected.RSASCO: {
        if (containsObject(pocASCO, options)) {
          removeFromArray(pocASCO, options);
        }
        break;
      }
      case pointOfContactSelected.RSMS: {
        if (containsObject(pocMS, options)) {
          removeFromArray(pocMS, options);
        }
        break;
      }
    }
    state.constants.pointOfContact = options;
    updateSalesTransactionState(state);
  }
  function onChangeSCO({ value }) {
    let state = salesTransactionState;
    state.data.salesNumberDetails.sco.email = value;
    updateSalesTransactionState(state);
  }
  function validateSCO({ value }) {}
  function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === obj.id) {
        return true;
      }
    }

    return false;
  }
  function removeFromArray(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === obj.id) {
        list.splice(i, 1);
        i--;
      }
    }
  }

  const disableGenerateButton = () => {
    let method = salesTransactionState.data.salesNumberDetails.salesMethod;
    let date = salesTransactionState.data.salesNumberDetails.salesDate;
    let dateInvalid = salesTransactionState.validation.saleDateInValid;
    let methodCheck = method === "" || method === "empty";
    if (salesTransactionState.data.salesNumberDetails.salesNumber) {
      return true;
    } else {
      return methodCheck || isEmpty(date) || dateInvalid;
    }
  };
  const getHolidaysByYear = (year) => {
    if (year !== holiday?.year) {
      getHolidays(year);
    }
  };
  const generateSaleNumber = () => {
    let date = moment(salesTransactionState.data.salesNumberDetails.salesDate)
      .format("MM/DD/YYYY")
      .toString();
    let params = {
      zone,
      salesDate: date,
      saleMethod:
        salesTransactionState.data.salesNumberDetails.salesMethodValue,
    };
    saleService
      .getSaleNumber(params)
      .then((res) => {
        let state = salesTransactionState;
        state.data.salesNumberDetails.salesNumber =
          res.data?.salesNumberDetails?.salesNumber;
        state.validation.submitBtnDisable = false;
        updateSalesTransactionState(state);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isWeekDay = (date) => {
    let day = moment(date).day();
    return day !== 0 && day !== 6;
  };

  const isHoliday = (date) => {
    let isHoliday: boolean = false;
    holiday?.holidays.forEach((holidayDate) => {
      if (holidayDate.toString() === date.toString()) {
        isHoliday = true;
      }
    });
    return isHoliday;
  };

  return (
    <>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSSelect
            id={"sale-method"}
            identifierKey={"id"}
            identifierValue={"value"}
            name={"sale-method"}
            values={salesTransactionState.constants.saleMethod}
            label={"Sale Method"}
            isRequired={true}
            placeholderValue={"Select"}
            selectedValue={
              salesTransactionState.data.salesNumberDetails.salesMethod
            }
            onChange={(event) => {
              let id = event.target.options[event.target.selectedIndex].id;
              let value = event.target.options[event.target.selectedIndex].text;
              let state = salesTransactionState;
              state.data.salesNumberDetails.salesMethod = id;
              state.data.salesNumberDetails.salesMethodValue = value;
              if (id === "internet" || id === "vas" || id === "buynow") {
                state.required.paymentDueDateIsRequired = true;
                state.required.removalDueDateIsRequired = true;
                state.data.salesNumberDetails.paymentDueDate =
                  state.data.salesNumberDetails.salesDate;
                state.data.salesNumberDetails.removalDueDate =
                  state.data.salesNumberDetails.salesDate;
              }
              if (
                id === "retail" ||
                id === "sasp" ||
                id === "negotiated" ||
                id === "term" ||
                id === "sealed bid" ||
                id === "live"
              ) {
                state.required.templateCodeIsRequired = false;
                state.required.paymentDueDateIsRequired = false;
                state.required.removalDueDateIsRequired = false;
                state.data.salesNumberDetails.paymentDueDate = "";
                state.data.salesNumberDetails.removalDueDate = "";
              }
              updateSalesTransactionState(state);
            }}
            disabled={salesTransactionState.readonly.saleMethodsIsDisabled}
            title={"sale-method"}
          />
          <PPMSAlert
            isAlertSlim={true}
            id={"icn-verification-success-msg"}
            show={
              salesTransactionState.data.salesNumberDetails.salesMethod ===
              "negotiated"
                ? true
                : false
            }
            alertBody={"Please ensure the award is not over $14,999.99"}
            alertClassName={"email-verification-error"}
            alertVariant={"warning"}
            alertKey={"email-verification-error"}
          />
        </div>
        <div className="grid-col-3">
          <PPMSDatepicker
            id={"sale-date"}
            format={"MM/DD/YYYY"}
            label={"Sale Start Date"}
            display={""}
            updateDate={(value) => {
              if (value !== null) {
                let state = salesTransactionState;
                var updatedYear = getFiscalYearEndDate(value?.toString());
                var before = getFiscalYearEndDate(
                  state.data.salesNumberDetails.salesDate
                    ? state.data.salesNumberDetails.salesDate
                    : moment(new Date(Date.now())).toDate()
                );
                state.validation.saleWeekendDate = false;
                if (!isWeekDay(value) || isHoliday(value)) {
                  state.validation.saleWeekendDate = true;
                  return;
                }
                if (moment(value).isValid()) {
                  if (updatedYear == before && isWeekDay(value)) {
                    state.validation.saleDateInValid = false;
                    state.data.salesNumberDetails.salesDate = value.toString();
                    if (
                      new Date(state.data.salesNumberDetails.paymentDueDate) <
                      value
                    ) {
                      state.data.salesNumberDetails.paymentDueDate = value.toString();
                    }
                    if (
                      new Date(state.data.salesNumberDetails.removalDueDate) <
                      value
                    ) {
                      state.data.salesNumberDetails.removalDueDate = value.toString();
                    }
                  } else {
                    state.validation.saleDateInValid = true;
                    state.validation.saleDateValidationMessage =
                      "Date entered cannot be in the next Fiscal Year";
                  }
                } else {
                  state.validation.saleDateInValid = true;
                  state.validation.saleDateValidationMessage =
                    "Date is Invalid";
                }
                updateSalesTransactionState(state);
              }
            }}
            startDate={
              moment(
                salesTransactionState.data.salesNumberDetails.salesDate
              ).isValid()
                ? moment(
                    new Date(
                      salesTransactionState.data.salesNumberDetails.salesDate
                    )
                  ).toDate()
                : null
            }
            minDate={moment(new Date(Date.now())).toDate()}
            isRequired={true}
            notShowFormat={true}
            isDisabled={salesTransactionState.readonly.saleDateIsDisabled}
            excludeWeekends={true}
            excludeHolidays={true}
            isInvalid={salesTransactionState.validation.saleDateInValid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={
              salesTransactionState.validation.saleDateValidationMessage
            }
          />
        </div>
        <div className="grid-col-2">
          <PPMSInput
            id={"sale-time"}
            inputType={"text"}
            isDisabled={salesTransactionState.readonly.saleTimeIsReadOnly}
            label={"Sale Time"}
            isRequired={true}
            onChange={(event) => {
              let state = salesTransactionState;
              let time = event?.target?.value;
              if (
                time.length == 2 &&
                event.nativeEvent.inputType == "insertText"
              ) {
                state.data.salesNumberDetails.salesTime = formatTime(
                  timeToNumber(time)
                );
              } else {
                state.data.salesNumberDetails.salesTime = time;
              }
              updateSalesTransactionState(state);
            }}
            onBlur={(event) => {
              let state = salesTransactionState;
              let validation = validateTimeByZone(
                "Sale Start Time",
                event?.target?.value,
                state.other.amPm,
                true,
                zone
              );
              state.validation.saleTimeisInvalid = validation.isInvalid;
              state.validation.salesTimeValidationMessage =
                validation.validationError;
              updateSalesTransactionState(state);
            }}
            value={salesTransactionState.data.salesNumberDetails.salesTime?.substr(
              0,
              5
            )}
            validationMessage={
              salesTransactionState.validation.salesTimeValidationMessage
            }
            isInvalid={
              !validTime || salesTransactionState.validation.saleTimeisInvalid
            }
          />
          <span className="usa-hint">Format: hh:mm CT</span>
        </div>
        <div className="grid-col-3 align-radio">
          <PPMSToggleRadio
            id={"am-pm"}
            isDisabled={salesTransactionState.readonly.timeToggleIsDisabled}
            name={"am-pm"}
            options={salesTransactionState.constants.time}
            onChange={(value) => {
              let state = salesTransactionState;
              let time = value
                .filter((item) => item.isSelected === true)
                .map((item) => {
                  return item.value;
                });
              console.log(time, salesTransactionState.constants.time, zone);
              state.other.amPm = time;
              let validation = validateTimeByZone(
                "Sale Start Time",
                state.data.salesNumberDetails.salesTime,
                time,
                true,
                zone
              );
              state.validation.saleTimeisInvalid = validation.isInvalid;
              state.validation.salesTimeValidationMessage =
                validation.validationError;
              updateSalesTransactionState(state);
            }}
            validationMessage={""}
            isInline={true}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-number"}
            inputType={"text"}
            isDisabled={true}
            label={"Sale Number"}
            isReadOnly={true}
            isRequired={true}
            value={
              salesTransactionState.data.salesNumberDetails.salesNumber
                ? formatSaleNumber(
                    salesTransactionState.data.salesNumberDetails.salesNumber
                  )
                : ""
            }
          />
        </div>
        <div className="grid-col-6 generate-button">
          <PPMSButton
            id={"generate-sale-number"}
            variant={"primary"}
            isDisabled={disableGenerateButton()}
            onPress={generateSaleNumber}
            label={"Generate Sale Number"}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSInput
            id={"sale-description"}
            inputType={"text"}
            isDisabled={false}
            label={"Sale Description"}
            isRequired={
              salesTransactionState.required.saleDescriptionIsRequired
            }
            value={
              salesTransactionState.data.salesNumberDetails.salesDescription
            }
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.salesNumberDetails.salesDescription =
                event.target.value;
              if (event.target.value === "") {
                state.validation.salesDescInvalid = true;
              } else {
                state.validation.salesDescInvalid = false;
                if (
                  !state.validation.saleTimeisInvalid &&
                  (state.required.paymentDueDateIsRequired
                    ? !state.validation.paymentDueDateInvalid
                    : true) &&
                  (state.required.removalDueDateIsRequired
                    ? !state.validation.removalDueDateInvalid
                    : true) &&
                  (state.data.salesNumberDetails.templateCode
                    ? !state.validation.salesTemplateCodeInvalid
                    : true) &&
                  (state.required.alternateSCOIsRequired
                    ? !state.validation.alternateSCOInvalid
                    : true)
                ) {
                  state.validation.submitBtnDisable = false;
                }
              }
              updateSalesTransactionState(state);
            }}
            maxLength={25}
            isInvalid={salesTransactionState.validation.salesDescInvalid}
            validationMessage={
              salesTransactionState.validation.salesDescValidationMsg
            }
            isReadOnly={salesTransactionState.other.isReadOnly}
          />
          <span className="usa-hint">Limit: 25 characters</span>
        </div>
        <div className="grid-col-4">
          <PPMSInput
            id={"template-code"}
            inputType={"text"}
            isDisabled={salesTransactionState.other.isReadOnly}
            label={"Template Code"}
            isRequired={false}
            // isRequired={salesTransactionState.required.templateCodeIsRequired}
            value={salesTransactionState.data.salesNumberDetails.templateCode}
            onChange={(event) => {
              let state = salesTransactionState;
              state.data.salesNumberDetails.templateCode = event.target.value;
              if (
                event.target.value !== "" &&
                templateCodes.indexOf(event.target.value) === -1
              ) {
                state.validation.salesTemplateCodeInvalid = true;
              } else {
                state.validation.salesTemplateCodeInvalid = false;
                if (
                  !state.validation.saleTimeisInvalid &&
                  !state.validation.salesDescInvalid &&
                  (state.required.paymentDueDateIsRequired
                    ? !state.validation.paymentDueDateInvalid
                    : true) &&
                  (state.required.removalDueDateIsRequired
                    ? !state.validation.removalDueDateInvalid
                    : true) &&
                  (state.required.alternateSCOIsRequired
                    ? !state.validation.alternateSCOInvalid
                    : true)
                ) {
                  state.validation.submitBtnDisable = false;
                }
              }
              updateSalesTransactionState(state);
            }}
            maxLength={4}
            isInvalid={
              salesTransactionState.validation.salesTemplateCodeInvalid
            }
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-4">
          <PPMSDatepicker
            id={"payment-due-date"}
            format={"MM/DD/YYYY"}
            label={"Payment Due Date"}
            display={""}
            updateDate={(value) => {
              if (value !== null) {
                let state = salesTransactionState;
                let updatedYear = getFiscalYearEndDate(value.toString());
                let before = getFiscalYearEndDate(
                  state.data.salesNumberDetails.salesDate
                );
                if (!isWeekDay(value) || isHoliday(value)) {
                  return;
                }
                if (updatedYear == before && isWeekDay(value)) {
                  state.data.salesNumberDetails.paymentDueDate = value.toString();
                }
                if (value === "" && state.required.paymentDueDateIsRequired) {
                  state.validation.paymentDueDateInvalid = true;
                } else {
                  state.validation.paymentDueDateInvalid = false;
                  if (
                    !state.validation.saleTimeisInvalid &&
                    !state.validation.salesDescInvalid &&
                    !state.validation.removalDueDateInvalid &&
                    !state.validation.salesTemplateCodeInvalid &&
                    (state.required.alternateSCOIsRequired
                      ? !state.validation.alternateSCOInvalid
                      : true)
                  ) {
                    state.validation.submitBtnDisable = false;
                  }
                }
                updateSalesTransactionState(state);
              }
            }}
            startDate={
              moment(
                salesTransactionState.data.salesNumberDetails.paymentDueDate
              ).isValid()
                ? moment(
                    new Date(
                      salesTransactionState.data.salesNumberDetails.paymentDueDate
                    )
                  ).toDate()
                : null
            }
            minDate={moment(
              new Date(salesTransactionState.data.salesNumberDetails.salesDate)
            ).toDate()}
            maxDate={moment(
              new Date(
                salesTransactionState.data.salesNumberDetails.removalDueDate
              )
            ).toDate()}
            // isRequired={true}
            isRequired={salesTransactionState.required.paymentDueDateIsRequired}
            isInvalid={salesTransactionState.validation.paymentDueDateInvalid}
            validationMessage={
              salesTransactionState.validation.paymentDueDateValidationMsg
            }
            notShowFormat={true}
            infoTipContent={"Payment date cannot be after Removal Date"}
            isDisabled={salesTransactionState.other.isReadOnly}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            excludeWeekends={true}
            excludeHolidays={true}
            className={"create-sale-due-dates"}
          />
        </div>
        <div className="grid-col-4">
          <PPMSDatepicker
            id={"removal-due-date"}
            format={"MM/DD/YYYY"}
            label={"Removal Due Date"}
            display={""}
            updateDate={(value) => {
              if (value !== null) {
                let state = salesTransactionState;
                let updatedYear = getFiscalYearEndDate(value.toString());
                let before = getFiscalYearEndDate(
                  state.data.salesNumberDetails.salesDate
                );
                if (!isWeekDay(value) || isHoliday(value)) {
                  return;
                }
                if (updatedYear == before && isWeekDay(value)) {
                  state.data.salesNumberDetails.removalDueDate = value.toString();
                }
                if (value === "" && state.required.removalDueDateIsRequired) {
                  state.validation.removalDueDateInvalid = true;
                } else {
                  state.validation.removalDueDateInvalid = false;
                  if (
                    !state.validation.saleTimeisInvalid &&
                    !state.validation.salesDescInvalid &&
                    !state.validation.paymentDueDateInvalid &&
                    !state.validation.salesTemplateCodeInvalid &&
                    (state.required.alternateSCOIsRequired
                      ? !state.validation.alternateSCOInvalid
                      : true)
                  ) {
                    state.validation.submitBtnDisable = false;
                  }
                }
                updateSalesTransactionState(state);
              }
            }}
            startDate={
              moment(
                salesTransactionState.data.salesNumberDetails.removalDueDate
              ).isValid()
                ? moment(
                    new Date(
                      salesTransactionState.data.salesNumberDetails.removalDueDate
                    )
                  ).toDate()
                : null
            }
            minDate={moment(
              new Date(
                salesTransactionState.data.salesNumberDetails.paymentDueDate
              )
            ).toDate()}
            // isRequired={true}
            isRequired={salesTransactionState.required.removalDueDateIsRequired}
            isInvalid={salesTransactionState.validation.removalDueDateInvalid}
            validationMessage={
              salesTransactionState.validation.removalDueDateValidationMsg
            }
            notShowFormat={true}
            infoTipContent={"Removal date cannot be before Payment Date"}
            isDisabled={salesTransactionState.other.isReadOnly}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            excludeWeekends={true}
            excludeHolidays={true}
            className={"create-sale-due-dates"}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className="grid-col-3">
          <PPMSInput
            id={"sco"}
            inputType={"text"}
            isDisabled={true}
            label={"SCO"}
            // isRequired={true}
            isRequired={salesTransactionState.required.scoIsRequired}
            validationMessage={salesTransactionState.validation.soc}
            value={`${user.firstName} ${user.lastName}`}
            onBlur={(event) => validateSCO(event.target)}
            onChange={(event) => onChangeSCO(event.target)}
          />
        </div>
        <div className="grid-col-4">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-alternate-sco"}
            name={"alternate-sco"}
            selectName={"alternate-sco"}
            values={salesTransactionState?.constants?.alternateSCO}
            label={"Alternate SCO"}
            isRequired={salesTransactionState.required.alternateSCOIsRequired}
            placeholderValue={"Select"}
            selectedValue={
              salesTransactionState?.data?.salesNumberDetails?.alternateSCO
                ?.email
            }
            onChange={(event) => {
              let value = event.target.options[event.target.selectedIndex].id;
              let state = salesTransactionState;
              if (event.target.name === "alternate-sco" && value === "empty") {
                state.data.salesNumberDetails.alternateSCO = contactDTO();
                state.data.salesNumberDetails.pointOfContact =
                  pointOfContactSelected.SCO;
                updateSalesTransactionState(state);
                createPOCList(pointOfContactSelected.RSASCO);
              } else {
                salesTransactionState?.constants?.alternateSCO
                  .filter((item) => item.email === value)
                  .map((element) => {
                    state.data.salesNumberDetails.alternateSCO.firstName =
                      element.firstName;
                    state.data.salesNumberDetails.alternateSCO.lastName =
                      element.lastName;
                    state.data.salesNumberDetails.alternateSCO.phone =
                      element.phone;
                  });
                state.data.salesNumberDetails.alternateSCO.email = value;
                updateSalesTransactionState(state);
                createPOCList(pointOfContactSelected.ASCO);
                state.validation.alternateSCOInvalid = false;
                if (
                  !state.validation.saleTimeisInvalid &&
                  !state.validation.salesDescInvalid &&
                  (state.required.paymentDueDateIsRequired
                    ? !state.validation.paymentDueDateInvalid
                    : true) &&
                  (state.required.removalDueDateIsRequired
                    ? !state.validation.removalDueDateInvalid
                    : true) &&
                  (state.data.salesNumberDetails.templateCode
                    ? !state.validation.salesTemplateCodeInvalid
                    : true)
                ) {
                  state.validation.submitBtnDisable = false;
                }
              }
            }}
            isInvalid={salesTransactionState.validation.alternateSCOInvalid}
            validationMessage={
              salesTransactionState.validation.alternateSCOValidationMsg
            }
            disabled={salesTransactionState.other.isReadOnly}
          />
        </div>
        <div className="grid-col-5">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"select-marketing-specialist"}
            name={"marketing-specialist"}
            selectName={"marketing-specialist"}
            values={salesTransactionState?.constants?.marketingSpecialist}
            label={"Marketing Specialist"}
            // isRequired={false}
            isRequired={
              salesTransactionState.required.marketingSpecialistIsRequired
            }
            placeholderValue={"Select"}
            selectedValue={
              salesTransactionState?.data?.salesNumberDetails
                ?.marketingSpecialist?.email
            }
            onChange={(event) => {
              let value = event.target.options[event.target.selectedIndex].id;
              let state = salesTransactionState;
              if (
                event.target.name === "marketing-specialist" &&
                value === "empty"
              ) {
                state.data.salesNumberDetails.marketingSpecialist = contactDTO();
                state.data.salesNumberDetails.pointOfContact =
                  pointOfContactSelected.SCO;
                updateSalesTransactionState(state);
                createPOCList(pointOfContactSelected.RSMS);
              } else {
                salesTransactionState?.constants?.marketingSpecialist
                  .filter((item) => (item.email = value))
                  .map((element) => {
                    state.data.salesNumberDetails.marketingSpecialist.firstName =
                      element.firstName;
                    state.data.salesNumberDetails.marketingSpecialist.lastName =
                      element.lastName;
                  });
                state.data.salesNumberDetails.marketingSpecialist.email = value;
                updateSalesTransactionState(state);
                createPOCList(pointOfContactSelected.MS);
              }
            }}
            disabled={salesTransactionState.other.isReadOnly}
          />
        </div>
      </div>
      <div className="grid-row grid-gap-4">
        <div className="grid-col-5">
          <PPMSSelect
            identifierKey={"id"}
            identifierValue={"value"}
            id={"point-of-contact"}
            name={"point-of-contact"}
            selectName={"point-of-contact"}
            values={salesTransactionState?.constants?.pointOfContact}
            label={"Point of Contact"}
            // isRequired={true}
            isRequired={salesTransactionState.required.pointOfContactIsRequired}
            selectedValue={
              salesTransactionState?.data?.salesNumberDetails?.pointOfContact
            }
            onChange={(event) => {
              let value =
                event.target.options[event.target.selectedIndex].value;
              setPOCDetails(value);
            }}
            disabled={salesTransactionState.other.isReadOnly}
          />
        </div>
        <div className="grid-col-5">
          <PPMSToggleRadio
            id={"dedicated_register"}
            isDisabled={salesTransactionState.other.isReadOnly}
            name={"dedicated_register"}
            label={"Dedicated Register"}
            options={salesTransactionState.dedicatedRegisterOptions}
            onChange={(value) => {
              let state = salesTransactionState;
              let dedicatedRegister = value
                .filter((item) => item.isSelected === true)
                .map((item) => {
                  return item.value;
                });
              state.data.salesNumberDetails.isDedicatedRegister =
                dedicatedRegister == "Yes" ? true : false;
              updateSalesTransactionState(state);
            }}
            validationMessage={""}
            isInline={true}
            isInvalid={false}
            isRequired={true}
          />
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  roles: state.authentication.roles,
  sale: state.sale,
  holiday: state.common.holiday,
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSaleInfo: (saleId, saleNumber, saleAction, zone) =>
      dispatch(
        saleActions.updateSaleInfo(saleId, saleNumber, saleAction, zone)
      ),
    getHolidays: (year) => {
      dispatch(commonActions.getHolidays(year));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SalesNumber);
