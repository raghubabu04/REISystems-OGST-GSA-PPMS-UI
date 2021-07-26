import React, { useContext } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { PPMSAlert } from "../../../../ui-kit/components/common/PPMS-alert";
import { BidderContext } from "../BidderContext";
import { BidderInformationRegistration } from "./bidderInformationRegistration/BidderInformationRegistration";
import { Bidding } from "./bidding/Bidding";
import { ContractDispute } from "./contractDispute/ContractDispute";
import { PaymentAndRemoval } from "./paymentAndRemoval/PaymentAndRemoval";
import { SpecialNotes } from "./specialNotes/SpecialNotes";
import { PPMSToggleCheckbox } from "../../../../ui-kit/components/common/toggle/PPMS-toggle";

interface BidderTermsAndConditionsProps { }
export default function BidderTermsAndConditions(
  props: BidderTermsAndConditionsProps
) {
  const {
    bidderTermsAndConditionsState,
    updateBidderTermsAndConditionsState,
  } = useContext(BidderContext);

  function handleBtnClicked(value: any) {
    if (value !== null) {
      updateBidderTermsAndConditionsState({
        activeKey: value,
      });
    }
  }
  function handleAgreementChange(target) {
    const value = target[0];
    if (value.isSelected === true) {
      updateBidderTermsAndConditionsState({
        isAllTermsAndConditionAccepted: true,
      });
    } else { updateBidderTermsAndConditionsState({ isAllTermsAndConditionAccepted: false }); }
  }

  return (
    <React.Fragment>
      <div className="grid-row grid-gap-4 terms-conditions-wrapper">
        <PPMSAlert
          isAlertSlim={true}
          alertVariant="warning"
          alertClassName="terms-and-conditions-notice"
          alertKey="terms-and-conditions-notice"
          id="terms-and-conditions-notice"
          alertStartWithBoldText="Notice: "
          show={true}
          alertBody="GSA Auctions℠ offers for sale personal property (e.g. vehicles, computers, heavy equipment, jewelry, furniture, etc.) and real property (real estate). Please note that these Online Sale Terms and Conditions apply to personal property ONLY. Real property sales have separate terms and conditions as specified in the Invitation for Bids (IFB) prepared for each sale. Users/Bidders must complete the Bidder Registration and Bid Form included in the IFB and provide the specified deposit such as bid deposit and performance bond before they will be allowed to bid on that property."
        />
        <PPMSAlert
          isAlertSlim={true}
          alertVariant="warning"
          alertClassName="terms-and-conditions-warning"
          alertKey="terms-and-conditions-warning"
          id="terms-and-conditions-warning"
          alertStartWithBoldText="Warning: "
          show={true}
          alertBody="GSA reserves the right to change the online sale terms and conditions. Bidders are cautioned to periodically review these terms and conditions for possible updates and changes. If a bidder does not agree to the presented terms and conditions they cannot place bids on property. If for any reason GSA Auctions℠ believes that the bidder has not complied with these Terms and Conditions, GSA may at its sole discretion cancel your registration and forward an e-mail to the address currently on file stating that the account has been terminated. Terms and Conditions apply to all users with registered accounts."
        />
        <span className="usa-terms-conditions-text">
          By accepting the GSA Auctions℠ Terms and Conditions, bidders are also
          agreeing to the General Sales Terms and Conditions (
          <a
            className="usa-link usa-link--external ppms-external-link"
            href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
            target="_blank"
          >
            Standard Form 114C, April 2001
          </a>
          ). To view pdf files, you need Adobe's Acrobat Reader.{" "}
          <a
            className="usa-link usa-link--external ppms-external-link"
            href="https://get.adobe.com/reader/"
            target="_blank"
          >
            Download Adobe Reader
          </a>{" "}
          for free, if you do not have it already. The General Sales Terms and
          Conditions define in detail Inspection: Condition and Location of
          Property; Consideration of Bids; Forms of Bid Deposits and Payments;
          Bid Price Determination; Payment; Title; Delivery, Loading and Removal
          of Property; Defaults; Setoff of Refunds; Interest; Adjustment for
          Variation in Quantity or Weight; Weighing Switching and Spotting; Risk
          of Loss, Limitation on Governments Liability; Oral Statements and
          Modifications; Covenant Against Contingent Fees; Official not to
          Benefit; Certificate of Independent Price Determination; Assignments
          of Claims Liability; Withdrawal of Property After Award.
        </span>
        <Tabs
          // defaultActiveKey={"bidder-information-registration"}
          id="bidder-information-registration-tab"
          activeKey={bidderTermsAndConditionsState.activeKey}
          onSelect={handleBtnClicked.bind(this)}
          className={"ppms-tabs terms-and-conditions-tabs"}
        >
          <Tab
            eventKey="bidder-information-registration"
            title="Bidder Info & Registration"
            className={"terms-and-conditions-tab-font"}
          >
            <div className="bidder-wrapper">
              <BidderInformationRegistration />
            </div>
          </Tab>
          <Tab
            eventKey="bidding"
            title="Bidding"
            disabled={false}
            className={"terms-and-conditions-tab-font terms-and-conditions-tab-margin"}
          >
            <div className="bidder-wrapper">
              <Bidding />
            </div>
          </Tab>
          <Tab
            eventKey="contract-disputes"
            title="Contract Disputes"
            disabled={false}
          >
            <div className="bidder-wrapper">
              <ContractDispute />
            </div>
          </Tab>
          <Tab
            eventKey="payment-removal"
            title="Payment & Removal"
            disabled={false}
          >
            <div className="bidder-wrapper">
              <PaymentAndRemoval />
            </div>
          </Tab>
          <Tab
            eventKey="specail-notes"
            title="Special Notes"
            disabled={false}
          >
            <div className="bidder-wrapper">
              <SpecialNotes />
            </div>
          </Tab>
        </Tabs>
        <div className="terms-condition-footer">
          <span>
            Terms & Conditions Effective Date: 01/30/2020 <br />
            GSA reserves the right to change the online sale terms and
            conditions. Bidders are cautioned to periodically review these terms
            and conditions for possible changes.
          </span>
        </div>
        <div className="bidder-terms-checkbox">
          <div className={"grid-col-12"}>
            <PPMSToggleCheckbox
              id={"bidder-agreement-registration-id"}
              options={bidderTermsAndConditionsState.agreementOptions}
              isDisabled={false}
              name={"agreement"}
              className={"toggle-single-checkbox"}
              label={""}
              validationMessage={""}
              onChange={(event) => handleAgreementChange(event)}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
