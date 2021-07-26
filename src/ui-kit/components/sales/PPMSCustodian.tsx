import React, { useState } from "react";
import { PPMSTextArea } from "../common/input/PPMS-textarea";
import { MdEmail } from "react-icons/md";
import { ImPhone } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { PPMSButton } from "../common/PPMS-button";
import { Table } from "./common/Common";
import moment from "moment";
import { PPMSDatepicker } from "../common/datepicker/PPMS-datepicker";
import { PPMSInput } from "../common/input/PPMS-input";
import { PPMSToggleRadio } from "../common/toggle/PPMS-toggle";
import {
  formatPhone,
  formatTime,
  timeToNumber,
} from "../../utilities/FormatUtil";
import {
  fromTime,
  toTime,
} from "../../../app/sales/management/transactions/constants/Constants";
import { addDays } from "../common/datepicker-v2/utils/Utils";
import { isEmpty } from "lodash";
import PPMSErrorMessage from "../common/form/PPMS-error-message";
import { validateDateTimeRange } from "../validations/FieldValidations";
interface PPMSCustodianProps {
  columns;
  custodian;
  index;
  saleDate?: any;
  agencyBureau?: any;
  editCustodian?: any;
  handleSaveInspection?: any;
  addToast?: any;
  setHolidayYear?: any;
  holidayList?: any;
  actionDisabled?: boolean;
  submitCustodian?: any;
  submitToCustodianDisabled?: any;
}
function PPMSCustodian(props: PPMSCustodianProps) {
  const {
    columns,
    custodian,
    index,
    saleDate,
    agencyBureau,
    editCustodian,
    handleSaveInspection,
    actionDisabled,
    submitCustodian,
    submitToCustodianDisabled,
  } = props;
  const info = custodian?.custodianInformation;
  const address = custodian?.custodianInformation?.addressDTO;
  return (
    <div
      className={`grid-row ${index ? 0 : "border-top-2px"} border-bottom-2px`}
    >
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-9"}>
          <div className={"grid-row"}>
            <div className={"grid-col-12"}>
              <h3 className={"custodian-h3"}>
                {info?.firstName} {info?.lastName} |{" "}
                <span className={"custodian"}>
                  {address?.addressLine1 && address?.addressLine1.trim() !== ""
                    ? `${address.addressLine1.toLowerCase()}, `
                    : ""}
                  {address?.addressLine2 && address?.addressLine2.trim() !== ""
                    ? `${address.addressLine2.toLowerCase()}, `
                    : ""}
                  {address?.addressLine3 && address?.addressLine3.trim() !== ""
                    ? `${address.addressLine3.toLowerCase()}, `
                    : ""}
                  {address?.city && address?.city.trim() !== ""
                    ? `${address.city.toLowerCase()}, `
                    : ""}
                  {address?.state && address?.state.trim() !== ""
                    ? address.state
                    : ""}{" "}
                  {address?.zipCode && address?.zipCode.trim() !== ""
                    ? address.zipCode
                    : ""}{" "}
                  {address?.zipExtn && address?.zipExtn.trim() !== ""
                    ? `-${address.zipExtn}`
                    : ""}{" "}
                  <PPMSButton
                    variant={"link"}
                    id={"edit-custodian"}
                    label={""}
                    onPress={() => {
                      editCustodian(custodian);
                    }}
                    icon={<FaEdit size={"1.5em"} />}
                    isDisabled={actionDisabled}
                  />
                </span>
                <br />
              </h3>
            </div>
            <div className={"grid-col-12"}>
              <h4 className={"custodian-h4"}>
                {agencyBureau?.agencyBureau && (
                  <span className={"custodian"}>
                    {agencyBureau?.agencyBureau}{" "}
                  </span>
                )}
              </h4>
              <h4 className={"custodian-h4"}>
                {info?.email && (
                  <span className={"custodian-contact"}>
                    <MdEmail size={"1.2em"} /> {info.email.toLowerCase()}
                  </span>
                )}{" "}
                {info?.phone && (
                  <span className={"custodian-contact"}>
                    <ImPhone size={"1.2em"} />{" "}
                    {formatPhone(info.phone.toString())}
                  </span>
                )}
              </h4>
            </div>
          </div>
        </div>
        <div className={"grid-col-3"}>
          <div className={"float-right add-to-lot-label"}>
            <PPMSButton
              id={"submit-to-custodian"}
              label={"Submit to Custodian"}
              onPress={() => {
                submitCustodian(custodian);
              }}
              isDisabled={submitToCustodianDisabled(custodian)}
            />
          </div>
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-7"}>
          <Inspection
            custodian={custodian}
            saleDate={saleDate}
            index={index}
            handleSaveInspection={handleSaveInspection}
            addToast={props.addToast}
            holidayList={props.holidayList}
            setHolidayYear={props.setHolidayYear}
            actionDisabled={actionDisabled}
          />
        </div>
        {custodian?.lotDTOs ? (
          <div className={"grid-col-5 margin-top-5"}>
            <LotList columns={columns} data={custodian.lotDTOs} index={index} />
          </div>
        ) : undefined}
      </div>
    </div>
  );
}

const Inspection = ({
  custodian,
  saleDate,
  index,
  handleSaveInspection,
  addToast,
  holidayList,
  setHolidayYear,
  actionDisabled,
}) => {
  const [inspectionFrom, setInspectionFrom] = useState("");
  const [inspectionTo, setInspectionTo] = useState("");
  const [inspectionFromInvalid, setInspectionFromInvalid] = useState(false);
  const [inspectionToInavlid, setInspectionToInvalid] = useState(false);
  const [inspectionFromValidMsg, setInspectionFromValidMsg] = useState(
    "Invalid date"
  );
  const [inspectionToValidMsg, setInspectionToValidMsg] = useState(
    "Invalid date"
  );
  const [inspectionFromTime, setInspectionFromTime] = useState("");
  const [inspectionToTime, setInspectionToTime] = useState("");
  const [inspectionFromAmPm, setInspectionFromAmPm] = useState("");
  const [inspectionToAmPm, setInspectionToAmPm] = useState("");
  const [inspectionInstruction, setInspectionInstruction] = useState(
    custodian.instructions
  );
  const [inspectionFromTimeInvalid, setInspectionFromTimeInvalid] = useState(
    false
  );
  const setInspectionDetails = () => {
    setInspectionInstruction(custodian.instructions);
    setInspectionFrom(custodian.inspectionFromDate);
    setInspectionTo(custodian.inspectionToDate);
    setInspectionFromTime(custodian.inspectionFromTime);
    setInspectionToTime(custodian.inspectionToTime);
    setInspectionFromAmPm(custodian.inspectionFromTime?.substr(5, 7));
    setInspectionToAmPm(custodian.inspectionToTime?.substr(5, 7));
    updateTimeOptionsFrom(
      getTimeOptions(index, "from", custodian.inspectionFromTime?.substr(5, 7))
    );
    updateTimeOptionsTo(
      getTimeOptions(index, "to", custodian.inspectionToTime?.substr(5, 7))
    );
  };

  React.useEffect(() => {
    setInspectionDetails();
  }, [custodian]);

  const getTimeOptions = (index, type, amPm) => {
    return [
      {
        id: `${type}-am-${index}`,
        value: "AM",
        isSelected: amPm == "AM",
      },
      {
        id: `${type}-pm-${index}`,
        value: "PM",
        isSelected: amPm == "PM",
      },
    ];
  };
  const [timeOptionsFrom, updateTimeOptionsFrom] = useState(
    getTimeOptions(index, "from", inspectionFromAmPm)
  );
  const [timeOptionsTo, updateTimeOptionsTo] = useState(
    getTimeOptions(index, "to", inspectionToAmPm)
  );
  const [
    inspectionFromTimeValidationMsg,
    setInspectionFromTimeValidationMsg,
  ] = useState("");
  const [inspectionToTimeInvalid, setInspectionToTimeInvalid] = useState(false);
  const [
    inspectionToTimeValidationMsg,
    setInspectionToTimeValidationMsg,
  ] = useState("");

  const timeValidation = (time) => {
    let ti = /^(1[0-2]|0?[1-9]):[0-5][0-9]$/;
    return ti.test(time);
  };
  const checkTimeValidation = (time) => {
    let check = timeValidation(time.substr(0, 5));
    if (!check) {
      setInspectionToTimeInvalid(true);
      setInspectionToTimeValidationMsg("Invalid time");
    } else {
      setInspectionToTimeInvalid(false);
      setInspectionToTimeValidationMsg("");
    }
  };

  return (
    <>
      <div>
        {" "}
        <PPMSTextArea
          isInvalid={false}
          label={"Inspection Instructions"}
          id={`inspection-instructions-${index}`}
          isRequired={true}
          isDisabled={actionDisabled}
          value={inspectionInstruction ? inspectionInstruction : ""}
          maxLength={500}
          onChange={(event) => {
            setInspectionInstruction(event.target.value);
          }}
        />
      </div>
      <div className="grid-row grid-gap-2">
        <div className="grid-col-6">
          <PPMSDatepicker
            id={`inspection-from-date-${index}`}
            format={"MM/DD/YYYY"}
            label={"Inspection From Date"}
            display={""}
            updateDate={(value) => {
              if (value !== null) {
                setInspectionFrom(value);
                setInspectionFromInvalid(false);
                setInspectionToTimeInvalid(false);
                setInspectionToTimeValidationMsg("");
              }
            }}
            placeholder={""}
            startDate={
              inspectionFrom ? moment(new Date(inspectionFrom)).toDate() : null
            }
            minDate={moment(new Date(saleDate)).toDate()}
            isRequired={true}
            notShowFormat={true}
            setHolidayYear={setHolidayYear}
            holidayList={holidayList}
            excludeWeekends={true}
            excludeHolidays={true}
            isDisabled={actionDisabled}
            isInvalid={inspectionFromInvalid}
            validationMessage={inspectionFromValidMsg}
          />
        </div>
        <div className="grid-col-6">
          <PPMSDatepicker
            id={`inspection-to-date-${index}`}
            format={"MM/DD/YYYY"}
            label={"Inspection To Date"}
            display={""}
            updateDate={(value) => {
              if (value !== null) {
                setInspectionTo(value);
                setInspectionToInvalid(false);
                setInspectionToTimeInvalid(false);
                setInspectionToTimeValidationMsg("");
              }
            }}
            startDate={
              inspectionTo ? moment(new Date(inspectionTo)).toDate() : null
            }
            minDate={moment(new Date(inspectionFrom)).toDate()}
            maxDate={addDays(moment(new Date(saleDate)).toDate(), 15)}
            isRequired={true}
            notShowFormat={true}
            setHolidayYear={setHolidayYear}
            holidayList={holidayList}
            excludeWeekends={true}
            excludeHolidays={true}
            isInvalid={inspectionToInavlid}
            validationMessage={inspectionToValidMsg}
            isDisabled={actionDisabled}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-2"}>
        <div className={"grid-col-6"}>
          <div className={"grid-row"}>Inspection From Time</div>
          <div className={"grid-row grid-gap-2"}>
            <div className={"grid-col-4"}>
              <PPMSInput
                id={`inspection-from-time-${index}`}
                inputType={"text"}
                isDisabled={actionDisabled}
                isRequired={true}
                onChange={(event) => {
                  let time = event?.target?.value;
                  if (
                    time.length == 2 &&
                    event.nativeEvent.inputType == "insertText"
                  ) {
                    setInspectionFromTime(formatTime(timeToNumber(time)));
                  } else {
                    setInspectionFromTime(time);
                  }
                }}
                onBlur={() => {
                  let check = timeValidation(inspectionFromTime);
                  if (!check) {
                    setInspectionFromTimeInvalid(true);
                    setInspectionFromTimeValidationMsg("Invalid time");
                  } else {
                    setInspectionFromTimeInvalid(false);
                    setInspectionFromTimeValidationMsg("");
                  }
                }}
                isInvalid={inspectionFromTimeInvalid}
                validationMessage={""}
                value={inspectionFromTime?.substr(0, 5)}
                maxLength={5}
              />
            </div>
            <div className={"grid-col-8"}>
              <PPMSToggleRadio
                id={`inspection-from-am-pm-${index}`}
                isDisabled={actionDisabled}
                name={`inspection-from-am-pm-${index}`}
                options={timeOptionsFrom}
                onChange={(value) => {
                  let time = value
                    .filter((item) => item.isSelected === true)
                    .map((item) => {
                      return item.value;
                    });
                  updateTimeOptionsFrom(value);
                  setInspectionFromAmPm(time);
                }}
                validationMessage={""}
                isInline={true}
              />
            </div>
          </div>
          <div className={"grid-row"}>
            <div className={"grid-col"}>
              <span className="usa-hint">Format: hh:mm CT</span>
              <PPMSErrorMessage id={"errorMessage-search-text"}>
                {inspectionFromTimeValidationMsg}
              </PPMSErrorMessage>
            </div>
          </div>
        </div>
        <div className={"grid-col-6"}>
          <div className={"grid-row"}>Inspection To Time</div>
          <div className={"grid-row grid-gap-2"}>
            <div className={"grid-col-4"}>
              <PPMSInput
                id={`inspection-to-time-${index}`}
                inputType={"text"}
                isDisabled={actionDisabled}
                isRequired={true}
                onChange={(event) => {
                  let time = event?.target?.value;
                  if (
                    time.length == 2 &&
                    event.nativeEvent.inputType == "insertText"
                  ) {
                    setInspectionToTime(formatTime(timeToNumber(time)));
                  } else {
                    setInspectionToTime(time);
                  }
                }}
                onBlur={() => {
                  checkTimeValidation(inspectionToTime);
                }}
                isInvalid={inspectionToTimeInvalid}
                validationMessage={""}
                value={inspectionToTime?.substr(0, 5)}
                maxLength={5}
              />
            </div>
            <div className={"grid-col-8"}>
              <PPMSToggleRadio
                id={`inspection-to-am-pm-${index}`}
                isDisabled={actionDisabled}
                name={`inspection-to-am-pm-${index}`}
                options={timeOptionsTo}
                onChange={(value) => {
                  let time = value
                    .filter((item) => item.isSelected === true)
                    .map((item) => {
                      return item.value;
                    });
                  setInspectionToAmPm(time);
                  updateTimeOptionsTo(value);
                  checkTimeValidation(inspectionToTime);
                }}
                validationMessage={""}
                isInline={true}
              />
            </div>
          </div>
          <div className={"grid-row"}>
            <div className={"grid-col"}>
              <span className="usa-hint">Format: hh:mm CT</span>
              <PPMSErrorMessage id={"errorMessage-search-text"}>
                {inspectionToTimeValidationMsg}
              </PPMSErrorMessage>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className={"grid-row"}>
        <div className={"grid-col-12"}>
          <PPMSButton
            id={`save-inspection-${index}`}
            label={"Save Inspection"}
            onPress={() => {
              if (
                moment(new Date(inspectionFrom)).toDate().toString() !== null
              ) {
                if (
                  moment(new Date(inspectionFrom)).isBefore(
                    moment(new Date(saleDate))
                  )
                ) {
                  setInspectionFromInvalid(true);
                  setInspectionFromValidMsg(
                    "Inspection from date shouldn't be less than Sale date"
                  );
                } else if (
                  isEmpty(moment(new Date(inspectionTo)).toDate().toString())
                ) {
                  setInspectionToInvalid(true);
                  setInspectionToValidMsg("Please enter a date");
                } else if (isEmpty(inspectionFromTime)) {
                  setInspectionFromTimeInvalid(true);
                  setInspectionFromTimeValidationMsg("Please enter a time");
                } else if (isEmpty(inspectionToTime)) {
                  setInspectionToTimeInvalid(true);
                  setInspectionToTimeValidationMsg("Please enter a time");
                } else if (
                  inspectionFromTimeInvalid ||
                  inspectionToInavlid ||
                  inspectionToTimeInvalid ||
                  inspectionFromInvalid
                ) {
                  addToast();
                } else {
                  let validation = validateDateTimeRange(
                    "Inspection From Date Time",
                    "Inspection To Date Time",
                    moment(inspectionFrom).format("MM/DD/YYYY"),
                    inspectionFromTime.substr(0, 5).toString(),
                    inspectionFromAmPm,
                    true,
                    moment(inspectionTo).format("MM/DD/YYYY"),
                    inspectionToTime.substr(0, 5).toString(),
                    inspectionToAmPm,
                    true
                  );
                  setInspectionToTimeInvalid(validation.isInvalid);
                  setInspectionToTimeValidationMsg(validation.validationError);
                  if (!validation.isInvalid) {
                    handleSaveInspection(
                      custodian.lotCustodianId,
                      inspectionInstruction,
                      inspectionFrom,
                      inspectionTo,
                      inspectionFromTime,
                      inspectionFromAmPm,
                      inspectionToTime,
                      inspectionToAmPm
                    );
                  }
                }
              }
            }}
            isDisabled={actionDisabled}
          />
        </div>
      </div>
      <br />
    </>
  );
};

const LotList = ({ columns, data, index }) => {
  return (
    <>
      <div>
        <Table columns={columns} data={data} index={index} hideHeader={false} />
      </div>
    </>
  );
};

export default PPMSCustodian;
