import React from "react";
import {FaAddressCard} from "react-icons/fa";

import {PPMSPopover} from "./common/PPMS-popover";
import {isEmptyCheck} from "./validations/FieldValidations";

export interface InfoField {
  key: string;
  value: string;
}

export interface PropertyContact {
  popOverTitle: string;
  cellValue: string;
  fields: InfoField[];
}

export default function PPMSTableInfoCell(props: PropertyContact) {
  const contactInfo = (
    <div className={"ppms-usa-info-tip"}>
      <h5>{props.cellValue}</h5>
      {props.fields.map((f) => {
        if (!isEmptyCheck(f.value)) {
          return (
            <>
              {f.key}: {f.value}
              <br />
            </>
          );
        }
        return "";
      })}
    </div>
  );

  return (
    <>
      {props.cellValue}
      <PPMSPopover
        trigger={["click"]}
        id={`poc-info-${props.cellValue}`}
        placement={"right"}
        popoverTitle={props.popOverTitle}
        popoverContent={contactInfo}
        triggerSource={
          <FaAddressCard className={`ppms-usa-contact-info-icon`} title={"address-card"}/>
        }
      />
    </>
  );
}
