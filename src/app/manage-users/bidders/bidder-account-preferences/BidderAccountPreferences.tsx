import React, {useContext, useEffect} from "react";
import {BidderContext} from "../BidderContext";
import {isFormSubmitted} from "../../../../service/validation.service";
import {PPMSToggleCheckbox} from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

export default function BidderAccountPreferences() {

  const {bidderAccountPreferencesState} = useContext(BidderContext);

  useEffect(() => {
    let isCurrent = true;
    isFormSubmitted.subscribe((submit) => {
      if (submit && isCurrent) {
        isFormSubmitted.next(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [bidderAccountPreferencesState]);

  function handleChange(event: any) {
    let state = bidderAccountPreferencesState;
    event.forEach((e) => {
      if (e.id === "notifyAuctionWin")
        state.notifyAuctionWin = e.isSelected;
      if (e.id === "notifyItemOutbid")
        state.notifyItemOutbid = e.isSelected;
    });
  }

  return (
    <React.Fragment>
      <div className={"grid-row grid-gap-4"}>
        <div className={"grid-col-12"}>
          <PPMSToggleCheckbox
            isRequired={false}
            id={"accountPreferences"}
            options={bidderAccountPreferencesState.accountPreferencesOptions}
            isInline={false}
            isDisabled={false}
            isSingleSelect={false}
            name={"accountPreferences"}
            className={"accountPreferences"}
            validationMessage={""}
            onChange={handleChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
