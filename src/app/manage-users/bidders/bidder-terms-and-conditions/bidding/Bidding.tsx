import React from "react";

interface BiddingProps {}
export class Bidding extends React.Component<BiddingProps, any> {
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
              <a href="#photographs">Photographs</a>
            </li>
            <li>
              <a href="#inspection">Inspection of Property</a>
            </li>
            <li>
              <a href="#reporting">
                Reporting Discrepancies/Hazardous Materials
              </a>
            </li>
            <li>
              <a href="#oral">Oral Statements and Modifications</a>
            </li>
            <li>
              <a href="#submission">Submission of Bid</a>
            </li>
            <li>
              <a href="#consideration">Consideration of Bid</a>
            </li>
            <li>
              <a href="#modification">Modification of Bids</a>
            </li>
            <li>
              <a href="#reserve">Reserve Price</a>
            </li>
            <li>
              <a href="#bid">Bid Closings</a>
            </li>
            <li>
              <a href="#notifications">Notification of Sale Results</a>
            </li>
            <li>
              <a href="#bid-extensions">Bid Extensions</a>
            </li>
            <li>
              <a href="#canceled">Canceled Auctions</a>
            </li>
            <li>
              <a href="#terminated">Terminated Auctions</a>
            </li>
            <li>
              <a href="#reoffering">Reoffering and Resale of items</a>
            </li>
            <li>
              <a href="#restricted">
                Restricted Access from Logging in or Bidding
              </a>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <div id="photographs">
            <h4>Photographs</h4>
            <span>
              Photographs may not depict an exact representation of the bid
              item(s) and should not be relied upon in place of written item
              descriptions or as a substitute for physical inspection. Please
              contact the custodian for inspection dates and times. <br />{" "}
              <br />
              GSA makes no representation or warranty regarding use of the
              photos on this site. Some may be U.S. government work and free
              from copyright, some may be produced by other than the government
              and GSA may be using the photograph with permission from the
              copyright holder. If you have interest in using a particular
              photo, it is your responsibility to determine if it is copyrighted
              or available for use without permission.
            </span>
          </div>
          <div id="inspection">
            <h4>Inspection of Property </h4>
            <span>
              Inspection must be coordinated in advance with the property
              location's point of contact (listed on the item description page).
              Please note that access to property may be limited due to property
              being located in a restricted area. GSA will do all that it can to
              ensure that photos and detailed descriptions are provided in these
              instances, subject to the disclaimer about photographs listed
              above. For property not located in restricted areas, bidders have
              the opportunity to physically inspect the property prior to
              placing a bid and prior to the auction's closing date and time or
              thereby waive the opportunity to conduct a physical inspection. In
              waiving their inspection rights, bidders bear the risk for any
              gross omissions regarding the functionality of items,failure to
              cite major missing parts, and/or restrictions with regards to
              usage that would have been revealed by physical inspection. No
              inspections will be permitted once the sale has closed. <br />{" "}
              <br />
              During an inspection at a Government facility, bidders shall
              proceed at their own risk. The U.S. Government will not be liable
              for any or all debts, judgments, costs, demands, suits, actions,
              or claims of any nature arising from or incidental to an
              inspection at the Government facility, including any injuries that
              bidders may incur due to their own actions or neglect on during
              their visit to a Government facility. <br /> <br />
              Bidders must comply with all building rules and policies during
              the inspection process. This may include, but is not limited to,
              submitting proper identification, vehicle information, parking
              compliance, elevator usage, etc. Bidders are encouraged to contact
              the custodian prior to inspection for specific building policies.
            </span>
          </div>
          <div id="reporting">
            <h4>Reporting Discrepancies/Hazardous Materials</h4>
            <span>
              Prospective purchasers are asked to inform the sales office of any
              discrepancies in the property descriptions discovered while
              inspecting the property and of any lots in this sale that contain
              hazardous material/waste not indicated in the property
              descriptions.
            </span>
          </div>
          <div id="oral">
            <h4>Oral Statements and Modifications </h4>
            <span>
              Any oral statement or representation by any representative of the
              Government, changing or supplementing the offering or contract or
              any condition thereof, is unauthorized and shall confer no right
              upon the bidder or purchaser. Further, no interpretation of any
              provision of the contract, including applicable performance
              requirements, shall be binding on the government unless furnished
              or agreed to, in writing by the Contracting Officer or his
              designated representative.
            </span>
          </div>
          <div id="submission">
            <h4>Submission of Bid</h4>
            <span>
              Bids are submitted by Proxy (Maximum Bid) or by Flat bid (Current
              active bid placed). Proxy bidding is the ability to submit the
              maximum amount that a bidder is willing to pay for an item and to
              allow the system to incrementally bid on the bidders behalf up to
              the maximum amount entered. A Flat bid is the lowest (minimum) bid
              that a bidder can place. Any increase or counter-offer of bidding
              using the Flat bid method must be manually submitted by the bidder
              and must meet the bid increment requirement. The system recognizes
              the maximum dollar amount listed for Proxy bids and in instances
              when a Proxy bid exceeds a Flat bid by less than the full bid
              increment, the Proxy bid will still be selected as the high bid
              because it is always bid to its maximum. In the event that a Proxy
              bid maximum results in a tie bid with another Proxy bid or a Flat
              bid, the time submission of the Proxy bid will be a determining
              factor for award. The Proxy bid that is entered into the system
              first will be the winning bid. <br /> <br />
              Bids are only accepted in whole U.S. Dollar amounts. Do not enter
              dollar signs ($) commas (,), periods (.) or cents (¢). Bidding
              will begin and end at the dates and times specified for each lot
              in the
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov
              </a>
              website. <strong>Please note:</strong> The times displayed at GSA
              Auctions℠ are in <strong>Central time.</strong> In addition,
              certain auctions are designed to extend the closing time if there
              is bidding activity. The extended bidding time varies with each
              auction. Bidders are urged to review the bidding details and
              enhanced bidding logic at GSA Auctions℠ for auction details. It is
              the responsibility of the bidder to follow-up on the status of
              his/her bid. <br /> <br />
              When bidding on property via{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov,
              </a>{" "}
              funds or monies should be readily available; GSA is not obligated
              to wait for bidders to arrange for financing.
            </span>
          </div>
          <div id="consideration">
            <h4>Consideration of Bid </h4>
            <span>
              It is the policy of GSA Auctions℠ to monitor bids and other
              activity to ensure the proper use of{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov.
              </a>{" "}
              The Government reserves the right to reject any and all bids. Bids
              can be rejected for any reason, especially those containing
              inaccurate, incomplete or unverifiable information, or information
              which is deemed to have been given in bad faith. GSA Auctions℠
              monitors for suspicious bids. Such bids are subject to
              investigation and cancellation at any time. If GSA Auctions℠
              removes a bid, the bidder with the next highest bid, who is in
              compliance with the online terms and conditions, will become the
              current high bid. It is a violation of law to submit bids using a
              false name or any other fraudulent information, and such bids may
              not be processed, even if GSA Auctions℠ initially accepts a bid.
              Be aware that if you provide false information, GSA Auctions℠ will
              remove you from the database and may pursue all legal means
              available to the Federal Government to prosecute.
            </span>
          </div>
          <div id="modification">
            <h4>Modification of Bids </h4>
            <span>
              The following replaces{" "}
              <strong>
                Clause No. 3.(b) of the General Terms and Conditions of the{" "}
                <a
                  className="usa-link usa-link--external ppms-external-link"
                  target="_blank"
                  href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
                >
                  Standard Form (SF) 114C:
                </a>
              </strong>{" "}
              Bids received for items offered in the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov
              </a>{" "}
              website may be raised before the closing date and time, as
              specified in the offering. Proxy bid limits may be replaced with a
              higher or lower proxy bid limit provided that the amount is
              greater than or equal to the minimum bid required by the system. A
              bidder cannot lower a proxy if the new, lower amount has already
              been exceeded. The minimum bid is the current high bid plus the
              amount of the bid increment. Proxy bid limits placed in the system
              may also be replaced with a flat bid; the flat bid will cancel the
              proxy bid limit. Additionally, the flat bid must be greater than
              or equal to the minimum bid required by the system. The minimum
              bid is the current winning bid plus the amount of the bid
              increment. Flat (minimum) bids may be replaced with proxy bid
              limit. Proxy bid limit must be greater than or equal to the
              minimum bid required by the system.{" "}
              <strong>Bidders cannot cancel bids.</strong>
            </span>
          </div>
          <div id="reserve">
            <h4>Reserve Price</h4>
            <span>
              Auctions may have a reserve price which is not disclosed to the
              general public. A reserve price is the minimum amount that the
              Government is willing to accept for the property. If the reserve
              price is not met, GSA is not obligated to sell the item. However,
              if it is in the best interest of the Government, the SCO may
              accept a submitted bid that is lower than the reserve price and
              elect to make an award. <br /> <br />
              When submitting a proxy bid limit on an auction with a reserve
              price, a proxy bid that meets or exceeds the reserve price will
              automatically set the current bid at the reserve price.
            </span>
          </div>
          <div id="bid">
            <h4>Bid Closings</h4>
            <span>
              A sale is considered closed when the countdown clock goes down to
              zero (0); the system will automatically refresh the browser page
              once. Next to "time remaining," it will either (a) state the new
              remaining time after a sale extension due to bidding activity or
              (b) state that the sale is closed. For items offered under special
              sales authority, no bid extension will be activated due to bidding
              activity and the sale will close at the time listed. Bidders are
              cautioned that bids submitted within the last seconds of the sale
              closing risk the loss of submission/acceptance due to any number
              of factors, including the bidder's internet connectivity and the
              system's speed. In cases of disputes, only recorded bids will be
              considered.
            </span>
          </div>
          <div id="notifications">
            <h4>Notification of Sale Results</h4>
            <span>
              Successful bidders will be notified by e-mail and must contact the
              regional sales office within two (2) business days from the date
              and time the award e-mail notification was sent to make payment.
              Bid results will not be furnished via telephone or fax. It is the
              bidder's responsibility to follow-up on the status of the auction
              and to ensure that the bidder's e-mail address and all
              registration data are kept accurate and up-to-date. If at any
              time, the bidder's information changes, it is the bidder's
              responsibility to update the appropriate information on
              GSAAuctions.gov . Warning: If any e-mails are undeliverable and
              returned due to an inaccurate e-mail address, GSA may remove such
              registrants from the database. Undelivered e-mails do not excuse a
              successful bidder's obligation to complete contractual obligations
              made with GSA. These contractual obligations include making timely
              payments and removing awarded property within the time specified.
              Failure to do so, will result in a termination for default. Sales
              results may be obtained by a successful bidder in their personal
              summary after the sale closes.
            </span>
          </div>
          <div id="bid-extensions">
            <h4>Bid Extensions</h4>
            <span>
              Occasionally, technical problems will interrupt the bidding
              process for an unspecified amount of time. These interruptions may
              affect some or all bidders. In the event of an interruption, an
              evaluation of the length of interruption time and the numbers of
              bidders affected may prompt GSA Auctions℠ to extend the closing
              time for an auction. Extension may range from 1 hour to 24 hours
              based on the aforementioned criteria, to ensure fair and full
              competition. An e-mail notification will be sent to those bidders
              who participated in these auctions when there are extensions due
              to technical problems. Bidders must monitor their bidding activity
              online to obtain new closing dates and times when these extensions
              occur. <br /> <br />
              For "specialty items" offered on behalf of the IRS, the sale
              closing will end no later than 11:59 PM on the day of the sale
              without the option for bid extensions.
            </span>
          </div>
          <div id="canceled">
            <h4>Canceled Auctions </h4>
            <span>
              Due to technical problems encountered from time to time,
              situations may arise that warrant GSA canceling awards because
              full and open competition consistent with the value and nature of
              the property was not met. Items may be reoffered at a later date.
              An e-mail notification will be sent to those bidders who
              participated in these auctions when they are canceled.
            </span>
          </div>
          <div id="terminated">
            <h4>Terminated Auctions</h4>
            <span>
              It may be necessary to withdraw items from bidding due to
              technical errors or uncontrollable circumstances. Auctions may be
              terminated because the property is no longer available due to
              Federal or state agency needs; property becomes damaged; property
              is stolen, or property was improperly described. Items may be
              reoffered at a later date. An e-mail notification will be sent to
              those bidders who participated in these auctions when they are
              terminated.
            </span>
          </div>
          <div id="reoffering">
            <h4>Reoffering and Resale of Items</h4>
            <span>
              Please be advised that items that are available on GSA Auctions℠
              are considered property of the Federal Government until which time
              it is awarded, paid for and removed from Federal premises. As
              such, this property may not be advertised, offered, pre-sold or
              otherwise represented as the property of any bidder for personal
              gain, prior to the award, payment and full possession of
              items/lots by the awarded bidder. Actions made in violations of
              this warning may result in legal action and prosecution against
              the awarded bidder, by the Government. <br /> <br />
              The offerings on this website are considered proprietary and are
              not available for use by third parties to promote, advertise, or
              otherwise sell allegedly on behalf of the Government. Such actions
              would require a contractual agreement with GSA Auctions℠, which
              such agreement will not be granted. Please be advised that any
              cost for such marketing efforts will not be reimbursed by GSA, and
              any representation allegedly on behalf of GSA will be considered
              fraudulent.
            </span>
          </div>
          <div id="restricted">
            <h4>Restricted Access from Logging in or Bidding</h4>
            <span>
              There are a number of reasons GSA may restrict a user's access to
              logging into GSAAuctions.gov or submitting a bid. These reasons
              include:
            </span>
            <ul>
              <li>Providing false information;</li>
              <li>Submitting bids using unacceptable/profane usernames;</li>
              <li>Defaulting on a previously awarded GSA Auctions contract;</li>
              <li>Initiating a chargeback;</li>
              <li>Violating the Terms and Conditions; and/or</li>
              <li>
                Any adverse behavior that GSA considers justifiable to restrict
                access to logging in or bidding.
              </li>
            </ul>
            <span>
              Once the above issues have been resolved, the restriction will be
              lifted.
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
