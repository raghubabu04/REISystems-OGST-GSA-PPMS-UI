import React from "react";

interface BidderContractDisputeProps {}
export class ContractDispute extends React.Component<
  BidderContractDisputeProps,
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
              <a href="#contract">Contract Disputes</a>
            </li>
            <li>
              <a href="#chargebacks">Chargebacks</a>
            </li>
            <li>
              <a href="#sale">Sale of Specialized Property</a>
            </li>
            <li>
              <a href="#description">Description Warranty & Refunds</a>
            </li>
            <li>
              <a href="#adjustment">
                Adjustment for Variation in Quantity, Weight and Mileage
              </a>
            </li>
            <li>
              <a href="#recalls">Recalls</a>
            </li>
            <li>
              <a href="#pre-award">Pre-award Mis-description</a>
            </li>
            <li>
              <a href="#refunds">Refunds Claim Procedures</a>
            </li>
            <li>
              <a href="#refund">Refund Amount</a>
            </li>
            <li>
              <a href="#claims">Claims of Mis-description</a>
            </li>
            <li>
              <a href="#default">Default</a>
            </li>
            <li>
              <a href="#liquidated">Liquidated Damages</a>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <div id="contract">
            <h4>Contract Disputes</h4>
            <span>
              Contracts resulting from the sale of any offer in the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov
              </a>{" "}
              website are subject to the Contract Disputes Act of 1978{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://uscode.house.gov/view.xhtml?path=/prelim@title41/subtitle3/chapter71&edition=prelim"
              >
                (41 USC 7101-7109),
              </a>{" "}
              as amended. <br /> <br />
              Successful Bidders are reminded that an award constitutes a
              binding contract with the United States Government. The online
              Terms and Conditions as well as the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
              >
                114C General Sales Terms and Conditions
              </a>{" "}
              define the process and conditions under which a bidder may make a
              claim or dispute a contract. To dispute a contract, bidders must
              contact the Sales Contracting Officer for the sale.
            </span>
          </div>
          <div id="chargebacks">
            <h4>Chargebacks</h4>
            <span>
              If at any point during the disputes process the bidder takes
              action contrary to the prescribed process and effects a chargeback
              via the bidder's credit card company, GSA will be notified by its
              credit card processing company and will make every effort to deny
              the chargeback in lieu of the prescribed dispute process. GSA may
              also restrict access to the bidders GSA Auctions account until
              chargeback issues are resolved. <br /> <br />
              If the bidder has removed the property and receives a refund by
              his/her charge card company due to a chargeback, the bidder will
              be considered to have unauthorized possession of the property at
              issue because the bidder has breached the contract with the
              Government by failing to submit payment for the property. Under
              such circumstances, GSA will take appropriate legal action against
              the bidder. Additionally, GSA will open a claim with its Finance
              office resulting in a series of demand letters until payment is
              received. If the payment for the debt has not been received within
              120 days, the claim will be submitted to the Department of the
              Treasury for collection of payment. The moneys owed may be
              collected through the Treasury Cross Services Program which
              includes the Treasury Offset Program (TOP).
            </span>
          </div>
          <div id="condition">
            <h4>Condition of Property</h4>
            <span>
              <strong>
                {" "}
                The following replaces Clause No. 2 of the General Terms and
                Conditions of the{" "}
                <a
                  className="usa-link usa-link--external ppms-external-link"
                  target="_blank"
                  href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
                >
                  Standard Form (SF) 114C:
                </a>{" "}
              </strong>{" "}
              Condition of property is not warranted. Deficiencies, when known,
              have been indicated in the property descriptions. However, absence
              of any indicated deficiencies does not mean that none exists.
              Therefore, the bidder should ascertain the condition of the item
              through physical inspection. Please also reference the Inspection
              of Property clause.
            </span>
          </div>
          <div id="sale">
            <h4>Sale of Specialized Property</h4>
            <span>
              For items previously held in government custody due to seizures,
              forfeitures, liens or other legal actions, special terms and
              conditions apply for items offered on behalf of the IRS. In these
              instances, Clause 2 of the General Sales Terms and Conditions (SF
              114C -2001) is superseded. The Sales Online Clauses are amended,
              and the following terms apply: <br /> <br />
              All property is offered for sale ''where is'' and ''as is'' and
              without recourse against the United States. No guaranty or
              warranty, express or implied, is made as to the validity of the
              title, quality, quantity, weight, size, or condition of any of the
              property, or its fitness for any use or purpose. No claim will be
              considered for allowance or adjustment or for rescission of the
              sale based on failure of the property to conform with any
              expressed or implied representation.
            </span>
          </div>
          <div id="description">
            <h4>Description Warranty & Refunds</h4>
            <span>
              The Government warrants to the original purchaser that the
              property listed on{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov
              </a>{" "}
              will conform to its written description. Features,
              characteristics, deficiencies, etc. not addressed in the
              description are excluded from this warranty. GSA further cautions
              bidders that GSA's written description represents GSA's best
              effort to describe the item based on the information provided to
              it by the owning agency. Therefore, gross omissions regarding the
              functionality of items, failures to cite major missing parts
              and/or restrictions with regards to usage may occur. <br /> <br />
              The Government does not warrant the merchantability of the
              property or its purpose. The purchaser is not entitled to any
              payment for loss of profit or any other money damages - special,
              direct, indirect, or consequential.
            </span>
          </div>
          <div id="adjustment">
            <h4>Adjustment for Variation in Quantity, Weight and Mileage</h4>
            <span>
              The following replaces Clause No. 12 of the General Terms and
              Conditions of the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
              >
                Standard Form (SF) 114C:
              </a>{" "}
              The Government reserves the right to vary the quantity, weight,
              and mileage offered or available to the purchaser as follows:
            </span>
            <ul>
              <li>Quantity by 10%</li>
              <li>Weight by 25% </li>
              <li>Mileage by 500 miles</li>
            </ul>
            <span>
              The purchase price will be adjusted upward or downward in
              accordance with the unit price and on the basis of the quantity,
              weight or mileage offered. Unless otherwise specifically provided
              in the Invitation, no adjustment for such variation will be made
              where property is sold on a "price for the lot" basis.
            </span>
          </div>
          <div id="recalls">
            <h4>Recalls</h4>
            <span>
              Because executive agencies may or may not have made GSA aware of
              possible recalls, vehicles being sold on GSA Auctions℠ may have
              outstanding recalls. Potential purchasers should contact the
              National Highway Traffic Safety Administration at{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.nhtsa.gov/"
              >
                www.nhtsa.gov
              </a>{" "}
              for more information on recall campaigns. Purchasers should
              contact a manufacturer's dealership in their local area that
              services that brand of vehicle to address any outstanding recalls,
              or to verify that all recalls have been addressed and are
              repaired. Any outstanding recalls shall be the sole responsibility
              of the purchaser.
            </span>
          </div>
          <div id="pre-award">
            <h4>Pre-award Mis-description</h4>
            <span>
              Prior to the closing of a sale, the Government may identify or
              learn of a gross omission regarding the functionality of an item,
              major missing parts, and/or restrictions with regards to its use.
              If GSA is aware of this missed information prior to the close of a
              sale, the item may be pulled from the sale and resubmitted with
              the information or re-offered at a later date.
            </span>
          </div>
          <div id="refunds">
            <h4>Refunds Claim Procedures </h4>
            <span>
              Please be advised that refunds are not a frequent practice of GSA
              Auctions℠. A request for refund must be substantiated in writing
              to the Contracting Officer for issues regarding mis-described
              property, missing property and voluntary defaults within 15
              calendar days from the date of award.
            </span>
          </div>
          <div id="refund">
            <h4>Refund Amount</h4>
            <span>
              The refund is limited to an amount not to exceed the purchase
              price of the mis-described property.
            </span>
          </div>
          <div id="claims">
            <h4>Claims of Mis-description</h4>
            <span>
              If items have been awarded but not paid for and the successful
              bidder feels that the property is mis-described, he/she must
              follow these procedures: A written claim needs to be submitted to
              the{" "}
              <strong>
                Sales Contracting Officer within 15 calendar days from the date
                of award
              </strong>{" "}
              requesting release of contractual obligation for reasons
              satisfying that of a mis-description. No verbal contact with the
              custodian or the Sales Contracting Officer or any other federal
              official will constitute a notice of mis-description. <br />{" "}
              <br />
              When items are awarded and payment has been received, regardless
              of the removal status (removal may or may not have occurred), the
              successful bidder must submit a written notice to the Sales
              Contracting Officer within 15 calendar days from the date of
              payment e-mail (the Purchaser's Receipt). If property has been
              removed and the claim is accepted by the Sales Contracting
              Officer, the purchaser must maintain the property in its purchased
              condition and return it at their expense to the location
              designated by the Sales Contracting Officer or their designated
              official.
            </span>
          </div>
          <div id="default">
            <h4>Default</h4>
            <span>
              Bidders are cautioned to bid only on items they are prepared to
              pay for and remove in accordance with the online sale terms and
              conditions of this sale. Failure to pay for and remove all awarded
              items, or all items within a lot within the timeframe specified,
              could result in termination of the contract for default. The
              bidder will also be subject to paying liquidated damages plus
              applicable interest.
              <br /> <br />
              <strong>
                The following supersedes Clause No. 9 of the General Terms and
                Conditions of the{" "}
                <a
                  className="usa-link usa-link--external ppms-external-link"
                  target="_blank"
                  href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
                >
                  Standard Form (SF) 114C:
                </a>
                <br /> <br /> If you are awarded an item on GSA Auctions℠, you
                have a responsibility to pay for the item or lot that you were
                awarded within 2 business days from the date and time the award
                e-mail notification was sent and promptly remove it within 10
                business days from the date and time the award e-mail
                notification was sent, unless otherwise specified in the
                contract. If you fail to meet either of these two conditions,
                you will be in violation of the online sale terms and conditions
                of your contract with the Government and will be considered "in
                default". <br /> <br />
                As a defaulted bidder, you will be responsible for the payment
                of liquidated damages, an administrative fee for the processing
                and re-handling of the item for which you neglected to pay for
                and/or remove. A breakdown of the fee structure follows:
                <br /> <br />
              </strong>
              Purchase Price Fee Assessed
            </span>
            <table className="contract-dispute-table">
              <thead>
                <tr>
                  <th>If Purchase Price is</th>
                  <th>The Fee Charged will be</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ul>
                      <li> {"<"}$325.00</li>
                      <li> $325.00 - $100,000.00</li>
                      <li> {">"}$100,000.00</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li> Fee will equal to the award amount</li>
                      <li> Fee will be $325.00</li>
                      <li> Fee will be equal to 5% of the award amount</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            <span>
              The Government shall be entitled to retain (and/or to collect)
              this amount of the purchase price of the item(s) as to which the
              default occurred. Please note that in cases where bid deposits are
              required, the full amount of the bid deposit may be retained for
              the payment of liquidated damages. <br /> <br />
              Further, if an item or lot has been paid for but only a portion of
              the lot has been removed, The purchaser will not be entitled to
              any kind of refund. The purchaser will lose all rights and title
              to the property that they failed to remove prior to the removal
              deadline. Parties who have their contract terminated for default
              for failure to pay or remove will only be allowed to "browse"
              items. At the time that liquidated damages are paid, the bidder
              will be given access to begin bidding on items.
            </span>
          </div>
          <div id="liquidated">
            <h4>Liquidated Damages</h4>
            <span>
              Liquidated damage payments paid by credit cards are processed by
              GSA's Finance office on a daily basis. If a credit card is used in
              payment of liquidated damages owed, it can take up to 2 business
              days to process this payment and clear a user's GSA Auctions℠
              account. Avoid if at all possible, incurring liquidated damages.
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
