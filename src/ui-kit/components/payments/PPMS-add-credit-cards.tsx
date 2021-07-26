import React, { useEffect, useState } from "react";
import { PPMSButton } from "../common/PPMS-button";
import { FaTrashAlt } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import PPMSCreditCard from "./PPMS-credit-card";
import {
  isCreditCardValid,
  isCVVValid,
  isExpDateValid,
  isRequiredValidation,
  isRequiredValidationWithMax,
  validateDatePickerInput,
} from "../validations/FieldValidations";
import {
  currencyToNumber,
  formatCreditCard,
  formatCurrency,
} from "../../utilities/FormatUtil";
interface PPMSAddCreditCardsProps {
  removeLabel?: string;
  addLabel?: string;
  labelBold?: boolean;
  maxCards?: number;
  minCards?: number;
  updateDetails?: (values: any) => void;
  disable?: boolean;
  isRequired?: boolean;
  getHolidaysByYear: (year) => any;
  paymentDetails: any;
  processedBy?: any;
  validationDetails?: any;
}

const PPMSAddCreditCards = (props: PPMSAddCreditCardsProps) => {
  const {
    isRequired,
    getHolidaysByYear,
    removeLabel,
    addLabel,
    maxCards,
    minCards,
    disable,
    paymentDetails,
    processedBy,
    updateDetails,
    validationDetails,
  } = props;
  const [fields, setFields] = useState(getFields(paymentDetails, minCards));
  const [validations, setValidations] = useState(
    getValidation(validationDetails, minCards)
  );
  useEffect(() => {
    setFields(getFields(paymentDetails, minCards));
    setValidations(getValidation(validationDetails, minCards));
  }, []);

  function getFields(cards, minCards) {
    if (cards && cards.length > 0) {
      return cards;
    } else if (minCards) {
      let fieldArray = [];
      for (let i = 0; i < minCards; i++) {
        fieldArray.push({
          cardNumber: null,
          type: "",
          expDate: null,
          nameOnCard: "",
          cvv: null,
          amount: null,
          authorizationNumber: "",
          trackingID: "",
          authorizationDate: null,
        });
      }
      return fieldArray;
    } else {
      return [
        {
          cardNumber: null,
          type: "",
          expDate: null,
          nameOnCard: "",
          cvv: null,
          amount: null,
          authorizationNumber: "",
          trackingID: "",
          authorizationDate: null,
        },
      ];
    }
  }

  function getValidation(validationDetails, minCards) {
    if (validationDetails && validationDetails.length > 0) {
      return validationDetails;
    } else if (minCards) {
      let fieldArray = [];
      for (let i = 0; i < minCards; i++) {
        fieldArray.push({
          cardNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          expDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          nameOnCard: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          cvv: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          amount: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          authorizationNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          trackingID: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          authorizationDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        });
      }
      return fieldArray;
    } else {
      return [
        {
          cardNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          expDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          nameOnCard: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          cvv: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          amount: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          authorizationNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          trackingID: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          authorizationDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        },
      ];
    }
  }

  function updateDetailsPrep(i, type, value) {
    const values = [...fields];
    switch (type) {
      case "credit-card-number":
        values[i].cardNumber = value.number.replace(/[^0-9]/g, "");
        values[i].type = value.type;
        break;
      case "expiration-date":
        values[i].expDate = value;
        break;
      case "name-on-card":
        values[i].nameOnCard = value.replace(/[^0-9A-Za-z ]/g, "");
        break;
      case "cvv":
        values[i].cvv = value;
        break;
      case "amount":
        values[i].amount = value.replace(/[^0-9.]/g, "");
        break;
      case "authorization-number":
        values[i].authorizationNumber = value;
        break;
      case "tracking-id":
        values[i].trackingID = value;
        break;
      case "authorization-date":
        values[i].authorizationDate = value;
        break;
    }
    setFields(values);
    let updateValues = {
      data: values,
      validation: validations,
    };
    updateDetails(updateValues);
  }

  function updateValidationPrep(i, type, value) {
    const values = [...validations];
    switch (type) {
      case "credit-card-number":
        values[i].cardNumber = isCreditCardValid("Credit Card Number", value);
        fields[i].cardNumber = !values[i].cardNumber.isInvalid
          ? formatCreditCard(value)
          : value;
        break;
      case "expiration-date":
        values[i].expDate = isExpDateValid("Expiration Date", value);
        break;
      case "name-on-card":
        values[i].nameOnCard = isRequiredValidation("Name", value);
        break;
      case "cvv":
        values[i].cvv = isCVVValid("CVV", value, values[i].type);
        break;
      case "amount":
        values[i].amount = isRequiredValidationWithMax(
          "Cash Amount",
          currencyToNumber(value),
          24999.99,
          true
        );
        fields[i].amount = value ? formatCurrency.format(value) : null;
        break;
      case "authorization-number":
        values[i].authorizationNumber = isRequiredValidation(
          "Authorization Number",
          value
        );
        break;
      case "tracking-id":
        values[i].trackingID = isRequiredValidation("Tracking ID", value);
        break;
      case "authorization-date":
        values[i].authorizationDate = validateDatePickerInput(
          value,
          true,
          "Authorization Date",
          "MM/DD/YYYY"
        );
        break;
    }

    setValidations(values);
    let updateValues = {
      data: fields,
      validation: values,
    };
    updateDetails(updateValues);
  }

  function handleAdd() {
    const values = [...fields];
    const validity = [...validations];
    values.push({
      cardNumber: null,
      type: "",
      expDate: null,
      cvv: null,
      amount: null,
      authorizationNumber: "",
      trackingID: "",
      authorizationDate: null,
    });
    validity.push({
      cardNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      expDate: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      cvv: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      amount: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      authorizationNumber: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      trackingID: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
      authorizationDate: {
        isInvalid: false,
        validationError: "",
        isDisabled: false,
      },
    });
    setFields(values);
    setValidations(validity);
    let updateValues = {
      data: values,
      validation: validity,
    };
    updateDetails(updateValues);
  }

  function handleRemove(i) {
    const values = [...fields];
    const validity = [...validations];
    values.splice(i, 1);
    validity.splice(i, 1);
    if (minCards && values.length < minCards) {
      for (let i = 0; i < minCards - values.length; i++) {
        values.push({
          cardNumber: null,
          type: "",
          expDate: null,
          cvv: null,
          amount: null,
          authorizationNumber: "",
          trackingID: "",
          authorizationDate: null,
        });
        validity.push({
          cardNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          expDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          cvv: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          amount: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          trackingID: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          authorizationNumber: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
          authorizationDate: {
            isInvalid: false,
            validationError: "",
            isDisabled: false,
          },
        });
      }
    } else if (values.length === 0) {
      values.push({
        cardNumber: null,
        type: "",
        expDate: null,
        nameOnCard: null,
        cvv: null,
        amount: null,
        trackingID: "",
        authorizationNumber: "",
        authorizationDate: null,
      });
      validity.push({
        cardNumber: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        expDate: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        cvv: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        amount: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        authorizationNumber: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        trackingID: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        nameOnCard: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
        authorizationDate: {
          isInvalid: false,
          validationError: "",
          isDisabled: false,
        },
      });
    }
    setFields(values);
    setValidations(validity);
    let updateValues = {
      data: values,
      validation: validity,
    };
    updateDetails(updateValues);
  }
  return (
    <>
      {fields.map((field, index) => {
        return (
          <div
            key={`credit-${index}`}
            className={"grid-row grid-gap-2 credit-card-box"}
          >
            <div className={"grid-col-11"}>
              <PPMSCreditCard
                key={`credit-card-${index}`}
                isRequired={isRequired}
                getHolidaysByYear={getHolidaysByYear}
                paymentDetails={field}
                validationDetails={validations[index]}
                processedBy={processedBy}
                updateDetails={(type, value) =>
                  updateDetailsPrep(index, type, value)
                }
                updateValidation={(type, value) =>
                  updateValidationPrep(index, type, value)
                }
              />
            </div>
            {maxCards > 1 && (
              <div className={"grid-col-1 flex-align-self-center"}>
                <PPMSButton
                  id={`remove-card-${index}`}
                  type={"button"}
                  label={removeLabel || ""}
                  icon={<FaTrashAlt />}
                  onPress={() => handleRemove(index)}
                  isDisabled={disable}
                />
              </div>
            )}
          </div>
        );
      })}
      {maxCards > 1 && (
        <>
          <br />
          <div className={"grid-row grid-gap-2"}>
            <div className={"grid-col"}>
              <PPMSButton
                id={`add-card`}
                type={"button"}
                label={addLabel || ""}
                size={"sm"}
                icon={<FiPlus />}
                isDisabled={
                  disable
                    ? disable
                    : (maxCards && fields.length >= maxCards) || false
                }
                onPress={() => handleAdd()}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PPMSAddCreditCards;
