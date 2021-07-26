import React from "react";
import { PPMSCard } from "../../../../ui-kit/components/common/card/PPMS-card";
import { PPMSCardBody } from "../../../../ui-kit/components/common/card/PPMS-card-body";
import { PPMSCardGroup } from "../../../../ui-kit/components/common/card/PPMS-card-group";

interface FleetDisplayCardProps {
  saleNumber: string;
  lotNumber: string;
  aac: string;
  agencyNumber: string;
  contractNumber: string;
  propertyType: string;
}

export function FleetDisplayCard(props: FleetDisplayCardProps) {
  return (
    <>
      <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
        <PPMSCard>
          <PPMSCardBody className="firearm-details">
            <div className={"grid-row grid-gap"}>
              <div className="sale-number-col">
                <div className="tablet:grid-row">
                  <b>Sale Number</b>
                </div>
                <div className="tablet:grid-row">{props.saleNumber}</div>
              </div>
              <div className="tablet:grid-col-1">
                <div className="tablet:grid-row">
                  <b>Lot #</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.lotNumber}</strong>
                </div>
              </div>
              <div className="AAC-col">
                <div className="tablet:grid-row">
                  <b>AAC</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.aac}</strong>
                </div>
              </div>
              <div className="agency-number-col">
                <div className="tablet:grid-row">
                  <b>Agency Number</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.agencyNumber}</strong>
                </div>
              </div>
              <div className="tablet:grid-col-3">
                <div className="tablet:grid-row">
                  <b>Contract Number</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.contractNumber}</strong>
                </div>
              </div>
              <div className="tablet:grid-col-2">
                <div className="tablet:grid-row">
                  <b>Property Type</b>
                </div>
                <div className="tablet:grid-row">
                  <strong>{props.propertyType}</strong>
                </div>
              </div>
            </div>
          </PPMSCardBody>
        </PPMSCard>
      </PPMSCardGroup>
    </>
  );
}
