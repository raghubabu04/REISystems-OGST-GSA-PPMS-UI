import React from "react";
import { FaAddressCard, FaInfoCircle } from "react-icons/fa";
import { PPMSPopover } from "../common/PPMS-popover";

export interface FooterProps {
  location: string;
  fsc: string;
  type: string;
  typeDescription?: string;
  quantity: number;
  address: string;
  unitOfIssue: string;
  condition: string;
  icn: string;
  zip?: string;
}
export const AddToLot = (props: FooterProps) => {
  const {
    fsc,
    type,
    typeDescription,
    quantity,
    unitOfIssue,
    condition,
    icn,
    address,
    location,
    zip,
  } = props;
  return (
    <div className="item-search-result-input">
      <div className="grid-row tablet:grid-gap-3">
        <ul className={"usa-list usa-list-icn-card usa-list-icn-card-slim"}>
          <li>
            <span>Location </span>
            {location} {zip}
            <PPMSPopover
              trigger={["click"]}
              id={`poc-info-${icn}`}
              placement={"right"}
              popoverTitle={"Property Address"}
              popoverContent={
                <>
                  {address}
                  <br />
                  {location}-{zip}
                </>
              }
              triggerSource={
                <FaAddressCard className={`ppms-usa-contact-info-icon-lot`} />
              }
            />
          </li>
          <li>
            <span>FSC </span>
            {fsc}
          </li>
          <li>
            <span>Prop. Type </span>
            {type}{" "}
            <PPMSPopover
              trigger={["click"]}
              id={"Prop-type-InfoTip"}
              placement={"right"}
              popoverTitle={"Property Type Description"}
              popoverContent={<>{typeDescription}</>}
              triggerSource={
                <button
                  id={`prop-type-tooltip-button`}
                  type={"button"}
                  className={"usa-button  usa-button--unstyled"}
                >
                  <FaInfoCircle />
                </button>
              }
            />
          </li>
          <li>
            <span>QTY </span>
            {quantity} {unitOfIssue}
          </li>
          <li>
            <span>Condition </span>
            {condition}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddToLot;
