import React, { useEffect, useState } from "react";
import { PPMSInput } from "../common/input/PPMS-input";
import { PPMSButton } from "../common/PPMS-button";
import { FiPlus } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { sanitizeUrl } from "../../utilities/FormatUtil";

interface PPMSBidAmountProps {
  label?: string;
  saleNumberLabel?: string;
  lotNumberLabel?: string;
  bidAmountLabel?: string;
  removeLabel?: string;
  addLabel?: string;
  labelBold?: boolean;
  maxLinks?: number;
  minLinks?: number;
  links?: { saleNumber: string; lotNumber: string; bidAmount: string }[];
  updateLinks?: (values: any[]) => void;
  disable?: boolean;
}

const PPMSBidAmount = (props: PPMSBidAmountProps) => {
  const [numberValidation, setNumberValidation] = useState({
    isInvalid: false,
    validationError: "",
  });
  const {
    saleNumberLabel,
    lotNumberLabel,
    bidAmountLabel,
    removeLabel,
    addLabel,
    labelBold,
    maxLinks,
    minLinks,
    links,
    updateLinks,
    disable,
  } = props;
  const [fields, setFields] = useState(getFields(links, minLinks));
  useEffect(() => {
    setFields(getFields(links, minLinks));
  }, [links]);

  function getFields(links, minLinks) {
    if (links && links.length > 0) {
      return links;
    } else if (minLinks) {
      let fieldArray = [];
      for (let i = 0; i < minLinks; i++) {
        fieldArray.push({ saleNumber: null, lotNumber: null, bidAmount: null });
      }
      return fieldArray;
    } else {
      return [{ saleNumber: null, lotNumber: null, bidAmount: null }];
    }
  }
  function handleSaleNumberChange(i, event) {
    const values = [...fields];
    values[i].saleNumber = event.target.value;
    setFields(values);
    updateLinks(values);
  }
  
 
  function handleLotNumberChange(i, event) {
    const values = [...fields];
    values[i].lotNumber = event.target.value;
    let lotValidation = checkNumber(event.target.value);
    if (!lotValidation.isInvalid) {
      setFields(values);
      updateLinks(values);
    } else {
      event.target.validationError = "Numbers are only valid";
      event.target.isInvalid = true;
    }
  }

  function handleBidAmountChange(i, event) {
    const values = [...fields];
    values[i].bidAmount = event.target.value;
    let bidValidation = checkNumber(event.target.value);
    if (!bidValidation.isInvalid) {
      setFields(values);
      updateLinks(values);
    } else {
      event.target.validationError = "Numbers are only valid";
      event.target.isInvalid = true;
    }
  }

  function checkNumber(value) {
    let validation = {
      isInvalid: false,
      validationError: "",
    };
    if (!/^\d+$/.test(value)) {
      validation.isInvalid = true;
      validation.validationError = "Numbers are only valid";
    } 
    return validation;
  }
  
  function handleAdd() {
    const values = [...fields];
    values.push({ saleNumber: null, lotNumber: null, bidAmount: null});
    setFields(values);
    updateLinks(values);
  }

  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    if (minLinks && values.length < minLinks) {
      for (let i = 0; i < minLinks - values.length; i++) {
        values.push({ saleNumber: null, lotNumber: null, bidAmount: null });
      }
    } else if (values.length === 0) {
      values.push({ saleNumber: null, lotNumber: null, bidAmount: null});
    }
    setFields(values);
    updateLinks(values);
  }
  return (
    <>
      {fields.map((field, index) => {
        return (

          
          <div key={`${field}-${index}`} className={"grid-row grid-gap-5"}>
            <div className={"grid-col-4"}>
              <PPMSInput
                id={`sale-number-${index}`}
                label={saleNumberLabel || "Sale Number"}
                labelBold={labelBold}
                inputType={"text"}
                isDisabled={disable}
                isRequired={true}
                value={field?.saleNumber || ""}
                maxLength={11}
                onChange={(event) => handleSaleNumberChange(index, event)}
              />
            </div>
            
            <div className={"grid-col-3"}>
              <PPMSInput
                id={`lot-number-${index}`}
                label={lotNumberLabel || "Lot Number"}
                labelBold={labelBold}
                inputType={"text"}
                isDisabled={disable}
                isInvalid={numberValidation.isInvalid}
                validationMessage={numberValidation.validationError}
                isRequired={true}
                maxLength={3}
                value={field?.lotNumber || ""}
                onChange={(event) => handleLotNumberChange(index, event)}
                
              />
            </div>
           
            <div className={"grid-col-4"}>
              <PPMSInput
                id={`bid-amount-${index}`}
                label={bidAmountLabel || "Bid Amount"}
                labelBold={labelBold}
                inputType={"text"}
                isDisabled={disable}
                isInvalid={numberValidation.isInvalid}
                validationMessage={numberValidation.validationError}
                isRequired={true}
                maxLength={20}
                value={field?.bidAmount || ""}
                onChange={(event) => handleBidAmountChange(index, event)}
              />
            </div>
            <div className={"grid-col-1 flex-align-self-end"}>
              <PPMSButton
                id={`url-remove-${index}`}
                type={"button"}
                label={removeLabel || ""}
                icon={<FaTrashAlt />}
                onPress={() => handleRemove(index)}
                isDisabled={disable}
              />
        </div>
          </div>
        );
      })}
      <br />
      <div className={"grid-row grid-gap-2"}>
        <div className={"grid-col"}>
          <PPMSButton
            id={`url-add`}
            type={"button"}
            label={addLabel || ""}
            size={"sm"}
            icon={<FiPlus />}
            isDisabled={disable?disable:(maxLinks && fields.length >= maxLinks) || false}
            onPress={() => handleAdd()}
          />
        </div>
      </div>
    </>
  );
};

export default PPMSBidAmount;
