import React from "react";

interface BidderInformationRegistrationProps {
}
export class BidderInformationRegistration extends React.Component<
  BidderInformationRegistrationProps,
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
              <a href="#acknowledgement">
                Acknowledgement of Sales Terms and Conditions
              </a>
            </li>
            <li>
              <a href="#eligibility">Eligibility of Bidders</a>
            </li>
            <li>
              <a href="#sales-to-gov">Sales to Government Employees</a>
            </li>
            <li>
              <a href="#us">U.S. Citizenship</a>
            </li>
            <li>
              <a href="#bidders">Bidders Indebted to the Government</a>
            </li>
            <li>
              <a href="#registration">Registration</a>
            </li>
            <li>
              <a href="#international">International Registration</a>
            </li>
            <li>
              <a href="#multi">Multi Factor Authentication</a>
            </li>
            <li>
              <a href="#debt">Debt Collection Improvement Act of 1996</a>
            </li>
            <li>
              <a href="#fraud">Fraud</a>
            </li>
            <li>
              <a href="#notification">Notification of Sale Results</a>
            </li>
            <li>
              <a href="#antitrust">Antitrust</a>
            </li>
            <li>
              <a href="#title">Title to Property</a>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <div id="acknowledgement">
            <h4>Acknowledgement of Sales Terms and Conditions</h4>
            <span>
              To participate in the GSAAuctions℠ bid process, an individual must
              acknowledge that they have read and accepted ALL terms and
              conditions detailed on this website and indicate that they agree
              by marking the required box during the registration process or
              when prompted to when a change to the terms have been implemented.
              Doing so confirms that a bidder agrees to make a good faith offer.
              If the offer is accepted by the Government a contract between the
              bidder and the Government is formed. As per the contract, the
              bidder agrees to pay for and remove the property by the dates and
              times specified in the notice of award email.{" "}
            </span>
          </div>
          <div id="eligibility">
            <h4>Eligibility of Bidders </h4>
            <span>
              Bidders must be at least 18 years of age. Bidders will be required
              to provide their birth date at registration. A bidder's birth date
              will be used only to verify bidder's eligibility. This information
              is protected by the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                href="https://www.justice.gov/opcl/privacy-act-1974"
                target="_blank"
              >
                Privacy Act, 5 U.S.C 552a.
              </a>{" "}
              In addition, bidders must not be debarred from doing business with
              the Government. GSA will verify that individuals and companies are
              not debarred by checking their information against the bidders
              debarred list which identifies those parties excluded throughout
              the U.S. Government (unless otherwise noted) from receiving
              Federal contracts or certain subcontracts and from certain types
              of Federal financial and non financial assistance and benefits.
              For complete information on parties excluded from doing business
              with the United States Government go to{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                href="https://www.sam.gov/SAM/"
                target="_blank"
              >
                http://www.sam.gov.
              </a>{" "}
              GSA Auctions℠ also adheres to the practices prescribed by The
              Office of Foreign Asset Control (OFAC) of the U.S. Department of
              the Treasury with regards to the Specially Designated Nationals
              and Blocked Persons List (SDN).
            </span>
          </div>
          <div id="sales-to-gov">
            <h4>Sales to Government Employees </h4>
            <span>
              GSA employees or spouse or minor child of GSA employees, or their
              agents, may not bid on Federal personal property. An employee of
              another agency may bid if he/she is not prohibited from doing so
              by his/her employing agency's rules or regulations.
            </span>
          </div>
          <div id="us">
            <h4>U.S. Citizenship </h4>
            <span>
              Bidding is not limited to U.S. citizens exclusively. However due
              to National Security and Export restrictions, some items shall
              only be sold to U.S. Citizens. For more information regarding
              Export Rules see Export Restriction Notice under Special Notes.
            </span>
          </div>
          <div id="bidders">
            <h4>Bidders Indebted to the Government</h4>
            <span>
              The bidder warrants, by accepting the online sale terms and
              conditions and submitting a bid, that he/she is not delinquent in
              paying for previous purchases of Federal personal property and any
              related charges. Indebted bidders will be ineligible for contract
              awards. Bidders will not be able to bid on items specified on this
              website until all debts have been cleared.
            </span>
          </div>
          <div id="registration">
            <h4>Registration</h4>
            <span>Individual and Company Authentication:</span> <br /> <br />
            <span>
              <strong>
                <em>Individuals:</em>
              </strong>{" "}
              GSA Auctions℠ uses Experian's Precise ID for Account Opening (with
              credit card verification and knowledge based questions) to
              authenticate the identity of Individual registrants. To be
              eligible for Experian's identity authentication, individuals must
              have a Social Security Number (SSN) and a U.S. Mailing Address
              (including U.S. territories). No P.O. Box address will be accepted
              unless accompanied by a street address. If you do not have a SSN
              or U.S. Mailing Address, please review the "International
              Registration" section above for the requirements to successfully
              register. <br /> <br />
              Bidders registering as an individual will be asked to "Agree" via
              electronic acceptance to the Fair Credit Reporting Act authorizing
              GSA Auctions℠ to obtain information from the bidder's personal
              credit profile or other information (explained below) from
              Experian. Please be advised that when an identity verification
              request is made by Experian, they may use information in the
              bidder's credit report to verify the identity. As a result,
              bidders may see an entry called a "soft inquiry" on their Experian
              Credit Report. This will show an inquiry by the General Services
              Administration with our address and the date of the request. Soft
              inquiries do not affect credit scores and no charges will be
              incurred related to them. Soft inquiries are displayed in the
              version of the credit profile viewable only to consumers and are
              not reported to lenders. The soft inquiry will generally be
              removed from the credit report after 25 months. Once the identity
              has been verified, no additional soft inquiries will be made when
              using the eAuthentication account unless multiple registration
              attempts are made. <br /> <br />
              Both credit and noncredit information will be used to generate
              knowledge-based questions and verify identities. The categories of
              information being generated by Experian are Biographic,
              Telecommunication, Employer, Education, Financial (including
              credit information received from credit reporting agencies,
              including utilities and loans, but not information on
              foreclosures, tax liens, or bankruptcies), Government Records, and
              Auto. Both financial and utility account checks are done to
              conform to NIST guidelines.
            </span>{" "}
            <br />
            <br />
            <span>
              <strong>
                <em>Companies:</em>
              </strong>{" "}
              GSA Auctions℠ uses Experian's BizID to perform a risk analysis on
              information provided on a business. The data assets utilized for
              the analysis on a business include business name, Employer
              Identification Number (EIN) or the Tax Identification Number (TIN)
              associated with the business address (no P.O. Box address will be
              accepted unless accompanied by a street address), phone, and Tax
              ID assets. <br /> <br />
              It is required that the bidder create and secure their username
              and password. GSA Auctions℠ does not issue usernames nor does it
              provide a temporary password if a bidder has forgotten their log
              in information. Further, bidders shall refrain from creating
              usernames that are considered profane or offensive in nature. If
              such names are discovered or otherwise brought to the attention of
              GSA, the bidder will be contacted and asked to re-register using a
              more appropriate username, and the "offensively named" account
              will be blocked to prevent further use. <br /> <br />
              Bidders are cautioned that they are solely responsible for
              protecting their User ID and password. If a bidder allows any
              other person to use their User ID and password, that bidder will
              be responsible for any contracts awarded to their account. <br />{" "}
              <br />
              Bidders are advised that, on occasion, GSA may use the e-mails
              they provide to GSA Auctions℠ for additional e-mail communication.
              These e-mails give bidders notice of certain sales where such
              bidders have a history of placing bids on similar property.
              Bidders who receive such e-mails will have the option to
              "unsubscribe" and opt out of receiving similar future e-mail
              offers from GSA Auctions℠. <br /> <br />
              GSA will deactivate accounts that have not been active for three
              (3) or more years. Users will not be able to log into an account
              which has been deactivated and will have to register with a new
              account. Users with accounts in "default" will not be able to
              actively bid on auctions until which time their default(s) have
              been satisfied. <br /> <br />
              GSA reserves the right to limit the number of "individual"
              registrant accounts on the GSA Auctions℠ internet website to one
              for each individual. New customers registering as an "individual"
              will only be able to have one unique User ID. Individual
              registrants that have more than one account will be prohibited
              from establishing new accounts unless the old accounts(s) have
              been deactivated. Additionally, GSA may, at its sole discretion,
              deactivate second and subsequent "individual" accounts as it deems
              appropriate.
            </span>
          </div>
          <div id="international">
            <h4>International Registration</h4>
            <span>
              To validate international registrants, both companies and
              individuals registering on GSA Auctions℠ using an international
              address must scan and submit <u>two forms</u> of identification
              (ID) that reflect the registrant's current name and address. The
              ID must include the following:
            </span>
            <ul>
              <li>
                One (1) photo ID that includes your country identification
                number{" "}
                <strong>
                  (photo ID should be the equivalent to a United States driver's
                  license or a Government-issued ID with a current address. A
                  passport is acceptable).
                </strong>{" "}
                <u>
                  Company registrants must submit a photo ID of the person
                  opening the account.
                </u>{" "}
              </li>
              <li>
                A utility bill or a Government issued document that includes the
                individual's full name and address or company's name and
                address.{" "}
              </li>
            </ul>
            <span>
              Documents should be scanned and sent to GSA Central Office at
              registration@gsa.gov and{" "}
              <strong> must include the registrant's chosen user name.</strong>{" "}
              Documentation must be submitted in the English Language and
              include a certified translation if not originally in English.
              Validation is subject to approval by GSA Central Office. All
              payments shall be made in U.S. currency. Bidder is responsible for
              obtaining any necessary Government approvals and shall make any
              arrangements necessary to make such payments.{" "}
              <strong>
                Please NOTE: GSA Auctions℠ does not ship merchandise; bidders or
                their authorized representatives are responsible for timely pick
                up and removal of property.
              </strong>
            </span>
          </div>
          <div id="multi">
            <h4>Multi Factor Authentication </h4>
            <span>
              As part of the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                href="https://obamawhitehouse.archives.gov/the-press-office/2016/02/09/fact-sheet-cybersecurity-national-action-plan"
                target="_blank"
              >
                CyberSecurity National Action Plan
              </a>{" "}
              , the U.S. Government requires all Federal Government websites to
              use Multi-Factor Authentication (MFA) to verify the identity of
              users and prevent unauthorized access. GSA Auctions℠ uses Okta,
              Inc.’s Identity management solution to verify the identity of
              users. GSA Auctions℠ will transition user profiles to Okta. Users
              will be required to establish a profile with Okta (password,
              secret question, secret answer). Once this profile is established,
              users will be able to receive a one time code (OTC) to log in to
              GSAAuctions.gov. <br /> <br />
              Under MFA, a user is granted access to GSAAuctions.gov only after
              presenting two or more credentials (or factors) to an
              authentication mechanism. Users will receive a new OTC each time
              they log in to GSAAuctions.gov and will be required to enter it in
              order to gain access to their account. Initially, the two factors
              will be 1. your password and 2. a one-time code sent to your email
              address. GSA plans to expand the methods to include text message,
              voice, Google Authentication, and Okta Verify, an authentication
              application provided by Okta, Inc. After these new methods are
              implemented, email will only be a valid method for a temporary
              period. <br /> <br />
              GSA Auctions℠ promotes free and open competition. Bidders are
              urged to allow sufficient time to place bids prior to an auction's
              closing date and time. GSA will not be responsible if a bidder
              experiences unique login issues and fails to place a last-minute
              bid. However, if a system-wide outage or an issue affects the
              integrity of the bidding process, GSA may choose to extend or
              re-offer auctions that were impacted.
            </span>
          </div>
          <div id="debt">
            <h4>Debt Collection Improvement Act of 1996 </h4>
            <span>
              In accordance with{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.govinfo.gov/content/pkg/PLAW-104publ134/pdf/PLAW-104publ134.pdf"
              >
                Public Law No. 104-134, Section 31001, The Debt Collection
                Improvement Act of 1996,
              </a>{" "}
              the Tax Identification Number (TIN) must be provided by anyone
              conducting business with the Federal Government, from which a debt
              to the Government may arise.{" "}
              <strong>
                Individuals cannot successfully register to bid on items without
                providing a TIN.
              </strong>{" "}
              A TIN is defined as an individual's Social Security Number (SSN)
              or business entity's Employer Identification Number (EIN). TIN
              validation also assists in the prevention of fraudulent bidding
              activity and ensures that bidders are prepared to accept
              responsibility for their bidding activity and all submitted bids
              are valid.
            </span>
          </div>
          <div id="fraud">
            <h4>Fraud</h4>
            <span>
              Any potential bidder who knowingly provides false statements
              and/or conceal facts in relation to documents required by GSA
              Auctions℠ is subject to prosecution by the Government under{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://uscode.house.gov/view.xhtml?path=/prelim@title18/part1/chapter47&edition=prelim"
              >
                U.S. Code Title 18
              </a>{" "}
              in connection with identification or providing falsifying
              document. IP addresses are documented during the registration
              process and for each bid submitted. GSA Auctions℠ reserves the
              right to monitor and review IP addresses at their discretion.
            </span>
          </div>
          <div id="notification">
            <h4>Notification of Sale Results </h4>
            <span>
              Successful bidders will be notified by e-mail and must contact the
              regional sales office within two (2) business days from the date
              and time the award e-mail notification was sent to make payment.
              Bid results will not be furnished via telephone or fax. It is the
              bidder's responsibility to follow-up on the status of the auction
              and to ensure that the bidder's e-mail address and all
              registration data are kept accurate and up-to-date. If at any
              time, the bidder's information changes, it is the bidder's
              responsibility to update the appropriate information on{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov.
              </a>{" "}
              Warning: If any e-mails are undeliverable and returned due to an
              inaccurate e-mail address, GSA may remove such registrants from
              the database. Undelivered e-mails do not excuse a successful
              bidder's obligation to complete contractual obligations made with
              GSA. These contractual obligations include making timely payments
              and removing awarded property within the time specified. Failure
              to do so, will result in a termination for default. Sales results
              may be obtained by a successful bidder in their personal summary
              after the sale closes.
            </span>
          </div>
          <div id="antitrust">
            <h4>Antitrust</h4>
            <span>
              Some sales may be subject to antitrust law in accordance with{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title40-section559&num=0&edition=prelim"
              >
                40 U.S.C. 559.
              </a>{" "}
              If the high bid meets or exceeds the threshold amount as stated in{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title40-section559&num=0&edition=prelim"
              >
                40 U.S.C. 559 ,
              </a>
              the bid will be subject to review by the U.S. Attorney General
              prior to finalization of award. Therefore, bids are binding and
              GSA Auctions℠ will make an award within 60 days, if not sooner,
              after receipt of the advice of the Attorney General of whether the
              disposition would be inconsistent with antitrust law.
            </span>
          </div>
          <div id="title">
            <h4>Title to Property </h4>
            <span>
              Purchasers of motor vehicles will receive a GSA Form 27A,
              "Purchaser's Receipt and Authority to Release Property," and a
              Standard Form (SF) 97-1, "The United States Government Certificate
              To Obtain Title To A Vehicle." SF 97-1 is not a title; it is
              evidence of title only for authority to obtain title at the
              Department of Motor Vehicles (DMV) to a vehicle by the purchaser.
              Purchasers of property other than motor vehicles will receive only
              the GSA Form 27A. Unless otherwise provided in the Invitation,
              title to the property sold hereunder shall vest in the Purchaser
              as and when removal is effected. Unless provided in the Invitation
              for Bid the Government will be responsible for the care and
              protection of the property subsequent to it being available for
              inspection and prior to removal. Any loss, damage or destruction
              will be adjusted by the Sales Contracting Officer to the extent
              the damage was not caused by the purchaser, their agents or their
              employees. For further directions or information see{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
              >
                Standard Form 114C.
              </a>{" "}
              <br /> <br />
              The Certificate to Obtain Title in no way serves as a waiver for
              payment of registration fees, nor county or State taxes assessed
              to the vehicle, subsequent to its purchase. The Certificate to
              Obtain Title will only be issued after the vehicle is paid for.{" "}
              <br /> <br />
              The Certificate to Obtain Title that accompanies vehicles may
              identify the vehicle as Salvage or Scrap, meaning the vehicle is
              not intended for driving and its condition is poor and/or it is
              not road-worthy in its present condition. These provisions may
              also be applied to certain accident-damaged vehicles. The type of
              title issued will be determined at the discretion of each state's
              Department of Motor Vehicles (DMV). <br /> <br />
              GSA also sells Crash Test Vehicles which will receive a title
              which states: "Not to be Titled for Highway Use." Please note that
              these vehicles are being sold for parts only and are not permitted
              to be repaired for Highway use. Additionally, purchaser's of Crash
              Test Vehicles must agree to never attempt to title these vehicles
              for highway use and to notify any subsequent purchasers of this
              stipulation. <br /> <br />
              Your registration as an individual or business will determine how
              your information is displayed on award documents. Either your name
              and address as an individual, or your name, company name and
              address must be completed as you wish it to appear on all
              subsequent paperwork. You can only select one option to indicate
              registering as an individual or company.{" "}
              <u>Changes will not be permitted after award</u>. If you wish to
              participate as an individual and a representative of a company,
              you must register separately for each and place bids accordingly.
            </span>{" "}
            <br />
            <br />
            <span>
              <strong>Note:</strong> There are times when purchasers
              require/request a duplicate copy of the SF 97. Please be advised
              there may be a fee associated with this request.{" "}
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
