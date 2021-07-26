import React from "react";
import { PPMSCard } from "../../../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../../../ui-kit/components/common/card/PPMS-card-group";

interface displayCard3040Props {
  fy: string;
  quarter: string;
  beginningInventory: string;
  endingInventory: string;
}

export function DisplayCard3040(props: displayCard3040Props) {
  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms display-card-3040"}>
        <PPMSCard>
          <PPMSCardBody className="firearm-details">
            <div className={"grid-row grid-gap"}>
              <div className="tablet:grid-col-2">
                <div className="tablet:grid-row">
                  <b>FY</b>
                </div>
                <div className="tablet:grid-row">{props.fy}</div>
              </div>
              <div className="tablet:grid-col-3">
                <div className="tablet:grid-row">
                  <b>Quarter</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.quarter}</strong>
                </div>
              </div>
              <div className="tablet:grid-col-4">
                <div className="tablet:grid-row">
                  <b>Beginning Inventory</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.beginningInventory}</strong>
                </div>
              </div>
              <div className="tablet:grid-col-3">
                <div className="tablet:grid-row">
                  <b>Ending Inventory</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.endingInventory}</strong>
                </div>
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
}
