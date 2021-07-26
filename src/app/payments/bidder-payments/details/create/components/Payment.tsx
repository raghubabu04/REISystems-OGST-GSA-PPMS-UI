import React, { useState } from "react";
import {
  PPMSToggleCheckbox,
  PPMSToggleRadio,
} from "../../../../../../ui-kit/components/common/toggle/PPMS-toggle";
import { PPMSInput } from "../../../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSDatepicker } from "../../../../../../ui-kit/components/common/datepicker/PPMS-datepicker";
import moment from "moment";
import PPMSAddCreditCards from "../../../../../../ui-kit/components/payments/PPMS-add-credit-cards";
import {
  currencyToNumber,
  formatCurrency,
} from "../../../../../../ui-kit/utilities/FormatUtil";

interface PaymentProps {
  holiday?: any;
  getHolidaysByYear: (year) => any;
  isSinglePayment?: boolean;
  paymentDetails?: any;
  updatePayment?: any;
  validatePayment?: any;
  paymentTypes?: any;
  createOptions?: any;
  processedByOptions: any;
  updateProcessedByOptions: any;
  updateTypes?: any;
  showProcessedBy?: boolean;
}

const Payment = (props: PaymentProps) => {
  const {
    holiday,
    getHolidaysByYear,
    isSinglePayment,
    paymentDetails,
    updatePayment,
    paymentTypes,
    createOptions,
    processedByOptions,
    updateProcessedByOptions,
    updateTypes,
    validatePayment,
    showProcessedBy,
  } = props;

  return (
    <>
      {!showProcessedBy && (
        <>
          <div className={"grid-row grid-gap-4"}>
            <div className={"grid-col-3"}>
              <strong>
                <span>Amount Due:</span>
              </strong>{" "}
              {formatCurrency.format(paymentDetails?.data?.amountDue)}
            </div>
            <div className={"grid-col-3"}>
              <strong>
                <span>Amount Paid:</span>
              </strong>{" "}
              {formatCurrency.format(paymentDetails?.data?.amountPaid)}
            </div>
          </div>
        </>
      )}
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          {showProcessedBy && (
            <>
              <PPMSToggleRadio
                id={"processed-by"}
                label={"Processed By"}
                labelBold={true}
                isRequired={showProcessedBy}
                isDisabled={false}
                name={"processed-by"}
                options={processedByOptions}
                onChange={(values) => {
                  let value = values.filter(
                    (value) => value.isSelected === true
                  )[0].value;
                  updatePayment("processed-by", value);
                  validatePayment("processed-by", value);
                  updateProcessedByOptions(values);
                }}
                validationMessage={""}
                isInline={true}
              />

              <br />
            </>
          )}
          {paymentDetails.data.processedBy && (
            <PPMSToggleCheckbox
              className={"payment-type"}
              isDisabled={false}
              isSingleSelect={isSinglePayment}
              id={"payment-type"}
              name={"payment-type"}
              isInline={true}
              label={"Method of Payment"}
              isRequired={true}
              labelBold={true}
              options={createOptions}
              validationMessage={"Method of Payment is required."}
              onChange={(values) => {
                let selectedValues = {};
                values.forEach((option) => {
                  if (option.isSelected) {
                    selectedValues[option.id] = true;
                  } else {
                    selectedValues[option.id] = false;
                  }
                });
                updateTypes(selectedValues);
              }}
            />
          )}
        </div>
      </div>
      {paymentTypes?.creditCard && (
        <>
          {paymentDetails?.data.processedBy && (
            <>
              <h3 className={"payment-types-h3"}>Credit Card</h3>
              <CreditCard
                paymentType={paymentTypes}
                getHolidaysByYear={getHolidaysByYear}
                paymentDetails={
                  paymentDetails?.data?.methodOfPayment?.creditCard
                }
                processedBy={paymentDetails?.data?.processedBy}
                validation={
                  paymentDetails?.validation?.methodOfPayment?.creditCard
                }
                updatePayment={(value) => updatePayment("credit-card", value)}
              />
            </>
          )}
        </>
      )}
      {paymentTypes?.cash && (
        <>
          <h3 className={"payment-types-h3"}>Cash</h3>
          <Cash
            paymentType={paymentTypes}
            holiday={holiday}
            getHolidaysByYear={getHolidaysByYear}
            paymentDetails={paymentDetails?.data?.methodOfPayment?.cash}
            validation={paymentDetails?.validation?.methodOfPayment?.cash}
            updatePayment={updatePayment}
            validatePayment={validatePayment}
          />
        </>
      )}
      {paymentTypes?.check && (
        <>
          <h3 className={"payment-types-h3"}>Check</h3>
          <Check
            paymentType={paymentTypes}
            holiday={holiday}
            getHolidaysByYear={getHolidaysByYear}
            paymentDetails={paymentDetails?.data?.methodOfPayment?.check}
            validation={paymentDetails?.validation?.methodOfPayment?.check}
            updatePayment={updatePayment}
            validatePayment={validatePayment}
          />
        </>
      )}
      {paymentTypes?.wireTransfer && (
        <>
          <h3 className={"payment-types-h3"}>Wire Transfer</h3>
          <WireTransfer
            paymentType={paymentTypes}
            paymentDetails={paymentDetails?.data?.methodOfPayment?.wireTransfer}
            validation={
              paymentDetails?.validation?.methodOfPayment?.wireTransfer
            }
            updatePayment={updatePayment}
            validatePayment={validatePayment}
          />
        </>
      )}
    </>
  );
};
const Cash = ({
  paymentType,
  holiday,
  getHolidaysByYear,
  paymentDetails,
  validation,
  updatePayment,
  validatePayment,
}) => {
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"deposit-ticket-number-cash"}
            label={"Deposit Ticket #"}
            labelBold={true}
            inputType={"text"}
            isRequired={paymentType?.cash}
            value={paymentDetails?.depositTicketNumber}
            isInvalid={validation?.depositTicketNumber?.isInvalid}
            validationMessage={validation?.depositTicketNumber?.validationError}
            onChange={(event) =>
              updatePayment("deposit-ticket-number-cash", event.target.value)
            }
            onBlur={(event) =>
              validatePayment("deposit-ticket-number-cash", event.target.value)
            }
            maxLength={10}
            isDisabled={false}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSDatepicker
            id={"deposit-date-cash"}
            format={"MM/DD/YYYY"}
            label={"Deposit Date"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updatePayment(
                "deposit-date-cash",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              validatePayment(
                "deposit-date-cash",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              paymentDetails?.depositDate
                ? moment(new Date(paymentDetails?.depositDate)).toDate()
                : null
            }
            minDate={moment(new Date()).toDate()}
            isRequired={paymentType?.cash}
            notShowFormat={true}
            isDisabled={false}
            excludeWeekends={true}
            excludeHolidays={true}
            isInvalid={validation?.depositDate?.isInvalid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={validation?.depositDate?.validationError}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"cash-amount"}
            label={"Cash Amount"}
            labelBold={true}
            onChange={(event) =>
              updatePayment("cash-amount", event.target.value)
            }
            onBlur={(event) =>
              validatePayment(
                "cash-amount",
                currencyToNumber(event.target.value)
              )
            }
            value={paymentDetails?.amount}
            validationMessage={validation?.amount?.validationError}
            isInvalid={validation?.amount?.isInvalid}
            inputType={"text"}
            isRequired={paymentType?.cash}
            maxLength={11}
            isDisabled={false}
          />
        </div>
      </div>
    </>
  );
};

const Check = ({
  paymentType,
  holiday,
  getHolidaysByYear,
  paymentDetails,
  validation,
  updatePayment,
  validatePayment,
}) => {
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-3"}>
          <PPMSDatepicker
            id={"voucher-date"}
            format={"MM/DD/YYYY"}
            label={"Voucher Date"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updatePayment(
                "voucher-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              validatePayment(
                "voucher-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              paymentDetails?.voucherDate
                ? moment(new Date(paymentDetails?.voucherDate)).toDate()
                : null
            }
            minDate={moment(new Date()).toDate()}
            isRequired={paymentType?.check}
            notShowFormat={true}
            isDisabled={false}
            excludeWeekends={true}
            excludeHolidays={true}
            isInvalid={validation?.voucherDate?.isInvalid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={validation?.voucherDate?.validationError}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSDatepicker
            id={"settlement-date"}
            format={"MM/DD/YYYY"}
            label={"Settlement Date"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updatePayment(
                "settlement-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              validatePayment(
                "settlement-date",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              paymentDetails?.settlementDate
                ? moment(new Date(paymentDetails?.settlementDate)).toDate()
                : null
            }
            minDate={moment(new Date()).toDate()}
            isRequired={paymentType?.check}
            notShowFormat={true}
            isDisabled={false}
            excludeWeekends={true}
            excludeHolidays={true}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            isInvalid={validation?.settlementDate?.isInvalid}
            validationMessage={validation?.settlementDate?.validationError}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSDatepicker
            id={"date-on-check"}
            format={"MM/DD/YYYY"}
            label={"Date on Check"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updatePayment(
                "date-on-check",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
              validatePayment(
                "date-on-check",
                value ? moment(value).format("MM/DD/YYYY") : ""
              );
            }}
            startDate={
              paymentDetails?.dateOnCheck
                ? moment(new Date(paymentDetails?.dateOnCheck)).toDate()
                : null
            }
            minDate={moment(new Date()).toDate()}
            isRequired={paymentType?.check}
            notShowFormat={true}
            isDisabled={false}
            excludeWeekends={true}
            excludeHolidays={true}
            isInvalid={validation?.dateOnCheck?.isInvalid}
            useDefaultValidation={false}
            setHolidayYear={(year) => getHolidaysByYear(year)}
            holidayList={holiday?.holidays}
            validationMessage={validation?.dateOnCheck?.validationError}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"deposit-ticket-number-check"}
            label={"Deposit Ticket #"}
            labelBold={true}
            inputType={"text"}
            isRequired={paymentType?.check}
            maxLength={10}
            onChange={(event) =>
              updatePayment("deposit-ticket-number-check", event.target.value)
            }
            onBlur={(event) =>
              validatePayment("deposit-ticket-number-check", event.target.value)
            }
            isDisabled={false}
            value={paymentDetails?.depositTicketNumber}
            validationMessage={validation?.depositTicketNumber?.validationError}
            isInvalid={validation?.depositTicketNumber?.isInvalid}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"check-number"}
            label={"Check #"}
            labelBold={true}
            inputType={"text"}
            isRequired={paymentType?.check}
            maxLength={20}
            onChange={(event) =>
              updatePayment("check-number", event.target.value)
            }
            onBlur={(event) =>
              validatePayment("check-number", event.target.value)
            }
            isDisabled={false}
            value={paymentDetails?.checkNumber}
            validationMessage={validation?.checkNumber?.validationError}
            isInvalid={validation?.checkNumber?.isInvalid}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"name-on-check"}
            label={"Name on Check"}
            labelBold={true}
            inputType={"text"}
            isRequired={paymentType?.check}
            maxLength={40}
            onChange={(event) =>
              updatePayment("name-on-check", event.target.value)
            }
            onBlur={(event) =>
              validatePayment("name-on-check", event.target.value)
            }
            value={paymentDetails?.nameOnCheck}
            validationMessage={validation?.nameOnCheck?.validationError}
            isInvalid={validation?.nameOnCheck?.isInvalid}
            isDisabled={false}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"check-amount"}
            label={"Check Amount"}
            labelBold={true}
            onChange={(event) =>
              updatePayment("check-amount", event.target.value)
            }
            onBlur={(event) =>
              validatePayment(
                "check-amount",
                currencyToNumber(event.target.value)
              )
            }
            value={paymentDetails?.amount}
            validationMessage={validation?.amount?.validationError}
            isInvalid={validation?.amount?.isInvalid}
            inputType={"text"}
            isRequired={paymentType?.check}
            maxLength={11}
            isDisabled={false}
          />
        </div>
      </div>
    </>
  );
};

const CreditCard = ({
  paymentType,
  getHolidaysByYear,
  paymentDetails,
  processedBy,
  validation,
  updatePayment,
}) => {
  return (
    <>
      <PPMSAddCreditCards
        getHolidaysByYear={getHolidaysByYear}
        isRequired={paymentType?.creditCard}
        paymentDetails={paymentDetails}
        updateDetails={updatePayment}
        validationDetails={validation}
        processedBy={processedBy}
        addLabel={"Add Additional Card"}
        minCards={1}
        maxCards={1}
      />
    </>
  );
};

const WireTransfer = ({
  paymentType,
  paymentDetails,
  validation,
  updatePayment,
  validatePayment,
}) => {
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"deposit-ticket-number-wt"}
            label={"Deposit Ticket #"}
            labelBold={true}
            inputType={"text"}
            isRequired={paymentType?.wireTransfer}
            maxLength={10}
            isDisabled={false}
            value={paymentDetails?.depositTicketNumber}
            validationMessage={validation?.depositTicketNumber?.validationError}
            isInvalid={validation?.depositTicketNumber?.isInvalid}
            onChange={(event) =>
              updatePayment("deposit-ticket-number-wt", event.target.value)
            }
            onBlur={(event) =>
              validatePayment("deposit-ticket-number-wt", event.target.value)
            }
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"name-on-wt"}
            label={"Name on the Wire Transfer"}
            labelBold={true}
            inputType={"text"}
            isRequired={paymentType?.wireTransfer}
            maxLength={40}
            value={paymentDetails?.nameOnWireTransfer}
            validationMessage={validation?.nameOnWireTransfer?.validationError}
            isInvalid={validation?.nameOnWireTransfer?.isInvalid}
            onChange={(event) =>
              updatePayment("name-on-wt", event.target.value)
            }
            onBlur={(event) =>
              validatePayment("name-on-wt", event.target.value)
            }
            isDisabled={false}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"wt-amount"}
            label={"Wire Transfer Amount"}
            labelBold={true}
            onChange={(event) => updatePayment("wt-amount", event.target.value)}
            onBlur={(event) =>
              validatePayment("wt-amount", currencyToNumber(event.target.value))
            }
            value={paymentDetails?.amount}
            validationMessage={validation?.amount?.validationError}
            isInvalid={validation?.amount?.isInvalid}
            inputType={"text"}
            isRequired={paymentType?.wireTransfer}
            maxLength={11}
            isDisabled={false}
          />
        </div>
      </div>
    </>
  );
};

export default Payment;
