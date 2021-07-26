import creditCardType from "credit-card-type";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { PPMSInput } from "../../../ui-kit/components/common/input/PPMS-input";
import images from "../../../ui-kit/components/payments/constants/images";

interface AwardCardComponentProps {
  cardHolderName: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
  amount: string;
  cardHolderNameIsInValid: boolean;
  cardHolderNameIsValid: boolean;
  cardHolderNameValidationMessage: string;
  cardNumberIsInValid: boolean;
  cardNumberIsValid: boolean;
  cardNumberValidationMessage: string;
  cardTypeIsInValid: boolean;
  cardTypeIsValid: boolean;
  cardTypeValidationMessage: string;
  expDateIsInValid: boolean;
  expDateIsValid: boolean;
  expDateValidationMessage: string;
  cvvIsInValid: boolean;
  cvvIsValid: boolean;
  cvvValidationMessage: string;
  amountIsInValid: boolean;
  amountIsValid: boolean;
  amountValidationMessage: string;
  onBlurCardHolderName: any;
  onChangeCardHolderName: any;
  onChangeCardNumber: any;
  onBlurCardNumber: any;
  onChangeExpDate: any;
  onBlurExpDate: any;
  onChangeCVV: any;
  onBlurCVV: any;
  onChangeAmount: any;
  onBlurAmount: any;
}

export function AwardCardComponent(props: AwardCardComponentProps) {
  /*const [cardType, updateCardType] = useState({
    type: "placeholder",
    niceType: "Placeholder",   
  });*/
  const cardType = props?.cardNumber?.trim() ? creditCardType(props?.cardNumber?.trim())[0]
  : { type: "placeholder", niceType: "Placeholder" };

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
            inputType={"text"}
            maxLength={16}           
            isRequired={true}
            prefixIcon={
                <CardImage
                  key={`image-${cardType?.type ? cardType?.type : "card"}`}
                  id={`image-${cardType?.type ? cardType?.type : "card"}`}
                  className={""}
                  style={{}}
                  src={images[getImages(cardType?.type)]}
                />
              }
            hint={`${
              cardType?.type && cardType?.type !== "placeholder"
                ? "Card Type: " + cardType?.niceType
                : ""
            }`}
            isDisabled={false}
            value={props.cardNumber}
            onChange={(event) => {
              let cardType = { type: "placeholder", niceType: "Placeholder" };
              if (event.target.value) {
                let cardNumber=event.target.value.trim().replace(/\D+/g, "");
                cardType = creditCardType(cardNumber)
                  ? creditCardType(cardNumber)[0]
                  : { type: "placeholder", niceType: "Placeholder" };
                  props.onChangeCardNumber(cardNumber, cardType);
              }else{
                props.onChangeCardNumber(event.target.value, cardType);
              }
              
            }}
            onBlur={(event) => {
                let cardType = { type: "placeholder", niceType: "Placeholder" };
                if (event.target.value) {
                    cardType = creditCardType(event.target.value.trim())
                    ? creditCardType(event.target.value.trim())[0]
                    : { type: "placeholder", niceType: "Placeholder" };
                }
                props.onBlurCardNumber(event.target.value, cardType);
            }}
            validationMessage={props.cardNumberValidationMessage}
            isInvalid={props.cardNumberIsInValid}
            isValid={props.cardNumberIsValid}
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"exiprationDate"}
            label={"Expiration Date"}
            inputType={"text"}
            isRequired={true}
            maxLength={7}
            isDisabled={false}
            value={props.expDate}
            onChange={(event) => {
              props.onChangeExpDate(event.target.value);
            }}
            onBlur={(event) => props.onBlurExpDate(event.target.value)}
            isInvalid={props.expDateIsInValid}
            isValid={props.expDateIsValid}
            validationMessage={props.expDateValidationMessage}
            placeHolder={"MM/YYYY"}
          />
        </div>
        <div className={"grid-col-2"}>
          <PPMSInput
            id={"cvv"}
            label={"CVV"}
            inputType={"text"}
            isRequired={true}
            maxLength={4}
            isDisabled={false}
            value={props.cvv}
            onChange={(event) => {
              props.onChangeCVV(event.target.value);
            }}
            onBlur={(event) => props.onBlurCVV(event.target.value)}
            isInvalid={props.cvvIsInValid}
            isValid={props.cvvIsValid}
            validationMessage={props.cvvValidationMessage}
          />
        </div>
      </div>

      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"name-on-card"}
            label={"Name on Card"}
            inputType={"text"}
            isRequired={true}
            maxLength={50}
            isDisabled={false}
            value={props.cardHolderName}
            onChange={(event) => {
              props.onChangeCardHolderName(
                event.target.value
                  .replace(/[^\w\s]/gi, "")
                  .replace(/[^\D\s]/gi, "")
              );
            }}
            onBlur={(event) => props.onBlurCardHolderName(event.target.value)}
            isInvalid={props.cardHolderNameIsInValid}
            isValid={props.cardNumberIsValid}
            validationMessage={props.cardHolderNameValidationMessage}
          />
        </div>
        <div className={"grid-col-3"}>
          <PPMSInput
            id={"amount"}
            label={"Amount"}
            inputType={"text"}
            isRequired={true}
            maxLength={11}
            value={props.amount ? `$${props.amount}` : ""}
            onChange={(event) => {
              props.onChangeAmount(event.target.value);
            }}
            onBlur={(event) => props.onBlurAmount(event.target.value)}
            isInvalid={props.amountIsInValid}
            isValid={props.amountIsValid}
            validationMessage={props.amountValidationMessage}
            isDisabled={false}
            placeHolder={"$0.00"}
          />
        </div>
      </div>
    </>
  );
}
