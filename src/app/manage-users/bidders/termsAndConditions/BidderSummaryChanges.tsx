import React, { useContext, useEffect, useState } from "react";
import { BidderContext } from "../BidderContext";
import { RESAUCNT001 } from "./bidderVersions/RESAUCNT001";
import { RESAUCNT0010 } from "./bidderVersions/RESAUCNT0010";
import { RESAUCNT0011 } from "./bidderVersions/RESAUCNT0011";
import { RESAUCNT0012 } from "./bidderVersions/RESAUCNT0012";
import { RESAUCNT0013 } from "./bidderVersions/RESAUCNT0013";
import { RESAUCNT0014 } from "./bidderVersions/RESAUCNT0014";
import { RESAUCNT0015 } from "./bidderVersions/RESAUCNT0015";
import { RESAUCNT0016 } from "./bidderVersions/RESAUCNT0016";
import { RESAUCNT0017 } from "./bidderVersions/RESAUCNT0017";
import { RESAUCNT0018 } from "./bidderVersions/RESAUCNT0018";
import { RESAUCNT0019 } from "./bidderVersions/RESAUCNT0019";
import { RESAUCNT002 } from "./bidderVersions/RESAUCNT002";
import { RESAUCNT003 } from "./bidderVersions/RESAUCNT003";
import { RESAUCNT004 } from "./bidderVersions/RESAUCNT004";
import { RESAUCNT005 } from "./bidderVersions/RESAUCNT005";
import { RESAUCNT006 } from "./bidderVersions/RESAUCNT006";
import { RESAUCNT007 } from "./bidderVersions/RESAUCNT007";
import { RESAUCNT008 } from "./bidderVersions/RESAUCNT008";
import { RESAUCNT009 } from "./bidderVersions/RESAUCNT009";
import { RESAUCNT00END } from "./bidderVersions/RESAUCNT00END";
import { RESAUCNT00START } from "./bidderVersions/RESAUCNT00START";

interface Props {
  versions: any;
  isNextClicked: any;
}

export function BidderSummaryChanges(props: Props) {

  const {
    termsAndConditionsState,
    updateTermsAndConditionsState,
  } = useContext(BidderContext);

  var components = {
    "RESAUCNT001": RESAUCNT001,
    "RESAUCNT002": RESAUCNT002,
    "RESAUCNT003": RESAUCNT003,
    "RESAUCNT004": RESAUCNT004,
    "RESAUCNT005": RESAUCNT005,
    "RESAUCNT006": RESAUCNT006,
    "RESAUCNT007": RESAUCNT007,
    "RESAUCNT008": RESAUCNT008,
    "RESAUCNT009": RESAUCNT009,
    "RESAUCNT0010": RESAUCNT0010,
    "RESAUCNT0011": RESAUCNT0011,
    "RESAUCNT0012": RESAUCNT0012,
    "RESAUCNT0013": RESAUCNT0013,
    "RESAUCNT0014": RESAUCNT0014,
    "RESAUCNT0015": RESAUCNT0015,
    "RESAUCNT0016": RESAUCNT0016,
    "RESAUCNT0017": RESAUCNT0017,
    "RESAUCNT0018": RESAUCNT0018,
    "RESAUCNT0019": RESAUCNT0019,
  };
  let Component = [];
  props.versions.forEach(v => {
    Component.push(components[v]);
  });
  return (
    <>
      <div className={"ui-ppms"}>
        <div className="header-row grid-row grid-gap-4">
          <h1>Summary of Changes</h1>
        </div>
        <RESAUCNT00START />
        {Component.map(Component => (
          <React.Fragment >
            <Component />
          </React.Fragment>
        ))}
        <RESAUCNT00END isNextClicked={(value) => props.isNextClicked(value)} />
      </div>
    </>
  )
}
