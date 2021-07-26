import React from "react";

export class FederalAssetSalesCenterInfo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          The Federal Asset Sales Initiative (eFAS) is one of the E-Gov
          initiatives established in the President's Management Agenda.
          Beginning in 2007, all agencies will use an approved sales center to
          sell their surplus personal property. Currently, there are two
          approved personal property sales centers that agencies can choose from
          to sell general government surplus property - - General Services
          Administration (GSA) or the United States Department of Agriculture
          (USDA-CEPO) and two sales centers that agencies can use to sell
          forfeited and abandoned property - - Department of Treasury and
          Department of Justice. Agencies will be able to request a waiver from
          the use of a Sales Center, through the Federal Asset Sales Central
          Planning Office once the final rule on Sales of Property, FMR 102-38,
          is published.{" "}
          <a href="https://www.gsa.gov/fedassetsales">
            {" "}
            That regulation will include information about obtaining waivers
          </a>
          .
        </p>
        <ul className="ppms-usa-list">
          <li>GSA (All commodities and locations nationwide)</li>
          <li>
            USDA - CEPO (Limited to property located within the Washington, D.C.
            metropolitan area)
          </li>
          <li>
            DOI/AMD (Limited to aircraft and aircraft parts only. FSG 15 )
          </li>
          <li>
            Dept of Treasury/IRS Vehicle Sales (Limited to passenger vehicles)
          </li>
          <li>
            Approved Waiver (This item is covered by a waiver from GSA OGP and
            is not required to be sold via a Sales Center)
          </li>
          <li>
            Legislative and Judicial Branches ( Not required to use eFas Sales
            Centers)
          </li>
        </ul>
        <p>
          If you select GSA, then when the property item completes GSAXcess
          screening and if no Federal Agency or State selects the property, it
          will be sold through the GSA Sales Center. The system automatically
          presets to be sold by GSA. GSA can sell all commodities in all
          locations nationwide. The Agency Location Code is a mandatory field if
          you select to be Sold by GSA.
        </p>
        <p>
          To be sold by USDA - CEPO, the property must be located in the
          District of Columbia metropolitan area.
        </p>
        <p>
          To be sold by DOI/AMD, the property is limited to aircraft and
          aircraft parts, FSG 15.
        </p>
        <p>
          If you select Approved Waiver, then control of the item will be
          returned to the Agency for disposal or sale. If you have any questions
          about obtaining a waiver, please email the Federal Asset Sales Central
          Planning Office at{" "}
          <a href="mailto:fasplanningoffice@gsa.gov">
            fasplanningoffice@gsa.gov
          </a>
          .
        </p>
        <p>
          To select Legislative and Judicial Branches, your Agency must be a
          Legislative or Judicial branch Agency. These Branches are not required
          to use eFas Sales Centers and at end of screening the control of the
          property will be returned to the Agency.
        </p>
      </React.Fragment>
    );
  }
}
