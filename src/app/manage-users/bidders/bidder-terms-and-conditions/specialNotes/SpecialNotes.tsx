import React from "react";

interface BidderPaymentAndRemovalProps {}

export class SpecialNotes extends React.Component<
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
              <a href="#crashed">Crashed Test Vehicles</a>
            </li>
            <li>
              <a href="#air">Air Pollution Control Devices</a>
            </li>
            <li>
              <a href="#state">State Sales and/or Use Tax</a>
            </li>
            <li>
              <a href="#special">Special Security Notification</a>
            </li>
            <li>
              <a href="#other">Other Special Requirements and Conditions</a>
            </li>
            <li>
              <a href="#export">Export Restriction Notice</a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
              >
                Standard Form (SF) 114C
              </a>
            </li>
            <li>
              <a href="#real">Real ID Act</a>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <div id="crashed">
            <h4>Crashed Test Vehicles</h4>
            <span>
              The United States Department of Transportation, National Highway
              Traffic Safety Administration (NHTSA) purchases and provides
              passenger cars, light trucks and school buses as Government
              Furnished Property to contractors to conduct various compliance
              and experimental crash tests related to motor vehicle safety.
              After completion of testing, GSA sells these vehicles as "not
              repairable for highway use" (used for parts or scrap metal only).
              <br /> <br />
              Purchasers of crashed test vehicles must sign a disclaimer
              statement acknowledging in writing that he/she understands that
              the property is sold for parts or scrap only and is "not
              repairable for highway use (NRHU)"; agrees not to attempt to
              repair the vehicle for highway use; and further agrees to notify
              any subsequent purchaser of this NRHU stipulation. <br /> <br />
              Purchasers of crashed test vehicles will receive a GSA Form 27A,
              "Purchaser's Receipt and Authority to Release Property," and a
              Standard Form (SF) 97, "The United States Government Certificate
              To Obtain Title To A Vehicle" marked with "NOT TO BE TITLED FOR
              HIGHWAY USE" statement. This SF97 is not a title; it is
              certificate to obtain a non-repairable or salvage certificate.
              <br /> <br />
              These provisions may also be applied to certain accident-damaged
              vehicles.
            </span>
          </div>
          <div id="air">
            <h4>Air Pollution Control Devices</h4>
            <span>
              The purchaser of any vehicle from the U.S. Government is
              responsible for having air pollution control devices inspected and
              or installed and obtaining a certificate of compliance from the
              appropriate state registration official.
            </span>
          </div>
          <div id="state">
            <h4>State Sales and/or Use Tax</h4>
            <span>
              Purchasers of Federal personal property may be subject to payment
              of a State sales and/or use tax. The U.S. Government is not
              responsible for collection of State taxes. Purchasers may obtain
              information from a State tax office. Sales and/or use tax
              officials are permitted to examine records of Federal personal
              property sales to determine tax liability.
            </span>
          </div>
          <div id="special">
            <h4>Special Security Notification</h4>
            <span>
              Bidders are warned that the misuse of items to compromise national
              security and/or to create or disseminate biological warfare agents
              is illegal. Further, the re-sale and/or exportation of certain
              technological items to countries subject to trade security
              controls is prohibited as outlined in the "Export Restriction
              Notice" referenced in the
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/html/SpecialRequirements.htm"
              >
                Other Special Requirements and Conditions
              </a>{" "}
              below. Bidders may be subject to prosecution if items are used for
              illegal activity.
            </span>
          </div>
          <div id="other">
            <h4>Other Special Requirements and Conditions</h4>
            <span>
              Please{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/html/SpecialRequirements.htm"
              >
                click here
              </a>{" "}
              to view other special requirements and conditions pertaining to
              property that may be listed in the{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov
              </a>{" "}
              website. <br /> <br />
              Any offering from the U.S. General Services Administration,
              Federal Supply Service's Internet Website,{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                www.GSAAuctions.gov,
              </a>{" "}
              is subject to the Online Sales Terms and Conditions as well as the
              General Sales Terms and Conditions (
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
              >
                Standard Form 114C, April 200
              </a>{" "}
              ). To view pdf files, you need Adobe's Acrobat Reader.{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://get.adobe.com/reader/"
              >
                Download Adobe Reader
              </a>{" "}
              for free, if you do not have it already.
            </span>
          </div>
          <div id="export">
            <h4>Export Restriction Notice</h4>
            <span>
              The use, disposition, export and reexport of any property is
              subject to all applicable U.S. laws and regulations. These
              regulations include restrictions on the export of a particular
              good or technologies, such as (but not limited to) nuclear
              material, chemical and biological equipment, and computer systems,
              as well as total prohibitions of exports to certain countries or
              foreign nationals.
              <br /> <br />
              The Following are provided for your reference: <br /> <br />
              a.{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.bis.doc.gov/index.php/policy-guidance/country-guidance"
              >
                Department of Commerce's (DOC's) "Country Guidance"
              </a>{" "}
              webpage lists parties-of-concern. <br /> <br />
              b. The U.S. Treasury's{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.treasury.gov/resource-center/Pages/default.aspx"
              >
                Office of Foreign Assets Control (OFAC).
              </a>{" "}
              <br /> <br />
              c.{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.epa.gov/laws-regulations/summary-atomic-energy-act"
              >
                Atomic Energy Act of 1954,
              </a>{" "}
              as amended{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://uscode.house.gov/view.xhtml?path=/prelim@title42/chapter23/divisionA&edition=prelim"
              >
                (42 USC 2011 et seq.).
              </a>{" "}
              <br /> <br />
              d. The Arms Export Control Act
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.pmddtc.state.gov/ddtc_public?id=ddtc_kb_article_page&sys_id=b9a933addb7c930044f9ff621f961932"
              >
                (22 USC 2752 et seq.).
              </a>{" "}
              <br /> <br />
              e. International Traffic in Arms Regulations
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://ecfr.io/cgi-bin/text-idx?SID=50186d74f7d875a1c50560869b80abbb&mc=true&node=pt22.1.120&rgn=div5"
              >
                (22 CFR Part 120 et seq.).
              </a>{" "}
              <br /> <br />
              f.{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.bis.doc.gov/index.php/regulations"
              >
                Export Administration Regulations (EAR)
              </a>{" "}
              Please review
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.ecfr.gov/cgi-bin/text-idx?sid=79a0641b2963276ba2c8a1fcc3c1dcd3&c=ecfr&tpl=/ecfrbrowse/Title15/15cfrv2_02.tpl#700http://beta-www.bis.doc.gov/urlmessages/ear_732.html"
              >
                Part 732 of the EAR
              </a>{" "}
              for additional information on how to use the EAR, including the
              Country Chart. <br /> <br />
              g. The Espionage Act
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://uscode.house.gov/view.xhtml?path=/prelim@title18/part1/chapter37&edition=prelim"
              >
                (18 USC 792 et seq.)
              </a>{" "}
              which among other things, prohibit:(a) The making of false
              statement and concealment of any material information regarding
              the use or disposition, export or reexport of the property; and
              (b) Any use or disposition, export or reexport of the property
              which is not authorized in accordance with the provisions of the
              agreement. Successful bidders are responsible for obtaining export
              licenses, as necessary, from the Director, Office of Exporter
              Services, Department of Commerce, 14th Street and Constitution
              Avenue, NW, Washington, DC 20230 or going to:
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.bis.doc.gov/index.php/about-bis"
              >
                https://www.bis.doc.gov/index.php/about-bis.
              </a>{" "}
              <br /> <br />
              h. The Bureau of Politico-Military Affairs, (PM Bureau) provides
              policy direction in the areas of international security, security
              assistance, military operations, defense strategy and plans, and
              defense trade Information on munitions. PM is the Department of
              State's principal link to the Department of Defense
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.state.gov/bureaus-offices/under-secretary-for-arms-control-and-international-security-affairs/bureau-of-political-military-affairs/"
              >
                http://www.state.gov/t/pm.
              </a>{" "}
              <br /> <br />
              i.{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.govinfo.gov/app/details/CFR-1999-title15-vol1"
              >
                Export Administration Regulations (15 C.F.R. 701 et seq.).
              </a>
              <br /> <br />
              j.{" "}
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information"
              >
                Foreign Assets Control Regulations.
              </a>{" "}
              <br /> <br />I recognize that I am subject to the Online Sale
              Terms and Conditions, General Sale Terms and Conditions (
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://www.gsa.gov/forms-library/sale-government-property-general-sale-terms-and-conditions"
              >
                Standard Form 114C, April 2001
              </a>{" "}
              ) and the
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/html/SpecialRequirements.htm"
              >
                Special Requirements and Conditions,
              </a>{" "}
              and that they are applicable to any item offered on the
              <a
                className="usa-link usa-link--external ppms-external-link"
                target="_blank"
                href="https://gsaauctions.gov/gsaauctions/gsaauctions/"
              >
                GSAAuctions.gov
              </a>{" "}
              GSAAuctions.gov website, I offer and agree to purchase the item(s)
              at the price(s) for each item(s) as indicated.
            </span>
          </div>
          <div id="real">
            <h4>Real ID Act </h4>
            <span>
              Access to some federal facilities is now impacted by the Real ID
              Act. When seeking to access some federal facilities and buildings,
              if using a driver's license or state issued identification card as
              identification, it must comply with the requirements of the Real
              ID Act at those locations. Refer to
              www.dhs.gov/real-id-public-faqs for more information on the REAL
              ID Act. Individuals without licenses from compliant jurisdictions
              may present alternative forms of identification - such as a U.S.
              Passport - accepted by the agency. Some agencies may have
              additional processes to accommodate individuals lacking the
              prescribed identification documents. Prior to visiting federal
              facilities, bidders should contact the federal agency property
              custodian listed on the sale to confirm facility entry
              documentation requirements.
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
