import React from "react";
import moment from "moment";
import { PPMSDatepicker } from "../../../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import { PPMSInput } from "../../../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSToggleRadio } from "../../../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSAddress } from "../../../../../../../ui-kit/components/PPMS-address";
import { PPMSAlert } from "../../../../../../../ui-kit/components/common/PPMS-alert";

interface AuctionProps {
  auctionDetail: any;
  updateAuctionDetail: (type: string, value: string | {}) => any;
  validateAuctionDetail: (type: string, value: string | {}) => any;
  holiday?: any;
  getHolidaysByYear: (year) => any;
  fieldDisabled?: boolean;
  saleInformation?: any;
}

const Auction = (props: AuctionProps) => {
  const {
    auctionDetail,
    updateAuctionDetail,
    validateAuctionDetail,
    holiday,
    getHolidaysByYear,
    fieldDisabled,
    saleInformation,
  } = props;
  return (
    <>
      {auctionDetail?.validation?.startEndDateTime.isInvalid && (
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-12"}>
            <PPMSAlert
              alertClassName={"error"}
              alertKey={"open-house-alert"}
              alertVariant={"danger"}
              id={"open-house-alert"}
              show
              alertBody={
                auctionDetail?.validation?.startEndDateTime.validationError
              }
            />
          </div>
        </div>
      )}
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSDatepicker
            id={"sale-start-date"}
            format={"MM/DD/YYYY"}
            label={"Sale Start Date"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              validateAuctionDetail(
                "sale-start-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              updateAuctionDetail(
                "sale-start-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              auctionDetail?.data?.startDate
                ? moment(new Date(auctionDetail?.data?.startDate)).toDate()
                : null
            }
            minDate={moment(new Date(Date.now())).toDate()}
            isRequired={true}
            notShowFormat={true}
            isDisabled={auctionDetail?.validation?.startDate?.isDisabled}
            excludeWeekends={false}
            excludeHolidays={false}
            isInvalid={auctionDetail?.validation?.startDate?.isInvalid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={
              auctionDetail?.validation?.startDate?.validationError
            }
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"sale-start-time"}
            isDisabled={auctionDetail?.validation?.startTime?.isDisabled}
            label={"Sale Start Time"}
            labelBold={true}
            inputType={"text"}
            maxLength={5}
            isRequired={true}
            onChange={(event) => updateAuctionDetail("sale-start-time", event)}
            onBlur={(event) =>
              validateAuctionDetail("sale-start-time", event.target.value)
            }
            value={auctionDetail?.data?.startTime}
            validationMessage={
              auctionDetail?.validation?.startTime?.validationError
            }
            isInvalid={auctionDetail?.validation?.startTime?.isInvalid}
          />
          <span className="usa-hint">Format: hh:mm CT</span>
        </div>
        <div className={"grid-col-3 flex-align-self-center"}>
          <PPMSToggleRadio
            id={"start-am-pm"}
            isDisabled={auctionDetail?.validation?.startTime?.isDisabled}
            name={"start-am-pm"}
            options={auctionDetail.constants.startAmPmOptions}
            onChange={(values) => {
              let value = values.filter((value) => value.isSelected === true)[0]
                .value;
              updateAuctionDetail("start-am-pm", value);
              validateAuctionDetail("start-am-pm", value);
              updateAuctionDetail("start-am-pm-options", values);
            }}
            validationMessage={""}
            isInline={true}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSDatepicker
            id={"sale-end-date"}
            format={"MM/DD/YYYY"}
            label={"Sale End Date"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updateAuctionDetail(
                "sale-end-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              validateAuctionDetail(
                "sale-end-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              auctionDetail?.data?.endDate
                ? moment(new Date(auctionDetail?.data?.endDate)).toDate()
                : null
            }
            minDate={moment(new Date(Date.now())).toDate()}
            isRequired={false}
            notShowFormat={true}
            isDisabled={auctionDetail?.validation?.endDate?.isDisabled}
            excludeWeekends={true}
            excludeHolidays={true}
            isInvalid={auctionDetail?.validation?.endDate?.isInvalid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={
              auctionDetail?.validation?.endDate?.validationError
            }
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"sale-end-time"}
            inputType={"text"}
            isDisabled={auctionDetail?.validation?.endTime?.isDisabled}
            label={"Sale End Time"}
            labelBold={true}
            isRequired={false}
            maxLength={5}
            onChange={(event) => {
              updateAuctionDetail("sale-end-time", event);
            }}
            onBlur={(event) =>
              validateAuctionDetail("sale-end-time", event.target.value)
            }
            value={auctionDetail?.data?.endTime}
            validationMessage={
              auctionDetail?.validation?.endTime?.validationError
            }
            isInvalid={auctionDetail?.validation?.endTime?.isInvalid}
          />
          <span className="usa-hint">Format: hh:mm CT</span>
        </div>
        <div className={"grid-col-3 flex-align-self-center"}>
          <PPMSToggleRadio
            id={"end-am-pm"}
            isDisabled={auctionDetail?.validation?.endTime?.isDisabled}
            name={"end-am-pm"}
            options={auctionDetail.constants.endAmPmOptions}
            onChange={(values) => {
              let value = values.filter((value) => value.isSelected === true)[0]
                .value;
              updateAuctionDetail("end-am-pm", value);
              validateAuctionDetail("end-am-pm", value);
              updateAuctionDetail("end-am-pm-options", values);
            }}
            validationMessage={""}
            isInline={true}
          />
        </div>
      </div>
      {saleInformation?.saleMethod !== "OA" ? (
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-8"}>
            <PPMSAddress
              labelBold={true}
              showZipExtension={true}
              showAddressLine3={true}
              address1={auctionDetail?.data?.address?.addressLine1}
              address1ValidationMessage={
                auctionDetail?.validation?.address?.addressLine1
                  ?.validationError
              }
              address1Required={true}
              address1IsInvalid={
                auctionDetail?.validation?.address?.addressLine1?.isInvalid
              }
              onChangeAddress1={(value) =>
                updateAuctionDetail("address-1", value)
              }
              updateAddress1={(value) =>
                validateAuctionDetail("address-1", value)
              }
              address2={auctionDetail?.data?.address?.addressLine2}
              address2ValidationMessage={
                auctionDetail?.validation?.address?.addressLine2
                  ?.validationError
              }
              address2Required={false}
              address2IsInvalid={
                auctionDetail?.validation?.address?.addressLine2?.isInvalid
              }
              updateAddress2={(value) =>
                updateAuctionDetail("address-2", value)
              }
              onBlurAddress2={(value) =>
                validateAuctionDetail("address-2", value)
              }
              address3={auctionDetail?.data?.address?.addressLine3}
              address3ValidationMessage={
                auctionDetail?.validation?.address?.addressLine3
                  ?.validationError
              }
              address3Required={false}
              address3IsInvalid={
                auctionDetail?.validation?.address?.addressLine3?.isInvalid
              }
              updateAddress3={(value) =>
                updateAuctionDetail("address-3", value)
              }
              onBlurAddress3={(value) =>
                validateAuctionDetail("address-3", value)
              }
              city={auctionDetail?.data?.address?.city}
              cityIsInvalid={
                auctionDetail?.validation?.address?.city?.isInvalid
              }
              cityRequired={true}
              cityValidationMessage={
                auctionDetail?.validation?.address?.city?.validationError
              }
              onChangeCity={(value) => updateAuctionDetail("city", value)}
              updateCity={(value) => validateAuctionDetail("city", value)}
              state={auctionDetail?.data?.address?.state}
              stateRequired={true}
              stateIsInvalid={
                auctionDetail?.validation?.address?.state?.isInvalid
              }
              stateValidationMessage={
                auctionDetail?.validation?.address?.state?.validationError
              }
              updateState={(value) => {
                updateAuctionDetail("state", value);
                validateAuctionDetail("state", value);
              }}
              zip={auctionDetail?.data?.address?.zip}
              zipRequired={true}
              zipIsInvalid={auctionDetail?.validation?.address?.zip?.isInvalid}
              zipValidationMessage={
                auctionDetail?.validation?.address?.zip?.validationError
              }
              onChangeZip={(value) => updateAuctionDetail("zip", value)}
              updateZip={(value) => validateAuctionDetail("zip", value)}
              zip2={auctionDetail?.data?.address?.zip2}
              zip2IsInvalid={
                auctionDetail?.validation?.address?.zip2?.isInvalid
              }
              validationExtensionMessage={
                auctionDetail?.validation?.address?.zip2?.validationError
              }
              onChangeZipExtension={(value) =>
                updateAuctionDetail("zip2", value)
              }
              updateZipExtension={(value) => updateAuctionDetail("zip2", value)}
              addressDisabaled={fieldDisabled}
              disableZipValidation={fieldDisabled}
              disabledZipExtension={fieldDisabled}
              stateDisabled={fieldDisabled}
            />
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

export default Auction;
