import React from "react";
import { PPMSDatepicker } from "../../../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import { PPMSInput } from "../../../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSTextArea } from "../../../../../../../ui-kit/components/common/input/PPMS-textarea";
import { PPMSAlert } from "../../../../../../../ui-kit/components/common/PPMS-alert";

interface OpenHouseProps {
  openHouseDetail: any;
  updateOpenHouseDetail: (type: string, value: string | {}) => any;
  validateOpenHouseDetail: (type: string, value: string | {}) => any;
  holiday?: any;
  getHolidaysByYear: (year) => any;
  fieldDisabled?: boolean;
  auctionDetail?: any;
}

const OpenHouse = (props: OpenHouseProps) => {
  const {
    openHouseDetail,
    updateOpenHouseDetail,
    validateOpenHouseDetail,
    holiday,
    getHolidaysByYear,
    fieldDisabled,
    auctionDetail,
  } = props;

  return (
    <>
      {openHouseDetail?.validation?.fromToDateTime?.isInvalid && (
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            <PPMSAlert
              alertClassName={"error"}
              alertKey={"open-house-alert"}
              alertVariant={"danger"}
              id={"open-house-alert"}
              show
              alertBody={
                openHouseDetail.validation.fromToDateTime?.validationError
              }
            />
          </div>
        </div>
      )}
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSDatepicker
            id={"open-house-from-date"}
            format={"MM/DD/YYYY"}
            label={"Date From"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updateOpenHouseDetail(
                "open-house-from-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              validateOpenHouseDetail(
                "open-house-from-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              openHouseDetail?.data?.fromDate
                ? moment(new Date(openHouseDetail?.data?.fromDate)).toDate()
                : null
            }
            minDate={moment(new Date()).toDate()}
            isRequired={true}
            notShowFormat={true}
            isDisabled={openHouseDetail?.validation?.fromDate?.isDisabled}
            excludeWeekends={false}
            excludeHolidays={true}
            isInvalid={openHouseDetail?.validation?.fromDate?.isInvalid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={
              openHouseDetail?.validation?.fromDate?.validationError
            }
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"open-house-from-time"}
            inputType={"text"}
            isDisabled={openHouseDetail?.validation?.fromTime?.isDisabled}
            label={"Time From"}
            maxLength={5}
            labelBold={true}
            isRequired={true}
            onChange={(event) =>
              updateOpenHouseDetail("open-house-from-time", event)
            }
            onBlur={(event) =>
              validateOpenHouseDetail(
                "open-house-from-time",
                event.target.value
              )
            }
            value={openHouseDetail?.data?.fromTime}
            validationMessage={
              openHouseDetail?.validation?.fromTime?.validationError
            }
            isInvalid={openHouseDetail?.validation?.fromTime?.isInvalid}
          />
          <span className="usa-hint">Format: hh:mm CT</span>
        </div>
        <div className={"grid-col-3 flex-align-self-center"}>
          <PPMSToggleRadio
            id={"open-house-from-am-pm"}
            isDisabled={openHouseDetail?.validation?.fromTime?.isDisabled}
            name={"open-house-from-am-pm"}
            options={openHouseDetail.constants.fromAmPmOptions}
            onChange={(values) => {
              let value = values.filter((value) => value.isSelected === true)[0]
                .value;
              updateOpenHouseDetail("open-house-from-am-pm", value);
              validateOpenHouseDetail("open-house-from-am-pm", value);
              updateOpenHouseDetail("open-house-from-am-pm-options", values);
            }}
            validationMessage={""}
            isInline={true}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSDatepicker
            id={"open-house-to-date"}
            format={"MM/DD/YYYY"}
            label={"Date To"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updateOpenHouseDetail(
                "open-house-to-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              validateOpenHouseDetail(
                "open-house-to-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              openHouseDetail?.data?.toDate
                ? moment(new Date(openHouseDetail?.data?.toDate)).toDate()
                : null
            }
            minDate={moment(new Date(openHouseDetail?.data?.fromDate)).toDate()}
            isRequired={true}
            notShowFormat={true}
            isDisabled={openHouseDetail?.validation?.toDate?.isDisabled}
            excludeWeekends={false}
            excludeHolidays={true}
            isInvalid={openHouseDetail?.validation?.toDate?.isInvalid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={
              openHouseDetail?.validation?.toDate?.validationError
            }
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"open-house-to-time"}
            inputType={"text"}
            isDisabled={openHouseDetail?.validation?.toTime?.isDisabled}
            label={"Time To"}
            maxLength={5}
            labelBold={true}
            isRequired={true}
            onChange={(event) =>
              updateOpenHouseDetail("open-house-to-time", event)
            }
            onBlur={(event) => {
              validateOpenHouseDetail("open-house-to-time", event.target.value);
            }}
            value={openHouseDetail?.data?.toTime}
            validationMessage={
              openHouseDetail?.validation?.toTime?.validationError
            }
            isInvalid={openHouseDetail?.validation?.toTime?.isInvalid}
          />
          <span className="usa-hint">Format: hh:mm CT</span>
        </div>
        <div className={"grid-col-3 flex-align-self-center"}>
          <PPMSToggleRadio
            id={"open-house-to-am-pm"}
            isDisabled={openHouseDetail?.validation?.toTime?.isDisabled}
            name={"open-house-to-am-pm"}
            options={openHouseDetail.constants.toAmPmOptions}
            onChange={(values) => {
              let value = values.filter((value) => value.isSelected === true)[0]
                .value;
              updateOpenHouseDetail("open-house-to-am-pm", value);
              validateOpenHouseDetail("open-house-to-am-pm", value);
              updateOpenHouseDetail("open-house-to-am-pm-options", values);
            }}
            validationMessage={""}
            isInline={true}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col"}>
          <PPMSTextArea
            id={"additional-instructions"}
            isRequired={false}
            label={"Additional Instructions"}
            labelBold={true}
            isDisabled={fieldDisabled}
            maxLength={500}
            isInvalid={
              openHouseDetail?.validation?.additionalInstructions?.isInvalid
            }
            value={openHouseDetail?.data?.additionalInstructions}
            validationMessage={
              openHouseDetail?.validation?.additionalInstructions
                ?.validationError
            }
            onChange={(event) =>
              updateOpenHouseDetail(
                "additional-instructions",
                event.target.value
              )
            }
            onBlur={(event) =>
              validateOpenHouseDetail(
                "additional-instructions",
                event.target.value
              )
            }
          />
        </div>
      </div>
    </>
  );
};

export default OpenHouse;
