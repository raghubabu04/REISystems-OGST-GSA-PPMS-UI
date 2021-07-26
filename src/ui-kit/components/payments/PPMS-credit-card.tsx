import React, { useState } from "react";
import creditCardType from "credit-card-type";
import { PPMSInput } from "../common/input/PPMS-input";
import images from "./constants/images";
import styled from "styled-components";
import moment from "moment";
import { PPMSDatepicker } from "../common/datepicker/PPMS-datepicker";
import { currencyToNumber } from "../../utilities/FormatUtil";

interface PPMSCreditCardProps {
  isRequired?: boolean;
  getHolidaysByYear: (year) => any;
  paymentDetails: any;
  updateDetails?: any;
  validationDetails?: any;
  updateValidation?: any;
  processedBy?: string;
}

const PPMSCreditCard = (props: PPMSCreditCardProps) => {
  const {
    isRequired,
    getHolidaysByYear,
    paymentDetails,
    processedBy,
    updateDetails,
    updateValidation,
    validationDetails,
  } = props;
  const [cardType, updateCardType] = useState({
    type: "placeholder",
    niceType: "Placeholder",
  });

  const CardImage = styled.img`
    height: 1em;
    ${({ style: styled }) => ({ ...styled })};
  `;
  const getImages = (type) => {
    switch (type) {
      case "visa":
        return "visa";
      case "mastercard":
        return "mastercard";
      case "american-express":
        return "amex";
      case "discover":
        return "discover";
      case "maestro":
        return "maestro";
      case "diners-club":
        return "diners";
      case "jcb":
        return "jcb";
      default:
        return "placeholder";
    }
  };
  return (
    <>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"credit-card-number"}
            label={"Credit Card Number"}
            labelBold={true}
            inputType={"text"}
            maxLength={16}
            prefixIcon={
              <CardImage
                key={`image-${cardType?.type ? cardType?.type : "card"}`}
                id={`image-${cardType?.type ? cardType?.type : "card"}`}
                className={""}
                style={{}}
                src={images[getImages(cardType?.type)]}
              />
            }
            isRequired={isRequired}
            hint={`${
              cardType?.type && cardType?.type !== "placeholder"
                ? "Card Type: " + cardType?.niceType
                : ""
            }`}
            isDisabled={false}
            value={paymentDetails?.cardNumber}
            onChange={(event) => {
              let cardType = { type: "placeholder", niceType: "Placeholder" };
              if (event.target.value) {
                cardType = creditCardType(event.target.value)
                  ? creditCardType(event.target.value)[0]
                  : { type: "placeholder", niceType: "Placeholder" };
              }
              let cardInfo = {
                number: event.target.value,
                type: cardType?.niceType,
              };
              updateCardType(cardType);
              updateDetails("credit-card-number", cardInfo);
            }}
            onBlur={(event) =>
              updateValidation("credit-card-number", event.target.value)
            }
            validationMessage={validationDetails?.cardNumber?.validationError}
            isInvalid={validationDetails?.cardNumber?.isInvalid}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSDatepicker
            id={"expiration-date"}
            format={"MM/YYYY"}
            label={"Expiration Date"}
            labelBold={true}
            display={""}
            updateDate={(value) => {
              updateDetails(
                "expiration-date",
                value ? moment(value).format("MM/YYYY") : ""
              );
              updateValidation(
                "expiration-date",
                value ? moment(value).format("MM/YYYY") : ""
              );
            }}
            startDate={
              paymentDetails?.expDate
                ? moment(paymentDetails?.expDate, "MM/YYYY").toDate()
                : null
            }
            minDate={moment(
              new Date().setMonth(new Date().getMonth() - 1)
            ).toDate()}
            isRequired={isRequired}
            notShowFormat={true}
            isDisabled={false}
            excludeWeekends={true}
            excludeHolidays={true}
            useDefaultValidation={false}
            isInvalid={validationDetails?.expDate?.isInvalid}
            validationMessage={validationDetails?.expDate?.validationError}
            showMonthYearPicker={true}
            setHolidayYear={(year) => getHolidaysByYear(year)}
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"cvv"}
            label={"CVV"}
            labelBold={true}
            inputType={"text"}
            isRequired={isRequired}
            maxLength={4}
            isDisabled={false}
            value={paymentDetails?.cvv}
            onChange={(event) => {
              updateDetails("cvv", event.target.value);
            }}
            onBlur={(event) => updateValidation("cvv", event.target.value)}
            isInvalid={validationDetails?.cvv?.isInvalid}
            validationMessage={validationDetails?.cvv?.validationError}
          />
        </div>
      </div>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"name-on-card"}
            label={"Name on Card"}
            labelBold={true}
            inputType={"text"}
            isRequired={isRequired}
            maxLength={50}
            isDisabled={false}
            value={paymentDetails?.nameOnCard}
            onChange={(event) => {
              updateDetails("name-on-card", event.target.value);
            }}
            onBlur={(event) =>
              updateValidation("name-on-card", event.target.value)
            }
            isInvalid={validationDetails?.nameOnCard?.isInvalid}
            validationMessage={validationDetails?.nameOnCard?.validationError}
          />
        </div>
        <div className={"grid-col-4"}>
          <PPMSInput
            id={"amount"}
            label={"Amount"}
            labelBold={true}
            inputType={"text"}
            isRequired={isRequired}
            maxLength={11}
            value={paymentDetails?.amount}
            onChange={(event) => {
              updateDetails("amount", event.target.value);
            }}
            onBlur={(event) =>
              updateValidation("amount", currencyToNumber(event.target.value))
            }
            isInvalid={validationDetails?.amount?.isInvalid}
            validationMessage={validationDetails?.amount?.validationError}
            isDisabled={false}
          />
        </div>
      </div>
      {processedBy === "Finance" && (
        <div className={"grid-row grid-gap-4"}>
          <div className={"grid-col-3"}>
            <PPMSInput
              id={"authorization-number"}
              label={"Authorization Code"}
              labelBold={true}
              inputType={"text"}
              isRequired={isRequired}
              maxLength={8}
              value={paymentDetails?.authorizationNumber}
              onChange={(event) => {
                updateDetails("authorization-number", event.target.value);
              }}
              onBlur={(event) =>
                updateValidation("authorization-number", event.target.value)
              }
              isInvalid={validationDetails?.authorizationNumber?.isInvalid}
              validationMessage={
                validationDetails?.authorizationNumber?.validationError
              }
              isDisabled={false}
            />
          </div>
          <div className={"grid-col-3"}>
            <PPMSDatepicker
              id={"authorization-date"}
              format={"MM/DD/YYYY"}
              label={"Authorization Date"}
              labelBold={true}
              display={""}
              hint={"MM/DD/YYYY"}
              updateDate={(value) => {
                updateDetails(
                  "authorization-date",
                  value ? moment(value).format("MM/DD/YYYY") : ""
                );
                updateValidation(
                  "authorization-date",
                  value ? moment(value).format("MM/DD/YYYY") : ""
                );
              }}
              startDate={
                paymentDetails?.authorizationDate
                  ? moment(new Date(paymentDetails?.authorizationDate)).toDate()
                  : null
              }
              minDate={moment(new Date(), "MM/DD/YYYY").toDate()}
              isRequired={isRequired}
              notShowFormat={true}
              isDisabled={false}
              excludeWeekends={true}
              excludeHolidays={true}
              useDefaultValidation={false}
              isInvalid={validationDetails?.authorizationDate?.isInvalid}
              validationMessage={
                validationDetails?.authorizationDate?.validationError
              }
              setHolidayYear={(year) => getHolidaysByYear(year)}
            />
          </div>
          <div className={"grid-col-3"}>
            <PPMSInput
              id={"tracking-id"}
              label={"Pay.Gov Tracking ID"}
              labelBold={true}
              inputType={"text"}
              isRequired={isRequired}
              maxLength={8}
              value={paymentDetails?.trackingID}
              onChange={(event) => {
                updateDetails("tracking-id", event.target.value);
              }}
              onBlur={(event) =>
                updateValidation("tracking-id", event.target.value)
              }
              isInvalid={validationDetails?.trackingID?.isInvalid}
              validationMessage={validationDetails?.trackingID?.validationError}
              isDisabled={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PPMSCreditCard;
