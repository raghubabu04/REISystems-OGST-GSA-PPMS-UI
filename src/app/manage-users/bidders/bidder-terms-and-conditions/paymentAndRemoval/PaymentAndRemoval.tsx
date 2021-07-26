import React from "react";

interface BidderPaymentAndRemovalProps {}
export class PaymentAndRemoval extends React.Component<
  BidderPaymentAndRemovalProps,
  any
> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <div className="content">
          <ul>
            <li>
              <a href="#payment">Payment and Removal Timeframes</a>
            </li>
            <li>
              <a href="#withdrawal">Withdrawal of Property After Award</a>
            </li>
            <li>
              <a href="#forms">Forms of Payment</a>
            </li>
            <li>
              <a href="#property">Property of Federal Government</a>
            </li>
            <li>
              <a href="#removal">Removal</a>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <div id="payment">
            <h4>Payment and Removal Timeframes</h4>
            <span>
              If you are the successful bidder, property must be paid for within
              2 business days and property removed within 10 business days from
              the time and date of the award e-mail notification of sale
              results, unless otherwise specified in the contract. After payment
              is processed, a copy of the Purchaser's Receipt and Authority to
              Release Property will be e-mailed, faxed or mailed to the
              successful bidder based upon the information that was provided at
              the time of registration. <br /> <br />
              <strong>Note:</strong> GSA Auctions℠ may delay removal on an item
              if they find it necessary to validate payment or to identity the
              removing agent by the winning bidder. In some cases the credit
              card used to make an online payment may need to be verified and or
              a notarized power of attorney may be required.
            </span>
          </div>
          <div id="withdrawal">
            <h4>Withdrawal of Property After Award </h4>
            <span>
              The Government reserves the right to withdraw for its use any or
              all of the property covered by this contract, if a bona fide
              requirement for the property develops or exists up to the time of
              the Government's acceptance of the high bid of the property. In
              the event of a withdrawal under this condition, the Government
              shall be liable only for the refund of the contract price of the
              withdrawn property or such portion of the contract price as it may
              have received.
            </span>
          </div>
          <div id="forms">
            <h4>Forms of Payment </h4>
            <span>
              Payment is restricted to the following instruments: U.S. currency
              (no greater than $10,000); bank cashier's check; credit union
              cashier's check issued by a Federal or State chartered Credit
              Union; U.S. Postal Service or commercial money order; travelers'
              checks; official checks; properly endorsed United States Federal,
              State, or local government checks; MasterCard, VISA, Discover
              (Novus), American Express, processed manually or online through
              the Department of Treasury's electronic payment service via GSA
              Auctions℠ bidder's summary page; If you are making payment via
              EFT/Wire Transfers, please contact the regional Sales office
              responsible for a specific item to make arrangements. Certified
              checks, bank drafts and debit cards with dollar limitations and/or
              requiring a PIN number are not acceptable. <br /> <br />
              Online payments are processed through the Department of Treasury's
              electronic payment service via GSA Auctions℠, which is a secure
              government-wide payment collection portal and transaction engine
              created and managed by the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.fiscal.treasury.gov/"
              >
                U.S. Department of the Treasury's Financial Management Service
                (FMS) Bureau of Fiscal Service (BFS).
              </a>{" "}
              By Treasury policy effective June 1, 2015, credit card payments
              are restricted to a $24,999.99 dollar limit and no more than two
              cards per transaction. <br /> <br />
              If you are making payment in U.S. currency, please contact the
              regional Sales office responsible for a specific item to make
              arrangements. Some of our regional offices are not equipped to
              accept cash and other walk-in payments. A personal or company
              check will be accepted only when accompanied by a bank letter
              guaranteeing payment. This letter must be on bank letterhead and
              must state (1) that payment is guaranteed; (2) that the guarantee
              is valid for 30 days after the date of the award email
              notification; and (3) that the guarantee covers the purchase of
              U.S. Government personal property only. The letter must be dated,
              include the purchaser's name, the amount the guarantee is for,
              date of sale, sale and lot number, and be signed by a bank
              official authorized to guarantee payment. All sales are final.
            </span>
          </div>
          <div id="property">
            <h4>Property of Federal Government</h4>
            <span>
              Please be advised that title does not transfer for{" "}
              <strong>property of the Federal Government</strong> until such
              time as the property is removed from federal premises. If the
              property is located on local government or private property, it is
              still considered Federally-owned property until such time as it is
              removed.
            </span>
          </div>
          <div id="removal">
            <h4>Removal</h4>
            <span>
              Property must be removed{" "}
              <strong>within ten (10) business days</strong> from the date and
              time of award e-mail notification. Successful bidders should
              contact the custodian prior to removal for specific building and
              loading policies. The property custodian's phone number is listed
              on the property description page of GSAAuctions.gov. <br /> <br />
              A paid receipt entitled{" "}
              <u> Purchaser's Receipt and Authority to Release Property </u>{" "}
              must be presented to the property custodian at the time of removal
              to verify proof of purchase/payment;{" "}
              <strong>
                {" "}
                otherwise, removal will not be permitted. The person removing
                the property will be expected to sign the Purchaser's Receipt
                and leave the receipt with the property custodian as proof that
                the property was removed.
              </strong>{" "}
              <br /> <br />
              To the extent possible, special removal requirements will be
              included on the item description page of the item. Successful
              bidders <strong>must comply</strong> with all building rules and
              policies during the removal process. This may include, but is not
              limited to zonal or local permits, submitting proper
              identification, vehicle identification, parking and loading
              compliance, elevator usage, etc. <br /> <br />
              <strong> Please Note:</strong> If the successful bidder
              appoints/designates another person to act as the bidder's agent to
              remove property on the bidder's behalf, the bidder must{" "}
              <strong> notify the Sales Contracting Officer (SCO) </strong> and
              provide both the SCO and the third party person or agent, a Letter
              of Authorization, allowing them to remove the property. The Letter
              of Authorization must include:
            </span>
            <ul>
              <li>
                The name of the person or agent the successful bidder is
                authorizing to perform removal;
              </li>
              <li>The sale and lot number of the item(s); and</li>
              <li>
                The letter must be hard-copy signed by the successful bidder OR
                sent via the bidder's registered e-mail with an electronic
                signature date/time stamped.
              </li>
            </ul>{" "}
            <span>
              <strong>In addition</strong>, at the time of removal, the
              successful bidder or agent must:
            </span>
            <ul>
              <li>
                Present a copy of the Letter of Authorization (if an agent);
              </li>
              <li>Present a Government issued photo ID; </li>
              <li>
                Present the Purchaser's Receipt; (entitled "Authority to Release
                Property") to verify proof of purchase prior to removal,{" "}
                <strong> otherwise removal will not be permitted; and</strong>
              </li>
              <li>
                <strong>
                  Sign the Purchaser's Receipt and leave the receipt with the
                  custodian as proof that the property was removed.
                </strong>
              </li>
            </ul>{" "}
            <span>
              Successful bidders and/or their agents are cautioned that they are
              responsible for packing, loading, and removing any and all
              property awarded to them from the exact place where the property
              is located, as indicated on the item description page for each
              item that they purchase on{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov.
              </a>{" "}
              The successful bidders and/or their agents will make all
              arrangements and perform all work necessary to remove the
              property, to include packing, loading, and transporting the
              property. The Federal, State and local governments are not a party
              to the agreement between the successful bidder and third party
              shipping company and bears no responsibility to the successful
              bidder and/or shipping company as it relates to their agreement.
              The Government is not responsible for any disputes, storage fees,
              removal costs, or outstanding financial balances between a
              successful bidder and their third party shipping company. Federal
              employees will not suggest or endorse shipping and/or packaging
              companies.
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
