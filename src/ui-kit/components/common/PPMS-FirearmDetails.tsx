import React, { useEffect, useState } from "react";
import PPMSCard from "./card/PPMS-card";
import PPMSCardBody from "./card/PPMS-card-body";
import { PPMSCardGroup } from "./card/PPMS-card-group";
import { formatICN, formatTCN } from "../../utilities/FormatUtil";

export interface PPMSFirearmDetailsProps {
  icn: string;
  itemName: string;
  serialNumber: string;
  tcn: string;
}

export interface PPMSFirearmDetailsState {}

export class PPMSFirearmDetails extends React.Component<
  PPMSFirearmDetailsProps,
  PPMSFirearmDetailsState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <PPMSCardGroup className={"ppms-card-group ui-ppms"}>
          <PPMSCard>
            <PPMSCardBody className="firearm-details">
              <div className={"grid-row grid-gap"}>
                <div className="tablet:grid-col-3">
                  <div className="tablet:grid-row">
                    <b>ICN</b>
                  </div>
                  <div className="tablet:grid-row">
                    <a
                      href={
                        "/viewProperty/" + this.props.icn.replaceAll("-", "")
                      }
                    >
                      {formatICN(this.props.icn)}
                    </a>
                  </div>
                </div>
                <div className="tablet:grid-col">
                  <div className="tablet:grid-row">
                    <b>Item Name</b>
                  </div>
                  <div className="tablet:grid-row">
                    <strong>{this.props.itemName}</strong>
                  </div>
                </div>
                <div className="tablet:grid-col-2">
                  <div className="tablet:grid-row">
                    <b>Firearm Serial</b>
                  </div>
                  <div className="tablet:grid-row">
                    <strong>{this.props.serialNumber}</strong>
                  </div>
                </div>
                <div className="tablet:grid-col-2">
                  <div className="tablet:grid-row">
                    <b>TCN</b>
                  </div>
                  <div className="tablet:grid-row">
                    <strong>{formatTCN(this.props.tcn)}</strong>
                  </div>
                </div>
              </div>
            </PPMSCardBody>
          </PPMSCard>
        </PPMSCardGroup>
      </>
    );
  }
}
