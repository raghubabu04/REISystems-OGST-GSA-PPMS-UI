import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { UserApiService } from "../../../../api-kit/user/user-api.service";
import PPMSAccordion from "../../../../ui-kit/components/common/accordion/PPMS-accordion";
import { getUserInfo } from "../../../../_redux/_helpers/auth-header";
import { BidderContext } from "../BidderContext";
import { BidderSummaryChanges } from "./BidderSummaryChanges";
import TermsAndConditions from "./TermsAndCondtions";

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
  actions: any;
}

export function SummaryOfChanges(props: Props) {

  const {
    termsAndConditionsState,
    updateTermsAndConditionsState,
    bidderTermsAndConditionsState,
    updateBidderTermsAndConditionsState,
  } = useContext(BidderContext);

  const user = getUserInfo();
  const userApiService = new UserApiService();

  useEffect(() => {
    userApiService
      .getBidderVersionNumber()
      .then((res: any) => {
        updateTermsAndConditionsState({ currentVersionNumber: res?.data, listOfVersionNumber: numberRange(parseInt(user?.bidderVersionNumber), res?.data) });
      }).catch(error => console.log(error))
  }, [])

  function numberRange(start, end) {
    return new Array(end - start).fill(0).map((d, i) => "RESAUCNT00" + ((i + 1) + start).toString());
  }
  function onClickCheckBox() {
    bidderTermsAndConditionsState.agreementOptions.forEach((r) => {
      (r.isSelected = false)
    });
  }

  return (
    <>
      <div className="grid-row">
        <div className={"desktop:grid-col-12"}>
          {!termsAndConditionsState.isNextClicked ? (
            <BidderSummaryChanges
              versions={termsAndConditionsState.listOfVersionNumber}
              isNextClicked={(value) => updateTermsAndConditionsState({ isNextClicked: value })} />
          ) : (
              <TermsAndConditions
                userName={user?.bidderUserName}
                currentVersionNumber={termsAndConditionsState.currentVersionNumber}
                isAllTermsAndConditionAccepted={bidderTermsAndConditionsState.isAllTermsAndConditionAccepted}
                bidderAccountsSize={user?.bidderAccountsSize}
                disableCheckbox={onClickCheckBox}
              />
          )}
        </div>
      </div>
    </>
  )

}
const mapDispatchToProps = (dispatch) => {
};
export default connect(null, mapDispatchToProps)(SummaryOfChanges);

